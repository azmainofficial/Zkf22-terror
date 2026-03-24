import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ChevronLeftIcon,
    PencilSquareIcon
} from '@heroicons/react/24/outline';

export default function Edit({ employee }) {
    const { data, setData, put, processing, errors } = useForm({
        employee_id: employee.employee_id,
        first_name: employee.first_name,
        last_name: employee.last_name || '',
        email: employee.email || '',
        department: employee.department || '',
        designation: employee.designation || '',
        status: employee.status,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('employees.update', employee.id));
    };

    return (
        <FigmaLayout>
            <Head title={`Edit Employee: ${employee.first_name}`} />

            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link
                        href={route('employees.index')}
                        className="flex items-center text-sm font-bold text-gray-500 hover:text-[#22C55E] transition-colors group"
                    >
                        <ChevronLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to List
                    </Link>
                </div>

                <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                        <PencilSquareIcon className="w-64 h-64 text-[#22C55E]" />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Edit "{employee.first_name}"</h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">Update employee information or change their account status.</p>

                        <form onSubmit={submit} className="mt-12 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Employee ID */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Employee ID</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. EMP-001"
                                        value={data.employee_id}
                                        onChange={e => setData('employee_id', e.target.value)}
                                        className={`w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-[#22C55E]/20 transition-all font-bold ${errors.employee_id ? 'ring-2 ring-rose-500/20' : ''}`}
                                    />
                                    {errors.employee_id && <p className="text-[10px] font-black text-rose-600 uppercase mt-1">{errors.employee_id}</p>}
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Status</label>
                                    <select
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-[#22C55E]/20 transition-all font-bold"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                {/* First Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">First Name</label>
                                    <input
                                        type="text"
                                        placeholder="John"
                                        value={data.first_name}
                                        onChange={e => setData('first_name', e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-[#22C55E]/20 transition-all font-bold"
                                    />
                                    {errors.first_name && <p className="text-[10px] font-black text-rose-600 uppercase mt-1">{errors.first_name}</p>}
                                </div>

                                {/* Last Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Doe"
                                        value={data.last_name}
                                        onChange={e => setData('last_name', e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-[#22C55E]/20 transition-all font-bold"
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="john.doe@example.com"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-[#22C55E]/20 transition-all font-bold"
                                    />
                                    {errors.email && <p className="text-[10px] font-black text-rose-600 uppercase mt-1">{errors.email}</p>}
                                </div>

                                {/* Designation */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Job Title / Designation</label>
                                    <input
                                        type="text"
                                        placeholder="UI Designer"
                                        value={data.designation}
                                        onChange={e => setData('designation', e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-[#22C55E]/20 transition-all font-bold"
                                    />
                                </div>

                                {/* Department */}
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Department</label>
                                    <input
                                        type="text"
                                        placeholder="Marketing / IT / Design"
                                        value={data.department}
                                        onChange={e => setData('department', e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-[#22C55E]/20 transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-100 flex justify-end">
                                <button
                                    disabled={processing}
                                    className="px-10 py-4 bg-[#22C55E] text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-100 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {processing ? 'Processing...' : 'Update Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </FigmaLayout>
    );
}
