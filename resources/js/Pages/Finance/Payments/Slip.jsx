import React from 'react';
import { Head } from '@inertiajs/react';
import { Printer, ArrowLeft } from 'lucide-react';

const fmt = (v) => parseFloat(v || 0).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function PaymentSlip({ payment, company, projectDue }) {
    const accent  = company.accent || '#10b981';
    const font    = company.font   || 'Inter';
    const refNum  = payment.payment_number || `PAY-${payment.id}`;
    const client  = payment.client || payment.invoice?.client;
    const typeColor = payment.type === 'incoming' || payment.payment_type === 'incoming' ? '#10b981' : '#ef4444';
    const typeLabel = (payment.type || payment.payment_type) === 'incoming' ? 'RECEIVED' : 'PAID OUT';

    const PaymentCopy = ({ label }) => (
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
                        : <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '1.1rem' }}>{company.name?.[0] || 'P'}</div>
                    }
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{company.name}</h1>
                        {company.tagline && <p style={{ margin: '2px 0 0', fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>{company.tagline}</p>}
                        {company.address && <p style={{ margin: '1px 0 0', fontSize: '0.6rem', color: '#94a3b8', fontWeight: 500 }}>📍 {company.address}</p>}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Payment Receipt</h2>
                    <p style={{ margin: '3px 0 0', fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>{refNum}</p>
                    <div style={{ marginTop: '4px', display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                        <span style={{ padding: '2px 8px', background: `${typeColor}18`, color: typeColor, fontSize: '0.6rem', fontWeight: 900, borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{typeLabel}</span>
                        <span style={{ padding: '2px 8px', background: `${accent}18`, color: accent, fontSize: '0.6rem', fontWeight: 900, borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                    </div>
                </div>
            </div>

            {/* Client / Details Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px', fontSize: '0.72rem', background: '#f8fafc', borderRadius: '8px', padding: '10px 14px', position: 'relative', zIndex: 1 }}>
                {client && <>
                    <div><span style={{ color: '#94a3b8', fontWeight: 700 }}>Client: </span><span style={{ fontWeight: 800, color: '#1e293b' }}>{client.name}</span></div>
                    {client.company_name && <div><span style={{ color: '#94a3b8', fontWeight: 700 }}>Company: </span><span style={{ fontWeight: 700, color: '#334155' }}>{client.company_name}</span></div>}
                </>}
                <div><span style={{ color: '#94a3b8', fontWeight: 700 }}>Date: </span><span style={{ fontWeight: 700, color: '#334155' }}>{payment.date || payment.payment_date}</span></div>
                <div><span style={{ color: '#94a3b8', fontWeight: 700 }}>Pay Method: </span><span style={{ fontWeight: 700, color: '#334155' }}>{(payment.payment_method || '—').toUpperCase()}</span></div>
                {payment.reference_number && <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#94a3b8', fontWeight: 700 }}>Reference: </span><span style={{ fontWeight: 700, color: '#334155' }}>{payment.reference_number}</span></div>}
                {payment.invoice && <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#94a3b8', fontWeight: 700 }}>Invoice: </span><span style={{ fontWeight: 700, color: '#334155' }}>#{payment.invoice.invoice_number}</span></div>}
                {payment.project && <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#94a3b8', fontWeight: 700 }}>Project: </span><span style={{ fontWeight: 700, color: '#334155' }}>{payment.project.title}</span></div>}
                <div><span style={{ color: '#94a3b8', fontWeight: 700 }}>Status: </span>
                    <span style={{ padding: '1px 8px', borderRadius: '10px', fontSize: '0.6rem', fontWeight: 900, background: payment.status === 'completed' ? '#dcfce7' : '#fef9c3', color: payment.status === 'completed' ? '#166534' : '#854d0e' }}>{payment.status?.toUpperCase()}</span>
                </div>
            </div>

            {/* Notes */}
            {payment.notes && (
                <div style={{ marginBottom: '14px', padding: '10px 14px', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.7rem', color: '#475569', fontWeight: 600, lineHeight: 1.5, position: 'relative', zIndex: 1 }}>
                    <span style={{ color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Remarks / Notes:</span>
                    {payment.notes}
                </div>
            )}

            {/* Amount */}
            <div style={{ background: `linear-gradient(135deg, ${accent}18, ${accent}06)`, border: `1.5px solid ${accent}30`, borderRadius: '12px', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0', position: 'relative', zIndex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount Paid</p>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: accent }}>৳{fmt(payment.amount)}</span>
            </div>

            {/* Project Due */}
            {projectDue !== null && payment.project && (
                <div style={{
                    background: projectDue > 0 ? '#fffbeb' : '#f0fdf4',
                    border: `1.5px solid ${projectDue > 0 ? '#fcd34d' : '#86efac'}`,
                    borderRadius: '12px', padding: '12px 20px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginTop: '8px', position: 'relative', zIndex: 1,
                }}>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, color: projectDue > 0 ? '#92400e' : '#166534', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {projectDue > 0 ? 'Project Balance Due' : 'Project Fully Paid'}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.58rem', fontWeight: 600, color: '#94a3b8' }}>
                            {payment.project.title}
                        </p>
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: projectDue > 0 ? '#b45309' : '#15803d' }}>
                        {projectDue > 0 ? `৳${fmt(projectDue)}` : '✓ PAID'}
                    </span>
                </div>
            )}

            {/* Bank Details */}
            {company.bank && (
                <div style={{ marginTop: '8px', padding: '8px 12px', background: '#f1f5f9', borderRadius: '7px', fontSize: '0.62rem', color: '#475569', fontWeight: 600, whiteSpace: 'pre-line', position: 'relative', zIndex: 1 }}>
                    <span style={{ fontWeight: 800, color: '#334155' }}>Bank / Transfer Details: </span>{company.bank}
                </div>
            )}

            {/* Signatures */}
            {company.show_sig !== false && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '24px', position: 'relative', zIndex: 1 }}>
                    {['Prepared By', 'Authorized Signatory', 'Receiver / Client'].map(s => (
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
            <Head title={`Payment Receipt — ${refNum}`} />

            {/* Toolbar */}
            <div className="no-print" style={{ background: '#1e1b4b', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => window.history.back()} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '7px 10px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600 }}>Payment Receipt · {refNum}</span>
                </div>
                <button onClick={() => window.print()} style={{ background: '#10b981', border: 'none', borderRadius: '10px', padding: '9px 20px', cursor: 'pointer', color: '#fff', fontWeight: 900, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
                    <Printer size={18} /> Print Receipt
                </button>
            </div>

            {/* A4 Paper */}
            <div style={{ width: '210mm', margin: '24px auto', background: '#fff', boxShadow: '0 4px 32px rgba(0,0,0,0.12)' }}>
                <PaymentCopy label="Client / Payer Copy" />
                <div style={{ borderTop: '2px dashed #cbd5e1', margin: '0 20px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '2px 12px', fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>✂ Cut Here</span>
                </div>
                <PaymentCopy label="Accounts / Office Copy" />
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
