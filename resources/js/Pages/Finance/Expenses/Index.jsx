import React, { useState, useEffect, useRef } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    Tag,
    Save,
    Receipt,
    Target,
    Zap,
    FileText,
    Download,
    ChevronDown,
    X,
    Loader2,
    Activity,
    Grid,
    CornerRightDown,
    ArrowUpRight,
    Briefcase,
    Building,
    LifeBuoy,
    Inbox,
    Settings,
    ChevronRight,
    ShieldAlert
} from 'lucide-react';
import Modal from '@/Components/Modal';

// ─── Shared styles from Inventory patterns ──────────────────────
const card = {
    background: '#fff', 
    borderRadius: '16px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
};

const onFocus = e => { 
    e.target.style.borderColor = '#8b5cf6'; 
    e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; 
};

const onBlur = e => { 
    e.target.style.borderColor = '#ede9fe'; 
    e.target.style.boxShadow = 'none'; 
};

const iconBtn = (bg, color) => ({
    width: '32px', height: '32px', borderRadius: '8px',
    background: bg, border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color,
    transition: 'all 0.2s'
});

const getStatusConfig = (s) => {
    const status = (s || 'pending').toLowerCase();
    const config = {
        approved: { label: 'Approved', bg: '#f0fdf4', color: '#16a34a', icon: CheckCircle2 },
        paid:      { label: 'Paid',      bg: '#eff6ff', color: '#3b82f6', icon: Zap },
        pending:   { label: 'Pending',   bg: '#fffbeb', color: '#d97706', icon: Clock },
        rejected:  { label: 'Rejected',  bg: '#fff1f2', color: '#e11d48', icon: XCircle },
    };
    return config[status] || config.pending;
};

const inputStyle = {
    width: '100%',
    height: '46px',
    padding: '0 1rem',
    borderRadius: '10px',
    border: '1.5px solid #ede9fe',
    background: '#f9f7ff',
    fontSize: '0.85rem',
    fontWeight: 600,
    outline: 'none',
    transition: 'all 0.2s',
    color: '#1e1b4b'
};

const labelStyle = {
    fontSize: '0.68rem',
    fontWeight: 800,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    display: 'block',
    marginBottom: '6px',
    paddingLeft: '2px'
};

