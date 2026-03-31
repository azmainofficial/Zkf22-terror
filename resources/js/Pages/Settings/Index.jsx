import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { t } from '../../Lang/translation';
import { 
    Settings as SettingsIcon, 
    Upload, 
    Save, 
    Building, 
    Image as ImageIcon, 
    CreditCard, 
    Plus, 
    Trash2, 
    CheckCircle2, 
    Smartphone,
    Users,
    Lock,
    History,
    ChevronRight,
    Globe,
    ShieldCheck,
    Zap,
    X,
    Check
} from 'lucide-react';

const cardStyle = {
    background: '#fff',
    borderRadius: '24px',
    border: '1px solid #f0f4f8',
    padding: '2rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
    transition: 'all 0.3s ease'
};

const inputStyle = {
    width: '100%',
    height: '50px',
    padding: '0 1.25rem',
    borderRadius: '12px',
    border: '1.5px solid #eef2f6',
    background: '#fff',
    fontSize: '0.9rem',
    fontWeight: 500,
    outline: 'none',
    transition: 'all 0.2s',
    color: '#1e293b'
};

const labelStyle = {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#475569',
    display: 'block',
    marginBottom: '8px',
    paddingLeft: '2px'
};

export default function Index({ auth, settings, paymentMethods = [] }) {
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
        post(route('settings.update'), {
            forceFormData: true,
        });
    };

    const handleAddPaymentMethod = (e) => {
        e.preventDefault();
        if (!newMethodName.trim()) return;
        router.post(route('payment-methods.store'), { name: newMethodName }, {
            onSuccess: () => setNewMethodName(''),
            preserveScroll: true
        });
    };

    const handleDeletePaymentMethod = (id) => {
        if (confirm(t('delete_payment_method_confirm'))) {
            router.delete(route('payment-methods.destroy', id), { preserveScroll: true });
        }
    };

    const togglePaymentMethodStatus = (method) => {
        router.patch(route('payment-methods.update', method.id), {
            name: method.name,
            is_active: !method.is_active
        }, { preserveScroll: true });
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={t('settings')} />

            <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '4rem' }}>
                
                {/* ── Page Title ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{t('settings')}</h1>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500, margin: '8px 0 0' }}>{t('configure_identity_subtitle')}</p>
                    </div>
                </div>

                {/* ── Navigation Grid ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                    {[
                        { name: t('devices'), label: t('face_finger_hardware'), icon: Smartphone, href: route('devices.index'), color: '#3b82f6' },
                        { name: t('hr_team'), label: t('team_accounts'), icon: Users, href: route('users.index'), color: '#10b981' },
                        { name: t('admin'), label: t('access_permissions'), icon: Lock, href: route('roles.index'), color: '#f59e0b' },
                        { name: t('logs'), label: t('system_history'), icon: History, href: route('audit-logs.index'), color: '#ec4899' },
                    ].map((item, idx) => (
                        <Link key={idx} href={item.href} style={{ textDecoration: 'none' }}>
                            <div style={{ ...cardStyle, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f4f8'; e.currentTarget.style.transform = 'none'; }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${item.color}10`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <item.icon size={20} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{item.name}</h4>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, margin: 0 }}>{item.label}</p>
                                </div>
                                <ChevronRight size={14} color="#cbd5e1" style={{ marginLeft: 'auto' }} />
                            </div>
                        </Link>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }} className="settings-main-grid">
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Company Identity */}
                        <div style={cardStyle}>
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{t('business_identity')}</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, marginTop: '4px' }}>{t('business_appearance_desc')}</p>
                            </div>

                            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '2rem', background: '#fafbfc', borderRadius: '20px', marginBottom: '1rem' }}>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ 
                                            width: '120px', 
                                            height: '120px', 
                                            borderRadius: '24px', 
                                            background: '#fff', 
                                            border: '3px solid #6366f1', // Direct border on logo as requested
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            overflow: 'hidden',
                                            boxShadow: '0 8px 20px rgba(99,102,241,0.1)'
                                        }}>
                                            {preview ? <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }} /> : <ImageIcon size={40} color="#cbd5e1" />}
                                        </div>
                                        <input type="file" id="logo-upload" style={{ display: 'none' }} onChange={handleFileChange} />
                                        <label htmlFor="logo-upload" style={{
                                            position: 'absolute',
                                            bottom: '-10px',
                                            right: '-10px',
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: '#6366f1',
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                            border: '3px solid #fff'
                                        }}>
                                            <Upload size={16} />
                                        </label>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{t('upload_company_logo')}</h4>
                                        <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>{t('upload_logo_hint')}</p>
                                    </div>
                                </div>

                                <div>
                                    <label style={labelStyle}>{t('business_name')}</label>
                                    <input type="text" value={data.app_name} onChange={e => setData('app_name', e.target.value)} placeholder={t('enter_business_name')} style={inputStyle} />
                                    {errors.app_name && <p style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, marginTop: '8px' }}>{errors.app_name}</p>}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                    <button disabled={processing} style={{ height: '48px', padding: '0 2rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}>
                                        <Save size={18} /> {processing ? t('saving') : t('save_settings')}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* System Info Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                    <Globe size={18} color="#2563eb" />
                                    <h4 style={{ fontSize: '0.850rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{t('region_time')}</h4>
                                </div>
                                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', margin: '0' }}>Asia / Dhaka (GMT+6)</p>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#059669', background: '#f0fdf4', padding: '4px 8px', borderRadius: '6px', display: 'inline-block', marginTop: '12px' }}>{t('auto_synced')}</span>
                            </div>
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                    <ShieldCheck size={18} color="#059669" />
                                    <h4 style={{ fontSize: '0.850rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{t('data_security')}</h4>
                                </div>
                                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', margin: '0' }}>{t('realtime_encryption')}</p>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '4px 8px', borderRadius: '6px', display: 'inline-block', marginTop: '12px' }}>{t('protected')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ ...cardStyle, background: '#0f172a', color: '#fff', border: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <CreditCard size={20} color="#a5b4fc" />
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>{t('payment_methods')}</h3>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, lineHeight: 1.5, marginBottom: '2rem' }}>{t('payment_methods_desc')}</p>
                            
                            <form onSubmit={handleAddPaymentMethod} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <input 
                                    type="text" 
                                    value={newMethodName} 
                                    onChange={e => setNewMethodName(e.target.value)} 
                                    placeholder="e.g. PayPal, Bank AC"
                                    style={{ width: '100%', height: '48px', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', padding: '0 1rem', fontWeight: 600, outline: 'none', fontSize: '0.85rem' }}
                                />
                                <button style={{ width: '100%', height: '48px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
                                    <Plus size={18} /> {t('add_new_method')}
                                </button>
                            </form>
                        </div>

                        <div style={cardStyle}>
                            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>{t('active_methods')}</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {paymentMethods.length > 0 ? paymentMethods.map(method => (
                                    <div key={method.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#fafbfc', borderRadius: '14px', border: '1px solid #f0f4f8' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: method.is_active ? '#10b981' : '#cbd5e1' }} />
                                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{method.name}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <button 
                                                onClick={() => togglePaymentMethodStatus(method)} 
                                                style={{ 
                                                    width: '40px', 
                                                    height: '24px', 
                                                    borderRadius: '12px', 
                                                    border: 'none', 
                                                    background: method.is_active ? '#6366f1' : '#e2e8f0', 
                                                    position: 'relative', 
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <div style={{ 
                                                    width: '18px', 
                                                    height: '18px', 
                                                    borderRadius: '50%', 
                                                    background: '#fff', 
                                                    position: 'absolute', 
                                                    top: '3px', 
                                                    left: method.is_active ? '19px' : '3px',
                                                    transition: 'all 0.2s'
                                                }} />
                                            </button>
                                            <button onClick={() => handleDeletePaymentMethod(method.id)} style={{ padding: '6px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#cbd5e1', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8', padding: '2rem 0' }}>{t('no_payment_methods')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .settings-main-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </FigmaLayout>
    );
}
