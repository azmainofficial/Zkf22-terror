import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ChartBarIcon,
    CheckCircleIcon,
    ArrowTrendingUpIcon,
    UserIcon,
    CalendarIcon,
    StarIcon
} from '@heroicons/react/24/outline';

const PRIMARY_GREEN = '#22C55E';

export default function Index({ reviews }) {
    return (
        <FigmaLayout>
            <Head title="Performance Analytics" />

            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">
                            Performance <span style={{ color: PRIMARY_GREEN }}>Analytics</span>
                        </h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] mt-2 italic">
                            Personnel Execution & Strategic Alignment
                        </p>
                    </div>
                </div>

                {/* Overview Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100/50 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <StarIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mean Rating</p>
                            <p className="text-3xl font-black text-gray-900 tracking-tighter">
                                {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100/50 col-span-1 md:col-span-3 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                            <ChartBarIcon className="w-32 h-32" />
                        </div>
                        <div className="flex flex-col justify-between h-full">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Global KPI Velocity</p>
                                <p className="text-4xl font-black text-gray-900 tracking-tighter mt-2 italic">
                                    {reviews.length > 0 ? Math.round(reviews.reduce((acc, r) => acc + (r.kpi_score || 0), 0) / reviews.length) : '0'}%
                                </p>
                            </div>
                            <div className="mt-6 w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-[#22C55E] transition-all duration-1000"
                                    style={{ width: `${reviews.length > 0 ? reviews.reduce((acc, r) => acc + (r.kpi_score || 0), 0) / reviews.length : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Registry */}
                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100/50 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 italic">Audit Sessions Log</h3>
                    </div>
                    <div className="overflow-x-auto p-4 md:p-8">
                        <table className="w-full text-left border-separate border-spacing-y-4">
                            <thead>
                                <tr className="text-gray-400">
                                    <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest italic">Subject</th>
                                    <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest italic">Magnitude</th>
                                    <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest italic text-center">Velocity</th>
                                    <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest italic">Temporal</th>
                                    <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest italic text-right">Dossier</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map((review) => (
                                    <tr key={review.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                                        <td className="px-6 py-4 bg-white rounded-l-[1.5rem] border-y border-l border-gray-50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold uppercase overflow-hidden border-2 border-white shadow-sm">
                                                    {review.employee?.name?.charAt(0) || <UserIcon className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 tracking-tight">{review.employee?.name || 'N/A'}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic leading-none">Review by {review.reviewer?.name || 'System'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 bg-white border-y border-gray-50">
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map(v => (
                                                    <StarIcon
                                                        key={v}
                                                        className={`w-3.5 h-3.5 ${v <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 bg-white border-y border-gray-50 text-center">
                                            <span className="text-xs font-black text-gray-900 italic">{review.kpi_score}%</span>
                                        </td>
                                        <td className="px-6 py-4 bg-white border-y border-gray-50 uppercase">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-900">
                                                <CalendarIcon className="w-3.5 h-3.5 text-indigo-500" />
                                                {new Date(review.review_date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 bg-white rounded-r-[1.5rem] border-y border-r border-gray-50 text-right">
                                            <Link
                                                href={route('employees.show', review.employee_id)}
                                                className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest ring-offset-2 hover:ring-2 hover:ring-gray-900 transition-all italic active:scale-95"
                                            >
                                                Analysis
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {reviews.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-24 text-center bg-gray-50/30 rounded-[2rem]">
                                            <div className="flex flex-col items-center gap-4 opacity-20">
                                                <ChartBarIcon className="w-16 h-16" />
                                                <p className="text-sm font-black uppercase tracking-[0.5em] italic">No analytics benchmarks found</p>
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
