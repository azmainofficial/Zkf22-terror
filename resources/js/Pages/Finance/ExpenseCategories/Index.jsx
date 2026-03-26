import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    CheckCircle2,
    XCircle,
    Layers
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/Button';

export default function Index({ auth, categories, filters }) {
    const { language } = useAppStore();
    const [search, setSearch] = useState(filters.search || '');

    // Local translations helper to ensure all strings are covered immediately
    const tr = (en, bn) => language === 'bn' ? bn : en;

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('expense-categories.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm(tr('Are you sure you want to delete this category?', 'আপনি কি এই ক্যাটাগরিটি মুছে ফেলতে চান?'))) {
            router.delete(route('expense-categories.destroy', id), {
                preserveScroll: true
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            {tr('Expense Categories', 'ব্যয় ক্যাটাগরি')}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {tr('Manage your expense classifications', 'আপনার খরচের খাতগুলো পরিচালনা করুন')}
                        </p>
                    </div>
                    <Link href={route('expense-categories.create')}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2">
                            <Plus size={18} />
                            {tr('Add New', 'নতুন তৈরি করুন')}
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title={tr('Expense Categories', 'ব্যয় ক্যাটাগরি')} />

            <div className="py-6 space-y-6">
                {/* Search Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={tr('Search by name or code...', 'নাম বা কোড দিয়ে খুঁজুন...')}
                            className="w-full pl-10 pr-4 h-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <Button onClick={handleSearch} variant="secondary" className="h-10 px-6">
                        {tr('Search', 'অনুসন্ধান')}
                    </Button>
                </div>

                {/* Categories Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        {tr('Name', 'নাম')}
                                    </th>
                                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        {tr('Code', 'কোড')}
                                    </th>
                                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        {tr('Description', 'বর্ণনা')}
                                    </th>
                                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">
                                        {tr('Status', 'অবস্থা')}
                                    </th>
                                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">
                                        {tr('Records', 'রেকর্ড')}
                                    </th>
                                    <th className="px-6 py-3 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {categories.data && categories.data.length > 0 ? (
                                    categories.data.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: category.color || '#cbd5e1' }}
                                                    />
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {category.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs font-mono font-medium text-gray-700 dark:text-gray-300">
                                                    {category.code}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-500">
                                                {category.description || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {category.is_active ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                                        <CheckCircle2 size={12} /> {tr('Active', 'সক্রিয়')}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                                                        <XCircle size={12} /> {tr('Inactive', 'নিষ্ক্রিয়')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-500">
                                                {category.expenses_count || 0}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={route('expense-categories.edit', category.id)} className="p-2 text-gray-400 hover:text-blue-600 rounded-md transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                                        <Edit size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(category.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 rounded-md transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            <Layers className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                                            <p>{tr('No categories found', 'কোনো ক্যাটাগরি পাওয়া যায়নি')}</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {categories.links && categories.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                            <div className="flex flex-wrap gap-1">
                                {categories.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={cn(
                                            "px-3 py-1 rounded-md text-sm transition-colors",
                                            link.active
                                                ? "bg-blue-600 text-white"
                                                : link.url
                                                    ? "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                                                    : "text-gray-400 cursor-not-allowed"
                                        )}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

