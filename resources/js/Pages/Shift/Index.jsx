import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    CalendarClock, Clock, Edit3, Trash2, Plus, X, Users,
    PlayCircle, StopCircle, Type, ShieldAlert
} from 'lucide-react';

const cardStyle = {
    background: '#fff', borderRadius: '16px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
};
const onFocus = e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; };
const onBlur  = e => { e.target.style.borderColor = '#ede9fe'; e.target.style.boxShadow = 'none'; };

export default function ShiftIndex({ shifts, auth }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingShift, setEditingShift] = useState(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        start_time: '09:00',
        end_time: '18:00',
        grace_period: 15,
    });

    const openModal = (shift = null) => {
        if (shift) {
            setEditingShift(shift);
            setData({
                name: shift.name,
                start_time: shift.start_time,
                end_time: shift.end_time,
                grace_period: shift.grace_period,
            });
        } else {
            setEditingShift(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingShift) {
            put(route('shifts.update', editingShift.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('shifts.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingShift(null);
        reset();
    };

    const deleteShift = (id) => {
        if (confirm('Permanently delete this shift schedule?')) {
            router.delete(route('shifts.destroy', id), { preserveScroll: true });
        }
    };

    const inputStyle = {
        width: '100%', boxSizing: 'border-box',
        padding: '0.65rem 1rem', background: '#f9f7ff',
        border: '1.5px solid #ede9fe', borderRadius: '10px',
        fontSize: '0.82rem', color: '#1e1b4b', fontWeight: 700,
        outline: 'none', fontFamily: 'inherit', transition: 'all 0.2s'
    };
    const labelStyle = {
        display: 'block', fontSize: '0.65rem', fontWeight: 800,
        color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: '6px', marginLeft: '2px'
    };

    return (
        <FigmaLayout user={auth?.user}>
            <Head title="Shift Management" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto', paddingBottom: '3rem' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '3px' }}>
                            <CalendarClock size={16} color="#a78bfa" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Scheduling Configuration</span>
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Shift Management</h1>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '3px 0 0' }}>Define standardized working hours and late-arrival thresholds for the team</p>
                    </div>

                    <div>
                        <button onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.65rem 1.25rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', transition: 'transform 0.2s' }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                            <Plus size={16} strokeWidth={3} /> Define Shift
                        </button>
                    </div>
                </div>

                {/* Shifts Grid */}
                {shifts.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                        {shifts.map((shift) => (
                            <div key={shift.id} style={{ ...cardStyle, padding: '1.5rem', position: 'relative', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.3s, border-color 0.3s' }} onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 8px 24px rgba(99,102,241,0.12)'; e.currentTarget.style.borderColor='#ddd6fe';}} onMouseLeave={e=>{e.currentTarget.style.boxShadow=cardStyle.boxShadow; e.currentTarget.style.borderColor=cardStyle.border;}}>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e1b4b', margin: '0 0 6px' }}>{shift.name}</h3>
                                        {shift.employees_count > 0 ? (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ecfdf5', color: '#10b981', padding: '4px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                                <Users size={12} strokeWidth={3} /> {shift.employees_count} Enrolled
                                            </span>
                                        ) : (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f8fafc', color: '#94a3b8', padding: '4px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                                Unassigned
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button onClick={() => openModal(shift)} style={{ background: '#f5f3ff', border: 'none', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e=>e.currentTarget.style.background='#ede9fe'} onMouseLeave={e=>e.currentTarget.style.background='#f5f3ff'}>
                                            <Edit3 size={15} />
                                        </button>
                                        <button onClick={() => deleteShift(shift.id)} style={{ background: '#fff1f2', border: 'none', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e=>e.currentTarget.style.background='#fce7f3'} onMouseLeave={e=>e.currentTarget.style.background='#fff1f2'}>
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#fcfbfe', padding: '1rem', borderRadius: '12px', border: '1px solid #f0eeff' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <PlayCircle size={14} color="#10b981" /> Clock-in Target
                                        </span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e1b4b' }}>{shift.start_time.substring(0, 5)}</span>
                                    </div>
                                    <div style={{ width: '100%', height: '1px', background: '#f0eeff' }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <StopCircle size={14} color="#f43f5e" /> Clock-out Escapement
                                        </span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e1b4b' }}>{shift.end_time.substring(0, 5)}</span>
                                    </div>
                                    <div style={{ width: '100%', height: '1px', background: '#f0eeff' }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <ShieldAlert size={14} color="#eab308" /> Late Tolerance Allowance
                                        </span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#6366f1' }}>{shift.grace_period} mins</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ ...cardStyle, padding: '5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                            <Clock size={32} color="#8b5cf6" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b', margin: '0 0 0.5rem' }}>No defined shifts found</h3>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 1.5rem', maxWidth: '300px' }}>Construct your first work schedule to enforce accurate late day payroll deductions.</p>
                        <button onClick={() => openModal()} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.65rem 1.25rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
                            <Plus size={16} strokeWidth={3} /> Define Initial Shift
                        </button>
                    </div>
                )}

                {/* Modal Overlay */}
                {isModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(3px)' }}>
                        <div style={{ background: '#fff', width: '100%', maxWidth: '440px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden', animation: 'fadeIn 0.2s ease-out' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1.5px solid #f0f0f5', background: '#faf9ff' }}>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>
                                    {editingShift ? 'Modify Existing Shift' : 'Deploy New Shift'}
                                </h2>
                                <button onClick={closeModal} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px', display: 'flex' }} onMouseEnter={e=>e.currentTarget.style.color='#1e1b4b'} onMouseLeave={e=>e.currentTarget.style.color='#9ca3af'}>
                                    <X size={18} strokeWidth={3} />
                                </button>
                            </div>
                            
                            <form onSubmit={submit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={labelStyle}>Global Shift Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <Type size={14} color="#a78bfa" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px', pointerEvents: 'none' }} />
                                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g. Standard Morning" style={{...inputStyle, paddingLeft: '2.2rem'}} onFocus={onFocus} onBlur={onBlur} />
                                    </div>
                                    {errors.name && <p style={{ color: '#e11d48', fontSize: '0.65rem', fontWeight: 800, margin: '4px 0 0' }}>{errors.name}</p>}
                                </div>
                                
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>Start Check-In</label>
                                        <input type="time" value={data.start_time} onChange={e => setData('start_time', e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                                        {errors.start_time && <p style={{ color: '#e11d48', fontSize: '0.65rem', fontWeight: 800, margin: '4px 0 0' }}>{errors.start_time}</p>}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>End Check-Out</label>
                                        <input type="time" value={data.end_time} onChange={e => setData('end_time', e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                                        {errors.end_time && <p style={{ color: '#e11d48', fontSize: '0.65rem', fontWeight: 800, margin: '4px 0 0' }}>{errors.end_time}</p>}
                                    </div>
                                </div>
                                
                                <div>
                                    <label style={labelStyle}>Lateness Grace Margin (Minutes)</label>
                                    <div style={{ position: 'relative' }}>
                                        <Clock size={14} color="#a78bfa" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px', pointerEvents: 'none' }} />
                                        <input type="number" min="0" value={data.grace_period} onChange={e => setData('grace_period', e.target.value)} style={{...inputStyle, paddingLeft: '2.2rem'}} onFocus={onFocus} onBlur={onBlur} />
                                    </div>
                                    {errors.grace_period && <p style={{ color: '#e11d48', fontSize: '0.65rem', fontWeight: 800, margin: '4px 0 0' }}>{errors.grace_period}</p>}
                                </div>
                                
                                <button type="submit" disabled={processing} style={{ width: '100%', padding: '0.8rem', background: 'linear-gradient(135deg, #1e1b4b, #312e81)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, cursor: processing ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginTop: '0.5rem', boxShadow: '0 4px 12px rgba(30,27,75,0.2)' }} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.02)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
                                    {processing ? 'Processing Server...' : (editingShift ? 'Save Changes' : 'Confirm New Shift')}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                <style>{`
                    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                `}</style>
            </div>
        </FigmaLayout>
    );
}
