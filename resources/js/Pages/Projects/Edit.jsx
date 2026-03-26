import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    X,
    Plus,
    Trash2,
    Upload,
    Pencil,
    FileText,
    Activity,
    ShieldCheck,
    Zap,
    Briefcase,
    Building,
    Calendar,
    DollarSign,
    Clock,
    TrendingUp,
    Layers,
    PlusCircle,
    Check,
    Loader2,
    FileUp,
    ChevronDown,
    Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { cn } from '@/lib/utils';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Edit({ auth, project, clients }) {
    const [preview, setPreview] = useState(project.image ? `/storage/${project.image}` : null);
    const [contractDetails, setContractDetails] = useState(project.contract_details || []);
    const [editingDetail, setEditingDetail] = useState(null);
    const [detailForm, setDetailForm] = useState({ description: '', amount: '' });

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: project.title,
        client_id: project.client_id,
        start_date: project.start_date,
        deadline: project.deadline || '',
        budget: project.budget,
        actual_cost: project.actual_cost || 0,
        status: project.status,
        priority: project.priority,
        progress: project.progress || 0,
        description: project.description || '',
        image: null,
        contract_details: JSON.stringify(project.contract_details || []),
        contract_amount: project.contract_amount || 0,
    });

    // Handle legacy parsing if needed (from reference logic)
    useEffect(() => {
        if ((!project.contract_details || project.contract_details.length === 0) && project.description) {
            const marker = "Contract Breakdown:";
            if (project.description.includes(marker)) {
                const parts = project.description.split(marker);
                const legacyDetails = parts[1];
                const cleanDescription = parts[0].trim();

                if (contractDetails.length === 0) {
                    const lines = legacyDetails.split('\n').filter(line => line.trim().startsWith('-'));
                    const parsed = lines.map(line => {
                        const content = line.trim().substring(2);
                        const lastColon = content.lastIndexOf(':');
                        if (lastColon > 0) {
                            const desc = content.substring(0, lastColon).trim();
                            const amt = content.substring(lastColon + 1).replace(/,/g, '').trim();
                            return { description: desc, amount: amt };
                        }
                        return null;
                    }).filter(item => item !== null);

                    if (parsed.length > 0) {
                        setContractDetails(parsed);
                        setData(prev => ({ ...prev, description: cleanDescription }));
                    }
                }
            }
        }
    }, []);

    useEffect(() => {
        const total = contractDetails.reduce((sum, detail) => sum + parseFloat(detail.amount || 0), 0);
        setData(prev => ({
            ...prev,
            contract_details: JSON.stringify(contractDetails),
            contract_amount: total
        }));
    }, [contractDetails]);

    const handleAddDetail = () => {
        if (detailForm.description && detailForm.amount) {
            if (editingDetail !== null) {
                const updated = [...contractDetails];
                updated[editingDetail] = detailForm;
                setContractDetails(updated);
                setEditingDetail(null);
            } else {
                setContractDetails([...contractDetails, detailForm]);
            }
            setDetailForm({ description: '', amount: '' });
        }
    };

    const handleEditDetail = (index) => {
        setDetailForm(contractDetails[index]);
        setEditingDetail(index);
    };

    const handleDeleteDetail = (index) => {
        setContractDetails(contractDetails.filter((_, i) => i !== index));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('projects.update', project.id), {
            forceFormData: true,
        });
    };

    const totalContractAmount = contractDetails.reduce((sum, detail) => sum + parseFloat(detail.amount || 0), 0);

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Refine Portfolio Node - ${project.title}`} />

            <div className="space-y-10 pb-32">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <Link href={route('projects.show', project.id)}>
                            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:scale-105 transition-all">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                                Refine Project
                            </h1>
                            <div className="flex items-center gap-2">
                                <Activity size={12} className="text-indigo-600" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none italic">Adjusting Resonance Parameters</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm border-2",
                            project.status === 'completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                project.status === 'ongoing' ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                                    "bg-amber-50 text-amber-600 border-amber-100"
                        )}>
                            Lifecycle: {project.status.toUpperCase()}
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Main Synthesis Panel */}
                    <div className="lg:col-span-8 space-y-10">
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none rotate-12">
                                <Layers size={240} className="text-indigo-600" />
                            </div>

                            <CardContent className="p-10 md:p-14 space-y-12 relative z-10">
                                {/* Core Resonance Parameters */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 pl-2 mb-2">
                                        <div className="w-2 h-8 rounded-full bg-indigo-600" />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Adjust Resonance Parameters</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <InputLabel value="Project Tactical Title" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                    <Zap size={18} />
                                                </div>
                                                <TextInput
                                                    type="text"
                                                    className="w-full h-18 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] font-black text-lg text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all uppercase italic tracking-tight"
                                                    value={data.title}
                                                    onChange={e => setData('title', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.title} className="mt-2" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <InputLabel value="Resource Node (Client)" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                                <div className="relative group">
                                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                        <Building size={18} />
                                                    </div>
                                                    <select
                                                        className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white appearance-none focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all"
                                                        value={data.client_id}
                                                        onChange={e => setData('client_id', e.target.value)}
                                                        required
                                                    >
                                                        {clients.map(client => (
                                                            <option key={client.id} value={client.id}>
                                                                {client.company_name} ({client.name})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <InputLabel value="Priority Magnitude" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                                <select
                                                    className="w-full h-16 px-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-300 appearance-none focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all"
                                                    value={data.priority}
                                                    onChange={e => setData('priority', e.target.value)}
                                                >
                                                    <option value="low">LOW PRIORITY</option>
                                                    <option value="medium">MEDIUM VECTOR</option>
                                                    <option value="high">HIGH MAGNITUDE</option>
                                                    <option value="critical">CRITICAL RESONANCE</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <InputLabel value="Strategic Objective (Description)" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                            <textarea
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] p-8 text-sm font-bold text-slate-600 dark:text-slate-300 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all resize-none min-h-[160px]"
                                                value={data.description}
                                                onChange={e => setData('description', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Temporal Trajectories */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 pl-2 mb-2">
                                        <div className="w-2 h-8 rounded-full bg-emerald-500" />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Temporal Trajectories</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <InputLabel value="Initialization Date" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                    <Calendar size={18} />
                                                </div>
                                                <TextInput
                                                    type="date"
                                                    className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all"
                                                    value={data.start_date}
                                                    onChange={e => setData('start_date', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <InputLabel value="Realization Deadline" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                    <Clock size={18} />
                                                </div>
                                                <TextInput
                                                    type="date"
                                                    className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all"
                                                    value={data.deadline}
                                                    onChange={e => setData('deadline', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contract Breakdown Surface */}
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                            <CardContent className="p-10 md:p-14 space-y-10">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <div className="flex items-center gap-3 pl-2">
                                        <div className="w-2 h-8 rounded-full bg-rose-500" />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Adjust Milestone Matrix</h3>
                                    </div>
                                    {totalContractAmount > 0 && (
                                        <div className="px-6 py-2 rounded-2xl bg-slate-900 text-white font-black text-lg tracking-tighter italic shadow-sm">
                                            ৳{new Intl.NumberFormat().format(totalContractAmount)}
                                        </div>
                                    )}
                                </div>

                                {/* Milestone Integration Form */}
                                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                                        <div className="md:col-span-8 space-y-3">
                                            <InputLabel value="Milestone / Phase Identifier" className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-4" />
                                            <input
                                                type="text"
                                                value={detailForm.description}
                                                onChange={e => setDetailForm({ ...detailForm, description: e.target.value })}
                                                placeholder="e.g. Initial Sprint Realization, Prototype Deployment..."
                                                className="w-full h-14 px-6 bg-white dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-600/10 shadow-sm"
                                            />
                                        </div>
                                        <div className="md:col-span-3 space-y-3">
                                            <InputLabel value="Capital Magnitude" className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-4" />
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">৳</span>
                                                <input
                                                    type="number"
                                                    value={detailForm.amount}
                                                    onChange={e => setDetailForm({ ...detailForm, amount: e.target.value })}
                                                    placeholder="0.00"
                                                    className="w-full h-14 pl-10 pr-6 bg-white dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-600/10 shadow-sm text-right"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-1">
                                            <Button
                                                type="button"
                                                onClick={handleAddDetail}
                                                className="w-full h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none hover:scale-105 transition-all"
                                                disabled={!detailForm.description || !detailForm.amount}
                                            >
                                                {editingDetail !== null ? <Pencil size={18} /> : <PlusCircle size={22} />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Milestone List */}
                                <div className="space-y-4">
                                    {contractDetails.map((detail, index) => (
                                        <div key={index} className="group flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-transparent hover:border-indigo-100 transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-300 italic shadow-sm">
                                                    #{index + 1}
                                                </div>
                                                <p className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase italic">{detail.description}</p>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <p className="text-lg font-black text-indigo-600 tracking-tighter italic">৳{new Intl.NumberFormat().format(detail.amount)}</p>
                                                <div className="flex items-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button type="button" onClick={() => handleEditDetail(index)} variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-indigo-600 shadow-sm">
                                                        <Pencil size={14} />
                                                    </Button>
                                                    <Button type="button" onClick={() => handleDeleteDetail(index)} variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-100 shadow-sm">
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Operational & Protocol Lateral */}
                    <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-8">
                        {/* Status Lifecycle command */}
                        <Card className="rounded-[44px] border-none bg-indigo-600 shadow-2xl shadow-indigo-100 dark:shadow-none overflow-hidden relative">
                            <CardContent className="p-10 space-y-8 relative z-10 text-white">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 rounded-full bg-white/20" />
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 italic">Lifecycle Status Command</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['pending', 'ongoing', 'on_hold', 'completed', 'cancelled'].map(s => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setData('status', s)}
                                                className={cn(
                                                    "px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all",
                                                    data.status === s
                                                        ? "bg-white text-indigo-600 border-white shadow-lg"
                                                        : "bg-white/10 text-white/60 border-white/5 hover:bg-white/20"
                                                )}
                                            >
                                                {s.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6 pt-4 border-t border-white/10">
                                    <div className="space-y-2">
                                        <InputLabel value="Capital Synthesis (Actual Cost)" className="text-[10px] font-black uppercase tracking-widest text-white/50 pl-2" />
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 font-bold text-xs">৳</span>
                                            <input
                                                type="number"
                                                className="w-full h-16 pl-12 pr-6 bg-white/10 border-none rounded-[1.8rem] font-black text-white focus:ring-4 focus:ring-white/10 transition-all text-right italic"
                                                value={data.actual_cost}
                                                onChange={e => setData('actual_cost', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Project Visual Identity */}
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                            <CardContent className="p-10 space-y-6">
                                <div className="flex items-center gap-3 pl-2">
                                    <div className="w-2 h-8 rounded-full bg-indigo-600" />
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Visual Identity Node</h3>
                                </div>

                                <div className="space-y-6 text-center">
                                    {preview ? (
                                        <div className="relative group w-full h-48 rounded-[2.5rem] overflow-hidden shadow-inner bg-slate-50 dark:bg-slate-800 border-4 border-white dark:border-slate-700">
                                            <img src={preview} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 shadow-sm" alt="Project preview" />
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                <Pencil className="text-white" size={32} />
                                            </div>
                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} accept="image/*" />
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-full h-48 bg-slate-50 dark:bg-slate-800 border-4 border-dashed border-slate-100 dark:border-slate-700 rounded-[2.5rem] cursor-pointer hover:bg-white transition-all group overflow-hidden relative shadow-inner">
                                            <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="text-center relative z-10 space-y-3">
                                                <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto text-slate-400 group-hover:text-indigo-600 transition-colors shadow-sm">
                                                    <ImageIcon size={28} />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initialize Visual Node</p>
                                            </div>
                                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                        </label>
                                    )}
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none">High-Fidelity JPG / PNG Only</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submission Protocols */}
                        <div className="space-y-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full h-20 rounded-[2.2rem] bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-black text-xl shadow-2xl shadow-indigo-100 dark:shadow-none gap-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {processing ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        <ShieldCheck size={28} />
                                        <span className="uppercase italic tracking-tighter">Adjust Record</span>
                                    </>
                                )}
                            </Button>

                            <div className="flex items-center gap-3 justify-center py-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2rem]">
                                <Activity size={14} className="text-indigo-500 animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">Adjusting Tactical Node</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </FigmaLayout>
    );
}

function User({ className, size }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
    )
}
