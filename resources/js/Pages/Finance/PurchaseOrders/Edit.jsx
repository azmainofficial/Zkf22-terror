import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Truck,
    Calendar,
    FileText,
    Plus,
    Trash2,
    Save,
    Search,
    Package,
    Activity,
    ShieldCheck,
    Zap,
    DollarSign,
    Briefcase,
    Building,
    FileUp,
    X,
    Loader2,
    History,
    TrendingUp,
    Layers,
    ChevronDown,
    PlusCircle,
    Check
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { cn } from '@/lib/utils';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Edit({ auth, order, suppliers, inventory_items }) {
    // Local state for items
    const [lineItems, setLineItems] = useState(
        order.items.map(item => ({
            id: item.id,
            inventory_item_id: item.inventory_item_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total_price
        }))
    );

    const { data, setData, put, processing, errors } = useForm({
        supplier_id: order.supplier_id,
        order_date: order.order_date,
        expected_delivery_date: order.expected_delivery_date || '',
        status: order.status,
        notes: order.notes || '',
        items: []
    });

    // Update form data when lineItems change
    useEffect(() => {
        setData('items', lineItems);
    }, [lineItems]);

    const addLineItem = () => {
        setLineItems([...lineItems, { inventory_item_id: '', quantity: 1, unit_price: 0, total: 0 }]);
    };

    const removeLineItem = (index) => {
        const newItems = [...lineItems];
        newItems.splice(index, 1);
        setLineItems(newItems);
    };

    const updateLineItem = (index, field, value) => {
        const newItems = [...lineItems];
        newItems[index][field] = value;

        // Auto-fill price if item selected
        if (field === 'inventory_item_id') {
            const selectedItem = inventory_items.find(i => i.id == value);
            if (selectedItem) {
                newItems[index].unit_price = selectedItem.unit_price;
            }
        }

        // Recalculate total
        newItems[index].total = newItems[index].quantity * newItems[index].unit_price;
        setLineItems(newItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('purchase-orders.update', order.id));
    };

    const grandTotal = lineItems.reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0);

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Refine Procurement - ${order.po_number}`} />

            <div className="space-y-10 pb-32">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <Link href={route('purchase-orders.show', order.id)}>
                            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:scale-105 transition-all">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                                Refine Order
                            </h1>
                            <div className="flex items-center gap-2">
                                <Activity size={12} className="text-indigo-600" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none italic">Procurement Identifier: {order.po_number}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm border-2",
                            order.status === 'received' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                order.status === 'ordered' ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                                    "bg-slate-50 text-slate-400 border-slate-100"
                        )}>
                            Realization: {order.status.toUpperCase()}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Main Synthesis Panel */}
                    <div className="lg:col-span-8 space-y-10">
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none rotate-12">
                                <History size={240} className="text-indigo-600" />
                            </div>

                            <CardContent className="p-10 md:p-14 space-y-12 relative z-10">
                                {/* Logistics Source Alignment */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 pl-2 mb-2">
                                        <div className="w-2 h-8 rounded-full bg-indigo-600" />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Resource Source Alignment</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <InputLabel value="Resource Vendor (Supplier)" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                    <Building size={18} />
                                                </div>
                                                <select
                                                    className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white appearance-none focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all"
                                                    value={data.supplier_id}
                                                    onChange={e => setData('supplier_id', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select Resource Entity</option>
                                                    {suppliers.map(s => (
                                                        <option key={s.id} value={s.id}>{s.company_name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <InputError message={errors.supplier_id} className="mt-2" />
                                        </div>

                                        <div className="space-y-4">
                                            <InputLabel value="Lifecycle Status Vector" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                            <select
                                                className="w-full h-16 px-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-300 appearance-none focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all"
                                                value={data.status}
                                                onChange={e => setData('status', e.target.value)}
                                            >
                                                <option value="draft">DRAFT PROTOCOL</option>
                                                <option value="ordered">ORDERED VECTOR</option>
                                                <option value="received">RECEIVED REALIZATION</option>
                                                <option value="cancelled">CANCELLED VOID</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Temporal Parameters */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 pl-2 mb-2">
                                        <div className="w-2 h-8 rounded-full bg-emerald-500" />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Temporal Trajectories</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <InputLabel value="Order Initialization Date" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                    <Calendar size={18} />
                                                </div>
                                                <TextInput
                                                    type="date"
                                                    className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all"
                                                    value={data.order_date}
                                                    onChange={e => setData('order_date', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <InputLabel value="Expected Realization Horizon" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                    <TrendingUp size={18} />
                                                </div>
                                                <TextInput
                                                    type="date"
                                                    className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all"
                                                    value={data.expected_delivery_date}
                                                    onChange={e => setData('expected_delivery_date', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Resource Itemization Surface */}
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                            <CardContent className="p-10 md:p-14 space-y-10">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <div className="flex items-center gap-3 pl-2">
                                        <div className="w-2 h-8 rounded-full bg-rose-500" />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Resource Itemization</h3>
                                    </div>
                                    <Button type="button" onClick={addLineItem} className="h-12 px-6 rounded-2xl bg-slate-900 dark:bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-sm transition-all hover:scale-105 active:scale-95">
                                        <PlusCircle size={16} /> Add Manifest Node
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    {lineItems.map((item, index) => (
                                        <div key={index} className="group relative grid grid-cols-1 md:grid-cols-12 gap-6 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] items-end border border-transparent transition-all hover:border-indigo-100 dark:hover:border-indigo-900/30">
                                            <div className="md:col-span-1 flex items-center justify-center pb-3">
                                                <span className="text-[10px] font-black text-slate-300 italic">#{index + 1}</span>
                                            </div>

                                            <div className="md:col-span-5 space-y-3">
                                                <InputLabel value="Resource Identifier" className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-2" />
                                                <select
                                                    className="w-full h-14 px-6 bg-white dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-900 dark:text-white appearance-none focus:ring-4 focus:ring-indigo-600/10 shadow-sm"
                                                    value={item.inventory_item_id}
                                                    onChange={e => updateLineItem(index, 'inventory_item_id', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select Resource Node</option>
                                                    {inventory_items.map(i => (
                                                        <option key={i.id} value={i.id}>{i.name} ({i.sku})</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="md:col-span-2 space-y-3">
                                                <InputLabel value="Magnitude" className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-2" />
                                                <input
                                                    type="number"
                                                    className="w-full h-14 bg-white dark:bg-slate-900 border-none rounded-2xl px-6 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-600/10 shadow-sm text-center"
                                                    value={item.quantity}
                                                    onChange={e => updateLineItem(index, 'quantity', parseFloat(e.target.value))}
                                                    min="1"
                                                    required
                                                />
                                            </div>

                                            <div className="md:col-span-2 space-y-3">
                                                <InputLabel value="Unit Vector" className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-2" />
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs">৳</span>
                                                    <input
                                                        type="number"
                                                        className="w-full h-14 bg-white dark:bg-slate-900 border-none rounded-2xl pl-10 pr-4 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-600/10 shadow-sm text-right"
                                                        value={item.unit_price}
                                                        onChange={e => updateLineItem(index, 'unit_price', parseFloat(e.target.value))}
                                                        step="0.01"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 flex items-center justify-between gap-4 pl-4 pb-3">
                                                <div className="text-right flex-1">
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1 leading-none">Net Total</p>
                                                    <p className="text-sm font-black text-indigo-600 tracking-tighter italic">৳{new Intl.NumberFormat().format(item.total)}</p>
                                                </div>
                                                {lineItems.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeLineItem(index)}
                                                        className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-100 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Magnitude & Protocol Lateral */}
                    <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-8">
                        {/* Capital Magnitude Card */}
                        <Card className="rounded-[44px] border-none bg-indigo-600 shadow-2xl shadow-indigo-100 dark:shadow-none overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none -rotate-12 translate-x-12 -translate-y-12">
                                <DollarSign size={240} />
                            </div>

                            <CardContent className="p-10 space-y-8 relative z-10 text-white">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <InputLabel value="Capital Magnitude Sum" className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100/60 pl-2" />
                                        <Zap size={16} className="text-indigo-300 animate-pulse" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs font-bold text-indigo-100/40 uppercase tracking-widest pl-2">
                                            <span>Sub-Protocol Total</span>
                                            <span>৳{new Intl.NumberFormat().format(grandTotal)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-bold text-indigo-100/40 uppercase tracking-widest pl-2 pb-4 border-b border-white/10">
                                            <span>Tax Realization (0%)</span>
                                            <span>৳0.00</span>
                                        </div>
                                        <div className="pt-4">
                                            <p className="text-5xl font-black text-white tracking-tighter italic">৳{new Intl.NumberFormat().format(grandTotal)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-8 space-y-6">
                                    <div className="space-y-2">
                                        <InputLabel value="Deployment Remarks" className="text-[10px] font-black uppercase tracking-widest text-indigo-100/50 pl-2" />
                                        <textarea
                                            className="w-full bg-white/5 border-none rounded-[1.8rem] p-6 text-sm font-bold text-white placeholder:text-white/20 focus:ring-4 focus:ring-white/10 outline-none transition-all resize-none min-h-[120px]"
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            placeholder="Enter delivery instructions or strategic context..."
                                        />
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
                                        <span className="uppercase italic tracking-tighter">Adjust Record</span>
                                    </>
                                )}
                            </Button>

                            <div className="flex items-center gap-3 justify-center py-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2rem]">
                                <Activity size={14} className="text-indigo-500 animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">Adjusting Procurement Node</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </FigmaLayout>
    );
}
