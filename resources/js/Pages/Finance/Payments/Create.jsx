import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    CreditCard,
    Calendar,
    Hash,
    User,
    FileText,
    Receipt,
    Upload,
    Check,
    Activity,
    ShieldCheck,
    Zap,
    DollarSign,
    Briefcase,
    Building,
    FileUp,
    X,
    Loader2,
    History
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { cn } from '@/lib/utils';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Create({ auth, clients, invoices, paymentMethods = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        invoice_id: '',
        client_id: '',
        project_id: '',
        payment_type: 'incoming',
        payment_date: new Date().toISOString().split('T')[0],
        amount: '',
        payment_method: paymentMethods.length > 0 ? paymentMethods[0].code : '',
        reference_number: '',
        status: 'completed',
        notes: '',
        receipt: null
    });

    const [filteredProjects, setFilteredProjects] = useState([]);

    const handleClientChange = (clientId) => {
        setData(prev => ({ ...prev, client_id: clientId, invoice_id: '', project_id: '', amount: '' }));
        if (clientId) {
            const client = clients.find(c => c.id == clientId);
            setFilteredProjects(client?.projects || []);
        } else {
            setFilteredProjects([]);
        }
    };

    const handleProjectSelect = (project) => {
        const remaining = parseFloat(project.budget) - (parseFloat(project.payments_sum_amount) || 0);
        setData(prev => ({
            ...prev,
            project_id: project.id,
            amount: remaining > 0 ? remaining : 0
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('payments.store'));
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Initialize Capital Receipt" />

            <div className="space-y-10 pb-32">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <Link href={route('payments.index')}>
                            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:scale-105 transition-all">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                                Record Intake
                            </h1>
                            <div className="flex items-center gap-2">
                                <Activity size={12} className="text-indigo-600" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none italic">Fiscal Receipt Protocol Initiation</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 border-2 border-indigo-100 dark:border-indigo-800 font-black text-[10px] uppercase tracking-widest shadow-sm">
                            Vector: Incoming
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Main Synthesis Panel */}
                    <div className="lg:col-span-8 space-y-10">
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none rotate-12">
                                <CreditCard size={240} className="text-indigo-600" />
                            </div>

                            <CardContent className="p-10 md:p-14 space-y-12 relative z-10">
                                {/* Logistics Entity Alignment */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 pl-2 mb-2">
                                        <div className="w-2 h-8 rounded-full bg-indigo-600" />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Entity Alignment</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <InputLabel value="Capital Source (Client)" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                    <Building size={18} />
                                                </div>
                                                <select
                                                    className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white appearance-none focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all"
                                                    value={data.client_id}
                                                    onChange={e => handleClientChange(e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select Origin Entity</option>
                                                    {clients.map(client => (
                                                        <option key={client.id} value={client.id}>{client.company_name || client.name}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-indigo-600">
                                                    <Check size={18} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <InputLabel value="Allocation Vector (Project)" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                            <div className={cn(
                                                "relative group transition-opacity",
                                                !data.client_id && "opacity-30 cursor-not-allowed"
                                            )}>
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                    <Briefcase size={18} />
                                                </div>
                                                <select
                                                    className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white appearance-none focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all"
                                                    value={data.project_id}
                                                    onChange={e => {
                                                        const proj = filteredProjects.find(p => p.id == e.target.value);
                                                        if (proj) handleProjectSelect(proj);
                                                        else setData('project_id', e.target.value);
                                                    }}
                                                    disabled={!data.client_id}
                                                >
                                                    <option value="">General Payment</option>
                                                    {filteredProjects.map(project => (
                                                        <option key={project.id} value={project.id}>{project.title}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-indigo-600">
                                                    <Check size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Fiscal Parameters */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 pl-2 mb-2">
                                        <div className="w-2 h-8 rounded-full bg-emerald-500" />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Temporal & Modal Parameters</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <InputLabel value="Realization Date" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                    <Calendar size={18} />
                                                </div>
                                                <TextInput
                                                    type="date"
                                                    className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all"
                                                    value={data.payment_date}
                                                    onChange={e => setData('payment_date', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <InputLabel value="Capital Gateway (Method)" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                    <CreditCard size={18} />
                                                </div>
                                                <select
                                                    className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white appearance-none focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all"
                                                    value={data.payment_method}
                                                    onChange={e => setData('payment_method', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select Gateway</option>
                                                    {paymentMethods.map(method => (
                                                        <option key={method.id} value={method.code}>{method.name}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-indigo-600">
                                                    <Check size={18} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <InputLabel value="Reference Vector (Auth No.)" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                    <Hash size={18} />
                                                </div>
                                                <TextInput
                                                    className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all"
                                                    value={data.reference_number}
                                                    onChange={e => setData('reference_number', e.target.value)}
                                                    placeholder="e.g. TXN-9901-X"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <InputLabel value="Lifecycle Status" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                            <select
                                                className="w-full h-16 px-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-300 appearance-none focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all"
                                                value={data.status}
                                                onChange={e => setData('status', e.target.value)}
                                            >
                                                <option value="completed">COMPLETED OPS</option>
                                                <option value="pending">PENDING VERIFICATION</option>
                                                <option value="failed">FAILED PROTOCOL</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm p-10 md:p-14 space-y-10">
                            <div className="space-y-4">
                                <InputLabel value="Fiscal Intelligence Notes" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                <div className="relative group">
                                    <div className="absolute left-6 top-6 text-slate-300 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
                                        <FileText size={20} />
                                    </div>
                                    <textarea
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] p-8 pl-16 font-bold text-slate-600 dark:text-slate-300 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-600/10 shadow-inner min-h-[200px] transition-all"
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        placeholder="Enter strategic context or transaction details..."
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Magnitude & Receipt Lateral */}
                    <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-8">
                        {/* Capital Magnitude Card */}
                        <Card className="rounded-[44px] border-none bg-indigo-600 shadow-2xl shadow-indigo-100 dark:shadow-none overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none -rotate-12 translate-x-12 -translate-y-12">
                                <DollarSign size={240} />
                            </div>

                            <CardContent className="p-10 space-y-8 relative z-10 text-white">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <InputLabel value="Capital Magnitude" className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100/60 pl-2" />
                                        <Zap size={16} className="text-indigo-300 animate-pulse" />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 font-black text-2xl pointer-events-none">৳</div>
                                        <input
                                            type="number"
                                            value={data.amount}
                                            onChange={e => setData('amount', e.target.value)}
                                            className="w-full bg-white/10 border-none rounded-[1.8rem] pl-16 pr-8 py-8 text-4xl font-black text-white focus:ring-4 focus:ring-white/20 outline-none transition-all placeholder:text-white/20 tracking-tighter italic"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-100/50">Fiscal Receipt Document</p>
                                    <div className="relative group">
                                        <div className={cn(
                                            "w-full h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all px-4 text-center",
                                            data.receipt ? "bg-white/20 border-white/40" : "bg-white/5 border-white/20 hover:border-white/40 group-hover:bg-white/10"
                                        )}>
                                            {data.receipt ? (
                                                <div className="text-center space-y-2">
                                                    <Check size={24} className="mx-auto text-white" />
                                                    <p className="text-[9px] font-black uppercase tracking-widest truncate max-w-full italic">{data.receipt.name}</p>
                                                    <button type="button" onClick={() => setData('receipt', null)} className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors underline decoration-dotted">REPLACE DOCUMENT</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <FileUp size={24} className="text-white/40 mb-2 group-hover:scale-110 group-hover:text-white transition-all" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white font-medium">Upload Receipt</p>
                                                </>
                                            )}
                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setData('receipt', e.target.files[0])} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submission Protocols */}
                        <div className="space-y-4 pt-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full h-20 rounded-[2.2rem] bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 text-white font-black text-xl shadow-2xl shadow-indigo-100 dark:shadow-none gap-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {processing ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        <ShieldCheck size={28} />
                                        <span className="uppercase italic tracking-tighter">Commit Record</span>
                                    </>
                                )}
                            </Button>

                            <div className="flex items-center gap-3 justify-center py-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2rem]">
                                <Activity size={14} className="text-indigo-500 animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">Secure Ledger Realization</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </FigmaLayout>
    );
}
