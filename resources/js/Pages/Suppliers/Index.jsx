import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import { t } from '../../Lang/translation';
import {
    Search, Plus, Phone, Mail, MapPin, 
    Building2, Pencil, Trash2, Filter, 
    ChevronDown, ExternalLink, Globe,
    MoreVertical, User, Briefcase
} from 'lucide-react';

export default function Index({ auth, suppliers, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'All');

    useEffect(() => {
        const t = setTimeout(() => {
            router.get(route('suppliers.index'), { search, status }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(t);
    }, [search, status]);

    const handleDelete = (id) => {
        if (confirm(t('delete_supplier_confirm'))) {
            router.delete(route('suppliers.destroy', id), { preserveScroll: true });
        }
    };

    const cardStyle = {
        background: '#fff',
        borderRadius: '20px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)',
        padding: '1.5rem',
        transition: 'all 0.2s ease',
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem 1rem',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '0.875rem',
        outline: 'none',
        transition: 'all 0.2s',
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={t('suppliers')} />

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#1e293b', margin: 0, letterSpacing: '-0.025em' }}>{t('suppliers')}</h1>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>{t('suppliers_network')}</p>
                    </div>
                    <Link href={route('suppliers.create')}>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: '#2563eb', color: '#fff', border: 'none',
                            padding: '0.75rem 1.5rem', borderRadius: '12px',
                            fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
                            boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)'
                        }}>
                            <Plus size={18} />
                            {t('add_supplier')}
                        </button>
                    </Link>
                </div>

                {/* Filters */}
                <div style={{ ...cardStyle, marginBottom: '2rem', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder={t('search_suppliers_placeholder')}
                                style={{ ...inputStyle, paddingLeft: '2.75rem' }}
                            />
                        </div>
                        <div style={{ width: '200px', position: 'relative' }}>
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                                style={{ ...inputStyle, appearance: 'none' }}
                            >
                                <option value="All">{t('all_status')}</option>
                                <option value="active">{t('active')}</option>
                                <option value="inactive">{t('inactive')}</option>
                            </select>
                            <ChevronDown size={16} color="#94a3b8" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                    {suppliers.data.map((supplier) => (
                        <div key={supplier.id} style={cardStyle} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {supplier.avatar ? (
                                            <img src={`/storage/${supplier.avatar}`} style={{ width: '100%', height: '100%', objectCover: 'cover' }} alt="" />
                                        ) : (
                                            <Building2 size={24} color="#94a3b8" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#1e293b' }}>{supplier.company_name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '0.75rem', fontWeight: 500, marginTop: '2px' }}>
                                            <User size={12} />
                                            {supplier.name}
                                        </div>
                                    </div>
                                </div>
                                <span style={{
                                    padding: '4px 10px',
                                    borderRadius: '8px',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    background: supplier.status === 'active' ? '#f0fdf4' : '#f8fafc',
                                    color: supplier.status === 'active' ? '#16a34a' : '#64748b',
                                    border: `1px solid ${supplier.status === 'active' ? '#dcfce7' : '#f1f5f9'}`
                                }}>
                                    {supplier.status === 'active' ? t('active') : t('inactive')}
                                </span>
                            </div>

                            <div style={{ spaceY: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', fontSize: '0.875rem' }}>
                                    <Mail size={16} color="#94a3b8" />
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{supplier.email || t('no_email')}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', fontSize: '0.875rem', marginTop: '0.75rem' }}>
                                    <Phone size={16} color="#94a3b8" />
                                    <span>{supplier.phone || t('no_phone')}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', fontSize: '0.875rem', marginTop: '0.75rem' }}>
                                    <MapPin size={16} color="#94a3b8" />
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{supplier.address || t('no_address')}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                                <Link href={route('suppliers.show', supplier.id)} style={{ flex: 1 }}>
                                    <button style={{ width: '100%', padding: '0.625rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                        <ExternalLink size={14} /> {t('view_details')}
                                    </button>
                                </Link>
                                <Link href={route('suppliers.edit', supplier.id)}>
                                    <button style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                        <Pencil size={16} />
                                    </button>
                                </Link>
                                <button
                                    onClick={() => handleDelete(supplier.id)}
                                    style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff', border: '1px solid #fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {suppliers.data.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                        <div style={{ width: '80px', height: '80px', background: '#f8fafc', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Building2 size={32} color="#cbd5e1" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t('no_suppliers_found')}</h3>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>{t('try_adjusting')}</p>
                    </div>
                )}
            </div>
        </FigmaLayout>
    );
}
