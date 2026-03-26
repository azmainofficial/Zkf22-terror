import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    Building2,
    Mail,
    Phone,
    Globe,
    MoreHorizontal,
    Filter,
    Users,
    Briefcase,
    Zap,
    TrendingUp
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/Components/ui/DropdownMenu';
import { cn } from '@/lib/utils';

export default function Index({ auth, clients, filters, stats }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'All');

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(route('clients.index'), { search, status }, {
                preserveState: true,
                replace: true
            });
        }, 300);
        return () => clearTimeout(timer);
    }, [search, status]);

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Client Intelligence Center" />

            <div className="space-y-8 pb-12">
                {/* Global Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
                                <Building2 className="text-white" size={20} />
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Client Intelligence
                            </h1>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                            Synthesizing account status, financial value, and industry categorization.
                        </p>
                    </div>

                    <Link href={route('clients.create')}>
                        <Button className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] gap-2">
                            <Plus size={20} strokeWidth={2.5} />
                            <span>Onboard New Account</span>
                        </Button>
                    </Link>
                </div>

                {/* Intelligence Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                                    <Users size={24} />
                                </div>
                                <Badge variant="info">Global Network</Badge>
                            </div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total Accounts</h3>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">{stats?.total || 0}</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400">
                                    <Zap size={24} />
                                </div>
                                <Badge variant="success">Operational</Badge>
                            </div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Active Partners</h3>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">{stats?.active || 0}</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[32px] border-none bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-2xl text-amber-600 dark:text-amber-400">
                                    <TrendingUp size={24} />
                                </div>
                                <Badge variant="warning">Nurturing</Badge>
                            </div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Prospects</h3>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">{stats?.prospective || 0}</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[32px] border-none bg-indigo-600 shadow-sm overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/20 rounded-2xl text-white">
                                    <Briefcase size={24} />
                                </div>
                                <div className="text-white/80 text-xs font-bold uppercase tracking-tighter">Premium Tier</div>
                            </div>
                            <h3 className="text-sm font-bold text-white/70 uppercase tracking-widest mb-1">Account Growth</h3>
                            <p className="text-3xl font-black text-white">+12.4%</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tactical Search & Discovery */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Find intelligence by account name, domain, or partner contact..."
                            className="w-full h-14 pl-14 pr-6 bg-white dark:bg-slate-900 border-none rounded-[24px] shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                        />
                    </div>

                    <div className="flex p-1.5 bg-slate-200 dark:bg-slate-800 rounded-[24px] h-14 overflow-hidden">
                        {['All', 'Active', 'Inactive', 'Prospective'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatus(s)}
                                className={cn(
                                    "flex-1 px-6 rounded-[18px] text-sm font-bold tracking-tight transition-all",
                                    status === s
                                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm scale-[0.98]"
                                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
                                )}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Intelligence Dossier Grid */}
                {clients.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clients.data.map((client) => (
                            <Card key={client.id} className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group overflow-hidden">
                                <CardContent className="p-8">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 rounded-[24px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-2 group-hover:scale-110 transition-transform shadow-inner">
                                                {client.logo ? (
                                                    <img src={`/storage/${client.logo}`} className="w-full h-full object-contain" alt={client.company_name} />
                                                ) : (
                                                    <Building2 size={32} className="text-slate-400" />
                                                )}
                                            </div>
                                            <div className="pt-1">
                                                <h3 className="text-xl font-black text-slate-900 dark:text-white line-clamp-1 leading-tight mb-1">
                                                    {client.company_name}
                                                </h3>
                                                <Badge
                                                    variant={
                                                        client.status === 'active' ? 'success' :
                                                            client.status === 'prospective' ? 'info' : 'default'
                                                    }
                                                    className="uppercase text-[10px] tracking-widest px-3 py-1"
                                                >
                                                    {client.status}
                                                </Badge>
                                            </div>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800">
                                                    <MoreHorizontal className="text-slate-400" size={20} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[180px]">
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('clients.show', client.id)} className="rounded-xl font-bold cursor-pointer gap-2 py-3">
                                                        <Plus size={18} /> View Intelligence
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('clients.edit', client.id)} className="rounded-xl font-bold cursor-pointer gap-2 py-3">
                                                        <Filter size={18} /> Modify dossier
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-semibold text-sm">
                                            <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center">
                                                <Mail size={16} />
                                            </div>
                                            <span className="truncate">{client.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-semibold text-sm">
                                            <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center">
                                                <Phone size={16} />
                                            </div>
                                            <span>{client.phone || 'System link pending'}</span>
                                        </div>
                                        {client.website && (
                                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-semibold text-sm">
                                                <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center">
                                                    <Globe size={16} />
                                                </div>
                                                <span className="truncate">{client.website.replace(/^https?:\/\//, '')}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Industry</p>
                                            <p className="text-xs font-black text-slate-900 dark:text-white truncate">{client.industry || 'Unknown'}</p>
                                        </div>
                                        <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Representative</p>
                                            <p className="text-xs font-black text-slate-900 dark:text-white truncate">{client.name}</p>
                                        </div>
                                    </div>

                                    <Link href={route('clients.show', client.id)} className="block mt-6">
                                        <Button className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-black tracking-tight shadow-xl shadow-slate-200 dark:shadow-none transition-all group-hover:scale-[1.02]">
                                            Open Intelligence Hub
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="rounded-[40px] border-none bg-white dark:bg-slate-900 shadow-sm p-20 text-center">
                        <div className="w-24 h-24 rounded-[32px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Building2 size={48} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                            Dossier Database Empty
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto mb-10">
                            The centralized intelligence repository currently contains no account records. Begin by onboarding your first strategic partner.
                        </p>
                        <Link href={route('clients.create')}>
                            <Button className="h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-105 active:scale-95 gap-3">
                                <Plus size={20} strokeWidth={3} />
                                ONBOARD INITIAL ACCOUNT
                            </Button>
                        </Link>
                    </Card>
                )}

                {/* Strategic Pagination */}
                {clients.links.length > 3 && (
                    <div className="flex items-center justify-center gap-2 pt-8">
                        {clients.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={cn(
                                    "h-12 min-w-[3rem] px-4 rounded-2xl flex items-center justify-center text-sm font-black transition-all",
                                    link.active
                                        ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-lg"
                                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border-none shadow-sm",
                                    !link.url && "opacity-30 cursor-not-allowed pointer-events-none"
                                )}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </FigmaLayout>
    );
}
