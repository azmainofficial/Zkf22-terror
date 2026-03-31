import { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { t } from '../../Lang/translation';
import {
    Plus, Search, Edit2, Trash2, CloudUpload,
    Loader2, Building2, X, Tag, Save
} from 'lucide-react';
import Modal from '@/Components/Modal';

const cardStyle = {
    background: '#fff',
    borderRadius: '20px',
    border: '1.5px solid #f1f5f9',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
};

const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    padding: '0.85rem 1rem',
    borderRadius: '12px', border: '1.5px solid #f1f5f9',
    background: '#fff', fontSize: '0.9rem',
    fontWeight: 500, outline: 'none', color: '#1e1b4b',
    transition: 'all 0.2s',
};

const labelStyle = {
    fontSize: '0.8rem', fontWeight: 700,
    color: '#64748b', display: 'block', marginBottom: '8px',
};

const onFocus = e => { e.target.style.borderColor = '#1e1b4b'; e.target.style.boxShadow = '0 0 0 3px rgba(30,27,75,0.05)'; };
const onBlur  = e => { e.target.style.borderColor = '#f1f5f9'; e.target.style.boxShadow = 'none'; };

export default function Index({ auth, brands = [] }) {
    const [showModal, setShowModal]     = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [logoPreview, setLogoPreview] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '', description: '', logo: null, _method: 'POST',
    });

    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenCreate = () => {
        setEditingBrand(null);
        reset();
        clearErrors();
        setData('_method', 'POST');
        setLogoPreview(null);
        setShowModal(true);
    };

    const handleOpenEdit = (brand) => {
        setEditingBrand(brand);
        setData({ name: brand.name, description: brand.description || '', logo: null, _method: 'PATCH' });
        clearErrors();
        setLogoPreview(null);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm(t('delete_brand_confirm'))) {
            router.delete(route('brands.destroy', id));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const action = editingBrand ? route('brands.update', editingBrand.id) : route('brands.store');
        post(action, {
            onSuccess: () => { setShowModal(false); reset(); setLogoPreview(null); },
            forceFormData: true,
        });
    };

    useEffect(() => {
        if (data.logo instanceof File) {
            const url = URL.createObjectURL(data.logo);
            setLogoPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [data.logo]);

    return (
        <FigmaLayout user={auth.user}>
            <Head title={t('brands')} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1400px', margin: '0 auto', paddingBottom: '4rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.02em' }}>{t('brands')}</h1>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500, marginTop: '4px' }}>
                            {t('manage_brands_desc')}
                        </p>
                    </div>
                    <button
                        onClick={handleOpenCreate}
                        style={{
                            height: '48px', padding: '0 1.5rem', background: '#1e1b4b', 
                            border: 'none', borderRadius: '14px', color: '#fff', 
                            fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            boxShadow: '0 10px 20px rgba(30,27,75,0.15)'
                        }}
                    >
                        <Plus size={18} /> {t('add_new_brand')}
                    </button>
                </div>

                {/* Search */}
                <div style={{ position: 'relative', maxWidth: '480px' }}>
                    <Search size={18} color="#cbd5e1" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder={t('search_brands')}
                        style={{ ...inputStyle, paddingLeft: '3rem', height: '54px', borderRadius: '16px' }}
                        onFocus={onFocus} onBlur={onBlur}
                    />
                </div>

                {/* Brands Grid */}
                {filteredBrands.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                        {filteredBrands.map(brand => (
                            <div key={brand.id} style={{ ...cardStyle, padding: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'default' }}
                                className="brand-card"
                            >
                                {/* Logo */}
                                <div style={{ 
                                    width: '88px', height: '88px', borderRadius: '20px', 
                                    background: '#f8fafc', border: '1.5px solid #f1f5f9', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    overflow: 'hidden', marginBottom: '1.25rem' 
                                }}>
                                    {brand.logo ? (
                                        <img src={`/storage/${brand.logo}`} alt={brand.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }} />
                                    ) : (
                                        <Building2 size={36} color="#cbd5e1" />
                                    )}
                                </div>

                                {/* Name & Description */}
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 850, color: '#1e1b4b', margin: '0 0 8px' }}>{brand.name}</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, margin: '0 0 1.5rem', lineHeight: 1.5, minHeight: '2.4em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {brand.description || t('no_description')}
                                </p>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                                    <button
                                        onClick={() => handleOpenEdit(brand)}
                                        style={{ flex: 1, padding: '0.65rem', borderRadius: '12px', border: '1.5px solid #f1f5f9', background: '#f8fafc', color: '#64748b', fontSize: '0.85rem', fontWeight: 750, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        {t('edit')}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(brand.id)}
                                        style={{ width: '42px', padding: '0.65rem', borderRadius: '12px', border: '1.5px solid #fecaca', background: '#fff1f2', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title={t('delete')}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ ...cardStyle, padding: '5rem 1rem', textAlign: 'center', borderStyle: 'dashed', borderWidth: '2px', background: 'transparent' }}>
                        <Tag size={48} color="#e2e8f0" style={{ margin: '0 auto 1.5rem' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 850, color: '#1e1b4b', margin: '0 0 0.5rem' }}>{t('no_brands_found')}</h3>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', margin: '0 0 2rem' }}>
                            {searchQuery ? t('no_brands_match') : t('get_started_brand')}
                        </p>
                        <button
                            onClick={handleOpenCreate}
                            style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0 1.5rem', height: '48px',
                                background: '#1e1b4b', border: 'none', borderRadius: '14px', color: '#fff', 
                                fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(30,27,75,0.15)' 
                            }}
                        >
                            <Plus size={18} /> {t('add_new_brand')}
                        </button>
                    </div>
                )}
            </div>

            {/* Brand Form Modal */}
            <Modal show={showModal} onClose={() => !processing && setShowModal(false)} maxWidth="2xl">
                <div style={{ padding: '2.5rem', background: '#fff' }}>
                    {/* Modal Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>
                                {editingBrand ? t('edit_brand') : t('new_brand')}
                            </h2>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '4px 0 0', fontWeight: 500 }}>
                                {editingBrand ? t('update_brand_details') : t('register_new_brand')}
                            </p>
                        </div>
                        <button onClick={() => setShowModal(false)} style={{ border: 'none', background: '#f8fafc', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: '#94a3b8' }}>
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={submit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(140px, auto) 1fr', gap: '2rem', marginBottom: '2.5rem', alignItems: 'start' }}>
                            {/* Logo Upload */}
                            <div>
                                <label style={labelStyle}>{t('brand_logo')}</label>
                                <div
                                    onClick={() => !processing && document.getElementById('logo-upload-field').click()}
                                    style={{
                                        width: '140px', height: '140px', borderRadius: '20px',
                                        border: '2px dashed #cbd5e1', background: '#f8fafc',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', overflow: 'hidden', transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#1e1b4b'; e.currentTarget.style.background = '#f1f5f9'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                                >
                                    {logoPreview || (editingBrand?.logo && !data.logo) ? (
                                        <img src={logoPreview || `/storage/${editingBrand.logo}`} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }} />
                                    ) : (
                                        <>
                                            <CloudUpload size={32} color="#94a3b8" />
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginTop: '8px' }}>{t('upload')}</span>
                                        </>
                                    )}
                                </div>
                                <input id="logo-upload-field" type="file" style={{ display: 'none' }} onChange={e => setData('logo', e.target.files[0])} accept="image/*" />
                                <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500, marginTop: '8px', textAlign: 'center' }}>{t('png_jpg')}</p>
                            </div>

                            {/* Name + Description */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={labelStyle}>{t('brand_name')} *</label>
                                    <input
                                        type="text" required value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder={t('brand_name_placeholder')}
                                        style={{ ...inputStyle, borderColor: errors.name ? '#ef4444' : '#f1f5f9' }}
                                        onFocus={onFocus} onBlur={onBlur}
                                    />
                                    {errors.name && <p style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, marginTop: '6px' }}>{errors.name}</p>}
                                </div>
                                <div>
                                    <label style={labelStyle}>{t('description')}</label>
                                    <textarea
                                        rows={4}
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder={t('brief_description')}
                                        style={{ ...inputStyle, height: '100px', resize: 'none' }}
                                        onFocus={onFocus} onBlur={onBlur}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, height: '52px', borderRadius: '14px', border: '1.5px solid #f1f5f9', background: '#fff', color: '#64748b', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>
                                {t('cancel')}
                            </button>
                            <button type="submit" disabled={processing} style={{ flex: 1, height: '52px', borderRadius: '14px', border: 'none', background: '#1e1b4b', color: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 16px rgba(30,27,75,0.15)' }}>
                                {processing ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> {t('saving')}</> : <><Save size={18} />{editingBrand ? t('update_changes') : t('save_brand')}</>}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .brand-card:hover {
                    border-color: #cbd5e1 !important;
                    transform: translateY(-2px) !important;
                    box-shadow: 0 12px 30px rgba(0,0,0,0.06) !important;
                }
            `}</style>
        </FigmaLayout>
    );
}
