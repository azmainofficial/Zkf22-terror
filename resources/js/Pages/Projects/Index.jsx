import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    Eye,
    Pencil,
    Trash2,
    Briefcase,
    Activity,
    Clock,
    CheckCircle2,
    XCircle,
    TrendingUp,
    Zap,
    Building,
    Calendar,
    DollarSign,
    Filter,
    ChevronDown,
    ArrowRight,
    Users,
    Layers,
    ExternalLink
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Card, CardContent } from '@/Components/ui/Card';
import { cn } from '@/lib/utils';

export default function Index({ auth, projects, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'All');

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(route('projects.index'), { search, status }, {
                preserveState: true,
                replace: true
            });
        }, 500);
        return () => clearTimeout(timer);
    }, [search, status]);

    const handleDelete = (id) => {
        if (confirm('Permanently redact this project node from the tactical ecosystem?')) {
            router.delete(route('projects.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            completed: {
                label: "REALIZED",
                icon: CheckCircle2,
                color: "text-emerald-600 bg-emerald-50 border-emerald-100",
                darkColor: "dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-900/30"
            },
            ongoing: {
                label: "ACTIVE VECTOR",
                icon: Activity,
                color: "text-indigo-600 bg-indigo-50 border-indigo-100",
                darkColor: "dark:text-indigo-400 dark:bg-indigo-900/20 dark:border-indigo-900/30"
            },
            pending: {
                label: "QUEUED",
                icon: Clock,
                color: "text-amber-600 bg-amber-50 border-amber-100",
                darkColor: "dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-900/30"
            },
            cancelled: {
                label: "VOIDED",
                icon: XCircle,
                color: "text-rose-600 bg-rose-50 border-rose-100",
                darkColor: "dark:text-rose-400 dark:bg-rose-900/20 dark:border-rose-900/30"
            },
            on_hold: {
                label: "STAGNANT",
                icon: Layers,
                color: "text-slate-500 bg-slate-50 border-slate-100",
                darkColor: "dark:text-slate-400 dark:bg-slate-800 dark:border-slate-800"
            },
        };
        const key = status?.toLowerCase().replace(' ', '_');
        return configs[key] || configs.pending;
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Tactical Project Ecosystem" />

            <div className="space-y-10 pb-32">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                            Tactical Portfolio
                        </h1>
                        <div className="flex items-center gap-2">
                            <Activity size={12} className="text-indigo-600" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none italic">Active Project Resonance Pipeline</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={route('projects.create')}>
                            <Button className="h-14 px-8 rounded-[1.8rem] bg-indigo-600 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-widest gap-3 shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-105 active:scale-95">
                                <Plus size={20} />
                                Initialize Project
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Status Analytics Matrix */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {['Ongoing', 'Completed', 'Pending', 'On Hold', 'Cancelled'].map((stat) => {
                        const config = getStatusConfig(stat);
                        const count = projects.data.filter(p => p.status?.toLowerCase() === stat.toLowerCase().replace(' ', '_')).length;
                        return (
                            <Card key={stat} className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden group hover:scale-105 transition-all cursor-pointer" onClick={() => setStatus(stat)}>
                                <CardContent className="p-6 space-y-3 text-center">
                                    <div className={cn(
                                        "w-10 h-10 rounded-2xl mx-auto flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm border",
                                        config.color, config.darkColor
                                    )}>
                                        <config.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">{stat} Vector</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">{count}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Tactical Search & Filter */}
                <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden no-print">
                    <CardContent className="p-4 md:p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                            <div className="lg:col-span-8 relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
                                    <Search size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Execute search against Project Title or Resource Node..."
                                    className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-sm text-slate-600 dark:text-slate-300 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-600/10 transition-all shadow-inner"
                                />
                            </div>

                            <div className="lg:col-span-4 flex items-center gap-3">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="h-16 px-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-300 appearance-none focus:ring-4 focus:ring-indigo-600/10 shadow-inner w-full"
                                >
                                    <option value="All">All Lifecycles</option>
                                    <option value="Ongoing">Ongoing Vectors</option>
                                    <option value="Completed">Realized Only</option>
                                    <option value="Pending">Queued Nodes</option>
                                    <option value="on_hold">Stagnant Nodes</option>
                                    <option value="cancelled">Voided Only</option>
                                </select>

                                <Button className="h-16 w-16 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white flex-shrink-0 hover:bg-slate-800 transition-all">
                                    <Filter size={20} />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Project Pipeline Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.data.map((project) => {
                        const config = getStatusConfig(project.status);
                        return (
                            <Card key={project.id} className="group rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-indigo-50 dark:hover:shadow-none transition-all duration-500">
                                <CardContent className="p-0">
                                    <div className="p-10 space-y-8">
                                        {/* Status & Actions Header */}
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <Badge className={cn(
                                                    "px-3 py-1 rounded-full font-black text-[8px] uppercase tracking-widest border-none shadow-sm",
                                                    config.color, config.darkColor
                                                )}>
                                                    {config.label}
                                                </Badge>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Calendar size={12} className="text-slate-300" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Initiated: {project.start_date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link href={route('projects.edit', project.id)}>
                                                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all border border-transparent">
                                                        <Pencil size={16} />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(project.id)}
                                                    className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-300 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all border border-transparent"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Project Title */}
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                                                {project.title}
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                    <Building size={14} />
                                                </div>
                                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide truncate">
                                                    {project.client?.company_name || project.client?.name || 'External Entity'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Magnitude & Resource Matrix */}
                                        <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50 dark:border-slate-800">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Capital Sum</p>
                                                <div className="flex items-center gap-2">
                                                    <DollarSign size={14} className="text-indigo-500" />
                                                    <p className="text-sm font-black text-slate-900 dark:text-white italic tracking-tighter">৳{new Intl.NumberFormat().format(project.budget)}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-1 text-right">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Auth Signature</p>
                                                <div className="flex items-center justify-end gap-2">
                                                    <p className="text-xs font-bold text-slate-500 uppercase">OFFICIAL</p>
                                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tactical Directives */}
                                        <div className="flex items-center justify-between gap-4">
                                            <Link href={route('projects.show', project.id)} className="flex-1">
                                                <Button className="w-full h-12 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-slate-800 transition-all">
                                                    Analyze Dossier <ArrowRight size={14} />
                                                </Button>
                                            </Link>
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 dark:border-indigo-900/50">
                                                <TrendingUp size={18} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Realization Progress (Simulated) */}
                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div
                                            className={cn("h-full transition-all duration-1000", config.color.split(' ')[1].replace('bg-', 'bg-'))}
                                            style={{ width: project.status === 'completed' ? '100%' : '45%' }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {projects.data.length === 0 && (
                    <div className="py-32 text-center space-y-6">
                        <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] flex items-center justify-center mx-auto text-slate-200">
                            <Briefcase size={64} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">No project resonance detected</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Initialize a project node to begin tactical realization.</p>
                        </div>
                    </div>
                )}

                {/* High-Fidelity Pagination */}
                {projects.links.length > 3 && (
                    <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden no-print">
                        <CardContent className="px-8 py-10 flex items-center justify-between">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                Page Segment {projects.current_page} of {projects.last_page} • Total Nodes {projects.total}
                            </p>
                            <div className="flex items-center gap-2">
                                {projects.links.map((link, i) => (
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
