import React from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { t } from '../../Lang/translation';
import {
    ArrowLeft, Building2, User, Mail, Phone,
    MapPin, Save, ImagePlus, X, Loader2,
    ShieldCheck, Zap, DollarSign, Briefcase
} from 'lucide-react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        company_name: '',
        email: '',
        phone: '',
        address: '',
        status: 'active',
        payment_terms: '',
        credit_limit: 0,
        avatar: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('suppliers.store'));
    };

    const cardStyle = {
        background: '#fff',
        borderRadius: '24px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
        padding: '2rem',
    };

    const inputWrapper = {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginBottom: '1.25rem',
    };

    const inputLabel = {
        fontSize: '0.82rem',
        fontWeight: 700,
        color: '#64748b',
        paddingLeft: '0.5rem',
    };

    const inputStyle = {
        width: '100%',
        padding: '1rem',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        fontSize: '0.95rem',
        color: '#1e293b',
        fontWeight: 500,
        outline: 'none',
        transition: 'all 0.2s',
    };

    const errorStyle = {
        fontSize: '0.75rem',
        color: '#ef4444',
        paddingLeft: '0.5rem',
        marginTop: '0.25rem',
    };

    const onFocus = (e) => (e.target.style.borderColor = '#2563eb');
    const onBlur = (e) => (e.target.style.borderColor = '#e2e8f0');

    return (
        <FigmaLayout user={auth.user}>
            <Head title={t('add_supplier')} />

            <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <Link href={route('suppliers.index')}>
                        <button style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <ArrowLeft size={20} />
                        </button>
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{t('add_supplier')}</h1>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0' }}>{t('register_new_vendor')}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                    <div style={{ ...cardStyle }}>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem' }}>
                            <div style={{ position: 'relative', width: '96px', height: '96px' }}>
                                <div style={{ width: '100%', height: '100%', borderRadius: '24px', border: '2px dashed #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    {data.avatar ? (
                                        <img src={URL.createObjectURL(data.avatar)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                    ) : (
                                        <ImagePlus size={32} color="#cbd5e1" />
                                    )}
                                </div>
                                <input type="file" onChange={e => setData('avatar', e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                {data.avatar && (
                                    <button onClick={() => setData('avatar', null)} style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={inputWrapper}>
                                    <label style={inputLabel}>{t('company_name')}</label>
                                    <input type="text" value={data.company_name} onChange={e => setData('company_name', e.target.value)} onFocus={onFocus} onBlur={onBlur} style={inputStyle} placeholder={t('company_name')} required />
                                    {errors.company_name && <div style={errorStyle}>{errors.company_name}</div>}
                                </div>
                            </div>
                        </div>

                        <div style={{ spaceY: '1.25rem' }}>
                            <div style={inputWrapper}>
                                <label style={inputLabel}>{t('contact_person')}</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} onFocus={onFocus} onBlur={onBlur} style={inputStyle} placeholder={t('contact_name')} required />
                                {errors.name && <div style={errorStyle}>{errors.name}</div>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                <div style={inputWrapper}>
                                    <label style={inputLabel}>{t('email_address')}</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} onFocus={onFocus} onBlur={onBlur} style={inputStyle} placeholder={t('email_address')} />
                                    {errors.email && <div style={errorStyle}>{errors.email}</div>}
                                </div>
                                <div style={inputWrapper}>
                                    <label style={inputLabel}>{t('phone_number')}</label>
                                    <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} onFocus={onFocus} onBlur={onBlur} style={inputStyle} placeholder={t('phone_number')} required />
                                    {errors.phone && <div style={errorStyle}>{errors.phone}</div>}
                                </div>
                            </div>

                            <div style={inputWrapper}>
                                <label style={inputLabel}>{t('business_address')}</label>
                                <textarea value={data.address} onChange={e => setData('address', e.target.value)} onFocus={onFocus} onBlur={onBlur} style={{ ...inputStyle, minHeight: '100px', resize: 'none' }} placeholder={t('address_placeholder')} />
                                {errors.address && <div style={errorStyle}>{errors.address}</div>}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ ...cardStyle }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <DollarSign size={18} color="#2563eb" />
                                {t('financial_info')}
                            </h3>

                            <div style={inputWrapper}>
                                <label style={inputLabel}>{t('credit_limit')}</label>
                                <input type="number" value={data.credit_limit} onChange={e => setData('credit_limit', e.target.value)} onFocus={onFocus} onBlur={onBlur} style={inputStyle} placeholder="0.00" />
                                {errors.credit_limit && <div style={errorStyle}>{errors.credit_limit}</div>}
                            </div>

                            <div style={inputWrapper}>
                                <label style={inputLabel}>{t('payment_terms')}</label>
                                <input type="text" value={data.payment_terms} onChange={e => setData('payment_terms', e.target.value)} onFocus={onFocus} onBlur={onBlur} style={inputStyle} placeholder={t('payment_terms_placeholder')} />
                                {errors.payment_terms && <div style={errorStyle}>{errors.payment_terms}</div>}
                            </div>

                            <div style={inputWrapper}>
                                <label style={inputLabel}>{t('status')}</label>
                                <select value={data.status} onChange={e => setData('status', e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                                    <option value="active">{t('active')}</option>
                                    <option value="inactive">{t('inactive')}</option>
                                </select>
                                {errors.status && <div style={errorStyle}>{errors.status}</div>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                width: '100%', padding: '1.25rem', borderRadius: '18px',
                                background: '#2563eb', color: '#fff', border: 'none',
                                fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.2)',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            {processing ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                <>
                                    <Save size={20} />
                                    {t('save_supplier')}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </FigmaLayout>
    );
}
