import React, { useState, useRef } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Cpu, 
    Smartphone, 
    Signal, 
    SignalLow, 
    MapPin, 
    Check, 
    X,
    Activity,
    ShieldCheck,
    Globe,
    Clock,
    HardDrive,
    Monitor,
    Edit3,
    Server,
    Zap,
    ChevronRight,
    Wifi,
    WifiOff,
    MoreVertical,
    Save
} from 'lucide-react';

// ─── Shared styles from Inventory patterns ──────────────────────
const card = {
    background: '#fff', 
    borderRadius: '16px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
};

const onFocus = e => { 
    e.target.style.borderColor = '#8b5cf6'; 
    e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; 
};

const onBlur = e => { 
    e.target.style.borderColor = '#ede9fe'; 
    e.target.style.boxShadow = 'none'; 
};

const inputStyle = {
    height: '42px',
    padding: '0 1rem',
    borderRadius: '10px',
    border: '1.5px solid #ede9fe',
    background: '#f9f7ff',
    fontSize: '0.85rem',
    fontWeight: 700,
    outline: 'none',
    color: '#1e1b4b',
    width: '240px',
    transition: 'all 0.2s'
};

const iconBtn = (bg, color) => ({
    width: '36px', height: '36px', borderRadius: '10px',
    background: bg, border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color,
    transition: 'all 0.2s'
});

