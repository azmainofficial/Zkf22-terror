import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Tag,
    Layers,
    Calendar,
    CheckCircle,
    XCircle,
    FileText,
    ChevronRight,
    TrendingUp
} from 'lucide-react';

export default function Show({ auth, category }) {
    const handleDelete = () => {
        if (confirm('Delete this category? This might affect existing expense reports.')) {
            router.delete(route('expense-categories.destroy', category.id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Category: ${category.name}`} />

            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <Link href={route('expense-categories.index')}>
                            <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-bold">
                                <ArrowLeft size={18} />
                                Back to classifications
                            </button>
                        </Link>

                        <div className="flex items-center gap-3">
                            <Link href={route('expense-categories.edit', category.id)}>
                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-bold text-sm">
                                    <Edit size={16} />
                                    Edit Category
                                </button>
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-bold text-sm"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Main Info */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                                <div className="h-4 w-full" style={{ backgroundColor: category.color || '#3b82f6' }} />
                                <div className="p-8 sm:p-12">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                                            <Tag size={24} />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{category.name}</h1>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{category.code}</span>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <FileText size={14} /> Description & Purpose
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed italic">
                                            {category.description || 'No detailed description provided for this classification.'}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 mt-12 py-8 border-y border-slate-50">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Usage Count</p>
                                            <p className="text-2xl font-bold text-slate-900">{category.expenses_count} Records</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Audit Status</p>
                                            <div className="flex items-center gap-2">
                                                {category.is_active ? (
                                                    <span className="flex items-center gap-1 text-sm font-bold text-green-600 uppercase">
                                                        <CheckCircle size={16} /> Active
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-sm font-bold text-red-500 uppercase">
                                                        <XCircle size={16} /> Inactive
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Expenses List */}
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 sm:p-12">
                                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center justify-between">
                                    Recent Activity
                                    <TrendingUp size={20} className="text-blue-500" />
                                </h3>
                                <div className="space-y-4">
                                    {category.expenses?.map((expense) => (
                                        <Link key={expense.id} href={route('expenses.show', expense.id)}>
                                            <div className="group flex items-center justify-between p-4 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                                                        <Calendar size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{expense.title}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(expense.expense_date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-slate-900">${Number(expense.amount).toLocaleString()}</p>
                                                    <ChevronRight size={16} className="text-slate-300 ml-auto mt-1" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    {(!category.expenses || category.expenses.length === 0) && (
                                        <div className="py-12 text-center text-slate-400 italic text-sm">
                                            No recent activity found for this category.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar/Stats card */}
                        <div className="space-y-6">
                            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-900/20 overflow-hidden relative">
                                <Layers className="absolute -right-4 -bottom-4 text-blue-500/20" size={120} />
                                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-8 relative z-10">Classification Stats</h3>
                                <div className="space-y-6 relative z-10">
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">Total Linked Expenses</p>
                                        <p className="text-4xl font-bold text-blue-400 tracking-tight">{category.expenses_count}</p>
                                    </div>
                                    <div className="pt-6 border-t border-white/5">
                                        <p className="text-xs text-slate-400 mb-2">Category Health</p>
                                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                            <div className="bg-blue-500 h-full rounded-full w-full" />
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest">System Integrated</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 leading-relaxed">System metadata</p>
                                <div className="text-[10px] font-bold text-slate-500 space-y-1">
                                    <p>CREATED: {new Date(category.created_at).toLocaleDateString()}</p>
                                    <p>MODIFIED: {new Date(category.updated_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

