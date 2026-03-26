import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
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
    SunIcon,
    MoonIcon,
    ChartBarIcon,
    TableCellsIcon,
    CpuChipIcon
} from '@heroicons/react/24/outline';

const PRIMARY_GREEN = '#22C55E';

export default function FigmaLayout({ children }) {
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const navSections = [
        {
            title: 'Main',
            items: [
                { name: 'Dashboard', icon: Squares2X2Icon, href: route('dashboard'), active: route().current('dashboard') },
                { name: 'Projects', icon: ClipboardDocumentCheckIcon, href: route('projects.index'), active: route().current('projects.*') },
                { name: 'Inventory', icon: TableCellsIcon, href: route('inventory.index'), active: route().current('inventory.*') },
                { name: 'Automation', icon: ChartBarIcon, href: route('automation.index'), active: route().current('automation.*') },
            ]
        },
        {
            title: 'HR & Attendance',
            items: [
                { name: 'Employees', icon: UsersIcon, href: route('employees.index'), active: route().current('employees.*') },
                { name: 'Attendance', icon: ClockIcon, href: route('attendance.index'), active: route().current('attendance.index') },
                { name: 'Payroll', icon: ChartBarIcon, href: route('payroll.index'), active: route().current('payroll.*') },
                { name: 'Leaves', icon: ClipboardDocumentCheckIcon, href: route('leaves.index'), active: route().current('leaves.*') },
                { name: 'Performance', icon: ChartBarIcon, href: route('performance.index'), active: route().current('performance.*') },
            ]
        },
        {
            title: 'Finance',
            items: [
                { name: 'Invoices', icon: TableCellsIcon, href: route('invoices.index'), active: route().current('invoices.*') },
                { name: 'Payments', icon: TableCellsIcon, href: route('payments.index'), active: route().current('payments.*') },
                { name: 'Expenses', icon: TableCellsIcon, href: route('expenses.index'), active: route().current('expenses.*') },
                { name: 'Clients', icon: UsersIcon, href: route('clients.index'), active: route().current('clients.*') },
            ]
        },
        {
            title: 'System',
            items: [
                { name: 'Devices', icon: CpuChipIcon, href: route('devices.index'), active: route().current('devices.*') },
                { name: 'Users', icon: UsersIcon, href: route('users.index'), active: route().current('users.*') },
                { name: 'Roles', icon: Cog6ToothIcon, href: route('roles.index'), active: route().current('roles.*') },
                { name: 'Audit Logs', icon: ClipboardDocumentCheckIcon, href: route('audit-logs.index'), active: route().current('audit-logs.*') },
                { name: 'Settings', icon: Cog6ToothIcon, href: route('settings.index'), active: route().current('settings.*') },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#F3F4F6] flex font-sans text-[#111827]">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out border-r border-gray-200 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-8 pb-12">
                        <span className="text-2xl font-black italic tracking-tighter" style={{ color: PRIMARY_GREEN }}>
                            HR<span className="text-gray-900">Dashboard</span>
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-6 space-y-8 overflow-y-auto pb-8 custom-scrollbar">
                        {navSections.map((section) => (
                            <div key={section.title} className="space-y-2">
                                <p className="px-4 text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-4">{section.title}</p>
                                {section.items.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center space-x-4 px-4 py-2.5 rounded-2xl transition-all duration-200 group ${item.active
                                            ? 'bg-[#22C55E]/10 text-[#22C55E]'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <item.icon className={`w-5 h-5 transition-colors ${item.active ? 'text-[#22C55E]' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                        <span className="text-sm font-semibold">{item.name}</span>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </nav>

                    {/* Dark/Light Toggle */}
                    <div className="p-6 border-t border-gray-100">
                        <div className="bg-gray-100/50 p-1.5 rounded-2xl flex items-center">
                            <button
                                onClick={() => setIsDarkMode(false)}
                                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl transition-all ${!isDarkMode ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <SunIcon className="w-4 h-4" />
                                <span className="text-xs font-bold">Light</span>
                            </button>
                            <button
                                onClick={() => setIsDarkMode(true)}
                                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl transition-all ${isDarkMode ? 'bg-[#111827] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <MoonIcon className="w-4 h-4" />
                                <span className="text-xs font-bold">Dark</span>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
                {/* Header */}
                <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 md:px-8 bg-white/80 backdrop-blur-md border-b border-gray-100">
                    <div className="flex items-center flex-1 max-w-xl">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 mr-2 md:mr-4 text-gray-500 lg:hidden hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                        <div className="relative w-full group hidden sm:block">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#22C55E] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="w-full bg-gray-50/50 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#22C55E]/20 focus:bg-white transition-all placeholder:text-gray-400 font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 md:space-x-6">
                        <button className="relative p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all hidden sm:block">
                            <BellIcon className="w-6 h-6" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-[#22C55E] rounded-full ring-2 ring-white" />
                        </button>
                        <div className="flex items-center space-x-3 sm:border-l sm:border-gray-100 sm:pl-6 cursor-pointer group">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900 group-hover:text-[#22C55E] transition-colors">{auth.user.name}</p>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-tight">Administrator</p>
                            </div>
                            <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-gray-500 font-bold border-2 border-white shadow-sm overflow-hidden group-hover:border-[#22C55E]/20 transition-all text-sm">
                                {auth.user.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
