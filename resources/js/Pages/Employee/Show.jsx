import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Building2,
    Calendar,
    MapPin,
    Clock,
    Pencil,
    Coins,
    Plus,
    Trash2,
    Save,
    Sparkles,
    ShieldCheck,
    Briefcase,
    Heart,
    CreditCard,
    Zap,
    History,
    FileText,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Smartphone,
    Star,
    Award,
    TrendingUp,
    BarChart3,
    CheckCircle
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/Tabs';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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

export default function Show({ auth, employee, stats }) {
    const [currentTab, setCurrentTab] = useState('overview');

    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const { data: leaveData, setData: setLeaveData, post: postLeave, processing: leaveProcessing, reset: resetLeave } = useForm({
        leave_type: 'casual',
        start_date: '',
        end_date: '',
        reason: '',
    });

    const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
    const { data: perfData, setData: setPerfData, post: postPerf, processing: perfProcessing, reset: resetPerf } = useForm({
        review_date: new Date().toISOString().split('T')[0],
        rating: 5,
        kpi_score: 100,
        comments: '',
        goals: '',
    });

    const submitLeave = (e) => {
        e.preventDefault();
        postLeave(route('employees.leave.store', employee.id), {
            onSuccess: () => {
                setIsLeaveModalOpen(false);
                resetLeave();
            }
        });
    };

    const submitPerformance = (e) => {
        e.preventDefault();
        postPerf(route('employees.performance.store', employee.id), {
            onSuccess: () => {
                setIsPerformanceModalOpen(false);
                resetPerf();
            }
        });
    };

    const updateLeaveStatus = (id, status) => {
        if (confirm(`Authorize ${status} for this leave vector?`)) {
            router.post(route('leave.status.update', id), { status });
        }
    };

    const deleteLeave = (id) => {
        if (confirm('Decommission this leave application?')) {
            router.delete(route('leave.destroy', id));
        }
    };

    const deletePerformance = (id) => {
        if (confirm('Decommission this performance review?')) {
            router.delete(route('performance.destroy', id));
        }
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Talent Analytics: ${employee.first_name}`} />

            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Context */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <Link
                            href={route('employees.index')}
                            className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#22C55E] transition-all group"
                        >
                            <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Return to HQ
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Badge variant="outline" className="rounded-full bg-indigo-50 text-indigo-600 border-indigo-100 font-black uppercase tracking-widest text-[10px] py-1 px-3">
                                    Agent ID: {employee.employee_id}
                                </Badge>
                                <Badge variant="outline" className="rounded-full bg-emerald-50 text-emerald-600 border-emerald-100 font-black uppercase tracking-widest text-[10px] py-1 px-3">
                                    Status: {employee.status}
                                </Badge>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                                {employee.first_name} <span className="text-[#22C55E]">{employee.last_name}</span>
                            </h1>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] mt-2 border-l-4 border-indigo-500 pl-4">
                                {employee.designation || 'Staff Component'} • {employee.department || 'General Core'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={route('employees.edit', employee.id)}>
                            <Button className="h-12 px-6 rounded-2xl bg-white border border-gray-100 text-gray-900 font-black shadow-sm transition-all hover:scale-[1.02] active:scale-95 gap-2 uppercase text-[10px] tracking-widest">
                                <Pencil size={16} /> Reconfigure Profile
                            </Button>
                        </Link>
                        <Button className="h-12 px-6 rounded-2xl bg-[#22C55E] text-white font-black shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-95 gap-2 uppercase text-[10px] tracking-widest">
                            <Zap size={16} fill="currentColor" /> Deploy Task
                        </Button>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Key Metrics & Quick Actions */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Biometric Integration Status */}
                        <Card className="rounded-[40px] border-none shadow-sm bg-gray-900 p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                <ShieldCheck size={120} />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Biometric Sync</h3>
                                    <Badge className="bg-emerald-500 text-white border-none py-0.5 font-black text-[8px] uppercase">Active</Badge>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-[32px] bg-white/10 p-1 overflow-hidden">
                                        {employee.avatar ? (
                                            <img src={`/storage/${employee.avatar}`} className="w-full h-full object-cover rounded-[28px]" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/40">
                                                <User size={32} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black italic tracking-tighter">V8.2.1</p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Core Algorithm</p>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xl font-black tracking-tight">{stats.attendance_rate}%</p>
                                        <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Reliability Rate</p>
                                    </div>
                                    <div>
                                        <p className="text-xl font-black tracking-tight">{stats.completed_tasks}</p>
                                        <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Task Velocity</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Financial Allocation */}
                        <Card className="rounded-[40px] border-none shadow-sm bg-white p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#22C55E] flex items-center justify-center">
                                    <Coins size={20} />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Financial Allocation</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Monthly Magnitude</p>
                                    <p className="text-3xl font-black text-gray-900 tracking-tighter mt-1">
                                        ৳{employee.salary ? parseFloat(employee.salary).toLocaleString() : '0.00'}
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-gray-400">Payroll Cycle</span>
                                    <span className="text-indigo-600">30-Day Batch</span>
                                </div>
                            </div>
                        </Card>

                        {/* Leave Balance Pulse */}
                        <Card className="rounded-[40px] border-none shadow-sm bg-indigo-50 p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white text-indigo-600 flex items-center justify-center shadow-sm">
                                    <Clock size={20} />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-900">Leave Reservoir</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Available Vector</p>
                                        <p className="text-4xl font-black text-indigo-900 tracking-tighter mt-1">{stats.leave_balance}</p>
                                    </div>
                                    <p className="text-[10px] font-black text-indigo-300 uppercase italic mb-1">Days remaining</p>
                                </div>
                                <div className="w-full bg-indigo-100 rounded-full h-1.5">
                                    <div
                                        className="bg-indigo-600 h-1.5 rounded-full transition-all duration-1000"
                                        style={{ width: `${(stats.leave_balance / 15) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Emergency Matrix */}
                        <Card className="rounded-[40px] border-none shadow-sm bg-rose-50 p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white text-rose-600 flex items-center justify-center shadow-sm">
                                    <Heart size={20} />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-rose-900">Emergency Matrix</h3>
                            </div>
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">Primary Responder</p>
                                <p className="text-sm font-black text-rose-900 uppercase tracking-tight">{employee.emergency_contact_name || 'UNDEFINED'}</p>
                                <div className="flex items-center gap-2 pt-2 text-rose-600">
                                    <Phone size={14} fill="currentColor" className="opacity-40" />
                                    <span className="text-sm font-black font-mono">{employee.emergency_contact_phone || '--- --- ----'}</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Intelligence Feed */}
                    <div className="lg:col-span-8 space-y-8">
                        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                            <TabsList className="bg-white/50 p-1.5 rounded-2xl border border-gray-100 mb-8 h-14 inline-flex shadow-sm">
                                <TabsTrigger value="overview" className="rounded-xl px-8 h-11 data-[state=active]:bg-[#22C55E] data-[state=active]:text-white data-[state=active]:shadow-lg gap-2 font-black uppercase text-[10px] tracking-wider transition-all">
                                    <Zap size={14} /> Intelligence Overview
                                </TabsTrigger>
                                <TabsTrigger value="leave" className="rounded-xl px-8 h-11 data-[state=active]:bg-[#22C55E] data-[state=active]:text-white data-[state=active]:shadow-lg gap-2 font-black uppercase text-[10px] tracking-wider transition-all">
                                    <Clock size={14} /> Leave Intelligence
                                </TabsTrigger>
                                <TabsTrigger value="performance" className="rounded-xl px-8 h-11 data-[state=active]:bg-[#22C55E] data-[state=active]:text-white data-[state=active]:shadow-lg gap-2 font-black uppercase text-[10px] tracking-wider transition-all">
                                    <Award size={14} /> Performance Analytics
                                </TabsTrigger>
                                <TabsTrigger value="logs" className="rounded-xl px-8 h-11 data-[state=active]:bg-[#22C55E] data-[state=active]:text-white data-[state=active]:shadow-lg gap-2 font-black uppercase text-[10px] tracking-wider transition-all">
                                    <History size={14} /> Pulse Logs
                                </TabsTrigger>
                                <TabsTrigger value="documents" className="rounded-xl px-8 h-11 data-[state=active]:bg-[#22C55E] data-[state=active]:text-white data-[state=active]:shadow-lg gap-2 font-black uppercase text-[10px] tracking-wider transition-all">
                                    <FileText size={14} /> Archive
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Employment Dossier */}
                                    <Card className="rounded-[40px] border-none shadow-sm bg-white p-8 space-y-8 col-span-1 md:col-span-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                                <Briefcase size={20} />
                                            </div>
                                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Employment Dossier</h3>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Department</p>
                                                <p className="text-sm font-black text-gray-900 uppercase mt-2">{employee.department || 'General HQ'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Joining Date</p>
                                                <p className="text-sm font-black text-gray-900 mt-2">{employee.join_date ? new Date(employee.join_date).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Work Shift</p>
                                                <p className="text-sm font-black text-[#22C55E] mt-2 italic">{employee.shift?.name || 'Default Prime'}</p>
                                            </div>
                                            <div className="col-span-full">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Residence Matrix</p>
                                                <div className="flex items-start gap-2 mt-2">
                                                    <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                                    <p className="text-xs font-bold text-gray-600 leading-relaxed uppercase">{employee.address || 'No location data registered in system files.'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Bio / Bio Detail */}
                                    <Card className="rounded-[40px] border-none shadow-sm bg-white p-8 space-y-6 col-span-full">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center">
                                                <FileText size={20} />
                                            </div>
                                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Personnel Bio</h3>
                                        </div>
                                        <p className="text-sm font-bold text-gray-500 leading-relaxed italic">
                                            {employee.bio || "No biography provided. Personnel is currently operating under standard protocol."}
                                        </p>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="leave" className="space-y-8">
                                <Card className="rounded-[40px] border-none shadow-sm bg-white overflow-hidden">
                                    <div className="p-8 flex justify-between items-center border-b border-gray-50">
                                        <div className="space-y-1">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 leading-none">Leave Intelligence Feed</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Absence protocols & status</p>
                                        </div>
                                        <Button onClick={() => setIsLeaveModalOpen(true)} className="h-12 px-6 rounded-2xl bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95 gap-2">
                                            <Plus size={16} strokeWidth={3} /> Initialize Request
                                        </Button>
                                    </div>
                                    <div className="p-8 overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="border-b border-gray-50">
                                                <tr>
                                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Temporal Vector</th>
                                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Classification</th>
                                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Status</th>
                                                    <th className="pb-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {employee.leave_applications?.map((leave) => (
                                                    <tr key={leave.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                                                        <td className="py-6">
                                                            <p className="text-sm font-black text-gray-900 tracking-tighter italic uppercase">{new Date(leave.start_date).toLocaleDateString()} → {new Date(leave.end_date).toLocaleDateString()}</p>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Magnitude: {leave.duration} Days</p>
                                                        </td>
                                                        <td className="py-6">
                                                            <Badge variant="outline" className="rounded-xl bg-slate-50 text-slate-600 border-slate-200 font-black uppercase tracking-widest text-[8px] py-1 px-3 italic">
                                                                {leave.leave_type}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-6">
                                                            <div className={cn(
                                                                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border italic",
                                                                leave.status === 'approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                                    leave.status === 'rejected' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                                        "bg-amber-50 text-amber-600 border-amber-100"
                                                            )}>
                                                                <div className={cn("w-1.5 h-1.5 rounded-full",
                                                                    leave.status === 'approved' ? "bg-emerald-500" :
                                                                        leave.status === 'rejected' ? "bg-rose-500" : "bg-amber-500"
                                                                )} />
                                                                {leave.status}
                                                            </div>
                                                        </td>
                                                        <td className="py-6 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                {leave.status === 'pending' && (
                                                                    <>
                                                                        <Button onClick={() => updateLeaveStatus(leave.id, 'approved')} size="sm" className="h-9 px-4 rounded-xl bg-emerald-500 text-white font-black text-[9px] uppercase tracking-widest italic transition-all hover:scale-105 active:scale-95 shadow-sm">Authorize</Button>
                                                                        <Button onClick={() => updateLeaveStatus(leave.id, 'rejected')} size="sm" className="h-9 px-4 rounded-xl bg-rose-500 text-white font-black text-[9px] uppercase tracking-widest italic transition-all hover:scale-105 active:scale-95 shadow-sm">Reject</Button>
                                                                    </>
                                                                )}
                                                                <Button onClick={() => deleteLeave(leave.id)} variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-all">
                                                                    <Trash2 size={16} />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {(!employee.leave_applications || employee.leave_applications.length === 0) && (
                                                    <tr>
                                                        <td colSpan="4" className="py-24 text-center">
                                                            <div className="flex flex-col items-center gap-4 opacity-10">
                                                                <Clock size={64} />
                                                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 italic">No leave applications registered</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="performance" className="space-y-8">
                                <Card className="rounded-[40px] border-none shadow-sm bg-white overflow-hidden">
                                    <div className="p-8 flex justify-between items-center border-b border-gray-50">
                                        <div className="space-y-1">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 leading-none">Performance Analytics Feed</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Magnitude rating & KPI vectors</p>
                                        </div>
                                        <Button onClick={() => setIsPerformanceModalOpen(true)} className="h-12 px-6 rounded-2xl bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95 gap-2">
                                            <Plus size={16} strokeWidth={3} /> New Audit
                                        </Button>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        {employee.performance_reviews?.map((review) => (
                                            <div key={review.id} className="group p-8 rounded-[2.5rem] bg-gray-50/50 border border-gray-100 flex flex-col md:flex-row gap-8 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100 hover:scale-[1.01]">
                                                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-sm min-w-[140px]">
                                                    <div className="flex items-center gap-1 mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={14} className={cn(i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200")} />
                                                        ))}
                                                    </div>
                                                    <p className="text-4xl font-black text-gray-900 tracking-tighter leading-none italic">{review.rating}</p>
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mt-2">Rating Magnitude</p>
                                                </div>

                                                <div className="flex-1 space-y-4">
                                                    <div className="flex justify-between items-start">
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-black text-gray-900 uppercase italic tracking-tight italic">{new Date(review.review_date).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</p>
                                                            <div className="flex items-center gap-2">
                                                                <TrendingUp size={12} className="text-indigo-600" />
                                                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic">KPI SCORE: {review.kpi_score}%</p>
                                                            </div>
                                                        </div>
                                                        <Button onClick={() => deletePerformance(review.id)} variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-all">
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                                                        <div className="space-y-2">
                                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Analysis Comments</p>
                                                            <p className="text-xs font-bold text-gray-600 leading-relaxed italic">{review.comments || 'Standard operational feedback.'}</p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Strategic Goals</p>
                                                            <p className="text-xs font-bold text-gray-600 leading-relaxed italic">{review.goals || 'Maintain current trajectory.'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {(!employee.performance_reviews || employee.performance_reviews.length === 0) && (
                                            <div className="py-24 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-10">
                                                    <BarChart3 size={64} />
                                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 italic">No performance benchmarks registered</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="logs" className="space-y-8">
                                <Card className="rounded-[40px] border-none shadow-sm bg-white overflow-hidden">
                                    <div className="p-8 pb-0 flex justify-between items-center">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Recent Pulse Logs</h3>
                                        <Button size="sm" variant="ghost" className="text-[#22C55E] uppercase text-[10px] font-black tracking-widest group">
                                            Export Dossier <ArrowLeft size={12} className="ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                    <div className="p-8 overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="border-b border-gray-50">
                                                <tr>
                                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Temporal Marker</th>
                                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Arrival</th>
                                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Departure</th>
                                                    <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {employee.attendances?.map((att) => (
                                                    <tr key={att.id} className="group hover:bg-gray-50/50 transition-colors">
                                                        <td className="py-5">
                                                            <p className="text-sm font-black text-gray-900">{new Date(att.date).toLocaleDateString()}</p>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Global Terminal</p>
                                                        </td>
                                                        <td className="py-5">
                                                            <AttendanceStatus status={att.status} />
                                                        </td>
                                                        <td className="py-5 text-sm font-black font-mono text-[#22C55E]">{att.check_in || '--:--'}</td>
                                                        <td className="py-5 text-sm font-black font-mono text-rose-500">{att.check_out || '--:--'}</td>
                                                        <td className="py-5 text-right font-black">
                                                            <Button variant="ghost" size="sm" className="h-8 rounded-xl text-[10px] uppercase text-gray-400 hover:text-rose-500 group-hover:bg-rose-50 transition-all">Audit</Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {(!employee.attendances || employee.attendances.length === 0) && (
                                                    <tr>
                                                        <td colSpan="5" className="py-20 text-center">
                                                            <div className="flex flex-col items-center gap-4 opacity-20">
                                                                <Clock size={48} />
                                                                <p className="text-sm font-black uppercase tracking-widest italic">Zero log markers found</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="documents" className="space-y-8">
                                <Card className="rounded-[40px] border-none shadow-sm bg-white p-8">
                                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                                        <div className="w-24 h-24 rounded-[32px] bg-gray-50 flex items-center justify-center text-gray-200">
                                            <FileText size={48} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 uppercase">Document Archive</h3>
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2 max-w-sm mx-auto leading-relaxed">
                                                No intelligence documents are currently attached to this personnel profile.
                                            </p>
                                        </div>
                                        <Button className="h-14 px-8 rounded-2xl bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95 gap-3">
                                            <Plus size={18} strokeWidth={3} /> Upload Dossier
                                        </Button>
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* Leave Protocol Modal */}
                <Modal show={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)} maxWidth="lg">
                    <div className="p-10 md:p-14 space-y-10 bg-white dark:bg-slate-900 rounded-[3rem] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                                    <Zap size={20} />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Initialize Absence Request</h3>
                            </div>
                        </div>

                        <form onSubmit={submitLeave} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4 italic">Classification Vector</label>
                                    <select
                                        value={leaveData.leave_type}
                                        onChange={e => setLeaveData('leave_type', e.target.value)}
                                        className="w-full h-16 px-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-black text-sm uppercase tracking-widest appearance-none focus:ring-4 focus:ring-indigo-600/10 transition-all text-slate-900 dark:text-white shadow-inner italic"
                                    >
                                        <option value="casual">CASUAL</option>
                                        <option value="sick">SICK</option>
                                        <option value="annual">ANNUAL</option>
                                        <option value="maternity">MATERNITY</option>
                                        <option value="paternity">PATERNITY</option>
                                        <option value="unpaid">UNPAID</option>
                                        <option value="other">OTHER</option>
                                    </select>
                                </div>
                                <div />
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4 italic">Start Temporal Marker</label>
                                    <input
                                        type="date"
                                        value={leaveData.start_date}
                                        onChange={e => setLeaveData('start_date', e.target.value)}
                                        className="w-full h-16 px-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-black text-sm uppercase tracking-widest focus:ring-4 focus:ring-indigo-600/10 transition-all text-slate-900 dark:text-white shadow-inner italic"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4 italic">End Temporal Marker</label>
                                    <input
                                        type="date"
                                        value={leaveData.end_date}
                                        onChange={e => setLeaveData('end_date', e.target.value)}
                                        className="w-full h-16 px-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-black text-sm uppercase tracking-widest focus:ring-4 focus:ring-indigo-600/10 transition-all text-slate-900 dark:text-white shadow-inner italic"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4 italic">Absence Rationale</label>
                                <textarea
                                    value={leaveData.reason}
                                    onChange={e => setLeaveData('reason', e.target.value)}
                                    className="w-full h-40 px-8 py-6 bg-slate-50 dark:bg-slate-800 border-none rounded-[2.5rem] font-black text-sm uppercase tracking-widest focus:ring-4 focus:ring-indigo-600/10 transition-all text-slate-900 dark:text-white shadow-inner italic resize-none"
                                    placeholder="..."
                                />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsLeaveModalOpen(false)}
                                    className="flex-1 h-20 rounded-[2.2rem] bg-slate-50 text-slate-400 font-black text-lg italic tracking-widest uppercase transition-all"
                                >
                                    Cancel Request
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={leaveProcessing}
                                    className="flex-1 h-20 rounded-[2.2rem] bg-indigo-600 hover:bg-slate-900 text-white font-black text-xl italic tracking-tighter shadow-2xl shadow-indigo-100 dark:shadow-none gap-4 transition-all"
                                >
                                    COMMENCE PROTOCOL
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal>

                {/* Performance Analytics Modal */}
                <Modal show={isPerformanceModalOpen} onClose={() => setIsPerformanceModalOpen(false)} maxWidth="lg">
                    <div className="p-10 md:p-14 space-y-10 bg-white dark:bg-slate-900 rounded-[3rem] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                                    <Award size={20} />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Initialize Performance Audit</h3>
                            </div>
                        </div>

                        <form onSubmit={submitPerformance} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4 italic">Execution Rating (1-5)</label>
                                    <select
                                        value={perfData.rating}
                                        onChange={e => setPerfData('rating', e.target.value)}
                                        className="w-full h-16 px-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-black text-sm uppercase tracking-widest appearance-none focus:ring-4 focus:ring-indigo-600/10 transition-all text-slate-900 dark:text-white shadow-inner italic"
                                    >
                                        {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} STARS</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4 italic">KPI Velocity (%)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={perfData.kpi_score}
                                        onChange={e => setPerfData('kpi_score', e.target.value)}
                                        className="w-full h-16 px-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.8rem] font-black text-sm uppercase tracking-widest focus:ring-4 focus:ring-indigo-600/10 transition-all text-slate-900 dark:text-white shadow-inner italic"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4 italic">Audit Feedback</label>
                                <textarea
                                    value={perfData.comments}
                                    onChange={e => setPerfData('comments', e.target.value)}
                                    className="w-full h-32 px-8 py-6 bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] font-black text-sm uppercase tracking-widest focus:ring-4 focus:ring-indigo-600/10 transition-all text-slate-900 dark:text-white shadow-inner italic resize-none"
                                    placeholder="..."
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4 italic">Strategic Evolution Goals</label>
                                <textarea
                                    value={perfData.goals}
                                    onChange={e => setPerfData('goals', e.target.value)}
                                    className="w-full h-32 px-8 py-6 bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] font-black text-sm uppercase tracking-widest focus:ring-4 focus:ring-indigo-600/10 transition-all text-slate-900 dark:text-white shadow-inner italic resize-none"
                                    placeholder="..."
                                />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsPerformanceModalOpen(false)}
                                    className="flex-1 h-20 rounded-[2.2rem] bg-slate-50 text-slate-400 font-black text-lg italic tracking-widest uppercase transition-all"
                                >
                                    Cancel Audit
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={perfProcessing}
                                    className="flex-1 h-20 rounded-[2.2rem] bg-indigo-600 hover:bg-slate-900 text-white font-black text-xl italic tracking-tighter shadow-2xl shadow-indigo-100 dark:shadow-none gap-4 transition-all"
                                >
                                    FINALIZE ANALYTICS
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        </FigmaLayout>
    );
}

function Modal({ show, onClose, maxWidth, children }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={cn("w-full bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden", maxWidth === 'lg' ? "max-w-2xl" : "max-w-md")}>
                {children}
            </div>
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    );
}
