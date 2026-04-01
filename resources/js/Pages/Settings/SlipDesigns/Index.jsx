import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    FileText, Plus, Search, Edit, Trash2, CheckCircle2,
    Palette, Settings, Smartphone, Users, Shield, History,
    Image as ImageIcon, LayoutTemplate, Copy, FileCheck,
    Receipt, Banknote, Briefcase, BarChart3, ChevronLeft, ChevronRight
} from 'lucide-react';

const TYPE_META = {
    invoice:  { label: 'Invoice',   color: '#6366f1', bg: '#f5f3ff', icon: FileText  },
    payment:  { label: 'Payment',   color: '#10b981', bg: '#f0fdf4', icon: Banknote  },
    payroll:  { label: 'Payroll Slip', color: '#f59e0b', bg: '#fffbeb', icon: Receipt    },
    expense:  { label: 'Expense',   color: '#ef4444', bg: '#fff1f2', icon: FileCheck  },
    project:  { label: 'Project',   color: '#3b82f6', bg: '#eff6ff', icon: Briefcase  },
    report:   { label: 'Report',    color: '#8b5cf6', bg: '#f5f3ff', icon: BarChart3  },
};

const cardStyle = {
    background: '#fff',
    borderRadius: '20px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
    padding: '1.75rem',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.25s ease',
};

