import React, { useState, useRef, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, router, Link } from '@inertiajs/react';
import { 
    History, Download, Search, Filter, Calendar, User, Activity, Eye,
    Plus, RefreshCw, Trash2, MousePointer, Shield, Users, Smartphone,
    Settings, Globe, ChevronRight, ChevronDown, SearchX, Clock, Zap, AlertCircle,
    CheckCircle2, X, Loader2, Layers, LayoutGrid
} from 'lucide-react';

const COLORS = {
    primary: '#4f46e5',
    success: '#10b981',
    info: '#3b82f6',
    danger: '#ef4444',
    warning: '#f59e0b',
    neutral: '#64748b'
};

const ACTION_CONFIG = {
    created: { label: 'Record Added', bg: '#f0fdf4', color: COLORS.success, icon: Plus },
    updated: { label: 'Data Changed', bg: '#eff6ff', color: COLORS.info, icon: RefreshCw },
    deleted: { label: 'Log Removed',  bg: '#fef2f2', color: COLORS.danger, icon: Trash2 },
    viewed:  { label: 'Viewed',       bg: '#f8fafc', color: COLORS.neutral, icon: Eye },
    accessed:{ label: 'Page Entry',   bg: '#f5f3ff', color: COLORS.primary, icon: MousePointer },
};

const styles = {
    card: {
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #f1f5f9',
        padding: '24px',
        transition: 'all 0.2s ease',
    },
    actionBtn: (bg, color) => ({
        width: '36px', height: '36px', borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: bg, color, border: 'none', cursor: 'pointer',
        transition: 'all 0.2s'
    })
};

