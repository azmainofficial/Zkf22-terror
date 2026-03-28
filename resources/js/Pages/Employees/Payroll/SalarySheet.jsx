import React from 'react';
import { Head } from '@inertiajs/react';
import { Printer, ShieldCheck, Zap, Activity, Building2, User } from 'lucide-react';

export default function SalarySheet({ payrolls, month, year }) {
    const handlePrint = () => { window.print(); };

    const monthName = new Date(0, month - 1).toLocaleString('en-US', { month: 'long' }).toUpperCase();
    const totalBase = payrolls.reduce((sum, p) => sum + parseFloat(p.base_salary), 0);
    const totalBonus = payrolls.reduce((sum, p) => sum + parseFloat(p.bonus), 0);
    const totalDeductions = payrolls.reduce((sum, p) => {
        return sum + (parseFloat(p.deductions) + parseFloat(p.late_deduction) + parseFloat(p.absent_deduction));
    }, 0);
    const totalNet = payrolls.reduce((sum, p) => sum + parseFloat(p.total), 0);

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', color: '#1e293b', padding: '40px', fontFamily: 'sans-serif' }} className="manifest-container">
            <Head title={`Salary Manifest - ${monthName} ${year}`} />

            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Print Control Surface */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '24px', background: '#fff', borderRadius: '24px', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }} className="print-hidden">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Activity size={20} /></div>
                        <div>
                            <h3 style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Salary Manifest</h3>
                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0, fontWeight: 700 }}>{monthName} {year} • BIOMETRIC SYNC ACTIVE</p>
                        </div>
                    </div>
                    <button onClick={handlePrint} style={{ height: '44px', padding: '0 24px', borderRadius: '12px', background: '#1e293b', color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Printer size={16} /> PRINT MANIFEST
                    </button>
                </div>

                {/* Fiscal Manifest Surface */}
                <div style={{ background: '#fff', padding: '60px', borderRadius: '32px', border: '1.5px solid #f1f5f9', position: 'relative', overflow: 'hidden' }}>
                    {/* Header Entity */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <div style={{ width: '4px', height: '32px', background: '#4f46e5', borderRadius: '2px' }} />
                                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>Salary Manifest</h1>
                            </div>
                            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.3em', paddingLeft: '16px', textTransform: 'uppercase' }}>Period: {monthName} {year}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Release Synchronization</p>
                            <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', color: '#10b981', marginTop: '6px' }}>
                                <ShieldCheck size={14} />
                                <span style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase' }}>Verified System Sync</span>
                            </div>
                        </div>
                    </div>

                    {/* Table Ledger */}
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#0f172a', color: '#fff' }}>
                                <th style={{ padding: '20px', textAlign: 'left', borderRadius: '12px 0 0 0', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Operative</th>
                                <th style={{ padding: '20px', textAlign: 'center', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Trace (P/A/L)</th>
                                <th style={{ padding: '20px', textAlign: 'right', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Base Pay</th>
                                <th style={{ padding: '20px', textAlign: 'right', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Deductions</th>
                                <th style={{ padding: '20px', textAlign: 'right', borderRadius: '0 12px 0 0', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Net Vector</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payrolls.map((payroll) => {
                                const deductions = parseFloat(payroll.deductions) + parseFloat(payroll.late_deduction) + parseFloat(payroll.absent_deduction);
                                return (
                                    <tr key={payroll.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '20px' }}>
                                            <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase' }}>{payroll.employee.first_name} {payroll.employee.last_name}</p>
                                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '2px 0 0', fontWeight: 700 }}>{payroll.employee.employee_id} • {payroll.employee.designation}</p>
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'center' }}>
                                            <div style={{ display: 'inline-flex', gap: '8px', fontSize: '0.7rem', fontWeight: 900, color: '#64748b', background: '#f8fafc', padding: '6px 14px', borderRadius: '10px' }}>
                                                <span style={{ color: '#10b981' }}>{payroll.present_days}P</span>
                                                <span style={{ color: '#ef4444' }}>{payroll.absent_days}A</span>
                                                <span style={{ color: '#f59e0b' }}>{payroll.late_days}L</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>৳{parseFloat(payroll.base_salary).toLocaleString()}</td>
                                        <td style={{ padding: '20px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 800, color: '#ef4444' }}>-৳{deductions.toLocaleString()}</td>
                                        <td style={{ padding: '20px', textAlign: 'right', fontSize: '1rem', fontWeight: 900, color: '#4f46e5' }}>৳{parseFloat(payroll.total).toLocaleString()}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr style={{ background: '#f8fafc', borderTop: '2.5px solid #0f172a' }}>
                                <td colSpan="2" style={{ padding: '30px', fontSize: '0.85rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Matrix Magnitude</td>
                                <td style={{ padding: '30px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 800, color: '#64748b' }}>৳{totalBase.toLocaleString()}</td>
                                <td style={{ padding: '30px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 900, color: '#ef4444' }}>-৳{totalDeductions.toLocaleString()}</td>
                                <td style={{ padding: '30px', textAlign: 'right', fontSize: '1.25rem', fontWeight: 900, color: '#fff', background: '#0f172a', borderRadius: '0 0 12px 0' }}>৳{totalNet.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Authorization Footer */}
                    <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '220px', height: '1.5px', background: '#0f172a', marginBottom: '8px' }} />
                            <p style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: '#0f172a' }}>Fiscal Initialization</p>
                            <p style={{ fontSize: '0.55rem', fontWeight: 700, color: '#94a3b8' }}>PREPARED BY OPERATIVE</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '220px', height: '1.5px', background: '#0f172a', marginBottom: '8px' }} />
                            <p style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: '#0f172a' }}>Command Authorization</p>
                            <p style={{ fontSize: '0.55rem', fontWeight: 700, color: '#94a3b8' }}>VERIFIED BY STARATEGIC CONTROL</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    body { background: white !important; padding: 0 !important; }
                    .manifest-container { background: white !important; padding: 0 !important; }
                    .print-hidden { display: none !important; }
                    .manifest-surface { border: none !important; box-shadow: none !important; padding: 0 !important; }
                }
            `}</style>
        </div>
    );
}
