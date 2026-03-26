import React from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Pencil,
    Package,
    Building2,
    Calendar,
    Tag,
    Trash2,
    Activity,
    ShieldCheck,
    Zap,
    Briefcase,
    TrendingUp,
    Layers,
    Target,
    Scale,
    AlertCircle,
    Building,
    User,
    Clock,
    Truck
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function Show({ auth, item }) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this tactical resource node?')) {
            router.delete(route('inventory.destroy', item.id));
        }
    };

    const getStatusStyle = (s) => {
        const styles = {
            active: "bg-emerald-50 text-emerald-600 border-emerald-100",
            inactive: "bg-slate-100 text-slate-500 border-slate-200",
            discontinued: "bg-rose-50 text-rose-600 border-rose-100",
        };
        return styles[s] || "bg-amber-50 text-amber-600 border-amber-100";
    };

    const totalValue = item.quantity_in_stock * item.unit_price;

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Resource Dossier - ${item.name}`} />

            <div className="space-y-10 pb-32">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <Link href={route('inventory.index')}>
                            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:scale-105 transition-all">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                                    {item.name}
                                </h1>
                                <div className={cn("px-4 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest border shadow-sm", getStatusStyle(item.status))}>
                                    {item.status.toUpperCase()}
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Tag size={14} className="text-slate-400" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
                                        SKU: {item.sku || 'N/A PROTOCOL'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building size={14} className="text-slate-400" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
                                        Architecture: {item.brand?.name || 'GENERIC'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href={route('inventory.edit', item.id)}>
                            <Button className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest italic shadow-xl shadow-slate-200 dark:shadow-none gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                <Pencil size={18} />
                                Refine Record
                            </Button>
                        </Link>
                        <Button
                            onClick={handleDelete}
                            variant="ghost"
                            size="icon"
                            className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        >
                            <Trash2 size={24} />
                        </Button>
                    </div>
                </div>

                {/* Magnitude Pulse Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="rounded-[32px] border-none bg-indigo-600 shadow-2xl shadow-indigo-100 dark:shadow-none p-8 space-y-4 text-white relative overflow-hidden group">
                        <Scale size={120} className="absolute -bottom-10 -right-10 text-white/10 group-hover:scale-110 transition-transform duration-700" />
                        <div className="flex items-center justify-between relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <TrendingUp size={20} />
                            </div>
                            <div className="text-[9px] font-black text-white/60 uppercase tracking-widest italic">Capital magnitude</div>
                        </div>
                        <div className="space-y-1 relative z-10">
                            <p className="text-3xl font-black tracking-tighter italic leading-none text-white">
                                ৳{new Intl.NumberFormat().format(totalValue)}
                            </p>
                            <p className="text-[10px] font-bold text-white/60 uppercase">Liquid Asset Magnitude</p>
                        </div>
                    </Card>

                    <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm p-8 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                <Package size={20} />
                            </div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Current Resonance</div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic leading-none">
                                {item.quantity_in_stock} <span className="text-xs uppercase text-slate-400">{item.unit || 'units'}</span>
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Magnitude on Hand</p>
                        </div>
                    </Card>

                    <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm p-8 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                                <Layers size={20} />
                            </div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Unit Protocol</div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-black text-indigo-600 tracking-tighter italic leading-none">
                                ৳{new Intl.NumberFormat().format(item.unit_price)}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Capital Magnitude per Unit</p>
                        </div>
                    </Card>
                </div>

                {/* Sub-Surface Intelligence */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    <div className="lg:col-span-8 space-y-10">
                        {/* Assignment Matrix */}
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                            <CardContent className="p-10 md:p-14 space-y-10">
                                <div className="flex items-center gap-3 pl-2 mb-2">
                                    <div className="w-2 h-8 rounded-full bg-indigo-600" />
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Strategic Assignment Matrix</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 space-y-6 group hover:border-indigo-100 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                                                <Target size={24} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tactical Vector</p>
                                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Project Node</h4>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                                            {item.project ? (
                                                <Link href={route('projects.show', item.project.id)} className="flex items-center justify-between group/link">
                                                    <span className="text-xs font-black text-indigo-600 uppercase italic tracking-widest">{item.project.title}</span>
                                                    <ShieldCheck size={16} className="text-slate-200 group-hover/link:text-indigo-600 transition-colors" />
                                                </Link>
                                            ) : (
                                                <p className="text-xs font-black text-slate-300 uppercase italic tracking-widest">UNASSIGNED BUFFER</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 space-y-6 group hover:border-indigo-100 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                                                <Building2 size={24} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Entity Vector</p>
                                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Host Client</h4>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                                            {item.client ? (
                                                <Link href={route('clients.show', item.client.id)} className="flex items-center justify-between group/link">
                                                    <span className="text-xs font-black text-indigo-600 uppercase italic tracking-widest">{item.client.company_name || item.client.name}</span>
                                                    <ShieldCheck size={16} className="text-slate-200 group-hover/link:text-indigo-600 transition-colors" />
                                                </Link>
                                            ) : (
                                                <p className="text-xs font-black text-slate-300 uppercase italic tracking-widest">INTERNAL STOCK</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Lifecycle History Pulse */}
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                            <CardContent className="p-10 md:p-14 space-y-10">
                                <div className="flex items-center gap-3 pl-2 mb-2">
                                    <div className="w-2 h-8 rounded-full bg-emerald-500" />
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Temporal Lifecycle node</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-slate-800/30 rounded-[2.5rem] border border-transparent hover:border-slate-100 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-300 shadow-sm">
                                                <Clock size={20} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Initialization</p>
                                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Node Synergy Start</h4>
                                            </div>
                                        </div>
                                        <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter italic">{format(new Date(item.created_at), 'dd MMM, yyyy')}</p>
                                    </div>

                                    <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-slate-800/30 rounded-[2.5rem] border border-transparent hover:border-slate-100 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-300 shadow-sm">
                                                <Activity size={20} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Last Pulse</p>
                                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Record Refinement</h4>
                                            </div>
                                        </div>
                                        <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter italic">{format(new Date(item.updated_at), 'dd MMM, yyyy')}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column (Sub-details) */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* Source Intelligence */}
                        <Card className="rounded-[44px] border-none bg-slate-900 shadow-2xl shadow-slate-200 dark:shadow-none p-10 space-y-10 text-white">
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 rounded-full bg-white/20" />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 italic">Source Intelligence</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-6 p-6 bg-white/5 rounded-[2rem] border border-white/5 group hover:bg-white/10 transition-all">
                                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-slate-900 shadow-xl">
                                            <Truck size={28} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-black uppercase italic tracking-tight leading-none truncate w-40">
                                                {item.supplier?.company_name || item.brand?.supplier?.company_name || 'DIRECT SOURCE'}
                                            </h4>
                                            <p className="text-[9px] font-black text-white/50 uppercase tracking-widest italic">Origin Provider</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Magnitude Sync</p>
                                                <span className="px-3 py-0.5 rounded-full bg-emerald-500 text-[8px] font-black text-white uppercase tracking-widest leading-none">Verified</span>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 w-full" />
                                                </div>
                                                <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] text-center">Node integrity Protocol active</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Critical Alert Node */}
                        {item.quantity_in_stock <= (item.reorder_level || 0) && (
                            <div className="p-8 bg-rose-500 rounded-[2.5rem] text-white shadow-2xl shadow-rose-100 dark:shadow-none space-y-4 animate-pulse">
                                <div className="flex items-center gap-4">
                                    <AlertCircle size={24} />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] italic">Critical Depletion</h3>
                                </div>
                                <p className="text-xs font-bold uppercase italic leading-tight">Node magnitude has reached critical threshold limits. Initiate PROCUREMENT PROTOCOL immediately.</p>
                            </div>
                        )}

                        {/* Integration pulse */}
                        <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 flex items-center justify-between group cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all">
                            <div className="flex items-center gap-4">
                                <Activity size={24} className="text-emerald-500 animate-pulse group-hover:scale-110 transition-transform" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Central node Link</p>
                                    <p className="text-[8px] font-black text-slate-300 uppercase leading-none">Stock Flux Synchronization Active</p>
                                </div>
                            </div>
                            <Zap size={18} className="text-slate-200 group-hover:text-indigo-600 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>
        </FigmaLayout>
    );
}
