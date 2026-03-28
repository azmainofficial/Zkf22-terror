import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    FileText, 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    CheckCircle2, 
    Palette,
    Settings,
    Smartphone,
    Users,
    Shield,
    History,
    Image as ImageIcon,
    LayoutTemplate
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
    height: '48px',
    padding: '0 1rem',
    borderRadius: '12px',
    border: '1.5px solid #f0eeff',
    background: '#f8fafc',
    fontSize: '0.9rem',
    fontWeight: 700,
    outline: 'none',
    transition: 'all 0.2s',
    color: '#1e1b4b'
};

export default function Index({ auth, designs, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('slip-designs.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Permanently delete this invoice template?')) {
            router.delete(route('slip-designs.destroy', id), { preserveScroll: true });
        }
    };

    const handleToggleStatus = (id) => {
        router.post(route('slip-designs.toggle', id), {}, { preserveScroll: true });
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Invoice Templates" />

            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <Palette size={28} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.02em' }}>Invoice Designs</h1>
                            <p style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 600, margin: '4px 0 0' }}>Manage templates, branding, and layouts for generated financial documents</p>
                        </div>
                    </div>
                    <Link href={route('slip-designs.create')} style={{ textDecoration: 'none' }}>
                        <button style={{ height: '52px', padding: '0 2rem', background: '#1e1b4b', border: 'none', borderRadius: '14px', color: '#fff', fontSize: '1rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 6px 20px rgba(30,27,75,0.2)' }}>
                            <Plus size={20} />
                            Create Template
                        </button>
                    </Link>
                </div>

                {/* Sub-Navigation (Consistent with Settings) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {[
                        { name: 'Settings', label: 'App config', icon: Settings, href: route('settings.index'), color: '#4f46e5' },
                        { name: 'Devices', label: 'Hardware', icon: Smartphone, href: route('devices.index'), color: '#3b82f6' },
                        { name: 'Users', label: 'Logins', icon: Users, href: route('users.index'), color: '#10b981' },
                        { name: 'Roles', label: 'Access', icon: Shield, href: route('roles.index'), color: '#f59e0b' },
                        { name: 'History', label: 'Actions', icon: History, href: route('audit-logs.index'), color: '#ec4899' },
                    ].map((item, idx) => (
                        <Link key={idx} href={item.href} style={{ textDecoration: 'none' }}>
                            <div style={{ ...cardStyle, padding: '1rem', display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', opacity: 0.8, transition: 'all 0.2s' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${item.color}10`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <item.icon size={16} />
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e1b4b' }}>{item.name}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Search Bar */}
                <div style={{ ...cardStyle, padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <form onSubmit={handleSearch} style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                            type="text" 
                            placeholder="Find templates by name..." 
                            style={{ ...inputStyle, paddingLeft: '3rem', width: '100%', maxWidth: '400px' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                </div>

                {/* Designs Grid */}
                {designs.data.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        {designs.data.map((design) => (
                            <div key={design.id} style={{ ...cardStyle, padding: 0, border: `2px solid ${design.is_active ? '#6366f1' : '#f0eeff'}` }}>
                                
                                {design.is_active && (
                                    <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, background: '#4f46e5', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}>
                                        <CheckCircle2 size={14} /> Active Format
                                    </div>
                                )}

                                {/* Preview Header */}
                                <div style={{ height: '180px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1.5px solid #f0eeff' }}>
                                    {design.header_logo ? (
                                        <img src={`/storage/${design.header_logo}`} alt="Logo" style={{ height: '64px', objectFit: 'contain', zIndex: 2 }} />
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontWeight: 800, fontSize: '0.8rem', zIndex: 2 }}>
                                            <ImageIcon size={20} /> No Branding
                                        </div>
                                    )}

                                    {/* Mock Document Lines */}
                                    <div style={{ width: '60%', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '1.5rem', opacity: 0.5, zIndex: 2 }}>
                                        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', width: '100%' }} />
                                        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', width: '80%', margin: '0 auto' }} />
                                    </div>

                                    {design.watermark_image && (
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.05, pointerEvents: 'none', zIndex: 1 }}>
                                            <img src={`/storage/${design.watermark_image}`} style={{ width: '120px', height: '120px', objectFit: 'contain' }} />
                                        </div>
                                    )}
                                </div>

                                {/* Details Body */}
                                <div style={{ padding: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e1b4b', margin: '0 0 4px' }}>{design.name}</h3>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: design.type === 'invoice' ? '#6366f1' : '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <LayoutTemplate size={14} /> {design.type} Template
                                    </p>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                                        <span style={{ padding: '4px 12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #f1f5f9', fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>
                                            {design.font_family}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: design.accent_color, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)' }} />
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>Accent</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Link href={route('slip-designs.edit', design.id)} style={{ flex: 1, textDecoration: 'none' }}>
                                            <button style={{ width: '100%', height: '44px', borderRadius: '12px', background: '#f8fafc', border: '1.5px solid #f0eeff', color: '#1e1b4b', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
                                                <Edit size={16} /> Edit
                                            </button>
                                        </Link>
                                        {!design.is_active && (
                                            <button onClick={() => handleToggleStatus(design.id)} style={{ flex: 1, height: '44px', borderRadius: '12px', background: '#ecfdf5', border: 'none', color: '#10b981', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                Set Default
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(design.id)} style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fff1f2', border: 'none', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ ...cardStyle, padding: '5rem', textAlign: 'center', opacity: 0.5 }}>
                        <LayoutTemplate size={48} style={{ margin: '0 auto 1.5rem', color: '#cbd5e1' }} />
                        <p style={{ fontWeight: 800, margin: '0 0 1.5rem' }}>No document templates configured</p>
                        <Link href={route('slip-designs.create')} style={{ textDecoration: 'none' }}>
                            <button style={{ height: '44px', padding: '0 1.5rem', background: '#1e1b4b', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>
                                Setup First Template
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </FigmaLayout>
    );
}

