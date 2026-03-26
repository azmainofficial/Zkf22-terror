import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { FileText, Plus, Search, Edit, Trash2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/lib/translations';
import { useState } from 'react';

export default function Index({ auth, designs, filters }) {
    const { language } = useAppStore();
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('slip-designs.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm(t('confirm_delete', language))) {
            router.delete(route('slip-designs.destroy', id));
        }
    };

    const handleToggleStatus = (id) => {
        router.post(route('slip-designs.toggle', id), {}, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Link href={route('settings.index')}>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border hover:bg-slate-50 transition-all shadow-sm">
                                <ArrowLeft size={18} />
                            </button>
                        </Link>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-none text-slate-900 uppercase">
                                {t('slip_designs', language)}
                            </h2>
                            <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">
                                {t('slip_designs_desc', language)}
                            </p>
                        </div>
                    </div>
                    <Link href={route('slip-designs.create')}>
                        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-500/20 transition-all font-bold">
                            <Plus size={20} />
                            {t('add_design', language)}
                        </button>
                    </Link>
                </div>
            }
        >
            <Head title={t('slip_designs', language)} />

            <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Search Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder={t('search', language)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                </div>

                {/* Designs Grid */}
                {designs.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {designs.data.map((design) => (
                            <div key={design.id} className={`group relative bg-white rounded-3xl shadow-sm border-2 overflow-hidden transition-all hover:shadow-xl ${design.is_active ? 'border-green-500' : 'border-slate-100 hover:border-blue-200'}`}>
                                {/* Active Badge */}
                                {design.is_active && (
                                    <div className="absolute top-4 right-4 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-green-500/30 flex items-center gap-1">
                                        <CheckCircle size={12} /> {t('active_status', language)}
                                    </div>
                                )}

                                {/* Preview Area */}
                                <div className="h-48 bg-slate-50 relative p-6 flex flex-col items-center justify-center border-b border-slate-100 group-hover:bg-slate-50/50 transition-colors">
                                    {design.header_logo ? (
                                        <img src={`/storage/${design.header_logo}`} alt="Logo" className="h-12 object-contain mb-4" />
                                    ) : (
                                        <div className="h-12 flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-xs border-2 border-dashed border-slate-200 px-4 rounded-lg">No Logo</div>
                                    )}

                                    <div className="w-full max-w-[200px] space-y-2 opacity-50">
                                        <div className="h-2 bg-slate-200 rounded-full w-3/4 mx-auto"></div>
                                        <div className="h-2 bg-slate-200 rounded-full w-full"></div>
                                        <div className="h-2 bg-slate-200 rounded-full w-5/6 mx-auto"></div>
                                    </div>

                                    {/* Watermark Overlay */}
                                    {design.watermark_image && (
                                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                            <img src={`/storage/${design.watermark_image}`} className="w-24 h-24 object-contain" />
                                        </div>
                                    )}
                                </div>

                                {/* Info Area */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">{design.name}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${design.type === 'invoice' ? 'bg-blue-500' : 'bg-amber-500'}`}></span>
                                        {design.type.toUpperCase()}
                                    </p>

                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                                            {design.font_family}
                                        </div>
                                        <div className="w-6 h-6 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: design.accent_color }}></div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link href={route('slip-designs.edit', design.id)} className="flex-1">
                                            <button className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest transition-colors">
                                                {t('edit', language)}
                                            </button>
                                        </Link>
                                        {!design.is_active && (
                                            <button
                                                onClick={() => handleToggleStatus(design.id)}
                                                className="flex-1 py-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 font-bold text-xs uppercase tracking-widest transition-colors border border-green-200"
                                            >
                                                {t('set_active', language)}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(design.id)}
                                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-colors border border-red-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                        <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{t('no_designs_found', language) || 'No designs found'}</h3>
                        <p className="text-slate-500 mb-8">{t('slip_designs_desc', language)}</p>
                        <Link href={route('slip-designs.create')}>
                            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all">
                                {t('add_design', language)}
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