export default function DevicesIndex({ auth, devices }) {
    const [editingId, setEditingId] = useState(null);
    const { data, setData, patch, processing, reset } = useForm({
        device_name: '',
    });

    const startEditing = (device) => {
        setEditingId(device.id);
        setData('device_name', device.device_name || '');
    };

    const cancelEditing = () => {
        setEditingId(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route('devices.update', editingId), {
            onSuccess: () => setEditingId(null),
            preserveScroll: true
        });
    };

    const onlineCount = devices.filter(d => d.is_online).length;
    const offlineCount = devices.length - onlineCount;

    const statCards = [
        { label: 'Active Terminals', value: onlineCount, icon: Wifi, bg: '#f0fdf4', color: '#16a34a' },
        { label: 'Idle Hardware', value: offlineCount, icon: WifiOff, bg: '#fff1f2', color: '#dc2626' },
        { label: 'Net Registered', value: devices.length, icon: Server, bg: '#f5f3ff', color: '#6366f1' },
    ];

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Hardware Matrix" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>

                {/* ── Header (Inventory Style) ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '3px' }}>
                            <Monitor size={16} color="#0ea5e9" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Network Infrastructure</span>
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Terminals & Devices</h1>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '3px 0 0' }}>Monitor physical installation status and machine communication health</p>
                    </div>
                </div>

                {/* ── Stat cards (Inventory Style) ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem' }}>
                    {statCards.map((s, i) => (
                        <div key={i} style={{ ...card, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <s.icon size={22} color={s.color} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>{s.label}</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b', margin: 0, lineHeight: 1.2 }}>{s.value} Stations</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Device Rows (Inventory Pattern) ── */}
                {devices.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {devices.map(device => {
                            const isOnline = !!device.is_online;
                            const isEditing = editingId === device.id;

                            return (
                                <div key={device.id} style={{
                                    ...card, padding: '1rem 1.5rem',
                                    display: 'flex', alignItems: 'center',
                                    gap: '1.5rem', flexWrap: 'wrap',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#0ea5e9'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(14,165,233,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0eeff'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    {/* Connectivity Icon */}
                                    <div style={{ width: '52px', height: '52px', borderRadius: '15px', background: isOnline ? '#f0fdf4' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1.5px solid ${isOnline ? '#dcfce7' : '#f1f5f9'}` }}>
                                        {isOnline ? (
                                            <div style={{ position: 'relative' }}>
                                                <Wifi size={24} color="#16a34a" />
                                                <div style={{ position: 'absolute', top: -2, right: -2, width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a', border: '2px solid #fff', animation: 'pulse 1.5s infinite' }}></div>
                                            </div>
                                        ) : (
                                            <WifiOff size={24} color="#94a3b8" />
                                        )}
                                    </div>

                                    {/* Name & Site */}
                                    <div style={{ flex: 1, minWidth: '220px' }}>
                                        {isEditing ? (
                                            <form onSubmit={submit} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <input type="text" value={data.device_name} onChange={e => setData('device_name', e.target.value)} style={inputStyle} autoFocus onFocus={onFocus} onBlur={onBlur} />
                                                <button type="submit" disabled={processing} style={iconBtn('#10b981', '#fff')}><Check size={16} /></button>
                                                <button type="button" onClick={cancelEditing} style={iconBtn('#fff1f2', '#ef4444')}><X size={16} /></button>
                                            </form>
                                        ) : (
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <p style={{ fontSize: '1rem', fontWeight: 850, color: '#1e1b4b', margin: 0 }}>{device.device_name || 'Generic Site'}</p>
                                                    <button onClick={() => startEditing(device)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '6px' }} onMouseEnter={e => e.currentTarget.style.color = '#0ea5e9'} onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}>
                                                        <Edit3 size={14} />
                                                    </button>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                                    <MapPin size={12} color="#94a3b8" />
                                                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Physical Installation</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Hardware Fingerprint */}
                                    <div style={{ width: '180px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Cpu size={14} color="#94a3b8" />
                                            <p style={{ fontSize: '0.82rem', fontWeight: 750, color: '#4b5563', margin: 0, fontFamily: 'monospace' }}>{device.serial_number}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                            <Globe size={14} color="#94a3b8" />
                                            <p style={{ fontSize: '0.82rem', fontWeight: 750, color: '#4b5563', margin: 0 }}>{device.ip_address || '0.0.0.0'}</p>
                                        </div>
                                    </div>

                                    {/* Last Seen */}
                                    <div style={{ width: '180px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Clock size={14} color="#94a3b8" />
                                            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', margin: 0 }}>
                                                {device.last_seen_at ? new Date(device.last_seen_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Never Sync'}
                                            </p>
                                        </div>
                                        <p style={{ fontSize: '0.65rem', color: isOnline ? '#16a34a' : '#9ca3af', fontWeight: 850, margin: '4px 0 0', textTransform: 'uppercase' }}>
                                            {isOnline ? 'Communication Active' : 'Signal Lost'}
                                        </p>
                                    </div>

                                    {/* Status Badge */}
                                    <div style={{ minWidth: '120px', textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: isOnline ? '#f0fdf4' : '#f8fafc', border: `1.5px solid ${isOnline ? '#16a34a15' : '#f1f5f9'}` }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOnline ? '#16a34a' : '#94a3b8' }} />
                                            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: isOnline ? '#16a34a' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {isOnline ? 'Network Hub' : 'Offline Mode'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Context Arrow */}
                                    <div style={{ width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: '#cbd5e1' }}>
                                        <ChevronRight size={18} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '6rem 1rem', border: '2px dashed #ede9fe', borderRadius: '18px', background: '#faf9ff' }}>
                        <Server size={48} color="#e0d9ff" style={{ margin: '0 auto 1.5rem' }} />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e1b4b', margin: '0 0 0.5rem' }}>No Hardware Detected</h3>
                        <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: '0 0 2rem' }}>
                            Hardware terminals and biometric devices haven't been registered yet.
                        </p>
                        <button style={{ 
                            display: 'inline-flex', alignItems: 'center', gap: '8px', 
                            padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', 
                            border: 'none', borderRadius: '14px', color: '#fff', 
                            fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                            boxShadow: '0 6px 16px rgba(14,165,233,0.25)'
                        }}>
                             Connect First Terminal
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.4); }
                    70% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 0 10px rgba(22, 163, 74, 0); }
                    100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
                }
            `}</style>
        </FigmaLayout>
    );
}
