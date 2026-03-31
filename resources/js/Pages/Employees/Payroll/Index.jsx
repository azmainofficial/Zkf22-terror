import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    Wallet, Zap, Printer, PieChart, CheckCircle2, Clock, Calendar, ChevronDown,
    Search, Filter, X, Edit, ShieldCheck, TrendingUp, Inbox, Save, AlertTriangle, 
    AlertCircle, Trash2, FileSpreadsheet, Loader2, Plus, ArrowRight, Activity,
    Layers, LayoutGrid, FileText, Award
} from 'lucide-react';
import Modal from '@/Components/Modal';

const STATUS_CONFIG = {
    paid:      { label: 'Finalized', bg: '#f0fdf4', color: '#10b981', icon: CheckCircle2 },
    pending:   { label: 'Queued',    bg: '#fffbeb', color: '#f59e0b', icon: Clock },
    cancelled: { label: 'Cancelled', bg: '#fef2f2', color: '#ef4444', icon: X },
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
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: bg, color, border: 'none', cursor: 'pointer',
        transition: 'all 0.2s'
    })
};

export default function Index({ auth, payrolls, filters, stats }) {
    const [month, setMonth] = useState(filters.month || new Date().getMonth() + 1);
    const [year, setYear] = useState(filters.year || new Date().getFullYear());
    const [status, setStatus] = useState(filters.status || '');
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [processingGeneration, setProcessingGeneration] = useState(false);
    
    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPayroll, setSelectedPayroll] = useState(null);
    const monthName = new Date(0, month - 1).toLocaleString('en-US', { month: 'long' });
    const editForm = useForm({
        status: '', bonus: 0, deductions: 0, late_deduction: 0, absent_deduction: 0,
        conveyance: 0, house_rent: 0, medical_allowance: 0, supervision_allowance: 0,
        construction_allowance: 0, mobile_allowance: 0, overtime_pay: 0, snacks_allowance: 0,
        advance_salary: 0, loan_installment: 0, fund_source: 'SEC',
        payment_method: 'cash', note: ''
    });

    const handleFilter = (e) => {
        if (e) e.preventDefault();
        router.get(route('payroll.index'), { month, year, status }, { preserveState: true });
    };

    const handleGenerate = (e) => {
        e.preventDefault();
        setProcessingGeneration(true);
        router.post(route('payroll.generate'), { month, year }, {
            onSuccess: () => { setIsGenerateModalOpen(false); setProcessingGeneration(false); },
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
            conveyance: parseFloat(payroll.conveyance) || 0,
            house_rent: parseFloat(payroll.house_rent) || 0,
            medical_allowance: parseFloat(payroll.medical_allowance) || 0,
            supervision_allowance: parseFloat(payroll.supervision_allowance) || 0,
            construction_allowance: parseFloat(payroll.construction_allowance) || 0,
            mobile_allowance: parseFloat(payroll.mobile_allowance) || 0,
            overtime_pay: parseFloat(payroll.overtime_pay) || 0,
            snacks_allowance: parseFloat(payroll.snacks_allowance) || 0,
            advance_salary: parseFloat(payroll.advance_salary) || 0,
            loan_installment: parseFloat(payroll.loan_installment) || 0,
            fund_source: payroll.fund_source || 'SEC',
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
        if (confirm('Verify: Authorized payment discharge for this member?')) {
            router.patch(route('payroll.update', id), { 
                status: 'paid', 
                payment_date: new Date().toISOString().split('T')[0] 
            });
        }
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Payroll Management" />

            <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '4rem' }}>
                
                {/* ── HEADER ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
                            Payroll & Salaries
                        </h1>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500, margin: '4px 0 0' }}>
                            View and manage monthly monthly salaries and attendance deductions
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <a href={route('payroll.export', { month, year, status })} target="_blank" style={{ textDecoration: 'none' }}>
                            <button style={secondaryBtn}><FileSpreadsheet size={18} /> Download Excel</button>
                        </a>
                        <Link href={route('payroll.sheet', { month, year })}>
                            <button style={secondaryBtn}><Printer size={18} /> Print Sheet</button>
                        </Link>
                        <button onClick={() => setIsGenerateModalOpen(true)} style={primaryBtn}>
                            <Zap size={18} /> Sync Salaries
                        </button>
                    </div>
                </div>

                {/* ── METRIC STRIP ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    {[
                        { label: 'Total Salary Budget', value: `৳${stats.total_salary.toLocaleString()}`, icon: TrendingUp, bg: '#f5f3ff', color: '#6366f1' },
                        { label: 'Amount Already Paid', value: `৳${stats.paid_salary.toLocaleString()}`, icon: CheckCircle2, bg: '#f0fdf4', color: '#16a34a' },
                        { label: 'Pending Approval', value: `৳${stats.pending_salary.toLocaleString()}`, icon: Clock, bg: '#fffbeb', color: '#f59e0b' },
                    ].map((stat, i) => (
                        <div key={i} style={styles.card}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>{stat.label}</p>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <stat.icon size={20} />
                                </div>
                            </div>
                            <h4 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '8px 0 0' }}>{stat.value}</h4>
                        </div>
                    ))}
                </div>

                {/* ── FILTER HUD ── */}
                <div style={{ ...styles.card, padding: '20px', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 140px', gap: '1.25rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Calendar size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <select value={month} onChange={e => setMonth(e.target.value)} style={filterInput}>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                    <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('en-US', { month: 'long' })}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} color="#94a3b8" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Layers size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <select value={year} onChange={e => setYear(e.target.value)} style={filterInput}>
                                {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <ChevronDown size={14} color="#94a3b8" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Activity size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <select value={status} onChange={e => setStatus(e.target.value)} style={filterInput}>
                                <option value="">Any Status</option>
                                <option value="paid">Already Paid</option>
                                <option value="pending">Pending/Queued</option>
                            </select>
                            <ChevronDown size={14} color="#94a3b8" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                        <button onClick={handleFilter} style={{ height: '44px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}>
                            Filter Records
                        </button>
                    </div>
                </div>

                {/* ── PAYROLL LIST ── */}
                <div style={styles.card}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 1.25rem', marginBottom: '1rem' }}>
                        <div style={{ width: '44px' }}></div>
                        <div style={{ flex: 1.5, minWidth: '160px' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>In-Office Member</span>
                        </div>
                        <div style={{ flex: 2 }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>Earnings Trace (Allowances)</span>
                        </div>
                        <div style={{ flex: 1.5 }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>Recoveries / Penalties</span>
                        </div>
                        <div style={{ width: '90px', textAlign: 'right' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>Final Pay</span>
                        </div>
                        <div style={{ width: '85px', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>Status</span>
                        </div>
                        <div style={{ width: '80px', textAlign: 'right' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>Action</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {payrolls.data.length > 0 ? payrolls.data.map((payroll, i) => {
                            const cfg = STATUS_CONFIG[payroll.status.toLowerCase()] || STATUS_CONFIG.pending;
                            const penalty = parseFloat(payroll.late_deduction) + parseFloat(payroll.absent_deduction);
                            
                            return (
                                <div key={payroll.id} className="payroll-row" style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', padding: '16px', borderRadius: '12px',
                                    transition: 'all 0.2s', borderBottom: i === payrolls.data.length - 1 ? 'none' : '1px solid #f8fafc',
                                    gap: '1rem'
                                }}>
                                    {/* IDENTITY */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1.5, minWidth: '160px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, color: '#6366f1' }}>
                                            {payroll.employee.first_name?.[0]}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{payroll.employee.first_name} {payroll.employee.last_name}</p>
                                            <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
                                                <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>P:{payroll.present_days}</span>
                                                <span style={{ background: '#fff1f2', color: '#e11d48', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>A:{payroll.absent_days}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* EARNINGS TRACE */}
                                    <div style={{ flex: 2, display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                        {[
                                            { label: 'TA', val: payroll.conveyance, color: '#059669' },
                                            { label: 'Rent', val: payroll.house_rent, color: '#10b981' },
                                            { label: 'Med', val: payroll.medical_allowance, color: '#34d399' },
                                            { label: 'Spv', val: payroll.supervision_allowance, color: '#6366f1' },
                                            { label: 'Cst', val: payroll.construction_allowance, color: '#4f46e5' },
                                            { label: 'Mob', val: payroll.mobile_allowance, color: '#8b5cf6' },
                                            { label: 'OT', val: payroll.overtime_pay, color: '#a855f7' },
                                            { label: 'Snk', val: payroll.snacks_allowance, color: '#d946ef' },
                                        ].filter(item => parseFloat(item.val) > 0).map((item, idx) => (
                                            <div key={idx} style={{ 
                                                display: 'flex', alignItems: 'center', gap: '3px',
                                                background: `${item.color}08`, border: `1px solid ${item.color}20`,
                                                padding: '2px 6px', borderRadius: '5px'
                                            }}>
                                                <span style={{ fontSize: '0.55rem', fontWeight: 900, color: item.color, textTransform: 'uppercase' }}>{item.label}</span>
                                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#334155' }}>{parseFloat(item.val).toLocaleString()}</span>
                                            </div>
                                        ))}
                                        {parseFloat(payroll.bonus) > 0 && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: '#f0fdf4', border: '1px solid #10b98130', padding: '2px 6px', borderRadius: '5px' }}>
                                                <span style={{ fontSize: '0.55rem', fontWeight: 900, color: '#10b981', textTransform: 'uppercase' }}>Bonus</span>
                                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#065f46' }}>{parseFloat(payroll.bonus).toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* RECOVERIES TRACE */}
                                    <div style={{ flex: 1.5, display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                        {[
                                            { label: 'Adv', val: payroll.advance_salary, color: '#ef4444' },
                                            { label: 'Loan', val: payroll.loan_installment, color: '#dc2626' },
                                            { label: 'Late', val: payroll.late_deduction, color: '#f59e0b' },
                                            { label: 'Abs', val: payroll.absent_deduction, color: '#ef4444' },
                                        ].filter(item => parseFloat(item.val) > 0).map((item, idx) => (
                                            <div key={idx} style={{ 
                                                display: 'flex', alignItems: 'center', gap: '3px',
                                                background: `${item.color}08`, border: `1px solid ${item.color}20`,
                                                padding: '2px 6px', borderRadius: '5px'
                                            }}>
                                                <span style={{ fontSize: '0.55rem', fontWeight: 900, color: item.color, textTransform: 'uppercase' }}>{item.label}</span>
                                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#334155' }}>{parseFloat(item.val).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* FINAL PAY */}
                                    <div style={{ width: '90px', textAlign: 'right' }}>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', margin: 0, textTransform: 'uppercase' }}>Net Pay</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>৳{parseFloat(payroll.total).toLocaleString()}</p>
                                    </div>

                                    {/* STATUS */}
                                    <div style={{ width: '85px', display: 'flex', justifyContent: 'center' }}>
                                        <span style={{ 
                                            background: cfg.bg, color: cfg.color, 
                                            fontSize: '0.6rem', fontWeight: 900, 
                                            padding: '4px 10px', borderRadius: '8px',
                                            textTransform: 'uppercase', letterSpacing: '0.02em'
                                        }}>
                                            {cfg.label}
                                        </span>
                                    </div>

                                    {/* ACTIONS */}
                                    <div style={{ width: '80px', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                        <button onClick={() => openEditModal(payroll)} style={styles.actionBtn('#f8fafc', '#64748b')} title="Override"><Edit size={16} /></button>
                                        {payroll.status === 'pending' && (
                                            <button onClick={() => markAsPaid(payroll.id)} style={styles.actionBtn('#eff6ff', '#4f46e5')} title="Verify Discharge"><ShieldCheck size={18} /></button>
                                        )}
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                                <Inbox size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#64748b', margin: 0 }}>No salary records found</h4>
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>Sync salaries for the current period or check selected filters</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── PAGINATION ── */}
                {payrolls.links && payrolls.links.length > 3 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
                        <div style={{ display: 'flex', background: '#fff', padding: '6px', borderRadius: '14px', border: '1px solid #f1f5f9', gap: '4px' }}>
                            {payrolls.links.map((link, i) => (
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

            {/* ── MODALS ── */}
            <Modal show={isGenerateModalOpen} onClose={() => !processingGeneration && setIsGenerateModalOpen(false)} maxWidth="sm">
                <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}><Zap size={20} /></div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Sync Salary Records</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <label style={modalLabel}>Select Month</label>
                            <select value={month} onChange={e => setMonth(e.target.value)} style={modalInp}>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('en-US', { month: 'long' })}</option>)}
                            </select>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <label style={modalLabel}>Select Year</label>
                            <select value={year} onChange={e => setYear(e.target.value)} style={modalInp}>
                                {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={handleGenerate} disabled={processingGeneration} style={modalSubmitStyle}>
                        {processingGeneration ? <Loader2 size={18} className="animate-spin" /> : 'START SYNC'}
                    </button>
                </div>
            </Modal>

            <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="xl">
                <form onSubmit={handleUpdate} style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                                <Award size={28} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Salary Override</h3>
                                <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, margin: '2px 0 0' }}>
                                    {selectedPayroll?.employee?.first_name} {selectedPayroll?.employee?.last_name} • {selectedPayroll?.employee?.designation}
                                </p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Period</p>
                            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{monthName} {year}</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '40px' }}>
                        {/* ALLOWANCES SECTION */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                                <Plus size={16} color="#10b981" />
                                <h4 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Earnings & Allowances</h4>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div><label style={modalLabel}>Conveyance TA/DA</label><input type="number" step="0.01" value={editForm.data.conveyance} onChange={e => editForm.setData('conveyance', e.target.value)} style={modalInp} /></div>
                                <div><label style={modalLabel}>Home Rent</label><input type="number" step="0.01" value={editForm.data.house_rent} onChange={e => editForm.setData('house_rent', e.target.value)} style={modalInp} /></div>
                                <div><label style={modalLabel}>Medical Allowance</label><input type="number" step="0.01" value={editForm.data.medical_allowance} onChange={e => editForm.setData('medical_allowance', e.target.value)} style={modalInp} /></div>
                                <div><label style={modalLabel}>Supervision</label><input type="number" step="0.01" value={editForm.data.supervision_allowance} onChange={e => editForm.setData('supervision_allowance', e.target.value)} style={modalInp} /></div>
                                <div><label style={modalLabel}>Construction</label><input type="number" step="0.01" value={editForm.data.construction_allowance} onChange={e => editForm.setData('construction_allowance', e.target.value)} style={modalInp} /></div>
                                <div><label style={modalLabel}>Mobile Bill</label><input type="number" step="0.01" value={editForm.data.mobile_allowance} onChange={e => editForm.setData('mobile_allowance', e.target.value)} style={modalInp} /></div>
                                <div><label style={modalLabel}>Overtime Pay</label><input type="number" step="0.01" value={editForm.data.overtime_pay} onChange={e => editForm.setData('overtime_pay', e.target.value)} style={modalInp} /></div>
                                <div><label style={modalLabel}>Snacks Bill</label><input type="number" step="0.01" value={editForm.data.snacks_allowance} onChange={e => editForm.setData('snacks_allowance', e.target.value)} style={modalInp} /></div>
                            </div>

                            <div style={{ marginTop: '2rem', padding: '16px', background: '#f0fdf4', borderRadius: '14px', border: '1px solid #dcfce7' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#166534' }}>Estimated Gross</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 950, color: '#166534' }}>৳{(
                                        parseFloat(selectedPayroll?.base_salary || 0) + 
                                        parseFloat(editForm.data.conveyance || 0) + 
                                        parseFloat(editForm.data.house_rent || 0) + 
                                        parseFloat(editForm.data.medical_allowance || 0) + 
                                        parseFloat(editForm.data.supervision_allowance || 0) + 
                                        parseFloat(editForm.data.construction_allowance || 0) + 
                                        parseFloat(editForm.data.mobile_allowance || 0) + 
                                        parseFloat(editForm.data.overtime_pay || 0) + 
                                        parseFloat(editForm.data.snacks_allowance || 0)
                                    ).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* DEDUCTIONS SECTION */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                                <Trash2 size={16} color="#ef4444" />
                                <h4 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recoveries & Deductions</h4>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div><label style={modalLabel}>Advance Salary</label><input type="number" step="0.01" value={editForm.data.advance_salary} onChange={e => editForm.setData('advance_salary', e.target.value)} style={modalInp} /></div>
                                    <div><label style={modalLabel}>Loan Installment</label><input type="number" step="0.01" value={editForm.data.loan_installment} onChange={e => editForm.setData('loan_installment', e.target.value)} style={modalInp} /></div>
                                    <div><label style={modalLabel}>Late Penalty</label><input type="number" step="0.01" value={editForm.data.late_deduction} onChange={e => editForm.setData('late_deduction', e.target.value)} style={modalInp} /></div>
                                    <div><label style={modalLabel}>Absent Penalty</label><input type="number" step="0.01" value={editForm.data.absent_deduction} onChange={e => editForm.setData('absent_deduction', e.target.value)} style={modalInp} /></div>
                                </div>
                                <div><label style={modalLabel}>Source of Fund</label><input type="text" value={editForm.data.fund_source} onChange={e => editForm.setData('fund_source', e.target.value)} style={modalInp} placeholder="e.g. SEC" /></div>
                                <div><label style={modalLabel}>Payment Status</label>
                                    <select value={editForm.data.status} onChange={e => editForm.setData('status', e.target.value)} style={modalInp}>
                                        <option value="pending">Pending Review</option>
                                        <option value="paid">Mark as Paid</option>
                                        <option value="cancelled">Dispute/Cancel</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '3rem' }}>
                        <button type="button" onClick={() => setIsEditModalOpen(false)} style={modalSecondaryBtn}>ABORT CHANGES</button>
                        <button type="submit" style={modalSubmitStyle}>SAVE FISCAL RECORD</button>
                    </div>
                </form>
            </Modal>
            
            <style>{`
                .payroll-row:hover { background: #f8fafc !important; transform: translateX(4px); }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
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

const primaryBtn = { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#4f46e5', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(79,70,229,0.2)' };
const secondaryBtn = { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', color: '#475569', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' };
const modalLabel = { fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', display: 'block', letterSpacing: '0.05em' };
const modalInp = { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f1f5f9', background: '#f8fafc', fontSize: '0.9rem', fontWeight: 600, outline: 'none' };
const modalSubmitStyle = { flex: 2, height: '48px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };
const modalSecondaryBtn = { flex: 1, padding: '12px', border: '1.5px solid #f1f5f9', background: 'transparent', borderRadius: '12px', color: '#64748b', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' };
