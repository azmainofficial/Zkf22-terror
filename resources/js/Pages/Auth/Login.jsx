import { useEffect, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    ChevronRight, 
    ShieldCheck, 
    ArrowRight,
    Loader2,
    LayoutGrid
} from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { settings } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    const inputStyle = (error) => ({
        width: '100%',
        height: '52px',
        padding: '0 1.25rem 0 3.25rem',
        borderRadius: '14px',
        border: `1.5px solid ${error ? '#fca5a5' : '#f1f5f9'}`,
        background: '#f8fafc',
        fontSize: '0.95rem',
        fontWeight: 650,
        outline: 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        color: '#1e1b4b',
    });

    const labelStyle = {
        fontSize: '0.75rem',
        fontWeight: 800,
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '0.75rem',
        display: 'block'
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Inter', sans-serif"
        }}>
            <Head title="Sign In" />

            <div style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '2rem',
                background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
            }}>
                <div style={{ 
                    width: '100%', 
                    maxWidth: '440px'
                }}>
                    {/* Brand Section */}
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{
                            width: '80px', height: '80px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            overflow: 'hidden'
                        }}>
                            {settings?.app_logo ? (
                                <img src={`/storage/${settings.app_logo}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Logo" />
                            ) : (
                                <div style={{ 
                                    width: '100%', height: '100%', borderRadius: '22px', 
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <LayoutGrid size={36} color="#fff" strokeWidth={2.5} />
                                </div>
                            )}
                        </div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#1e1b4b', margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>
                            {settings?.app_name || 'ZK Base'}
                        </h1>
                        <p style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600 }}>
                            Sign in to access your dashboard
                        </p>
                    </div>

                    <div style={{ 
                        background: '#fff',
                        padding: '2.5rem',
                        borderRadius: '28px',
                        border: '1.5px solid #f1f5f9',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.03)'
                    }}>
                        {status && (
                            <div style={{ 
                                padding: '1rem', background: '#f0fdf4', border: '1.5px solid #bbf7d0', 
                                borderRadius: '12px', color: '#16a34a', fontSize: '0.85rem', fontWeight: 700,
                                marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px'
                            }}>
                                <ShieldCheck size={18} />
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Email */}
                            <div>
                                <label style={labelStyle}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="name@company.com"
                                        style={inputStyle(errors.email)}
                                        onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.1)'; }}
                                        onBlur={e => { e.target.style.borderColor = errors.email ? '#fca5a5' : '#f1f5f9'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                                {errors.email && <p style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, marginTop: '8px' }}>{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <label style={labelStyle}>Password</label>
                                    {canResetPassword && (
                                        <Link href={route('password.request')} style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6366f1', textDecoration: 'none', marginBottom: '0.75rem' }}>
                                            Forgot?
                                        </Link>
                                    )}
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        style={inputStyle(errors.password)}
                                        onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.1)'; }}
                                        onBlur={e => { e.target.style.borderColor = errors.password ? '#fca5a5' : '#f1f5f9'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, marginTop: '8px' }}>{errors.password}</p>}
                            </div>

                            {/* Remember Me */}
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', width: 'fit-content' }}>
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                    style={{ width: '18px', height: '18px', borderRadius: '6px', accentColor: '#6366f1', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Stay signed in</span>
                            </label>

                            {/* Submit */}
                            <button 
                                disabled={processing}
                                style={{
                                    height: '54px', width: '100%',
                                    background: processing ? '#94a3b8' : '#1e1b4b',
                                    color: '#fff', border: 'none', borderRadius: '16px',
                                    fontSize: '1rem', fontWeight: 800, cursor: processing ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                    boxShadow: '0 10px 25px rgba(30,27,75,0.2)',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                                onMouseEnter={e => { if (!processing) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#312e81'; } }}
                                onMouseLeave={e => { if (!processing) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#1e1b4b'; } }}
                            >
                                {processing ? (
                                    <Loader2 style={{ animation: 'spin 1.5s linear infinite' }} />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Secure Infrastructure Access
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                input::placeholder { color: #cbd5e1; }
            `}</style>
        </div>
    );
}
