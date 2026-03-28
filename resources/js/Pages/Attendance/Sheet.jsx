import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Calendar,
    Clock,
    User,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Fingerprint,
    Zap,
    RefreshCw,
    LogOut,
    LogIn,
    Activity,
    Monitor
} from 'lucide-react';

const cardStyle = {
    background: '#fff',
    borderRadius: '24px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
    padding: '1.5rem',
    overflow: 'hidden'
};

const badgeStyle = (status) => {
    const styles = {
        in: { bg: '#ecfdf5', color: '#10b981', label: 'Currently In' },
        out: { bg: '#f8fafc', color: '#64748b', label: 'Left Office' },
        absent: { bg: '#fff1f2', color: '#ef4444', label: 'Not Arrived' },
    };
    const s = styles[status];
    return {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '0.7rem',
        fontWeight: 800,
        background: s.bg,
        color: s.color,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        border: `1.5px solid ${s.color}15`,
        label: s.label
    };
};

export default function AttendanceSheet({ auth, sheetData, filters }) {
    const [isLiveMode, setIsLiveMode] = useState(false);
    const { data, setData, get, processing } = useForm({
        date: filters.date || new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        let interval;
        if (isLiveMode) {
            interval = setInterval(() => {
                router.reload({ only: ['sheetData'], preserveScroll: true });
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isLiveMode]);

    const handleFilter = (e) => {
        if (e) e.preventDefault();
        get(route('attendance.sheet'), { preserveState: true });
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Daily Attendance" />

            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 8px 20px rgba(16,185,129,0.2)' }}>
                            <Activity size={28} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.02em' }}>Daily Attendance</h1>
                            <p style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 600, margin: '4px 0 0' }}>Who's in today: <span style={{ color: '#6366f1' }}>{new Date(data.date).toLocaleDateString([], { dateStyle: 'long' })}</span></p>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                            onClick={() => setIsLiveMode(!isLiveMode)}
                            style={{ 
                                height: '52px', 
                                padding: '0 1.25rem', 
                                background: isLiveMode ? '#ecfdf5' : '#fff', 
                                border: `1.5px solid ${isLiveMode ? '#10b981' : '#f0eeff'}`, 
                                borderRadius: '14px', 
                                color: isLiveMode ? '#10b981' : '#94a3b8', 
                                fontSize: '0.85rem', 
                                fontWeight: 800, 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Zap size={18} className={isLiveMode ? 'animate-pulse' : ''} />
                            {isLiveMode ? 'LIVE TRACKING' : 'WATCH LIVE'}
                        </button>
                        <div style={{ position: 'relative' }}>
                            <Calendar size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }} />
                            <input 
                                type="date" 
                                value={data.date} 
                                onChange={e => setData('date', e.target.value)}
                                style={{ height: '52px', padding: '0 1rem 0 3.25rem', borderRadius: '14px', border: '1.5px solid #f0eeff', background: '#fff', fontSize: '0.9rem', fontWeight: 700, color: '#1e1b4b', cursor: 'pointer', outline: 'none' }}
                            />
                        </div>
                        <button onClick={() => handleFilter()} style={{ height: '52px', padding: '0 1.5rem', background: '#1e1b4b', border: 'none', borderRadius: '14px', color: '#fff', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <RefreshCw size={18} className={processing ? 'animate-spin' : ''} />
                            Update
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div style={{ ...cardStyle, padding: 0 }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1.5px solid #f5f3ff', background: '#f9faff' }}>
                                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Member</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Arrivals & Departures</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hours Worked</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sheetData.map((item) => {
                                    const status = item.punches.length === 0 ? 'absent' : (item.punches.length % 2 !== 0 ? 'in' : 'out');
                                    const b = badgeStyle(status);
                                    return (
                                        <tr key={item.employee.id} style={{ borderBottom: '1.5px solid #f9f9fb', transition: 'all 0.2s' }} className="table-row">
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#f5f3ff', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#6366f1', fontSize: '0.8rem', overflow: 'hidden', boxShadow: '0 4px 12px rgba(99,102,241,0.08)' }}>
                                                        {item.employee.avatar ? (
                                                            <img src={`/storage/${item.employee.avatar}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <User size={20} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>{item.employee.first_name} {item.employee.last_name}</p>
                                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Emp ID: {item.employee.employee_id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                                                    {item.punches.length > 0 ? (
                                                        item.punches.map((time, idx) => (
                                                            <React.Fragment key={idx}>
                                                                <div style={{ 
                                                                    padding: '4px 10px', 
                                                                    borderRadius: '8px', 
                                                                    fontSize: '0.75rem', 
                                                                    fontWeight: 800, 
                                                                    background: idx % 2 === 0 ? '#ecfdf5' : '#f5f3ff', 
                                                                    color: idx % 2 === 0 ? '#10b981' : '#6366f1',
                                                                    border: `1px solid ${idx % 2 === 0 ? '#10b981' : '#6366f1'}20`,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px'
                                                                }}>
                                                                    {idx % 2 === 0 ? <LogIn size={10} /> : <LogOut size={10} />}
                                                                    {time.substring(0, 5)}
                                                                </div>
                                                                {idx < item.punches.length - 1 && <div style={{ width: '8px', height: '1px', background: '#e2e8f0' }} />}
                                                            </React.Fragment>
                                                        ))
                                                    ) : (
                                                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1' }}>No activities today</span>
                                                    )}
                                                    {status === 'in' && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '8px', padding: '4px 8px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fef3c7' }}>
                                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', animation: 'pulse 2s infinite' }}></div>
                                                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>Active</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                {item.total_hours > 0 ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Clock size={14} color="#6366f1" />
                                                        <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1e1b4b' }}>{item.total_hours} <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>Hours</span></span>
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1' }}>0.0 Hours</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '6px 14px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 800,
                                                    background: b.background,
                                                    color: b.color,
                                                    textTransform: 'uppercase',
                                                    border: b.border
                                                }}>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: b.color }}></div>
                                                    {b.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Info */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem', padding: '0 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>Arrival Log</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }}></div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>Departure Log</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', animation: 'pulse 2s infinite' }}></div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>Currently Working</span>
                    </div>
                </div>
            </div>

            <style>{`
                .table-row:hover { background: #fdfcff !important; box-shadow: inset 4px 0 0 #6366f1; }
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
                }
            `}</style>
        </FigmaLayout>
    );
}
