import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseExcelFile, RawAttendanceData } from '@/lib/excelParser';
import {
    calculateWorkedHours,
    getExpectedHours,
    getDayType,
    isLeaveDay,
    calculateProductivity,
    calculateMonthlyExpectedHours
} from '@/lib/calculations';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 1. Parse Excel
        const rawData = parseExcelFile(buffer);

        // 2. Process data and store in DB
        // We'll process them in groups by employee to be more efficient
        const employeeDataMap = new Map<string, RawAttendanceData[]>();
        for (const row of rawData) {
            if (!employeeDataMap.has(row.employeeName)) {
                employeeDataMap.set(row.employeeName, []);
            }
            employeeDataMap.get(row.employeeName)!.push(row);
        }

        const results = [];

        for (const [employeeName, sessions] of employeeDataMap.entries()) {
            // Find or create employee
            let employee = await prisma.employee.findFirst({
                where: { name: employeeName }
            });

            if (!employee) {
                // Generate a simple ID for new employees if not present
                const employeeId = employeeName.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000);
                employee = await prisma.employee.create({
                    data: {
                        name: employeeName,
                        employeeId: employeeId
                    }
                });
            }

            // Process each attendance record
            for (const session of sessions) {
                const date = new Date(session.date);
                date.setHours(0, 0, 0, 0);

                const workedHours = calculateWorkedHours(session.inTime, session.outTime);
                const expectedHours = getExpectedHours(date);
                const dayType = getDayType(date);
                const isLeave = isLeaveDay(session.inTime, session.outTime, date);

                await prisma.attendance.upsert({
                    where: {
                        employeeId_date: {
                            employeeId: employee.id,
                            date: date,
                        }
                    },
                    update: {
                        inTime: session.inTime,
                        outTime: session.outTime,
                        workedHours: workedHours,
                        isLeave: isLeave,
                        dayType: dayType,
                        expectedHours: expectedHours
                    },
                    create: {
                        employeeId: employee.id,
                        date: date,
                        inTime: session.inTime,
                        outTime: session.outTime,
                        workedHours: workedHours,
                        isLeave: isLeave,
                        dayType: dayType,
                        expectedHours: expectedHours
                    }
                });
            }

            // 3. Update Monthly Summaries for affected months
            const activeMonths = new Set<string>();
            for (const session of sessions) {
                const d = new Date(session.date);
                activeMonths.add(`${d.getFullYear()}-${d.getMonth() + 1}`);
            }

            for (const monthKey of activeMonths) {
                const [year, month] = monthKey.split('-').map(Number);

                // Calculate totals for the month
                const startDate = new Date(year, month - 1, 1);
                const endDate = new Date(year, month, 0);

                const monthlyAttendance = await prisma.attendance.findMany({
                    where: {
                        employeeId: employee.id,
                        date: {
                            gte: startDate,
                            lte: endDate
                        }
                    }
                });

                const actualHours = monthlyAttendance.reduce((acc: number, curr: { workedHours: number }) => acc + curr.workedHours, 0);
                const leavesUsed = monthlyAttendance.filter((a: { isLeave: boolean }) => a.isLeave).length;
                const expectedHoursTotal = calculateMonthlyExpectedHours(month, year);
                const productivity = calculateProductivity(actualHours, expectedHoursTotal);

                await prisma.monthlySummary.upsert({
                    where: {
                        employeeId_month_year: {
                            employeeId: employee.id,
                            month: month,
                            year: year
                        }
                    },
                    update: {
                        expectedHours: expectedHoursTotal,
                        actualHours: actualHours,
                        leavesUsed: leavesUsed,
                        productivityPercentage: productivity
                    },
                    create: {
                        employeeId: employee.id,
                        month: month,
                        year: year,
                        expectedHours: expectedHoursTotal,
                        actualHours: actualHours,
                        leavesUsed: leavesUsed,
                        productivityPercentage: productivity
                    }
                });
            }

            results.push({
                employeeName,
                processedRecords: sessions.length
            });
        }

        return NextResponse.json({
            success: true,
            message: 'File processed successfully',
            details: results
        });

    } catch (error: any) {
        console.error('Error processing upload:', error);
        return NextResponse.json({
            error: 'Failed to process file',
            message: error.message
        }, { status: 500 });
    }
}
