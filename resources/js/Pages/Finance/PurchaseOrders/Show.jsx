import React from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Truck,
    Calendar,
    FileText,
    Printer,
    Download,
    CheckCircle2,
    XCircle,
    Package,
    Building2,
    Mail,
    Phone,
    Activity,
    ShieldCheck,
    Zap,
    Briefcase,
    TrendingUp,
    Check,
    ExternalLink,
    Building,
    Hash,
    Layers,
    Clock,
    User
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Card, CardContent } from '@/Components/ui/Card';
import { cn } from '@/lib/utils';

export default function Show({ auth, order }) {
    const handleStatusUpdate = (status) => {
        if (confirm(`Authorize shift in procurement lifecycle to ${status.toUpperCase()}?`)) {
            router.patch(route('purchase-orders.update', order.id), { status });
        }
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Procurement Dossier - ${order.po_number}`} />

            <div className="space-y-10 pb-32 print:p-0">
                {/* Tactical Header - Hidden on Print */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
                    <div className="flex items-center gap-6">
                        <Link href={route('purchase-orders.index')}>
                            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:scale-105 transition-all">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                                Order Intelligence
                            </h1>
                            <div className="flex items-center gap-2">
                                <Activity size={12} className="text-indigo-600" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none italic">Verified Supply Chain Artifact</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => window.print()}
                            className="h-12 px-6 rounded-2xl border-slate-100 dark:border-slate-800 font-black text-[10px] uppercase tracking-widest gap-2 bg-white dark:bg-slate-900 hover:bg-slate-50 transition-all"
                        >
                            <Printer size={16} /> PRINT MANIFEST
                        </Button>

                        {order.status === 'draft' && (
                            <Button
                                onClick={() => handleStatusUpdate('ordered')}
                                className="h-12 px-6 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none"
                            >
                                <CheckCircle2 size={16} /> COMMMIT ORDER
                            </Button>
                        )}

                        {order.status === 'ordered' && (
                            <Button
                                onClick={() => handleStatusUpdate('received')}
                                className="h-12 px-6 rounded-2xl bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-100 dark:shadow-none"
                            >
                                <Package size={16} /> CONFIRM RECEIPT
                            </Button>
                        )}

                        <Link href={route('purchase-orders.edit', order.id)}>
                            <Button variant="ghost" className="h-12 px-6 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50">
                                EDIT RECORD
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Manifest Dossier Surface */}
                <div className="max-w-5xl mx-auto print:max-w-none print:w-full">
                    <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-2xl shadow-slate-100 dark:shadow-none overflow-hidden print:rounded-none print:shadow-none print:border-none">
                        {/* High-Contrast Header Section */}
                        <div className={cn(
                            "p-10 md:p-16 text-white relative overflow-hidden transition-colors duration-500",
                            order.status === 'received' ? "bg-emerald-600" :
                                order.status === 'cancelled' ? "bg-rose-600" :
                                    order.status === 'ordered' ? "bg-indigo-600" : "bg-slate-900"
                        )}>
                            {/* Design Patterns */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none text-white/5" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-2xl pointer-events-none" />

                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                                            <Truck size={24} />
                                        </div>
                                        <h2 className="text-2xl font-black uppercase italic tracking-tighter">Purchase Manifest</h2>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 leading-none">Manifest Identifier</p>
                                        <p className="text-lg font-black tracking-widest leading-none">{order.po_number}</p>
                                    </div>
                                </div>

                                <div className="text-left md:text-right space-y-4">
                                    <Badge className="bg-white/20 text-white border-none font-black text-[10px] uppercase tracking-[0.3em] px-5 py-2 rounded-full backdrop-blur-md">
                                        {order.status.toUpperCase()}
                                    </Badge>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 leading-none">Resource Magnitude Sum</p>
                                        <p className="text-5xl font-black tracking-tighter italic leading-none">৳{new Intl.NumberFormat().format(order.total_amount)}</p>
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
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Issuing Node</h3>
                                    </div>
                                    <div className="space-y-2 pl-4">
                                        <p className="text-xl font-black text-slate-900 dark:text-white uppercase italic leading-tight">ZK Base Corp</p>
                                        <div className="space-y-1 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                                            <p>123 STRATEGIC HUB, SECTOR 7</p>
                                            <p>FINANCE DISTRICT, DHAKA</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 rounded-full bg-indigo-600" />
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Resource Entity</h3>
                                    </div>
                                    <div className="space-y-2 pl-4">
                                        <p className="text-xl font-black text-slate-900 dark:text-white uppercase italic leading-tight">
                                            {order.supplier.company_name}
                                        </p>
                                        <div className="space-y-1 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                                            <p>{order.supplier.address || 'ADDRESS PROTOCOL ABSENT'}</p>
                                            <div className="flex items-center gap-2 pt-2">
                                                <Mail size={12} className="text-indigo-500" />
                                                <span>{order.supplier.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Temporal Parameter Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-10 border-y border-slate-50 dark:border-slate-800">
                                <div className="space-y-3">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Initialization</p>
                                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                                        <Calendar size={14} className="text-indigo-500" />
                                        <span className="text-xs font-black uppercase tracking-tight">{new Date(order.order_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Expected Realization</p>
                                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                                        <TrendingUp size={14} className="text-emerald-500" />
                                        <span className="text-xs font-black uppercase tracking-tight italic">
                                            {order.expected_delivery_date ? new Date(order.expected_delivery_date).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Issuing Agent</p>
                                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                                        <User size={14} className="text-indigo-500" />
                                        <span className="text-xs font-black uppercase tracking-tight">{auth.user.name}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Auth Level</p>
                                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                                        <ShieldCheck size={14} className="text-indigo-500" />
                                        <span className="text-xs font-black uppercase tracking-tight italic">Corporate Level 1</span>
                                    </div>
                                </div>
                            </div>

                            {/* Resource Manifest Logic */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 pl-2">
                                    <div className="w-2 h-8 rounded-full bg-rose-500" />
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Resource Manifest Nodes</h3>
                                </div>

                                <div className="rounded-[2.5rem] border border-slate-50 dark:border-slate-800 overflow-hidden shadow-sm">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                                            <tr>
                                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Node Identifier</th>
                                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Magnitude</th>
                                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Unit Vector</th>
                                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Net Magnitude</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                            {order.items.map((item) => (
                                                <tr key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-8 py-6">
                                                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic leading-none">{item.inventory_item?.name || 'Unknown Resource'}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{item.inventory_item?.sku}</p>
                                                    </td>
                                                    <td className="px-8 py-6 text-center">
                                                        <Badge className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-none font-black text-xs px-4 py-1.5 rounded-xl shadow-sm">
                                                            {item.quantity}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-8 py-6 text-right font-bold text-slate-500 text-sm italic">
                                                        ৳{new Intl.NumberFormat().format(item.unit_price)}
                                                    </td>
                                                    <td className="px-8 py-6 text-right font-black text-indigo-600 text-sm tracking-tighter">
                                                        ৳{new Intl.NumberFormat().format(item.total_price)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-slate-900 dark:bg-slate-800 text-white">
                                            <tr>
                                                <td colSpan={3} className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Consolidated Resource Summation</td>
                                                <td className="px-8 py-6 text-right text-2xl font-black italic tracking-tighter">
                                                    ৳{new Intl.NumberFormat().format(order.total_amount)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Remarks & Evidence */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 pl-2">
                                        <div className="w-1.5 h-6 rounded-full bg-amber-500" />
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Strategic Remarks</h3>
                                    </div>
                                    <div className="p-10 bg-slate-50 dark:bg-slate-800/30 rounded-[2.5rem] italic text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed min-h-[140px]">
                                        {order.notes || 'No tactical remarks provided for this procurement cycle. The manifest remains under standard corporate oversight.'}
                                    </div>
                                </div>

                                <div className="space-y-6 flex flex-col justify-end">
                                    <div className="flex items-center gap-6 p-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-[2.5rem] border-none shadow-sm">
                                        <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100 dark:border-emerald-800/50">
                                            <ShieldCheck size={32} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.2em]">PROTOCOL VALIDATED</p>
                                            <p className="text-[10px] text-emerald-600/50 font-bold uppercase mt-1 leading-tight tracking-widest italic">Digital Authenticity: ZK-PO-{order.id.toString(16).padStart(6, '0')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Final Compliance Check */}
                            <div className="flex flex-col md:flex-row justify-between items-end gap-12 pt-8">
                                <div className="text-left space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 leading-none">Document Version</p>
                                        <p className="text-xs font-black text-slate-400 uppercase italic">ZK-PO-2026.1-TACTICAL</p>
                                    </div>
                                </div>

                                <div className="text-right space-y-4">
                                    <div className="w-48 h-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic">Auth Verification</p>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Digitally Authorized Artifact</p>
                                </div>
                            </div>
                        </CardContent>

                        {/* Branding Footer */}
                        <div
                            className="p-10 text-center space-y-2 bg-slate-50 dark:bg-slate-800/20"
                        >
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic max-w-sm mx-auto">This manifest serves as a legal directive for resource allocation and supply chain realization.</p>
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
                    body { background: white !important; font-family: Inter, sans-serif !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    .py-10 { padding: 0 !important; }
                    .pb-32 { padding-bottom: 0 !important; }
                    
                    /* Reset margins and paddings for layout */
                    main { margin: 0 !important; padding: 0 !important; }
                    .max-w-5xl { max-width: none !important; padding: 0 !important; margin: 0 !important; }
                    
                    /* Ensure background colors print */
                    div, section, header, th, td, tfoot { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    
                    /* Specific styles for print manifest */
                    .rounded-[44px] { border-radius: 0 !important; }
                    .shadow-2xl { box-shadow: none !important; }
                }
            `}} />
        </FigmaLayout>
    );
}
