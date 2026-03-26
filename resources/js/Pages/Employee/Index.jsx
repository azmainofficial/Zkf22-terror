import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Plus,
    Search,
    Users,
    User,
    Mail,
    Phone,
    Building2,
    MoreVertical,
    Eye,
    Pencil,
    Trash2,
    Filter,
    MapPin,
    Briefcase,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Calendar,
    FileText,
    History,
    Smartphone,
    Cpu
} from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/Components/ui/DropdownMenu';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/Components/ui/Tabs';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const AttendanceStatus = ({ status }) => {
    const styles = {
        present: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        absent: "bg-rose-500/10 text-rose-500 border-rose-500/20",
        late: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        on_leave: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    };

    return (
        <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border", styles[status] || "bg-slate-500/10 text-slate-500")}>
            {status === 'present' && <CheckCircle2 size={12} />}
            {status === 'absent' && <XCircle size={12} />}
            {status === 'late' && <Clock size={12} />}
            {status === 'on_leave' && <AlertCircle size={12} />}
            <span className="capitalize">{status?.replace('_', ' ')}</span>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        active: "bg-green-500/10 text-green-500 border-green-500/20",
        inactive: "bg-red-500/10 text-red-500 border-red-500/20",
        on_leave: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    };

    return (
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap", styles[status] || "bg-gray-500/10 text-gray-500")}>
            {status}
        </span>
    );
};

