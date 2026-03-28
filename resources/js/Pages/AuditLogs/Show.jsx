import React from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, router, Link } from '@inertiajs/react';
import { 
    History, 
    ArrowLeft, 
    User, 
    Calendar, 
    Activity, 
    MapPin, 
    Monitor, 
    FileText,
    ChevronLeft,
    Clock,
    Globe,
    Cpu,
    GitBranch,
    RefreshCw,
    Plus,
    Trash2,
    MousePointer,
    Eye
} from 'lucide-react';

const cardStyle = {
    background: '#fff',
    borderRadius: '24px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden'
};

export default function Show({ auth, log }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const getActionConfig = (action) => {
        const configs = {
            'created': { icon: Plus, bg: '#ecfdf5', color: '#10b981', label: 'Added', border: '#a7f3d0' },
            'updated': { icon: RefreshCw, bg: '#eff6ff', color: '#3b82f6', label: 'Modified', border: '#bfdbfe' },
            'deleted': { icon: Trash2, bg: '#fff1f2', color: '#ef4444', label: 'Removed', border: '#fecdd3' },
            'viewed': { icon: Eye, bg: '#f8fafc', color: '#94a3b8', label: 'Viewed', border: '#e2e8f0' },
            'accessed': { icon: MousePointer, bg: '#f5f3ff', color: '#8b5cf6', label: 'Accessed', border: '#ddd6fe' },
        };
        return configs[action] || { icon: Activity, bg: '#f9faff', color: '#64748b', label: action, border: '#e2e8f0' };
    };

    const actionCfg = getActionConfig(log.action);
    const ActionIcon = actionCfg.icon;

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Event Details" />

            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link href={route('audit-logs.index')} style={{ textDecoration: 'none' }}>
                        <button style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff', border: '1.5px solid #f0eeff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                            <ChevronLeft size={20} />
                        </button>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: actionCfg.bg, border: `1.5px solid ${actionCfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: actionCfg.color }}>
                            <ActionIcon size={28} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.02em', textTransform: 'capitalize' }}>
                                {log.description || `${actionCfg.label} Record`}
                            </h1>
                            <p style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 600, margin: '4px 0 0' }}>Detailed overview of the recorded system event</p>
                        </div>
                    </div>
                </div>

                {/* Main Information Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ ...cardStyle }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={16} color="#6366f1" /> Actor Information
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f8fafc', border: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 900, fontSize: '1.1rem' }}>
                                {(log.user?.name || 'S').charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>{log.user?.name || 'System Auto-Processor'}</p>
                                {log.user?.email && <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, margin: '2px 0 0' }}>{log.user.email}</p>}
                                <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginTop: '6px' }}>{log.user ? 'Authenticated User' : 'System Automation'}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ ...cardStyle }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={16} color="#6366f1" /> Event Details
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <Calendar size={16} color="#cbd5e1" style={{ marginTop: '2px' }} />
                                <div>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 2px' }}>Timestamp</p>
                                    <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{formatDate(log.created_at)}</p>
                                </div>
                            </div>
                            {log.auditable_type && (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <Activity size={16} color="#cbd5e1" style={{ marginTop: '2px' }} />
                                    <div>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 2px' }}>Category</p>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{log.auditable_type.split('\\').pop()} #{log.auditable_id}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ ...cardStyle }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Globe size={16} color="#6366f1" /> Device & Network
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {log.ip_address && (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <MapPin size={16} color="#cbd5e1" style={{ marginTop: '2px' }} />
                                    <div>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 2px' }}>IP Address</p>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e1b4b', fontFamily: 'monospace', margin: 0 }}>{log.ip_address}</p>
                                    </div>
                                </div>
                            )}
                            {log.user_agent && (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <Cpu size={16} color="#cbd5e1" style={{ marginTop: '2px' }} />
                                    <div>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 2px' }}>Browser Info</p>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', margin: 0, lineHeight: 1.5, wordBreak: 'break-all' }}>{log.user_agent}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Changes Delta Block */}
                {(log.old_values || log.new_values) && (
                    <div style={{ ...cardStyle }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f5f3ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <GitBranch size={20} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Recorded Changes</h3>
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, margin: '2px 0 0' }}>Data snapshot representing exactly what was altered</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {log.old_values && Object.keys(log.old_values).length > 0 && (
                                <div style={{ border: '1.5px solid #fecdd3', borderRadius: '16px', overflow: 'hidden' }}>
                                    <div style={{ background: '#fff1f2', padding: '12px 16px', borderBottom: '1.5px solid #fecdd3' }}>
                                        <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: '#ef4444', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Previous State</h4>
                                    </div>
                                    <div style={{ background: '#fdf2f8', padding: '16px', overflowX: 'auto' }}>
                                        <pre style={{ fontSize: '0.85rem', color: '#831843', margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontWeight: 600 }}>
                                            {JSON.stringify(log.old_values, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {log.new_values && Object.keys(log.new_values).length > 0 && (
                                <div style={{ border: '1.5px solid #a7f3d0', borderRadius: '16px', overflow: 'hidden' }}>
                                    <div style={{ background: '#ecfdf5', padding: '12px 16px', borderBottom: '1.5px solid #a7f3d0' }}>
                                        <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: '#10b981', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>New State</h4>
                                    </div>
                                    <div style={{ background: '#f0fdf4', padding: '16px', overflowX: 'auto' }}>
                                        <pre style={{ fontSize: '0.85rem', color: '#064e3b', margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontWeight: 600 }}>
                                            {JSON.stringify(log.new_values, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </FigmaLayout>
    );
}

