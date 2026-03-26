import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    FileText,
    Upload,
    Calendar,
    Users,
    CreditCard,
    Info,
    CheckCircle2,
    DollarSign,
    Calculator,
    AlertCircle,
    X,
    ChevronDown,
    Loader2,
    Layout,
    Receipt,
    History,
    FileCheck,
    Coins,
    Sparkles,
    CalendarClock,
    FileWarning,
    Package,
    Minus
} from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { cn } from '@/lib/utils';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Create({ auth, clients }) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        tax_amount: 0,
        discount_amount: 0,
        notes: '',
        terms: '',
        attachment: null,
        is_recurring: false,
        recurring_interval: 'monthly',
        items: [{ description: '', quantity: 1, unit_price: 0 }]
    });

    const addItem = () => {
        setData('items', [...data.items, { description: '', quantity: 1, unit_price: 0 }]);
    };

    const removeItem = (index) => {
        if (data.items.length > 1) {
            const newItems = data.items.filter((_, i) => i !== index);
            setData('items', newItems);
        }
    };

    const updateItem = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;
        setData('items', newItems);
    };

    const subtotal = data.items.reduce((sum, item) => {
        return sum + (parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0));
    }, 0);

    const total = subtotal + parseFloat(data.tax_amount || 0) - parseFloat(data.discount_amount || 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('invoices.store'), {
            forceFormData: true,
        });
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Fiscal Engineering Surface" />

            <div className="space-y-10 pb-32">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <Link href={route('invoices.index')}>
                            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:scale-105 transition-all">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">
                                Fiscal Engineering
                            </h1>
                            <div className="flex items-center gap-2">
                                <Sparkles size={14} className="text-indigo-600 animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none">High-Precision Billing Generation</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="h-14 px-8 rounded-2xl bg-white dark:bg-slate-900 border-none shadow-sm font-bold tracking-tight hover:scale-[1.02] transition-all"
                            onClick={() => window.history.back()}
                        >
                            Abort Sync
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={processing}
                            className="h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] gap-3"
                        >
                            {processing ? <Loader2 className="animate-spin" size={20} /> : <FileCheck size={20} strokeWidth={2.5} />}
                            <span>Finalize Realization</span>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Engineering Bay: Left Column */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Partner Linkage */}
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden p-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Target Intelligence</h3>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic">Partner Linkage</h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <InputLabel value="Operational Partner" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-2" />
                                    <div className="relative group">
                                        <select
                                            value={data.client_id}
                                            onChange={(e) => setData('client_id', e.target.value)}
                                            className={cn(
                                                "w-full h-16 pl-6 pr-12 bg-slate-50 dark:bg-slate-800/80 border-none rounded-3xl font-bold text-slate-900 dark:text-white appearance-none transition-all focus:ring-2 focus:ring-indigo-600 shadow-inner",
                                                errors.client_id && "ring-2 ring-red-500/50"
                                            )}
                                            required
                                        >
                                            <option value="">Select Target Entity</option>
                                            {clients.map((client) => (
                                                <option key={client.id} value={client.id}>
                                                    {client.company_name || client.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <ChevronDown size={20} />
                                        </div>
                                    </div>
                                    <InputError message={errors.client_id} />
                                </div>

                                <div className="space-y-4">
                                    <InputLabel value="Operational Status" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-2" />
                                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[2rem] gap-1.5 shadow-inner h-16 items-center">
                                        {['draft', 'sent'].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setData('status', s)}
                                                className={cn(
                                                    "flex-1 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                                                    data.status === s
                                                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-lg"
                                                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                                )}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Billable Manifold */}
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                            <div className="p-10 pb-0 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                        <Receipt size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Resource Allocation</h3>
                                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic">Billable Manifold</h2>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    onClick={addItem}
                                    className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-indigo-100 dark:shadow-none"
                                >
                                    <Plus size={16} strokeWidth={3} /> Add Line Entry
                                </Button>
                            </div>

                            <CardContent className="p-10 space-y-8">
                                {data.items.map((item, index) => (
                                    <div key={index} className="group relative bg-slate-50/50 dark:bg-slate-800/50 rounded-[32px] p-8 border-2 border-transparent hover:border-indigo-600/20 transition-all shadow-inner">
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                                            <div className="lg:col-span-6 space-y-3">
                                                <InputLabel value="Resource Description" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2" />
                                                <TextInput
                                                    className="w-full h-14 bg-white dark:bg-slate-900 border-none rounded-2xl font-bold shadow-sm"
                                                    value={item.description}
                                                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                    placeholder="Enter operational service..."
                                                    required
                                                />
                                            </div>
                                            <div className="lg:col-span-2 space-y-3">
                                                <InputLabel value="Quantity" className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center block" />
                                                <TextInput
                                                    type="number"
                                                    className="w-full h-14 bg-white dark:bg-slate-900 border-none rounded-2xl font-black text-center shadow-sm"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                    min="1"
                                                    required
                                                />
                                            </div>
                                            <div className="lg:col-span-3 space-y-3">
                                                <InputLabel value="Unit Cost (৳)" className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right block" />
                                                <div className="relative">
                                                    <TextInput
                                                        type="number"
                                                        step="0.01"
                                                        className="w-full h-14 pl-10 pr-6 bg-white dark:bg-slate-900 border-none rounded-2xl font-black text-right shadow-sm"
                                                        value={item.unit_price}
                                                        onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                                                        placeholder="0.00"
                                                        required
                                                    />
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-indigo-600/40">৳</span>
                                                </div>
                                            </div>
                                            <div className="lg:col-span-1 flex justify-center pb-1">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    disabled={data.items.length === 1}
                                                    onClick={() => removeItem(index)}
                                                    className="w-12 h-12 rounded-2xl text-red-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-0"
                                                >
                                                    <Minus size={20} strokeWidth={3} />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Yield Prediction</span>
                                            <span className="font-black text-indigo-600 text-xl tracking-tighter">৳{(parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0)).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Strategic Briefing */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <Card className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm p-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <FileText size={18} />
                                    </div>
                                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white italic">Internal Briefing</h4>
                                </div>
                                <textarea
                                    className="w-full p-6 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl font-bold text-sm resize-none h-40 shadow-inner"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Add tactical notes or instructions..."
                                />
                            </Card>

                            <Card className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm p-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <FileWarning size={18} />
                                    </div>
                                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white italic">Terms of Engagement</h4>
                                </div>
                                <textarea
                                    className="w-full p-6 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl font-bold text-sm resize-none h-40 shadow-inner"
                                    value={data.terms}
                                    onChange={(e) => setData('terms', e.target.value)}
                                    placeholder="Outline fiscal protocols..."
                                />
                            </Card>
                        </div>
                    </div>

                    {/* Fiscal Analysis: Right Column */}
                    <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-8">
                        {/* Monetary Core */}
                        <Card className="rounded-[44px] border-none bg-slate-950 dark:bg-slate-900 shadow-2xl shadow-indigo-500/10 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardContent className="p-10 relative z-10">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 italic mb-10">Fiscal Summary</h3>

                                <div className="space-y-8">
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Gross Yield</span>
                                        <span className="font-black text-xl text-white tracking-tighter">৳{subtotal.toLocaleString()}</span>
                                    </div>

                                    <div className="space-y-4 bg-white/5 p-6 rounded-[32px] border border-white/5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Taxation (+)</span>
                                            <span className="text-emerald-400 font-bold">৳{parseFloat(data.tax_amount || 0).toLocaleString()}</span>
                                        </div>
                                        <TextInput
                                            type="number"
                                            step="0.01"
                                            className="w-full h-14 bg-white/5 border-none rounded-2xl px-6 font-black text-white text-lg"
                                            value={data.tax_amount}
                                            onChange={(e) => setData('tax_amount', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-4 bg-white/5 p-6 rounded-[32px] border border-white/5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-rose-400 text-[10px] font-black uppercase tracking-widest">Adjustment (-)</span>
                                            <span className="text-rose-400 font-bold">৳{parseFloat(data.discount_amount || 0).toLocaleString()}</span>
                                        </div>
                                        <TextInput
                                            type="number"
                                            step="0.01"
                                            className="w-full h-14 bg-white/5 border-none rounded-2xl px-6 font-black text-white text-lg"
                                            value={data.discount_amount}
                                            onChange={(e) => setData('discount_amount', e.target.value)}
                                        />
                                    </div>

                                    <div className="pt-8 border-t border-white/5">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-4 px-2 italic">Net Realization</p>
                                        <div className="relative group/total">
                                            <div className="absolute inset-0 bg-indigo-600/20 blur-2xl group-hover/total:bg-indigo-600/40 transition-all opacity-50" />
                                            <p className="relative text-5xl font-black text-white tracking-tighter leading-none py-2 px-2 drop-shadow-xl text-center md:text-left">
                                                ৳{total.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline Protocols */}
                        <Card className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm p-10 space-y-10">
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <CalendarClock size={18} />
                                    </div>
                                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white italic">Execution Dates</h4>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <InputLabel value="Cycle Initiation" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2" />
                                        <TextInput
                                            type="date"
                                            className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold shadow-inner"
                                            value={data.invoice_date}
                                            onChange={(e) => setData('invoice_date', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <InputLabel value="Realization Deadline" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2" />
                                        <TextInput
                                            type="date"
                                            className={cn(
                                                "w-full h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold shadow-inner",
                                                errors.due_date && "ring-2 ring-red-500/50"
                                            )}
                                            value={data.due_date}
                                            onChange={(e) => setData('due_date', e.target.value)}
                                        />
                                        <InputError message={errors.due_date} />
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-slate-100 dark:bg-slate-800" />

                            {/* Recurring Protocol */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                            <History size={18} />
                                        </div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white italic">Recurring</h4>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData('is_recurring', !data.is_recurring)}
                                        className={cn(
                                            "w-14 h-8 rounded-full transition-all relative flex items-center px-1 border-2",
                                            data.is_recurring ? "bg-indigo-600 border-indigo-600 justify-end" : "bg-slate-100 dark:bg-slate-800 border-transparent justify-start"
                                        )}
                                    >
                                        <div className="w-5 h-5 bg-white rounded-full shadow-md" />
                                    </button>
                                </div>

                                {data.is_recurring && (
                                    <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl gap-1 animate-in zoom-in-95 duration-300">
                                        {['monthly', 'yearly'].map((interval) => (
                                            <button
                                                key={interval}
                                                type="button"
                                                onClick={() => setData('recurring_interval', interval)}
                                                className={cn(
                                                    "flex-1 h-10 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all",
                                                    data.recurring_interval === interval
                                                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm"
                                                        : "text-slate-400"
                                                )}
                                            >
                                                {interval}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </FigmaLayout>
    );
}