export default function Index({ auth, expenses, filters, categories = [], projects = [], paymentMethods = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const isFirstRender = useRef(true);

    // Modals State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const expenseForm = useForm({
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
        is_reimbursable: false,
    });

    const categoryForm = useForm({
        name: '',
        code: '',
        description: '',
        color: '#6366f1',
        is_active: true,
    });

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const t = setTimeout(() => {
            router.get(route('expenses.index'), { search, status, category_id: categoryId }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(t);
    }, [search, status, categoryId]);

    const handleCreateExpense = (e) => {
        e.preventDefault();
        expenseForm.post(route('expenses.store'), {
            onSuccess: () => { setShowCreateModal(false); expenseForm.reset(); },
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const handleCategorySubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            categoryForm.put(route('expense-categories.update', editingCategory.id), {
                onSuccess: () => { setShowCategoryModal(false); setEditingCategory(null); categoryForm.reset(); },
                preserveScroll: true,
            });
        } else {
            categoryForm.post(route('expense-categories.store'), {
                onSuccess: () => { setShowCategoryModal(false); categoryForm.reset(); },
                preserveScroll: true,
            });
        }
    };

    const statCards = [
        { label: 'Outbound Flow', value: `৳${expenses.data.reduce((s,e) => s + parseFloat(e.amount), 0).toLocaleString()}`, icon: ArrowUpRight, bg: '#fff1f2', color: '#e11d48' },
        { label: 'Cleared Payments', value: `৳${expenses.data.filter(e => e.status === 'paid').reduce((s,e) => s + parseFloat(e.amount), 0).toLocaleString()}`, icon: CheckCircle2, bg: '#f0fdf4', color: '#16a34a' },
        { label: 'Awaiting Audit', value: `${expenses.data.filter(e => e.status === 'pending').length} Records`, icon: Clock, bg: '#fffbeb', color: '#d97706' },
        { label: 'Active Categories', value: `${categories.length} Tiers`, icon: Tag, bg: '#f5f3ff', color: '#6366f1' },
    ];

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Operational Expenditures" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>

                {/* ── Header (Inventory Style) ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '3px' }}>
                            <Receipt size={16} color="#fb7185" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fb7185', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Spending Audit</span>
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Business Expenditures</h1>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '3px 0 0' }}>Log vendor payments, operational costs, and project-linked expenses</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                        <button onClick={() => { setEditingCategory(null); categoryForm.reset(); setShowCategoryModal(true); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '0.6rem 1.125rem',
                                background: '#fff', border: '1.5px solid #ede9fe',
                                borderRadius: '12px', color: '#6366f1',
                                fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 1px 6px rgba(99,102,241,0.07)',
                            }}>
                            <Settings size={15} /> Configure Tiers
                        </button>
                        <button onClick={() => setShowCreateModal(true)} style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '0.6rem 1.25rem',
                            background: 'linear-gradient(135deg,#f43f5e,#e11d48)',
                            border: 'none', borderRadius: '12px', color: '#fff',
                            fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(225,29,72,0.3)',
                        }}>
                            <Plus size={16} /> Log Expenditure
                        </button>
                    </div>
                </div>

                {/* ── Stat cards (Inventory Style) ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
                    {statCards.map((s, i) => (
                        <div key={i} style={{ ...card, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <s.icon size={22} color={s.color} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>{s.label}</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b', margin: 0, lineHeight: 1.2 }}>{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }} className="main-grid">
                    
                    {/* Left: Enhanced Category Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ ...card, padding: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1.5px solid #f8fafc' }}>
                                <Grid size={16} color="#6366f1" />
                                <h3 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Spending Tiers</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <button onClick={() => setCategoryId('')}
                                    style={{
                                        padding: '0.625rem 0.875rem', border: 'none', borderRadius: '10px',
                                        textAlign: 'left', fontSize: '0.82rem', fontWeight: 700,
                                        background: categoryId === '' ? '#f5f3ff' : 'transparent',
                                        color: categoryId === '' ? '#6366f1' : '#64748b',
                                        cursor: 'pointer', transition: 'all 0.2s',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                    }}>
                                    <span>All Expenditures</span>
                                    {categoryId === '' && <ChevronRight size={14} />}
                                </button>
                                {categories.map(cat => (
                                    <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <button onClick={() => setCategoryId(cat.id)}
                                            style={{
                                                flex: 1, padding: '0.625rem 0.875rem', border: 'none', borderRadius: '10px',
                                                textAlign: 'left', fontSize: '0.82rem', fontWeight: 700,
                                                background: categoryId == cat.id ? '#f5f3ff' : 'transparent',
                                                color: categoryId == cat.id ? '#6366f1' : '#64748b',
                                                cursor: 'pointer', transition: 'all 0.2s',
                                                display: 'flex', alignItems: 'center', gap: '10px'
                                            }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }} />
                                            {cat.name}
                                        </button>
                                        <button onClick={() => { setEditingCategory(cat); categoryForm.setData({ name: cat.name, code: cat.code || '', description: cat.description || '', color: cat.color, is_active: !!cat.is_active }); setShowCategoryModal(true); }}
                                            style={{ width: '28px', height: '28px', border: 'none', background: 'transparent', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Edit size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ ...card, background: '#1e1b4b', color: '#fff', border: 'none', padding: '1.25rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                <LifeBuoy size={18} color="#fff" />
                            </div>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: '0 0 6px' }}>Auditing Intelligence</h4>
                            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>Every recorded expense requires a descriptive title and linked category for tax and internal audit compliance.</p>
                        </div>
                    </div>

                    {/* Right: Enhanced Transactions List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        
                        {/* Filters Row */}
                        <div style={{ ...card, padding: '1rem 1.25rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                                    <Search size={16} color="#fb7185" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                        placeholder="Scan by vendor, title, or reference..."
                                        style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 1rem 0.625rem 2.25rem', background: '#fff1f2', border: '1.5px solid #fee2e2', borderRadius: '10px', fontSize: '0.85rem', color: '#1e1b4b', outline: 'none', fontWeight: 600 }}
                                        onFocus={e => { e.target.style.borderColor = '#fb7185'; e.target.style.boxShadow = '0 0 0 3px rgba(251,113,133,0.1)'; }}
                                        onBlur={e => { e.target.style.borderColor = '#fee2e2'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                                <select value={status} onChange={e => setStatus(e.target.value)}
                                    style={{ padding: '0.55rem 1rem', background: '#f9f7ff', border: '1.5px solid #ede9fe', borderRadius: '10px', fontSize: '0.82rem', color: '#4338ca', fontWeight: 600, cursor: 'pointer', outline: 'none', appearance: 'none', minWidth: '150px' }}>
                                    <option value="">Any Status</option>
                                    <option value="pending">Awaiting Audit</option>
                                    <option value="approved">Approved</option>
                                    <option value="paid">Funded / Paid</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                {(search || status || categoryId) && (
                                    <button onClick={() => { setSearch(''); setStatus(''); setCategoryId(''); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.55rem 0.875rem', background: '#fff1f2', border: '1.5px solid #fecaca', borderRadius: '10px', color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                                        <X size={13} /> Reset
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Rows List */}
                        {expenses.data.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {expenses.data.map(expense => {
                                    const cfg = getStatusConfig(expense.status);
                                    return (
                                        <div key={expense.id} style={{
                                            ...card, padding: '1rem 1.5rem',
                                            display: 'flex', alignItems: 'center',
                                            gap: '1.5rem', flexWrap: 'wrap',
                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fb7185'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(251,113,133,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0eeff'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                        >
                                            {/* Icon */}
                                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1.5px solid #fee2e2' }}>
                                                <Receipt size={22} color="#e11d48" />
                                            </div>

                                            {/* Info */}
                                            <div style={{ width: '220px' }}>
                                                <p style={{ fontSize: '0.92rem', fontWeight: 850, color: '#1e1b4b', margin: 0 }}>{expense.title}</p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8' }}>{expense.expense_number}</span>
                                                    <span style={{ color: '#cbd5e1' }}>•</span>
                                                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8' }}>{new Date(expense.expense_date).toLocaleDateString('en-GB')}</span>
                                                </div>
                                            </div>

                                            {/* Tier & Attachment */}
                                            <div style={{ flex: 2, minWidth: '180px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: expense.category?.color || '#cbd5e1' }} />
                                                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4b5563', margin: 0 }}>{expense.category?.name || 'Administrative Tier'}</p>
                                                </div>
                                                {expense.project?.title && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                                        <Briefcase size={12} color="#a78bfa" />
                                                        <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#a78bfa', margin: 0, textTransform: 'uppercase' }}>{expense.project.title}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Amount */}
                                            <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                                <p style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>Outbound Cost</p>
                                                <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>
                                                    ৳{new Intl.NumberFormat().format(expense.amount)}
                                                </p>
                                            </div>

                                            {/* Status Badge */}
                                            <div style={{ minWidth: '110px', textAlign: 'center' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', fontWeight: 850, color: cfg.color, background: cfg.bg, padding: '4px 12px', borderRadius: '20px', border: `1.5px solid ${cfg.color}15`, textTransform: 'uppercase' }}>
                                                    <cfg.icon size={11} />
                                                    {cfg.label}
                                                </span>
                                            </div>

                                            {/* Actions Suite */}
                                            <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                                                <Link href={route('expenses.show', expense.id)} title="Audit Details">
                                                    <button style={iconBtn('#f5f3ff', '#6366f1')}><Eye size={16} /></button>
                                                </Link>
                                                <Link href={route('expenses.edit', expense.id)} title="Edit Entry">
                                                    <button style={iconBtn('#fffbeb', '#d97706')}><Edit size={16} /></button>
                                                </Link>
                                                <button style={iconBtn('#fff1f2', '#ef4444')} title="Purge Log" onClick={() => confirm('Withdraw this expenditure record?') && router.delete(route('expenses.destroy', expense.id))}>
                                                    <Trash2 size={16} />
                                                </button>
                                                <div style={{ width: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: '#cbd5e1' }}>
                                                    <ChevronRight size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '6rem 1rem', border: '2px dashed #ede9fe', borderRadius: '18px', background: '#faf9ff' }}>
                                <Inbox size={48} color="#e0d9ff" style={{ margin: '0 auto 1.5rem' }} />
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e1b4b', margin: '0 0 0.5rem' }}>No Expenditure Logs</h3>
                                <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: '0 0 2rem' }}>
                                    Your business spending ledger is empty. Start tracking your outflows.
                                </p>
                                <button onClick={() => setShowCreateModal(true)} style={{ 
                                    display: 'inline-flex', alignItems: 'center', gap: '8px', 
                                    padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg,#f43f5e,#e11d48)', 
                                    border: 'none', borderRadius: '14px', color: '#fff', 
                                    fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                                    boxShadow: '0 6px 16px rgba(225,29,72,0.25)'
                                }}>
                                    <Plus size={18} /> Log First Expenditure
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {expenses.links && expenses.links.length > 3 && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', ...card, padding: '0.875rem 1.25rem' }}>
                                <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: 0, fontWeight: 600 }}>
                                    Page <strong style={{ color: '#1e1b4b' }}>{expenses.current_page}</strong> of <strong style={{ color: '#1e1b4b' }}>{expenses.last_page}</strong>
                                </p>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {expenses.links.map((link, i) => link.url ? (
                                        <Link key={i} href={link.url} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '36px', height: '36px', padding: '0 10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none', background: link.active ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#f5f3ff', color: link.active ? '#fff' : '#6366f1', transition: 'all 0.2s' }} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ) : (
                                        <span key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '36px', height: '36px', padding: '0 10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, background: '#f8fafc', color: '#d1d5db' }} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CREATE EXPENSE MODAL */}
            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="2xl">
                <div style={{ padding: '2rem', background: '#fff', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Register Expenditure</h2>
                            <p style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, margin: '2px 0 0' }}>Manually document a verified outflow</p>
                        </div>
                        <button onClick={() => setShowCreateModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', padding: '8px', borderRadius: '50%' }}>
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleCreateExpense} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            <div>
                                <label style={labelStyle}>Expenditure Title</label>
                                <input type="text" value={expenseForm.data.title} onChange={e => expenseForm.setData('title', e.target.value)} placeholder="e.g. Hosting Renewal" style={inputStyle} required onFocus={onFocus} onBlur={onBlur} />
                            </div>
                            <div>
                                <label style={labelStyle}>Amount (৳)</label>
                                <input type="number" step="0.01" value={expenseForm.data.amount} onChange={e => expenseForm.setData('amount', e.target.value)} placeholder="0.00" style={inputStyle} required onFocus={onFocus} onBlur={onBlur} />
                            </div>
                            <div>
                                <label style={labelStyle}>Spending Tier</label>
                                <select value={expenseForm.data.expense_category_id} onChange={e => expenseForm.setData('expense_category_id', e.target.value)} style={inputStyle} required onFocus={onFocus} onBlur={onBlur}>
                                    <option value="">Select Tier</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Movement Method</label>
                                <select value={expenseForm.data.payment_method} onChange={e => expenseForm.setData('payment_method', e.target.value)} style={inputStyle} required onFocus={onFocus} onBlur={onBlur}>
                                    <option value="">Select Method</option>
                                    <option value="cash">Cash Fund</option>
                                    <option value="bank_transfer">Bank Settlement</option>
                                    <option value="credit_card">Card Transaction</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Settlement Date</label>
                                <input type="date" value={expenseForm.data.expense_date} onChange={e => expenseForm.setData('expense_date', e.target.value)} style={inputStyle} required onFocus={onFocus} onBlur={onBlur} />
                            </div>
                            <div>
                                <label style={labelStyle}>Linked Project</label>
                                <select value={expenseForm.data.project_id} onChange={e => expenseForm.setData('project_id', e.target.value)} style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                                    <option value="">Operational (No Project)</option>
                                    {projects.map(proj => <option key={proj.id} value={proj.id}>{proj.title}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Expenditure Context</label>
                            <textarea value={expenseForm.data.description} onChange={e => expenseForm.setData('description', e.target.value)} placeholder="Provide internal notes for auditing..."
                                style={{ ...inputStyle, height: '80px', padding: '0.75rem', resize: 'none' }} onFocus={onFocus} onBlur={onBlur} />
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, height: '48px', borderRadius: '12px', border: '1.5px solid #ede9fe', background: '#fff', color: '#64748b', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" disabled={expenseForm.processing} style={{ flex: 1, height: '48px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#f43f5e,#e11d48)', color: '#fff', fontSize: '0.9rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(225,29,72,0.2)' }}>
                                {expenseForm.processing ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                Commit Record
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* CATEGORY SETTINGS MODAL */}
            <Modal show={showCategoryModal} onClose={() => setShowCategoryModal(false)} maxWidth="md">
                <div style={{ padding: '2rem', background: '#fff', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Expenditure Tier</h2>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, margin: '2px 0 0' }}>Classify outflows for better auditing</p>
                        </div>
                        <button onClick={() => setShowCategoryModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={labelStyle}>Tier Label</label>
                            <input type="text" value={categoryForm.data.name} onChange={e => categoryForm.setData('name', e.target.value)} placeholder="e.g. INFRASTRUCTURE" style={inputStyle} required onFocus={onFocus} onBlur={onBlur} />
                        </div>
                        <div>
                            <label style={labelStyle}>Tier Identification Color</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input type="color" value={categoryForm.data.color} onChange={e => categoryForm.setData('color', e.target.value)}
                                    style={{ width: '46px', height: '46px', padding: '4px', border: '1.5px solid #ede9fe', borderRadius: '10px', background: '#f9f7ff', cursor: 'pointer' }} />
                                <input type="text" value={categoryForm.data.color} onChange={e => categoryForm.setData('color', e.target.value)} style={{ ...inputStyle, flex: 1, textTransform: 'uppercase' }} onFocus={onFocus} onBlur={onBlur} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                            <button type="button" onClick={() => setShowCategoryModal(false)} style={{ flex: 1, height: '48px', borderRadius: 'px', border: '1.5px solid #ede9fe', background: '#fff', color: '#64748b', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" disabled={categoryForm.processing} style={{ flex: 1, height: '48px', borderRadius: '12px', border: 'none', background: '#1e1b4b', color: '#fff', fontSize: '0.9rem', fontWeight: 900, cursor: 'pointer' }}>
                                {editingCategory ? 'Commit Tier' : 'Spawn Tier'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <style>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @media (max-width: 1000px) { .main-grid { grid-template-columns: 1fr !important; } }
            `}</style>
        </FigmaLayout>
    );
}
