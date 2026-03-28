import React from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Pencil,
    Package,
    Building2,
    Calendar,
    Tag,
    Trash2,
    Activity,
    ShieldCheck,
    Zap,
    Briefcase,
    TrendingUp,
    Layers,
    Target,
    Scale,
    AlertCircle,
    Building,
    User,
    Clock,
    Truck,
    CheckCircle2,
    BarChart3
} from 'lucide-react';

const cardStyle = {
    background: '#fff',
    borderRadius: '20px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
    padding: '1.5rem',
    overflow: 'hidden'
};

const badgeStyle = (bg, color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 700,
    background: bg,
    color: color
});

export default function Show({ auth, item }) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this inventory item?')) {
            router.delete(route('inventory.destroy', item.id));
        }
    };

    const getStatusInfo = (s) => {
        const stats = {
            active: { label: 'Active', color: '#10b981', bg: '#ecfdf5', icon: CheckCircle2 },
            inactive: { label: 'Inactive', color: '#6b7280', bg: '#f3f4f6', icon: clock },
            discontinued: { label: 'Discontinued', color: '#ef4444', bg: '#fef2f2', icon: X },
        };
        const res = stats[s] || { label: s.toUpperCase(), color: '#f59e0b', bg: '#fffbeb', icon: AlertCircle };
        return res;
    };

    const statusInfo = getStatusInfo(item.status);
    const totalValue = (item.quantity_in_stock || 0) * (item.unit_price || 0);

    const stats = [
        { label: 'Total Value', value: `৳${new Intl.NumberFormat().format(totalValue)}`, icon: Scale, color: '#6366f1', bg: '#f5f3ff' },
        { label: 'Stock Level', value: `${item.quantity_in_stock} ${item.unit || 'pcs'}`, icon: Package, color: '#10b981', bg: '#ecfdf5' },
        { label: 'Unit Price', value: `৳${new Intl.NumberFormat().format(item.unit_price)}`, icon: Tag, color: '#8b5cf6', bg: '#f9f7ff' },
    ];

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Inventory Item - ${item.name}`} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <Link href={route('inventory.index')}>
                            <button style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fff', border: '1.5px solid #ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6366f1', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f5f3ff'}
                                onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                                <ArrowLeft size={18} />
                            </button>
                        </Link>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '4px' }}>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e1b4b', margin: 0, letterSpacing: '-0.02em' }}>{item.name}</h1>
                                <span style={badgeStyle(statusInfo.bg, statusInfo.color)}>
                                    {statusInfo.icon && <statusInfo.icon size={12} />}
                                    {statusInfo.label}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Tag size={14} color="#9ca3af" />
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280' }}>SKU: {item.sku || 'Not set'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Building size={14} color="#9ca3af" />
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280' }}>Brand: {item.brand?.name || 'Generic'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link href={route('inventory.edit', item.id)} style={{ textDecoration: 'none' }}>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.7rem 1.5rem', background: '#1e1b4b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(30,27,75,0.2) transition: all 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#312e81'}
                                onMouseLeave={e => e.currentTarget.style.background = '#1e1b4b'}>
                                <Pencil size={18} />
                                Edit Item
                            </button>
                        </Link>
                        <button onClick={handleDelete} title="Delete Item" style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fff', border: '1.5px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#ef4444'; }}>
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }} className="stats-grid">
                    {stats.map((s, i) => (
                        <div key={i} style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1.2px solid #f5f3ff' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <s.icon size={16} color={s.color} />
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
                            </div>
                            <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }} className="content-grid">
                    
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* Assignment Details */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1.5px solid #f5f3ff' }}>
                                <Briefcase size={18} color="#6366f1" />
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Project & Client Assignment</h3>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                <div style={{ background: '#f9f7ff', padding: '1.25rem', borderRadius: '16px', border: '1.5px solid #f0eeff' }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', margin: '0 0 10px', textTransform: 'uppercase' }}>Target Project</p>
                                    {item.project ? (
                                        <Link href={route('projects.show', item.project.id)} style={{ textDecoration: 'none' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <Target size={16} color="#6366f1" />
                                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e1b4b' }}>{item.project.title}</span>
                                                <ChevronRight size={14} color="#a78bfa" />
                                            </div>
                                        </Link>
                                    ) : (
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#d1d5db', margin: 0 }}>Unassigned (Stock)</p>
                                    )}
                                </div>
                                <div style={{ background: '#f9f7ff', padding: '1.25rem', borderRadius: '16px', border: '1.5px solid #f0eeff' }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', margin: '0 0 10px', textTransform: 'uppercase' }}>Assigned Client</p>
                                    {item.client ? (
                                        <Link href={route('clients.show', item.client.id)} style={{ textDecoration: 'none' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <Building2 size={16} color="#6366f1" />
                                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e1b4b' }}>{item.client.company_name || item.client.name}</span>
                                                <ChevronRight size={14} color="#a78bfa" />
                                            </div>
                                        </Link>
                                    ) : (
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#d1d5db', margin: 0 }}>Internal Inventory</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Activity Log / Info */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1.5px solid #f5f3ff' }}>
                                <Activity size={18} color="#10b981" />
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Item Timeline</h3>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Clock size={18} color="#10b981" />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', margin: '0 0 2px', textTransform: 'uppercase' }}>Created On</p>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', margin: 0 }}>{new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Activity size={18} color="#6366f1" />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', margin: '0 0 2px', textTransform: 'uppercase' }}>Last Updated</p>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', margin: 0 }}>{new Date(item.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* Supplier Info */}
                        <div style={{ ...cardStyle, background: '#1e1b4b', border: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                <Truck size={16} color="#a5b4fc" />
                                <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', margin: 0 }}>Supplier Details</h3>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '14px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800, color: '#1e1b4b' }}>
                                    {(item.supplier?.company_name || 'D').charAt(0)}
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', margin: 0 }}>{item.supplier?.company_name || 'Direct / Unknown'}</p>
                                    <p style={{ fontSize: '0.7rem', color: '#a5b4fc', margin: '2px 0 0' }}>Origin Source</p>
                                </div>
                            </div>
                        </div>

                        {/* Low Stock Alert */}
                        {item.quantity_in_stock <= (item.reorder_level || 0) && (
                            <div style={{ padding: '1.25rem', borderRadius: '20px', background: '#fef2f2', border: '1.5px solid #fecaca', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertCircle size={18} color="#ef4444" />
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#b91c1c', textTransform: 'uppercase' }}>Low Stock Alert</span>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600, margin: 0, lineHeight: '1.5' }}>
                                    This item has reached its reorder level ({item.reorder_level || 0}). Please consider restocking.
                                </p>
                            </div>
                        )}

                        {/* Visual Asset (Thumbnail if exists) */}
                        <div style={cardStyle}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <ImageIcon size={14} color="#6366f1" />
                                <h3 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Item Photo</h3>
                            </div>
                            <div style={{ width: '100%', height: '180px', borderRadius: '14px', background: '#f9f9fb', border: '1.5px solid #f0eeff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <Package size={32} color="#d1d5db" />
                                <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>Standard Stock Unit</span>
                            </div>
                        </div>

                        {/* System Status */}
                        <div style={{ padding: '1rem', borderRadius: '16px', background: '#ecfdf5', border: '1.5px solid #d1fae5', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }}></div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#065f46' }}>Stock Sync: Operational</span>
                                <span style={{ fontSize: '0.65rem', color: '#059669' }}>Real-time database active</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 992px) {
                    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    .content-grid { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 576px) {
                    .stats-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </FigmaLayout>
    );
}

function ChevronRight({ size, color, style }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
            <path d="m9 18 6-6-6-6"/>
        </svg>
    );
}

function X({ size }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
    )
}

function clock({ size }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
    )
}
