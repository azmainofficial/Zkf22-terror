import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Upload, Type, Palette, Layout, FileText, Image as ImageIcon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/lib/translations';

export default function Edit({ auth, design }) {
    const { language } = useAppStore();
    const [logoPreview, setLogoPreview] = useState(design.header_logo ? `/storage/${design.header_logo}` : null);
    const [watermarkPreview, setWatermarkPreview] = useState(design.watermark_image ? `/storage/${design.watermark_image}` : null);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: design.name,
        type: design.type,
        accent_color: design.accent_color,
        font_family: design.font_family,
        footer_text: design.footer_text || '',
        header_logo: null,
        watermark_image: null,
        is_active: Boolean(design.is_active)
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
        post(route('slip-designs.update', design.id));
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
                                {t('edit', language)} {design.name}
                            </h2>
                            <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">
                                {t('slip_designs_desc', language)}
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`${t('edit', language)} ${design.name}`} />

            <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Layout size={20} className="text-blue-500" /> Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Design Name</label>
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
                                        Invoice
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('type', 'payment')}
                                        className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${data.type === 'payment' ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-500/20' : 'bg-white text-slate-400 border-slate-200 hover:border-green-300'}`}
                                    >
                                        Payment Receipt
                                    </button>
                                </div>
                                {errors.type && <p className="text-red-500 text-xs font-bold">{errors.type}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Branding & Assets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <ImageIcon size={20} className="text-purple-500" /> Branding Assets
                            </h3>

                            <div className="space-y-8">
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
                                                Change Logo
                                            </label>
                                            <p className="text-[10px] text-slate-400 mt-2 italic">Recommended: PNG with transparent background</p>
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
                                                Change Watermark
                                            </label>
                                            <p className="text-[10px] text-slate-400 mt-2 italic">Low opacity background image</p>
                                        </div>
                                    </div>
                                    {errors.watermark_image && <p className="text-red-500 text-xs font-bold">{errors.watermark_image}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Styling */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Palette size={20} className="text-pink-500" /> Styling & Content
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
                                        Set as Active Design
                                    </label>
                                </div>
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
        </AuthenticatedLayout>
    );
}
