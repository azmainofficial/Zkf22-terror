import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
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
    ChartBarIcon,
    BanknotesIcon,
    TagIcon,
    AdjustmentsHorizontalIcon,
    TableCellsIcon,
    BellIcon,
    CheckIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

const EXPANDED_W = 260;
const COLLAPSED_W = 80;

const styles = {
    glass: {
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #f1f5f9'
    },
    navItemBase: (active, collapsed) => ({
        display: 'flex',
        alignItems: 'center',
        padding: collapsed ? '12px 0' : '10px 16px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: '12px',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        marginBottom: '2px',
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
    const [isOpen, setIsOpen] = useState(item.expanded || (item.children && item.children.some(c => c.active)));

    if (item.children) {
        return (
            <div style={{ marginBottom: '4px' }}>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    style={styles.navItemBase(active && !isOpen, collapsed)}
                    className={`sidebar-link ${active ? 'active' : ''}`}
                >
                    <item.icon style={{ width: 22, height: 22, flexShrink: 0, marginRight: collapsed ? 0 : '12px' }} />
                    {!collapsed && (
                        <>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, flex: 1, textAlign: 'left' }}>{item.name}</span>
                            {isOpen ? <ChevronUpIcon style={{ width: 14, height: 14 }} /> : <ChevronDownIcon style={{ width: 14, height: 14 }} />}
                        </>
                    )}
                </button>
                {isOpen && !collapsed && (
                    <div style={{ marginLeft: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px', borderLeft: '1.5px solid #f1f5f9', paddingLeft: '8px' }}>
                        {item.children.map((sub, i) => (
                            <Link key={i} href={sub.href} onClick={onClose} style={{
                                padding: '8px 12px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: sub.active ? 700 : 500,
                                color: sub.active ? '#4f46e5' : '#94a3b8', textDecoration: 'none', background: sub.active ? '#f5f3ff' : 'transparent'
                            }}>
                                {sub.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link href={item.href} onClick={onClose} style={styles.navItemBase(active, collapsed)} className={`sidebar-link ${active ? 'active' : ''}`}>
            <item.icon style={{ width: 22, height: 22, flexShrink: 0, marginRight: collapsed ? 0 : '12px' }} />
            {!collapsed && <span style={{ fontSize: '0.9rem', fontWeight: active ? 700 : 600 }}>{item.name}</span>}
        </Link>
    );
}

export default function FigmaLayout({ children }) {
    const { auth, settings, flash } = usePage().props;
    const user = auth?.user;
    const { url } = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [showFlash, setShowFlash] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);

    const notifications = auth?.notifications || [];
    const unreadCount = auth?.unread_count || 0;

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowFlash(true);
            const tId = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(tId);
        }
    }, [flash]);

    const isActive = (path) => url === path || url.startsWith(path + '/');
    const sidebarWidth = (collapsed && !mobileOpen) ? COLLAPSED_W : EXPANDED_W;

    const permissions = auth?.permissions || [];
    const isAdmin = auth?.is_admin || false;

    const can = (permission) => isAdmin || permissions.includes(permission);

    const navigation = [
        { title: 'Intelligence', items: [
            { name: t('Dashboard'), icon: HomeIcon, href: route('dashboard'), active: isActive('/dashboard'), show: can('view_dashboard') },
            { name: t('Reports section'), icon: ChartBarIcon, href: route('reports.index'), active: isActive('/reports'), show: can('view_audit_logs') },
        ].filter(i => i.show) },
        { title: 'Portfolio', items: [
            { name: t('Projects'), icon: FolderIcon, href: route('projects.index'), active: isActive('/projects'), show: can('view_projects') },
            { name: t('Clients'), icon: UserCircleIcon, href: route('clients.index'), active: isActive('/clients'), show: can('view_clients') },
            { name: t('Inventory'), icon: CubeIcon, href: route('inventory.index'), active: isActive('/inventory'), show: can('view_inventory') },
        ].filter(i => i.show) },
        { title: 'Finance', items: [
            { name: t('Payments'), icon: PaymentIcon, href: route('payments.index'), active: isActive('/payments'), show: can('view_payments') },
            { name: t('Money'), icon: CurrencyDollarIcon, href: route('expenses.index'), active: isActive('/expenses'), show: can('view_payroll') },
            { name: t('Suppliers'), icon: TruckIcon, href: route('suppliers.index'), active: isActive('/suppliers'), show: can('view_suppliers') },
        ].filter(i => i.show) },
        { title: 'Operations', items: [
            { 
                name: t('hr_team'), icon: UsersIcon, href: '#', 
                active: isActive('/employees') || isActive('/attendance') || isActive('/payroll') || isActive('/shifts') || isActive('/leaves'),
                show: can('view_employees') || can('view_attendance') || can('view_payroll'),
                children: [
                    { name: t('My Team'), href: route('employees.index'), active: isActive('/employees'), show: can('view_employees') },
                    { name: t('Attendance'), href: route('attendance.index'), active: isActive('/attendance'), show: can('view_attendance') },
                    { name: t('Payroll'), href: route('payroll.index'), active: isActive('/payroll'), show: can('view_payroll') },
                    { name: t('Schedule'), href: route('shifts.index'), active: isActive('/shifts'), show: can('view_attendance') },
                    { name: t('Leaves Holidays'), href: route('leaves.index'), active: isActive('/leaves'), show: can('view_attendance') },
                ].filter(c => c.show)
            },
            { 
                name: t('Settings'), icon: Cog6ToothIcon, href: '#', 
                active: isActive('/settings') || isActive('/brands') || isActive('/units') || isActive('/roles') || isActive('/users'),
                show: can('view_settings') || can('view_roles') || can('view_users'),
                children: [
                    { name: t('Users'), href: route('users.index'), active: isActive('/users'), show: can('view_users') },
                    { name: t('Roles'), href: route('roles.index'), active: isActive('/roles'), show: can('view_roles') },
                    { name: t('Main Settings'), href: route('settings.index'), active: isActive('/settings'), show: can('view_settings') },
                    { name: t('Brands'), href: route('brands.index'), active: isActive('/brands'), show: can('view_settings') },
                    { name: t('Units'), href: route('units.index'), active: isActive('/units'), show: can('view_settings') },
                ].filter(c => c.show)
            },
        ].filter(i => i.show) }
    ].filter(s => s.items.length > 0);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
            
            <aside className="desktop-sidebar" style={{
                width: `${sidebarWidth}px`, position: 'fixed', top: 0, left: 0, bottom: 0,
                background: '#fff', borderRight: '1px solid #f1f5f9', zIndex: 50,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', overflow: 'hidden'
            }}>
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '1.5rem 0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem', padding: '0 8px' }}>
                        <div style={{ width: '42px', height: '42px', background: settings?.app_logo ? 'transparent' : '#4f46e5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                            {settings?.app_logo ? (
                                <img src={`/storage/${settings.app_logo}`} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                <SparklesIcon style={{ width: 22, height: 22, color: '#fff' }} />
                            )}
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

                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                        <button onClick={() => setCollapsed(!collapsed)} style={styles.navItemBase(false, collapsed)}>
                            <Bars3Icon style={{ width: 22, height: 22, marginRight: collapsed ? 0 : '12px' }} />
                            {!collapsed && <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Collapse View</span>}
                        </button>
                        <Link href={route('logout')} method="post" as="button" style={{ ...styles.navItemBase(false, collapsed), color: '#ef4444' }}>
                            <ArrowRightOnRectangleIcon style={{ width: 22, height: 22, marginRight: collapsed ? 0 : '12px' }} />
                            {!collapsed && <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>End Session</span>}
                        </Link>
                    </div>
                </div>
            </aside>

            {mobileOpen && (
                <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} />
            )}
            
            <aside style={{ 
                position: 'fixed', top: 0, left: mobileOpen ? 0 : '-300px', bottom: 0, 
                width: '280px', background: '#fff', zIndex: 110, transition: 'all 0.3s ease',
                padding: '1.5rem', display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <p style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a' }}>Business Hub</p>
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

            <div style={{ 
                flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, 
                marginLeft: (collapsed ? COLLAPSED_W : EXPANDED_W), 
                transition: 'margin-left 0.3s ease'
            }} className="main-viewport">
                
                <header style={{ 
                    position: 'sticky', top: 0, zIndex: 40, height: '72px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                    padding: '0 2rem', ...styles.glass 
                }} className="top-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
                        <button onClick={() => setMobileOpen(true)} className="mobile-menu-btn" style={{ background: '#fff', border: '1px solid #f1f5f9', padding: '8px', borderRadius: '10px', color: '#4f46e5', cursor: 'pointer' }}>
                            <Bars3Icon style={{ width: 22, height: 22 }} />
                        </button>
                        <div style={{ position: 'relative', maxWidth: '380px', flex: 1 }} className="header-search">
                            <MagnifyingGlassIcon style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#94a3b8' }} />
                            <input type="text" placeholder="Global search node..." style={{ width: '100%', padding: '10px 16px 10px 48px', background: '#f1f5f9', border: 'none', borderRadius: '12px', fontSize: '0.9rem', outline: 'none', fontWeight: 500 }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ position: 'relative' }}>
                            <button 
                                onClick={() => setNotifOpen(!notifOpen)}
                                style={{ background: '#fff', border: '1px solid #f1f5f9', padding: '10px', borderRadius: '12px', color: unreadCount > 0 ? '#4f46e5' : '#94a3b8', cursor: 'pointer', position: 'relative' }}
                            >
                                <BellIcon style={{ width: 22, height: 22 }} />
                                {unreadCount > 0 && (
                                    <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '10px', border: '2px solid #fff' }}>
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {notifOpen && (
                                <div style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: '320px', background: '#fff', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', zIndex: 100, overflow: 'hidden' }}>
                                    <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>System Alerts</p>
                                        {unreadCount > 0 && (
                                            <button onClick={() => {
                                                setNotifOpen(false);
                                                router.post(route('notifications.read-all'), {}, { preserveScroll: true });
                                            }} style={{ background: 'none', border: 'none', fontSize: '0.7rem', fontWeight: 700, color: '#4f46e5', cursor: 'pointer' }}>Mark all read</button>
                                        )}
                                    </div>
                                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                        {notifications.length > 0 ? notifications.map(n => (
                                            <div 
                                                key={n.id} 
                                                onClick={() => {
                                                    setNotifOpen(false);
                                                    router.post(route('notifications.read', n.id), {}, { preserveScroll: true });
                                                }}
                                                style={{ 
                                                    padding: '12px 16px', borderBottom: '1px solid #f8fafc', background: n.read_at ? '#fff' : '#f5f3ff', 
                                                    transition: 'all 0.2s', cursor: 'pointer' 
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = n.read_at ? '#fff' : '#f5f3ff'}
                                            >
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: n.data.status === 'approved' ? '#ecfdf5' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: n.data.status === 'approved' ? '#10b981' : '#ef4444', flexShrink: 0 }}>
                                                        {n.data.status === 'approved' ? <CheckIcon style={{ width: 16, height: 16 }} /> : <XMarkIcon style={{ width: 16, height: 16 }} />}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: n.read_at ? 500 : 700, color: '#1e293b', lineHeight: 1.4 }}>{n.data.message}</p>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                                                            <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>{new Date(n.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                <EyeIcon style={{ width: 14, height: 14, color: '#4f46e5', opacity: 0.8 }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                                                <BellIcon style={{ width: 32, height: 32, margin: '0 auto 8px', opacity: 0.2 }} />
                                                <p style={{ fontSize: '0.8rem', fontWeight: 500 }}>No recent alerts</p>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '12px', textAlign: 'center', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                                        <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8' }}>Last 5 important updates</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button onClick={() => setLanguage(getLanguage() === 'en' ? 'bn' : 'en')} style={{ background: '#fff', border: '1px solid #f1f5f9', padding: '10px 16px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, color: '#4f46e5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {getLanguage() === 'en' ? 'BN' : 'EN'}
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '1.25rem', borderLeft: '1px solid #f1f5f9' }}>
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
                @media (max-width: 1024px) { .desktop-sidebar { display: none !important; } .main-viewport { margin-left: 0 !important; } .top-header { padding: 0 1rem !important; } .mobile-menu-btn { display: block !important; } }
                @media (min-width: 1025px) { .mobile-menu-btn { display: none !important; } }
                @media (max-width: 640px) { .header-search, .user-info-text { display: none !important; } }
                .sidebar-link:hover { background: #f8fafc !important; color: #4f46e5 !important; }
                .sidebar-link.active:hover { background: #4f46e5 !important; color: #fff !important; }
            `}</style>
        </div>
    );
}
