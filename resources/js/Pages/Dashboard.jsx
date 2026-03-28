import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link } from '@inertiajs/react';
import { t, getLanguage } from '../Lang/translation';
import {
    TrendingUp, Briefcase, Smartphone, History,
    ArrowUpRight, ArrowDownRight, Minus,
    Cpu, Signal, Activity, CheckCircle2, XCircle, AlertCircle,
    Users, Clock, CalendarDays, BarChart3, DollarSign,
    ChevronRight, RefreshCw,
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { useState } from 'react';

// ─── Color palette ────────────────────────────────────────────────
const PIE_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444'];

// ─── Tiny helpers ─────────────────────────────────────────────────
const card = {
    background: '#fff',
    borderRadius: '18px',
    border: '1px solid #f0eeff',
    boxShadow: '0 2px 16px rgba(99,102,241,0.06)',
    overflow: 'hidden',
};

function Badge({ value, trend }) {
    const cfg = {
        up:      { bg: '#f0fdf4', color: '#16a34a', Icon: ArrowUpRight },
        down:    { bg: '#fff1f2', color: '#dc2626', Icon: ArrowDownRight },
        neutral: { bg: '#f5f3ff', color: '#7c3aed', Icon: Minus },
    }[trend] ?? { bg: '#f5f3ff', color: '#7c3aed', Icon: Minus };
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '2px',
            background: cfg.bg, color: cfg.color,
            fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px',
            borderRadius: '20px',
        }}>
            <cfg.Icon size={11} />
            {value}
        </span>
    );
}

// ─── KPI Card ─────────────────────────────────────────────────────
function KpiCard({ title, value, subtitle, icon: Icon, iconBg, iconColor, change, trend }) {
    return (
        <div style={{ ...card, padding: '1.25rem 1.5rem', transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'default' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.14)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 16px rgba(99,102,241,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{
                    width: '42px', height: '42px', borderRadius: '12px',
                    background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Icon size={20} color={iconColor} />
                </div>
                <Badge value={change} trend={trend} />
            </div>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
                {title}
            </p>
            <p style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1e1b4b', margin: 0, lineHeight: 1.1 }}>{value}</p>
            {subtitle && (
                <p style={{ fontSize: '0.72rem', color: '#a78bfa', marginTop: '4px', fontWeight: 500 }}>{subtitle}</p>
            )}
        </div>
    );
}

// ─── Section header ───────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle, action }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                    width: '34px', height: '34px', borderRadius: '10px',
                    background: 'linear-gradient(135deg,#ede9fe,#f5f3ff)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Icon size={17} color="#6366f1" />
                </div>
                <div>
                    <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{title}</p>
                    {subtitle && <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: 0, fontWeight: 500 }}>{subtitle}</p>}
                </div>
            </div>
            {action}
        </div>
    );
}

// ─── Device row ───────────────────────────────────────────────────
function DeviceRow({ device }) {
    const isOnline = new Date(device.last_seen_at) > new Date(Date.now() - 10 * 60000);
    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.75rem 1rem', borderRadius: '12px',
            background: '#fafafa', border: '1px solid #f3f4f6',
            transition: 'background 0.15s',
        }}
            onMouseEnter={e => e.currentTarget.style.background = '#f5f3ff'}
            onMouseLeave={e => e.currentTarget.style.background = '#fafafa'}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: isOnline ? '#f0fdf4' : '#f3f4f6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Cpu size={16} color={isOnline ? '#16a34a' : '#9ca3af'} />
                </div>
                <div>
                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e1b4b', margin: 0 }}>
                        {device.device_name || 'Terminal'}
                    </p>
                    <p style={{ fontSize: '0.68rem', color: '#9ca3af', margin: 0, fontFamily: 'monospace' }}>
                        {device.ip_address}
                    </p>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '3px',
                    fontSize: '0.68rem', fontWeight: 700,
                    color: isOnline ? '#16a34a' : '#9ca3af',
                    background: isOnline ? '#f0fdf4' : '#f3f4f6',
                    padding: '2px 8px', borderRadius: '20px',
                }}>
                    <Signal size={9} />
                    {isOnline ? 'Online' : 'Offline'}
                </span>
                <p style={{ fontSize: '0.65rem', color: '#d1d5db', margin: '3px 0 0', textAlign: 'right' }}>
                    {new Date(device.last_seen_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    );
}