export default function Index({ auth, logs, actions, types, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedAction, setSelectedAction] = useState(filters.action || '');
    const [selectedType, setSelectedType] = useState(filters.type || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const handleFilter = () => {
        router.get(route('audit-logs.index'), {
            search: searchTerm, action: selectedAction, type: selectedType,
            start_date: startDate, end_date: endDate,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearchTerm(''); setSelectedAction(''); setSelectedType(''); setStartDate(''); setEndDate('');
        router.get(route('audit-logs.index'), {}, { preserveState: true });
    };

    const handleExport = () => {
        window.location.href = route('audit-logs.export', {
            search: searchTerm, action: selectedAction, type: selectedType, 
            start_date: startDate, end_date: endDate,
        });
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Audit Tracking" />

            <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '4rem' }}>
                
                {/* ── HEADER ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
                            Audit Logs
                        </h1>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500, margin: '4px 0 0' }}>
                            Comprehensive history of all system activities and team actions
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={handleExport} style={secondaryBtn}>
                            <Download size={18} /> Export History
                        </button>
                    </div>
                </div>

                {/* ── METRIC STRIP ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <MiniStat label="Total Tracking Events" value={logs.total || 0} color="#4f46e5" icon={History} />
                    <MiniStat label="Records Created" value={logs.data.filter(l => l.action === 'created').length} color="#10b981" icon={Plus} />
                    <MiniStat label="Security Alerts" value={logs.data.filter(l => l.action === 'deleted').length} color="#ef4444" icon={Shield} />
                    <MiniStat label="Modules Monitored" value={types.length} color="#f59e0b" icon={Zap} />
                </div>

                {/* ── SUB-NAV HUB ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                    {[
                        { name: 'Devices', icon: Smartphone, href: route('devices.index'), color: '#0ea5e9' },
                        { name: 'Team Members', icon: Users, href: route('users.index'), color: '#8b5cf6' },
                        { name: 'Access Roles', icon: Shield, href: route('roles.index'), color: '#3b82f6' },
                        { name: 'System Settings', icon: Settings, href: route('settings.index'), color: '#f43f5e' },
                    ].map((item, idx) => (
                        <Link key={idx} href={item.href} style={{ textDecoration: 'none' }}>
                            <div style={{ ...styles.card, padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #f1f5f9' }} className="nav-card">
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${item.color}10`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <item.icon size={18} />
                                </div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{item.name}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* ── FILTER HUD ── */}
                <div style={{ ...styles.card, padding: '20px', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr 140px', gap: '1.25rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input 
                                type="text" placeholder="Search by name or reference ID..." 
                                style={filterInput} value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Activity size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <select value={selectedAction} onChange={e => setSelectedAction(e.target.value)} style={filterInput}>
                                <option value="">Action Type</option>
                                {actions.map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
                            </select>
                            <ChevronDown size={14} color="#94a3b8" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Layers size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <select value={selectedType} onChange={e => setSelectedType(e.target.value)} style={filterInput}>
                                <option value="">Module Tier</option>
                                {types.map(t => <option key={t} value={t}>{t ? t.split('\\').pop() : 'System Component'}</option>)}
                            </select>
                            <ChevronDown size={14} color="#94a3b8" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ ...filterInput, paddingLeft: '12px', paddingRight: '12px' }} />
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ ...filterInput, paddingLeft: '12px', paddingRight: '12px' }} />
                        </div>
                        <button onClick={handleFilter} style={{ height: '44px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}>
                            Execute Scan
                        </button>
                    </div>
                </div>

                {/* ── LOG LIST ── */}
                <div style={styles.card}>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1.5fr 1fr 1fr 140px 100px', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <div style={{ paddingLeft: '8px' }}>Action Taken</div>
                        <div>Target Component</div>
                        <div>Team Member</div>
                        <div>Source Identity</div>
                        <div style={{ textAlign: 'right' }}>Timestamp</div>
                        <div></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                        {logs.data.length > 0 ? logs.data.map((log, i) => {
                            const cfg = ACTION_CONFIG[log.action.toLowerCase()] || ACTION_CONFIG.viewed;
                            return (
                                <div key={log.id} className="log-row" style={{ 
                                    display: 'grid', gridTemplateColumns: '120px 1.5fr 1fr 1fr 140px 100px', 
                                    alignItems: 'center', padding: '16px 8px', borderRadius: '12px',
                                    transition: 'all 0.2s', borderBottom: i === logs.data.length - 1 ? 'none' : '1px solid #f8fafc'
                                }}>
                                    {/* ACTION */}
                                    <div>
                                        <span style={{ 
                                            background: cfg.bg, color: cfg.color, 
                                            fontSize: '0.7rem', fontWeight: 900, 
                                            padding: '4px 10px', borderRadius: '8px',
                                            textTransform: 'uppercase'
                                        }}>
                                            {cfg.label}
                                        </span>
                                    </div>

                                    {/* TARGET */}
                                    <div>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                            {log.auditable_type ? log.auditable_type.split('\\').pop() : 'Hardware Node'}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, margin: '2px 0 0' }}>Reference ID: #{log.auditable_id || '---'}</p>
                                    </div>

                                    {/* MEMBER */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
                                        <User size={14} color="#94a3b8" /> {log.user?.name || 'Automated Sync'}
                                    </div>

                                    {/* SOURCE */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 650 }}>
                                        <Globe size={14} color="#cbd5e1" /> {log.ip_address || 'Internal Pipe'}
                                    </div>

                                    {/* TIMESTAMP */}
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                            {new Date(log.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <p style={{ fontSize: '0.65rem', color: '#cbd5e1', fontWeight: 700, margin: '2px 0 0', textTransform: 'uppercase' }}>CHRONO SYNC</p>
                                    </div>

                                    {/* ACTIONS */}
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <Link href={route('audit-logs.show', log.id)}>
                                            <button style={styles.actionBtn('#f8fafc', '#64748b')} title="Inspect History"><Eye size={16} /></button>
                                        </Link>
                                        <div style={{ color: '#cbd5e1' }}><ChevronRight size={18} /></div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                                <SearchX size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#64748b', margin: 0 }}>No audit logs detected</h4>
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>Logs will appear here once system activity begins</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── PAGINATION ── */}
                {logs.links && logs.links.length > 3 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
                        <div style={{ display: 'flex', background: '#fff', padding: '6px', borderRadius: '14px', border: '1px solid #f1f5f9', gap: '4px' }}>
                            {logs.links.map((link, i) => (
                                link.url ? (
                                    <Link key={i} href={link.url}
                                        style={{
                                            height: '36px', minWidth: '36px', padding: '0 12px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700,
                                            background: link.active ? '#4f46e5' : 'transparent',
                                            color: link.active ? '#fff' : '#64748b',
                                            textDecoration: 'none', transition: 'all 0.2s'
                                        }}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span key={i} style={{ height: '36px', minWidth: '36px', padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1' }} dangerouslySetInnerHTML={{ __html: link.label }} />
                                )
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .log-row:hover { background: #f8fafc !important; transform: translateX(4px); }
                .nav-card:hover { border-color: ${COLORS.primary} !important; background: ${COLORS.primary}05 !important; }
            `}</style>
        </FigmaLayout>
    );
}

function MiniStat({ label, value, color, icon: Icon }) {
    return (
        <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>{label}</p>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${color}10`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} />
                </div>
            </div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '8px 0 0' }}>{value}</h4>
        </div>
    );
}

const filterInput = {
    width: '100%', padding: '12px 16px 12px 48px', background: '#f8fafc',
    border: '1px solid #f1f5f9', borderRadius: '12px', fontSize: '0.85rem',
    outline: 'none', fontWeight: 600, color: '#1e293b', appearance: 'none',
    height: '44px'
};

const secondaryBtn = { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', color: '#475569', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' };
