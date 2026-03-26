import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    Users,
    Search,
    Filter,
    Download,
    Plus,
    CheckCircle2,
    XCircle,
    Clock,
    Printer,
    FileText,
    DollarSign,
    Activity,
    ShieldCheck,
    Zap,
    TrendingUp,
    PieChart,
    Calendar,
    ChevronDown,
    X,
    Loader2
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { cn } from '@/lib/utils';
import Modal from '@/Components/Modal';

// Tactical Status Badge
const StatusBadge = ({ status }) => {
    const styles = {
        paid: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-500/10",
        pending: "bg-amber-50 text-amber-600 border-amber-100 shadow-sm shadow-amber-500/10",
        cancelled: "bg-rose-50 text-rose-600 border-rose-100 shadow-sm shadow-rose-500/10",
    };

    return (
        <span className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border flex items-center gap-2 italic", styles[status] || "bg-slate-50 text-slate-500 border-slate-200")}>
            <div className={cn("w-1.5 h-1.5 rounded-full",
                status === 'paid' ? "bg-emerald-500" : status === 'pending' ? "bg-amber-500" : "bg-rose-500"
            )} />
            {status}
        </span>
    );
};

export default function Index({ auth, payrolls, filters, stats }) {
    const [month, setMonth] = useState(filters.month || new Date().getMonth() + 1);
    const [year, setYear] = useState(filters.year || new Date().getFullYear());
    const [status, setStatus] = useState(filters.status || '');
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [processingGeneration, setProcessingGeneration] = useState(false);

    const handleFilter = () => {
        router.get(route('payroll.index'), { month, year, status }, { preserveState: true });
    };

    const handleGenerate = (e) => {
        e.preventDefault();
        setProcessingGeneration(true);
        router.post(route('payroll.generate'), { month, year }, {
            onSuccess: () => {
                setIsGenerateModalOpen(false);
                setProcessingGeneration(false);
            },
            onError: () => setProcessingGeneration(false)
        });
    };

    const markAsPaid = (id) => {
        if (confirm('Authorize capital disbursement for this employee node?')) {
            router.patch(route('payroll.update', id), { status: 'paid', payment_date: new Date().toISOString().split('T')[0] });
        }
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Payroll Intelligence Center" />

            <div className="space-y-10 pb-32">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[2rem] bg-slate-900 flex items-center justify-center text-white shadow-2xl shadow-slate-200 dark:shadow-none shrink-0 border-4 border-white dark:border-slate-800">
                            <DollarSign size={28} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                                Payroll Intelligence
                            </h1>
                            <div className="flex items-center gap-3">
                                <Activity size={14} className="text-indigo-600 animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic leading-none">Capital Disbursement Control</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href={route('payroll.sheet', { month, year })} target="_blank">
                            <Button variant="ghost" className="h-14 px-8 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black uppercase tracking-widest italic shadow-sm gap-3 transition-all hover:scale-105 active:scale-95 border-2 border-slate-100 dark:border-slate-800">
                                <Printer size={18} />
                                Salary Sheet
                            </Button>
                        </Link>
                        <Button
                            onClick={() => setIsGenerateModalOpen(true)}
                            className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-slate-900 text-white font-black uppercase tracking-widest italic shadow-2xl shadow-indigo-100 dark:shadow-none gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Plus size={20} />
                            Generate Payroll
                        </Button>
                    </div>
                </div>

                {/* Magnitude Pulse Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm p-8 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <TrendingUp size={100} className="text-blue-600" />
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                                <PieChart size={20} />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none italic">Liability magnitude</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic leading-none">
                                    ৳{new Intl.NumberFormat().format(stats.total_salary)}
                                </h3>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm p-8 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <ShieldCheck size={100} className="text-emerald-600" />
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
                                <CheckCircle2 size={20} />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none italic">Realized disbursement</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic leading-none">
                                    ৳{new Intl.NumberFormat().format(stats.paid_salary)}
                                </h3>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-[40px] border-none bg-slate-900 shadow-2xl shadow-slate-200 dark:shadow-none p-8 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <Clock size={100} className="text-white" />
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                                <Activity size={20} />
                            </div>
                            <div className="space-y-0.5 text-white">
                                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none italic">Vector Pending</p>
                                <h3 className="text-3xl font-black tracking-tighter italic leading-none text-indigo-400">
                                    ৳{new Intl.NumberFormat().format(stats.pending_salary)}
                                </h3>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Tactical Filtering & Records */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row items-center gap-4 p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 pl-4">
                                    <Calendar size={12} className="text-indigo-600" />
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Temporal Month</label>
                                </div>
                                <select
                                    value={month}
                                    onChange={e => setMonth(e.target.value)}
                                    className="w-full h-12 px-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-xs uppercase tracking-widest appearance-none focus:ring-4 focus:ring-indigo-600/10 transition-all"
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                        <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('en-US', { month: 'long' }).toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 pl-4">
                                    <Zap size={12} className="text-indigo-600" />
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Temporal Year</label>
                                </div>
                                <select
                                    value={year}
                                    onChange={e => setYear(e.target.value)}
                                    className="w-full h-12 px-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-xs uppercase tracking-widest appearance-none focus:ring-4 focus:ring-indigo-600/10 transition-all"
                                >
                                    {[2024, 2025, 2026, 2027].map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 pl-4">
                                    <Filter size={12} className="text-indigo-600" />
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Disbursement status</label>
                                </div>
                                <select
                                    value={status}
                                    onChange={e => setStatus(e.target.value)}
                                    className="w-full h-12 px-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-xs uppercase tracking-widest appearance-none focus:ring-4 focus:ring-indigo-600/10 transition-all"
                                >
                                    <option value="">ALL VECTORS</option>
                                    <option value="paid">REALIZED (PAID)</option>
                                    <option value="pending">PENDING DISBURSEMENT</option>
                                </select>
                            </div>
                        </div>

                        <Button onClick={handleFilter} className="h-14 px-10 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest italic shadow-xl shadow-slate-200 dark:shadow-none shrink-0 self-end">
                            Sync Filter
                        </Button>
                    </div>

                    {/* Payroll Record Ledger */}
                    <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                            <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Employee node</th>
                                            <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Temporal period</th>
                                            <th className="px-10 py-8 text-right text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Base magnitude</th>
                                            <th className="px-10 py-8 text-right text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Net Vector</th>
                                            <th className="px-10 py-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Status</th>
                                            <th className="px-10 py-8 text-right text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                        {payrolls.data.map((payroll) => (
                                            <tr key={payroll.id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-all duration-300">
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-black text-xs uppercase border-2 border-white dark:border-slate-700 shadow-sm group-hover:scale-110 transition-transform">
                                                            {payroll.employee.first_name[0]}{payroll.employee.last_name[0]}
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <p className="font-black text-slate-900 dark:text-white uppercase italic tracking-tight">{payroll.employee.first_name} {payroll.employee.last_name}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 tracking-widest">{payroll.employee.employee_id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase italic tracking-widest leading-none">
                                                            {new Date(0, payroll.month - 1).toLocaleString('en-US', { month: 'long' }).toUpperCase()}
                                                        </p>
                                                        <span className="text-[10px] text-slate-300 font-bold">{payroll.year}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <p className="text-sm font-black text-slate-900 dark:text-white italic tracking-tighter leading-none">
                                                        ৳{parseFloat(payroll.base_salary).toLocaleString()}
                                                    </p>
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <div className="space-y-1">
                                                        <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 italic tracking-tighter leading-none">
                                                            ৳{parseFloat(payroll.total).toLocaleString()}
                                                        </p>
                                                        <div className="flex items-center justify-end gap-2">
                                                            <span className="text-[8px] font-black text-emerald-500 uppercase">+{parseFloat(payroll.bonus)}</span>
                                                            <span className="text-[8px] font-black text-rose-500 uppercase">-{parseFloat(payroll.deductions)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6">
                                                    <div className="flex justify-center">
                                                        <StatusBadge status={payroll.status} />
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        {payroll.status === 'pending' ? (
                                                            <Button
                                                                onClick={() => markAsPaid(payroll.id)}
                                                                className="h-10 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest italic shadow-lg shadow-emerald-500/10 gap-2 transition-all active:scale-95"
                                                            >
                                                                <CheckCircle2 size={14} />
                                                                Authorize
                                                            </Button>
                                                        ) : (
                                                            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-300 pointer-events-none">
                                                                <ShieldCheck size={18} />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {payrolls.data.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="px-10 py-24 text-center">
                                                    <div className="flex flex-col items-center gap-4 opacity-20">
                                                        <Package size={64} className="text-slate-400" />
                                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 italic">No payroll nodes found for this period</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    {payrolls.links.length > 3 && (
                        <div className="flex justify-center gap-2 pb-10">
                            {payrolls.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={cn(
                                        "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        link.active
                                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl"
                                            : "bg-white dark:bg-slate-900 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-slate-50 dark:border-slate-800",
                                        !link.url && "opacity-20 cursor-not-allowed pointer-events-none"
                                    )}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Generation Protocol Modal */}
            <Modal show={isGenerateModalOpen} onClose={() => !processingGeneration && setIsGenerateModalOpen(false)} maxWidth="lg">
                <div className="p-10 md:p-14 space-y-10 bg-white dark:bg-slate-900 rounded-[3rem] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />
                    <button
                        onClick={() => setIsGenerateModalOpen(false)}
                        className="absolute top-8 right-8 w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                                <Zap size={20} />
                            </div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Initialize Payroll Protocol</h3>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">System will synthesize payroll nodes for all active employee entities within the specified temporal period.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Temporal Month</label>
                            <select
                                value={month}
                                onChange={e => setMonth(e.target.value)}
                                className="w-full h-16 px-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-black text-sm uppercase tracking-widest appearance-none focus:ring-4 focus:ring-indigo-600/10 transition-all text-slate-900 dark:text-white shadow-inner"
                            >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                    <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('en-US', { month: 'long' }).toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Temporal Year</label>
                            <select
                                value={year}
                                onChange={e => setYear(e.target.value)}
                                className="w-full h-16 px-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-black text-sm uppercase tracking-widest appearance-none focus:ring-4 focus:ring-indigo-600/10 transition-all text-slate-900 dark:text-white shadow-inner"
                            >
                                {[2024, 2025, 2026, 2027].map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <Button
                            onClick={handleGenerate}
                            disabled={processingGeneration}
                            className="flex-1 h-20 rounded-[2.2rem] bg-indigo-600 hover:bg-slate-900 text-white font-black text-xl italic tracking-tighter shadow-2xl shadow-indigo-100 dark:shadow-none gap-4 transition-all"
                        >
                            {processingGeneration ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    <ShieldCheck size={28} />
                                    <span>COMMENCE SYNTHESIS</span>
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="flex items-center gap-3 justify-center py-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2rem]">
                        <Activity size={14} className="text-indigo-500 animate-pulse" />
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 italic">Verifying employee integrity nodes</p>
                    </div>
                </div>
            </Modal>
        </FigmaLayout>
    );
}

