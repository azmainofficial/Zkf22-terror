import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { t } from '../../../Lang/translation';
import {
    ArrowLeft,
    Plus,
    Trash2,
    Calendar,
    Users,
    CreditCard,
    CheckCircle2,
    DollarSign,
    Loader2,
    Receipt,
    History,
    FileCheck,
    Briefcase,
    FileText,
    Percent,
    ArrowRight,
    Plane,
    Target,
    Settings,
    Building,
    Hash,
    FileUp,
    Zap,
    ShieldCheck,
    Check,
    Save,
    Building2,
    Box,
    ExternalLink
} from 'lucide-react';

const cardStyle = {
    background: '#fff',
    borderRadius: '24px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden'
};

const inputStyle = {
    width: '100%',
    height: '52px',
    padding: '0 1.25rem',
    borderRadius: '12px',
    border: '1.5px solid #f0eeff',
    background: '#f8fafc',
    fontSize: '0.95rem',
    fontWeight: 700,
    outline: 'none',
    transition: 'all 0.2s',
    color: '#1e1b4b'
};

const labelStyle = {
    fontSize: '0.75rem',
    fontWeight: 800,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: '8px',
    paddingLeft: '4px'
};

export default function Edit({ auth, expense, categories = [], projects = [], paymentMethods = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        expense_category_id: expense.expense_category_id || '',
        project_id: expense.project_id || '',
        title: expense.title || '',
        description: expense.description || '',
        amount: expense.amount || '',
        expense_date: expense.expense_date || '',
        payment_method: expense.payment_method || '',
        vendor_name: expense.vendor_name || '',
        receipt: null,
        status: expense.status || 'pending',
        is_reimbursable: !!expense.is_reimbursable
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('expenses.update', expense.id), {
            forceFormData: true,
        });
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`${t('edit')} ${t('expenses')} - ${expense.expense_number}`} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <Link href={route('expenses.index')} style={{ textDecoration: 'none' }}>
                            <button style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff', border: '1.5px solid #f0eeff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.2s' }} className="back-btn">
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>{t('edit')} {t('expenses')}</h1>
                                <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 900, color: '#6366f1' }}>{expense.expense_number}</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600, margin: '4px 0 0' }}>{t('update_client_info')}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={() => window.history.back()} style={{ height: '48px', padding: '0 1.5rem', background: '#fff', border: '1.5px solid #ede9fe', borderRadius: '12px', color: '#64748b', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer' }}>
                            {t('cancel')}
                        </button>
                        <button onClick={handleSubmit} disabled={processing}
                            style={{ height: '48px', padding: '0 2rem', background: '#6366f1', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}>
                            {processing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {t('update')} {t('expenses')}
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }} className="form-grid">
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* Basic Information Section */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <FileText size={18} color="#6366f1" />
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{t('basic_information')}</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={labelStyle}>{t('expense_title')}</label>
                                    <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="e.g. Office Equipment Repair" style={inputStyle} required />
                                    {errors.title && <p style={{ color: '#e11d48', fontSize: '0.75rem', fontWeight: 800, margin: '8px 4px 0' }}>{errors.title}</p>}
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={labelStyle}>{t('category')}</label>
                                        <select value={data.expense_category_id} onChange={(e) => setData('expense_category_id', e.target.value)} style={inputStyle} required>
                                            <option value="">{t('select_category')}</option>
                                            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>{t('payment_method')}</label>
                                        <select value={data.payment_method} onChange={(e) => setData('payment_method', e.target.value)} style={inputStyle} required>
                                            <option value="">{t('select_method')}</option>
                                            <option value="cash">{t('cash')}</option>
                                            <option value="bank_transfer">{t('bank_transfer')}</option>
                                            <option value="cheque">{t('cheque')}</option>
                                            <option value="credit_card">{t('credit_card')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>{t('expense_date')}</label>
                                        <input type="date" value={data.expense_date} onChange={(e) => setData('expense_date', e.target.value)} style={inputStyle} required />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>{t('vendor_name')}</label>
                                        <input type="text" value={data.vendor_name} onChange={(e) => setData('vendor_name', e.target.value)} placeholder="Supplier / Merchant" style={inputStyle} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Project & Notes */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <Briefcase size={18} color="#6366f1" />
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{t('project_details')} & {t('description')}</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={labelStyle}>{t('linked_project')}</label>
                                    <select value={data.project_id} onChange={(e) => setData('project_id', e.target.value)} style={inputStyle}>
                                        <option value="">{t('no_project')}</option>
                                        {projects.map((p) => <option key={p.id} value={p.id}>{p.title || p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>{t('description')}</label>
                                    <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder={t('internal_notes')}
                                        style={{ ...inputStyle, height: '120px', padding: '1rem', resize: 'none' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* Amount Card */}
                        <div style={{ ...cardStyle, background: '#1e1b4b', color: '#fff', border: 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('total_amount')}</h3>
                                <DollarSign size={20} color="#fff" />
                            </div>
                            
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.5rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)' }}>৳</span>
                                <input type="number" step="0.01" value={data.amount} onChange={(e) => setData('amount', e.target.value)} placeholder="0.00"
                                    style={{ width: '100%', height: '80px', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '0 1.25rem 0 3rem', fontSize: '2.5rem', fontWeight: 900, color: '#fff', outline: 'none' }} />
                            </div>

                            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ ...labelStyle, color: 'rgba(255,255,255,0.4)' }}>{t('status')}</label>
                                    <select value={data.status} onChange={(e) => setData('status', e.target.value)} 
                                        style={{ ...inputStyle, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', height: '48px' }}>
                                        <option value="pending" style={{ color: '#000' }}>{t('pending')}</option>
                                        <option value="approved" style={{ color: '#000' }}>{t('approved')}</option>
                                        <option value="paid" style={{ color: '#000' }}>{t('paid')}</option>
                                        <option value="rejected" style={{ color: '#000' }}>{t('rejected')}</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setData('is_reimbursable', !data.is_reimbursable)}>
                                    <div style={{ width: '40px', height: '20px', borderRadius: '10px', background: data.is_reimbursable ? '#10b981' : 'rgba(255,255,255,0.2)', position: 'relative', transition: 'all 0.2s' }}>
                                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: data.is_reimbursable ? '22px' : '2px', transition: 'all 0.2s' }} />
                                    </div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{t('is_reimbursable')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Receipt Upload */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <Receipt size={18} color="#6366f1" />
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{t('receipt')}</h3>
                            </div>

                            {expense.receipt && (
                                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '16px', border: '1.5px solid #f0eeff', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <FileCheck size={20} color="#10b981" />
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e1b4b' }}>{t('receipt')} Verified</span>
                                    </div>
                                    <a href={`/storage/${expense.receipt}`} target="_blank" style={{ color: '#6366f1' }}>
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            )}
                            
                            <div style={{ position: 'relative' }}>
                                <div style={{ width: '100%', height: '140px', borderRadius: '20px', border: '2px dashed #f0eeff', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', overflow: 'hidden' }} className="upload-box">
                                    {data.receipt ? (
                                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                                            <Check size={32} color="#10b981" />
                                            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e1b4b', margin: '8px 0', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.receipt.name}</p>
                                            <button type="button" onClick={() => setData('receipt', null)} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}>{t('cancel')}</button>
                                        </div>
                                    ) : (
                                        <>
                                            <FileUp size={32} color="#94a3b8" />
                                            <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b' }}>{t('new_design_files')}</p>
                                        </>
                                    )}
                                    <input type="file" onChange={(e) => setData('receipt', e.target.files[0])} 
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <style>{`
                .back-btn:hover { background: #f8fafc !important; transform: translateX(-4px); }
                .upload-box:hover { border-color: #6366f1; background: #f5f3ff; }
                .form-grid { grid-template-columns: 1.6fr 1fr; }
                @media (max-width: 1000px) {
                    .form-grid { grid-template-columns: 1fr !important; }
                }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </FigmaLayout>
    );
}
