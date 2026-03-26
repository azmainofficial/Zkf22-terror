import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Settings, Upload, Save, Building, Image as ImageIcon, CreditCard, Plus, Trash2, CheckCircle2, XCircle, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/lib/translations';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import InputError from '@/Components/InputError';

export default function Index({ auth, settings, paymentMethods = [] }) {
    const { language } = useAppStore();
    const [preview, setPreview] = useState(settings.app_logo ? `/storage/${settings.app_logo}` : null);
    const [newMethodName, setNewMethodName] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        app_name: settings.app_name || '',
        app_logo: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('app_logo', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('settings.update'));
    };

    const handleAddPaymentMethod = (e) => {
        e.preventDefault();
        if (!newMethodName.trim()) return;

        router.post(route('payment-methods.store'), {
            name: newMethodName
        }, {
            onSuccess: () => setNewMethodName(''),
            preserveScroll: true
        });
    };

    const handleDeletePaymentMethod = (id) => {
        if (confirm(t('confirm_delete', language))) {
            router.delete(route('payment-methods.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const togglePaymentMethodStatus = (method) => {
        router.patch(route('payment-methods.update', method.id), {
            name: method.name,
            is_active: !method.is_active
        }, {
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 text-glow">
                        <Settings size={24} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white uppercase leading-none">{t('system_settings', language)}</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mt-1 tracking-widest uppercase">{t('settings_desc', language)}</p>
                    </div>
                </div>
            }
        >
            <Head title={t('system_settings', language)} />

            <div className="max-w-5xl mx-auto py-12 px-4 space-y-12">
                {/* General Settings */}
                <Card className="border-none bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white dark:border-slate-800">
                    <CardContent className="p-8 md:p-12 relative overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

                        <form onSubmit={submit} className="space-y-10 relative z-10">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
                                    <Building size={20} />
                                </div>
                                <h3 className="text-xl font-bold tracking-tight uppercase text-slate-800 dark:text-white">{t('application_identity', language) || 'Application Identity'}</h3>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* App Name */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">{t('app_name', language)}</label>
                                    <input
                                        type="text"
                                        value={data.app_name}
                                        onChange={(e) => setData('app_name', e.target.value)}
                                        className="w-full h-14 px-6 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-lg font-bold text-slate-900 dark:text-white"
                                        placeholder="Enter company name"
                                    />
                                    <InputError message={errors.app_name} />
                                </div>

                                {/* App Logo */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">{t('app_logo', language)}</label>
                                    <div className="flex items-center gap-6 p-4 bg-slate-50/50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                                        <div className="w-20 h-20 rounded-xl bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center overflow-hidden border dark:border-slate-800 shrink-0">
                                            {preview ? (
                                                <img src={preview} alt="Logo" className="w-full h-full object-contain p-2" />
                                            ) : (
                                                <ImageIcon size={32} className="text-slate-300" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input type="file" id="logo-upload" className="hidden" onChange={handleFileChange} accept="image/*" />
                                            <label htmlFor="logo-upload" className="cursor-pointer inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
                                                <Upload size={14} /> {t('upload_new', language) || 'Upload New'}
                                            </label>
                                            <p className="text-[10px] text-slate-400 mt-2 font-medium italic">PNG, JPG up to 2MB</p>
                                        </div>
                                    </div>
                                    <InputError message={errors.app_logo} />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button disabled={processing} className="h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-tight gap-3 shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
                                    <Save size={20} /> {t('save_identity', language) || 'Update Identity'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Slip Designs Link */}
                <Card className="border-none bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl overflow-hidden hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer" onClick={() => router.get(route('slip-designs.index'))}>
                    <CardContent className="p-8 md:p-12 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-cyan-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-cyan-500/20">
                                <FileText size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">{t('slip_designs', language) || 'Slip Designs'}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mt-1 tracking-widest uppercase">{t('slip_designs_desc', language) || 'Configure invoice and payment receipts'}</p>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                            <ChevronRight size={24} />
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Methods Management */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-white/10 blur-[60px] rounded-full" />
                            <CreditCard size={48} className="mb-6 opacity-40" />
                            <h3 className="text-2xl font-bold tracking-tight leading-none">{t('payment_mechanisms', language) || 'Payment Mechanisms'}</h3>
                            <p className="text-indigo-100/60 text-[10px] font-bold uppercase tracking-widest mt-2">{t('payment_methods_desc', language) || 'Configure valid financial outflow channels'}</p>

                            <form onSubmit={handleAddPaymentMethod} className="mt-8 space-y-4">
                                <input
                                    type="text"
                                    value={newMethodName}
                                    onChange={(e) => setNewMethodName(e.target.value)}
                                    placeholder={t('method_name_placeholder', language) || "Enter mechanism name..."}
                                    className="w-full h-14 px-6 bg-white/10 border-none rounded-2xl placeholder:text-white/30 text-white font-bold focus:ring-2 focus:ring-white/20 transition-all"
                                />
                                <Button type="submit" className="w-full h-14 bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl font-bold tracking-tight gap-2 transition-all active:scale-95">
                                    <Plus size={20} /> {t('add_method', language) || 'Add Protocol'}
                                </Button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <Card className="border-none bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl overflow-hidden min-h-[400px]">
                            <CardHeader className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">{t('active_methods', language) || 'Active Protocols'}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {paymentMethods.length > 0 ? paymentMethods.map((method) => (
                                        <div key={method.id} className="group flex items-center justify-between p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", method.is_active ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-100 text-slate-400")}>
                                                    <CreditCard size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white uppercase tracking-tight italic">{method.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{method.code}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => togglePaymentMethodStatus(method)}
                                                    className={cn(
                                                        "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                                                        method.is_active ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                                                    )}
                                                >
                                                    {method.is_active ? 'ACTIVE' : 'DEACTIVATED'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePaymentMethod(method.id)}
                                                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                                            <CreditCard size={48} className="opacity-20 mb-4" />
                                            <p className="text-[10px] font-bold uppercase tracking-[0.3em]">{t('no_methods_found', language) || 'No Protocols Detected'}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

