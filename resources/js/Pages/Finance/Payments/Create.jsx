import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
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
    Check
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

    const handleClientChange = (clientId) => {
        setData(prev => ({ ...prev, client_id: clientId, invoice_id: '', project_id: '', amount: '' }));
        if (clientId) {
            const client = clients.find(c => c.id == clientId);
            setFilteredProjects(client?.projects || []);
        } else {
            setFilteredProjects([]);
        }
    };

    const handleProjectSelect = (project) => {
        const remaining = parseFloat(project.budget) - (parseFloat(project.payments_sum_amount) || 0);
        setData(prev => ({
            ...prev,
            project_id: project.id,
            amount: remaining > 0 ? remaining : 0
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('payments.store'));
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Receive Payment" />

            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <Link href={route('payments.index')} style={{ textDecoration: 'none' }}>
                            <button style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff', border: '1.5px solid #f0eeff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.2s' }} className="back-btn">
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Receive Payment</h1>
                            <p style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600, margin: '4px 0 0' }}>Record a new payment received from a client</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={() => window.history.back()} style={{ height: '48px', padding: '0 1.5rem', background: '#fff', border: '1.5px solid #ede9fe', borderRadius: '12px', color: '#64748b', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer' }}>
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={processing}
                            style={{ height: '48px', padding: '0 2rem', background: '#6366f1', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}>
                            {processing ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                            Save Payment
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }} className="form-grid">
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* Client & Project Section */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <Building size={18} color="#6366f1" />
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Client & Project</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={labelStyle}>Client Name</label>
                                    <select value={data.client_id} onChange={(e) => handleClientChange(e.target.value)} style={inputStyle}>
                                        <option value="">Select a Client</option>
                                        {clients.map((client) => <option key={client.id} value={client.id}>{client.company_name || client.name}</option>)}
                                    </select>
                                    {errors.client_id && <p style={{ color: '#e11d48', fontSize: '0.75rem', fontWeight: 800, margin: '8px 4px 0' }}>{errors.client_id}</p>}
                                </div>
                                <div>
                                    <label style={labelStyle}>Associate with Project</label>
                                    <select value={data.project_id} disabled={!data.client_id} onChange={(e) => {
                                        const proj = filteredProjects.find(p => p.id == e.target.value);
                                        if (proj) handleProjectSelect(proj);
                                        else setData('project_id', e.target.value);
                                    }} style={{ ...inputStyle, opacity: !data.client_id ? 0.5 : 1 }}>
                                        <option value="">General Payment (No Project)</option>
                                        {filteredProjects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Details */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <CreditCard size={18} color="#6366f1" />
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Transaction Details</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={labelStyle}>Payment Date</label>
                                    <input type="date" value={data.payment_date} onChange={(e) => setData('payment_date', e.target.value)} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Payment Method</label>
                                    <select value={data.payment_method} onChange={(e) => setData('payment_method', e.target.value)} style={inputStyle}>
                                        <option value="">Select Method</option>
                                        {paymentMethods.map((method) => <option key={method.id} value={method.code}>{method.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Reference Number</label>
                                    <input type="text" value={data.reference_number} onChange={(e) => setData('reference_number', e.target.value)} placeholder="e.g. TXN-12345" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Payment Status</label>
                                    <select value={data.status} onChange={(e) => setData('status', e.target.value)} style={inputStyle}>
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending Verification</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                <FileText size={18} color="#6366f1" />
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Additional Notes</h3>
                            </div>
                            <textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} placeholder="Add any extra details about this transaction..."
                                style={{ ...inputStyle, height: '120px', padding: '1rem', resize: 'none' }} />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* Amount Card */}
                        <div style={{ ...cardStyle, background: '#1e1b4b', color: '#fff', border: 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Amount Received</h3>
                                <Zap size={16} className="animate-pulse" color="#fff" />
                            </div>
                            
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.5rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)' }}>৳</span>
                                <input type="number" value={data.amount} onChange={(e) => setData('amount', e.target.value)} placeholder="0.00"
                                    style={{ width: '100%', height: '80px', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '0 1.25rem 0 3rem', fontSize: '2.5rem', fontWeight: 900, color: '#fff', outline: 'none' }} />
                            </div>

                            <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textAlign: 'center' }}>
                                This payment will be securely recorded in your fiscal ledger.
                            </p>
                        </div>

                        {/* Receipt Upload */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <Receipt size={18} color="#6366f1" />
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Upload Receipt</h3>
                            </div>
                            
                            <div style={{ position: 'relative' }}>
                                <div style={{ width: '100%', height: '160px', borderRadius: '20px', border: '2px dashed #f0eeff', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s', overflow: 'hidden' }} className="upload-box">
                                    {data.receipt ? (
                                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                                            <Check size={32} color="#10b981" />
                                            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e1b4b', margin: '8px 0', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.receipt.name}</p>
                                            <button type="button" onClick={() => setData('receipt', null)} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}>Change File</button>
                                        </div>
                                    ) : (
                                        <>
                                            <FileUp size={32} color="#94a3b8" />
                                            <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b' }}>Drop file here or click to upload</p>
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
