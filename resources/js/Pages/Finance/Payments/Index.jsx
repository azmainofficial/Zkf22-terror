import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    CreditCard,
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar,
    Download,
    Printer,
    FileText,
    Activity,
    Layers,
    ChevronDown,
    Zap,
    TrendingUp,
    Briefcase,
    Building,
    History,
    ExternalLink
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Card, CardContent } from '@/Components/ui/Card';
import { cn } from '@/lib/utils';

export default function Index({ auth, payments, filters, total_incoming, total_outgoing }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [type, setType] = useState(filters.payment_type || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('payments.index'), {
            search,
            status,
            payment_type: type
        }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Permanently redact this transaction record from the fiscal ledger?')) {
            router.delete(route('payments.destroy', id));
        }
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('');
        setType('');
        router.get(route('payments.index'));
    };

    const netBalance = (total_incoming || 0) - (total_outgoing || 0);

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Fiscal Transaction Ledger" />

            <div className="space-y-10 pb-32">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                            Fiscal Ledger
                        </h1>
                        <div className="flex items-center gap-2">
                            <Activity size={12} className="text-indigo-600" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none italic">Omni-Channel Capital Management</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <a href={route('payments.export.excel', { search, status, payment_type: type })} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-100 dark:border-slate-800 font-black text-[10px] uppercase tracking-widest gap-2 bg-white dark:bg-slate-900 hover:bg-slate-50 transition-all">
                                <Download size={16} /> DATA EXPORT
                            </Button>
                        </a>
                        <Link href={route('payments.create')}>
                            <Button className="h-14 px-8 rounded-[1.8rem] bg-indigo-600 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-widest gap-3 shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-105 active:scale-95">
                                <Plus size={20} />
                                Record Transaction
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Capital Pulse Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden group">
                        <CardContent className="p-8 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
                                    <ArrowDownLeft size={20} />
                                </div>
                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] uppercase tracking-widest px-2 py-0.5">INCOMING</Badge>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">Gross Capital Intake</p>
                                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic mt-2">৳{new Intl.NumberFormat().format(total_incoming || 0)}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden group">
                        <CardContent className="p-8 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 transition-transform group-hover:scale-110">
                                    <ArrowUpRight size={20} />
                                </div>
                                <Badge className="bg-rose-50 text-rose-600 border-none font-black text-[8px] uppercase tracking-widest px-2 py-0.5">OUTGOING</Badge>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">Operational Expenditure</p>
                                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic mt-2">৳{new Intl.NumberFormat().format(total_outgoing || 0)}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[40px] border-none bg-indigo-600 shadow-2xl shadow-indigo-100 dark:shadow-none overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none -rotate-12 translate-x-4 -translate-y-4">
                            <TrendingUp size={120} className="text-white" />
                        </div>
                        <CardContent className="p-8 space-y-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white transition-transform group-hover:scale-110">
                                    <CreditCard size={20} />
                                </div>
                                <Zap size={16} className={cn("text-white animate-pulse", netBalance < 0 && "text-rose-300")} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 leading-none font-medium text-blue-100">Net Fiscal Magnitude</p>
                                <p className="text-3xl font-black text-white tracking-tighter italic mt-2">৳{new Intl.NumberFormat().format(netBalance)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Intelligence Filtering Pipeline */}
                <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden no-print">
                    <CardContent className="p-4 md:p-6">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                            <div className="lg:col-span-5 relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
                                    <Search size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by Transaction ID, Entity, or Project..."
                                    className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-sm text-slate-600 dark:text-slate-300 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-600/10 transition-all shadow-inner"
                                />
                            </div>

                            <div className="lg:col-span-7 flex flex-wrap items-center gap-3">
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="h-16 px-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-300 focus:ring-4 focus:ring-indigo-600/10 shadow-inner appearance-none min-w-[140px]"
                                >
                                    <option value="">All Vectors</option>
                                    <option value="incoming">Incoming</option>
                                    <option value="outgoing">Outgoing</option>
                                </select>

                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="h-16 px-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-300 focus:ring-4 focus:ring-indigo-600/10 shadow-inner appearance-none min-w-[140px]"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                </select>

                                <Button type="submit" className="h-16 w-16 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white flex-shrink-0 hover:bg-slate-800 transition-all">
                                    <Filter size={20} />
                                </Button>

                                {(search || status || type) && (
                                    <Button type="button" onClick={clearFilters} variant="ghost" className="h-16 px-6 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-rose-600">
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Transaction Ledger Table */}
                <Card className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Transaction Intelligence</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Entity Node</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">Capital Magnitude</th>
                                    <th className="px-8 py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Vector</th>
                                    <th className="px-8 py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Readiness</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tactical Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {payments.data.map((transaction) => (
                                    <tr key={`${transaction.source}-${transaction.id}`} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all duration-300">
                                        <td className="px-8 py-8">
                                            <div className="space-y-2">
                                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight italic group-hover:text-indigo-600 transition-colors">
                                                    {transaction.transaction_number}
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest border-none">
                                                        <Calendar size={10} />
                                                        {new Date(transaction.date).toLocaleDateString()}
                                                    </div>
                                                    <Badge className={cn(
                                                        "px-2 py-0.5 rounded-md font-black text-[8px] uppercase tracking-widest border-none",
                                                        transaction.source === 'expense' ? "bg-rose-50 text-rose-600" : "bg-indigo-50 text-indigo-600"
                                                    )}>
                                                        {transaction.source === 'expense' ? 'EXPENSE' : 'REVENUE'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                    {transaction.source === 'payment'
                                                        ? (transaction.client?.company_name || transaction.client?.name || transaction.notes || 'Unidentified Node')
                                                        : (transaction.category?.name || 'General Magnitude')
                                                    }
                                                </p>
                                                {transaction.project && (
                                                    <div className="flex items-center gap-1.5 text-indigo-500">
                                                        <Briefcase size={10} />
                                                        <span className="text-[10px] font-black uppercase tracking-tighter italic">{transaction.project.title}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter italic">
                                                ৳{new Intl.NumberFormat().format(transaction.amount)}
                                            </p>
                                        </td>
                                        <td className="px-8 py-8 text-center">
                                            <div className="flex justify-center">
                                                {transaction.type === 'incoming' ? (
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 border border-emerald-100 dark:border-emerald-800/50">
                                                        <ArrowDownLeft size={16} />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 border border-rose-100 dark:border-rose-800/50">
                                                        <ArrowUpRight size={16} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-center">
                                            <div className="flex justify-center">
                                                <Badge className={cn(
                                                    "px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-[0.2em] border-none shadow-sm",
                                                    (transaction.status === 'completed' || transaction.status === 'paid' || transaction.status === 'approved')
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : transaction.status === 'pending'
                                                            ? "bg-amber-50 text-amber-600"
                                                            : "bg-rose-50 text-rose-600"
                                                )}>
                                                    {transaction.status}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-all no-print">
                                                {transaction.source === 'payment' ? (
                                                    <>
                                                        <a href={route('payments.show', transaction.id) + '?print=true'} target="_blank" rel="noopener noreferrer">
                                                            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm text-slate-400 hover:text-indigo-600 border border-slate-100 dark:border-slate-800">
                                                                <Printer size={16} />
                                                            </Button>
                                                        </a>
                                                        <Link href={route('payments.show', transaction.id)}>
                                                            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm text-slate-400 hover:text-indigo-600 border border-slate-100 dark:border-slate-800">
                                                                <Eye size={16} />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('payments.edit', transaction.id)}>
                                                            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm text-slate-400 hover:text-indigo-600 border border-slate-100 dark:border-slate-800">
                                                                <Edit size={16} />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(transaction.id)}
                                                            className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 hover:bg-rose-100 border border-rose-100 dark:border-rose-900/50"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Link href={route('expenses.show', transaction.id)}>
                                                            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm text-slate-400 hover:text-indigo-600 border border-slate-100 dark:border-slate-800">
                                                                <Eye size={16} />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('expenses.edit', transaction.id)}>
                                                            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm text-slate-400 hover:text-indigo-600 border border-slate-100 dark:border-slate-800">
                                                                <Edit size={16} />
                                                            </Button>
                                                        </Link>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {payments.data.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-24 text-center space-y-4">
                                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200">
                                                <History size={40} />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">No transaction resonance detected in local ledger.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* High-Fidelity Pagination */}
                    {payments.links.length > 3 && (
                        <div className="px-8 py-10 flex items-center justify-between border-t border-slate-50 dark:divide-slate-800 no-print">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                Page Segment {payments.current_page} of {payments.last_page} • Total Magnitude {payments.total}
                            </p>
                            <div className="flex items-center gap-2">
                                {payments.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={cn(
                                            "h-10 min-w-[2.5rem] px-3 flex items-center justify-center rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                                            link.active
                                                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg"
                                                : "bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm border border-slate-50 dark:border-slate-800",
                                            !link.url && "opacity-30 pointer-events-none"
                                        )}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </FigmaLayout>
    );
}
