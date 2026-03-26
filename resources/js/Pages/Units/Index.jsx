import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    Ruler,
    X,
    Edit2,
    Trash2,
    Loader2,
    MoreVertical,
    Scale
} from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/Components/ui/DropdownMenu';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ auth, units = [] }) {
    const { language } = useAppStore();
    const [showModal, setShowModal] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        abbreviation: '',
        _method: 'POST'
    });

    const filteredUnits = units.filter(unit =>
        unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenCreate = () => {
        setEditingUnit(null);
        reset();
        clearErrors();
        setData('_method', 'POST');
        setShowModal(true);
    };

    const handleOpenEdit = (unit) => {
        setEditingUnit(unit);
        setData({
            name: unit.name,
            abbreviation: unit.abbreviation,
            _method: 'PATCH'
        });
        clearErrors();
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm(t('confirm_delete', language))) {
            router.delete(route('units.destroy', id));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const action = editingUnit
            ? route('units.update', editingUnit.id)
            : route('units.store');

        post(action, {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none shrink-0">
                            <Ruler size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">{t('units', language)}</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
                                {language === 'bn' ? 'ইউনিট বা পরিমাপের একক ম্যানেজ করুন।' : 'Manage measurement units.'}
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={handleOpenCreate}
                        className="h-11 md:h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-3 transition-all shadow-md active:scale-95"
                    >
                        <Plus size={18} />
                        {language === 'bn' ? 'ইউনিট যোগ করুন' : 'ADD UNIT'}
                    </Button>
                </div>
            }
        >
            <Head title={t('units', language)} />

            <div className="space-y-8 animate-in fade-in duration-700 pb-10">
                {/* Search Bar */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('search', language)}
                            className="w-full pl-12 pr-4 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Units Grid */}
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredUnits.map((unit) => (
                        <Card key={unit.id} className="group border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900">
                            <CardContent className="p-6 flex flex-col items-center text-center relative">
                                <div className="absolute top-4 right-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                <MoreVertical size={16} className="text-slate-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-xl border-slate-100 dark:border-slate-800 shadow-xl">
                                            <DropdownMenuItem onClick={() => handleOpenEdit(unit)} className="gap-2 cursor-pointer py-2.5 rounded-lg">
                                                <Edit2 size={14} className="text-blue-600" />
                                                <span className="font-semibold">{t('edit', language)}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(unit.id)} className="gap-2 cursor-pointer py-2.5 rounded-lg text-rose-600">
                                                <Trash2 size={14} />
                                                <span className="font-semibold">{t('delete', language)}</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 mt-2">
                                    <Scale size={32} />
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{unit.name}</h3>
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full mb-4">
                                    {unit.abbreviation}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {filteredUnits.length === 0 && (
                    <div className="py-24 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                        <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700 mb-6">
                            <Ruler size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{language === 'bn' ? 'কোনো ইউনিট পাওয়া যায়নি' : 'No units found'}</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 font-medium">
                            {language === 'bn' ? 'শুরু করতে একটি নতুন ইউনিট যোগ করুন।' : 'Create a new unit to get started.'}
                        </p>
                        <Button onClick={handleOpenCreate} className="rounded-xl px-8 h-12 bg-indigo-600 hover:bg-indigo-700 font-bold gap-2">
                            <Plus size={18} />
                            {t('add_new', language)}
                        </Button>
                    </div>
                )}
            </div>

            {/* Modal */}
            <Modal show={showModal} onClose={() => !processing && setShowModal(false)} maxWidth="lg">
                <div className="p-8 bg-white dark:bg-slate-950 rounded-[2.5rem]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {editingUnit ? (language === 'bn' ? 'ইউনিট এডিট করুন' : 'Edit Unit') : (language === 'bn' ? 'নতুন ইউনিট' : 'New Unit')}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">
                                {language === 'bn' ? 'সিলেক্টেড ইউনিটের তথ্য আপডেট করুন।' : 'Manage unit details.'}
                            </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setShowModal(false)} className="rounded-full h-10 w-10">
                            <X size={20} />
                        </Button>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{language === 'bn' ? 'ইউনিটের নাম' : 'Unit Name'} *</label>
                            <input
                                type="text"
                                required
                                className={cn(
                                    "w-full h-12 bg-slate-50 dark:bg-slate-900 border border-transparent rounded-[1rem] font-semibold text-sm px-5 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none",
                                    errors.name && "border-rose-500 ring-4 ring-rose-500/10"
                                )}
                                placeholder={language === 'bn' ? 'যেমন: Kilogram' : 'e.g. Kilogram'}
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-xs font-bold text-rose-500 ml-1">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{language === 'bn' ? 'সংক্ষিপ্ত রূপ' : 'Abbreviation'} *</label>
                            <input
                                type="text"
                                required
                                className={cn(
                                    "w-full h-12 bg-slate-50 dark:bg-slate-900 border border-transparent rounded-[1rem] font-semibold text-sm px-5 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none",
                                    errors.abbreviation && "border-rose-500 ring-4 ring-rose-500/10"
                                )}
                                placeholder={language === 'bn' ? 'যেমন: kg' : 'e.g. kg'}
                                value={data.abbreviation}
                                onChange={e => setData('abbreviation', e.target.value)}
                            />
                            {errors.abbreviation && <p className="text-xs font-bold text-rose-500 ml-1">{errors.abbreviation}</p>}
                        </div>

                        <div className="flex flex-col-reverse justify-end gap-3 mt-8 pt-6 border-t border-slate-50 dark:border-slate-800">
                            <Button
                                disabled={processing}
                                className="h-12 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin" size={18} />
                                        {language === 'bn' ? 'সেভ হচ্ছে...' : 'Saving...'}
                                    </span>
                                ) : (
                                    editingUnit ? (language === 'bn' ? 'আপডেট করুন' : 'Update Unit') : (language === 'bn' ? 'ইউনিট সেভ করুন' : 'Save Unit')
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
