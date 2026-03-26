import React from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    Calendar,
    Tag,
    Briefcase,
    FileText,
    Receipt,
    Upload,
    CheckCircle2,
    X,
    CreditCard,
    DollarSign,
    Box,
    Zap,
    ShieldCheck,
    Loader2,
    Activity,
    Plus,
    Building2,
    ExternalLink
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import { cn } from '@/lib/utils';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Create({ auth, categories = [], projects = [], paymentMethods = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        expense_category_id: '',
        project_id: '',
        title: '',
        description: '',
        amount: '',
        expense_date: new Date().toISOString().split('T')[0],
        payment_method: '',
        vendor_name: '',
        receipt: null,
        status: 'pending',
        is_reimbursable: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('expenses.store'), {
            forceFormData: true,
        });
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Log Capital Outflow" />

            <div className="space-y-10 pb-32">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <Link href={route('expenses.index')}>
                            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:scale-105 transition-all">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                                Log Outflow
                            </h1>
                            <div className="flex items-center gap-2">
                                <Activity size={12} className="text-indigo-600" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none italic">New Expenditure Protocol</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Badge className="px-5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 border-2 border-indigo-100 dark:border-indigo-800 font-black text-[10px] uppercase tracking-widest shadow-sm">
                            Phase: Initiation
                        </Badge>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Main Synthesis Panel */}
                    <div className="lg:col-span-8 space-y-10">
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none rotate-12">
                                <Receipt size={240} className="text-indigo-600" />
                            </div>

                            <CardContent className="p-10 md:p-14 space-y-12 relative z-10">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 pl-2 mb-2">
                                        <div className="w-2 h-8 rounded-full bg-indigo-600" />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Operational Core</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <InputLabel value="Expenditure Title" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                        <TextInput
                                            className="w-full h-18 pl-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] font-black text-xl text-slate-900 dark:text-white placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-600/10 shadow-inner group transition-all"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="e.g. Server Infrastructure Q2"
                                            required
                                        />
                                        <InputError message={errors.title} className="pl-4 mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <InputLabel value="Expenditure Node" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                <Tag size={18} />
                                            </div>
                                            <select
                                                value={data.expense_category_id}
                                                onChange={(e) => setData('expense_category_id', e.target.value)}
                                                className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white appearance-none focus:ring-4 focus:ring-indigo-600/10 shadow-inner group transition-all"
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <InputLabel value="Settlement Vector" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                <CreditCard size={18} />
                                            </div>
                                            <select
                                                value={data.payment_method}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white appearance-none focus:ring-4 focus:ring-indigo-600/10 shadow-inner group transition-all"
                                                required
                                            >
                                                <option value="">Select Protocol</option>
                                                <option value="cash">Petty Cash</option>
                                                <option value="bank_transfer">Corporate Transfer</option>
                                                <option value="cheque">Cheque Protocol</option>
                                                <option value="credit_card">Corporate Card</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <InputLabel value="Occurrence Date" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                <Calendar size={18} />
                                            </div>
                                            <input
                                                type="date"
                                                value={data.expense_date}
                                                onChange={(e) => setData('expense_date', e.target.value)}
                                                className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-600/10 shadow-inner group transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <InputLabel value="Vendor Entity" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                <Building2 size={18} />
                                            </div>
                                            <TextInput
                                                className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-600/10 shadow-inner group transition-all"
                                                value={data.vendor_name}
                                                onChange={(e) => setData('vendor_name', e.target.value)}
                                                placeholder="Supplier / Merchant"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 pl-2 mb-2">
                                        <div className="w-2 h-8 rounded-full bg-slate-200" />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Project Allocation & Intel</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <InputLabel value="Linked Project Manifest" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                <Box size={18} />
                                            </div>
                                            <select
                                                value={data.project_id}
                                                onChange={(e) => setData('project_id', e.target.value)}
                                                className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white appearance-none focus:ring-4 focus:ring-indigo-600/10 shadow-inner group transition-all"
                                            >
                                                <option value="">No Active Project Link</option>
                                                {projects.map((p) => (
                                                    <option key={p.id} value={p.id}>{p.title || p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <InputLabel value="Strategic Briefing" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows="5"
                                            className="w-full p-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] font-bold text-sm resize-none focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all placeholder:text-slate-300"
                                            placeholder="Detail the necessity and outcome of this capital deployment..."
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Fiscal Command Lateral */}
                    <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-8">
                        {/* Capital Magnitude Card */}
                        <Card className="rounded-[44px] border-none bg-indigo-600 shadow-2xl shadow-indigo-100 dark:shadow-none overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none -rotate-12 translate-x-12 -translate-y-12">
                                <DollarSign size={240} />
                            </div>

                            <CardContent className="p-10 space-y-10 relative z-10 text-white">
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
                                            onChange={(e) => setData('amount', e.target.value)}
                                            step="0.01"
                                            className="w-full bg-white/10 border-none rounded-[1.8rem] pl-16 pr-8 py-8 text-4xl font-black text-white focus:ring-4 focus:ring-white/20 outline-none transition-all placeholder:text-white/20 tracking-tighter italic"
                                            required
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <InputError message={errors.amount} className="text-rose-300 font-black text-[10px] uppercase tracking-widest pl-2" />
                                </div>

                                <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 space-y-6">
                                    <div className="space-y-3">
                                        <InputLabel value="Target Audit State" className="text-[10px] font-black uppercase tracking-widest text-indigo-200/50" />
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full h-14 bg-white/10 border-none rounded-2xl px-6 font-black text-[10px] uppercase tracking-[0.2em] text-white focus:ring-2 focus:ring-white/20 appearance-none transition-all lg:text-indigo-600"
                                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                                        >
                                            <option value="pending" className="text-slate-900">PENDING AUDIT</option>
                                            <option value="approved" className="text-slate-900">APPROVED LOG</option>
                                            <option value="paid" className="text-slate-900">SETTLED FLOW</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-4 px-2">
                                        <div className="relative w-12 h-6 bg-white/20 rounded-full cursor-pointer transition-colors has-[:checked]:bg-emerald-400" onClick={() => setData('is_reimbursable', !data.is_reimbursable)}>
                                            <input
                                                type="checkbox"
                                                id="reimbursable"
                                                checked={data.is_reimbursable}
                                                onChange={(e) => setData('is_reimbursable', e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={cn("absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300", data.is_reimbursable && "translate-x-6")} />
                                        </div>
                                        <label htmlFor="reimbursable" className="text-xs font-black uppercase tracking-widest text-indigo-50 cursor-pointer italic">Reimbursable Asset</label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Artifact Attachment Pipeline */}
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 p-10 space-y-8 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                                    <Receipt size={18} />
                                </div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white italic">Artifact Attachment</h4>
                            </div>

                            <div className="relative group overflow-hidden rounded-[2rem]">
                                <div className="border-4 border-dashed border-slate-50 dark:border-slate-800 rounded-[2rem] p-10 text-center group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-900/10 group-hover:border-indigo-100 transition-all cursor-pointer">
                                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-sm mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Upload size={24} className="text-slate-300 group-hover:text-indigo-600" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic leading-relaxed">
                                        {data.receipt ? data.receipt.name : 'Synchronize Digital Evidence'}
                                    </p>
                                    <p className="text-[9px] font-bold text-slate-300 uppercase mt-2">PDF, JPG, PNG (Max 5MB)</p>
                                </div>
                                <input
                                    type="file"
                                    onChange={(e) => setData('receipt', e.target.files[0])}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                            </div>
                        </Card>

                        {/* Submission Protocols */}
                        <div className="space-y-4 pt-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full h-20 rounded-[2.2rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl shadow-2xl shadow-indigo-100 dark:shadow-none gap-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {processing ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        <ShieldCheck size={28} />
                                        <span className="uppercase italic tracking-tighter">Secure Outflow</span>
                                    </>
                                )}
                            </Button>

                            <div className="flex items-center gap-3 justify-center py-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2rem]">
                                <CheckCircle2 size={14} className="text-emerald-500" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">Validated System Protocol</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                select option {
                    background-color: white !important;
                    color: #1e293b !important;
                    padding: 20px !important;
                    font-weight: 700;
                }
                .dark select option {
                    background-color: #0f172a !important;
                    color: #f8fafc !important;
                }
            ` }} />
        </FigmaLayout>
    );
}
