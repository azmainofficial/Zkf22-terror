import React, { useState, useEffect, useRef } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus, Search, Users, User, Mail, Phone, Building2,
    Pencil, Trash2, Eye, X, Briefcase, ChevronRight, CheckCircle2,
    XCircle, Clock, AlertCircle, FileSpreadsheet,
    Smartphone, History, ClipboardList
} from 'lucide-react';

// ─── Status config ─────────────────────────────────────────────
const STATUS = {
    active:   { label: 'Active',   bg: '#f0fdf4', color: '#16a34a' },
    inactive: { label: 'Inactive', bg: '#f3f4f6', color: '#6b7280' },
    on_leave: { label: 'On Leave', bg: '#eff6ff', color: '#3b82f6' },
};
function getStatus(s) { return STATUS[(s||'').toLowerCase()] || STATUS.inactive; }

const ATT_STATUS = {
    present:  { label: 'Present',  bg: '#f0fdf4', color: '#16a34a', icon: CheckCircle2 },
    absent:   { label: 'Absent',   bg: '#fff1f2', color: '#e11d48', icon: XCircle },
    late:     { label: 'Late In',  bg: '#fffbeb', color: '#d97706', icon: Clock },
    on_leave: { label: 'On Leave', bg: '#eff6ff', color: '#3b82f6', icon: AlertCircle },
};
function getAttStatus(s) { return ATT_STATUS[(s||'').toLowerCase()] || ATT_STATUS.absent; }

// ─── Shared styles ─────────────────────────────────────────────
const card = {
    background: '#fff', borderRadius: '16px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
};
const onFocus = e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; };
const onBlur  = e => { e.target.style.borderColor = '#ede9fe'; e.target.style.boxShadow = 'none'; };

