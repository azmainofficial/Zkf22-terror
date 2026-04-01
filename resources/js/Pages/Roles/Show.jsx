import React from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function Show({ auth, role, allPermissions }) {
    const form = useForm({
        display_name: role.display_name,
        description: role.description || '',
        permissions: role.permissions.map(p => p.id),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.put(route('roles.update', role.id), { preserveScroll: true });
    };

    const togglePermission = (id) => {
        const perms = [...form.data.permissions];
        const idx = perms.indexOf(id);
        if (idx > -1) perms.splice(idx, 1);
        else perms.push(id);
        form.setData('permissions', perms);
    };

    const toggleGroup = (groupPerms) => {
        const ids = groupPerms.map(p => p.id);
        const allSet = ids.every(id => form.data.permissions.includes(id));
        let newPerms = [...form.data.permissions];
        if (allSet) newPerms = newPerms.filter(id => !ids.includes(id));
        else ids.forEach(id => { if (!newPerms.includes(id)) newPerms.push(id); });
        form.setData('permissions', newPerms);
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Role: ${role.display_name}`} />

            <div style={{ maxWidth: '900px', margin: '0 auto', fontSize: '0.9rem', color: '#111827', paddingBottom: '4rem' }}>
                <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link href={route('roles.index')} style={{ color: '#6b7280', display: 'flex', alignItems: 'center', transition: 'color 0.2s', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#111827'} onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{role.display_name}</h1>
                                <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '0.8rem' }}>
                                    {role.is_system ? 'System Role' : 'Custom Role'} &bull; {role.users?.length || 0} members assigned
                                </p>
                            </div>
                        </div>
                        <button type="submit" disabled={form.processing} style={{ padding: '0.6rem 1.25rem', background: '#111827', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#374151'} onMouseLeave={e => e.currentTarget.style.background = '#111827'}>
                            {form.processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                    {/* Basic Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '3rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.85rem' }}>Display Name</label>
                            <input 
                                type="text" 
                                value={form.data.display_name} 
                                onChange={e => form.setData('display_name', e.target.value)} 
                                disabled={role.is_system}
                                style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', fontSize: '0.9rem', color: role.is_system ? '#6b7280' : '#111827', backgroundColor: role.is_system ? '#f3f4f6' : '#fff', boxSizing: 'border-box' }}
                                onFocus={e => e.target.style.borderColor = '#6366f1'}
                                onBlur={e => e.target.style.borderColor = '#d1d5db'}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.85rem' }}>Description</label>
                            <input 
                                type="text" 
                                value={form.data.description} 
                                onChange={e => form.setData('description', e.target.value)} 
                                placeholder="Describe this role's access level..."
                                style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', fontSize: '0.9rem', color: '#111827', boxSizing: 'border-box' }}
                                onFocus={e => e.target.style.borderColor = '#6366f1'}
                                onBlur={e => e.target.style.borderColor = '#d1d5db'}
                            />
                        </div>
                    </div>

                    {/* Permissions List */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Module Permissions</h2>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>Configure access boundaries for this role.</p>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {Object.entries(allPermissions).map(([group, perms]) => {
                                const groupSelected = perms.every(p => form.data.permissions.includes(p.id));
                                return (
                                    <div key={group} style={{ border: '1px solid #f3f4f6', borderRadius: '8px', padding: '1.25rem', background: '#f9fafb' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
                                            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, textTransform: 'capitalize', color: '#111827' }}>
                                                {group.replace('_', ' ')}
                                            </h3>
                                            <button type="button" onClick={() => toggleGroup(perms)} style={{ fontSize: '0.75rem', fontWeight: 500, background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', padding: 0 }} onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
                                                {groupSelected ? 'Deselect All' : 'Select All'}
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {perms.map(p => {
                                                const checked = form.data.permissions.includes(p.id);
                                                return (
                                                    <label key={p.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={checked} 
                                                            onChange={() => togglePermission(p.id)}
                                                            style={{ marginTop: '3px', cursor: 'pointer', accentColor: '#4f46e5' }}
                                                        />
                                                        <div>
                                                            <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: checked ? '#111827' : '#4b5563' }}>{p.display_name}</span>
                                                            {p.description && <span style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>{p.description}</span>}
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </form>
            </div>
        </FigmaLayout>
    );
}
