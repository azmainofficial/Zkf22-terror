import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    Wallet, Zap, Printer, PieChart, CheckCircle2, Clock, Calendar, ChevronDown,
    Search, Filter, X, Edit, ShieldCheck, TrendingUp, Inbox, Save, AlertTriangle, AlertCircle, Trash2
} from 'lucide-react';
import Modal from '@/Components/Modal';

// ─── Status Config ─────────────────────────────────────────────
const STATUS_CONFIG = {
    paid:      { label: 'Paid',      bg: '#f0fdf4', color: '#16a34a' },
    pending:   { label: 'Pending',   bg: '#fffbeb', color: '#f59e0b' },
    cancelled: { label: 'Cancelled', bg: '#fff1f2', color: '#dc2626' },
};
function getStatus(s) { return STATUS_CONFIG[(s||'').toLowerCase()] || STATUS_CONFIG.pending; }

// ─── Shared Styles ─────────────────────────────────────────────
const card = {
    background: '#fff', borderRadius: '16px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
};
const onFocus = e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; };
const onBlur  = e => { e.target.style.borderColor = '#ede9fe'; e.target.style.boxShadow = 'none'; };

const selectStyle = {
    padding: '0.625rem 0.875rem', background: '#f9f7ff',
    border: '1.5px solid #ede9fe', borderRadius: '10px',
    fontSize: '0.82rem', color: '#4338ca', fontWeight: 600,
    outline: 'none', cursor: 'pointer', appearance: 'none',
    fontFamily: 'inherit',
};

const iconBtn = (bg, color) => ({
    width: '32px', height: '32px', borderRadius: '8px',
    background: bg, border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color,
    transition: 'transform 0.1s'
});

