import React, { useState, useEffect, useRef } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Search, Calendar, Download, Users, Clock, User, CheckCircle2,
    XCircle, Activity, LogOut, LogIn, Table, ArrowRight, ClipboardList
} from 'lucide-react';

const card = {
    background: '#fff', borderRadius: '16px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
};
const onFocus = e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; };
const onBlur  = e => { e.target.style.borderColor = '#ede9fe'; e.target.style.boxShadow = 'none'; };

const badgeStyle = (status) => {
    const s = {
        Out: { bg: '#f5f3ff', color: '#6366f1', label: 'Checked Out', icon: LogOut },
        In: { bg: '#ecfdf5', color: '#10b981', label: 'Checked In', icon: LogIn },
    }[status] || { bg: '#f3f4f6', color: '#6b7280', label: 'Missing', icon: LogOut };
    
    return {
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '5px 12px', borderRadius: '20px', fontSize: '0.7rem',
        fontWeight: 800, background: s.bg, color: s.color,
        textTransform: 'uppercase', letterSpacing: '0.04em',
        border: `1.5px solid ${s.color}15`, label: s.label, Icon: s.icon
    };
};

export default function AttendanceIndex({ auth, employees, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [date, setDate] = useState(filters.date || new Date().toISOString().split('T')[0]);

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const t = setTimeout(() => {
            router.get(route('attendance.index'), { search, date }, { preserveState: true, replace: true, preserveScroll: true });
        }, 500);
        return () => clearTimeout(t);
    }, [search, date]);

    const activeCount = employees.data.filter(e => e.status === 'In').length;
    const presentCount = employees.data.filter(e => e.punches > 0).length;

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
            <Head title="Live Attendance" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto', paddingBottom: '3rem' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '3px' }}>
                            <Clock size={16} color="#a78bfa" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Daily Roster</span>
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Live Attendance Record</h1>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '3px 0 0' }}>Monitor daily entries, exits, and active presence directly from ZKTeco logs</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                        <Link href={route('attendance.calendar')}>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1.125rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
                                <Calendar size={15} /> Attendance Calendar
                            </button>
                        </Link>
                        <Link href={route('employees.index', { view: 'attendance' })}>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1.125rem', background: '#fff', border: '1.5px solid #ede9fe', borderRadius: '12px', color: '#6366f1', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 1px 6px rgba(99,102,241,0.07)' }}>
                                <ClipboardList size={15} /> View Manual Fixes
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div style={{ ...card, padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                            <Search size={14} color="#a78bfa" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search by name, ID..."
                                style={{ width: '100%', boxSizing: 'border-box', padding: '0.55rem 1rem 0.55rem 2rem', background: '#f9f7ff', border: '1.5px solid #ede9fe', borderRadius: '10px', fontSize: '0.82rem', color: '#1e1b4b', outline: 'none', fontFamily: 'inherit' }}
                                onFocus={onFocus} onBlur={onBlur}
                            />
                        </div>

                        <input type="date" value={date} onChange={e => setDate(e.target.value)}
                            style={{ ...selectStyle, padding: '0.55rem 0.875rem' }}
                            onFocus={onFocus} onBlur={onBlur}
                        />

                        {(search) && (
                            <button onClick={() => setSearch('')} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.55rem 0.875rem', background: '#fff1f2', border: '1.5px solid #fecaca', borderRadius: '10px', color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                                <XCircle size={13} /> Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '1rem' }}>
                    <div style={{ ...card, padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <CheckCircle2 size={20} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>Present Today</p>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b', margin: 0, lineHeight: 1.2 }}>{presentCount}</h3>
                        </div>
                    </div>
                    
                    <div style={{ ...card, padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Activity size={20} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>Currently Active (IN)</p>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b', margin: 0, lineHeight: 1.2 }}>{activeCount}</h3>
                        </div>
                    </div>
                </div>

                {/* Table Sheet View */}
                <div style={{ ...card, padding: 0 }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1.5px solid #f0eeff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Table size={18} color="#6366f1" />
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Checksheet Matrix</h3>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #f0eeff' }}>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Personnel</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Status</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Punch Timeline (IN → OUT)</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Total Punches</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.data.length > 0 ? employees.data.map((employee, idx) => {
                                    const StatusBadge = badgeStyle(employee.punches === 0 ? 'Out' : employee.status);
                                    
                                    return (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }} onMouseEnter={e=>e.currentTarget.style.background='#f9f9fb'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338ca', fontWeight: 900, fontSize: '0.85rem' }}>
                                                        {employee.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: '#1e1b4b' }}>{employee.name}</p>
                                                        <p style={{ margin: '1px 0 0', fontSize: '0.68rem', color: '#64748b', fontWeight: 600, fontFamily: 'monospace' }}>ID: {employee.employee_id || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                {employee.punches > 0 ? (
                                                    <div style={StatusBadge}>
                                                        <StatusBadge.Icon size={12} /> {StatusBadge.label}
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#cbd5e1' }}>Absent / No Data</span>
                                                )}
                                            </td>

                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                                    {employee.all_punches?.length > 0 ? employee.all_punches.map((time, i) => {
                                                        const isEntry = i % 2 === 0;
                                                        return (
                                                            <React.Fragment key={i}>
                                                                {i > 0 && <span style={{ color: '#cbd5e1', fontWeight: 900, fontSize: '0.7rem' }}>→</span>}
                                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', background: isEntry ? '#ecfdf5' : '#f5f3ff', borderRadius: '6px', border: `1px solid ${isEntry ? '#10b98120' : '#6366f120'}`, fontWeight: 800, color: isEntry ? '#059669' : '#4f46e5', fontSize: '0.75rem' }}>
                                                                    {isEntry ? <LogIn size={11} strokeWidth={3} /> : <LogOut size={11} strokeWidth={3} />} {time}
                                                                </div>
                                                            </React.Fragment>
                                                        );
                                                    }) : <span style={{ color: '#cbd5e1', fontWeight: 800, fontSize: '0.75rem' }}>No Punches Logged</span>}
                                                </div>
                                            </td>

                                            <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 900, color: employee.punches > 0 ? '#1e1b4b' : '#cbd5e1' }}>
                                                    {employee.punches}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                                            <Users size={32} color="#e2e8f0" style={{ margin: '0 auto 1rem' }} />
                                            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#1e1b4b' }}>No data located</p>
                                            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>No attendance logs were matched on this specific date or search filter.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination links={employees.links} />
            </div>
        </FigmaLayout>
    );
}
