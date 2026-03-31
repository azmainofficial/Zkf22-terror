import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { t, getLanguage, setLanguage } from '../Lang/translation';
import {
    Squares2X2Icon,
    FolderIcon,
    CubeIcon,
    UserCircleIcon,
    TruckIcon,
    UsersIcon,
    CurrencyDollarIcon,
    CreditCardIcon,
    DocumentTextIcon,
    Cog6ToothIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ArrowRightOnRectangleIcon,
    MagnifyingGlassIcon,
    Bars3Icon,
    ArrowsPointingOutIcon,
    ArrowsPointingInIcon,
    XMarkIcon,
    CheckCircleIcon,
    XCircleIcon,
    SparklesIcon,
    HomeIcon,
    BuildingOfficeIcon,
    CircleStackIcon,
    CreditCardIcon as PaymentIcon,
    IdentificationIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

const EXPANDED_W = 260;
const COLLAPSED_W = 80;

const styles = {
    glass: {
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #f1f5f9'
    },
    navItem: (active, collapsed) => ({
        display: 'flex',
        alignItems: 'center',
        padding: collapsed ? '12px 0' : '12px 16px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: '12px',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        marginBottom: '4px',
        background: active ? '#4f46e5' : 'transparent',
        color: active ? '#fff' : '#64748b',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
        boxSizing: 'border-box'
    })
};

function NavItem({ item, collapsed, onClose }) {
    const active = item.active;
    return (
        <Link 
            href={item.href} 
            onClick={onClose}
            style={styles.navItem(active, collapsed)}
            className={`sidebar-link ${active ? 'active' : ''}`}
        >
            <item.icon style={{ width: 22, height: 22, flexShrink: 0, marginRight: collapsed ? 0 : '12px' }} />
            {!collapsed && (
                <span style={{ fontSize: '0.9rem', fontWeight: active ? 700 : 600, whiteSpace: 'nowrap' }}>
                    {item.name}
                </span>
            )}
        </Link>
    );
}

export default function FigmaLayout({ children }) {
    const { auth, settings, flash } = usePage().props;
    const user = auth?.user;
    const { url } = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showFlash, setShowFlash] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowFlash(true);
            const tId = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(tId);
        }
    }, [flash]);

    const isActive = (path) => url === path || url.startsWith(path + '/');
    const sidebarWidth = collapsed ? COLLAPSED_W : EXPANDED_W;

    const navigation = [
        { title: 'Intelligence', items: [
            { name: 'Dashboard', icon: HomeIcon, href: route('dashboard'), active: isActive('/dashboard') },
            { name: 'Sales Performance', icon: ChartBarIcon, href: route('reports.index'), active: isActive('/reports') },
        ]},
        { title: 'Core Business', items: [
            { name: 'Active Projects', icon: FolderIcon, href: route('projects.index'), active: isActive('/projects') },
            { name: 'Client Network', icon: UserCircleIcon, href: route('clients.index'), active: isActive('/clients') },
            { name: 'Material Stock', icon: CubeIcon, href: route('inventory.index'), active: isActive('/inventory') },
        ]},
        { title: 'Operations', items: [
            { name: 'Payments', icon: PaymentIcon, href: route('payments.index'), active: isActive('/payments') },
            { name: 'Expense Log', icon: CurrencyDollarIcon, href: route('expenses.index'), active: isActive('/expenses') },
            { name: 'Supply Chain', icon: TruckIcon, href: route('suppliers.index'), active: isActive('/suppliers') },
        ]},
        { title: 'Human Resource', items: [
            { name: 'Staff Management', icon: UsersIcon, href: route('employees.index'), active: isActive('/employees') },
            { name: 'Attendance Hub', icon: IdentificationIcon, href: route('attendance.index'), active: isActive('/attendance') },
        ]}
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
            
            {/* Sidebar Desktop */}
            <aside className="desktop-sidebar" style={{
                width: `${sidebarWidth}px`, position: 'fixed', top: 0, left: 0, bottom: 0,
                background: '#fff', borderRight: '1px solid #f1f5f9', zIndex: 50,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', overflow: 'hidden'
            }}>
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem' }}>
                    {/* Logo Section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem', padding: '0 8px' }}>
                        <div style={{ width: '40px', height: '40px', background: '#4f46e5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <SparklesIcon style={{ width: 22, height: 22, color: '#fff' }} />
                        </div>
                        {!collapsed && (
                            <div style={{ overflow: 'hidden' }}>
                                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                                    {settings?.app_name || 'ZK BASE'}
                                </p>
                                <p style={{ fontSize: '0.65rem', fontWeight: 600, color: '#94a3b8', margin: 0 }}>ENTERPRISE v2.1</p>
                            </div>
                        )}
                    </div>

                    {/* Nav Items */}
                    <nav style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                        {navigation.map((section, idx) => (
                            <div key={idx} style={{ marginBottom: '1.5rem' }}>
                                {!collapsed && <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', paddingLeft: '8px' }}>{section.title}</p>}
                                {section.items.map((item, i) => (
                                    <NavItem key={i} item={item} collapsed={collapsed} />
                                ))}
                            </div>
                        ))}
                    </nav>

                    {/* Footer Actions */}
                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                        <button onClick={() => setCollapsed(!collapsed)} style={styles.navItem(false, collapsed)}>
                            <Bars3Icon style={{ width: 22, height: 22, marginRight: collapsed ? 0 : '12px' }} />
                            {!collapsed && <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Collapse View</span>}
                        </button>
                        <Link href={route('logout')} method="post" as="button" style={{ ...styles.navItem(false, collapsed), color: '#ef4444' }}>
                            <ArrowRightOnRectangleIcon style={{ width: 22, height: 22, marginRight: collapsed ? 0 : '12px' }} />
                            {!collapsed && <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>End Session</span>}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Drawer Overlay */}
            {mobileOpen && (
                <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} />
            )}
            
            {/* Mobile Sidebar */}
            <aside style={{ 
                position: 'fixed', top: 0, left: mobileOpen ? 0 : '-300px', bottom: 0, 
                width: '280px', background: '#fff', zIndex: 110, transition: 'all 0.3s ease',
                padding: '1.5rem', display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <p style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a' }}>Menu</p>
                    <button onClick={() => setMobileOpen(false)} style={{ background: '#f8fafc', border: 'none', padding: '8px', borderRadius: '10px' }}>
                        <XMarkIcon style={{ width: 20, height: 20, color: '#64748b' }} />
                    </button>
                </div>
                <nav style={{ flex: 1, overflowY: 'auto' }}>
                    {navigation.map((section, idx) => (
                        <div key={idx} style={{ marginBottom: '1.5rem' }}>
                            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '12px' }}>{section.title}</p>
                            {section.items.map((item, i) => (
                                <NavItem key={i} item={item} collapsed={false} onClose={() => setMobileOpen(false)} />
                            ))}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div style={{ 
                flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, 
                marginLeft: mobileOpen ? 0 : `${sidebarWidth}px`, 
                transition: 'margin-left 0.3s ease'
            }} className="main-wrapper">
                
                {/* Header */}
                <header style={{ 
                    position: 'sticky', top: 0, zIndex: 40, height: '72px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                    padding: '0 2rem', ...styles.glass 
                }} className="top-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <button onClick={() => setMobileOpen(true)} className="mobile-menu-btn" style={{ background: '#fff', border: '1px solid #f1f5f9', padding: '8px', borderRadius: '10px', color: '#4f46e5', cursor: 'pointer' }}>
                            <Bars3Icon style={{ width: 22, height: 22 }} />
                        </button>
                        <div style={{ position: 'relative', maxWidth: '400px', flex: 1 }} className="header-search">
                            <MagnifyingGlassIcon style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#94a3b8' }} />
                            <input type="text" placeholder="Global search..." style={{ width: '100%', padding: '10px 16px 10px 48px', background: '#f1f5f9', border: 'none', borderRadius: '12px', fontSize: '0.9rem', outline: 'none', fontWeight: 500 }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {/* Language Toggle */}
                        <button onClick={() => setLanguage(getLanguage() === 'en' ? 'bn' : 'en')} style={{ background: '#fff', border: '1px solid #f1f5f9', padding: '8px 16px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800, color: '#4f46e5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {getLanguage() === 'en' ? 'BN' : 'EN'}
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '1.5rem', borderLeft: '1px solid #f1f5f9' }}>
                            <div className="user-info-text" style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{user?.name}</p>
                                <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#4f46e5', margin: 0, textTransform: 'uppercase' }}>Administrator</p>
                            </div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem' }}>
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <main style={{ flex: 1, padding: '2rem' }}>
                    {children}
                </main>

                {/* Flash Messages */}
                {showFlash && (flash?.success || flash?.error) && (
                    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 200, padding: '1rem 1.5rem', borderRadius: '16px', background: '#fff', borderLeft: `4px solid ${flash.success ? '#10b981' : '#ef4444'}`, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {flash.success ? <CheckCircleIcon style={{ width: 24, height: 24, color: '#10b981' }} /> : <XCircleIcon style={{ width: 24, height: 24, color: '#ef4444' }} />}
                        <div>
                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{flash.success ? 'Success' : 'Error'}</p>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{flash.success || flash.error}</p>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @media (min-width: 1025px) { 
                    .mobile-menu-btn { display: none !important; }
                }
                @media (max-width: 1024px) {
                    .desktop-sidebar { display: none !important; }
                    .main-wrapper { margin-left: 0 !important; }
                    .top-header { padding: 0 1rem !important; }
                }
                @media (max-width: 640px) {
                    .header-search, .user-info-text { display: none !important; }
                }
                .sidebar-link:hover { background: #f8fafc !important; color: #4f46e5 !important; }
                .sidebar-link.active:hover { background: #4f46e5 !important; color: #fff !important; }
            `}</style>
        </div>
    );
}
