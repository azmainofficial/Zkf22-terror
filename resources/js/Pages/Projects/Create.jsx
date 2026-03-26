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
    MapPin,
    Mail,
    Phone
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { cn } from '@/lib/utils';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';

export default function Create({ auth, clients }) {
    const [contractDetails, setContractDetails] = useState([]);
    const [editingDetail, setEditingDetail] = useState(null);
    const [detailForm, setDetailForm] = useState({ description: '', amount: '' });
    const [showClientModal, setShowClientModal] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        client_id: '',
        start_date: '',
        deadline: '',
        contract_amount: '',
        contract_details: [],
        status: 'pending',
        priority: 'medium',
        description: '',
        designs: [],
    });

    const clientForm = useForm({
        name: '',
        company_name: '',
        email: '',
        phone: '',
        address: '',
        status: 'active',
    });

    useEffect(() => {
        setData(prev => ({
            ...prev,
            contract_details: JSON.stringify(contractDetails),
            contract_amount: contractDetails.reduce((sum, detail) => sum + parseFloat(detail.amount || 0), 0)
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

    const handleDesignUpload = (e) => {
        const files = Array.from(e.target.files);
        setData('designs', [...data.designs, ...files]);
    };

    const handleRemoveDesign = (index) => {
        setData('designs', data.designs.filter((_, i) => i !== index));
    };

    const handleCreateClient = (e) => {
        e.preventDefault();
        clientForm.post(route('clients.store'), {
            onSuccess: () => {
                setShowClientModal(false);
                clientForm.reset();
                router.reload({ only: ['clients'] });
            },
            preserveScroll: true,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('projects.store'), {
            forceFormData: true,
        });
    };

    const totalContractAmount = contractDetails.reduce((sum, detail) => sum + parseFloat(detail.amount || 0), 0);

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Initialize Tactical Project" />

            <div className="space-y-10 pb-32">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <Link href={route('projects.index')}>
                            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:scale-105 transition-all">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                                Initialize Project
                            </h1>
                            <div className="flex items-center gap-2">
                                <Activity size={12} className="text-indigo-600" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none italic">New Portfolio Resonance Node</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 border-2 border-indigo-100 dark:border-indigo-800 font-black text-[10px] uppercase tracking-widest shadow-sm">
                            Phase: Concept Initialization
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Main Synthesis Panel */}
                    <div className="lg:col-span-8 space-y-10">
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none rotate-12">
                                <Briefcase size={240} className="text-indigo-600" />
                            </div>

                            <CardContent className="p-10 md:p-14 space-y-12 relative z-10">
                                {/* Core Resonance Parameters */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 pl-2 mb-2">
                                        <div className="w-2 h-8 rounded-full bg-indigo-600" />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Core Resonance Parameters</h3>
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
                                                    className="w-full h-18 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] font-black text-lg text-slate-900 dark:text-white placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all uppercase italic tracking-tight"
                                                    value={data.title}
                                                    onChange={e => setData('title', e.target.value)}
                                                    placeholder="PROJECT CODENAME / IDENTIFIER"
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.title} className="mt-2" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between pl-4">
                                                    <InputLabel value="Resource Node (Client)" className="text-[10px] font-black uppercase tracking-widest text-slate-500" />
                                                    <Button
                                                        type="button"
                                                        onClick={() => setShowClientModal(true)}
                                                        variant="ghost"
                                                        className="h-6 px-3 rounded-full text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 gap-1 active:scale-95 transition-all"
                                                    >
                                                        <PlusCircle size={10} /> Add New Node
                                                    </Button>
                                                </div>
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
                                                        <option value="">Select Resource Entity</option>
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
                                                placeholder="Define the primary strategic trajectory and project deliverables..."
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
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Capital Milestone Matrix</h3>
                                    </div>
                                    {totalContractAmount > 0 && (
                                        <div className="px-6 py-2 rounded-2xl bg-slate-900 text-white font-black text-lg tracking-tighter italic">
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
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

                                    {contractDetails.length === 0 && (
                                        <div className="py-16 text-center space-y-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                                            <FileText size={48} className="mx-auto text-slate-200" />
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Record Empty</p>
                                                <p className="text-xs font-bold text-slate-300 italic mt-2">No capital milestones defined for this trajectory.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Evidence & Protocol Lateral */}
                    <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-8">
                        {/* Design Artifact Surface */}
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                            <CardContent className="p-10 space-y-8">
                                <div className="flex items-center gap-3 pl-2">
                                    <div className="w-2 h-8 rounded-full bg-indigo-600" />
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Technical Evidence</h3>
                                </div>

                                <div className="space-y-6">
                                    <label className="flex flex-col items-center justify-center w-full h-48 bg-slate-50 dark:bg-slate-800 border-4 border-dashed border-slate-100 dark:border-slate-700 rounded-[2.5rem] cursor-pointer hover:bg-white transition-all group overflow-hidden relative">
                                        <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="text-center relative z-10 space-y-3">
                                            <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto text-slate-400 group-hover:text-indigo-600 transition-colors shadow-sm">
                                                <FileUp size={28} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Upload Design Nodes</p>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">JPG, PNG, PDF, DWG (MAX 20MB)</p>
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            multiple
                                            className="hidden"
                                            onChange={handleDesignUpload}
                                            accept="image/*,.pdf,.dwg,.dxf"
                                        />
                                    </label>

                                    <div className="space-y-3">
                                        {data.designs.map((file, index) => (
                                            <div key={index} className="group flex items-center justify-between p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100/50">
                                                <div className="flex items-center gap-4 flex-1 truncate">
                                                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-indigo-600 shadow-sm">
                                                        <FileText size={14} />
                                                    </div>
                                                    <div className="truncate">
                                                        <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase truncate">{file.name}</p>
                                                        <p className="text-[8px] font-bold text-slate-400 uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                </div>
                                                <Button type="button" onClick={() => handleRemoveDesign(index)} variant="ghost" size="icon" className="w-8 h-8 rounded-xl text-rose-500 hover:bg-rose-100">
                                                    <X size={14} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submission Protocols */}
                        <div className="space-y-4 pt-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full h-20 rounded-[2.2rem] bg-indigo-600 hover:bg-slate-900 text-white font-black text-xl shadow-2xl shadow-indigo-100 dark:shadow-none gap-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {processing ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        <ShieldCheck size={28} />
                                        <span className="uppercase italic tracking-tighter">Commit Portfolio Node</span>
                                    </>
                                )}
                            </Button>

                            <div className="flex items-center gap-3 justify-center py-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2rem]">
                                <Activity size={14} className="text-indigo-500 animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">Initiating Tactical Circuit</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Quick Client Synthesis Modal */}
            <Modal show={showClientModal} onClose={() => setShowClientModal(false)} maxWidth="2xl">
                <div className="bg-white dark:bg-slate-900 rounded-[44px] overflow-hidden shadow-2xl relative">
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/50 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

                    <div className="p-10 md:p-14 space-y-10 relative z-10">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">Quick Synthesis</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">New Resource Node Integration</p>
                            </div>
                            <Button onClick={() => setShowClientModal(false)} variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-indigo-600 transition-all">
                                <X size={24} />
                            </Button>
                        </div>

                        <form onSubmit={handleCreateClient} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <InputLabel value="Operational Company Name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4" />
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                            <Building size={16} />
                                        </div>
                                        <TextInput
                                            type="text"
                                            className="w-full h-14 pl-14 pr-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-600/10 shadow-inner"
                                            value={clientForm.data.company_name}
                                            onChange={e => clientForm.setData('company_name', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <InputLabel value="Primary Liaison Name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4" />
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                            <User size={16} />
                                        </div>
                                        <TextInput
                                            type="text"
                                            className="w-full h-14 pl-14 pr-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-600/10 shadow-inner"
                                            value={clientForm.data.name}
                                            onChange={e => clientForm.setData('name', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <InputLabel value="Comms Protocol (Email)" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4" />
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                            <Mail size={16} />
                                        </div>
                                        <TextInput
                                            type="email"
                                            className="w-full h-14 pl-14 pr-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-600/10 shadow-inner"
                                            value={clientForm.data.email}
                                            onChange={e => clientForm.setData('email', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <InputLabel value="Tactical Comms (Phone)" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4" />
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                            <Phone size={16} />
                                        </div>
                                        <TextInput
                                            type="text"
                                            className="w-full h-14 pl-14 pr-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-600/10 shadow-inner"
                                            value={clientForm.data.phone}
                                            onChange={e => clientForm.setData('phone', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <InputLabel value="Operational Geolocation" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4" />
                                <div className="relative group">
                                    <div className="absolute left-6 top-6 text-slate-300 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                        <MapPin size={16} />
                                    </div>
                                    <textarea
                                        className="w-full pl-14 pr-6 pt-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-600/10 shadow-inner resize-none min-h-[100px]"
                                        value={clientForm.data.address}
                                        onChange={e => clientForm.setData('address', e.target.value)}
                                        placeholder="Enter entity physical coordinates..."
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={clientForm.processing}
                                    className="flex-1 h-16 rounded-[1.8rem] bg-slate-900 dark:bg-indigo-600 text-white font-black uppercase tracking-widest italic shadow-xl shadow-indigo-100 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {clientForm.processing ? <Loader2 className="animate-spin" size={24} /> : "Synthesize Node"}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setShowClientModal(false)}
                                    variant="ghost"
                                    className="h-16 px-8 rounded-[1.8rem] text-slate-400 font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                                >
                                    Abort
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
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
