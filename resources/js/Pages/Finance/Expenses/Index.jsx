import React, { useState, useEffect, useRef } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { t } from '../../../Lang/translation';
import {
    Plus, Search, Eye, Trash2, CheckCircle2, XCircle, Clock,
    Edit, Save, X, Loader2, Filter, RotateCcw, Receipt,
    DollarSign, ChevronDown, Briefcase, Building2, CreditCard,
    FileCheck, AlertCircle, Calendar, Printer
} from 'lucide-react';
import Modal from '@/Components/Modal';

/* ─── tiny helpers ─── */
const fmt = (n) => '৳' + new Intl.NumberFormat('en-BD').format(Number(n) || 0);

const STATUS = {
    approved: { label: 'Approved', bg: '#f0fdf4', color: '#16a34a', icon: CheckCircle2 },
    paid:     { label: 'Paid',     bg: '#eff6ff', color: '#2563eb', icon: CheckCircle2 },
    pending:  { label: 'Pending',  bg: '#fffbeb', color: '#d97706', icon: Clock },
    rejected: { label: 'Rejected', bg: '#fff1f2', color: '#dc2626', icon: XCircle },
};
const getStatus = (s) => STATUS[(s || 'pending').toLowerCase()] || STATUS.pending;

const PAYMENT_LABELS = {
    cash: 'Cash', bank_transfer: 'Bank Transfer',
    cheque: 'Cheque', credit_card: 'Credit Card',
};

const inputBase = {
    width: '100%', height: '38px', padding: '0 0.75rem',
    borderRadius: '8px', border: '1px solid #e2e8f0',
    background: '#fff', fontSize: '0.875rem', outline: 'none',
    color: '#1e293b', boxSizing: 'border-box',
};