// ─── Activity row ─────────────────────────────────────────────────
function ActivityRow({ activity }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.75rem 1rem', borderRadius: '12px',
            background: '#fafafa', border: '1px solid #f3f4f6',
            transition: 'background 0.15s',
        }}
            onMouseEnter={e => e.currentTarget.style.background = '#f5f3ff'}
            onMouseLeave={e => e.currentTarget.style.background = '#fafafa'}
        >
            <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg,#ede9fe,#f5f3ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
                <Activity size={15} color="#6366f1" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', margin: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span style={{ color: '#6366f1', fontWeight: 700 }}>{activity.user}</span>
                    {' '}{activity.action}
                </p>
                <p style={{ fontSize: '0.68rem', color: '#9ca3af', margin: '2px 0 0', fontWeight: 500 }}>
                    {activity.time}
                </p>
            </div>
        </div>
    );
}

// ─── Custom chart tooltip ─────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: '#fff', border: '1px solid #ede9fe', borderRadius: '12px',
            padding: '0.6rem 1rem', boxShadow: '0 4px 16px rgba(99,102,241,0.15)' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', margin: '0 0 4px', textTransform: 'uppercase' }}>{label}</p>
            <p style={{ fontSize: '1rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>
                ৳{Number(payload[0].value).toLocaleString()}
            </p>
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────
export default function Dashboard({ auth, stats, recentLogs, devices, recent_activity, project_status, revenue_trend }) {
    const now = new Date();
    const hour = now.getHours();
    
    const kpis = [
        {
            title: t('monthly_revenue'),
            value: `৳${(stats.monthly_revenue || 0).toLocaleString()}`,
            subtitle: t('total_income'),
            icon: DollarSign,
            iconBg: '#f0fdf4', iconColor: '#16a34a',
            change: stats.revenue_change || '0%',
            trend: stats.revenue_change?.startsWith('+') ? 'up' : 'down',
        },
        {
            title: t('active_projects'),
            value: stats.total_projects ?? 0,
            subtitle: t('running_projects'),
            icon: Briefcase,
            iconBg: '#eff6ff', iconColor: '#3b82f6',
            change: stats.projects_change || '0%',
            trend: stats.projects_change?.startsWith('+') ? 'up' : 'down',
        },
        {
            title: t('devices_online'),
            value: stats.activeDevices ?? 0,
            subtitle: `${t('total_devices')}: ${stats.totalDevices ?? 0}`,
            icon: Smartphone,
            iconBg: '#f5f3ff', iconColor: '#6366f1',
            change: `${stats.totalDevices ?? 0} Total`,
            trend: 'neutral',
        },
        {
            title: t('logs_today'),
            value: stats.todayLogs ?? 0,
            subtitle: t('realtime_track'),
            icon: History,
            iconBg: '#fff7ed', iconColor: '#ea580c',
            change: 'Live',
            trend: 'up',
        },
    ];

    const getGreeting = () => {
        if (hour < 12) return t('greeting_morning');
        if (hour < 17) return t('greeting_afternoon');
        return t('greeting_evening');
    };

    return (
        <FigmaLayout>
            <Head title="Dashboard" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1400px', margin: '0 auto' }}>

                {/* ── Page header ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                            <BarChart3 size={20} color="#6366f1" />
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                {t('overview')}
                            </span>
                        </div>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e1b4b', margin: 0, lineHeight: 1.2 }}>
                            {getGreeting()}, {auth?.user?.name?.split(' ')[0]}
                        </h1>
                        <p style={{ fontSize: '0.82rem', color: '#9ca3af', margin: '4px 0 0', fontWeight: 500 }}>
                            {t('happening_today')} — {now.toLocaleDateString(getLanguage() === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    {/* Date badge */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: '#fff', border: '1px solid #ede9fe',
                        borderRadius: '12px', padding: '0.5rem 1rem',
                        boxShadow: '0 1px 6px rgba(99,102,241,0.07)',
                    }}>
                        <CalendarDays size={15} color="#8b5cf6" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4338ca' }}>
                            {now.toLocaleDateString(getLanguage() === 'bn' ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                </div>

                {/* ── KPI cards ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                    {kpis.map((k, i) => <KpiCard key={i} {...k} />)}
                </div>

                {/* ── Charts row ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }} className="charts-grid">
                    {/* Revenue trend */}
                    <div style={card}>
                        <div style={{ padding: '1.25rem 1.5rem 0.5rem' }}>
                            <SectionHeader
                                icon={TrendingUp}
                                title={t('revenue_trend')}
                                subtitle={t('monthly_payments')}
                            />
                        </div>
                        <div style={{ height: '260px', padding: '0 1rem 1.25rem' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenue_trend}>
                                    <defs>
                                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                                    <YAxis axisLine={false} tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                                    <Tooltip content={<ChartTooltip />} />
                                    <Area type="monotone" dataKey="revenue" stroke="#6366f1"
                                        strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: '#6366f1' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* ── Charts + Pie ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                    {/* Project status donut */}
                    <div style={card}>
                        <div style={{ padding: '1.25rem 1.5rem 0' }}>
                            <SectionHeader
                                icon={Briefcase}
                                title={t('project_status')}
                                subtitle={t('project_breakdown')}
                            />
                        </div>
                        <div style={{ height: '200px', position: 'relative', padding: '0 1rem' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={project_status} innerRadius={58} outerRadius={80}
                                        paddingAngle={4} dataKey="value" strokeWidth={0}>
                                        {project_status.map((_, i) => (
                                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '10px', border: '1px solid #ede9fe', fontSize: '0.78rem', fontWeight: 700 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Centre label */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                pointerEvents: 'none',
                            }}>
                                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b' }}>{stats.total_projects ?? 0}</span>
                                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Total</span>
                            </div>
                        </div>
                        {/* Legend */}
                        <div style={{ padding: '0.75rem 1.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {project_status.map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length], display: 'inline-block' }} />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>{item.name}</span>
                                    </div>
                                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e1b4b' }}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div style={card}>
                        <div style={{ padding: '1.25rem 1.5rem 1rem' }}>
                            <SectionHeader
                                icon={BarChart3}
                                title={t('quick_numbers')}
                                subtitle={t('key_figures')}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {[
                                    { label: t('staff_members'),     value: stats.total_employees ?? 0,     icon: Users,      color: '#6366f1', bg: '#f5f3ff' },
                                    { label: t('present_today'),     value: stats.todayLogs ?? 0,            icon: CheckCircle2, color: '#16a34a', bg: '#f0fdf4' },
                                    { label: t('pending_leaves'),    value: stats.pending_leaves ?? 0,      icon: Clock,      color: '#d97706', bg: '#fffbeb' },
                                    { label: t('devices_online'),    value: stats.activeDevices ?? 0,       icon: Signal,     color: '#3b82f6', bg: '#eff6ff' },
                                ].map((row, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '0.65rem 0.875rem', borderRadius: '12px',
                                        background: '#fafafa', border: '1px solid #f3f4f6',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: row.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <row.icon size={15} color={row.color} />
                                            </div>
                                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>{row.label}</span>
                                        </div>
                                        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1e1b4b' }}>{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Devices + Activity ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                    {/* Connected devices */}
                    <div style={card}>
                        <div style={{ padding: '1.25rem 1.5rem 1rem' }}>
                            <SectionHeader
                                icon={Cpu}
                                title={t('connected_devices')}
                                subtitle={t('biometric_terminals')}
                                action={
                                    <Link href={route('devices.index')} style={{
                                        display: 'flex', alignItems: 'center', gap: '3px',
                                        fontSize: '0.75rem', fontWeight: 700, color: '#6366f1',
                                        textDecoration: 'none',
                                    }}>
                                        {t('view_all')} <ChevronRight size={13} />
                                    </Link>
                                }
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {(devices || []).slice(0, 5).map(device => (
                                    <DeviceRow key={device.id} device={device} />
                                ))}
                                {(!devices || devices.length === 0) && (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', fontSize: '0.82rem' }}>
                                        <Cpu size={28} style={{ margin: '0 auto 0.5rem', opacity: 0.3 }} />
                                        <p style={{ margin: 0 }}>No devices found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent activity */}
                    <div style={card}>
                        <div style={{ padding: '1.25rem 1.5rem 1rem' }}>
                            <SectionHeader
                                icon={Activity}
                                title={t('recent_activity')}
                                subtitle={t('latest_actions')}
                                action={
                                    <Link href={route('audit-logs.index')} style={{
                                        display: 'flex', alignItems: 'center', gap: '3px',
                                        fontSize: '0.75rem', fontWeight: 700, color: '#6366f1',
                                        textDecoration: 'none',
                                    }}>
                                        {t('full_log')} <ChevronRight size={13} />
                                    </Link>
                                }
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {(recent_activity || []).slice(0, 6).map(activity => (
                                    <ActivityRow key={activity.id} activity={activity} />
                                ))}
                                {(!recent_activity || recent_activity.length === 0) && (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', fontSize: '0.82rem' }}>
                                        <Activity size={28} style={{ margin: '0 auto 0.5rem', opacity: 0.3 }} />
                                        <p style={{ margin: 0 }}>No recent activity</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <style>{`
                @media (min-width: 900px) {
                    .charts-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
                @media (max-width: 600px) {
                    h1 { font-size: 1.25rem !important; }
                }
            `}</style>
        </FigmaLayout>
    );
}
