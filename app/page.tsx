'use client';

import React, { useState, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import SummaryCards from '@/components/SummaryCards';
import AttendanceTable from '@/components/AttendanceTable';

interface Employee {
  id: string;
  name: string;
  employeeId: string;
}

interface MonthlySummary {
  expectedHours: number;
  actualHours: number;
  leavesUsed: number;
  productivityPercentage: number;
}

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const [summary, setSummary] = useState<MonthlySummary>({
    expectedHours: 0,
    actualHours: 0,
    leavesUsed: 0,
    productivityPercentage: 0
  });

  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch data when employee or month/year changes
  useEffect(() => {
    if (selectedEmployeeId) {
      fetchDashboardData();
    }
  }, [selectedEmployeeId, selectedMonth, selectedYear]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees');
      if (!res.ok) {
        const text = await res.text();
        console.error(`API Error (${res.status}):`, text.slice(0, 500));
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setEmployees(data);
        if (data.length > 0 && !selectedEmployeeId) {
          setSelectedEmployeeId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Network Error fetching employees:', err);
    }
  };

  const fetchDashboardData = async () => {
    if (!selectedEmployeeId) return;
    setLoading(true);
    try {
      // Fetch summary
      const summaryRes = await fetch(`/api/summary?employeeId=${selectedEmployeeId}&month=${selectedMonth}&year=${selectedYear}`);
      if (!summaryRes.ok) {
        throw new Error(`Summary API Error: ${summaryRes.status}`);
      }
      const summaryData = await summaryRes.json();
      setSummary(summaryData);

      // Fetch attendance
      const attendanceRes = await fetch(`/api/attendance?employeeId=${selectedEmployeeId}&month=${selectedMonth}&year=${selectedYear}`);
      if (!attendanceRes.ok) {
        throw new Error(`Attendance API Error: ${attendanceRes.status}`);
      }
      const attendanceData = await attendanceRes.json();
      setAttendance(attendanceData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i);

  return (
    <main className="min-h-screen bg-slate-50 pb-12 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900">
              Attendance Analytics
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full hidden sm:inline border border-blue-100 uppercase tracking-tighter">Pro Suite</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border border-slate-300 shadow-inner"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column: controls and upload */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            <FileUpload onUploadSuccess={() => {
              fetchEmployees();
              if (selectedEmployeeId) fetchDashboardData();
            }} />

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                View Analysis
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-500 mb-1.5 ml-1 uppercase tracking-wider text-[10px]">Select Employee</label>
                  <select
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select an employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-1.5 ml-1 uppercase tracking-wider text-[10px]">Month</label>
                    <div className="relative">
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 text-slate-800 outline-none focus:border-blue-500 transition-all font-semibold appearance-none cursor-pointer"
                      >
                        {months.map((name, idx) => (
                          <option key={name} value={idx + 1}>{name}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-1.5 ml-1 uppercase tracking-wider text-[10px]">Year</label>
                    <div className="relative">
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 text-slate-800 outline-none focus:border-blue-500 transition-all font-semibold appearance-none cursor-pointer"
                      >
                        {years.map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-xl border border-slate-700 hidden lg:block overflow-hidden relative group">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
              <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4 relative z-10">Business Metrics</h3>
              <ul className="space-y-3 text-sm text-slate-300 relative z-10">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">8.5h <span className="text-slate-500 ml-1">Weekday Standard</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">4.0h <span className="text-slate-500 ml-1">Saturday Protocol</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">2.0 <span className="text-slate-500 ml-1">Monthly Leave Cap</span></span>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>System Health</span>
                  <span className="text-green-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: analytics display */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {!selectedEmployeeId ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center h-full min-h-[350px] sm:min-h-[500px] group hover:border-blue-200 transition-colors duration-500">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6 group-hover:bg-blue-50 group-hover:text-blue-200 transition-all duration-500 group-hover:rotate-6">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">System Idle</h2>
                <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
                  Start by uploading an Excel attendance sheet or select a team member to access deep productivity insights for {months[selectedMonth - 1]} {selectedYear}.
                </p>
                <div className="mt-8 flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                </div>
              </div>
            ) : (
              <div className={`transition-all duration-500 ${loading ? 'translate-y-4 opacity-70 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {employees.find(e => e.id === selectedEmployeeId)?.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase border border-slate-200">
                        Employee ID: {employees.find(e => e.id === selectedEmployeeId)?.employeeId}
                      </span>
                      <span className="text-slate-300">•</span>
                      <p className="text-slate-500 font-semibold text-sm">Performance Analysis: {months[selectedMonth - 1]} {selectedYear}</p>
                    </div>
                  </div>
                  {loading && (
                    <div className="flex items-center gap-3 bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-blue-200 animate-pulse">
                      <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Syncing Data
                    </div>
                  )}
                </div>

                <SummaryCards
                  expectedHours={summary.expectedHours}
                  actualHours={summary.actualHours}
                  leavesUsed={summary.leavesUsed}
                  productivity={summary.productivityPercentage}
                />

                <div className="mt-8">
                  <AttendanceTable records={attendance} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
