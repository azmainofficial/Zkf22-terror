import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    Tag,
    X,
    Edit2,
    Trash2,
    CloudUpload,
    Loader2,
    MoreVertical,
    Building2,
    ExternalLink,
    Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/Card';
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
import { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ auth, brands = [] }) {
    const { language } = useAppStore();
    const [showModal, setShowModal] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
        logo: null,
        _method: 'POST'
    });

    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenCreate = () => {
        setEditingBrand(null);
        reset();
        clearErrors();
        setData('_method', 'POST');
        setShowModal(true);
    };

    const handleOpenEdit = (brand) => {
        setEditingBrand(brand);
        setData({
            name: brand.name,
            description: brand.description || '',
            logo: null,
            _method: 'PATCH'
        });
        clearErrors();
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm(t('confirm_delete', language))) {
            router.delete(route('brands.destroy', id));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const action = editingBrand
            ? route('brands.update', editingBrand.id)
            : route('brands.store');

        post(action, {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
            forceFormData: true,
        });
    };

    const [logoPreview, setLogoPreview] = useState(null);
    useEffect(() => {
        if (data.logo instanceof File) {
            const objectUrl = URL.createObjectURL(data.logo);
            setLogoPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setLogoPreview(null);
        }
    }, [data.logo]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none shrink-0">
                            <Tag size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">{t('brands', language)}</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
                                {t('manage_brands_desc', language)}
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={handleOpenCreate}
                        className="h-11 md:h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-3 transition-all shadow-md active:scale-95"
                    >
                        <Plus size={18} />
                        {language === 'bn' ? 'ব্র্যান্ড যোগ করুন' : 'ADD BRAND'}
                    </Button>
                </div>
            }
        >
            <Head title={t('brands', language)} />

            <div className="space-y-8 animate-in fade-in duration-700 pb-10">
                {/* Search & Filter Bar */}
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

                {/* Brands Grid */}
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredBrands.map((brand) => (
                        <Card key={brand.id} className="group border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900">
                            <CardContent className="p-6 flex flex-col items-center text-center relative">
                                <div className="absolute top-4 right-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                <MoreVertical size={16} className="text-slate-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-xl border-slate-100 dark:border-slate-800 shadow-xl">
                                            <DropdownMenuItem onClick={() => handleOpenEdit(brand)} className="gap-2 cursor-pointer py-2.5 rounded-lg">
                                                <Edit2 size={14} className="text-blue-600" />
                                                <span className="font-semibold">{t('edit', language)}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(brand.id)} className="gap-2 cursor-pointer py-2.5 rounded-lg text-rose-600">
                                                <Trash2 size={14} />
                                                <span className="font-semibold">{t('delete', language)}</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="w-24 h-24 rounded-3xl bg-slate-50 dark:bg-slate-800 p-1 mb-6 mt-2">
                                    <div className="w-full h-full rounded-[1.35rem] overflow-hidden bg-white dark:bg-slate-950 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                        {brand.logo ? (
                                            <img src={`/storage/${brand.logo}`} className="w-full h-full object-contain p-2" alt={brand.name} />
                                        ) : (
                                            <Building2 size={32} className="text-slate-200 dark:text-slate-700" />
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{brand.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[2.5rem] leading-relaxed mb-6 font-medium">
                                    {brand.description || (language === 'bn' ? 'এই ব্র্যান্ডের জন্য কোনো বিবরণ নেই।' : 'No description provided for this brand.')}
                                </p>

                                <div className="w-full pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                        ID #{brand.id}
                                    </div>
                                    <span>Verified Brand</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {filteredBrands.length === 0 && (
                    <div className="py-24 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                        <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700 mb-6">
                            <Tag size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('no_brands_found', language)}</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 font-medium">
                            {language === 'bn' ? 'আমরা কোনো ব্র্যান্ড খুঁজে পাইনি। চালিয়ে যেতে একটি নতুন ব্র্যান্ড যোগ করুন।' : 'We couldn\'t find any brands matching your search. Create a new one to get started.'}
                        </p>
                        <Button onClick={handleOpenCreate} className="rounded-xl px-8 h-12 bg-indigo-600 hover:bg-indigo-700 font-bold gap-2">
                            <Plus size={18} />
                            {t('add_new', language)}
                        </Button>
                    </div>
                )}
            </div>

            {/* Redesigned Brand Form Modal - Clean & Professional */}
            <Modal show={showModal} onClose={() => !processing && setShowModal(false)} maxWidth="2xl">
                <div className="p-8 md:p-12 bg-white dark:bg-slate-950 rounded-[2.5rem]">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                                {editingBrand ? (language === 'bn' ? 'ব্র্যান্ড এডিট করুন' : 'Edit Brand') : (language === 'bn' ? 'নতুন ব্র্যান্ড যোগ করুন' : 'Add New Brand')}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">
                                {editingBrand ? (language === 'bn' ? 'বিদ্যমান ব্র্যান্ডের তথ্য আপডেট করুন।' : 'Update the details for the existing brand.')
                                    : (language === 'bn' ? 'আপনার ইনভেন্টরির জন্য একটি নতুন ব্র্যান্ড নিবন্ধিত করুন।' : 'Register a new brand identity for your inventory.')}
                            </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setShowModal(false)} className="rounded-full h-10 w-10">
                            <X size={20} />
                        </Button>
                    </div>

                    <form onSubmit={submit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {/* Logo Section */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                                    {language === 'bn' ? 'ব্র্যান্ড লোগো' : 'Brand Logo'}
                                </label>
                                <div
                                    onClick={() => !processing && document.getElementById('logo-upload-field').click()}
                                    className="aspect-square rounded-[2rem] bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center cursor-pointer group hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:border-indigo-600 transition-all overflow-hidden relative shadow-inner"
                                >
                                    {logoPreview || (editingBrand?.logo && !data.logo) ? (
                                        <img src={logoPreview || `/storage/${editingBrand.logo}`} className="w-full h-full object-contain p-4" alt="Preview" />
                                    ) : (
                                        <div className="text-center p-6">
                                            <CloudUpload size={32} className="mx-auto text-slate-400 group-hover:text-indigo-600 transition-colors mb-2" />
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{language === 'bn' ? 'আপলোড করুন' : 'Upload Image'}</p>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <input
                                    id="logo-upload-field"
                                    type="file"
                                    className="hidden"
                                    onChange={e => setData('logo', e.target.files[0])}
                                    accept="image/*"
                                />
                                <p className="text-[10px] font-medium text-slate-400 text-center leading-relaxed">
                                    {language === 'bn' ? 'সেরা রেজাল্টের জন্য ৫০০x৫০০ পিক্সেল পিএনজি লোগো ফাইল ব্যবহার করুন।' : 'Recommended: 500x500px PNG or JPG logo file.'}
                                </p>
                            </div>

                            {/* Fields Section */}
                            <div className="md:col-span-2 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{t('brand_name', language)} *</label>
                                    <input
                                        type="text"
                                        required
                                        className={cn(
                                            "w-full h-12 bg-slate-50 dark:bg-slate-900 border border-transparent rounded-[1rem] font-semibold text-sm px-5 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none",
                                            errors.name && "border-rose-500 ring-4 ring-rose-500/10"
                                        )}
                                        placeholder={language === 'bn' ? 'ব্র্যান্ডের নাম লিখুন...' : 'Enter brand name...'}
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-xs font-bold text-rose-500 ml-1">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{t('description', language)}</label>
                                    <textarea
                                        rows="4"
                                        className="w-full p-5 bg-slate-50 dark:bg-slate-900 border border-transparent rounded-[1.2rem] font-medium text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none resize-none"
                                        placeholder={language === 'bn' ? 'ব্র্যান্ড সম্পর্কে কিছু লিখুন...' : 'Write a brief description about the brand...'}
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse md:flex-row justify-end gap-3 mt-10 pt-8 border-t border-slate-50 dark:border-slate-800">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowModal(false)}
                                className="h-12 px-8 rounded-xl font-bold text-slate-500"
                            >
                                {t('cancel', language)}
                            </Button>
                            <Button
                                disabled={processing}
                                className="h-12 px-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none min-w-[160px]"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin" size={18} />
                                        {language === 'bn' ? 'সেভ হচ্ছে...' : 'Saving...'}
                                    </span>
                                ) : (
                                    editingBrand ? (language === 'bn' ? 'আপডেট করুন' : 'Update Brand') : (language === 'bn' ? 'ব্র্যান্ড সেভ করুন' : 'Save Brand')
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
