import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/Components/ui/Button';

export default function Create({ auth }) {
    const { language } = useAppStore();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        description: '',
        color: '#3b82f6',
        is_active: true
    });

    const tr = (en, bn) => language === 'bn' ? bn : en;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('expense-categories.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={tr('Create Category', 'নতুন ক্যাটাগরি')} />

            <div className="max-w-2xl mx-auto py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('expense-categories.index')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft size={20} className="text-gray-500" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                {tr('Create Category', 'নতুন ক্যাটাগরি তৈরি করুন')}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {tr('Add a new expense classification', 'নতুন খরচের খাত যোগ করুন')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {tr('Category Name', 'ক্যাটাগরির নাম')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder={tr('e.g. Office Supplies', 'যেমন: অফিস সামগ্রী')}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {tr('Category Code', 'ক্যাটাগরি কোড')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                    placeholder={tr('e.g. OFF-SUP', 'যেমন: OFF-SUP')}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                                    required
                                />
                                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {tr('Description', 'বর্ণনা')}
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder={tr('Brief description of this category...', 'এই ক্যাটাগরির সম্পর্কে সংক্ষিপ্ত বর্ণনা...')}
                                rows="3"
                                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {tr('Color Label', 'রঙ নির্বাচন করুন')}
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className="h-9 w-12 p-0 border border-gray-300 rounded overflow-hidden cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-mono"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 pt-8">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {tr('Active Status', 'সক্রিয় স্ট্যাটাস')}
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <Link href={route('expense-categories.index')}>
                                <Button type="button" variant="outline" className="text-gray-600">
                                    {tr('Cancel', 'বাতিল')}
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                                {processing ? tr('Saving...', 'সেভ হচ্ছে...') : (
                                    <span className="flex items-center gap-2">
                                        <Save size={16} />
                                        {tr('Save Category', 'সেভ করুন')}
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