export default function Index({ auth, employees, attendances, filters, departments }) {
    const { url } = usePage();
    const [search, setSearch] = useState(filters.search || '');
    const [dept, setDept] = useState(filters.department || 'All');
    const [status, setStatus] = useState(filters.status || 'All');

    // Initialize tab from URL
    const getInitialTab = () => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('view') === 'attendance' ? 'attendance' : 'directory';
        }
        return 'directory';
    };
    const [currentTab, setCurrentTab] = useState(getInitialTab());

    // Sync state with URL (for Sidebar navigation)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const view = params.get('view') === 'attendance' ? 'attendance' : 'directory';
        if (view !== currentTab) setCurrentTab(view);
    }, [url]);

    // Handle filters and tab changes
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(route('employees.index'), {
                search,
                department: dept,
                status,
                view: currentTab === 'attendance' ? 'attendance' : undefined
            }, {
                preserveState: true,
                replace: true,
                preserveScroll: true
            });
        }, 500);
        return () => clearTimeout(timer);
    }, [search, dept, status, currentTab]);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this employee?')) {
            router.delete(route('employees.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <FigmaLayout>
            <Head title="Employee Pulse" />

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 shrink-0">
                            <Users size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
                                Employee Pulse 👥
                            </h1>
                            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Unified Directory & Attendance Intelligence</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={route('payroll.index')}>
                            <Button variant="outline" className="h-12 px-6 rounded-2xl border-gray-100 text-emerald-600 font-black shadow-sm transition-all hover:bg-emerald-50 gap-2 uppercase text-[10px] tracking-widest">
                                <FileText size={18} /> Payroll Control
                            </Button>
                        </Link>
                        <Link href={route('employees.create')}>
                            <Button className="h-12 px-6 rounded-2xl bg-[#22C55E] hover:bg-[#1ea34d] text-white font-black shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-95 gap-2 uppercase text-xs">
                                <Plus size={18} strokeWidth={3} /> Add New Talent
                            </Button>
                        </Link>
                    </div>
                </div>

                <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                    <TabsList className="bg-white/50 p-1.5 rounded-2xl border border-gray-100 mb-8 h-14 inline-flex shadow-sm">
                        <TabsTrigger value="directory" className="rounded-xl px-8 h-11 data-[state=active]:bg-[#22C55E] data-[state=active]:text-white data-[state=active]:shadow-lg gap-2 font-black uppercase text-[10px] tracking-wider transition-all">
                            <Users size={16} /> Directory
                        </TabsTrigger>
                        <TabsTrigger value="attendance" className="rounded-xl px-8 h-11 data-[state=active]:bg-[#22C55E] data-[state=active]:text-white data-[state=active]:shadow-lg gap-2 font-black uppercase text-[10px] tracking-wider transition-all">
                            <History size={16} /> Attendance
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="directory" className="space-y-8">
                        {/* Filters */}
                        <div className="bg-white p-4 rounded-[32px] shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#22C55E] transition-colors" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && router.get(route('employees.index'), { search, department: dept, status }, { preserveState: true, replace: true })}
                                    placeholder="Search by name, ID or email..."
                                    className="w-full bg-gray-50/50 border-none rounded-2xl py-3 pl-12 text-sm font-bold focus:ring-2 focus:ring-[#22C55E]/10"
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                                <button
                                    onClick={() => setDept('All')}
                                    className={cn("px-4 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                        dept === 'All' ? "bg-gray-900 text-white shadow-lg" : "bg-gray-50 text-gray-500 hover:bg-gray-100")}
                                >
                                    All Dept
                                </button>
                                {departments.map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setDept(d)}
                                        className={cn("px-4 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                            dept === d ? "bg-gray-900 text-white shadow-lg" : "bg-gray-50 text-gray-500 hover:bg-gray-100")}
                                    >
                                        {d}
                                    </button>
                                ))}
                                <Button onClick={() => router.get(route('employees.index'), { search, department: dept, status }, { preserveState: true, replace: true })} className="h-10 px-4 rounded-xl bg-[#22C55E] text-white">
                                    <Filter size={16} />
                                </Button>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {employees.data.map((emp) => (
                                <Card key={emp.id} className="group border-none shadow-sm rounded-[40px] overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2 bg-white flex flex-col">
                                    <CardContent className="p-8 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-20 h-20 rounded-[32px] bg-emerald-50 text-[#22C55E] flex items-center justify-center font-black text-2xl border border-emerald-100 overflow-hidden shadow-inner">
                                                {emp.avatar ? (
                                                    <img src={`/storage/${emp.avatar}`} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span>{emp.first_name?.[0]}{emp.last_name?.[0]}</span>
                                                )}
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl bg-gray-50 hover:bg-emerald-50 hover:text-[#22C55E] transition-all">
                                                        <MoreVertical size={20} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 border-none shadow-2xl">
                                                    <Link href={route('employees.show', emp.id)}>
                                                        <DropdownMenuItem className="rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2 py-3">
                                                            <Eye size={14} /> Profile
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <Link href={route('employees.edit', emp.id)}>
                                                        <DropdownMenuItem className="rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2 py-3 text-[#22C55E]">
                                                            <Pencil size={14} /> Edit Data
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuItem onClick={() => handleDelete(emp.id)} className="rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2 py-3 text-rose-500">
                                                        <Trash2 size={14} /> Terminate
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-[#22C55E] transition-colors">
                                                {emp.first_name} {emp.last_name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1.5 font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                                                <Briefcase size={10} strokeWidth={3} />
                                                {emp.designation || 'Staff'}
                                            </div>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <StatusBadge status={emp.status} />
                                                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-black uppercase tracking-wider">
                                                    {emp.department || 'HQ'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-dashed border-gray-100 space-y-3">
                                            <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                                                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                                    <Smartphone size={14} />
                                                </div>
                                                <span className="font-mono">{emp.employee_id}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                                                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                                    <Mail size={14} />
                                                </div>
                                                <span className="truncate">{emp.email || 'no-email@company.com'}</span>
                                            </div>
                                        </div>

                                        <Link href={route('employees.show', emp.id)} className="mt-8">
                                            <Button variant="outline" className="w-full h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest border-2 hover:bg-[#22C55E] hover:text-white hover:border-[#22C55E] transition-all">
                                                Intelligence Report
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="attendance" className="space-y-6">
                        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50/50">
                                            <tr>
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Employee</th>
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Date/Time</th>
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Terminal</th>
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Records</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {attendances.data.map((att) => (
                                                <tr key={att.id} className="group hover:bg-gray-50 transition-colors">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold overflow-hidden">
                                                                {att.employee?.avatar ? (
                                                                    <img src={`/storage/${att.employee.avatar}`} className="w-full h-full object-cover" />
                                                                ) : <User size={18} />}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-gray-900 leading-none">{att.employee?.first_name} {att.employee?.last_name}</p>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">{att.employee?.employee_id}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <p className="text-sm font-bold text-gray-700">{new Date(att.date).toLocaleDateString()}</p>
                                                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Clock In: {att.check_in || '--:--'}</p>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <AttendanceStatus status={att.status} />
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-2">
                                                            <Cpu size={14} className="text-gray-400" />
                                                            <span className="text-xs font-bold text-gray-600">BioTerminal #1</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase text-[#22C55E]">Details</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </FigmaLayout>
    );
}
