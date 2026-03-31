import React from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft, Edit3, Trash2, Tag, Layers, Calendar,
    CheckCircle2, XCircle, FileText, ChevronRight,
    BarChart3, Clock, AlertCircle
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function Show({ auth, category }) {
    const { language } = useAppStore();
    const tr = (en, bn) => language === 'bn' ? bn : en;

    const handleDelete = () => {
        if (confirm(tr('Delete this category?', 'এই ক্যাটাগরিটি মুছে ফেলতে চান?'))) {
            router.delete(route('expense-categories.destroy', category.id));
        }
    };

    const cardStyle = {
        background: '#fff',
        borderRadius: '20px',
        border: '1.5px solid #f0eeff',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`${tr('Category', 'ক্যাটাগরি')}: ${category.name}`} />

            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link href={route('expense-categories.index')}>
                            <button style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: '#fff', border: '1.5px solid #e5e7eb',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: '#6b7280'
                            }}>
                                <ArrowLeft size={18} />
                            </button>
                        </Link>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{category.name}</h1>
                                <div style={{ 
                                    padding: '2px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800,
                                    background: category.is_active ? '#ecfdf5' : '#fef2f2',
                                    color: category.is_active ? '#059669' : '#ef4444',
                                    display: 'flex', alignItems: 'center', gap: '4px'
                                }}>
                                    {category.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                    {category.is_active ? tr('Active', 'সক্রিয়') : tr('Inactive', 'নিষ্ক্রিয়')}
                                </div>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
                                {tr('Category Code', 'ক্যাটাগরি কোড')}: {category.code}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link href={route('expense-categories.edit', category.id)}>
                            <button style={{
                                padding: '0.75rem 1.5rem', background: '#fff', border: '1.5px solid #e5e7eb',
                                borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700,
                                color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                            }}>
                                <Edit3 size={18} />
                                {tr('Edit', 'সম্পাদনা')}
                            </button>
                        </Link>
                        <button 
                            onClick={handleDelete}
                            style={{
                                padding: '0.75rem 1.5rem', background: '#fff', border: '1.5px solid #fee2e2',
                                borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700,
                                color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            <Trash2 size={18} />
                            {tr('Delete', 'মুছে ফেলুন')}
                        </button>
                    </div>
                </div>

                {/* ── Main Content Grid ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Description Card */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1.5px solid #f9fafb' }}>
                                <div style={{ padding: '8px', background: '#f5f3ff', borderRadius: '10px', color: '#6366f1' }}>
                                    <FileText size={20} />
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{tr('Summary & Details', 'সারসংক্ষেপ ও বিবরণ')}</h3>
                            </div>
                            <p style={{ fontSize: '1rem', color: '#4b5563', lineHeight: '1.6', margin: 0 }}>
                                {category.description || tr('No description was added for this category.', 'এই ক্যাটাগরির জন্য কোনো বর্ণনা যোগ করা হয়নি।')}
                            </p>
                        </div>

                        {/* Recent Activity Card */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ padding: '8px', background: '#f0f9ff', borderRadius: '10px', color: '#0ea5e9' }}>
                                        <Clock size={20} />
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{tr('Recent Expenses', 'সাম্প্রতিক খরচ')}</h3>
                                </div>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>{tr('Last 10 Records', 'শেষ ১০টি রেকর্ড')}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {category.expenses && category.expenses.length > 0 ? category.expenses.map(expense => (
                                    <Link key={expense.id} href={route('expenses.show', expense.id)} style={{ textDecoration: 'none' }}>
                                        <div style={{ 
                                            padding: '1rem', background: '#f9fafb', borderRadius: '14px', border: '1.5px solid transparent',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#fff'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = '#f9fafb'; }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                                                    <Calendar size={18} />
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{expense.title}</p>
                                                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', margin: '2px 0 0' }}>{new Date(expense.expense_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div>
                                                    <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>৳{Number(expense.amount).toLocaleString()}</p>
                                                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669', margin: 0, textTransform: 'uppercase' }}>{expense.status || 'Paid'}</p>
                                                </div>
                                                <ChevronRight size={16} color="#d1d5db" />
                                            </div>
                                        </div>
                                    </Link>
                                )) : (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', background: '#f9fafb', borderRadius: '14px' }}>
                                        <AlertCircle size={24} style={{ marginBottom: '8px' }} />
                                        <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600 }}>{tr('No expenses recorded in this category yet.', 'এই ক্যাটাগরিতে এখনো কোনো খরচ রেকর্ড করা হয়নি।')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ ...cardStyle, background: '#1e1b4b', color: '#fff', borderColor: '#1e1b4b', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <BarChart3 size={20} color="#a5b4fc" />
                                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{tr('Quick Stats', 'দ্রুত পরিসংখ্যান')}</h3>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600, margin: '0 0 4px' }}>{tr('Total Records', 'মোট রেকর্ড')}</p>
                                    <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{category.expenses_count}</p>
                                </div>
                                <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <p style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600, margin: '0 0 8px' }}>{tr('Category Usage', 'ক্যাটাগরি ব্যবহার')}</p>
                                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: category.expenses_count > 0 ? '75%' : '0%', height: '100%', background: '#6366f1', borderRadius: '4px' }}></div>
                                    </div>
                                    <p style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '8px', fontWeight: 600 }}>{tr('Commonly used in reports', 'রিপোর্টে সাধারণত ব্যবহৃত হয়')}</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ ...cardStyle, padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>{tr('System Info', 'সিস্টেম তথ্য')}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af' }}>{tr('Created', 'তৈরি করা হয়েছে')}</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563' }}>{new Date(category.created_at).toLocaleDateString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af' }}>{tr('Modified', 'পরিবর্তন করা হয়েছে')}</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563' }}>{new Date(category.updated_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </FigmaLayout>
    );
}
