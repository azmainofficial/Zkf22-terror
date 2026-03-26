import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ChevronLeft,
    User,
    Mail,
    Phone,
    Briefcase,
    Building2,
    Calendar,
    DollarSign,
    MapPin,
    Heart,
    CreditCard,
    Save,
    Sparkles,
    PencilLine
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/Input';
import { Label } from '@/Components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/Select';
import { cn } from '@/lib/utils';

export default function Edit({ employee, shifts }) {
    const { data, setData, put, processing, errors } = useForm({
        employee_id: employee.employee_id || '',
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || '',
        designation: employee.designation || '',
        salary: employee.salary || '',
        address: employee.address || '',
        join_date: employee.join_date || '',
        status: employee.status || 'active',
        shift_id: employee.shift_id?.toString() || '',
        emergency_contact_name: employee.emergency_contact_name || '',
        emergency_contact_phone: employee.emergency_contact_phone || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('employees.update', employee.id));
    };

    return (
        <FigmaLayout>
            <Head title={`Updating Profile: ${employee.first_name}`} />

            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link
                        href={route('employees.index')}
                        className="flex items-center text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#22C55E] transition-all group"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Personnel
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Main Form */}
                    <div className="flex-1 space-y-8">
                        <div className="bg-white p-8 md:p-12 rounded-[48px] shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                                <PencilLine className="w-64 h-64 text-[#22C55E]" />
                            </div>

                            <div className="relative z-10">
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Refine Profile</h1>
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2 border-l-4 border-indigo-500 pl-4">Modifying Identity: {employee.first_name} {employee.last_name}</p>

                                <form onSubmit={submit} className="mt-12 space-y-12">
                                    {/* Section: Core Identity */}
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#22C55E] flex items-center justify-center">
                                                <User size={20} />
                                            </div>
                                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Core Identity</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Employee ID</Label>
                                                <Input
                                                    placeholder="EMP-XXXX"
                                                    value={data.employee_id}
                                                    onChange={e => setData('employee_id', e.target.value)}
                                                    className={cn("h-12 rounded-2xl border-none bg-gray-50/50 font-bold", errors.employee_id && "ring-2 ring-rose-500/20")}
                                                />
                                                {errors.employee_id && <p className="text-[10px] font-black text-rose-500 uppercase">{errors.employee_id}</p>}
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</Label>
                                                <Select value={data.status} onValueChange={v => setData('status', v)}>
                                                    <SelectTrigger className="h-12 rounded-2xl border-none bg-gray-50/50 font-bold">
                                                        <SelectValue placeholder="System Status" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                        <SelectItem value="active" className="rounded-xl font-bold uppercase text-[10px] tracking-wider">Active</SelectItem>
                                                        <SelectItem value="inactive" className="rounded-xl font-bold uppercase text-[10px] tracking-wider">Inactive</SelectItem>
                                                        <SelectItem value="on_leave" className="rounded-xl font-bold uppercase text-[10px] tracking-wider">On Leave</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">First Name</Label>
                                                <Input
                                                    placeholder="Azmain"
                                                    value={data.first_name}
                                                    onChange={e => setData('first_name', e.target.value)}
                                                    className="h-12 rounded-2xl border-none bg-gray-50/50 font-bold"
                                                />
                                                {errors.first_name && <p className="text-[10px] font-black text-rose-500 uppercase">{errors.first_name}</p>}
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Last Name</Label>
                                                <Input
                                                    placeholder="Official"
                                                    value={data.last_name}
                                                    onChange={e => setData('last_name', e.target.value)}
                                                    className="h-12 rounded-2xl border-none bg-gray-50/50 font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section: Professional Profile */}
                                    <div className="space-y-8 pt-8 border-t border-dashed border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                                <Briefcase size={20} />
                                            </div>
                                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Professional Profile</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Department</Label>
                                                <Input
                                                    placeholder="e.g. Executive"
                                                    value={data.department}
                                                    onChange={e => setData('department', e.target.value)}
                                                    className="h-12 rounded-2xl border-none bg-gray-50/50 font-bold"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Designation</Label>
                                                <Input
                                                    placeholder="e.g. Lead Developer"
                                                    value={data.designation}
                                                    onChange={e => setData('designation', e.target.value)}
                                                    className="h-12 rounded-2xl border-none bg-gray-50/50 font-bold"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Salary (Monthly)</Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <Input
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={data.salary}
                                                        onChange={e => setData('salary', e.target.value)}
                                                        className="h-12 rounded-2xl border-none bg-gray-50/50 font-bold pl-10"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Work Shift</Label>
                                                <Select value={data.shift_id} onValueChange={v => setData('shift_id', v)}>
                                                    <SelectTrigger className="h-12 rounded-2xl border-none bg-gray-50/50 font-bold">
                                                        <SelectValue placeholder="Select Shift" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                        <SelectItem value="" className="rounded-xl font-bold uppercase text-[10px] tracking-wider italic text-gray-400">Unassigned</SelectItem>
                                                        {shifts.map(s => (
                                                            <SelectItem key={s.id} value={s.id.toString()} className="rounded-xl font-bold uppercase text-[10px] tracking-wider">{s.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section: Contact & Emergency */}
                                    <div className="space-y-8 pt-8 border-t border-dashed border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                                                <Heart size={20} />
                                            </div>
                                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Contact & Safety</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Email</Label>
                                                <Input
                                                    type="email"
                                                    placeholder="official@company.com"
                                                    value={data.email}
                                                    onChange={e => setData('email', e.target.value)}
                                                    className="h-12 rounded-2xl border-none bg-gray-50/50 font-bold"
                                                />
                                                {errors.email && <p className="text-[10px] font-black text-rose-500 uppercase">{errors.email}</p>}
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Phone</Label>
                                                <Input
                                                    placeholder="+8801XXXXXXXXX"
                                                    value={data.phone}
                                                    onChange={e => setData('phone', e.target.value)}
                                                    className="h-12 rounded-2xl border-none bg-gray-50/50 font-bold"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Emergency Name</Label>
                                                <Input
                                                    placeholder="Contact Person"
                                                    value={data.emergency_contact_name}
                                                    onChange={e => setData('emergency_contact_name', e.target.value)}
                                                    className="h-12 rounded-2xl border-none bg-gray-50/50 font-bold"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Emergency Phone</Label>
                                                <Input
                                                    placeholder="Emergency ID"
                                                    value={data.emergency_contact_phone}
                                                    onChange={e => setData('emergency_contact_phone', e.target.value)}
                                                    className="h-12 rounded-2xl border-none bg-gray-50/50 font-bold"
                                                />
                                            </div>

                                            <div className="md:col-span-2 space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Primary Residence</Label>
                                                <Input
                                                    placeholder="Full Street Address"
                                                    value={data.address}
                                                    onChange={e => setData('address', e.target.value)}
                                                    className="h-12 rounded-2xl border-none bg-gray-50/50 font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-12 flex justify-end">
                                        <Button
                                            disabled={processing}
                                            className="h-16 px-12 bg-[#22C55E] hover:bg-[#1ea34d] text-white rounded-[24px] text-sm font-black shadow-2xl shadow-emerald-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 gap-3 uppercase tracking-widest"
                                        >
                                            {processing ? 'Processing...' : (
                                                <>
                                                    <Save size={20} strokeWidth={3} />
                                                    Synchronize Data
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary Side */}
                    <div className="w-full lg:w-80 space-y-6">
                        <Card className="rounded-[40px] border-none shadow-sm bg-white p-2 overflow-hidden">
                            <div className="p-8 text-center bg-gray-50/50 rounded-t-[38px]">
                                <div className="w-24 h-24 rounded-[32px] bg-white shadow-xl shadow-emerald-100/50 border-4 border-emerald-50 text-[#22C55E] flex items-center justify-center font-black text-2xl mx-auto">
                                    {employee.first_name?.[0]}{employee.last_name?.[0]}
                                </div>
                                <h3 className="text-xl font-black mt-4 text-gray-900 leading-tight truncate">{employee.first_name} {employee.last_name}</h3>
                                <p className="text-[10px] font-black text-[#22C55E] uppercase tracking-widest mt-1">Personnel Detail View</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Joined</span>
                                    <span className="text-gray-900">{new Date(employee.join_date || Date.now()).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Sync Status</span>
                                    <span className="text-emerald-500 flex items-center gap-1"><Sparkles size={10} /> Optimal</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="rounded-[40px] border-none shadow-sm bg-indigo-600 p-8 text-white">
                            <h4 className="text-xs font-black uppercase tracking-widest opacity-60">System Log</h4>
                            <p className="mt-4 font-bold text-sm leading-relaxed">
                                Updating this profile will trigger a background audit log. Ensure all changes are verified as per HR Policy.
                            </p>
                            <div className="mt-6 flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-white/20">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-black uppercase">Last Modified: {new Date(employee.updated_at).toLocaleDateString()}</span>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </FigmaLayout>
    );
}

