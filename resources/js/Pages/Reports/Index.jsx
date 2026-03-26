import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import {
    Calendar,
    ArrowDownLeft,
    ArrowUpRight,
    TrendingUp,
    DollarSign,
    CreditCard,
    Briefcase,
    Filter,
    Download
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/lib/translations';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { format } from 'date-fns';
import { Button } from '@/Components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';

export default function ReportsIndex({ auth, summary, daily_data, monthly_data, filters }) {
    const { language } = useAppStore();
    const queryParams = new URLSearchParams(window.location.search);
    const initialView = queryParams.get('view') || 'overview'; // Default to overview

    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('reports.index'), {
            view: initialView,
            start_date: startDate,
            end_date: endDate
        }, { preserveState: true });
    };

    const getPageTitle = () => {
        if (initialView === 'daily') return t('daily_report', language);
        if (initialView === 'monthly') return t('monthly_report', language);
        return language === 'bn' ? 'আর্থিক প্রতিবেদন' : 'Financial Reports';
    };

    const StatCard = ({ title, value, icon: Icon, color, subValue }) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                        ৳{parseFloat(value).toLocaleString()}
                    </h3>
                    {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={getPageTitle()} />

            <div className="py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* Header & Filters */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {getPageTitle()}
                            </h1>
                            {initialView === 'overview' && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {language === 'bn'
                                        ? 'আপনার ব্যবসার সামগ্রিক অর্থনৈতিক অবস্থা'
                                        : 'Comprehensive overview of your business financials.'}
                                </p>
                            )}
                        </div>

                        <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {language === 'bn' ? 'শুরুর তারিখ' : 'Start Date'}
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {language === 'bn' ? 'শেষ তারিখ' : 'End Date'}
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-transparent"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 h-[38px]"
                            >
                                <Filter size={16} />
                                {language === 'bn' ? 'ফিল্টার' : 'Filter'}
                            </button>
                        </form>
                    </div>

                    {/* VIEW: OVERVIEW */}
                    {initialView === 'overview' && (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard
                                    title={language === 'bn' ? 'মোট কালেকশন' : 'Total Collection'}
                                    value={summary.new_collections}
                                    icon={ArrowDownLeft}
                                    color="bg-emerald-500"
                                />
                                <StatCard
                                    title={language === 'bn' ? 'অপারেশনাল খরচ' : 'Operational Expense'}
                                    value={summary.other_expenses}
                                    icon={ArrowUpRight}
                                    color="bg-orange-500"
                                />
                                <StatCard
                                    title={language === 'bn' ? 'বেতন খরচ' : 'Salary Expense'}
                                    value={summary.salary_expenses}
                                    icon={Briefcase}
                                    color="bg-rose-500"
                                />
                                <StatCard
                                    title={language === 'bn' ? 'নিট লাভ' : 'Net Profit'}
                                    value={summary.net_profit}
                                    icon={TrendingUp}
                                    color={summary.net_profit >= 0 ? "bg-indigo-600" : "bg-red-600"}
                                />
                                <StatCard
                                    title={language === 'bn' ? 'বকেয়া কালেকশন' : 'Due Collection'}
                                    value={summary.due_collection}
                                    icon={CreditCard}
                                    color="bg-amber-500"
                                    subValue={language === 'bn' ? 'বর্তমান বকেয়া' : 'Current Outstanding'}
                                />
                                <StatCard
                                    title={language === 'bn' ? 'মোট প্রাপ্য' : 'Total Receivable'}
                                    value={summary.total_receivable}
                                    icon={DollarSign}
                                    color="bg-blue-500"
                                    subValue={language === 'bn' ? 'কাস্টমারদের থেকে মোট পাওনা' : 'Total Receivable from Clients'}
                                />
                            </div>

                            {/* Charts Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Daily Breakdown Chart */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                        <Calendar size={18} className="text-indigo-600" />
                                        {language === 'bn' ? 'দৈনিক লেনদেন চিত্র' : 'Daily Transaction Overview'}
                                    </h3>
                                    <div className="h-80 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={daily_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                                <XAxis
                                                    dataKey="date"
                                                    tickFormatter={(str) => format(new Date(str), 'dd MMM')}
                                                    stroke="#9CA3AF"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <YAxis
                                                    stroke="#9CA3AF"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickFormatter={(value) => `${value / 1000}k`}
                                                />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                    formatter={(value) => [`৳${value.toLocaleString()}`, '']}
                                                />
                                                <Legend />
                                                <Area
                                                    type="monotone"
                                                    dataKey="income"
                                                    name={language === 'bn' ? 'আয়' : 'Income'}
                                                    stroke="#10b981"
                                                    fillOpacity={1}
                                                    fill="url(#colorIncome)"
                                                    strokeWidth={2}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="expense"
                                                    name={language === 'bn' ? 'ব্যয়' : 'Expense'}
                                                    stroke="#ef4444"
                                                    fillOpacity={1}
                                                    fill="url(#colorExpense)"
                                                    strokeWidth={2}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Monthly Comparison Chart */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                        <TrendingUp size={18} className="text-indigo-600" />
                                        {language === 'bn' ? 'মাসিক তুলনা (গত ৬ মাস)' : 'Monthly Comparison (Last 6 Months)'}
                                    </h3>
                                    <div className="h-80 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={monthly_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                                <XAxis
                                                    dataKey="month"
                                                    stroke="#9CA3AF"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <YAxis
                                                    stroke="#9CA3AF"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickFormatter={(value) => `${value / 1000}k`}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: 'transparent' }}
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                    formatter={(value) => [`৳${value.toLocaleString()}`, '']}
                                                />
                                                <Legend />
                                                <Bar
                                                    dataKey="income"
                                                    name={language === 'bn' ? 'আয়' : 'Income'}
                                                    fill="#10b981"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                                <Bar
                                                    dataKey="expense"
                                                    name={language === 'bn' ? 'ব্যয়' : 'Expense'}
                                                    fill="#ef4444"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* VIEW: DAILY */}
                    {initialView === 'daily' && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-end mb-6">
                                <a href={route('reports.export.daily', { start_date: startDate, end_date: endDate })}>
                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                        <Download size={16} />
                                        {language === 'bn' ? 'দৈনিক রিপোর্ট (XLS)' : 'Export Daily (XLS)'}
                                    </Button>
                                </a>
                            </div>

                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{language === 'bn' ? 'তারিখ' : 'Date'}</TableHead>
                                            <TableHead className="text-right">{language === 'bn' ? 'মোট কালেকশন' : 'Total Collection'}</TableHead>
                                            <TableHead className="text-right">{language === 'bn' ? 'প্রজেক্ট কালেকশন' : 'Project Collection'}</TableHead>
                                            <TableHead className="text-right">{language === 'bn' ? 'নতুন বকেয়া' : 'New Dues'}</TableHead>
                                            <TableHead className="text-right">{language === 'bn' ? 'বেতন প্রদান' : 'Salary Paid'}</TableHead>
                                            <TableHead className="text-right">{language === 'bn' ? 'অপারেশনাল খরচ' : 'Operational Exp'}</TableHead>
                                            <TableHead className="text-right">{language === 'bn' ? 'নিট লাভ' : 'Net Profit'}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {daily_data.length > 0 ? (
                                            daily_data.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{format(new Date(item.date), 'dd MMM yyyy')}</TableCell>
                                                    <TableCell className="text-right text-emerald-600 font-medium">৳{parseFloat(item.total_collection).toLocaleString()}</TableCell>
                                                    <TableCell className="text-right text-blue-600 font-medium">৳{parseFloat(item.project_collection).toLocaleString()}</TableCell>
                                                    <TableCell className="text-right text-amber-600 font-medium">৳{parseFloat(item.new_invoice_amount).toLocaleString()}</TableCell>
                                                    <TableCell className="text-right text-rose-500 font-medium">৳{parseFloat(item.salary_paid).toLocaleString()}</TableCell>
                                                    <TableCell className="text-right text-orange-500 font-medium">৳{parseFloat(item.operational_expense).toLocaleString()}</TableCell>
                                                    <TableCell className={`text-right font-bold ${item.net_profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        ৳{parseFloat(item.net_profit).toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center h-24">
                                                    {language === 'bn' ? 'কোন তথ্য পাওয়া যায়নি' : 'No data found for this period'}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {/* VIEW: MONTHLY */}
                    {initialView === 'monthly' && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-end mb-6">
                                <a href={route('reports.export.monthly', { start_date: startDate, end_date: endDate })}>
                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                        <Download size={16} />
                                        {language === 'bn' ? 'মাসিক রিপোর্ট (XLS)' : 'Export Monthly (XLS)'}
                                    </Button>
                                </a>
                            </div>

                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{language === 'bn' ? 'মাস' : 'Month'}</TableHead>
                                            <TableHead className="text-right">{language === 'bn' ? 'মোট কালেকশন' : 'Total Collection'}</TableHead>
                                            <TableHead className="text-right">{language === 'bn' ? 'প্রজেক্ট কালেকশন' : 'Project Collection'}</TableHead>
                                            <TableHead className="text-right">{language === 'bn' ? 'নতুন বকেয়া' : 'New Dues'}</TableHead>
                                            <TableHead className="text-right">{language === 'bn' ? 'বেতন প্রদান' : 'Salary Paid'}</TableHead>
                                            <TableHead className="text-right">{language === 'bn' ? 'অপারেশনাল খরচ' : 'Operational Exp'}</TableHead>
                                            <TableHead className="text-right">{language === 'bn' ? 'নিট লাভ' : 'Net Profit'}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {monthly_data.length > 0 ? (
                                            monthly_data.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.month}</TableCell>
                                                    <TableCell className="text-right text-emerald-600 font-medium">৳{parseFloat(item.total_collection).toLocaleString()}</TableCell>
                                                    <TableCell className="text-right text-blue-600 font-medium">৳{parseFloat(item.project_collection).toLocaleString()}</TableCell>
                                                    <TableCell className="text-right text-amber-600 font-medium">৳{parseFloat(item.new_invoice_amount).toLocaleString()}</TableCell>
                                                    <TableCell className="text-right text-rose-500 font-medium">৳{parseFloat(item.salary_paid).toLocaleString()}</TableCell>
                                                    <TableCell className="text-right text-orange-500 font-medium">৳{parseFloat(item.operational_expense).toLocaleString()}</TableCell>
                                                    <TableCell className={`text-right font-bold ${item.net_profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        ৳{parseFloat(item.net_profit).toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center h-24">
                                                    {language === 'bn' ? 'কোন তথ্য পাওয়া যায়নি' : 'No data found'}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
