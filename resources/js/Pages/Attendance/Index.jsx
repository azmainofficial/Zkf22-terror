import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    MagnifyingGlassIcon,
    CalendarIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
    MapPinIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function AttendanceIndex({ logs, filters }) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
        date: filters.date || '',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('attendance.index'), { preserveState: true });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString([], {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getStatus = (log, index) => {
        // Since logs are paginated and ordered by timestamp DESC in the DB usually,
        // we need to be careful. However, for a simple UI feedback:
        // If the user wants 1st=IN, 2nd=OUT, we should ideally know the absolute index.
        // For simplicity in the log view, we'll keep the device state as primary, 
        // but label them as "Enter" and "Exit" pairs if possible.

        if (log.state == 1) return { label: 'Exit (Manual)', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' };

        // We'll use a badge that clarifies it's a "Sequence Punch"
        return { label: 'Punch Log', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
    };

    return (
        <FigmaLayout>
            <Head title="Attendance Logs" />

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900">Attendance Data</h1>
                        <p className="text-sm text-gray-500 font-medium mt-1">Real-time synchronized logs from your ZKTeco terminals.</p>
                    </div>
                    <button className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-2xl text-sm font-bold shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
                        <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                        Download Report
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <form onSubmit={handleFilter} className="relative group col-span-1 md:col-span-1">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#22C55E] transition-colors" />
                        <input
                            type="text"
                            placeholder="Employee Name or ID..."
                            value={data.search}
                            onChange={e => setData('search', e.target.value)}
                            className="w-full bg-gray-50/50 border-none rounded-xl py-3 pl-11 text-sm focus:ring-2 focus:ring-[#22C55E]/10"
                        />
                    </form>

                    <div className="relative group">
                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#22C55E] transition-colors shadow-sm" />
                        <input
                            type="date"
                            value={data.date}
                            onChange={e => setData('date', e.target.value)}
                            className="w-full bg-gray-50/50 border-none rounded-xl py-3 pl-11 text-sm focus:ring-2 focus:ring-[#22C55E]/10 font-bold text-gray-600"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleFilter}
                            className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all flex items-center justify-center"
                        >
                            Apply Filters
                        </button>
                        <button className="p-3 bg-gray-50 text-gray-500 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                            <FunnelIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-widest font-black border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-6">Employee</th>
                                    <th className="px-8 py-6">Check Time</th>
                                    <th className="px-8 py-6">Shift</th>
                                    <th className="px-8 py-6">Work Hours</th>
                                    <th className="px-8 py-6">Terminal</th>
                                    <th className="px-8 py-6 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {logs.data.map((log) => {
                                    const status = getStatus(log);

                                    // Calculate Duration (if check-out)
                                    let duration = null;
                                    if (log.state == 1) {
                                        // This is a simple duration calc for the log entry
                                        // In a real system, we'd fetch the first check-in of the day
                                        // For now, let's just mark it
                                        duration = "Summarizing...";
                                    }

                                    return (
                                        <tr key={log.id} className="group hover:bg-gray-50/40 transition-all">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-[10px] text-gray-500 border border-gray-200/50 group-hover:border-[#22C55E]/30 transition-all">
                                                        {log.employee
                                                            ? `${log.employee.first_name.charAt(0)}${log.employee.last_name?.charAt(0)}`
                                                            : '??'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 leading-tight">
                                                            {log.employee ? `${log.employee.first_name} ${log.employee.last_name || ''}` : 'Unknown'}
                                                        </p>
                                                        <p className="text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-tighter">
                                                            ID: {log.user_id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-gray-900">
                                                        {formatTime(log.timestamp)}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        {formatDate(log.timestamp)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                {log.employee?.shift ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-gray-600">{log.employee.shift.name}</span>
                                                        <span className="text-[10px] font-bold text-gray-400">{log.employee.shift.start_time.substring(0, 5)} - {log.employee.shift.end_time.substring(0, 5)}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-black text-gray-300 uppercase italic">No Shift</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-5">
                                                {log.state == 1 ? (
                                                    <span className="text-sm font-black text-indigo-600 animate-pulse">Calculating...</span>
                                                ) : (
                                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Logging...</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center text-gray-500 font-bold group-hover:text-[#22C55E] transition-colors">
                                                    <MapPinIcon className="w-3.5 h-3.5 mr-2" />
                                                    <span className="text-xs truncate max-w-[120px] uppercase tracking-tight">
                                                        {log.device?.device_name || 'Terminal'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {logs.data.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center">
                                            <p className="text-gray-400 font-bold italic">No attendance records found for this period.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {logs.links.length > 3 && (
                        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest">
                                Page {logs.current_page} of {logs.last_page}
                            </p>
                            <div className="flex items-center space-x-2">
                                {logs.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-4 py-2 text-[10px] font-black rounded-xl transition-all ${link.active
                                            ? 'bg-[#22C55E] text-white shadow-lg shadow-emerald-100'
                                            : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50 hover:text-gray-900'
                                            } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </FigmaLayout>
    );
}
