import React, { useState, useRef, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, router, Link } from '@inertiajs/react';
import { 
    History, 
    Download, 
    Search, 
    Filter, 
    Calendar, 
    User, 
    Activity, 
    Eye,
    Plus,
    RefreshCw,
    Trash2,
    MousePointer,
    FileText,
    Database,
    Shield,
    Users,
    Smartphone,
    Settings,
    Globe,
    ChevronRight,
    SearchX,
    Clock,
    Zap,
    AlertCircle,
    CheckCircle2,
    X,
    Loader2
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
    width: '100%',
    height: '46px',
    padding: '0 1rem',
    borderRadius: '10px',
    border: '1.5px solid #ede9fe',
    background: '#f9f7ff',
    fontSize: '0.85rem',
    fontWeight: 600,
    outline: 'none',
    transition: 'all 0.2s',
    color: '#1e1b4b'
};

const iconBtn = (bg, color) => ({
    width: '32px', height: '32px', borderRadius: '8px',
    background: bg, border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color,
    transition: 'all 0.2s'
});

const getActionConfig = (action) => {
    const configs = {
        'created': { icon: Plus, bg: '#f0fdf4', color: '#16a34a', label: 'Added Record' },
        'updated': { icon: RefreshCw, bg: '#eff6ff', color: '#3b82f6', label: 'Modified Data' },
        'deleted': { icon: Trash2, bg: '#fff1f2', color: '#e11d48', label: 'Removed Log' },
        'viewed':  { icon: Eye, bg: '#f8fafc', color: '#64748b', label: 'Inspected' },
        'accessed':{ icon: MousePointer, bg: '#f5f3ff', color: '#8b5cf6', label: 'Page Entry' },
    };
    return configs[action] || { icon: Activity, bg: '#f9faff', color: '#64748b', label: action };
};

