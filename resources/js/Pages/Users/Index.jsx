import React, { useState, useRef, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { 
    Users as UsersIcon, Plus, Edit, Trash2, Shield, Search, Filter, 
    Mail, User, ShieldCheck, UserPlus, X, LogIn, Key, Activity, 
    ShieldAlert, ChevronRight, Save, Loader2, KeyRound
} from 'lucide-react';
import Modal from '@/Components/Modal';

// ─── Shared styles from Inventory patterns ──────────────────────
const card = {
    background: '#fff', 
    borderRadius: '16px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
};

const onFocus = e => { 
    e.target.style.borderColor = '#8b5cf6'; 
    e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; 
};

const onBlur = e => { 
    e.target.style.borderColor = '#ede9fe'; 
    e.target.style.boxShadow = 'none'; 
};

const inputStyle = {
    width: '100%',
    height: '46px',
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

const labelStyle = {
    fontSize: '0.68rem',
    fontWeight: 800,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    display: 'block',
    marginBottom: '6px',
    paddingLeft: '2px'
};

const iconBtn = (bg, color) => ({
    width: '32px', height: '32px', borderRadius: '8px',
    background: bg, border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color,
    transition: 'all 0.2s'
});

const getRoleBadge = (role) => {
    const name = role.toLowerCase();
    if (name.includes('admin')) return { label: 'Administrator', bg: '#f0fdf4', color: '#16a34a', icon: ShieldCheck };
    if (name.includes('manager')) return { label: 'Operation Lead', bg: '#eff6ff', color: '#3b82f6', icon: Activity };
    return { label: 'Standard User', bg: '#f8fafc', color: '#64748b', icon: User };
};

export default function Index({ auth, users, roles, filters }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedRole, setSelectedRole] = useState(filters.role || '');
    const initialMount = useRef(true);

    const createForm = useForm({
        name: '', email: '', password: '', password_confirmation: '', roles: [],
    });

    useEffect(() => {
        if (initialMount.current) { initialMount.current = false; return; }
        const timer = setTimeout(() => {
            router.get(route('users.index'), { search: searchTerm, role: selectedRole }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, selectedRole]);

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('users.store'), {
            onSuccess: () => { setShowCreateModal(false); createForm.reset(); },
        });
    };

    const handleDelete = (user) => {
        if (confirm(`Are you completely sure you want to delete ${user.name}? They will lose all access.`)) {
            router.delete(route('users.destroy', user.id), { preserveScroll: true });
        }
    };

    const statCards = [
        { label: 'System Access', value: users.total || 0, icon: UsersIcon, bg: '#f5f3ff', color: '#6366f1' },
        { label: 'Security Officers', value: users.data.filter(u => u.roles.some(r => r.name.includes('admin'))).length, icon: ShieldCheck, bg: '#f0fdf4', color: '#16a34a' },
        { label: 'Active Sessions', value: 'High', icon: Activity, bg: '#fffbeb', color: '#d97706' },
        { label: 'Role Templates', value: roles.length, icon: KeyRound, bg: '#ecfdf5', color: '#10b981' },
    ];

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Access Management" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>

                {/* ── Header (Inventory Style) ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '3px' }}>
                            <Shield size={16} color="#8b5cf6" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Security Governance</span>
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>System User Registry</h1>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '3px 0 0' }}>Manage login permissions, administrative roles, and system access levels</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                        <button onClick={() => setShowCreateModal(true)} style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '0.6rem 1.25rem',
                            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                            border: 'none', borderRadius: '12px', color: '#fff',
                            fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                        }}>
                            <UserPlus size={16} /> Onboard Security User
                        </button>
                    </div>
                </div>

                {/* ── Stat cards (Inventory Style) ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
                    {statCards.map((s, i) => (
                        <div key={i} style={{ ...card, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <s.icon size={22} color={s.color} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>{s.label}</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b', margin: 0, lineHeight: 1.2 }}>{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Filters (Inventory Style) ── */}
                <div style={{ ...card, padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                            <Search size={16} color="#8b5cf6" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Scan by person's name or authorization email..."
                                style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 1rem 0.625rem 2.25rem', background: '#f9f7ff', border: '1.5px solid #ede9fe', borderRadius: '10px', fontSize: '0.85rem', color: '#1e1b4b', outline: 'none', fontWeight: 600 }}
                                onFocus={onFocus} onBlur={onBlur}
                            />
                        </div>
                        <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}
                            style={{ padding: '0.55rem 1rem', background: '#f9f7ff', border: '1.5px solid #ede9fe', borderRadius: '10px', fontSize: '0.82rem', color: '#6366f1', fontWeight: 600, cursor: 'pointer', outline: 'none', appearance: 'none', minWidth: '180px' }}>
                            <option value="">Filter by Privilege</option>
                            {roles.map(r => <option key={r.id} value={r.name}>{r.display_name}</option>)}
                        </select>
                        {(searchTerm || selectedRole) && (
                            <button onClick={() => { setSearchTerm(''); setSelectedRole(''); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.55rem 0.875rem', background: '#fff1f2', border: '1.5px solid #fecaca', borderRadius: '10px', color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                                <X size={13} /> Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* ── User List (Row Pattern) ── */}
                {users.data.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {users.data.map(user => {
                            const isSelf = user.id === auth.user.id;
                            return (
                                <div key={user.id} style={{
                                    ...card, padding: '1rem 1.5rem',
                                    display: 'flex', alignItems: 'center',
                                    gap: '1.5rem', flexWrap: 'wrap',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0eeff'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    {/* Avatar */}
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #f5f3ff, #e0e7ff)', border: '1.5px solid #ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 900, color: '#4338ca', fontSize: '1.1rem' }}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Profile Info */}
                                    <div style={{ width: '220px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <p style={{ fontSize: '0.95rem', fontWeight: 850, color: '#1e1b4b', margin: 0 }}>{user.name}</p>
                                            {isSelf && <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#6366f1', background: '#f5f3ff', border: '1.5px solid #e0e7ff', padding: '1px 6px', borderRadius: '6px', textTransform: 'uppercase' }}>Me</span>}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                            <Mail size={12} color="#94a3b8" />
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>{user.email}</span>
                                        </div>
                                    </div>

                                    {/* Rights Tiers */}
                                    <div style={{ flex: 2, minWidth: '240px' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {user.roles.map(r => {
                                                const cfg = getRoleBadge(r.name);
                                                return (
                                                    <span key={r.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', fontWeight: 850, color: cfg.color, background: cfg.bg, padding: '4px 10px', borderRadius: '20px', border: `1.5px solid ${cfg.color}15`, textTransform: 'uppercase' }}>
                                                        <cfg.icon size={11} /> {r.display_name}
                                                    </span>
                                                );
                                            })}
                                            {user.roles.length === 0 && <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700 }}>Privileges Revoked</span>}
                                        </div>
                                    </div>

                                    {/* Entry History */}
                                    <div style={{ width: '150px', textAlign: 'right' }}>
                                        <p style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>Authorized Since</p>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e1b4b', margin: '2px 0 0' }}>
                                            {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>

                                    {/* Actions Suite */}
                                    <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                                        <button onClick={() => router.get(route('users.show', user.id))} style={iconBtn('#f5f3ff', '#6366f1')} title="Modify Rights">
                                            <Edit size={16} />
                                        </button>
                                        {!isSelf && (
                                            <button onClick={() => handleDelete(user)} style={iconBtn('#fff1f2', '#ef4444')} title="Revoke Access">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                        <div style={{ width: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: '#cbd5e1' }}>
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '6rem 1rem', border: '2px dashed #ede9fe', borderRadius: '18px', background: '#faf9ff' }}>
                        <ShieldAlert size={48} color="#e0d9ff" style={{ margin: '0 auto 1.5rem' }} />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e1b4b', margin: '0 0 0.5rem' }}>No Access Logs Found</h3>
                        <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: '0 0 2rem' }}>No user profiles match your current security filters.</p>
                        <button onClick={() => setShowCreateModal(true)} style={{ 
                            display: 'inline-flex', alignItems: 'center', gap: '8px', 
                            padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', 
                            border: 'none', borderRadius: '14px', color: '#fff', 
                            fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                            boxShadow: '0 6px 16px rgba(99,102,241,0.25)'
                        }}>
                             Authorize First Person
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {users.links && users.links.length > 3 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', ...card, padding: '0.875rem 1.25rem' }}>
                        <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: 0, fontWeight: 600 }}>
                            Page <strong style={{ color: '#1e1b4b' }}>{users.current_page}</strong> of <strong style={{ color: '#1e1b4b' }}>{users.last_page}</strong>
                        </p>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {users.links.map((link, i) => link.url ? (
                                <Link key={i} href={link.url} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '36px', height: '36px', padding: '0 10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none', background: link.active ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#f5f3ff', color: link.active ? '#fff' : '#6366f1', transition: 'all 0.2s' }} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : (
                                <span key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '36px', height: '36px', padding: '0 10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, background: '#f8fafc', color: '#d1d5db' }} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* CREATE USER MODAL */}
            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="2xl">
                <div style={{ padding: '2rem', background: '#fff', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Authorize Personnel</h2>
                            <p style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, margin: '2px 0 0' }}>Create a security profile with specific login rights</p>
                        </div>
                        <button onClick={() => setShowCreateModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', padding: '8px', borderRadius: '50%' }}>
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            <div>
                                <label style={labelStyle}>Full Name</label>
                                <input type="text" value={createForm.data.name} onChange={e => createForm.setData('name', e.target.value)} placeholder="e.g. Administrator Jane" style={inputStyle} required onFocus={onFocus} onBlur={onBlur} />
                            </div>
                            <div>
                                <label style={labelStyle}>Access Email</label>
                                <input type="email" value={createForm.data.email} onChange={e => createForm.setData('email', e.target.value)} placeholder="jane@company.com" style={inputStyle} required onFocus={onFocus} onBlur={onBlur} />
                                {createForm.errors.email && <span style={{ color: '#ef4444', fontSize: '0.7rem', fontWeight: 800 }}>{createForm.errors.email}</span>}
                            </div>
                            <div>
                                <label style={labelStyle}>Login Password</label>
                                <input type="password" value={createForm.data.password} onChange={e => createForm.setData('password', e.target.value)} placeholder="••••••••" style={inputStyle} required onFocus={onFocus} onBlur={onBlur} />
                            </div>
                            <div>
                                <label style={labelStyle}>Confirm Password</label>
                                <input type="password" value={createForm.data.password_confirmation} onChange={e => createForm.setData('password_confirmation', e.target.value)} placeholder="••••••••" style={inputStyle} required onFocus={onFocus} onBlur={onBlur} />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Assign Privilege Tiers</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '1rem', background: '#f9f7ff', borderRadius: '12px', border: '1.5px solid #ede9fe' }}>
                                {roles.map(r => (
                                    <label key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', background: createForm.data.roles.includes(r.id) ? '#fff' : 'transparent', border: `1.5px solid ${createForm.data.roles.includes(r.id) ? '#8b5cf6' : 'transparent'}`, boxShadow: createForm.data.roles.includes(r.id) ? '0 2px 8px rgba(139,92,246,0.1)' : 'none' }}>
                                        <input type="checkbox" checked={createForm.data.roles.includes(r.id)} 
                                            onChange={e => {
                                                let arr = [...createForm.data.roles];
                                                if (e.target.checked) arr.push(r.id); else arr = arr.filter(id => id !== r.id);
                                                createForm.setData('roles', arr);
                                            }} style={{ accentColor: '#8b5cf6', width: '16px', height: '16px', cursor: 'pointer' }} />
                                        <span style={{ fontSize: '0.82rem', fontWeight: 850, color: createForm.data.roles.includes(r.id) ? '#1e1b4b' : '#94a3b8' }}>{r.display_name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, height: '48px', borderRadius: '12px', border: '1.5px solid #ede9fe', background: '#fff', color: '#64748b', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" disabled={createForm.processing} style={{ flex: 1, height: '48px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: '0.9rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(99,102,241,0.2)' }}>
                                {createForm.processing ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                Commite Security Profile
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <style>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </FigmaLayout>
    );
}
