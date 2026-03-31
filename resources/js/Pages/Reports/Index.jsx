import { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, router } from '@inertiajs/react';
import { t } from '../../Lang/translation';

// Safe route helper — returns '#' if the route is not registered
const safeRoute = (name, params = {}) => {
    try { return route(name, params); } catch { return '#'; }
};
import {
    Calendar, ArrowDownLeft, ArrowUpRight, TrendingUp,
    DollarSign, CreditCard, Briefcase, Filter, Download,
    BarChart2, FileText
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { format } from 'date-fns';

// ─── Shared styles ───────────────────────────────────────────────
const cardStyle = {
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    padding: '1.5rem',
};

const thStyle = {
    padding: '0.75rem 1rem',
    fontSize: '0.7rem', fontWeight: 800,
    color: '#94a3b8', textTransform: 'uppercase',
    letterSpacing: '0.05em', textAlign: 'left',
    borderBottom: '1px solid #f1f5f9',
    background: '#fcfcfd',
};

const tdStyle = (align = 'left') => ({
    padding: '0.875rem 1rem',
    fontSize: '0.875rem', fontWeight: 500,
    color: '#1e293b', textAlign: align,
    borderBottom: '1px solid #f8fafc',
});

export default function ReportsIndex({ auth, summary, daily_data, monthly_data, filters }) {
    const queryParams = new URLSearchParams(window.location.search);
    const initialView = queryParams.get('view') || 'overview';

    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('reports.index'), {
            view: initialView,
            start_date: startDate,
            end_date: endDate,
        }, { preserveState: true });
    };

    const getPageTitle = () => {
        if (initialView === 'daily') return t('daily_report');
        if (initialView === 'monthly') return t('monthly_report');
        return t('reports_overview');
    };

    const getSubtitle = () => {
        if (initialView === 'daily') return t('income_expense_breakdown');
        if (initialView === 'monthly') return t('monthly_summary_subtitle');
        return t('financial_overview_subtitle');
    };

    const fmt = (val) => `৳${parseFloat(val || 0).toLocaleString()}`;

    const statCards = [
        { label: t('total_collection'),    value: fmt(summary.new_collections),  icon: ArrowDownLeft, bg: '#f0fdf4', color: '#16a34a' },
        { label: t('operational_expense'), value: fmt(summary.other_expenses),    icon: ArrowUpRight,  bg: '#fff1f2', color: '#dc2626' },
        { label: t('salary_expense'),      value: fmt(summary.salary_expenses),   icon: Briefcase,     bg: '#fffbeb', color: '#d97706' },
        { label: t('net_profit'),          value: fmt(summary.net_profit),        icon: TrendingUp,    bg: summary.net_profit >= 0 ? '#f0fdf4' : '#fff1f2', color: summary.net_profit >= 0 ? '#16a34a' : '#dc2626' },
        { label: t('due_collection'),      value: fmt(summary.due_collection),    icon: CreditCard,    bg: '#fffbeb', color: '#d97706' },
        { label: t('total_receivable'),    value: fmt(summary.total_receivable),  icon: DollarSign,    bg: '#eff6ff', color: '#2563eb' },
    ];

    const inputStyle = {
        padding: '0.625rem 0.875rem', border: '1px solid #e2e8f0',
        borderRadius: '8px', fontSize: '0.875rem', color: '#1e293b',
        outline: 'none', background: '#fff',
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={getPageTitle()} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>

                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                            {getPageTitle()}
                        </h1>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0', fontWeight: 500 }}>
                            {getSubtitle()}
                        </p>
                    </div>

                    {/* View tabs */}
                    <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
                        {[
                            { key: 'overview', label: t('overview'),       icon: BarChart2 },
                            { key: 'daily',    label: t('daily_report'),   icon: Calendar },
                            { key: 'monthly',  label: t('monthly_report'), icon: FileText },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => router.get(route('reports.index'), { view: tab.key, start_date: startDate, end_date: endDate }, { preserveState: true })}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '0.5rem 1rem', border: 'none', borderRadius: '8px',
                                    fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                                    background: initialView === tab.key ? '#fff' : 'transparent',
                                    color: initialView === tab.key ? '#1e293b' : '#94a3b8',
                                    boxShadow: initialView === tab.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <tab.icon size={14} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Date filter bar ── */}
                <form onSubmit={handleFilter} style={{ ...cardStyle, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '0.5rem' }}>
                        <Filter size={16} color="#64748b" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>{t('filter_by_date')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>{t('from')}</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>{t('to')}</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={inputStyle} />
                    </div>
                    <button
                        type="submit"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '0.625rem 1.25rem',
                            background: '#2563eb', border: 'none', borderRadius: '8px',
                            color: '#fff', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
                        }}
                    >
                        <Filter size={15} /> {t('apply')}
                    </button>
                </form>

                {/* ══════════════════════════════════ OVERVIEW ══════════════════════════════════ */}
                {initialView === 'overview' && (
                    <>
                        {/* Stat Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            {statCards.map((s, i) => (
                                <div key={i} style={{ ...cardStyle }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', margin: 0 }}>{s.label}</p>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <s.icon size={18} color={s.color} />
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{s.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Charts */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="reports-chart-grid">
                            {/* Area Chart */}
                            <div style={{ ...cardStyle }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                                    <Calendar size={16} color="#2563eb" />
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{t('daily_transaction_overview')}</h3>
                                </div>
                                <div style={{ height: '280px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={daily_data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="date" tickFormatter={(s) => { try { return format(new Date(s), 'dd MMM'); } catch { return s; } }} stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v / 1000}k`} />
                                            <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '0.8rem' }} formatter={v => [`৳${v.toLocaleString()}`, '']} />
                                            <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '1rem' }} />
                                            <Area type="monotone" dataKey="income" name={t('income')} stroke="#16a34a" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                                            <Area type="monotone" dataKey="expense" name={t('expense')} stroke="#dc2626" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Bar Chart */}
                            <div style={{ ...cardStyle }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                                    <TrendingUp size={16} color="#2563eb" />
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{t('monthly_comparison')}</h3>
                                </div>
                                <div style={{ height: '280px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthly_data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="month" stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v / 1000}k`} />
                                            <Tooltip cursor={{ fill: 'rgba(241,245,249,0.6)' }} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '0.8rem' }} formatter={v => [`৳${v.toLocaleString()}`, '']} />
                                            <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '1rem' }} />
                                            <Bar dataKey="income" name={t('income')} fill="#16a34a" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="expense" name={t('expense')} fill="#dc2626" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ══════════════════════════════════ DAILY ══════════════════════════════════ */}
                {initialView === 'daily' && (
                    <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar size={16} color="#2563eb" />
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{t('daily_report')}</h3>
                            </div>
                            <a href={safeRoute('reports.export.daily', { start_date: startDate, end_date: endDate })}>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.5rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', cursor: 'pointer' }}>
                                    <Download size={14} /> {t('export_xls')}
                                </button>
                            </a>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>{t('date')}</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>{t('total_collection')}</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>{t('project_collection')}</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>{t('new_dues')}</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>{t('salary_paid')}</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>{t('operational_exp')}</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>{t('net_profit')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {daily_data.length > 0 ? daily_data.map((item, i) => (
                                        <tr key={i} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                            <td style={tdStyle()}>{(() => { try { return format(new Date(item.date), 'dd MMM yyyy'); } catch { return item.date; } })()}</td>
                                            <td style={{ ...tdStyle('right'), color: '#16a34a', fontWeight: 700 }}>{fmt(item.total_collection)}</td>
                                            <td style={{ ...tdStyle('right'), color: '#2563eb', fontWeight: 700 }}>{fmt(item.project_collection)}</td>
                                            <td style={{ ...tdStyle('right'), color: '#d97706', fontWeight: 700 }}>{fmt(item.new_invoice_amount)}</td>
                                            <td style={{ ...tdStyle('right'), color: '#dc2626', fontWeight: 700 }}>{fmt(item.salary_paid)}</td>
                                            <td style={{ ...tdStyle('right'), color: '#d97706', fontWeight: 700 }}>{fmt(item.operational_expense)}</td>
                                            <td style={{ ...tdStyle('right'), fontWeight: 800, color: item.net_profit >= 0 ? '#16a34a' : '#dc2626' }}>{fmt(item.net_profit)}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={7} style={{ ...tdStyle('center'), padding: '3rem', color: '#94a3b8' }}>{t('no_data_found')}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════ MONTHLY ══════════════════════════════════ */}
                {initialView === 'monthly' && (
                    <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={16} color="#2563eb" />
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{t('monthly_report')}</h3>
                            </div>
                            <a href={safeRoute('reports.export.monthly', { start_date: startDate, end_date: endDate })}>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.5rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', cursor: 'pointer' }}>
                                    <Download size={14} /> {t('export_xls')}
                                </button>
                            </a>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>{t('month')}</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>{t('total_collection')}</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>{t('project_collection')}</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>{t('new_dues')}</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>{t('salary_paid')}</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>{t('operational_exp')}</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>{t('net_profit')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthly_data.length > 0 ? monthly_data.map((item, i) => (
                                        <tr key={i} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                            <td style={tdStyle()}>{item.month}</td>
                                            <td style={{ ...tdStyle('right'), color: '#16a34a', fontWeight: 700 }}>{fmt(item.total_collection)}</td>
                                            <td style={{ ...tdStyle('right'), color: '#2563eb', fontWeight: 700 }}>{fmt(item.project_collection)}</td>
                                            <td style={{ ...tdStyle('right'), color: '#d97706', fontWeight: 700 }}>{fmt(item.new_invoice_amount)}</td>
                                            <td style={{ ...tdStyle('right'), color: '#dc2626', fontWeight: 700 }}>{fmt(item.salary_paid)}</td>
                                            <td style={{ ...tdStyle('right'), color: '#d97706', fontWeight: 700 }}>{fmt(item.operational_expense)}</td>
                                            <td style={{ ...tdStyle('right'), fontWeight: 800, color: item.net_profit >= 0 ? '#16a34a' : '#dc2626' }}>{fmt(item.net_profit)}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={7} style={{ ...tdStyle('center'), padding: '3rem', color: '#94a3b8' }}>{t('no_data_found')}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>

            <style>{`
                @media (max-width: 900px) { .reports-chart-grid { grid-template-columns: 1fr !important; } }
            `}</style>
        </FigmaLayout>
    );
}
