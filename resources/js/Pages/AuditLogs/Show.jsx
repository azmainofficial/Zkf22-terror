import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { ArrowLeft, User, Calendar, Activity, MapPin, Monitor, FileText } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function Show({ auth, log }) {
    const { language } = useAppStore();
    const tr = (en, bn) => language === 'bn' ? bn : en;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
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

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Activity Details" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Button
                            variant="outline"
                            onClick={() => router.get(route('audit-logs.index'))}
                            className="gap-2 mb-4"
                        >
                            <ArrowLeft size={16} />
                            {tr('Back to Activity Log', 'কার্যকলাপ লগে ফিরে যান')}
                        </Button>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {tr('Activity Details', 'কার্যকলাপের বিস্তারিত')}
                        </h2>
                    </div>

                    {/* Main Info Card */}
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">
                                    {log.description || `${log.action} ${log.auditable_type?.split('\\').pop() || 'item'}`}
                                </CardTitle>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getActionColor(log.action)}`}>
                                    {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* User Info */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <User className="text-blue-600 dark:text-blue-400" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {tr('Performed by', 'সম্পাদিত করেছেন')}
                                    </p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {log.user?.name || 'System'}
                                    </p>
                                    {log.user?.email && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {log.user.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Timestamp */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                    <Calendar className="text-purple-600 dark:text-purple-400" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {tr('When', 'কখন')}
                                    </p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {formatDate(log.created_at)}
                                    </p>
                                </div>
                            </div>

                            {/* Item Type */}
                            {log.auditable_type && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                        <Activity className="text-green-600 dark:text-green-400" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {tr('Item Type', 'আইটেমের ধরন')}
                                        </p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {log.auditable_type.split('\\').pop()}
                                        </p>
                                        {log.auditable_id && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                ID: {log.auditable_id}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* IP Address */}
                            {log.ip_address && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                        <MapPin className="text-orange-600 dark:text-orange-400" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {tr('IP Address', 'আইপি ঠিকানা')}
                                        </p>
                                        <p className="font-semibold text-gray-900 dark:text-white font-mono">
                                            {log.ip_address}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* User Agent */}
                            {log.user_agent && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/30">
                                        <Monitor className="text-pink-600 dark:text-pink-400" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {tr('Browser/Device', 'ব্রাউজার/ডিভাইস')}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-white break-all">
                                            {log.user_agent}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Changes Card */}
                    {(log.old_values || log.new_values) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText size={20} />
                                    {tr('Changes Made', 'পরিবর্তন করা হয়েছে')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Old Values */}
                                    {log.old_values && Object.keys(log.old_values).length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                                {tr('Before', 'আগে')}
                                            </h4>
                                            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                                                    {JSON.stringify(log.old_values, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                    )}

                                    {/* New Values */}
                                    {log.new_values && Object.keys(log.new_values).length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                                {tr('After', 'পরে')}
                                            </h4>
                                            <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                                                    {JSON.stringify(log.new_values, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
