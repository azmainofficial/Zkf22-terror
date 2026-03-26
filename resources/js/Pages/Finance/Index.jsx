import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard,
    FileText,
    Wallet,
    TrendingUp,
    TrendingDown,
    Plus,
    ChevronRight,
    Search,
    Filter,
    Activity,
    Calendar,
    ArrowLeftRight,
    PieChart,
    BarChart3,
    Clock,
    Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/lib/translations';

export default function Index({ auth, stats, recent_expenses }) {
    const { language } = useAppStore();
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(amount).replace('BDT', '৳');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-rose-600 to-rose-400 rounded-2xl flex items-center justify-center text-white shadow-[0_8px_30px_rgb(225,29,72,0.3)] shrink-0 transform hover:rotate-6 transition-transform relative overflow-hidden group">
                            <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-500" />
                            <DollarSign size={28} className="relative z-10" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight leading-none text-slate-900 dark:text-white">
                                {t('finance_dashboard', language)}
                            </h2>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-muted-foreground text-[10px] uppercase font-semibold tracking-wider">
                                    {t('liquidity_status', language)} • SYSTEM ONLINE
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href={route('expenses.create')}>
                            <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 h-14 px-8 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-wider">
                                <Plus size={18} /> {t('add_expense', language)}
                            </button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Finance Command Center" />

            <div className="relative max-w-7xl mx-auto space-y-10 pb-20 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">

                {/* Background Aesthetics */}
                <div className="fixed inset-0 pointer-events-none opacity-40 overflow-hidden">
                    <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
                </div>

                {/* 1. Primary Stats Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    <StatCard
                        title={t('total_expenses', language) || t('expenses', language)}
                        value={stats.total_expenses}
                        change="+4.2%"
                        isPositive={false}
                        icon={<TrendingDown className="text-rose-500" />}
                        color="from-rose-500/5 to-rose-500/[0.02] border-rose-500/10 hover:border-rose-500/30"
                        formatCurrency={formatCurrency}
                        language={language}
                        glow="bg-rose-500/20"
                    />
                    <StatCard
                        title={t('pending_approval', language)}
                        value={recent_expenses.filter(e => e.status === 'pending').reduce((acc, curr) => acc + parseFloat(curr.amount), 0)}
                        change="ACTION REQUIRED"
                        isPositive={false}
                        icon={<Clock className="text-amber-500" />}
                        color="from-amber-500/5 to-amber-500/[0.02] border-amber-500/10 hover:border-amber-500/30"
                        formatCurrency={formatCurrency}
                        language={language}
                        glow="bg-amber-500/20"
                    />
                    <StatCard
                        title={t('mtd_expenses', language) || 'THIS PERIOD'}
                        value={stats.total_expenses}
                        change="ACTIVE SCAN"
                        isPositive={true}
                        icon={<Activity className="text-blue-500" />}
                        color="from-blue-500/5 to-blue-500/[0.02] border-blue-500/10 hover:border-blue-500/30"
                        formatCurrency={formatCurrency}
                        language={language}
                        glow="bg-blue-500/20"
                    />
                </div>

                {/* 2. Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

                    {/* Recent Expenses Terminal */}
                    <div className="lg:col-span-8 space-y-6">
                        <SectionHeader title={t('recent_activity', language)} icon={<Activity size={20} />} language={language} />

                        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-8 py-6 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t('transaction', language)}</th>
                                        <th className="px-8 py-6 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t('date', language)}</th>
                                        <th className="px-8 py-6 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t('status', language)}</th>
                                        <th className="px-8 py-6 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t('amount', language)}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50">
                                    {recent_expenses.length > 0 ? recent_expenses.map((expense) => (
                                        <tr key={expense.id} className="group hover:bg-white/60 dark:hover:bg-slate-800 transition-all duration-300">
                                            <td className="px-8 py-7">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-slate-100 dark:border-slate-800">
                                                        <TrendingDown size={20} className="text-rose-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white uppercase leading-none">{expense.title}</p>
                                                        <p className="text-[10px] font-medium text-slate-400 mt-2 uppercase tracking-wider">{expense.category?.name || 'General'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7 text-sm font-bold text-slate-500 dark:text-slate-400 italic">
                                                {new Date(expense.date || expense.expense_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-7">
                                                <span className={cn(
                                                    "px-4 py-1.5 text-[10px] font-bold uppercase rounded-xl border flex items-center gap-2 w-fit",
                                                    expense.status === 'approved'
                                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                                )}>
                                                    <span className={cn("w-1.5 h-1.5 rounded-full", expense.status === 'approved' ? "bg-emerald-500" : "bg-amber-500")} />
                                                    {expense.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-7 text-right">
                                                <p className="text-base font-bold text-rose-600">
                                                    -{formatCurrency(expense.amount)}
                                                </p>
                                                <p className="text-[10px] font-medium text-slate-300 uppercase tracking-wider">OUTFLOW</p>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-400 italic font-bold">No active expense data detected.</td></tr>
                                    )}
                                </tbody>
                            </table>
                            <div className="p-8 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800">
                                <Link href={route('expenses.index')} className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors flex items-center justify-center gap-3">
                                    [ ACCESS FULL ARCHIVES ] <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Intelligence Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <SectionHeader title={t('financial_tools', language)} icon={<PieChart size={20} />} language={language} />

                        <div className="grid grid-cols-1 gap-4">
                            <ToolButton
                                title={t('expenses', language)}
                                description="Track all operational outflows"
                                icon={<ArrowDownRight className="text-rose-500" />}
                                href={route('expenses.index')}
                                language={language}
                                color="hover:border-rose-500/30 group-hover:bg-rose-500/5"
                            />
                            <ToolButton
                                title={t('categories', language)}
                                description="Organize your spending types"
                                icon={<Tag className="text-amber-500" />}
                                href={route('expense-categories.index')}
                                language={language}
                                color="hover:border-amber-500/30 group-hover:bg-amber-500/5"
                            />
                            <ToolButton
                                title={t('payment_methods', language)}
                                description="Manage your financial channels"
                                icon={<CreditCard className="text-emerald-500" />}
                                href={route('payment-methods.index')}
                                language={language}
                                color="hover:border-emerald-500/30 group-hover:bg-emerald-500/5"
                            />
                        </div>

                        {/* Liquid Control Hub */}
                        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-[0_30px_60px_rgba(0,0,0,0.3)]">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/20 blur-[100px] pointer-events-none group-hover:bg-rose-600/30 transition-colors duration-700" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/10 blur-[80px] pointer-events-none" />

                            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-3">
                                <CreditCard size={14} className="text-rose-500" /> {t('expense_management', language) || 'EXPENSE CONTROL HUB'}
                            </h4>

                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{t('outflow', language) || 'TOTAL OUT'}</p>
                                            <span className="text-4xl font-bold tracking-tight">
                                                {formatCurrency(stats.total_expenses)}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest border border-rose-500/30 px-2 py-0.5 rounded">45.2%</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                        <div className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all duration-1000 w-[45%]" />
                                    </div>
                                    <p className="text-[11px] font-medium text-slate-400 mt-4 leading-relaxed">
                                        {language === 'bn' ? 'আপনার বর্তমান খরচ বাজেটের ৪৫% অতিক্রম করেছে। লেনদেনের গতিবিধি স্থিতিশীল রয়েছে।' : "Outflows are currently at 45.2% of projected monthly limits. System status: STABLE."}
                                    </p>
                                </div>

                                <Link href={route('expenses.index')} className="block group/btn">
                                    <button className="w-full py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold uppercase tracking-widest transition-all border border-white/10 group-hover/btn:border-rose-500/50 shadow-lg">
                                        {t('view_all_expenses', language) || 'INITIALIZE MANAGEMENT'}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, change, isPositive, icon, color, formatCurrency, language, glow }) {
    return (
        <div className={cn(
            "p-8 rounded-[2.5rem] border bg-gradient-to-br shadow-sm transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl cursor-default group relative overflow-hidden",
            color
        )}>
            <div className={cn("absolute -top-12 -right-12 w-24 h-24 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity", glow)} />

            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/80 dark:bg-slate-900/80 flex items-center justify-center shadow-xl border border-white dark:border-slate-800 group-hover:scale-105 transition-transform">
                    {icon}
                </div>
                <div className={cn(
                    "px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider",
                    isPositive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                )}>
                    {change}
                </div>
            </div>

            <div className="relative z-10">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">{title}</h3>
                <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                    {formatCurrency(value)}
                </p>
            </div>

            <div className="mt-6 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative z-10 shadow-inner">
                <div className={cn("h-full transition-all duration-1000 w-[65%]", isPositive ? "bg-emerald-500" : "bg-rose-500")} />
            </div>
        </div>
    );
}

function ToolButton({ title, description, icon, href, language, color }) {
    return (
        <Link href={href} className={cn(
            "flex items-center gap-6 p-7 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl hover:bg-white dark:hover:bg-slate-900 transition-all hover:translate-x-3 group shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none",
            color
        )}>
            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-xl group-hover:scale-110 transition-all shadow-inner border border-slate-100 dark:border-slate-800">
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none uppercase">{title}</p>
                <p className="text-[10px] font-semibold text-slate-400 mt-2 uppercase tracking-wider leading-none">{description}</p>
            </div>
            <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-all group-hover:translate-x-1" />
        </Link>
    );
}

function SectionHeader({ title, icon, language }) {
    return (
        <h3 className="text-xl font-bold tracking-tight flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="w-10 h-10 rounded-xl bg-slate-900/5 dark:bg-white/5 flex items-center justify-center text-slate-900 dark:text-white">
                {icon}
            </div>
            {title.toUpperCase()}
        </h3>
    );
}

