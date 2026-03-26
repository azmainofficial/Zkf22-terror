import React, { useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Printer,
    CreditCard,
    Calendar,
    Hash,
    User,
    FileText,
    Receipt as ReceiptIcon,
    Download,
    CheckCircle2,
    ArrowUpRight,
    ArrowDownLeft,
    Building2,
    ExternalLink,
    ShieldCheck,
    Zap,
    Briefcase,
    Activity
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Card, CardContent } from '@/Components/ui/Card';
import { cn } from '@/lib/utils';

export default function Show({ auth, payment, slipDesign }) {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('print') === 'true') {
            setTimeout(() => {
                window.print();
            }, 1000);
        }
    }, []);

    const handleDelete = () => {
        if (confirm('Permanently redact this transaction record from the fiscal ledger?')) {
            router.delete(route('payments.destroy', payment.id));
        }
    };

    // Design tokens from slipDesign or premium defaults
    const styles = {
        fontFamily: slipDesign?.font_family || 'Inter, sans-serif',
        accentColor: slipDesign?.accent_color || '#4f46e5', // Indigo-600
        footerText: slipDesign?.footer_text || 'This is a digitally generated document. No signature required.',
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Fiscal Dossier - ${payment.payment_number}`} />

            <div className="space-y-10 pb-32 print:p-0">
                {/* Tactical Header - Hidden on Print */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
                    <div className="flex items-center gap-6">
                        <Link href={route('payments.index')}>
                            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:scale-105 transition-all">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                                Transaction Intelligence
                            </h1>
                            <div className="flex items-center gap-2">
                                <Activity size={12} className="text-indigo-600" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none italic">Verified Fiscal Realization Record</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => window.print()}
                            className="h-12 px-6 rounded-2xl border-slate-100 dark:border-slate-800 font-black text-[10px] uppercase tracking-widest gap-2 bg-white dark:bg-slate-900 hover:bg-slate-50 transition-all"
                        >
                            <Printer size={16} /> PRINT SLIP
                        </Button>
                        <Link href={route('payments.edit', payment.id)}>
                            <Button className="h-12 px-6 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-slate-800 transition-all">
                                <Edit size={16} /> EDIT RECORD
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            onClick={handleDelete}
                            className="h-12 px-6 rounded-2xl text-rose-600 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all"
                        >
                            <Trash2 size={16} /> REDACT
                        </Button>
                    </div>
                </div>

                {/* Receipt Synthesis Surface */}
                <div className="max-w-4xl mx-auto print:max-w-none print:w-full">
                    <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-2xl shadow-slate-100 dark:shadow-none overflow-hidden print:rounded-none print:shadow-none print:border-none">
                        {/* High-Contrast Header Section */}
                        <div
                            className="p-10 md:p-16 text-white relative overflow-hidden"
                            style={{ backgroundColor: styles.accentColor }}
                        >
                            {/* Design Patterns */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-2xl pointer-events-none" />

                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        {slipDesign?.header_logo ? (
                                            <img src={`/storage/${slipDesign.header_logo}`} className="h-12 object-contain" />
                                        ) : (
                                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                                                <ReceiptIcon size={24} />
                                            </div>
                                        )}
                                        <h2 className="text-2xl font-black uppercase italic tracking-tighter">Fiscal Receipt</h2>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 leading-none">Transaction Token</p>
                                        <p className="text-lg font-black tracking-widest leading-none">{payment.payment_number}</p>
                                    </div>
                                </div>

                                <div className="text-left md:text-right space-y-4">
                                    <Badge className="bg-white/20 text-white border-none font-black text-[10px] uppercase tracking-[0.3em] px-5 py-2 rounded-full backdrop-blur-md">
                                        {payment.status.toUpperCase()}
                                    </Badge>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 leading-none">Capital Magnitude</p>
                                        <p className="text-5xl font-black tracking-tighter italic leading-none">৳{new Intl.NumberFormat().format(payment.amount)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dossier Content Surface */}
                        <CardContent className="p-10 md:p-16 space-y-16">
                            {/* Entity Alignment Matrix */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 rounded-full bg-slate-900 dark:bg-slate-700" />
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Origin Entity</h3>
                                    </div>
                                    <div className="space-y-2 pl-4">
                                        <p className="text-xl font-black text-slate-900 dark:text-white uppercase italic leading-tight">ZK Base Corp</p>
                                        <div className="space-y-1 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                                            <p>123 STRATEGIC HUB, SECTOR 7</p>
                                            <p>FINANCE DISTRICT, DHAKA</p>
                                            <p>TRANSREG: 9901-X-A</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 rounded-full bg-indigo-600" />
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Receiving Node</h3>
                                    </div>
                                    <div className="space-y-2 pl-4">
                                        <p className="text-xl font-black text-slate-900 dark:text-white uppercase italic leading-tight">
                                            {payment.client?.company_name || payment.client?.name || 'External Entity'}
                                        </p>
                                        <div className="space-y-1 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                                            <p>{payment.client?.address || 'ADDRESS PROTOCOL ABSENT'}</p>
                                            <p className="text-indigo-500">{payment.client?.email || 'COMMS PROTOCOL ABSENT'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Parameter Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-10 border-y border-slate-50 dark:border-slate-800">
                                <div className="space-y-3">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Temporal Alignment</p>
                                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                                        <Calendar size={14} className="text-indigo-500" />
                                        <span className="text-xs font-black uppercase tracking-tight">{new Date(payment.payment_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Gateway vector</p>
                                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                                        <CreditCard size={14} className="text-indigo-500" />
                                        <span className="text-xs font-black uppercase tracking-tight italic">{payment.payment_method?.replace('_', ' ')}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Auth / Reference</p>
                                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                                        <Hash size={14} className="text-indigo-500" />
                                        <span className="text-xs font-black uppercase tracking-tight">{payment.reference_number || 'STDLONG_AUTH'}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Allocation node</p>
                                    {payment.invoice ? (
                                        <Link href={route('invoices.show', payment.invoice.id)} className="flex items-center gap-3 text-indigo-600 hover:scale-105 transition-all no-print">
                                            <FileText size={14} />
                                            <span className="text-xs font-black uppercase tracking-tight italic underline decoration-dotted">{payment.invoice.invoice_number}</span>
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <ShieldCheck size={14} />
                                            <span className="text-xs font-black uppercase tracking-tight italic">Standalone</span>
                                        </div>
                                    )}
                                    {payment.invoice && <span className="hidden print:inline text-xs font-black uppercase tracking-tight">{payment.invoice.invoice_number}</span>}
                                </div>
                            </div>

                            {/* Project Linkage (if exists) */}
                            {payment.project && (
                                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border-none flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                                            <Briefcase size={28} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tactical Allocation</p>
                                            <p className="text-lg font-black text-slate-900 dark:text-white uppercase italic leading-none mt-1">{payment.project.title}</p>
                                        </div>
                                    </div>
                                    <Link href={route('projects.show', payment.project.id)} className="no-print">
                                        <Button variant="ghost" className="rounded-xl h-12 px-6 text-[10px] font-black uppercase tracking-widest gap-2 text-indigo-600 bg-white dark:bg-slate-900 shadow-sm">
                                            VIEW PROJECT <ExternalLink size={12} />
                                        </Button>
                                    </Link>
                                </div>
                            )}

                            {/* Remarks Dossier */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 rounded-full bg-amber-500" />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Strategic Remarks</h3>
                                </div>
                                <div className="p-10 bg-slate-50 dark:bg-slate-800/30 rounded-[2.5rem] border-none italic text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed print:bg-transparent print:p-0">
                                    {payment.notes || 'This transaction was processed and verified under standard fiscal operating procedures. The capital magnitude has been committed to the ledger with no additional strategic remarks recorded by the initiating node.'}
                                </div>
                            </div>

                            {/* Final Compliance Check */}
                            <div className="flex flex-col md:flex-row justify-between items-end gap-12 pt-8">
                                <div className="space-y-6 max-w-sm">
                                    <div className="flex items-center gap-6 p-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-[2.5rem] border-none print:bg-transparent print:p-0">
                                        <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100 dark:border-emerald-800/50">
                                            <CheckCircle2 size={32} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">REALIZATION VERIFIED</p>
                                            <p className="text-[10px] text-emerald-600/60 dark:text-emerald-500/40 font-bold uppercase mt-1 leading-tight">Digital Authenticity Hash: 0x{payment.id.toString(16).padStart(8, '0')}ZK</p>
                                        </div>
                                    </div>

                                    {payment.receipt && (
                                        <a href={`/storage/${payment.receipt}`} target="_blank" rel="noopener noreferrer" className="no-print">
                                            <Button variant="ghost" className="h-12 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest gap-3 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30">
                                                <ExternalLink size={14} /> VIEW ORIGINAL EVIDENCE
                                            </Button>
                                        </a>
                                    )}
                                </div>

                                <div className="text-right space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 leading-none">Document Protocol Version</p>
                                        <p className="text-xs font-black text-slate-400 uppercase">ZK-FR-2026.1</p>
                                    </div>
                                    <div className="w-48 h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic">Signature Bypass</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        {/* Branding Footer */}
                        <div
                            className="p-10 text-center space-y-2"
                            style={{ backgroundColor: `${styles.accentColor}08` }}
                        >
                            {styles.footerText && (
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic max-w-sm mx-auto">{styles.footerText}</p>
                            )}
                            <div className="flex items-center justify-center gap-3 py-4">
                                <Zap size={14} className="text-indigo-500 animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Official Fiscal Artifact</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print, aside, header, button, .hidden-print { display: none !important; }
                    body { background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    .py-10 { padding: 0 !important; }
                    .pb-32 { padding-bottom: 0 !important; }
                    
                    /* Reset margins and paddings for layout */
                    main { margin: 0 !important; padding: 0 !important; }
                    .max-w-4xl { max-width: none !important; padding: 0 !important; margin: 0 !important; }
                    
                    /* Ensure background colors print */
                    div, section, header { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `}} />
        </FigmaLayout>
    );
}
