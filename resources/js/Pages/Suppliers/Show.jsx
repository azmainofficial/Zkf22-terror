import React from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import { t } from '../../Lang/translation';
import {
    ArrowLeft, Building2, Mail, Phone, MapPin, 
    Pencil, Trash2, Globe, ExternalLink, 
    Building, Layers, FileText, DollarSign,
    User, Briefcase, Calendar, ShieldCheck
} from 'lucide-react';

export default function Show({ auth, supplier, connectedClients }) {
    const handleDelete = () => {
        if (confirm(t('delete_supplier_confirm'))) {
            router.delete(route('suppliers.destroy', supplier.id));
        }
    };

    const cardStyle = {
        background: '#fff',
        borderRadius: '24px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
        padding: '2rem',
    };

    const labelStyle = {
        fontSize: '0.75rem',
        fontWeight: 700,
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '0.25rem',
        display: 'block'
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`${t('suppliers')} - ${supplier.company_name}`} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '5rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <Link href={route('suppliers.index')}>
                            <button style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <div>
                            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{t('supplier_details')}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.25rem' }}>
                                <span style={{
                                    padding: '2px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    background: supplier.status === 'active' ? '#f0fdf4' : '#f8fafc',
                                    color: supplier.status === 'active' ? '#16a34a' : '#64748b',
                                    border: `1px solid ${supplier.status === 'active' ? '#dcfce7' : '#f1f5f9'}`
                                }}>
                                    {supplier.status === 'active' ? t('active') : t('inactive')}
                                </span>
                                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>•</span>
                                <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>{t('total')} ID: SUP-{supplier.id.toString().padStart(4, '0')}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link href={route('suppliers.edit', supplier.id)}>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #e2e8f0', padding: '0.75rem 1.25rem', borderRadius: '12px', color: '#1e293b', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                                <Pencil size={18} /> {t('edit_supplier')}
                            </button>
                        </Link>
                        <button 
                            onClick={handleDelete}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #fee2e2', padding: '0.75rem 1.25rem', borderRadius: '12px', color: '#ef4444', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}
                        >
                            <Trash2 size={18} /> {t('delete')}
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>
                    {/* Left Column: Basic Info & Clients */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ width: '100px', height: '100px', borderRadius: '28px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    {supplier.avatar ? (
                                        <img src={`/storage/${supplier.avatar}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                    ) : (
                                        <Building2 size={40} color="#cbd5e1" />
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{supplier.company_name}</h2>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
                                            <User size={16} />
                                            {supplier.name}
                                        </div>
                                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }} />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
                                            <Mail size={16} />
                                            {supplier.email || t('no_email')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                <div>
                                    <span style={labelStyle}>{t('phone_number')}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontWeight: 600 }}>
                                        <Phone size={16} color="#94a3b8" />
                                        {supplier.phone || t('no_phone')}
                                    </div>
                                </div>
                                <div>
                                    <span style={labelStyle}>{t('credit_limit')}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontWeight: 600 }}>
                                        <DollarSign size={16} color="#16a34a" />
                                        ৳{new Intl.NumberFormat().format(supplier.credit_limit || 0)}
                                    </div>
                                </div>
                                <div>
                                    <span style={labelStyle}>{t('payment_terms')}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontWeight: 600 }}>
                                        <Calendar size={16} color="#2563eb" />
                                        {supplier.payment_terms || t('immediate')}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem' }}>
                                <span style={labelStyle}>{t('business_address')}</span>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#1e293b', fontWeight: 500, lineHeight: 1.5 }}>
                                    <MapPin size={18} color="#94a3b8" style={{ marginTop: '2px' }} />
                                    {supplier.address || t('no_address_registered')}
                                </div>
                            </div>
                        </div>

                        {/* Connected Clients */}
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Layers size={20} color="#2563eb" />
                                {t('associated_clients')}
                            </h3>
                            
                            {connectedClients && connectedClients.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    {connectedClients.map(client => (
                                        <div key={client.id} style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid #f1f5f9', background: '#f8fafc' }}>
                                            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{client.company_name}</h4>
                                            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>{client.name}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>{t('no_clients_associated')}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Quick Stats / Meta */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ ...cardStyle, background: '#1e293b', border: 'none', color: '#fff' }}>
                            <div style={{ opacity: 0.6 }}>
                                <Globe size={18} style={{ marginBottom: '1.5rem' }} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 1.5rem' }}>{t('vendor_summary')}</h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ padding: '1.125rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>{t('member_since')}</span>
                                    <div style={{ fontSize: '1.125rem', fontWeight: 700, marginTop: '4px' }}>
                                        {new Date(supplier.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                </div>
                                <div style={{ padding: '1.125rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>{t('brands_managed')}</span>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {supplier.brands?.length || 0}
                                        <Briefcase size={20} color="#3b82f6" />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                                    <ShieldCheck size={14} color="#22c55e" />
                                    {t('compliance_verified')}
                                </div>
                            </div>
                        </div>

                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={18} color="#64748b" />
                                {t('system_notes')}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                                {t('supplier_sync_msg')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </FigmaLayout>
    );
}
