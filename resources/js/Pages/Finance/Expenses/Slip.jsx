import React from 'react';
import { Head } from '@inertiajs/react';
import { Printer, ArrowLeft } from 'lucide-react';

const fmt = (v) => parseFloat(v || 0).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ExpenseSlip({ expense, company }) {
    const accent = company.accent || '#ef4444';
    const font   = company.font   || 'Inter';
    const refNum = expense.expense_number || `EXP-${expense.id}`;

    const ExpenseCopy = ({ label }) => (
        <div className="slip-copy" style={{ fontFamily: font, position: 'relative', overflow: 'hidden', padding: '28px 36px', display: 'flex', flexDirection: 'column', minHeight: '148.5mm', boxSizing: 'border-box' }}>

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
                        : <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '1.1rem' }}>{company.name?.[0] || 'E'}</div>
                    }
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{company.name}</h1>
                        {company.tagline && <p style={{ margin: '2px 0 0', fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>{company.tagline}</p>}
                        {company.address && <p style={{ margin: '1px 0 0', fontSize: '0.6rem', color: '#94a3b8', fontWeight: 500 }}>📍 {company.address}</p>}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Expense Voucher</h2>
                    <p style={{ margin: '3px 0 0', fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>{refNum}</p>
                    <span style={{ display: 'inline-block', marginTop: '4px', padding: '2px 8px', background: `${accent}18`, color: accent, fontSize: '0.6rem', fontWeight: 900, borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                </div>
            </div>

            {/* Expense Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px', fontSize: '0.72rem', background: '#f8fafc', borderRadius: '8px', padding: '10px 14px', position: 'relative', zIndex: 1 }}>
                <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#94a3b8', fontWeight: 700 }}>Title: </span><span style={{ fontWeight: 800, color: '#1e293b' }}>{expense.title}</span></div>
                <div><span style={{ color: '#94a3b8', fontWeight: 700 }}>Date: </span><span style={{ fontWeight: 700, color: '#334155' }}>{expense.expense_date}</span></div>
                <div><span style={{ color: '#94a3b8', fontWeight: 700 }}>Category: </span><span style={{ fontWeight: 700, color: '#334155' }}>{expense.category?.name || '—'}</span></div>
                <div><span style={{ color: '#94a3b8', fontWeight: 700 }}>Vendor: </span><span style={{ fontWeight: 700, color: '#334155' }}>{expense.vendor_name || '—'}</span></div>
                <div><span style={{ color: '#94a3b8', fontWeight: 700 }}>Pay Method: </span><span style={{ fontWeight: 700, color: '#334155' }}>{expense.payment_method?.toUpperCase() || '—'}</span></div>
                {expense.project && <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#94a3b8', fontWeight: 700 }}>Project: </span><span style={{ fontWeight: 700, color: '#334155' }}>{expense.project.title}</span></div>}
                <div><span style={{ color: '#94a3b8', fontWeight: 700 }}>Status: </span>
                    <span style={{ padding: '1px 8px', borderRadius: '10px', fontSize: '0.6rem', fontWeight: 900, background: expense.status === 'paid' || expense.status === 'approved' ? '#dcfce7' : '#fef9c3', color: expense.status === 'paid' || expense.status === 'approved' ? '#166534' : '#854d0e' }}>{expense.status?.toUpperCase()}</span>
                </div>
                {expense.is_reimbursable && <div><span style={{ color: '#94a3b8', fontWeight: 700 }}>Reimbursable: </span><span style={{ fontWeight: 700, color: '#10b981' }}>Yes</span></div>}
            </div>

            {/* Description */}
            {expense.description && (
                <div style={{ marginBottom: '14px', padding: '10px 14px', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.7rem', color: '#475569', fontWeight: 600, lineHeight: 1.5, position: 'relative', zIndex: 1 }}>
                    <span style={{ color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Description:</span>
                    {expense.description}
                </div>
            )}

            {/* Amount Box */}
            <div style={{ background: `linear-gradient(135deg, ${accent}18, ${accent}06)`, border: `1.5px solid ${accent}30`, borderRadius: '12px', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0', position: 'relative', zIndex: 1 }}>
                <div>
                    <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Expense Amount</p>
                    {expense.approver && <p style={{ margin: '3px 0 0', fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>Approved by: {expense.approver.name}</p>}
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: accent }}>৳{fmt(expense.amount)}</span>
            </div>

            {/* Bank Details */}
            {company.bank && (
                <div style={{ marginTop: '8px', padding: '8px 12px', background: '#f1f5f9', borderRadius: '7px', fontSize: '0.62rem', color: '#475569', fontWeight: 600, whiteSpace: 'pre-line', position: 'relative', zIndex: 1 }}>
                    <span style={{ fontWeight: 800, color: '#334155' }}>Payment Details: </span>{company.bank}
                </div>
            )}

            {/* Signatures */}
            {company.show_sig !== false && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '24px', position: 'relative', zIndex: 1 }}>
                    {['Requested By', 'Approved By', 'Accounts Dept.'].map(s => (
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
            <Head title={`Expense Voucher — ${expense.title}`} />

            {/* Toolbar */}
            <div className="no-print" style={{ background: '#1e1b4b', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => window.history.back()} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '7px 10px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600 }}>Expense Voucher · {expense.title} · {refNum}</span>
                </div>
                <button onClick={() => window.print()} style={{ background: '#ef4444', border: 'none', borderRadius: '10px', padding: '9px 20px', cursor: 'pointer', color: '#fff', fontWeight: 900, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>
                    <Printer size={18} /> Print Voucher
                </button>
            </div>

            {/* A4 Paper */}
            <div style={{ width: '210mm', margin: '24px auto', background: '#fff', boxShadow: '0 4px 32px rgba(0,0,0,0.12)' }}>
                <ExpenseCopy label="Requester Copy" />
                <div style={{ borderTop: '2px dashed #cbd5e1', margin: '0 20px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '2px 12px', fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>✂ Cut Here</span>
                </div>
                <ExpenseCopy label="Accounts / Office Copy" />
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