export default function Index({ auth, employees, attendances, filters, departments }) {
    const [search,    setSearch]    = useState(filters.search    || '');
    const [department,setDepartment]= useState(filters.department|| 'All');
    const [status,    setStatus]    = useState(filters.status    || 'All');
    const [view,      setView]      = useState(filters.view      || 'directory');

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const t = setTimeout(() => {
            router.get(route('employees.index'), { search, department, status, view }, { preserveState: true, replace: true, preserveScroll: true });
        }, 500);
        return () => clearTimeout(t);
    }, [search, department, status, view]);

    const clearFilters = () => { setSearch(''); setDepartment('All'); setStatus('All'); };
    const hasFilters = search || department !== 'All' || status !== 'All';

    const handleDelete = id => {
        if (confirm('Are you strictly sure you want to permanently delete this employee?')) {
            router.delete(route('employees.destroy', id), { preserveScroll: true });
        }
    };

    const selectStyle = {
        padding: '0.55rem 0.875rem', background: '#f9f7ff',
        border: '1.5px solid #ede9fe', borderRadius: '10px',
        fontSize: '0.82rem', color: '#4338ca', fontWeight: 600,
        outline: 'none', cursor: 'pointer', appearance: 'none',
        fontFamily: 'inherit',
    };

    const iconBtn = (bg, color) => ({
        width: '30px', height: '30px', borderRadius: '8px',
        background: bg, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color,
    });

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
            <Head title="Team Directory" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto', paddingBottom: '3rem' }}>

                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '3px' }}>
                            <Users size={16} color="#a78bfa" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>HR & Team</span>
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Team & Employees</h1>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '3px 0 0' }}>Manage all your personnel, roles, and attendance logs</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', padding: '3px', background: '#f5f3ff', borderRadius: '14px', marginRight: '10px' }}>
                            <button onClick={() => setView('directory')}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.55rem 1rem', borderRadius: '10px', border: 'none', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', background: view === 'directory' ? '#fff' : 'transparent', color: view === 'directory' ? '#6366f1' : '#9ca3af', boxShadow: view === 'directory' ? '0 1px 6px rgba(99,102,241,0.1)' : 'none', transition: 'all 0.2s' }}>
                                <Users size={14} /> Directory
                            </button>
                            <button onClick={() => setView('attendance')}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.55rem 1rem', borderRadius: '10px', border: 'none', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', background: view === 'attendance' ? '#fff' : 'transparent', color: view === 'attendance' ? '#6366f1' : '#9ca3af', boxShadow: view === 'attendance' ? '0 1px 6px rgba(99,102,241,0.1)' : 'none', transition: 'all 0.2s' }}>
                                <History size={14} /> Raw Logs
                            </button>
                        </div>
                        
                        <a href={route('employees.index')} style={{ textDecoration: 'none' }}>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1.125rem', background: '#fff', border: '1.5px solid #ede9fe', borderRadius: '12px', color: '#6366f1', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 1px 6px rgba(99,102,241,0.07)' }}>
                                <FileSpreadsheet size={15} /> Export Staff
                            </button>
                        </a>
                        <Link href={route('employees.create')}>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
                                <Plus size={16} strokeWidth={2.5} /> Enroll Staff
                            </button>
                        </Link>
                    </div>
                </div>

                {/* ── Directory View ── */}
                {view === 'directory' && (
                    <>
                        {/* ── Filters ── */}
                        <div style={{ ...card, padding: '1rem 1.25rem' }}>
                            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                                    <Search size={14} color="#a78bfa" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                        placeholder="Search by name, ID, email..."
                                        style={{ width: '100%', boxSizing: 'border-box', padding: '0.55rem 1rem 0.55rem 2rem', background: '#f9f7ff', border: '1.5px solid #ede9fe', borderRadius: '10px', fontSize: '0.82rem', color: '#1e1b4b', outline: 'none', fontFamily: 'inherit' }}
                                        onFocus={onFocus} onBlur={onBlur}
                                    />
                                </div>
                                <select value={status} onChange={e => setStatus(e.target.value)} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                                    <option value="All">All Statuses</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="on_leave">On Leave</option>
                                </select>
                                <select value={department} onChange={e => setDepartment(e.target.value)} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                                    <option value="All">All Divisions</option>
                                    {departments.map((d, i) => <option key={i} value={d}>{d}</option>)}
                                </select>
                                {hasFilters && (
                                    <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.55rem 0.875rem', background: '#fff1f2', border: '1.5px solid #fecaca', borderRadius: '10px', color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                                        <X size={13} /> Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* ── Staff List ── */}
                        {employees.data.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                                {employees.data.map(emp => {
                                    const cfg = getStatus(emp.status);
                                    return (
                                        <div key={emp.id} style={{
                                            ...card, padding: '1rem 1.25rem',
                                            display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
                                            transition: 'box-shadow 0.15s, transform 0.15s',
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 22px rgba(99,102,241,0.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                        >
                                            {/* Avatar */}
                                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                                                {emp.avatar ? (
                                                    <img src={`/storage/${emp.avatar}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : <User size={20} color="#8b5cf6" />}
                                            </div>

                                            {/* Name / Desc */}
                                            <div style={{ flex: 2, minWidth: '150px' }}>
                                                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e1b4b', margin: 0 }}>{emp.first_name} {emp.last_name}</p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '3px', flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', background: '#f3f4f6', color: '#6b7280', padding: '1px 6px', borderRadius: '5px', fontWeight: 800 }}>{emp.employee_id}</span>
                                                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#7c3aed', background: '#f5f3ff', padding: '2px 8px', borderRadius: '10px' }}>{emp.designation || 'Staff'}</span>
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.7rem', fontWeight: 800, color: cfg.color, background: cfg.bg, padding: '3px 10px', borderRadius: '20px', flexShrink: 0 }}>
                                                {cfg.label}
                                            </span>

                                            {/* Contact details */}
                                            <div style={{ minWidth: '140px' }}>
                                                <p style={{ fontSize: '0.68rem', color: '#9ca3af', margin: '0 0 2px', display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={10} /> Email</p>
                                                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.email}</p>
                                            </div>
                                            
                                            {/* Division / Dept */}
                                            <div style={{ minWidth: '120px' }}>
                                                <p style={{ fontSize: '0.68rem', color: '#9ca3af', margin: '0 0 2px', display: 'flex', alignItems: 'center', gap: '4px' }}><Building2 size={10} /> Division</p>
                                                <p style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4338ca', margin: 0 }}>{emp.department || 'HQ'}</p>
                                            </div>

                                            {/* Actions */}
                                            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                                                <Link href={route('employees.show', emp.id)}>
                                                    <button title="View Profile" style={iconBtn('#f5f3ff', '#6366f1')}><Eye size={14} /></button>
                                                </Link>
                                                <Link href={route('employees.edit', emp.id)}>
                                                    <button title="Edit Attributes" style={iconBtn('#f0fdf4', '#16a34a')}><Pencil size={14} /></button>
                                                </Link>
                                                <button title="Delete Record" style={iconBtn('#fff1f2', '#ef4444')} onClick={() => handleDelete(emp.id)}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                                <Pagination links={employees.links} />
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem 1rem', border: '2px dashed #ede9fe', borderRadius: '18px', background: '#fff' }}>
                                <Users size={40} color="#e0d9ff" style={{ margin: '0 auto 1rem' }} />
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1b4b', margin: '0 0 0.4rem' }}>No staff members aligned</h3>
                                <p style={{ fontSize: '0.82rem', color: '#9ca3af', margin: '0 0 1.5rem', fontWeight: 500 }}>
                                    {hasFilters ? 'Try adjusting your search query or filters.' : 'Your team is empty. Start by adding your first personnel record.'}
                                </p>
                                <Link href={route('employees.create')}>
                                    <button style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.625rem 1.25rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                                        <Plus size={15} /> Enroll First Member
                                    </button>
                                </Link>
                            </div>
                        )}
                    </>
                )}

                {/* ── Attendance View ── */}
                {view === 'attendance' && (
                    <div style={{ ...card, padding: 0 }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1.5px solid #f0eeff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ClipboardList size={18} color="#6366f1" />
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Raw Device Logs</h3>
                        </div>
                        
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f0eeff' }}>
                                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Personnel</th>
                                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Exact Timestamp</th>
                                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Device Sensor Name</th>
                                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Punch Logic State</th>
                                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Raw Dump</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendances?.data?.map(att => {
                                        return (
                                            <tr key={att.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.15s' }} onMouseEnter={e=>e.currentTarget.style.background='#f9f9fb'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                                                <td style={{ padding: '1rem 1.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#f5f3ff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                            {att.employee?.avatar ? <img src={`/storage/${att.employee.avatar}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={14} color="#8b5cf6" />}
                                                        </div>
                                                        <div>
                                                            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e1b4b', margin: 0 }}>{att.employee?.first_name} {att.employee?.last_name || 'Unregistered User'}</p>
                                                            <p style={{ fontSize: '0.65rem', color: '#9ca3af', margin: 0, fontFamily: 'monospace' }}>Device ID Log: {att.user_id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 800, color: '#6366f1' }}>
                                                    {att.timestamp}
                                                </td>
                                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>
                                                    Machine {att.zkteco_device_id || 'Unknown'}
                                                </td>
                                                <td style={{ padding: '1rem 1.5rem' }}>
                                                    <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}>
                                                        State {att.state}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>
                                                    {att.raw_data}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {(!attendances?.data || attendances.data.length === 0) && (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '4rem', textAlign: 'center' }}>
                                                <ClipboardList size={32} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
                                                <p style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#1e1b4b' }}>No Biometric Logs</p>
                                                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#9ca3af' }}>The ZKTeco devices have not pushed any attendance pings yet.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {attendances?.links && <Pagination links={attendances.links} />}
                    </div>
                )}

            </div>
        </FigmaLayout>
    );
}
