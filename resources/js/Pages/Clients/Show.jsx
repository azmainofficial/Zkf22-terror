import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Mail,
    Phone,
    Globe,
    MapPin,
    Calendar,
    Plus,
    FileText,
    Briefcase,
    CheckCircle2,
    Clock,
    Package,
    Download,
    Trash2,
    Pencil,
    TrendingUp,
    CreditCard,
    Layers,
    Upload,
    Eye,
    Table,
    Ruler,
    DollarSign,
    Zap,
    ExternalLink,
    ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/Tabs';
import { cn } from '@/lib/utils';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Show({ auth, client, projects, stats, paymentMethods = [] }) {
    const [activeTab, setActiveTab] = useState('projects');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showDesignModal, setShowDesignModal] = useState(false);

    const designForm = useForm({
        title: '',
        project_id: '',
        file: null,
        type: 'floor_plan',
        description: '',
    });

    const paymentForm = useForm({
        client_id: client.id,
        payment_type: 'incoming',
        payment_date: new Date().toISOString().split('T')[0],
        amount: '',
        payment_method: '',
        status: 'completed',
        notes: '',
        redirect_back: true,
    });

    const handleRecordPayment = (e) => {
        e.preventDefault();
        paymentForm.post(route('payments.store'), {
            onSuccess: () => {
                setShowPaymentModal(false);
                paymentForm.reset();
            },
            preserveScroll: true,
        });
    };

    const handleUploadDesign = (e) => {
        e.preventDefault();
        designForm.post(route('clients.designs.upload', client.id), {
            onSuccess: () => {
                setShowDesignModal(false);
                designForm.reset();
            },
        });
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`${client.company_name} - Strategic Headquarters`} />

            <div className="space-y-8 pb-20">
                {/* Strategic Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <Link href={route('clients.index')}>
                            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 rounded-[28px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-3 shadow-inner">
                                {client.logo ? (
                                    <img src={`/storage/${client.logo}`} className="w-full h-full object-contain" alt={client.company_name} />
                                ) : (
                                    <Building2 size={40} className="text-slate-400" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                                    {client.company_name}
                                </h1>
                                <div className="flex items-center gap-3 mt-1">
                                    <Badge variant="premium" className="uppercase text-[10px] tracking-widest px-3 py-1">
                                        {client.industry || 'Lead Partner'}
                                    </Badge>
                                    <span className="text-slate-400 text-sm font-bold flex items-center gap-1">
                                        <MapPin size={14} />
                                        {client.city || 'Global HQ'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="h-14 px-6 rounded-2xl bg-white dark:bg-slate-900 border-none shadow-sm font-bold tracking-tight hover:scale-[1.02] transition-all gap-2"
                            onClick={() => window.print()}
                        >
                            <Download size={18} />
                            <span>Export Dossier</span>
                        </Button>
                        <Link href={route('clients.edit', client.id)}>
                            <Button className="h-14 px-8 rounded-2xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-black shadow-xl shadow-slate-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] gap-2">
                                <Pencil size={18} strokeWidth={2.5} />
                                <span>Refine Parameters</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Intelligence Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                                    <Briefcase size={24} />
                                </div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Ops</div>
                            </div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total Projects</h3>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.total_projects}</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400">
                                    <TrendingUp size={24} />
                                </div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Net Value</div>
                            </div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Contract Volume</h3>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">৳{Number(stats.contract_value).toLocaleString()}</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
                                    <DollarSign size={24} />
                                </div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Inbound</div>
                            </div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total Realized</h3>
                            <p className="text-3xl font-black text-emerald-600">৳{Number(stats.total_paid).toLocaleString()}</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[32px] border-none bg-indigo-600 shadow-sm overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/20 rounded-2xl text-white">
                                    <Clock size={24} />
                                </div>
                                <Badge variant="warning" className="bg-white/10 text-white border-none">Pending Sync</Badge>
                            </div>
                            <h3 className="text-sm font-bold text-white/70 uppercase tracking-widest mb-1">Net Exposure</h3>
                            <p className="text-3xl font-black text-white group-hover:scale-105 transition-transform">৳{Number(stats.total_due).toLocaleString()}</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Intelligence Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                            <CardContent className="p-8">
                                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Zap size={16} className="text-indigo-600" />
                                    Account Intel
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-3 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all shadow-inner">
                                            <Mail size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Primary Node</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{client.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-3 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all shadow-inner">
                                            <Phone size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Comms Line</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{client.phone || 'Encrypted / Null'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-3 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all shadow-inner">
                                            <Globe size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Digital Domain</p>
                                            <a href={client.website} target="_blank" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                                                {client.website ? client.website.replace(/^https?:\/\//, '') : 'None'}
                                                <ExternalLink size={12} />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 group">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-3 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-all shadow-inner shrink-0">
                                            <MapPin size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Operations HQ</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white italic leading-relaxed">
                                                {client.address ? `${client.address}, ${client.city || ''}` : 'Redacted / Decentralized'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {client.notes && (
                            <Card className="rounded-[40px] border-none bg-slate-900 text-white shadow-xl overflow-hidden p-8">
                                <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-50">Tactical Briefing</h3>
                                <p className="text-sm font-medium leading-relaxed text-slate-300">
                                    "{client.notes}"
                                </p>
                            </Card>
                        )}
                    </div>

                    {/* Operational Intelligence Center */}
                    <div className="lg:col-span-3">
                        <Tabs defaultValue="projects" onValueChange={setActiveTab} className="w-full">
                            <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2 scrollbar-none">
                                <TabsList className="bg-slate-200 dark:bg-slate-800 rounded-[28px] p-1.5 h-14 flex shrink-0">
                                    <TabsTrigger value="projects" className="px-8 rounded-[22px] data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm font-black text-sm gap-2">
                                        <Briefcase size={18} />
                                        Projects
                                    </TabsTrigger>
                                    <TabsTrigger value="payments" className="px-8 rounded-[22px] data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm font-black text-sm gap-2">
                                        <CreditCard size={18} />
                                        Payments
                                    </TabsTrigger>
                                    <TabsTrigger value="designs" className="px-8 rounded-[22px] data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm font-black text-sm gap-2">
                                        <Layers size={18} />
                                        Designs
                                    </TabsTrigger>
                                    <TabsTrigger value="inventory" className="px-8 rounded-[22px] data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm font-black text-sm gap-2">
                                        <Package size={18} />
                                        Inventory
                                    </TabsTrigger>
                                </TabsList>

                                <div className="flex gap-2 shrink-0 ml-4">
                                    {activeTab === 'projects' && (
                                        <Link href={route('projects.create', { client_id: client.id })}>
                                            <Button className="h-14 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-100 dark:shadow-none transition-all gap-2">
                                                <Plus size={20} strokeWidth={3} />
                                                <span>Initialize Operation</span>
                                            </Button>
                                        </Link>
                                    )}
                                    {activeTab === 'payments' && (
                                        <Button
                                            onClick={() => setShowPaymentModal(true)}
                                            className="h-14 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-100 dark:shadow-none transition-all gap-2"
                                        >
                                            <Plus size={20} strokeWidth={3} />
                                            <span>Record Inbound</span>
                                        </Button>
                                    )}
                                    {activeTab === 'designs' && (
                                        <Button
                                            onClick={() => setShowDesignModal(true)}
                                            className="h-14 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-100 dark:shadow-none transition-all gap-2"
                                        >
                                            <Upload size={20} strokeWidth={3} />
                                            <span>Upload Asset</span>
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <TabsContent value="projects" className="space-y-6">
                                {projects?.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {projects.map(project => (
                                            <Card key={project.id} className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden">
                                                <CardContent className="p-8">
                                                    <div className="flex items-start justify-between mb-6">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Badge variant={project.status === 'completed' ? 'success' : 'info'}>
                                                                    {project.status}
                                                                </Badge>
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{project.id.toString().padStart(4, '0')}</span>
                                                            </div>
                                                            <h4 className="text-xl font-black text-slate-900 dark:text-white line-clamp-1 mb-2">
                                                                {project.title}
                                                            </h4>
                                                            <div className="flex items-center gap-4 text-slate-500 font-bold text-xs uppercase tracking-tighter">
                                                                <span className="flex items-center gap-1.5">
                                                                    <Calendar size={14} />
                                                                    {new Date(project.start_date).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Budget Allocation</p>
                                                            <p className="text-xl font-black text-indigo-600">৳{Number(project.budget).toLocaleString()}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                                                        <Link href={route('projects.show', project.id)} className="flex-1">
                                                            <Button variant="outline" className="w-full h-12 rounded-2xl border-none bg-slate-50 dark:bg-slate-800 font-black tracking-tight group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-indigo-600 transition-all gap-2">
                                                                <Eye size={16} />
                                                                Enter Workspace
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('projects.edit', project.id)}>
                                                            <Button variant="ghost" className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-0">
                                                                <Pencil size={18} />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <Card className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm p-20 text-center">
                                        <div className="w-24 h-24 rounded-[32px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-8 shadow-inner">
                                            <Briefcase size={48} className="text-slate-300" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">No Active Operations</h3>
                                        <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">This partner has no documented projects. Initialize an operation to begin tracking development.</p>
                                        <Link href={route('projects.create', { client_id: client.id })}>
                                            <Button className="h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl transition-all hover:scale-105">
                                                INITIALIZE FIRST PROJECT
                                            </Button>
                                        </Link>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="payments">
                                <Card className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Date</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Reference</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {client.payments?.length > 0 ? client.payments.map(payment => (
                                                    <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                                    <Calendar size={18} />
                                                                </div>
                                                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                                    {new Date(payment.payment_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="info" className="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                                                    {payment.payment_method}
                                                                </Badge>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5 text-center">
                                                            <span className="text-xs font-black text-slate-400 font-mono">#{payment.id.toString().padStart(6, '0')}</span>
                                                        </td>
                                                        <td className="px-8 py-5 text-sm font-black text-emerald-600">
                                                            ৳{Number(payment.amount).toLocaleString()}
                                                        </td>
                                                        <td className="px-8 py-5 text-right">
                                                            <Badge variant={payment.status === 'completed' ? 'success' : 'warning'}>
                                                                {payment.status}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="5" className="px-8 py-20 text-center">
                                                            <div className="flex flex-col items-center gap-4 opacity-50">
                                                                <CreditCard size={48} />
                                                                <p className="font-bold">No Inbound Transactions Documented</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="designs" className="space-y-8">
                                {client.designs?.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {client.designs.map(design => {
                                            const ext = design.file_path.split('.').pop().toLowerCase();
                                            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
                                            return (
                                                <Card key={design.id} className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden group">
                                                    <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center p-8 overflow-hidden">
                                                        {isImage ? (
                                                            <img src={`/storage/${design.file_path}`} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" alt={design.title} />
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-4 text-slate-300 dark:text-slate-600 group-hover:scale-110 transition-transform">
                                                                <FileText size={80} strokeWidth={1} />
                                                                <span className="text-xl font-black uppercase tracking-[0.2em]">{ext}</span>
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                            <Button className="h-14 w-14 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 p-0 shadow-2xl">
                                                                <Eye size={24} />
                                                            </Button>
                                                            <a href={`/storage/${design.file_path}`} download>
                                                                <Button className="h-14 w-14 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 p-0 shadow-2xl">
                                                                    <Download size={24} />
                                                                </Button>
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <CardContent className="p-8">
                                                        <div className="flex items-start justify-between gap-4 mb-4">
                                                            <div className="min-w-0">
                                                                <h5 className="text-lg font-black text-slate-900 dark:text-white truncate mb-1">{design.title}</h5>
                                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(design.created_at).toLocaleDateString()}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => confirm('Purge this asset from headquarters?') && router.delete(route('designs.destroy', design.id))}
                                                                className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <Card className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm p-20 text-center">
                                        <div className="w-24 h-24 rounded-[32px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-8 shadow-inner">
                                            <Layers size={48} className="text-slate-300" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Tactical Visuals Pending</h3>
                                        <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">Upload architectural plans, design concepts, or industrial metrics to this partner's HQ.</p>
                                        <Button
                                            onClick={() => setShowDesignModal(true)}
                                            className="h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl"
                                        >
                                            UPLOAD INITIAL ASSET
                                        </Button>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="inventory">
                                <Card className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto text-left">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Material Identity</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand Mark</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">In Reserve</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Price</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {client.inventory_items?.length > 0 ? client.inventory_items.map(item => (
                                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                                    <Package size={18} />
                                                                </div>
                                                                <span className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{item.brand?.name || 'Generic'}</span>
                                                        </td>
                                                        <td className="px-8 py-5 text-center">
                                                            <Badge variant={item.quantity_in_stock < 10 ? 'warning' : 'success'} className="font-mono">
                                                                {item.quantity_in_stock} {item.unit}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-8 py-5 text-sm font-black text-indigo-600">
                                                            ৳{Number(item.unit_price).toLocaleString()}
                                                        </td>
                                                        <td className="px-8 py-5 text-right">
                                                            <Link href={route('inventory.edit', item.id)}>
                                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800">
                                                                    <ChevronRight size={18} />
                                                                </Button>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="5" className="px-8 py-20 text-center">
                                                            <div className="flex flex-col items-center gap-4 opacity-50">
                                                                <Layers size={48} />
                                                                <p className="font-bold uppercase tracking-widest text-xs">No Linked Material Reserve</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Tactical Modals */}
            <Modal show={showPaymentModal} onClose={() => setShowPaymentModal(false)} maxWidth="lg">
                <div className="p-10 bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <CreditCard size={20} />
                        </div>
                        Record Inbound Intelligence
                    </h2>
                    <form onSubmit={handleRecordPayment} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <InputLabel value="Strategic Date" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1" />
                                <TextInput
                                    type="date"
                                    className="w-full h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold"
                                    value={paymentForm.data.payment_date}
                                    onChange={(e) => paymentForm.setData('payment_date', e.target.value)}
                                    required
                                />
                                <InputError message={paymentForm.errors.payment_date} />
                            </div>
                            <div className="space-y-2">
                                <InputLabel value="Monetary Value (৳)" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1" />
                                <TextInput
                                    type="number"
                                    step="0.01"
                                    className="w-full h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold"
                                    value={paymentForm.data.amount}
                                    onChange={(e) => paymentForm.setData('amount', e.target.value)}
                                    required
                                />
                                <InputError message={paymentForm.errors.amount} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <InputLabel value="Payment Protocol" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1" />
                            <select
                                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold appearance-none cursor-pointer"
                                value={paymentForm.data.payment_method}
                                onChange={(e) => paymentForm.setData('payment_method', e.target.value)}
                                required
                            >
                                <option value="">Select Protocol</option>
                                {paymentMethods.map((method) => (
                                    <option key={method.id} value={method.code}>{method.name}</option>
                                ))}
                            </select>
                            <InputError message={paymentForm.errors.payment_method} />
                        </div>
                        <div className="space-y-2">
                            <InputLabel value="Briefing Notes" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1" />
                            <textarea
                                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-semibold resize-none"
                                rows="3"
                                value={paymentForm.data.notes}
                                onChange={(e) => paymentForm.setData('notes', e.target.value)}
                                placeholder="Tactical context..."
                            />
                        </div>
                        <div className="flex gap-3 pt-6">
                            <Button type="button" variant="outline" className="flex-1 h-14 rounded-2xl border-none bg-slate-100 dark:bg-slate-800 font-bold" onClick={() => setShowPaymentModal(false)}>
                                Abort
                            </Button>
                            <Button type="submit" disabled={paymentForm.processing} className="flex-1 h-14 rounded-2xl bg-indigo-600 text-white font-black shadow-lg">
                                {paymentForm.processing ? 'Syncing...' : 'Confirm Realization'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Design Modal */}
            <Modal show={showDesignModal} onClose={() => setShowDesignModal(false)} maxWidth="lg">
                <div className="p-10 bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <Upload size={20} />
                        </div>
                        Deploy Visual Asset
                    </h2>
                    <form onSubmit={handleUploadDesign} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <InputLabel value="Asset Title" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1" />
                                <TextInput
                                    type="text"
                                    required
                                    className="w-full h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold"
                                    value={designForm.data.title}
                                    onChange={e => designForm.setData('title', e.target.value)}
                                    placeholder="e.g. Master Plan Alpha"
                                />
                                <InputError message={designForm.errors.title} />
                            </div>
                            <div className="space-y-2">
                                <InputLabel value="Operational Link" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1" />
                                <select
                                    className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold appearance-none cursor-pointer"
                                    value={designForm.data.project_id}
                                    onChange={e => designForm.setData('project_id', e.target.value)}
                                >
                                    <option value="">Global Resource</option>
                                    {client.projects?.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <InputLabel value="Encrypted File Payload" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1" />
                            <div className="relative group h-32 rounded-3xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-4 hover:border-indigo-600 transition-all cursor-pointer overflow-hidden shadow-inner">
                                {designForm.data.file ? (
                                    <div className="text-center">
                                        <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs">{designForm.data.file.name}</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="text-slate-300 mb-2" size={32} />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Click to link payload</p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    required
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={e => designForm.setData('file', e.target.files[0])}
                                />
                            </div>
                            <InputError message={designForm.errors.file} />
                        </div>
                        <div className="space-y-2">
                            <InputLabel value="Strategic Context" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1" />
                            <textarea
                                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-semibold resize-none"
                                rows="3"
                                value={designForm.data.description}
                                onChange={e => designForm.setData('description', e.target.value)}
                                placeholder="Asset briefing..."
                            />
                        </div>
                        <div className="flex gap-3 pt-6">
                            <Button type="button" variant="outline" className="flex-1 h-14 rounded-2xl border-none bg-slate-100 dark:bg-slate-800 font-bold" onClick={() => setShowDesignModal(false)}>
                                Abort
                            </Button>
                            <Button type="submit" disabled={designForm.processing} className="flex-1 h-14 rounded-2xl bg-indigo-600 text-white font-black shadow-lg">
                                {designForm.processing ? 'Deploying...' : 'Deploy Asset'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </FigmaLayout>
    );
}
