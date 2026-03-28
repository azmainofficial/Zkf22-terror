import React, { useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Printer,
    CreditCard,
    Calendar,
    Hash,
    User,
    FileText,
    Receipt as ReceiptIcon,
    Download,
    CheckCircle2,
    ArrowUpRight,
    ArrowDownLeft,
    Building2,
    ExternalLink,
    ShieldCheck,
    Zap,
    Briefcase,
    Activity,
    FileCheck,
    History,
    MoreHorizontal
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
        completed: { bg: '#ecfdf5', color: '#10b981', label: 'Completed' },
        paid: { bg: '#ecfdf5', color: '#10b981', label: 'Paid' },
        approved: { bg: '#ecfdf5', color: '#10b981', label: 'Approved' },
        pending: { bg: '#fffbeb', color: '#d97706', label: 'Pending' },
        failed: { bg: '#fff1f2', color: '#e11d48', label: 'Failed' },
        refunded: { bg: '#eff6ff', color: '#3b82f6', label: 'Refunded' },
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

export default function Show({ auth, payment, slipDesign }) {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('print') === 'true') {
            setTimeout(() => {
                window.print();
            }, 1000);
        }
    }, []);

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this payment record?')) {
            router.delete(route('payments.destroy', payment.id));
        }
    };

    const accentColor = slipDesign?.accent_color || '#6366f1';

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Payment ${payment.payment_number}`} />

            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }} className="print:p-0">
                
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }} className="no-print">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <Link href={route('payments.index')} style={{ textDecoration: 'none' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff', border: '1.5px solid #f0eeff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e1b4b', transition: 'all 0.2s' }}>
                                <ArrowLeft size={20} />
                            </div>
                        </Link>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.02em' }}>Payment Receipt</h1>
                            <p style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 600, margin: '4px 0 0' }}>Transaction #{payment.payment_number}</p>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={() => window.print()} style={{ height: '52px', padding: '0 1.5rem', background: '#fff', border: '1.5px solid #f0eeff', borderRadius: '14px', color: '#1e1b4b', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Printer size={18} />
                            Print
                        </button>
                        <Link href={route('payments.edit', payment.id)} style={{ textDecoration: 'none' }}>
                            <button style={{ height: '52px', padding: '0 1.5rem', background: '#1e1b4b', border: 'none', borderRadius: '14px', color: '#fff', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Edit size={18} />
                                Edit Record
                            </button>
                        </Link>
                        <button onClick={handleDelete} style={{ height: '52px', width: '52px', background: '#fff1f2', border: '1.5px solid #ffe4e6', borderRadius: '14px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>

                <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                    {/* Receipt Paper */}
                    <div style={{ ...cardStyle, padding: 0 }} className="print:shadow-none print:border-none print:rounded-none">
                        {/* Receipt Top */}
                        <div style={{ padding: '3rem', background: accentColor, color: '#fff', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.1, color: '#fff' }}>
                                <ReceiptIcon size={200} style={{ transform: 'rotate(15deg)' }} />
                            </div>
                            <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', backdropBlur: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                                        <ReceiptIcon size={28} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '2rem', fontWeight: 950, margin: 0, letterSpacing: '-0.04em', textTransform: 'uppercase' }}>RECEIPT</h2>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 800, opacity: 0.7, margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>#{payment.payment_number}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ marginBottom: '10px' }}>
                                        <span style={{ 
                                            display: 'inline-flex', 
                                            padding: '6px 16px', 
                                            borderRadius: '20px', 
                                            fontSize: '0.7rem', 
                                            fontWeight: 900, 
                                            background: 'rgba(255,255,255,0.2)', 
                                            color: '#fff', 
                                            textTransform: 'uppercase', 
                                            letterSpacing: '0.1em',
                                            border: '1.5px solid rgba(255,255,255,0.2)'
                                        }}>
                                            {payment.status}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '3rem', fontWeight: 950, letterSpacing: '-0.05em' }}>
                                        <span style={{ fontSize: '1.5rem', marginRight: '4px', opacity: 0.6 }}>৳</span>
                                        {Number(payment.amount).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Receipt Content */}
                        <div style={{ padding: '3.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            {/* Entity Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: accentColor }}></div>
                                        From
                                    </p>
                                    <h4 style={{ fontSize: '1.25rem', fontWeight: 950, color: '#1e1b4b', margin: '0 0 8px', textTransform: 'uppercase' }}>ZK Base Corp</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, lineHeight: 1.6 }}>
                                        Innovation Labs, Building 12<br />
                                        Financial Area, Dhaka
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                                        To
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f1f5f9' }}></div>
                                    </p>
                                    <h4 style={{ fontSize: '1.25rem', fontWeight: 950, color: '#1e1b4b', margin: '0 0 8px', textTransform: 'uppercase' }}>
                                        {payment.client?.company_name || payment.client?.name || 'External Entity'}
                                    </h4>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, lineHeight: 1.6, maxWidth: '240px', marginLeft: 'auto' }}>
                                        {payment.client?.address || 'No address provided'}
                                    </p>
                                    <p style={{ fontSize: '0.85rem', color: accentColor, fontWeight: 700, marginTop: '4px' }}>{payment.client?.email}</p>
                                </div>
                            </div>

                            {/* Info Strip */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', padding: '2rem 0', borderTop: '1.5px dashed #f1f5f9', borderBottom: '1.5px dashed #f1f5f9' }}>
                                <div>
                                    <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Date</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Calendar size={14} color={accentColor} />
                                        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#1e1b4b' }}>{new Date(payment.payment_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Payment via</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                                        <CreditCard size={14} color={accentColor} />
                                        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#1e1b4b', textTransform: 'capitalize' }}>{payment.payment_method?.replace('_', ' ')}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Reference</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                                        <Hash size={14} color={accentColor} />
                                        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#1e1b4b' }}>{payment.reference_number || 'N/A'}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Linked to</p>
                                    {payment.invoice ? (
                                        <Link href={route('invoices.show', payment.invoice.id)} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                                            <FileText size={14} color={accentColor} />
                                            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: accentColor, textDecoration: 'underline' }}>{payment.invoice.invoice_number}</span>
                                        </Link>
                                    ) : (
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#cbd5e1' }}>Direct Payment</span>
                                    )}
                                </div>
                            </div>

                            {/* Project Link */}
                            {payment.project && (
                                <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '1.5rem 2rem', border: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                            <Briefcase size={24} />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Project Link</p>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e1b4b', margin: '2px 0 0' }}>{payment.project.title}</h4>
                                        </div>
                                    </div>
                                    <Link href={route('projects.show', payment.project.id)} className="no-print" style={{ textDecoration: 'none' }}>
                                        <button style={{ height: '44px', padding: '0 1.25rem', background: '#fff', border: '1.5px solid #f0eeff', borderRadius: '12px', color: accentColor, fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            View Project
                                            <ExternalLink size={14} />
                                        </button>
                                    </Link>
                                </div>
                            )}

                            {/* Remarks */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }}></div>
                                    Notes & Remarks
                                </h4>
                                <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 600, lineHeight: 1.7, fontStyle: 'italic', padding: '1.5rem 2rem', background: '#f9faff', borderRadius: '20px', border: '1.5px solid #f1f5f9', margin: 0 }}>
                                    {payment.notes || 'This transaction has been successfully verified and committed to our records. No additional special remarks were recorded for this payment.'}
                                </p>
                            </div>

                            {/* Final Compliance */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem 2rem', background: '#ecfdf5', borderRadius: '24px', border: '1.5px solid #d1fae5' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', border: '1.5px solid #d1fae5' }}>
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 900, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Verified & Secured</p>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', marginTop: '2px', opacity: 0.8 }}>TR ID: {payment.id.toString(16).toUpperCase()}ZK-FR</p>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {payment.receipt && (
                                        <a href={`/storage/${payment.receipt}`} target="_blank" className="no-print" style={{ textDecoration: 'none' }}>
                                            <button style={{ height: '44px', padding: '0 1.25rem', background: '#f5f3ff', border: '1.5px solid #ede9fe', borderRadius: '12px', color: '#6366f1', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <ExternalLink size={14} />
                                                View Original Proof
                                            </button>
                                        </a>
                                    )}
                                    <div style={{ opacity: 0.4, textAlign: 'right' }}>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Authorized System Output</p>
                                        <div style={{ width: '160px', height: '44px', border: '1.5px dashed #cbd5e1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase' }}>Digital Copy</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Branding Footer */}
                        <div style={{ padding: '2.5rem', background: `${accentColor}08`, borderTop: '1.5px solid #f1f5f9', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{slipDesign?.footer_text || 'This is a digitally generated document. No physical signature required.'}</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '1.5rem' }}>
                                <Zap size={14} color={accentColor} className="animate-pulse" />
                                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.2em' }}>OFFICIAL RECORD</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    @page { size: A4; margin: 0; }
                    .no-print { display: none !important; }
                    body { background: white !important; }
                }
                .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
            `}</style>
        </FigmaLayout>
    );
}
