import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Printer, ArrowLeft } from 'lucide-react';

const fmt = (v) => parseFloat(v || 0).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function SalarySlip({ payroll, monthName, company }) {
    const emp = payroll.employee;
    const accent = company.accent || '#4f46e5';
    const font   = company.font   || 'Inter';

    const totalOther = (
        parseFloat(payroll.supervision_allowance  || 0) +
        parseFloat(payroll.construction_allowance || 0) +
        parseFloat(payroll.mobile_allowance       || 0) +
        parseFloat(payroll.snacks_allowance       || 0)
    );
    const totalDeductions = (
        parseFloat(payroll.advance_salary   || 0) +
        parseFloat(payroll.loan_installment || 0) +
        parseFloat(payroll.late_deduction   || 0) +
        parseFloat(payroll.absent_deduction || 0) +
        parseFloat(payroll.deductions       || 0)
    );

    const SlipCopy = ({ label }) => (
        <div className="slip-copy" style={{ fontFamily: font, position: 'relative', overflow: 'hidden', boxSizing: 'border-box', padding: '28px 36px', display: 'flex', flexDirection: 'column', minHeight: '148.5mm' }}>

            {/* Watermark */}
            {company.watermark && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.04, pointerEvents: 'none', zIndex: 0 }}>
                    <img src={company.watermark} style={{ width: '55%', objectFit: 'contain' }} />
                </div>
            )}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2.5px solid ${accent}`, paddingBottom: '12px', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {company.logo
                        ? <img src={company.logo} style={{ height: '44px', objectFit: 'contain' }} />
                        : <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '1.1rem' }}>{company.name?.[0] || 'Z'}</div>
                    }
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{company.name}</h1>
                        {company.tagline && <p style={{ margin: '2px 0 0', fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>{company.tagline}</p>}
                        {company.address && <p style={{ margin: '1px 0 0', fontSize: '0.6rem', color: '#94a3b8', fontWeight: 500 }}>📍 {company.address}</p>}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Salary Slip</h2>
                    <p style={{ margin: '3px 0 0', fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>{monthName} {payroll.year}</p>
                    <span style={{ display: 'inline-block', marginTop: '4px', padding: '2px 8px', background: `${accent}18`, color: accent, fontSize: '0.6rem', fontWeight: 900, borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                </div>
            </div>

            {/* Employee Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px', fontSize: '0.72rem', background: '#f8fafc', borderRadius: '8px', padding: '10px 14px', position: 'relative', zIndex: 1 }}>
                <div><span style={{ color: '#94a3b8', fontWeight: 700 }}>Employee ID: </span><span style={{ fontWeight: 800, color: '#1e293b' }}>{emp.employee_id}</span></div>
                <div><span style={{ color: '#94a3b8', fontWeight: 700 }}>Name: </span><span style={{ fontWeight: 800, color: '#1e293b' }}>{emp.full_name}</span></div>
                <div><span style={{ color: '#94a3b8', fontWeight: 700 }}>Designation: </span><span style={{ fontWeight: 700, color: '#334155' }}>{emp.designation || 'N/A'}</span></div>
                <div><span style={{ color: '#94a3b8', fontWeight: 700 }}>Department: </span><span style={{ fontWeight: 700, color: '#334155' }}>{emp.department || 'N/A'}</span></div>
                <div><span style={{ color: '#94a3b8', fontWeight: 700 }}>Pay Date: </span><span style={{ fontWeight: 700, color: '#334155' }}>{payroll.payment_date || '—'}</span></div>
                <div><span style={{ color: '#94a3b8', fontWeight: 700 }}>Pay Method: </span><span style={{ fontWeight: 700, color: '#334155' }}>{payroll.payment_method?.toUpperCase() || '—'}</span></div>
                <div><span style={{ color: '#94a3b8', fontWeight: 700 }}>Present Days: </span><span style={{ fontWeight: 700, color: '#334155' }}>{payroll.present_days} / {payroll.total_days}</span></div>
                <div><span style={{ color: '#94a3b8', fontWeight: 700 }}>Status: </span>
                    <span style={{ padding: '1px 7px', borderRadius: '10px', fontSize: '0.6rem', fontWeight: 900, background: payroll.status === 'paid' ? '#dcfce7' : '#fef9c3', color: payroll.status === 'paid' ? '#166534' : '#854d0e' }}>{payroll.status.toUpperCase()}</span>
                </div>
            </div>

            {/* Earnings & Deductions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flex: 1, position: 'relative', zIndex: 1 }}>
                {/* Earnings */}
                <div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 900, color: accent, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px', borderBottom: `1.5px solid ${accent}`, paddingBottom: '4px' }}>Earnings</div>
                    <table style={{ width: '100%', fontSize: '0.7rem', borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr><td style={{ padding: '3px 0', color: '#475569' }}>Basic Salary</td><td style={{ textAlign: 'right', fontWeight: 700 }}>৳{fmt(payroll.base_salary)}</td></tr>
                            {parseFloat(payroll.conveyance)         > 0 && <tr><td style={{ padding: '3px 0', color: '#475569' }}>Conveyance</td><td style={{ textAlign: 'right', fontWeight: 700 }}>৳{fmt(payroll.conveyance)}</td></tr>}
                            {parseFloat(payroll.house_rent)         > 0 && <tr><td style={{ padding: '3px 0', color: '#475569' }}>House Rent</td><td style={{ textAlign: 'right', fontWeight: 700 }}>৳{fmt(payroll.house_rent)}</td></tr>}
                            {parseFloat(payroll.medical_allowance)  > 0 && <tr><td style={{ padding: '3px 0', color: '#475569' }}>Medical</td><td style={{ textAlign: 'right', fontWeight: 700 }}>৳{fmt(payroll.medical_allowance)}</td></tr>}
                            {parseFloat(payroll.overtime_pay)       > 0 && <tr><td style={{ padding: '3px 0', color: '#475569' }}>Overtime</td><td style={{ textAlign: 'right', fontWeight: 700 }}>৳{fmt(payroll.overtime_pay)}</td></tr>}
                            {parseFloat(payroll.bonus)              > 0 && <tr><td style={{ padding: '3px 0', color: '#475569' }}>Bonus</td><td style={{ textAlign: 'right', fontWeight: 700 }}>৳{fmt(payroll.bonus)}</td></tr>}
                            {totalOther > 0 && <tr><td style={{ padding: '3px 0', color: '#475569' }}>Other Allowances</td><td style={{ textAlign: 'right', fontWeight: 700 }}>৳{fmt(totalOther)}</td></tr>}
                            <tr style={{ borderTop: `1px solid ${accent}30` }}>
                                <td style={{ padding: '5px 0 0', fontWeight: 900, color: '#0f172a', fontSize: '0.72rem' }}>Gross Earnings</td>
                                <td style={{ textAlign: 'right', fontWeight: 900, color: accent, fontSize: '0.72rem', paddingTop: '5px' }}>৳{fmt((parseFloat(payroll.gross_pay || 0) + parseFloat(payroll.bonus || 0)))}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Deductions */}
                <div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px', borderBottom: '1.5px solid #fee2e2', paddingBottom: '4px' }}>Deductions</div>
                    <table style={{ width: '100%', fontSize: '0.7rem', borderCollapse: 'collapse' }}>
                        <tbody>
                            {parseFloat(payroll.advance_salary)   > 0 && <tr><td style={{ padding: '3px 0', color: '#475569' }}>Advance Salary</td><td style={{ textAlign: 'right', fontWeight: 700 }}>৳{fmt(payroll.advance_salary)}</td></tr>}
                            {parseFloat(payroll.loan_installment) > 0 && <tr><td style={{ padding: '3px 0', color: '#475569' }}>Loan Installment</td><td style={{ textAlign: 'right', fontWeight: 700 }}>৳{fmt(payroll.loan_installment)}</td></tr>}
                            {parseFloat(payroll.late_deduction)   > 0 && <tr><td style={{ padding: '3px 0', color: '#475569' }}>Late Penalty ({payroll.late_days}d)</td><td style={{ textAlign: 'right', fontWeight: 700 }}>৳{fmt(payroll.late_deduction)}</td></tr>}
                            {parseFloat(payroll.absent_deduction) > 0 && <tr><td style={{ padding: '3px 0', color: '#475569' }}>Absent Penalty ({payroll.absent_days}d)</td><td style={{ textAlign: 'right', fontWeight: 700 }}>৳{fmt(payroll.absent_deduction)}</td></tr>}
                            {parseFloat(payroll.deductions)       > 0 && <tr><td style={{ padding: '3px 0', color: '#475569' }}>Other Deductions</td><td style={{ textAlign: 'right', fontWeight: 700 }}>৳{fmt(payroll.deductions)}</td></tr>}
                            {totalDeductions === 0 && <tr><td style={{ padding: '3px 0', color: '#94a3b8', fontStyle: 'italic' }} colSpan={2}>No deductions</td></tr>}
                            <tr style={{ borderTop: '1px solid #fee2e2' }}>
                                <td style={{ padding: '5px 0 0', fontWeight: 900, color: '#0f172a', fontSize: '0.72rem' }}>Total Deductions</td>
                                <td style={{ textAlign: 'right', fontWeight: 900, color: '#ef4444', fontSize: '0.72rem', paddingTop: '5px' }}>৳{fmt(totalDeductions)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Net Pay */}
            <div style={{ background: `linear-gradient(135deg, ${accent}18, ${accent}08)`, border: `1.5px solid ${accent}30`, borderRadius: '10px', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', position: 'relative', zIndex: 1 }}>
                <div>
                    <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Payable Amount</p>
                    {payroll.fund_source && <p style={{ margin: '2px 0 0', fontSize: '0.6rem', color: '#94a3b8', fontWeight: 600 }}>Fund Source: {payroll.fund_source}</p>}
                </div>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: accent }}>৳{fmt(payroll.total)}</span>
            </div>

            {/* Bank Details */}
            {company.bank && (
                <div style={{ marginTop: '8px', padding: '8px 12px', background: '#f1f5f9', borderRadius: '7px', fontSize: '0.62rem', color: '#475569', fontWeight: 600, whiteSpace: 'pre-line', position: 'relative', zIndex: 1 }}>
                    <span style={{ fontWeight: 800, color: '#334155' }}>Bank Details: </span>{company.bank}
                </div>
            )}

            {/* Signature Lines */}
            {company.show_sig !== false && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '24px', position: 'relative', zIndex: 1 }}>
                    {['Prepared By', 'Accounts Dept.', 'Employee Signature'].map(s => (
                        <div key={s} style={{ textAlign: 'center' }}>
                            <div style={{ width: '110px', borderTop: '1px solid #94a3b8', paddingTop: '5px', fontSize: '0.62rem', fontWeight: 700, color: '#64748b' }}>{s}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer */}
            {company.footer && (
                <p style={{ margin: '8px 0 0', fontSize: '0.58rem', color: '#94a3b8', textAlign: 'center', fontWeight: 600, position: 'relative', zIndex: 1 }}>{company.footer}</p>
            )}
        </div>
    );

    return (
        <div style={{ background: '#e2e8f0', minHeight: '100vh' }}>
            <Head title={`Salary Slip — ${emp.full_name}`} />

            {/* Top Bar (hidden on print) */}
            <div className="no-print" style={{ background: '#1e1b4b', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => window.history.back()} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '7px 10px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600 }}>Salary Slip · {emp.full_name} · {monthName} {payroll.year}</span>
                </div>
                <button onClick={() => window.print()} style={{ background: '#6366f1', border: 'none', borderRadius: '10px', padding: '9px 20px', cursor: 'pointer', color: '#fff', fontWeight: 900, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                    <Printer size={18} /> Print Slip
                </button>
            </div>

            {/* A4 Paper */}
            <div style={{ width: '210mm', margin: '24px auto', background: '#fff', boxShadow: '0 4px 32px rgba(0,0,0,0.12)' }}>
                {/* Top: Employee Copy */}
                <SlipCopy label="Employee Copy" />

                {/* Divider */}
                <div style={{ borderTop: '2px dashed #cbd5e1', margin: '0 20px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '2px 12px', fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>✂ Cut Here</span>
                </div>

                {/* Bottom: Office Copy */}
                <SlipCopy label="Office / Accounts Copy" />
            </div>

            <style>{`
                @media print {
                    @page { size: A4 portrait; margin: 0; }
                    body { background: #fff !important; margin: 0; }
                    .no-print { display: none !important; }
                    div[style*="box-shadow"] { box-shadow: none !important; }
                    div[style*="margin: 24px"] { margin: 0 !important; }
                }
                * { box-sizing: border-box; }
            `}</style>
        </div>
    );
}
