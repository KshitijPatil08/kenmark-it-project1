import React from 'react';

interface AttendanceRecord {
    id: string;
    date: string;
    inTime: string | null;
    outTime: string | null;
    workedHours: number;
    isLeave: boolean;
    dayType: string;
    expectedHours: number;
}

interface AttendanceTableProps {
    records: AttendanceRecord[];
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ records }) => {
    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getStatusBadge = (record: AttendanceRecord) => {
        if (record.isLeave) {
            return (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold uppercase">
                    Leave
                </span>
            );
        }

        if (record.dayType === 'sunday') {
            return (
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs font-semibold uppercase">
                    Off Day
                </span>
            );
        }

        if (record.workedHours >= record.expectedHours) {
            return (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold uppercase">
                    Present
                </span>
            );
        }

        return (
            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold uppercase">
                Partial
            </span>
        );
    };

    if (records.length === 0) {
        return (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-100 text-slate-500">
                No attendance records found for the selected period.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">Daily Attendance Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold">In Time</th>
                            <th className="px-6 py-4 font-semibold">Out Time</th>
                            <th className="px-6 py-4 font-semibold">Worked</th>
                            <th className="px-6 py-4 font-semibold">Expected</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {records.map((record) => (
                            <tr key={record.id} className={`${record.dayType === 'sunday' ? 'bg-slate-50/30' : 'hover:bg-slate-50/50'} transition-colors`}>
                                <td className="px-6 py-4 font-medium text-slate-800">
                                    {formatDate(record.date)}
                                    {record.dayType === 'saturday' && <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-1 rounded">Half Day</span>}
                                </td>
                                <td className="px-6 py-4 text-slate-600">{record.inTime || '--:--'}</td>
                                <td className="px-6 py-4 text-slate-600">{record.outTime || '--:--'}</td>
                                <td className="px-6 py-4 font-semibold text-slate-800">
                                    {record.workedHours.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">hrs</span>
                                </td>
                                <td className="px-6 py-4 text-slate-400">
                                    {record.expectedHours.toFixed(1)} <span className="text-[10px]">hrs</span>
                                </td>
                                <td className="px-6 py-4">{getStatusBadge(record)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceTable;
