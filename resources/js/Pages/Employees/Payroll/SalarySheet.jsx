import React from 'react';
import { Head } from '@inertiajs/react';
import { Printer, ShieldCheck, Zap, Activity, Building2 } from 'lucide-react';
import { Button } from '@/Components/ui/Button';

export default function SalarySheet({ payrolls, month, year }) {
    const handlePrint = () => {
        window.print();
    };

    const monthName = new Date(0, month - 1).toLocaleString('en-US', { month: 'long' }).toUpperCase();
    const totalBase = payrolls.reduce((sum, p) => sum + parseFloat(p.base_salary), 0);
    const totalBonus = payrolls.reduce((sum, p) => sum + parseFloat(p.bonus), 0);
    const totalDeductions = payrolls.reduce((sum, p) => sum + parseFloat(p.deductions), 0);
    const totalNet = payrolls.reduce((sum, p) => sum + parseFloat(p.total), 0);

    return (
        <div className="bg-slate-50 min-h-screen text-slate-900 p-10 font-sans print:bg-white print:p-0">
            <Head title={`Salary Engineering Manifest - ${monthName} ${year}`} />

            <div className="max-w-[297mm] mx-auto print:max-w-none">
                {/* Print Control Surface */}
                <div className="print:hidden flex items-center justify-between mb-10 p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                            <Activity size={24} />
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-sm font-black uppercase tracking-widest italic leading-none">Salary Manifest</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Temporal Period: {monthName} {year}</p>
                        </div>
                    </div>
                    <Button onClick={handlePrint} className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest italic shadow-xl shadow-slate-200 dark:shadow-none gap-3 transition-all hover:scale-105 active:scale-95">
                        <Printer size={18} />
                        Print Manifest
                    </Button>
                </div>

                {/* Fiscal Manifest Surface */}
                <div className="bg-white p-12 md:p-16 border-2 border-slate-100 print:border-none print:p-0 rounded-[4rem] shadow-2xl shadow-slate-200 dark:shadow-none relative overflow-hidden">
                    {/* Security Watermark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none -rotate-12">
                        <ShieldCheck size={600} className="text-slate-900" />
                    </div>

                    {/* Header Entity */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 relative z-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-12 bg-indigo-600 rounded-full" />
                                <h1 className="text-5xl font-black uppercase tracking-tighter italic text-slate-900">
                                    Salary Manifest
                                </h1>
                            </div>
                            <div className="flex items-center gap-3 pl-5">
                                <Zap size={14} className="text-indigo-600" />
                                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Temporal Period: {monthName} {year}</p>
                            </div>
                        </div>

                        <div className="text-right space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Generated Sync Node</p>
                            <p className="text-sm font-black italic tracking-tight text-slate-900">{new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</p>
                            <div className="flex items-center justify-end gap-2 text-emerald-500">
                                <ShieldCheck size={14} />
                                <span className="text-[8px] font-black uppercase tracking-widest leading-none">Verified Protocol</span>
                            </div>
                        </div>
                    </div>

                    {/* Magnitude Ledger */}
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-900 text-white rounded-2xl">
                                    <th className="px-6 py-5 text-left text-[9px] font-black uppercase tracking-widest first:rounded-l-2xl">#</th>
                                    <th className="px-6 py-5 text-left text-[9px] font-black uppercase tracking-widest">Employee Node</th>
                                    <th className="px-6 py-5 text-left text-[9px] font-black uppercase tracking-widest">Architecture</th>
                                    <th className="px-6 py-5 text-right text-[9px] font-black uppercase tracking-widest">Base Magnitude</th>
                                    <th className="px-6 py-5 text-right text-[9px] font-black uppercase tracking-widest">Bonus Node</th>
                                    <th className="px-6 py-5 text-right text-[9px] font-black uppercase tracking-widest">Deduction Node</th>
                                    <th className="px-6 py-5 text-right text-[9px] font-black uppercase tracking-widest last:rounded-r-2xl">Net Vector</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-slate-50">
                                {payrolls.map((payroll, index) => (
                                    <tr key={payroll.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-6 text-xs font-black text-slate-300 italic">{index + 1}</td>
                                        <td className="px-6 py-6">
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-black text-slate-900 uppercase italic tracking-tight">{payroll.employee.first_name} {payroll.employee.last_name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 tracking-widest">{payroll.employee.employee_id}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase italic tracking-widest">
                                            {payroll.employee.designation || 'GENERAL OPERATIVE'}
                                        </td>
                                        <td className="px-6 py-6 text-right text-xs font-black text-slate-900 italic tracking-tighter">
                                            ৳{parseFloat(payroll.base_salary).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-6 text-right text-xs font-black text-emerald-500 italic tracking-tighter">
                                            ৳{parseFloat(payroll.bonus).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-6 text-right text-xs font-black text-rose-500 italic tracking-tighter">
                                            ৳{parseFloat(payroll.deductions).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-6 text-right text-sm font-black text-indigo-600 italic tracking-tighter">
                                            ৳{parseFloat(payroll.total).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-slate-50/50 border-t-4 border-slate-900">
                                    <td colSpan="3" className="px-6 py-8 text-left text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 italic">Total Magnitude Synergy</td>
                                    <td className="px-6 py-8 text-right text-xs font-black text-slate-900 italic tracking-tighter">
                                        ৳{totalBase.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-8 text-right text-xs font-black text-emerald-500 italic tracking-tighter">
                                        ৳{totalBonus.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-8 text-right text-xs font-black text-rose-500 italic tracking-tighter">
                                        ৳{totalDeductions.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-8 text-right text-lg font-black text-indigo-600 italic tracking-tighter bg-slate-900 text-white rounded-b-2xl">
                                        ৳{totalNet.toLocaleString()}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Authorization Nodes */}
                    <div className="mt-32 flex justify-between px-10 relative z-10">
                        <div className="text-center space-y-4">
                            <div className="w-56 h-0.5 bg-slate-200 border-t-2 border-slate-900" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 italic">Analysis Initialization</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Prepared by Fiscal operative</p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-56 h-0.5 bg-slate-200 border-t-2 border-slate-900" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 italic">Command Authorization</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Approved by Strategic Control</p>
                        </div>
                    </div>
                </div>

                {/* Footer Sync Pulse */}
                <div className="mt-12 flex items-center justify-center gap-4 text-slate-300 print:hidden">
                    <Activity size={14} className="text-indigo-600 animate-pulse" />
                    <p className="text-[9px] font-black uppercase tracking-[0.5em] italic">Central Salary Manifest Sync Active</p>
                </div>
            </div>
        </div>
    );
}
