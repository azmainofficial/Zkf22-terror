import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Users as UsersIcon, Plus, Edit, Trash2, Shield, Search, Filter } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function Index({ auth, users, roles, filters }) {
    const { language } = useAppStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedRole, setSelectedRole] = useState(filters.role || '');

    const tr = (en, bn) => language === 'bn' ? bn : en;

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [],
    });

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('users.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                createForm.reset();
            },
        });
    };

    const handleSearch = () => {
        router.get(route('users.index'), {
            search: searchTerm,
            role: selectedRole,
        }, {
            preserveState: true,
        });
    };

    const handleDelete = (user) => {
        if (confirm(`Are you sure you want to delete user "${user.name}"?`)) {
            router.delete(route('users.destroy', user.id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="User Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {tr('User Management', 'ব্যবহারকারী পরিচালনা')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {tr('Manage system users and their roles', 'সিস্টেম ব্যবহারকারী এবং তাদের ভূমিকা পরিচালনা করুন')}
                            </p>
                        </div>
                        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                            <Plus size={16} />
                            {tr('Create User', 'ব্যবহারকারী তৈরি করুন')}
                        </Button>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="p-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder={tr('Search by name or email...', 'নাম বা ইমেল দিয়ে অনুসন্ধান করুন...')}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                    </div>
                                </div>
                                <select
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                >
                                    <option value="">{tr('All Roles', 'সব ভূমিকা')}</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.name}>{role.display_name}</option>
                                    ))}
                                </select>
                                <Button onClick={handleSearch} className="gap-2">
                                    <Filter size={16} />
                                    {tr('Filter', 'ফিল্টার')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Users Table */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {tr('User', 'ব্যবহারকারী')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {tr('Email', 'ইমেল')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {tr('Roles', 'ভূমিকা')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {tr('Created', 'তৈরি হয়েছে')}
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {tr('Actions', 'কার্যক্রম')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                        {users.data.map(user => (
                                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                            <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {user.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-gray-100">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roles && user.roles.length > 0 ? (
                                                            user.roles.map(role => (
                                                                <span
                                                                    key={role.id}
                                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                                >
                                                                    {role.display_name}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                {tr('No roles', 'কোন ভূমিকা নেই')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.get(route('users.show', user.id))}
                                                            className="gap-2"
                                                        >
                                                            <Edit size={14} />
                                                            {tr('Edit', 'সম্পাদনা')}
                                                        </Button>
                                                        {user.id !== auth.user.id && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDelete(user)}
                                                                className="gap-2 text-red-600 hover:text-red-700"
                                                            >
                                                                <Trash2 size={14} />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {users.links && users.links.length > 3 && (
                                <div className="px-6 py-4 border-t dark:border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                            {tr('Showing', 'দেখানো হচ্ছে')} {users.from} {tr('to', 'থেকে')} {users.to} {tr('of', 'এর')} {users.total} {tr('users', 'ব্যবহারকারী')}
                                        </div>
                                        <div className="flex gap-2">
                                            {users.links.map((link, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    disabled={!link.url}
                                                    className={`px-3 py-1 rounded ${link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 hover:text-white'}`}
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

            {/* Create User Modal */}
            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="lg">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                        {tr('Create New User', 'নতুন ব্যবহারকারী তৈরি করুন')}
                    </h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <InputLabel value={tr('Name', 'নাম')} />
                            <TextInput
                                type="text"
                                className="w-full"
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                required
                            />
                            <InputError message={createForm.errors.name} />
                        </div>

                        <div>
                            <InputLabel value={tr('Email', 'ইমেল')} />
                            <TextInput
                                type="email"
                                className="w-full"
                                value={createForm.data.email}
                                onChange={(e) => createForm.setData('email', e.target.value)}
                                required
                            />
                            <InputError message={createForm.errors.email} />
                        </div>

                        <div>
                            <InputLabel value={tr('Password', 'পাসওয়ার্ড')} />
                            <TextInput
                                type="password"
                                className="w-full"
                                value={createForm.data.password}
                                onChange={(e) => createForm.setData('password', e.target.value)}
                                required
                            />
                            <InputError message={createForm.errors.password} />
                        </div>

                        <div>
                            <InputLabel value={tr('Confirm Password', 'পাসওয়ার্ড নিশ্চিত করুন')} />
                            <TextInput
                                type="password"
                                className="w-full"
                                value={createForm.data.password_confirmation}
                                onChange={(e) => createForm.setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={createForm.errors.password_confirmation} />
                        </div>

                        <div>
                            <InputLabel value={tr('Assign Roles', 'ভূমিকা নির্ধারণ করুন')} />
                            <div className="mt-2 space-y-2">
                                {roles.map(role => (
                                    <label key={role.id} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={createForm.data.roles.includes(role.id)}
                                            onChange={(e) => {
                                                const roles = [...createForm.data.roles];
                                                if (e.target.checked) {
                                                    roles.push(role.id);
                                                } else {
                                                    const index = roles.indexOf(role.id);
                                                    roles.splice(index, 1);
                                                }
                                                createForm.setData('roles', roles);
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{role.display_name}</span>
                                    </label>
                                ))}
                            </div>
                            <InputError message={createForm.errors.roles} />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                                {tr('Cancel', 'বাতিল')}
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing ? tr('Creating...', 'তৈরি হচ্ছে...') : tr('Create User', 'ব্যবহারকারী তৈরি করুন')}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
