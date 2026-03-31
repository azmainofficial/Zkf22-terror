import React, { useState, useEffect, useRef } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import { t } from '../../Lang/translation';
import {
    Plus, Search, Package, FileSpreadsheet, Eye,
    Pencil, Trash2, X, Filter, DollarSign, Hash,
    Building2, Briefcase, CheckCircle2, AlertCircle, PauseCircle, ChevronDown,
    Truck, Tag, Layers, Calendar, BarChart3, Wallet, Clock, Activity
} from 'lucide-react';

const STATUS_CONFIG = {
    active:       { label: 'Available',    color: '#10b981', bg: '#f0fdf4' },
    inactive:     { label: 'Reserved',     color: '#64748b', bg: '#f1f5f9' },
    discontinued: { label: 'Out of Stock', color: '#ef4444', bg: '#fef2f2' },
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
        padding: 0,
        background: bg, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, transition: 'all 0.2s'
    })
};

export default function Index({ auth, items, filters, projects = [], clients = [], brands = [], suppliers = [], totalValue = 0 }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'All');
    const [projectId, setProjectId] = useState(filters.project_id || '');
    const [clientId, setClientId] = useState(filters.client_id || '');
    const [brandId, setBrandId] = useState(filters.brand_id || '');
    const [supplierId, setSupplierId] = useState(filters.supplier_id || '');
    const [month, setMonth] = useState(filters.month || '');
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');

    useEffect(() => {
        const tId = setTimeout(() => {
            router.get(route('inventory.index'), {
                search, status, project_id: projectId, client_id: clientId,
                brand_id: brandId, supplier_id: supplierId, month,
                from_date: fromDate, to_date: toDate
            }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(tId);
    }, [search, status, projectId, clientId, brandId, supplierId, month, fromDate, toDate]);

    const handleDelete = id => {
        if (confirm('Are you sure you want to remove this material from the system?')) {
            router.delete(route('inventory.destroy', id), { preserveScroll: true });
        }
    };

    const clearFilters = () => {
        setSearch(''); setStatus('All'); setProjectId(''); setClientId('');
        setBrandId(''); setSupplierId(''); setMonth(''); setFromDate(''); setToDate('');
    };

    const fmt = (n) => `৳${new Intl.NumberFormat().format(n)}`;

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Material Stock" />

            <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '4rem' }}>
                
                {/* ── HEADER ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
                            Inventory
                        </h1>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500, margin: '4px 0 0' }}>
                            Tracking {items.total} registered materials across all business nodes
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <a href={route('inventory.export.excel', { search, status, project_id: projectId, client_id: clientId, brand_id: brandId, supplier_id: supplierId, month, from_date: fromDate, to_date: toDate })}>
                            <button style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
                                background: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', 
                                color: '#475569', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer'
                            }}>
                                <FileSpreadsheet size={18} /> Export List
                            </button>
                        </a>
                        <Link href={route('inventory.create')}>
                            <button style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
                                background: '#4f46e5', border: 'none', borderRadius: '12px', 
                                color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(79,70,229,0.2)'
                            }}>
                                <Plus size={18} /> Add New Item
                            </button>
                        </Link>
                    </div>
                </div>

                {/* ── STATS SUMMARY ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <MiniStat label="Total Stock Value" value={fmt(totalValue)} color="#4f46e5" icon={BarChart3} />
                    <MiniStat label="Items in Stock" value={items.total} color="#10b981" icon={Package} />
                    <MiniStat label="Active Brands" value={brands.length} color="#f59e0b" icon={Layers} />
                </div>

                {/* ── ITEM SEARCH HUB ── */}
                <div style={{ ...styles.card, padding: '24px', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Filter size={18} color="#4f46e5" />
                            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Item Search Hub</span>
                        </div>
                        <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <X size={14} /> Clear All
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
                        {/* Search & Project */}
                        <div style={{ position: 'relative' }}>
                            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ID or Name" style={filterInput} />
                        </div>
                        <SelectWrapper icon={Briefcase} val={projectId} setVal={setProjectId} placeholder="Pick Project" options={projects} />
                        
                        {/* Status & Brand */}
                        <div style={{ position: 'relative' }}>
                            <Activity size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <select value={status} onChange={e => setStatus(e.target.value)} style={filterInput}>
                                <option value="All">All Status</option>
                                <option value="active">Available</option>
                                <option value="inactive">Reserved</option>
                                <option value="discontinued">Out of Stock</option>
                            </select>
                            <ChevronDown size={14} color="#94a3b8" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                        <SelectWrapper icon={Tag} val={brandId} setVal={setBrandId} placeholder="Pick Brand" options={brands} />

                        {/* Date Launch / End Range */}
                        <div style={{ position: 'relative' }}>
                            <Calendar size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={filterInput} title="From Date" />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Clock size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={filterInput} title="To Date" />
                        </div>

                        {/* Suppliers & Clients */}
                        <SelectWrapper icon={Truck} val={supplierId} setVal={setSupplierId} placeholder="Pick Supplier" options={suppliers} />
                        <SelectWrapper icon={Building2} val={clientId} setVal={setClientId} placeholder="Pick Client" options={clients} />
                    </div>
                </div>

                {/* ── STOCK LIST ── */}
                <div style={styles.card}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 100px 1.2fr 140px 120px 100px', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <div style={{ paddingLeft: '8px' }}>Material Identity</div>
                        <div>Category Brand</div>
                        <div>Quantity</div>
                        <div>Assigned Source</div>
                        <div>Stock Value</div>
                        <div style={{ textAlign: 'center' }}>Status</div>
                        <div></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                        {items.data.length > 0 ? items.data.map((item, i) => {
                            const sc = STATUS_CONFIG[item.status] || STATUS_CONFIG.inactive;
                            const totalVal = (item.quantity_in_stock || 0) * (item.unit_price || 0);
                            return (
                                <div key={item.id} className="inventory-row" style={{ 
                                    display: 'grid', gridTemplateColumns: '1.5fr 1fr 100px 1.2fr 140px 120px 100px', 
                                    alignItems: 'center', padding: '16px 8px', borderRadius: '12px',
                                    transition: 'all 0.2s', borderBottom: i === items.data.length - 1 ? 'none' : '1px solid #f8fafc'
                                }}>
                                    {/* IDENTITY */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Package size={24} color="#64748b" />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{item.name}</p>
                                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, margin: '2px 0 0' }}>Code: {item.sku || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* BRAND */}
                                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1e293b' }}>{item.brand?.name || 'Generic'}</div>

                                    {/* QTY */}
                                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{item.quantity_in_stock} <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.unit}</span></div>

                                    {/* SOURCE */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Truck size={13} color="#94a3b8" />
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>{item.supplier?.company_name || 'Individual'}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Briefcase size={12} color="#cbd5e1" />
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.project?.title || 'Open Stock'}</span>
                                        </div>
                                    </div>

                                    {/* VALUE */}
                                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#4f46e5' }}>{fmt(totalVal)}</div>

                                    {/* STATUS */}
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <span style={{ 
                                            background: sc.bg, color: sc.color, 
                                            fontSize: '0.72rem', fontWeight: 800, 
                                            padding: '6px 12px', borderRadius: '10px',
                                            minWidth: '100px', textAlign: 'center'
                                        }}>
                                            {sc.label.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* ACTIONS */}
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <Link href={route('inventory.show', item.id)}>
                                            <button style={styles.actionBtn('#f1f5f9', '#64748b')} title="View"><Eye size={16} /></button>
                                        </Link>
                                        <Link href={route('inventory.edit', item.id)}>
                                            <button style={styles.actionBtn('#f0fdf4', '#10b981')} title="Edit"><Pencil size={16} /></button>
                                        </Link>
                                        <button onClick={() => handleDelete(item.id)} style={styles.actionBtn('#fef2f2', '#ef4444')} title="Remove"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                                <Package size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#64748b', margin: 0 }}>No items match your filters</h4>
                                <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 800, textDecoration: 'underline', cursor: 'pointer', marginTop: '12px' }}>Clear all scan filters</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── PAGINATION ── */}
                {items.links && items.links.length > 3 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
                        <div style={{ display: 'flex', background: '#fff', padding: '6px', borderRadius: '14px', border: '1px solid #f1f5f9', gap: '4px' }}>
                            {items.links.map((link, i) => (
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
                .inventory-row:hover { background: #f8fafc !important; transform: translateX(4px); }
                input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
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

function SelectWrapper({ icon: Icon, val, setVal, placeholder, options }) {
    return (
        <div style={{ position: 'relative' }}>
            <Icon size={16} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <select
                value={val} onChange={e => setVal(e.target.value)}
                style={{ ...filterInput, paddingLeft: '44px' }}
            >
                <option value="">{placeholder}</option>
                {options.map(o => <option key={o.id} value={o.id}>{o.title || o.name || o.company_name}</option>)}
            </select>
            <ChevronDown size={14} color="#94a3b8" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>
    );
}

const filterInput = {
    width: '100%', padding: '12px 16px 12px 48px', background: '#f8fafc',
    border: '1px solid #f1f5f9', borderRadius: '12px', fontSize: '0.85rem',
    outline: 'none', fontWeight: 600, color: '#1e293b', appearance: 'none',
    height: '44px'
};
