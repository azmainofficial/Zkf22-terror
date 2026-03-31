import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import { t } from '../../Lang/translation';
import { 
    Users, Briefcase, TrendingUp, Search, User, Pencil, 
    Trash2, Eye, Mail, Phone, Globe, Building2,
    Filter, ChevronDown, MoreVertical, Plus
} from 'lucide-react';

const STATUS_CONFIG = {
    active:      { label: 'Active Partner',  color: '#10b981', bg: '#f0fdf4' },
    inactive:    { label: 'On Hold',         color: '#64748b', bg: '#f1f5f9' },
    prospective: { label: 'Potential New',  color: '#f59e0b', bg: '#fffbeb' },
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
        background: bg, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, transition: 'all 0.2s'
    })
};

export default function Index({ auth, clients, filters, stats }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [activeFilter, setActiveFilter] = useState(filters?.status || 'All');
    const [fromDate, setFromDate] = useState(filters?.from_date || '');
    const [toDate, setToDate] = useState(filters?.to_date || '');
    const [projectFilter, setProjectFilter] = useState(filters?.project_filter || '');
    const [projectYear, setProjectYear] = useState(filters?.project_year || '');
    const [pjFromDate, setPjFromDate] = useState(filters?.project_from_date || '');
    const [pjToDate, setPjToDate] = useState(filters?.project_to_date || '');

    useEffect(() => {
        const tId = setTimeout(() => {
            router.get(route('clients.index'), {
                search,
                status: activeFilter === 'All' ? '' : activeFilter,
                from_date: fromDate,
                to_date: toDate,
                project_filter: projectFilter,
                project_year: projectYear,
                project_from_date: pjFromDate,
                project_to_date: pjToDate,
            }, { preserveState: true, replace: true });
        }, 400);
        return () => clearTimeout(tId);
    }, [search, activeFilter, fromDate, toDate, projectFilter, projectYear, pjFromDate, pjToDate]);

    const handleReset = () => {
        setSearch('');
        setActiveFilter('All');
        setFromDate('');
        setToDate('');
        setProjectFilter('');
        setProjectYear('');
        setPjFromDate('');
        setPjToDate('');
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to remove this client from the network?')) {
            router.delete(route('clients.destroy', id));
        }
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Client Network" />

            <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '4rem' }}>
                
                {/* ── HEADER ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
                            Clients
                        </h1>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500, margin: '4px 0 0' }}>
                            Managing {stats?.total || 0} business relationships across the network
                        </p>
                    </div>

                    <Link href={route('clients.create')}>
                        <button style={{ 
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
                            background: '#4f46e5', border: 'none', borderRadius: '12px', 
                            color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(79,70,229,0.2)'
                        }}>
                            <Plus size={18} /> Add New Client
                        </button>
                    </Link>
                </div>

                {/* ── STATS SUMMARY ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <MiniStat label="Total Network" value={stats?.total || 0} color="#4f46e5" icon={Users} active={activeFilter === 'All'} onClick={() => setActiveFilter('All')} />
                    <MiniStat label="Active Partners" value={stats?.active || 0} color="#10b981" icon={Briefcase} active={activeFilter === 'Active'} onClick={() => setActiveFilter('Active')} />
                    <MiniStat label="Potential New" value={stats?.prospective || 0} color="#f59e0b" icon={TrendingUp} active={activeFilter === 'Prospective'} onClick={() => setActiveFilter('Prospective')} />
                </div>

                {/* ── SEARCH & FILTER ── */}
                <div style={{ ...styles.card, padding: '24px', display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by ID, Name, Phone, or Company details..."
                                style={{
                                    width: '100%', padding: '12px 16px 12px 48px',
                                    background: '#f8fafc', border: '1px solid #f1f5f9',
                                    borderRadius: '12px', fontSize: '0.9rem', outline: 'none',
                                    fontWeight: 500, color: '#1e293b'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={handleReset} style={{ padding: '0 20px', height: '44px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#64748b', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                                Reset All
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* PROJECT TIMELINE SEARCH */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '8px 14px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                            <div style={{ background: '#4f46e5', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase' }}>Project Timeline Search</div>
                            <div style={{ position: 'relative' }}>
                                <select value={projectYear} onChange={e => setProjectYear(e.target.value)} style={{ border: 'none', background: 'transparent', fontSize: '0.85rem', fontWeight: 750, color: '#1e293b', outline: 'none', paddingRight: '20px', appearance: 'none', cursor: 'pointer' }}>
                                    <option value="">Any Year</option>
                                    {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <ChevronDown size={12} style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            </div>
                            <span style={{ color: '#cbd5e1' }}>|</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input type="date" value={pjFromDate} onChange={e => setPjFromDate(e.target.value)} title="Project From Date" style={{ border: 'none', background: 'transparent', fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', outline: 'none' }} />
                                <span style={{ color: '#cbd5e1' }}>—</span>
                                <input type="date" value={pjToDate} onChange={e => setPjToDate(e.target.value)} title="Project To Date" style={{ border: 'none', background: 'transparent', fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', outline: 'none' }} />
                            </div>
                        </div>

                        {/* CLIENT REGISTRATION PERIOD */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '8px 14px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Client Reg. Period</span>
                            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ border: 'none', background: 'transparent', fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', outline: 'none' }} />
                            <span style={{ color: '#cbd5e1' }}>—</span>
                            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={{ border: 'none', background: 'transparent', fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', outline: 'none' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative' }}>
                            <select
                                value={projectFilter}
                                onChange={(e) => setProjectFilter(e.target.value)}
                                style={{
                                    padding: '10px 40px 10px 16px', background: '#fff', 
                                    border: '1px solid #e2e8f0', borderRadius: '12px', 
                                    fontSize: '0.85rem', fontWeight: 750, color: '#475569',
                                    appearance: 'none', outline: 'none', cursor: 'pointer', minWidth: '180px'
                                }}
                            >
                                <option value="">Project Association</option>
                                <option value="has_projects">Has Active Projects</option>
                                <option value="no_projects">No Project History</option>
                                <option value="recent_projects">Recently Added (3mo)</option>
                                <option value="old_projects">Legacy Partners (6mo+)</option>
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <select
                                value={activeFilter}
                                onChange={(e) => setActiveFilter(e.target.value)}
                                style={{
                                    padding: '10px 40px 10px 16px', background: '#fff', 
                                    border: '1px solid #e2e8f0', borderRadius: '12px', 
                                    fontSize: '0.85rem', fontWeight: 750, color: '#475569',
                                    appearance: 'none', outline: 'none', cursor: 'pointer', minWidth: '150px'
                                }}
                            >
                                <option value="All">Partner Status</option>
                                <option value="active">Active Network</option>
                                <option value="inactive">On Hold</option>
                                <option value="prospective">Prospective</option>
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                    </div>
                </div>

                {/* ── CLIENT LIST ── */}
                <div style={styles.card}>
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1.5fr 1fr 1fr 140px 150px 120px', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.075em' }}>
                        <div style={{ paddingLeft: '8px' }}>Ref ID</div>
                        <div>Business Identity</div>
                        <div>Contact Details</div>
                        <div>Project History</div>
                        <div style={{ textAlign: 'center' }}>Registration</div>
                        <div style={{ textAlign: 'center' }}>Relationship</div>
                        <div></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                        {clients.data?.length > 0 ? clients.data.map((client, i) => {
                            const sc = STATUS_CONFIG[client.status] || STATUS_CONFIG.inactive;
                            const initials = (client.company_name || client.name || 'C').charAt(0).toUpperCase();
                            return (
                                <div key={client.id} className="client-row" style={{ 
                                    display: 'grid', gridTemplateColumns: '80px 1.5fr 1fr 1fr 140px 150px 120px', 
                                    alignItems: 'center', padding: '16px 8px', borderRadius: '12px',
                                    transition: 'all 0.2s', borderBottom: i === clients.data.length - 1 ? 'none' : '1px solid #f8fafc'
                                }}>
                                    {/* REF ID */}
                                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4f46e5', paddingLeft: '8px' }}>
                                        #{client.id.toString().padStart(4, '0')}
                                    </div>

                                    {/* IDENTITY */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800, color: '#475569', flexShrink: 0 }}>
                                            {client.avatar ? (
                                                <img src={`/storage/${client.avatar}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} alt={initials} />
                                            ) : initials}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{client.company_name || 'Individual'}</p>
                                            <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, margin: '2px 0 0' }}>{client.industry || 'Business Partner'}</p>
                                        </div>
                                    </div>

                                    {/* CONTACT */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Mail size={13} color="#94a3b8" />
                                            <span style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 600 }}>{client.email || '—'}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Phone size={13} color="#94a3b8" />
                                            <span style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 600 }}>{client.phone || '—'}</span>
                                        </div>
                                    </div>

                                    {/* PROJECTS */}
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
                                            <Briefcase size={14} />
                                            <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>{client.projects_count || 0} Projects</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>Total portfolio volume</p>
                                    </div>

                                    {/* DATE */}
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 750, color: '#1e293b' }}>{new Date(client.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500 }}>{new Date(client.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>

                                    {/* STATUS */}
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <span style={{ 
                                            background: sc.bg, color: sc.color, 
                                            fontSize: '0.72rem', fontWeight: 800, 
                                            padding: '6px 14px', borderRadius: '10px',
                                            minWidth: '100px', textAlign: 'center', textTransform: 'uppercase'
                                        }}>
                                            {sc.label}
                                        </span>
                                    </div>

                                    {/* ACTIONS */}
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <Link href={route('clients.show', client.id)}>
                                            <button style={styles.actionBtn('#f1f5f9', '#64748b')} title="View"><Eye size={16} /></button>
                                        </Link>
                                        <Link href={route('clients.edit', client.id)}>
                                            <button style={styles.actionBtn('#f0fdf4', '#10b981')} title="Edit"><Pencil size={16} /></button>
                                        </Link>
                                        <button onClick={() => handleDelete(client.id)} style={styles.actionBtn('#fef2f2', '#ef4444')} title="Remove"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                                <Users size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#64748b', margin: 0 }}>No clients found</h4>
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>Try adjusting your search or node filters</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── PAGINATION ── */}
                {clients.links && clients.links.length > 3 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
                        <div style={{ display: 'flex', background: '#fff', padding: '6px', borderRadius: '14px', border: '1px solid #f1f5f9', gap: '4px' }}>
                            {clients.links.map((link, i) => (
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
                .client-row:hover { background: #f8fafc !important; }
                .client-row:hover h4 { color: #4f46e5 !important; }
            `}</style>
        </FigmaLayout>
    );
}

function MiniStat({ label, value, color, icon: Icon, active, onClick }) {
    return (
        <div 
            onClick={onClick}
            style={{ 
                ...styles.card, padding: '20px', cursor: 'pointer',
                border: active ? `2px solid ${color}` : '1px solid #f1f5f9',
                background: active ? `${color}05` : '#fff',
                transform: active ? 'scale(1.02)' : 'none',
                boxShadow: active ? '0 10px 15px -3px rgba(79, 70, 229, 0.1)' : 'none'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${color}10`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} />
                </div>
                {active && <div style={{ fontSize: '0.65rem', fontWeight: 800, color: color, background: `${color}20`, padding: '2px 8px', borderRadius: '20px' }}>FILTERED</div>}
            </div>
            <div style={{ marginTop: '16px' }}>
                <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, margin: 0 }}>{label}</p>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: active ? color : '#0f172a', margin: '4px 0 0' }}>{value}</h4>
            </div>
        </div>
    );
}
