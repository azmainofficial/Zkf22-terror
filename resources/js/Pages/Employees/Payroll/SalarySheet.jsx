import React from 'react';
import { Head } from '@inertiajs/react';

export default function SalarySheet({ payrolls, month, year }) {
    const handlePrint = () => { window.print(); };

    const monthName = new Date(0, month - 1).toLocaleString('en-US', { month: 'long' }).toUpperCase();
    
    // Totals
    const totals = {
        base: payrolls.reduce((s, p) => s + (parseFloat(p.base_salary) || 0), 0),
        gross: payrolls.reduce((s, p) => s + (parseFloat(p.gross_pay) || 0), 0),
        net: payrolls.reduce((s, p) => s + (parseFloat(p.total) || 0), 0),
    };

    return (
        <div style={{ background: '#f1f5f9', minHeight: '100vh', padding: '20px' }}>
            <Head title={`Skytouch Salary Sheet - ${monthName} ${year}`} />

            <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
                {/* Print Control */}
                <div className="print-hidden" style={{ background: '#fff', padding: '15px 30px', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Skytouch Salary Manifest</h2>
                    <button onClick={handlePrint} style={{ padding: '8px 24px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>PRINT SHEET</button>
                </div>

                {/* Sheet Surface */}
                <div style={{ background: '#fff', padding: '40px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }} className="sheet-surface">
                    
                    {/* Skytouch Branding */}
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: '#000', letterSpacing: '4px' }}>SKYTOUCH</h1>
                        <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#4f46e5', fontWeight: 700 }}>Construction & Engineering</h2>
                        <h3 style={{ margin: '15px 0 0', fontSize: '1rem', color: '#059669', borderBottom: '2px solid #059669', display: 'inline-block', padding: '0 20px', fontWeight: 800 }}>
                            SALARY SHEET FOR THE MONTH OF {monthName} {year}
                        </h3>
                    </div>

                    {/* Highly Dense Spreadsheet Table */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.65rem', color: '#000' }}>
                        <thead>
                            <tr style={{ background: '#fbbf24', color: '#000' }}>
                                {['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22'].map(num => (
                                    <th key={num} style={thS}>{num}</th>
                                ))}
                            </tr>
                            <tr style={{ background: '#f8fafc' }}>
                                <th style={thL}>Name</th>
                                <th style={thL}>Designation</th>
                                <th style={thL}>Join Date</th>
                                <th style={thL}>Total (Leave)</th>
                                <th style={thL}>Leave (Current month)</th>
                                <th style={thL}>Basic Pay</th>
                                <th style={thL}>Conveyance TA DA</th>
                                <th style={thL}>Home rent</th>
                                <th style={thL}>Med</th>
                                <th style={thL}>Supervision</th>
                                <th style={thL}>Construction</th>
                                <th style={thL}>Mobile Bill</th>
                                <th style={thL}>Overtime</th>
                                <th style={thL}>Snacks Bill</th>
                                <th style={{...thL, background: '#fef3c7'}}>Gross Pay</th>
                                <th style={thL}>Advance</th>
                                <th style={thL}>Current Month installment</th>
                                <th style={thL}>Punishment Late Absent</th>
                                <th style={{...thL, background: '#fef3c7'}}>Net Pay</th>
                                <th style={thL}>Holiday Leave This Year</th>
                                <th style={thL}>Source of Fund</th>
                                <th style={thL}>Signature</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payrolls.map((p, idx) => (
                                <tr key={p.id}>
                                    <td style={tdL}>{p.employee?.first_name} {p.employee?.last_name}</td>
                                    <td style={tdL}>{p.employee?.designation}</td>
                                    <td style={tdL}>{p.employee?.join_date}</td>
                                    <td style={tdC}>{p.total_leave_taken}</td>
                                    <td style={tdC}>{p.leave_current_month}</td>
                                    <td style={tdR}>{p.base_salary}</td>
                                    <td style={tdR}>{p.conveyance > 0 ? p.conveyance : ''}</td>
                                    <td style={tdR}>{p.house_rent > 0 ? p.house_rent : ''}</td>
                                    <td style={tdR}>{p.medical_allowance > 0 ? p.medical_allowance : ''}</td>
                                    <td style={tdR}>{p.supervision_allowance > 0 ? p.supervision_allowance : ''}</td>
                                    <td style={tdR}>{p.construction_allowance > 0 ? p.construction_allowance : ''}</td>
                                    <td style={tdR}>{p.mobile_allowance > 0 ? p.mobile_allowance : ''}</td>
                                    <td style={tdR}>{p.overtime_pay > 0 ? p.overtime_pay : ''}</td>
                                    <td style={tdR}>{p.snacks_allowance > 0 ? p.snacks_allowance : ''}</td>
                                    <td style={{...tdR, background: '#fffbeb', fontWeight: 800}}>{p.gross_pay}</td>
                                    <td style={tdR}>{p.advance_salary > 0 ? p.advance_salary : ''}</td>
                                    <td style={tdR}>{p.loan_installment > 0 ? p.loan_installment : ''}</td>
                                    <td style={tdR}>{(parseFloat(p.late_deduction) + parseFloat(p.absent_deduction)) > 0 ? (parseFloat(p.late_deduction) + parseFloat(p.absent_deduction)) : ''}</td>
                                    <td style={{...tdR, background: '#fffbeb', fontWeight: 800}}>{p.total}</td>
                                    <td style={tdC}>{p.yearly_holidays}</td>
                                    <td style={tdC}>{p.fund_source}</td>
                                    <td style={tdL}></td>
                                </tr>
                            ))}
                            {/* Totals Row */}
                            <tr style={{ background: '#f1f5f9', fontWeight: 900 }}>
                                <td colSpan="5" style={{...tdL, textAlign: 'right', fontSize: '0.8rem'}}>Total</td>
                                <td style={tdR}>{totals.base.toFixed(2)}</td>
                                <td colSpan="8" style={tdR}></td>
                                <td style={tdR}>{totals.gross.toFixed(2)}</td>
                                <td colSpan="2" style={tdR}></td>
                                <td style={tdR}>Total</td>
                                <td style={tdR}>{totals.net.toFixed(2)}</td>
                                <td colSpan="3"></td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Authorization Footer */}
                    <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800 }}>
                        <div style={{ textAlign: 'left' }}>
                            <p style={{ margin: 0 }}>Made By________________</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ margin: 0 }}>Check By________________</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0 }}>Approved By________________</p>
                        </div>
                    </div>

                    {/* Footer Notes */}
                    <div style={{ marginTop: '40px', fontSize: '0.7rem', fontWeight: 600 }}>
                        <p style={{ margin: '2px 0' }}>Note- 1. Must Approved Salary sheet Before Pay.</p>
                        <p style={{ margin: '2px 0' }}>2. Attest late, Absent, Leave Report.</p>
                    </div>

                </div>
            </div>

            <style>{`
                @page { size: landscape; margin: 10mm; }
                @media print {
                    body { background: white !important; }
                    .print-hidden { display: none !important; }
                    .sheet-surface { border: none !important; box-shadow: none !important; padding: 0 !important; width: 100% !important; }
                }
                table, th, td { border: 1px solid #000; }
            `}</style>
        </div>
    );
}

const thS = { padding: '4px', fontSize: '0.6rem', border: '1px solid #000' };
const thL = { padding: '8px 4px', border: '1px solid #000', textAlign: 'center', height: '60px', verticalAlign: 'middle' };
const tdL = { padding: '8px 4px', border: '1px solid #000', textAlign: 'left' };
const tdC = { padding: '8px 4px', border: '1px solid #000', textAlign: 'center' };
const tdR = { padding: '8px 4px', border: '1px solid #000', textAlign: 'right' };
