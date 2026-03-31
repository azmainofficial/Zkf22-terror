import React, { useState, useEffect, useRef } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Search, Calendar, Users, Clock, CheckCircle2,
    XCircle, Activity, LogOut, LogIn, Table, ArrowRight, ClipboardList,
    ChevronLeft, ChevronRight, UserCircle, MapPin, ChevronDown,
    Filter, LayoutGrid, FileSpreadsheet, Layers
} from 'lucide-react';

const STATUS_CONFIG = {
    In:  { label: 'Checked In',  color: '#10b981', bg: '#f0fdf4', icon: LogIn },
    Out: { label: 'Checked Out', color: '#ef4444', bg: '#fef2f2', icon: LogOut },
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

export default function AttendanceIndex({ auth, employees, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [date, setDate] = useState(filters.date || new Date().toISOString().split('T')[0]);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return; }
        const t = setTimeout(() => {
            router.get(route('attendance.index'), { search, date }, { preserveState: true, replace: true, preserveScroll: true });
        }, 500);
        return () => clearTimeout(t);
    }, [search, date]);

    const activeCount = employees.data.filter(e => e.status === 'In').length;
    const presentCount = employees.data.filter(e => e.punches > 0).length;

    const fmt = (n) => new Intl.NumberFormat().format(n);

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Real-time Attendance" />

            <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '4rem' }}>
                
                {/* ── HEADER ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
                            Attendance Hub
                        </h1>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500, margin: '4px 0 0' }}>
                            Live synchronization with Cloud Biometric Terminals
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link href={route('attendance.calendar')}>
                            <button style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
                                background: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', 
                                color: '#475569', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer'
                            }}>
                                <Calendar size={18} /> View Calendar
                            </button>
                        </Link>
                        <Link href={route('attendance.report')}>
                            <button style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
                                background: '#4f46e5', border: 'none', borderRadius: '12px', 
                                color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(79,70,229,0.2)'
                            }}>
                                <FileSpreadsheet size={18} /> Full Report
                            </button>
                        </Link>
                    </div>
                </div>

                {/* ── METRIC STRIP ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <MiniStat label="Present Members" value={presentCount} color="#10b981" icon={CheckCircle2} />
                    <MiniStat label="Currently Active (IN)" value={activeCount} color="#4f46e5" icon={Activity} />
                    <MiniStat label="Absent Members" value={employees.total - presentCount} color="#ef4444" icon={UserCircle} />
                </div>

                {/* ── SEARCH & DATE HUD ── */}
                <div style={{ ...styles.card, padding: '20px', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '1.25rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search by name or biometric ID..."
                                style={filterInput}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Calendar size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="date" value={date} onChange={e => setDate(e.target.value)}
                                style={{ ...filterInput, paddingLeft: '44px' }}
                            />
                        </div>
                    </div>
                </div>

                {/* ── ATTENDANCE LIST ── */}
                <div style={styles.card}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1.5fr) 130px 1.5fr 200px 80px', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <div style={{ paddingLeft: '8px' }}>Team Member</div>
                        <div style={{ textAlign: 'center' }}>Status</div>
                        <div>Daily Logs (IN → OUT)</div>
                        <div style={{ textAlign: 'center' }}>Monthly Performance</div>
                        <div style={{ textAlign: 'right' }}>Logs</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                        {employees.data.length > 0 ? employees.data.map((emp, i) => {
                            const sc = STATUS_CONFIG[emp.punches === 0 ? 'Out' : emp.status] || STATUS_CONFIG.Out;
                            const monthly = emp.monthly_summary;
                            return (
                                <div key={i} className="attendance-row" style={{ 
                                    display: 'grid', gridTemplateColumns: 'minmax(250px, 1.5fr) 130px 1.5fr 200px 80px', 
                                    alignItems: 'center', padding: '16px 8px', borderRadius: '12px',
                                    transition: 'all 0.2s', borderBottom: i === employees.data.length - 1 ? 'none' : '1px solid #f8fafc'
                                }}>
                                    {/* IDENTITY */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, color: '#64748b' }}>
                                            {emp.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{emp.name}</p>
                                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, margin: '2px 0 0' }}>{emp.department || 'HQ'}</p>
                                        </div>
                                    </div>

                                    {/* STATUS */}
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ 
                                            background: sc.bg, color: sc.color, 
                                            fontSize: '0.65rem', fontWeight: 800, 
                                            padding: '4px 10px', borderRadius: '8px',
                                            minWidth: '100px', textAlign: 'center',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                        }}>
                                            <sc.icon size={12} /> {sc.label.toUpperCase()}
                                        </div>
                                    </div>

                                    {/* CLOUD LOGS */}
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        {emp.all_punches?.length > 0 ? emp.all_punches.map((time, idx) => (
                                            <div key={idx} style={{ 
                                                display: 'flex', alignItems: 'center', gap: '4px', 
                                                fontSize: '0.75rem', fontWeight: 800, 
                                                color: idx % 2 === 0 ? '#059669' : '#4f46e5',
                                                background: idx % 2 === 0 ? '#f0fdf4' : '#f5f3ff',
                                                padding: '3px 8px', borderRadius: '6px', border: '1px solid currentColor'
                                            }}>
                                                {idx % 2 === 0 ? <LogIn size={10} /> : <LogOut size={10} />} {time}
                                            </div>
                                        )) : <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700 }}>No logs today</span>}
                                    </div>

                                    {/* MONTHLY SUMMARY */}
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8' }}>PRE</p>
                                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 900, color: '#10b981' }}>{monthly.present}</p>
                                        </div>
                                        <div style={{ textAlign: 'center', borderLeft: '1px solid #f1f5f9', paddingLeft: '8px' }}>
                                            <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8' }}>LATE</p>
                                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 900, color: '#f59e0b' }}>{monthly.late}</p>
                                        </div>
                                        <div style={{ textAlign: 'center', borderLeft: '1px solid #f1f5f9', paddingLeft: '8px' }}>
                                            <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8' }}>ABS</p>
                                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 900, color: '#ef4444' }}>{monthly.absent}</p>
                                        </div>
                                    </div>

                                    {/* TOTAL LOGS */}
                                    <div style={{ textAlign: 'right', fontSize: '1.1rem', fontWeight: 950, color: emp.punches > 0 ? '#0f172a' : '#e2e8f0' }}>
                                        {emp.punches}
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                                <Clock size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#64748b', margin: 0 }}>No attendance records found</h4>
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>Try searching for a different person or date</p>
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
            </div>

            <style>{`
                .attendance-row:hover { background: #f8fafc !important; transform: translateX(4px); }
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

const filterInput = {
    width: '100%', padding: '12px 16px 12px 48px', background: '#f8fafc',
    border: '1px solid #f1f5f9', borderRadius: '12px', fontSize: '0.85rem',
    outline: 'none', fontWeight: 600, color: '#1e293b', appearance: 'none',
    height: '44px'
};
