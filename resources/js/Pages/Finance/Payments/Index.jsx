import React, { useState, useEffect, useRef } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import { t } from '../../../Lang/translation';
import {
    Plus, Search, Filter, Eye, Edit, Trash2,
    ArrowUpRight, ArrowDownLeft, Download,
    Printer, ChevronDown, X, Activity,
    CreditCard, Briefcase
} from 'lucide-react';

const cardStyle = {
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
};

const getStatusConfig = (s) => {
    const status = (s || '').toLowerCase();
    const config = {
        completed: { label: t('completed'), bg: '#f0fdf4', color: '#16a34a' },
        paid:      { label: t('paid'),      bg: '#f0fdf4', color: '#16a34a' },
        approved:  { label: t('approved'),  bg: '#f0fdf4', color: '#16a34a' },
        pending:   { label: t('pending'),   bg: '#fffbeb', color: '#d97706' },
        failed:    { label: t('rejected') || 'Failed',    bg: '#fff1f2', color: '#dc2626' },
        refunded:  { label: t('refunded') || 'Refunded',  bg: '#eff6ff', color: '#2563eb' },
    };
    return config[status] || { label: s || 'Unknown', bg: '#f8fafc', color: '#64748b' };
};

const onFocus = e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; };
const onBlur  = e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; };

