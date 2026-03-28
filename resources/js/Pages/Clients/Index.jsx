import React, { useState, useEffect, useRef } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    Building2,
    Mail,
    Phone,
    Globe,
    Filter,
    Users,
    Briefcase,
    Zap,
    TrendingUp,
    ChevronDown,
    Activity,
    User,
    ArrowRight,
    Inbox,
    ShieldCheck,
    MoreVertical,
    LifeBuoy,
    Edit,
    ChevronRight,
    MapPin,
    Building,
    ExternalLink,
    X,
    Download,
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

const iconBtn = (bg, color) => ({
    width: '32px', height: '32px', borderRadius: '8px',
    background: bg, border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color,
    transition: 'all 0.2s'
});

const getStatusConfig = (s) => {
    const status = (s || 'active').toLowerCase();
    const config = {
        active:      { label: 'Verified Partner', bg: '#f0fdf4', color: '#16a34a', icon: ShieldCheck },
        prospective:  { label: 'Strategic Lead',  bg: '#eff6ff', color: '#3b82f6', icon: Zap },
        inactive:    { label: 'Archived Client',  bg: '#f8fafc', color: '#94a3b8', icon: Activity },
    };
    return config[status] || config.active;
};

export default function Index({ auth, clients, filters, stats }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'All');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const t = setTimeout(() => {
            router.get(route('clients.index'), { search, status }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(t);
    }, [search, status]);

    const clearFilters = () => { setSearch(''); setStatus('All'); };
    const hasFilters = search || status !== 'All';

    const statCards = [
        { label: 'Client Ecosystem', value: stats?.total || 0, icon: Users, bg: '#f5f3ff', color: '#6366f1' },
        { label: 'Active Pipeline', value: stats?.active || 0, icon: ShieldCheck, bg: '#f0fdf4', color: '#16a34a' },
        { label: 'Unconverted Leads', value: stats?.prospective || 0, icon: Zap, bg: '#eff6ff', color: '#3b82f6' },
        { label: 'Portfolio Growth', value: '+12.4%', icon: TrendingUp, bg: '#fff7ed', color: '#f59e0b' },
    ];

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Strategic Clients" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>

                {/* ── Header (Inventory Style) ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '3px' }}>
                            <Building2 size={16} color="#a78bfa" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CRM Intelligence</span>
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Strategic Partnerships</h1>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '3px 0 0' }}>Monitor client accounts, communication history, and partnership status</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                        <Link href={route('clients.export.excel', { search, status: status === 'All' ? '' : status })}>
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '0.6rem 1.125rem',
                                background: '#fff', border: '1.5px solid #ede9fe',
                                borderRadius: '12px', color: '#6366f1',
                                fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 1px 6px rgba(99,102,241,0.07)',
                            }}>
                                <Download size={15} /> Export Registry
                            </button>
                        </Link>
                        <Link href={route('clients.create')}>
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '0.6rem 1.25rem',
                                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                border: 'none', borderRadius: '12px', color: '#fff',
                                fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                            }}>
                                <Plus size={16} /> Onboard Client
                            </button>
                        </Link>
                    </div>
                </div>

                {/* ── Stat cards (Inventory Style) ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
                    {statCards.map((s, i) => (
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

                {/* ── Filters (Inventory Style) ── */}
                <div style={{ ...card, padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* Search */}
                        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                            <Search size={16} color="#a78bfa" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search by company, primary contact, or email address..."
                                style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 1rem 0.625rem 2.25rem', background: '#f9f7ff', border: '1.5px solid #ede9fe', borderRadius: '10px', fontSize: '0.85rem', color: '#1e1b4b', outline: 'none', fontWeight: 600 }}
                                onFocus={onFocus} onBlur={onBlur}
                            />
                        </div>

                        {/* Status Toggle */}
                        <div style={{ display: 'flex', background: '#f5f3ff', padding: '4px', borderRadius: '10px', border: '1.5px solid #ede9fe' }}>
                            {['All', 'Active', 'Inactive', 'Prospective'].map((s) => (
                                <button key={s} onClick={() => setStatus(s)}
                                    style={{
                                        padding: '0.45rem 1rem', border: 'none', borderRadius: '8px', 
                                        fontSize: '0.78rem', fontWeight: 850, cursor: 'pointer',
                                        background: status === s ? '#fff' : 'transparent',
                                        color: status === s ? '#6366f1' : '#94a3b8',
                                        boxShadow: status === s ? '0 2px 8px rgba(99,102,241,0.1)' : 'none',
                                        transition: 'all 0.2s'
                                    }}>
                                    {s === 'Prospective' ? 'Potential' : s}
                                </button>
                            ))}
                        </div>

                        {/* Clear */}
                        {hasFilters && (
                            <button onClick={clearFilters} style={{
                                display: 'flex', alignItems: 'center', gap: '4px',
                                padding: '0.55rem 0.875rem', background: '#fff1f2',
                                border: '1.5px solid #fecaca', borderRadius: '10px',
                                color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                            }}>
                                <X size={13} /> Reset Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Client List (Row Pattern) ── */}
                {clients.data.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {clients.data.map(client => {
                            const cfg = getStatusConfig(client.status);
                            return (
                                <div key={client.id} style={{
                                    ...card, padding: '1rem 1.5rem',
                                    display: 'flex', alignItems: 'center',
                                    gap: '1.5rem', flexWrap: 'wrap',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0eeff'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    {/* Client Logo / Avatar */}
                                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1.5px solid #f1f5f9', overflow: 'hidden' }}>
                                        {client.logo ? (
                                            <img src={`/storage/${client.logo}`} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} alt={client.company_name} />
                                        ) : (
                                            <Building2 size={24} color="#94a3b8" />
                                        )}
                                    </div>

                                    {/* Identity & Status */}
                                    <div style={{ width: '220px' }}>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 850, color: '#1e1b4b', margin: 0 }}>{client.company_name}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                            <cfg.icon size={12} color={cfg.color} />
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                {cfg.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Contact Details */}
                                    <div style={{ flex: 2, minWidth: '240px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#4b5563' }}>
                                                <User size={14} color="#94a3b8" />
                                                {client.name}
                                            </div>
                                            <span style={{ color: '#ede9fe' }}>|</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#4b5563' }}>
                                                <Mail size={14} color="#94a3b8" />
                                                {client.email}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>
                                                <Building size={14} color="#cbd5e1" />
                                                {client.industry || 'General Industry'}
                                            </div>
                                            {client.website && (
                                                <a href={client.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 800, color: '#6366f1', textDecoration: 'none' }}>
                                                    <Globe size={14} />
                                                    {client.website.replace(/^https?:\/\//, '')}
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Activity Context */}
                                    <div style={{ width: '130px', textAlign: 'right' }}>
                                        <p style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>Primary Phone</p>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e1b4b', margin: '2px 0 0' }}>
                                            {client.phone || '--'}
                                        </p>
                                    </div>

                                    {/* Actions Suite */}
                                    <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                                        <Link href={route('clients.show', client.id)} title="Relationship Profile">
                                            <button style={iconBtn('#f5f3ff', '#6366f1')}><Activity size={16} /></button>
                                        </Link>
                                        <Link href={route('clients.edit', client.id)} title="Update Dossier">
                                            <button style={iconBtn('#fffbeb', '#d97706')}><Edit size={16} /></button>
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
                        <Users size={48} color="#e0d9ff" style={{ margin: '0 auto 1.5rem' }} />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e1b4b', margin: '0 0 0.5rem' }}>No Partnerships Logged</h3>
                        <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: '0 0 2rem' }}>
                            {hasFilters ? 'No accounts match your current directory filters.' : 'Your relationship manager is currently empty. Onboard your first partner.'}
                        </p>
                        <Link href={route('clients.create')}>
                            <button style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '8px', 
                                padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', 
                                border: 'none', borderRadius: '14px', color: '#fff', 
                                fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                                boxShadow: '0 6px 16px rgba(99,102,241,0.25)'
                            }}>
                                <Plus size={18} /> Initiate Onboarding
                            </button>
                        </Link>
                    </div>
                )}

                {/* ── Pagination (Inventory Style) ── */}
                {clients.links && clients.links.length > 3 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', ...card, padding: '0.875rem 1.25rem' }}>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: 0, fontWeight: 600 }}>
                            Page <strong style={{ color: '#1e1b4b' }}>{clients.current_page}</strong> of <strong style={{ color: '#1e1b4b' }}>{clients.last_page}</strong>
                        </p>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {clients.links.map((link, i) => link.url ? (
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
