const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Sample data for January 2024
const data = [
    { 'Employee Name': 'John Doe', 'Date': '2024-01-01', 'In-Time': '10:00', 'Out-Time': '18:30' },
    { 'Employee Name': 'John Doe', 'Date': '2024-01-02', 'In-Time': '10:15', 'Out-Time': '18:45' },
    { 'Employee Name': 'John Doe', 'Date': '2024-01-03', 'In-Time': '', 'Out-Time': '' }, // Leave
    { 'Employee Name': 'John Doe', 'Date': '2024-01-04', 'In-Time': '10:00', 'Out-Time': '18:30' },
    { 'Employee Name': 'John Doe', 'Date': '2024-01-05', 'In-Time': '09:55', 'Out-Time': '18:35' },
    { 'Employee Name': 'John Doe', 'Date': '2024-01-06', 'In-Time': '10:00', 'Out-Time': '14:00' }, // Saturday (4h)
    { 'Employee Name': 'John Doe', 'Date': '2024-01-08', 'In-Time': '10:05', 'Out-Time': '18:30' },
    { 'Employee Name': 'John Doe', 'Date': '2024-01-09', 'In-Time': '10:00', 'Out-Time': '19:00' },
    { 'Employee Name': 'John Doe', 'Date': '2024-01-10', 'In-Time': '', 'Out-Time': '' }, // Leave
    { 'Employee Name': 'John Doe', 'Date': '2024-01-11', 'In-Time': '10:30', 'Out-Time': '18:30' },

    { 'Employee Name': 'Jane Smith', 'Date': '2024-01-01', 'In-Time': '10:00', 'Out-Time': '18:30' },
    { 'Employee Name': 'Jane Smith', 'Date': '2024-01-02', 'In-Time': '10:00', 'Out-Time': '18:30' },
    { 'Employee Name': 'Jane Smith', 'Date': '2024-01-03', 'In-Time': '10:00', 'Out-Time': '18:30' },
    { 'Employee Name': 'Jane Smith', 'Date': '2024-01-04', 'In-Time': '10:00', 'Out-Time': '18:30' },
    { 'Employee Name': 'Jane Smith', 'Date': '2024-01-05', 'In-Time': '10:00', 'Out-Time': '18:30' },
    { 'Employee Name': 'Jane Smith', 'Date': '2024-01-06', 'In-Time': '10:00', 'Out-Time': '14:00' },
];

const ws = XLSX.utils.json_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Attendance');

const filePath = path.join(__dirname, 'sample-attendance.xlsx');
XLSX.writeFile(wb, filePath);

console.log(`Sample Excel file created at: ${filePath}`);
