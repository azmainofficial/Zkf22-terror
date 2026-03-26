import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    PlusIcon,
    ClockIcon,
    PencilSquareIcon,
    TrashIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Index({ shifts }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingShift, setEditingShift] = useState(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        start_time: '09:00',
        end_time: '18:00',
        grace_period: 15,
    });

    const openModal = (shift = null) => {
        if (shift) {
            setEditingShift(shift);
            setData({
                name: shift.name,
                start_time: shift.start_time,
                end_time: shift.end_time,
                grace_period: shift.grace_period,
            });
        } else {
            setEditingShift(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingShift) {
            put(route('shifts.update', editingShift.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('shifts.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingShift(null);
        reset();
    };

    const deleteShift = (id) => {
        if (confirm('Are you sure? Employees assigned to this shift will have no shift.')) {
            router.delete(route('shifts.destroy', id));
        }
    };

    return (
        <FigmaLayout>
            <Head title="Work Shifts" />

            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Work Shifts</h1>
                        <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">Define and manage working hours for your employees.</p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#22C55E] text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all w-full md:w-auto"
                    >
                        <PlusIcon className="w-5 h-5 mr-2 stroke-[3px]" />
                        Create New Shift
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shifts.map((shift) => (
                        <div key={shift.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 relative group hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-emerald-50 rounded-2xl text-[#22C55E]">
                                    <ClockIcon className="w-6 h-6" />
                                </div>
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openModal(shift)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                        <PencilSquareIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => deleteShift(shift.id)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-gray-900">{shift.name}</h3>
                            <div className="mt-6 space-y-3">
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                    <span>Schedule</span>
                                    <span className="text-gray-900">{shift.start_time.substring(0, 5)} - {shift.end_time.substring(0, 5)}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                    <span>Grace Period</span>
                                    <span className="text-emerald-600">{shift.grace_period} Minutes</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                    <span>Employees</span>
                                    <span className="text-indigo-600">{shift.employees_count} Members</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300">
                            <button onClick={closeModal} className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-black text-gray-900">{editingShift ? 'Edit' : 'Create'} Work Shift</h2>
                            <form onSubmit={submit} className="mt-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Shift Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Morning Shift"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-[#22C55E]/10"
                                    />
                                    {errors.name && <p className="text-[10px] font-black text-rose-500 uppercase mt-1">{errors.name}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Start Time</label>
                                        <input
                                            type="time"
                                            value={data.start_time}
                                            onChange={e => setData('start_time', e.target.value)}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-[#22C55E]/10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">End Time</label>
                                        <input
                                            type="time"
                                            value={data.end_time}
                                            onChange={e => setData('end_time', e.target.value)}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-[#22C55E]/10"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Grace Period (Minutes)</label>
                                    <input
                                        type="number"
                                        value={data.grace_period}
                                        onChange={e => setData('grace_period', e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-[#22C55E]/10"
                                    />
                                </div>
                                <button
                                    className="w-full py-4 bg-[#22C55E] text-white rounded-2xl font-black shadow-lg shadow-emerald-100 hover:scale-[1.02] active:scale-95 transition-all text-sm mt-4"
                                    disabled={processing}
                                >
                                    {editingShift ? 'Update Shift' : 'Create Shift'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </FigmaLayout>
    );
}
