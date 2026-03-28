import { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Save, Upload, Type, Palette, Layout, FileText, Image as ImageIcon } from 'lucide-react';

const cardStyle = {
    background: '#fff',
    borderRadius: '24px',
    border: '1.5px solid #f0eeff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.05)',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden'
};

const inputStyle = {
    width: '100%',
    padding: '12px 1rem',
    borderRadius: '12px',
    border: '1.5px solid #f0eeff',
    background: '#f8fafc',
    fontSize: '0.9rem',
    fontWeight: 700,
    outline: 'none',
    transition: 'all 0.2s',
    color: '#1e1b4b'
};

export default function Create({ auth }) {
    const [logoPreview, setLogoPreview] = useState(null);
    const [watermarkPreview, setWatermarkPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'invoice',
        accent_color: '#6366f1',
        font_family: 'Inter',
        footer_text: '',
        header_logo: null,
        watermark_image: null,
        is_active: false
    });

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('header_logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleWatermarkChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('watermark_image', file);
            setWatermarkPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('slip-designs.store'));
    };

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Create Layout Template" />

            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <Link href={route('slip-designs.index')} style={{ textDecoration: 'none' }}>
                            <button style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff', border: '1.5px solid #f0eeff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <ChevronLeft size={20} />
                            </button>
                        </Link>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.02em' }}>Build New Template</h1>
                            <p style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 600, margin: '4px 0 0' }}>Configure visual layout for financial documents</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '2rem' }} className="responsive-grid">
                    
                    {/* Left Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Layout size={16} color="#6366f1" /> Core Identity
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="form-cols">
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Template Title</label>
                                    <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} style={inputStyle} placeholder="e.g. Standard Corporate" />
                                    {errors.name && <p style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 800, marginTop: '4px' }}>{errors.name}</p>}
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Target Document</label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {['invoice', 'payment'].map(type => (
                                            <button 
                                                key={type}
                                                type="button" 
                                                onClick={() => setData('type', type)}
                                                style={{ flex: 1, padding: '12px', border: `1.5px solid ${data.type === type ? '#6366f1' : '#f0eeff'}`, background: data.type === type ? '#6366f1' : '#fff', color: data.type === type ? '#fff' : '#64748b', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.2s' }}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.type && <p style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 800, marginTop: '4px' }}>{errors.type}</p>}
                                </div>
                            </div>
                        </div>

                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ImageIcon size={16} color="#6366f1" /> Visual Branding
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                                    <div style={{ width: '100px', height: '100px', background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {logoPreview ? <img src={logoPreview} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }} /> : <Upload size={24} color="#94a3b8" />}
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Brand Logo</label>
                                        <input type="file" id="logo_upload" onChange={handleLogoChange} style={{ display: 'none' }} accept="image/*" />
                                        <label htmlFor="logo_upload" style={{ display: 'inline-block', padding: '10px 16px', background: '#f8fafc', border: '1.5px solid #f0eeff', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, color: '#1e1b4b', cursor: 'pointer' }}>Select Image File</label>
                                        <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, margin: '6px 0 0' }}>High quality transparent PNG recommended</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', paddingTop: '1.5rem', borderTop: '1.5px solid #f9faff' }}>
                                    <div style={{ width: '100px', height: '100px', background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {watermarkPreview ? <img src={watermarkPreview} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px', opacity: 0.3 }} /> : <FileText size={24} color="#94a3b8" />}
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Document Watermark</label>
                                        <input type="file" id="watermark_upload" onChange={handleWatermarkChange} style={{ display: 'none' }} accept="image/*" />
                                        <label htmlFor="watermark_upload" style={{ display: 'inline-block', padding: '10px 16px', background: '#f8fafc', border: '1.5px solid #f0eeff', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, color: '#1e1b4b', cursor: 'pointer' }}>Select Image File</label>
                                        <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, margin: '6px 0 0' }}>Light background graphic pattern or crest</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Palette size={16} color="#6366f1" /> Layout & Typography
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }} className="form-cols">
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Primary Color</label>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input type="color" value={data.accent_color} onChange={e => setData('accent_color', e.target.value)} style={{ width: '48px', height: '48px', padding: 0, border: 'none', borderRadius: '12px', cursor: 'pointer', background: 'transparent' }} />
                                        <input type="text" value={data.accent_color} onChange={e => setData('accent_color', e.target.value)} style={{ ...inputStyle, fontFamily: 'monospace', textTransform: 'uppercase' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Typography Base</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                        {['Inter', 'Roboto', 'Open Sans', 'Lato'].map((font) => (
                                            <button 
                                                key={font} type="button" onClick={() => setData('font_family', font)}
                                                style={{ padding: '10px', border: `1.5px solid ${data.font_family === font ? '#6366f1' : '#f0eeff'}`, background: data.font_family === font ? '#f5f3ff' : '#fff', color: data.font_family === font ? '#4f46e5' : '#64748b', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, fontFamily: font, cursor: 'pointer' }}
                                            >
                                                {font}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Footer Document Text</label>
                                <textarea value={data.footer_text} onChange={e => setData('footer_text', e.target.value)} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Terms and conditions, thank you messages, or corporate addresses." />
                            </div>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e1b4b' }}>Use as active default format</span>
                            </label>
                        </div>

                        <button type="submit" disabled={processing} style={{ height: '56px', background: '#1e1b4b', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '1rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 8px 25px rgba(30,27,75,0.2)' }}>
                            <Save size={20} /> Deploy Layout Rules
                        </button>
                    </form>

                    {/* Right Live Preview Box */}
                    <div className="preview-container">
                        <div style={{ ...cardStyle, position: 'sticky', top: '100px', background: '#f8fafc', padding: '1rem', border: 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Render Preview</h3>
                                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800 }}>A4 SIZE FRAME</span>
                            </div>

                            {/* Actual A4 Scale Box */}
                            <div style={{ width: '100%', aspectRatio: '210/297', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: data.font_family, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                                
                                {/* Header */}
                                <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1.5px solid #f1f5f9', position: 'relative', zIndex: 10 }}>
                                    {logoPreview ? (
                                        <img src={logoPreview} style={{ height: '32px', objectFit: 'contain' }} />
                                    ) : (
                                        <div style={{ height: '32px', width: '80px', border: '1px dashed #cbd5e1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 800, color: '#94a3b8', background: '#f8fafc' }}>LOGO AREA</div>
                                    )}
                                    <div style={{ textAlign: 'right' }}>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, textTransform: 'uppercase', color: data.accent_color }}>{data.type}</h2>
                                        <p style={{ fontSize: '0.5rem', fontWeight: 800, color: '#94a3b8', margin: '2px 0 0' }}># {data.type.substring(0,3).toUpperCase()}-2024</p>
                                    </div>
                                </div>

                                {watermarkPreview && (
                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.05, zIndex: 1, pointerEvents: 'none' }}>
                                        <img src={watermarkPreview} style={{ width: '60%', objectFit: 'contain' }} />
                                    </div>
                                )}

                                {/* Body */}
                                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                        <div>
                                            <p style={{ fontSize: '0.55rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 2px' }}>Attn To:</p>
                                            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>Sample Client Corp.</p>
                                        </div>
                                    </div>

                                    {/* Mock Table */}
                                    <div style={{ borderBottom: `2px solid ${data.accent_color}`, display: 'flex', paddingBottom: '4px', marginBottom: '8px' }}>
                                        <div style={{ flex: 1, fontSize: '0.5rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8' }}>Item Description</div>
                                        <div style={{ width: '40px', textAlign: 'right', fontSize: '0.5rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8' }}>Amt</div>
                                    </div>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', padding: '6px 0' }}>
                                            <div style={{ flex: 1, fontSize: '0.65rem', color: '#475569', fontWeight: 600 }}>Standard Service Execution</div>
                                            <div style={{ width: '40px', textAlign: 'right', fontSize: '0.65rem', fontWeight: 800, color: '#1e1b4b' }}>$150</div>
                                        </div>
                                    ))}

                                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
                                        <div style={{ width: '50%', borderTop: '1px solid #f1f5f9', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: data.accent_color, textTransform: 'uppercase' }}>Net Total</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#1e1b4b' }}>$450</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div style={{ background: '#f8fafc', padding: '16px 24px', position: 'relative', zIndex: 10, borderTop: '1.5px solid #f0eeff' }}>
                                    <p style={{ fontSize: '0.5rem', color: '#94a3b8', fontWeight: 600, margin: 0, textAlign: 'center', whiteSpace: 'pre-wrap' }}>{data.footer_text || 'System generated financial document. Please retain for your records.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 1000px) {
                    .responsive-grid { grid-template-columns: 1fr !important; }
                    .form-cols { grid-template-columns: 1fr !important; }
                    .preview-container { display: none; }
                }
            `}</style>
        </FigmaLayout>
    );
}
