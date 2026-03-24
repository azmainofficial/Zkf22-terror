import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    MagnifyingGlassIcon,
    PlusIcon,
    ChevronRightIcon,
    EllipsisVerticalIcon,
    FunnelIcon,
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Index({ employees, filters }) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('employees.index'), { preserveState: true });
    };

    const deleteEmployee = (id) => {
        if (confirm('Are you sure you want to delete this employee?')) {
            router.delete(route('employees.destroy', id));
        }
    };

    return (
        <FigmaLayout>
            <Head title="Employees" />

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900">Employees</h1>
                        <p className="text-sm text-gray-500 font-medium mt-1">Manage your team members and their assignments.</p>
                    </div>
                    <Link
                        href={route('employees.create')}
                        className="inline-flex items-center px-6 py-3 bg-[#22C55E] text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <PlusIcon className="w-5 h-5 mr-2 stroke-[3px]" />
                        Add New Employee
                    </Link>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                    <form onSubmit={handleSearch} className="relative flex-1 group">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#22C55E] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name or Employee ID..."
                            value={data.search}
                            onChange={e => setData('search', e.target.value)}
                            className="w-full bg-gray-50/50 border-none rounded-xl py-2.5 pl-11 text-sm focus:ring-2 focus:ring-[#22C55E]/10"
                        />
                    </form>
                    <div className="flex items-center space-x-2">
                        <button className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
                            <FunnelIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Employee Table */}
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-widest font-black">
                                <tr>
                                    <th className="px-8 py-5">General Info</th>
                                    <th className="px-8 py-5">Employee ID</th>
                                    <th className="px-8 py-5">Job Title</th>
                                    <th className="px-8 py-5">Department</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {employees.data.map((employee) => (
                                    <tr key={employee.id} className="group hover:bg-gray-50/40 transition-all">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-[#22C55E] flex items-center justify-center font-black text-sm border border-emerald-100/50">
                                                    {employee.first_name.charAt(0)}{employee.last_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 leading-tight">{employee.first_name} {employee.last_name}</p>
                                                    <p className="text-xs text-gray-400 font-medium">{employee.email || 'No email'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                                                {employee.employee_id}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 font-bold text-gray-700 text-sm">
                                            {employee.designation || 'N/A'}
                                        </td>
                                        <td className="px-8 py-5 font-bold text-gray-500 text-xs uppercase tracking-tight">
                                            {employee.department || 'N/A'}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${employee.status === 'active'
                                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                    : 'bg-rose-50 text-rose-600 border border-rose-100'
                                                }`}>
                                                {employee.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={route('employees.edit', employee.id)}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                >
                                                    <PencilSquareIcon className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => deleteEmployee(employee.id)}
                                                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {employees.data.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <UserGroupIcon className="w-12 h-12 text-gray-100 mb-4" />
                                                <p className="text-gray-400 font-bold italic tracking-tight">No employees found in the database.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {employees.links.length > 3 && (
                        <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                Showing {employees.from} to {employees.to} of {employees.total} results
                            </p>
                            <div className="flex items-center space-x-2">
                                {employees.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${link.active
                                                ? 'bg-[#22C55E] text-white shadow-md shadow-emerald-100'
                                                : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50 hover:text-gray-900'
                                            } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </FigmaLayout>
    );
}

function UserGroupIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.771m0 0a5.971 5.971 0 00-.941 3.197m0 0L5.059 18.835c.024.219.037.441.037.666l.001.031m13.5-1.5zm-1.5-1.5a3 3 0 10-3-3m-9 9a3 3 0 103-3" />
        </svg>
    )
}
