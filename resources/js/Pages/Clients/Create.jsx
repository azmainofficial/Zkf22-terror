import React from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    Building2,
    Mail,
    Phone,
    Globe,
    User,
    X,
    Briefcase,
    Shield,
    MapPin,
    Hash
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { cn } from '@/lib/utils';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        company_name: '',
        vat_number: '',
        industry: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        website: '',
        linkedin: '',
        facebook: '',
        twitter: '',
        instagram: '',
        avatar: null,
        logo: null,
        status: 'active',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('clients.store'), {
            forceFormData: true,
        });
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Onboard New Account" />

            <div className="max-w-5xl mx-auto pb-20">
                {/* Tactical Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-6">
                        <Link href={route('clients.index')}>
                            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                Account Onboarding
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">
                                Initializing strategic partner profile and brand identity.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Primary Dossier Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Industrial Identity */}
                            <Card className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                                <CardContent className="p-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                                            <Building2 size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Industrial Identity</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                                                Strategic Account Name
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                                    <Building2 size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={data.company_name}
                                                    onChange={e => setData('company_name', e.target.value)}
                                                    placeholder="e.g. Nexus Corp International"
                                                    className={cn(
                                                        "w-full h-14 pl-12 pr-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 transition-all font-semibold",
                                                        errors.company_name ? "ring-2 ring-red-500" : "focus:ring-indigo-600"
                                                    )}
                                                />
                                            </div>
                                            {errors.company_name && <p className="text-xs text-red-500 font-bold mt-1 pl-1">{errors.company_name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                                                Principal Representative
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                                    <User size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    placeholder="Legal representative name"
                                                    className={cn(
                                                        "w-full h-14 pl-12 pr-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 transition-all font-semibold",
                                                        errors.name ? "ring-2 ring-red-500" : "focus:ring-indigo-600"
                                                    )}
                                                />
                                            </div>
                                            {errors.name && <p className="text-xs text-red-500 font-bold mt-1 pl-1">{errors.name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                                                Industry Vertical
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                                    <Briefcase size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={data.industry}
                                                    onChange={e => setData('industry', e.target.value)}
                                                    placeholder="Sector categorization"
                                                    className="w-full h-14 pl-12 pr-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-semibold"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                                                Taxation / VAT ID
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                                    <Hash size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={data.vat_number}
                                                    onChange={e => setData('vat_number', e.target.value)}
                                                    placeholder="Official registration number"
                                                    className="w-full h-14 pl-12 pr-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-semibold"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Communication Hub */}
                            <Card className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                                <CardContent className="p-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400">
                                            <Globe size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Communication Hub</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                                                Primary Digital Contact
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                                    <Mail size={18} />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={e => setData('email', e.target.value)}
                                                    placeholder="official@company.com"
                                                    className={cn(
                                                        "w-full h-14 pl-12 pr-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 transition-all font-semibold",
                                                        errors.email ? "ring-2 ring-red-500" : "focus:ring-indigo-600"
                                                    )}
                                                />
                                            </div>
                                            {errors.email && <p className="text-xs text-red-500 font-bold mt-1 pl-1">{errors.email}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                                                Telecommunication Line
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                                    <Phone size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={data.phone}
                                                    onChange={e => setData('phone', e.target.value)}
                                                    placeholder="+880 1XXX-XXXXXX"
                                                    className={cn(
                                                        "w-full h-14 pl-12 pr-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 transition-all font-semibold",
                                                        errors.phone ? "ring-2 ring-red-500" : "focus:ring-indigo-600"
                                                    )}
                                                />
                                            </div>
                                            {errors.phone && <p className="text-xs text-red-500 font-bold mt-1 pl-1">{errors.phone}</p>}
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                                                Geographic HQ
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute left-5 top-7 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                                    <MapPin size={18} />
                                                </div>
                                                <textarea
                                                    rows="3"
                                                    value={data.address}
                                                    onChange={e => setData('address', e.target.value)}
                                                    placeholder="Complete physical registration address"
                                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-semibold resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Strategic Configuration Column */}
                        <div className="space-y-8">
                            <Card className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden sticky top-8">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                                            <Shield size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Status & Identity</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                                                Account Status
                                            </label>
                                            <select
                                                value={data.status}
                                                onChange={e => setData('status', e.target.value)}
                                                className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold appearance-none cursor-pointer"
                                            >
                                                <option value="active">Active Strategic Partner</option>
                                                <option value="inactive">Dormant Account</option>
                                                <option value="prospective">Nurturing Prospect</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                                                Corporate Logo
                                            </label>
                                            <div className="relative group h-32 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-4 hover:border-indigo-600 transition-all cursor-pointer overflow-hidden">
                                                {data.logo ? (
                                                    <div className="relative w-full h-full">
                                                        <img src={URL.createObjectURL(data.logo)} className="w-full h-full object-contain" alt="Preview" />
                                                        <button
                                                            onClick={(e) => { e.preventDefault(); setData('logo', null); }}
                                                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Building2 className="text-slate-300 mb-2" size={32} />
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Upload Mark</p>
                                                    </>
                                                )}
                                                <input
                                                    type="file"
                                                    onChange={e => setData('logo', e.target.files[0])}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    accept="image/*"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                                                Partner Avatar
                                            </label>
                                            <div className="relative group h-24 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-4 hover:border-emerald-600 transition-all cursor-pointer overflow-hidden">
                                                {data.avatar ? (
                                                    <div className="relative w-full h-full">
                                                        <img src={URL.createObjectURL(data.avatar)} className="w-full h-full object-cover rounded-xl" alt="Preview" />
                                                        <button
                                                            onClick={(e) => { e.preventDefault(); setData('avatar', null); }}
                                                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <User className="text-slate-300 mb-1" size={24} />
                                                        <p className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">Persona</p>
                                                    </>
                                                )}
                                                <input
                                                    type="file"
                                                    onChange={e => setData('avatar', e.target.files[0])}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    accept="image/*"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-6">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full h-16 rounded-3xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg tracking-tight shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.03] active:scale-[0.97] gap-3"
                                            >
                                                {processing ? (
                                                    "Onboarding Account..."
                                                ) : (
                                                    <>
                                                        <Save size={24} strokeWidth={2.5} />
                                                        Onboard Partner
                                                    </>
                                                )}
                                            </Button>

                                            <Link href={route('clients.index')} className="block mt-4 text-center">
                                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
                                                    Abort Commission
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </FigmaLayout>
    );
}
