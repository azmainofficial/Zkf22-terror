import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    CalendarIcon,
    UserCircleIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationCircleIcon,
    FingerPrintIcon,
    BoltIcon
} from '@heroicons/react/24/outline';

export default function AttendanceSheet({ sheetData, filters }) {
    const [isLiveMode, setIsLiveMode] = useState(false);
    const { data, setData, get } = useForm({
        date: filters.date || new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        let interval;
        if (isLiveMode) {
            interval = setInterval(() => {
                router.reload({ only: ['sheetData'], preserveScroll: true });
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isLiveMode]);

    const handleFilter = (e) => {
        if (e) e.preventDefault();
        get(route('attendance.sheet'), { preserveState: true });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Present': return 'text-emerald-600 bg-emerald-50';
            case 'Late': return 'text-rose-600 bg-rose-50';
            case 'Absent': return 'text-gray-400 bg-gray-50';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <FigmaLayout>
            <Head title="Daily Punch Sheet" />

            <div className="max-w-6xl mx-auto space-y-6 py-4">
                {/* Minimal Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Daily Punch Sheet</h1>
                        <p className="text-sm text-gray-400 font-medium">Detailed log of all employee punches for {new Date(data.date).toLocaleDateString([], { dateStyle: 'long' })}.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setIsLiveMode(!isLiveMode)}
                            className={`flex items-center px-4 py-2 rounded-xl text-xs font-black transition-all border ${isLiveMode
                                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-100'
                                    : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <BoltIcon className={`w-4 h-4 mr-2 ${isLiveMode ? 'animate-pulse' : ''}`} />
                            {isLiveMode ? 'LIVE MODE ON' : 'GO LIVE'}
                        </button>
                        <input
                            type="date"
                            value={data.date}
                            onChange={e => { setData('date', e.target.value); }}
                            className="border border-gray-200 rounded-xl py-2 px-4 text-sm font-semibold focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] outline-none transition-all"
                        />
                        <button
                            onClick={() => handleFilter()}
                            className="px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-sm"
                        >
                            Sync Now
                        </button>
                    </div>
                </div>

                {/* Minimal Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Employee</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Punch Sequence (In/Out)</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Hours</th>
                                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {sheetData.map((item) => (
                                <tr key={item.employee.id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                                                {item.employee.first_name.charAt(0)}{item.employee.last_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{item.employee.first_name} {item.employee.last_name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">ID: {item.employee.employee_id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {item.punches.length > 0 ? (
                                                item.punches.map((time, idx) => (
                                                    <div key={idx} className="flex items-center">
                                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black border ${idx % 2 === 0
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                            : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                                            }`}>
                                                            {idx % 2 === 0 ? 'IN' : 'OUT'} {time.substring(0, 5)}
                                                        </span>
                                                        {idx < item.punches.length - 1 && (
                                                            <div className="w-2 h-[1px] bg-gray-200 mx-1" />
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-xs font-medium text-gray-300 italic">No activity recorded</span>
                                            )}
                                            {!item.last_out && item.punches.length > 0 && item.punches.length % 2 !== 0 && (
                                                <span className="ml-2 inline-flex items-center px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-[9px] font-black uppercase border border-amber-100">
                                                    <span className="w-1 h-1 bg-amber-500 rounded-full mr-1 animate-pulse" />
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-bold ${item.total_hours > 0 ? 'text-gray-900' : 'text-gray-300'}`}>
                                                {item.total_hours} <span className="text-[10px] font-medium text-gray-400">Hours</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {item.punches.length === 0 ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-gray-50 text-gray-400 border border-gray-100">
                                                ABSENT
                                            </span>
                                        ) : (
                                            item.punches.length % 2 !== 0 ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-white shadow-sm shadow-emerald-100">
                                                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 animate-pulse" />
                                                    CLOCKED IN
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white shadow-sm">
                                                    CLOCKED OUT
                                                </span>
                                            )
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end space-x-6 px-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded bg-emerald-100 border border-emerald-200" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Input</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded bg-indigo-100 border border-indigo-200" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Output</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded bg-amber-200" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Currently In</span>
                    </div>
                </div>
            </div>
        </FigmaLayout>
    );
}
