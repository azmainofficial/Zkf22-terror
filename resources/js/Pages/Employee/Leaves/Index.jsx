import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ClipboardDocumentCheckIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    CalendarIcon,
    UserIcon
} from '@heroicons/react/24/outline';

const PRIMARY_GREEN = '#22C55E';

export default function Index({ leaves }) {
    return (
        <FigmaLayout>
            <Head title="Leave Management" />

            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">
                            Leave <span style={{ color: PRIMARY_GREEN }}>Intelligence</span>
                        </h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] mt-2 italic">
                            Absence Protocol Monitoring & Management
                        </p>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100/50 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                            <ClockIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pending Requests</p>
                            <p className="text-3xl font-black text-gray-900 tracking-tighter">
                                {leaves.filter(l => l.status === 'pending').length}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100/50 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                            <CheckCircleIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Approved Protocol</p>
                            <p className="text-3xl font-black text-gray-900 tracking-tighter">
                                {leaves.filter(l => l.status === 'approved').length}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100/50 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                            <XCircleIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rejected Sessions</p>
                            <p className="text-3xl font-black text-gray-900 tracking-tighter">
                                {leaves.filter(l => l.status === 'rejected').length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Leaves Table */}
                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100/50 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 italic">Active Absence Registry</h3>
                    </div>
                    <div className="overflow-x-auto p-4 md:p-8">
                        <table className="w-full text-left border-separate border-spacing-y-4">
                            <thead>
                                <tr className="text-gray-400">
                                    <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest italic">Personnel</th>
                                    <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest italic">Classification</th>
                                    <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest italic">Temporal Marker</th>
                                    <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest italic">Status</th>
                                    <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest italic text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.map((leave) => (
                                    <tr key={leave.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                                        <td className="px-6 py-4 bg-white rounded-l-[1.5rem] border-y border-l border-gray-50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold uppercase overflow-hidden border-2 border-white shadow-sm">
                                                    {leave.employee?.name?.charAt(0) || <UserIcon className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 tracking-tight">{leave.employee?.name || 'N/A'}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic leading-none">{leave.employee?.designation || 'Staff Vector'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 bg-white border-y border-gray-50">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 italic">
                                                {leave.leave_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 bg-white border-y border-gray-50 uppercase">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-900">
                                                    <CalendarIcon className="w-3.5 h-3.5 text-[#22C55E]" />
                                                    {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                                                </div>
                                                <p className="text-[9px] font-bold text-gray-400 tracking-widest pl-5 italic">Global Terminal Time</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 bg-white border-y border-gray-50">
                                            <StatusBadge status={leave.status} />
                                        </td>
                                        <td className="px-6 py-4 bg-white rounded-r-[1.5rem] border-y border-r border-gray-50 text-right">
                                            <Link
                                                href={route('employees.show', leave.employee_id)}
                                                className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest ring-offset-2 hover:ring-2 hover:ring-gray-900 transition-all italic active:scale-95"
                                            >
                                                Audit Dossier
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {leaves.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-24 text-center bg-gray-50/30 rounded-[2rem]">
                                            <div className="flex flex-col items-center gap-4 opacity-20">
                                                <ClipboardDocumentCheckIcon className="w-16 h-16" />
                                                <p className="text-sm font-black uppercase tracking-[0.5em] italic">Zero log markers found</p>
                                            </div>
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

function StatusBadge({ status }) {
    const styles = {
        pending: 'bg-amber-50 text-amber-500 border-amber-100',
        approved: 'bg-emerald-50 text-emerald-500 border-emerald-100',
        rejected: 'bg-rose-50 text-rose-500 border-rose-100',
    };

    return (
        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-xl border italic ${styles[status]}`}>
            {status}
        </span>
    );
}
