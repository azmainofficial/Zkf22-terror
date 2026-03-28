import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    X,
    Plus,
    Trash2,
    Upload,
    Pencil,
    FileText,
    Calendar,
    DollarSign,
    Clock,
    Layers,
    PlusCircle,
    Check,
    Loader2,
    Image as ImageIcon,
    AlertCircle,
    Building2,
    Target
} from 'lucide-react';

const fieldStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.65rem 1rem 0.65rem 2.4rem',
    background: '#f9f7ff',
    border: '1.5px solid #ede9fe',
    borderRadius: '12px',
    fontSize: '0.88rem',
    color: '#1e1b4b',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: 'inherit'
};

const textAreaStyle = {
    ...fieldStyle,
    padding: '1rem',
    minHeight: '120px',
    resize: 'vertical'
};

const onFocus = e => {
    e.target.style.borderColor = '#8b5cf6';
    e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)';
};

const onBlur = e => {
    e.target.style.borderColor = '#ede9fe';
    e.target.style.boxShadow = 'none';
};

const labelStyle = {
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#4b5563',
    display: 'block',
    marginBottom: '5px'
};

function Field({ icon: Icon, error, children }) {
    return (
        <div style={{ position: 'relative', width: '100%' }}>
            {Icon && <Icon size={14} color="#a78bfa" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 10 }} />}
            {children}
            {error && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}><AlertCircle size={11} /> {error}</p>}
        </div>
    );
}

function SectionCard({ title, subtitle, icon: Icon, children, accent = '#6366f1' }) {
    return (
        <div style={{ background: '#fff', borderRadius: '18px', border: '1.5px solid #f0eeff', boxShadow: '0 2px 12px rgba(99,102,241,0.05)', overflow: 'hidden', marginBottom: '1.25rem' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f5f3ff', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={17} color={accent} />
                </div>
                <div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{title}</p>
                    {subtitle && <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: 0 }}>{subtitle}</p>}
                </div>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>{children}</div>
        </div>
    );
}

