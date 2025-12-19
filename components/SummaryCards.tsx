import React from 'react';

interface SummaryCardsProps {
    expectedHours: number;
    actualHours: number;
    leavesUsed: number;
    productivity: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
    expectedHours,
    actualHours,
    leavesUsed,
    productivity
}) => {
    const getProductivityColor = (value: number) => {
        if (value >= 90) return 'text-green-600';
        if (value >= 75) return 'text-blue-600';
        if (value >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const cards = [
        {
            title: 'Expected Hours',
            value: expectedHours.toFixed(1),
            unit: 'hrs',
            icon: (
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-blue-50'
        },
        {
            title: 'Actual Worked',
            value: actualHours.toFixed(1),
            unit: 'hrs',
            icon: (
                <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-indigo-50'
        },
        {
            title: 'Leaves Used',
            value: leavesUsed,
            unit: '/ 2',
            icon: (
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            color: 'bg-orange-50',
            valueColor: leavesUsed > 2 ? 'text-red-600' : 'text-slate-800'
        },
        {
            title: 'Productivity',
            value: productivity.toFixed(1),
            unit: '%',
            icon: (
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            color: 'bg-green-50',
            valueColor: getProductivityColor(productivity)
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className={`${card.color} p-3 rounded-lg`}>
                        {card.icon}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">{card.title}</p>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-2xl font-bold ${card.valueColor || 'text-slate-800'}`}>{card.value}</span>
                            <span className="text-sm text-slate-400 font-medium">{card.unit}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
