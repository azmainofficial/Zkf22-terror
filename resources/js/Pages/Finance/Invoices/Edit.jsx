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
    Edit3,
    Upload,
    Save
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

export default function Edit({ auth, invoice, clients }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        client_id: invoice.client_id || '',
        invoice_date: invoice.invoice_date || '',
        due_date: invoice.due_date || '',
        status: invoice.status || 'draft',
        tax_amount: invoice.tax_amount || 0,
        discount_amount: invoice.discount_amount || 0,
        notes: invoice.notes || '',
        terms: invoice.terms || '',
        attachment: null,
        items: invoice.items && invoice.items.length > 0
            ? invoice.items.map(item => ({ id: item.id, description: item.description, quantity: item.quantity, unit_price: item.unit_price }))
            : [{ description: '', quantity: 1, unit_price: 0 }]
    });

    const addItem = () => {
        setData('items', [...data.items, { description: '', quantity: 1, unit_price: 0 }]);
    };

    const removeItem = (index) => {
        if (data.items.length > 1) {
            const newItems = data.items.filter((_, i) => i !== index);
            setData('items', newItems);
        }
    };

    const updateItem = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;
        setData('items', newItems);
    };

    const subtotal = data.items.reduce((sum, item) => {
        return sum + (parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0));
    }, 0);

    const total = subtotal + parseFloat(data.tax_amount || 0) - parseFloat(data.discount_amount || 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('invoices.update', invoice.id), {
            forceFormData: true,
        });
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Edit Invoice - ${invoice.invoice_number}`} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <Link href={route('invoices.show', invoice.id)} style={{ textDecoration: 'none' }}>
                            <button style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff', border: '1.5px solid #f0eeff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.2s' }} className="back-btn">
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Edit Invoice</h1>
                                <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 900, color: '#6366f1' }}>{invoice.invoice_number}</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600, margin: '4px 0 0' }}>Modify the details of your existing invoice</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={() => window.history.back()} style={{ height: '48px', padding: '0 1.5rem', background: '#fff', border: '1.5px solid #ede9fe', borderRadius: '12px', color: '#64748b', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer' }}>
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={processing}
                            style={{ height: '48px', padding: '0 2rem', background: '#6366f1', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}>
                            {processing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Update Invoice
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }} className="form-grid">
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* Client & Status Section */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <Users size={18} color="#6366f1" />
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Client Information</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={labelStyle}>Select Client</label>
                                    <select value={data.client_id} onChange={(e) => setData('client_id', e.target.value)} style={inputStyle}>
                                        <option value="">Choose a Client</option>
                                        {clients.map((client) => <option key={client.id} value={client.id}>{client.company_name || client.name}</option>)}
                                    </select>
                                    {errors.client_id && <p style={{ color: '#e11d48', fontSize: '0.75rem', fontWeight: 800, margin: '8px 4px 0' }}>{errors.client_id}</p>}
                                </div>
                                <div>
                                    <label style={labelStyle}>Invoice Status</label>
                                    <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px', gap: '4px', flexWrap: 'wrap' }}>
                                        {['draft', 'sent', 'paid', 'overdue', 'cancelled'].map((s) => (
                                            <button key={s} type="button" onClick={() => setData('status', s)}
                                                style={{ flex: 1, minWidth: '70px', height: '44px', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', background: data.status === s ? '#fff' : 'transparent', color: data.status === s ? '#6366f1' : '#64748b', boxShadow: data.status === s ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}>
                                                {s.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div style={{ ...cardStyle, padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Receipt size={18} color="#6366f1" />
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Invoice Items</h3>
                                </div>
                                <button type="button" onClick={addItem} style={{ padding: '0.6rem 1rem', background: '#f5f3ff', border: 'none', borderRadius: '10px', color: '#6366f1', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Plus size={16} /> Add Item
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {data.items.map((item, index) => (
                                    <div key={index} style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1.5px solid #f1f5f9' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 80px 140px 40px', gap: '1rem', alignItems: 'flex-end' }}>
                                            <div>
                                                <label style={labelStyle}>Description</label>
                                                <input type="text" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} placeholder="Service or product name..." style={inputStyle} />
                                            </div>
                                            <div>
                                                <label style={{ ...labelStyle, textAlign: 'center' }}>Qty</label>
                                                <input type="number" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} min="1" style={{ ...inputStyle, textAlign: 'center', padding: '0' }} />
                                            </div>
                                            <div>
                                                <label style={{ ...labelStyle, textAlign: 'right' }}>Unit Price (৳)</label>
                                                <input type="number" step="0.01" value={item.unit_price} onChange={(e) => updateItem(index, 'unit_price', e.target.value)} placeholder="0.00" style={{ ...inputStyle, textAlign: 'right' }} />
                                            </div>
                                            <div style={{ height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <button type="button" onClick={() => removeItem(index)} disabled={data.items.length === 1}
                                                    style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', display: data.items.length === 1 ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>Line Total</span>
                                            <span style={{ fontSize: '1rem', fontWeight: 900, color: '#6366f1' }}>৳{(parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0)).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={cardStyle}>
                                <label style={labelStyle}>Internal Notes</label>
                                <textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} placeholder="Add private notes for internal reference..."
                                    style={{ ...inputStyle, height: '120px', padding: '1rem', resize: 'none' }} />
                            </div>
                            <div style={cardStyle}>
                                <label style={labelStyle}>Terms & Conditions</label>
                                <textarea value={data.terms} onChange={(e) => setData('terms', e.target.value)} placeholder="Add payment terms or instructions for the client..."
                                    style={{ ...inputStyle, height: '120px', padding: '1rem', resize: 'none' }} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* Summary Section */}
                        <div style={{ ...cardStyle, background: '#1e1b4b', color: '#fff', border: 'none' }}>
                            <h3 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem' }}>Invoice Summary</h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>Subtotal</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>৳{subtotal.toLocaleString()}</span>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>Tax (+)</span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>৳{parseFloat(data.tax_amount || 0).toLocaleString()}</span>
                                    </div>
                                    <input type="number" value={data.tax_amount} onChange={(e) => setData('tax_amount', e.target.value)} 
                                        style={{ width: '100%', height: '44px', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '1rem', fontWeight: 800, outline: 'none', padding: '0 1rem', textAlign: 'right' }} />
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f43f5e', textTransform: 'uppercase' }}>Discount (-)</span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f43f5e' }}>৳{parseFloat(data.discount_amount || 0).toLocaleString()}</span>
                                    </div>
                                    <input type="number" value={data.discount_amount} onChange={(e) => setData('discount_amount', e.target.value)} 
                                        style={{ width: '100%', height: '44px', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '1rem', fontWeight: 800, outline: 'none', padding: '0 1rem', textAlign: 'right' }} />
                                </div>

                                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1.5px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Total Amount</span>
                                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>৳{total.toLocaleString()}</h2>
                                </div>
                            </div>
                        </div>

                        {/* Dates & Attachment Section */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <Calendar size={18} color="#6366f1" />
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Important Dates</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={labelStyle}>Invoice Date</label>
                                    <input type="date" value={data.invoice_date} onChange={(e) => setData('invoice_date', e.target.value)} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Due Date</label>
                                    <input type="date" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} 
                                        style={{ ...inputStyle, border: errors.due_date ? '1.5px solid #e11d48' : inputStyle.border }} />
                                    {errors.due_date && <p style={{ color: '#e11d48', fontSize: '0.75rem', fontWeight: 800, margin: '8px 4px 0' }}>{errors.due_date}</p>}
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1.5px solid #f0eeff' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                    <Upload size={18} color="#6366f1" />
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Update Attachment</h3>
                                </div>
                                {invoice.attachment && (
                                    <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <FileText size={16} color="#6366f1" />
                                        <a href={`/storage/${invoice.attachment}`} target="_blank" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6366f1', textDecoration: 'none' }}>View Current Attachment</a>
                                    </div>
                                )}
                                <input type="file" onChange={(e) => setData('attachment', e.target.files[0])} 
                                    style={{ width: '100%', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <style>{`
                .back-btn:hover { background: #f8fafc !important; transform: translateX(-4px); }
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
