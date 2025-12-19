/**
 * Excel file parsing utilities
 * Handles parsing and validation of attendance Excel files
 */

import * as XLSX from 'xlsx';
import { parseExcelDate } from './calculations';

export interface RawAttendanceData {
    employeeName: string;
    date: Date;
    inTime: string | null;
    outTime: string | null;
}

/**
 * Parse Excel file buffer and extract attendance data
 * @param buffer - Excel file buffer
 * @returns Array of raw attendance data
 */
export function parseExcelFile(buffer: Buffer): RawAttendanceData[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const rawData: any[] = XLSX.utils.sheet_to_json(worksheet);

    // Validate and normalize data
    validateExcelStructure(rawData);

    return normalizeAttendanceData(rawData);
}

/**
 * Validate that Excel has required columns
 * @param data - Raw Excel data
 * @throws Error if required columns are missing
 */
export function validateExcelStructure(data: any[]): void {
    if (!data || data.length === 0) {
        throw new Error('Excel file is empty');
    }

    const firstRow = data[0];
    const requiredFields = ['Employee Name', 'Date', 'In-Time', 'Out-Time'];
    const alternateFields = ['employee name', 'date', 'in-time', 'out-time'];

    // Check if any required field is missing (case-insensitive)
    const keys = Object.keys(firstRow).map(k => k.toLowerCase());

    for (let i = 0; i < requiredFields.length; i++) {
        const required = requiredFields[i].toLowerCase();
        const alternate = alternateFields[i];

        if (!keys.includes(required) && !keys.includes(alternate)) {
            throw new Error(`Missing required column: ${requiredFields[i]}`);
        }
    }
}

/**
 * Normalize raw Excel data to structured format
 * @param rawData - Raw Excel data
 * @returns Normalized attendance data
 */
export function normalizeAttendanceData(rawData: any[]): RawAttendanceData[] {
    return rawData.map((row, index) => {
        try {
            // Handle case-insensitive column names
            const getField = (fieldName: string): any => {
                const key = Object.keys(row).find(
                    k => k.toLowerCase() === fieldName.toLowerCase()
                );
                return key ? row[key] : null;
            };

            const employeeName = getField('Employee Name');
            const dateValue = getField('Date');
            const inTime = getField('In-Time');
            const outTime = getField('Out-Time');

            if (!employeeName) {
                throw new Error(`Missing employee name at row ${index + 2}`);
            }

            if (!dateValue) {
                throw new Error(`Missing date at row ${index + 2}`);
            }

            // Parse date
            const date = parseExcelDate(dateValue);

            // Normalize time format (handle various formats)
            const normalizeTime = (time: any): string | null => {
                if (!time || time === '' || time === '-') return null;

                if (typeof time === 'string') {
                    // Remove spaces and convert to HH:MM format
                    const cleaned = time.trim();

                    // If already in HH:MM format
                    if (/^\d{1,2}:\d{2}$/.test(cleaned)) {
                        const [h, m] = cleaned.split(':');
                        return `${h.padStart(2, '0')}:${m}`;
                    }

                    // If in H:MM format
                    if (/^\d:\d{2}$/.test(cleaned)) {
                        return `0${cleaned}`;
                    }
                }

                // Handle Excel time serial number (fraction of a day)
                if (typeof time === 'number' && time < 1) {
                    const totalMinutes = Math.round(time * 24 * 60);
                    const hours = Math.floor(totalMinutes / 60);
                    const minutes = totalMinutes % 60;
                    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                }

                return null;
            };

            return {
                employeeName: String(employeeName).trim(),
                date,
                inTime: normalizeTime(inTime),
                outTime: normalizeTime(outTime),
            };
        } catch (error) {
            throw new Error(`Error parsing row ${index + 2}: ${error}`);
        }
    });
}
