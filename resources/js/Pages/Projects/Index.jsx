import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus, Search, Eye, Pencil, Trash2, Briefcase,
    Activity, Clock, CheckCircle2, XCircle, PauseCircle,
    Building2, Calendar, DollarSign, Filter, ChevronLeft,
    ChevronRight, TrendingUp, ArrowRight, LayoutGrid, List,
} from 'lucide-react';

// ─── Status config (plain English) ───────────────────────────────
const STATUS = {
    ongoing:   { label: 'In Progress', icon: Activity,      bg: '#eff6ff', color: '#3b82f6', dot: '#3b82f6' },
    completed: { label: 'Completed',   icon: CheckCircle2,  bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
    pending:   { label: 'Pending',     icon: Clock,         bg: '#fffbeb', color: '#d97706', dot: '#f59e0b' },
    on_hold:   { label: 'On Hold',     icon: PauseCircle,   bg: '#f5f3ff', color: '#7c3aed', dot: '#8b5cf6' },
    cancelled: { label: 'Cancelled',   icon: XCircle,       bg: '#fff1f2', color: '#dc2626', dot: '#ef4444' },
};

function getStatus(raw) {
    const key = (raw || '').toLowerCase().replace(' ', '_');
    return STATUS[key] || STATUS.pending;
}

// ─── Stat chip ───────────────────────────────────────────────────
function StatChip({ label, count, icon: Icon, active, onClick, iconColor, iconBg }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1.1rem',
                background: active ? 'linear-gradient(135deg,#ede9fe,#f5f3ff)' : '#fff',
                border: active ? '1.5px solid #c4b5fd' : '1.5px solid #f0eeff',
                borderRadius: '14px', cursor: 'pointer',
                transition: 'all 0.18s',
                boxShadow: active
                    ? '0 4px 16px rgba(99,102,241,0.15)'
                    : '0 1px 6px rgba(99,102,241,0.05)',
                minWidth: '130px',
            }}
            onMouseEnter={e => {
                if (!active) {
                    e.currentTarget.style.borderColor = '#c4b5fd';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.1)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                }
            }}
            onMouseLeave={e => {
                if (!active) {
                    e.currentTarget.style.borderColor = '#f0eeff';
                    e.currentTarget.style.boxShadow = '0 1px 6px rgba(99,102,241,0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                }
            }}
        >
            {/* Icon bubble */}
            <div style={{
                width: '40px', height: '40px', borderRadius: '11px',
                background: active ? iconBg : '#f8f7ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                boxShadow: active ? '0 2px 8px rgba(99,102,241,0.18)' : 'none',
                transition: 'all 0.18s',
            }}>
                <Icon size={18} color={active ? iconColor : '#a78bfa'} />
            </div>

            {/* Text */}
            <div style={{ textAlign: 'left' }}>
                <p style={{
                    fontSize: '1.3rem', fontWeight: 800,
                    color: active ? '#4338ca' : '#1e1b4b',
                    margin: 0, lineHeight: 1.1,
                }}>
                    {count}
                </p>
                <p style={{
                    fontSize: '0.7rem', fontWeight: 600,
                    color: active ? '#7c3aed' : '#9ca3af',
                    margin: '1px 0 0', whiteSpace: 'nowrap',
                }}>
                    {label}
                </p>
            </div>
        </button>
    );
}

