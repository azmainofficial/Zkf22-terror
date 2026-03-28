import React, { useState, useEffect, useRef } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    FileText,
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Download,
    Send,
    DollarSign,
    Calendar,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    Clock,
    ShieldCheck,
    Receipt,
    ChevronRight,
    ArrowUpRight,
    Wallet,
    Inbox,
    Building2,
    Briefcase,
    Zap,
    X,
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
    const status = (s || 'draft').toLowerCase();
    const config = {
        paid:      { label: 'Paid',      bg: '#f0fdf4', color: '#16a34a', icon: CheckCircle2 },
        overdue:   { label: 'Overdue',   bg: '#fff1f2', color: '#dc2626', icon: AlertCircle },
        sent:      { label: 'Sent',      bg: '#eff6ff', color: '#3b82f6', icon: Send },
        partial:   { label: 'Partial',   bg: '#fffbeb', color: '#d97706', icon: Clock },
        cancelled: { label: 'Cancelled', bg: '#f3f4f6', color: '#6b7280', icon: X },
        draft:     { label: 'Draft',     bg: '#f8fafc', color: '#64748b', icon: FileText },
    };
    return config[status] || config.draft;
};

export default function Index({ auth, invoices, filters, stats }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'All');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const t = setTimeout(() => {
            router.get(route('invoices.index'), { search, status }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(t);
    }, [search, status]);

    const clearFilters = () => { setSearch(''); setStatus('All'); };
    const hasFilters = search || status !== 'All';

    const statCards = [
        { label: 'Revenue Generated', value: `৳${new Intl.NumberFormat().format(stats?.total_amount || 0)}`, icon: TrendingUp, bg: '#f5f3ff', color: '#6366f1' },
        { label: 'Total Collected', value: `৳${new Intl.NumberFormat().format(stats?.total_paid || 0)}`, icon: Wallet, bg: '#f0fdf4', color: '#16a34a' },
        { label: 'Outstanding Balance', value: `৳${new Intl.NumberFormat().format(stats?.total_due || 0)}`, icon: Clock, bg: '#fff1f2', color: '#dc2626' },
        { label: 'Billing Health', value: `${stats?.collection_rate || 0}%`, icon: ShieldCheck, bg: '#eff6ff', color: '#3b82f6' },
    ];

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Invoice Board" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>

                {/* ── Header (Inventory Style) ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '3px' }}>
                            <Receipt size={16} color="#a78bfa" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Financial Operations</span>
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Sales & Billing</h1>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '3px 0 0' }}>Manage client invoices, partial payments, and collections</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                        <a href={route('invoices.export.excel', { search, status: status === 'All' ? '' : status })}>
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '0.6rem 1.125rem',
                                background: '#fff', border: '1.5px solid #ede9fe',
                                borderRadius: '12px', color: '#6366f1',
                                fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 1px 6px rgba(99,102,241,0.07)',
                            }}>
                                <Download size={15} /> Export Transactions
                            </button>
                        </a>
                        <Link href={route('invoices.create')}>
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '0.6rem 1.25rem',
                                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                border: 'none', borderRadius: '12px', color: '#fff',
                                fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                            }}>
                                <Plus size={16} /> Generate Invoice
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
                                placeholder="Invoice ID, Client, or Project name..."
                                style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 1rem 0.625rem 2.25rem', background: '#f9f7ff', border: '1.5px solid #ede9fe', borderRadius: '10px', fontSize: '0.85rem', color: '#1e1b4b', outline: 'none', fontWeight: 600 }}
                                onFocus={onFocus} onBlur={onBlur}
                            />
                        </div>

                        {/* Status Toggle (Inventory Style) */}
                        <div style={{ display: 'flex', background: '#f5f3ff', padding: '4px', borderRadius: '10px', border: '1.5px solid #ede9fe' }}>
                            {['All', 'Paid', 'Sent', 'Overdue', 'Draft'].map((s) => (
                                <button key={s} onClick={() => setStatus(s)}
                                    style={{
                                        padding: '0.45rem 1rem', border: 'none', borderRadius: '8px', 
                                        fontSize: '0.78rem', fontWeight: 850, cursor: 'pointer',
                                        background: status === s ? '#fff' : 'transparent',
                                        color: status === s ? '#6366f1' : '#94a3b8',
                                        boxShadow: status === s ? '0 2px 8px rgba(99,102,241,0.1)' : 'none',
                                        transition: 'all 0.2s'
                                    }}>
                                    {s}
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
                                <X size={13} /> Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Invoices List (Row Pattern) ── */}
                {invoices.data.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {invoices.data.map(invoice => {
                            const cfg = getStatusConfig(invoice.status);
                            const balanceDue = Number(invoice.balance || 0);
                            return (
                                <div key={invoice.id} style={{
                                    ...card, padding: '1rem 1.5rem',
                                    display: 'flex', alignItems: 'center',
                                    gap: '1.5rem', flexWrap: 'wrap',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0eeff'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    {/* Icon */}
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1.5px solid #ede9fe' }}>
                                        <FileText size={22} color="#8b5cf6" />
                                    </div>

                                    {/* ID & Status */}
                                    <div style={{ width: '160px' }}>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 850, color: '#1e1b4b', margin: 0 }}>{invoice.invoice_number}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.color }}></div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                {cfg.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Client & Project */}
                                    <div style={{ flex: 2, minWidth: '180px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Building2 size={14} color="#94a3b8" />
                                            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e1b4b', margin: 0 }}>{invoice.client?.company_name || 'Individual Client'}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                            <Briefcase size={14} color="#cbd5e1" />
                                            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', margin: 0 }}>{invoice.project?.title || 'Standalone Sale'}</p>
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div style={{ width: '140px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Calendar size={13} color="#94a3b8" />
                                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', margin: 0 }}>{new Date(invoice.invoice_date).toLocaleDateString('en-GB')}</p>
                                        </div>
                                        <p style={{ fontSize: '0.68rem', color: balanceDue > 0 ? '#ef4444' : '#9ca3af', fontWeight: 800, margin: '2px 0 0', textTransform: 'uppercase' }}>
                                            Due: {new Date(invoice.due_date).toLocaleDateString('en-GB')}
                                        </p>
                                    </div>

                                    {/* Totals */}
                                    <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                        <p style={{ fontSize: '0.68rem', color: '#9ca3af', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>Total Amount</p>
                                        <p style={{ fontSize: '1rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>
                                            ৳{new Intl.NumberFormat().format(invoice.total_amount)}
                                        </p>
                                        {balanceDue > 0 && (
                                            <p style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 800, margin: 0 }}>
                                                Lacking: ৳{new Intl.NumberFormat().format(balanceDue)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                                        <Link href={route('invoices.show', invoice.id)} title="View Details">
                                            <button style={iconBtn('#f5f3ff', '#6366f1')}><Eye size={16} /></button>
                                        </Link>
                                        <Link href={route('invoices.edit', invoice.id)} title="Edit Draft">
                                            <button style={iconBtn('#fffbeb', '#d97706')}><Edit size={16} /></button>
                                        </Link>
                                        <a href={route('invoices.export', invoice.id)} title="Download Report">
                                            <button style={iconBtn('#f0fdf4', '#16a34a')}><Download size={16} /></button>
                                        </a>
                                        <button title="Cancel Invoice" 
                                            style={iconBtn('#fff1f2', '#ef4444')} 
                                            onClick={() => confirm('Withdraw this invoice?') && router.delete(route('invoices.destroy', invoice.id))}
                                        >
                                            <Trash2 size={16} />
                                        </button>
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
                        <Inbox size={48} color="#e0d9ff" style={{ margin: '0 auto 1.5rem' }} />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e1b4b', margin: '0 0 0.5rem' }}>Zero Transaction Records</h3>
                        <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: '0 0 2rem' }}>
                            {hasFilters ? 'No invoices match your selected filters.' : 'Your financial history is empty. Start by billing a client.'}
                        </p>
                        <Link href={route('invoices.create')}>
                            <button style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '8px', 
                                padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', 
                                border: 'none', borderRadius: '14px', color: '#fff', 
                                fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                                boxShadow: '0 6px 16px rgba(99,102,241,0.25)'
                            }}>
                                <Plus size={18} /> Deploy First Invoice
                            </button>
                        </Link>
                    </div>
                )}

                {/* ── Pagination (Inventory Style) ── */}
                {invoices.links && invoices.links.length > 3 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', ...card, padding: '0.875rem 1.25rem' }}>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: 0, fontWeight: 600 }}>
                            Page <strong style={{ color: '#1e1b4b' }}>{invoices.current_page}</strong> of <strong style={{ color: '#1e1b4b' }}>{invoices.last_page}</strong> — {invoices.total} total transactions
                        </p>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {invoices.links.map((link, i) => link.url ? (
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
