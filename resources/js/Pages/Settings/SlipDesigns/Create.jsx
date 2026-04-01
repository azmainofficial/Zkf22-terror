import { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Save, Upload, Palette, Layout, FileText, Image as ImageIcon,
         Building2, PenLine, Landmark } from 'lucide-react';

const TYPE_META = {
    invoice:  { label: 'Invoice',      color: '#6366f1' },
    payment:  { label: 'Payment',      color: '#10b981' },
    payroll:  { label: 'Payroll Slip', color: '#f59e0b' },
    expense:  { label: 'Expense',      color: '#ef4444' },
    project:  { label: 'Project Doc',  color: '#3b82f6' },
    report:   { label: 'Report',       color: '#8b5cf6' },
};

const FONTS = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins'];

const card = {
    background: '#fff',
    borderRadius: '20px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
    padding: '1.75rem',
};

const inp = {
    width: '100%',
    padding: '11px 1rem',
    borderRadius: '10px',
    border: '1.5px solid #eef2f9',
    background: '#f8fafc',
    fontSize: '0.875rem',
    fontWeight: 600,
    outline: 'none',
    color: '#1e293b',
    transition: 'border-color 0.2s',
};

const lbl = {
    fontSize: '0.7rem',
    fontWeight: 800,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px',
    display: 'block',
};

