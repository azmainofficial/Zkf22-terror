import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { t } from '../../Lang/translation';
import {
    ArrowLeft, Plus, Trash2, Pencil, Save,
    Calendar, DollarSign,
    Clock, Upload, FileText,
    AlertCircle, ChevronDown, X, Building2, Flag
} from 'lucide-react';
import Modal from '@/Components/Modal';
import ProjectCalculationTable from '@/Components/ProjectCalculationTable';

// ─── Design Tokens ──────────────────────────────────────────────
const labelStyle = {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: '8px'
};

const inputStyle = {
    width: '100%',
    height: '48px',
    padding: '0 1rem',
    borderRadius: '10px',
    border: '1.5px solid #f1f5f9',
    background: '#fff',
    fontSize: '0.9rem',
    fontWeight: 500,
    outline: 'none',
    transition: 'all 0.2s',
    color: '#1e293b'
};

const sectionStyle = {
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #f1f5f9',
    padding: '2rem',
    marginBottom: '1.5rem'
};

const sectionTitleStyle = {
    fontSize: '0.8rem',
    fontWeight: 800,
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '1.5rem'
};

export default function Create({ auth, clients }) {
    const [showClientModal, setShowClientModal] = useState(false);

    const clientForm = useForm({
        name: '',
        company_name: '',
        email: '',
        phone: '',
        status: 'active',
        stay_on_page: true
    });

    const { data, setData, post, processing, errors } = useForm({
        title: '', client_id: '', start_date: '', deadline: '',
        budget: 0, contract_details: {}, status: 'pending',
        priority: 'medium', description: '', designs: [], documents: [],
    });

    const handleCalcChange = (calcData) => {
        setData(prev => ({
            ...prev,
            contract_details: calcData,
            budget: calcData.grand_total || 0
        }));
    };

    const handleDesignUpload = e => {
        setData('designs', [...data.designs, ...Array.from(e.target.files)]);
    };

    const handleDocumentUpload = e => {
        setData('documents', [...data.documents, ...Array.from(e.target.files)]);
    };

    const submit = e => {
        e.preventDefault();
        post(route('projects.store'), { forceFormData: true });
    };

    const handleQuickClientSubmit = e => {
        e.preventDefault();
        clientForm.post(route('clients.store'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setShowClientModal(false);
                clientForm.reset();
                router.reload({ only: ['clients'] });
            }
        });
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={t('create_new_project')} />

            <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '6rem' }}>
                
                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                    <Link href={route('projects.index')} style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: '#fff', border: '1px solid #f1f5f9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#64748b', cursor: 'pointer', textDecoration: 'none'
                    }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{t('create_new_project')}</h1>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0', fontWeight: 500 }}>{t('add_project_to_portfolio')}</p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    {/* ── Basic Information ── */}
                    <div style={sectionStyle}>
                        <h3 style={sectionTitleStyle}>{t('basic_information')}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>{t('project_title')} <span style={{ color: '#ef4444' }}>*</span></label>
                                <input 
                                    type="text" 
                                    placeholder={t('enter_project_title')} 
                                    style={inputStyle}
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '6px', fontWeight: 600 }}>{errors.title}</p>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <label style={{ ...labelStyle, marginBottom: 0 }}>{t('client')} <span style={{ color: '#ef4444' }}>*</span></label>
                                        <button type="button" onClick={() => setShowClientModal(true)} style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}>+ {t('add_new_client')}</button>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <select 
                                            style={{ ...inputStyle, appearance: 'none' }}
                                            value={data.client_id}
                                            onChange={e => setData('client_id', e.target.value)}
                                            required
                                        >
                                            <option value="">{t('select_client')}</option>
                                            {clients.map(c => (
                                                <option key={c.id} value={c.id}>{c.company_name || c.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }} />
                                    </div>
                                    {errors.client_id && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '6px', fontWeight: 600 }}>{errors.client_id}</p>}
                                </div>
                                <div>
                                    <label style={labelStyle}>{t('priority')}</label>
                                    <div style={{ position: 'relative' }}>
                                        <select 
                                            style={{ ...inputStyle, appearance: 'none' }}
                                            value={data.priority}
                                            onChange={e => setData('priority', e.target.value)}
                                        >
                                            <option value="low">{t('low')}</option>
                                            <option value="medium">{t('medium')}</option>
                                            <option value="high">{t('high')}</option>
                                            <option value="critical">{t('critical')}</option>
                                        </select>
                                        <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>{t('description')}</label>
                                <textarea 
                                    placeholder={t('brief_description')} 
                                    style={{ ...inputStyle, height: '100px', padding: '12px', resize: 'none' }}
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Timeline ── */}
                    <div style={sectionStyle}>
                        <h3 style={sectionTitleStyle}>{t('timeline')}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>{t('start_date')}</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type="date" 
                                        style={inputStyle}
                                        value={data.start_date || ''}
                                        onChange={e => setData('start_date', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>{t('deadline')} <span style={{ color: '#ef4444' }}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type="date" 
                                        style={inputStyle}
                                        value={data.deadline || ''}
                                        onChange={e => setData('deadline', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.deadline && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '6px', fontWeight: 600 }}>{errors.deadline}</p>}
                            </div>
                        </div>
                    </div>

                    {/* ── Financial Details ── */}
                    <div style={sectionStyle}>
                        <h3 style={sectionTitleStyle}>Project Financials & Calculations</h3>
                        <ProjectCalculationTable project={{ contract_details: {} }} canEdit={true} onChange={handleCalcChange} />
                    </div>

                    {/* ── Upload Designs ── */}
                    <div style={sectionStyle}>
                        <h3 style={sectionTitleStyle}>Production / CAD Designs</h3>
                        <label style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '3rem 2rem', border: '2px dashed #e2e8f0', borderRadius: '16px',
                            cursor: 'pointer', background: '#fff', transition: 'all 0.2s'
                        }} onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'} onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
                            <Upload size={32} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', margin: 0 }}>{t('click_to_upload')}</p>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>{t('upload_hint')}</p>
                            <input type="file" multiple style={{ display: 'none' }} onChange={handleDesignUpload} />
                        </label>

                        {data.designs.length > 0 && (
                            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                                {data.designs.map((file, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                        <FileText size={16} color="#3b82f6" style={{ flexShrink: 0 }} />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                                        <button type="button" onClick={() => setData('designs', data.designs.filter((_, idx) => idx !== i))} style={{ color: '#ef4444', padding: '2px', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Upload Documents ── */}
                    <div style={sectionStyle}>
                        <h3 style={sectionTitleStyle}>Project Documents / Contracts</h3>
                        <label style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '3rem 2rem', border: '2px dashed #e2e8f0', borderRadius: '16px',
                            cursor: 'pointer', background: '#fff', transition: 'all 0.2s'
                        }} onMouseEnter={e => e.currentTarget.style.borderColor = '#10b981'} onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
                            <Upload size={32} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', margin: 0 }}>Upload formal documents & agreements</p>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>Attach multiple PDF, JPG or Word files</p>
                            <input type="file" multiple style={{ display: 'none' }} onChange={handleDocumentUpload} />
                        </label>

                        {data.documents.length > 0 && (
                            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                                {data.documents.map((file, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                        <FileText size={16} color="#10b981" style={{ flexShrink: 0 }} />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                                        <button type="button" onClick={() => setData('documents', data.documents.filter((_, idx) => idx !== i))} style={{ color: '#ef4444', padding: '2px', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Footer Actions ── */}
                    <div style={{ 
                        display: 'flex', justifyContent: 'flex-end', 
                        gap: '1rem', marginTop: '2.5rem'
                    }}>
                        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                            <button 
                                type="submit" 
                                disabled={processing}
                                style={{
                                    flex: 1, height: '42px', background: '#3b82f6', color: '#fff',
                                    border: 'none', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 800,
                                    cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                    boxShadow: '0 4px 10px rgba(59,130,246,0.15)'
                                }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {processing ? t('saving') : (
                                        <><Save size={16} /> {t('save_project')}</>
                                    )}
                                </span>
                            </button>
                            <Link href={route('projects.index')} style={{
                                height: '42px', padding: '0 1.5rem', background: '#fff', border: '1.5px solid #f1f5f9',
                                borderRadius: '10px', color: '#1e293b', fontSize: '0.85rem', fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                textDecoration: 'none'
                            }}>
                                <X size={16} /> {t('cancel')}
                            </Link>
                        </div>
                    </div>
                </form>

                {/* ── Quick Client Modal ── */}
                <Modal show={showClientModal} onClose={() => setShowClientModal(false)} maxWidth="md">
                    <form onSubmit={handleQuickClientSubmit} style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{t('add_new_client')}</h3>
                            <button type="button" onClick={() => setShowClientModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={labelStyle}>{t('company_name')}</label>
                                <input 
                                    type="text" 
                                    style={inputStyle} 
                                    value={clientForm.data.company_name} 
                                    onChange={e => clientForm.setData('company_name', e.target.value)} 
                                    required
                                />
                                {clientForm.errors.company_name && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{clientForm.errors.company_name}</p>}
                            </div>
                            <div>
                                <label style={labelStyle}>{t('contact_person')}</label>
                                <input 
                                    type="text" 
                                    style={inputStyle} 
                                    value={clientForm.data.name} 
                                    onChange={e => clientForm.setData('name', e.target.value)} 
                                    required
                                />
                                {clientForm.errors.name && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{clientForm.errors.name}</p>}
                            </div>
                            <div>
                                <label style={labelStyle}>{t('email_address')}</label>
                                <input 
                                    type="email" 
                                    style={inputStyle} 
                                    value={clientForm.data.email} 
                                    onChange={e => clientForm.setData('email', e.target.value)} 
                                    required
                                />
                                {clientForm.errors.email && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{clientForm.errors.email}</p>}
                            </div>
                            <div>
                                <label style={labelStyle}>{t('phone_number')}</label>
                                <input 
                                    type="text" 
                                    style={inputStyle} 
                                    value={clientForm.data.phone} 
                                    onChange={e => clientForm.setData('phone', e.target.value)} 
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                            <button 
                                type="submit" 
                                disabled={clientForm.processing}
                                style={{
                                    flex: 1, height: '48px', background: '#3b82f6', color: '#fff',
                                    border: 'none', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 800,
                                    cursor: clientForm.processing ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                {clientForm.processing ? t('saving') : t('add_client')}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setShowClientModal(false)}
                                style={{
                                    height: '48px', padding: '0 1.5rem', background: '#fff', border: '1.5px solid #f1f5f9',
                                    borderRadius: '10px', color: '#1e293b', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer'
                                }}
                            >
                                {t('cancel')}
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>


            <style>{`
                aside { z-index: 110 !important; }
                header { z-index: 105 !important; }
            `}</style>
        </FigmaLayout>
    );
}
