import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Upload, Type, Palette, Layout, FileText, Image as ImageIcon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/lib/translations';

export default function Create({ auth }) {
    const { language } = useAppStore();
    const [logoPreview, setLogoPreview] = useState(null);
    const [watermarkPreview, setWatermarkPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'invoice',
        accent_color: '#000000',
        font_family: 'Inter',
        footer_text: '',
        header_logo: null,
        watermark_image: null,
        is_active: false
    });

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('header_logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleWatermarkChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('watermark_image', file);
            setWatermarkPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('slip-designs.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <Link href={route('slip-designs.index')}>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-background border hover:bg-muted transition-all">
                                <ArrowLeft size={18} />
                            </button>
                        </Link>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-none text-slate-900 uppercase">
                                {t('add_design', language)}
                            </h2>
                            <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">
                                {t('slip_designs_desc', language)}
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={t('add_design', language)} />

            <div className="py-12 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Form Column */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Info */}
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Layout size={20} className="text-blue-500" /> {t('basic_information', language)}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t('design_title', language)}</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                                            placeholder="e.g. Modern Professional"
                                        />
                                        {errors.name && <p className="text-red-500 text-xs font-bold">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t('design_type', language)}</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setData('type', 'invoice')}
                                                className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${data.type === 'invoice' ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' : 'bg-white text-slate-400 border-slate-200 hover:border-blue-300'}`}
                                            >
                                                {t('invoice', language) || 'Invoice'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('type', 'payment')}
                                                className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${data.type === 'payment' ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-500/20' : 'bg-white text-slate-400 border-slate-200 hover:border-green-300'}`}
                                            >
                                                {t('payment_receipt', language)}
                                            </button>
                                        </div>
                                        {errors.type && <p className="text-red-500 text-xs font-bold">{errors.type}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Branding & Assets */}
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <ImageIcon size={20} className="text-purple-500" /> {t('branding_assets', language)}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t('header_logo', language)}</label>
                                        <div className="flex items-center gap-6">
                                            <div className="w-24 h-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                                {logoPreview ? (
                                                    <img src={logoPreview} className="w-full h-full object-contain p-2" />
                                                ) : (
                                                    <Upload size={24} className="text-slate-300" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <input type="file" id="logo_upload" onChange={handleLogoChange} className="hidden" accept="image/*" />
                                                <label htmlFor="logo_upload" className="cursor-pointer inline-block px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">
                                                    {t('upload_logo', language)}
                                                </label>
                                                <p className="text-[10px] text-slate-400 mt-2 italic">{t('logo_recommendation', language)}</p>
                                            </div>
                                        </div>
                                        {errors.header_logo && <p className="text-red-500 text-xs font-bold">{errors.header_logo}</p>}
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t('watermark', language)}</label>
                                        <div className="flex items-center gap-6">
                                            <div className="w-24 h-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                                {watermarkPreview ? (
                                                    <img src={watermarkPreview} className="w-full h-full object-contain p-2 opacity-50" />
                                                ) : (
                                                    <FileText size={24} className="text-slate-300" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <input type="file" id="watermark_upload" onChange={handleWatermarkChange} className="hidden" accept="image/*" />
                                                <label htmlFor="watermark_upload" className="cursor-pointer inline-block px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">
                                                    {t('upload_watermark', language)}
                                                </label>
                                                <p className="text-[10px] text-slate-400 mt-2 italic">{t('watermark_recommendation', language)}</p>
                                            </div>
                                        </div>
                                        {errors.watermark_image && <p className="text-red-500 text-xs font-bold">{errors.watermark_image}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Styling */}
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Palette size={20} className="text-pink-500" /> {t('styling_content', language)}
                                </h3>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t('accent_color', language)}</label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="color"
                                                value={data.accent_color}
                                                onChange={(e) => setData('accent_color', e.target.value)}
                                                className="w-12 h-12 rounded-xl border-none cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={data.accent_color}
                                                onChange={(e) => setData('accent_color', e.target.value)}
                                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm uppercase"
                                            />
                                        </div>
                                        {errors.accent_color && <p className="text-red-500 text-xs font-bold">{errors.accent_color}</p>}
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t('font_family', language)}</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['Inter', 'Roboto', 'Open Sans', 'Lato'].map((font) => (
                                                <div
                                                    key={font}
                                                    onClick={() => setData('font_family', font)}
                                                    className={`p-3 rounded-xl border cursor-pointer transition-all text-center ${data.font_family === font ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                                                >
                                                    <span className="text-sm font-bold" style={{ fontFamily: font }}>{font}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.font_family && <p className="text-red-500 text-xs font-bold">{errors.font_family}</p>}
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t('footer_text', language)}</label>
                                        <textarea
                                            value={data.footer_text}
                                            onChange={(e) => setData('footer_text', e.target.value)}
                                            rows="3"
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                            placeholder="Company address, terms, or thank you note..."
                                        ></textarea>
                                        {errors.footer_text && <p className="text-red-500 text-xs font-bold">{errors.footer_text}</p>}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="is_active" className="text-sm font-bold text-slate-700 select-none cursor-pointer">
                                            {t('set_active_design', language)}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-500/20 transition-all font-bold text-lg flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Save size={20} />
                                    {t('save', language)}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preview Column */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">{t('live_preview', language)}</h3>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('a4_layout', language)}</span>
                            </div>

                            <div className="bg-white aspect-[210/297] w-full rounded shadow-2xl relative overflow-hidden flex flex-col transition-all duration-300 border border-slate-100"
                                style={{ fontFamily: data.font_family }}
                            >
                                {/* Header */}
                                <div className="p-8 flex justify-between items-start border-b border-slate-100 relative z-10">
                                    {logoPreview ? (
                                        <img src={logoPreview} className="h-12 object-contain" />
                                    ) : (
                                        <div className="h-12 w-32 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase tracking-widest border border-dashed border-slate-300 rounded">{t('logo_space', language)}</div>
                                    )}
                                    <div className="text-right">
                                        <h1 className="text-2xl font-black uppercase tracking-tight" style={{ color: data.accent_color }}>
                                            {data.type === 'invoice' ? (t('invoice', language) || 'INVOICE') : (t('payment_receipt', language) || 'RECEIPT')}
                                        </h1>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest"># {data.type === 'invoice' ? 'INV-2024-001' : 'RCPT-8829'}</p>
                                    </div>
                                </div>

                                {/* Watermark */}
                                {watermarkPreview && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
                                        <img src={watermarkPreview} className="w-2/3 object-contain" />
                                    </div>
                                )}

                                {/* Body Content Simulation */}
                                <div className="p-8 flex-1 relative z-10">
                                    <div className="flex justify-between mb-8">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('bill_to', language)}</p>
                                            <p className="font-bold text-sm text-slate-800">Acme Corp Ltd.</p>
                                            <p className="text-xs text-slate-500">123 Business Rd, Tech City</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('date', language)}</p>
                                            <p className="font-bold text-sm text-slate-800">Oct 24, 2024</p>
                                        </div>
                                    </div>

                                    {/* Table Simulation */}
                                    <div className="w-full mb-8">
                                        <div className="flex border-b-2 py-2" style={{ borderColor: data.accent_color }}>
                                            <div className="w-1/2 text-[10px] font-bold uppercase tracking-widest text-slate-500">{t('item', language)}</div>
                                            <div className="w-1/4 text-right text-[10px] font-bold uppercase tracking-widest text-slate-500">{t('qty', language)}</div>
                                            <div className="w-1/4 text-right text-[10px] font-bold uppercase tracking-widest text-slate-500">{t('amount', language)}</div>
                                        </div>
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex border-b border-slate-100 py-3">
                                                <div className="w-1/2 text-sm font-medium text-slate-700">{t('description', language)} {i}</div>
                                                <div className="w-1/4 text-right text-sm text-slate-500">1</div>
                                                <div className="w-1/4 text-right text-sm font-bold text-slate-900">$150.00</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end">
                                        <div className="w-1/2 space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-xs font-bold text-slate-500">{t('subtotal', language)}</span>
                                                <span className="text-xs font-bold text-slate-900">$450.00</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-xs font-bold text-slate-500">{t('tax', language)}</span>
                                                <span className="text-xs font-bold text-slate-900">$45.00</span>
                                            </div>
                                            <div className="flex justify-between pt-2 border-t border-slate-200">
                                                <span className="text-sm font-black uppercase" style={{ color: data.accent_color }}>{t('total', language)}</span>
                                                <span className="text-sm font-black text-slate-900">$495.00</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="p-8 border-t border-slate-100 text-center relative z-10 bg-slate-50/50">
                                    <p className="text-[10px] font-medium text-slate-500 whitespace-pre-wrap">
                                        {data.footer_text || t('default_footer_text', language)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
