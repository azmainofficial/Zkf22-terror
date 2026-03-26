import React, { useState, useEffect } from 'react';
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
    ArrowRight,
    MoreVertical,
    Save,
    Receipt,
    DollarSign,
    Target,
    Zap,
    History,
    FileText,
    Download,
    ChevronDown,
    X,
    Loader2,
    Activity,
    Grid,
    CornerRightDown
} from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { cn } from '@/lib/utils';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Index({ auth, expenses, filters, categories = [], projects = [], paymentMethods = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');

    // Modals State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const { data: expenseData, setData: setExpenseData, post: postExpense, processing: processingExpense, errors: expenseErrors, reset: resetExpense } = useForm({
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

    const { data: categoryData, setData: setCategoryData, post: postCategory, put: putCategory, processing: processingCategory, errors: categoryErrors, reset: resetCategory } = useForm({
        name: '',
        code: '',
        description: '',
        color: '#6366f1',
        is_active: true,
    });

    // Handle Category Edit Setup
    useEffect(() => {
        if (editingCategory) {
            setCategoryData({
                name: editingCategory.name,
                code: editingCategory.code,
                description: editingCategory.description || '',
                color: editingCategory.color,
                is_active: editingCategory.is_active,
            });
        } else {
            resetCategory();
        }
    }, [editingCategory]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('expenses.index'), {
            search,
            status,
            category_id: categoryId
        }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this expenditure?')) {
            router.delete(route('expenses.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const handleCreateExpense = (e) => {
        e.preventDefault();
        postExpense(route('expenses.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                resetExpense();
            },
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const handleCategorySubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            putCategory(route('expense-categories.update', editingCategory.id), {
                onSuccess: () => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                    resetCategory();
                },
                preserveScroll: true,
            });
        } else {
            postCategory(route('expense-categories.store'), {
                onSuccess: () => {
                    setShowCategoryModal(false);
                    resetCategory();
                },
                preserveScroll: true,
            });
        }
    };

    const statusConfig = {
        approved: { color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', label: 'Approved' },
        paid: { color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20', label: 'Paid' },
        rejected: { color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', label: 'Rejected' },
        pending: { color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', label: 'Pending' },
    };

    const totalExpense = expenses.data.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const pendingReview = expenses.data.filter(e => e.status === 'pending').length;

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Expenditure Manifold" />

            <div className="space-y-10 pb-32">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">
                            Expenditure Manifold
                        </h1>
                        <div className="flex items-center gap-2">
                            <Activity size={14} className="text-indigo-600 animate-pulse" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none">Operational Capital Tracking</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] gap-3"
                        >
                            <Plus size={20} strokeWidth={3} />
                            <span>Log Expenditure</span>
                        </Button>
                    </div>
                </div>

                {/* Intelligence Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Outflow Matrix', val: `৳${totalExpense.toLocaleString()}`, sub: 'Total Period Expense', icon: DollarSign, color: 'indigo' },
                        { label: 'Pending Audit', val: pendingReview, sub: 'Awaiting Authorization', icon: Clock, color: 'amber' },
                        { label: 'Settled Flows', val: `৳${expenses.data.filter(e => e.status === 'paid').reduce((sum, e) => sum + parseFloat(e.amount), 0).toLocaleString()}`, sub: 'Completed Payments', icon: CheckCircle2, color: 'emerald' },
                        { label: 'Vetoed Log', val: expenses.data.filter(e => e.status === 'rejected').length, sub: 'Expenditures Denied', icon: XCircle, color: 'rose' }
                    ].map((stat, i) => (
                        <Card key={i} className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm p-6 group hover:translate-y-[-4px] transition-all duration-300 overflow-hidden relative">
                            <div className={`absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:scale-110 transition-transform text-${stat.color}-600 dark:text-${stat.color}-400`}>
                                <stat.icon size={120} />
                            </div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/30 flex items-center justify-center text-${stat.color}-600 dark:text-${stat.color}-400 mb-6`}>
                                    <stat.icon size={20} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">{stat.label}</h3>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter truncate italic">{stat.val}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.sub}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Category Manifold Sidebar */}
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white italic">
                                    Expenditure Nodes
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={openCreateCategory}
                                    className="w-10 h-10 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600"
                                >
                                    <Plus size={18} />
                                </Button>
                            </div>
                            <div className="p-4 space-y-2">
                                {categories.length === 0 ? (
                                    <p className="text-center text-[10px] font-black uppercase text-slate-300 py-8 italic tracking-widest">No nodes found</p>
                                ) : (
                                    categories.map((cat) => (
                                        <div
                                            key={cat.id}
                                            className={cn(
                                                "group flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer",
                                                cat.id == categoryId
                                                    ? "bg-indigo-50 dark:bg-indigo-900/20 shadow-inner"
                                                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                            )}
                                            onClick={() => {
                                                const nid = cat.id === categoryId ? '' : cat.id;
                                                setCategoryId(nid);
                                                router.get(route('expenses.index'), { search, status, category_id: nid }, { preserveState: true });
                                            }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                                                <span className={cn(
                                                    "text-sm font-black uppercase italic tracking-tight",
                                                    cat.id == categoryId ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400"
                                                )}>
                                                    {cat.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={(e) => { e.stopPropagation(); openEditCategory(cat); }} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                                    <Edit size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Transaction Registry: Main Area */}
                    <div className="lg:col-span-9 space-y-6">
                        {/* Search & Filter Bar */}
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Scan expenditures by title, number or vendor..."
                                    className="w-full h-16 pl-16 pr-8 bg-white dark:bg-slate-900 border-none rounded-[2rem] font-bold text-slate-900 dark:text-white placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-600 shadow-sm transition-all"
                                />
                            </div>
                            <div className="flex gap-4 w-full md:w-auto">
                                <select
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value);
                                        router.get(route('expenses.index'), { search, status: e.target.value, category_id: categoryId }, { preserveState: true });
                                    }}
                                    className="h-16 pl-8 pr-12 bg-white dark:bg-slate-900 border-none rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 shadow-sm appearance-none"
                                >
                                    <option value="">Audit State</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="paid">Paid</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <Button onClick={handleSearch} className="h-16 px-10 rounded-[2rem] bg-slate-900 text-white hover:bg-slate-800 transition-all font-black text-[10px] uppercase tracking-widest gap-3">
                                    <Filter size={18} />
                                    <span>Scan</span>
                                </Button>
                            </div>
                        </div>

                        {/* Expenditure Registry Card */}
                        <Card className="rounded-[44px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                            <th className="px-10 py-8">Capital Object</th>
                                            <th className="px-10 py-8">Node / Project</th>
                                            <th className="px-10 py-8 text-right">Yield (৳)</th>
                                            <th className="px-10 py-8 text-center">Audit Status</th>
                                            <th className="px-10 py-8 text-right">Protocols</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {expenses.data.length > 0 ? (
                                            expenses.data.map((expense) => {
                                                const config = statusConfig[expense.status] || statusConfig.pending;
                                                return (
                                                    <tr key={expense.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all">
                                                        <td className="px-10 py-8">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform shadow-inner">
                                                                    <Receipt size={24} />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic truncate max-w-[200px]">{expense.title}</p>
                                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                                        {new Date(expense.expense_date).toLocaleDateString()} • {expense.expense_number}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-10 py-8">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: expense.category?.color || '#cbd5e1' }} />
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 italic">{expense.category?.name || '-'}</span>
                                                            </div>
                                                            {expense.project && (
                                                                <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-tight">
                                                                    <CornerRightDown size={10} />
                                                                    {expense.project.title}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-10 py-8 text-right">
                                                            <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter italic">৳{parseFloat(expense.amount).toLocaleString()}</p>
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{expense.payment_method?.replace('_', ' ') || '-'}</p>
                                                        </td>
                                                        <td className="px-10 py-8 text-center">
                                                            <Badge className={cn("px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest border-2", config.color)}>
                                                                {config.label}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-10 py-8 text-right">
                                                            <div className="flex items-center justify-end gap-3">
                                                                <Link href={route('expenses.show', expense.id)}>
                                                                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 transition-all hover:scale-110">
                                                                        <Eye size={18} />
                                                                    </Button>
                                                                </Link>
                                                                <Link href={route('expenses.edit', expense.id)}>
                                                                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-500 transition-all hover:scale-110">
                                                                        <Edit size={18} />
                                                                    </Button>
                                                                </Link>
                                                                <button onClick={() => handleDelete(expense.id)} className="w-10 h-10 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500 transition-all hover:scale-110 flex items-center justify-center">
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-10 py-32 text-center">
                                                    <div className="space-y-4 opacity-20">
                                                        <Receipt size={64} className="mx-auto" />
                                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Expenditure Log Empty</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Protocol */}
                            {expenses.links.length > 3 && (
                                <div className="px-10 py-10 border-t border-slate-50 dark:border-slate-800 flex flex-wrap gap-2 justify-center">
                                    {expenses.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={cn(
                                                "min-w-[44px] h-11 rounded-2xl flex items-center justify-center text-xs font-black uppercase tracking-widest transition-all",
                                                link.active
                                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                                    : link.url
                                                        ? "bg-white dark:bg-slate-800 text-slate-500 hover:bg-indigo-50 shadow-sm"
                                                        : "text-slate-200 cursor-not-allowed"
                                            )}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>

            {/* CREATE EXPENSE MODAL - SYNTHESIS ENGINE */}
            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="2xl">
                <div className="p-10 bg-white dark:bg-slate-900 rounded-[44px] shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <Plus size={160} className="text-indigo-600" />
                    </div>

                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Entry Protocol</h3>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic leading-none">Log Capital Outflow</h2>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setShowCreateModal(false)} className="w-12 h-12 rounded-2xl hover:bg-slate-50 text-slate-300 transition-all hover:rotate-90">
                            <X size={24} />
                        </Button>
                    </div>

                    <form onSubmit={handleCreateExpense} className="space-y-10 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <InputLabel value="Operational Object" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-2" />
                                <TextInput
                                    className="w-full h-16 pl-6 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl font-bold text-slate-900 dark:text-white placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-600 shadow-inner"
                                    value={expenseData.title}
                                    onChange={(e) => setExpenseData('title', e.target.value)}
                                    placeholder="e.g. AWS Infrastructure Deployment"
                                    required
                                />
                                <InputError message={expenseErrors.title} />
                            </div>
                            <div className="space-y-4">
                                <InputLabel value="Yield Amount (৳)" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-2" />
                                <TextInput
                                    type="number"
                                    step="0.01"
                                    className="w-full h-16 pl-6 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl font-black text-slate-900 dark:text-white placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-600 shadow-inner"
                                    value={expenseData.amount}
                                    onChange={(e) => setExpenseData('amount', e.target.value)}
                                    placeholder="0.00"
                                    required
                                />
                                <InputError message={expenseErrors.amount} />
                            </div>
                            <div className="space-y-4">
                                <InputLabel value="Expenditure Node" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-2" />
                                <select
                                    className="w-full h-16 pl-6 pr-12 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl font-bold text-slate-900 dark:text-white appearance-none transition-all focus:ring-2 focus:ring-indigo-600 shadow-inner"
                                    value={expenseData.expense_category_id}
                                    onChange={(e) => setExpenseData('expense_category_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <InputError message={expenseErrors.expense_category_id} />
                            </div>
                            <div className="space-y-4">
                                <InputLabel value="Settlement Vector" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-2" />
                                <select
                                    className="w-full h-16 pl-6 pr-12 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl font-bold text-slate-900 dark:text-white appearance-none transition-all focus:ring-2 focus:ring-indigo-600 shadow-inner"
                                    value={expenseData.payment_method}
                                    onChange={(e) => setExpenseData('payment_method', e.target.value)}
                                    required
                                >
                                    <option value="">Select Method</option>
                                    <option value="cash">Petty Cash</option>
                                    <option value="bank_transfer">Corporate Transfer</option>
                                    <option value="cheque">Cheque Protocol</option>
                                    <option value="credit_card">Corporate Card</option>
                                </select>
                            </div>
                            <div className="space-y-4">
                                <InputLabel value="Occurrence Date" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-2" />
                                <TextInput
                                    type="date"
                                    className="w-full h-16 pl-6 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 shadow-inner"
                                    value={expenseData.expense_date}
                                    onChange={(e) => setExpenseData('expense_date', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-4">
                                <InputLabel value="Vendor Intel" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-2" />
                                <TextInput
                                    className="w-full h-16 pl-6 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl font-bold text-slate-900 dark:text-white placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-600 shadow-inner"
                                    value={expenseData.vendor_name}
                                    onChange={(e) => setExpenseData('vendor_name', e.target.value)}
                                    placeholder="Target Entity/Merchant"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <InputLabel value="Linked Project Manifest" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-2" />
                            <select
                                className="w-full h-16 pl-6 pr-12 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl font-bold text-slate-900 dark:text-white appearance-none transition-all focus:ring-2 focus:ring-indigo-600 shadow-inner"
                                value={expenseData.project_id}
                                onChange={(e) => setExpenseData('project_id', e.target.value)}
                            >
                                <option value="">No Active Project Link</option>
                                {projects.map((proj) => (
                                    <option key={proj.id} value={proj.id}>{proj.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-4">
                            <InputLabel value="Tactical Intelligence / Briefing" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-2" />
                            <textarea
                                className="w-full p-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] font-bold text-sm resize-none h-32 shadow-inner placeholder:text-slate-300"
                                value={expenseData.description}
                                onChange={(e) => setExpenseData('description', e.target.value)}
                                placeholder="Outline the strategic necessity of this outflow..."
                            />
                        </div>

                        <div className="flex justify-end gap-4 pt-6">
                            <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="h-16 px-10 rounded-3xl font-black text-[10px] uppercase tracking-widest border-none bg-slate-50 hover:bg-slate-100 transition-all">
                                Abort
                            </Button>
                            <Button type="submit" disabled={processingExpense} className="h-16 px-12 rounded-3xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none gap-3">
                                {processingExpense ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Synchronize Flow
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* CATEGORY MODAL - NODE DEFINITION ENGINE */}
            <Modal show={showCategoryModal} onClose={() => setShowCategoryModal(false)} maxWidth="md">
                <div className="p-10 bg-white dark:bg-slate-900 rounded-[44px] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Tag size={120} className="text-indigo-600" />
                    </div>

                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Tag size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic">
                                {editingCategory ? 'Modify Node' : 'Initialize Node'}
                            </h2>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setShowCategoryModal(false)} className="w-10 h-10 rounded-xl hover:bg-slate-50 text-slate-300">
                            <X size={20} />
                        </Button>
                    </div>

                    <form onSubmit={handleCategorySubmit} className="space-y-8 relative z-10">
                        <div className="space-y-4">
                            <InputLabel value="Node Identity" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-2" />
                            <TextInput
                                className="w-full h-16 pl-6 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl font-bold text-slate-900 dark:text-white shadow-inner"
                                value={categoryData.name}
                                onChange={(e) => setCategoryData('name', e.target.value)}
                                placeholder="e.g. INFRASTRUCTURE"
                                required
                            />
                            <InputError message={categoryErrors.name} />
                        </div>

                        <div className="space-y-4">
                            <InputLabel value="Node Pulse (Color Code)" className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-2" />
                            <div className="flex gap-4 items-center">
                                <div className="relative group">
                                    <input
                                        type="color"
                                        className="h-16 w-32 p-2 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl cursor-pointer shadow-inner appearance-none"
                                        value={categoryData.color}
                                        onChange={(e) => setCategoryData('color', e.target.value)}
                                    />
                                    <div className="absolute inset-0 pointer-events-none border-4 border-transparent group-hover:border-indigo-600/20 rounded-3xl transition-all" />
                                </div>
                                <TextInput
                                    className="flex-1 h-16 pl-6 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl font-black text-slate-900 dark:text-white shadow-inner uppercase"
                                    value={categoryData.color}
                                    onChange={(e) => setCategoryData('color', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6">
                            <Button type="button" variant="ghost" onClick={() => setShowCategoryModal(false)} className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400">
                                Abort
                            </Button>
                            <Button type="submit" disabled={processingCategory} className="h-14 px-10 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all font-black text-[10px] uppercase tracking-widest shadow-lg">
                                {editingCategory ? 'Update Node' : 'Secure Node'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </FigmaLayout>
    );
}
