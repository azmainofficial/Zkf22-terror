import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Pencil,
    Calendar,
    DollarSign,
    Package,
    FileText,
    Download,
    Eye,
    Image as ImageIcon,
    Upload,
    X,
    Activity,
    ShieldCheck,
    Briefcase,
    Building,
    Clock,
    TrendingUp,
    Layers,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Search,
    Filter,
    MoreHorizontal,
    Plus,
    LayoutGrid,
    List,
    LucideChevronRight,
    Zap,
    Scale,
    PieChart,
    Target
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { cn } from '@/lib/utils';

export default function Show({ auth, project, connectedInventory, designs }) {
    const [selectedTab, setSelectedTab] = useState('intelligence');

    const budget = Number(project.budget) || 0;
    const actualCost = Number(project.actual_cost) || 0;
    const contractAmount = Number(project.contract_amount) || 0;
    const realizedCapital = Number(project.realized_capital) || 0; // Assuming this might be calculated or passed
    const remainingCapital = contractAmount - realizedCapital;

    const getStatusStyle = (status) => {
        const styles = {
            completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
            ongoing: "bg-indigo-50 text-indigo-600 border-indigo-100",
            pending: "bg-amber-50 text-amber-600 border-amber-100",
            cancelled: "bg-rose-50 text-rose-600 border-rose-100",
            on_hold: "bg-slate-100 text-slate-500 border-slate-200",
        };
        return styles[status] || styles.pending;
    };

    const tabs = [
        { id: 'intelligence', label: 'Tactical Intelligence', icon: Zap },
        { id: 'milestones', label: 'Realization Matrix', icon: Layers },
        { id: 'artifacts', label: 'Design Artifacts', icon: ImageIcon },
        { id: 'inventory', label: 'Resource Flux', icon: Package },
    ];

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Project Dossier - ${project.title}`} />

            <div className="space-y-10 pb-32">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <Link href={route('projects.index')}>
                            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:scale-105 transition-all">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                                    {project.title}
                                </h1>
                                <div className={cn("px-4 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest border shadow-sm", getStatusStyle(project.status))}>
                                    {project.status.replace('_', ' ')}
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Building size={14} className="text-slate-400" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
                                        {project.client?.company_name || project.client?.name}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-400" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
                                        Deadline: {project.deadline || 'unspecified'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href={route('projects.edit', project.id)}>
                            <Button className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest italic shadow-xl shadow-slate-200 dark:shadow-none gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                <Pencil size={18} />
                                Refine Record
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Magnitude Pulse Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm p-8 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                                <Scale size={20} />
                            </div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Capital magnitude</div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic leading-none">
                                ৳{new Intl.NumberFormat().format(contractAmount)}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Gross Contract Value</p>
                        </div>
                    </Card>

                    <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm p-8 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                <TrendingUp size={20} />
                            </div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Realized Capital</div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-black text-emerald-600 tracking-tighter italic leading-none">
                                ৳{new Intl.NumberFormat().format(realizedCapital || 0)}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Liquidated Magnitude</p>
                        </div>
                    </Card>

                    <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm p-8 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600">
                                <AlertCircle size={20} />
                            </div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Capital Latency</div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-black text-rose-600 tracking-tighter italic leading-none">
                                ৳{new Intl.NumberFormat().format(remainingCapital)}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Outstanding Magnitude</p>
                        </div>
                    </Card>

                    <Card className="rounded-[32px] border-none bg-indigo-600 shadow-xl shadow-indigo-100 dark:shadow-none p-8 space-y-4 text-white">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <PieChart size={20} />
                            </div>
                            <div className="text-[9px] font-black text-white/60 uppercase tracking-widest italic">Resonance Index</div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-black tracking-tighter italic leading-none">
                                {project.progress || 0}%
                            </p>
                            <p className="text-[10px] font-bold text-white/60 uppercase">Realization Velocity</p>
                        </div>
                    </Card>
                </div>

                {/* Interface Tabs */}
                <div className="flex items-center gap-1 p-1 bg-slate-50 dark:bg-slate-800 rounded-[2rem] w-fit border border-slate-100 dark:border-slate-700 shadow-inner">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id)}
                            className={cn(
                                "flex items-center gap-3 px-8 py-3.5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all",
                                selectedTab === tab.id
                                    ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-sm"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            )}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Sub-Surface Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    <div className="lg:col-span-8 space-y-10">
                        {selectedTab === 'intelligence' && (
                            <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden min-h-[500px]">
                                <CardContent className="p-10 md:p-14 space-y-10">
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-3 pl-2">
                                            <div className="w-2 h-8 rounded-full bg-indigo-600" />
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Strategic Narrative</h3>
                                        </div>
                                        <div className="p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-700 relative overflow-hidden group hover:border-indigo-100 transition-all">
                                            <Target size={120} className="absolute -bottom-10 -right-10 text-slate-100/50 dark:text-slate-700/50 group-hover:scale-110 transition-transform duration-700" />
                                            <p className="text-lg font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic relative z-10">
                                                {project.description || "Synthesizing tactical data..."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 pl-2">
                                                <div className="w-1.5 h-6 rounded-full bg-emerald-500" />
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Temporal Windows</h4>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl">
                                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Initialization</p>
                                                    <p className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase italic tracking-tighter">{project.start_date || 'N/A'}</p>
                                                </div>
                                                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl">
                                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Realization</p>
                                                    <p className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase italic tracking-tighter">{project.deadline || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 pl-2">
                                                <div className="w-1.5 h-6 rounded-full bg-indigo-500" />
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Resonance priority</h4>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl">
                                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Magnitude</p>
                                                    <div className={cn(
                                                        "px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border",
                                                        project.priority === 'critical' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                            project.priority === 'high' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                                "bg-indigo-50 text-indigo-600 border-indigo-100"
                                                    )}>
                                                        {project.priority || 'MEDIUM'}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl">
                                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Project UUID</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase mono tracking-tighter">#{project.id.toString().padStart(6, '0')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {selectedTab === 'milestones' && (
                            <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden min-h-[500px]">
                                <CardContent className="p-10 md:p-14 space-y-10">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pl-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-8 rounded-full bg-rose-500" />
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Milestone Matrix</h3>
                                        </div>
                                        <div className="px-6 py-2 rounded-2xl bg-slate-900 text-white font-black text-lg tracking-tighter italic">
                                            ৳{new Intl.NumberFormat().format(contractAmount)} Gross
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {project.contract_details?.map((milestone, index) => (
                                            <div key={index} className="group flex items-center justify-between p-8 bg-slate-50 dark:bg-slate-800/30 rounded-[2.5rem] border border-transparent hover:border-indigo-100 transition-all hover:bg-white dark:hover:bg-slate-800 shadow-sm">
                                                <div className="flex items-center gap-8">
                                                    <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-xs font-black text-slate-300 italic shadow-sm">
                                                        #{index + 1}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase italic tracking-tight">{milestone.description}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Realization Target</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1 text-right">
                                                    <p className="text-xl font-black text-indigo-600 tracking-tighter italic leading-none">৳{new Intl.NumberFormat().format(milestone.amount)}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gross Yield</p>
                                                </div>
                                            </div>
                                        ))}
                                        {!project.contract_details?.length && (
                                            <div className="py-24 text-center space-y-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                                                <FileText size={64} className="mx-auto text-slate-200" />
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none italic">Record Offline</p>
                                                    <p className="text-xs font-bold text-slate-300 italic mt-2">No milestone parameters defined for this node.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right column (Sub-details) */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* Resource Intelligence */}
                        <Card className="rounded-[44px] border-none bg-indigo-600 shadow-2xl shadow-indigo-100 dark:shadow-none p-10 space-y-10 text-white">
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 rounded-full bg-white/20" />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 italic">Resource Intelligence</h3>
                                </div>

                                <div className="space-y-4 group">
                                    <div className="flex items-center gap-6 p-6 bg-white/10 rounded-[2rem] border border-white/5 group-hover:bg-white/20 transition-all cursor-pointer">
                                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-900/40">
                                            <Building size={28} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-black uppercase italic tracking-tight leading-none truncate w-40">
                                                {project.client?.company_name || 'N/A'}
                                            </h4>
                                            <p className="text-[9px] font-black text-white/50 uppercase tracking-widest italic">Host Entity</p>
                                        </div>
                                    </div>
                                    <Link
                                        href={project.client ? route('clients.show', project.client.id) : '#'}
                                        className="w-full flex items-center justify-between px-6 py-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all"
                                    >
                                        <span className="text-[9px] font-black uppercase tracking-widest italic">View Profile</span>
                                        <ChevronRight size={14} className="text-white/40" />
                                    </Link>
                                </div>
                            </div>
                        </Card>

                        {/* Visual Artifact Node */}
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                            <CardContent className="p-10 space-y-8">
                                <div className="flex items-center gap-3 pl-2">
                                    <div className="w-2 h-8 rounded-full bg-indigo-600" />
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Visual Identity</h3>
                                </div>

                                {project.image ? (
                                    <div className="relative group w-full h-80 rounded-[2.5rem] overflow-hidden shadow-inner bg-slate-50 dark:bg-slate-800 border-4 border-white dark:border-slate-800">
                                        <img src={`/storage/${project.image}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={project.title} />
                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                                            <Button variant="ghost" size="icon" className="w-14 h-14 rounded-2xl bg-white text-slate-900">
                                                <Eye size={24} />
                                            </Button>
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest italic leading-none">Identity Node Pulse</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-80 bg-slate-50/50 dark:bg-slate-800/30 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] space-y-4">
                                        <ImageIcon size={64} className="text-slate-200" />
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No Visual Record</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Integration pulse */}
                        <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Activity size={24} className="text-emerald-500 animate-pulse" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Integration Stream</p>
                                    <p className="text-[8px] font-black text-slate-300 uppercase leading-none">Automated Sync Operational</p>
                                </div>
                            </div>
                            <LucideChevronRight size={18} className="text-slate-200" />
                        </div>
                    </div>
                </div>
            </div>
        </FigmaLayout>
    );
}
