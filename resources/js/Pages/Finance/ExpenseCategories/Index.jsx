import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    CheckCircle2,
    XCircle,
    Layers,
    FolderPlus,
    Hash,
    BarChart3,
    MoreHorizontal,
    Inbox
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function Index({ auth, categories, filters }) {
    const { language } = useAppStore();
    const [search, setSearch] = useState(filters.search || '');

    const tr = (en, bn) => language === 'bn' ? bn : en;

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        router.get(route('expense-categories.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm(tr('Delete this category?', 'এই ক্যাটাগরিটি মুছে ফেলতে চান?'))) {
            router.delete(route('expense-categories.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const cardStyle = {
        background: '#fff',
        borderRadius: '16px',
        border: '1.5px solid #f0eeff',
        padding: '1.25rem',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: '0 2px 4px rgba(99,102,241,0.02)'
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={tr('Expense Categories', 'ব্যয় ক্যাটাগরি')} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* ── Header Section ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ padding: '8px', background: '#f5f3ff', borderRadius: '10px', color: '#6366f1' }}>
                                <Layers size={22} />
                            </div>
                            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>
                                {tr('Expense Categories', 'ব্যয় ক্যাটাগরি')}
                            </h1>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#6b7280', marginTop: '6px', fontWeight: 500 }}>
                            {tr('Create groups to organize your business costs', 'খরচ গুছিয়ে রাখতে ক্যাটাগরি তৈরি করুন')}
                        </p>
                    </div>

                    <Link href={route('expense-categories.create')}>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '0.75rem 1.5rem', background: '#4f46e5',
                            border: 'none', borderRadius: '12px', color: '#fff',
                            fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(79,70,229,0.2)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <Plus size={18} />
                            {tr('New Category', 'নতুন ক্যাটাগরি')}
                        </button>
                    </Link>
                </div>

                {/* ── Search Bar ── */}
                <div style={{ 
                    background: '#fff', padding: '10px', borderRadius: '16px', 
                    border: '1.5px solid #f0eeff', display: 'flex', gap: '10px' 
                }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder={tr('Find a category...', 'ক্যাটাগরি খুঁজুন...')}
                            style={{
                                width: '100%', padding: '12px 12px 12px 48px',
                                border: 'none', borderRadius: '10px', outline: 'none',
                                background: '#f9fafb', fontSize: '0.95rem', color: '#1e1b4b'
                            }}
                        />
                    </div>
                    <button 
                        onClick={handleSearch}
                        style={{
                            padding: '0 1.5rem', background: '#fff', border: '1.5px solid #e5e7eb',
                            borderRadius: '10px', fontWeight: 700, color: '#374151', cursor: 'pointer'
                        }}
                    >
                        {tr('Search', 'খুঁজুন')}
                    </button>
                </div>

                {/* ── Categories Grid ── */}
                <div style={{ 
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                    gap: '1.5rem' 
                }}>
                    {categories.data && categories.data.length > 0 ? (
                        categories.data.map((category) => (
                            <div key={category.id} 
                                style={cardStyle}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = '#6366f1';
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(99, 102, 241, 0.1)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = '#f0eeff';
                                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(99,102,241,0.02)';
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ 
                                            width: '44px', height: '44px', borderRadius: '12px',
                                            background: `${category.color}15` || '#f5f3ff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: category.color || '#6366f1',
                                            border: `1px solid ${category.color}30` || '1px solid #f0eeff'
                                        }}>
                                            <FolderPlus size={22} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>
                                                {category.name}
                                            </h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                                <Hash size={12} color="#9ca3af" />
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>
                                                    {category.code}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <Link href={route('expense-categories.edit', category.id)}>
                                            <button style={{ padding: '6px', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', borderRadius: '6px' }} title="Edit">
                                                <Edit3 size={16} />
                                            </button>
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(category.id)}
                                            style={{ padding: '6px', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', borderRadius: '6px' }} 
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0, lineHeight: '1.5', minHeight: '2.5rem' }}>
                                    {category.description || tr('No description provided.', 'কোনো বর্ণনা দেওয়া হয়নি।')}
                                </p>

                                <div style={{ 
                                    marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f9fafb',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ 
                                            padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800,
                                            background: category.is_active ? '#ecfdf5' : '#fef2f2',
                                            color: category.is_active ? '#059669' : '#ef4444',
                                            display: 'flex', alignItems: 'center', gap: '4px'
                                        }}>
                                            {category.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                            {category.is_active ? tr('Active', 'সক্রিয়') : tr('Inactive', 'নিষ্ক্রিয়')}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6366f1' }}>
                                        <BarChart3 size={14} />
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                                            {category.expenses_count || 0} {tr('Expenses', 'খরচ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ 
                            gridColumn: '1 / -1', padding: '5rem 2rem', textAlign: 'center',
                            background: '#fff', borderRadius: '20px', border: '1.5px dashed #e5e7eb'
                        }}>
                            <Inbox size={48} color="#d1d5db" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>
                                {tr('No categories yet', 'এখনো কোনো ক্যাটাগরি নেই')}
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '8px' }}>
                                {tr('Start by creating your first expense category.', 'আপনার প্রথম খরচ ক্যাটাগরিটি তৈরি করে শুরু করুন।')}
                            </p>
                            <Link href={route('expense-categories.create')} style={{ textDecoration: 'none' }}>
                                <button style={{
                                    marginTop: '1.5rem', padding: '0.75rem 2rem', background: '#4f46e5',
                                    border: 'none', borderRadius: '12px', color: '#fff',
                                    fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer'
                                }}>
                                    {tr('Create Category', 'ক্যাটাগরি তৈরি করুন')}
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* ── Pagination ── */}
                {categories.links && categories.links.length > 3 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '1rem 0' }}>
                        {categories.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                style={{
                                    padding: '8px 16px', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 700,
                                    textDecoration: 'none', transition: 'all 0.2s',
                                    background: link.active ? '#4f46e5' : '#fff',
                                    color: link.active ? '#fff' : (link.url ? '#374151' : '#9ca3af'),
                                    border: '1.5px solid',
                                    borderColor: link.active ? '#4f46e5' : '#f0eeff',
                                    pointerEvents: link.url ? 'auto' : 'none'
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </FigmaLayout>
    );
}
