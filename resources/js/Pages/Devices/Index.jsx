import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    SignalIcon,
    SignalSlashIcon,
    MapPinIcon,
    CpuChipIcon,
    PencilSquareIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function DevicesIndex({ devices }) {
    const [editingId, setEditingId] = useState(null);
    const { data, setData, patch, processing, errors, reset } = useForm({
        device_name: '',
    });

    const startEditing = (device) => {
        setEditingId(device.id);
        setData('device_name', device.device_name || '');
    };

    const cancelEditing = () => {
        setEditingId(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route('devices.update', editingId), {
            onSuccess: () => setEditingId(null),
        });
    };

    return (
        <FigmaLayout>
            <Head title="Device Management" />

            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Terminals & Devices</h1>
                        <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">Monitor connection status and customize device locations.</p>
                    </div>
                </div>

                {/* Device Status Grid/Table */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-widest font-black border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-6">Device Location / Name</th>
                                        <th className="px-8 py-6">Serial Number</th>
                                        <th className="px-8 py-6">IP Address</th>
                                        <th className="px-8 py-6">Last Check-in</th>
                                        <th className="px-8 py-6 text-right">Connection</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {devices.map((device) => (
                                        <tr key={device.id} className="group hover:bg-gray-50/40 transition-all">
                                            <td className="px-8 py-5">
                                                {editingId === device.id ? (
                                                    <form onSubmit={submit} className="flex items-center space-x-2">
                                                        <input
                                                            type="text"
                                                            value={data.device_name}
                                                            onChange={e => setData('device_name', e.target.value)}
                                                            className="bg-gray-50 border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] w-64"
                                                            autoFocus
                                                        />
                                                        <button
                                                            disabled={processing}
                                                            className="p-2 bg-[#22C55E] text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-100"
                                                        >
                                                            <CheckIcon className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={cancelEditing}
                                                            className="p-2 bg-white border border-gray-200 text-gray-400 rounded-xl hover:bg-gray-50 transition-colors"
                                                        >
                                                            <XMarkIcon className="w-4 h-4" />
                                                        </button>
                                                    </form>
                                                ) : (
                                                    <div className="flex items-center space-x-4">
                                                        <div className={`p-3 rounded-2xl ${device.is_online ? 'bg-emerald-50' : 'bg-gray-50'} transition-colors`}>
                                                            <MapPinIcon className={`w-5 h-5 ${device.is_online ? 'text-[#22C55E]' : 'text-gray-400'}`} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900 flex items-center">
                                                                {device.device_name || 'Unnamed Location'}
                                                                <button
                                                                    onClick={() => startEditing(device)}
                                                                    className="ml-2 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-[#22C55E] transition-all"
                                                                >
                                                                    <PencilSquareIcon className="w-4 h-4" />
                                                                </button>
                                                            </p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Physical Site</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-5 text-sm font-mono font-bold text-gray-600">
                                                <div className="flex items-center">
                                                    <CpuChipIcon className="w-4 h-4 mr-2 text-gray-300" />
                                                    {device.serial_number}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-bold text-gray-500 italic">
                                                {device.ip_address || '--- . --- . --- . ---'}
                                            </td>
                                            <td className="px-8 py-5 text-xs font-bold text-gray-600">
                                                {device.last_seen_at ? new Date(device.last_seen_at).toLocaleString() : 'Never'}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    {device.is_online ? (
                                                        <>
                                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Now</span>
                                                            <div className="relative flex h-3 w-3">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Disconnected</span>
                                                            <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {devices.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="p-4 bg-gray-50 rounded-full mb-4">
                                                        <SignalSlashIcon className="w-10 h-10 text-gray-300" />
                                                    </div>
                                                    <p className="text-gray-400 font-bold italic">No devices registered yet. Connect a terminal to see it here.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </FigmaLayout>
    );
}
