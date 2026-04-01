import React from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import { t } from '../../../Lang/translation';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Printer,
    Wallet,
    Calendar,
    Tag,
    Briefcase,
    FileText,
    Receipt,
    Download,
    CheckCircle2,
    XCircle,
    Clock,
    ShieldCheck,
    Box,
    ExternalLink,
    DollarSign,
    Building2,
    Zap,
    History,
    FileCheck,
    MoreVertical,
    CreditCard
} from 'lucide-react';


const cardStyle = {
    background: '#fff',
    borderRadius: '24px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
    padding: '2.5rem',
    position: 'relative',
    overflow: 'hidden'
};

const badgeStyle = (status) => {
    const styles = {
        approved: { bg: '#ecfdf5', color: '#059669', label: t('approved'), icon: CheckCircle2 },
        paid: { bg: '#eff6ff', color: '#2563eb', label: t('paid'), icon: ShieldCheck },
        pending: { bg: '#fffbeb', color: '#d97706', label: t('pending'), icon: Clock },
        rejected: { bg: '#fff1f2', color: '#e11d48', label: t('rejected'), icon: XCircle },
    };
    const s = styles[status] || styles.pending;
    return {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 800,
        background: s.bg,
        color: s.color,
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
        border: `1.5px solid ${s.color}20`,
        ...s
    };
};

