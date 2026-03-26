import React from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    User,
    Mail,
    Phone,
    MapPin,
    Save,
    ImagePlus,
    X,
    Loader2,
    Activity,
    ShieldCheck,
    Zap,
    CreditCard,
    DollarSign,
    Briefcase,
    History
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { cn } from '@/lib/utils';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Edit({ auth, supplier }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: supplier.name || '',
        company_name: supplier.company_name || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
        status: supplier.status || 'active',
        payment_terms: supplier.payment_terms || '',
        credit_limit: supplier.credit_limit || 0,
        avatar: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('suppliers.update', supplier.id));
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Refine Vendor - ${supplier.company_name}`} />

            <div className="space-y-10 pb-32">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <Link href={route('suppliers.show', supplier.id)}>
                            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:scale-105 transition-all">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                                Refine Entity
                            </h1>
                            <div className="flex items-center gap-2">
                                <History size={12} className="text-indigo-600" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none italic">Adjusting Sourcing Parameters: {supplier.company_name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 border-2 border-indigo-100 dark:border-indigo-800 font-black text-[10px] uppercase tracking-widest shadow-sm">
                            Hysteresis: Active
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Main Synthesis Panel */}
                    <div className="lg:col-span-8 space-y-10">
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none rotate-12">
                                <Building2 size={240} className="text-indigo-600" />
                            </div>

                            <CardContent className="p-10 md:p-14 space-y-12 relative z-10">
                                {/* Entity Identity */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 pl-2 mb-2">
                                        <div className="w-2 h-8 rounded-full bg-indigo-600" />
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Entity Identity</h3>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-10">
                                        <div className="relative group">
                                            <div className={cn(
                                                "w-32 h-32 rounded-[2.5rem] border-4 border-dashed flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-800 transition-all",
                                                errors.avatar ? "border-rose-500" : "border-slate-100 dark:border-slate-800 group-hover:border-indigo-600"
                                            )}>
                                                {data.avatar ? (
                                                    <img src={URL.createObjectURL(data.avatar)} className="w-full h-full object-cover" alt="Upload" />
                                                ) : supplier.avatar ? (
                                                    <img src={`/storage/${supplier.avatar}`} className="w-full h-full object-cover" alt="Avatar" />
                                                ) : (
                                                    <div className="text-center text-slate-300">
                                                        <ImagePlus size={32} className="mx-auto mb-2 opacity-50 group-hover:scale-110 group-hover:text-indigo-600 transition-all" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">Branding</span>
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={e => setData('avatar', e.target.files[0])}
                                            />
                                            {data.avatar && (
                                                <button
                                                    type="button"
                                                    className="absolute -top-3 -right-3 bg-rose-500 text-white rounded-full p-2 hover:bg-rose-600 shadow-xl transition-all hover:scale-110 active:scale-90"
                                                    onClick={() => setData('avatar', null)}
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-6 w-full">
                                            <div className="space-y-3">
                                                <InputLabel value="Corporate Entity Name" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                                <TextInput
                                                    className="w-full h-16 pl-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-black text-xl text-slate-900 dark:text-white placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-600/10 shadow-inner group transition-all"
                                                    value={data.company_name}
                                                    onChange={e => setData('company_name', e.target.value)}
                                                    placeholder="e.g. Nexus Logistics Int."
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <InputLabel value="Primary Liaison" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                <User size={18} />
                                            </div>
                                            <TextInput
                                                className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-600/10 shadow-inner group transition-all"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                placeholder="Contact Person Name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <InputLabel value="Communication Vector (Phone)" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                <Phone size={18} />
                                            </div>
                                            <TextInput
                                                className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-600/10 shadow-inner group transition-all"
                                                value={data.phone}
                                                onChange={e => setData('phone', e.target.value)}
                                                placeholder="+880 1XXX-XXXXXX"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <InputLabel value="Electronic Dispatch (Email)" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                <Mail size={18} />
                                            </div>
                                            <TextInput
                                                className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-600/10 shadow-inner group transition-all"
                                                type="email"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                placeholder="vendor@nexus.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <InputLabel value="Geographic HQ" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4" />
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors">
                                                <MapPin size={18} />
                                            </div>
                                            <TextInput
                                                className="w-full h-16 pl-16 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-bold text-slate-900 dark:text-white placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-600/10 shadow-inner group transition-all"
                                                value={data.address}
                                                onChange={e => setData('address', e.target.value)}
                                                placeholder="Street Address, City"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Fiscal Command Lateral */}
                    <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-8">
                        {/* Financial Capacity Card */}
                        <Card className="rounded-[44px] border-none bg-emerald-600 shadow-2xl shadow-emerald-100 dark:shadow-none overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none -rotate-12 translate-x-12 -translate-y-12">
                                <DollarSign size={240} />
                            </div>

                            <CardContent className="p-10 space-y-10 relative z-10 text-white">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <InputLabel value="Strategic Credit Limit" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-100/60 pl-2" />
                                        <Zap size={16} className="text-emerald-300 animate-pulse" />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 font-black text-2xl pointer-events-none">৳</div>
                                        <input
                                            type="number"
                                            value={data.credit_limit}
                                            onChange={e => setData('credit_limit', e.target.value)}
                                            className="w-full bg-white/10 border-none rounded-[1.8rem] pl-16 pr-8 py-8 text-4xl font-black text-white focus:ring-4 focus:ring-white/20 outline-none transition-all placeholder:text-white/20 tracking-tighter italic"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 space-y-6">
                                    <div className="space-y-3">
                                        <InputLabel value="Payment Protocols" className="text-[10px] font-black uppercase tracking-widest text-emerald-200/50" />
                                        <TextInput
                                            className="w-full h-14 bg-white/10 border-none rounded-2xl px-6 font-black text-[10px] uppercase tracking-[0.2em] text-white focus:ring-2 focus:ring-white/20 transition-all"
                                            value={data.payment_terms}
                                            onChange={e => setData('payment_terms', e.target.value)}
                                            placeholder="e.g. NET 30"
                                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <InputLabel value="Operational Status" className="text-[10px] font-black uppercase tracking-widest text-emerald-200/50" />
                                        <select
                                            className="w-full h-14 bg-white/10 border-none rounded-2xl px-6 font-black text-[10px] uppercase tracking-[0.2em] text-white focus:ring-2 focus:ring-white/20 appearance-none transition-all lg:text-emerald-600"
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                                        >
                                            <option value="active" className="text-slate-900">ACTIVE OPS</option>
                                            <option value="inactive" className="text-slate-900">IDLE SOURCE</option>
                                        </select>
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
                                        <span className="uppercase italic tracking-tighter">Commit Refinement</span>
                                    </>
                                )}
                            </Button>

                            <div className="flex items-center gap-3 justify-center py-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2rem]">
                                <Activity size={14} className="text-indigo-500 animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">Adjusting Corporate Registry</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </FigmaLayout>
    );
}
