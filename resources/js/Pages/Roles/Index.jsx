import React, { useState, useEffect, useRef } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { 
    Shield, 
    Users, 
    Plus, 
    Edit, 
    Trash2, 
    Lock, 
    ShieldCheck, 
    Settings, 
    Smartphone, 
    History,
    Fingerprint,
    X,
    ChevronRight,
    Award,
    Search,
    Info,
    ExternalLink,
    Zap,
    Layout,
    Activity
} from 'lucide-react';
import Modal from '@/Components/Modal';

// ─── Shared styles from Inventory patterns ──────────────────────
const cardStyle = {
    background: '#fff',
    borderRadius: '16px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
    padding: '1rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    transition: 'all 0.2s ease-in-out'
};

const inputStyle = {
    width: '100%',
    height: '42px',
    padding: '0 1rem',
    borderRadius: '10px',
    border: '1.5px solid #ede9fe',
    background: '#f9f7ff',
    fontSize: '0.85rem',
    fontWeight: 600,
    outline: 'none',
    transition: 'all 0.2s',
    color: '#1e1b4b'
};

const onFocus = e => {
    e.target.style.borderColor = '#8b5cf6';
    e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)';
};

const onBlur = e => {
    e.target.style.borderColor = '#ede9fe';
    e.target.style.boxShadow = 'none';
};

const iconBtn = (bg, color) => ({
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: bg,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color,
    transition: 'all 0.2s'
});

