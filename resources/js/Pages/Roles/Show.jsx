import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Shield, Users, Key, Save, ArrowLeft, Lock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function Show({ auth, role, allPermissions }) {
    const { language } = useAppStore();
    const tr = (en, bn) => language === 'bn' ? bn : en;

    const form = useForm({
        display_name: role.display_name,
        description: role.description || '',
        permissions: role.permissions.map(p => p.id),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.put(route('roles.update', role.id), {
            preserveScroll: true,
        });
    };

    const togglePermission = (permissionId) => {
        const permissions = [...form.data.permissions];
        const index = permissions.indexOf(permissionId);

        if (index > -1) {
            permissions.splice(index, 1);
        } else {
            permissions.push(permissionId);
        }

        form.setData('permissions', permissions);
    };

    const toggleGroupPermissions = (groupPermissions) => {
        const groupIds = groupPermissions.map(p => p.id);
        const allSelected = groupIds.every(id => form.data.permissions.includes(id));

        let newPermissions = [...form.data.permissions];

        if (allSelected) {
            // Remove all group permissions
            newPermissions = newPermissions.filter(id => !groupIds.includes(id));
        } else {
            // Add all group permissions
            groupIds.forEach(id => {
                if (!newPermissions.includes(id)) {
                    newPermissions.push(id);
                }
            });
        }

        form.setData('permissions', newPermissions);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Manage Role: ${role.display_name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Button
                            variant="outline"
                            onClick={() => router.get(route('roles.index'))}
                            className="gap-2 mb-4"
                        >
                            <ArrowLeft size={16} />
                            {tr('Back to Roles', 'ভূমিকায় ফিরে যান')}
                        </Button>

                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <Shield className="text-blue-600 dark:text-blue-400" size={32} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    {role.display_name}
                                    {role.is_system && (
                                        <Lock size={20} className="text-blue-500" title="System Role" />
                                    )}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {role.name} • {role.users?.length || 0} {tr('users', 'ব্যবহারকারী')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Role Details */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{tr('Role Details', 'ভূমিকার বিবরণ')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <InputLabel value={tr('Display Name', 'প্রদর্শন নাম')} />
                                            <TextInput
                                                type="text"
                                                className="w-full"
                                                value={form.data.display_name}
                                                onChange={(e) => form.setData('display_name', e.target.value)}
                                                disabled={role.is_system}
                                                required
                                            />
                                            <InputError message={form.errors.display_name} />
                                        </div>

                                        <div>
                                            <InputLabel value={tr('Description', 'বিবরণ')} />
                                            <textarea
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                rows="4"
                                                value={form.data.description}
                                                onChange={(e) => form.setData('description', e.target.value)}
                                            />
                                            <InputError message={form.errors.description} />
                                        </div>

                                        <div className="pt-4 border-t dark:border-gray-700">
                                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                                <p><strong>{tr('Role Name:', 'ভূমিকার নাম:')}</strong> {role.name}</p>
                                                <p><strong>{tr('System Role:', 'সিস্টেম ভূমিকা:')}</strong> {role.is_system ? tr('Yes', 'হ্যাঁ') : tr('No', 'না')}</p>
                                                <p><strong>{tr('Permissions:', 'অনুমতি:')}</strong> {form.data.permissions.length}</p>
                                            </div>
                                        </div>

                                        <Button type="submit" disabled={form.processing} className="w-full gap-2">
                                            <Save size={16} />
                                            {form.processing ? tr('Saving...', 'সংরক্ষণ হচ্ছে...') : tr('Save Changes', 'পরিবর্তন সংরক্ষণ করুন')}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Users with this role */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users size={18} />
                                        {tr('Users', 'ব্যবহারকারী')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {role.users && role.users.length > 0 ? (
                                        <div className="space-y-2">
                                            {role.users.map(user => (
                                                <div key={user.id} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                                                    <div>
                                                        <p className="font-medium text-sm">{user.name}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {tr('No users assigned to this role', 'এই ভূমিকায় কোন ব্যবহারকারী নেই')}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Permissions */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Key size={18} />
                                        {tr('Permissions', 'অনুমতি')}
                                    </CardTitle>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {tr('Select permissions for this role', 'এই ভূমিকার জন্য অনুমতি নির্বাচন করুন')}
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {Object.entries(allPermissions).map(([group, permissions]) => {
                                            const groupPermissions = permissions;
                                            const allSelected = groupPermissions.every(p => form.data.permissions.includes(p.id));
                                            const someSelected = groupPermissions.some(p => form.data.permissions.includes(p.id));

                                            return (
                                                <div key={group} className="border dark:border-gray-700 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                                                            {group.replace('_', ' ')}
                                                        </h3>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => toggleGroupPermissions(groupPermissions)}
                                                        >
                                                            {allSelected ? tr('Deselect All', 'সব বাতিল করুন') : tr('Select All', 'সব নির্বাচন করুন')}
                                                        </Button>
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-3">
                                                        {groupPermissions.map(permission => (
                                                            <label
                                                                key={permission.id}
                                                                className="flex items-center gap-3 p-3 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={form.data.permissions.includes(permission.id)}
                                                                    onChange={() => togglePermission(permission.id)}
                                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                                />
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                                                        {permission.display_name}
                                                                    </p>
                                                                    {permission.description && (
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                            {permission.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
