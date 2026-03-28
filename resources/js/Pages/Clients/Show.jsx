import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Mail,
    Phone,
    Globe,
    MapPin,
    Calendar,
    Plus,
    FileText,
    Briefcase,
    CheckCircle2,
    Clock,
    Package,
    Download,
    Trash2,
    Pencil,
    TrendingUp,
    CreditCard,
    Layers,
    Upload,
    Eye,
    Table,
    Ruler,
    DollarSign,
    Zap,
    ExternalLink,
    ChevronRight,
    ChevronDown,
    ArrowRight,
    Search,
    Filter,
    Activity,
    LifeBuoy,
    Info,
    Inbox,
    Shield
} from 'lucide-react';
import Modal from '@/Components/Modal';

const cardStyle = {
    background: '#fff',
    borderRadius: '24px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
    padding: '1.5rem',
    position: 'relative',
    overflow: 'hidden'
};

const badgeStyle = (status) => {
    const styles = {
        completed: { bg: '#ecfdf5', color: '#10b981', label: 'Completed' },
        active: { bg: '#eff6ff', color: '#3b82f6', label: 'Active' },
        pending: { bg: '#fffbeb', color: '#d97706', label: 'Pending' },
        default: { bg: '#f8fafc', color: '#64748b', label: status },
    };
    const s = styles[status] || styles.default;
    return {
        style: {
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: 800,
            background: s.bg,
            color: s.color,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            border: `1.5px solid ${s.color}20`
        },
        label: s.label
    };
};

const inputStyle = (error) => ({
    width: '100%',
    height: '48px',
    padding: '0 1rem',
    borderRadius: '12px',
    border: `1.5px solid ${error ? '#fca5a5' : '#f0eeff'}`,
    background: '#f8fafc',
    fontSize: '0.9rem',
    fontWeight: 700,
    outline: 'none',
    transition: 'all 0.2s',
    color: '#1e1b4b'
});

