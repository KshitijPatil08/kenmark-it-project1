const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

/**
 * Generate sample attendance data for the current month
 */
function generateData() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed (0=Jan, 11=Dec)
    
    // Get number of days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const employees = [
        { name: 'Jane Smith', productivity: 0.95 },
        { name: 'John Doe', productivity: 0.82 },
        { name: 'Robert Johnson', productivity: 0.88 },
        { name: 'Emily Davis', productivity: 0.92 }
    ];
    
    const data = [];
    
    for (const employee of employees) {
        // Each employee has a different set of leave days
        const leaveDays = [];
        const numLeaves = Math.floor(Math.random() * 3) + 1; // 1-3 leaves
        while (leaveDays.length < numLeaves) {
            const day = Math.floor(Math.random() * 20) + 1; // Skip weekends or end of month for simplicity
            if (!leaveDays.includes(day)) leaveDays.push(day);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat
            
            // Format date as YYYY-MM-DD
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            if (dayOfWeek === 0) {
                // Sunday - usually no work, don't even add to list or add with empty times
                continue; 
            }
            
            if (leaveDays.includes(day)) {
                // Leave day
                data.push({
                    'Employee Name': employee.name,
                    'Date': dateStr,
                    'In-Time': '',
                    'Out-Time': ''
                });
                continue;
            }
            
            // Work day
            let inTime, outTime;
            
            if (dayOfWeek === 6) {
                // Saturday - Half day (usually 4 hours)
                // Randomize a bit around 10:00 to 14:00
                const inHour = 10;
                const inMin = Math.floor(Math.random() * 15);
                const outHour = 14;
                const outMin = Math.floor(Math.random() * 15);
                
                inTime = `${String(inHour).padStart(2, '0')}:${String(inMin).padStart(2, '0')}`;
                outTime = `${String(outHour).padStart(2, '0')}:${String(outMin).padStart(2, '0')}`;
            } else {
                // Weekday - Full day (usually 8.5 hours)
                // Randomize based on productivity
                const inHour = 9 + Math.floor(Math.random() * 2); // 9 or 10
                const inMin = Math.floor(Math.random() * 30);
                
                // Calculate out time based on 8.5 hours + some randomness
                const workMinutes = Math.floor(8.5 * 60 * employee.productivity) + Math.floor(Math.random() * 60);
                const totalMinutes = (inHour * 60 + inMin) + workMinutes;
                
                const outHour = Math.floor(totalMinutes / 60);
                const outMin = totalMinutes % 60;
                
                inTime = `${String(inHour).padStart(2, '0')}:${String(inMin).padStart(2, '0')}`;
                outTime = `${String(outHour).padStart(2, '0')}:${String(outMin).padStart(2, '0')}`;
            }
            
            data.push({
                'Employee Name': employee.name,
                'Date': dateStr,
                'In-Time': inTime,
                'Out-Time': outTime
            });
        }
    }
    
    return data;
}

const data = generateData();
const ws = XLSX.utils.json_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Attendance');

const filePath = path.join(__dirname, 'sample-attendance.xlsx');
XLSX.writeFile(wb, filePath);

console.log(`Sample Excel file created at: ${filePath}`);
console.log(`Generated records for ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`);
console.log(`Total records: ${data.length}`);