export default function Edit({ auth, project, clients }) {
    const [preview, setPreview] = useState(project.image ? `/storage/${project.image}` : null);
    const [milestones, setMilestones] = useState(project.contract_details || []);
    const [editingMilestone, setEditingMilestone] = useState(null);
    const [milestoneForm, setMilestoneForm] = useState({ description: '', amount: '' });

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: project.title,
        client_id: project.client_id,
        start_date: project.start_date,
        deadline: project.deadline || '',
        budget: project.budget,
        actual_cost: project.actual_cost || 0,
        status: project.status,
        priority: project.priority,
        progress: project.progress || 0,
        description: project.description || '',
        image: null,
        contract_details: JSON.stringify(project.contract_details || []),
        contract_amount: project.contract_amount || 0,
    });

    useEffect(() => {
        const total = milestones.reduce((sum, m) => sum + parseFloat(m.amount || 0), 0);
        setData(prev => ({
            ...prev,
            contract_details: JSON.stringify(milestones),
            contract_amount: total
        }));
    }, [milestones]);

    const handleAddMilestone = () => {
        if (milestoneForm.description && milestoneForm.amount) {
            if (editingMilestone !== null) {
                const updated = [...milestones];
                updated[editingMilestone] = milestoneForm;
                setMilestones(updated);
                setEditingMilestone(null);
            } else {
                setMilestones([...milestones, milestoneForm]);
            }
            setMilestoneForm({ description: '', amount: '' });
        }
    };

    const handleEditMilestone = (index) => {
        setMilestoneForm(milestones[index]);
        setEditingMilestone(index);
    };

    const handleDeleteMilestone = (index) => {
        setMilestones(milestones.filter((_, i) => i !== index));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('projects.update', project.id), {
            forceFormData: true,
        });
    };

    const STATUS_OPTIONS = [
        { value: 'pending', label: 'Pending', color: '#f59e0b', bg: '#fffbeb' },
        { value: 'ongoing', label: 'In Progress', color: '#6366f1', bg: '#f5f3ff' },
        { value: 'on_hold', label: 'On Hold', color: '#6b7280', bg: '#f3f4f6' },
        { value: 'completed', label: 'Completed', color: '#10b981', bg: '#ecfdf5' },
        { value: 'cancelled', label: 'Cancelled', color: '#ef4444', bg: '#fef2f2' },
    ];

    const PRIORITY_OPTIONS = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'critical', label: 'Critical' },
    ];

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Edit Project - ${project.title}`} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link href={route('projects.show', project.id)}>
                            <button style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fff', border: '1.5px solid #ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6366f1', transition: 'all 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f5f3ff'}
                                onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                                <ArrowLeft size={18} />
                            </button>
                        </Link>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2px' }}>
                                <Target size={14} color="#a78bfa" />
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Projects</span>
                            </div>
                            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Edit Project</h1>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={submit} disabled={processing} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.7rem 1.5rem', background: processing ? '#a78bfa' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.3) transition: all 0.2s' }}>
                            {processing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }} className="project-grid">
                    
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        
                        <SectionCard title="Basic Information" subtitle="Project name, client and description" icon={FileText}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={labelStyle}>Project Name</label>
                                    <Field icon={Target} error={errors.title}>
                                        <input type="text" value={data.title} onChange={e => setData('title', e.target.value)}
                                            placeholder="Enter project title" style={fieldStyle} onFocus={onFocus} onBlur={onBlur} required />
                                    </Field>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={labelStyle}>Client</label>
                                        <Field icon={Building2} error={errors.client_id}>
                                            <select value={data.client_id} onChange={e => setData('client_id', e.target.value)}
                                                style={{ ...fieldStyle, appearance: 'none', cursor: 'pointer' }} onFocus={onFocus} onBlur={onBlur} required>
                                                <option value="">Select a client</option>
                                                {clients.map(c => <option key={c.id} value={c.id}>{c.company_name || c.name}</option>)}
                                            </select>
                                        </Field>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Priority</label>
                                        <Field>
                                            <select value={data.priority} onChange={e => setData('priority', e.target.value)}
                                                style={{ ...fieldStyle, paddingLeft: '1rem', appearance: 'none', cursor: 'pointer' }} onFocus={onFocus} onBlur={onBlur}>
                                                {PRIORITY_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                                            </select>
                                        </Field>
                                    </div>
                                </div>

                                <div>
                                    <label style={labelStyle}>Description</label>
                                    <Field error={errors.description}>
                                        <textarea value={data.description} onChange={e => setData('description', e.target.value)}
                                            placeholder="Describe what this project is about..." style={textAreaStyle} onFocus={onFocus} onBlur={onBlur} />
                                    </Field>
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard title="Timeline & Dates" subtitle="Set start and end dates" icon={Calendar} accent="#10b981">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Start Date</label>
                                    <Field icon={Calendar} error={errors.start_date}>
                                        <input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)}
                                            style={fieldStyle} onFocus={onFocus} onBlur={onBlur} required />
                                    </Field>
                                </div>
                                <div>
                                    <label style={labelStyle}>Deadline</label>
                                    <Field icon={Clock} error={errors.deadline}>
                                        <input type="date" value={data.deadline} onChange={e => setData('deadline', e.target.value)}
                                            style={fieldStyle} onFocus={onFocus} onBlur={onBlur} required />
                                    </Field>
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard title="Payment Milestones" subtitle="Break down the project into payments" icon={Layers} accent="#8b5cf6">
                            <div style={{ background: '#f9f7ff', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', border: '1.5px dashed #dcd7ff' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 50px', gap: '1rem', alignItems: 'flex-end' }}>
                                    <div>
                                        <label style={{ ...labelStyle, color: '#6366f1' }}>Milestone Description</label>
                                        <input type="text" value={milestoneForm.description} onChange={e => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                                            placeholder="e.g. Initial Deposit, Final Delivery" style={{ ...fieldStyle, paddingLeft: '1rem', background: '#fff' }} onFocus={onFocus} onBlur={onBlur} />
                                    </div>
                                    <div>
                                        <label style={{ ...labelStyle, color: '#6366f1' }}>Amount (৳)</label>
                                        <input type="number" value={milestoneForm.amount} onChange={e => setMilestoneForm({ ...milestoneForm, amount: e.target.value })}
                                            placeholder="0.00" style={{ ...fieldStyle, paddingLeft: '1rem', background: '#fff', textAlign: 'right' }} onFocus={onFocus} onBlur={onBlur} />
                                    </div>
                                    <button type="button" onClick={handleAddMilestone} disabled={!milestoneForm.description || !milestoneForm.amount}
                                        style={{ height: '42px', width: '42px', borderRadius: '10px', background: '#6366f1', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', opacity: (!milestoneForm.description || !milestoneForm.amount) ? 0.5 : 1 }}>
                                        {editingMilestone !== null ? <Check size={20} /> : <Plus size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {milestones.map((m, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: '#fff', borderRadius: '12px', border: '1.5px solid #f0eeff' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#f5f3ff', color: '#6366f1', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>{m.description}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#6366f1' }}>৳{new Intl.NumberFormat().format(m.amount)}</span>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <button type="button" onClick={() => handleEditMilestone(i)} style={{ color: '#9ca3af', background: 'none', border: 'none', padding: '4px', cursor: 'pointer' }}><Pencil size={14} /></button>
                                                <button type="button" onClick={() => handleDeleteMilestone(i)} style={{ color: '#ef4444', background: 'none', border: 'none', padding: '4px', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                {milestones.length > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#1e1b4b', borderRadius: '12px', marginTop: '0.5rem' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a5b4fc' }}>Total Project Value</span>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>৳{new Intl.NumberFormat().format(data.contract_amount)}</span>
                                    </div>
                                )}
                                
                                {milestones.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', fontSize: '0.85rem', background: '#f9f9fb', borderRadius: '12px' }}>
                                        No milestones added yet.
                                    </div>
                                )}
                            </div>
                        </SectionCard>
                    </div>

                    {/* Right Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        <SectionCard title="Status & Progress" subtitle="Set current project state" icon={Loader2}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={labelStyle}>Project Status</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {STATUS_OPTIONS.map(s => (
                                            <button key={s.value} type="button" onClick={() => setData('status', s.value)}
                                                style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '10px', border: '1.5px solid', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', background: data.status === s.value ? s.bg : '#fff', borderColor: data.status === s.value ? s.color : '#f0eeff', color: data.status === s.value ? s.color : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                {s.label}
                                                {data.status === s.value && <Check size={14} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <label style={labelStyle}>Progress</label>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6366f1' }}>{data.progress}%</span>
                                    </div>
                                    <input type="range" min="0" max="100" value={data.progress} onChange={e => setData('progress', e.target.value)}
                                        style={{ width: '100%', height: '6px', background: '#ede9fe', borderRadius: '10px', appearance: 'none', cursor: 'pointer', outline: 'none' }} />
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard title="Project Image" subtitle="Display thumbnail" icon={ImageIcon} accent="#f43f5e">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                                {preview ? (
                                    <div style={{ width: '100%', height: '180px', borderRadius: '14px', overflow: 'hidden', position: 'relative', border: '2px solid #f0eeff' }}>
                                        <img src={preview} style={{ width: '100%', height: '100%', objectCover: 'cover' }} alt="Preview" />
                                        <button onClick={() => { setData('image', null); setPreview(null); }}
                                            style={{ position: 'absolute', top: '8px', right: '8px', padding: '6px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#ef4444', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <label style={{ width: '100%', height: '180px', borderRadius: '14px', border: '2px dashed #ede9fe', background: '#f9f7ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '10px', transition: 'all 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = '#c4b5fd'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = '#ede9fe'}>
                                        <Upload size={24} color="#a78bfa" />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa' }}>Upload Main Image</span>
                                        <input type="file" onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" />
                                    </label>
                                )}
                            </div>
                        </SectionCard>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button onClick={submit} disabled={processing} style={{ width: '100%', padding: '0.9rem', background: processing ? '#a78bfa' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '14px', color: '#fff', fontSize: '1rem', fontWeight: 800, cursor: processing ? 'not-allowed' : 'pointer', boxShadow: '0 6px 20px rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                {processing ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                {processing ? 'Saving...' : 'Save All Changes'}
                            </button>
                            <Link href={route('projects.show', project.id)} style={{ textDecoration: 'none' }}>
                                <button style={{ width: '100%', padding: '0.8rem', background: '#fff', border: '1.5px solid #ede9fe', borderRadius: '14px', color: '#9ca3af', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#fecaca'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = '#ede9fe'; }}>
                                    Cancel & Return
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 992px) {
                    .project-grid { grid-template-columns: 1fr !important; }
                }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </FigmaLayout>
    );
}
