import React from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    Building2,
    Mail,
    Phone,
    Globe,
    User,
    X,
    Shield,
    MapPin,
    Hash,
    History,
    Camera,
    ChevronDown,
    Map
} from 'lucide-react';

const cardStyle = {
    background: '#fff',
    borderRadius: '24px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
    padding: '2.5rem',
    position: 'relative',
    overflow: 'hidden'
};

const inputStyle = (error) => ({
    width: '100%',
    height: '52px',
    padding: '0 1rem 0 3rem',
    borderRadius: '14px',
    border: `1.5px solid ${error ? '#fca5a5' : '#f0eeff'}`,
    background: '#f8fafc',
    fontSize: '0.95rem',
    fontWeight: 700,
    outline: 'none',
    transition: 'all 0.2s',
    color: '#1e1b4b'
});

export default function Edit({ auth, client }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: client.name || '',
        company_name: client.company_name || '',
        vat_number: client.vat_number || '',
        industry: client.industry || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        city: client.city || '',
        website: client.website || '',
        linkedin: client.linkedin || '',
        facebook: client.facebook || '',
        twitter: client.twitter || '',
        instagram: client.instagram || '',
        avatar: null,
        logo: null,
        status: client.status || 'active',
        notes: client.notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('clients.update', client.id), {
            forceFormData: true,
        });
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Edit Client" />

            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <Link href={route('clients.index')} style={{ textDecoration: 'none' }}>
                            <button style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff', border: '1.5px solid #f0eeff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Edit Details</h1>
                            <p style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 600, margin: '4px 0 0' }}>Update the information for <span style={{ color: '#6366f1' }}>{client.company_name}</span></p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#f8fafc', borderRadius: '12px', border: '1.5px solid #f1f5f9' }}>
                        <History size={14} color="#94a3b8" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                            Last updated {new Date(client.updated_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }} className="form-grid">
                    
                    {/* Main Form Fields */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f5f3ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Building2 size={20} />
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Company Details</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', paddingLeft: '4px' }}>Company Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <Building2 size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                        <input type="text" value={data.company_name} onChange={e => setData('company_name', e.target.value)} style={inputStyle(errors.company_name)} />
                                    </div>
                                    {errors.company_name && <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700, paddingLeft: '4px' }}>{errors.company_name}</span>}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', paddingLeft: '4px' }}>Contact Person</label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} style={inputStyle(errors.name)} />
                                    </div>
                                    {errors.name && <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700, paddingLeft: '4px' }}>{errors.name}</span>}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', paddingLeft: '4px' }}>Industry</label>
                                    <div style={{ position: 'relative' }}>
                                        <Briefcase size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                        <input type="text" value={data.industry} onChange={e => setData('industry', e.target.value)} style={inputStyle(errors.industry)} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', paddingLeft: '4px' }}>VAT / Tax Number</label>
                                    <div style={{ position: 'relative' }}>
                                        <Hash size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                        <input type="text" value={data.vat_number} onChange={e => setData('vat_number', e.target.value)} style={inputStyle()} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Globe size={20} />
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Contact Details</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', paddingLeft: '4px' }}>Email Address</label>
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} style={inputStyle(errors.email)} />
                                    </div>
                                    {errors.email && <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700, paddingLeft: '4px' }}>{errors.email}</span>}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', paddingLeft: '4px' }}>Phone Number</label>
                                    <div style={{ position: 'relative' }}>
                                        <Phone size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                        <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} style={inputStyle(errors.phone)} />
                                    </div>
                                    {errors.phone && <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700, paddingLeft: '4px' }}>{errors.phone}</span>}
                                </div>

                                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', paddingLeft: '4px' }}>Office Address</label>
                                    <div style={{ position: 'relative' }}>
                                        <MapPin size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                                        <textarea value={data.address} onChange={e => setData('address', e.target.value)} style={{ ...inputStyle(), height: '100px', padding: '16px 1rem 16px 3.5rem', resize: 'none' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Settings */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f8fafc', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Shield size={20} />
                                </div>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Logos & Status</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Relationship Status</label>
                                    <div style={{ position: 'relative' }}>
                                        <select value={data.status} onChange={e => setData('status', e.target.value)} style={{ ...inputStyle(), paddingLeft: '1rem', appearance: 'none', cursor: 'pointer' }}>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="prospective">Lead / Potential</option>
                                        </select>
                                        <ChevronDown size={18} color="#94a3b8" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Company Logo</label>
                                    <div style={{ position: 'relative', width: '100%', height: '120px', borderRadius: '16px', border: '2px dashed #ede9fe', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer' }}>
                                        {(data.logo || client.logo) ? (
                                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                                <img src={data.logo ? URL.createObjectURL(data.logo) : `/storage/${client.logo}`} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }} />
                                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                                                    <Camera size={24} color="#fff" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center' }}>
                                                <Camera size={24} color="#6366f1" style={{ marginBottom: '8px' }} />
                                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>Update Logo</p>
                                            </div>
                                        )}
                                        <input type="file" onChange={e => setData('logo', e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} accept="image/*" />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Contact Photo</label>
                                    <div style={{ position: 'relative', width: '100%', height: '80px', borderRadius: '16px', border: '2px dashed #ede9fe', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer' }}>
                                        {(data.avatar || client.avatar) ? (
                                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                                <img src={data.avatar ? URL.createObjectURL(data.avatar) : `/storage/${client.avatar}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                                                    <User size={20} color="#fff" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <User size={18} color="#94a3b8" />
                                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>Photo</p>
                                            </div>
                                        )}
                                        <input type="file" onChange={e => setData('avatar', e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} accept="image/*" />
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button type="submit" disabled={processing} style={{ width: '100%', height: '56px', borderRadius: '16px', background: '#6366f1', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 8px 25px rgba(99,102,241,0.2)' }}>
                                    {processing ? 'Saving...' : <><Save size={20} /> Save Changes</>}
                                </button>
                                <Link href={route('clients.index')} style={{ textDecoration: 'none' }}>
                                    <button type="button" style={{ width: '100%', height: '52px', background: '#fff', border: '1.5px solid #ede9fe', borderRadius: '14px', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer' }}>
                                        Cancel
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .form-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </FigmaLayout>
    );
}
