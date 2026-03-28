import React, { useState, useEffect, useRef } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus, Search, Package, FileSpreadsheet, Eye,
    Pencil, Trash2, X, Filter, DollarSign, Hash,
    Building2, Briefcase, CheckCircle2, AlertCircle, PauseCircle,
} from 'lucide-react';

// ─── Status config ─────────────────────────────────────────────
const STATUS = {
    active:       { label: 'Active',        bg: '#f0fdf4', color: '#16a34a' },
    inactive:     { label: 'Inactive',      bg: '#f3f4f6', color: '#6b7280' },
    discontinued: { label: 'Discontinued',  bg: '#fff1f2', color: '#dc2626' },
};
function getStatus(s) { return STATUS[(s||'').toLowerCase()] || STATUS.inactive; }

// ─── Shared styles ─────────────────────────────────────────────
const card = {
    background: '#fff', borderRadius: '16px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
};
const onFocus = e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; };
const onBlur  = e => { e.target.style.borderColor = '#ede9fe'; e.target.style.boxShadow = 'none'; };

export default function Index({ auth, items, filters, projects = [], clients = [], brands = [], totalValue = 0 }) {
    const [search,    setSearch]    = useState(filters.search    || '');
    const [status,    setStatus]    = useState(filters.status    || 'All');
    const [projectId, setProjectId] = useState(filters.project_id || '');
    const [clientId,  setClientId]  = useState(filters.client_id  || '');
    const [brandId,   setBrandId]   = useState(filters.brand_id   || '');
    const [month,     setMonth]     = useState(filters.month      || '');
    const [filteredProjects, setFilteredProjects] = useState(projects);

    useEffect(() => {
        setFilteredProjects(clientId ? projects.filter(p => p.client_id == clientId) : projects);
    }, [clientId, projects]);

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const t = setTimeout(() => {
            router.get(route('inventory.index'), { search, status, project_id: projectId, client_id: clientId, brand_id: brandId, month }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(t);
    }, [search, status, projectId, clientId, brandId, month]);

    const clearFilters = () => { setSearch(''); setStatus('All'); setProjectId(''); setClientId(''); setBrandId(''); setMonth(''); };
    const hasFilters = search || status !== 'All' || projectId || clientId || brandId || month;

    const handleDelete = id => {
        if (confirm('Are you sure you want to delete this item? This cannot be undone.')) {
            router.delete(route('inventory.destroy', id), { preserveScroll: true });
        }
    };

    const exportUrl = route('inventory.export.excel', { search, status, project_id: projectId, client_id: clientId, month });

    const statCards = [
        { label: 'Total Stock Value',  value: `৳${new Intl.NumberFormat().format(totalValue)}`, icon: DollarSign, bg: '#f5f3ff', color: '#6366f1' },
        { label: 'Total Items',        value: items.total,   icon: Package,    bg: '#eff6ff', color: '#3b82f6' },
        { label: 'Active Items',       value: items.data.filter(i => i.status === 'active').length, icon: CheckCircle2, bg: '#f0fdf4', color: '#16a34a' },
    ];

    const selectStyle = {
        padding: '0.55rem 0.875rem', background: '#f9f7ff',
        border: '1.5px solid #ede9fe', borderRadius: '10px',
        fontSize: '0.82rem', color: '#4338ca', fontWeight: 600,
        outline: 'none', cursor: 'pointer', appearance: 'none',
        fontFamily: 'inherit',
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Inventory" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>

                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '3px' }}>
                            <Package size={16} color="#a78bfa" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Inventory</span>
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Stock & Items</h1>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '3px 0 0' }}>Manage all your products and stock levels</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                        <a href={exportUrl}>
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '0.6rem 1.125rem',
                                background: '#fff', border: '1.5px solid #ede9fe',
                                borderRadius: '12px', color: '#6366f1',
                                fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 1px 6px rgba(99,102,241,0.07)',
                            }}>
                                <FileSpreadsheet size={15} /> Export to Excel
                            </button>
                        </a>
                        <Link href={route('inventory.create')}>
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '0.6rem 1.25rem',
                                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                border: 'none', borderRadius: '12px', color: '#fff',
                                fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                            }}>
                                <Plus size={16} /> Add Item
                            </button>
                        </Link>
                    </div>
                </div>

                {/* ── Stat cards ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem' }}>
                    {statCards.map((s, i) => (
                        <div key={i} style={{ ...card, padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <s.icon size={20} color={s.color} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>{s.label}</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b', margin: 0, lineHeight: 1.2 }}>{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Filters ── */}
                <div style={{ ...card, padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* Search */}
                        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                            <Search size={14} color="#a78bfa" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search by name, SKU, brand…"
                                style={{ width: '100%', boxSizing: 'border-box', padding: '0.55rem 1rem 0.55rem 2rem', background: '#f9f7ff', border: '1.5px solid #ede9fe', borderRadius: '10px', fontSize: '0.82rem', color: '#1e1b4b', outline: 'none', fontFamily: 'inherit' }}
                                onFocus={onFocus} onBlur={onBlur}
                            />
                        </div>

                        {/* Status */}
                        <select value={status} onChange={e => setStatus(e.target.value)} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                            <option value="All">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="discontinued">Discontinued</option>
                        </select>

                        {/* Brand */}
                        <select value={brandId} onChange={e => setBrandId(e.target.value)} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                            <option value="">All Brands</option>
                            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>

                        {/* Project */}
                        <select value={projectId} onChange={e => setProjectId(e.target.value)} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                            <option value="">All Projects</option>
                            {filteredProjects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                        </select>

                        {/* Month */}
                        <input type="month" value={month} onChange={e => setMonth(e.target.value)}
                            style={{ ...selectStyle, padding: '0.55rem 0.875rem' }}
                            onFocus={onFocus} onBlur={onBlur}
                        />

                        {/* Clear */}
                        {hasFilters && (
                            <button onClick={clearFilters} style={{
                                display: 'flex', alignItems: 'center', gap: '4px',
                                padding: '0.55rem 0.875rem', background: '#fff1f2',
                                border: '1.5px solid #fecaca', borderRadius: '10px',
                                color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                            }}>
                                <X size={13} /> Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Items list ── */}
                {items.data.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {items.data.map(item => {
                            const cfg = getStatus(item.status);
                            const totalVal = (item.quantity_in_stock || 0) * (item.unit_price || 0);
                            return (
                                <div key={item.id} style={{
                                    ...card, padding: '1rem 1.25rem',
                                    display: 'flex', alignItems: 'center',
                                    gap: '1rem', flexWrap: 'wrap',
                                    transition: 'box-shadow 0.15s, transform 0.15s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 22px rgba(99,102,241,0.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    {/* Icon */}
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Package size={20} color="#8b5cf6" />
                                    </div>

                                    {/* Name + meta */}
                                    <div style={{ flex: 2, minWidth: '150px' }}>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e1b4b', margin: 0 }}>{item.name}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '3px', flexWrap: 'wrap' }}>
                                            {item.sku && (
                                                <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', background: '#f3f4f6', color: '#6b7280', padding: '1px 6px', borderRadius: '5px' }}>{item.sku}</span>
                                            )}
                                            {item.brand?.name && (
                                                <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#7c3aed' }}>{item.brand.name}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.7rem', fontWeight: 700, color: cfg.color, background: cfg.bg, padding: '3px 10px', borderRadius: '20px', flexShrink: 0 }}>
                                        {cfg.label}
                                    </span>

                                    {/* Stock */}
                                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                                        <p style={{ fontSize: '0.68rem', color: '#9ca3af', margin: 0 }}>In Stock</p>
                                        <p style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>
                                            {item.quantity_in_stock} <span style={{ fontSize: '0.68rem', color: '#9ca3af', fontWeight: 500 }}>{item.unit || 'pcs'}</span>
                                        </p>
                                    </div>

                                    {/* Value */}
                                    <div style={{ textAlign: 'right', minWidth: '100px' }}>
                                        <p style={{ fontSize: '0.68rem', color: '#9ca3af', margin: 0 }}>Total Value</p>
                                        <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#4338ca', margin: 0 }}>৳{new Intl.NumberFormat().format(totalVal)}</p>
                                    </div>

                                    {/* Project */}
                                    <div style={{ minWidth: '120px', maxWidth: '160px' }}>
                                        <p style={{ fontSize: '0.68rem', color: '#9ca3af', margin: 0 }}>Project</p>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.project?.title || <span style={{ color: '#d1d5db' }}>Unassigned</span>}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                                        <Link href={route('inventory.show', item.id)}>
                                            <button title="View" style={iconBtn('#f5f3ff', '#6366f1')}><Eye size={14} /></button>
                                        </Link>
                                        <Link href={route('inventory.edit', item.id)}>
                                            <button title="Edit" style={iconBtn('#f0fdf4', '#16a34a')}><Pencil size={14} /></button>
                                        </Link>
                                        <button title="Delete" style={iconBtn('#fff1f2', '#ef4444')} onClick={() => handleDelete(item.id)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 1rem', border: '2px dashed #ede9fe', borderRadius: '18px' }}>
                        <Package size={40} color="#e0d9ff" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1b4b', margin: '0 0 0.4rem' }}>No items found</h3>
                        <p style={{ fontSize: '0.82rem', color: '#9ca3af', margin: '0 0 1.5rem' }}>
                            {hasFilters ? 'Try adjusting your filters.' : 'Add your first inventory item to get started.'}
                        </p>
                        <Link href={route('inventory.create')}>
                            <button style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.625rem 1.25rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                                <Plus size={15} /> Add First Item
                            </button>
                        </Link>
                    </div>
                )}

                {/* ── Pagination ── */}
                {items.links && items.links.length > 3 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', ...card, padding: '0.875rem 1.25rem' }}>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: 0 }}>
                            Page <strong style={{ color: '#1e1b4b' }}>{items.current_page}</strong> of <strong style={{ color: '#1e1b4b' }}>{items.last_page}</strong> — {items.total} items
                        </p>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {items.links.map((link, i) => link.url ? (
                                <Link key={i} href={link.url} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '34px', height: '34px', padding: '0 8px', borderRadius: '9px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', background: link.active ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#f5f3ff', color: link.active ? '#fff' : '#6366f1' }} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : (
                                <span key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '34px', height: '34px', padding: '0 8px', borderRadius: '9px', fontSize: '0.78rem', fontWeight: 700, background: '#f9fafb', color: '#d1d5db' }} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </FigmaLayout>
    );
}

const iconBtn = (bg, color) => ({
    width: '30px', height: '30px', borderRadius: '8px',
    background: bg, border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color,
});