export default function Index({ auth, logs, actions, types, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedAction, setSelectedAction] = useState(filters.action || '');
    const [selectedType, setSelectedType] = useState(filters.type || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const isFirstRender = useRef(true);

    const handleFilter = () => {
        router.get(route('audit-logs.index'), {
            search: searchTerm,
            action: selectedAction,
            type: selectedType,
            start_date: startDate,
            end_date: endDate,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearchTerm(''); setSelectedAction(''); setSelectedType(''); setStartDate(''); setEndDate('');
        router.get(route('audit-logs.index'), {}, { preserveState: true });
    };

    const handleExport = () => {
        window.location.href = route('audit-logs.export', {
            search: searchTerm, action: selectedAction, type: selectedType, start_date: startDate, end_date: endDate,
        });
    };

    const summaryStats = [
        { label: 'System Pulsations', value: logs.total || 0, icon: Activity, bg: '#fef2f2', color: '#ef4444' },
        { label: 'Records Spawned', value: logs.data.filter(l => l.action === 'created').length, icon: Plus, bg: '#f0fdf4', color: '#16a34a' },
        { label: 'Security Audits', value: logs.data.filter(l => l.action === 'deleted').length, icon: Shield, bg: '#fefce8', color: '#ca8a04' },
        { label: 'Module Coverage', value: `${types.length} Tiers`, icon: Zap, bg: '#f5f3ff', color: '#6366f1' },
    ];

    return (
        <FigmaLayout user={auth.user}>
            <Head title="System Telemetry" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>

                {/* ── Header (Inventory Style) ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '3px' }}>
                            <History size={16} color="#ec4899" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#ec4899', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Audit Intelligence</span>
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>System Telemetry & Logs</h1>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '3px 0 0' }}>Comprehensive audit trail of all infrastructure changes and administrative actions</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                        <button onClick={handleExport} style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '0.6rem 1.125rem',
                            background: '#fff', border: '1.5px solid #ede9fe',
                            borderRadius: '12px', color: '#6366f1',
                            fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                            boxShadow: '0 1px 6px rgba(99,102,241,0.07)',
                        }}>
                            <Download size={15} /> Export Audit Archive
                        </button>
                    </div>
                </div>

                {/* ── Stat cards (Inventory Style) ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
                    {summaryStats.map((s, i) => (
                        <div key={i} style={{ ...card, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <s.icon size={22} color={s.color} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>{s.label}</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b', margin: 0, lineHeight: 1.2 }}>{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Sub-Navigation (Inventory Mini Style) ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    {[
                        { name: 'Devices', icon: Smartphone, href: route('devices.index'), color: '#0ea5e9' },
                        { name: 'Users', icon: Users, href: route('users.index'), color: '#8b5cf6' },
                        { name: 'Roles', icon: Shield, href: route('roles.index'), color: '#3b82f6' },
                        { name: 'Settings', icon: Settings, href: route('settings.index'), color: '#f43f5e' },
                    ].map((item, idx) => (
                        <Link key={idx} href={item.href} style={{ textDecoration: 'none' }}>
                            <div style={{ ...card, padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.background = `${item.color}05`; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0eeff'; e.currentTarget.style.background = '#fff'; }}
                            >
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${item.color}10`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <item.icon size={16} />
                                </div>
                                <span style={{ fontSize: '0.8rem', fontWeight: 850, color: '#1e1b4b' }}>{item.name} Hub</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* ── Filter Controls (Inventory Pattern) ── */}
                <div style={{ ...card, padding: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                        <div>
                            <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Telemetry Scan</label>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} color="#ec4899" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input type="text" placeholder="Scan by ID, user, or modules..." style={{ ...inputStyle, paddingLeft: '2.25rem', background: '#fff' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleFilter()} onFocus={onFocus} onBlur={onBlur} />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Operational Event</label>
                            <select style={{ ...inputStyle, background: '#fff' }} value={selectedAction} onChange={e => setSelectedAction(e.target.value)} onFocus={onFocus} onBlur={onBlur}>
                                <option value="">Global Actions</option>
                                {actions.map(action => (
                                    <option key={action} value={action}>{action.charAt(0).toUpperCase() + action.slice(1)}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Module Tier</label>
                            <select style={{ ...inputStyle, background: '#fff' }} value={selectedType} onChange={e => setSelectedType(e.target.value)} onFocus={onFocus} onBlur={onBlur}>
                                <option value="">All Tiers</option>
                                {types.map(type => (
                                    <option key={type} value={type}>{type ? type.split('\\').pop() : 'Hardware/System'}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                             <div>
                                <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Chronicle Start</label>
                                <input type="date" style={{ ...inputStyle, background: '#fff', padding: '0 0.5rem' }} value={startDate} onChange={e => setStartDate(e.target.value)} onFocus={onFocus} onBlur={onBlur} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Chronicle End</label>
                                <input type="date" style={{ ...inputStyle, background: '#fff', padding: '0 0.5rem' }} value={endDate} onChange={e => setEndDate(e.target.value)} onFocus={onFocus} onBlur={onBlur} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={handleFilter} style={{ flex: 2, height: '46px', background: '#1e1b4b', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(30,27,75,0.2)' }}>
                                <Filter size={16} /> Execute Audit
                            </button>
                            {(searchTerm || selectedAction || selectedType || startDate || endDate) && (
                                <button onClick={clearFilters} style={{ width: '46px', height: '46px', background: '#fff1f2', border: '1.5px solid #fee2e2', borderRadius: '12px', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Clear Chronicles">
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Telemetry Timeline (Row Pattern) ── */}
                {logs.data && logs.data.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {logs.data.map((log) => {
                            const actionCfg = getActionConfig(log.action);
                            const ActionIcon = actionCfg.icon;
                            
                            return (
                                <div key={log.id} style={{
                                    ...card, padding: '1rem 1.5rem',
                                    display: 'flex', alignItems: 'center',
                                    gap: '1.5rem', flexWrap: 'wrap',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = actionCfg.color; e.currentTarget.style.boxShadow = `0 8px 24px ${actionCfg.color}08`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0eeff'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    {/* Action Icon */}
                                    <div style={{ width: '52px', height: '52px', borderRadius: '15px', background: actionCfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1.5px solid ${actionCfg.color}15` }}>
                                        <ActionIcon size={24} color={actionCfg.color} />
                                    </div>

                                    {/* Event Identity */}
                                    <div style={{ flex: 1, minWidth: '240px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '0.65rem', fontWeight: 900, color: actionCfg.color, background: `${actionCfg.color}10`, padding: '2px 10px', borderRadius: '20px', border: `1px solid ${actionCfg.color}20`, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                               {actionCfg.label}
                                            </span>
                                            <p style={{ fontSize: '0.95rem', fontWeight: 850, color: '#1e1b4b', margin: 0 }}>
                                                {log.auditable_type ? log.auditable_type.split('\\').pop() : 'System Component'}
                                            </p>
                                            {log.auditable_id && <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#cbd5e1' }}>REF #{log.auditable_id}</span>}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8' }}>
                                                <User size={12} color="#cbd5e1" />
                                                {log.user?.name || 'Automated System'}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8' }}>
                                                <Globe size={12} color="#cbd5e1" />
                                                {log.ip_address || 'Internal Execution'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timestamp Context */}
                                    <div style={{ width: '180px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                            <p style={{ fontSize: '0.85rem', fontWeight: 850, color: '#1e1b4b', margin: 0 }}>
                                                {new Date(log.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <Clock size={14} color="#cbd5e1" />
                                        </div>
                                        <p style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 800, margin: '4px 0 0', textTransform: 'uppercase' }}>Chronological Sync</p>
                                    </div>

                                    {/* Action Arrow */}
                                    <div style={{ display: 'flex', gap: '8px', marginLeft: '1rem' }}>
                                        <Link href={route('audit-logs.show', log.id)} title="Inspect Snapshot">
                                            <button style={iconBtn('#f5f3ff', '#6366f1')}><Eye size={16} /></button>
                                        </Link>
                                        <div style={{ width: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: '#cbd5e1' }}>
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '6rem 1rem', border: '2px dashed #ede9fe', borderRadius: '18px', background: '#faf9ff' }}>
                        <SearchX size={48} color="#e0d9ff" style={{ margin: '0 auto 1.5rem' }} />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e1b4b', margin: '0 0 0.5rem' }}>No Chronicles Detected</h3>
                        <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: '0 0 2rem' }}>
                            Your system's telemetry archive is currently blank for the selected filters.
                        </p>
                        <button onClick={clearFilters} style={{ 
                            display: 'inline-flex', alignItems: 'center', gap: '8px', 
                            padding: '0.75rem 1.75rem', background: '#1e1b4b', 
                            border: 'none', borderRadius: '14px', color: '#fff', 
                            fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                        }}>
                             Reset Telemetry Scan
                        </button>
                    </div>
                )}

                {/* ── Pagination (Inventory Style) ── */}
                {logs.links && logs.links.length > 3 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', ...card, padding: '0.875rem 1.25rem' }}>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: 0, fontWeight: 600 }}>
                            Page <strong style={{ color: '#1e1b4b' }}>{logs.current_page}</strong> of <strong style={{ color: '#1e1b4b' }}>{logs.last_page}</strong>
                        </p>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {logs.links.map((link, i) => link.url ? (
                                <Link key={i} href={link.url} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '36px', height: '36px', padding: '0 10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none', background: link.active ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#f5f3ff', color: link.active ? '#fff' : '#6366f1', transition: 'all 0.2s' }} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : (
                                <span key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '36px', height: '36px', padding: '0 10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, background: '#f8fafc', color: '#d1d5db' }} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </FigmaLayout>
    );
}
