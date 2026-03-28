import React, { useState, useEffect, useRef } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    CreditCard,
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar,
    Download,
    Printer,
    FileText,
    Activity,
    Layers,
    ChevronDown,
    Zap,
    TrendingUp,
    Briefcase,
    Building,
    History,
    ExternalLink,
    Wallet,
    ArrowDownRight,
    Inbox,
    X,
    ChevronRight,
    ArrowLeftRight
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
    const status = (s || '').toLowerCase();
    const config = {
        completed: { label: 'Completed', bg: '#f0fdf4', color: '#16a34a', icon: Zap },
        paid:      { label: 'Paid',      bg: '#f0fdf4', color: '#16a34a', icon: Wallet },
        approved:  { label: 'Approved',  bg: '#f0fdf4', color: '#16a34a', icon: CheckCircle2 },
        pending:   { label: 'Pending',   bg: '#fffbeb', color: '#d97706', icon: Clock },
        failed:    { label: 'Failed',    bg: '#fff1f2', color: '#dc2626', icon: X },
        refunded:  { label: 'Refunded',  bg: '#eff6ff', color: '#3b82f6', icon: ArrowLeftRight },
    };
    return config[status] || { label: s, bg: '#f8fafc', color: '#64748b', icon: Activity };
};

export default function Index({ auth, payments, filters, total_incoming, total_outgoing }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [type, setType] = useState(filters.payment_type || '');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const t = setTimeout(() => {
            router.get(route('payments.index'), { search, status, payment_type: type }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(t);
    }, [search, status, type]);

    const clearFilters = () => { setSearch(''); setStatus(''); setType(''); };
    const hasFilters = search || status || type;

    const netBalance = (total_incoming || 0) - (total_outgoing || 0);

    const statCards = [
        { label: 'Inbound Revenue', value: `৳${new Intl.NumberFormat().format(total_incoming || 0)}`, icon: ArrowDownLeft, bg: '#f0fdf4', color: '#16a34a' },
        { label: 'Outbound Expenses', value: `৳${new Intl.NumberFormat().format(total_outgoing || 0)}`, icon: ArrowUpRight, bg: '#fff1f2', color: '#dc2626' },
        { label: 'Net Liquidity', value: `৳${new Intl.NumberFormat().format(netBalance)}`, icon: TrendingUp, bg: '#f5f3ff', color: '#6366f1' },
    ];

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Transaction Ledger" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>

                {/* ── Header (Inventory Style) ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '3px' }}>
                            <Wallet size={16} color="#a78bfa" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cash Flow Ledger</span>
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Payments & Reconciliation</h1>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '3px 0 0' }}>Monitor all real-time financial movements and inbound/outbound transfers</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                        <a href={route('payments.export.excel', { search, status, payment_type: type })}>
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '0.6rem 1.125rem',
                                background: '#fff', border: '1.5px solid #ede9fe',
                                borderRadius: '12px', color: '#6366f1',
                                fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 1px 6px rgba(99,102,241,0.07)',
                            }}>
                                <Download size={15} /> Export Ledger
                            </button>
                        </a>
                        <Link href={route('payments.create')}>
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '0.6rem 1.25rem',
                                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                border: 'none', borderRadius: '12px', color: '#fff',
                                fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                            }}>
                                <Plus size={16} /> Register Transfer
                            </button>
                        </Link>
                    </div>
                </div>

                {/* ── Stat cards (Inventory Style) ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem' }}>
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
                                placeholder="TXN Code, Client, or Source category..."
                                style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 1rem 0.625rem 2.25rem', background: '#f9f7ff', border: '1.5px solid #ede9fe', borderRadius: '10px', fontSize: '0.85rem', color: '#1e1b4b', outline: 'none', fontWeight: 600 }}
                                onFocus={onFocus} onBlur={onBlur}
                            />
                        </div>

                        {/* Type Toggle */}
                        <div style={{ display: 'flex', background: '#f5f3ff', padding: '4px', borderRadius: '10px', border: '1.5px solid #ede9fe' }}>
                            {[
                                { val: '', label: 'All Flow' },
                                { val: 'incoming', label: 'Incoming' },
                                { val: 'outgoing', label: 'Outgoing' }
                            ].map((t) => (
                                <button key={t.val} onClick={() => setType(t.val)}
                                    style={{
                                        padding: '0.45rem 1rem', border: 'none', borderRadius: '8px', 
                                        fontSize: '0.78rem', fontWeight: 850, cursor: 'pointer',
                                        background: type === t.val ? '#fff' : 'transparent',
                                        color: type === t.val ? '#6366f1' : '#94a3b8',
                                        boxShadow: type === t.val ? '0 2px 8px rgba(99,102,241,0.1)' : 'none',
                                        transition: 'all 0.2s'
                                    }}>
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Status Select */}
                        <select 
                            value={status} 
                            onChange={e => setStatus(e.target.value)}
                            style={{ padding: '0.55rem 0.875rem', background: '#f9f7ff', border: '1.5px solid #ede9fe', borderRadius: '10px', fontSize: '0.82rem', color: '#4338ca', fontWeight: 600, outline: 'none', cursor: 'pointer', appearance: 'none', minWidth: '140px' }}
                            onFocus={onFocus} onBlur={onBlur}
                        >
                            <option value="">Any Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>

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

                {/* ── Payments List (Row Pattern) ── */}
                {payments.data.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {payments.data.map(transaction => {
                            const cfg = getStatusConfig(transaction.status);
                            const isIncoming = transaction.type === 'incoming';
                            
                            return (
                                <div key={`${transaction.source}-${transaction.id}`} style={{
                                    ...card, padding: '1rem 1.5rem',
                                    display: 'flex', alignItems: 'center',
                                    gap: '1.5rem', flexWrap: 'wrap',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0eeff'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    {/* Type-based Icon */}
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: isIncoming ? '#f0fdf4' : '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1.5px solid ${isIncoming ? '#dcfce7' : '#fee2e2'}` }}>
                                        {isIncoming ? <ArrowDownLeft size={22} color="#16a34a" /> : <ArrowUpRight size={22} color="#dc2626" />}
                                    </div>

                                    {/* TXN & Date */}
                                    <div style={{ width: '150px' }}>
                                        <p style={{ fontSize: '0.92rem', fontWeight: 850, color: '#1e1b4b', margin: 0 }}>{transaction.transaction_number}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                            <Calendar size={13} color="#94a3b8" />
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>{new Date(transaction.date).toLocaleDateString('en-GB')}</span>
                                        </div>
                                    </div>

                                    {/* Source & Description */}
                                    <div style={{ flex: 2, minWidth: '220px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e1b4b', margin: 0 }}>
                                                {transaction.source === 'payment'
                                                    ? (transaction.client?.company_name || transaction.client?.name || transaction.notes || 'General Payment')
                                                    : (transaction.category?.name || 'Administrative Expense')
                                                }
                                            </p>
                                        </div>
                                        {transaction.project && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                                <Briefcase size={12} color="#a78bfa" />
                                                <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#a78bfa', margin: 0, textTransform: 'uppercase' }}>{transaction.project.title}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Amount Row Style */}
                                    <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                        <p style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>{isIncoming ? 'Inbound' : 'Outbound'}</p>
                                        <p style={{ fontSize: '1.15rem', fontWeight: 900, color: isIncoming ? '#16a34a' : '#dc2626', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                            {isIncoming ? '+' : '-'} ৳{new Intl.NumberFormat().format(transaction.amount)}
                                        </p>
                                    </div>

                                    {/* Status Badge */}
                                    <div style={{ minWidth: '110px', textAlign: 'center' }}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 800, color: cfg.color, background: cfg.bg, padding: '4px 12px', borderRadius: '20px', border: `1.5px solid ${cfg.color}15` }}>
                                            <cfg.icon size={12} />
                                            {cfg.label}
                                        </span>
                                    </div>

                                    {/* Actions Suite */}
                                    <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                                        {transaction.source === 'payment' ? (
                                            <>
                                                <a href={route('payments.show', transaction.id) + '?print=true'} target="_blank" rel="noopener noreferrer">
                                                    <button style={iconBtn('#f8fafc', '#64748b')} title="Receipt"><Printer size={16} /></button>
                                                </a>
                                                <Link href={route('payments.show', transaction.id)}>
                                                    <button style={iconBtn('#f5f3ff', '#6366f1')} title="View"><Eye size={16} /></button>
                                                </Link>
                                                <Link href={route('payments.edit', transaction.id)}>
                                                    <button style={iconBtn('#fffbeb', '#d97706')} title="Edit"><Edit size={16} /></button>
                                                </Link>
                                                <button style={iconBtn('#fff1f2', '#ef4444')} onClick={() => handleDelete(transaction.id)} title="Purge Log">
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link href={route('expenses.show', transaction.id)}>
                                                    <button style={iconBtn('#f5f3ff', '#6366f1')} title="View Expense"><Eye size={16} /></button>
                                                </Link>
                                                <Link href={route('expenses.edit', transaction.id)}>
                                                    <button style={iconBtn('#fffbeb', '#d97706')} title="Edit Expense"><Edit size={16} /></button>
                                                </Link>
                                            </>
                                        )}
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
                        <Wallet size={48} color="#e0d9ff" style={{ margin: '0 auto 1.5rem' }} />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e1b4b', margin: '0 0 0.5rem' }}>No Ledger Entries Found</h3>
                        <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: '0 0 2rem' }}>
                            {hasFilters ? 'No transactions match your current view filters.' : 'Your financial ledger is currently empty. Record your first movement.'}
                        </p>
                        <Link href={route('payments.create')}>
                            <button style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '8px', 
                                padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg,#10b981,#059669)', 
                                border: 'none', borderRadius: '14px', color: '#fff', 
                                fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                                boxShadow: '0 6px 16px rgba(16,185,129,0.25)'
                            }}>
                                <Plus size={18} /> Record First Movement
                            </button>
                        </Link>
                    </div>
                )}

                {/* ── Pagination (Inventory Style) ── */}
                {payments.links && payments.links.length > 3 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', ...card, padding: '0.875rem 1.25rem' }}>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: 0, fontWeight: 600 }}>
                            Page <strong style={{ color: '#1e1b4b' }}>{payments.current_page}</strong> of <strong style={{ color: '#1e1b4b' }}>{payments.last_page}</strong> — {payments.total} ledger entries
                        </p>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {payments.links.map((link, i) => link.url ? (
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
