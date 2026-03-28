import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar as CalendarIcon, Users, Clock, ArrowRight,
    AlertTriangle, Briefcase, Activity, CheckCircle2
} from 'lucide-react';

const card = {
    background: '#fff', borderRadius: '16px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
};
const onFocus = e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; };
const onBlur  = e => { e.target.style.borderColor = '#ede9fe'; e.target.style.boxShadow = 'none'; };

export default function Calendar({ auth, attendances = {}, leaves = [], holidays = [], employees, currentEmployeeId, monthStr, filters }) {
    const [selectedMonth, setSelectedMonth] = useState(filters.month || new Date().toISOString().slice(0, 7));
    const [selectedEmployee, setSelectedEmployee] = useState(filters.employee_id || currentEmployeeId || '');

    useEffect(() => {
        const t = setTimeout(() => {
            router.get(route('attendance.calendar'), { month: selectedMonth, employee_id: selectedEmployee }, { preserveState: true, replace: true, preserveScroll: true });
        }, 500);
        return () => clearTimeout(t);
    }, [selectedMonth, selectedEmployee]);

    const selectStyle = {
        padding: '0.65rem 1rem', background: '#f9f7ff',
        border: '1.5px solid #ede9fe', borderRadius: '12px',
        fontSize: '0.82rem', color: '#1e1b4b', fontWeight: 700,
        outline: 'none', cursor: 'pointer', fontFamily: 'inherit',
        minWidth: '220px'
    };

    // Calendar Math
    const year = parseInt(selectedMonth.split('-')[0]);
    const month = parseInt(selectedMonth.split('-')[1]);
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 0 = Sun
    
    const getHolidaysForDate = (dayNum, dateStr) => {
        const dow = new Date(year, month - 1, dayNum).getDay();
        return holidays.filter(h => (h.is_recurring_weekly && h.day_of_week == dow) || (!h.is_recurring_weekly && h.date === dateStr));
    };

    const getLeaveForDate = (dateStr) => {
        return leaves.find(l => l.start_date <= dateStr && l.end_date >= dateStr);
    };
    
    const attList = Object.values(attendances);
    const totalLateDays = attList.filter(a => a.late_minutes > 0).length;
    const totalWorkMinutes = attList.reduce((acc, a) => acc + (a.total_worked_minutes || 0), 0);
    const totalHours = Math.floor(totalWorkMinutes / 60);
    const totalPresence = attList.length;

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Attendance Calendar" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto', paddingBottom: '3rem' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '3px' }}>
                            <CalendarIcon size={16} color="#a78bfa" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Timesheet Matrix</span>
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Attendance Calendar</h1>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '3px 0 0' }}>Visual breakdown of physical presence, work hours, and late days per employee</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                        <Link href={route('attendance.index')}>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1.125rem', background: '#fff', border: '1.5px solid #ede9fe', borderRadius: '12px', color: '#6366f1', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 1px 6px rgba(99,102,241,0.07)' }}>
                                <ArrowRight size={15} style={{ transform: 'rotate(180deg)' }} /> Back to Daily Roster
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div style={{ ...card, padding: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f5f3ff', padding: '4px', borderRadius: '14px' }}>
                                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                                    <Users size={18} />
                                </div>
                                <select value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)} style={{ ...selectStyle, background: 'transparent', border: 'none', padding: '0 1rem 0 0' }} onFocus={onFocus} onBlur={onBlur}>
                                    <option value="" disabled>Select Employee</option>
                                    {employees.map(e => (
                                        <option key={e.id} value={e.id}>{e.name} ({e.employee_id})</option>
                                    ))}
                                </select>
                            </div>

                            <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
                                style={selectStyle}
                                onFocus={onFocus} onBlur={onBlur}
                            />
                        </div>

                        {selectedEmployee && (
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>Total Work Time</span>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={16} color="#4338ca" /> {totalHours}h {totalWorkMinutes % 60}m
                                    </span>
                                </div>
                                <div style={{ width: '1px', background: '#ede9fe', margin: '0 0.5rem' }}></div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>Late Days</span>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: totalLateDays > 0 ? '#e11d48' : '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {totalLateDays > 0 ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />} {totalLateDays}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Calendar Grid */}
                {selectedEmployee ? (
                    <div style={{ ...card, padding: '1.5rem', background: '#faf9ff' }}>
                        
                        {/* Days Header */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '12px', marginBottom: '12px' }}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                                <div key={i} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 900, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Cells */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '12px' }}>
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`empty-${i}`} style={{ minHeight: '120px', borderRadius: '16px', background: 'transparent' }} />
                            ))}
                            
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const d = i + 1;
                                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                                const att = attendances[dateStr];
                                const isToday = dateStr === new Date().toISOString().split('T')[0];
                                
                                const hols = getHolidaysForDate(d, dateStr);
                                const isHoliday = hols.length > 0;
                                const leave = getLeaveForDate(dateStr);
                                
                                return (
                                    <div key={d} style={{ 
                                        minHeight: '120px', 
                                        background: isHoliday ? '#fff1f2' : (leave ? '#f0fdf4' : (isToday ? '#e0e7ff' : '#fff')), 
                                        borderRadius: '16px', 
                                        padding: '12px', 
                                        border: isHoliday ? '2px solid #ffe4e6' : (leave ? '2px solid #bbf7d0' : (isToday ? '2px solid #6366f1' : '1.5px solid #ede9fe')),
                                        display: 'flex', flexDirection: 'column', gap: '6px',
                                        boxShadow: isToday ? '0 4px 14px rgba(99,102,241,0.2)' : 'none',
                                        transition: 'transform 0.2s', cursor: 'default'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <span style={{ fontSize: '1rem', fontWeight: 900, color: isHoliday ? '#e11d48' : (leave ? '#16a34a' : (isToday ? '#4338ca' : '#1e1b4b')) }}>{d}</span>
                                            {att && att.late_minutes > 0 && (
                                                <span style={{ background: '#fff1f2', color: '#e11d48', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '6px' }}>Late</span>
                                            )}
                                        </div>

                                        {isHoliday && hols.map(h => (
                                            <div key={`h-${h.id}`} style={{ background: '#e11d48', padding: '4px 6px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 800, color: '#fff', textAlign: 'center' }}>
                                                {h.name}
                                            </div>
                                        ))}

                                        {leave && !isHoliday && (
                                            <div style={{ background: '#16a34a', padding: '4px 6px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 800, color: '#fff', textAlign: 'center', textTransform: 'capitalize' }}>
                                                ★ {leave.leave_type} Leave
                                            </div>
                                        )}

                                        {att && (
                                            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <div style={{ background: '#f5f3ff', padding: '4px 6px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, color: '#4338ca', display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>In</span> <span>{att.clock_in}</span>
                                                </div>
                                                <div style={{ background: '#f8fafc', padding: '4px 6px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>Out</span> <span>{att.clock_out || '--:--'}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                                                    <Briefcase size={12} /> {Math.floor(att.total_worked_minutes / 60)}h {att.total_worked_minutes % 60}m
                                                </div>
                                            </div>
                                        )}
                                        
                                        {!att && !isHoliday && !leave && (
                                            <div style={{ marginTop: 'auto', textAlign: 'center', padding: '10px 0' }}>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#cbd5e1' }}>Absent</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div style={{ ...card, padding: '6rem 2rem', textAlign: 'center' }}>
                        <Users size={48} color="#e2e8f0" style={{ margin: '0 auto 1rem' }} />
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b', margin: '0 0 0.5rem' }}>Select an Employee</h2>
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0, maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
                            Please select a personnel member from the dropdown above to view their mapped Timesheet Calendar and late statistics.
                        </p>
                    </div>
                )}

            </div>
        </FigmaLayout>
    );
}
