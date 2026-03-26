import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    FileText,
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Download,
    Send,
    DollarSign,
    Calendar,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    Clock,
    ShieldCheck,
    Receipt,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/Components/ui/DropdownMenu';
import { cn } from '@/lib/utils';

export default function Index({ auth, invoices, filters, stats }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'All');

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(route('invoices.index'), { search, status }, {
                preserveState: true,
                replace: true
            });
        }, 300);
        return () => clearTimeout(timer);
    }, [search, status]);

    const getStatusVariant = (status) => {
        const variants = {
            paid: 'success',
            overdue: 'error',
            sent: 'info',
            draft: 'default',
            cancelled: 'default',
        };
        return variants[status] || 'default';
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Tactical Billing Control Center" />

            <div className="space-y-8 pb-12">
                {/* Global Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
                                <Receipt className="text-white" size={20} />
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Fiscal Intelligence
                            </h1>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                            Unified command for automated billing lifecycles and revenue realization.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <a href={route('invoices.export.excel', { search, status: status === 'All' ? '' : status })}>
                            <Button variant="outline" className="h-12 px-6 rounded-2xl bg-white dark:bg-slate-900 border-none shadow-sm font-bold tracking-tight hover:scale-[1.02] transition-all gap-2">
                                <Download size={18} />
                                <span>Export Ledger</span>
                            </Button>
                        </a>
                        <Link href={route('invoices.create')}>
                            <Button className="h-12 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] gap-2">
                                <Plus size={20} strokeWidth={2.5} />
                                <span>Generate Invoice</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Fiscal Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                                    <TrendingUp size={24} />
                                </div>
                                <div className="flex items-center gap-1 text-emerald-600 font-black text-[10px] uppercase">
                                    <ArrowUpRight size={12} />
                                    12%
                                </div>
                            </div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total Billable</h3>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">৳{Number(stats?.total_amount || 0).toLocaleString()}</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 size={24} />
                                </div>
                                <Badge variant="success" className="text-[10px]">Liquid</Badge>
                            </div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Collected</h3>
                            <p className="text-3xl font-black text-emerald-600">৳{Number(stats?.total_paid || 0).toLocaleString()}</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-2xl text-red-600 dark:text-red-400">
                                    <Clock size={24} />
                                </div>
                                <Badge variant="error" className="text-[10px]">Arrears</Badge>
                            </div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Net Exposure</h3>
                            <p className="text-3xl font-black text-red-600">৳{Number(stats?.total_due || 0).toLocaleString()}</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[32px] border-none bg-indigo-600 shadow-sm overflow-hidden">
                        <CardContent className="p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/20 rounded-2xl text-white">
                                    <ShieldCheck size={24} />
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-tighter opacity-70">Efficiency</div>
                            </div>
                            <h3 className="text-sm font-bold opacity-70 uppercase tracking-widest mb-1">Collection Rate</h3>
                            <p className="text-3xl font-black">{stats?.collection_rate || 0}%</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tactical Search & Discovery */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Find fiscal records by invoice ID, partner name, or project link..."
                            className="w-full h-14 pl-14 pr-6 bg-white dark:bg-slate-900 border-none rounded-[24px] shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                        />
                    </div>

                    <div className="flex p-1.5 bg-slate-200 dark:bg-slate-800 rounded-[24px] h-14 overflow-hidden">
                        {['All', 'Paid', 'Sent', 'Overdue', 'Draft'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatus(s)}
                                className={cn(
                                    "px-6 rounded-[18px] text-sm font-bold tracking-tight transition-all",
                                    status === s
                                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm scale-[0.98]"
                                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
                                )}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Ledger Listing */}
                <Card className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Partner Identity</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Monetary Volume</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operational Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {invoices.data.length > 0 ? invoices.data.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center p-2 shadow-sm",
                                                    invoice.status === 'paid' ? "bg-emerald-50 text-emerald-600" :
                                                        invoice.status === 'overdue' ? "bg-red-50 text-red-600" :
                                                            "bg-slate-100 text-slate-400"
                                                )}>
                                                    {invoice.status === 'paid' ? <CheckCircle2 size={18} /> :
                                                        invoice.status === 'overdue' ? <AlertCircle size={18} /> :
                                                            <FileText size={18} />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">{invoice.invoice_number}</p>
                                                    <Badge variant={getStatusVariant(invoice.status)} className="text-[9px] uppercase tracking-widest">
                                                        {invoice.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-black text-xs">
                                                    {invoice.client?.company_name?.charAt(0) || 'P'}
                                                </div>
                                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300 truncate max-w-[180px]">
                                                    {invoice.client?.company_name || 'System Link Pending'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    {new Date(invoice.invoice_date).toLocaleDateString()}
                                                </p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                                    Due: {new Date(invoice.due_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-slate-900 dark:text-white">৳{Number(invoice.total_amount).toLocaleString()}</p>
                                                {invoice.balance > 0 && (
                                                    <p className="text-[10px] font-black text-red-500 uppercase tracking-tighter">
                                                        Remaining: ৳{Number(invoice.balance).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={route('invoices.show', invoice.id)}>
                                                    <Button variant="ghost" className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 p-0 text-slate-500">
                                                        <Eye size={18} />
                                                    </Button>
                                                </Link>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 p-0 text-slate-500">
                                                            <MoreHorizontal size={18} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[180px]">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('invoices.edit', invoice.id)} className="rounded-xl font-bold cursor-pointer gap-2 py-3">
                                                                <Edit size={16} className="text-amber-500" /> Modify Fiscal Record
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl font-bold cursor-pointer gap-2 py-3">
                                                            <Send size={16} className="text-blue-500" /> Dispatch to Partner
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl font-bold cursor-pointer gap-2 py-3 text-red-600 focus:bg-red-50" onClick={() => confirm('Purge this record from ledger?') && router.delete(route('invoices.destroy', invoice.id))}>
                                                            <Trash2 size={16} /> Purge Record
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center gap-6 opacity-40">
                                                <div className="w-24 h-24 rounded-[32px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-6 shadow-inner">
                                                    <Receipt size={48} className="text-slate-300" />
                                                </div>
                                                <div className="max-w-xs">
                                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Ledger Matrix Depleted</h3>
                                                    <p className="text-sm font-medium">Initialize your first billable operation to begin populating fiscal intelligence.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Strategic Pagination */}
                {invoices.links.length > 3 && (
                    <div className="flex items-center justify-center gap-2 pt-8">
                        {invoices.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={cn(
                                    "h-12 min-w-[3rem] px-4 rounded-2xl flex items-center justify-center text-sm font-black transition-all",
                                    link.active
                                        ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-lg"
                                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border-none shadow-sm",
                                    !link.url && "opacity-30 cursor-not-allowed pointer-events-none"
                                )}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </FigmaLayout>
    );
}