export default function Show({ auth, client, projects, stats, paymentMethods = [] }) {
    const [activeTab, setActiveTab] = useState('projects');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showDesignModal, setShowDesignModal] = useState(false);

    const designForm = useForm({
        title: '',
        project_id: '',
        file: null,
        type: 'floor_plan',
        description: '',
    });

    const paymentForm = useForm({
        client_id: client.id,
        payment_type: 'incoming',
        payment_date: new Date().toISOString().split('T')[0],
        amount: '',
        payment_method: '',
        status: 'completed',
        notes: '',
        redirect_back: true,
    });

    const handleRecordPayment = (e) => {
        e.preventDefault();
        paymentForm.post(route('payments.store'), {
            onSuccess: () => {
                setShowPaymentModal(false);
                paymentForm.reset();
            },
            preserveScroll: true,
        });
    };

    const handleUploadDesign = (e) => {
        e.preventDefault();
        designForm.post(route('clients.designs.upload', client.id), {
            onSuccess: () => {
                setShowDesignModal(false);
                designForm.reset();
            },
        });
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Client Profile - ${client.company_name}`} />

            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <Link href={route('clients.index')} style={{ textDecoration: 'none' }}>
                            <button style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff', border: '1.5px solid #f0eeff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <div style={{ width: '72px', height: '72px', borderRadius: '22px', background: '#f8fafc', border: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {client.logo ? (
                                    <img src={`/storage/${client.logo}`} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }} />
                                ) : (
                                    <Building2 size={32} color="#94a3b8" />
                                )}
                            </div>
                            <div>
                                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.02em' }}>{client.company_name}</h1>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6366f1', background: '#f5f3ff', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>{client.industry || 'Lead Partner'}</span>
                                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MapPin size={14} />
                                        {client.city || 'Global HQ'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => window.print()} style={{ height: '52px', padding: '0 1.5rem', background: '#fff', border: '1.5px solid #f0eeff', borderRadius: '14px', color: '#1e1b4b', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Download size={18} />
                            Export PDF
                        </button>
                        <Link href={route('clients.edit', client.id)} style={{ textDecoration: 'none' }}>
                            <button style={{ height: '52px', padding: '0 1.5rem', background: '#1e1b4b', border: 'none', borderRadius: '14px', color: '#fff', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(30,27,75,0.2)' }}>
                                <Pencil size={18} />
                                Edit Profile
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }} className="stats-grid">
                    <div style={{ ...cardStyle }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                                <Briefcase size={20} />
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#6366f1', background: '#ede9fe', padding: '4px 10px', borderRadius: '10px' }}>OPERATIONS</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Total Projects</p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>{stats.total_projects}</h2>
                    </div>

                    <div style={{ ...cardStyle }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                <TrendingUp size={20} />
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', background: '#d1fae5', padding: '4px 10px', borderRadius: '10px' }}>VALUE</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Total Contract</p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>৳{Number(stats.contract_value).toLocaleString()}</h2>
                    </div>

                    <div style={{ ...cardStyle }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                <DollarSign size={20} />
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#3b82f6', background: '#dbeafe', padding: '4px 10px', borderRadius: '10px' }}>INCOME</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Total Paid</p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981', margin: 0 }}>৳{Number(stats.total_paid).toLocaleString()}</h2>
                    </div>

                    <div style={{ ...cardStyle }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48' }}>
                                <Clock size={20} />
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#e11d48', background: '#ffe4e6', padding: '4px 10px', borderRadius: '10px' }}>OUTSTANDING</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Remaining Balance</p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#e11d48', margin: 0 }}>৳{Number(stats.total_due).toLocaleString()}</h2>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem' }} className="content-grid">
                    
                    {/* Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <Info size={18} color="#6366f1" />
                                Contact Information
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                        <Mail size={16} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>Email</p>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e1b4b', margin: 0, wordBreak: 'break-all' }}>{client.email}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                        <Phone size={16} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>Phone</p>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e1b4b', margin: 0 }}>{client.phone || 'Not provided'}</p>
                                    </div>
                                </div>

                                {client.website && (
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                            <Globe size={16} />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>Website</p>
                                            <a href={client.website} target="_blank" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6366f1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {client.website.replace(/^https?:\/\//, '')}
                                                <ExternalLink size={12} />
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                        <MapPin size={16} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>Address</p>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e1b4b', margin: 0, lineHeight: '1.5' }}>
                                            {client.address || 'No address provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {client.notes && (
                            <div style={{ ...cardStyle, background: '#1e1b4b', color: '#fff', border: 'none' }}>
                                <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Client Note</p>
                                <p style={{ fontSize: '0.9rem', fontWeight: 600, lineHeight: '1.6', margin: 0 }}>"{client.notes}"</p>
                            </div>
                        )}
                    </div>

                    {/* Main Content Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* Tabs Container */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid #f0eeff', paddingBottom: '2px' }}>
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                {['projects', 'payments', 'designs', 'inventory'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        style={{
                                            padding: '12px 4px',
                                            border: 'none',
                                            background: 'transparent',
                                            fontSize: '0.95rem',
                                            fontWeight: 800,
                                            color: activeTab === tab ? '#1e1b4b' : '#94a3b8',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            textTransform: 'capitalize',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <div style={{ position: 'absolute', bottom: '-2px', left: 0, right: 0, height: '3px', background: '#6366f1', borderRadius: '3px' }} />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div style={{ paddingBottom: '8px' }}>
                                {activeTab === 'projects' && (
                                    <Link href={route('projects.create', { client_id: client.id })} style={{ textDecoration: 'none' }}>
                                        <button style={{ height: '44px', padding: '0 1.25rem', background: '#6366f1', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Plus size={18} /> Add Project
                                        </button>
                                    </Link>
                                )}
                                {activeTab === 'payments' && (
                                    <button onClick={() => setShowPaymentModal(true)} style={{ height: '44px', padding: '0 1.25rem', background: '#6366f1', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Plus size={18} /> Record Payment
                                    </button>
                                )}
                                {activeTab === 'designs' && (
                                    <button onClick={() => setShowDesignModal(true)} style={{ height: '44px', padding: '0 1.25rem', background: '#6366f1', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Upload size={18} /> Upload Design
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Projects Tab */}
                        {activeTab === 'projects' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                                {projects?.length > 0 ? projects.map(project => (
                                    <div key={project.id} style={{ ...cardStyle }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                    <span style={badgeStyle(project.status).style}>{badgeStyle(project.status).label}</span>
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8' }}>#{project.id.toString().padStart(4, '0')}</span>
                                                </div>
                                                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>{project.title}</h4>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>Budget</p>
                                                <p style={{ fontSize: '1rem', fontWeight: 900, color: '#6366f1', margin: 0 }}>৳{Number(project.budget).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1.5px solid #f9faff' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Calendar size={14} color="#94a3b8" />
                                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>{new Date(project.start_date).toLocaleDateString()}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Link href={route('projects.show', project.id)} style={{ textDecoration: 'none' }}>
                                                    <button style={{ height: '36px', padding: '0 1rem', background: '#f5f3ff', border: 'none', borderRadius: '8px', color: '#6366f1', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        View <ArrowRight size={14} />
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ gridColumn: '1 / -1', ...cardStyle, padding: '4rem', textAlign: 'center', opacity: 0.6 }}>
                                        <Inbox size={48} style={{ margin: '0 auto 1.5rem' }} />
                                        <p style={{ fontWeight: 800 }}>No Projects Found</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Payments Tab */}
                        {activeTab === 'payments' && (
                            <div style={{ ...cardStyle, padding: 0 }}>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead style={{ background: '#f9faff', borderBottom: '1.5px solid #f5f3ff' }}>
                                            <tr>
                                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>Date</th>
                                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>Method</th>
                                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>Number</th>
                                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>Amount</th>
                                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {client.payments?.length > 0 ? client.payments.map(payment => (
                                                <tr key={payment.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#1e1b4b' }}>
                                                        {new Date(payment.payment_date).toLocaleDateString()}
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>{payment.payment_method}</span>
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>
                                                        #{payment.id.toString().padStart(6, '0')}
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', fontWeight: 900, color: '#10b981' }}>
                                                        ৳{Number(payment.amount).toLocaleString()}
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                                        <span style={badgeStyle(payment.status).style}>{payment.status}</span>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }}>
                                                        <CreditCard size={32} style={{ margin: '0 auto 1rem' }} />
                                                        <p style={{ fontSize: '0.85rem', fontWeight: 800 }}>No payments found</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Designs Tab */}
                        {activeTab === 'designs' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {client.designs?.length > 0 ? client.designs.map(design => {
                                    const ext = design.file_path.split('.').pop().toLowerCase();
                                    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
                                    return (
                                        <div key={design.id} style={{ ...cardStyle, padding: 0 }} className="design-card">
                                            <div style={{ height: '200px', background: '#f8fafc', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {isImage ? (
                                                    <img src={`/storage/${design.file_path}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <FileText size={48} color="#cbd5e1" />
                                                )}
                                                <div className="design-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(30,27,75,0.4)', opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'all 0.2s' }}>
                                                    <a href={`/storage/${design.file_path}`} target="_blank" style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e1b4b' }}>
                                                        <Eye size={20} />
                                                    </a>
                                                    <a href={`/storage/${design.file_path}`} download style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                                        <Download size={20} />
                                                    </a>
                                                </div>
                                            </div>
                                            <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <h5 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1e1b4b', margin: '0 0 2px' }}>{design.title}</h5>
                                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, margin: 0 }}>{new Date(design.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <button onClick={() => confirm('Delete this design?') && router.delete(route('designs.destroy', design.id))} style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', background: '#fff1f2', color: '#e11d48', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div style={{ gridColumn: '1 / -1', ...cardStyle, padding: '4rem', textAlign: 'center', opacity: 0.6 }}>
                                        <Layers size={48} style={{ margin: '0 auto 1.5rem' }} />
                                        <p style={{ fontWeight: 800 }}>No designs found</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Inventory Tab */}
                        {activeTab === 'inventory' && (
                            <div style={{ ...cardStyle, padding: 0 }}>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead style={{ background: '#f9faff', borderBottom: '1.5px solid #f5f3ff' }}>
                                            <tr>
                                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>Item Name</th>
                                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>Brand</th>
                                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Stock</th>
                                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Price</th>
                                                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {client.inventory_items?.length > 0 ? client.inventory_items.map(item => (
                                                <tr key={item.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#1e1b4b' }}>{item.name}</td>
                                                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>{item.brand?.name || 'Generic'}</td>
                                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: item.quantity_in_stock < 10 ? '#ef4444' : '#10b981' }}>{item.quantity_in_stock} {item.unit}</span>
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', fontWeight: 900, color: '#6366f1', textAlign: 'right' }}>
                                                        ৳{Number(item.unit_price).toLocaleString()}
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                                        <Link href={route('inventory.edit', item.id)}>
                                                            <button style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid #f0eeff', background: '#fff', cursor: 'pointer', color: '#94a3b8' }}>
                                                                <ChevronRight size={16} />
                                                            </button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }}>
                                                        <Package size={32} style={{ margin: '0 auto 1rem' }} />
                                                        <p style={{ fontSize: '0.85rem', fontWeight: 800 }}>No items linked to this client</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <Modal show={showPaymentModal} onClose={() => setShowPaymentModal(false)} maxWidth="md">
                <div style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f5f3ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CreditCard size={20} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Record Payment</h2>
                    </div>

                    <form onSubmit={handleRecordPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Date</label>
                                <input type="date" value={paymentForm.data.payment_date} onChange={e => paymentForm.setData('payment_date', e.target.value)} style={inputStyle(paymentForm.errors.payment_date)} required />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Amount (৳)</label>
                                <input type="number" step="0.01" value={paymentForm.data.amount} onChange={e => paymentForm.setData('amount', e.target.value)} style={inputStyle(paymentForm.errors.amount)} required />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Payment Method</label>
                            <div style={{ position: 'relative' }}>
                                <select value={paymentForm.data.payment_method} onChange={e => paymentForm.setData('payment_method', e.target.value)} style={{ ...inputStyle(paymentForm.errors.payment_method), appearance: 'none' }} required>
                                    <option value="">Select Method</option>
                                    {paymentMethods.map(m => <option key={m.id} value={m.code}>{m.name}</option>)}
                                </select>
                                <ChevronDown size={18} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Notes</label>
                            <textarea value={paymentForm.data.notes} onChange={e => paymentForm.setData('notes', e.target.value)} placeholder="Details..." style={{ ...inputStyle(), height: '80px', padding: '12px' }} />
                        </div>

                        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                            <button type="submit" disabled={paymentForm.processing} style={{ flex: 1, height: '52px', background: '#6366f1', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer' }}>
                                {paymentForm.processing ? 'Saving...' : 'Save Payment'}
                            </button>
                            <button type="button" onClick={() => setShowPaymentModal(false)} style={{ flex: 1, height: '52px', background: '#f8fafc', borderRadius: '12px', border: '1.5px solid #f0eeff', color: '#94a3b8', fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Design Modal */}
            <Modal show={showDesignModal} onClose={() => setShowDesignModal(false)} maxWidth="md">
                <div style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Upload size={20} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Upload Design</h2>
                    </div>

                    <form onSubmit={handleUploadDesign} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Title</label>
                            <input type="text" value={designForm.data.title} onChange={e => designForm.setData('title', e.target.value)} placeholder="e.g. Master Plan Alpha" style={inputStyle(designForm.errors.title)} required />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Project (Optional)</label>
                            <div style={{ position: 'relative' }}>
                                <select value={designForm.data.project_id} onChange={e => designForm.setData('project_id', e.target.value)} style={{ ...inputStyle(), appearance: 'none' }}>
                                    <option value="">No Project (General)</option>
                                    {client.projects?.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                                </select>
                                <ChevronDown size={18} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Select File</label>
                            <div style={{ position: 'relative', height: '100px', borderRadius: '12px', border: '2px dashed #f0eeff', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {designForm.data.file ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CheckCircle2 size={24} color="#10b981" />
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e1b4b' }}>{designForm.data.file.name}</span>
                                    </div>
                                ) : (
                                    <>
                                        <Upload size={20} color="#6366f1" style={{ marginBottom: '4px' }} />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>Choose a file...</span>
                                    </>
                                )}
                                <input type="file" onChange={e => designForm.setData('file', e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} required />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Description</label>
                            <textarea value={designForm.data.description} onChange={e => designForm.setData('description', e.target.value)} placeholder="Details..." style={{ ...inputStyle(), height: '80px', padding: '12px' }} />
                        </div>

                        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                            <button type="submit" disabled={designForm.processing} style={{ flex: 1, height: '52px', background: '#6366f1', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer' }}>
                                {designForm.processing ? 'Uploading...' : 'Save Design'}
                            </button>
                            <button type="button" onClick={() => setShowDesignModal(false)} style={{ flex: 1, height: '52px', background: '#f8fafc', borderRadius: '12px', border: '1.5px solid #f0eeff', color: '#94a3b8', fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <style>{`
                .design-card:hover .design-overlay { opacity: 1 !important; transform: scale(1.02); }
                @media (max-width: 900px) {
                    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    .content-grid { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 500px) {
                    .stats-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </FigmaLayout>
    );
}
