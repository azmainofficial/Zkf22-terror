import React, { useState, useRef } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, router } from '@inertiajs/react';
import { t } from '../../Lang/translation';
import {
    ArrowLeft, Pencil, DollarSign, Calendar, Package,
    Eye, Activity, X, Clock, AlertCircle, ChevronRight,
    Upload, Truck, HardDrive, FileText, Download, Printer,
    Trash2, Wallet, Info, TrendingUp, CheckCircle2, RefreshCw, Layout, Receipt,
    MessageSquare, CheckCircle, AlertTriangle, FileSearch, X as CloseIcon, Maximize2
} from 'lucide-react';
import Modal from '@/Components/Modal';
import ProjectCalculationTable from '@/Components/ProjectCalculationTable';

const STATUS_CONFIG = {
    ongoing:   { label: 'Active',     color: '#4f46e5', bg: '#f5f3ff', icon: Activity },
    completed: { label: 'Finished',   color: '#10b981', bg: '#f0fdf4', icon: CheckCircle2 },
    pending:   { label: 'Waiting',    color: '#f59e0b', bg: '#fffbeb', icon: Clock },
    on_hold:   { label: 'Paused',     color: '#8b5cf6', bg: '#f5f3ff', icon: AlertCircle },
    cancelled: { label: 'Stopped',    color: '#ef4444', bg: '#fef2f2', icon: X },
};

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

