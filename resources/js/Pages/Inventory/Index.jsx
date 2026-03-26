import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    Package,
    FileSpreadsheet,
    Calendar,
    Filter,
    X,
    Eye,
    Pencil,
    Trash2,
    Activity,
    ShieldCheck,
    Zap,
    Briefcase,
    Building,
    TrendingUp,
    Layers,
    PlusCircle,
    Check,
    Loader2,
    FileUp,
    ChevronDown,
    MoreHorizontal,
    LayoutGrid,
    List,
    AlertCircle,
    Scale,
    Target
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { cn } from '@/lib/utils';

export default function Index({ auth, items, filters, projects = [], clients = [], brands = [], totalValue = 0 }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'All');
    const [projectId, setProjectId] = useState(filters.project_id || '');
    const [clientId, setClientId] = useState(filters.client_id || '');
    const [brandId, setBrandId] = useState(filters.brand_id || '');
    const [month, setMonth] = useState(filters.month || '');
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');
    const [filteredProjects, setFilteredProjects] = useState(projects);

    useEffect(() => {
        if (clientId) {
            setFilteredProjects(projects.filter(p => p.client_id == clientId));
        } else {
            setFilteredProjects(projects);
        }
    }, [clientId, projects]);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(route('inventory.index'), {
                search,
                status,
                project_id: projectId,
                client_id: clientId,
                brand_id: brandId,
                month,
                from_date: fromDate,
                to_date: toDate
            }, {
                preserveState: true,
                replace: true
            });
        }, 500);
        return () => clearTimeout(timer);
    }, [search, status, projectId, clientId, brandId, month, fromDate, toDate]);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this tactical node?')) {
            router.delete(route('inventory.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('All');
        setProjectId('');
        setClientId('');
        setBrandId('');
        setMonth('');
        setFromDate('');
        setToDate('');
    };

    const exportUrl = route('inventory.export.excel', {
        search,
        status,
        project_id: projectId,
        client_id: clientId,
        month,
        from_date: fromDate,
        to_date: toDate
    });

    const getStatusStyle = (s) => {
        const styles = {
            active: "bg-emerald-50 text-emerald-600 border-emerald-100",
            inactive: "bg-slate-100 text-slate-500 border-slate-200",
            discontinued: "bg-rose-50 text-rose-600 border-rose-100",
        };
        return styles[s] || "bg-amber-50 text-amber-600 border-amber-100";
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Inventory Intelligence Center" />

            <div className="space-y-10 pb-32">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                            Resource Inventory
                        </h1>
                        <div className="flex items-center gap-2">
                            <Activity size={12} className="text-indigo-600" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none italic">Stock Resonance Monitoring</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <a href={exportUrl}>
                            <Button variant="ghost" className="h-14 px-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 font-black text-[10px] uppercase tracking-widest gap-2 hover:scale-105 transition-all">
                                <FileSpreadsheet size={16} /> Export Intelligence
                            </Button>
                        </a>
                        <Link href={route('inventory.create')}>
                            <Button className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-slate-900 text-white font-black uppercase tracking-widest italic shadow-xl shadow-indigo-100 dark:shadow-none gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                <Plus size={20} />
                                Initialize Resource
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Magnitude Pulse Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm p-8 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                                <Scale size={20} />
                            </div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Capital magnitude</div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic leading-none">
                                ৳{new Intl.NumberFormat().format(totalValue)}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Gross Inventory Value</p>
                        </div>
                    </Card>

                    <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm p-8 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                <Package size={20} />
                            </div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Node capacity</div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-black text-emerald-600 tracking-tighter italic leading-none">
                                {items.total}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Unique Tactical Units</p>
                        </div>
                    </Card>

                    <Card className="rounded-[32px] border-none bg-slate-900 shadow-xl shadow-slate-200 dark:shadow-none p-8 space-y-4 text-white hover:bg-indigo-600 transition-colors duration-500">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                <Target size={20} />
                            </div>
                            <div className="text-[9px] font-black text-white/60 uppercase tracking-widest italic">Operational status</div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-black tracking-tighter italic leading-none">100%</p>
                            <p className="text-[10px] font-bold text-white/60 uppercase">Real-time Sync Active</p>
                        </div>
                    </Card>
                </div>

                {/* Tactical Search & Filter Pipeline */}
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-4 shadow-sm border border-slate-50 dark:border-slate-800">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        <div className="lg:col-span-4 relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Universal Node Search (SKU, Identifier...)"
                                className="w-full h-16 pl-16 pr-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-600 dark:text-slate-300 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-600/5 transition-all"
                            />
                        </div>

                        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="h-16 px-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] text-slate-500 appearance-none focus:ring-4 focus:ring-indigo-600/5 transition-all text-center"
                            >
                                <option value="All">All Lifecycles</option>
                                <option value="active">Active Stream</option>
                                <option value="inactive">Idle Nodes</option>
                                <option value="discontinued">Offline Nodes</option>
                            </select>

                            <select
                                value={brandId}
                                onChange={(e) => setBrandId(e.target.value)}
                                className="h-16 px-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] text-slate-500 appearance-none focus:ring-4 focus:ring-indigo-600/5 transition-all text-center"
                            >
                                <option value="">All Architectures</option>
                                {brands.map(brand => (
                                    <option key={brand.id} value={brand.id}>{brand.name.toUpperCase()}</option>
                                ))}
                            </select>

                            <select
                                value={projectId}
                                onChange={(e) => setProjectId(e.target.value)}
                                className="h-16 px-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] text-slate-500 appearance-none focus:ring-4 focus:ring-indigo-600/5 transition-all text-center"
                            >
                                <option value="">All Vectors</option>
                                {filteredProjects.map(project => (
                                    <option key={project.id} value={project.id}>{project.title.toUpperCase()}</option>
                                ))}
                            </select>

                            <div className="relative">
                                <input
                                    type="month"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className="w-full h-16 px-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] text-slate-500 focus:ring-4 focus:ring-indigo-600/5 transition-all text-center"
                                />
                                {(search || status !== 'All' || projectId || brandId || month) && (
                                    <button
                                        onClick={clearFilters}
                                        className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:scale-110 transition-all shadow-lg"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inventory List Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {items.data.map((item) => (
                        <Card key={item.id} className="group relative rounded-[2.5rem] border-none bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:shadow-indigo-100 transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-600 transition-all" />

                            <CardContent className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                <div className="flex items-center gap-8 lg:w-1/3">
                                    <div className="w-20 h-20 rounded-[1.8rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-500 shadow-inner">
                                        <Package size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic leading-none tracking-tight group-hover:text-indigo-600 transition-colors">
                                                {item.name}
                                            </h3>
                                            <span className={cn("px-3 py-1 rounded-lg font-black text-[8px] uppercase tracking-widest border", getStatusStyle(item.status))}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.sku || "NO-SKU-ASSIGNED"}</p>
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{item.brand?.name || "Generic"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:w-1/2">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Node Magnitude</p>
                                        <p className="text-lg font-black text-slate-900 dark:text-white italic tracking-tighter">
                                            {item.quantity_in_stock} <span className="text-[10px] text-slate-400 uppercase">{item.unit || "Units"}</span>
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Liquid Value</p>
                                        <p className="text-lg font-black text-indigo-600 italic tracking-tighter leading-none">
                                            ৳{new Intl.NumberFormat().format(item.quantity_in_stock * item.unit_price)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Assigned Vector</p>
                                        <p className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase italic truncate">
                                            {item.project?.title || "UNASSIGNED BUFFER"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 lg:justify-end">
                                    <Link href={route('inventory.show', item.id)}>
                                        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-900 dark:hover:bg-slate-700 hover:text-white transition-all">
                                            <Eye size={20} />
                                        </Button>
                                    </Link>
                                    <Link href={route('inventory.edit', item.id)}>
                                        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm">
                                            <Pencil size={18} />
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={() => handleDelete(item.id)}
                                        variant="ghost"
                                        size="icon"
                                        className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {items.data.length === 0 && (
                        <div className="py-32 text-center space-y-6 bg-slate-50/50 dark:bg-slate-800/20 rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
                            <Package size={80} className="mx-auto text-slate-200 animate-pulse" />
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-slate-400 uppercase italic tracking-widest">Inventory Record Offline</h3>
                                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Awaiting tactical node initialization...</p>
                            </div>
                            <Link href={route('inventory.create')}>
                                <Button className="h-14 px-8 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest gap-3 shadow-xl shadow-indigo-100">
                                    <PlusCircle size={20} /> Initialize First node
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Tactical Pagination */}
                {items.links.length > 3 && (
                    <div className="flex justify-center gap-3 pt-10">
                        {items.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url}
                                className={cn(
                                    "px-6 h-12 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all",
                                    link.active
                                        ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                                        : "bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-700",
                                    !link.url && "opacity-20 pointer-events-none grayscale"
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
