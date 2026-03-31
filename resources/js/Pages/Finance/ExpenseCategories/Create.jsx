import React from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Sparkles, Layout, Palette, ToggleLeft } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function Create({ auth }) {
    const { language } = useAppStore();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        description: '',
        color: '#6366f1',
        is_active: true
    });

    const tr = (en, bn) => language === 'bn' ? bn : en;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('expense-categories.store'));
    };

    const labelStyle = {
        fontSize: '0.82rem',
        fontWeight: 700,
        color: '#1e1b4b',
        marginBottom: '6px',
        display: 'block'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '10px',
        border: '1.5px solid #e5e7eb',
        fontSize: '0.9rem',
        outline: 'none',
        transition: 'all 0.2s',
        boxSizing: 'border-box'
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={tr('Create Category', 'নতুন ক্যাটাগরি')} />

            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href={route('expense-categories.index')}>
                        <button style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: '#fff', border: '1.5px solid #e5e7eb',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#6b7280'
                        }}>
                            <ArrowLeft size={18} />
                        </button>
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>
                            {tr('Create Category', 'নতুন ক্যাটাগরি')}
                        </h1>
                        <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '4px 0 0', fontWeight: 500 }}>
                            {tr('Add a new group for your expenses', 'খরচের জন্য একটি নতুন গ্রুপ যোগ করুন')}
                        </p>
                    </div>
                </div>

                {/* ── Form Card ── */}
                <form onSubmit={handleSubmit} style={{ 
                    background: '#fff', borderRadius: '20px', border: '1.5px solid #f0eeff', 
                    padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}>
                    
                    {/* Basic Info Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={labelStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Sparkles size={14} color="#6366f1" />
                                    {tr('Category Name', 'ক্যাটাগরির নাম')}
                                </div>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder={tr('e.g. Office Rent', 'যেমন: অফিস ভাড়া')}
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.name ? '#ef4444' : '#e5e7eb'
                                }}
                                required
                            />
                            {errors.name && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', fontWeight: 600 }}>{errors.name}</p>}
                        </div>

                        <div>
                            <label style={labelStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Layout size={14} color="#6366f1" />
                                    {tr('Short Code', 'সংক্ষিপ্ত কোড')}
                                </div>
                            </label>
                            <input
                                type="text"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                placeholder={tr('e.g. RENT', 'যেমন: RENT')}
                                style={{
                                    ...inputStyle,
                                    textTransform: 'uppercase',
                                    borderColor: errors.code ? '#ef4444' : '#e5e7eb'
                                }}
                                required
                            />
                            {errors.code && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', fontWeight: 600 }}>{errors.code}</p>}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label style={labelStyle}>{tr('Description', 'বর্ণনা')}</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder={tr('Write a short note about this category...', 'এই ক্যাটাগরি সম্পর্কে একটি ছোট নোট লিখুন...')}
                            rows="3"
                            style={{
                                ...inputStyle,
                                resize: 'none'
                            }}
                        ></textarea>
                    </div>

                    {/* Settings Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
                        <div>
                            <label style={labelStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Palette size={14} color="#6366f1" />
                                    {tr('Brand Color', 'ব্র্যান্ড কালার')}
                                </div>
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ 
                                    width: '42px', height: '42px', borderRadius: '10px', 
                                    background: data.color, border: '2px solid #fff',
                                    boxShadow: '0 0 0 1.5px #e5e7eb', flexShrink: 0,
                                    cursor: 'pointer', position: 'relative'
                                }}>
                                    <input
                                        type="color"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        style={{
                                            position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={data.color}
                                    onChange={(e) => setData('color', e.target.value)}
                                    style={{
                                        ...inputStyle,
                                        fontFamily: 'monospace'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '20px' }}>
                            <div style={{
                                width: '44px', height: '24px', borderRadius: '12px',
                                background: data.is_active ? '#4f46e5' : '#d1d5db',
                                position: 'relative', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                                onClick={() => setData('is_active', !data.is_active)}
                            >
                                <div style={{
                                    width: '18px', height: '18px', borderRadius: '50%',
                                    background: '#fff', position: 'absolute', top: '3px',
                                    left: data.is_active ? '23px' : '3px', transition: 'all 0.2s'
                                }} />
                            </div>
                            <label style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }} onClick={() => setData('is_active', !data.is_active)}>
                                {tr('Category is Active', 'ক্যাটাগরি সক্রিয়')}
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1.5px solid #f9fafb' }}>
                        <Link href={route('expense-categories.index')}>
                            <button type="button" style={{
                                padding: '0.75rem 1.5rem', background: '#fff', border: '1.5px solid #e5e7eb',
                                borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700,
                                color: '#374151', cursor: 'pointer'
                            }}>
                                {tr('Cancel', 'বাতিল')}
                            </button>
                        </Link>
                        <button 
                            type="submit" 
                            disabled={processing}
                            style={{
                                padding: '0.75rem 2rem', background: '#4f46e5', border: 'none',
                                borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700,
                                color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                opacity: processing ? 0.7 : 1
                            }}
                        >
                            <Save size={18} />
                            {processing ? tr('Saving...', 'সেভ হচ্ছে...') : tr('Create Category', 'ক্যাটাগরি তৈরি করুন')}
                        </button>
                    </div>
                </form>
            </div>
        </FigmaLayout>
    );
}
