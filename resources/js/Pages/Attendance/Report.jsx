import React from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Calendar,
    Download,
    Users,
    Clock,
    AlertTriangle,
    Filter,
    ArrowRight,
    TrendingUp,
    CheckCircle2,
    CalendarDays
} from 'lucide-react';

const cardStyle = {
    background: '#fff',
    borderRadius: '24px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
    padding: '1.5rem',
    overflow: 'hidden'
};

const selectStyle = {
    width: '100%',
    height: '48px',
    padding: '0 1rem 0 2.75rem',
    borderRadius: '12px',
    border: '1.5px solid #f0eeff',
    background: '#f8fafc',
    fontSize: '0.9rem',
    fontWeight: 700,
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
    color: '#1e1b4b'
};

export default function AttendanceReport({ auth, reportData, filters, months }) {
    const { data, setData, get, processing } = useForm({
        month: filters.month || new Date().getMonth() + 1,
        year: filters.year || new Date().getFullYear(),
    });

    const years = [2024, 2025, 2026];

    const handleFilter = (e) => {
        if (e) e.preventDefault();
        get(route('attendance.report'), { preserveState: true });
    };

    const stats = {
        totalPresent: reportData.reduce((acc, curr) => acc + curr.days_present, 0),
        totalLate: reportData.reduce((acc, curr) => acc + curr.late_count, 0),
        avgHours: reportData.length > 0
            ? (reportData.reduce((acc, curr) => acc + curr.total_hours, 0) / reportData.length).toFixed(1)
            : 0
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Attendance Summary" />

            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 8px 20px rgba(99,102,241,0.2)' }}>
                            <TrendingUp size={28} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.02em' }}>Attendance Summary</h1>
                            <p style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 600, margin: '4px 0 0' }}>A quick look at how everyone is doing this month</p>
                        </div>
                    </div>
                    
                    <button style={{ height: '52px', padding: '0 1.5rem', background: '#fff', border: '1.5px solid #f0eeff', borderRadius: '14px', color: '#6366f1', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={18} />
                        Export PDF
                    </button>
                </div>

                {/* Filters Row */}
                <div style={{ ...cardStyle, padding: '1.25rem' }}>
                    <form onSubmit={handleFilter} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 180px', gap: '1rem' }} className="filter-grid">
                        <div style={{ position: 'relative' }}>
                            <Calendar size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }} />
                            <select value={data.month} onChange={e => setData('month', e.target.value)} style={selectStyle}>
                                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <CalendarDays size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }} />
                            <select value={data.year} onChange={e => setData('year', e.target.value)} style={selectStyle}>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <button type="submit" disabled={processing} style={{ height: '48px', background: '#1e1b4b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer' }}>
                            Update View
                        </button>
                    </form>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="stats-grid">
                    <div style={{ ...cardStyle }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                <CheckCircle2 size={20} />
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', background: '#d1fae5', padding: '4px 10px', borderRadius: '10px' }}>PERFORMANCE</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Days Arrived</p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>{stats.totalPresent} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Total Days</span></h2>
                    </div>

                    <div style={{ ...cardStyle }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48' }}>
                                <AlertTriangle size={20} />
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#e11d48', background: '#ffe4e6', padding: '4px 10px', borderRadius: '10px' }}>PUNCTUALITY</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Late Arrival</p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#e11d48', margin: 0 }}>{stats.totalLate} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Times</span></h2>
                    </div>

                    <div style={{ ...cardStyle, background: '#1e1b4b', color: '#fff', border: 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                <Clock size={20} />
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#fff', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '10px' }}>AVERAGE</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Average Hours Worked</p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', margin: 0 }}>{stats.avgHours} <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>Hours per Person</span></h2>
                    </div>
                </div>

                {/* Table Section */}
                <div style={{ ...cardStyle, padding: 0 }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1.5px solid #f5f3ff', background: '#f9faff' }}>
                                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Member</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Arrived</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Late</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Working Hours</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Work Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((item) => (
                                    <tr key={item.user_id} style={{ borderBottom: '1.5px solid #f9f9fb', transition: 'all 0.2s' }} className="table-row">
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f8fafc', border: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#6366f1', fontSize: '0.75rem' }}>
                                                    {item.employee ? `${item.employee.first_name[0]}${item.employee.last_name?.[0] || ''}` : '??'}
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>{item.employee ? `${item.employee.first_name} ${item.employee.last_name || ''}` : 'Unknown'}</p>
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase' }}>ID: {item.user_id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e1b4b' }}>{item.days_present} Days</span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <span style={{ 
                                                display: 'inline-flex', 
                                                padding: '4px 10px', 
                                                borderRadius: '8px', 
                                                fontSize: '0.75rem', 
                                                fontWeight: 800, 
                                                background: item.late_count > 3 ? '#fff1f2' : '#ecfdf5', 
                                                color: item.late_count > 3 ? '#ef4444' : '#10b981',
                                                border: `1.5px solid ${item.late_count > 3 ? '#ef4444' : '#10b981'}15`
                                            }}>
                                                {item.late_count} Late
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1e1b4b', minWidth: '40px' }}>{item.total_hours}h</span>
                                                <div style={{ flex: 1, height: '6px', background: '#f1f5f9', borderRadius: '3px', position: 'relative', overflow: 'hidden', minWidth: '100px', maxWidth: '150px' }}>
                                                    <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: '#10b981', borderRadius: '3px', width: `${Math.min((item.total_hours / 160) * 100, 100)}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: item.total_hours > 100 ? '#f59e0b' : '#94a3b8' }}>
                                                {item.total_hours > 100 ? '🔥 High' : '⭐ Normal'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {reportData.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }}>
                                            <Calendar size={32} style={{ margin: '0 auto 1rem' }} />
                                            <p style={{ fontWeight: 800 }}>No data for this period</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
                .table-row:hover { background: #fdfcff !important; box-shadow: inset 4px 0 0 #6366f1; }
                @media (max-width: 1000px) {
                    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
                }
                @media (max-width: 800px) {
                    .filter-grid { grid-template-columns: 1fr 1fr !important; }
                }
                @media (max-width: 600px) {
                    .stats-grid { grid-template-columns: 1fr !important; }
                    .filter-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </FigmaLayout>
    );
}
