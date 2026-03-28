import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Search, Calendar, Download, Users, Clock, User, CheckCircle2,
    XCircle, Activity, LogOut, LogIn, Table, ArrowRight, ClipboardList,
    AlertTriangle, Calculator, DollarSign, Wallet
} from 'lucide-react';

const card = {
    background: '#fff', borderRadius: '16px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
};
const onFocus = e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; };
const onBlur  = e => { e.target.style.borderColor = '#ede9fe'; e.target.style.boxShadow = 'none'; };

export default function PayrollReport({ auth, attendances, filters, periodLabel }) {
    const [search, setSearch] = useState(filters.search || '');
    const [period, setPeriod] = useState(filters.period || 'this_week');

    useEffect(() => {
        const t = setTimeout(() => {
            router.get(route('attendance.payroll_report'), { search, period }, { preserveState: true, replace: true, preserveScroll: true });
        }, 500);
        return () => clearTimeout(t);
    }, [search, period]);

    const selectStyle = {
        padding: '0.55rem 0.875rem', background: '#f9f7ff',
        border: '1.5px solid #ede9fe', borderRadius: '10px',
        fontSize: '0.82rem', color: '#4338ca', fontWeight: 600,
        outline: 'none', cursor: 'pointer', appearance: 'none',
        fontFamily: 'inherit',
    };

    const Pagination = ({ links }) => {
        if (!links || links.length <= 3) return null;
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem', ...card, padding: '0.875rem 1.25rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {links.map((link, i) => link.url ? (
                        <Link key={i} href={link.url} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '34px', height: '34px', padding: '0 8px', borderRadius: '9px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', background: link.active ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#f5f3ff', color: link.active ? '#fff' : '#6366f1' }} dangerouslySetInnerHTML={{ __html: link.label }} />
                    ) : (
                        <span key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '34px', height: '34px', padding: '0 8px', borderRadius: '9px', fontSize: '0.78rem', fontWeight: 700, background: '#f9fafb', color: '#d1d5db' }} dangerouslySetInnerHTML={{ __html: link.label }} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Payroll Calculations" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto', paddingBottom: '3rem' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '3px' }}>
                            <Calculator size={16} color="#a78bfa" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Automated HR Deductions</span>
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Calculated Payroll Stats</h1>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '3px 0 0' }}>Data stored specifically for compiling salaries, overtime bonuses, and late deductions</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                        <Link href={route('attendance.index')}>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1.125rem', background: '#fff', border: '1.5px solid #ede9fe', borderRadius: '12px', color: '#6366f1', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 1px 6px rgba(99,102,241,0.07)' }}>
                                <ArrowRight size={15} style={{ transform: 'rotate(180deg)' }} /> Back to Live Roster
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div style={{ ...card, padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                                <Search size={14} color="#a78bfa" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                    placeholder="Find employee by name..."
                                    style={{ width: '100%', boxSizing: 'border-box', padding: '0.55rem 1rem 0.55rem 2rem', background: '#f9f7ff', border: '1.5px solid #ede9fe', borderRadius: '10px', fontSize: '0.82rem', color: '#1e1b4b', outline: 'none', fontFamily: 'inherit' }}
                                    onFocus={onFocus} onBlur={onBlur}
                                />
                            </div>

                            <select value={period} onChange={e => setPeriod(e.target.value)} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                                <option value="this_week">This Week</option>
                                <option value="last_week">Last Week</option>
                                <option value="this_month">This Month</option>
                                <option value="last_month">Last Month</option>
                            </select>

                            {(search) && (
                                <button onClick={() => setSearch('')} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.55rem 0.875rem', background: '#fff1f2', border: '1.5px solid #fecaca', borderRadius: '10px', color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                                    <XCircle size={13} /> Clear
                                </button>
                            )}
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f5f3ff', padding: '6px 14px', borderRadius: '8px', color: '#6366f1', fontSize: '0.78rem', fontWeight: 800 }}>
                            <Calendar size={14} strokeWidth={3} /> {periodLabel}
                        </div>
                    </div>
                </div>

                {/* Table Sheet View */}
                <div style={{ ...card, padding: 0 }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1.5px solid #f0eeff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Wallet size={18} color="#6366f1" />
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Validated Payroll Events</h3>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #f0eeff' }}>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Personnel</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Calculated Date</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Validated In/Out</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Total Time</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Late Deficit</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Overtime Credit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendances.data.length > 0 ? attendances.data.map((att, idx) => {
                                    
                                    return (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }} onMouseEnter={e=>e.currentTarget.style.background='#f9f9fb'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338ca', fontWeight: 900, fontSize: '0.85rem', overflow: 'hidden' }}>
                                                        {att.employee.avatar ? <img src={`/storage/${att.employee.avatar}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : att.employee.first_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: '#1e1b4b' }}>{att.employee.first_name} {att.employee.last_name}</p>
                                                        <p style={{ margin: '1px 0 0', fontSize: '0.68rem', color: '#64748b', fontWeight: 600, fontFamily: 'monospace' }}>ID: {att.employee.employee_id}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#444' }}>
                                                    {new Date(att.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                            </td>

                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', background: '#ecfdf5', borderRadius: '6px', border: '1px solid #10b98120', fontWeight: 800, color: '#059669', fontSize: '0.75rem' }}>
                                                        <LogIn size={11} strokeWidth={3} /> {att.clock_in}
                                                    </div>
                                                    <span style={{ color: '#cbd5e1', fontWeight: 900, fontSize: '0.7rem' }}>→</span>
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', background: '#f5f3ff', borderRadius: '6px', border: '1px solid #6366f120', fontWeight: 800, color: '#4f46e5', fontSize: '0.75rem' }}>
                                                        <LogOut size={11} strokeWidth={3} /> {att.clock_out || '--:--'}
                                                    </div>
                                                </div>
                                            </td>

                                            <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                                                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748b' }}>
                                                    {Math.floor(att.total_worked_minutes / 60)}h {att.total_worked_minutes % 60}m
                                                </span>
                                            </td>

                                            <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                                                {att.late_minutes > 0 ? (
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fff1f2', color: '#e11d48', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                                                        <AlertTriangle size={12} /> {att.late_minutes} min late
                                                    </span>
                                                ) : (
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1' }}>0 min</span>
                                                )}
                                            </td>

                                            <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                                                {att.overtime_minutes > 0 ? (
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f0fdf4', color: '#16a34a', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                                                        <DollarSign size={12} /> {att.overtime_minutes} min OK
                                                    </span>
                                                ) : (
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1' }}>0 min</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                                            <Calculator size={32} color="#e2e8f0" style={{ margin: '0 auto 1rem' }} />
                                            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#1e1b4b' }}>No payroll data calculated</p>
                                            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>No attendance logs were matched and validated in this period.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination links={attendances.links} />
            </div>
        </FigmaLayout>
    );
}