export default function Index({ auth, payrolls, filters, stats }) {
    const [month, setMonth] = useState(filters.month || new Date().getMonth() + 1);
    const [year, setYear] = useState(filters.year || new Date().getFullYear());
    const [status, setStatus] = useState(filters.status || '');
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [processingGeneration, setProcessingGeneration] = useState(false);
    
    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPayroll, setSelectedPayroll] = useState(null);
    const editForm = useForm({
        status: '',
        bonus: 0,
        deductions: 0,
        late_deduction: 0,
        absent_deduction: 0,
        payment_method: 'cash',
        note: ''
    });

    const handleFilter = (e) => {
        if (e) e.preventDefault();
        router.get(route('payroll.index'), { month, year, status }, { preserveState: true });
    };

    const handleGenerate = (e) => {
        e.preventDefault();
        setProcessingGeneration(true);
        router.post(route('payroll.generate'), { month, year }, {
            onSuccess: () => {
                setIsGenerateModalOpen(false);
                setProcessingGeneration(false);
            },
            onError: () => setProcessingGeneration(false)
        });
    };

    const openEditModal = (payroll) => {
        setSelectedPayroll(payroll);
        editForm.setData({
            status: payroll.status,
            bonus: parseFloat(payroll.bonus) || 0,
            deductions: parseFloat(payroll.deductions) || 0,
            late_deduction: parseFloat(payroll.late_deduction) || 0,
            absent_deduction: parseFloat(payroll.absent_deduction) || 0,
            payment_method: payroll.payment_method || 'cash',
            note: payroll.note || ''
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.patch(route('payroll.update', selectedPayroll.id), {
            onSuccess: () => setIsEditModalOpen(false)
        });
    };

    const markAsPaid = (id) => {
        if (confirm('Verify: Authorized temporal salary discharge?')) {
            router.patch(route('payroll.update', id), { 
                status: 'paid', 
                payment_date: new Date().toISOString().split('T')[0] 
            });
        }
    };

    const statCards = [
        { label: 'Fiscal Potential', value: `৳${stats.total_salary.toLocaleString()}`, icon: TrendingUp, bg: '#f5f3ff', color: '#6366f1' },
        { label: 'Discharged Assets', value: `৳${stats.paid_salary.toLocaleString()}`, icon: CheckCircle2, bg: '#f0fdf4', color: '#16a34a' },
        { label: 'Temporal Pending', value: `৳${stats.pending_salary.toLocaleString()}`, icon: Clock, bg: '#fffbeb', color: '#f59e0b' },
    ];

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Payroll" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
                
                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '3px' }}>
                            <Wallet size={16} color="#a78bfa" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Financial Matrix</span>
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Payroll Records</h1>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '3px 0 0' }}>Manage temporal salary vectors and attendance deductions</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                        <Link href={route('payroll.sheet', { month, year })} target="_blank">
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '0.6rem 1.125rem',
                                background: '#fff', border: '1.5px solid #ede9fe',
                                borderRadius: '12px', color: '#6366f1',
                                fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 1px 6px rgba(99,102,241,0.07)',
                            }}>
                                <Printer size={15} /> Print Manifest
                            </button>
                        </Link>
                        <button onClick={() => setIsGenerateModalOpen(true)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '0.6rem 1.25rem',
                                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                border: 'none', borderRadius: '12px', color: '#fff',
                                fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                            }}>
                            <Zap size={16} /> Sync Salaries
                        </button>
                    </div>
                </div>

                {/* ── Stats ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }}>
                    {statCards.map((s, i) => (
                        <div key={i} style={{ ...card, padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <s.icon size={20} color={s.color} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>{s.label}</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b', margin: 0, lineHeight: 1.2 }}>{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Filters ── */}
                <div style={{ ...card, padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ flex: 1, minWidth: '180px', position: 'relative' }}>
                            <Calendar size={14} color="#a78bfa" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
                            <select value={month} onChange={e => setMonth(e.target.value)} style={{ ...selectStyle, width: '100%', paddingLeft: '2.2rem' }} onFocus={onFocus} onBlur={onBlur}>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                    <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('en-US', { month: 'long' })}</option>
                                ))}
                            </select>
                        </div>
                        <select value={year} onChange={e => setYear(e.target.value)} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <select value={status} onChange={e => setStatus(e.target.value)} style={selectStyle} onFocus={onFocus} onBlur={onBlur}>
                            <option value="">Global State</option>
                            <option value="paid">Finalized</option>
                            <option value="pending">Queued</option>
                        </select>
                        <button onClick={handleFilter} style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '0.6rem 1.125rem', background: '#1e1b4b',
                            border: 'none', borderRadius: '10px', color: '#fff',
                            fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                        }}>
                            <Search size={15} /> Execute Scan
                        </button>
                    </div>
                </div>

                {/* ── Table Header Indications ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 1.25rem', marginBottom: '-0.5rem' }}>
                    <div style={{ width: '44px' }}></div>
                    <div style={{ flex: 2, minWidth: '160px' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>Operative</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', width: '135px', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>Trace</span>
                    </div>
                    <div style={{ width: '94px', textAlign: 'right' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>Base Pay</span>
                    </div>
                    <div style={{ width: '110px', textAlign: 'right' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>Net Salary</span>
                    </div>
                    <div style={{ width: '85px', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>State</span>
                    </div>
                    <div style={{ width: '80px', textAlign: 'right' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>Auth</span>
                    </div>
                </div>

                {/* ── Records ── */}
                {payrolls.data.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {payrolls.data.map(payroll => {
                            const cfg = getStatus(payroll.status);
                            return (
                                <div key={payroll.id} style={{
                                    ...card, padding: '1rem 1.25rem',
                                    display: 'flex', alignItems: 'center',
                                    gap: '1rem', flexWrap: 'wrap',
                                    transition: 'box-shadow 0.15s, transform 0.15s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 22px rgba(99,102,241,0.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    {/* Operative Node */}
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#6366f1', border: '1.5px solid #ede9fe' }}>
                                        {payroll.employee.first_name?.[0]}
                                    </div>
                                    <div style={{ flex: 2, minWidth: '160px' }}>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e1b4b', margin: 0 }}>{payroll.employee.first_name} {payroll.employee.last_name}</p>
                                        <p style={{ fontSize: '0.68rem', color: '#9ca3af', fontWeight: 600, margin: '2px 0 0' }}>{payroll.employee.employee_id} • {payroll.employee.department}</p>
                                    </div>

                                    {/* Status Trace */}
                                    <div style={{ display: 'flex', gap: '4px', width: '135px', justifyContent: 'center', flexShrink: 0 }}>
                                        <div title="Present" style={{ padding: '3px 8px', background: '#f0fdf4', color: '#16a34a', borderRadius: '12px', fontSize: '0.68rem', fontWeight: 800 }}>P:{payroll.present_days}</div>
                                        <div title="Absent" style={{ padding: '3px 8px', background: '#fff1f2', color: '#ef4444', borderRadius: '12px', fontSize: '0.68rem', fontWeight: 800 }}>A:{payroll.absent_days}</div>
                                        <div title="Late" style={{ padding: '3px 8px', background: '#fffbeb', color: '#f59e0b', borderRadius: '12px', fontSize: '0.68rem', fontWeight: 800 }}>L:{payroll.late_days}</div>
                                    </div>

                                    {/* Base Magnitude */}
                                    <div style={{ textAlign: 'right', width: '94px', flexShrink: 0 }}>
                                        <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#6b7280', margin: 0 }}>৳{parseFloat(payroll.base_salary).toLocaleString()}</p>
                                    </div>

                                    {/* Net Vector */}
                                    <div style={{ textAlign: 'right', width: '110px', flexShrink: 0 }}>
                                        <p style={{ fontSize: '1rem', fontWeight: 900, color: '#4338ca', margin: 0 }}>৳{parseFloat(payroll.total).toLocaleString()}</p>
                                    </div>

                                    {/* State Badge */}
                                    <div style={{ width: '85px', textAlign: 'center', flexShrink: 0 }}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.7rem', fontWeight: 700, color: cfg.color, background: cfg.bg, padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>
                                            {cfg.label}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '4px', width: '80px', justifyContent: 'flex-end', flexShrink: 0 }}>
                                        <button onClick={() => openEditModal(payroll)} title="Override" style={iconBtn('#f9fafb', '#64748b')}><Edit size={14} /></button>
                                        {payroll.status === 'pending' && (
                                            <button onClick={() => markAsPaid(payroll.id)} title="Discharge" style={iconBtn('#f0fdf4', '#16a34a')}><ShieldCheck size={16} /></button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 1rem', border: '2px dashed #ede9fe', borderRadius: '18px' }}>
                        <Inbox size={40} color="#e0d9ff" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1b4b', margin: '0 0 0.4rem' }}>Vector Matrix Void</h3>
                        <p style={{ fontSize: '0.82rem', color: '#9ca3af', margin: '0 0 1.5rem' }}>Generate temporal salary vectors for the selected period.</p>
                        <button onClick={() => setIsGenerateModalOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.625rem 1.25rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                            <Plus size={15} /> First Sync
                        </button>
                    </div>
                )}

                {/* ── Pagination ── */}
                {payrolls.links && payrolls.links.length > 3 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', ...card, padding: '0.875rem 1.25rem' }}>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: 0 }}>
                            Page <strong style={{ color: '#1e1b4b' }}>{payrolls.current_page}</strong> of <strong style={{ color: '#1e1b4b' }}>{payrolls.last_page}</strong>
                        </p>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {payrolls.links.map((link, i) => link.url ? (
                                <Link key={i} href={link.url} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '34px', height: '34px', padding: '0 8px', borderRadius: '9px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', background: link.active ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#f5f3ff', color: link.active ? '#fff' : '#6366f1' }} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : (
                                <span key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '34px', height: '34px', padding: '0 8px', borderRadius: '9px', fontSize: '0.78rem', fontWeight: 700, background: '#f9fafb', color: '#d1d5db' }} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* SYNC MODAL */}
            <Modal show={isGenerateModalOpen} onClose={() => !processingGeneration && setIsGenerateModalOpen(false)} maxWidth="sm">
                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}><Zap size={20} /></div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Temporal Vector Sync</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div><label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Month</label><select value={month} onChange={e => setMonth(e.target.value)} style={{ ...selectStyle, width: '100%' }}>{Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('en-US', { month: 'long' })}</option>)}</select></div>
                        <div><label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Year</label><select value={year} onChange={e => setYear(e.target.value)} style={{ ...selectStyle, width: '100%' }}>{[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}</select></div>
                    </div>
                    <button onClick={handleGenerate} disabled={processingGeneration} style={{ width: '100%', height: '48px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(99,102,241,0.25)' }}>
                        {processingGeneration ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />} EXECUTE GENERATION
                    </button>
                </div>
            </Modal>

            {/* OVERRIDE MODAL */}
            <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="md">
                <form onSubmit={handleUpdate} style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}><AlertTriangle size={20} /></div>
                        <div><h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Vector Override</h3><p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', margin: 0 }}>{selectedPayroll?.employee?.first_name} {selectedPayroll?.employee?.last_name}</p></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
                        <div><label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Bonus Node</label><input type="number" value={editForm.data.bonus} onChange={e => editForm.setData('bonus', e.target.value)} style={{ width: '100%', height: '40px', padding: '0 0.75rem', border: '1.5px solid #ede9fe', borderRadius: '10px', background: '#f9f7ff', fontSize: '0.82rem', fontWeight: 700 }} /></div>
                        <div><label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Ded. Node</label><input type="number" value={editForm.data.deductions} onChange={e => editForm.setData('deductions', e.target.value)} style={{ width: '100%', height: '40px', padding: '0 0.75rem', border: '1.5px solid #ede9fe', borderRadius: '10px', background: '#f9f7ff', fontSize: '0.82rem', fontWeight: 700 }} /></div>
                        <div><label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Late Penalty</label><input type="number" value={editForm.data.late_deduction} onChange={e => editForm.setData('late_deduction', e.target.value)} style={{ width: '100%', height: '40px', padding: '0 0.75rem', border: '1.5px solid #ede9fe', borderRadius: '10px', background: '#f9f7ff', fontSize: '0.82rem', fontWeight: 700 }} /></div>
                        <div><label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Abs. Penalty</label><input type="number" value={editForm.data.absent_deduction} onChange={e => editForm.setData('absent_deduction', e.target.value)} style={{ width: '100%', height: '40px', padding: '0 0.75rem', border: '1.5px solid #ede9fe', borderRadius: '10px', background: '#f9f7ff', fontSize: '0.82rem', fontWeight: 700 }} /></div>
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}><label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>State Vector</label><select value={editForm.data.status} onChange={e => editForm.setData('status', e.target.value)} style={{ ...selectStyle, width: '100%' }}><option value="pending">Queued</option><option value="paid">Finalized</option><option value="cancelled">Aborted</option></select></div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}><button type="button" onClick={() => setIsEditModalOpen(false)} style={{ flex: 1, padding: '0.625rem', border: '1.5px solid #ede9fe', borderRadius: '10px', color: '#64748b', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>Abort</button><button type="submit" style={{ flex: 2, padding: '0.625rem', background: '#1e1b4b', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Save size={15} /> Commit Vectors</button></div>
                </form>
            </Modal>

            <style>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </FigmaLayout>
    );
}
