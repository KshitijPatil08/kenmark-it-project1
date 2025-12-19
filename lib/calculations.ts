/**
 * Business logic calculations for Leave & Productivity Analyzer
 * Handles working hours, leave detection, and productivity metrics
 */

/**
 * Calculate worked hours between in-time and out-time
 * @param inTime - Format: "HH:MM" (e.g., "10:00")
 * @param outTime - Format: "HH:MM" (e.g., "18:30")
 * @returns Number of hours worked
 */
export function calculateWorkedHours(inTime: string | null, outTime: string | null): number {
    if (!inTime || !outTime) return 0;

    try {
        const [inHour, inMinute] = inTime.split(':').map(Number);
        const [outHour, outMinute] = outTime.split(':').map(Number);

        const inMinutes = inHour * 60 + inMinute;
        const outMinutes = outHour * 60 + outMinute;

        const workedMinutes = outMinutes - inMinutes;
        return workedMinutes / 60;
    } catch (error) {
        console.error('Error calculating worked hours:', error);
        return 0;
    }
}

/**
 * Get expected working hours for a given date
 * @param date - Date object
 * @returns Expected hours: 8.5 (Mon-Fri), 4 (Sat), 0 (Sun)
 */
export function getExpectedHours(date: Date): number {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

    if (dayOfWeek === 0) {
        // Sunday
        return 0;
    } else if (dayOfWeek === 6) {
        // Saturday
        return 4;
    } else {
        // Monday to Friday
        return 8.5;
    }
}

/**
 * Get day type for a given date
 * @param date - Date object
 * @returns "weekday", "saturday", or "sunday"
 */
export function getDayType(date: Date): string {
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 0) return 'sunday';
    if (dayOfWeek === 6) return 'saturday';
    return 'weekday';
}

/**
 * Calculate total expected hours for a month
 * @param month - Month (1-12)
 * @param year - Year (e.g., 2024)
 * @returns Total expected working hours for the month
 */
export function calculateMonthlyExpectedHours(month: number, year: number): number {
    const daysInMonth = new Date(year, month, 0).getDate();
    let totalExpectedHours = 0;

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        totalExpectedHours += getExpectedHours(date);
    }

    return totalExpectedHours;
}

/**
 * Calculate productivity percentage
 * @param actualHours - Actual hours worked
 * @param expectedHours - Expected hours
 * @returns Productivity percentage (0-100+)
 */
export function calculateProductivity(actualHours: number, expectedHours: number): number {
    if (expectedHours === 0) return 0;
    return Math.round((actualHours / expectedHours) * 100 * 100) / 100; // Round to 2 decimal places
}

/**
 * Check if a day is a leave day
 * @param inTime - In-time string or null
 * @param outTime - Out-time string or null
 * @param date - Date object
 * @returns true if it's a leave day (missing attendance on working day)
 */
export function isLeaveDay(inTime: string | null, outTime: string | null, date: Date): boolean {
    const expectedHours = getExpectedHours(date);

    // If it's a non-working day (Sunday), it's not a leave
    if (expectedHours === 0) return false;

    // If attendance is missing on a working day, it's a leave
    return !inTime || !outTime;
}

/**
 * Format date to YYYY-MM-DD string
 * @param date - Date object
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Parse date from Excel serial number or date string
 * @param value - Excel date value (serial number or string)
 * @returns Date object
 */
export function parseExcelDate(value: any): Date {
    if (value instanceof Date) {
        return value;
    }

    if (typeof value === 'number') {
        // Excel serial date number
        const excelEpoch = new Date(1899, 11, 30);
        return new Date(excelEpoch.getTime() + value * 86400000);
    }

    if (typeof value === 'string') {
        // Try parsing as string
        const parsed = new Date(value);
        if (!isNaN(parsed.getTime())) {
            return parsed;
        }
    }

    throw new Error(`Invalid date value: ${value}`);
}
