import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { 
    Settings as SettingsIcon, 
    Upload, 
    Save, 
    Building2, 
    Image as ImageIcon, 
    CreditCard, 
    Plus, 
    Trash2, 
    CheckCircle2, 
    XCircle, 
    FileText, 
    ChevronRight,
    Puzzle,
    Key,
    History,
    Users,
    Cpu,
    Smartphone,
    LayoutDashboard,
    Palette,
    ShieldCheck,
    Lock,
    Globe,
    Zap,
    Mail,
    Bell
} from 'lucide-react';

const cardStyle = {
    background: '#fff',
    borderRadius: '16px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
    padding: '1.5rem',
    position: 'relative',
    transition: 'all 0.2s'
};

const inputStyle = {
    width: '100%',
    height: '46px',
    padding: '0 1rem',
    borderRadius: '10px',
    border: '1.5px solid #ede9fe',
    background: '#f9f7ff',
    fontSize: '0.85rem',
    fontWeight: 700,
    outline: 'none',
    transition: 'all 0.2s',
    color: '#1e1b4b'
};

const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 800,
    color: '#a78bfa',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    display: 'block',
    marginBottom: '8px'
};

const onFocus = e => {
    e.target.style.borderColor = '#8b5cf6';
    e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)';
};

const onBlur = e => {
    e.target.style.borderColor = '#ede9fe';
    e.target.style.boxShadow = 'none';
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
        if (confirm('Are you sure you want to delete this payment method?')) {
            router.delete(route('payment-methods.destroy', id), { preserveScroll: true });
        }
    };

    const togglePaymentMethodStatus = (method) => {
        router.patch(route('payment-methods.update', method.id), {
            name: method.name,
            is_active: !method.is_active
        }, { preserveScroll: true });
    };

    const statCards = [
        { label: 'Platform Engine', value: data.app_name || 'ZK Base SDK', icon: Cpu, bg: '#f5f3ff', color: '#6366f1' },
        { label: 'Payment Protocols', value: `${paymentMethods.length} Methods`, icon: CreditCard, bg: '#eff6ff', color: '#3b82f6' },
        { label: 'Active Services', value: paymentMethods.filter(m => m.is_active).length, icon: Zap, bg: '#f0fdf4', color: '#16a34a' },
    ];

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Core Settings" />

            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '4rem' }}>
                
                {/* Header (Inventory Style) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '3px' }}>
                            <SettingsIcon size={16} color="#a78bfa" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Control Panel</span>
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>System Parameters</h1>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '3px 0 0' }}>Configure company identity and transactional protocols</p>
                    </div>
                </div>

                {/* Sub-Navigation Grid (Aligned with Roles pattern) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                    {[
                        { name: 'Devices', label: 'Biometric hardware', icon: Smartphone, href: route('devices.index'), color: '#3b82f6' },
                        { name: 'User Directory', label: 'Access accounts', icon: Users, href: route('users.index'), color: '#10b981' },
                        { name: 'Access Rules', label: 'RBAC & Tiers', icon: Lock, href: route('roles.index'), color: '#f59e0b' },
                        { name: 'Audit Logs', label: 'Activity history', icon: History, href: route('audit-logs.index'), color: '#ec4899' },
                    ].map((item, idx) => (
                        <Link key={idx} href={item.href} style={{ textDecoration: 'none' }}>
                            <div style={{ ...cardStyle, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s', cursor: 'pointer', border: '1.5px solid #f1f5f9' }} onMouseEnter={e => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.boxShadow = `0 4px 12px ${item.color}10`; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.boxShadow = 'none'; }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${item.color}10`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <item.icon size={20} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 850, color: '#1e1b4b', margin: 0 }}>{item.name}</h4>
                                    <p style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, margin: 0 }}>{item.label}</p>
                                </div>
                                <div style={{ marginLeft: 'auto', color: '#cbd5e1' }}>
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Stat Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '1rem' }}>
                    {statCards.map((s, i) => (
                        <div key={i} style={{ ...cardStyle, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <s.icon size={22} color={s.color} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{s.label}</p>
                                <p style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e1b4b', margin: 0, lineHeight: 1.2 }}>{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem' }} className="settings-grid">
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Application Identity Card */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#f5f3ff', padding: '10px', borderRadius: '12px' }}>
                                    <Building2 size={24} color="#6366f1" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Identity & Presence</h3>
                                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, margin: 0 }}>Set your custom branding and platform title</p>
                                </div>
                            </div>

                            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={labelStyle}>Platform Title</label>
                                    <input type="text" value={data.app_name} onChange={e => setData('app_name', e.target.value)} placeholder="e.g. ZK Force HQ" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                                    {errors.app_name && <p style={{ color: '#ef4444', fontSize: '0.7rem', fontWeight: 800, marginTop: '8px' }}>{errors.app_name}</p>}
                                </div>

                                <div>
                                    <label style={labelStyle}>Brand Representative (Logo)</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem', background: '#fdfbff', borderRadius: '14px', border: '1.5px dashed #ede9fe' }}>
                                        <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: '#fff', border: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                            {preview ? <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} /> : <ImageIcon size={32} color="#cbd5e1" />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <input type="file" id="logo-upload" style={{ display: 'none' }} onChange={handleFileChange} />
                                            <label htmlFor="logo-upload" style={{ display: 'inline-flex', height: '40px', padding: '0 1rem', background: '#1e1b4b', color: '#fff', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', alignItems: 'center', gap: '8px' }}>
                                                <Upload size={14} /> Update Logo
                                            </label>
                                            <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, marginTop: '8px' }}>Recommend PNG with transparent background.</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button disabled={processing} style={{ height: '46px', padding: '0 1.5rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(99,102,241,0.2)' }}>
                                        <Save size={18} /> {processing ? 'Syncing...' : 'Apply Identity'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Additional Config Section */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ ...cardStyle, opacity: 0.7 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                    <Globe size={18} color="#94a3b8" />
                                    <h4 style={{ fontSize: '0.8rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>System Region</h4>
                                </div>
                                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', margin: '1rem 0' }}>UTC+06:00 (Dhaka Time)</p>
                                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#10b981', background: '#ecfdf5', padding: '4px 8px', borderRadius: '6px' }}>AUTOMATICALLY SYNCED</span>
                            </div>
                            <div style={{ ...cardStyle, opacity: 0.7 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                    <ShieldCheck size={18} color="#94a3b8" />
                                    <h4 style={{ fontSize: '0.8rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Engine Security</h4>
                                </div>
                                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', margin: '1rem 0' }}>CSRF/XSS Protections</p>
                                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#3b82f6', background: '#eff6ff', padding: '4px 8px', borderRadius: '6px' }}>STRICT MODE ACTIVE</span>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Payment Methods */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#fff', border: 'none', boxShadow: '0 10px 30px rgba(30,27,75,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                <CreditCard size={20} color="#6366f1" />
                                <h3 style={{ fontSize: '1rem', fontWeight: 900, margin: 0 }}>Payment Protocol</h3>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600, lineHeight: 1.5, marginBottom: '2rem' }}>Authorize new transaction methods for financial documentation and invoicing.</p>
                            
                            <form onSubmit={handleAddPaymentMethod} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <input 
                                    type="text" 
                                    value={newMethodName} 
                                    onChange={e => setNewMethodName(e.target.value)} 
                                    placeholder="e.g. PayPal, Bank AC"
                                    style={{ width: '100%', height: '46px', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', padding: '0 1rem', fontWeight: 700, outline: 'none', fontSize: '0.85rem' }}
                                />
                                <button style={{ width: '100%', height: '46px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                                    <Plus size={16} /> Register Protocol
                                </button>
                            </form>
                        </div>

                        <div style={{ ...cardStyle, borderRadius: '20px' }}>
                            <h4 style={{ fontSize: '0.7rem', fontWeight: 900, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1.25rem' }}>Active Methods</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {paymentMethods.map(method => (
                                    <div key={method.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1.5px solid #f1f5f9', transition: 'all 0.2s' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: method.is_active ? '#10b981' : '#cbd5e1' }} />
                                            <span style={{ fontSize: '0.85rem', fontWeight: 850, color: '#1e1b4b' }}>{method.name}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <button onClick={() => togglePaymentMethodStatus(method)} style={{ height: '28px', padding: '0 10px', borderRadius: '6px', border: 'none', background: method.is_active ? '#ecfdf5' : '#fff1f2', color: method.is_active ? '#10b981' : '#ef4444', fontSize: '0.6rem', fontWeight: 900, cursor: 'pointer' }}>
                                                {method.is_active ? 'ON' : 'OFF'}
                                            </button>
                                            <button onClick={() => handleDeletePaymentMethod(method.id)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 1000px) {
                    .settings-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </FigmaLayout>
    );
}
