import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Plus, Search, User, Mail, Building2,
    Pencil, Trash2, History, MoreVertical,
    CheckCircle2, XCircle, Clock, ChevronDown,
    Filter, Briefcase, Activity, ShieldCheck,
    ChevronRight, MapPin, Phone, GraduationCap,
    Layers, Eye, ArrowLeft, Wallet, Star, Calendar,
    CreditCard, FileText, X, Check, Award, Heart
} from 'lucide-react';
import Modal from '@/Components/Modal';

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
    label: {
        fontSize: '0.72rem',
        fontWeight: 800,
        color: '#94a3b8',
        textTransform: 'uppercase',
        marginBottom: '4px',
        letterSpacing: '0.05em'
    },
    value: {
        fontSize: '0.95rem',
        fontWeight: 750,
        color: '#334155',
        margin: 0
    }
};

export default function Show({ auth, employee, stats }) {
    const [currentTab, setCurrentTab] = useState('overview');
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isPerfModalOpen, setIsPerfModalOpen] = useState(false);

    const { data: leaveData, setData: setLeaveData, post: postLeave, processing: leaveProcessing, reset: resetLeave } = useForm({
        leave_type: 'casual', start_date: '', end_date: '', reason: ''
    });

    const { data: perfData, setData: setPerfData, post: postPerf, processing: perfProcessing, reset: resetPerf } = useForm({
        review_date: new Date().toISOString().split('T')[0], rating: 5, kpi_score: 100, comments: '', goals: ''
    });

    const submitLeave = (e) => {
        e.preventDefault();
        postLeave(route('employees.leave.store', employee.id), { onSuccess: () => { setIsLeaveModalOpen(false); resetLeave(); } });
    };

    const submitPerf = (e) => {
        e.preventDefault();
        postPerf(route('employees.performance.store', employee.id), { onSuccess: () => { setIsPerfModalOpen(false); resetPerf(); } });
    };

    const updateLeaveStatus = (id, status) => {
        if (confirm(`Do you want to ${status} this request?`)) {
            router.post(route('leave.status.update', id), { status });
        }
    };

    const deleteLeave = (id) => { if (confirm('Remove this record?')) router.delete(route('leave.destroy', id)); };
    const deletePerf = (id) => { if (confirm('Remove this review?')) router.delete(route('performance.destroy', id)); };

    const sc = STATUS_CONFIG[employee.status] || STATUS_CONFIG.inactive;

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`${employee.first_name} | Member Profile`} />

            <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '4rem' }}>
                
                {/* ── HEADER ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <Link href={route('employees.index')}>
                            <button style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
                                    {employee.first_name} {employee.last_name}
                                </h1>
                                <span style={{ background: sc.bg, color: sc.color, fontSize: '0.7rem', fontWeight: 800, padding: '4px 12px', borderRadius: '10px' }}>
                                    {sc.label.toUpperCase()}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500, margin: '4px 0 0' }}>
                                ID Code: #{employee.employee_id} • {employee.designation || 'Specialist'}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link href={route('employees.edit', employee.id)}>
                            <button style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
                                background: '#4f46e5', border: 'none', borderRadius: '12px', 
                                color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer'
                            }}>
                                <Pencil size={18} /> Update Info
                            </button>
                        </Link>
                    </div>
                </div>

                {/* ── METRIC STRIP ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
                    <MiniStat label="Work Attendance" value={`${stats.attendance_rate}%`} color="#4f46e5" icon={ShieldCheck} />
                    <MiniStat label="Monthly Pay" value={`৳${parseFloat(employee.salary || 0).toLocaleString()}`} color="#10b981" icon={Wallet} />
                    <MiniStat label="Remaining Leaves" value={`${stats.leave_balance} Days`} color="#3b82f6" icon={Calendar} />
                    <MiniStat label="Performance Score" value={`${employee.performance_reviews?.[0]?.kpi_score || 100}%`} color="#f59e0b" icon={Award} />
                </div>

                {/* ── MAIN CONTENT ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                    
                    {/* LEFT SIDEBAR: IDENTITY HUB */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={styles.card}>
                            <div style={{ width: '100%', aspectRatio: '1', borderRadius: '16px', border: '1px solid #f1f5f9', background: '#f8fafc', overflow: 'hidden', marginBottom: '1.5rem' }}>
                                {employee.avatar ? (
                                    <img src={`/storage/${employee.avatar}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={64} color="#cbd5e1" /></div>}
                            </div>
                            
                            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.25rem' }}>Member Identity</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <IconRow icon={Mail} label="Email Address" val={employee.email} />
                                <IconRow icon={Phone} label="Phone Number" val={employee.phone} />
                                <IconRow icon={MapPin} label="Home Location" val={employee.address} />
                                <IconRow icon={Briefcase} label="Department" val={employee.department} />
                            </div>
                        </div>

                        <div style={{ ...styles.card, background: '#fff1f2', border: '1px solid #fee2e2' }}>
                            <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: '#b91c1c', textTransform: 'uppercase', marginBottom: '1rem' }}>Emergency Support</h4>
                            <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#7f1d1d', margin: '0 0 4px' }}>{employee.emergency_contact_name || 'Not Added'}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', fontSize: '0.85rem', fontWeight: 700 }}>
                                <Phone size={14} /> {employee.emergency_contact_phone || 'No phone'}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTENT: MANAGEMENT HUB */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* TAB NAV */}
                        <div style={{ display: 'flex', background: '#fff', padding: '6px', borderRadius: '16px', border: '1px solid #f1f5f9', width: 'fit-content' }}>
                            <button onClick={() => setCurrentTab('overview')} style={tabBtn(currentTab === 'overview')}>Member Details</button>
                            <button onClick={() => setCurrentTab('leave')} style={tabBtn(currentTab === 'leave')}>Leave Tracker</button>
                            <button onClick={() => setCurrentTab('performance')} style={tabBtn(currentTab === 'performance')}>Review Logs</button>
                            <button onClick={() => setCurrentTab('history')} style={tabBtn(currentTab === 'history')}>Access History</button>
                        </div>

                        {/* TAB CONTENT */}
                        {currentTab === 'overview' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={styles.card}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem' }}>Work Profile</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                                        <InfoBlock label="Job Role" val={employee.designation} />
                                        <InfoBlock label="Join Date" val={employee.join_date} />
                                        <InfoBlock label="Assigned Shift" val={employee.shift?.name} />
                                        <InfoBlock label="Gender Identity" val={employee.gender} />
                                        <InfoBlock label="Blood Group" val={employee.blood_group} />
                                        <InfoBlock label="Birth Date" val={employee.date_of_birth} />
                                    </div>
                                </div>

                                <div style={styles.card}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem' }}>Financial Node</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                                        <InfoBlock label="Bank Name" val={employee.bank_name || 'Individual Pay'} />
                                        <InfoBlock label="Account Number" val={employee.bank_account_no} />
                                        <InfoBlock label="Tax ID / NID" val={employee.employee_id} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentTab === 'leave' && (
                            <div style={styles.card}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Request History</h3>
                                    <button onClick={() => setIsLeaveModalOpen(true)} style={{ padding: '8px 20px', background: '#4f46e5', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}>
                                        New Request
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {employee.leave_applications?.length > 0 ? employee.leave_applications.map(leave => (
                                        <div key={leave.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 100px', alignItems: 'center', padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                            <div>
                                                <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{leave.start_date} → {leave.end_date}</p>
                                                <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, margin: '2px 0 0' }}>Type: {leave.leave_type.toUpperCase()}</p>
                                            </div>
                                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#475569' }}>{leave.reason}</div>
                                            <div style={{ textAlign: 'center' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: leave.status === 'approved' ? '#10b981' : (leave.status === 'rejected' ? '#ef4444' : '#f59e0b') }}>
                                                    {leave.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                                {leave.status === 'pending' && auth.user.role === 'admin' && (
                                                    <>
                                                        <button onClick={() => updateLeaveStatus(leave.id, 'approved')} style={{ background: '#f0fdf4', border: 'none', color: '#16a34a', padding: '6px', borderRadius: '8px', cursor: 'pointer' }}><Check size={16} /></button>
                                                        <button onClick={() => updateLeaveStatus(leave.id, 'rejected')} style={{ background: '#fef2f2', border: 'none', color: '#ef4444', padding: '6px', borderRadius: '8px', cursor: 'pointer' }}><X size={16} /></button>
                                                    </>
                                                )}
                                                <button onClick={() => deleteLeave(leave.id)} style={{ background: '#fff', border: '1px solid #f1f5f9', color: '#94a3b8', padding: '6px', borderRadius: '8px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    )) : <EmptyState icon={Calendar} label="No leave requests found" />}
                                </div>
                            </div>
                        )}

                        {currentTab === 'performance' && (
                            <div style={styles.card}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Review Logs</h3>
                                    <button onClick={() => setIsPerfModalOpen(true)} style={{ padding: '8px 20px', background: '#4f46e5', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}>
                                        New Review
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {employee.performance_reviews?.length > 0 ? employee.performance_reviews.map(review => (
                                        <div key={review.id} style={{ display: 'flex', gap: '1.5rem', padding: '20px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                            <div style={{ minWidth: '70px', height: '70px', borderRadius: '14px', background: '#fff', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                <span style={{ fontSize: '1.5rem', fontWeight: 950, color: '#0f172a' }}>{review.rating}</span>
                                                <div style={{ display: 'flex', gap: '1px' }}>{[...Array(5)].map((_, i) => <Star key={i} size={8} fill={i < review.rating ? '#f59e0b' : 'none'} color="#f59e0b" />)}</div>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0f172a' }}>{new Date(review.review_date).toLocaleDateString()}</span>
                                                    <span style={{ background: '#ecfdf5', color: '#10b981', padding: '2px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 900 }}>KPI {review.kpi_score}%</span>
                                                </div>
                                                <p style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500, margin: '0 0 10px', fontStyle: 'italic' }}>"{review.comments}"</p>
                                                {review.goals && (
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        <Activity size={12} color="#94a3b8" />
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>GOAL: {review.goals}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <button onClick={() => deletePerf(review.id)} style={{ border: 'none', background: 'none', color: '#cbd5e1', cursor: 'pointer', height: 'fit-content' }}><Trash2 size={16} /></button>
                                        </div>
                                    )) : <EmptyState icon={Award} label="No performance history recorded" />}
                                </div>
                            </div>
                        )}

                        {currentTab === 'history' && (
                            <div style={styles.card}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginBottom: '2rem' }}>Daily Access History</h3>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', borderBottom: '1.5px solid #f8fafc' }}>
                                                <th style={{ padding: '16px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Calendar Date</th>
                                                <th style={{ padding: '16px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Check In</th>
                                                <th style={{ padding: '16px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Check Out</th>
                                                <th style={{ padding: '16px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'center' }}>Day Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employee.attendances?.length > 0 ? employee.attendances.map(att => (
                                                <tr key={att.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                                    <td style={{ padding: '16px', fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{att.date}</td>
                                                    <td style={{ padding: '16px', fontSize: '0.9rem', color: '#10b981', fontWeight: 750 }}>{att.check_in || '--:--'}</td>
                                                    <td style={{ padding: '16px', fontSize: '0.9rem', color: '#ef4444', fontWeight: 750 }}>{att.check_out || '--:--'}</td>
                                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                                        <span style={{ 
                                                            background: att.status === 'present' ? '#f0fdf4' : '#fef2f2', 
                                                            color: att.status === 'present' ? '#16a34a' : '#ef4444', 
                                                            padding: '4px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' 
                                                        }}>
                                                            {att.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )) : <tr><td colSpan="4" style={{ padding: '4rem', textAlign: 'center' }}><EmptyState icon={History} label="No attendance records available" /></td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* ── MODALS ── */}
            <Modal show={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)} maxWidth="md">
                <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>New Absence Request</h3>
                        <X onClick={() => setIsLeaveModalOpen(false)} style={{ cursor: 'pointer' }} />
                    </div>
                    <form onSubmit={submitLeave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <SelectField label="Absence Type" val={leaveData.leave_type} setVal={v => setLeaveData('leave_type', v)} options={[{id: 'casual', name: 'Casual'}, {id: 'sick', name: 'Sick'}, {id: 'annual', name: 'Annual'}]} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <InputField label="Start Date" type="date" val={leaveData.start_date} setVal={v => setLeaveData('start_date', v)} />
                            <InputField label="End Date" type="date" val={leaveData.end_date} setVal={v => setLeaveData('end_date', v)} />
                        </div>
                        <TextField label="Message / Rationale" val={leaveData.reason} setVal={v => setLeaveData('reason', v)} />
                        <button type="submit" disabled={leaveProcessing} style={modalSubmitStyle}>Send Request</button>
                    </form>
                </div>
            </Modal>

            <Modal show={isPerfModalOpen} onClose={() => setIsPerfModalOpen(false)} maxWidth="md">
                <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Personal Review</h3>
                        <X onClick={() => setIsPerfModalOpen(false)} style={{ cursor: 'pointer' }} />
                    </div>
                    <form onSubmit={submitPerf} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <InputField label="Rating (1-5)" type="number" val={perfData.rating} setVal={v => setPerfData('rating', v)} />
                            <InputField label="KPI Score (%)" type="number" val={perfData.kpi_score} setVal={v => setPerfData('kpi_score', v)} />
                        </div>
                        <TextField label="Member Feedback" val={perfData.comments} setVal={v => setPerfData('comments', v)} />
                        <InputField label="Future Goals" val={perfData.goals} setVal={v => setPerfData('goals', v)} />
                        <button type="submit" disabled={perfProcessing} style={modalSubmitStyle}>Finalize Review</button>
                    </form>
                </div>
            </Modal>

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

function IconRow({ icon: Icon, label, val }) {
    return (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
                <Icon size={20} />
            </div>
            <div style={{ overflow: 'hidden' }}>
                <p style={styles.label}>{label}</p>
                <p style={{ ...styles.value, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{val || 'Not Added'}</p>
            </div>
        </div>
    );
}

function InfoBlock({ label, val }) {
    return (
        <div>
            <p style={styles.label}>{label}</p>
            <p style={styles.value}>{val || 'N/A'}</p>
        </div>
    );
}

function EmptyState({ icon: Icon, label }) {
    return (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <Icon size={40} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600, margin: 0 }}>{label}</p>
        </div>
    );
}

const tabBtn = (active) => ({
    border: 'none', padding: '10px 20px', borderRadius: '12px', 
    fontSize: '0.85rem', fontWeight: 800, 
    background: active ? '#f8fafc' : 'transparent', 
    color: active ? '#4f46e5' : '#64748b', 
    cursor: 'pointer', transition: 'all 0.2s', 
    boxShadow: active ? '0 2px 4px rgba(0,0,0,0.02)' : 'none'
});

const InputField = ({ label, type = 'text', val, setVal }) => (
    <div>
        <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px' }}>{label}</label>
        <input type={type} value={val} onChange={e => setVal(e.target.value)} style={modalInp} required />
    </div>
);

const TextField = ({ label, val, setVal }) => (
    <div>
        <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px' }}>{label}</label>
        <textarea value={val} onChange={e => setVal(e.target.value)} style={{ ...modalInp, height: '100px', resize: 'none' }} required />
    </div>
);

const SelectField = ({ label, val, setVal, options }) => (
    <div>
        <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px' }}>{label}</label>
        <select value={val} onChange={e => setVal(e.target.value)} style={modalInp}>
            {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
    </div>
);

const modalInp = { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f1f5f9', background: '#f8fafc', fontSize: '0.9rem', fontWeight: 600, outline: 'none' };
const modalSubmitStyle = { height: '52px', width: '100%', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', marginTop: '1rem' };
