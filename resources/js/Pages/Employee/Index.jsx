import React, { useState, useEffect, useRef } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus, Search, User, Mail, Building2,
    Pencil, Trash2, History, MoreVertical,
    CheckCircle2, XCircle, Clock, ChevronDown,
    Filter, Briefcase, Activity, ShieldCheck,
    ChevronRight, MapPin, Phone, GraduationCap, Layers, Eye
} from 'lucide-react';

const STATUS_CONFIG = {
    active:   { label: 'Available', color: '#10b981', bg: '#f0fdf4', icon: CheckCircle2 },
    inactive: { label: 'Off-duty',  color: '#64748b', bg: '#f1f5f9', icon: XCircle },
    on_leave: { label: 'On Leave',  color: '#3b82f6', bg: '#eff6ff', icon: Clock },
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

export default function Index({ auth, employees, attendances, filters, departments }) {
    const [search, setSearch] = useState(filters.search || '');
    const [department, setDepartment] = useState(filters.department || 'All');
    const [status, setStatus] = useState(filters.status || 'All');
    const [view, setView] = useState(filters.view || 'directory');

    useEffect(() => {
        const t = setTimeout(() => {
            router.get(route('employees.index'), { search, department, status, view }, { preserveState: true, replace: true, preserveScroll: true });
        }, 500);
        return () => clearTimeout(t);
    }, [search, department, status, view]);

    const handleDelete = id => {
        if (confirm('Are you sure you want to remove this member from the organization?')) {
            router.delete(route('employees.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Team Hub" />

            <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '4rem' }}>
                
                {/* ── HEADER ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
                            Our Team
                        </h1>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500, margin: '4px 0 0' }}>
                            Working with {employees.total} professional members across all departments
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ display: 'flex', background: '#f8fafc', padding: '6px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                            <button onClick={() => setView('directory')} style={viewBtn(view === 'directory')}>Team List</button>
                            <button onClick={() => setView('attendance')} style={viewBtn(view === 'attendance')}>Log History</button>
                        </div>
                        <Link href={route('employees.create')}>
                            <button style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
                                background: '#4f46e5', border: 'none', borderRadius: '12px', 
                                color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(79,70,229,0.2)'
                            }}>
                                <Plus size={18} /> Add Member
                            </button>
                        </Link>
                    </div>
                </div>

                {/* ── STATS SUMMARY ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <MiniStat label="Total Network" value={employees.total} color="#4f46e5" icon={User} />
                    <MiniStat label="Currently Available" value={employees.data.filter(e => e.status === 'active').length} color="#10b981" icon={ShieldCheck} />
                    <MiniStat label="Active Departments" value={departments.length} color="#f59e0b" icon={Layers} />
                </div>

                {view === 'directory' ? (
                    <>
                        {/* ── FILTER HUD ── */}
                        <div style={{ ...styles.card, padding: '24px', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '1rem' }}>
                                <div style={{ position: 'relative' }}>
                                    <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="text" value={search} onChange={e => setSearch(e.target.value)}
                                        placeholder="Search by name, role or email..."
                                        style={filterInput}
                                    />
                                </div>
                                <SelectWrapper icon={Building2} val={department} setVal={setDepartment} placeholder="All Departments" options={departments.map(d => ({ id: d, name: d }))} />
                                <div style={{ position: 'relative' }}>
                                    <Activity size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <select value={status} onChange={e => setStatus(e.target.value)} style={{ ...filterInput, paddingLeft: '44px' }}>
                                        <option value="All">All Status</option>
                                        <option value="active">Available</option>
                                        <option value="inactive">Off-duty</option>
                                        <option value="on_leave">On Leave</option>
                                    </select>
                                    <ChevronDown size={14} color="#94a3b8" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                </div>
                            </div>
                        </div>

                        {/* ── MEMBER LIST ── */}
                        <div style={styles.card}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1.5fr) 1fr 1fr 140px 100px', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <div style={{ paddingLeft: '8px' }}>Official Member</div>
                                <div>Department Node</div>
                                <div>Primary Contact</div>
                                <div style={{ textAlign: 'center' }}>Work Status</div>
                                <div></div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                                {employees.data.length > 0 ? employees.data.map((emp, i) => {
                                    const sc = STATUS_CONFIG[emp.status] || STATUS_CONFIG.inactive;
                                    return (
                                        <div key={emp.id} className="team-row" style={{ 
                                            display: 'grid', gridTemplateColumns: 'minmax(280px, 1.5fr) 1fr 1fr 140px 100px', 
                                            alignItems: 'center', padding: '16px 8px', borderRadius: '12px',
                                            transition: 'all 0.2s', borderBottom: i === employees.data.length - 1 ? 'none' : '1px solid #f8fafc'
                                        }}>
                                            {/* IDENTITY */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#f3f4f6', border: '1px solid #f1f5f9', overflow: 'hidden', flexShrink: 0 }}>
                                                    {emp.avatar ? (
                                                        <img src={`/storage/${emp.avatar}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={24} color="#94a3b8" /></div>}
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{emp.first_name} {emp.last_name}</p>
                                                    <p style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 700, margin: '2px 0 0' }}>{emp.designation || 'Staff Member'}</p>
                                                </div>
                                            </div>

                                            {/* DEPARTMENT */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Building2 size={16} color="#64748b" />
                                                </div>
                                                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1e293b' }}>{emp.department || 'Not Assigned'}</span>
                                            </div>

                                            {/* CONTACT */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Mail size={14} color="#94a3b8" />
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>{emp.email}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Phone size={14} color="#94a3b8" />
                                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{emp.phone || 'No phone'}</span>
                                                </div>
                                            </div>

                                            {/* STATUS */}
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <span style={{ 
                                                    background: sc.bg, color: sc.color, 
                                                    fontSize: '0.7rem', fontWeight: 800, 
                                                    padding: '6px 12px', borderRadius: '10px',
                                                    minWidth: '100px', textAlign: 'center'
                                                }}>
                                                    {sc.label.toUpperCase()}
                                                </span>
                                            </div>

                                            {/* ACTIONS */}
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <Link href={route('employees.show', emp.id)}>
                                                    <button style={styles.actionBtn('#f1f5f9', '#64748b')} title="View Profile"><Eye size={16} /></button>
                                                </Link>
                                                <Link href={route('employees.edit', emp.id)}>
                                                    <button style={styles.actionBtn('#f0fdf4', '#10b981')} title="Edit Info"><Pencil size={16} /></button>
                                                </Link>
                                                <button onClick={() => handleDelete(emp.id)} style={styles.actionBtn('#fef2f2', '#ef4444')} title="Remove Member"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                                        <User size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#64748b', margin: 0 }}>No team members found</h4>
                                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>Try adjusting your search or department filters</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── PAGINATION ── */}
                        {employees.links && employees.links.length > 3 && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
                                <div style={{ display: 'flex', background: '#fff', padding: '6px', borderRadius: '14px', border: '1px solid #f1f5f9', gap: '4px' }}>
                                    {employees.links.map((link, i) => (
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
                    </>
                ) : (
                    <div style={styles.card}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                            <History size={20} color="#4f46e5" />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Attendance Logs</h3>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1.5px solid #f8fafc' }}>
                                        <th style={{ padding: '16px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Member</th>
                                        <th style={{ padding: '16px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Check-in</th>
                                        <th style={{ padding: '16px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Device Info</th>
                                        <th style={{ padding: '16px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'center' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendances?.data?.map(att => (
                                        <tr key={att.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#111827' }}>
                                                        {att.employee?.first_name?.[0]}{att.employee?.last_name?.[0]}
                                                    </div>
                                                    <div>
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>{att.employee?.first_name} {att.employee?.last_name}</span>
                                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>ID: {att.employee?.employee_id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px', fontSize: '0.9rem', color: '#1e293b', fontWeight: 700 }}>{att.timestamp}</td>
                                            <td style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Terminal Node #{att.zkteco_device_id}</td>
                                            <td style={{ padding: '16px', textAlign: 'center' }}>
                                                <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    <CheckCircle2 size={12} /> Verified
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .team-row:hover { background: #f8fafc !important; transform: translateX(4px); }
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
                <option value="All">{placeholder}</option>
                {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
            <ChevronDown size={14} color="#94a3b8" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>
    );
}

const filterInput = {
    width: '100%', padding: '12px 16px 12px 44px', background: '#f8fafc',
    border: '1px solid #f1f5f9', borderRadius: '12px', fontSize: '0.85rem',
    outline: 'none', fontWeight: 600, color: '#1e293b', appearance: 'none',
    height: '44px'
};

const viewBtn = (active) => ({
    border: 'none', padding: '10px 20px', borderRadius: '12px', 
    fontSize: '0.85rem', fontWeight: 800, 
    background: active ? '#fff' : 'transparent', 
    color: active ? '#111827' : '#64748b', 
    cursor: 'pointer', transition: 'all 0.2s', 
    boxShadow: active ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
});
