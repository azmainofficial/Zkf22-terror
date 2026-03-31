import { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { t } from '../../Lang/translation';
import {
    Plus, Search, Edit2, Trash2, Loader2, 
    X, Ruler, Scale, Save
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

export default function Index({ auth, units = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '', abbreviation: '', _method: 'POST'
    });

    const filteredUnits = units.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenCreate = () => {
        setEditingUnit(null);
        reset();
        clearErrors();
        setData('_method', 'POST');
        setShowModal(true);
    };

    const handleOpenEdit = (unit) => {
        setEditingUnit(unit);
        setData({ name: unit.name, abbreviation: unit.abbreviation, _method: 'PATCH' });
        clearErrors();
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm(t('delete_unit_confirm'))) {
            router.delete(route('units.destroy', id));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const action = editingUnit ? route('units.update', editingUnit.id) : route('units.store');
        post(action, {
            onSuccess: () => { setShowModal(false); reset(); },
        });
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={t('measurement_units')} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1400px', margin: '0 auto', paddingBottom: '4rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.02em' }}>{t('measurement_units')}</h1>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500, marginTop: '4px' }}>
                            {t('define_units_desc')}
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
                        <Plus size={18} /> {t('add_new_unit')}
                    </button>
                </div>

                {/* Search */}
                <div style={{ position: 'relative', maxWidth: '480px' }}>
                    <Search size={18} color="#cbd5e1" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder={t('search_units')}
                        style={{ ...inputStyle, paddingLeft: '3rem', height: '54px', borderRadius: '16px' }}
                        onFocus={onFocus} onBlur={onBlur}
                    />
                </div>

                {/* Units Grid */}
                {filteredUnits.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                        {filteredUnits.map(unit => (
                            <div key={unit.id} style={{ ...cardStyle, padding: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'all 0.2s', cursor: 'default' }}
                                className="unit-card"
                            >
                                <div style={{ 
                                    width: '64px', height: '64px', borderRadius: '18px', 
                                    background: '#f8fafc', border: '1.5px solid #f1f5f9', color: '#94a3b8', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    marginBottom: '1.25rem' 
                                }}>
                                    <Scale size={32} />
                                </div>

                                <h3 style={{ fontSize: '1.15rem', fontWeight: 850, color: '#1e1b4b', margin: '0 0 8px' }}>{unit.name}</h3>
                                <div style={{ 
                                    fontSize: '0.75rem', fontWeight: 800, color: '#64748b', 
                                    background: '#f1f5f9', padding: '4px 12px', borderRadius: '10px', 
                                    textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' 
                                }}>
                                    {unit.abbreviation}
                                </div>

                                <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                                    <button
                                        onClick={() => handleOpenEdit(unit)}
                                        style={{ flex: 1, padding: '0.65rem', borderRadius: '12px', border: '1.5px solid #f1f5f9', background: '#f8fafc', color: '#64748b', fontSize: '0.85rem', fontWeight: 750, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        {t('edit')}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(unit.id)}
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
                        <Ruler size={48} color="#e2e8f0" style={{ margin: '0 auto 1.5rem' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 850, color: '#1e1b4b', margin: '0 0 0.5rem' }}>{t('no_units_found')}</h3>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', margin: '0 0 2rem' }}>
                            {searchQuery ? t('no_results_match') : t('get_started_unit')}
                        </p>
                        <button
                            onClick={handleOpenCreate}
                            style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0 1.5rem', height: '48px',
                                background: '#1e1b4b', border: 'none', borderRadius: '14px', color: '#fff', 
                                fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(30,27,75,0.15)' 
                            }}
                        >
                            <Plus size={18} /> {t('add_new_unit')}
                        </button>
                    </div>
                )}
            </div>

            {/* Unit Form Modal */}
            <Modal show={showModal} onClose={() => !processing && setShowModal(false)} maxWidth="md">
                <div style={{ padding: '2.5rem', background: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>
                                {editingUnit ? t('edit_unit') : t('new_unit')}
                            </h2>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '4px 0 0', fontWeight: 500 }}>
                                {t('define_measure_desc')}
                            </p>
                        </div>
                        <button onClick={() => setShowModal(false)} style={{ border: 'none', background: '#f8fafc', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: '#94a3b8' }}>
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={submit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            <div>
                                <label style={labelStyle}>{t('full_name')} *</label>
                                <input
                                    type="text" required value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder={t('full_name_placeholder')}
                                    style={{ ...inputStyle, borderColor: errors.name ? '#ef4444' : '#f1f5f9' }}
                                    onFocus={onFocus} onBlur={onBlur}
                                />
                                {errors.name && <p style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, marginTop: '6px' }}>{errors.name}</p>}
                            </div>
                            <div>
                                <label style={labelStyle}>{t('abbreviation')} *</label>
                                <input
                                    type="text" required value={data.abbreviation}
                                    onChange={e => setData('abbreviation', e.target.value)}
                                    placeholder={t('abbrev_placeholder_alt')}
                                    style={{ ...inputStyle, borderColor: errors.abbreviation ? '#ef4444' : '#f1f5f9' }}
                                    onFocus={onFocus} onBlur={onBlur}
                                />
                                {errors.abbreviation && <p style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, marginTop: '6px' }}>{errors.abbreviation}</p>}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, height: '52px', borderRadius: '14px', border: '1.5px solid #f1f5f9', background: '#fff', color: '#64748b', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>
                                {t('cancel')}
                            </button>
                            <button type="submit" disabled={processing} style={{ flex: 1, height: '52px', borderRadius: '14px', border: 'none', background: '#1e1b4b', color: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 16px rgba(30,27,75,0.15)' }}>
                                {processing ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> {t('saving')}</> : <><Save size={18} />{editingUnit ? t('update_changes') : t('save_unit')}</>}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .unit-card:hover {
                    border-color: #cbd5e1 !important;
                    transform: translateY(-2px) !important;
                    box-shadow: 0 12px 30px rgba(0,0,0,0.06) !important;
                }
            `}</style>
        </FigmaLayout>
    );
}
