import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Download,
    Printer,
    Mail,
    Edit,
    Trash2,
    CheckCircle2,
    Clock,
    AlertCircle,
    Calendar,
    Building2,
    User,
    CreditCard,
    ChevronLeft,
    Receipt,
    ExternalLink,
    ShieldCheck,
    Coins,
    History as HistoryIcon,
    FileText,
    Sparkles,
    CalendarClock,
    DollarSign,
    Zap,
    Briefcase,
    FileCheck,
    ArrowUpRight
} from 'lucide-react';

const cardStyle = {
    background: '#fff',
    borderRadius: '24px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
    padding: '2rem',
    overflow: 'hidden'
};

const badgeStyle = (status) => {
    const styles = {
        paid: { bg: '#ecfdf5', color: '#10b981', label: 'Paid' },
        overdue: { bg: '#fff1f2', color: '#e11d48', label: 'Overdue' },
        sent: { bg: '#eff6ff', color: '#3b82f6', label: 'Sent' },
        draft: { bg: '#f8fafc', color: '#64748b', label: 'Draft' },
        cancelled: { bg: '#fef2f2', color: '#ef4444', label: 'Cancelled' },
    };
    const s = styles[status] || { bg: '#f8fafc', color: '#64748b', label: status };
    return {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 800,
        background: s.bg,
        color: s.color,
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
        border: `1.5px solid ${s.color}15`,
        label: s.label
    };
};

