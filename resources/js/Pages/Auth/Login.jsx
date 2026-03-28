import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
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

    return (
        <>
            <Head title="Sign In" />

            {/* Full-page gradient background */}
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #6366f1 100%)',
                padding: '1rem',
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
            }}>

                {/* Decorative blobs */}
                <div style={{
                    position: 'fixed', top: '-80px', right: '-80px',
                    width: '320px', height: '320px', borderRadius: '50%',
                    background: 'rgba(99,102,241,0.3)', filter: 'blur(60px)', pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'fixed', bottom: '-80px', left: '-80px',
                    width: '280px', height: '280px', borderRadius: '50%',
                    background: 'rgba(167,139,250,0.25)', filter: 'blur(60px)', pointerEvents: 'none'
                }} />

                {/* Card */}
                <div style={{
                    width: '100%', maxWidth: '420px',
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: '24px',
                    padding: '2.5rem 2rem',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
                    position: 'relative',
                    zIndex: 1,
                }}>

                    {/* Logo + Title */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '18px',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1rem auto',
                            boxShadow: '0 8px 24px rgba(99,102,241,0.5)',
                        }}>
                            {/* Shield / lock icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32" height="32">
                                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h1 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
                            Welcome Back 👋
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.55)', marginTop: '0.4rem', fontSize: '0.92rem' }}>
                            Sign in to your account to continue
                        </p>
                    </div>

                    {/* Status message */}
                    {status && (
                        <div style={{
                            background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)',
                            borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.25rem',
                            color: '#86efac', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                            </svg>
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>

                        {/* Email Field */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label htmlFor="email" style={{
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                                    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                                    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                                </svg>
                                Your Email
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="you@example.com"
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        padding: '0.75rem 1rem 0.75rem 2.75rem',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: errors.email ? '1.5px solid #f87171' : '1.5px solid rgba(255,255,255,0.2)',
                                        borderRadius: '12px', color: '#fff', fontSize: '0.95rem',
                                        outline: 'none', transition: 'border-color 0.2s',
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#818cf8'}
                                    onBlur={e => e.target.style.borderColor = errors.email ? '#f87171' : 'rgba(255,255,255,0.2)'}
                                />
                                <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" width="16" height="16">
                                        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                                        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                                    </svg>
                                </span>
                            </div>
                            {errors.email && (
                                <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label htmlFor="password" style={{
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                                    <path fillRule="evenodd" d="M8 7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5a2 2 0 012-2V7zm5 0a3 3 0 00-6 0v2h6V7z" clipRule="evenodd" />
                                </svg>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter your password"
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        padding: '0.75rem 3rem 0.75rem 2.75rem',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: errors.password ? '1.5px solid #f87171' : '1.5px solid rgba(255,255,255,0.2)',
                                        borderRadius: '12px', color: '#fff', fontSize: '0.95rem',
                                        outline: 'none', transition: 'border-color 0.2s',
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#818cf8'}
                                    onBlur={e => e.target.style.borderColor = errors.password ? '#f87171' : 'rgba(255,255,255,0.2)'}
                                />
                                <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" width="16" height="16">
                                        <path fillRule="evenodd" d="M8 7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5a2 2 0 012-2V7zm5 0a3 3 0 00-6 0v2h6V7z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                {/* Toggle show/hide password */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                                        color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center',
                                    }}
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                                            <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                                            <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                                            <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" />
                                            <path d="M10.748 13.93l2.523 2.523a10.002 10.002 0 01-9.107-5.042 1.65 1.65 0 010-1.186 10.04 10.04 0 012.63-3.36l1.07 1.07a4 4 0 005.407 6.695 3.985 3.985 0 01-.664.536l-1.859-1.838z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember me + Forgot password */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    style={{ width: '16px', height: '16px', accentColor: '#818cf8', cursor: 'pointer' }}
                                />
                                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem' }}>Keep me signed in</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    style={{
                                        color: '#a5b4fc', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500,
                                        transition: 'color 0.2s',
                                    }}
                                    onMouseEnter={e => e.target.style.color = '#c7d2fe'}
                                    onMouseLeave={e => e.target.style.color = '#a5b4fc'}
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                width: '100%', padding: '0.85rem',
                                background: processing
                                    ? 'rgba(99,102,241,0.5)'
                                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                border: 'none', borderRadius: '12px',
                                color: '#fff', fontSize: '1rem', fontWeight: 700,
                                cursor: processing ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                boxShadow: processing ? 'none' : '0 4px 20px rgba(99,102,241,0.5)',
                                transition: 'all 0.2s',
                                letterSpacing: '0.3px',
                            }}
                            onMouseEnter={e => { if (!processing) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            {processing ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18" style={{ animation: 'spin 1s linear infinite' }}>
                                        <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="rgba(255,255,255,0.3)" />
                                        <path d="M12 2a10 10 0 0110 10" strokeWidth="4" strokeLinecap="round" />
                                    </svg>
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                                        <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
                                        <path fillRule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-1.068a.75.75 0 10-1.004-1.115l-2.5 2.53a.75.75 0 000 1.052l2.5 2.53a.75.75 0 101.004-1.115l-1.048-1.068h9.546A.75.75 0 0019 10z" clipRule="evenodd" />
                                    </svg>
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                        🔒 Your data is safe & encrypted
                    </p>
                </div>

                <style>{`
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    input::placeholder { color: rgba(255,255,255,0.3); }
                    input:-webkit-autofill {
                        -webkit-box-shadow: 0 0 0 30px rgba(99,102,241,0.2) inset !important;
                        -webkit-text-fill-color: white !important;
                    }
                `}</style>
            </div>
        </>
    );
}
