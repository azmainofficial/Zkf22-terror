import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Download,
    Printer,
    Mail,
    Edit,
    Trash2,
    CheckCircle2,
    Clock,
    AlertCircle,
    Calendar,
    Building2,
    User,
    CreditCard,
    ChevronLeft,
    Receipt,
    ExternalLink,
    ShieldCheck,
    Coins,
    History,
    FileText,
    Sparkles,
    CalendarClock,
    DollarSign,
    Zap,
    Briefcase
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import { cn } from '@/lib/utils';

export default function Show({ auth, invoice, slipDesign }) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this invoice?')) {
            router.delete(route('invoices.destroy', invoice.id));
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // Design styles derived from slipDesign or defaults
    const styles = {
        fontFamily: slipDesign?.font_family || 'Inter, sans-serif',
        accentColor: slipDesign?.accent_color || '#4f46e5', // Default Indigo 600
        footerText: slipDesign?.footer_text || '',
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'sent': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'overdue': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            case 'cancelled': return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
            default: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
        }
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Fiscal Dossier - ${invoice.invoice_number}`} />

            <div className="space-y-10 pb-32 print:p-0">
                {/* Tactical Header - Hidden on Print */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
                    <div className="flex items-center gap-6">
                        <Link href={route('invoices.index')}>
                            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:scale-105 transition-all">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">
                                Fiscal Dossier
                            </h1>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none">Verified Billing Intelligence</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={handlePrint}
                            className="h-14 px-8 rounded-2xl bg-white dark:bg-slate-900 border-none shadow-sm font-bold tracking-tight hover:scale-[1.02] transition-all gap-3"
                        >
                            <Printer size={18} />
                            Print Script
                        </Button>
                        <Link href={route('invoices.edit', invoice.id)}>
                            <Button className="h-14 px-8 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white font-black shadow-xl hover:scale-[1.02] transition-all gap-3">
                                <Edit size={18} />
                                Modify Record
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            onClick={handleDelete}
                            className="w-14 h-14 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all hover:scale-105"
                        >
                            <Trash2 size={20} />
                        </Button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start print:block">
                    {/* Invoice Visual Panel: Left Column (or main in print) */}
                    <div className="lg:col-span-8 print:w-full space-y-10">
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden relative print:shadow-none print:border-none print:rounded-none">
                            {/* Paper Header */}
                            <div className="p-12 md:p-16 relative overflow-hidden" style={{ backgroundColor: styles.accentColor }}>
                                <div className="absolute top-0 right-0 p-16 opacity-10 no-print">
                                    <Receipt size={240} className="rotate-12" />
                                </div>

                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 text-white">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                                                <Sparkles size={32} />
                                            </div>
                                            <div>
                                                <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Invoice</h1>
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mt-2">Fiscal realization document</p>
                                            </div>
                                        </div>
                                        <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                                            <p className="font-mono font-bold tracking-widest text-lg">{invoice.invoice_number}</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Net Realization</p>
                                        <p className="text-6xl font-black tracking-tighter leading-none italic">
                                            <span className="text-2xl opacity-40 mr-1 not-italic tracking-normal font-sans">৳</span>
                                            {Number(invoice.total_amount).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Paper Body */}
                            <CardContent className="p-12 md:p-16 space-y-20 relative">
                                {/* Watermark */}
                                {slipDesign?.watermark_image && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
                                        <img src={`/storage/${slipDesign.watermark_image}`} className="w-3/4 object-contain" />
                                    </div>
                                )}

                                {/* Dossier Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                                    <div className="space-y-8">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: styles.accentColor }} /> Operational Hub
                                            </p>
                                            <div className="space-y-1">
                                                <p className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">ZK Base Corp</p>
                                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Headquarters</p>
                                                <p className="text-sm text-slate-400 dark:text-slate-500 leading-relaxed max-w-[240px]">
                                                    Innovation Labs, Building 7<br />
                                                    Tech City, Sector 12<br />
                                                    Dhaka, Bangladesh
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:text-right space-y-8">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-2 md:justify-end">
                                                Target Intelligence <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
                                            </p>
                                            <div className="space-y-1">
                                                <p className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">
                                                    {invoice.client?.company_name || invoice.client?.name}
                                                </p>
                                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{invoice.client?.name}</p>
                                                <p className="text-sm text-slate-400 dark:text-slate-500 leading-relaxed whitespace-pre-line ml-auto max-w-[240px]">
                                                    {invoice.client?.address || 'Operational address unspecified'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline Matrix */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-10 border-y-2 border-dashed border-slate-100 dark:border-slate-800 relative z-10">
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Initiation</p>
                                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase">
                                            {new Date(invoice.invoice_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="space-y-2 md:text-center">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Deadline</p>
                                        <p className="text-sm font-black text-rose-500 uppercase">
                                            {new Date(invoice.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="space-y-2 md:text-center">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Ref ID</p>
                                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic">#{invoice.id.toString().padStart(6, '0')}</p>
                                    </div>
                                    <div className="space-y-2 md:text-right">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Realized</p>
                                        <p className="text-sm font-black text-emerald-500 uppercase italic">৳{Number(invoice.paid_amount || 0).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Resource Allocation Manifest */}
                                <div className="space-y-8 relative z-10">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic flex items-center gap-3">
                                        <Zap size={14} style={{ color: styles.accentColor }} /> Resource Allocation Manifest
                                    </h3>

                                    <div className="overflow-hidden rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-inner">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    <th className="px-8 py-6 text-left w-20">#</th>
                                                    <th className="px-8 py-6 text-left">Operational Description</th>
                                                    <th className="px-8 py-6 text-center w-32">Units</th>
                                                    <th className="px-8 py-6 text-right w-40">Unit Cost</th>
                                                    <th className="px-8 py-6 text-right w-40">Total Yield</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {invoice.items?.map((item, index) => (
                                                    <tr key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                                                        <td className="px-8 py-8 text-xs font-black text-slate-300">{(index + 1).toString().padStart(2, '0')}</td>
                                                        <td className="px-8 py-8">
                                                            <p className="text-sm font-black text-slate-900 dark:text-white leading-tight uppercase italic">{item.description}</p>
                                                        </td>
                                                        <td className="px-8 py-8 text-center text-sm font-black text-slate-500 italic">{item.quantity}</td>
                                                        <td className="px-8 py-8 text-right text-sm font-black text-slate-500 tracking-tighter">৳{Number(item.unit_price).toLocaleString()}</td>
                                                        <td className="px-8 py-8 text-right text-base font-black text-slate-900 dark:text-white italic tracking-tighter">৳{Number(item.quantity * item.unit_price).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
                                    {/* Briefing & Terms */}
                                    <div className="space-y-12">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                    <Briefcase size={16} />
                                                </div>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Protocols & Terms</h4>
                                            </div>
                                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic border-l-4 border-slate-100 dark:border-slate-800 pl-6">
                                                {invoice.terms || "Operational engagement protocols apply. Asset synchronization required by deadline."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Fiscal Summation */}
                                    <div className="bg-slate-950 dark:bg-slate-800/50 rounded-[40px] p-10 text-white relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 p-10 opacity-[0.05] -rotate-12 transition-transform group-hover:scale-110">
                                            <DollarSign size={160} />
                                        </div>

                                        <div className="relative z-10 space-y-6">
                                            <div className="flex justify-between items-center text-slate-500 font-black uppercase tracking-widest text-[9px]">
                                                <span>Gross Yield</span>
                                                <span className="text-white">৳{Number(invoice.subtotal).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-slate-500 font-black uppercase tracking-widest text-[9px]">
                                                <span>Taxation Synthesis</span>
                                                <span className="text-emerald-400">+ ৳{Number(invoice.tax_amount).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-slate-500 font-black uppercase tracking-widest text-[9px] pb-6 border-b border-white/5">
                                                <span>Tactical Adjustment</span>
                                                <span className="text-rose-400">- ৳{Number(invoice.discount_amount || 0).toLocaleString()}</span>
                                            </div>

                                            <div className="pt-4 space-y-2">
                                                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-600 italic">Net Summation</p>
                                                <p className="text-5xl font-black italic tracking-tighter leading-none" style={{ color: styles.accentColor }}>
                                                    <span className="text-2xl not-italic mr-1 opacity-40 font-sans tracking-normal font-normal">৳</span>
                                                    {Number(invoice.total_amount).toLocaleString()}
                                                </p>
                                            </div>

                                            {invoice.paid_amount > 0 && (
                                                <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[9px] font-black uppercase text-slate-600">Realized Asset</span>
                                                        <span className="text-xs font-black text-emerald-400">৳{Number(invoice.paid_amount).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Outstanding Delta</span>
                                                        <span className="text-2xl font-black text-white italic tracking-tighter">৳{Number(invoice.balance).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>

                            {/* Artifact Footer */}
                            <div className="p-12 md:p-16 border-t border-slate-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-end gap-16 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
                                <div className="space-y-4">
                                    <div className="w-48 h-1" style={{ backgroundColor: styles.accentColor }} />
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Authorized System Validator</p>
                                </div>
                                <div className="text-right space-y-4">
                                    {styles.footerText && (
                                        <p className="text-xs font-black text-slate-500 uppercase italic max-w-sm ml-auto">{styles.footerText}</p>
                                    )}
                                    <div className="flex items-center gap-3 justify-end text-slate-300 dark:text-slate-600">
                                        <Coins size={14} />
                                        <p className="text-[9px] font-black uppercase tracking-[0.4em]">Integrated Office Core v1.0</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Operational Intel: Right Column - Hidden on Print */}
                    <div className="lg:col-span-4 space-y-10 no-print lg:sticky lg:top-8">
                        {/* Transaction Intel */}
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm p-10 space-y-10">
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                                        <History size={18} />
                                    </div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white italic">Asset History</h4>
                                </div>

                                <div className="space-y-6">
                                    {invoice.payments && invoice.payments.length > 0 ? (
                                        invoice.payments.map((payment, i) => (
                                            <div key={i} className="relative pl-8 border-l-2 border-slate-100 dark:border-slate-800 pb-6 last:pb-0">
                                                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900" />
                                                <div className="space-y-1">
                                                    <p className="text-sm font-black text-slate-900 dark:text-white">৳{Number(payment.amount).toLocaleString()}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        {new Date(payment.payment_date).toLocaleDateString()} via {payment.payment_method || 'System Transfer'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 space-y-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px]">
                                            <AlertCircle className="mx-auto text-slate-200" size={32} />
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">No assets realized</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="h-px bg-slate-100 dark:bg-slate-800" />

                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <Download size={18} />
                                    </div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white italic">Export Protocols</h4>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <a
                                        href={route('invoices.export', invoice.id)}
                                        className="h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-xl shadow-emerald-500/20"
                                    >
                                        <FileText size={16} /> Export Intelligence (XLS)
                                    </a>
                                    <Button
                                        variant="outline"
                                        className="h-14 rounded-2xl border-none bg-slate-100 dark:bg-slate-800 font-black text-[10px] uppercase tracking-widest gap-3"
                                        onClick={() => window.open(route('invoices.export', invoice.id), '_blank')}
                                    >
                                        <ExternalLink size={16} /> Asset Transmission
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Operational Status */}
                        <Card className="rounded-[44px] border-none bg-slate-50 dark:bg-slate-800/50 p-10">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Core Status</h4>
                                <Badge className={cn("px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest border-2", getStatusColor(invoice.status))}>
                                    {invoice.status}
                                </Badge>
                            </div>
                            <div className="p-6 bg-white dark:bg-slate-900 rounded-[28px] shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Last Update</p>
                                        <p className="text-xs font-black text-slate-900 dark:text-white">{new Date(invoice.updated_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { size: A4; margin: 0; }
                    .no-print { display: none !important; }
                    body { background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    .FigmaLayout { background: white !important; padding: 0 !important; }
                    .max-w-7xl { max-width: 100% !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
                    .bg-white { box-shadow: none !important; border: none !important; margin: 0 !important; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `}} />
        </FigmaLayout>
    );
}
