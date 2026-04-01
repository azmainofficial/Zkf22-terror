import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import { t } from '../../Lang/translation';
import {
    ArrowLeft, Pencil, Package, Building2, Calendar, Tag, Trash2,
    Activity, ShieldCheck, Zap, Briefcase, TrendingUp, Layers,
    Target, Scale, AlertCircle, Building, User, Clock, Truck,
    CheckCircle2, BarChart3, Image as ImageIcon, ChevronRight, Wallet
} from 'lucide-react';

const fmt = (n) => `৳${new Intl.NumberFormat().format(Number(n) || 0)}`;

const styles = {
    card: {
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #f1f5f9',
        padding: '24px',
        transition: 'all 0.2s ease',
    }
};

export default function Show({ auth, item }) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to remove this material from the stock records?')) {
            router.delete(route('inventory.destroy', item.id));
        }
    };

    const statusColors = {
        active:       { label: 'Available',    color: '#10b981', bg: '#f0fdf4' },
        inactive:     { label: 'Reserved',     color: '#64748b', bg: '#f1f5f9' },
        discontinued: { label: 'Out of Stock', color: '#ef4444', bg: '#fef2f2' },
    };

    const sc = statusColors[item.status] || statusColors.inactive;
    const totalVal = (item.quantity_in_stock || 0) * (item.unit_price || 0);

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`${item.name} | Stock Detail`} />

            <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '4rem' }}>
                
                {/* ── HEADER ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <Link href={route('inventory.index')}>
                            <button style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
                                    {item.name}
                                </h1>
                                <span style={{ background: sc.bg, color: sc.color, fontSize: '0.7rem', fontWeight: 800, padding: '4px 12px', borderRadius: '10px' }}>
                                    {sc.label.toUpperCase()}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500, margin: '4px 0 0' }}>
                                SKU Code: {item.sku || 'N/A'} • {item.brand?.name || 'Generic Material'}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link href={route('inventory.edit', item.id)}>
                            <button style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
                                background: '#4f46e5', border: 'none', borderRadius: '12px', 
                                color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer'
                            }}>
                                <Pencil size={18} /> Update Stock
                            </button>
                        </Link>
                        <button onClick={handleDelete} style={{ 
                            padding: '12px', background: '#fff', border: '1px solid #fee2e2', borderRadius: '12px', 
                            color: '#ef4444', cursor: 'pointer'
                        }}>
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>

                {/* ── METRIC STRIP ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
                    <MiniStat label={t('total_stock_value')} value={fmt(totalVal)} color="#4f46e5" icon={Wallet} />
                    <MiniStat label={t('quantity')} value={`${item.quantity_in_stock} ${item.unit || ''}`} color="#10b981" icon={Package} />
                    <MiniStat label={t('price_per_unit')} value={fmt(item.unit_price)} color="#8b5cf6" icon={Tag} />
                </div>

                {/* ── CORE GRID ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
                    
                    {/* LEFT Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* Material Details */}
                        <div style={styles.card}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 1000, color: '#0f172a', marginBottom: '1.5rem' }}>Stock Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <section>
                                    <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1rem' }}>Sourcing Details</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        <InfoRow icon={Truck} label="Supplied By" val={item.supplier?.company_name || 'Individual Supplier'} />
                                        <InfoRow icon={Building2} label="Manufacturer" val={item.brand?.name || 'Generic'} />
                                        <InfoRow icon={Calendar} label="Last Sourced" val={item.created_at} />
                                    </div>
                                </section>
                                <section>
                                    <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1rem' }}>Assignment Detail</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        <InfoRow icon={Briefcase} label="Attached Project" val={item.project?.title || 'Open Stock Inventory'} />
                                        <InfoRow icon={User} label="Linked Client" val={item.client?.company_name || item.client?.name || 'Internal Stock'} />
                                        <InfoRow icon={Target} label="Implementation Use" val={item.project_id ? 'Project Allocation' : 'Warehouse Stock'} />
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div style={styles.card}>
                            <p style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, lineHeight: 1.6 }}>
                                This item represents a high-priority material node in your inventory tracking system. 
                                Quantities and values are calculated automatically based on input procurement costs.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT Column Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* Low Stock Watch */}
                        {item.quantity_in_stock <= (item.reorder_level || 0) && (
                            <div style={{ ...styles.card, background: '#fef2f2', border: '1px solid #fecaca' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', marginBottom: '12px' }}>
                                    <AlertCircle size={20} />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 1000 }}>LOW STOCK ALERT</span>
                                </div>
                                <p style={{ fontSize: '0.82rem', color: '#dc2626', fontWeight: 600, margin: 0 }}>
                                    Your stock level is at {item.quantity_in_stock}. We recommend reordering more to avoid delays.
                                </p>
                            </div>
                        )}

                        {/* Status Check */}
                        <div style={styles.card}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 1000, color: '#0f172a', marginBottom: '1rem' }}>Operational Status</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #d1fae5' }}>
                                <CheckCircle2 size={18} color="#10b981" />
                                <div>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#065f46', margin: 0 }}>Sync Operational</p>
                                    <p style={{ fontSize: '0.65rem', fontWeight: 600, color: '#059669', margin: 0 }}>Real-time database active</p>
                                </div>
                            </div>
                        </div>

                        {/* Item Photo Placeholder */}
                        <div style={{ ...styles.card, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: '#f8fafc' }}>
                            <Package size={48} color="#cbd5e1" />
                            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', margin: 0 }}>NO PHOTO ADDED</p>
                        </div>

                    </div>

                </div>
            </div>
        </FigmaLayout>
    );
}

function MiniStat({ label, value, color, icon: Icon }) {
    return (
        <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>{label}</p>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `${color}10`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} />
                </div>
            </div>
            <h4 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '8px 0 0' }}>{value}</h4>
        </div>
    );
}

function InfoRow({ icon: Icon, label, val }) {
    return (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
                <Icon size={20} />
            </div>
            <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', margin: 0, textTransform: 'uppercase' }}>{label}</p>
                <p style={{ fontSize: '0.88rem', fontWeight: 750, color: '#334155', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{val || 'Not Added'}</p>
            </div>
        </div>
    );
}
