import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { 
    User, Mail, Shield, CheckCircle2, ChevronLeft, Save, Loader2, KeyRound, Activity, AlertCircle, Trash2, Link as LinkIcon
} from 'lucide-react';

export default function Show({ auth, user, allRoles, allEmployees }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const form = useForm({
        name: user.name || '',
        email: user.email || '',
        employee_id: user.employee_id || '',
        password: '',
        password_confirmation: '',
        roles: user.roles.map(r => r.id),
    });

    const isSelf = auth.user.id === user.id;

    const submit = (e) => {
        e.preventDefault();
        form.put(route('users.update', user.id), {
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        if (confirm('Are you absolutely sure you want to completely revoke this person\'s system login?')) {
            setIsDeleting(true);
            router.delete(route('users.destroy', user.id));
        }
    };

    const toggleRole = (roleId) => {
        let rs = [...form.data.roles];
        if (rs.includes(roleId)) {
            rs = rs.filter(r => r !== roleId);
        } else {
            rs.push(roleId);
        }
        form.setData('roles', rs);
    };

    const card = { background: '#fff', borderRadius: '20px', border: '1px solid #f1f5f9', padding: '24px' };
    const label = { display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' };
    const input = { width: '100%', height: '48px', padding: '0 1rem', background: '#f8fafc', border: '1.5px solid #edf2f7', borderRadius: '12px', fontSize: '0.9rem', color: '#0f172a', fontWeight: 600, outline: 'none' };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Auth Profile: ${user.name}`} />

            <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '4rem' }}>
                {/* Header Strip */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onClick={() => window.history.back()} style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                Authentication Identity 
                                {isSelf && <span style={{ fontSize: '0.65rem', padding: '3px 8px', background: '#f5f3ff', color: '#4f46e5', borderRadius: '20px', fontWeight: 800, textTransform: 'uppercase' }}>Your Profile</span>}
                            </h1>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Global System Login & Permission Configuration</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '1.5rem', alignItems: 'start' }}>
                    
                    {/* Left Col: Main Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        <div style={card}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <User size={18} color="#4f46e5" /> Basic Information
                            </h2>
                            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={label}>Full Security Name</label>
                                        <div style={{ position: 'relative' }}>
                                            <input type="text" value={form.data.name} onChange={e => form.setData('name', e.target.value)} style={input} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={label}>Login Email</label>
                                        <div style={{ position: 'relative' }}>
                                            <input type="email" value={form.data.email} onChange={e => form.setData('email', e.target.value)} style={input} required />
                                            {form.errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, marginTop: '4px', display: 'block' }}>{form.errors.email}</span>}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                    <label style={label}><LinkIcon size={14} style={{ display: 'inline', marginBottom: '-2px', marginRight: '4px' }}/> Link To Employee Record</label>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 12px', fontWeight: 500 }}>
                                        By mapping this login account directly to an Employee Profile, they will automatically get access to their personal Shift and Payslip details on their Personal Dashboard.
                                    </p>
                                    <select value={form.data.employee_id} onChange={e => form.setData('employee_id', e.target.value)} style={{ ...input, background: '#fff' }}>
                                        <option value="">-- No Employee Profile Bound --</option>
                                        {allEmployees && allEmployees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name} ({emp.employee_id || 'No ID'})</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ padding: '1rem 0' }}>
                                    <div style={{ height: '1px', background: '#f1f5f9' }} />
                                </div>

                                <div>
                                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <KeyRound size={18} color="#f59e0b" /> Security Credentials
                                    </h2>
                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '-10px 0 1rem', fontWeight: 500 }}>Only fill these out if you intend to forcefully overwrite the user's current password.</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={label}>New Password</label>
                                            <input type="password" value={form.data.password} onChange={e => form.setData('password', e.target.value)} style={input} placeholder="Leave blank to keep unchanged" />
                                        </div>
                                        <div>
                                            <label style={label}>Confirm Password</label>
                                            <input type="password" value={form.data.password_confirmation} onChange={e => form.setData('password_confirmation', e.target.value)} style={input} placeholder="" />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                    <button type="submit" disabled={form.processing} style={{ padding: '0 2rem', height: '48px', borderRadius: '12px', background: '#4f46e5', color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.9rem', cursor: form.processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: form.processing ? 0.7 : 1 }}>
                                        {form.processing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        Initialize Changes
                                    </button>
                                </div>

                            </form>
                        </div>

                    </div>

                    {/* Right Col: Admin Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        <div style={card}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Shield size={18} color="#10b981" /> Assigned Tier Privileges
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {allRoles.map(role => {
                                    const active = form.data.roles.includes(role.id);
                                    return (
                                        <label key={role.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: active ? '#f0fdf4' : '#f8fafc', border: `1px solid ${active ? '#bbf7d0' : '#f1f5f9'}`, borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <input type="checkbox" checked={active} onChange={() => toggleRole(role.id)} style={{ accentColor: '#10b981', width: '16px', height: '16px', cursor: 'pointer' }} />
                                                <span style={{ fontSize: '0.85rem', fontWeight: active ? 800 : 600, color: active ? '#065f46' : '#475569' }}>{role.display_name}</span>
                                            </div>
                                            {active && <CheckCircle2 size={16} color="#10b981" />}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {!isSelf && (
                            <div style={{ ...card, background: '#fff1f2', border: '1px solid #fecaca' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#991b1b', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertCircle size={18} /> Danger Zone
                                </h3>
                                <p style={{ fontSize: '0.8rem', color: '#991b1b', opacity: 0.8, margin: '0 0 1.25rem', fontWeight: 500 }}>
                                    Permanently destroying this account will instantly lock them out of all connected ZK systems.
                                </p>
                                <button onClick={handleDelete} disabled={isDeleting} style={{ width: '100%', padding: '12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: isDeleting ? 'not-allowed' : 'pointer' }}>
                                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                    Revoke All Access
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            <style>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </FigmaLayout>
    );
}
