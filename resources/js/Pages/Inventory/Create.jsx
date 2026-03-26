import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    Package,
    Building2,
    DollarSign,
    Plus,
    Loader2,
    Activity,
    ShieldCheck,
    Zap,
    Briefcase,
    TrendingUp,
    Layers,
    PlusCircle,
    Check,
    FileUp,
    ChevronDown,
    MapPin,
    Mail,
    Phone,
    X,
    User,
    Building,
    Scale,
    PieChart,
    Target
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { cn } from '@/lib/utils';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';

export default function Create({ auth, brands = [], suppliers = [], projects = [], clients = [], selected_project_id, units = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        brand_id: '',
        unit: units.length > 0 ? units[0].abbreviation : 'pcs',
        quantity_in_stock: '',
        reorder_level: '0',
        unit_price: '',
        status: 'active',
        supplier_id: '',
        client_id: '',
        project_id: selected_project_id || '',
    });

    const [totalValue, setTotalValue] = useState(0);
    const [filteredProjects, setFilteredProjects] = useState(projects);
    const [showUnitModal, setShowUnitModal] = useState(false);
    const [showBrandModal, setShowBrandModal] = useState(false);
    const [showSupplierModal, setShowSupplierModal] = useState(false);

    const unitForm = useForm({ name: '', abbreviation: '' });
    const brandForm = useForm({ name: '', image: null });
    const supplierForm = useForm({
        name: '',
        company_name: '',
        email: '',
        phone: '',
        address: '',
        status: 'active'
    });

    useEffect(() => {
        if (data.client_id) {
            setFilteredProjects(projects.filter(p => p.client_id == data.client_id));
        } else {
            setFilteredProjects(projects);
        }
    }, [data.client_id, projects]);

    useEffect(() => {
        if (data.project_id) {
            const selectedProject = projects.find(p => p.id == data.project_id);
            if (selectedProject && selectedProject.client_id) {
                setData('client_id', selectedProject.client_id);
            }
        }
    }, [data.project_id]);

    useEffect(() => {
        const price = parseFloat(data.unit_price) || 0;
        const stock = parseFloat(data.quantity_in_stock) || 0;
        setTotalValue(price * stock);
    }, [data.unit_price, data.quantity_in_stock]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('inventory.store'));
    };

    const handleCreateUnit = (e) => {
        e.preventDefault();
        unitForm.post(route('units.store'), {
            onSuccess: () => {
                setShowUnitModal(false);
                unitForm.reset();
                router.reload({ only: ['units'] });
            },
            preserveScroll: true,
        });
    };

    const handleCreateBrand = (e) => {
        e.preventDefault();
        brandForm.post(route('brands.store'), {
            onSuccess: () => {
                setShowBrandModal(false);
                brandForm.reset();
                router.reload({ only: ['brands'] });
            },
            preserveScroll: true,
        });
    };

    const handleCreateSupplier = (e) => {
        e.preventDefault();
        supplierForm.post(route('suppliers.store'), {
            onSuccess: () => {
                setShowSupplierModal(false);
                supplierForm.reset();
                router.reload({ only: ['suppliers'] });
            },
            preserveScroll: true,
        });
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Initialize Resource Node" />

            <div className="space-y-10 pb-32">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <Link href={route('inventory.index')}>
                            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:scale-105 transition-all">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                                Initialize Resource
                            </h1>
                            <div className="flex items-center gap-2">
                                <Activity size={12} className="text-indigo-600" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none italic">New Supply Chain Integration</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 border-2 border-indigo-100 dark:border-indigo-800 font-black text-[10px] uppercase tracking-widest shadow-sm">
                            Status: Initializing
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Main Synthesis Panel */}
                    <div className="lg:col-span-8 space-y-10">
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none rotate-12">
                                <Package size={240} className="text-indigo-600" />
                            </div>

                            <CardContent className="p-10 md:p-14 space-y-12 relative z-10">
                                {/* Core Information */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 pl-2 mb-2">
                                        <div className="w-2 h-8 rounded-full bg-indigo-600" />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Resource Core synthesis</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <InputLabel value="Resource Identifier (Name)" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                    <Zap size={18} />
                                                </div>
                                                <TextInput
                                                    type="text"
                                                    className="w-full h-18 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] font-black text-lg text-slate-900 dark:text-white placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all uppercase italic tracking-tight"
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    placeholder="RESOURCE DESCRIPTION / MODEL"
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between pl-4">
                                                    <InputLabel value="Brand Architecture" className="text-[10px] font-black uppercase tracking-widest text-slate-500" />
                                                    <Button type="button" onClick={() => setShowBrandModal(true)} variant="ghost" className="h-6 px-3 rounded-full text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 gap-1 active:scale-95 transition-all">
                                                        <PlusCircle size={10} /> New Brand
                                                    </Button>
                                                </div>
                                                <select
                                                    className="w-full h-16 px-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white appearance-none focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all uppercase tracking-widest text-xs"
                                                    value={data.brand_id}
                                                    onChange={e => setData('brand_id', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select Architecture</option>
                                                    {brands.map(brand => (
                                                        <option key={brand.id} value={brand.id}>{brand.name.toUpperCase()}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between pl-4">
                                                    <InputLabel value="Measurement Protocol" className="text-[10px] font-black uppercase tracking-widest text-slate-500" />
                                                    <Button type="button" onClick={() => setShowUnitModal(true)} variant="ghost" className="h-6 px-3 rounded-full text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 gap-1 active:scale-95 transition-all">
                                                        <PlusCircle size={10} /> New Unit
                                                    </Button>
                                                </div>
                                                <select
                                                    className="w-full h-16 px-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white appearance-none focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all uppercase tracking-widest text-xs"
                                                    value={data.unit}
                                                    onChange={e => setData('unit', e.target.value)}
                                                >
                                                    {units.map(unit => (
                                                        <option key={unit.id} value={unit.abbreviation}>{unit.name.toUpperCase()} ({unit.abbreviation.toUpperCase()})</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Flow Parameters */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 pl-2 mb-2">
                                        <div className="w-2 h-8 rounded-full bg-emerald-500" />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Flow & Capital Parameters</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <InputLabel value="Tactical Magnitude (Quantity)" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                    <Layers size={18} />
                                                </div>
                                                <TextInput
                                                    type="number"
                                                    className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all italic text-right"
                                                    value={data.quantity_in_stock}
                                                    onChange={e => setData('quantity_in_stock', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <InputLabel value="Unit Capital Cost (Price)" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                    <DollarSign size={18} />
                                                </div>
                                                <TextInput
                                                    type="number"
                                                    className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all italic text-right"
                                                    value={data.unit_price}
                                                    onChange={e => setData('unit_price', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-10 bg-indigo-600 rounded-[3rem] text-white flex items-center justify-between shadow-2xl shadow-indigo-100 dark:shadow-none relative overflow-hidden group">
                                        <TrendingUp size={120} className="absolute -bottom-10 -right-10 text-white/10 group-hover:scale-110 transition-transform duration-700" />
                                        <div className="space-y-1 relative z-10">
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 italic">Total Resource Magnitude</p>
                                            <p className="text-sm font-bold text-white uppercase tracking-widest">Liquid Asset Value</p>
                                        </div>
                                        <p className="text-4xl font-black italic tracking-tighter relative z-10">
                                            ৳{new Intl.NumberFormat().format(totalValue)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Strategic Assignment */}
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                            <CardContent className="p-10 md:p-14 space-y-10">
                                <div className="flex items-center gap-3 pl-2 mb-2">
                                    <div className="w-2 h-8 rounded-full bg-rose-500" />
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Strategic Vector Assignment</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <InputLabel value="Entity Vector (Client)" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                <Building2 size={18} />
                                            </div>
                                            <select
                                                className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white dark:disabled:text-slate-500 appearance-none focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all uppercase truncate"
                                                value={data.client_id}
                                                onChange={e => setData('client_id', e.target.value)}
                                                disabled={!!data.project_id}
                                            >
                                                <option value="">STOCK BUFFER (STATIC)</option>
                                                {clients.map(client => (
                                                    <option key={client.id} value={client.id}>{client.company_name.toUpperCase()}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <InputLabel value="Operational Vector (Project)" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                <Target size={18} />
                                            </div>
                                            <select
                                                className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white appearance-none focus:ring-4 focus:ring-indigo-600/10 shadow-inner transition-all uppercase truncate"
                                                value={data.project_id}
                                                onChange={e => setData('project_id', e.target.value)}
                                            >
                                                <option value="">FREE RESOURCE (UNASSIGNED)</option>
                                                {filteredProjects.map(project => (
                                                    <option key={project.id} value={project.id}>{project.title.toUpperCase()}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Lateral Source Panel */}
                    <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-8">
                        {/* Source Intelligence */}
                        <Card className="rounded-[44px] border-none bg-slate-900 shadow-2xl shadow-slate-200 dark:shadow-none overflow-hidden relative">
                            <CardContent className="p-10 space-y-8 relative z-10 text-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 rounded-full bg-indigo-500" />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 italic">Source Intelligence</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between px-2">
                                            <InputLabel value="Provider Entity" className="text-[9px] font-black uppercase tracking-widest text-white/40" />
                                            <Button type="button" onClick={() => setShowSupplierModal(true)} variant="ghost" className="h-6 px-3 rounded-xl text-[8px] font-black uppercase tracking-widest text-indigo-400 bg-white/5 hover:bg-white/10 transition-all">
                                                Initialize Supplier
                                            </Button>
                                        </div>
                                        <select
                                            className="w-full h-16 px-8 bg-white/10 border-none rounded-[1.8rem] font-bold text-white focus:ring-4 focus:ring-white/5 transition-all uppercase text-[10px] tracking-widest"
                                            value={data.supplier_id}
                                            onChange={e => setData('supplier_id', e.target.value)}
                                        >
                                            <option value="" className="text-slate-900">Direct Source / No Supplier</option>
                                            {suppliers.map(supplier => (
                                                <option key={supplier.id} value={supplier.id} className="text-slate-900">{supplier.company_name.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        <InputLabel value="Lifecycle Status" className="text-[9px] font-black uppercase tracking-widest text-white/40 px-2" />
                                        <div className="grid grid-cols-2 gap-2">
                                            {['active', 'inactive', 'discontinued'].map(s => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setData('status', s)}
                                                    className={cn(
                                                        "px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border-2 transition-all",
                                                        data.status === s
                                                            ? "bg-white text-slate-900 border-white"
                                                            : "bg-white/5 text-white/30 border-white/5 hover:bg-white/10 hover:text-white/60"
                                                    )}
                                                >
                                                    {s}
                                                </button>
                                            ))}
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
                                className="w-full h-20 rounded-[2.2rem] bg-indigo-600 hover:bg-slate-900 text-white font-black text-xl shadow-2xl shadow-indigo-100 dark:shadow-none gap-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {processing ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        <ShieldCheck size={28} />
                                        <span className="uppercase italic tracking-tighter">Commit Resource</span>
                                    </>
                                )}
                            </Button>

                            <div className="flex items-center gap-3 justify-center py-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2rem]">
                                <Activity size={14} className="text-indigo-500 animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">Initiating supply stream</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Sub-Synthesis Modals (Unit, Brand, Supplier) */}
            {/* Same patterns as Clients/Suppliers create pages */}
            <Modal show={showUnitModal} onClose={() => setShowUnitModal(false)} maxWidth="md">
                <div className="p-10 space-y-8 bg-white dark:bg-slate-900 rounded-[3rem]">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">New Measurement Unit</h3>
                    <form onSubmit={handleCreateUnit} className="space-y-6">
                        <div className="space-y-4">
                            <InputLabel value="Unit Name" className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-4" />
                            <TextInput
                                className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold italic"
                                value={unitForm.data.name}
                                onChange={e => unitForm.setData('name', e.target.value)}
                                placeholder="e.g. Kilograms"
                                required
                            />
                        </div>
                        <div className="space-y-4">
                            <InputLabel value="Protocol Identifier (Abbreviation)" className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-4" />
                            <TextInput
                                className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold uppercase italic"
                                value={unitForm.data.abbreviation}
                                onChange={e => unitForm.setData('abbreviation', e.target.value)}
                                placeholder="KG"
                                required
                            />
                        </div>
                        <Button type="submit" disabled={unitForm.processing} className="w-full h-14 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest">
                            Synthesize Unit
                        </Button>
                    </form>
                </div>
            </Modal>

            <Modal show={showBrandModal} onClose={() => setShowBrandModal(false)} maxWidth="md">
                <div className="p-10 space-y-8 bg-white dark:bg-slate-900 rounded-[3rem]">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">New Brand Identity</h3>
                    <form onSubmit={handleCreateBrand} className="space-y-6">
                        <div className="space-y-4">
                            <InputLabel value="Brand Identifier" className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-4" />
                            <TextInput
                                className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold uppercase italic"
                                value={brandForm.data.name}
                                onChange={e => brandForm.setData('name', e.target.value)}
                                placeholder="BRAND NAME"
                                required
                            />
                        </div>
                        <Button type="submit" disabled={brandForm.processing} className="w-full h-14 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest">
                            Synthesize Brand
                        </Button>
                    </form>
                </div>
            </Modal>

            <Modal show={showSupplierModal} onClose={() => setShowSupplierModal(false)} maxWidth="xl">
                <div className="p-10 space-y-8 bg-white dark:bg-slate-900 rounded-[3rem]">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">New Supplier Genesis</h3>
                    <form onSubmit={handleCreateSupplier} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <InputLabel value="Company Title" />
                            <TextInput className="w-full" value={supplierForm.data.company_name} onChange={e => supplierForm.setData('company_name', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <InputLabel value="Liaison Name" />
                            <TextInput className="w-full" value={supplierForm.data.name} onChange={e => supplierForm.setData('name', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <InputLabel value="Contact Protocol (Phone)" />
                            <TextInput className="w-full" value={supplierForm.data.phone} onChange={e => supplierForm.setData('phone', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <InputLabel value="Digital Node (Email)" />
                            <TextInput className="w-full" value={supplierForm.data.email} onChange={e => supplierForm.setData('email', e.target.value)} />
                        </div>
                        <div className="md:col-span-2 flex items-center gap-4 pt-4">
                            <Button type="submit" disabled={supplierForm.processing} className="flex-1 h-14 bg-indigo-600 text-white font-black uppercase italic tracking-widest">
                                Initialize Genesis
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </FigmaLayout>
    );
}

