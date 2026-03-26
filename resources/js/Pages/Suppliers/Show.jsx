import React from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Mail,
    Phone,
    MapPin,
    Edit,
    Trash2,
    Activity,
    ShieldCheck,
    Zap,
    Briefcase,
    ExternalLink,
    PieChart,
    CreditCard,
    Building,
    Layers,
    History,
    FileText,
    TrendingUp,
    Globe
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Card, CardContent } from '@/Components/ui/Card';
import { cn } from '@/lib/utils';

export default function Show({ auth, supplier, connectedClients }) {
    const handleDelete = () => {
        if (confirm('Decommission this vendor from the corporate registry?')) {
            router.delete(route('suppliers.destroy', supplier.id));
        }
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Supplier Dossier - ${supplier.company_name}`} />

            <div className="space-y-10 pb-32">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
                    <div className="flex items-center gap-6">
                        <Link href={route('suppliers.index')}>
                            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:scale-105 transition-all">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                                Supplier Dossier
                            </h1>
                            <div className="flex items-center gap-2">
                                <Activity size={12} className="text-indigo-600" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none italic">Entity Registry: {supplier.company_name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={route('suppliers.edit', supplier.id)}>
                            <Button className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-indigo-100 dark:shadow-none transition-all hover:scale-105">
                                <Edit size={16} /> REFINE ENTITY
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            onClick={handleDelete}
                            className="h-12 px-6 rounded-2xl border-none bg-rose-50 dark:bg-rose-900/20 text-rose-600 font-black text-[10px] uppercase tracking-widest gap-2 shadow-sm hover:bg-rose-100 transition-all hover:scale-105"
                        >
                            <Trash2 size={16} /> DECOMMISSION
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Main Synthesis Panel */}
                    <div className="lg:col-span-8 space-y-10">
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-14 opacity-5 pointer-events-none rotate-12">
                                <Building2 size={240} className="text-indigo-600" />
                            </div>

                            <CardContent className="p-10 md:p-14 space-y-12 relative z-10">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-slate-50 dark:border-slate-800">
                                    <div className="space-y-6">
                                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center overflow-hidden border-2 border-slate-50 dark:border-slate-800 shadow-2xl shadow-slate-100 dark:shadow-none">
                                            {supplier.avatar ? (
                                                <img src={`/storage/${supplier.avatar}`} className="w-full h-full object-cover" alt={supplier.name} />
                                            ) : (
                                                <Building2 size={40} className="text-slate-200" />
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">{supplier.company_name}</h2>
                                            <div className="flex items-center gap-3">
                                                <Badge className={cn(
                                                    "px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-[0.2em] border-none",
                                                    supplier.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                                                )}>
                                                    {supplier.status === 'active' ? 'Authorized OPS' : 'Idle Source'}
                                                </Badge>
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{supplier.name} • Primary Liaison</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-left md:text-right space-y-2 no-print">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Readiness</p>
                                        <div className="flex items-center md:justify-end gap-2 text-emerald-500">
                                            <ShieldCheck size={18} />
                                            <span className="text-sm font-black uppercase tracking-tighter italic">Verified Strategy</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-50 dark:border-slate-800">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Credit Capacity</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">৳{new Intl.NumberFormat().format(supplier.credit_limit || 0)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Terms</p>
                                        <p className="text-2xl font-black text-indigo-600 tracking-tighter italic">{supplier.payment_terms || 'Immediate'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifecycle Age</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">{new Date(supplier.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 pl-2">
                                        <div className="w-2 h-8 rounded-full bg-indigo-600" />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Connected Clients & Ecosystem</h3>
                                    </div>

                                    {connectedClients && connectedClients.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {connectedClients.map(client => (
                                                <Card key={client.id} className="rounded-[32px] border-none bg-slate-50 dark:bg-slate-800/50 p-6 flex items-start gap-4 group hover:bg-white dark:hover:bg-slate-800 transition-all hover:shadow-xl hover:shadow-indigo-100/50 dark:hover:shadow-none border border-transparent hover:border-indigo-100">
                                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                                                        <Building size={20} />
                                                    </div>
                                                    <div className="space-y-2 flex-1 min-w-0">
                                                        <h4 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight truncate italic">{client.company_name}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{client.name}</p>
                                                        {client.projects && client.projects.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                                                                {client.projects.map(project => (
                                                                    <Badge key={project.id} className="bg-white dark:bg-slate-900 text-slate-500 font-black text-[8px] uppercase tracking-widest px-2 py-1 border-none shadow-sm">
                                                                        {project.title || project.name}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-20 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 text-center space-y-4">
                                            <Layers size={32} className="mx-auto text-slate-200" />
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] italic leading-relaxed">No Sourcing Links Detected<br />in Regional Logistics Grid</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact & Logistics Lateral */}
                    <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-8 no-print">
                        {/* Logistics HQ Card */}
                        <Card className="rounded-[44px] border-none bg-slate-900 p-10 space-y-10 shadow-2xl shadow-slate-200 dark:shadow-none relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none -rotate-12 translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform">
                                <Globe size={160} className="text-indigo-500" />
                            </div>

                            <div className="space-y-2 relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Regional HQ Vector</p>
                                <h4 className="text-3xl font-black text-white italic tracking-tighter">Logistics Node</h4>
                            </div>

                            <div className="space-y-8 relative z-10">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <div className="space-y-1 flex-1 min-w-0">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Electronic Vector</p>
                                        <p className="text-sm font-bold text-slate-200 truncate">{supplier.email || 'None'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors">
                                        <Phone size={20} />
                                    </div>
                                    <div className="space-y-1 flex-1 min-w-0">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Communication Channel</p>
                                        <p className="text-sm font-bold text-slate-200">{supplier.phone || 'None'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors">
                                        <MapPin size={20} />
                                    </div>
                                    <div className="space-y-1 flex-1 min-w-0">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Geographic Coordinates</p>
                                        <p className="text-sm font-bold text-slate-200 leading-relaxed italic">{supplier.address || 'Location Unknown'}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Inventory Pulse */}
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 p-10 space-y-8 shadow-sm group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                                        <Layers size={18} />
                                    </div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white italic">Supply Pulse</h4>
                                </div>
                                <Badge className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">
                                    {supplier.brands?.length || 0} Brands
                                </Badge>
                            </div>

                            <div className="space-y-6">
                                <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2 text-center group-hover:scale-[1.02] transition-transform">
                                    <TrendingUp size={32} className="mx-auto text-indigo-600 mb-2" />
                                    <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic">0.0%</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Procurement Velocity</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">System Hash</p>
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center gap-3 border border-slate-100 dark:border-slate-800">
                                        <FileText size={14} className="text-slate-300" />
                                        <span className="text-[10px] font-mono font-black text-slate-400">OMS-SUP-{supplier.id.toString().padStart(4, '0')}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </FigmaLayout>
    );
}
