import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { t } from '../../../Lang/translation';
import {
    ArrowLeft,
    Calendar,
    ChevronDown,
    Upload,
    Save,
    Check,
    AlertCircle,
    Info,
    DollarSign,
    Lock
} from 'lucide-react';

export default function Create({ auth, clients, invoices, paymentMethods = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        invoice_id: '',
        client_id: '',
        project_id: '',
        payment_type: 'incoming',
        payment_date: new Date().toISOString().split('T')[0],
        amount: '',
        payment_method: paymentMethods.length > 0 ? paymentMethods[0].code : '',
        reference_number: '',
        status: 'completed',
        notes: '',
        receipt: null
    });

    const [filteredProjects, setFilteredProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [balanceLimit, setBalanceLimit] = useState(null);

    const handleClientChange = (clientId) => {
        setData(prev => ({ ...prev, client_id: clientId, invoice_id: '', project_id: '', amount: '' }));
        setSelectedProject(null);
        setBalanceLimit(null);
        if (clientId) {
            const client = clients.find(c => c.id == clientId);
            setFilteredProjects(client?.projects || []);
        } else {
            setFilteredProjects([]);
        }
    };

    const handleProjectChange = (projectId) => {
        const project = filteredProjects.find(p => p.id == projectId);
        setData(prev => ({ ...prev, project_id: projectId, amount: '' }));
        setSelectedProject(project || null);
        
        if (project) {
            const totalPaid = parseFloat(project.payments_sum_amount || 0);
            const budget = parseFloat(project.budget || 0);
            const remaining = budget - totalPaid;
            setBalanceLimit(remaining > 0 ? remaining : 0);
        } else {
            setBalanceLimit(null);
        }
    };

    const handleAmountChange = (val) => {
        const numVal = parseFloat(val);
        if (balanceLimit !== null && numVal > balanceLimit) {
            setData('amount', balanceLimit.toString());
        } else {
            setData('amount', val);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('payments.store'));
    };

    const labelStyle = {
        fontSize: '0.85rem',
        fontWeight: 700,
        color: '#1e1b4b',
        marginBottom: '8px',
        display: 'block'
    };

    const inputStyle = {
        width: '100%',
        height: '48px',
        padding: '0 1rem',
        borderRadius: '10px',
        border: '1.5px solid #eef2f6',
        background: '#fff',
        fontSize: '0.9rem',
        fontWeight: 500,
        outline: 'none',
        transition: 'all 0.2s',
        color: '#1e1b4b',
        boxSizing: 'border-box'
    };

    const fmt = (n) => `৳${new Intl.NumberFormat().format(n)}`;

    return (
        <FigmaLayout user={auth.user}>
            <Head title={t('record_payment')} />

            <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
                
                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                    <Link href={route('payments.index')}>
                        <button style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: '#fff', border: '1.5px solid #e5e7eb',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#374151'
                        }}>
                            <ArrowLeft size={18} />
                        </button>
                    </Link>
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{t('record_payment')}</h1>
                </div>

                {/* ── Main Form Card ── */}
                <div style={{ 
                    background: '#fff', 
                    borderRadius: '20px', 
                    border: '1.5px solid #f0f4f8', 
                    padding: '2.5rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                }}>
                    
                    {/* Payment Type */}
                    <div>
                        <label style={labelStyle}>{t('type')}</label>
                        <div style={{
                            display: 'inline-flex',
                            padding: '6px 16px',
                            background: '#eff6ff',
                            color: '#2563eb',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            textTransform: 'capitalize'
                        }}>
                            {data.payment_type === 'incoming' ? t('received_payments') : (t('total_expenses') || 'Outgoing')}
                        </div>
                    </div>

                    {/* Client & Project Selection */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <label style={labelStyle}>{t('client')}</label>
                            <select 
                                value={data.client_id} 
                                onChange={(e) => handleClientChange(e.target.value)} 
                                style={{ ...inputStyle, appearance: 'none' }}
                            >
                                <option value="">{t('select_client')}</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.company_name || client.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', right: '16px', bottom: '16px', pointerEvents: 'none' }} />
                            {errors.client_id && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', fontWeight: 600 }}>{errors.client_id}</p>}
                        </div>

                        <div style={{ position: 'relative' }}>
                            <label style={labelStyle}>{t('project')}</label>
                            <select 
                                value={data.project_id} 
                                onChange={(e) => handleProjectChange(e.target.value)} 
                                style={{ ...inputStyle, appearance: 'none' }}
                                disabled={!data.client_id}
                            >
                                <option value="">{t('no_project')}</option>
                                {filteredProjects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.title}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', right: '16px', bottom: '16px', pointerEvents: 'none' }} />
                            {errors.project_id && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', fontWeight: 600 }}>{errors.project_id}</p>}
                        </div>
                    </div>

                    {/* PROJECT FINANCIAL CONTEXT */}
                    {selectedProject && (
                        <div style={{ 
                            background: '#f8fafc', 
                            padding: '1rem', 
                            borderRadius: '12px', 
                            border: '1px solid #e2e8f0',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gap: '1rem'
                        }}>
                            <div>
                                <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', margin: 0 }}>Contract Value</p>
                                <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>{fmt(selectedProject.budget)}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', margin: 0 }}>Paid So Far</p>
                                <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981', margin: '2px 0 0' }}>{fmt(selectedProject.payments_sum_amount || 0)}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', margin: 0 }}>Remaining Limit</p>
                                <p style={{ fontSize: '0.9rem', fontWeight: 900, color: balanceLimit > 0 ? '#4f46e5' : '#ef4444', margin: '2px 0 0' }}>
                                    {fmt(balanceLimit)}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Amount & Date Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <label style={labelStyle}>
                                {t('amount')} 
                                {balanceLimit !== null && (
                                    <span style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: '6px', fontWeight: 600 }}>
                                        (Max: {fmt(balanceLimit)})
                                    </span>
                                )}
                            </label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }}>৳</span>
                                <input 
                                    type="number" 
                                    value={data.amount} 
                                    onChange={(e) => handleAmountChange(e.target.value)} 
                                    placeholder="0.00" 
                                    max={balanceLimit !== null ? balanceLimit : undefined}
                                    style={{ 
                                        ...inputStyle, 
                                        paddingLeft: '28px',
                                        borderColor: (balanceLimit !== null && parseFloat(data.amount) >= balanceLimit) ? '#f59e0b' : '#eef2f6'
                                    }} 
                                />
                                {balanceLimit !== null && parseFloat(data.amount) >= balanceLimit && (
                                    <Lock size={14} color="#f59e0b" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                )}
                            </div>
                            {errors.amount && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', fontWeight: 600 }}>{errors.amount}</p>}
                        </div>
                        <div style={{ position: 'relative' }}>
                            <label style={labelStyle}>{t('date')}</label>
                            <input 
                                type="date" 
                                value={data.payment_date} 
                                onChange={(e) => setData('payment_date', e.target.value)} 
                                style={inputStyle} 
                            />
                        </div>
                    </div>

                    {/* Method & Reference Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <label style={labelStyle}>{t('payment_method')}</label>
                            <select 
                                value={data.payment_method} 
                                onChange={(e) => setData('payment_method', e.target.value)} 
                                style={{ ...inputStyle, appearance: 'none' }}
                            >
                                <option value="">{t('select_method')}</option>
                                {paymentMethods.map((method) => (
                                    <option key={method.id} value={method.code}>{t(method.code.toLowerCase()) || method.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', right: '16px', bottom: '16px', pointerEvents: 'none' }} />
                        </div>
                        <div>
                            <label style={labelStyle}>{t('transaction_id')}</label>
                            <input 
                                type="text" 
                                value={data.reference_number} 
                                onChange={(e) => setData('reference_number', e.target.value)} 
                                placeholder={t('not_specified') || 'Optional'} 
                                style={inputStyle} 
                            />
                        </div>
                    </div>

                    {/* Status Selection */}
                    <div style={{ position: 'relative' }}>
                        <label style={labelStyle}>{t('status')}</label>
                        <select 
                            value={data.status} 
                            onChange={(e) => setData('status', e.target.value)} 
                            style={{ ...inputStyle, appearance: 'none' }}
                        >
                            <option value="pending">{t('pending')}</option>
                            <option value="completed">{t('completed')}</option>
                            <option value="failed">{t('rejected')}</option>
                            <option value="refunded">{t('refunded') || 'Refunded'}</option>
                        </select>
                        <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', right: '16px', bottom: '16px', pointerEvents: 'none' }} />
                    </div>

                    {/* Notes Selection */}
                    <div>
                        <label style={labelStyle}>{t('description')}</label>
                        <textarea 
                            value={data.notes} 
                            onChange={(e) => setData('notes', e.target.value)} 
                            placeholder={t('internal_notes')}
                            style={{ ...inputStyle, height: '100px', padding: '12px', resize: 'none' }} 
                        />
                    </div>

                    {/* Receipt Upload Dropzone */}
                    <div>
                        <label style={labelStyle}>{t('upload')} {t('receipt')}</label>
                        <div style={{
                            width: '100%',
                            height: '140px',
                            border: '1.5px dashed #cbd5e1',
                            borderRadius: '12px',
                            background: '#fff',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            position: 'relative'
                        }}>
                            {data.receipt ? (
                                <div style={{ textAlign: 'center' }}>
                                    <Check size={28} color="#10b981" />
                                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', margin: '4px 0' }}>{data.receipt.name}</p>
                                    <button onClick={(e) => { e.stopPropagation(); setData('receipt', null); }} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>{t('delete')}</button>
                                </div>
                            ) : (
                                <>
                                    <Upload size={28} color="#94a3b8" />
                                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#444' }}>
                                        <span style={{ color: '#2563eb' }}>{t('click_to_upload')}</span>
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>PNG, JPG, PDF up to 2MB</p>
                                </>
                            )}
                            <input 
                                type="file" 
                                onChange={(e) => setData('receipt', e.target.files[0])}
                                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Footer Button ── */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                    <button 
                        onClick={handleSubmit} 
                        disabled={processing || (balanceLimit !== null && parseFloat(data.amount) > balanceLimit)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '0.8rem 1.8rem',
                            background: (balanceLimit !== null && parseFloat(data.amount) > balanceLimit) ? '#cbd5e1' : '#2563eb',
                            border: 'none',
                            borderRadius: '10px',
                            color: '#fff',
                            fontSize: '0.95rem',
                            fontWeight: 800,
                            cursor: (processing || (balanceLimit !== null && parseFloat(data.amount) > balanceLimit)) ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            opacity: processing ? 0.7 : 1
                        }}
                    >
                        <Save size={18} />
                        {processing ? t('saving') : t('record_payment')}
                    </button>
                </div>

            </div>
        </FigmaLayout>
    );
}