export default function Show({ auth, invoice, slipDesign }) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this invoice?')) {
            router.delete(route('invoices.destroy', invoice.id));
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const accentColor = slipDesign?.accent_color || '#6366f1';

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Invoice ${invoice.invoice_number}`} />

            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }} className="print:p-0">
                
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }} className="no-print">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <Link href={route('invoices.index')} style={{ textDecoration: 'none' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff', border: '1.5px solid #f0eeff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e1b4b', transition: 'all 0.2s' }}>
                                <ArrowLeft size={20} />
                            </div>
                        </Link>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.02em' }}>Invoice Details</h1>
                            <p style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 600, margin: '4px 0 0' }}>Invoice #{invoice.invoice_number}</p>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={handlePrint} style={{ height: '52px', padding: '0 1.5rem', background: '#fff', border: '1.5px solid #f0eeff', borderRadius: '14px', color: '#1e1b4b', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Printer size={18} />
                            Print
                        </button>
                        <Link href={route('invoices.edit', invoice.id)} style={{ textDecoration: 'none' }}>
                            <button style={{ height: '52px', padding: '0 1.5rem', background: '#1e1b4b', border: 'none', borderRadius: '14px', color: '#fff', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Edit size={18} />
                                Edit Invoice
                            </button>
                        </Link>
                        <button onClick={handleDelete} style={{ height: '52px', width: '52px', background: '#fff1f2', border: '1.5px solid #ffe4e6', borderRadius: '14px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }} className="main-grid">
                    
                    {/* Invoice Paper */}
                    <div style={{ ...cardStyle, padding: 0 }} className="print:shadow-none print:border-none print:rounded-none">
                        {/* Paper Top */}
                        <div style={{ padding: '3rem', background: accentColor, color: '#fff', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.1, color: '#fff' }}>
                                <Receipt size={240} style={{ transform: 'rotate(15deg)' }} />
                            </div>
                            <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', backdropBlur: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                                        <Sparkles size={32} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '2.5rem', fontWeight: 950, margin: 0, letterSpacing: '-0.04em', textTransform: 'uppercase' }}>INVOICE</h2>
                                        <div style={{ display: 'inline-flex', padding: '4px 12px', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '1rem', fontWeight: 800, letterSpacing: '0.1em', marginTop: '8px' }}>
                                            {invoice.invoice_number}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 800, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Total Amount</p>
                                    <div style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-0.05em' }}>
                                        <span style={{ fontSize: '1.5rem', marginRight: '4px', opacity: 0.6 }}>৳</span>
                                        {Number(invoice.total_amount).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Paper Content */}
                        <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            {/* Billing Info */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: accentColor }}></div>
                                        From
                                    </p>
                                    <h4 style={{ fontSize: '1.5rem', fontWeight: 950, color: '#1e1b4b', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>ZK Base Corp</h4>
                                    <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, lineHeight: 1.6 }}>
                                        Innovation Labs, Building 7<br />
                                        Tech City, Sector 12<br />
                                        Dhaka, Bangladesh
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                                        To
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f1f5f9' }}></div>
                                    </p>
                                    <h4 style={{ fontSize: '1.5rem', fontWeight: 950, color: '#1e1b4b', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                                        {invoice.client?.company_name || invoice.client?.name}
                                    </h4>
                                    <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>{invoice.client?.name}</p>
                                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600, lineHeight: 1.6, maxWidth: '280px', marginLeft: 'auto' }}>
                                        {invoice.client?.address || 'No address specified'}
                                    </p>
                                </div>
                            </div>

                            {/* Date Strip */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', padding: '2rem 0', borderTop: '2px dashed #f1f5f9', borderBottom: '2px dashed #f1f5f9' }}>
                                <div>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Issued On</p>
                                    <p style={{ fontSize: '1rem', fontWeight: 900, color: '#1e1b4b' }}>{new Date(invoice.invoice_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Payment Due</p>
                                    <p style={{ fontSize: '1rem', fontWeight: 900, color: '#ef4444' }}>{new Date(invoice.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Reference</p>
                                    <p style={{ fontSize: '1rem', fontWeight: 900, color: '#1e1b4b' }}>#{invoice.id.toString().padStart(6, '0')}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Amount Paid</p>
                                    <p style={{ fontSize: '1rem', fontWeight: 900, color: '#10b981' }}>৳{Number(invoice.paid_amount || 0).toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div style={{ borderRadius: '24px', border: '1.5px solid #f0eeff', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f9faff', textAlign: 'left' }}>
                                            <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Description</th>
                                            <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'center' }}>Qty</th>
                                            <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Price</th>
                                            <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ divideY: '1px solid #f1f5f9' }}>
                                        {invoice.items?.map((item, idx) => (
                                            <tr key={item.id} style={{ borderBottom: '1.5px solid #f9f9fb' }}>
                                                <td style={{ padding: '2rem' }}>
                                                    <p style={{ fontSize: '1rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>{item.description}</p>
                                                </td>
                                                <td style={{ padding: '2rem', textAlign: 'center', fontSize: '1rem', fontWeight: 800, color: '#64748b' }}>{item.quantity}</td>
                                                <td style={{ padding: '2rem', textAlign: 'right', fontSize: '1rem', fontWeight: 800, color: '#64748b' }}>৳{Number(item.unit_price).toLocaleString()}</td>
                                                <td style={{ padding: '2rem', textAlign: 'right', fontSize: '1.1rem', fontWeight: 950, color: '#1e1b4b' }}>৳{Number(item.quantity * item.unit_price).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary & Terms Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '4rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div>
                                        <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Briefcase size={16} />
                                            Terms & Conditions
                                        </h4>
                                        <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, lineHeight: 1.6, paddingLeft: '1.5rem', borderLeft: `3px solid ${accentColor}20` }}>
                                            {invoice.terms || "Standard payment terms apply. Please ensure payment is made by the due date to avoid service interruption."}
                                        </p>
                                    </div>
                                    {invoice.notes && (
                                        <div>
                                            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Notes</h4>
                                            <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, lineHeight: 1.6 }}>{invoice.notes}</p>
                                        </div>
                                    )}
                                </div>
                                <div style={{ background: '#1e1b4b', borderRadius: '32px', padding: '2.5rem', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: 0, right: 0, padding: '2.5rem', opacity: 0.05 }}>
                                        <DollarSign size={120} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)' }}>
                                            <span>Subtotal</span>
                                            <span style={{ color: '#fff' }}>৳{Number(invoice.subtotal).toLocaleString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)' }}>
                                            <span>Tax</span>
                                            <span style={{ color: '#10b981' }}>+ ৳{Number(invoice.tax_amount).toLocaleString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)', paddingBottom: '1.25rem', borderBottom: '1.5px solid rgba(255,255,255,0.1)' }}>
                                            <span>Discount</span>
                                            <span style={{ color: '#ef4444' }}>- ৳{Number(invoice.discount_amount || 0).toLocaleString()}</span>
                                        </div>
                                        <div style={{ marginTop: '1rem' }}>
                                            <p style={{ fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Total Amount</p>
                                            <div style={{ fontSize: '3rem', fontWeight: 950, color: accentColor, letterSpacing: '-0.05em' }}>
                                                <span style={{ fontSize: '1.25rem', marginRight: '4px', opacity: 0.6 }}>৳</span>
                                                {Number(invoice.total_amount).toLocaleString()}
                                            </div>
                                        </div>
                                        {invoice.paid_amount > 0 && (
                                            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1.5px solid rgba(255,255,255,0.1)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)' }}>Paid to Date</span>
                                                    <span style={{ fontSize: '0.9rem', fontWeight: 900 }}>৳{Number(invoice.paid_amount).toLocaleString()}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#fff' }}>Balance Due</span>
                                                    <span style={{ fontSize: '1.75rem', fontWeight: 950, color: '#fff' }}>৳{Number(invoice.balance).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Paper Footer */}
                        <div style={{ padding: '3rem 4rem', borderTop: '1.5px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <FileCheck size={20} color={accentColor} />
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>System Verified Invoice</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                                <Coins size={14} />
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>ZK Base Integrated Core</span>
                            </div>
                        </div>
                    </div>

                    {/* Side Info Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="no-print">
                        {/* Transaction History */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                                    <HistoryIcon size={20} />
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Payment History</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {invoice.payments && invoice.payments.length > 0 ? (
                                    invoice.payments.map((p, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '16px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', border: '3px solid #fff', boxShadow: '0 0 0 1.5px #f1f5f9' }}></div>
                                                <div style={{ width: '2px', flex: 1, background: '#f1f5f9' }}></div>
                                            </div>
                                            <div style={{ paddingBottom: '1rem' }}>
                                                <p style={{ fontSize: '1rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>৳{Number(p.amount).toLocaleString()}</p>
                                                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginTop: '4px' }}>
                                                    {new Date(p.payment_date).toLocaleDateString()} • {p.payment_method || 'Transfer'}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: '2rem', textAlign: 'center', borderRadius: '20px', border: '2px dashed #f1f5f9' }}>
                                        <AlertCircle size={24} color="#cbd5e1" style={{ marginBottom: '10px' }} />
                                        <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', margin: 0 }}>No payments yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Card */}
                        <div style={{ ...cardStyle, background: '#f8fafc', border: 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Current Status</span>
                                <span style={badgeStyle(invoice.status).background ? {
                                    padding: '6px 14px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, background: badgeStyle(invoice.status).background, color: badgeStyle(invoice.status).color, textTransform: 'uppercase'
                                } : {}}>
                                    {badgeStyle(invoice.status).label}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', margin: 0 }}>Last Updated</p>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e1b4b', margin: '2px 0 0' }}>{new Date(invoice.updated_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Exports */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                            <a href={route('invoices.export', invoice.id)} style={{ textDecoration: 'none' }}>
                                <button style={{ width: '100%', height: '56px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 8px 20px rgba(16,185,129,0.2)' }}>
                                    <FileText size={18} />
                                    Download Excel
                                </button>
                            </a>
                            <button onClick={() => window.open(route('invoices.export', invoice.id), '_blank')} style={{ width: '100%', height: '56px', background: '#fff', border: '1.5px solid #f0eeff', borderRadius: '16px', color: '#1e1b4b', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <ExternalLink size={18} />
                                Export PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    @page { size: A4; margin: 0; }
                    .no-print { display: none !important; }
                    body { background: white !important; }
                    .main-grid { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 1100px) {
                    .main-grid { grid-template-columns: 1fr !important; }
                }
                @keyframes pulse {
                    0% { transform: scale(0.95); opacity: 0.5; }
                    50% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(0.95); opacity: 0.5; }
                }
            `}</style>
        </FigmaLayout>
    );
}
