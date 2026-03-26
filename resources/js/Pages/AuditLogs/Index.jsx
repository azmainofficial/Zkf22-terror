import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { FileText, Download, Search, Filter, Calendar, User, Activity, Eye } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function Index({ auth, logs, actions, types, filters }) {
    const { language } = useAppStore();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedAction, setSelectedAction] = useState(filters.action || '');
    const [selectedType, setSelectedType] = useState(filters.type || '');
    const [selectedUser, setSelectedUser] = useState(filters.user_id || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const tr = (en, bn) => language === 'bn' ? bn : en;

    const handleFilter = () => {
        router.get(route('audit-logs.index'), {
            search: searchTerm,
            action: selectedAction,
            type: selectedType,
            user_id: selectedUser,
            start_date: startDate,
            end_date: endDate,
        }, {
            preserveState: true,
        });
    };

    const handleExport = () => {
        window.location.href = route('audit-logs.export', {
            search: searchTerm,
            action: selectedAction,
            type: selectedType,
            user_id: selectedUser,
            start_date: startDate,
            end_date: endDate,
        });
    };

    const getActionColor = (action) => {
        const colors = {
            'created': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'updated': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'deleted': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            'viewed': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
            'accessed': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        };
        return colors[action] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    };

    const getActionIcon = (action) => {
        const icons = {
            'created': '✓',
            'updated': '↻',
            'deleted': '✗',
            'viewed': '👁',
            'accessed': '→',
        };
        return icons[action] || '•';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Activity Log" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
                                {tr('Activity Log', 'কার্যকলাপ লগ')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2 text-base">
                                {tr('See who did what and when', 'কে কী করেছে এবং কখন তা দেখুন')}
                            </p>
                        </div>
                        <Button onClick={handleExport} variant="outline" className="gap-2">
                            <Download size={18} />
                            {tr('Export to CSV', 'CSV এ রপ্তানি করুন')}
                        </Button>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Search */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {tr('Search', 'অনুসন্ধান')}
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder={tr('Search activity...', 'কার্যকলাপ অনুসন্ধান করুন...')}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                        />
                                    </div>
                                </div>

                                {/* Action Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {tr('Action Type', 'কার্যের ধরন')}
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        value={selectedAction}
                                        onChange={(e) => setSelectedAction(e.target.value)}
                                    >
                                        <option value="">{tr('All Actions', 'সব কার্য')}</option>
                                        {actions.map(action => (
                                            <option key={action} value={action}>
                                                {action.charAt(0).toUpperCase() + action.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Type Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {tr('Item Type', 'আইটেমের ধরন')}
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                    >
                                        <option value="">{tr('All Types', 'সব ধরন')}</option>
                                        {types.map(type => (
                                            <option key={type} value={type}>
                                                {type ? type.split('\\').pop() : 'Unknown'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Start Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {tr('From Date', 'তারিখ থেকে')}
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>

                                {/* End Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {tr('To Date', 'তারিখ পর্যন্ত')}
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>

                                {/* Filter Button */}
                                <div className="flex items-end">
                                    <Button onClick={handleFilter} className="w-full gap-2">
                                        <Filter size={16} />
                                        {tr('Apply Filters', 'ফিল্টার প্রয়োগ করুন')}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Timeline */}
                    <Card>
                        <CardContent className="p-6">
                            {logs.data && logs.data.length > 0 ? (
                                <div className="space-y-4">
                                    {logs.data.map((log) => (
                                        <div
                                            key={log.id}
                                            className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
                                        >
                                            {/* Timeline Dot */}
                                            <div className="flex flex-col items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getActionColor(log.action)}`}>
                                                    {getActionIcon(log.action)}
                                                </div>
                                                <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2"></div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                                            {log.description || `${log.action} ${log.auditable_type?.split('\\').pop() || 'item'}`}
                                                        </h4>
                                                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                            <span className="flex items-center gap-1">
                                                                <User size={14} />
                                                                {log.user?.name || 'System'}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar size={14} />
                                                                {formatDate(log.created_at)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => router.get(route('audit-logs.show', log.id))}
                                                        className="gap-2"
                                                    >
                                                        <Eye size={14} />
                                                        {tr('Details', 'বিস্তারিত')}
                                                    </Button>
                                                </div>

                                                {/* Additional Info */}
                                                {log.auditable_type && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                        <Activity size={12} />
                                                        <span>{log.auditable_type.split('\\').pop()}</span>
                                                        {log.auditable_id && <span>#{log.auditable_id}</span>}
                                                    </div>
                                                )}

                                                {/* IP Address */}
                                                {log.ip_address && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        IP: {log.ip_address}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FileText className="mx-auto mb-4 text-gray-300" size={64} />
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {tr('No activity found', 'কোন কার্যকলাপ পাওয়া যায়নি')}
                                    </p>
                                </div>
                            )}

                            {/* Pagination */}
                            {logs.links && logs.links.length > 3 && (
                                <div className="mt-6 pt-6 border-t dark:border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                            {tr('Showing', 'দেখানো হচ্ছে')} {logs.from} {tr('to', 'থেকে')} {logs.to} {tr('of', 'এর')} {logs.total} {tr('activities', 'কার্যকলাপ')}
                                        </div>
                                        <div className="flex gap-2">
                                            {logs.links.map((link, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    disabled={!link.url}
                                                    className={`px-3 py-1 rounded ${link.active
                                                            ? 'bg-purple-600 text-white'
                                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-500 hover:text-white'}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
