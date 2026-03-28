import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    ArrowLeft, Save, X, Plus, Trash2, Pencil,
    FileText, Briefcase, Building2, Calendar, DollarSign,
    Clock, PlusCircle, Loader2, Upload, MapPin, Mail, Phone,
    User, FileUp, AlertCircle, CheckCircle2, ChevronDown,
    AlignLeft, Flag, Hash,
} from 'lucide-react';
import Modal from '@/Components/Modal';

// ─── Reusable styled field components ────────────────────────────
const label = (text, required = false) => (
    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: '6px' }}>
        {text}{required && <span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>}
    </label>
);

const fieldStyle = {
    width: '100%', boxSizing: 'border-box',
    padding: '0.65rem 1rem 0.65rem 2.5rem',
    background: '#f9f7ff', border: '1.5px solid #ede9fe',
    borderRadius: '12px', fontSize: '0.88rem',
    color: '#1e1b4b', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
};

const fieldNoIcon = { ...fieldStyle, paddingLeft: '1rem' };

function Field({ icon: Icon, error, children }) {
    return (
        <div style={{ position: 'relative' }}>
            {Icon && (
                <Icon size={15} color="#a78bfa" style={{
                    position: 'absolute', left: '12px', top: '50%',
                    transform: 'translateY(-50%)', pointerEvents: 'none',
                }} />
            )}
            {children}
            {error && (
                <p style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '4px',
                    display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <AlertCircle size={11} /> {error}
                </p>
            )}
        </div>
    );
}

