import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { t, getLanguage, setLanguage } from '../Lang/translation';
import {
    Squares2X2Icon,
    UsersIcon,
    ClipboardDocumentCheckIcon,
    ClockIcon,
    Cog6ToothIcon,
    MagnifyingGlassIcon,
    BellIcon,
    Bars3Icon,
    XMarkIcon,
    ChartBarSquareIcon,
    TableCellsIcon,
    CpuChipIcon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    ArrowLeftOnRectangleIcon,
    ChevronRightIcon,
    RocketLaunchIcon,
    BuildingOffice2Icon,
    ShieldCheckIcon,
    ClipboardDocumentListIcon,
    UserGroupIcon,
    BriefcaseIcon,
    SparklesIcon,
    ViewColumnsIcon,
    BanknotesIcon,
    WrenchScrewdriverIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline';

const EXPANDED_W = 256;
const COLLAPSED_W = 72;

// ─── Nav structure ────────────────────────────────────────────────
const buildNav = () => [
    {
        title: t('main_menu'),
        sectionIcon: ViewColumnsIcon,
        items: [
            { name: t('home'),        label: t('daily_overview'),      icon: Squares2X2Icon,   href: route('dashboard'),         active: route().current('dashboard') },
            { name: t('projects'),    label: t('track_work'),       icon: RocketLaunchIcon, href: route('projects.index'),    active: route().current('projects.*') },
            { name: t('inventory'),   label: t('products_stock'),         icon: TableCellsIcon,   href: route('inventory.index'),   active: route().current('inventory.*') },
        ],
    },
    {
        title: t('hr_team'),
        sectionIcon: UserGroupIcon,
        items: [
            { name: t('my_team'),      label: t('all_staff'),      icon: UserGroupIcon,             href: route('employees.index'),   active: route().current('employees.*') },
            { name: t('attendance'),   label: t('who_is_in'),        icon: ClockIcon,                 href: route('attendance.index'),  active: route().current('attendance.index') },
            { name: t('shift_management'), label: t('work_hour_assignments'), icon: CalendarIcon,           href: route('shifts.index'),      active: route().current('shifts.*') },
            { name: t('payroll'),      label: t('salaries_payments'),    icon: CurrencyDollarIcon,        href: route('payroll.index'),     active: route().current('payroll.*') },
            { name: t('days_off'),     label: t('leave_time_off'),       icon: ClipboardDocumentListIcon, href: route('leaves.index'),      active: route().current('leaves.*') },
            { name: t('performance'),  label: t('staff_goals'),  icon: ChartBarSquareIcon,        href: route('performance.index'), active: route().current('performance.*') },
        ],
    },
    {
        title: t('money'),
        sectionIcon: BanknotesIcon,
        items: [
            { name: t('invoices'),  label: t('send_track_bills'),    icon: DocumentTextIcon,    href: route('invoices.index'),  active: route().current('invoices.*') },
            { name: t('payments'),  label: t('money_received'),    icon: BanknotesIcon,       href: route('payments.index'),  active: route().current('payments.*') },
            { name: t('expenses'),  label: t('what_spent'),   icon: BriefcaseIcon,       href: route('expenses.index'),  active: route().current('expenses.*') },
            { name: t('clients'),   label: t('customers'),        icon: BuildingOffice2Icon, href: route('clients.index'),   active: route().current('clients.*') },
        ],
    },
    {
        title: t('admin'),
        sectionIcon: WrenchScrewdriverIcon,
        items: [
            { name: t('devices'),     label: t('connected_hardware'),     icon: CpuChipIcon,                href: route('devices.index'),    active: route().current('devices.*') },
            { name: t('user_accounts'), label: t('who_can_login'),       icon: UsersIcon,                  href: route('users.index'),      active: route().current('users.*') },
            { name: t('roles'),       label: t('set_access'), icon: ShieldCheckIcon,           href: route('roles.index'),      active: route().current('roles.*') },
            { name: t('history'),     label: t('see_actions'), icon: ClipboardDocumentCheckIcon, href: route('audit-logs.index'), active: route().current('audit-logs.*') },
            { name: t('settings'),    label: t('configure_app'),      icon: Cog6ToothIcon,              href: route('settings.index'),   active: route().current('settings.*') },
        ],
    },
];

// ─── Desktop sidebar ──────────────────────────────────────────────
function DesktopSidebar({ user, collapsed, onToggle }) {
    const navSections = buildNav();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

            {/* Brand header */}
            <div style={{
                padding: collapsed ? '1.1rem 0' : '1.25rem 1.25rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'space-between',
                borderBottom: '1px solid #f0f0f5',
                transition: 'padding 0.3s',
                minHeight: '70px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : '0.6rem', overflow: 'hidden' }}>
                    {/* Logo bubble */}
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
                        flexShrink: 0,
                    }}>
                        <Squares2X2Icon style={{ width: 20, height: 20, color: '#fff' }} />
                    </div>
                    {/* Title — hidden when collapsed */}
                    <div style={{
                        opacity: collapsed ? 0 : 1,
                        maxWidth: collapsed ? 0 : '160px',
                        overflow: 'hidden',
                        transition: 'opacity 0.25s, max-width 0.3s',
                        whiteSpace: 'nowrap',
                    }}>
                        <p style={{ fontSize: '1rem', fontWeight: 800, color: '#1e1b4b', margin: 0, lineHeight: 1.2 }}>ZK Base</p>
                        <p style={{ fontSize: '0.68rem', color: '#a78bfa', margin: 0, fontWeight: 600 }}>{t('management_suite')}</p>
                    </div>
                </div>

                {/* Collapse toggle button */}
                {!collapsed && (
                    <button
                        onClick={onToggle}
                        title="Minimize sidebar"
                        style={{
                            background: '#f3f4f6', border: 'none', borderRadius: '8px',
                            padding: '6px', cursor: 'pointer', color: '#6366f1',
                            display: 'flex', alignItems: 'center', flexShrink: 0,
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#ede9fe'}
                        onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
                    >
                        <ChevronDoubleLeftIcon style={{ width: 16, height: 16 }} />
                    </button>
                )}
            </div>

            {/* Nav items */}
            <nav style={{
                flex: 1, overflowY: 'auto', overflowX: 'hidden',
                padding: collapsed ? '0.75rem 0.5rem' : '0.75rem 0.875rem',
                scrollbarWidth: 'thin', scrollbarColor: '#e5e7eb transparent',
                transition: 'padding 0.3s',
            }}>
                {navSections.map((section) => (
                    <div key={section.title} style={{ marginBottom: collapsed ? '0.75rem' : '1.25rem' }}>

                        {/* Section label — icon only when collapsed */}
                        <div style={{
                            display: 'flex', alignItems: 'center',
                            gap: '0.4rem',
                            padding: collapsed ? '0' : '0 0.4rem',
                            marginBottom: '0.35rem',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                        }}>
                            <section.sectionIcon style={{
                                width: collapsed ? 14 : 12,
                                height: collapsed ? 14 : 12,
                                color: '#a78bfa', flexShrink: 0,
                            }} />
                            <span style={{
                                fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af',
                                textTransform: 'uppercase', letterSpacing: '0.09em',
                                opacity: collapsed ? 0 : 1,
                                maxWidth: collapsed ? 0 : '200px',
                                overflow: 'hidden', whiteSpace: 'nowrap',
                                transition: 'opacity 0.2s, max-width 0.3s',
                            }}>
                                {section.title}
                            </span>
                        </div>

                        {/* Nav links */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {section.items.map((item) => (
                                <div key={item.name} style={{ position: 'relative' }} className="nav-item-wrap">
                                    <Link
                                        href={item.href}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: collapsed ? 0 : '0.75rem',
                                            padding: collapsed ? '0.45rem' : '0.6rem 0.75rem',
                                            borderRadius: '10px',
                                            textDecoration: 'none',
                                            transition: 'all 0.2s ease',
                                            justifyContent: collapsed ? 'center' : 'flex-start',
                                            background: item.active
                                                ? 'linear-gradient(135deg, #ede9fe, #f5f3ff)'
                                                : 'transparent',
                                            boxShadow: item.active ? '0 1px 6px rgba(99,102,241,0.12)' : 'none',
                                            border: item.active ? '1px solid #ddd6fe' : '1px solid transparent',
                                        }}
                                        onMouseEnter={e => {
                                            if (!item.active) {
                                                e.currentTarget.style.background = '#f9fafb';
                                                e.currentTarget.style.border = '1px solid #f3f4f6';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (!item.active) {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.border = '1px solid transparent';
                                            }
                                        }}
                                    >
                                        {/* Icon bubble */}
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '9px',
                                            flexShrink: 0,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: item.active
                                                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                                                : '#f3f4f6',
                                            boxShadow: item.active ? '0 3px 8px rgba(99,102,241,0.4)' : 'none',
                                            transition: 'all 0.15s',
                                        }}>
                                            <item.icon style={{ width: 16, height: 16, color: item.active ? '#fff' : '#6b7280' }} />
                                        </div>

                                        {/* Label text — hidden when collapsed */}
                                        <div style={{
                                            flex: 1, minWidth: 0,
                                            opacity: collapsed ? 0 : 1,
                                            maxWidth: collapsed ? 0 : '200px',
                                            overflow: 'hidden',
                                            transition: 'opacity 0.2s, max-width 0.3s',
                                        }}>
                                            <p style={{
                                                fontSize: '0.84rem', fontWeight: item.active ? 700 : 500,
                                                color: item.active ? '#4338ca' : '#374151',
                                                margin: 0, whiteSpace: 'nowrap',
                                            }}>
                                                {item.name}
                                            </p>
                                            <p style={{
                                                fontSize: '0.67rem',
                                                color: item.active ? '#7c3aed' : '#9ca3af',
                                                margin: 0, whiteSpace: 'nowrap',
                                            }}>
                                                {item.label}
                                            </p>
                                        </div>

                                        {item.active && !collapsed && (
                                            <ChevronRightIcon style={{ width: 13, height: 13, color: '#8b5cf6', flexShrink: 0 }} />
                                        )}
                                    </Link>

                                    {/* Tooltip shown only when collapsed */}
                                    {collapsed && (
                                        <div className="sidebar-tooltip">
                                            {item.name}
                                            <span>{item.label}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User footer */}
            <div style={{
                padding: collapsed ? '0.75rem 0' : '0.875rem 1rem',
                borderTop: '1px solid #f0f0f5',
                display: 'flex', alignItems: 'center',
                gap: collapsed ? 0 : '0.625rem',
                background: '#fafafa',
                justifyContent: collapsed ? 'center' : 'flex-start',
                transition: 'padding 0.3s',
            }}>
                {/* Avatar (doubles as collapse expand button when collapsed) */}
                <div
                    onClick={collapsed ? onToggle : undefined}
                    title={collapsed ? 'Expand sidebar' : user?.name}
                    style={{
                        width: '38px', height: '38px', borderRadius: '11px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 800, fontSize: '1rem', flexShrink: 0,
                        boxShadow: '0 3px 10px rgba(99,102,241,0.35)',
                        cursor: collapsed ? 'pointer' : 'default',
                        transition: 'transform 0.15s',
                        position: 'relative',
                    }}
                    onMouseEnter={e => { if (collapsed) e.currentTarget.style.transform = 'scale(1.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                    {collapsed
                        ? <ChevronDoubleRightIcon style={{ width: 16, height: 16 }} />
                        : (user?.name?.charAt(0)?.toUpperCase() ?? 'U')
                    }
                </div>

                {/* Name + email — hidden when collapsed */}
                <div style={{
                    flex: 1, minWidth: 0,
                    opacity: collapsed ? 0 : 1,
                    maxWidth: collapsed ? 0 : '200px',
                    overflow: 'hidden',
                    transition: 'opacity 0.2s, max-width 0.3s',
                }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user?.name}
                    </p>
                    <p style={{ fontSize: '0.67rem', color: '#9ca3af', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user?.email}
                    </p>
                </div>

                {!collapsed && (
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        title={t('logout')}
                        style={{
                            background: '#fff0f0', border: '1px solid #fecaca',
                            borderRadius: '9px', padding: '7px', cursor: 'pointer',
                            color: '#ef4444', display: 'flex', alignItems: 'center',
                            transition: 'all 0.15s', flexShrink: 0,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff0f0'; }}
                    >
                        <ArrowLeftOnRectangleIcon style={{ width: 17, height: 17 }} />
                    </Link>
                )}
            </div>
        </div>
    );
}

// ─── Mobile drawer sidebar ────────────────────────────────────────
function MobileSidebar({ user, onClose }) {
    const navSections = buildNav();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Brand */}
            <div style={{
                padding: '1.25rem 1.25rem 1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid #f0f0f5',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(99,102,241,0.4)', flexShrink: 0,
                    }}>
                        <Squares2X2Icon style={{ width: 20, height: 20, color: '#fff' }} />
                    </div>
                    <div>
                        <p style={{ fontSize: '1rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>ZK Base</p>
                        <p style={{ fontSize: '0.68rem', color: '#a78bfa', margin: 0, fontWeight: 600 }}>Management Suite</p>
                    </div>
                </div>
                <button onClick={onClose} style={{
                    background: '#f3f4f6', border: 'none', borderRadius: '8px',
                    padding: '6px', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center',
                }}>
                    <XMarkIcon style={{ width: 18, height: 18 }} />
                </button>
            </div>

            <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0.875rem',
                scrollbarWidth: 'thin', scrollbarColor: '#e5e7eb transparent' }}>
                {navSections.map((section) => (
                    <div key={section.title} style={{ marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0 0.4rem', marginBottom: '0.35rem' }}>
                            <section.sectionIcon style={{ width: 12, height: 12, color: '#a78bfa' }} />
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.09em' }}>
                                {section.title}
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {section.items.map((item) => (
                                <Link key={item.name} href={item.href} onClick={onClose}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        padding: '0.6rem 0.75rem', borderRadius: '10px', textDecoration: 'none',
                                        background: item.active ? 'linear-gradient(135deg, #ede9fe, #f5f3ff)' : 'transparent',
                                        border: item.active ? '1px solid #ddd6fe' : '1px solid transparent',
                                        boxShadow: item.active ? '0 1px 6px rgba(99,102,241,0.12)' : 'none',
                                    }}
                                    onMouseEnter={e => { if (!item.active) { e.currentTarget.style.background = '#f9fafb'; } }}
                                    onMouseLeave={e => { if (!item.active) { e.currentTarget.style.background = 'transparent'; } }}
                                >
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '9px', flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: item.active ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#f3f4f6',
                                        boxShadow: item.active ? '0 3px 8px rgba(99,102,241,0.4)' : 'none',
                                    }}>
                                        <item.icon style={{ width: 16, height: 16, color: item.active ? '#fff' : '#6b7280' }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: '0.84rem', fontWeight: item.active ? 700 : 500, color: item.active ? '#4338ca' : '#374151', margin: 0 }}>{item.name}</p>
                                        <p style={{ fontSize: '0.67rem', color: item.active ? '#7c3aed' : '#9ca3af', margin: 0 }}>{item.label}</p>
                                    </div>
                                    {item.active && <ChevronRightIcon style={{ width: 13, height: 13, color: '#8b5cf6' }} />}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div style={{
                padding: '0.875rem 1rem', borderTop: '1px solid #f0f0f5',
                display: 'flex', alignItems: 'center', gap: '0.625rem', background: '#fafafa',
            }}>
                <div style={{
                    width: '38px', height: '38px', borderRadius: '11px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, flexShrink: 0,
                    boxShadow: '0 3px 10px rgba(99,102,241,0.35)',
                }}>
                    {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                    <p style={{ fontSize: '0.67rem', color: '#9ca3af', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                </div>
                <Link href={route('logout')} method="post" as="button" title="Sign out"
                    style={{ background: '#fff0f0', border: '1px solid #fecaca', borderRadius: '9px', padding: '7px', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff0f0'; }}
                >
                    <ArrowLeftOnRectangleIcon style={{ width: 17, height: 17 }} />
                </Link>
            </div>
        </div>
    );
}

// ─── Main layout ──────────────────────────────────────────────────
export default function FigmaLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const sidebarWidth = collapsed ? COLLAPSED_W : EXPANDED_W;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter','Segoe UI',sans-serif", background: '#f8f9fc' }}>

            {/* ── Desktop sidebar ── */}
            <aside className="desktop-sidebar" style={{
                width: `${sidebarWidth}px`,
                flexShrink: 0,
                position: 'fixed', top: 0, left: 0, bottom: 0,
                background: '#ffffff',
                borderRight: '1px solid #ece9f8',
                boxShadow: '4px 0 24px rgba(99,102,241,0.06)',
                zIndex: 40,
                transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
                overflow: 'hidden',
                display: 'none', /* shown by media query */
            }}>
                <DesktopSidebar user={user} collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
            </aside>

            {/* ── Mobile drawer ── */}
            {mobileOpen && (
                <>
                    <div onClick={() => setMobileOpen(false)} style={{
                        position: 'fixed', inset: 0, zIndex: 50,
                        background: 'rgba(99,102,241,0.12)', backdropFilter: 'blur(6px)',
                    }} />
                    <aside style={{
                        position: 'fixed', top: 0, left: 0, bottom: 0,
                        width: '268px', zIndex: 60,
                        background: '#ffffff',
                        boxShadow: '8px 0 40px rgba(0,0,0,0.12)',
                        animation: 'slideIn 0.22s cubic-bezier(.4,0,.2,1)',
                    }}>
                        <MobileSidebar user={user} onClose={() => setMobileOpen(false)} />
                    </aside>
                </>
            )}

            {/* ── Main content ── */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0,
                transition: 'margin-left 0.3s cubic-bezier(.4,0,.2,1)',
            }} className="main-content">

                {/* Top bar */}
                <header style={{
                    position: 'sticky', top: 0, zIndex: 30,
                    height: '66px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 1.5rem',
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid #ece9f8',
                    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="hamburger-btn"
                            style={{
                                background: '#f3f4f6', border: 'none', cursor: 'pointer',
                                padding: '8px', borderRadius: '10px', color: '#6366f1',
                                display: 'flex', alignItems: 'center', transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#ede9fe'}
                            onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
                            aria-label="Open menu"
                        >
                            <Bars3Icon style={{ width: 21, height: 21 }} />
                        </button>

                        {/* Search */}
                        <div style={{ position: 'relative', maxWidth: '340px', flex: 1 }} className="search-wrap">
                            <MagnifyingGlassIcon style={{
                                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                                width: 15, height: 15, color: '#a78bfa',
                            }} />
                            <input
                                type="text"
                                placeholder={t('search_anything')}
                                style={{
                                    width: '100%', boxSizing: 'border-box',
                                    padding: '0.5rem 1rem 0.5rem 2.2rem',
                                    background: '#f5f3ff', border: '1.5px solid #ede9fe',
                                    borderRadius: '10px', fontSize: '0.85rem', color: '#1e1b4b',
                                    outline: 'none', transition: 'all 0.2s',
                                }}
                                onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.12)'; }}
                                onBlur={e => { e.target.style.borderColor = '#ede9fe'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button style={{
                            position: 'relative', background: '#f5f3ff',
                            border: '1px solid #ede9fe', cursor: 'pointer',
                            padding: '8px', borderRadius: '10px', color: '#8b5cf6',
                            display: 'flex', alignItems: 'center', transition: 'all 0.15s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#ede9fe'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#f5f3ff'; }}
                            aria-label="Notifications"
                        >
                            <BellIcon style={{ width: 19, height: 19 }} />
                            <span style={{
                                position: 'absolute', top: '7px', right: '7px',
                                width: '7px', height: '7px', borderRadius: '50%',
                                background: '#22c55e', border: '2px solid #fff',
                            }} />
                        </button>

                        {/* Language Switcher */}
                        <button onClick={() => setLanguage(getLanguage() === 'en' ? 'bn' : 'en')}
                        style={{
                            background: getLanguage() === 'en' ? '#f0fdf4' : '#eff6ff',
                            border: `1.5px solid ${getLanguage() === 'en' ? '#bbf7d0' : '#bfdbfe'}`,
                            padding: '0.5rem 0.825rem', borderRadius: '10px', cursor: 'pointer',
                            fontSize: '0.8rem', fontWeight: 850, color: getLanguage() === 'en' ? '#16a34a' : '#1d4ed8',
                            display: 'flex', alignItems: 'center', transition: 'all 0.2s',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            {getLanguage() === 'en' ? 'বাংলা' : 'English'}
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.75rem', borderLeft: '1px solid #ede9fe' }}>
                            <div className="user-name-col" style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e1b4b', margin: 0 }}>{user?.name}</p>
                                <p style={{ fontSize: '0.67rem', color: '#a78bfa', margin: 0, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em' }}>Admin</p>
                            </div>
                            <div style={{
                                width: '38px', height: '38px', borderRadius: '11px',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontWeight: 800, fontSize: '0.95rem', flexShrink: 0,
                                boxShadow: '0 3px 10px rgba(99,102,241,0.35)',
                            }}>
                                {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                            </div>
                        </div>
                    </div>
                </header>

                <main style={{ flex: 1, padding: '1.75rem 1.5rem' }}>
                    {children}
                </main>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                @keyframes slideIn {
                    from { transform: translateX(-100%); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                }

                @media (min-width: 1024px) {
                    .desktop-sidebar { display: block !important; }
                    .hamburger-btn   { display: none !important; }
                    .main-content    { margin-left: ${sidebarWidth}px !important; }
                }

                @media (max-width: 480px) {
                    .user-name-col { display: none !important; }
                    .search-wrap   { display: none !important; }
                }

                /* Tooltip for collapsed sidebar */
                .nav-item-wrap { position: relative; }
                .sidebar-tooltip {
                    position: absolute;
                    left: calc(100% + 10px);
                    top: 50%;
                    transform: translateY(-50%);
                    background: #1e1b4b;
                    color: #fff;
                    font-size: 0.78rem;
                    font-weight: 600;
                    padding: 0.35rem 0.7rem;
                    border-radius: 8px;
                    white-space: nowrap;
                    pointer-events: none;
                    opacity: 0;
                    z-index: 100;
                    transition: opacity 0.15s;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.15);
                    display: flex;
                    flex-direction: column;
                    gap: 1px;
                }
                .sidebar-tooltip span {
                    font-size: 0.66rem;
                    font-weight: 400;
                    color: rgba(255,255,255,0.55);
                }
                .sidebar-tooltip::before {
                    content: '';
                    position: absolute;
                    left: -5px; top: 50%;
                    transform: translateY(-50%);
                    border: 5px solid transparent;
                    border-right-color: #1e1b4b;
                    border-left: 0;
                }
                .nav-item-wrap:hover .sidebar-tooltip { opacity: 1; }

                nav::-webkit-scrollbar { width: 4px; }
                nav::-webkit-scrollbar-track { background: transparent; }
                nav::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
                nav::-webkit-scrollbar-thumb:hover { background: #d1d5db; }

                input::placeholder { color: #c4b5fd; }
            `}</style>
        </div>
    );
}
