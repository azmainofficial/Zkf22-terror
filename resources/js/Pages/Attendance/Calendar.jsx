import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar as CalendarIcon, Users, Clock, ArrowRight,
    AlertTriangle, Briefcase, Activity, CheckCircle2, ChevronLeft, ChevronRight,
    LogIn, LogOut, Coffee, MapPin, Fingerprint, ChevronDown, Filter,
    LayoutGrid, FileSpreadsheet, Layers, User, Award, ShieldCheck
} from 'lucide-react';

const COLORS = {
    primary: '#4f46e5',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    neutral: '#64748b'
};

const styles = {
    card: {
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #f1f5f9',
        padding: '24px',
        transition: 'all 0.2s ease',
    },
    dayCell: (isHoliday, isLeave, isToday) => ({
        minHeight: '140px',
        background: isHoliday ? '#fef2f2' : (isLeave ? '#f0fdf4' : (isToday ? '#f8fafc' : '#fff')),
        border: isToday ? `2px solid ${COLORS.primary}` : '1.5px solid #f8fafc',
        borderRadius: '16px',
        padding: '12px',
        display: 'flex', flexDirection: 'column',
        transition: 'all 0.2s ease',
        position: 'relative',
        cursor: 'default'
    })
};

export default function AttendanceCalendar({ auth, attendances = {}, leaves = [], holidays = [], employees, currentEmployeeId, monthStr, filters }) {
    const [selectedMonth, setSelectedMonth] = useState(filters.month || new Date().toISOString().slice(0, 7));
    const [selectedEmployee, setSelectedEmployee] = useState(filters.employee_id || currentEmployeeId || '');

    useEffect(() => {
        const t = setTimeout(() => {
            router.get(route('attendance.calendar'), { month: selectedMonth, employee_id: selectedEmployee }, { preserveState: true, replace: true, preserveScroll: true });
        }, 300);
        return () => clearTimeout(t);
    }, [selectedMonth, selectedEmployee]);

    // Calendar logic
    const year = parseInt(selectedMonth.split('-')[0]);
    const monthIndex = parseInt(selectedMonth.split('-')[1]) - 1;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
    const monthName = new Date(year, monthIndex).toLocaleString('default', { month: 'long' });

    const getHolidaysForDate = (dateStr) => {
        const date = new Date(dateStr);
        const dow = date.getDay();
        return holidays.filter(h => (h.is_recurring_weekly && h.day_of_week == dow) || (!h.is_recurring_weekly && h.date === dateStr));
    };

    const getLeaveForDate = (dateStr) => leaves.find(l => l.start_date <= dateStr && l.end_date >= dateStr);

    const attList = Object.values(attendances);
    const totalPresentDays = attList.filter(a => a.status === 'present' || a.status === 'late').length;
    const totalLateDays = attList.filter(a => a.status === 'late').length;
    const totalAbsentDays = attList.filter(a => a.status === 'absent').length;
    const totalWorkMinutes = attList.reduce((acc, a) => acc + (a.total_worked_minutes || 0), 0);
    const totalHours = Math.floor(totalWorkMinutes / 60);

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Attendance Calendar" />

            <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '4rem' }}>
                
                {/* ── HEADER ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
                            Visual Timesheet
                        </h1>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500, margin: '4px 0 0' }}>
                            Audit for {monthName} {year}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link href={route('attendance.index')}>
                            <button style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
                                background: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', 
                                color: '#475569', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer'
                            }}>
                                <Clock size={18} /> Daily Roster
                            </button>
                        </Link>
                    </div>
                </div>

                {/* ── SELECTOR HUB ── */}
                <div style={{ ...styles.card, padding: '20px', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.5fr) 240px', gap: '1.25rem' }}>
                        <div style={{ position: 'relative' }}>
                            <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <select 
                                value={selectedEmployee} 
                                onChange={e => setSelectedEmployee(e.target.value)}
                                style={filterInput}
                            >
                                <option value="">Select Team Member</option>
                                {employees.map(e => <option key={e.id} value={e.id}>{e.name} (#{e.employee_id})</option>)}
                            </select>
                            <ChevronDown size={14} color="#94a3b8" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <CalendarIcon size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input 
                                type="month" 
                                value={selectedMonth} 
                                onChange={e => setSelectedMonth(e.target.value)}
                                style={{ ...filterInput, paddingLeft: '44px' }}
                            />
                        </div>
                    </div>
                </div>

                {selectedEmployee ? (
                    <>
                        {/* ── STATS SUMMARY ── */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
                            <MiniStat label="Month Duration" value={`${totalHours}h ${totalWorkMinutes % 60}m`} color="#4f46e5" icon={Clock} />
                            <MiniStat label="Total Present" value={`${totalPresentDays} Days`} color="#10b981" icon={ShieldCheck} />
                            <MiniStat label="Total Late" value={`${totalLateDays} Days`} color={totalLateDays > 0 ? COLORS.warning : COLORS.neutral} icon={AlertTriangle} />
                            <MiniStat label="Total Absent" value={`${totalAbsentDays} Days`} color={COLORS.danger} icon={ArrowRight} />
                        </div>

                        {/* ── CALENDAR GRID ── */}
                        <div style={styles.card}>
                            {/* Day Headers */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginBottom: '1.5rem' }}>
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                    <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{d}</div>
                                ))}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
                                {/* Empty Start */}
                                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                    <div key={`e-${i}`} style={{ minHeight: '140px', background: '#fcfdfe', borderRadius: '16px', border: '1px dashed #f1f5f9' }}></div>
                                ))}

                                {/* Day Cells */}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const d = i + 1;
                                    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                                    const att = attendances[dateStr];
                                    const isToday = dateStr === new Date().toISOString().split('T')[0];
                                    const hols = getHolidaysForDate(dateStr);
                                    const isHoliday = hols.length > 0;
                                    const leave = getLeaveForDate(dateStr);

                                    return (
                                        <div key={d} className="calendar-day" style={styles.dayCell(isHoliday, leave, isToday)}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '1.1rem', fontWeight: 950, color: isHoliday ? COLORS.danger : (leave ? COLORS.success : (isToday ? COLORS.primary : '#0f172a')) }}>
                                                    {d}
                                                </span>
                                                {att && att.status === 'late' && (
                                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS.danger, boxShadow: `0 0 8px ${COLORS.danger}66` }}></span>
                                                )}
                                            </div>

                                            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                {isHoliday && hols.map(h => (
                                                    <StatusBadge key={h.id} bg={COLORS.danger} text={h.name} />
                                                ))}
                                                {leave && !isHoliday && (
                                                    <StatusBadge bg={COLORS.success} text="Vacation" />
                                                )}
                                                {att && att.status !== 'absent' && (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', fontWeight: 900, color: '#94a3b8', marginBottom: '2px' }}>
                                                            <span>WORKED</span>
                                                            <span style={{ color: COLORS.primary }}>
                                                                {Math.floor(att.total_worked_minutes / 60)}h {att.total_worked_minutes % 60}m
                                                            </span>
                                                        </div>
                                                        <LogBadge icon={LogIn} color={COLORS.success} time={att.clock_in?.substring(0, 5)} />
                                                        <LogBadge icon={LogOut} color={COLORS.danger} time={att.clock_out ? att.clock_out.substring(0, 5) : '--:--'} />
                                                    </div>
                                                )}
                                                {att && att.status === 'absent' && (
                                                    <StatusBadge bg={COLORS.danger} text="ABSENT" />
                                                )}
                                                {!att && !isHoliday && !leave && (
                                                    <div style={{ textAlign: 'center', padding: '10px 0', opacity: 0.15 }}>
                                                        <Coffee size={24} style={{ margin: 'auto' }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ ...styles.card, padding: '6rem 2rem', textAlign: 'center', background: '#fff' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', margin: '0 auto 1.5rem' }}>
                            <Fingerprint size={48} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>Select Personnel</h3>
                        <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: 600, maxWidth: '440px', margin: '0 auto' }}>Choose a team member from the list above to generate their monthly visual timesheet and attendance performance report.</p>
                    </div>
                )}
            </div>

            <style>{`
                .calendar-day:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); border-color: ${COLORS.primary}44 !important; }
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

function StatusBadge({ bg, text }) {
    return (
        <div style={{ background: bg, color: '#fff', fontSize: '0.6rem', fontWeight: 900, padding: '4px 8px', borderRadius: '8px', textAlign: 'center', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {text}
        </div>
    );
}

function LogBadge({ icon: Icon, color, time }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800, color: '#475569' }}>
            <Icon size={11} color={color} /> <span>{time}</span>
        </div>
    );
}

const filterInput = {
    width: '100%', padding: '12px 16px 12px 48px', background: '#f8fafc',
    border: '1px solid #f1f5f9', borderRadius: '12px', fontSize: '0.85rem',
    outline: 'none', fontWeight: 600, color: '#1e293b', appearance: 'none',
    height: '44px'
};