export default function Index({ auth, roles }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const initialMount = useRef(true);

    const createForm = useForm({
        name: '',
        display_name: '',
        description: '',
    });

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('roles.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                createForm.reset();
            },
        });
    };

    const handleDelete = (role) => {
        if (role.is_system) {
            alert('Cannot modify core system roles.');
            return;
        }
        if (confirm(`Remove the "${role.display_name}" permissions tier? This will affect all assigned users.`)) {
            router.delete(route('roles.destroy', role.id));
        }
    };

    const filteredRoles = roles.filter(r => 
        r.display_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const statCards = [
        { label: 'Total Tiers', value: roles.length, icon: Shield, bg: '#f5f3ff', color: '#6366f1' },
        { label: 'System Tiers', value: roles.filter(r => r.is_system).length, icon: Lock, bg: '#fffbeb', color: '#d97706' },
        { label: 'Active Users', value: roles.reduce((acc, r) => acc + (r.users_count || 0), 0), icon: Users, bg: '#f0fdf4', color: '#16a34a' },
    ];

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Access Tiers" />

            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '4rem' }}>
                
                {/* ── Header (Inventory Style) ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '3px' }}>
                            <ShieldCheck size={16} color="#a78bfa" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Security & Access</span>
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Permissions Matrix</h1>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '3px 0 0' }}>Manage organizational access tiers and rule boundaries</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.625rem' }}>
                        <button onClick={() => setShowCreateModal(true)} style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '0.6rem 1.25rem',
                            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                            border: 'none', borderRadius: '12px', color: '#fff',
                            fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                        }}>
                            <Plus size={16} /> Create New Tier
                        </button>
                    </div>
                </div>

                {/* ── Stats Row (Inventory Style) ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }}>
                    {statCards.map((s, i) => (
                        <div key={i} style={{ ...cardStyle, boxShadow: 'none', padding: '1.25rem', border: '1.5px solid #f0eeff' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <s.icon size={22} color={s.color} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>{s.label}</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b', margin: 0, lineHeight: 1.2 }}>{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Filter Row ── */}
                <div style={{ background: '#fff', borderRadius: '16px', border: '1.5px solid #f0eeff', padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                         <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                            <Search size={16} color="#a78bfa" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input 
                                type="text" 
                                placeholder="Search tiers by name or description..." 
                                style={{ ...inputStyle, paddingLeft: '2.75rem' }}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                        </div>
                        <div style={{ flex: 1 }}></div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                             {[
                                { name: 'Devices', icon: Smartphone, href: route('devices.index'), color: '#3b82f6' },
                                { name: 'Users', icon: Users, href: route('users.index'), color: '#10b981' },
                            ].map((item, idx) => (
                                <Link key={idx} href={item.href} style={{ textDecoration: 'none' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '10px', background: '#f5f3ff', color: '#6366f1', fontSize: '0.75rem', fontWeight: 800 }}>
                                        <item.icon size={14} /> {item.name}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Roles List (Row Pattern) ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {filteredRoles.map((role) => (
                        <div 
                            key={role.id} 
                            style={{ ...cardStyle, background: '#fff', cursor: 'default' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(99,102,241,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0eeff'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            {/* Icon */}
                            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: role.is_system ? '#fffbeb' : '#f5f3ff', color: role.is_system ? '#d97706' : '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1.5px solid ${role.is_system ? '#fef3c7' : '#ede9fe'}` }}>
                                {role.is_system ? <Award size={24} /> : <Fingerprint size={24} />}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 2, minWidth: '200px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <p style={{ fontSize: '1rem', fontWeight: 850, color: '#1e1b4b', margin: 0 }}>{role.display_name}</p>
                                    {role.is_system && (
                                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#d97706', background: '#fef3c7', padding: '2px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Lock size={10} strokeWidth={3} /> SYSTEM
                                        </span>
                                    )}
                                </div>
                                <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>
                                    {role.description || 'No specialized description for this access tier.'}
                                </p>
                            </div>

                            {/* Users Count */}
                            <div style={{ minWidth: '100px', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>Assigned</p>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '2px' }}>
                                    <Users size={14} color="#6366f1" />
                                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1e1b4b' }}>{role.users_count || 0}</span>
                                </div>
                            </div>

                            {/* Permissions Count */}
                            <div style={{ minWidth: '100px', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>Rules</p>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '2px' }}>
                                    <Shield size={14} color="#10b981" />
                                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1e1b4b' }}>{role.permissions_count || 0}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                                <button
                                    onClick={() => router.get(route('roles.show', role.id))}
                                    style={iconBtn('#f5f3ff', '#6366f1')}
                                    title="Manage Rules"
                                >
                                    <Settings size={18} />
                                </button>
                                {!role.is_system && (
                                    <button
                                        onClick={() => handleDelete(role)}
                                        style={iconBtn('#fff1f2', '#ef4444')}
                                        title="Delete Tier"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                                <div style={{ width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: '#cbd5e1' }}>
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredRoles.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '4rem 1rem', border: '2px dashed #ede9fe', borderRadius: '18px', background: '#faf9ff' }}>
                            <Shield size={40} color="#e0d9ff" style={{ margin: '0 auto 1.5rem' }} />
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1b4b', margin: '0 0 0.4rem' }}>No access tiers found</h3>
                            <p style={{ fontSize: '0.82rem', color: '#9ca3af', margin: 0 }}>Try adjusting your search query.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Role Modal */}
            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="md">
                <div style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2.5rem' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: '#fff7ed', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #ffedd5' }}>
                            <Shield size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Register Access Tier</h2>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, margin: '2px 0 0' }}>Establish a new organizational permission level.</p>
                        </div>
                    </div>

                    <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '0.05em' }}>Unique System Key (slug)</label>
                            <input type="text" value={createForm.data.name} onChange={e => createForm.setData('name', e.target.value)} placeholder="e.g. branch_manager" style={inputStyle} onFocus={onFocus} onBlur={onBlur} required />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', padding: '8px 12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                <Info size={12} color="#94a3b8" />
                                <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, margin: 0 }}>Lowercase with underscores only. This is used in code logic.</p>
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '0.05em' }}>Visual Label (Public)</label>
                            <input type="text" value={createForm.data.display_name} onChange={e => createForm.setData('display_name', e.target.value)} placeholder="e.g. Branch Manager" style={inputStyle} onFocus={onFocus} onBlur={onBlur} required />
                        </div>

                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '0.05em' }}>Operational Responsibility</label>
                            <textarea value={createForm.data.description} onChange={e => createForm.setData('description', e.target.value)} placeholder="Describe what actions users assigned to this tier are responsible for..." style={{ ...inputStyle, height: '120px', padding: '12px', resize: 'none' }} onFocus={onFocus} onBlur={onBlur} />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" disabled={createForm.processing} style={{ flex: 2, height: '56px', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 6px 20px rgba(30,27,75,0.2)', transition: 'all 0.2s' }}>
                                {createForm.processing ? 'Establishing Tier...' : 'Deploy Access Level'}
                            </button>
                            <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, height: '56px', background: '#fff', color: '#94a3b8', border: '1.5px solid #ede9fe', borderRadius: '16px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#faf9ff'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </FigmaLayout>
    );
}
