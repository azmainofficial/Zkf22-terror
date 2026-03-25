import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    CalendarDaysIcon,
    ArrowDownTrayIcon,
    UserGroupIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';

export default function AttendanceReport({ reportData, filters, months }) {
    const { data, setData, get } = useForm({
        month: filters.month || new Date().getMonth() + 1,
        year: filters.year || new Date().getFullYear(),
    });

    const years = [2024, 2025, 2026];

    const handleFilter = (e) => {
        if (e) e.preventDefault();
        get(route('attendance.report'), { preserveState: true });
    };

    const stats = {
        totalPresent: reportData.reduce((acc, curr) => acc + curr.days_present, 0),
        totalLate: reportData.reduce((acc, curr) => acc + curr.late_count, 0),
        avgHours: reportData.length > 0
            ? (reportData.reduce((acc, curr) => acc + curr.total_hours, 0) / reportData.length).toFixed(1)
            : 0
    };

    return (
        <FigmaLayout>
            <Head title="Attendance Report" />

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900">Attendance Report</h1>
                        <p className="text-sm text-gray-500 font-medium mt-1">Monthly summary of work hours and punctuality.</p>
                    </div>
                    <button className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-2xl text-sm font-bold shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
                        <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                        Export PDF
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="relative group">
                            <CalendarDaysIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#22C55E] transition-colors" />
                            <select
                                value={data.month}
                                onChange={e => { setData('month', e.target.value); }}
                                className="w-full bg-gray-50/50 border-none rounded-xl py-3 pl-11 text-sm focus:ring-2 focus:ring-[#22C55E]/10 font-bold text-gray-700"
                            >
                                {months.map(m => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative group">
                            <CalendarDaysIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#22C55E] transition-colors" />
                            <select
                                value={data.year}
                                onChange={e => { setData('year', e.target.value); }}
                                className="w-full bg-gray-50/50 border-none rounded-xl py-3 pl-11 text-sm focus:ring-2 focus:ring-[#22C55E]/10 font-bold text-gray-700"
                            >
                                {years.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleFilter}
                        className="w-full md:w-auto px-10 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                    >
                        Generate Report
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-emerald-50/50 p-8 rounded-[32px] border border-emerald-100 relative overflow-hidden group hover:scale-[1.02] transition-all">
                        <UserGroupIcon className="absolute right-[-20px] bottom-[-20px] w-40 h-40 text-emerald-500/10 rotate-12" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Total Presence</p>
                        <h4 className="text-4xl font-black text-emerald-900">{stats.totalPresent} <span className="text-lg font-bold text-emerald-600/50 italic ml-1">Days</span></h4>
                    </div>
                    <div className="bg-rose-50/50 p-8 rounded-[32px] border border-rose-100 relative overflow-hidden group hover:scale-[1.02] transition-all">
                        <ExclamationTriangleIcon className="absolute right-[-20px] bottom-[-20px] w-40 h-40 text-rose-500/10 rotate-12" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-rose-600 mb-2">Punctuality Score (Lates)</p>
                        <h4 className="text-4xl font-black text-rose-900">{stats.totalLate} <span className="text-lg font-bold text-rose-600/50 italic ml-1">Occurrences</span></h4>
                    </div>
                    <div className="bg-[#111827] p-8 rounded-[32px] relative overflow-hidden group hover:scale-[1.02] transition-all shadow-xl shadow-gray-200">
                        <ClockIcon className="absolute right-[-20px] bottom-[-20px] w-40 h-40 text-white/5 rotate-12" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Avg. Working Hours</p>
                        <h4 className="text-4xl font-black text-white">{stats.avgHours} <span className="text-lg font-bold text-gray-500 italic ml-1">Hrs/User</span></h4>
                    </div>
                </div>

                {/* Report Table */}
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-widest font-black border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-6">Employee</th>
                                    <th className="px-8 py-6">Days Present</th>
                                    <th className="px-8 py-6">Late Count</th>
                                    <th className="px-8 py-6">Total Productive Hours</th>
                                    <th className="px-8 py-6 text-right">Activity Level</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {reportData.map((item) => (
                                    <tr key={item.user_id} className="group hover:bg-gray-50/40 transition-all">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-[10px] text-gray-500 border border-gray-200/50 group-hover:border-[#22C55E]/30 transition-all">
                                                    {item.employee
                                                        ? `${item.employee.first_name.charAt(0)}${item.employee.last_name?.charAt(0)}`
                                                        : '??'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 leading-tight">
                                                        {item.employee ? `${item.employee.first_name} ${item.employee.last_name || ''}` : 'Unknown'}
                                                    </p>
                                                    <p className="text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-tighter">
                                                        ID: {item.user_id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-black text-gray-700">{item.days_present} Days</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${item.late_count > 3 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                                {item.late_count} Lates
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-black text-gray-900">{item.total_hours}h</span>
                                                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#22C55E] rounded-full transition-all duration-1000"
                                                        style={{ width: `${Math.min((item.total_hours / 160) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className="text-xs font-bold text-gray-400 italic">
                                                {item.total_hours > 100 ? '🔥 High' : '⭐ Normal'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {reportData.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold italic">
                                            No data available for the selected period.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </FigmaLayout>
    );
}