export default function Show({ auth, project, connectedInventory, designs, stats }) {
    const [selectedTab, setSelectedTab] = useState('details');
    const [localStatus, setLocalStatus] = useState(project.status || 'pending');
    const [localProgress, setLocalProgress] = useState(project.progress || 0);
    const fileInputRef = useRef(null);
    const replaceInputRef = useRef(null);
    const [replacingDesignId, setReplacingDesignId] = useState(null);
    
    // Design Review States
    const [previewDesign, setPreviewDesign] = useState(null);
    const [reviewDesign, setReviewDesign] = useState(null);
    const [reviewForm, setReviewForm] = useState({ status: 'pending', remarks: '' });

    const canEditProject = auth.is_admin || (auth.permissions || []).includes('edit_projects');

    const contractAmount  = Number(stats?.contract_amount) || 0;
    const realizedCapital = Number(stats?.paid_amount) || 0;
    const due             = Number(stats?.due_amount) || 0;

    const submitStatusUpdate = (newStatus, newProgress) => {
        router.patch(route('projects.updateStatus', project.id), {
            status: newStatus, progress: newProgress,
        }, { preserveScroll: true });
    };

    const handleFileUpload = (e) => {
        const filesArray = Array.from(e.target.files);
        if (filesArray.length === 0) return;
        router.post(route('projects.designs.upload', project.id), { files: filesArray }, {
            forceFormData: true, preserveScroll: true,
            onSuccess: () => { if (fileInputRef.current) fileInputRef.current.value = ''; },
        });
    };

    const handleReviewClick = (design) => {
        setReviewDesign(design);
        setReviewForm({ 
            status: design.status || 'pending', 
            remarks: design.remarks || '' 
        });
    };

    const handleReviewSave = (e) => {
        e.preventDefault();
        router.patch(route('projects.designs.updateReview', { project: project.id, design: reviewDesign.id }), reviewForm, {
            onSuccess: () => {
                setReviewDesign(null);
            },
            preserveScroll: true
        });
    };

    const handleDocumentUpload = (e) => {
        const filesArray = Array.from(e.target.files);
        if (filesArray.length === 0) return;
        router.post(route('projects.update', project.id), { 
            _method: 'PUT',
            documents: filesArray 
        }, {
            forceFormData: true, preserveScroll: true,
        });
    };

    const handleDocumentDelete = (docId) => {
        if (!confirm('Are you sure you want to delete this document?')) return;
        router.delete(route('projects.documents.destroy', { project: project.id, document: docId }), {
            preserveScroll: true,
        });
    };

    const handleDocumentRename = (docId, newName) => {
        if (!newName) return;
        router.patch(route('projects.documents.rename', { project: project.id, document: docId }), {
            file_name: newName
        }, { preserveScroll: true });
    };

    const handlePaymentDelete = (paymentId) => {
        if (!confirm('Are you sure you want to permanently delete this payment record? This will affect the project balance.')) return;
        router.delete(route('payments.destroy', paymentId), {
            preserveScroll: true,
        });
    };

    const handleDeleteDesign = (designId) => {
        if (!confirm('Delete this design file? This cannot be undone.')) return;
        router.delete(route('projects.designs.destroy', { project: project.id, design: designId }), {
            preserveScroll: true,
        });
    };

    const handleReplaceClick = (designId) => {
        setReplacingDesignId(designId);
        setTimeout(() => replaceInputRef.current?.click(), 50);
    };

    const handleReplaceFile = (e) => {
        const file = e.target.files[0];
        if (!file || !replacingDesignId) return;
        router.post(route('projects.designs.replace', { project: project.id, design: replacingDesignId }), { file }, {
            forceFormData: true, preserveScroll: true,
            onSuccess: () => { setReplacingDesignId(null); if (replaceInputRef.current) replaceInputRef.current.value = ''; },
            onError: () => setReplacingDesignId(null),
        });
    };

    const handleStatusClick = (status) => {
        setLocalStatus(status);
        submitStatusUpdate(status, localProgress);
    };

    const cfg = STATUS_CONFIG[localStatus] || STATUS_CONFIG.pending;
    const fmt = (n) => `৳${new Intl.NumberFormat().format(n)}`;

    const tabs = [
        { id: 'overview',  label: 'Overview',  icon: Layout },
        { id: 'details',   label: 'Financial', icon: Wallet },
        { id: 'inventory', label: 'Materials', icon: Package },
        { id: 'designs',   label: 'CAD Files', icon: HardDrive },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'status',    label: 'Tracking',  icon: TrendingUp },
    ];

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`${project.title} | Hub`} />

            {/* Hidden file inputs */}
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple style={{ display: 'none' }} />
            <input type="file" ref={replaceInputRef} onChange={handleReplaceFile} style={{ display: 'none' }} />

            <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '4rem' }}>

                {/* ── HEADER ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <Link href={route('projects.index')}>
                            <button style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>{project.title}</h1>
                                <span style={{ background: '#000', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '5px 14px', borderRadius: '10px' }}>
                                    ID: {project.id}
                                </span>
                                <span style={{ background: cfg.bg, color: cfg.color, fontSize: '0.75rem', fontWeight: 800, padding: '5px 14px', borderRadius: '10px' }}>
                                    {cfg.label.toUpperCase()}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500, margin: '4px 0 0' }}>
                                Project Reference #{project.id.toString().padStart(6, '0')} • {project.client?.company_name || project.client?.name}
                            </p>
                        </div>
                    </div>

                    {canEditProject && (
                        <Link href={route('projects.edit', project.id)}>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#4f46e5', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>
                                <Pencil size={18} /> Edit Business Profile
                            </button>
                        </Link>
                    )}
                </div>

                {/* ── STATS STRIP ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
                    <MiniStat label="Contract Value" value={fmt(contractAmount)} color="#4f46e5" icon={Wallet} />
                    <MiniStat label="Net Paid" value={fmt(realizedCapital)} color="#10b981" icon={DollarSign} />
                    <MiniStat label="Project Debt" value={fmt(due)} color="#ef4444" icon={AlertCircle} />
                    <MiniStat label="Project Expenses" value={fmt(project.expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0)} color="#8b5cf6" icon={Receipt} />
                </div>

                {/* ── BODY GRID ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>

                    {/* LEFT PANEL */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        {/* Tab Switcher */}
                        <div style={{ display: 'flex', gap: '8px', background: '#f8fafc', padding: '6px', borderRadius: '16px', border: '1px solid #f1f5f9', width: 'fit-content' }}>
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setSelectedTab(tab.id)} style={styles.tabBtn(selectedTab === tab.id)}>
                                    <tab.icon size={16} /> {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Detail Area */}
                        <div style={{ ...styles.card, padding: '32px' }}>

                            {/* OVERVIEW TAB */}
                            {selectedTab === 'overview' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                                            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Work Progress Analytics</h3>
                                            <div style={{ position: 'relative', height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden', marginBottom: '1rem' }}>
                                                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${localProgress}%`, background: 'linear-gradient(90deg, #4f46e5, #8b5cf6)', borderRadius: '6px', transition: 'width 1s ease-out' }} />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Project Completion</span>
                                                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#4f46e5' }}>{localProgress}%</span>
                                            </div>
                                        </div>
                                        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                                            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Time Tracking</h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div>
                                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Start Date</p>
                                                    <p style={{ margin: '4px 0 0', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{new Date(project.start_date).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Target Deadline</p>
                                                    <p style={{ margin: '4px 0 0', fontSize: '1rem', fontWeight: 800, color: '#4f46e5' }}>{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Deciding...'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <section>
                                        <SectionHeader title="Project Description" description="Primary goals and scope of work" />
                                        <div style={{ marginTop: '1.5rem', background: '#fff', padding: '24px', borderRadius: '20px', border: '2px solid #f1f5f9' }}>
                                            <p style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.8', margin: 0 }}>
                                                {project.description || 'No detailed description available for this project.'}
                                            </p>
                                        </div>
                                    </section>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                                        <section>
                                            <SectionHeader title="Client Profile" description="Authorized representative" />
                                            <div style={{ marginTop: '1.25rem', padding: '24px', background: 'linear-gradient(135deg, #fff, #f8fafc)', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                                        <Activity size={24} />
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{project.client?.name}</p>
                                                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', margin: '2px 0 0' }}>{project.client?.company_name || 'Individual Client'}</p>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        <Clock size={14} /> <span>{project.client?.phone}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        <TrendingUp size={14} /> <span>{project.client?.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                        <section>
                                            <SectionHeader title="Material Vendors" description="Registered supply network" />
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1.25rem' }}>
                                                {Array.from(new Set(connectedInventory?.map(i => i.supplier?.id))).map(id => {
                                                    const s = connectedInventory.find(i => i.supplier?.id === id)?.supplier;
                                                    if (!s) return null;
                                                    return (
                                                        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                                                            <Truck size={18} color="#10b981" />
                                                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>{s.name}</span>
                                                        </div>
                                                    );
                                                })}
                                                {(!connectedInventory || connectedInventory.length === 0) && (
                                                    <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
                                                        <Package size={32} color="#cbd5e1" style={{ marginBottom: '10px' }} />
                                                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>No vendors assigned yet</p>
                                                    </div>
                                                )}
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            )}

                            {/* PAYMENT TAB */}
                            {selectedTab === 'details' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                    <section>
                                        <SectionHeader 
                                            title="Financial Breakdown" 
                                            description="Detailed cost and fee calculation sheet" 
                                        />
                                        <div style={{ marginTop: '2rem' }}>
                                            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#eff6ff', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                                                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#1e40af' }}>Project Cost Calculation</p>
                                                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#60a5fa' }}>Official payment tracking and fee architecture</p>
                                            </div>
                                            <ProjectCalculationTable project={project} canEdit={canEditProject} />
                                        </div>
                                    </section>

                                    {/* PAYMENT LOGS */}
                                    <section>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                            <SectionHeader 
                                                title="Payment Transaction Log" 
                                                description="All incoming deposits and verified project payments" 
                                            />
                                            {canEditProject && (
                                                <Link href={route('payments.create', { project_id: project.id })}>
                                                    <button style={{ 
                                                        padding: '10px 20px', background: '#f8fafc', 
                                                        border: '1px solid #e2e8f0', borderRadius: '12px', 
                                                        color: '#4f46e5', fontSize: '0.85rem', fontWeight: 800, 
                                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                                                    }}>
                                                        + Record Payment
                                                    </button>
                                                </Link>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                                            {project.payments?.length > 0 ? (
                                                project.payments.map((p) => (
                                                    <div key={p.id} style={{ 
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                        padding: '20px 24px', background: '#fff', 
                                                        borderRadius: '24px', border: '1px solid #f1f5f9',
                                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                                                <CheckCircle2 size={20} />
                                                            </div>
                                                            <div>
                                                                <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>{fmt(p.amount)}</p>
                                                                <p style={{ margin: '2px 0 0', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Verified Transaction • {p.payment_method || 'Direct Deposit'}</p>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <a 
                                                                href={route('payments.show', p.id) + '?print=true'} 
                                                                target="_blank" 
                                                                title="Print Receipt"
                                                                style={{ 
                                                                    width: '36px', height: '36px', borderRadius: '10px', 
                                                                    background: '#f8fafc', color: '#64748b', 
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                                                    textDecoration: 'none', border: '1px solid #f1f5f9'
                                                                }}
                                                            >
                                                                <Printer size={16} />
                                                            </a>
                                                            {canEditProject && (
                                                                <button 
                                                                    onClick={() => handlePaymentDelete(p.id)}
                                                                    title="Delete Payment Record"
                                                                    style={{ 
                                                                        width: '36px', height: '36px', borderRadius: '10px', 
                                                                        background: '#fef2f2', color: '#ef4444', 
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                                                        border: '1px solid #fee2e2', cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            )}
                                                            <div style={{ textAlign: 'right' }}>
                                                                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>{new Date(p.payment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                                <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'flex-end' }}>
                                                                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#10b981', background: '#ecfdf5', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>Received</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{ textAlign: 'center', padding: '4rem 0', background: '#f8fafc', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
                                                    <DollarSign size={40} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                                                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>No payments recorded yet</p>
                                                    <p style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px' }}>Submit a payment to see it here</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    <section>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                            <SectionHeader 
                                                title="Internal Project Expense Log" 
                                                description="All specific costs and expenditures for this project" 
                                            />
                                            {canEditProject && (
                                                <Link href={route('expenses.create', { project_id: project.id })}>
                                                    <button style={{ 
                                                        padding: '10px 20px', background: '#f8fafc', 
                                                        border: '1px solid #e2e8f0', borderRadius: '12px', 
                                                        color: '#4f46e5', fontSize: '0.85rem', fontWeight: 800, 
                                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                                                    }}>
                                                        + Record Expense
                                                    </button>
                                                </Link>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {project.expenses?.length > 0 ? (
                                                project.expenses.map((e) => (
                                                    <div key={e.id} style={{ 
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                        padding: '20px 24px', background: '#fff', 
                                                        borderRadius: '24px', border: '1px solid #f1f5f9',
                                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                                                                <DollarSign size={20} />
                                                            </div>
                                                            <div>
                                                                <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>{fmt(e.amount)}</p>
                                                                <p style={{ margin: '2px 0 0', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>
                                                                    {e.title} • {e.vendor_name || 'Generic Vendor'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                            <div style={{ textAlign: 'right' }}>
                                                                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>
                                                                    {new Date(e.expense_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                </p>
                                                                <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'flex-end' }}>
                                                                    <span style={{ 
                                                                        fontSize: '0.65rem', fontWeight: 900, 
                                                                        color: e.status === 'paid' ? '#10b981' : '#f59e0b', 
                                                                        background: e.status === 'paid' ? '#ecfdf5' : '#fffbeb', 
                                                                        padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' 
                                                                    }}>
                                                                        {e.status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <Link href={route('expenses.show', e.id)}>
                                                                <button title="View Detail" style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                                                    <Eye size={16} />
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{ textAlign: 'center', padding: '4rem 0', background: '#f8fafc', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
                                                    <DollarSign size={40} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                                                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>No expenses found for this project</p>
                                                    <p style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px' }}>Log an expense to track project costs</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                </div>
                            )}

                            {/* INVENTORY TAB */}
                            {selectedTab === 'inventory' && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                        <SectionHeader title="Material Inventory" description={`Tracking ${connectedInventory?.length || 0} registered commodities`} />
                                        {canEditProject && (
                                            <Link href={route('inventory.create', { project_id: project.id })}>
                                                <button style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px', color: '#4f46e5', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>+ Add Item</button>
                                            </Link>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {connectedInventory?.map(item => (
                                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', background: '#fcfdfe', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Package size={20} color="#10b981" />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{item.name}</p>
                                                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', margin: 0 }}>SKU: {item.sku || 'N/A'}</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{item.quantity_in_stock} {item.unit}</p>
                                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', margin: 0 }}>{fmt(item.unit_price * item.quantity_in_stock)} Total</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CAD FILES TAB */}
                            {selectedTab === 'designs' && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                        <SectionHeader title="CAD & Engineering" description={`${designs?.length || 0} design files attached`} />
                                        {canEditProject && (
                                            <button onClick={() => fileInputRef.current.click()} style={{ padding: '8px 20px', background: '#4f46e5', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Upload size={16} /> Upload CAD
                                            </button>
                                        )}
                                    </div>

                                    {designs?.length > 0 ? (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '1.5rem' }}>
                                            {designs.map((d) => (
                                                <DesignCard
                                                    key={d.id}
                                                    design={d}
                                                    canEdit={canEditProject}
                                                    onDelete={() => handleDeleteDesign(d.id)}
                                                    onReplace={() => handleReplaceClick(d.id)}
                                                    onReview={() => handleReviewClick(d)}
                                                    onPreview={() => setPreviewDesign(d)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '4rem 0', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #e2e8f0' }}>
                                            <HardDrive size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                                            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#64748b', margin: 0 }}>No CAD files uploaded yet</p>
                                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>Upload blueprints and engineering files above</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* DOCUMENTS TAB */}
                            {selectedTab === 'documents' && (
                                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                        <SectionHeader 
                                            title="Formal Documentation" 
                                            description={`${project.documents?.length || 0} secure documents verified`} 
                                        />
                                        {canEditProject && (
                                            <button onClick={() => document.getElementById('doc-upload-input').click()} style={{ padding: '8px 20px', background: '#10b981', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Upload size={16} /> Add Documents
                                            </button>
                                        )}
                                        <input id="doc-upload-input" type="file" multiple style={{ display: 'none' }} onChange={handleDocumentUpload} />
                                    </div>

                                    {project.documents?.length > 0 ? (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                                            {project.documents.map(doc => (
                                                <DocumentItem 
                                                    key={doc.id} 
                                                    doc={doc} 
                                                    canEdit={canEditProject} 
                                                    onDelete={() => handleDocumentDelete(doc.id)}
                                                    onRename={(newName) => handleDocumentRename(doc.id, newName)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '4rem 0', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #e2e8f0' }}>
                                            <FileText size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                                            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#64748b', margin: 0 }}>No formal documents attached</p>
                                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>Upload contracts and agreements above</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TRACKING TAB */}
                            {selectedTab === 'status' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                    <section>
                                        <SectionHeader title="Deployment State" description="Update the project lifecycle status" />
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '1.5rem' }}>
                                            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                                                <button key={k} onClick={() => handleStatusClick(k)} style={{
                                                    padding: '12px 20px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800,
                                                    border: '1.5px solid', borderColor: localStatus === k ? v.color : '#f1f5f9',
                                                    background: localStatus === k ? v.bg : '#fff', color: localStatus === k ? v.color : '#64748b',
                                                    cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '8px'
                                                }}>
                                                    <v.icon size={16} /> {v.label}
                                                </button>
                                            ))}
                                        </div>
                                    </section>
                                    <section style={{ borderTop: '1px solid #f1f5f9', paddingTop: '2.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                            <SectionHeader title="Implementation Level" description="Mechanical completion percentage" />
                                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{localProgress}%</h2>
                                        </div>
                                        <div style={{ position: 'relative', height: '12px', background: '#f1f5f9', borderRadius: '10px' }}>
                                            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${localProgress}%`, background: '#4f46e5', borderRadius: '10px', transition: 'width 0.3s ease' }} />
                                            <input type="range" min="0" max="100" step="5" value={localProgress}
                                                onChange={e => setLocalProgress(Number(e.target.value))}
                                                onMouseUp={() => submitStatusUpdate(localStatus, localProgress)}
                                                style={{ position: 'absolute', top: '-10px', left: 0, width: '100%', height: '32px', opacity: 0, cursor: 'pointer' }}
                                            />
                                        </div>
                                    </section>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={styles.card}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem' }}>Operation Window</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <TimelineRow icon={Calendar} label="Date Launch" val={project.start_date} />
                                <TimelineRow icon={ChevronRight} label="Target Finish" val={project.end_date} />
                            </div>
                        </div>

                        <div style={styles.card}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Capital History</h3>
                                <Link href={route('payments.index', { project_id: project.id })} style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4f46e5' }}>Analyze</Link>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {project.payments?.slice(0, 3).map(p => (
                                    <div key={p.id} style={{ padding: '12px', background: '#fcfdfe', border: '1px solid #f8fafc', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{fmt(p.amount)}</p>
                                            <p style={{ fontSize: '0.65rem', fontWeight: 600, color: '#94a3b8', margin: 0 }}>{p.payment_date}</p>
                                        </div>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── DESIGN PREVIEW MODAL ── */}
            <Modal show={!!previewDesign} onClose={() => setPreviewDesign(null)} maxWidth="5xl">
                <div style={{ background: '#0f172a', padding: '1rem', display: 'flex', flexDirection: 'column', height: '85vh' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 10px' }}>
                        <div>
                            <h3 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontWeight: 800 }}>{previewDesign?.file_name}</h3>
                            <p style={{ margin: '2px 0 0', color: '#94a3b8', fontSize: '0.75rem' }}>{previewDesign?.file_type} • File Preview</p>
                        </div>
                        <button onClick={() => setPreviewDesign(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                            <CloseIcon size={18} />
                        </button>
                    </div>
                    
                    <div style={{ flex: 1, background: '#1e293b', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {previewDesign?.file_type?.startsWith('image/') ? (
                            <img src={`/storage/${previewDesign.file_path}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} alt="Design Preview" />
                        ) : previewDesign?.file_type === 'application/pdf' ? (
                            <iframe src={`/storage/${previewDesign.file_path}`} style={{ width: '100%', height: '100%', border: 'none' }} title="PDF Preview" />
                        ) : (
                            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                                <FileSearch size={64} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                                <p>No direct preview available for this file type ({previewDesign?.file_type})</p>
                                <a href={`/storage/${previewDesign?.file_path}`} download style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 800 }}>Download to view locally</a>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            {/* ── DESIGN REVIEW MODAL ── */}
            <Modal show={!!reviewDesign} onClose={() => setReviewDesign(null)} maxWidth="md">
                <div style={{ padding: '2rem', background: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>File Review & Remarks</h3>
                        <button onClick={() => setReviewDesign(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}><CloseIcon size={20} /></button>
                    </div>

                    <form onSubmit={handleReviewSave}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Status</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {[
                                    { id: 'pending', label: 'Pending Review', color: '#f59e0b', bg: '#fffbeb', icon: Clock },
                                    { id: 'approved', label: 'Approved', color: '#10b981', bg: '#ecfdf4', icon: CheckCircle },
                                    { id: 'modification_required', label: 'Modification Required', color: '#ef4444', bg: '#fef2f2', icon: AlertTriangle },
                                ].map(st => (
                                    <button 
                                        key={st.id} 
                                        type="button" 
                                        onClick={() => setReviewForm(prev => ({ ...prev, status: st.id }))}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: '2px solid',
                                            borderColor: reviewForm.status === st.id ? st.color : '#f1f5f9',
                                            background: reviewForm.status === st.id ? st.bg : '#fff',
                                            color: reviewForm.status === st.id ? st.color : '#64748b',
                                            cursor: 'pointer', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem'
                                        }}
                                    >
                                        <st.icon size={18} />
                                        {st.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Remarks / Engineering Notes</label>
                            <textarea 
                                value={reviewForm.remarks}
                                onChange={e => setReviewForm(prev => ({ ...prev, remarks: e.target.value }))}
                                placeholder="Add technical comments or modification instructions here..."
                                style={{ width: '100%', height: '120px', padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', resize: 'none' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="button" onClick={() => setReviewDesign(null)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#fff', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#4f46e5', border: 'none', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Save Changes</button>
                        </div>
                    </form>
                </div>
            </Modal>

            <style>{`
                aside { z-index: 110 !important; }
                header { z-index: 105 !important; }
                .design-card-overlay { opacity: 0; transition: opacity 0.2s ease; }
                .design-card:hover .design-card-overlay { opacity: 1; }
            `}</style>
        </FigmaLayout>
    );
}

function DocumentItem({ doc, canEdit, onDelete, onRename }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(doc.file_name);

    return (
        <div style={{
            background: '#fff', border: '1px solid #f1f5f9', borderRadius: '20px', padding: '1.25rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <div style={{ width: '48px', height: '48px', background: '#f0fdf4', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                    <FileText size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    {isEditing ? (
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <input 
                                value={newName} 
                                onChange={e => setNewName(e.target.value)}
                                style={{ flex: 1, padding: '4px 8px', borderRadius: '6px', border: '1px solid #3b82f6', fontSize: '0.85rem' }} 
                            />
                            <button onClick={() => { onRename(newName); setIsEditing(false); }} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', padding: '0 8px', cursor: 'pointer' }}>Save</button>
                        </div>
                    ) : (
                        <>
                            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.file_name}</h4>
                            <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{(doc.file_size / 1024 / 1024).toFixed(2)} MB • {new Date(doc.created_at).toLocaleDateString()}</p>
                        </>
                    )}
                </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginLeft: '12px' }}>
                <a href={`/storage/${doc.file_path}`} download style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f8fafc', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                    <Download size={14} />
                </a>
                {canEdit && (
                    <>
                        <button onClick={() => setIsEditing(!isEditing)} style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f8fafc', color: '#64748b', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Pencil size={14} />
                        </button>
                        <button onClick={onDelete} style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef2f2', color: '#ef4444', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Trash2 size={14} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

function DesignCard({ design, canEdit, onDelete, onReplace, onReview, onPreview }) {
    const isImage = design.file_type && design.file_type.startsWith('image/');
    const ext = (design.file_name || 'FILE').split('.').pop().toUpperCase();
    const sizeMB = design.file_size ? (design.file_size / 1024 / 1024).toFixed(2) : '0';

    const getStatusStyle = (s) => {
        switch(s) {
            case 'approved': return { color: '#10b981', bg: '#ecfdf5', label: 'Approved', icon: CheckCircle };
            case 'modification_required': return { color: '#ef4444', bg: '#fef2f2', label: 'Modification Required', icon: AlertTriangle };
            default: return { color: '#f59e0b', bg: '#fffbeb', label: 'Pending Review', icon: Clock };
        }
    };
    const ss = getStatusStyle(design.status);

    return (
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem' }}>
                {/* Thumbnail / Icon Section */}
                <div onClick={onPreview} style={{ width: '100px', height: '100px', flexShrink: 0, borderRadius: '16px', background: '#f8fafc', border: '1px solid #f1f5f9', overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isImage
                        ? <img src={`/storage/${design.file_path}`} alt={design.file_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ textAlign: 'center' }}>
                            <HardDrive size={32} color="#4f46e5" />
                            <p style={{ margin: '4px 0 0', fontSize: '0.65rem', fontWeight: 900, color: '#4f46e5', background: '#f0efff', padding: '2px 6px', borderRadius: '4px' }}>{ext}</p>
                          </div>
                    }
                </div>

                {/* Info Content Section */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Header Row: Name and Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 950, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={design.file_name}>
                                {design.file_name}
                            </h4>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '2px 8px', borderRadius: '6px' }}>
                                    <Clock size={12} /> {new Date(design.created_at).toLocaleDateString()}
                                </span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', background: '#f8fafc', padding: '2px 8px', borderRadius: '6px' }}>
                                    {sizeMB} MB
                                </span>
                            </div>
                        </div>
                        
                        {/* Status Badge - isolated */}
                        <div style={{ padding: '8px 14px', borderRadius: '12px', background: ss.bg, color: ss.color, display: 'flex', alignItems: 'center', gap: '8px', border: `1px solid ${ss.color}20`, flexShrink: 0 }}>
                            <ss.icon size={15} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{ss.label}</span>
                        </div>
                    </div>

                    {/* Remarks Section - more robust */}
                    <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9', marginTop: '4px' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: design.remarks ? '#475569' : '#cbd5e1', fontWeight: 600, display: 'flex', gap: '10px', fontStyle: design.remarks ? 'normal' : 'italic' }}>
                            <MessageSquare size={15} style={{ flexShrink: 0, marginTop: '2px', opacity: 0.5 }} />
                            <span>{design.remarks || 'No engineering remarks added yet...'}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Always Visible Actions Footer */}
            <div style={{ padding: '1rem 1.5rem', background: '#fcfdfe', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={onPreview} style={{ padding: '10px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#1e293b', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
                        <Maximize2 size={14} /> View
                    </button>
                    <a href={`/storage/${design.file_path}`} download style={{ padding: '10px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#1e293b', fontSize: '0.85rem', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
                        <Download size={14} /> Download
                    </a>
                    {canEdit && (
                        <button onClick={onReview} style={{ padding: '10px 16px', background: '#4f46e5', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'opacity 0.2s' }}>
                            <MessageSquare size={14} /> Review File
                        </button>
                    )}
                </div>
                
                {canEdit && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={onReplace} title="Replace File" style={{ width: '40px', height: '40px', background: 'none', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <RefreshCw size={16} />
                        </button>
                        <button onClick={onDelete} title="Delete File" style={{ width: '40px', height: '40px', background: 'none', border: '1px solid #fee2e2', borderRadius: '10px', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
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

function SectionHeader({ title, description }) {
    return (
        <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{title}</h3>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', margin: '2px 0 0' }}>{description}</p>
        </div>
    );
}

function TimelineRow({ icon: Icon, label, val }) {
    return (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <Icon size={20} />
            </div>
            <div>
                <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', margin: 0, textTransform: 'uppercase' }}>{label}</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', margin: 0 }}>{val || 'No Date'}</p>
            </div>
        </div>
    );
}
