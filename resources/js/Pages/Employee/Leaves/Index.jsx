import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Plus, X, List, Grid, Trash2, 
    CalendarDays, Umbrella, Check, Briefcase,
    ChevronLeft, ChevronRight, User, Clock
} from 'lucide-react';

const cardStyle = {
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
};

const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.75rem 1rem',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '0.9rem',
    color: '#111827',
    outline: 'none',
    fontFamily: 'inherit'
};

const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 9991, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ background: '#fff', width: '100%', maxWidth: '450px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: 0 }}>{title}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
                </div>
                <div style={{ padding: '2rem' }}>{children}</div>
            </div>
        </div>
    );
};

export default function LeaveCalendar({ auth, leaves = [], holidays = [], employees = [] }) {
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [viewMode, setViewMode] = useState('calendar'); 
    const [modalType, setModalType] = useState(null); 
    const [viewingDate, setViewingDate] = useState(null);

    const holidayForm = useForm({ name: '', date: '', day_of_week: '', is_recurring_weekly: false });
    const leaveForm = useForm({ employee_id: '', leave_type: 'casual', start_date: '', end_date: '', reason: '' });

    const openModal = (type, defaultDate = null) => {
        setModalType(type);
        if (type === 'specific_holiday' && defaultDate) holidayForm.setData({ name: '', date: defaultDate, day_of_week: '', is_recurring_weekly: false });
        if (type === 'weekly_holiday') holidayForm.setData({ name: '', date: '', day_of_week: '5', is_recurring_weekly: true });
        if (type === 'leave' && defaultDate) leaveForm.setData({ employee_id: '', leave_type: 'casual', start_date: defaultDate, end_date: defaultDate, reason: '' });
    };

    const closeModal = () => {
        setModalType(null); setViewingDate(null);
        holidayForm.reset(); leaveForm.reset();
    };

    const submitHoliday = (e) => { e.preventDefault(); holidayForm.post(route('holidays.store'), { onSuccess: () => closeModal() }); };
    const submitLeave = (e) => { e.preventDefault(); router.post(route('employees.leave.store', leaveForm.data.employee_id), leaveForm.data, { onSuccess: () => closeModal() }); };
    const updateLeaveStatus = (id, status) => { router.post(route('leave.status.update', id), { status }, { preserveScroll: true }); };
    const deleteLeave = (id) => { if (confirm('Delete this leave?')) router.delete(route('leave.destroy', id), { preserveScroll: true }); };
    const deleteHoliday = (id) => { if (confirm('Remove this holiday?')) router.delete(route('holidays.destroy', id), { preserveScroll: true }); };

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

            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>Leaves & Holidays</h1>
                        <p style={{ fontSize: '1rem', color: '#6b7280', margin: '8px 0 0', fontWeight: 500 }}>Track team member absences and official holidays.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => openModal('weekly_holiday')} style={secondaryBtn}><CalendarDays size={18} /> Weekly Holiday</button>
                        <button onClick={() => openModal('leave')} style={primaryBtn}><Plus size={18} /> Assign Leave</button>
                    </div>
                </div>

                {/* Calendar Card */}
                <div style={{ ...cardStyle, padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', margin: 0 }}>
                                {new Date(year, month - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                            </h2>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button onClick={() => {const d = new Date(year, month-2); setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`)}} style={navBtn}><ChevronLeft size={18} /></button>
                                <button onClick={() => {const d = new Date(year, month); setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`)}} style={navBtn}><ChevronRight size={18} /></button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
                            <button onClick={() => setViewMode('calendar')} style={viewToggle(viewMode === 'calendar')}>Calendar</button>
                            <button onClick={() => setViewMode('list')} style={viewToggle(viewMode === 'list')}>List View</button>
                        </div>
                    </div>

                    {viewMode === 'calendar' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: '#f1f5f9', border: '1px solid #f1f5f9', borderRadius: '16px', overflow: 'hidden' }}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <div key={d} style={{ padding: '12px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', background: '#fff' }}>{d}</div>
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
                                        style={{ minHeight: '120px', background: '#fff', padding: '12px', cursor: 'pointer', position: 'relative' }}>
                                        <span style={{ fontSize: '1rem', fontWeight: 800, color: hols.length ? '#ef4444' : (isToday ? '#111827' : '#111827'), opacity: isToday ? 1 : 0.6 }}>{day}</span>
                                        {isToday && <div style={{ position: 'absolute', top: '12px', right: '12px', width: '6px', height: '6px', borderRadius: '50%', background: '#111827' }} />}
                                        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {hols.map(h => <div key={h.id} style={{ fontSize: '0.65rem', fontWeight: 800, color: '#ef4444', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>H: {h.name}</div>)}
                                            {lvs.map(l => (
                                                <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: l.status === 'approved' ? '#10b981' : '#f59e0b' }} />
                                                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#4b5563', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{l.employee.first_name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {leaves.length > 0 ? leaves.map(l => (
                                <div key={l.id} style={{ ...cardStyle, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={18} color="#94a3b8" /></div>
                                        <div>
                                            <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', margin: 0 }}>{l.employee.first_name} {l.employee.last_name}</p>
                                            <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '2px 0 0', fontWeight: 500 }}>{l.start_date} → {l.end_date} • {l.leave_type}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: l.status === 'approved' ? '#10b981' : '#f59e0b', textTransform: 'uppercase' }}>{l.status}</span>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            {l.status === 'pending' && <button onClick={() => updateLeaveStatus(l.id, 'approved')} style={{ ...iconBtn, color: '#10b981', border: '1px solid #dcfce7' }}><Check size={16} /></button>}
                                            <button onClick={() => deleteLeave(l.id)} style={{ ...iconBtn, color: '#ef4444', border: '1px solid #fee2e2' }}><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            )) : <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8', fontSize: '1rem', fontWeight: 500 }}>No leave records found.</div>}
                        </div>
                    )}
                </div>
            </div>

            {/* DAY DETAIL MODAL */}
            <Modal show={!!viewingDate} onClose={() => setViewingDate(null)} title={`Events on ${viewingDate?.dateStr}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {viewingDate?.hols.map(h => (
                        <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#b91c1c' }}>
                                <Umbrella size={18} />
                                <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>Holiday: {h.name}</span>
                            </div>
                            <button onClick={() => deleteHoliday(h.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}><X size={18} /></button>
                        </div>
                    ))}
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Member Absences</h4>
                        {viewingDate?.lvs.length > 0 ? viewingDate.lvs.map(l => (
                            <div key={l.id} style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>{l.employee.first_name} {l.employee.last_name}</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'capitalize' }}>{l.leave_type} ({l.status})</span>
                            </div>
                        )) : <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>No absences recorded.</p>}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                        <button onClick={() => { setViewingDate(null); openModal('leave', viewingDate.dateStr); }} style={{ ...primaryBtn, flex: 1, height: '44px' }}>Assign Leave</button>
                        <button onClick={() => { setViewingDate(null); openModal('specific_holiday', viewingDate.dateStr); }} style={{ ...secondaryBtn, flex: 1, height: '44px' }}>Set Holiday</button>
                    </div>
                </div>
            </Modal>

            {/* FORM MODAL */}
            <Modal show={!!modalType} onClose={closeModal} title={modalType === 'leave' ? 'Assign Leave' : (modalType === 'weekly_holiday' ? 'Reoccurring Holiday' : 'Record Holiday')}>
                <form onSubmit={modalType === 'leave' ? submitLeave : submitHoliday} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {modalType === 'leave' ? (
                        <>
                            <select value={leaveForm.data.employee_id} onChange={e => leaveForm.setData('employee_id', e.target.value)} style={inputStyle} required><option value="">Select Member</option>{employees.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}</select>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', marginBottom: '-8px' }}>Dates</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <input type="date" value={leaveForm.data.start_date} onChange={e => leaveForm.setData('start_date', e.target.value)} style={inputStyle} required />
                                <input type="date" value={leaveForm.data.end_date} onChange={e => leaveForm.setData('end_date', e.target.value)} style={inputStyle} required />
                            </div>
                            <input type="text" placeholder="Reason for leave" value={leaveForm.data.reason} onChange={e => leaveForm.setData('reason', e.target.value)} style={inputStyle} required />
                        </>
                    ) : (
                        <>
                            <input type="text" placeholder="Holiday Name (e.g. Eid-ul-Fitr)" value={holidayForm.data.name} onChange={e => holidayForm.setData('name', e.target.value)} style={inputStyle} required />
                            {modalType === 'weekly_holiday' ? (
                                <select value={holidayForm.data.day_of_week} onChange={e => holidayForm.setData('day_of_week', e.target.value)} style={inputStyle} required>
                                    <option value="5">Every Friday</option>
                                    <option value="6">Every Saturday</option>
                                    <option value="0">Every Sunday</option>
                                </select>
                            ) : (
                                <input type="date" value={holidayForm.data.date} onChange={e => holidayForm.setData('date', e.target.value)} style={inputStyle} required />
                            )}
                        </>
                    )}
                    <button type="submit" disabled={leaveForm.processing || holidayForm.processing} style={{ ...primaryBtn, width: '100%', height: '52px', fontSize: '1rem', marginTop: '1rem' }}>
                        {leaveForm.processing || holidayForm.processing ? 'Saving...' : 'Save Record'}
                    </button>
                </form>
            </Modal>

        </FigmaLayout>
    );
}

const primaryBtn = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    padding: '0 1.25rem', background: '#111827', color: '#fff',
    border: 'none', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer',
};
const secondaryBtn = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    padding: '0 1.25rem', background: '#fff', border: '1px solid #e5e7eb',
    borderRadius: '12px', color: '#4b5563', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
};
const navBtn = {
    width: '36px', height: '36px', borderRadius: '10px', 
    background: '#fff', border: '1px solid #e5e7eb',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    color: '#111827'
};
const viewToggle = (active) => ({
    padding: '8px 16px', borderRadius: '10px', border: 'none',
    background: active ? '#fff' : 'transparent', color: active ? '#111827' : '#64748b',
    fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
    boxShadow: active ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
});
const iconBtn = {
    width: '32px', height: '32px', borderRadius: '8px',
    background: '#fff', border: '1px solid #e5e7eb', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
};
