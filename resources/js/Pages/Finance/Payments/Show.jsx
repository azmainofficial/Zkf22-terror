import React, { useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { t } from '../../../Lang/translation';
import {
    ArrowLeft, Edit, Trash2, Printer, 
    Download, ArrowDownLeft, ShieldCheck,
} from 'lucide-react';

export default function Show({ auth, payment, slipDesign }) {
    const { settings } = usePage().props;
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('print') === 'true') {
            setTimeout(() => {
                window.print();
            }, 1000);
        }
    }, []);

    const handleDelete = () => {
        if (confirm(t('delete_confirm'))) {
            router.delete(route('payments.destroy', payment.id));
        }
    };

    const fmt = (val) => `৳${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Receipt #${payment.payment_number}`} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
                
                {/* Dashboard Controls (Hide on Print) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', gap: '1.5rem' }} className="no-print">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <Link href={route('payments.index')} style={{ textDecoration: 'none' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fff', border: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <ArrowLeft size={18} />
                            </div>
                        </Link>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>Receipt Preview</h1>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={() => window.print()} style={{ height: '44px', padding: '0 1.25rem', background: '#1e1b4b', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            <Printer size={16} /> Print Receipt
                        </button>
                        <button onClick={handleDelete} style={{ height: '44px', width: '44px', background: '#fff', border: '1.5px solid #f1f5f9', borderRadius: '10px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Professional Receipt Design */}
                <div style={{ 
                    background: '#fff', 
                    maxWidth: '850px', 
                    margin: '0 auto', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
                    border: '1px solid #f1f5f9' 
                }} className="print:shadow-none print:border-none print:m-0">
                    
                    {/* Header: Black Header matching the design */}
                    <div style={{ background: '#000', color: '#fff', padding: '3.5rem 4rem' }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.9, margin: '0 0 1rem' }}>PAYMENT RECEIPT</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            {settings?.app_logo && (
                                <img src={`/storage/${settings.app_logo}`} style={{ height: '52px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} alt="Logo" />
                            )}
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, letterSpacing: '-0.03em' }}>{settings?.app_name || 'ZK Base Corp'}</h2>
                        </div>
                        <p style={{ fontSize: '0.9rem', fontWeight: 500, opacity: 0.7, margin: 0, letterSpacing: '0.02em' }}>
                            {slipDesign?.address || '123 Innovation Blvd, Techville, CA 54321 | (555) 123-4567'}
                        </p>
                    </div>

                    {/* Metadata Section: Sold To, Date, Receipt # */}
                    <div style={{ padding: '3.5rem 4rem 2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '2rem' }}>
                            <div>
                                <p style={{ fontSize: '0.85rem', fontWeight: 900, color: '#000', margin: '0 0 12px' }}>Sold To:</p>
                                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#4b5563', margin: '0 0 4px' }}>{payment.client?.company_name || payment.client?.name}</p>
                                <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.6, margin: '0 0 4px' }}>
                                    {payment.client?.address || 'No address provided'}
                                </p>
                                <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>
                                    {payment.client?.phone || 'No phone provided'}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', fontWeight: 900, color: '#000', margin: '0 0 12px' }}>Payment Date:</p>
                                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#4b5563', margin: 0 }}>{new Date(payment.payment_date).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', fontWeight: 900, color: '#000', margin: '0 0 12px' }}>Receipt Number:</p>
                                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#4b5563', margin: 0 }}>{payment.payment_number}</p>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div style={{ padding: '0 4rem 2rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
                            <thead>
                                <tr style={{ background: '#4b5563', color: '#fff' }}>
                                    <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', borderRight: '1px solid rgba(255,255,255,0.1)' }}>DESCRIPTION</th>
                                    <th style={{ textAlign: 'center', padding: '12px 18px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', borderRight: '1px solid rgba(255,255,255,0.1)' }}>QUANTITY</th>
                                    <th style={{ textAlign: 'right', padding: '12px 18px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', borderRight: '1px solid rgba(255,255,255,0.1)' }}>UNIT PRICE</th>
                                    <th style={{ textAlign: 'right', padding: '12px 18px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '15px 18px', fontSize: '0.9rem', color: '#374151', fontWeight: 500, borderRight: '1px solid #e5e7eb' }}>
                                        {payment.notes || payment.project?.title || 'General Payment'}
                                    </td>
                                    <td style={{ padding: '15px 18px', textAlign: 'center', fontSize: '0.9rem', color: '#374151', fontWeight: 500, borderRight: '1px solid #e5e7eb' }}>1</td>
                                    <td style={{ padding: '15px 18px', textAlign: 'right', fontSize: '0.9rem', color: '#374151', fontWeight: 500, borderRight: '1px solid #e5e7eb' }}>{fmt(payment.amount)}</td>
                                    <td style={{ padding: '15px 18px', textAlign: 'right', fontSize: '0.9rem', color: '#374151', fontWeight: 800 }}>{fmt(payment.amount)}</td>
                                </tr>
                                {/* Padding rows to match design aesthetics */}
                                <tr>
                                    <td style={{ padding: '15px 18px', borderRight: '1px solid #e5e7eb' }}></td>
                                    <td style={{ padding: '15px 18px', borderRight: '1px solid #e5e7eb' }}></td>
                                    <td style={{ padding: '15px 18px', borderRight: '1px solid #e5e7eb' }}></td>
                                    <td style={{ padding: '15px 18px', textAlign: 'right', fontSize: '0.9rem', color: '#374151', fontWeight: 700 }}>৳0.00</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '15px 18px', borderRight: '1px solid #e5e7eb' }}></td>
                                    <td style={{ padding: '15px 18px', borderRight: '1px solid #e5e7eb' }}></td>
                                    <td style={{ padding: '15px 18px', borderRight: '1px solid #e5e7eb' }}></td>
                                    <td style={{ padding: '15px 18px', textAlign: 'right', fontSize: '0.9rem', color: '#374151', fontWeight: 700 }}>৳0.00</td>
                                </tr>
                                {/* Totals Section */}
                                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td colSpan="2" rowSpan="3" style={{ padding: '18px', verticalAlign: 'top', borderRight: '1px solid #e5e7eb' }}>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 950, color: '#000', textTransform: 'uppercase', margin: '0 0 10px' }}>NOTES</p>
                                        <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                                            {payment.reference_number ? `Ref: ${payment.reference_number}` : ''}
                                            {payment.payment_method ? ` | Method: ${payment.payment_method.toUpperCase()}` : ''}
                                            <br />
                                            {t('verified_record')} — Thank you for your business.
                                        </p>
                                    </td>
                                    <td style={{ padding: '12px 18px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', borderRight: '1px solid #e5e7eb' }}>SUBTOTAL</td>
                                    <td style={{ padding: '12px 18px', textAlign: 'right', fontSize: '1rem', fontWeight: 900 }}>{fmt(payment.amount)}</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '12px 18px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', borderRight: '1px solid #e5e7eb' }}>TAX RATE</td>
                                    <td style={{ padding: '12px 18px', textAlign: 'right', fontSize: '1rem', fontWeight: 900 }}>0.00%</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '12px 18px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', borderRight: '1px solid #e5e7eb' }}>TAX AMOUNT</td>
                                    <td style={{ padding: '12px 18px', textAlign: 'right', fontSize: '1rem', fontWeight: 900 }}>৳0.00</td>
                                </tr>
                                <tr style={{ background: '#000', color: '#fff' }}>
                                    <td colSpan="2" style={{ padding: '15px 18px' }}></td>
                                    <td style={{ padding: '15px 18px', textAlign: 'right', fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', borderRight: '1px solid rgba(255,255,255,0.1)' }}>TOTAL AMOUNT DUE</td>
                                    <td style={{ padding: '15px 18px', textAlign: 'right', fontSize: '1.25rem', fontWeight: 950 }}>{fmt(payment.amount)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Branding Footer */}
                    <div style={{ padding: '3rem 4rem 4rem', textAlign: 'center' }}>
                        <div style={{ width: '100%', height: '1.5px', background: '#f1f5f9', margin: '0 auto 2.5rem' }} />
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>This is an official transaction record</p>
                        <p style={{ fontSize: '0.7rem', color: '#cbd5e1', marginTop: '10px' }}>Generated by {settings?.app_name} Software Systems</p>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    @page { size: A4; margin: 0; }
                    body { background: white !important; -webkit-print-color-adjust: exact !important; }
                    .no-print { display: none !important; }
                    div[style*="max-width: 850px"] { max-width: 100% !important; border: none !important; }
                }
            `}</style>
        </FigmaLayout>
    );
}