const sectionTitle = (icon, text) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
        {icon}
        <h3 style={{ fontSize: '0.8rem', fontWeight: 900, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{text}</h3>
    </div>
);

export default function Create({ auth, documentTypes }) {
    const types = documentTypes || ['invoice', 'payment', 'payroll', 'expense', 'project', 'report'];

    const [logoPreview, setLogoPreview] = useState(null);
    const [watermarkPreview, setWatermarkPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'invoice',
        accent_color: '#6366f1',
        font_family: 'Inter',
        footer_text: '',
        company_name: '',
        company_address: '',
        company_tagline: '',
        show_signature_lines: false,
        show_bank_details: false,
        bank_details: '',
        header_logo: null,
        watermark_image: null,
        is_active: false,
    });

    const accentColor = data.accent_color || '#6366f1';

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Create Document Template" />

            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '4rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <Link href={route('slip-designs.index')} style={{ textDecoration: 'none' }}>
                        <button style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fff', border: '1.5px solid #f0eeff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                            <ChevronLeft size={18} />
                        </button>
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Create New Template</h1>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600, margin: '4px 0 0' }}>Configure a print design for receipts, invoices, salary slips, and more</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: '2rem' }} className="rdm-grid">
                    
                    {/* ─── Form ─── */}
                    <form onSubmit={e => { e.preventDefault(); post(route('slip-designs.store')); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Core Identity */}
                        <div style={card}>
                            {sectionTitle(<Layout size={15} color="#6366f1" />, 'Core Identity')}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="rdm-cols">
                                <div>
                                    <label style={lbl}>Template Name</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g. Standard Invoice" style={inp} />
                                    {errors.name && <p style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700, marginTop: '4px' }}>{errors.name}</p>}
                                </div>
                                <div>
                                    <label style={lbl}>Document Type</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px' }}>
                                        {types.map(type => {
                                            const meta = TYPE_META[type] || { label: type, color: '#6366f1' };
                                            const sel  = data.type === type;
                                            return (
                                                <button key={type} type="button" onClick={() => setData('type', type)}
                                                    style={{ padding: '8px 4px', border: `1.5px solid ${sel ? meta.color : '#f0eeff'}`, background: sel ? meta.color : '#fff', color: sel ? '#fff' : '#64748b', borderRadius: '8px', fontSize: '0.68rem', fontWeight: 800, textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                    {meta.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.type && <p style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700, marginTop: '4px' }}>{errors.type}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Company Branding */}
                        <div style={card}>
                            {sectionTitle(<Building2 size={15} color="#6366f1" />, 'Company Information')}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={lbl}>Company / Business Name</label>
                                    <input type="text" value={data.company_name} onChange={e => setData('company_name', e.target.value)} placeholder="Your Company Ltd." style={inp} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="rdm-cols">
                                    <div>
                                        <label style={lbl}>Tagline / Slogan</label>
                                        <input type="text" value={data.company_tagline} onChange={e => setData('company_tagline', e.target.value)} placeholder="Excellence in every detail" style={inp} />
                                    </div>
                                    <div>
                                        <label style={lbl}>Address</label>
                                        <input type="text" value={data.company_address} onChange={e => setData('company_address', e.target.value)} placeholder="123 Business Ave, Dhaka" style={inp} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visual Branding */}
                        <div style={card}>
                            {sectionTitle(<ImageIcon size={15} color="#6366f1" />, 'Visual Branding')}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                                {/* Logo */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                                    <div style={{ width: '90px', height: '90px', background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                        {logoPreview ? <img src={logoPreview} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} /> : <Upload size={22} color="#94a3b8" />}
                                    </div>
                                    <div>
                                        <label style={lbl}>Header Logo</label>
                                        <input type="file" id="logo_upload" onChange={e => { const f = e.target.files[0]; if (f) { setData('header_logo', f); setLogoPreview(URL.createObjectURL(f)); }}} style={{ display: 'none' }} accept="image/*" />
                                        <label htmlFor="logo_upload" style={{ display: 'inline-block', padding: '9px 14px', background: '#f8fafc', border: '1.5px solid #f0eeff', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, color: '#1e1b4b', cursor: 'pointer' }}>Upload Logo</label>
                                        <p style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, margin: '5px 0 0' }}>PNG with transparency preferred</p>
                                    </div>
                                </div>

                                {/* Watermark */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                                    <div style={{ width: '90px', height: '90px', background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                        {watermarkPreview ? <img src={watermarkPreview} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px', opacity: 0.3 }} /> : <FileText size={22} color="#94a3b8" />}
                                    </div>
                                    <div>
                                        <label style={lbl}>Background Watermark</label>
                                        <input type="file" id="watermark_upload" onChange={e => { const f = e.target.files[0]; if (f) { setData('watermark_image', f); setWatermarkPreview(URL.createObjectURL(f)); }}} style={{ display: 'none' }} accept="image/*" />
                                        <label htmlFor="watermark_upload" style={{ display: 'inline-block', padding: '9px 14px', background: '#f8fafc', border: '1.5px solid #f0eeff', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, color: '#1e1b4b', cursor: 'pointer' }}>Upload Watermark</label>
                                        <p style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, margin: '5px 0 0' }}>Semi-transparent crest, logo or seal</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Typography & Color */}
                        <div style={card}>
                            {sectionTitle(<Palette size={15} color="#6366f1" />, 'Typography & Color')}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }} className="rdm-cols">
                                <div>
                                    <label style={lbl}>Accent Color</label>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <input type="color" value={data.accent_color} onChange={e => setData('accent_color', e.target.value)} style={{ width: '44px', height: '44px', padding: 0, border: 'none', borderRadius: '10px', cursor: 'pointer', background: 'transparent' }} />
                                        <input type="text" value={data.accent_color} onChange={e => setData('accent_color', e.target.value)} style={{ ...inp, fontFamily: 'monospace', textTransform: 'uppercase' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={lbl}>Font Family</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                                        {FONTS.map(font => (
                                            <button key={font} type="button" onClick={() => setData('font_family', font)}
                                                style={{ padding: '8px', border: `1.5px solid ${data.font_family === font ? '#6366f1' : '#f0eeff'}`, background: data.font_family === font ? '#f5f3ff' : '#fff', color: data.font_family === font ? '#4f46e5' : '#64748b', borderRadius: '7px', fontSize: '0.75rem', fontWeight: 800, fontFamily: font, cursor: 'pointer', transition: 'all 0.2s' }}>
                                                {font}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label style={lbl}>Footer / Terms Text</label>
                                <textarea value={data.footer_text} onChange={e => setData('footer_text', e.target.value)} style={{ ...inp, minHeight: '80px', resize: 'vertical' }} placeholder="Generated by system. All amounts in BDT. For queries contact accounts@company.com" />
                            </div>
                        </div>

                        {/* Print Options */}
                        <div style={card}>
                            {sectionTitle(<PenLine size={15} color="#6366f1" />, 'Print Options')}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { key: 'show_signature_lines', label: 'Include signature lines (Authorized, Received By, etc.)' },
                                    { key: 'show_bank_details',    label: 'Show bank / payment details section' },
                                    { key: 'is_active',            label: 'Set as the active default template for this document type' },
                                ].map(({ key, label }) => (
                                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1.5px solid #f0eeff' }}>
                                        <input type="checkbox" checked={data[key]} onChange={e => setData(key, e.target.checked)} style={{ width: '17px', height: '17px', cursor: 'pointer', accentColor: '#6366f1' }} />
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>{label}</span>
                                    </label>
                                ))}
                                {data.show_bank_details && (
                                    <div>
                                        <label style={lbl}>Bank / Payment Details</label>
                                        <textarea value={data.bank_details} onChange={e => setData('bank_details', e.target.value)} style={{ ...inp, minHeight: '80px', resize: 'vertical' }} placeholder="Bank Name: XYZ Bank&#10;Account No: 1234-5678&#10;Routing: 0201..." />
                                    </div>
                                )}
                            </div>
                        </div>

                        <button type="submit" disabled={processing} style={{ height: '54px', background: 'linear-gradient(135deg, #1e1b4b, #4f46e5)', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 8px 25px rgba(30,27,75,0.2)', transition: 'all 0.2s' }}>
                            <Save size={20} /> {processing ? 'Saving...' : 'Create Template'}
                        </button>
                    </form>

                    {/* ─── Live Preview ─── */}
                    <div className="rdm-preview">
                        <div style={{ ...card, background: '#f8fafc', border: 'none', padding: '1rem', position: 'sticky', top: '90px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '0.8rem', fontWeight: 900, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Live Preview</h3>
                                <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 800 }}>A4 SCALE</span>
                            </div>

                            {/* A4 document preview */}
                            <div style={{ width: '100%', aspectRatio: '210/297', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: data.font_family, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
                                
                                {/* Watermark */}
                                {watermarkPreview && (
                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.05, zIndex: 1, pointerEvents: 'none' }}>
                                        <img src={watermarkPreview} style={{ width: '55%', objectFit: 'contain' }} />
                                    </div>
                                )}

                                {/* Header */}
                                <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${accentColor}`, position: 'relative', zIndex: 10 }}>
                                    <div>
                                        {logoPreview ? (
                                            <img src={logoPreview} style={{ height: '30px', objectFit: 'contain' }} />
                                        ) : (
                                            <div style={{ height: '28px', width: '72px', border: '1px dashed #cbd5e1', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.45rem', fontWeight: 800, color: '#94a3b8', background: '#f8fafc' }}>LOGO</div>
                                        )}
                                        {data.company_name && <p style={{ fontSize: '0.55rem', fontWeight: 800, color: '#1e1b4b', margin: '4px 0 0' }}>{data.company_name}</p>}
                                        {data.company_tagline && <p style={{ fontSize: '0.45rem', fontWeight: 600, color: '#94a3b8', margin: '2px 0 0' }}>{data.company_tagline}</p>}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <h2 style={{ fontSize: '1rem', fontWeight: 900, margin: 0, textTransform: 'uppercase', color: accentColor }}>{TYPE_META[data.type]?.label || data.type}</h2>
                                        <p style={{ fontSize: '0.45rem', fontWeight: 600, color: '#94a3b8', margin: '2px 0 0' }}># {data.type.substring(0,3).toUpperCase()}-2024-001</p>
                                    </div>
                                </div>

                                {/* Party Info */}
                                <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
                                    <div>
                                        <p style={{ fontSize: '0.45rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 2px' }}>To:</p>
                                        <p style={{ fontSize: '0.6rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Sample Client Corp.</p>
                                        <p style={{ fontSize: '0.45rem', color: '#94a3b8', margin: '1px 0 0' }}>client@example.com</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '0.45rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 2px' }}>Date:</p>
                                        <p style={{ fontSize: '0.55rem', fontWeight: 700, color: '#334155', margin: 0 }}>01 Apr 2024</p>
                                    </div>
                                </div>

                                {/* Table */}
                                <div style={{ padding: '0 24px', flex: 1, position: 'relative', zIndex: 10 }}>
                                    <div style={{ borderBottom: `1.5px solid ${accentColor}`, display: 'flex', paddingBottom: '4px', marginBottom: '6px' }}>
                                        <div style={{ flex: 1, fontSize: '0.42rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8' }}>Description</div>
                                        <div style={{ width: '35px', textAlign: 'right', fontSize: '0.42rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8' }}>Amount</div>
                                    </div>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', padding: '4px 0' }}>
                                            <div style={{ flex: 1, fontSize: '0.52rem', color: '#475569', fontWeight: 600 }}>Service Item {i}</div>
                                            <div style={{ width: '35px', textAlign: 'right', fontSize: '0.52rem', fontWeight: 800, color: '#1e1b4b' }}>৳500</div>
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                        <div style={{ width: '45%', borderTop: '1px solid #f1f5f9', paddingTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '0.55rem', fontWeight: 900, color: accentColor, textTransform: 'uppercase' }}>Total</span>
                                            <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#1e1b4b' }}>৳1,500</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Signature Lines */}
                                {data.show_signature_lines && (
                                    <div style={{ padding: '10px 24px 0', display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
                                        {['Authorized By', 'Received By', 'Accounts'].map(s => (
                                            <div key={s} style={{ textAlign: 'center' }}>
                                                <div style={{ width: '60px', borderTop: '1px solid #94a3b8', marginBottom: '3px' }} />
                                                <p style={{ fontSize: '0.4rem', color: '#94a3b8', fontWeight: 600, margin: 0 }}>{s}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Footer */}
                                <div style={{ background: `${accentColor}08`, padding: '10px 24px', borderTop: `1.5px solid ${accentColor}20`, position: 'relative', zIndex: 10, marginTop: 'auto' }}>
                                    {data.company_address && <p style={{ fontSize: '0.42rem', color: '#94a3b8', fontWeight: 600, margin: '0 0 2px' }}>📍 {data.company_address}</p>}
                                    <p style={{ fontSize: '0.42rem', color: '#94a3b8', fontWeight: 600, margin: 0, textAlign: 'center', whiteSpace: 'pre-wrap' }}>{data.footer_text || 'System generated document. Please retain for records.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 1050px) {
                    .rdm-grid { grid-template-columns: 1fr !important; }
                    .rdm-cols { grid-template-columns: 1fr !important; }
                    .rdm-preview { display: none; }
                }
            `}</style>
        </FigmaLayout>
    );
}
