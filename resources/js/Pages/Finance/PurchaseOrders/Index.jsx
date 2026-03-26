import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Search,
    Filter,
    Plus,
    Truck,
    Calendar,
    ArrowRight,
    Building2,
    DollarSign,
    CheckCircle2,
    XCircle,
    Clock,
    Activity,
    Package,
    ArrowUpRight,
    ArrowDownLeft,
    TrendingUp,
    Zap,
    Briefcase,
    Building,
    ExternalLink,
    ChevronDown,
    Trash2,
    Edit as EditIcon,
    History,
    FileText
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Card, CardContent } from '@/Components/ui/Card';
import { cn } from '@/lib/utils';

export default function Index({ auth, orders, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'All');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('purchase-orders.index'), { search, status }, { preserveState: true, replace: true });
    };

    const handleStatusFilter = (s) => {
        setStatus(s);
        router.get(route('purchase-orders.index'), { search, status: s }, { preserveState: true, replace: true });
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Procurement Intelligence" />

            <div className="space-y-10 pb-32">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                            Procurement
                        </h1>
                        <div className="flex items-center gap-2">
                            <Activity size={12} className="text-indigo-600" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none italic">Supply Chain Realization Ledger</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={route('purchase-orders.create')}>
                            <Button className="h-14 px-8 rounded-[1.8rem] bg-indigo-600 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-widest gap-3 shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-105 active:scale-95">
                                <Plus size={20} />
                                Initialize Order
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Procurement Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {['Draft', 'Ordered', 'Received', 'Cancelled'].map((stat) => {
                        const count = orders.data.filter(o => o.status === stat.toLowerCase()).length;
                        return (
                            <Card key={stat} className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden group hover:scale-105 transition-all cursor-pointer" onClick={() => handleStatusFilter(stat)}>
                                <CardContent className="p-8 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                                            stat === 'Draft' ? "bg-slate-50 text-slate-400" :
                                                stat === 'Ordered' ? "bg-indigo-50 text-indigo-600" :
                                                    stat === 'Received' ? "bg-emerald-50 text-emerald-600" :
                                                        "bg-rose-50 text-rose-600"
                                        )}>
                                            {stat === 'Draft' ? <FileText size={20} /> :
                                                stat === 'Ordered' ? <Clock size={20} /> :
                                                    stat === 'Received' ? <CheckCircle2 size={20} /> :
                                                        <XCircle size={20} />}
                                        </div>
                                        <Badge className={cn(
                                            "border-none font-black text-[8px] uppercase tracking-widest px-2 py-0.5",
                                            stat === 'Draft' ? "bg-slate-50 text-slate-400" :
                                                stat === 'Ordered' ? "bg-indigo-50 text-indigo-600" :
                                                    stat === 'Received' ? "bg-emerald-50 text-emerald-600" :
                                                        "bg-rose-50 text-rose-600"
                                        )}>{stat.toUpperCase()}</Badge>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">{stat} Vector</p>
                                        <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic mt-2">{count}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Tactical Filtering Pipeline */}
                <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden no-print">
                    <CardContent className="p-4 md:p-6">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                            <div className="lg:col-span-8 relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
                                    <Search size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by PO Number, Supplier, or Resource Node..."
                                    className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-sm text-slate-600 dark:text-slate-300 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-600/10 transition-all shadow-inner"
                                />
                            </div>

                            <div className="lg:col-span-4 flex items-center gap-3">
                                <select
                                    value={status}
                                    onChange={(e) => handleStatusFilter(e.target.value)}
                                    className="h-16 px-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-300 focus:ring-4 focus:ring-indigo-600/10 shadow-inner appearance-none w-full"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Draft">Draft</option>
                                    <option value="Ordered">Ordered</option>
                                    <option value="Received">Received</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>

                                <Button type="submit" className="h-16 w-16 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white flex-shrink-0 hover:bg-slate-800 transition-all">
                                    <Filter size={20} />
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Procurement Order Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {orders.data.map((order) => (
                        <Card key={order.id} className="group rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-indigo-50 dark:hover:shadow-none transition-all duration-500">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row h-full">
                                    {/* Magnitude Lateral */}
                                    <div className={cn(
                                        "w-full sm:w-40 flex flex-col items-center justify-center p-8 gap-4 transition-colors",
                                        order.status === 'received' ? "bg-emerald-50 text-emerald-600" :
                                            order.status === 'cancelled' ? "bg-rose-50 text-rose-600" :
                                                order.status === 'ordered' ? "bg-indigo-50 text-indigo-600" :
                                                    "bg-slate-50 text-slate-400"
                                    )}>
                                        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                                            <Truck size={24} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Magnitude</p>
                                            <p className="text-lg font-black tracking-tighter italic">৳{new Intl.NumberFormat().format(order.total_amount)}</p>
                                        </div>
                                    </div>

                                    {/* Info Body */}
                                    <div className="flex-1 p-10 space-y-8">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <Badge className={cn(
                                                    "px-3 py-1 rounded-full font-black text-[8px] uppercase tracking-widest border-none shadow-sm",
                                                    order.status === 'received' ? "bg-emerald-50 text-emerald-600" :
                                                        order.status === 'cancelled' ? "bg-rose-50 text-rose-600" :
                                                            order.status === 'ordered' ? "bg-indigo-50 text-indigo-600" :
                                                                "bg-slate-50 text-slate-400"
                                                )}>
                                                    {order.status.toUpperCase()}
                                                </Badge>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none pt-2 group-hover:text-indigo-600 transition-colors">
                                                    {order.po_number}
                                                </h3>
                                            </div>
                                            <Link href={route('purchase-orders.show', order.id)}>
                                                <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-300 group-hover:text-indigo-600 group-hover:bg-white dark:group-hover:bg-slate-700 shadow-sm transition-all border border-transparent group-hover:border-indigo-100">
                                                    <ArrowRight size={20} />
                                                </Button>
                                            </Link>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resource Entity</p>
                                                <div className="flex items-center gap-2">
                                                    <Building size={14} className="text-indigo-500" />
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{order.supplier.company_name}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Horizon</p>
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-indigo-500" />
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{new Date(order.order_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Bar */}
                                        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-50 dark:border-slate-800 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            <Link href={route('purchase-orders.edit', order.id)}>
                                                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-indigo-600">
                                                    <EditIcon size={16} />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-900/50 text-rose-600 hover:bg-rose-100 transition-all">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {orders.data.length === 0 && (
                    <div className="py-32 text-center space-y-6">
                        <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] flex items-center justify-center mx-auto text-slate-200">
                            <Truck size={64} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">No procurement resonance</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Initialize an order node to begin supply chain realization.</p>
                        </div>
                    </div>
                )}

                {/* High-Fidelity Pagination */}
                {orders.links.length > 3 && (
                    <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden no-print">
                        <CardContent className="px-8 py-10 flex items-center justify-between">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                Page Segment {orders.current_page} of {orders.last_page} • Total Nodes {orders.total}
                            </p>
                            <div className="flex items-center gap-2">
                                {orders.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={cn(
                                            "h-12 min-w-[3rem] px-4 flex items-center justify-center rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                                            link.active
                                                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl"
                                                : "bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-indigo-600 shadow-inner",
                                            !link.url && "opacity-30 pointer-events-none"
                                        )}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </FigmaLayout>
    );
}
