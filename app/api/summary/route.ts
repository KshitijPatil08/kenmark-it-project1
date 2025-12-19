import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const employeeId = searchParams.get('employeeId');
        const month = searchParams.get('month');
        const year = searchParams.get('year');

        if (!employeeId || !month || !year) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const summary = await prisma.monthlySummary.findUnique({
            where: {
                employeeId_month_year: {
                    employeeId: employeeId,
                    month: parseInt(month),
                    year: parseInt(year)
                }
            }
        });

        if (!summary) {
            return NextResponse.json({
                expectedHours: 0,
                actualHours: 0,
                leavesUsed: 0,
                productivityPercentage: 0
            });
        }

        return NextResponse.json(summary);
    } catch (error: any) {
        console.error('Error fetching summary:', error);
        return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 });
    }
}
