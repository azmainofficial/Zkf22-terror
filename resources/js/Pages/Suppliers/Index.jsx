import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Search,
    Plus,
    Phone,
    Mail,
    MapPin,
    Building2,
    Edit2,
    Trash2,
    Activity,
    Layers,
    Filter,
    ChevronDown,
    ExternalLink,
    Building,
    ShieldCheck,
    Briefcase,
    Zap,
    History
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Card, CardContent } from '@/Components/ui/Card';
import { cn } from '@/lib/utils';

export default function Index({ auth, suppliers, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'All');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('suppliers.index'), { search, status }, { preserveState: true, replace: true });
    };

    const handleStatusFilter = (s) => {
        setStatus(s);
        router.get(route('suppliers.index'), { search, status: s }, { preserveState: true, replace: true });
    };

    const handleDelete = (id) => {
        if (confirm('Decommission this supplier entity from the corporate registry?')) {
            router.delete(route('suppliers.destroy', id));
        }
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Supplier Intelligence" />

            <div className="space-y-10 pb-32">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                            Supplier Hub
                        </h1>
                        <div className="flex items-center gap-2">
                            <Activity size={12} className="text-indigo-600" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none italic">Supply Chain Intelligence & Logistics</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href={route('suppliers.create')}>
                            <Button className="h-14 px-8 rounded-[1.8rem] bg-indigo-600 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-widest gap-3 shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-105 active:scale-95">
                                <Plus size={20} />
                                Integrate Vendor
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Intelligence Filtering Pipeline */}
                <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden no-print">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <form onSubmit={handleSearch} className="flex-1 w-full relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
                                    <Search size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by Entity Name, ID, or Contact..."
                                    className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-sm text-slate-600 dark:text-slate-300 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-600/10 transition-all shadow-inner"
                                />
                            </form>

                            <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-[1.8rem] w-full md:w-auto overflow-x-auto scrollbar-hide no-print">
                                {['All', 'Active', 'Inactive'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => handleStatusFilter(s)}
                                        className={cn(
                                            "h-12 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap",
                                            status === s
                                                ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm"
                                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        )}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Supplier Intelligence Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {suppliers.data.map((supplier) => (
                        <Card key={supplier.id} className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 dark:hover:shadow-none transition-all group overflow-hidden border border-transparent hover:border-indigo-100 dark:hover:border-slate-800">
                            <CardContent className="p-8 space-y-8">
                                <div className="flex items-start justify-between">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-[2rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-50 dark:border-slate-800 transition-transform group-hover:scale-110">
                                            {supplier.avatar ? (
                                                <img src={`/storage/${supplier.avatar}`} className="w-full h-full object-cover" alt={supplier.name} />
                                            ) : (
                                                <Building2 size={32} className="text-slate-200" />
                                            )}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-4 border-white dark:border-slate-900 bg-emerald-500 flex items-center justify-center no-print">
                                            <ShieldCheck size={14} className="text-white" />
                                        </div>
                                    </div>
                                    <Badge className={cn(
                                        "px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-[0.2em] border-none shadow-sm",
                                        supplier.status === 'active'
                                            ? "bg-emerald-50 text-emerald-600"
                                            : "bg-slate-100 text-slate-500"
                                    )}>
                                        {supplier.status === 'active' ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic leading-none group-hover:text-indigo-600 transition-colors">{supplier.company_name}</h3>
                                    <div className="flex items-center gap-2">
                                        <Briefcase size={10} className="text-slate-400" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{supplier.name}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                            <Mail size={14} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate">{supplier.email || 'No email registered'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                            <Phone size={14} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{supplier.phone || '+880 N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                            <MapPin size={14} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate">{supplier.address || 'Location Unknown'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-6 no-print">
                                    <Link href={route('suppliers.show', supplier.id)} className="flex-1">
                                        <Button variant="outline" className="w-full h-12 rounded-xl border-slate-100 dark:border-slate-800 font-black text-[10px] uppercase tracking-widest gap-2 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800">
                                            <ExternalLink size={14} /> Intelligence
                                        </Button>
                                    </Link>
                                    <Link href={route('suppliers.edit', supplier.id)}>
                                        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 hover:scale-110 transition-transform">
                                            <Edit2 size={16} />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(supplier.id)}
                                        className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 hover:bg-rose-100 hover:scale-110 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {suppliers.data.length === 0 && (
                        <Card className="col-span-full py-24 rounded-[40px] border-none bg-white dark:bg-slate-900 text-center space-y-6">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200">
                                <Building2 size={48} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">No Vendor Entities Detected</h3>
                                <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">The supply chain registry is currently empty.</p>
                            </div>
                            <Link href={route('suppliers.create')}>
                                <Button className="h-14 px-10 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none">
                                    Initialize Global Sourcing
                                </Button>
                            </Link>
                        </Card>
                    )}
                </div>

                {/* High-Fidelity Pagination */}
                {suppliers.links.length > 3 && (
                    <div className="flex justify-center items-center gap-3 pt-10 no-print">
                        {suppliers.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url}
                                className={cn(
                                    "h-12 min-w-[3rem] px-4 flex items-center justify-center rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                                    link.active
                                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl"
                                        : "bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm border border-slate-50 dark:border-slate-800",
                                    !link.url && "opacity-30 pointer-events-none"
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