const labelSm = { fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' };

/* ─── component ─── */
export default function Index({ auth, expenses, filters = {}, categories = [], projects = [], paymentMethods = [] }) {
    const isFirst = useRef(true);

    const [f, setF] = useState({
        search:         filters.search         || '',
        status:         filters.status         || '',
        category_id:    filters.category_id    || '',
        project_id:     filters.project_id     || '',
        payment_method: filters.payment_method || '',
        from_date:      filters.from_date      || '',
        to_date:        filters.to_date        || '',
        project_type:   filters.project_type   || '',
    });
    const [showFilters, setShowFilters] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    /* active filter count (excluding search) */
    const activeCount = ['status','category_id','project_id','payment_method',
                         'from_date','to_date','project_type'].filter(k => f[k]).length;

    /* debounced sync to URL */
    useEffect(() => {
        if (isFirst.current) { isFirst.current = false; return; }
        const timer = setTimeout(() => {
            router.get(route('expenses.index'), f, { preserveState: true, replace: true });
        }, 400);
        return () => clearTimeout(timer);
    }, [f]);

    const set = (key, val) => setF(prev => ({ ...prev, [key]: val }));
    const resetFilters = () => setF({ search:'', status:'', category_id:'', project_id:'',
        payment_method:'', from_date:'', to_date:'', project_type:'' });

    /* forms */
    const expForm = useForm({
        expense_category_id:'', project_id:'', title:'', description:'',
        amount:'', expense_date: new Date().toISOString().split('T')[0],
        payment_method:'', vendor_name:'', receipt: null, status:'pending', is_reimbursable: false,
    });
    const catForm = useForm({ name:'', code:'', description:'', color:'#2563eb', is_active: true });

    const handleCreateExpense = (e) => {
        e.preventDefault();
        expForm.post(route('expenses.store'), {
            forceFormData: true,
            onSuccess: () => { setShowCreateModal(false); expForm.reset(); },
            preserveScroll: true,
        });
    };

    const handleCategorySubmit = (e) => {
        e.preventDefault();
        const opts = { preserveScroll: true, onSuccess: () => { setShowCategoryModal(false); setEditingCategory(null); catForm.reset(); } };
        editingCategory
            ? catForm.put(route('expense-categories.update', editingCategory.id), opts)
            : catForm.post(route('expense-categories.store'), opts);
    };

    /* summary stats from current page */
    const total   = expenses.data.reduce((s, e) => s + Number(e.amount),  0);
    const paid    = expenses.data.filter(e => e.status === 'paid').reduce((s, e) => s + Number(e.amount), 0);
    const pending = expenses.data.filter(e => e.status === 'pending').length;

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Expenses" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>

                {/* ── Header ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Expense Ledger</h1>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>
                            All recorded financial outflows · {expenses.total} entries
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Link href={route('expenses.create')}>
                            <button style={{ height: '40px', padding: '0 1.25rem', background: '#0f172a', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Plus size={18} /> Record Expense
                            </button>
                        </Link>
                    </div>
                </div>

                {/* ── Summary Strip ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                    {[
                        { label: 'Page Total', value: fmt(total),   color: '#0f172a', icon: DollarSign },
                        { label: 'Paid',        value: fmt(paid),    color: '#16a34a', icon: CheckCircle2 },
                        { label: 'Pending',     value: `${pending} records`, color: '#d97706', icon: Clock },
                    ].map((s, i) => (
                        <div key={i} style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                                <s.icon size={18} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>{s.label}</p>
                                <p style={{ fontSize: '1.15rem', fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Search + Filter Bar (Enhanced) ── */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                    
                    {/* Universal Search */}
                    <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                        <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input value={f.search} onChange={e => set('search', e.target.value)}
                            placeholder="Find by Title, Vendor, or ID..."
                            style={{ ...inputBase, paddingLeft: '2.25rem', height: '42px', border: '1px solid #e2e8f0' }} />
                    </div>

                    {/* PROJECT WISE FILTER */}
                    <div style={{ position: 'relative', minWidth: '180px' }}>
                        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6366f1' }}>
                            <Briefcase size={14} />
                        </div>
                        <select value={f.project_id} onChange={e => set('project_id', e.target.value)} 
                            style={{ ...inputBase, fontSize: '0.8rem', height: '42px', paddingLeft: '2.25rem', paddingRight: '2rem', appearance: 'none', fontWeight: 700, borderColor: f.project_id ? '#6366f1' : '#e2e8f0', background: f.project_id ? '#f5f3ff' : '#fff' }}>
                            <option value="">All Projects</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                        </select>
                        <ChevronDown size={14} color="#94a3b8" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>

                    {/* DATE WISE FILTER (Promoted) */}
                    <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0 8px', height: '42px' }}>
                        <Calendar size={14} color="#64748b" style={{ marginRight: '8px' }} />
                        <input type="date" value={f.from_date} onChange={e => set('from_date', e.target.value)} 
                            style={{ border: 'none', fontSize: '0.8rem', color: '#1e293b', fontWeight: 700, width: '115px', outline: 'none' }} 
                            title="Start Date" />
                        <span style={{ margin: '0 8px', color: '#cbd5e1' }}>→</span>
                        <input type="date" value={f.to_date} onChange={e => set('to_date', e.target.value)} 
                            style={{ border: 'none', fontSize: '0.8rem', color: '#1e293b', fontWeight: 700, width: '115px', outline: 'none' }} 
                            title="End Date" />
                    </div>

                    {/* PROJECT TYPE TOGGLE */}
                    <div style={{ display: 'flex', background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '2px' }}>
                        <button onClick={() => set('project_type', '')} style={{ padding: '0 10px', height: '36px', borderRadius: '8px', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: f.project_type === '' ? '#0f172a' : 'transparent', color: f.project_type === '' ? '#fff' : '#64748b' }}>All</button>
                        <button onClick={() => set('project_type', 'with_project')} title="Project Expenses" style={{ padding: '0 10px', height: '36px', borderRadius: '8px', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: f.project_type === 'with_project' ? '#6366f1' : 'transparent', color: f.project_type === 'with_project' ? '#fff' : '#64748b' }}>Projects</button>
                        <button onClick={() => set('project_type', 'no_project')} title="General Overhead" style={{ padding: '0 10px', height: '36px', borderRadius: '8px', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: f.project_type === 'no_project' ? '#ef4444' : 'transparent', color: f.project_type === 'no_project' ? '#fff' : '#64748b' }}>Overhead</button>
                    </div>

                    {/* Filter Toggle */}
                    <button onClick={() => setShowFilters(v => !v)} style={{ height: '42px', padding: '0 1rem', background: showFilters ? '#0f172a' : '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', color: showFilters ? '#fff' : '#475569', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Filter size={16} /> Advanced
                        {activeCount > 0 && <span style={{ background: '#ef4444', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.65rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{activeCount}</span>}
                    </button>

                    {(activeCount > 0 || f.search) && (
                        <button onClick={resetFilters} style={{ height: '42px', padding: '0 1rem', background: 'none', border: 'none', color: '#ef4444', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <RotateCcw size={14} /> Clear
                        </button>
                    )}
                </div>

                {/* ── Status Sub-Navigation ── */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['pending','approved','paid','rejected'].map(s => (
                        <button key={s} onClick={() => set('status', f.status === s ? '' : s)}
                            style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: f.status === s ? getStatus(s).bg : '#fff', color: f.status === s ? getStatus(s).color : '#64748b', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', height: '32px' }}>
                            {s}
                        </button>
                    ))}
                </div>

                {/* ── Expanded Filter Panel ── */}
                {showFilters && (
                    <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                        <div>
                            <label style={labelSm}>Category</label>
                            <select value={f.category_id} onChange={e => set('category_id', e.target.value)} style={inputBase}>
                                <option value="">All Categories</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelSm}>Payment Method</label>
                            <select value={f.payment_method} onChange={e => set('payment_method', e.target.value)} style={inputBase}>
                                <option value="">All Methods</option>
                                <option value="cash">Cash</option>
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="cheque">Cheque</option>
                                <option value="credit_card">Credit Card</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelSm}>From Date</label>
                            <input type="date" value={f.from_date} onChange={e => set('from_date', e.target.value)} style={inputBase} />
                        </div>
                        <div>
                            <label style={labelSm}>To Date</label>
                            <input type="date" value={f.to_date} onChange={e => set('to_date', e.target.value)} style={inputBase} />
                        </div>
                    </div>
                )}

                {/* ── Contextual Summary (Project Wise) ── */}
                {f.project_id && (
                    <div style={{ background: '#6366f1', padding: '1rem 1.5rem', borderRadius: '14px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 15px -3px rgba(99,102,241,0.3)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.8, textTransform: 'uppercase', margin: 0 }}>Showing Expenses For:</p>
                                <p style={{ fontSize: '1rem', fontWeight: 950, margin: 0 }}>{projects.find(p => p.id == f.project_id)?.title || 'Selected Project'}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.8, textTransform: 'uppercase', margin: 0 }}>Total Filtered Spending:</p>
                            <p style={{ fontSize: '1.25rem', fontWeight: 950, margin: 0 }}>{fmt(total)}</p>
                        </div>
                    </div>
                )}

                {/* ── Table ── */}
                <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px', overflow: 'hidden' }}>
                    {/* Head */}
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1.8fr 1fr 1fr 110px 110px 100px 110px', padding: '10px 20px', background: '#f8fafc', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #f1f5f9' }}>
                        <div>Exp #</div>
                        <div>Title / Vendor</div>
                        <div>Category</div>
                        <div>Project</div>
                        <div>Method</div>
                        <div style={{ textAlign: 'right' }}>Amount</div>
                        <div style={{ textAlign: 'center' }}>Status</div>
                        <div style={{ textAlign: 'right' }}>Actions</div>
                    </div>

                    {/* Body */}
                    {expenses.data.length === 0 ? (
                        <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                            <AlertCircle size={32} style={{ marginBottom: '12px', opacity: 0.4 }} />
                            <p style={{ fontWeight: 700 }}>No expenses found</p>
                            <p style={{ fontSize: '0.85rem' }}>Try adjusting your filters or search query</p>
                        </div>
                    ) : expenses.data.map((exp, idx) => {
                        const st = getStatus(exp.status);
                        return (
                            <div key={exp.id}
                                style={{ display: 'grid', gridTemplateColumns: '120px 1.8fr 1fr 1fr 110px 110px 100px 110px', padding: '14px 20px', borderBottom: idx === expenses.data.length - 1 ? 'none' : '1px solid #f8fafc', alignItems: 'center', transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                {/* Expense # + date */}
                                <div>
                                    <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4f46e5', margin: 0 }}>{exp.expense_number}</p>
                                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0, fontWeight: 600 }}>
                                        {new Date(exp.expense_date).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}
                                    </p>
                                </div>

                                {/* Title + vendor */}
                                <div>
                                    <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>{exp.title}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                        {exp.vendor_name && (
                                            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                <Building2 size={11} /> {exp.vendor_name}
                                            </span>
                                        )}
                                        {exp.is_reimbursable && (
                                            <span style={{ fontSize: '0.62rem', background: '#fef3c7', color: '#d97706', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>REIMB</span>
                                        )}
                                        {exp.receipt && (
                                            <span style={{ fontSize: '0.62rem', background: '#f0fdf4', color: '#16a34a', padding: '1px 6px', borderRadius: '4px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                <FileCheck size={9} /> RECEIPT
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Category */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: exp.category?.color || '#cbd5e1', flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>{exp.category?.name || '—'}</span>
                                </div>

                                {/* Project */}
                                <div>
                                    {exp.project ? (
                                        <Link href={route('projects.show', exp.project.id)} style={{ textDecoration: 'none' }}>
                                            <span style={{ fontSize: '0.82rem', color: '#4f46e5', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Briefcase size={12} />{exp.project.title}
                                            </span>
                                        </Link>
                                    ) : (
                                        <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>— Overhead</span>
                                    )}
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <CreditCard size={12} color="#94a3b8" />
                                        {PAYMENT_LABELS[exp.payment_method] || exp.payment_method || '—'}
                                    </span>
                                </div>

                                {/* Amount */}
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{fmt(exp.amount)}</p>
                                </div>

                                {/* Status Badge */}
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, background: st.bg, color: st.color }}>
                                        {st.label}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                                    <Link href={route('expenses.show', exp.id)}>
                                        <button style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', background: '#f8fafc', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="View">
                                            <Eye size={15} />
                                        </button>
                                    </Link>
                                    <a href={route('expenses.slip', exp.id)} target="_blank" rel="noreferrer">
                                        <button style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', background: '#fef9c3', color: '#d97706', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Print Voucher">
                                            <Printer size={15} />
                                        </button>
                                    </a>
                                    <button onClick={() => confirm('Delete this expense?') && router.delete(route('expenses.destroy', exp.id))}
                                        style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', background: '#fff1f2', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Pagination ── */}
                {expenses.last_page > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '12px 20px' }}>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                            Showing <strong>{expenses.from}–{expenses.to}</strong> of <strong>{expenses.total}</strong> records
                        </p>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {expenses.links.map((link, i) => link.url ? (
                                <Link key={i} href={link.url} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '34px', height: '34px', padding: '0 8px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', background: link.active ? '#0f172a' : '#f1f5f9', color: link.active ? '#fff' : '#64748b' }} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : (
                                <span key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '34px', height: '34px', padding: '0 8px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, background: '#f9fafb', color: '#d1d5db' }} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Category Modal ── */}
            <Modal show={showCategoryModal} onClose={() => setShowCategoryModal(false)} maxWidth="md">
                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
                        <button onClick={() => setShowCategoryModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
                    </div>
                    <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div><label style={labelSm}>Name</label><input type="text" value={catForm.data.name} onChange={e => catForm.setData('name', e.target.value)} style={{ ...inputBase, height: '42px' }} required /></div>
                        <div><label style={labelSm}>Code</label><input type="text" value={catForm.data.code} onChange={e => catForm.setData('code', e.target.value)} style={{ ...inputBase, height: '42px' }} required /></div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button type="button" onClick={() => setShowCategoryModal(false)} style={{ flex: 1, height: '42px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 700 }}>Cancel</button>
                            <button type="submit" disabled={catForm.processing} style={{ flex: 1, height: '42px', borderRadius: '8px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                                {editingCategory ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <style>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </FigmaLayout>
    );
}