// ─── Progress bar ─────────────────────────────────────────────────
function Progress({ status }) {
    const pct = status === 'completed' ? 100 : status === 'ongoing' ? 60 : status === 'on_hold' ? 30 : status === 'pending' ? 10 : 0;
    const cfg = getStatus(status);
    return (
        <div style={{ marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#9ca3af' }}>Progress</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: cfg.color }}>{pct}%</span>
            </div>
            <div style={{ height: '5px', background: '#f3f4f6', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: cfg.dot,
                    borderRadius: '10px', transition: 'width 0.6s ease' }} />
            </div>
        </div>
    );
}

// ─── Project Card ─────────────────────────────────────────────────
function ProjectCard({ project, onDelete }) {
    const cfg = getStatus(project.status);
    const Icon = cfg.icon;

    return (
        <div style={{
            background: '#fff', borderRadius: '16px',
            border: '1.5px solid #f3f4f6',
            boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
            overflow: 'hidden',
            transition: 'box-shadow 0.2s, transform 0.2s',
            display: 'flex', flexDirection: 'column',
        }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            {/* Top status bar */}
            <div style={{ height: '4px', background: cfg.dot }} />

            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    {/* Status badge */}
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        background: cfg.bg, color: cfg.color,
                        fontSize: '0.68rem', fontWeight: 700,
                        padding: '3px 10px', borderRadius: '20px',
                    }}>
                        <Icon size={11} />
                        {cfg.label}
                    </span>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <Link href={route('projects.show', project.id)}>
                            <button style={iconBtn('#f5f3ff', '#6366f1')} title="View project">
                                <Eye size={14} />
                            </button>
                        </Link>
                        <Link href={route('projects.edit', project.id)}>
                            <button style={iconBtn('#f0fdf4', '#16a34a')} title="Edit project">
                                <Pencil size={14} />
                            </button>
                        </Link>
                        <button style={iconBtn('#fff1f2', '#ef4444')} title="Delete project"
                            onClick={() => onDelete(project.id)}>
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                {/* Project title */}
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e1b4b',
                        margin: '0 0 4px', lineHeight: 1.3,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {project.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Building2 size={12} color="#9ca3af" />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {project.client?.company_name || project.client?.name || 'No client assigned'}
                        </span>
                    </div>
                </div>

                {/* Meta row */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={metaBox}>
                        <DollarSign size={12} color="#6366f1" />
                        <span style={metaText}>৳{new Intl.NumberFormat().format(project.budget || 0)}</span>
                    </div>
                    {project.start_date && (
                        <div style={metaBox}>
                            <Calendar size={12} color="#6366f1" />
                            <span style={metaText}>{project.start_date}</span>
                        </div>
                    )}
                </div>

                {/* Progress */}
                <Progress status={project.status} />

                {/* View button */}
                <Link href={route('projects.show', project.id)} style={{ marginTop: 'auto' }}>
                    <button style={{
                        width: '100%', padding: '0.6rem',
                        background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                        border: 'none', borderRadius: '10px',
                        color: '#fff', fontSize: '0.78rem', fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: '5px',
                        transition: 'opacity 0.15s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        View Details <ArrowRight size={13} />
                    </button>
                </Link>
            </div>
        </div>
    );
}

// small helpers
const iconBtn = (bg, color) => ({
    width: '30px', height: '30px', borderRadius: '8px',
    background: bg, border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color, transition: 'opacity 0.15s',
});
const metaBox = { display: 'flex', alignItems: 'center', gap: '4px',
    background: '#f5f3ff', padding: '3px 8px', borderRadius: '8px' };
const metaText = { fontSize: '0.72rem', fontWeight: 600, color: '#4338ca' };

// ─── Main component ───────────────────────────────────────────────
export default function Index({ auth, projects, filters }) {
    const [search, setSearch]   = useState(filters.search || '');
    const [status, setStatus]   = useState(filters.status || 'All');
    const [view, setView]       = useState('grid'); // 'grid' | 'list'

    useEffect(() => {
        const t = setTimeout(() => {
            router.get(route('projects.index'), { search, status }, { preserveState: true, replace: true });
        }, 450);
        return () => clearTimeout(t);
    }, [search, status]);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this project? This cannot be undone.')) {
            router.delete(route('projects.destroy', id), { preserveScroll: true });
        }
    };

    const counted = (key) =>
        projects.data.filter(p => p.status?.toLowerCase().replace(' ', '_') === key).length;

    const statChips = [
        { key: 'All',       label: 'All',        icon: LayoutGrid,   iconBg: '#f5f3ff', iconColor: '#6366f1' },
        { key: 'ongoing',   label: 'In Progress', icon: Activity,    iconBg: '#eff6ff', iconColor: '#3b82f6' },
        { key: 'completed', label: 'Completed',   icon: CheckCircle2,iconBg: '#f0fdf4', iconColor: '#16a34a' },
        { key: 'pending',   label: 'Pending',     icon: Clock,       iconBg: '#fffbeb', iconColor: '#d97706' },
        { key: 'on_hold',   label: 'On Hold',     icon: PauseCircle, iconBg: '#f5f3ff', iconColor: '#7c3aed' },
        { key: 'cancelled', label: 'Cancelled',   icon: XCircle,     iconBg: '#fff1f2', iconColor: '#dc2626' },
    ];

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Projects" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>

                {/* ── Page Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                            <Briefcase size={18} color="#6366f1" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Project Management
                            </span>
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>
                            All Projects
                        </h1>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '3px 0 0', fontWeight: 500 }}>
                            {projects.total ?? projects.data.length} project{projects.total !== 1 ? 's' : ''} total
                        </p>
                    </div>

                    <Link href={route('projects.create')}>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '0.625rem 1.25rem',
                            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                            border: 'none', borderRadius: '12px',
                            color: '#fff', fontSize: '0.85rem', fontWeight: 700,
                            cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                            transition: 'opacity 0.15s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            <Plus size={17} /> New Project
                        </button>
                    </Link>
                </div>

                {/* ── Status filter chips ── */}
                <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                    {statChips.map(chip => (
                        <StatChip
                            key={chip.key}
                            label={chip.label}
                            icon={chip.icon}
                            iconBg={chip.iconBg}
                            iconColor={chip.iconColor}
                            count={chip.key === 'All' ? projects.data.length : counted(chip.key)}
                            active={status === chip.key}
                            onClick={() => setStatus(chip.key)}
                        />
                    ))}
                </div>

                {/* ── Search + View toggle ── */}
                <div style={{
                    display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center',
                    background: '#fff', padding: '0.875rem 1rem',
                    borderRadius: '14px', border: '1.5px solid #f3f4f6',
                    boxShadow: '0 1px 6px rgba(99,102,241,0.05)',
                }}>
                    {/* Search */}
                    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                        <Search size={15} color="#a78bfa" style={{
                            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                        }} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by project name or client…"
                            style={{
                                width: '100%', boxSizing: 'border-box',
                                padding: '0.6rem 1rem 0.6rem 2.2rem',
                                background: '#f5f3ff', border: '1.5px solid #ede9fe',
                                borderRadius: '10px', fontSize: '0.85rem', color: '#1e1b4b',
                                outline: 'none', transition: 'all 0.2s',
                            }}
                            onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; }}
                            onBlur={e => { e.target.style.borderColor = '#ede9fe'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>

                    {/* Status select */}
                    <div style={{ position: 'relative' }}>
                        <Filter size={14} color="#a78bfa" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            style={{
                                padding: '0.6rem 1rem 0.6rem 2rem',
                                background: '#f5f3ff', border: '1.5px solid #ede9fe',
                                borderRadius: '10px', fontSize: '0.82rem',
                                fontWeight: 600, color: '#4338ca',
                                outline: 'none', cursor: 'pointer',
                                appearance: 'none',
                            }}
                        >
                            <option value="All">All Status</option>
                            <option value="ongoing">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="on_hold">On Hold</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* View toggle */}
                    <div style={{ display: 'flex', gap: '4px', background: '#f3f4f6', padding: '3px', borderRadius: '9px' }}>
                        {[['grid', LayoutGrid], ['list', List]].map(([v, Icon]) => (
                            <button key={v} onClick={() => setView(v)} style={{
                                width: '32px', height: '32px', borderRadius: '7px',
                                background: view === v ? '#fff' : 'transparent',
                                border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: view === v ? '#6366f1' : '#9ca3af',
                                boxShadow: view === v ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                                transition: 'all 0.15s',
                            }}>
                                <Icon size={15} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Project grid / list ── */}
                {projects.data.length > 0 ? (
                    view === 'grid' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1rem' }}>
                            {projects.data.map(p => (
                                <ProjectCard key={p.id} project={p} onDelete={handleDelete} />
                            ))}
                        </div>
                    ) : (
                        /* List view */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {projects.data.map(p => {
                                const cfg = getStatus(p.status);
                                const Icon = cfg.icon;
                                return (
                                    <div key={p.id} style={{
                                        background: '#fff', borderRadius: '14px',
                                        border: '1.5px solid #f3f4f6',
                                        padding: '1rem 1.25rem',
                                        display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
                                        transition: 'box-shadow 0.15s',
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.09)'}
                                        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                                    >
                                        <div style={{ width: '4px', height: '40px', background: cfg.dot, borderRadius: '4px', flexShrink: 0 }} />
                                        <div style={{ flex: 1, minWidth: '160px' }}>
                                            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e1b4b', margin: 0 }}>{p.title}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                                <Building2 size={11} color="#9ca3af" />
                                                <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{p.client?.company_name || p.client?.name || '—'}</span>
                                            </div>
                                        </div>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px',
                                            background: cfg.bg, color: cfg.color,
                                            fontSize: '0.68rem', fontWeight: 700,
                                            padding: '3px 10px', borderRadius: '20px', flexShrink: 0 }}>
                                            <Icon size={11} />{cfg.label}
                                        </span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4338ca',
                                            background: '#f5f3ff', padding: '3px 10px', borderRadius: '8px' }}>
                                            ৳{new Intl.NumberFormat().format(p.budget || 0)}
                                        </span>
                                        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                                            <Link href={route('projects.show', p.id)}>
                                                <button style={iconBtn('#f5f3ff', '#6366f1')} title="View"><Eye size={14} /></button>
                                            </Link>
                                            <Link href={route('projects.edit', p.id)}>
                                                <button style={iconBtn('#f0fdf4', '#16a34a')} title="Edit"><Pencil size={14} /></button>
                                            </Link>
                                            <button style={iconBtn('#fff1f2', '#ef4444')} title="Delete" onClick={() => handleDelete(p.id)}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                ) : (
                    /* Empty state */
                    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                        <div style={{
                            width: '72px', height: '72px', borderRadius: '20px',
                            background: '#f5f3ff', margin: '0 auto 1rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Briefcase size={32} color="#c4b5fd" />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e1b4b', margin: '0 0 0.5rem' }}>
                            No projects found
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: '#9ca3af', margin: '0 0 1.5rem' }}>
                            {search || status !== 'All'
                                ? 'Try adjusting your search or filter to find what you\'re looking for.'
                                : 'You have not added any projects yet. Click "New Project" to get started.'}
                        </p>
                        <Link href={route('projects.create')}>
                            <button style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '0.625rem 1.25rem',
                                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                border: 'none', borderRadius: '12px',
                                color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                            }}>
                                <Plus size={16} /> Add Your First Project
                            </button>
                        </Link>
                    </div>
                )}

                {/* ── Pagination ── */}
                {projects.links && projects.links.length > 3 && (
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: '0.75rem',
                        background: '#fff', padding: '0.875rem 1.25rem',
                        borderRadius: '14px', border: '1.5px solid #f3f4f6',
                    }}>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 500, margin: 0 }}>
                            Page <strong style={{ color: '#1e1b4b' }}>{projects.current_page}</strong> of{' '}
                            <strong style={{ color: '#1e1b4b' }}>{projects.last_page}</strong>
                            {' '}— {projects.total} projects total
                        </p>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {projects.links.map((link, i) => (
                                link.url ? (
                                    <Link key={i} href={link.url}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            minWidth: '36px', height: '36px', padding: '0 10px',
                                            borderRadius: '9px', fontSize: '0.8rem', fontWeight: 700,
                                            textDecoration: 'none',
                                            background: link.active ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#f5f3ff',
                                            color: link.active ? '#fff' : '#6366f1',
                                            boxShadow: link.active ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
                                            transition: 'all 0.15s',
                                        }}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span key={i} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        minWidth: '36px', height: '36px', padding: '0 10px',
                                        borderRadius: '9px', fontSize: '0.8rem', fontWeight: 700,
                                        background: '#f9fafb', color: '#d1d5db', cursor: 'not-allowed',
                                    }}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </FigmaLayout>
    );
}