export default function Index({ auth, payments, filters, total_incoming, total_outgoing }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [type, setType]     = useState(filters.payment_type || '');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return; }
        const t = setTimeout(() => {
            router.get(route('payments.index'), { search, status, payment_type: type }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(t);
    }, [search, status, type]);

    const clearFilters = () => { setSearch(''); setStatus(''); setType(''); };
    const hasFilters = search || status || type;
    const netBalance = (total_incoming || 0) - (total_outgoing || 0);

    const handleDelete = (id) => {
        if (confirm(t('delete_confirm'))) {
            router.delete(route('payments.destroy', id));
        }
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={t('payments')} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>

                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{t('payments')}</h1>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0', fontWeight: 500 }}>
                            {t('manage_track_payments')}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <a href={route('payments.export.excel', { search, status, payment_type: type })}>
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '0.75rem 1.25rem',
                                background: '#fff', border: '1px solid #e2e8f0',
                                borderRadius: '10px', color: '#1e293b',
                                fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
                            }}>
                                <Download size={17} /> {t('export_excel')}
                            </button>
                        </a>
                        <Link href={route('payments.create')}>
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '0.75rem 1.5rem',
                                background: '#2563eb', border: 'none', borderRadius: '10px',
                                color: '#fff', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
                            }}>
                                <Plus size={18} /> {t('record_payment')}
                            </button>
                        </Link>
                    </div>
                </div>

                {/* ── Stat Cards ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    {/* Total Incoming */}
                    <div style={{ ...cardStyle, padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, margin: '0 0 0.5rem' }}>{t('total_revenue')}</p>
                            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                                ৳{new Intl.NumberFormat().format(total_incoming || 0)}
                            </p>
                        </div>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowDownLeft size={22} color="#16a34a" />
                        </div>
                    </div>

                    {/* Total Outgoing */}
                    <div style={{ ...cardStyle, padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, margin: '0 0 0.5rem' }}>{t('total_expenses')}</p>
                            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                                ৳{new Intl.NumberFormat().format(total_outgoing || 0)}
                            </p>
                        </div>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowUpRight size={22} color="#dc2626" />
                        </div>
                    </div>

                    {/* Net Balance — blue card */}
                    <div style={{ background: '#2563eb', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', fontWeight: 600, margin: '0 0 0.5rem' }}>{t('net_collection') || 'Net Balance'}</p>
                            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                                ৳{new Intl.NumberFormat().format(netBalance)}
                            </p>
                        </div>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CreditCard size={22} color="#fff" />
                        </div>
                    </div>
                </div>

                {/* ── Table Card ── */}
                <div style={cardStyle}>
                    {/* Search + Filters */}
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                            <Search size={16} color="#cbd5e1" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            <input
                                type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder={t('search_payments')}
                                style={{
                                    width: '100%', boxSizing: 'border-box',
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    background: '#fff', border: '1px solid #e2e8f0',
                                    borderRadius: '10px', fontSize: '0.875rem', color: '#1e293b',
                                    outline: 'none', fontWeight: 500,
                                }}
                                onFocus={onFocus} onBlur={onBlur}
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <select value={type} onChange={e => setType(e.target.value)} style={{ padding: '0.75rem 2.25rem 0.75rem 1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', outline: 'none', cursor: 'pointer', appearance: 'none', minWidth: '120px' }}>
                                <option value="">{t('all')} {t('type')}</option>
                                <option value="incoming">{t('received_payments')}</option>
                                <option value="outgoing">{t('total_expenses')}</option>
                            </select>
                            <ChevronDown size={14} color="#94a3b8" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: '0.75rem 2.25rem 0.75rem 1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', outline: 'none', cursor: 'pointer', appearance: 'none', minWidth: '120px' }}>
                                <option value="">{t('all_status')}</option>
                                <option value="completed">{t('completed')}</option>
                                <option value="pending">{t('pending')}</option>
                                <option value="failed">{t('rejected')}</option>
                                <option value="refunded">{t('refunded') || 'Refunded'}</option>
                            </select>
                            <ChevronDown size={14} color="#94a3b8" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>

                        <button style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#1e293b', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Filter size={16} />
                        </button>
                    </div>

                    {/* Table Header */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 120px',
                        padding: '0.875rem 1.5rem',
                        fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8',
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                        borderBottom: '1px solid #f8fafc',
                    }}>
                        <div>{t('transaction_id')}</div>
                        <div>{t('client')} / {t('project')}</div>
                        <div>{t('amount')}</div>
                        <div>{t('type')}</div>
                        <div>{t('status')}</div>
                        <div style={{ textAlign: 'right' }}>{t('actions')}</div>
                    </div>

                    {/* Table Body */}
                    {payments.data.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {payments.data.map((transaction, idx) => {
                                const cfg = getStatusConfig(transaction.status);
                                const isIncoming = transaction.type === 'incoming';
                                return (
                                    <div key={`${transaction.source}-${transaction.id}`} style={{
                                        display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 120px',
                                        padding: '1rem 1.5rem', alignItems: 'center',
                                        borderBottom: idx === payments.data.length - 1 ? 'none' : '1px solid #f8fafc',
                                        transition: 'background 0.15s',
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        {/* Transaction Info */}
                                        <div>
                                            <p style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                                                {transaction.transaction_number || `TXN-${transaction.id}`}
                                            </p>
                                            <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '2px 0 0', fontWeight: 500 }}>
                                                {transaction.date ? new Date(transaction.date).toLocaleDateString() : '—'}
                                            </p>
                                        </div>

                                        {/* Client / Project */}
                                        <div>
                                            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                                                {transaction.source === 'payment'
                                                    ? (transaction.client?.company_name || transaction.client?.name || '—')
                                                    : (transaction.category?.name || '—')
                                                }
                                            </p>
                                            {transaction.project && (
                                                <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '2px 0 0', fontWeight: 500 }}>
                                                    {transaction.project.title}
                                                </p>
                                            )}
                                        </div>

                                        {/* Amount */}
                                        <p style={{
                                            fontSize: '0.95rem', fontWeight: 700, margin: 0,
                                            color: isIncoming ? '#16a34a' : '#dc2626',
                                        }}>
                                            {isIncoming ? '+' : '-'}৳{new Intl.NumberFormat().format(transaction.amount)}
                                        </p>

                                        {/* Type */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: isIncoming ? '#f0fdf4' : '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {isIncoming
                                                    ? <ArrowDownLeft size={15} color="#16a34a" />
                                                    : <ArrowUpRight size={15} color="#dc2626" />
                                                }
                                            </div>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
                                                {isIncoming ? t('received_payments') : t('total_expenses')}
                                            </span>
                                        </div>

                                        {/* Status */}
                                        <span style={{
                                            display: 'inline-flex', padding: '3px 10px',
                                            borderRadius: '6px', fontSize: '0.72rem',
                                            fontWeight: 700, background: cfg.bg, color: cfg.color,
                                        }}>
                                            {cfg.label}
                                        </span>

                                        {/* Actions */}
                                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                            {transaction.source === 'payment' ? (
                                                <>
                                                    <Link href={route('payments.show', transaction.id)}>
                                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }} title={t('view_details')}><Eye size={17} /></button>
                                                    </Link>
                                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1' }} title={t('delete')} onClick={() => handleDelete(transaction.id)}>
                                                        <Trash2 size={17} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <Link href={route('expenses.show', transaction.id)}>
                                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }} title={t('view_details')}><Eye size={17} /></button>
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                            {t('no_payments_found')}
                        </div>
                    )}
                </div>

                {/* ── Pagination ── */}
                {payments.links && payments.links.length > 3 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', ...cardStyle, padding: '0.875rem 1.25rem' }}>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: 0 }}>
                            {t('page')} <strong style={{ color: '#1e293b' }}>{payments.current_page}</strong> {t('of')} <strong style={{ color: '#1e293b' }}>{payments.last_page}</strong> — {payments.total} {t('items')}
                        </p>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {payments.links.map((link, i) => link.url ? (
                                <Link key={i} href={link.url} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '34px', height: '34px', padding: '0 8px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', background: link.active ? '#2563eb' : '#f1f5f9', color: link.active ? '#fff' : '#64748b' }} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : (
                                <span key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '34px', height: '34px', padding: '0 8px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, background: '#f9fafb', color: '#d1d5db' }} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </FigmaLayout>
    );
}
