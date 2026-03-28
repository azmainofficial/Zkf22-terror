import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Pencil,
    Calendar,
    DollarSign,
    Package,
    FileText,
    Download,
    Eye,
    Image as ImageIcon,
    Upload,
    X,
    Activity,
    ShieldCheck,
    Briefcase,
    Building,
    Clock,
    TrendingUp,
    Layers,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Search,
    Filter,
    MoreHorizontal,
    Plus,
    LayoutGrid,
    List,
    LucideChevronRight,
    Zap,
    Scale,
    PieChart,
    Target
} from 'lucide-react';

const cardStyle = {
    background: '#fff',
    borderRadius: '20px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
    padding: '1.5rem',
    overflow: 'hidden'
};

const badgeStyle = (bg, color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 700,
    background: bg,
    color: color
});

export default function Show({ auth, project, connectedInventory, designs }) {
    const [selectedTab, setSelectedTab] = useState('overview');

    const budget = Number(project.budget) || 0;
    const actualCost = Number(project.actual_cost) || 0;
    const contractAmount = Number(project.contract_amount) || 0;
    const realizedCapital = Number(project.realized_capital) || 0;
    const remainingCapital = contractAmount - realizedCapital;

    const getStatusInfo = (status) => {
        const stats = {
            completed: { label: 'Completed', color: '#10b981', bg: '#ecfdf5', icon: CheckCircle2 },
            ongoing: { label: 'In Progress', color: '#6366f1', bg: '#f5f3ff', icon: Activity },
            pending: { label: 'Pending', color: '#f59e0b', bg: '#fffbeb', icon: Clock },
            cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#fef2f2', icon: X },
            on_hold: { label: 'On Hold', color: '#6b7280', bg: '#f3f4f6', icon: AlertCircle },
        };
        return stats[status] || stats.pending;
    };

    const statusInfo = getStatusInfo(project.status);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Zap },
        { id: 'milestones', label: 'Milestones', icon: Layers },
        { id: 'inventory', label: 'Link Inventory', icon: Package },
        { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    ];

    const stats = [
        { label: 'Contract Value', value: `৳${new Intl.NumberFormat().format(contractAmount)}`, icon: DollarSign, color: '#6366f1', bg: '#f5f3ff' },
        { label: 'Amount Paid', value: `৳${new Intl.NumberFormat().format(realizedCapital || 0)}`, icon: CheckCircle2, color: '#10b981', bg: '#ecfdf5' },
        { label: 'Remaining', value: `৳${new Intl.NumberFormat().format(remainingCapital)}`, icon: AlertCircle, color: '#f43f5e', bg: '#fff1f2' },
        { label: 'Progress', value: `${project.progress || 0}%`, icon: PieChart, color: '#8b5cf6', bg: '#f9f7ff' },
    ];

    return (
        <FigmaLayout user={auth.user}>
            <Head title={`Project - ${project.title}`} />

            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <Link href={route('projects.index')}>
                            <button style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fff', border: '1.5px solid #ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6366f1', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f5f3ff'}
                                onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                                <ArrowLeft size={18} />
                            </button>
                        </Link>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '4px' }}>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e1b4b', margin: 0, letterSpacing: '-0.02em' }}>{project.title}</h1>
                                <span style={badgeStyle(statusInfo.bg, statusInfo.color)}>
                                    <statusInfo.icon size={12} />
                                    {statusInfo.label}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Building size={14} color="#9ca3af" />
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280' }}>{project.client?.company_name || project.client?.name}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Calendar size={14} color="#9ca3af" />
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280' }}>Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No date'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link href={route('projects.edit', project.id)} style={{ textDecoration: 'none' }}>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.7rem 1.5rem', background: '#1e1b4b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(30,27,75,0.2) transition: all 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#312e81'}
                                onMouseLeave={e => e.currentTarget.style.background = '#1e1b4b'}>
                                <Pencil size={18} />
                                Edit Project
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }} className="stats-grid">
                    {stats.map((s, i) => (
                        <div key={i} style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <s.icon size={20} color={s.color} />
                                </div>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Metrics</span>
                            </div>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', margin: '0 0 4px' }}>{s.label}</p>
                            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Navigation Tabs */}
                <div style={{ display: 'flex', gap: '2px', padding: '4px', background: '#f5f3ff', borderRadius: '14px', width: 'fit-content' }}>
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setSelectedTab(t.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.25rem', borderRadius: '10px', border: 'none', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', background: selectedTab === t.id ? '#fff' : 'transparent', color: selectedTab === t.id ? '#6366f1' : '#9ca3af', boxShadow: selectedTab === t.id ? '0 2px 8px rgba(99,102,241,0.1)' : 'none' }}>
                            <t.icon size={16} />
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }} className="content-grid">
                    
                    {/* Main Content Area */}
                    <div style={{ minHeight: '400px' }}>
                        
                        {selectedTab === 'overview' && (
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1.5px solid #f5f3ff' }}>
                                    <FileText size={18} color="#6366f1" />
                                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Project Description</h3>
                                </div>
                                <p style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: '1.6', margin: 0 }}>{project.description || "No description provided for this project."}</p>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '2rem' }}>
                                    <div style={{ background: '#f9f7ff', padding: '1.25rem', borderRadius: '16px', border: '1.5px solid #f0eeff' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                            <Calendar size={16} color="#6366f1" />
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e1b4b' }}>Timeline</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af' }}>Start Date</span>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151' }}>{project.start_date || 'Not set'}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af' }}>Deadline</span>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151' }}>{project.deadline || 'Not set'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={{ background: '#f9f7ff', padding: '1.25rem', borderRadius: '16px', border: '1.5px solid #f0eeff' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                            <Target size={16} color="#6366f1" />
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e1b4b' }}>Priority & ID</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af' }}>Priority</span>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase' }}>{project.priority || 'Medium'}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af' }}>Project ID</span>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e1b4b', fontFamily: 'monospace' }}>#{project.id.toString().padStart(5, '0')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedTab === 'milestones' && (
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1.5px solid #f5f3ff' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <Layers size={18} color="#8b5cf6" />
                                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Payment Milestones</h3>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#6366f1' }}>Total: ৳{new Intl.NumberFormat().format(contractAmount)}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {project.contract_details?.map((m, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', background: '#f9f9fb', borderRadius: '16px', border: '1px solid #f0eeff' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#fff', border: '1.5px solid #f0f3ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>{i + 1}</div>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#374151' }}>{m.description}</span>
                                            </div>
                                            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1e1b4b' }}>৳{new Intl.NumberFormat().format(m.amount)}</span>
                                        </div>
                                    ))}
                                    {(!project.contract_details || project.contract_details.length === 0) && (
                                        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f9f9fb', borderRadius: '20px', border: '2px dashed #ede9fe' }}>
                                            <Layers size={32} color="#d1d5db" style={{ marginBottom: '1rem' }} />
                                            <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: 0 }}>No milestones defined for this project.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {selectedTab === 'inventory' && (
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1.5px solid #f5f3ff' }}>
                                    <Package size={18} color="#3b82f6" />
                                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Connected Inventory</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                                    {connectedInventory?.length > 0 ? (
                                        connectedInventory.map(item => (
                                            <Link key={item.id} href={route('inventory.show', item.id)} style={{ textDecoration: 'none' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderRadius: '14px', border: '1.5px solid #f0eeff', transition: 'all 0.2s', cursor: 'pointer' }}
                                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#f5f3ff'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0eeff'; e.currentTarget.style.background = 'transparent'; }}>
                                                    <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
                                                        <Package size={16} color="#3b82f6" />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', margin: 0 }}>{item.name}</p>
                                                        <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: '2px 0 0' }}>SKU: {item.sku || 'N/A'}</p>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>{item.quantity_in_stock} {item.unit}</p>
                                                        <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: '2px 0 0' }}>৳{new Intl.NumberFormat().format(item.unit_price)}/unit</p>
                                                    </div>
                                                    <ChevronRight size={16} color="#d1d5db" style={{ marginLeft: '1rem' }} />
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f9f9fb', borderRadius: '20px', border: '2px dashed #ede9fe' }}>
                                            <Package size={32} color="#d1d5db" style={{ marginBottom: '1rem' }} />
                                            <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: 0 }}>No inventory items linked to this project.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {selectedTab === 'gallery' && (
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1.5px solid #f5f3ff' }}>
                                    <ImageIcon size={18} color="#f43f5e" />
                                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Project Gallery</h3>
                                </div>
                                {designs?.length > 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                                        {designs.map(d => (
                                            <div key={d.id} style={{ borderRadius: '14px', overflow: 'hidden', border: '1.5px solid #f0eeff', position: 'relative', aspectRatio: '1' }}>
                                                <img src={`/storage/${d.image}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Design" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f9f9fb', borderRadius: '20px', border: '2px dashed #ede9fe' }}>
                                        <ImageIcon size={32} color="#d1d5db" style={{ marginBottom: '1rem' }} />
                                        <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: 0 }}>No images or designs uploaded for this project.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column (Side Details) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* Client Info Card */}
                        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #1e1b4b, #312e81)', border: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Building size={16} color="#fff" />
                                </div>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', margin: 0 }}>Client Info</h3>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800, color: '#1e1b4b' }}>
                                        {(project.client?.company_name || project.client?.name || 'C').charAt(0)}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: 0 }}>{project.client?.company_name || project.client?.name || 'Unassigned'}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#a5b4fc', margin: '2px 0 0' }}>Host Entity</p>
                                    </div>
                                </div>
                                
                                {project.client && (
                                    <Link href={route('clients.show', project.client.id)} style={{ textDecoration: 'none' }}>
                                        <button style={{ width: '100%', padding: '0.6rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                                            View Client Profile <ChevronRight size={14} />
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Project Thumbnail */}
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ImageIcon size={14} color="#6366f1" />
                                Project Thumbnail
                            </h3>
                            <div style={{ width: '100%', height: '200px', borderRadius: '14px', overflow: 'hidden', border: '1.5px solid #f0eeff' }}>
                                {project.image ? (
                                    <img src={`/storage/${project.image}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Project" />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: '#f9f9fb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                        <ImageIcon size={32} color="#d1d5db" />
                                        <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>No project image</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Pulse */}
                        <div style={{ padding: '1rem', borderRadius: '16px', background: '#ecfdf5', border: '1.5px solid #d1fae5', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }}></div>
                            <div>
                                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#065f46', margin: 0 }}>System Sync: Operational</p>
                                <p style={{ fontSize: '0.65rem', color: '#059669', margin: 0 }}>Last updated: {new Date(project.updated_at).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 992px) {
                    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    .content-grid { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 576px) {
                    .stats-grid { grid-template-columns: 1fr !important; }
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }
            `}</style>
        </FigmaLayout>
    );
}
