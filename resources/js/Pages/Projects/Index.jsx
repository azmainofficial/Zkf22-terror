import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import { t } from '../../Lang/translation';
import {
    Plus, Search, Eye, Pencil, Trash2, Briefcase,
    Activity, Clock, CheckCircle2, XCircle, PauseCircle,
    ChevronDown, Filter, LayoutGrid, Calendar, Wallet,
    ArrowRight, Package
} from 'lucide-react';

const STATUS_CONFIG = {
    ongoing:   { label: 'Active',     color: '#4f46e5', bg: '#f5f3ff' },
    completed: { label: 'Finished',   color: '#10b981', bg: '#f0fdf4' },
    pending:   { label: 'Waiting',    color: '#f59e0b', bg: '#fffbeb' },
    on_hold:   { label: 'Paused',     color: '#8b5cf6', bg: '#f5f3ff' },
    cancelled: { label: 'Stopped',    color: '#ef4444', bg: '#fef2f2' },
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

export default function Index({ auth, projects, filters, stats }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'All');

    useEffect(() => {
        const tId = setTimeout(() => {
            router.get(route('projects.index'), { search, status }, { preserveState: true, replace: true });
        }, 400);
        return () => clearTimeout(tId);
    }, [search, status]);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this project?')) {
            router.delete(route('projects.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Project Portfolio" />

            <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '4rem' }}>
                
                {/* ── HEADER ── */}
                <div className="projects-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
                            Projects
                        </h1>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500, margin: '4px 0 0' }}>
                            Managing {projects.total} active business deployments
                        </p>
                    </div>

                    {(auth.is_admin || auth.permissions.includes('create_projects')) && (
                        <Link href={route('projects.create')}>
                            <button style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
                                background: '#4f46e5', border: 'none', borderRadius: '12px', 
                                color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(79,70,229,0.2)'
                            }}>
                                <Plus size={18} /> <span className="hide-mobile">New Project</span>
                                <span className="show-mobile">New</span>
                            </button>
                        </Link>
                    )}
                </div>

                {/* ── STATS SUMMARY ── */}
                <div className="projects-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                    <MiniStat label="Total Projects" value={stats.all} active={status === 'All'} onClick={() => setStatus('All')} color="#4f46e5" />
                    <MiniStat label="Active" value={stats.ongoing} active={status === 'ongoing'} onClick={() => setStatus('ongoing')} color="#4f46e5" />
                    <MiniStat label="Finished" value={stats.completed} active={status === 'completed'} onClick={() => setStatus('completed')} color="#10b981" />
                    <MiniStat label="Waiting" value={stats.pending} active={status === 'pending'} onClick={() => setStatus('pending')} color="#f59e0b" />
                    <MiniStat label="Paused" value={stats.on_hold} active={status === 'on_hold'} onClick={() => setStatus('on_hold')} color="#8b5cf6" />
                </div>

                {/* ── SEARCH & FILTER ── */}
                <div className="filter-bar" style={{ ...styles.card, padding: '16px', display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ position: 'relative', flex: 2 }}>
                        <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Find a project..."
                            style={{
                                width: '100%', padding: '12px 16px 12px 48px',
                                background: '#f8fafc', border: '1px solid #f1f5f9',
                                borderRadius: '12px', fontSize: '0.9rem', outline: 'none',
                                fontWeight: 500, color: '#1e293b'
                            }}
                        />
                    </div>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Filter size={16} color="#64748b" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 40px 12px 44px', background: '#f8fafc', 
                                border: '1px solid #f1f5f9', borderRadius: '12px', 
                                fontSize: '0.9rem', fontWeight: 600, color: '#475569',
                                appearance: 'none', outline: 'none', cursor: 'pointer'
                            }}
                        >
                            <option value="All">All Status</option>
                            <option value="ongoing">Active</option>
                            <option value="completed">Finished</option>
                            <option value="pending">Waiting</option>
                            <option value="on_hold">Paused</option>
                            <option value="cancelled">Stopped</option>
                        </select>
                        <ChevronDown size={14} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                </div>

                {/* ── PROJECT LIST ── */}
                <div style={{ ...styles.card, padding: '0', background: 'transparent', border: 'none' }}>
                    <div className="project-table-header" style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1.5fr) 1fr 120px 140px 140px', padding: '0 24px 1rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <div style={{ paddingLeft: '8px' }}>Project Detail</div>
                        <div>Client Reference</div>
                        <div style={{ textAlign: 'center' }}>Status</div>
                        <div style={{ textAlign: 'center' }}>Budget</div>
                        <div></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                        {projects.data.length > 0 ? projects.data.map((p, i) => {
                            const cfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.pending;
                            return (
                                <div key={p.id} className="project-row" style={{ 
                                    display: 'grid', gridTemplateColumns: 'minmax(200px, 1.5fr) 1fr 120px 140px 140px', 
                                    alignItems: 'center', padding: '16px 8px', borderRadius: '12px',
                                    transition: 'all 0.2s', borderBottom: i === projects.data.length - 1 ? 'none' : '1px solid #f8fafc'
                                }}>
                                    {/* INFO */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Briefcase size={20} color="#4f46e5" />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{p.title}</p>
                                            <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, margin: '2px 0 0' }}>Launched {p.start_date || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* CLIENT */}
                                    <div>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>{p.client?.name || '—'}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0' }}>{p.client?.company_name || 'Individual'}</p>
                                    </div>

                                    {/* STATUS */}
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <span style={{ 
                                            background: cfg.bg, color: cfg.color, 
                                            fontSize: '0.75rem', fontWeight: 700, 
                                            padding: '6px 14px', borderRadius: '10px',
                                            minWidth: '80px', textAlign: 'center'
                                        }}>
                                            {cfg.label}
                                        </span>
                                    </div>

                                    {/* BUDGET */}
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                                            ৳{new Intl.NumberFormat().format(p.budget || 0)}
                                        </span>
                                    </div>

                                    {/* ACTIONS */}
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        {(auth.is_admin || auth.permissions.includes('view_projects')) && (
                                            <Link href={route('projects.show', p.id)}>
                                                <button style={styles.actionBtn('#f1f5f9', '#64748b')} title="View"><Eye size={16} /></button>
                                            </Link>
                                        )}
                                        {(auth.is_admin || auth.permissions.includes('edit_projects')) && (
                                            <Link href={route('projects.edit', p.id)}>
                                                <button style={styles.actionBtn('#f0fdf4', '#10b981')} title="Edit"><Pencil size={16} /></button>
                                            </Link>
                                        )}
                                        {(auth.is_admin || auth.permissions.includes('delete_projects')) && (
                                            <button onClick={() => handleDelete(p.id)} style={styles.actionBtn('#fef2f2', '#ef4444')} title="Delete"><Trash2 size={16} /></button>
                                        )}
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                                <Package size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#64748b', margin: 0 }}>No projects found</h4>
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>Try adjusting your search or filters</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── PAGINATION ── */}
                {projects.links && projects.links.length > 3 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
                        <div style={{ display: 'flex', background: '#fff', padding: '6px', borderRadius: '14px', border: '1px solid #f1f5f9', gap: '4px' }}>
                            {projects.links.map((link, i) => (
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
                .project-row { background: #fff; border: 1px solid #f1f5f9; margin-bottom: 12px; }
                .project-row:hover { border-color: #4f46e5; background: #f8fafc !important; }
                
                .show-mobile { display: none; }
                
                @media (max-width: 1100px) {
                    .project-table-header { display: none !important; }
                    .dashboard-kpi-grid, .projects-stats-grid { 
                        display: flex !important; 
                        overflow-x: auto; 
                        padding-bottom: 10px; 
                        gap: 12px !important;
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                    .projects-stats-grid::-webkit-scrollbar { display: none; }
                    .stat-card { flex-shrink: 0; width: 140px !important; }
                    
                    .project-row { 
                        grid-template-columns: 1fr !important; 
                        gap: 12px; 
                        padding: 20px !important;
                        border-radius: 20px !important;
                    }
                    .project-row > div { text-align: left !important; justify-content: flex-start !important; }
                    .filter-bar { flex-direction: column; align-items: stretch !important; border-radius: 20px !important; }
                }

                @media (max-width: 600px) {
                    .projects-header { flex-direction: column; align-items: flex-start !important; gap: 1rem; margin-bottom: 1.5rem !important; }
                    .projects-header h1 { font-size: 1.75rem !important; }
                    .show-mobile { display: inline-block; }
                    .hide-mobile { display: none; }
                }
            `}</style>
        </FigmaLayout>
    );
}

function MiniStat({ label, value, color, active, onClick }) {
    return (
        <div 
            onClick={onClick}
            className="stat-card"
            style={{ 
                ...styles.card, padding: '16px', cursor: 'pointer',
                border: active ? `2px solid ${color}` : '1px solid #f1f5f9',
                background: active ? `${color}05` : '#fff',
                transition: 'all 0.2s',
                minWidth: '120px'
            }}
        >
            <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{label}</p>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: active ? color : '#0f172a', margin: '2px 0 0' }}>{value}</h4>
        </div>
    );
}
