import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft, User, Mail, Phone, Briefcase, Building2,
    DollarSign, MapPin, Save, UserCheck, Loader2, Image as ImageIcon,
    FileText, Trash2, Plus
} from 'lucide-react';

const fieldStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.75rem 1rem 0.75rem 2.5rem',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '0.9rem',
    color: '#111827',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: 'inherit'
};

const labelStyle = {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#374151',
    display: 'block',
    marginBottom: '6px'
};

function Field({ icon: Icon, error, children }) {
    return (
        <div style={{ position: 'relative', width: '100%' }}>
            {Icon && <Icon size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '14px', pointerEvents: 'none', zIndex: 10 }} />}
            {children}
            {error && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{error}</p>}
        </div>
    );
}

function SectionCard({ title, subtitle, icon: Icon, children }) {
    return (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color="#111827" />
                </div>
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: 0 }}>{title}</h3>
                    {subtitle && <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0, fontWeight: 500 }}>{subtitle}</p>}
                </div>
            </div>
            <div style={{ padding: '1.5rem' }}>{children}</div>
        </div>
    );
}

export default function Create({ shifts, departments, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        first_name: '',
        last_name: '',
        genre: 'male',
        blood_group: '',
        date_of_birth: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        salary: '',
        address: '',
        join_date: '',
        status: 'active',
        shift_id: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        avatar: null,
        attachments: [{ title: '', file: null }]
    });

    const addAttachment = () => setData('attachments', [...data.attachments, { title: '', file: null }]);
    const removeAttachment = (index) => setData('attachments', data.attachments.filter((_, i) => i !== index));
    const handleAttachmentChange = (index, field, value) => {
        const newAttachments = [...data.attachments];
        newAttachments[index][field] = value;
        setData('attachments', newAttachments);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('employees.store'));
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Add New Member" />

            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '5rem' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link href={route('employees.index')}>
                            <button style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#111827' }}>
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <div>
                            <h1 style={{ fontSize: '1.875rem', fontWeight: 900, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>Add New Member</h1>
                            <p style={{ fontSize: '0.95rem', color: '#6b7280', margin: '4px 0 0', fontWeight: 500 }}>Create a new profile for your team member.</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }} className="form-grid">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        
                        <SectionCard title="Basic Details" subtitle="Full name and ID registration" icon={UserCheck}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div>
                                        <label style={labelStyle}>Employee ID</label>
                                        <Field error={errors.employee_id}>
                                            <input type="text" value={data.employee_id} onChange={e => setData('employee_id', e.target.value)} placeholder="e.g. ZK-001" style={fieldStyle} required />
                                        </Field>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Employment Status</label>
                                        <select value={data.status} onChange={e => setData('status', e.target.value)} style={{ ...fieldStyle, paddingLeft: '1rem' }}>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="on_leave">On Leave</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div>
                                        <label style={labelStyle}>First Name</label>
                                        <Field icon={User} error={errors.first_name}>
                                            <input type="text" value={data.first_name} onChange={e => setData('first_name', e.target.value)} placeholder="Enter first name" style={fieldStyle} required />
                                        </Field>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Last Name</label>
                                        <Field icon={User} error={errors.last_name}>
                                            <input type="text" value={data.last_name} onChange={e => setData('last_name', e.target.value)} placeholder="Enter last name" style={fieldStyle} required />
                                        </Field>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard title="Role & Salary" subtitle="Where they work and how much they earn" icon={Briefcase}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div>
                                        <label style={labelStyle}>Department</label>
                                        <Field icon={Building2} error={errors.department}>
                                            <input type="text" value={data.department} onChange={e => setData('department', e.target.value)} placeholder="e.g. Sales" style={fieldStyle} required />
                                        </Field>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Job Title</label>
                                        <Field icon={Briefcase} error={errors.designation}>
                                            <input type="text" value={data.designation} onChange={e => setData('designation', e.target.value)} placeholder="e.g. Manager" style={fieldStyle} required />
                                        </Field>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div>
                                        <label style={labelStyle}>Monthly Salary (৳)</label>
                                        <Field icon={DollarSign} error={errors.salary}>
                                            <input type="number" value={data.salary} onChange={e => setData('salary', e.target.value)} placeholder="0.00" style={fieldStyle} />
                                        </Field>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Work Shift</label>
                                        <select value={data.shift_id} onChange={e => setData('shift_id', e.target.value)} style={{ ...fieldStyle, paddingLeft: '1rem' }}>
                                            <option value="">Choose a shift</option>
                                            {shifts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard title="Contact Info" subtitle="How to reach them" icon={Phone}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div>
                                        <label style={labelStyle}>Email Address</label>
                                        <Field icon={Mail} error={errors.email}>
                                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="email@example.com" style={fieldStyle} />
                                        </Field>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Phone Number</label>
                                        <Field icon={Phone} error={errors.phone}>
                                            <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="+880" style={fieldStyle} required />
                                        </Field>
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>Full Address</label>
                                    <Field icon={MapPin} error={errors.address}>
                                        <textarea value={data.address} onChange={e => setData('address', e.target.value)} placeholder="Home address..." style={{ ...fieldStyle, padding: '0.75rem 1rem 0.75rem 2.5rem', minHeight: '100px', resize: 'vertical' }} />
                                    </Field>
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard title="Documents" subtitle="Upload IDs or Certificates" icon={FileText}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {data.attachments.map((att, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', background: '#f9fafb', padding: '1rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <input type="text" value={att.title} onChange={e => handleAttachmentChange(index, 'title', e.target.value)} placeholder="Document Name (e.g. NID)" style={{ ...fieldStyle, paddingLeft: '1rem' }} />
                                            <input type="file" onChange={e => handleAttachmentChange(index, 'file', e.target.files[0])} style={{ fontSize: '0.8rem' }} />
                                        </div>
                                        {data.attachments.length > 1 && (
                                            <button type="button" onClick={() => removeAttachment(index)} style={{ background: '#fff', border: '1px solid #fee2e2', color: '#ef4444', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addAttachment} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '1rem', background: '#fff', border: '1px dashed #e5e7eb', borderRadius: '12px', color: '#111827', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                                    <Plus size={16} /> Add Another File
                                </button>
                            </div>
                        </SectionCard>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: '#f3f4f6', margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {data.avatar ? <img src={URL.createObjectURL(data.avatar)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={32} color="#9ca3af" />}
                            </div>
                            <label style={{ cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800, color: '#111827', display: 'block', background: '#f8fafc', padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                                Upload Photo
                                <input type="file" hidden accept="image/*" onChange={e => setData('avatar', e.target.files[0])} />
                            </label>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button onClick={submit} disabled={processing} style={{ width: '100%', height: '52px', background: '#111827', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: 800, cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                {processing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {processing ? 'Saving...' : 'Create Member'}
                            </button>
                            <Link href={route('employees.index')} style={{ textDecoration: 'none' }}>
                                <button style={{ width: '100%', height: '52px', background: '#fff', color: '#4b5563', border: '1px solid #e5e7eb', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>
                                    Cancel
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 800px) { .form-grid { grid-template-columns: 1fr !important; } }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </FigmaLayout>
    );
}
