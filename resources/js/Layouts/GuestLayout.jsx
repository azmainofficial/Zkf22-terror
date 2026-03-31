import { Link, usePage } from '@inertiajs/react';

export default function Guest({ children }) {
    const { settings } = usePage().props;

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#f8fafc]">
            <div className="mb-8">
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '80px', height: '80px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                        {settings?.app_logo ? (
                            <img src={`/storage/${settings.app_logo}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Logo" />
                        ) : (
                            <div style={{ 
                                width: '100%', height: '100%', borderRadius: '22px', 
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 10px 25px rgba(99,102,241,0.15)'
                            }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4H10V10H4V4Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M14 4H20V10H14V4Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M4 14H10V20H4V14Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M14 14H20V20H14V14Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        )}
                    </div>
                </Link>
            </div>

            <div className="w-full sm:max-w-md px-10 py-10 bg-white border border-[#f1f5f9] shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden sm:rounded-[28px]">
                {children}
            </div>
        </div>
    );
}
