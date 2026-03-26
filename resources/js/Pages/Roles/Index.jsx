import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Shield, Users, Key, Plus, Edit, Trash2, Lock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function Index({ auth, roles }) {
    const { language } = useAppStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingRole, setEditingRole] = useState(null);

    const tr = (en, bn) => language === 'bn' ? bn : en;

    const createForm = useForm({
        name: '',
        display_name: '',
        description: '',
    });

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('roles.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                createForm.reset();
            },
        });
    };

    const handleDelete = (role) => {
        if (role.is_system) {
            alert('Cannot delete system roles');
            return;
        }

        if (confirm(`Are you sure you want to delete the role "${role.display_name}"?`)) {
            router.delete(route('roles.destroy', role.id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Roles & Permissions" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {tr('Roles & Permissions', 'ভূমিকা এবং অনুমতি')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {tr('Manage user roles and their permissions', 'ব্যবহারকারীর ভূমিকা এবং অনুমতি পরিচালনা করুন')}
                            </p>
                        </div>
                        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                            <Plus size={16} />
                            {tr('Create Role', 'ভূমিকা তৈরি করুন')}
                        </Button>
                    </div>

                    {/* Roles Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {roles.map((role) => (
                            <Card key={role.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-3 rounded-lg ${role.is_system
                                                ? 'bg-blue-100 dark:bg-blue-900/30'
                                                : 'bg-gray-100 dark:bg-gray-800'
                                                }`}>
                                                <Shield className={
                                                    role.is_system
                                                        ? 'text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-600 dark:text-gray-400'
                                                } size={24} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    {role.display_name}
                                                    {role.is_system && (
                                                        <Lock size={14} className="text-blue-500" title="System Role" />
                                                    )}
                                                </CardTitle>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {role.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {role.description || 'No description'}
                                    </p>

                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <Users size={16} />
                                            <span>{role.users_count || 0} {tr('users', 'ব্যবহারকারী')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <Key size={16} />
                                            <span>{role.permissions_count || 0} {tr('permissions', 'অনুমতি')}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-2 border-t dark:border-gray-700">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 gap-2"
                                            onClick={() => router.get(route('roles.show', role.id))}
                                        >
                                            <Edit size={14} />
                                            {tr('Manage', 'পরিচালনা')}
                                        </Button>
                                        {!role.is_system && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2 text-red-600 hover:text-red-700"
                                                onClick={() => handleDelete(role)}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State */}
                    {roles.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Shield className="mx-auto mb-4 text-gray-300" size={64} />
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    {tr('No roles found', 'কোন ভূমিকা পাওয়া যায়নি')}
                                </p>
                                <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                                    <Plus size={16} />
                                    {tr('Create First Role', 'প্রথম ভূমিকা তৈরি করুন')}
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Create Role Modal */}
            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="lg">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                        {tr('Create New Role', 'নতুন ভূমিকা তৈরি করুন')}
                    </h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <InputLabel value={tr('Role Name (slug)', 'ভূমিকার নাম (স্লাগ)')} />
                            <TextInput
                                type="text"
                                className="w-full"
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                placeholder="e.g., project_manager"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {tr('Lowercase, no spaces, use underscores', 'ছোট হাতের অক্ষর, স্পেস নেই, আন্ডারস্কোর ব্যবহার করুন')}
                            </p>
                            <InputError message={createForm.errors.name} />
                        </div>

                        <div>
                            <InputLabel value={tr('Display Name', 'প্রদর্শন নাম')} />
                            <TextInput
                                type="text"
                                className="w-full"
                                value={createForm.data.display_name}
                                onChange={(e) => createForm.setData('display_name', e.target.value)}
                                placeholder="e.g., Project Manager"
                                required
                            />
                            <InputError message={createForm.errors.display_name} />
                        </div>

                        <div>
                            <InputLabel value={tr('Description', 'বিবরণ')} />
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                rows="3"
                                value={createForm.data.description}
                                onChange={(e) => createForm.setData('description', e.target.value)}
                                placeholder={tr('Describe the role...', 'ভূমিকা বর্ণনা করুন...')}
                            />
                            <InputError message={createForm.errors.description} />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                                {tr('Cancel', 'বাতিল')}
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing ? tr('Creating...', 'তৈরি হচ্ছে...') : tr('Create Role', 'ভূমিকা তৈরি করুন')}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
