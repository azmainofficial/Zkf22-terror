import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head } from '@inertiajs/react';
import {
    UsersIcon,
    ArrowPathRoundedSquareIcon,
    UserPlusIcon,
    UserMinusIcon,
    ArrowUpRightIcon,
    EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';

const PRIMARY_GREEN = '#22C55E';

export default function Dashboard({ auth, stats, recentLogs, devices }) {
    return (
        <FigmaLayout>
            <Head title="Dashboard" />

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Greeting Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-gray-900">
                            Hi, {auth.user.name.split(' ')[0]} 👋
                        </h1>
                        <p className="text-sm text-gray-500 font-medium mt-1">Here is what happening with your terminals today.</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                        <button className="px-4 py-2 text-xs font-bold text-white rounded-xl shadow-lg shadow-emerald-200 border border-emerald-500 transition-all hover:scale-[1.02] active:scale-95" style={{ backgroundColor: PRIMARY_GREEN }}>
                            Export Report
                        </button>
                    </div>
                </div>

                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        label="Total Terminals"
                        value={stats.totalDevices}
                        change="+2"
                        isPositive={true}
                        icon={<UsersIcon className="w-6 h-6" />}
                        iconBg="bg-indigo-50"
                        iconText="text-indigo-600"
                    />
                    <StatCard
                        label="Online Now"
                        value={stats.activeDevices}
                        change="+5"
                        isPositive={true}
                        icon={<ArrowPathRoundedSquareIcon className="w-6 h-6" />}
                        iconBg="bg-emerald-50"
                        iconText="text-emerald-600"
                    />
                    <StatCard
                        label="Today Logs"
                        value={stats.todayLogs}
                        change="+12"
                        isPositive={true}
                        icon={<UserPlusIcon className="w-6 h-6" />}
                        iconBg="bg-amber-50"
                        iconText="text-amber-600"
                    />
                    <StatCard
                        label="Inactive"
                        value={stats.totalDevices - stats.activeDevices}
                        change="-1"
                        isPositive={false}
                        icon={<UserMinusIcon className="w-6 h-6" />}
                        iconBg="bg-rose-50"
                        iconText="text-rose-600"
                    />
                </div>

                {/* Charts Area Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Performance Line Chart Placeholder */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col min-h-[400px]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-black text-gray-900">Team Performance</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Activity Tracking</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100 text-[11px] font-bold text-gray-500">
                                    <span>Last 7 Days</span>
                                </span>
                                <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                                    <EllipsisHorizontalIcon className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-50/20 to-transparent pointer-events-none" />
                            <div className="text-center z-10">
                                <div className="p-4 bg-white rounded-2xl shadow-sm inline-block mb-3 border border-gray-50 transition-transform group-hover:scale-110">
                                    <ArrowUpRightIcon className="w-6 h-6 text-[#22C55E]" />
                                </div>
                                <p className="text-sm font-bold text-gray-400 group-hover:text-gray-600 transition-colors">Activity Data Visualized Here</p>
                            </div>
                        </div>
                    </div>

                    {/* Employee Status Chart Placeholder */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col min-h-[400px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-gray-900">Summary</h3>
                            <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400">
                                <EllipsisHorizontalIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="relative w-48 h-48 mb-8">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="96" cy="96" r="88" fill="transparent" stroke="#F3F4F6" strokeWidth="16" />
                                    <circle cx="96" cy="96" r="88" fill="transparent" stroke={PRIMARY_GREEN} strokeWidth="16" strokeDasharray="552.9" strokeDashoffset="138.2" strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-gray-900">{stats.activeDevices}</span>
                                    <span className="text-xs font-bold text-gray-400 uppercase">Online</span>
                                </div>
                            </div>
                            <div className="space-y-4 w-full">
                                <LegendItem label="Operational" count={stats.activeDevices} color="bg-[#22C55E]" />
                                <LegendItem label="Inactive" count={stats.totalDevices - stats.activeDevices} color="bg-gray-200" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Recent Activity & New Joins */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-gray-900">Recent Activity</h3>
                            <button className="text-sm font-bold text-[#22C55E] hover:underline underline-offset-4">See All</button>
                        </div>
                        <div className="space-y-4">
                            {recentLogs.slice(0, 5).map((log) => (
                                <ActivityItem key={log.id} log={log} />
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-gray-900">Terminals Status</h3>
                            <button className="text-sm font-bold text-[#22C55E] hover:underline underline-offset-4">Monitor</button>
                        </div>
                        <div className="space-y-4">
                            {devices.slice(0, 5).map((device) => (
                                <DeviceStatusItem key={device.id} device={device} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </FigmaLayout>
    );
}

function StatCard({ label, value, change, isPositive, icon, iconBg, iconText }) {
    return (
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 relative group overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
            <div className={`p-3 rounded-2xl ${iconBg} ${iconText} w-fit transition-transform group-hover:scale-110`}>
                {icon}
            </div>
            <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                <div className="flex items-end justify-between mt-2">
                    <span className="text-3xl font-black text-gray-900">{value}</span>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {change}
                    </span>
                </div>
            </div>
        </div>
    );
}

function LegendItem({ label, count, color }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors uppercase tracking-tight">{label}</span>
            </div>
            <span className="text-sm font-black text-gray-900">{count}</span>
        </div>
    );
}

function ActivityItem({ log }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:bg-gray-50/50 transition-all group">
            <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-black text-xs group-hover:bg-[#22C55E]/10 group-hover:text-[#22C55E] transition-all">
                    ID
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900 tracking-tight transition-colors">
                        {log.employee ? `${log.employee.first_name} ${log.employee.last_name || ''}` : `#${log.user_id}`}
                    </p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">
                        {log.device?.device_name || 'Terminal'}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-xs font-black text-gray-900">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-[10px] font-black text-emerald-600 uppercase mt-0.5">Success</p>
            </div>
        </div>
    );
}

function DeviceStatusItem({ device }) {
    const isOnline = new Date(device.last_seen_at) > new Date(Date.now() - 10 * 60000);
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:bg-gray-50/50 transition-all group">
            <div className="flex items-center space-x-4">
                <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 ring-4 ring-emerald-50' : 'bg-gray-300'}`} />
                <div>
                    <p className="text-sm font-bold text-gray-900 tracking-tight group-hover:text-[#22C55E] transition-colors">
                        {device.device_name || 'ZKTeco'}
                    </p>
                    <p className="text-[11px] font-bold text-gray-400 tracking-widest truncate max-w-[120px]">
                        {device.ip_address}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p className={`text-[11px] font-black uppercase tracking-widest ${isOnline ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                </p>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5">
                    {new Date(device.last_seen_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    );
}
