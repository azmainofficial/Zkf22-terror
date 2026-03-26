import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    Users,
    Briefcase,
    Clock,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical,
    Cpu,
    Smartphone,
    Signal,
    History,
    Bell,
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileText,
    Calendar
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const COLORS = ['#22C55E', '#3B82F6', '#6366f1', '#f59e0b'];

export default function Dashboard({ auth, stats, recentLogs, devices, recent_activity, project_status, revenue_trend }) {
    const { language } = useAppStore();
    const primaryGreen = '#22C55E';

    const kpis = [
        {
            title: 'Monthly Revenue',
            value: `৳${(stats.monthly_revenue || 0).toLocaleString()}`,
            icon: TrendingUp,
            change: stats.revenue_change || '0%',
            trend: stats.revenue_change?.startsWith('+') ? 'up' : 'down',
            color: 'text-emerald-500',
            bg: 'bg-emerald-50'
        },
        {
            title: 'Active Projects',
            value: stats.total_projects,
            icon: Briefcase,
            change: stats.projects_change || '0%',
            trend: stats.projects_change?.startsWith('+') ? 'up' : 'down',
            color: 'text-blue-500',
            bg: 'bg-blue-50'
        },
        {
            title: 'Online Terminals',
            value: stats.activeDevices,
            icon: Smartphone,
            change: `${stats.totalDevices} Total`,
            trend: 'neutral',
            color: 'text-purple-500',
            bg: 'bg-purple-50'
        },
        {
            title: 'Today Logs',
            value: stats.todayLogs,
            icon: History,
            change: 'Live tracking',
            trend: 'up',
            color: 'text-orange-500',
            bg: 'bg-orange-50'
        }
    ];

    return (
        <FigmaLayout>
            <Head title="Command Center" />

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
                            Command Center Dashboard 🚀
                        </h1>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Real-time Operations & Financial Intelligence</p>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {kpis.map((kpi, i) => (
                        <Card key={i} className="border-none shadow-sm rounded-[32px] overflow-hidden group hover:shadow-xl transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform", kpi.bg, kpi.color)}>
                                        <kpi.icon size={24} />
                                    </div>
                                    <div className={cn("text-[10px] font-black px-2 py-1 rounded-lg",
                                        kpi.trend === 'up' ? 'bg-emerald-50 text-emerald-600' :
                                            kpi.trend === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-600')}>
                                        {kpi.change}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{kpi.title}</p>
                                    <h3 className="text-2xl font-black text-gray-900 mt-1">{kpi.value}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Revenue Chart */}
                    <Card className="lg:col-span-2 border-none shadow-sm rounded-[32px] overflow-hidden">
                        <CardHeader className="p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-black uppercase text-gray-900">Revenue Overview</CardTitle>
                                    <CardDescription className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Monthly incoming payments performance</CardDescription>
                                </div>
                                <Activity size={20} className="text-emerald-500" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-8">
                            <div className="h-[300px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenue_trend}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={primaryGreen} stopOpacity={0.1} />
                                                <stop offset="95%" stopColor={primaryGreen} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }} />
                                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontWeight: 'bold' }} />
                                        <Area type="monotone" dataKey="revenue" stroke={primaryGreen} strokeWidth={3} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Project Status */}
                    <Card className="border-none shadow-sm rounded-[32px] overflow-hidden flex flex-col">
                        <CardHeader className="p-8">
                            <CardTitle className="text-lg font-black uppercase text-gray-900">Project Allocation</CardTitle>
                            <CardDescription className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Distribution by status</CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 flex-1 flex flex-col justify-center">
                            <div className="h-[200px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={project_status} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {project_status.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-2xl font-black text-gray-900">{stats.total_projects}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Total</span>
                                </div>
                            </div>
                            <div className="mt-8 space-y-3">
                                {project_status.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                            <span className="text-xs font-bold text-gray-500 uppercase">{item.name}</span>
                                        </div>
                                        <span className="text-xs font-black text-gray-900">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
                    {/* Hardware Status */}
                    <Card className="border-none shadow-sm rounded-[32px] overflow-hidden">
                        <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-black uppercase text-gray-900">Hardware Monitor</CardTitle>
                                <CardDescription className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Biometric Terminal Connectivity</CardDescription>
                            </div>
                            <Smartphone className="text-emerald-500" />
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid gap-4">
                                {devices.slice(0, 4).map((device) => (
                                    <DeviceItem key={device.id} device={device} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Operational Activity */}
                    <Card className="border-none shadow-sm rounded-[32px] overflow-hidden">
                        <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-black uppercase text-gray-900">System Activity</CardTitle>
                                <CardDescription className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Audit logs & administrative actions</CardDescription>
                            </div>
                            <History className="text-blue-500" />
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="space-y-4">
                                {recent_activity.map((activity) => (
                                    <ActivityLogItem key={activity.id} activity={activity} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </FigmaLayout>
    );
}

function DeviceItem({ device }) {
    const isOnline = new Date(device.last_seen_at) > new Date(Date.now() - 10 * 60000);
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:bg-gray-50/50 transition-all group">
            <div className="flex items-center gap-4">
                <div className={cn("p-2.5 rounded-xl transition-all", isOnline ? "bg-emerald-50 text-emerald-600 ring-4 ring-emerald-50/50" : "bg-gray-50 text-gray-400")}>
                    <Cpu size={18} />
                </div>
                <div>
                    <h4 className="text-sm font-black text-gray-900 tracking-tight group-hover:text-emerald-600 transition-colors uppercase">{device.device_name || 'Terminal'}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{device.ip_address}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={cn("text-[10px] font-black uppercase tracking-widest", isOnline ? "text-emerald-600" : "text-gray-400")}>
                    {isOnline ? 'Active' : 'Offline'}
                </p>
                <div className="flex items-center gap-1 mt-1">
                    <Signal size={10} className={isOnline ? "text-emerald-500" : "text-gray-300"} />
                    <span className="text-[9px] font-bold text-gray-400 uppercase">{new Date(device.last_seen_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
        </div>
    );
}

function ActivityLogItem({ activity }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-transparent hover:border-blue-200 hover:bg-white transition-all group">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                <Activity size={18} />
            </div>
            <div className="flex-1">
                <p className="text-sm font-black text-gray-900 tracking-tight">
                    <span className="text-blue-600">{activity.user}</span> {activity.action}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">{activity.time}</p>
            </div>
        </div>
    );
}
