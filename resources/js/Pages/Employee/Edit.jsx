import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Briefcase,
    Building2,
    Calendar,
    DollarSign,
    MapPin,
    Heart,
    CreditCard,
    Save,
    Sparkles,
    Smartphone,
    Clock,
    UserCheck,
    CheckCircle2,
    AlertCircle,
    Loader2,
    PencilLine
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

const cardStyle = {
    background: '#fff',
    borderRadius: '24px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
    padding: '1.5rem',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
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
        <div style={{ background: '#fff', borderRadius: '20px', border: '1.5px solid #f0eeff', boxShadow: '0 2px 12px rgba(99,102,241,0.05)', overflow: 'hidden', marginBottom: '1.25rem' }}>
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

export default function Edit({ employee, shifts, auth }) {
    const { data, setData, put, processing, errors } = useForm({
        employee_id: employee.employee_id || '',
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || '',
        designation: employee.designation || '',
        salary: employee.salary || '',
        address: employee.address || '',
        join_date: employee.join_date || '',
        status: employee.status || 'active',
        shift_id: employee.shift_id?.toString() || '',
        emergency_contact_name: employee.emergency_contact_name || '',
        emergency_contact_phone: employee.emergency_contact_phone || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('employees.update', employee.id));
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Edit Employee: ${employee.first_name}`} />

            <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link href={route('employees.index')}>
                            <button style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fff', border: '1.5px solid #ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6366f1' }}>
                                <ArrowLeft size={18} />
                            </button>
                        </Link>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2px' }}>
                                <PencilLine size={14} color="#a78bfa" />
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Employees</span>
                            </div>
                            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Edit Employee</h1>
                        </div>
                    </div>
                    
                    <button onClick={submit} disabled={processing} style={{ height: '48px', padding: '0 1.5rem', background: processing ? '#a78bfa' : '#6366f1', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.9rem', fontWeight: 800, cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(99,102,241,0.2)' }}>
                        {processing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {processing ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }} className="form-grid">
                    {/* Main Form Area */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        
                        <SectionCard title="Personal Information" subtitle="Basic identity details" icon={User} accent="#10b981">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div>
                                        <label style={labelStyle}>Employee ID</label>
                                        <Field icon={Smartphone} error={errors.employee_id}>
                                            <input type="text" value={data.employee_id} onChange={e => setData('employee_id', e.target.value)}
                                                placeholder="e.g. EMP-101" style={fieldStyle} onFocus={onFocus} onBlur={onBlur} required />
                                        </Field>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Current Status</label>
                                        <select value={data.status} onChange={e => setData('status', e.target.value)}
                                            style={{ ...fieldStyle, paddingLeft: '1rem', appearance: 'none', cursor: 'pointer' }} onFocus={onFocus} onBlur={onBlur}>
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
                                            <input type="text" value={data.first_name} onChange={e => setData('first_name', e.target.value)}
                                                placeholder="Enter first name" style={fieldStyle} onFocus={onFocus} onBlur={onBlur} required />
                                        </Field>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Last Name</label>
                                        <Field icon={User} error={errors.last_name}>
                                            <input type="text" value={data.last_name} onChange={e => setData('last_name', e.target.value)}
                                                placeholder="Enter last name" style={fieldStyle} onFocus={onFocus} onBlur={onBlur} required />
                                        </Field>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard title="Job Details" subtitle="Department and work info" icon={Briefcase} accent="#6366f1">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div>
                                        <label style={labelStyle}>Department</label>
                                        <Field icon={Building2} error={errors.department}>
                                            <input type="text" value={data.department} onChange={e => setData('department', e.target.value)}
                                                placeholder="e.g. Operations" style={fieldStyle} onFocus={onFocus} onBlur={onBlur} required />
                                        </Field>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Designation</label>
                                        <Field icon={Briefcase} error={errors.designation}>
                                            <input type="text" value={data.designation} onChange={e => setData('designation', e.target.value)}
                                                placeholder="e.g. Field Engineer" style={fieldStyle} onFocus={onFocus} onBlur={onBlur} required />
                                        </Field>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div>
                                        <label style={labelStyle}>Monthly Salary (৳)</label>
                                        <Field icon={DollarSign} error={errors.salary}>
                                            <input type="number" value={data.salary} onChange={e => setData('salary', e.target.value)}
                                                placeholder="0.00" style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
                                        </Field>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Work Shift</label>
                                        <select value={data.shift_id} onChange={e => setData('shift_id', e.target.value)}
                                            style={{ ...fieldStyle, paddingLeft: '1rem', appearance: 'none', cursor: 'pointer' }} onFocus={onFocus} onBlur={onBlur}>
                                            <option value="">Select a shift</option>
                                            {shifts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard title="Contact Information" subtitle="How to reach the employee" icon={Phone} accent="#f43f5e">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div>
                                        <label style={labelStyle}>Email Address</label>
                                        <Field icon={Mail} error={errors.email}>
                                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                                placeholder="employee@company.com" style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
                                        </Field>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Phone Number</label>
                                        <Field icon={Phone} error={errors.phone}>
                                            <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)}
                                                placeholder="e.g. +880" style={fieldStyle} onFocus={onFocus} onBlur={onBlur} required />
                                        </Field>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div>
                                        <label style={labelStyle}>Emergency Contact Name</label>
                                        <Field icon={User} error={errors.emergency_contact_name}>
                                            <input type="text" value={data.emergency_contact_name} onChange={e => setData('emergency_contact_name', e.target.value)}
                                                placeholder="Contact person name" style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
                                        </Field>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Emergency Phone</label>
                                        <Field icon={Phone} error={errors.emergency_contact_phone}>
                                            <input type="text" value={data.emergency_contact_phone} onChange={e => setData('emergency_contact_phone', e.target.value)}
                                                placeholder="Contact person phone" style={fieldStyle} onFocus={onFocus} onBlur={onBlur} />
                                        </Field>
                                    </div>
                                </div>

                                <div>
                                    <label style={labelStyle}>Permanent Address</label>
                                    <Field icon={MapPin} error={errors.address}>
                                        <textarea value={data.address} onChange={e => setData('address', e.target.value)}
                                            placeholder="Enter full address" style={{ ...fieldStyle, padding: '0.75rem 1rem 0.75rem 2.4rem', minHeight: '80px', resize: 'vertical' }} onFocus={onFocus} onBlur={onBlur} />
                                    </Field>
                                </div>
                            </div>
                        </SectionCard>
                    </div>

                    {/* Right Column / Summary */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        <div style={cardStyle}>
                            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#f5f3ff', border: '2px solid #fff', boxShadow: '0 4px 14px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', overflow: 'hidden' }}>
                                    {employee.avatar ? (
                                        <img src={`/storage/${employee.avatar}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6366f1' }}>{employee.first_name?.[0]}{employee.last_name?.[0]}</span>
                                    )}
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e1b4b', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{employee.first_name} {employee.last_name}</h3>
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{employee.designation || 'Staff Member'}</p>
                            </div>
                            
                            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1.5px dashed #f0eeff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Joined On</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4b5563' }}>{new Date(employee.join_date).toLocaleDateString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Last Updated</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981' }}>{new Date(employee.updated_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                <Clock size={16} color="#6366f1" />
                                <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>System Activity</h3>
                            </div>
                            <div style={{ padding: '0.75rem', borderRadius: '14px', background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', gap: '10px' }}>
                                <div style={{ minWidth: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', marginTop: '4px' }}></div>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, margin: 0, lineHeight: '1.4' }}>
                                    Changes made here will be recorded in the security log for verification.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button onClick={submit} disabled={processing} style={{ width: '100%', padding: '0.9rem', background: processing ? '#a78bfa' : '#6366f1', border: 'none', borderRadius: '14px', color: '#fff', fontSize: '1rem', fontWeight: 800, cursor: processing ? 'not-allowed' : 'pointer', boxShadow: '0 6px 20px rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                {processing ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                {processing ? 'Updating...' : 'Save Changes'}
                            </button>
                            <Link href={route('employees.index')} style={{ textDecoration: 'none' }}>
                                <button style={{ width: '100%', padding: '0.8rem', background: '#fff', border: '1.5px solid #ede9fe', borderRadius: '14px', color: '#9ca3af', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                                    Discard Edits
                                </button>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .form-grid { grid-template-columns: 1fr !important; }
                }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </FigmaLayout>
    );
}
