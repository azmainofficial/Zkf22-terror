import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { t } from '../../../Lang/translation';
import { 
    ArrowLeft, Plus, X, Tag, Save, Loader2 
} from 'lucide-react';

const InputField = ({ label, error, children, required }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
            {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        {children}
        {error && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '2px' }}>{error}</p>}
    </div>
);

const inputBase = {
    width: '100%',
    height: '42px',
    padding: '0 0.75rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    background: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    color: '#0f172a',
    boxSizing: 'border-box'
};

export default function Create({ auth, categories = [], projects = [], paymentMethods = [] }) {
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', code: '' });
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        expense_category_id: '',
        project_id: '',
        title: '',
        description: '',
        amount: '',
        expense_date: new Date().toISOString().split('T')[0],
        payment_method: '',
        vendor_name: '',
        receipt: null,
        status: 'pending',
        is_reimbursable: false
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('project_id');
        if (projectId) {
            setData('project_id', projectId);
            const p = projects.find(it => it.id.toString() === projectId);
            if (p) setData('title', `Expense for ${p.title}`);
        }
    }, [projects]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('expenses.store'), { forceFormData: true });
    };

    const handleCreateCategory = () => {
        if (!newCategory.name || !newCategory.code) return;
        setIsCreatingCategory(true);
        router.post(route('expense-categories.store'), newCategory, {
            preserveScroll: true,
            onSuccess: () => {
                setShowCategoryModal(false);
                setNewCategory({ name: '', code: '' });
                setIsCreatingCategory(false);
            },
            onError: () => setIsCreatingCategory(false)
        });
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Add Expense" />

            {/* MINIMAL MODAL */}
            {showCategoryModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', borderRadius: '12px', width: '340px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <p style={{ fontWeight: 700, margin: 0 }}>New Category</p>
                            <button onClick={() => setShowCategoryModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={18} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <InputField label="Name">
                                <input type="text" value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})} style={inputBase} />
                            </InputField>
                            <InputField label="Code">
                                <input type="text" value={newCategory.code} onChange={e => setNewCategory({...newCategory, code: e.target.value})} style={inputBase} />
                            </InputField>
                            <button onClick={handleCreateCategory} disabled={isCreatingCategory} style={{ width: '100%', height: '40px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                {isCreatingCategory ? 'Saving...' : 'Save Category'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1rem' }}>
                
                {/* Minimal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link href={route('expenses.index')}>
                            <ArrowLeft size={20} color="#64748b" />
                        </Link>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Record Expense</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => window.history.back()} style={{ height: '38px', padding: '0 1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={handleSubmit} disabled={processing} style={{ height: '38px', padding: '0 1.25rem', background: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '0.85rem', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                            {processing ? 'Saving...' : 'Save Expense'}
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Basic Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>Information</p>
                        <InputField label="Expense Title" required error={errors.title}>
                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} style={inputBase} placeholder="e.g. Office Supplies" />
                        </InputField>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <InputField label="Category" required error={errors.expense_category_id}>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <select value={data.expense_category_id} onChange={e => setData('expense_category_id', e.target.value)} style={{ ...inputBase, cursor: 'pointer' }}>
                                        <option value="">Select...</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <button type="button" onClick={() => setShowCategoryModal(true)} style={{ height: '42px', width: '42px', minWidth: '42px', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><Plus size={18} /></button>
                                </div>
                            </InputField>
                            <InputField label="Payment Method" required error={errors.payment_method}>
                                <select value={data.payment_method} onChange={e => setData('payment_method', e.target.value)} style={{ ...inputBase, cursor: 'pointer' }}>
                                    <option value="">Select...</option>
                                    <option value="cash">Cash</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="cheque">Cheque</option>
                                    <option value="credit_card">Credit Card</option>
                                </select>
                            </InputField>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <InputField label="Date" required error={errors.expense_date}>
                                <input type="date" value={data.expense_date} onChange={e => setData('expense_date', e.target.value)} style={inputBase} />
                            </InputField>
                            <InputField label="Vendor / Payee">
                                <input type="text" value={data.vendor_name} onChange={e => setData('vendor_name', e.target.value)} placeholder="Merchant Name" style={inputBase} />
                            </InputField>
                        </div>
                    </div>

                    {/* Financials */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>Financials</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <InputField label="Amount (৳)" required error={errors.amount}>
                                <input type="number" step="0.01" value={data.amount} onChange={e => setData('amount', e.target.value)} placeholder="0.00" style={{ ...inputBase, fontWeight: 700, fontSize: '1.1rem' }} />
                            </InputField>
                            <InputField label="Record Status">
                                <select value={data.status} onChange={e => setData('status', e.target.value)} style={inputBase}>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </InputField>
                        </div>
                        <div onClick={() => setData('is_reimbursable', !data.is_reimbursable)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 0' }}>
                            <div style={{ width: '32px', height: '18px', borderRadius: '9px', background: data.is_reimbursable ? '#0f172a' : '#e2e8f0', position: 'relative', transition: '0.2s' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: data.is_reimbursable ? '17px' : '3px', transition: '0.2s' }} />
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Mark as Reimbursable</span>
                        </div>
                    </div>

                    {/* Allocation */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>Allocation</p>
                        <InputField label="Linked Project">
                            <select value={data.project_id} onChange={e => setData('project_id', e.target.value)} style={inputBase}>
                                <option value="">General Overhead</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                            </select>
                        </InputField>
                        <InputField label="Internal Description">
                            <textarea value={data.description} onChange={e => setData('description', e.target.value)} style={{ ...inputBase, height: '80px', padding: '8px', resize: 'none' }} />
                        </InputField>
                    </div>

                    {/* Receipt */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>Evidence</p>
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input type="file" onChange={e => setData('receipt', e.target.files[0])} style={{ fontSize: '0.85rem' }} />
                            {data.receipt && <span style={{ fontSize: '0.8rem', color: '#10b981' }}>✓</span>}
                        </div>
                    </div>

                </form>
            </div>
            
            <style>{`
                input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0.5; }
                input:focus, select:focus, textarea:focus { border-color: #0f172a !important; }
            `}</style>
        </FigmaLayout>
    );
}
