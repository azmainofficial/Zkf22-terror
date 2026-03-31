import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
// Finalizing Enterprise Hub
import { Head, Link } from '@inertiajs/react';
import { 
    Users, Briefcase, Calendar, ArrowUpRight, ArrowDownRight,
    TrendingUp, TrendingDown, DollarSign, Activity, FileText, 
    CreditCard, ChevronRight, Wallet, ShoppingCart, Target,
    Circle, History, Package, BarChart3, Presentation, Plus
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar, 
    Cell, PieChart, Pie
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const styles = {
    card: {
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #f1f5f9',
        padding: '24px',
        transition: 'all 0.2s ease',
    },
    statIcon: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    }
};

export default function Dashboard({ auth, sales = {}, project_status = [], recent_activity = [], today_date, current_time }) {
    const s = sales || {};
    const [currentTime, setCurrentTime] = useState(current_time);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { hour12: true }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const quickLinks = [
        { label: 'View Projects', icon: Briefcase, color: '#4f46e5', bg: '#f5f3ff', href: route('projects.index') },
        { label: 'Client List', icon: Users, color: '#10b981', bg: '#f0fdf4', href: route('clients.index') },
        { label: 'Payments', icon: CreditCard, color: '#f59e0b', bg: '#fffbeb', href: route('payments.index') },
        { label: 'Expenses', icon: Wallet, color: '#ef4444', bg: '#fef2f2', href: route('expenses.index') },
        { label: 'Reports', icon: FileText, color: '#8b5cf6', bg: '#f5f3ff', href: route('reports.index') },
    ];

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Business Dashboard" />

            <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '4rem' }}>
                
                {/* ── HEADER ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
                            Enterprise Hub
                        </h1>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500, margin: '4px 0 0' }}>
                            Business overview for {today_date} • {currentTime}
                        </p>
                    </div>
                </div>

                {/* ── KPI GRID ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <MiniStat icon={DollarSign} label="Monthly Sales" value={`৳${s.monthly_revenue?.toLocaleString()}`} trend={s.growth} color="#4f46e5" />
                    <MiniStat icon={ShoppingCart} label="Today's Sales" value={`৳${s.today_revenue?.toLocaleString()}`} trend={s.daily_growth} color="#10b981" />
                    <MiniStat icon={Briefcase} label="Acting Projects" value={project_status.reduce((a,b)=>a+b.value,0)} trend="Running" color="#f59e0b" />
                    <MiniStat icon={Activity} label="System Status" value="Online" trend="Stable" color="#8b5cf6" />
                </div>

                {/* ── CORE CONTENT ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    
                    {/* Sales Performance Chart */}
                    <div style={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Revenue Performance</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Tracking sales for the last 15 days</p>
                            </div>
                            <Link href={route('reports.index')} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#4f46e5', textDecoration: 'none' }}>
                                Full Report <ChevronRight size={14} />
                            </Link>
                        </div>
                        <div style={{ height: '350px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={s.daily_analytics || []}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 500, fill: '#64748b' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 500, fill: '#64748b' }} tickFormatter={(v) => `৳${v/1000}k`} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" dot={{ r: 3, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick Navigation & Projects */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* Quick Links */}
                        <div style={styles.card}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>Shortcuts</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                                {quickLinks.map((link, i) => (
                                    <Link key={i} href={link.href} className="shortcut-link" style={{ 
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', 
                                        padding: '16px 12px', background: '#f8fafc', borderRadius: '14px', 
                                        textDecoration: 'none', transition: 'all 0.2s ease', border: '1px solid #f1f5f9'
                                    }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: link.bg, color: link.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <link.icon size={20} />
                                        </div>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>{link.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Project Breakdown */}
                        <div style={styles.card}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>Project Status</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {project_status.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Circle size={8} fill={COLORS[i % COLORS.length]} color="transparent" />
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>{item.name}</span>
                                        </div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── SECONDARY ROW ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                    
                    {/* Activity Log */}
                    <div style={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <History size={18} color="#4f46e5" /> Recent Actions
                            </h3>
                            <Link href={route('audit-logs.index')} style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4f46e5', textDecoration: 'none' }}>View All History</Link>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#f1f5f9', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                            {recent_activity.map((log, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 20px', background: '#fff' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                                        {log.user.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, margin: 0 }}>{log.user} <span style={{ fontWeight: 500, color: '#64748b' }}>{log.action}</span></p>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, whiteSpace: 'nowrap' }}>{log.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sales Trend Bar Chart */}
                    <div style={styles.card}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BarChart3 size={18} color="#4f46e5" /> Year Progress
                        </h3>
                        <div style={{ height: '250px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={s.revenue_trend || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                                        { (s.revenue_trend || []).map((e, i) => <Cell key={i} fill={i === new Date().getMonth() ? '#4f46e5' : '#e2e8f0'} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

            </div>

            <style>{`
                .shortcut-link:hover { transform: translateY(-3px); background: #fff !important; box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.05); border-color: #4f46e5 !important; }
                .shortcut-link:hover span { color: #4f46e5 !important; }
            `}</style>
        </FigmaLayout>
    );
}

function MiniStat({ icon: Icon, label, value, trend, color }) {
    const isUp = trend?.startsWith('+');
    return (
        <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ ...styles.statIcon, background: `${color}10`, color: color }}>
                    <Icon size={24} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, background: isUp ? '#f0fdf4' : '#fef2f2', color: isUp ? '#10b981' : '#ef4444' }}>
                    {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trend}
                </div>
            </div>
            <div style={{ marginTop: '16px' }}>
                <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, margin: 0 }}>{label}</p>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0', letterSpacing: '-0.025em' }}>{value}</h4>
            </div>
        </div>
    );
}
