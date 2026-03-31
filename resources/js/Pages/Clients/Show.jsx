import React, { useState, useRef } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft, Pencil, Mail, Phone, MapPin,
    Briefcase, DollarSign, Clock, Package, Eye,
    HardDrive, Globe, Trash2,
    ChevronRight, Wallet, Activity, Upload, RefreshCw
} from 'lucide-react';

const fmt = (n) => `৳${new Intl.NumberFormat().format(Number(n) || 0)}`;

const styles = {
    card: {
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #f1f5f9',
        padding: '24px',
        transition: 'all 0.2s ease',
    },
    tabBtn: (active) => ({
        padding: '10px 20px', borderRadius: '12px', fontSize: '0.88rem', fontWeight: 700,
        background: active ? '#4f46e5' : 'transparent', color: active ? '#fff' : '#64748b',
        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
        transition: 'all 0.2s'
    })
};

export default function Show({ auth, client, projects, stats, allDesigns }) {
    const [activeTab, setActiveTab] = useState('projects');
    const fileInputRef = useRef(null);
    const replaceInputRef = useRef(null);
    const [replacingDesignId, setReplacingDesignId] = useState(null);

    const canEditClient = auth.is_admin || (auth.permissions || []).includes('edit_clients');

    const handleFileUpload = (e) => {
        const filesArray = Array.from(e.target.files);
        if (filesArray.length === 0) return;
        router.post(route('clients.designs.bulk', client.id), { files: filesArray }, {
            forceFormData: true, preserveScroll: true,
            onSuccess: () => { if (fileInputRef.current) fileInputRef.current.value = ''; }
        });
    };

    const handleDeleteDesign = (designId) => {
        if (!confirm('Delete this design file? This cannot be undone.')) return;
        router.delete(route('clients.designs.destroy', { design: designId }), { preserveScroll: true });
    };

    const handleReplaceClick = (designId) => {
        setReplacingDesignId(designId);
        setTimeout(() => replaceInputRef.current?.click(), 50);
    };

    const handleReplaceFile = (e) => {
        const file = e.target.files[0];
        if (!file || !replacingDesignId) return;
        router.post(route('clients.designs.replace', { design: replacingDesignId }), { file }, {
            forceFormData: true, preserveScroll: true,
            onSuccess: () => { setReplacingDesignId(null); if (replaceInputRef.current) replaceInputRef.current.value = ''; },
            onError: () => setReplacingDesignId(null),
        });
    };

    const statusColors = {
        pending:   { label: 'Waiting',   color: '#f59e0b', bg: '#fffbeb' },
        ongoing:   { label: 'Active',    color: '#4f46e5', bg: '#f5f3ff' },
        on_hold:   { label: 'Paused',    color: '#64748b', bg: '#f1f5f9' },
        completed: { label: 'Finished',  color: '#10b981', bg: '#f0fdf4' },
        cancelled: { label: 'Stopped',   color: '#ef4444', bg: '#fef2f2' },
    };

    const tabs = [
        { id: 'projects',  label: 'Active Projects', icon: Briefcase },
        { id: 'payments',  label: 'Financial Ledger', icon: Wallet },
        { id: 'designs',   label: 'Design Files',    icon: HardDrive },
        { id: 'inventory', label: 'Used Items',      icon: Package },
    ];

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`${client.company_name || client.name} | View`} />

            <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple style={{ display: 'none' }} />
            <input type="file" ref={replaceInputRef} onChange={handleReplaceFile} style={{ display: 'none' }} />

            <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '4rem' }}>

                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <Link href={route('clients.index')}>
                            <button style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
                                    {client.company_name || client.name}
                                </h1>
                                <span style={{ background: '#f0fdf4', color: '#10b981', fontSize: '0.7rem', fontWeight: 800, padding: '4px 12px', borderRadius: '10px' }}>OFFICIAL CLIENT</span>
                            </div>
                            <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500, margin: '4px 0 0' }}>
                                {client.industry || 'Business Partner'} • Reference #{client.id.toString().padStart(4, '0')}
                            </p>
                        </div>
                    </div>
                    <Link href={route('clients.edit', client.id)}>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#4f46e5', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>
                            <Pencil size={18} /> Edit Info
                        </button>
                    </Link>
                </div>

                {/* STATS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
                    <MiniStat label="Total Projects" value={stats?.total_projects || 0} color="#4f46e5" icon={Briefcase} />
                    <MiniStat label="Total Contract" value={fmt(stats?.contract_value)} color="#10b981" icon={DollarSign} />
                    <MiniStat label="Already Paid" value={fmt(stats?.total_paid)} color="#8b5cf6" icon={Wallet} />
                    <MiniStat label="Remaining Due" value={fmt(stats?.total_due)} color="#ef4444" icon={Clock} />
                </div>

                {/* BODY */}
                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>

                    {/* SIDEBAR */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={styles.card}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem' }}>Basic Info</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <InfoRow icon={Mail} label="Email Address" val={client.email} />
                                <InfoRow icon={Phone} label="Phone Number" val={client.phone} />
                                <InfoRow icon={MapPin} label="Office Location" val={client.address} />
                                <InfoRow icon={Globe} label="Work Industry" val={client.industry} />
                            </div>
                        </div>
                        <div style={{ ...styles.card, background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', margin: 0 }}>REMINDER</p>
                            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.6', marginTop: '8px' }}>
                                All money records and projects are updated automatically by the system.
                            </p>
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', gap: '8px', background: '#f8fafc', padding: '6px', borderRadius: '16px', border: '1px solid #f1f5f9', width: 'fit-content' }}>
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={styles.tabBtn(activeTab === tab.id)}>
                                    <tab.icon size={16} /> {tab.label}
                                </button>
                            ))}
                        </div>

                        <div style={{ ...styles.card, padding: '32px' }}>

                            {/* PROJECTS */}
                            {activeTab === 'projects' && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Active Projects</h3>
                                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Currently running {projects?.length || 0} projects</p>
                                        </div>
                                        <Link href={route('projects.create', { client_id: client.id })}>
                                            <button style={{ padding: '10px 20px', background: '#4f46e5', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}>+ New Project</button>
                                        </Link>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {projects?.map(p => {
                                            const sc = statusColors[p.status] || statusColors.pending;
                                            return (
                                                <Link key={p.id} href={route('projects.show', p.id)} style={{ textDecoration: 'none' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', background: '#fcfdfe', borderRadius: '16px', border: '1px solid #f1f5f9', transition: 'all 0.2s' }} className="hover-row">
                                                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Activity size={20} color="#4f46e5" />
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{p.title}</p>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                                                                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Project #{p.id}</span>
                                                                <span style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>•</span>
                                                                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Joined {p.start_date}</span>
                                                            </div>
                                                        </div>
                                                        <div style={{ textAlign: 'right', paddingRight: '1rem' }}>
                                                            <p style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{fmt(p.budget || p.contract_amount)}</p>
                                                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: sc.color, background: sc.bg, padding: '2px 8px', borderRadius: '6px' }}>{sc.label}</span>
                                                        </div>
                                                        <ChevronRight size={18} color="#cbd5e1" />
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* PAYMENTS & EXPENSES */}
                            {activeTab === 'payments' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                    {/* INCOMING PAYMENTS */}
                                    <div>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Incoming Deposits</h3>
                                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Total revenue received from this client</p>
                                        </div>
                                        <div style={{ background: '#fcfdfe', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                                            {client.payments?.length > 0 ? (
                                                client.payments.map((p, idx) => (
                                                    <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 140px 100px', gap: '1rem', padding: '16px 24px', borderBottom: idx === client.payments.length - 1 ? 'none' : '1px solid #f1f5f9', alignItems: 'center' }}>
                                                        <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', margin: 0 }}>{p.payment_date}</p>
                                                        <div>
                                                            <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{p.reference_number || 'Cash/Direct'}</p>
                                                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, margin: 0, textTransform: 'uppercase' }}>via {p.payment_method}</p>
                                                        </div>
                                                        <p style={{ fontSize: '1rem', fontWeight: 900, color: '#10b981', margin: 0, textAlign: 'right' }}>{fmt(p.amount)}</p>
                                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                            <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#f0fdf4', color: '#10b981', padding: '4px 10px', borderRadius: '8px' }}>PAID</span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <EmptyState icon={Wallet} text="No deposits found" subtext="No history of money received for this client." />
                                            )}
                                        </div>
                                    </div>

                                    {/* OUTGOING EXPENSES (PROJECT COSTS) */}
                                    <div>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Project Expenditures</h3>
                                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Costs and expenses incurred across all projects</p>
                                        </div>
                                        <div style={{ background: '#fcfdfe', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                                            {projects?.some(p => p.expenses?.length > 0) ? (
                                                projects.flatMap(p => (p.expenses || []).map(e => ({ ...e, project_title: p.title }))).sort((a,b) => new Date(b.expense_date) - new Date(a.expense_date)).map((e, idx, arr) => (
                                                    <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 140px 100px', gap: '1rem', padding: '16px 24px', borderBottom: idx === arr.length - 1 ? 'none' : '1px solid #f1f5f9', alignItems: 'center' }}>
                                                        <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', margin: 0 }}>{e.expense_date}</p>
                                                        <div>
                                                            <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{e.title}</p>
                                                            <p style={{ fontSize: '0.7rem', color: '#4f46e5', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>Project: {e.project_title}</p>
                                                        </div>
                                                        <p style={{ fontSize: '1rem', fontWeight: 900, color: '#ef4444', margin: 0, textAlign: 'right' }}>{fmt(e.amount)}</p>
                                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                            <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#fef2f2', color: '#ef4444', padding: '4px 10px', borderRadius: '8px' }}>COST</span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <EmptyState icon={DollarSign} text="No expenses found" subtext="No project costs have been recorded yet." />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* DESIGN FILES */}
                            {activeTab === 'designs' && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Design Files</h3>
                                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>{allDesigns?.length || 0} files attached to this client</p>
                                        </div>
                                        {canEditClient && (
                                            <button onClick={() => fileInputRef.current.click()} style={{ padding: '10px 20px', background: '#4f46e5', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Upload size={16} /> Upload File
                                            </button>
                                        )}
                                    </div>

                                    {allDesigns?.length > 0 ? (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
                                            {allDesigns.map(d => (
                                                <ClientDesignCard
                                                    key={d.id}
                                                    design={d}
                                                    canEdit={canEditClient}
                                                    onDelete={() => handleDeleteDesign(d.id)}
                                                    onReplace={() => handleReplaceClick(d.id)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState icon={HardDrive} text="No design files yet" subtext="Upload photos and blueprints for this client." />
                                    )}
                                </div>
                            )}

                            {/* INVENTORY */}
                            {activeTab === 'inventory' && (
                                <div>
                                    <div style={{ marginBottom: '2rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Used Items</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Materials used for this client</p>
                                    </div>
                                    <div style={{ background: '#fcfdfe', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                                        {(client.inventory_items || client.inventoryItems)?.length > 0 ? (
                                            (client.inventory_items || client.inventoryItems).map((item, idx) => (
                                                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 140px 140px', gap: '1rem', padding: '16px 24px', borderBottom: idx === (client.inventory_items || client.inventoryItems).length - 1 ? 'none' : '1px solid #f1f5f9', alignItems: 'center' }}>
                                                    <div>
                                                        <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{item.name}</p>
                                                        <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, margin: 0 }}>{item.brand?.name || 'Simple'}</p>
                                                    </div>
                                                    <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{item.quantity_in_stock} {item.unit}</p>
                                                    <p style={{ fontSize: '1rem', fontWeight: 900, color: '#4f46e5', textAlign: 'right', margin: 0 }}>{fmt(item.unit_price * item.quantity_in_stock)}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <EmptyState icon={Package} text="No items used yet" subtext="No physical materials have been linked to this client." />
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .hover-row:hover { background: #f8fafc !important; transform: translateX(4px); border-color: #4f46e540 !important; }
                .client-design-card-overlay { opacity: 0; transition: opacity 0.2s ease; }
                .client-design-card:hover .client-design-card-overlay { opacity: 1; }
            `}</style>
        </FigmaLayout>
    );
}

function ClientDesignCard({ design, canEdit, onDelete, onReplace }) {
    const isImage = design.file_type && design.file_type.startsWith('image/');
    const ext = (design.file_name || 'FILE').split('.').pop().toUpperCase();
    const sizeKB = design.file_size ? Math.round(design.file_size / 1024) : null;

    return (
        <div className="client-design-card" style={{ borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden', background: '#f8fafc', position: 'relative' }}>
            <div style={{ height: '140px', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', gap: '8px' }}>
                {isImage
                    ? <img src={`/storage/${design.file_path}`} alt={design.file_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <>
                        <HardDrive size={40} color="#4f46e5" />
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#4f46e5', background: '#f0efff', padding: '2px 8px', borderRadius: '6px' }}>{ext}</span>
                      </>
                }
                <div className="client-design-card-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <a href={`/storage/${design.file_path}`} target="_blank" title="View / Download"
                        style={{ width: '38px', height: '38px', background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', cursor: 'pointer' }}>
                        <Eye size={17} />
                    </a>
                    {canEdit && (
                        <>
                            <button title="Replace file" onClick={onReplace}
                                style={{ width: '38px', height: '38px', background: 'rgba(99,102,241,0.7)', border: '1.5px solid rgba(99,102,241,0.9)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
                                <RefreshCw size={17} />
                            </button>
                            <button title="Delete file" onClick={onDelete}
                                style={{ width: '38px', height: '38px', background: 'rgba(239,68,68,0.7)', border: '1.5px solid rgba(239,68,68,0.9)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
                                <Trash2 size={17} />
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div style={{ padding: '12px 14px' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', margin: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} title={design.file_name}>
                    {design.file_name || 'Design File'}
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#94a3b8' }}>Added {new Date(design.created_at).toLocaleDateString()}</span>
                    {sizeKB && <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#cbd5e1' }}>• {sizeKB} KB</span>}
                </div>
            </div>
        </div>
    );
}

function MiniStat({ label, value, color, icon: Icon }) {
    return (
        <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>{label}</p>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `${color}18`, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} />
                </div>
            </div>
            <h4 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '8px 0 0' }}>{value}</h4>
        </div>
    );
}

function InfoRow({ icon: Icon, label, val }) {
    return (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
                <Icon size={18} />
            </div>
            <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', margin: 0, textTransform: 'uppercase' }}>{label}</p>
                <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{val || 'Not Added'}</p>
            </div>
        </div>
    );
}

function EmptyState({ icon: Icon, text, subtext }) {
    return (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Icon size={40} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <p style={{ fontSize: '1rem', fontWeight: 800, color: '#475569', margin: 0 }}>{text}</p>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>{subtext}</p>
        </div>
    );
}
