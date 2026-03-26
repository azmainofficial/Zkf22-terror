import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Zap,
    Bell,
    Mail,
    Clock,
    ShieldCheck,
    Repeat,
    Plus,
    Settings2,
    ArrowRight,
    Cpu,
    FileText,
    MessageSquare,
    Bot,
    ChevronRight,
    PlayCircle,
    Activity,
    Workflow,
    Webhook,
    User,
    Terminal,
    ArrowUpRight
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';

const StatCard = ({ title, value, icon: Icon, bg, trend }) => (
    <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 group">
        <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 blur-3xl transition-transform duration-700 group-hover:scale-150", bg)} />
        <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", bg)}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
                        <ArrowUpRight size={12} />
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</h3>
            </div>
        </CardContent>
    </Card>
);

export default function Index({ auth }) {
    const { language } = useAppStore();
    const automationCategories = [
        {
            title: t('financial_workflows', language),
            description: language === 'bn' ? "অটোমেটিক ইনভয়েস এবং পেমেন্ট রিমাইন্ডার।" : "Automate invoice Generation, late payment reminders, and expense approvals.",
            icon: <Zap size={24} />,
            count: 3,
            color: "text-amber-600 bg-amber-50 dark:bg-amber-500/10",
            border: "border-amber-100 dark:border-amber-500/20"
        },
        {
            title: t('hr_communication', language),
            description: language === 'bn' ? "টিমের সদস্যদের বার্তা এবং নোটিফিকেশন।" : "Birthday wishes, leave approval notifications, and payroll distribution.",
            icon: <MessageSquare size={24} />,
            count: 5,
            color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10",
            border: "border-indigo-100 dark:border-indigo-500/20"
        },
        {
            title: t('inventory_intelligence', language),
            description: language === 'bn' ? "মালামাল স্টক রিমাইন্ডার।" : "Auto-reorder alerts, stock discrepancy reports, and supplier pings.",
            icon: <Cpu size={24} />,
            count: 2,
            color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
            border: "border-emerald-100 dark:border-emerald-500/20"
        },
        {
            title: t('system_integrations', language),
            description: language === 'bn' ? "অন্যান্য অ্যাপের সাথে রোবট যুক্ত করুন।" : "Connect with Slack, Email, and WhatsApp for real-time notifications.",
            icon: <Webhook size={24} />,
            count: 4,
            color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10",
            border: "border-blue-100 dark:border-blue-500/20"
        }
    ];

    const activeAutomations = [
        { name: language === 'bn' ? "অটো ইনভয়েস রোবট" : "Recurring Invoice Bot", type: "Billing", status: "Active", lastRun: "daily", icon: <Repeat size={16} /> },
        { name: language === 'bn' ? "বাকি বিল রিমাইন্ডার" : "Overdue Payment Pings", type: "Reminder", status: "Active", lastRun: "daily", icon: <Bell size={16} /> },
        { name: language === 'bn' ? "মালামাল স্টক ওয়াচ" : "Low Stock Watchdog", type: "Inventory", status: "Active", lastRun: "hourly", icon: <Activity size={16} /> },
        { name: language === 'bn' ? "খরচ অনুমোদন" : "Expense Approval Flow", type: "Workflow", status: "Active", lastRun: "real-time", icon: <Workflow size={16} /> }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 shrink-0 transform -rotate-6">
                            <Bot size={28} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white uppercase leading-none">{t('automation_engine', language)}</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 font-semibold tracking-wide flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                {t('automation_desc', language)}
                            </p>
                        </div>
                    </div>
                    <Button className="h-14 px-10 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 text-white font-bold tracking-widest gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20 group uppercase">
                        <Plus size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                        {t('create_workflow', language)}
                    </Button>
                </div>
            }
        >
            <Head title={t('automation_engine', language)} />

            <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-1000">

                {/* 1. Hero / Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title={t('tasks_handled', language)}
                        value="1,284"
                        icon={Zap}
                        bg="bg-indigo-600"
                        trend="+12%"
                    />
                    <Card className="border-none shadow-sm rounded-[2rem] bg-white dark:bg-slate-900 overflow-hidden">
                        <CardContent className="p-8 h-full flex flex-col justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{language === 'bn' ? 'ইঞ্জিন লোড' : 'Current Engine Load'}</p>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">34%</span>
                                        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-lg uppercase tracking-wider">{language === 'bn' ? 'মাঝারি' : 'Stable'}</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden">
                                        <div className="w-[34%] h-full bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/20 transition-all duration-1000" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">34.2 ms {language === 'bn' ? 'দেরি' : 'Latency'}</span>
                                <Activity size={16} className="text-slate-300" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm rounded-[2rem] bg-indigo-600 text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 bg-white/10 rounded-full blur-3xl opacity-50" />
                        <CardContent className="p-8 h-full flex flex-col">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                                <ShieldCheck size={24} />
                            </div>
                            <h4 className="text-xl font-bold mb-2 uppercase tracking-tight">{language === 'bn' ? 'নিরাপত্তা ইন্টিগ্রেশন' : 'Security Protocol'}</h4>
                            <p className="text-xs font-medium text-white/70 leading-relaxed mb-8">
                                {language === 'bn' ? '৫০,০০০ টাকার উপরে খরচ করলে অনুমোদন লাগবে।' : 'System mandates manual bypass for high-value transactions exceeding ৳50,000.'}
                            </p>
                            <div className="mt-auto flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{language === 'bn' ? 'সুরক্ষিত' : 'Active & Secured'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* 2. Automation Categories Grid */}
                    <div className="lg:col-span-8 space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-3">
                                    <span className="w-8 h-1 bg-indigo-600 rounded-full" />
                                    {t('automation_modules', language)}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Cloud Sync</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {automationCategories.map((cat, i) => (
                                    <Card key={i} className="border-none bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group rounded-[2rem] overflow-hidden">
                                        <CardContent className="p-8">
                                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110", cat.color)}>
                                                {cat.icon}
                                            </div>
                                            <h4 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-3 uppercase">{cat.title}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mb-8">{cat.description}</p>
                                            <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                    {cat.count} {language === 'bn' ? 'অটো কাজ' : 'Workflows'}
                                                </span>
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                    <ArrowRight size={18} />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity Log */}
                        <Card className="border-none bg-white dark:bg-slate-900 shadow-sm rounded-[2rem] border border-slate-100 dark:border-slate-800">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                            <Terminal size={20} />
                                        </div>
                                        {t('execution_log', language)}
                                    </h3>
                                    <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600">
                                        Clear History
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/50 group hover:border-indigo-500/20 transition-all">
                                        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-lg uppercase tracking-tight">14:55:02</span>
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                                                <span className="font-bold text-slate-900 dark:text-white mr-2">[FINANCE]</span>
                                                {language === 'bn' ? '১৪ জন কর্মীর বেতন রেডি করা হয়েছে।' : 'Monthly payroll matrix generated for 14 employees.'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/50 group hover:border-indigo-500/20 transition-all">
                                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg uppercase tracking-tight">14:20:19</span>
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                                                <span className="font-bold text-slate-900 dark:text-white mr-2">[INVENTORY]</span>
                                                {language === 'bn' ? 'মালামাল অর্ডার করার জন্য নোটিফিকেশন পাঠানো হয়েছে।' : 'High-demand stock reorder trigger sent to Global Tech.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 3. Active Automations Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="border-none bg-white dark:bg-slate-900 shadow-sm rounded-[2rem] p-4 lg:sticky lg:top-10">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 px-4 pt-4">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        {t('running_scripts', language)}
                                    </h3>
                                </div>

                                <div className="space-y-4 px-4 pb-4">
                                    {activeAutomations.map((item, i) => (
                                        <div key={i} className="group cursor-pointer">
                                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm transition-colors">
                                                        {item.icon}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{item.name}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">{item.type} • {item.lastRun}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button variant="outline" className="w-full mt-4 h-14 rounded-2xl border-dashed border-2 font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 hover:border-indigo-500/30 transition-all">
                                    <Plus size={14} className="mr-2" />
                                    Expand Stack
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Visual Workflow Designer CTA */}
                        <Card className="border-none bg-slate-900 dark:bg-slate-950 text-white rounded-[2rem] overflow-hidden group shadow-2xl">
                            <CardContent className="p-8 relative">
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600 opacity-20 blur-3xl rounded-full" />
                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform">
                                    <Workflow size={28} className="text-indigo-400" />
                                </div>
                                <h4 className="text-2xl font-bold tracking-tight mb-4 uppercase">{t('custom_logic', language)}</h4>
                                <p className="text-xs font-semibold text-slate-400 leading-relaxed mb-10">
                                    {language === 'bn' ? 'সিস্টেমকে নিজের মতো করে সাজিয়ে নিতে ড্যাশবোর্ড থেকে সাহায্য নিন।' : 'Define custom triggers and specific business actions to build a bespoke workflow engine.'}
                                </p>
                                <Button className="w-full h-12 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold uppercase tracking-widest text-[10px]">
                                    {t('open_visual_editor', language)}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