export default function Index({ auth, designs, filters, activeDesigns, documentTypes }) {
    const [search, setSearch]     = useState(filters.search || '');
    const [activeTab, setActiveTab] = useState(filters.type || 'all');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('slip-designs.index'), { search, type: activeTab !== 'all' ? activeTab : undefined }, { preserveState: true });
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        router.get(route('slip-designs.index'), { type: tab !== 'all' ? tab : undefined, search: search || undefined }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Permanently delete this document template?')) {
            router.delete(route('slip-designs.destroy', id), { preserveScroll: true });
        }
    };

    const handleToggleStatus = (id) => {
        router.post(route('slip-designs.toggle', id), {}, { preserveScroll: true });
    };

    const handleDuplicate = (id) => {
        router.post(route('slip-designs.duplicate', id), {}, { preserveScroll: true });
    };

    const totalActive = Object.keys(activeDesigns || {}).length;

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Document Design Manager" />

            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>

                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <Link href={route('settings.index')} style={{ textDecoration: 'none' }}>
                            <button style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fff', border: '1.5px solid #f0eeff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.2s' }}>
                                <ChevronLeft size={18} />
                            </button>
                        </Link>
                        <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, #1e1b4b, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                            <Palette size={26} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.02em' }}>Document Design Manager</h1>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600, margin: '4px 0 0' }}>Manage print templates for all financial &amp; operational documents</p>
                        </div>
                    </div>
                    <Link href={route('slip-designs.create')} style={{ textDecoration: 'none' }}>
                        <button style={{ height: '50px', padding: '0 1.75rem', background: '#1e1b4b', border: 'none', borderRadius: '14px', color: '#fff', fontSize: '0.95rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 6px 20px rgba(30,27,75,0.2)', transition: 'all 0.2s' }}>
                            <Plus size={20} /> New Template
                        </button>
                    </Link>
                </div>

                {/* ── Active Status Banner ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    {documentTypes.map(type => {
                        const meta    = TYPE_META[type] || { label: type, color: '#6366f1', bg: '#f5f3ff', icon: FileText };
                        const active  = activeDesigns?.[type];
                        const IconCmp = meta.icon;
                        return (
                            <button
                                key={type}
                                onClick={() => handleTabChange(type)}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '14px',
                                    border: `2px solid ${activeTab === type ? meta.color : '#f0eeff'}`,
                                    background: activeTab === type ? meta.bg : '#fff',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `${meta.color}15`, color: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <IconCmp size={15} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e1b4b', textTransform: 'capitalize' }}>{meta.label}</span>
                                </div>
                                {active ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#10b981' }}>Active</span>
                                        <span style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80px' }}>{active.name}</span>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e2e8f0' }} />
                                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8' }}>No active template</span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ── Sub-Nav + Search ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => handleTabChange('all')}
                        style={{ padding: '8px 16px', borderRadius: '10px', border: `1.5px solid ${activeTab === 'all' ? '#6366f1' : '#f0eeff'}`, background: activeTab === 'all' ? '#6366f1' : '#fff', color: activeTab === 'all' ? '#fff' : '#64748b', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}
                    >All Templates</button>
                    {documentTypes.map(type => {
                        const meta = TYPE_META[type] || { label: type, color: '#6366f1' };
                        return (
                            <button
                                key={type}
                                onClick={() => handleTabChange(type)}
                                style={{ padding: '8px 16px', borderRadius: '10px', border: `1.5px solid ${activeTab === type ? meta.color : '#f0eeff'}`, background: activeTab === type ? meta.color : '#fff', color: activeTab === type ? '#fff' : '#64748b', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize' }}
                            >{meta.label}</button>
                        );
                    })}

                    <form onSubmit={handleSearch} style={{ marginLeft: 'auto', position: 'relative', display: 'flex', gap: '8px' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder="Search templates..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ height: '42px', paddingLeft: '40px', paddingRight: '1rem', borderRadius: '12px', border: '1.5px solid #f0eeff', background: '#f8fafc', fontWeight: 700, fontSize: '0.85rem', color: '#1e1b4b', outline: 'none', width: '220px' }}
                            />
                        </div>
                        <button type="submit" style={{ height: '42px', padding: '0 1rem', background: '#1e1b4b', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>Search</button>
                    </form>
                </div>

                {/* ── Designs Grid ── */}
                {designs.data.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {designs.data.map((design) => {
                            const meta    = TYPE_META[design.type] || { label: design.type, color: '#6366f1', bg: '#f5f3ff', icon: FileText };
                            const IconCmp = meta.icon;
                            return (
                                <div
                                    key={design.id}
                                    style={{ ...cardStyle, border: `2px solid ${design.is_active ? meta.color : '#f0eeff'}`, padding: 0 }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.1)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,0.05)'; }}
                                >
                                    {design.is_active && (
                                        <div style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 10, background: meta.color, color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: `0 4px 12px ${meta.color}40` }}>
                                            <CheckCircle2 size={12} /> Active
                                        </div>
                                    )}

                                    {/* Preview Area */}
                                    <div style={{ height: '160px', background: meta.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1.5px solid #f0eeff' }}>
                                        {design.header_logo ? (
                                            <img src={`/storage/${design.header_logo}`} alt="Logo" style={{ height: '52px', objectFit: 'contain', zIndex: 2 }} />
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: meta.color, zIndex: 2 }}>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconCmp size={24} />
                                                </div>
                                            </div>
                                        )}
                                        {/* Mock lines */}
                                        <div style={{ width: '55%', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '16px', opacity: 0.35, zIndex: 2 }}>
                                            <div style={{ height: '5px', background: meta.color, borderRadius: '3px', width: '100%' }} />
                                            <div style={{ height: '4px', background: '#94a3b8', borderRadius: '3px', width: '75%' }} />
                                            <div style={{ height: '4px', background: '#94a3b8', borderRadius: '3px', width: '55%' }} />
                                        </div>
                                        {design.watermark_image && (
                                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.06, pointerEvents: 'none', zIndex: 1 }}>
                                                <img src={`/storage/${design.watermark_image}`} style={{ width: '110px', height: '110px', objectFit: 'contain' }} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                                            <div>
                                                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#1e1b4b', margin: '0 0 4px' }}>{design.name}</h3>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '20px', background: meta.bg, color: meta.color, fontSize: '0.68rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                    <IconCmp size={11} /> {meta.label}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: design.accent_color, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)', flexShrink: 0 }} />
                                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>{design.font_family}</span>
                                            </div>
                                        </div>

                                        {design.company_name && (
                                            <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <span style={{ color: '#94a3b8' }}>📍</span> {design.company_name}
                                            </p>
                                        )}

                                        {/* Action Buttons */}
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                            <Link href={route('slip-designs.edit', design.id)} style={{ flex: 1, textDecoration: 'none' }}>
                                                <button style={{ width: '100%', height: '40px', borderRadius: '10px', background: '#f8fafc', border: '1.5px solid #f0eeff', color: '#1e1b4b', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}>
                                                    <Edit size={14} /> Edit
                                                </button>
                                            </Link>
                                            {!design.is_active && (
                                                <button onClick={() => handleToggleStatus(design.id)} style={{ flex: 1, height: '40px', borderRadius: '10px', background: `${meta.color}10`, border: `1.5px solid ${meta.color}30`, color: meta.color, fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                    Set Active
                                                </button>
                                            )}
                                            <button onClick={() => handleDuplicate(design.id)} title="Duplicate" style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f8f5ff', border: 'none', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                <Copy size={15} />
                                            </button>
                                            <button onClick={() => handleDelete(design.id)} title="Delete" style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff1f2', border: 'none', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ ...cardStyle, padding: '5rem', textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <LayoutTemplate size={36} color="#6366f1" />
                        </div>
                        <h3 style={{ fontWeight: 900, color: '#1e1b4b', margin: '0 0 10px', fontSize: '1.2rem' }}>No templates found</h3>
                        <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.875rem', margin: '0 0 2rem' }}>
                            {activeTab !== 'all' ? `No ${activeTab} templates configured yet.` : 'Get started by creating your first document template.'}
                        </p>
                        <Link href={route('slip-designs.create')} style={{ textDecoration: 'none' }}>
                            <button style={{ height: '48px', padding: '0 2rem', background: '#1e1b4b', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
                                <Plus size={18} /> Create First Template
                            </button>
                        </Link>
                    </div>
                )}

                {/* ── Pagination ── */}
                {designs.last_page > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {designs.links.map((link, idx) => (
                            <button
                                key={idx}
                                onClick={() => link.url && router.visit(link.url, { preserveState: true })}
                                disabled={!link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: '10px',
                                    border: `1.5px solid ${link.active ? '#6366f1' : '#f0eeff'}`,
                                    background: link.active ? '#6366f1' : '#fff',
                                    color: link.active ? '#fff' : '#64748b',
                                    fontWeight: 800,
                                    fontSize: '0.8rem',
                                    cursor: link.url ? 'pointer' : 'default',
                                    opacity: link.url ? 1 : 0.4,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </FigmaLayout>
    );
}
