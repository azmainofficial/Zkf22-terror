import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft, Plus, Trash2, Calendar, Users, CreditCard,
    CheckCircle2, DollarSign, Loader2, Receipt, FileCheck,
    Briefcase, FileText, Percent, ArrowRight, Settings,
    LayoutGrid, Info, HelpCircle
} from 'lucide-react';

// ─── Shared Styles ─────────────────────────────────────────────
const card = {
    background: '#fff', borderRadius: '24px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
};
const onFocus = e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.1)'; };
const onBlur  = e => { e.target.style.borderColor = '#f0eeff'; e.target.style.boxShadow = 'none'; };

const inputStyle = {
    width: '100%', height: '52px', padding: '0 1.25rem',
    borderRadius: '12px', border: '1.5px solid #f0eeff',
    background: '#f9fafb', fontSize: '0.92rem', fontWeight: 700,
    outline: 'none', transition: 'all 0.2s', color: '#1e1b4b'
};

const labelStyle = {
    fontSize: '0.68rem', fontWeight: 800, color: '#9ca3af',
    textTransform: 'uppercase', letterSpacing: '0.08em',
    display: 'block', marginBottom: '8px', paddingLeft: '4px'
};

export default function Create({ auth, clients }) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        tax_amount: 0,
        discount_amount: 0,
        notes: '',
        terms: '',
        items: [{ description: '', quantity: 1, unit_price: 0 }]
    });

    const addItem = () => setData('items', [...data.items, { description: '', quantity: 1, unit_price: 0 }]);
    const removeItem = (i) => data.items.length > 1 && setData('items', data.items.filter((_, idx) => idx !== i));
    const updateItem = (i, f, v) => {
        const n = [...data.items]; n[i][f] = v; setData('items', n);
    };

    const subtotal = data.items.reduce((s, i) => s + (parseFloat(i.quantity || 0) * parseFloat(i.unit_price || 0)), 0);
    const total = subtotal + parseFloat(data.tax_amount || 0) - parseFloat(data.discount_amount || 0);

    const handleSubmit = (e) => { e.preventDefault(); post(route('invoices.store')); };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Invoice Creation" />

            <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
                
                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link href={route('invoices.index')}>
                            <button style={iconBtn('#fff', '#64748b', true)}><ArrowLeft size={20} /></button>
                        </Link>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2px' }}>
                                <Receipt size={14} color="#a78bfa" />
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Fiscal Authority</span>
                            </div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Instantiate Invoice</h1>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.625rem' }}>
                        <button onClick={() => window.history.back()} style={secondaryBtn}>Cancel</button>
                        <button onClick={handleSubmit} disabled={processing} style={primaryBtn}>
                            {processing ? <Loader2 size={18} className="spin" /> : <FileCheck size={18} />}
                            EXECUTE DISCHARGE
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '1.5rem' }}>
                    
                    {/* ── Left Manifest ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* Personnel Target */}
                        <div style={{ ...card, padding: '1.5rem' }}>
                            <div style={sectionHeader}><Users size={16} color="#6366f1" /> TARGET CLIENT</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Select Entity</label>
                                    <select value={data.client_id} onChange={e => setData('client_id', e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                                        <option value="">Search Client Database...</option>
                                        {clients.map(c => <option key={c.id} value={c.id}>{c.company_name || c.name}</option>)}
                                    </select>
                                    {errors.client_id && <p style={errorText}>{errors.client_id}</p>}
                                </div>
                                <div>
                                    <label style={labelStyle}>Manifest State</label>
                                    <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '14px', gap: '4px' }}>
                                        {['draft', 'sent'].map(s => (
                                            <button key={s} type="button" onClick={() => setData('status', s)}
                                                style={toggleBtn(data.status === s)}>
                                                {s.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Vector */}
                        <div style={{ ...card, padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={sectionHeader}><LayoutGrid size={16} color="#6366f1" /> LINE ITEMS</div>
                                <button type="button" onClick={addItem} style={{ padding: '0.5rem 1rem', background: '#f5f3ff', color: '#6366f1', border: 'none', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Plus size={14} /> APPEND
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {data.items.map((item, i) => (
                                    <div key={i} style={{ padding: '1.25rem', background: '#f9f9ff', borderRadius: '16px', border: '1.5px solid #f1f0ff', position: 'relative' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 140px 40px', gap: '1rem' }}>
                                            <div>
                                                <label style={labelStyle}>Descriptor</label>
                                                <input type="text" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Qty</label>
                                                <input type="number" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} style={{ ...inputStyle, textAlign: 'center' }} onFocus={onFocus} onBlur={onBlur} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Unit Magnitude (৳)</label>
                                                <input type="number" value={item.unit_price} onChange={e => updateItem(i, 'unit_price', e.target.value)} style={{ ...inputStyle, textAlign: 'right' }} onFocus={onFocus} onBlur={onBlur} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '8px' }}>
                                                <button type="button" onClick={() => removeItem(i)} disabled={data.items.length === 1} style={iconBtn('#fff', '#ef4444')}><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Meta */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ ...card, padding: '1.5rem' }}>
                                <div style={sectionHeader}><Info size={16} color="#6366f1" /> OPERATIVE NOTES</div>
                                <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} style={{ ...inputStyle, height: '100px', padding: '1rem', resize: 'none' }} onFocus={onFocus} onBlur={onBlur} />
                            </div>
                            <div style={{ ...card, padding: '1.5rem' }}>
                                <div style={sectionHeader}><HelpCircle size={16} color="#6366f1" /> TERMS</div>
                                <textarea value={data.terms} onChange={e => setData('terms', e.target.value)} style={{ ...inputStyle, height: '100px', padding: '1rem', resize: 'none' }} onFocus={onFocus} onBlur={onBlur} />
                            </div>
                        </div>
                    </div>

                    {/* ── Summary Column ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* Magnitude Summary */}
                        <div style={{ ...card, background: 'linear-gradient(135deg, #1e1b4b, #312e81)', color: '#fff', border: 'none', padding: '2rem' }}>
                            <h3 style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '2rem' }}>FINANCIAL MAGNITUDE</h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={sumRow}>
                                    <span style={{ opacity: 0.6 }}>Manifest Subtotal</span>
                                    <span style={{ fontWeight: 800 }}>৳{subtotal.toLocaleString()}</span>
                                </div>
                                <div style={sumInputRow}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 900 }}>TAX (+)</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>৳{parseFloat(data.tax_amount || 0).toLocaleString()}</span>
                                    </div>
                                    <input type="number" value={data.tax_amount} onChange={e => setData('tax_amount', e.target.value)} style={darkInput} />
                                </div>
                                <div style={sumInputRow}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '0.65rem', color: '#f43f5e', fontWeight: 900 }}>DISCOUNT (-)</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>৳{parseFloat(data.discount_amount || 0).toLocaleString()}</span>
                                    </div>
                                    <input type="number" value={data.discount_amount} onChange={e => setData('discount_amount', e.target.value)} style={darkInput} />
                                </div>
                                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1.5px solid rgba(255,255,255,0.1)' }}>
                                    <p style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '8px' }}>Total Vector Magnitude</p>
                                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, letterSpacing: '-0.03em' }}>৳{total.toLocaleString()}</h2>
                                </div>
                            </div>
                        </div>

                        {/* Temporal Bounds */}
                        <div style={{ ...card, padding: '1.5rem' }}>
                            <div style={sectionHeader}><Calendar size={16} color="#6366f1" /> TEMPORAL BOUNDS</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Manifest Initialization</label>
                                    <input type="date" value={data.invoice_date} onChange={e => setData('invoice_date', e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Temporal Discharge Deadline</label>
                                    <input type="date" value={data.due_date} onChange={e => setData('due_date', e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <style>{`.spin { animation: rotate 1s linear infinite; } @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </FigmaLayout>
    );
}

const sectionHeader = { fontSize: '0.75rem', fontWeight: 900, color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', letterSpacing: '0.05em' };
const primaryBtn = { display: 'flex', alignItems: 'center', gap: '10px', padding: '0 1.75rem', height: '52px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '14px', color: '#fff', fontSize: '0.85rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.25)' };
const secondaryBtn = { padding: '0 1.5rem', height: '52px', background: '#fff', border: '1px solid #ede9fe', borderRadius: '14px', color: '#64748b', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' };
const sumRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' };
const sumInputRow = { background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '14px' };
const darkInput = { width: '100%', height: '40px', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.95rem', fontWeight: 800, outline: 'none', padding: '0 10px', textAlign: 'right' };
const errorText = { color: '#ef4444', fontSize: '0.7rem', fontWeight: 800, margin: '6px 4px 0' };
const iconBtn = (bg, color, border) => ({ width: '44px', height: '44px', borderRadius: '12px', background: bg, border: border ? '1px solid #f0eeff' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color, cursor: 'pointer' });
const toggleBtn = (active) => ({ flex: 1, height: '40px', border: 'none', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', background: active ? '#fff' : 'transparent', color: active ? '#6366f1' : '#64748b', boxShadow: active ? '0 2px 8px rgba(0,0,0,0.06)' : 'none', transition: 'all 0.2s' });