function SectionCard({ title, subtitle, icon: Icon, children, accent = '#6366f1' }) {
    return (
        <div style={{
            background: '#fff', borderRadius: '18px',
            border: '1.5px solid #f0eeff',
            boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
            overflow: 'hidden',
        }}>
            <div style={{
                padding: '1.1rem 1.5rem',
                borderBottom: '1px solid #f5f3ff',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: `${accent}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                    <Icon size={18} color={accent} />
                </div>
                <div>
                    <p style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{title}</p>
                    {subtitle && <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: 0 }}>{subtitle}</p>}
                </div>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>{children}</div>
        </div>
    );
}

// Focus / blur helpers
const onFocus = e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; };
const onBlur  = e => { e.target.style.borderColor = '#ede9fe'; e.target.style.boxShadow = 'none'; };

// ─── Main component ───────────────────────────────────────────────
export default function Create({ auth, clients }) {
    const [milestones, setMilestones]       = useState([]);
    const [editIdx, setEditIdx]             = useState(null);
    const [milestoneForm, setMilestoneForm] = useState({ description: '', amount: '' });
    const [showClientModal, setShowClientModal] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title: '', client_id: '', start_date: '', deadline: '',
        contract_amount: '', contract_details: [], status: 'pending',
        priority: 'medium', description: '', designs: [],
    });

    const clientForm = useForm({
        name: '', company_name: '', email: '', phone: '', address: '', status: 'active',
    });

    useEffect(() => {
        setData(prev => ({
            ...prev,
            contract_details: JSON.stringify(milestones),
            contract_amount: milestones.reduce((s, m) => s + parseFloat(m.amount || 0), 0),
        }));
    }, [milestones]);

    const addMilestone = () => {
        if (!milestoneForm.description || !milestoneForm.amount) return;
        if (editIdx !== null) {
            const updated = [...milestones];
            updated[editIdx] = milestoneForm;
            setMilestones(updated);
            setEditIdx(null);
        } else {
            setMilestones([...milestones, milestoneForm]);
        }
        setMilestoneForm({ description: '', amount: '' });
    };

    const handleDesignUpload = e => {
        setData('designs', [...data.designs, ...Array.from(e.target.files)]);
    };

    const handleCreateClient = e => {
        e.preventDefault();
        clientForm.post(route('clients.store'), {
            onSuccess: () => { setShowClientModal(false); clientForm.reset(); router.reload({ only: ['clients'] }); },
            preserveScroll: true,
        });
    };

    const submit = e => { e.preventDefault(); post(route('projects.store'), { forceFormData: true }); };

    const total = milestones.reduce((s, m) => s + parseFloat(m.amount || 0), 0);

    const PRIORITY_OPTIONS = [
        { value: 'low',      label: 'Low',      color: '#22c55e' },
        { value: 'medium',   label: 'Medium',   color: '#f59e0b' },
        { value: 'high',     label: 'High',     color: '#ef4444' },
        { value: 'critical', label: 'Critical', color: '#7c3aed' },
    ];

    const STATUS_OPTIONS = [
        { value: 'pending',   label: 'Pending'     },
        { value: 'ongoing',   label: 'In Progress' },
        { value: 'on_hold',   label: 'On Hold'     },
        { value: 'completed', label: 'Completed'   },
        { value: 'cancelled', label: 'Cancelled'   },
    ];

    return (
        <FigmaLayout user={auth.user}>
            <Head title="New Project" />

            <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* ── Page header ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <Link href={route('projects.index')}>
                            <button style={{
                                width: '40px', height: '40px', borderRadius: '11px',
                                background: '#fff', border: '1.5px solid #ede9fe',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: '#6366f1',
                                boxShadow: '0 1px 6px rgba(99,102,241,0.08)',
                                transition: 'all 0.15s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f5f3ff'}
                                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                            >
                                <ArrowLeft size={18} />
                            </button>
                        </Link>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2px' }}>
                                <Briefcase size={15} color="#a78bfa" />
                                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Projects</span>
                            </div>
                            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Create New Project</h1>
                        </div>
                    </div>

                    {/* Save button (top) */}
                    <button
                        form="project-form"
                        type="submit"
                        disabled={processing}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '0.65rem 1.5rem',
                            background: processing ? '#a78bfa' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                            border: 'none', borderRadius: '12px',
                            color: '#fff', fontSize: '0.88rem', fontWeight: 700,
                            cursor: processing ? 'not-allowed' : 'pointer',
                            boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                            transition: 'opacity 0.15s',
                        }}
                        onMouseEnter={e => { if (!processing) e.currentTarget.style.opacity = '0.88'; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                    >
                        {processing ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {processing ? 'Saving…' : 'Save Project'}
                    </button>
                </div>

                {/* ── Main form (2-col on desktop) ── */}
                <form id="project-form" onSubmit={submit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }} className="form-grid">

                        {/* LEFT column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                            {/* Basic info */}
                            <SectionCard title="Project Details" subtitle="Basic information about this project" icon={Briefcase}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                                    {/* Title */}
                                    <div>
                                        {label('Project Title', true)}
                                        <Field icon={Hash} error={errors.title}>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={e => setData('title', e.target.value)}
                                                placeholder="e.g. Website Redesign, Mobile App Development…"
                                                style={fieldStyle}
                                                onFocus={onFocus} onBlur={onBlur}
                                                required
                                            />
                                        </Field>
                                    </div>

                                    {/* Client + Priority row */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            {label('Client', true)}
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <Field icon={Building2} error={errors.client_id}>
                                                    <select
                                                        value={data.client_id}
                                                        onChange={e => setData('client_id', e.target.value)}
                                                        style={{ ...fieldStyle, appearance: 'none', cursor: 'pointer' }}
                                                        onFocus={onFocus} onBlur={onBlur}
                                                        required
                                                    >
                                                        <option value="">Select a client</option>
                                                        {clients.map(c => (
                                                            <option key={c.id} value={c.id}>
                                                                {c.company_name} — {c.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </Field>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowClientModal(true)}
                                                style={{
                                                    marginTop: '6px', background: 'none', border: 'none',
                                                    color: '#6366f1', fontSize: '0.72rem', fontWeight: 700,
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px',
                                                    padding: 0,
                                                }}
                                            >
                                                <Plus size={11} /> Add new client
                                            </button>
                                        </div>

                                        <div>
                                            {label('Priority')}
                                            <Field icon={Flag}>
                                                <select
                                                    value={data.priority}
                                                    onChange={e => setData('priority', e.target.value)}
                                                    style={{ ...fieldStyle, appearance: 'none', cursor: 'pointer' }}
                                                    onFocus={onFocus} onBlur={onBlur}
                                                >
                                                    {PRIORITY_OPTIONS.map(o => (
                                                        <option key={o.value} value={o.value}>{o.label}</option>
                                                    ))}
                                                </select>
                                            </Field>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        {label('Status')}
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {STATUS_OPTIONS.map(o => (
                                                <button
                                                    key={o.value}
                                                    type="button"
                                                    onClick={() => setData('status', o.value)}
                                                    style={{
                                                        padding: '0.4rem 0.875rem',
                                                        borderRadius: '20px', border: '1.5px solid',
                                                        fontSize: '0.75rem', fontWeight: 700,
                                                        cursor: 'pointer', transition: 'all 0.15s',
                                                        borderColor: data.status === o.value ? '#8b5cf6' : '#ede9fe',
                                                        background: data.status === o.value ? 'linear-gradient(135deg,#ede9fe,#f5f3ff)' : '#fff',
                                                        color: data.status === o.value ? '#6d28d9' : '#9ca3af',
                                                    }}
                                                >
                                                    {o.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        {label('Description')}
                                        <Field icon={null}>
                                            <textarea
                                                value={data.description}
                                                onChange={e => setData('description', e.target.value)}
                                                placeholder="Briefly describe what this project is about, goals, and what needs to be delivered…"
                                                rows={4}
                                                style={{ ...fieldNoIcon, resize: 'vertical', paddingTop: '0.65rem', paddingBottom: '0.65rem', lineHeight: 1.6 }}
                                                onFocus={onFocus} onBlur={onBlur}
                                            />
                                        </Field>
                                    </div>
                                </div>
                            </SectionCard>

                            {/* Dates */}
                            <SectionCard title="Timeline" subtitle="When does this project start and end?" icon={Calendar} accent="#22c55e">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        {label('Start Date')}
                                        <Field icon={Calendar}>
                                            <input
                                                type="date"
                                                value={data.start_date}
                                                onChange={e => setData('start_date', e.target.value)}
                                                style={fieldStyle}
                                                onFocus={onFocus} onBlur={onBlur}
                                            />
                                        </Field>
                                    </div>
                                    <div>
                                        {label('Deadline', true)}
                                        <Field icon={Clock} error={errors.deadline}>
                                            <input
                                                type="date"
                                                value={data.deadline}
                                                onChange={e => setData('deadline', e.target.value)}
                                                style={fieldStyle}
                                                onFocus={onFocus} onBlur={onBlur}
                                                required
                                            />
                                        </Field>
                                    </div>
                                </div>
                            </SectionCard>

                            {/* Payment milestones */}
                            <SectionCard title="Payment Milestones" subtitle="Break the project budget into phases or tasks" icon={DollarSign} accent="#f59e0b">

                                {/* Add milestone form */}
                                <div style={{
                                    background: '#fafafa', borderRadius: '12px',
                                    border: '1.5px solid #f3f4f6', padding: '1rem',
                                    marginBottom: '1rem',
                                }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', marginBottom: '0.75rem' }}>
                                        {editIdx !== null ? 'Edit milestone' : 'Add a milestone'}
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0.625rem', alignItems: 'flex-end' }}>
                                        <div>
                                            {label('Milestone name')}
                                            <input
                                                type="text"
                                                value={milestoneForm.description}
                                                onChange={e => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                                                placeholder="e.g. Design phase, Final delivery…"
                                                style={{ ...fieldNoIcon, padding: '0.6rem 0.875rem' }}
                                                onFocus={onFocus} onBlur={onBlur}
                                            />
                                        </div>
                                        <div style={{ width: '130px' }}>
                                            {label('Amount (৳)')}
                                            <input
                                                type="number"
                                                value={milestoneForm.amount}
                                                onChange={e => setMilestoneForm({ ...milestoneForm, amount: e.target.value })}
                                                placeholder="0"
                                                min="0"
                                                style={{ ...fieldNoIcon, padding: '0.6rem 0.875rem', textAlign: 'right' }}
                                                onFocus={onFocus} onBlur={onBlur}
                                            />
                                        </div>
                                        <div style={{ paddingBottom: '0' }}>
                                            <div style={{ marginBottom: '6px', height: '17px' }} />
                                            <button
                                                type="button"
                                                onClick={addMilestone}
                                                disabled={!milestoneForm.description || !milestoneForm.amount}
                                                style={{
                                                    height: '38px', padding: '0 1rem',
                                                    background: (!milestoneForm.description || !milestoneForm.amount)
                                                        ? '#f3f4f6' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                                    border: 'none', borderRadius: '10px',
                                                    color: (!milestoneForm.description || !milestoneForm.amount) ? '#9ca3af' : '#fff',
                                                    fontWeight: 700, fontSize: '0.8rem',
                                                    cursor: (!milestoneForm.description || !milestoneForm.amount) ? 'not-allowed' : 'pointer',
                                                    display: 'flex', alignItems: 'center', gap: '4px',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {editIdx !== null ? <><Pencil size={13} /> Update</> : <><Plus size={13} /> Add</>}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Milestone list */}
                                {milestones.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {milestones.map((m, i) => (
                                            <div key={i} style={{
                                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                padding: '0.75rem 1rem', borderRadius: '12px',
                                                background: '#f9f7ff', border: '1.5px solid #ede9fe',
                                            }}>
                                                <div style={{
                                                    width: '26px', height: '26px', borderRadius: '7px',
                                                    background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.7rem', fontWeight: 800, color: '#6d28d9', flexShrink: 0,
                                                }}>{i + 1}</div>
                                                <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>{m.description}</span>
                                                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#4338ca' }}>
                                                    ৳{new Intl.NumberFormat().format(m.amount)}
                                                </span>
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    <button type="button" onClick={() => { setMilestoneForm(m); setEditIdx(i); }}
                                                        style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#f0fdf4', border: 'none', cursor: 'pointer', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Pencil size={12} />
                                                    </button>
                                                    <button type="button" onClick={() => setMilestones(milestones.filter((_, idx) => idx !== i))}
                                                        style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#fff1f2', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Total */}
                                        <div style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '0.75rem 1rem', borderRadius: '12px',
                                            background: 'linear-gradient(135deg,#ede9fe,#f5f3ff)',
                                            border: '1.5px solid #c4b5fd', marginTop: '4px',
                                        }}>
                                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6d28d9' }}>Total Budget</span>
                                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4338ca' }}>
                                                ৳{new Intl.NumberFormat().format(total)}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '2rem', border: '2px dashed #ede9fe', borderRadius: '12px' }}>
                                        <DollarSign size={28} color="#e0d9ff" style={{ margin: '0 auto 0.5rem' }} />
                                        <p style={{ fontSize: '0.82rem', color: '#9ca3af', margin: 0 }}>No milestones added yet</p>
                                    </div>
                                )}
                            </SectionCard>
                        </div>

                        {/* RIGHT column (sticky panel) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                            {/* File upload */}
                            <SectionCard title="Attachments" subtitle="Upload designs, documents, or references" icon={Upload} accent="#3b82f6">
                                <label style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    padding: '2rem 1rem', border: '2px dashed #ede9fe', borderRadius: '14px',
                                    cursor: 'pointer', background: '#faf9ff', transition: 'all 0.2s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#c4b5fd'; e.currentTarget.style.background = '#f5f3ff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#ede9fe'; e.currentTarget.style.background = '#faf9ff'; }}
                                >
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ede9fe',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                                        <FileUp size={20} color="#6366f1" />
                                    </div>
                                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4338ca', margin: '0 0 4px' }}>
                                        Click to upload files
                                    </p>
                                    <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: 0 }}>JPG, PNG, PDF, DWG — max 20MB</p>
                                    <input type="file" multiple className="hidden" style={{ display: 'none' }}
                                        onChange={handleDesignUpload} accept="image/*,.pdf,.dwg,.dxf" />
                                </label>

                                {data.designs.length > 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '0.75rem' }}>
                                        {data.designs.map((file, i) => (
                                            <div key={i} style={{
                                                display: 'flex', alignItems: 'center', gap: '0.625rem',
                                                padding: '0.5rem 0.75rem', borderRadius: '10px',
                                                background: '#f5f3ff', border: '1px solid #ede9fe',
                                            }}>
                                                <FileText size={14} color="#8b5cf6" style={{ flexShrink: 0 }} />
                                                <span style={{ flex: 1, fontSize: '0.75rem', fontWeight: 600, color: '#4338ca',
                                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                                                <span style={{ fontSize: '0.65rem', color: '#9ca3af', flexShrink: 0 }}>
                                                    {(file.size / 1024 / 1024).toFixed(1)}MB
                                                </span>
                                                <button type="button"
                                                    onClick={() => setData('designs', data.designs.filter((_, idx) => idx !== i))}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444',
                                                        display: 'flex', alignItems: 'center', padding: '2px', flexShrink: 0 }}>
                                                    <X size={13} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </SectionCard>

                            {/* Save button */}
                            <button
                                form="project-form"
                                type="submit"
                                disabled={processing}
                                style={{
                                    width: '100%', padding: '0.875rem',
                                    background: processing ? '#a78bfa' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                    border: 'none', borderRadius: '14px',
                                    color: '#fff', fontSize: '0.95rem', fontWeight: 800,
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    boxShadow: '0 6px 20px rgba(99,102,241,0.35)',
                                    transition: 'opacity 0.15s',
                                }}
                                onMouseEnter={e => { if (!processing) e.currentTarget.style.opacity = '0.88'; }}
                                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                            >
                                {processing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {processing ? 'Saving project…' : 'Save Project'}
                            </button>

                            <Link href={route('projects.index')} style={{ textAlign: 'center' }}>
                                <button type="button" style={{
                                    width: '100%', padding: '0.75rem',
                                    background: '#fff', border: '1.5px solid #ede9fe',
                                    borderRadius: '14px', color: '#9ca3af',
                                    fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                                }}>
                                    Cancel
                                </button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>

            {/* ── Add Client Modal ── */}
            <Modal show={showClientModal} onClose={() => setShowClientModal(false)} maxWidth="lg">
                <div style={{ background: '#fff', borderRadius: '18px', overflow: 'hidden' }}>
                    {/* Modal header */}
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f5f3ff',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f5f3ff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={18} color="#6366f1" />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Add New Client</p>
                                <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: 0 }}>Fill in the client details below</p>
                            </div>
                        </div>
                        <button onClick={() => setShowClientModal(false)} style={{
                            background: '#f3f4f6', border: 'none', borderRadius: '8px',
                            padding: '6px', cursor: 'pointer', color: '#9ca3af',
                            display: 'flex', alignItems: 'center',
                        }}>
                            <X size={16} />
                        </button>
                    </div>

                    <form onSubmit={handleCreateClient} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                {label('Company Name', true)}
                                <Field icon={Building2}>
                                    <input type="text" value={clientForm.data.company_name}
                                        onChange={e => clientForm.setData('company_name', e.target.value)}
                                        placeholder="Acme Corp" style={fieldStyle}
                                        onFocus={onFocus} onBlur={onBlur} required />
                                </Field>
                            </div>
                            <div>
                                {label('Contact Name', true)}
                                <Field icon={User}>
                                    <input type="text" value={clientForm.data.name}
                                        onChange={e => clientForm.setData('name', e.target.value)}
                                        placeholder="John Smith" style={fieldStyle}
                                        onFocus={onFocus} onBlur={onBlur} required />
                                </Field>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                {label('Email Address')}
                                <Field icon={Mail}>
                                    <input type="email" value={clientForm.data.email}
                                        onChange={e => clientForm.setData('email', e.target.value)}
                                        placeholder="email@company.com" style={fieldStyle}
                                        onFocus={onFocus} onBlur={onBlur} />
                                </Field>
                            </div>
                            <div>
                                {label('Phone Number', true)}
                                <Field icon={Phone}>
                                    <input type="text" value={clientForm.data.phone}
                                        onChange={e => clientForm.setData('phone', e.target.value)}
                                        placeholder="+880 …" style={fieldStyle}
                                        onFocus={onFocus} onBlur={onBlur} required />
                                </Field>
                            </div>
                        </div>

                        <div>
                            {label('Address')}
                            <Field icon={MapPin}>
                                <textarea value={clientForm.data.address}
                                    onChange={e => clientForm.setData('address', e.target.value)}
                                    placeholder="Street, City, Country…" rows={3}
                                    style={{ ...fieldStyle, resize: 'none', paddingTop: '0.65rem', lineHeight: 1.5 }}
                                    onFocus={onFocus} onBlur={onBlur} />
                            </Field>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.25rem' }}>
                            <button type="submit" disabled={clientForm.processing}
                                style={{
                                    flex: 1, padding: '0.75rem',
                                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                    border: 'none', borderRadius: '12px',
                                    color: '#fff', fontWeight: 700, fontSize: '0.88rem',
                                    cursor: clientForm.processing ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                }}>
                                {clientForm.processing ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                                Save Client
                            </button>
                            <button type="button" onClick={() => setShowClientModal(false)}
                                style={{
                                    padding: '0.75rem 1.25rem',
                                    background: '#fff', border: '1.5px solid #ede9fe',
                                    borderRadius: '12px', color: '#9ca3af',
                                    fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer',
                                }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <style>{`
                @media (min-width: 900px) {
                    .form-grid {
                        grid-template-columns: 1fr 340px !important;
                    }
                }
                @media (max-width: 600px) {
                    .form-grid > div > div {
                        grid-template-columns: 1fr !important;
                    }
                }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; }
                select option { font-weight: 500; }
            `}</style>
        </FigmaLayout>
    );
}