export default function Show({ auth, expense, company, slipDesign }) {
    const accent = company?.accent || '#6366f1';
    
    const handleDelete = () => {
        if (confirm(t('delete_confirm'))) {
            router.delete(route('expenses.destroy', expense.id));
        }
    };

    const handleApprove = () => {
        if (confirm(t('authorize_expense_msg') || 'Authorize this expense?')) {
            router.post(route('expenses.approve', expense.id));
        }
    };

    const handleReject = () => {
        const reason = prompt(t('rejection_reason_msg') || 'Please provide a reason for rejecting this expense:');
        if (reason) {
            router.post(route('expenses.reject', expense.id), { approval_notes: reason });
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 2,
        }).format(amount).replace('BDT', '৳');
    };

    const currentBadge = badgeStyle(expense.status);

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`${t('expense_details')} - ${expense.expense_number}`} />

            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }} className="no-print">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <Link href={route('expenses.index')} style={{ textDecoration: 'none' }}>
                            <button style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff', border: '1.5px solid #f0eeff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>{t('expense_details')}</h1>
                            <p style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600, margin: '4px 0 0' }}>{t('expense_id')}: {expense.expense_number}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={() => window.print()} style={{ height: '48px', padding: '0 1.5rem', background: '#fff', border: '1.5px solid #ede9fe', borderRadius: '12px', color: '#64748b', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Printer size={18} />
                            {t('print')} Info
                        </button>
                        <button 
                            onClick={() => {
                                const iframe = document.createElement('iframe');
                                iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:none;';
                                document.body.appendChild(iframe);
                                iframe.src = route('expenses.slip', expense.id);
                                iframe.onload = () => {
                                    setTimeout(() => {
                                        iframe.contentWindow.print();
                                        setTimeout(() => document.body.removeChild(iframe), 1000);
                                    }, 500);
                                };
                            }}
                            style={{ height: '48px', padding: '0 1.5rem', background: '#d97706', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Receipt size={18} />
                            Print Voucher
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }} className="details-grid">
                    {/* Main Information */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: `${accent}15`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Wallet size={32} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e1b4b', margin: '0 0 4px' }}>{expense.title}</h2>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: accent }}>{expense.category?.name || t('uncategorized')}</span>
                                            <span style={{ color: '#cbd5e1' }}>•</span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>{new Date(expense.expense_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>{t('total_amount')}</p>
                                    <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>{formatCurrency(expense.amount)}</h3>
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '2rem', marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                                    <FileText size={16} color="#94a3b8" />
                                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{t('description')}</h4>
                                </div>
                                <p style={{ fontSize: '1rem', fontWeight: 600, color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                                    {expense.description || t('no_description_provided')}
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                        <Building2 size={20} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 4px' }}>{t('vendor_name')}</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{expense.vendor_name || t('not_specified')}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                      <Briefcase size={20} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 4px' }}>{t('linked_project')}</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{expense.project?.title || t('no_project')}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                      <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 4px' }}>{t('payment_method')}</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e1b4b', margin: 0, textTransform: 'capitalize' }}>{expense.payment_method?.replace('_', ' ') || t('cash')}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                      <Box size={20} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 4px' }}>{t('expense_title')}</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{t('operational_cost') || 'Operational Cost'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Status Card */}
                        <div style={{ ...cardStyle, background: expense.status === 'rejected' ? '#fff1f2' : '#fffbeb', border: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                                <currentBadge.icon size={24} color={currentBadge.color} />
                                <h3 style={{ fontSize: '0.75rem', fontWeight: 800, color: currentBadge.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('status')}</h3>
                            </div>

                            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: currentBadge.color, display: 'block', marginBottom: '1.5rem' }}>{currentBadge.label}</span>

                            {expense.status === 'pending' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <button onClick={handleApprove} style={{ width: '100%', height: '48px', borderRadius: '12px', background: '#059669', color: '#fff', border: 'none', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(5,150,105,0.2)' }}>
                                        {t('approve')}
                                    </button>
                                    <button onClick={handleReject} style={{ width: '100%', height: '48px', borderRadius: '12px', background: '#fff', color: '#e11d48', border: '1.5px solid #fff1f2', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer' }}>
                                        {t('rejected')}
                                    </button>
                                </div>
                            ) : (
                                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <ShieldCheck size={16} color={currentBadge.color} />
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: currentBadge.color }}>{t('verified_record')}</span>
                                </div>
                            )}

                            {expense.is_reimbursable && (
                                <div style={{ marginTop: '1.5rem', padding: '12px', background: 'rgba(255,255,255,0.3)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Zap size={14} color="#d97706" />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d97706' }}>{t('is_reimbursable')}</span>
                                </div>
                            )}
                        </div>

                        {/* Receipt Card */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <Receipt size={18} color={accent} />
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{t('receipt')}</h3>
                            </div>

                            {expense.receipt ? (
                                <div style={{ position: 'relative' }}>
                                    <div style={{ width: '100%', height: '200px', borderRadius: '20px', background: '#f8fafc', border: '1.5px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', overflow: 'hidden' }} className="receipt-view">
                                        <FileCheck size={40} color="#10b981" />
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e1b4b', margin: '0 0 4px' }}>{t('verified_record')}</p>
                                            <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>ID: {expense.receipt.split('/').pop().substring(0, 10)}...</p>
                                        </div>
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(30,27,75,0.6)', opacity: 0, transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="receipt-overlay">
                                            <a href={`/storage/${expense.receipt}`} target="_blank" style={{ padding: '10px 20px', background: '#fff', color: '#1e1b4b', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 900, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Download size={16} /> {t('receipt')}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ width: '100%', padding: '2rem 0', borderRadius: '20px', border: '2px dashed #f1f5f9', textAlign: 'center', opacity: 0.5 }}>
                                    <XCircle size={32} color="#cbd5e1" style={{ marginBottom: '10px' }} />
                                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', margin: 0 }}>{t('receipt')} {t('not_specified')}</p>
                                </div>
                            )}
                        </div>

                        {/* Delete Action */}
                        <div style={{ ...cardStyle, background: '#1e1b4b', border: 'none', padding: '1.5rem' }}>
                           <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>{t('danger_zone')}</p>
                           <button onClick={handleDelete} style={{ width: '100%', height: '48px', borderRadius: '12px', background: 'rgba(225,29,72,0.1)', color: '#fb7185', border: '1.5px solid rgba(225,29,72,0.2)', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                               <Trash2 size={16} />
                               {t('delete')} {t('expenses')}
                           </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .receipt-view:hover .receipt-overlay { opacity: 1 !important; }
                @media (max-width: 900px) {
                    .details-grid { grid-template-columns: 1fr !important; }
                }
                @media print {
                    .no-print { display: none !important; }
                    body { background: #fff !important; }
                }
            `}</style>
        </FigmaLayout>
    );
}
