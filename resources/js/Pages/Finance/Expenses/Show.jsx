import React from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Printer,
    Wallet,
    Calendar,
    Tag,
    Briefcase,
    FileText,
    Receipt,
    Download,
    CheckCircle2,
    XCircle,
    Clock,
    User,
    ShieldCheck,
    Truck,
    Box,
    ChevronLeft,
    ExternalLink,
    PieChart,
    Activity,
    DollarSign,
    Building2,
    Zap,
    History
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import { cn } from '@/lib/utils';

export default function Show({ auth, expense }) {
    const handleDelete = () => {
        if (confirm('Decommission this expenditure record from the corporate ledger?')) {
            router.delete(route('expenses.destroy', expense.id));
        }
    };

    const handleApprove = () => {
        if (confirm('Authorize this expenditure and commit to financial history?')) {
            router.post(route('expenses.approve', expense.id));
        }
    };

    const handleReject = () => {
        const reason = prompt('Specify rejection rationale for audit audit trail:');
        if (reason) {
            router.post(route('expenses.reject', expense.id), { approval_notes: reason });
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 2,
        }).format(amount).replace('BDT', '৳');
    };

    const statusConfig = {
        approved: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2, label: 'AUTHORIZED' },
        paid: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: ShieldCheck, label: 'SETTLED' },
        rejected: { color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: XCircle, label: 'REJECTED' },
        pending: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock, label: 'PENDING AUDIT' },
    };

    const config = statusConfig[expense.status] || statusConfig.pending;

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Expenditure Dossier - ${expense.expense_number}`} />

            <div className="space-y-10 pb-32">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
                    <div className="flex items-center gap-6">
                        <Link href={route('expenses.index')}>
                            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:scale-105 transition-all">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                                Expense Dossier
                            </h1>
                            <div className="flex items-center gap-2">
                                <History size={12} className="text-indigo-600" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none italic">Record: {expense.expense_number}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => window.print()}
                            className="h-12 px-6 rounded-2xl border-none bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 font-black text-[10px] uppercase tracking-widest gap-2"
                        >
                            <Printer size={16} /> PRINT MANIFEST
                        </Button>
                        <Link href={route('expenses.edit', expense.id)}>
                            <Button
                                className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-indigo-100 dark:shadow-none"
                            >
                                <Edit size={16} /> REFINE LOG
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Main Synthesis Panel */}
                    <div className="lg:col-span-8 space-y-10">
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-14 opacity-5 pointer-events-none rotate-12">
                                <Wallet size={240} className="text-indigo-600" />
                            </div>

                            <CardContent className="p-10 md:p-14 space-y-12 relative z-10">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-slate-50 dark:border-slate-800">
                                    <div className="space-y-6">
                                        <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-100 dark:shadow-none">
                                            <Wallet size={36} />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">{expense.title}</h2>
                                            <div className="flex items-center gap-3">
                                                <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-black text-[9px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border-none">
                                                    {expense.category?.name || 'Uncategorized'}
                                                </Badge>
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logged: {new Date(expense.expense_date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-left md:text-right space-y-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Capital Magnitude</p>
                                        <p className="text-6xl font-black text-indigo-600 tracking-tighter italic">{formatCurrency(expense.amount)}</p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 pl-2 mb-2">
                                        <div className="w-2 h-8 rounded-full bg-indigo-600" />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Strategic Analysis</h3>
                                    </div>
                                    <div className="p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                            <FileText size={120} />
                                        </div>
                                        <p className="text-lg font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic relative z-10">
                                            {expense.description || 'No descriptive technical brief provided for this outflow event.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                <Building2 size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Counterparty Entity</p>
                                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight italic">{expense.vendor_name || 'Anonymous Supplier'}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                <Box size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mission Correlation</p>
                                                <p className="text-sm font-black text-indigo-600 uppercase tracking-tight italic">{expense.project?.title || 'Core Infrastructure'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                <CreditCard size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Settlement Protocol</p>
                                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight italic">{expense.payment_method?.replace('_', ' ') || 'Petty Cash'}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                <ShieldCheck size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ledger Entry Type</p>
                                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Operational Outflow</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Fiscal Command Lateral */}
                    <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-8 no-print">
                        {/* Audit Status Card */}
                        <Card className={cn(
                            "rounded-[44px] border-none shadow-2xl p-10 space-y-8 relative overflow-hidden",
                            expense.status === 'approved' ? "bg-emerald-500 shadow-emerald-100" :
                                expense.status === 'paid' ? "bg-indigo-600 shadow-indigo-100" :
                                    expense.status === 'rejected' ? "bg-rose-500 shadow-rose-100" :
                                        "bg-amber-500 shadow-amber-100"
                        )}>
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none -rotate-12 translate-x-8 -translate-y-8">
                                <config.icon size={160} className="text-white" />
                            </div>

                            <div className="space-y-8 relative z-10 text-white">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Current Audit State</p>
                                    <div className="flex items-center gap-4">
                                        <config.icon size={32} />
                                        <h4 className="text-3xl font-black italic tracking-tighter">{config.label}</h4>
                                    </div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 space-y-6">
                                    {expense.status === 'pending' ? (
                                        <div className="space-y-4">
                                            <Button
                                                onClick={handleApprove}
                                                className="w-full h-14 bg-white text-emerald-600 hover:bg-emerald-50 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl border-none"
                                            >
                                                AUTHORIZE LOG
                                            </Button>
                                            <Button
                                                onClick={handleReject}
                                                variant="ghost"
                                                className="w-full h-12 text-white hover:bg-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-white/20"
                                            >
                                                REJECT PROTOCOL
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4 px-2 py-2 bg-white/5 rounded-2xl border border-white/10">
                                            <ShieldCheck size={18} className="text-white/40" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Audit Terminal Verified</p>
                                        </div>
                                    )}

                                    {expense.is_reimbursable && (
                                        <div className="flex items-center gap-4 px-4 py-3 bg-white/20 rounded-2xl border border-white/20 shadow-inner">
                                            <Zap size={16} className="text-amber-300 animate-pulse" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white italic">Reimbursable Asset</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Digitized Evidence */}
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 p-10 space-y-8 shadow-sm group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                                        <Receipt size={18} />
                                    </div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white italic">Artifact Proof</h4>
                                </div>
                                {expense.receipt && (
                                    <a href={`/storage/${expense.receipt}`} target="_blank" className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 hover:scale-110 transition-transform">
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>

                            {expense.receipt ? (
                                <div className="relative group/receipt rounded-[2rem] overflow-hidden border-2 border-slate-50 dark:border-slate-800 aspect-[4/3] bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center gap-4 hover:border-indigo-100 transition-all cursor-pointer">
                                    <div className="w-20 h-20 rounded-3xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-slate-200 group-hover/receipt:scale-110 group-hover/receipt:text-indigo-600 transition-all">
                                        <FileCheck size={40} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 italic">Reference Secured</p>
                                        <p className="text-[9px] font-bold text-slate-300 uppercase truncate px-4">SHA-256: {expense.receipt.split('/').pop().substring(0, 16)}...</p>
                                    </div>
                                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/receipt:opacity-100 transition-opacity flex items-center justify-center">
                                        <a href={`/storage/${expense.receipt}`} target="_blank" className="bg-white text-slate-950 h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all">
                                            <Download size={18} /> Download Proof
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-14 border-4 border-dashed border-slate-50 dark:border-slate-800 rounded-[2.5rem] text-center">
                                    <XCircle size={36} className="mx-auto text-slate-100 mb-4" />
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] italic leading-relaxed">Proof Artifact Missing<br />from Digital Manifest</p>
                                </div>
                            )}
                        </Card>

                        {/* Risk Metric / System Log */}
                        <div className="space-y-4 pt-4">
                            <div className="p-8 rounded-[2.5rem] bg-slate-950 text-white space-y-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                    <Activity size={48} className="text-indigo-500 animate-pulse" />
                                </div>
                                <div className="space-y-1 relative z-10">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">System Registry Hash</p>
                                    <p className="text-xs font-mono font-black text-indigo-400 group-hover:text-white transition-colors">OMS-EXP-{expense.expense_number}</p>
                                </div>
                                <Button
                                    onClick={handleDelete}
                                    variant="ghost"
                                    className="w-full h-14 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-white/5 hover:border-rose-500/30 transition-all gap-4"
                                >
                                    <Trash2 size={16} /> DECOMMISSION RECORD
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; padding: 0 !important; color: black !important; }
                    .FigmaLayout { margin: 0 !important; padding: 0 !important; }
                    .Card { border: 2px solid #f1f5f9 !important; box-shadow: none !important; margin-bottom: 2rem !important; }
                    .bg-indigo-600 { color: black !important; background: #f8fafc !important; border: 2px solid #e2e8f0 !important; }
                    .text-indigo-600 { color: black !important; }
                    .shadow-2xl, .shadow-lg, .shadow-sm { box-shadow: none !important; }
                }
            `}} />
        </FigmaLayout>
    );
}
