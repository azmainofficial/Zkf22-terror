import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { 
    Shield, 
    Save, 
    Lock, 
    ShieldCheck, 
    Info,
    ChevronLeft,
    Zap,
    Globe,
    UserCircle,
    UserPlus,
    CheckCircle2,
    Layers,
    Layout,
    Users
} from 'lucide-react';

const cardStyle = {
    background: '#fff',
    borderRadius: '28px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 4px 20px rgba(99,102,241,0.06)',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden'
};

const inputStyle = {
    width: '100%',
    height: '52px',
    padding: '0 1.25rem',
    borderRadius: '16px',
    border: '1.5px solid #f0eeff',
    background: '#f8fafc',
    fontSize: '0.95rem',
    fontWeight: 700,
    outline: 'none',
    transition: 'all 0.2s',
    color: '#1e1b4b'
};

const onFocus = e => {
    e.target.style.borderColor = '#8b5cf6';
    e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.1)';
};

const onBlur = e => {
    e.target.style.borderColor = '#f0eeff';
    e.target.style.boxShadow = 'none';
};

export default function Show({ auth, role, allPermissions }) {
    const form = useForm({
        display_name: role.display_name,
        description: role.description || '',
        permissions: role.permissions.map(p => p.id),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.put(route('roles.update', role.id), {
            preserveScroll: true,
        });
    };

    const togglePermission = (permissionId) => {
        const permissions = [...form.data.permissions];
        const index = permissions.indexOf(permissionId);
        if (index > -1) permissions.splice(index, 1);
        else permissions.push(permissionId);
        form.setData('permissions', permissions);
    };

    const toggleGroupPermissions = (groupPermissions) => {
        const groupIds = groupPermissions.map(p => p.id);
        const allSelected = groupIds.every(id => form.data.permissions.includes(id));
        let newPermissions = [...form.data.permissions];
        if (allSelected) newPermissions = newPermissions.filter(id => !groupIds.includes(id));
        else groupIds.forEach(id => { if (!newPermissions.includes(id)) newPermissions.push(id); });
        form.setData('permissions', newPermissions);
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Access Tier: ${role.display_name}`} />

            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <Link href={route('roles.index')} style={{ textDecoration: 'none' }}>
                            <button style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#fff', border: '1.5px solid #f0eeff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#8b5cf6'} onMouseLeave={e => e.currentTarget.style.borderColor = '#f0eeff'}>
                                <ChevronLeft size={24} />
                            </button>
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(99,102,241,0.2)' }}>
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {role.display_name}
                                    {role.is_system && <div style={{ background: '#fef3c7', padding: '6px 12px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 900, color: '#d97706', display: 'flex', alignItems: 'center', gap: '6px' }}><Lock size={12} /> SYSTEM CORE</div>}
                                </h1>
                                <p style={{ fontSize: '0.95rem', color: '#6b7280', fontWeight: 600, margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ color: '#6366f1' }}>@{role.name}</span>
                                    <span style={{ color: '#cbd5e1' }}>•</span>
                                    <span>{role.users?.length || 0} Members assigned</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <button onClick={handleSubmit} disabled={form.processing} style={{ height: '56px', padding: '0 2.5rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px rgba(16,185,129,0.2)', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <Save size={20} />
                        {form.processing ? 'Writing rules...' : 'Commit Rule Changes'}
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2.5rem' }} className="roles-grid">
                    
                    {/* Left Sidebar: Detailed Metadata */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f5f3ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Info size={18} />
                                </div>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Operational Context</h3>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '0.05em' }}>Visual Identification</label>
                                    <input type="text" value={form.data.display_name} onChange={e => form.setData('display_name', e.target.value)} style={inputStyle} disabled={role.is_system} onFocus={onFocus} onBlur={onBlur} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '0.05em' }}>Responsibility Scope</label>
                                    <textarea value={form.data.description} onChange={e => form.setData('description', e.target.value)} placeholder="Describe the purpose of this tier..." style={{ ...inputStyle, height: '140px', padding: '1rem', resize: 'none' }} onFocus={onFocus} onBlur={onBlur} />
                                </div>
                            </div>
                        </div>

                        <div style={{ ...cardStyle, background: '#faf9ff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Users size={18} />
                                </div>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Active Members</h3>
                            </div>
                            
                            {role.users && role.users.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {role.users.map(user => (
                                        <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#fff', borderRadius: '16px', border: '1.5px solid #f0eeff', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#8b5cf6'} onMouseLeave={e => e.currentTarget.style.borderColor = '#f0eeff'}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f5f3ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 900, border: '1.5px solid #ede9fe' }}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1e1b4b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
                                                <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem 0', opacity: 0.6 }}>
                                    <UserCircle size={40} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
                                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, fontStyle: 'italic', margin: 0 }}>No members in this tier.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Area: Granular Permissions Matrix */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {Object.entries(allPermissions).map(([group, permissions]) => {
                            const groupPermissions = permissions;
                            const allSelected = groupPermissions.every(p => form.data.permissions.includes(p.id));
                            const selectedCount = groupPermissions.filter(p => form.data.permissions.includes(p.id)).length;
                            
                            return (
                                <div key={group} style={cardStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', background: '#faf9ff', margin: '-2rem -2rem 1.5rem', padding: '1.5rem 2rem', borderBottom: '1.5px solid #f0eeff' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#fff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', border: '1.5px solid #f0eeff' }}>
                                                <Layout size={24} />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1e1b4b', margin: 0, textTransform: 'capitalize' }}>{group.replace('_', ' ')} System</h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: selectedCount > 0 ? '#10b981' : '#cbd5e1' }}></div>
                                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, margin: 0 }}>{selectedCount} of {groupPermissions.length} Operations Authorized</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => toggleGroupPermissions(groupPermissions)}
                                            style={{ height: '42px', padding: '0 1.25rem', background: allSelected ? '#fee2e2' : '#e0e7ff', color: allSelected ? '#ef4444' : '#4338ca', border: 'none', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
                                        >
                                            {allSelected ? <Zap size={14} /> : <CheckCircle2 size={14} />}
                                            {allSelected ? 'Revoke Module' : 'Authorize Entire Module'}
                                        </button>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                                        {groupPermissions.map(permission => {
                                            const isSelected = form.data.permissions.includes(permission.id);
                                            return (
                                                <div 
                                                    key={permission.id} 
                                                    onClick={() => togglePermission(permission.id)}
                                                    style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'flex-start', 
                                                        gap: '15px', 
                                                        padding: '1.5rem', 
                                                        borderRadius: '20px', 
                                                        border: `2px solid ${isSelected ? '#6366f1' : '#f1f5f9'}`, 
                                                        background: isSelected ? '#f5f3ff' : '#fff',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        boxShadow: isSelected ? '0 8px 20px rgba(99,102,241,0.12)' : 'none'
                                                    }}
                                                >
                                                    <div style={{ 
                                                        width: '24px', height: '24px', borderRadius: '8px', 
                                                        background: isSelected ? '#6366f1' : '#fff', 
                                                        border: `2px solid ${isSelected ? '#6366f1' : '#d1d5db'}`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: '#fff', transition: 'all 0.2s', marginTop: '2px', flexShrink: 0
                                                    }}>
                                                        {isSelected && <Zap size={14} fill="currentColor" strokeWidth={3} />}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ fontSize: '0.95rem', fontWeight: 900, color: isSelected ? '#4338ca' : '#1e1b4b', margin: '0 0 4px', letterSpacing: '-0.01em' }}>{permission.display_name}</p>
                                                        {permission.description ? (
                                                            <p style={{ fontSize: '0.8rem', color: isSelected ? '#6366f1' : '#94a3b8', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>{permission.description}</p>
                                                        ) : (
                                                            <p style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700, fontStyle: 'italic', margin: 0 }}>No technical scope defined.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 1100px) {
                    .roles-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </FigmaLayout>
    );
}
