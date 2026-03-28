import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Calendar as CalendarIcon, Plus, X, List, Grid, Trash2, 
    Palmtree, CalendarDays, Umbrella, AlertTriangle, Check, Briefcase,
    ChevronLeft, ChevronRight, User, MoreHorizontal, Clock, Ban
} from 'lucide-react';
import Modal from '@/Components/Modal';

// ─── Shared Styles ─────────────────────────────────────────────
const card = {
    background: '#fff', borderRadius: '16px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
};
const onFocus = e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; };
const onBlur  = e => { e.target.style.borderColor = '#ede9fe'; e.target.style.boxShadow = 'none'; };

const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    padding: '0.65rem 1rem', background: '#f9f7ff',
    border: '1.5px solid #ede9fe', borderRadius: '10px',
    fontSize: '0.82rem', color: '#1e1b4b', fontWeight: 700,
    outline: 'none', fontFamily: 'inherit', transition: 'all 0.2s'
};

const iconBtn = (bg, color) => ({
    width: '32px', height: '32px', borderRadius: '8px',
    background: bg, border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color,
    transition: 'transform 0.1s'
});

const LEAVE_TYPES = ['casual', 'sick', 'annual', 'maternity', 'paternity', 'unpaid', 'other'];
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function LeaveCalendar({ auth, leaves = [], holidays = [], employees = [] }) {
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
    const [modalType, setModalType] = useState(null); 
    const [viewingDate, setViewingDate] = useState(null);

    const holidayForm = useForm({ name: '', date: '', day_of_week: '', is_recurring_weekly: false });
    const leaveForm = useForm({ employee_id: '', leave_type: 'casual', start_date: '', end_date: '', reason: '' });

    const openModal = (type, defaultDate = null) => {
        setModalType(type);
        if (type === 'specific_holiday' && defaultDate) holidayForm.setData({ name: '', date: defaultDate, day_of_week: '', is_recurring_weekly: false });
        if (type === 'weekly_holiday') holidayForm.setData({ name: '', date: '', day_of_week: '0', is_recurring_weekly: true });
        if (type === 'leave' && defaultDate) leaveForm.setData({ employee_id: '', leave_type: 'casual', start_date: defaultDate, end_date: defaultDate, reason: '' });
    };

    const closeModal = () => {
        setModalType(null); setViewingDate(null);
        holidayForm.reset(); leaveForm.reset();
    };

    const submitHoliday = (e) => { e.preventDefault(); holidayForm.post(route('holidays.store'), { onSuccess: () => closeModal() }); };
    const submitLeave = (e) => { e.preventDefault(); router.post(route('employees.leave.store', leaveForm.data.employee_id), leaveForm.data, { onSuccess: () => closeModal() }); };
    const updateLeaveStatus = (id, status) => { router.post(route('leave.status.update', id), { status }, { preserveScroll: true }); };
    const deleteLeave = (id) => { if (confirm('Delete leave?')) router.delete(route('leave.destroy', id), { preserveScroll: true }); };
    const deleteHoliday = (id) => { if (confirm('Remove holiday?')) router.delete(route('holidays.destroy', id), { preserveScroll: true }); };

    // Calendar logic
    const year = parseInt(selectedMonth.split('-')[0]);
    const month = parseInt(selectedMonth.split('-')[1]);
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

    const getHolidaysForDate = (dayNum, dateStr) => {
        const dObj = new Date(year, month - 1, dayNum);
        return holidays.filter(h => (h.is_recurring_weekly && h.day_of_week == dObj.getDay()) || (!h.is_recurring_weekly && h.date === dateStr));
    };
    const getLeavesForDate = (dateStr) => leaves.filter(l => l.start_date <= dateStr && l.end_date >= dateStr);

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Leaves & Holidays" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
                
                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '3px' }}>
                            <Palmtree size={16} color="#a78bfa" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Absence Planner</span>
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Leave Matrix</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '0.625rem' }}>
                         <button onClick={() => openModal('weekly_holiday')} style={secondaryBtn}><CalendarDays size={15} /> Weekly</button>
                         <button onClick={() => openModal('specific_holiday')} style={secondaryBtn}><Umbrella size={15} /> Single Day</button>
                         <button onClick={() => openModal('leave')} style={primaryBtn}><Plus size={16} /> Assign Leave</button>
                    </div>
                </div>

                {/* ── Minimal Calendar Interface ── */}
                <div style={{ ...card, padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>
                                {new Date(year, month - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                            </h2>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={() => {const d = new Date(year, month-2); setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`)}} style={navBtn}><ChevronLeft size={16} /></button>
                                <button onClick={() => {const d = new Date(year, month); setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`)}} style={navBtn}><ChevronRight size={16} /></button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', background: '#f8fafc', padding: '4px', borderRadius: '12px', border: '1.5px solid #f1f5f9' }}>
                            <button onClick={() => setViewMode('calendar')} style={viewToggle(viewMode === 'calendar')}><Grid size={14} /> Matrix</button>
                            <button onClick={() => setViewMode('list')} style={viewToggle(viewMode === 'list')}><List size={14} /> Queue</button>
                        </div>
                    </div>

                    {viewMode === 'calendar' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: '#f1f5f9', border: '1px solid #f1f5f9', borderRadius: '16px', overflow: 'hidden' }}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <div key={d} style={{ padding: '12px', textAlign: 'center', fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', background: '#fff' }}>{d}</div>
                            ))}
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`e-${i}`} style={{ background: '#fcfdfe' }} />)}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const isToday = dateStr === new Date().toISOString().split('T')[0];
                                const hols = getHolidaysForDate(day, dateStr);
                                const lvs = getLeavesForDate(dateStr);
                                return (
                                    <div key={day} onClick={() => setViewingDate({ dateStr, hols, lvs })}
                                        style={{ minHeight: '100px', background: '#fff', padding: '10px', cursor: 'pointer', transition: 'background 0.2s', position: 'relative' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: hols.length ? '#ef4444' : (isToday ? '#6366f1' : '#1e1b4b') }}>{day}</span>
                                        {isToday && <div style={{ position: 'absolute', top: '10px', right: '10px', width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' }} />}
                                        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                            {hols.slice(0, 1).map(h => <div key={h.id} style={{ fontSize: '0.6rem', fontWeight: 800, color: '#ef4444', overflow: 'hidden', textOverflow: 'ellipsis' }}>• {h.name}</div>)}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
                                                {lvs.map(l => <div key={l.id} title={l.employee.first_name} style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.status === 'approved' ? '#10b981' : '#f59e0b' }} />)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {leaves.length > 0 ? leaves.map(l => (
                                <div key={l.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={14} color="#64748b" /></div>
                                        <div>
                                            <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{l.employee.first_name} {l.employee.last_name}</p>
                                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0 }}>{l.start_date} → {l.end_date}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: l.status === 'approved' ? '#10b981' : '#f59e0b', textTransform: 'uppercase' }}>{l.status}</span>
                                        {l.status === 'pending' && <button onClick={() => updateLeaveStatus(l.id, 'approved')} style={iconBtn('#f0fdf4', '#16a34a')}><Check size={14} /></button>}
                                        <button onClick={() => deleteLeave(l.id)} style={iconBtn('#fef2f2', '#ef4444')}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            )) : <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Queue Void</div>}
                        </div>
                    )}
                </div>
            </div>

            {/* MINIMAL DAY MODAL */}
            <Modal show={!!viewingDate} onClose={() => setViewingDate(null)} maxWidth="sm">
                <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>{viewingDate?.dateStr}</h3>
                        <button onClick={() => setViewingDate(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
                    </div>
                    {viewingDate?.hols.map(h => (
                        <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#fff1f2', borderRadius: '10px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#e11d48' }}><Ban size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> {h.name}</span>
                            <button onClick={() => deleteHoliday(h.id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={14} color="#e11d48" /></button>
                        </div>
                    ))}
                    <div style={{ marginTop: '1rem', borderRadius: '12px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                        {viewingDate?.lvs.length > 0 ? viewingDate.lvs.map(l => (
                            <div key={l.id} style={{ padding: '12px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e1b4b' }}>{l.employee.first_name} {l.employee.last_name}</div>
                                <div style={{ fontSize: '0.7rem', color: '#6366f1', textTransform: 'capitalize' }}>{l.leave_type} Leave ({l.status})</div>
                            </div>
                        )) : <div style={{ padding: '1rem', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>No staff absences</div>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
                        <button onClick={() => { setViewingDate(null); openModal('leave', viewingDate.dateStr); }} style={{ ...primaryBtn, width: '100%', height: '40px' }}>Assign Staff Leave</button>
                        <button onClick={() => { setViewingDate(null); openModal('specific_holiday', viewingDate.dateStr); }} style={{ ...secondaryBtn, width: '100%', height: '40px' }}>Mark as Holiday</button>
                    </div>
                </div>
            </Modal>

            {/* Standard Forms Modals remain similar but cleaned */}
            <Modal show={!!modalType} onClose={closeModal} maxWidth="sm">
                <form onSubmit={modalType === 'leave' ? submitLeave : submitHoliday} style={{ padding: '1.5rem' }}>
                   <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem' }}>{modalType === 'leave' ? 'Assign Leave Package' : 'Set Holiday Node'}</h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                       {modalType === 'leave' ? (
                           <>
                               <select value={leaveForm.data.employee_id} onChange={e => leaveForm.setData('employee_id', e.target.value)} style={inputStyle}><option value="">Select Personnel</option>{employees.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}</select>
                               <div style={{ display: 'flex', gap: '10px' }}>
                                   <input type="date" value={leaveForm.data.start_date} onChange={e => leaveForm.setData('start_date', e.target.value)} style={inputStyle} />
                                   <input type="date" value={leaveForm.data.end_date} onChange={e => leaveForm.setData('end_date', e.target.value)} style={inputStyle} />
                               </div>
                               <input type="text" placeholder="Official Reason" value={leaveForm.data.reason} onChange={e => leaveForm.setData('reason', e.target.value)} style={inputStyle} />
                           </>
                       ) : (
                           <>
                               <input type="text" placeholder="Holiday Title" value={holidayForm.data.name} onChange={e => holidayForm.setData('name', e.target.value)} style={inputStyle} required />
                               {modalType === 'weekly_holiday' ? (
                                   <select value={holidayForm.data.day_of_week} onChange={e => holidayForm.setData('day_of_week', e.target.value)} style={inputStyle}>{DAYS_OF_WEEK.map((d, i) => <option key={i} value={i}>Every {d}</option>)}</select>
                               ) : (
                                   <input type="date" value={holidayForm.data.date} onChange={e => holidayForm.setData('date', e.target.value)} style={inputStyle} required />
                               )}
                           </>
                       )}
                       <button type="submit" style={{ ...primaryBtn, width: '100%', height: '48px', marginTop: '1rem' }}>Execute Protocol</button>
                   </div>
                </form>
            </Modal>

        </FigmaLayout>
    );
}

const primaryBtn = {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    border: 'none', borderRadius: '12px', color: '#fff',
    fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(99,102,241,0.25)',
};
const secondaryBtn = {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '0.6rem 1.125rem', background: '#fff',
    border: '1.5px solid #ede9fe', borderRadius: '12px',
    color: '#6366f1', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
};
const navBtn = {
    width: '32px', height: '32px', borderRadius: '8px', 
    background: '#f8fafc', border: '1.5px solid #f1f5f9',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    color: '#6366f1', transition: 'all 0.2s'
};
const viewToggle = (active) => ({
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '6px 14px', borderRadius: '10px',
    border: 'none', background: active ? '#fff' : 'transparent',
    color: active ? '#6366f1' : '#94a3b8',
    fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
    boxShadow: active ? '0 2px 8px rgba(99,102,241,0.1)' : 'none',
    transition: 'all 0.2s'
});
