import React, { useState, useEffect } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { t } from '../../Lang/translation';
import { ArrowLeft, Save, Package, Building2, DollarSign, Plus, Loader2, X, Hash, Tag, Layers, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import Modal from '@/Components/Modal';

const fs = { width:'100%', boxSizing:'border-box', padding:'0.65rem 1rem 0.65rem 2.4rem', background:'#f9f7ff', border:'1.5px solid #ede9fe', borderRadius:'12px', fontSize:'0.88rem', color:'#1e1b4b', outline:'none', transition:'all 0.2s', fontFamily:'inherit' };
const fni = { ...fs, paddingLeft:'1rem' };
const oF = e => { e.target.style.borderColor='#8b5cf6'; e.target.style.boxShadow='0 0 0 3px rgba(139,92,246,0.1)'; };
const oB = e => { e.target.style.borderColor='#ede9fe'; e.target.style.boxShadow='none'; };
const lbl = (txt,r) => <label style={{fontSize:'0.78rem',fontWeight:700,color:'#4b5563',display:'block',marginBottom:'5px'}}>{txt}{r&&<span style={{color:'#ef4444',marginLeft:'3px'}}>*</span>}</label>;
const Fld = ({icon:I,error,children}) => <div style={{position:'relative'}}>{I&&<I size={14} color="#a78bfa" style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>}{children}{error&&<p style={{color:'#ef4444',fontSize:'0.7rem',marginTop:'4px',display:'flex',alignItems:'center',gap:'3px'}}><AlertCircle size={11}/>{error}</p>}</div>;
const Card = ({title,sub,icon:I,acc='#6366f1',children}) => <div style={{background:'#fff',borderRadius:'18px',border:'1.5px solid #f0eeff',boxShadow:'0 2px 12px rgba(99,102,241,0.05)',overflow:'hidden'}}><div style={{padding:'1rem 1.5rem',borderBottom:'1px solid #f5f3ff',display:'flex',alignItems:'center',gap:'0.75rem'}}><div style={{width:'34px',height:'34px',borderRadius:'10px',background:`${acc}18`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><I size={17} color={acc}/></div><div><p style={{fontSize:'0.9rem',fontWeight:800,color:'#1e1b4b',margin:0}}>{title}</p>{sub&&<p style={{fontSize:'0.7rem',color:'#9ca3af',margin:0}}>{sub}</p>}</div></div><div style={{padding:'1.25rem 1.5rem'}}>{children}</div></div>;
const saveBtn = (proc) => ({width:'100%',padding:'0.875rem',background:proc?'#a78bfa':'linear-gradient(135deg,#6366f1,#8b5cf6)',border:'none',borderRadius:'14px',color:'#fff',fontSize:'0.95rem',fontWeight:800,cursor:proc?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',boxShadow:'0 6px 20px rgba(99,102,241,0.35)'});

export default function Create({ auth, brands=[], suppliers=[], projects=[], clients=[], selected_project_id, units=[] }) {
    const { data, setData, post, processing, errors } = useForm({ name:'', brand_id:'', unit:units[0]?.abbreviation||'pcs', quantity_in_stock:'', reorder_level:'0', unit_price:'', status:'active', supplier_id:'', client_id:'', project_id:selected_project_id||'' });
    const [totalValue, setTotalValue] = useState(0);
    const [filteredProjects, setFilteredProjects] = useState(projects);
    const [showUnit, setShowUnit] = useState(false);
    const [showBrand, setShowBrand] = useState(false);
    const [showSupplier, setShowSupplier] = useState(false);
    const unitForm = useForm({ name:'', abbreviation:'' });
    const brandForm = useForm({ name:'' });
    const supplierForm = useForm({ name:'', company_name:'', email:'', phone:'', address:'', status:'active', redirect_back: true });

    useEffect(() => { setFilteredProjects(data.client_id ? projects.filter(p=>p.client_id==data.client_id) : projects); }, [data.client_id, projects]);
    useEffect(() => { if(data.project_id){ const p=projects.find(p=>p.id==data.project_id); if(p?.client_id) setData('client_id',p.client_id); } }, [data.project_id]);
    useEffect(() => { setTotalValue((parseFloat(data.unit_price)||0)*(parseFloat(data.quantity_in_stock)||0)); }, [data.unit_price, data.quantity_in_stock]);
    const submit = e => { e.preventDefault(); post(route('inventory.store')); };
    const STATUS_OPTS = [{value:'active',label:t('active'),color:'#16a34a',bg:'#f0fdf4'},{value:'inactive',label:t('inactive'),color:'#6b7280',bg:'#f3f4f6'},{value:'discontinued',label:t('discontinued'),color:'#dc2626',bg:'#fff1f2'}];

    return (
        <FigmaLayout user={auth.user}>
            <Head title={t('add_inventory_item')} />
            <div style={{maxWidth:'1100px',margin:'0 auto',display:'flex',flexDirection:'column',gap:'1.5rem'}}>
                {/* Header */}
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'1rem'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'0.875rem'}}>
                        <Link href={route('inventory.index')}>
                            <button style={{width:'38px',height:'38px',borderRadius:'10px',background:'#fff',border:'1.5px solid #ede9fe',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#6366f1'}}><ArrowLeft size={17}/></button>
                        </Link>
                        <div>
                            <div style={{display:'flex',alignItems:'center',gap:'0.4rem',marginBottom:'2px'}}><Package size={14} color="#a78bfa"/><span style={{fontSize:'0.68rem',fontWeight:700,color:'#a78bfa',textTransform:'uppercase',letterSpacing:'0.08em'}}>{t('inventory')}</span></div>
                            <h1 style={{fontSize:'1.4rem',fontWeight:800,color:'#1e1b4b',margin:0}}>{t('add_new_item')}</h1>
                        </div>
                    </div>
                    <button form="inv-form" type="submit" disabled={processing} style={{display:'flex',alignItems:'center',gap:'6px',padding:'0.65rem 1.5rem',background:processing?'#a78bfa':'linear-gradient(135deg,#6366f1,#8b5cf6)',border:'none',borderRadius:'12px',color:'#fff',fontSize:'0.88rem',fontWeight:700,cursor:processing?'not-allowed':'pointer',boxShadow:'0 4px 14px rgba(99,102,241,0.35)'}}>
                        {processing?<Loader2 size={15} className="animate-spin"/>:<Save size={15}/>} {processing?t('saving'):t('save_item')}
                    </button>
                </div>

                <form id="inv-form" onSubmit={submit}>
                    <div style={{display:'grid',gap:'1.25rem'}} className="inv-grid">
                        {/* LEFT */}
                        <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
                            <Card title={t('item_details')} sub={t('basic_item_info')} icon={Package}>
                                <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                                    <div>
                                        {lbl(t('item_name'),true)}
                                        <Fld icon={Hash} error={errors.name}>
                                            <input type="text" value={data.name} onChange={e=>setData('name',e.target.value)} placeholder={t('item_name_placeholder')} style={fs} onFocus={oF} onBlur={oB} required/>
                                        </Fld>
                                    </div>
                                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                                        <div>
                                            {lbl(t('brand'),true)}
                                            <Fld icon={Tag} error={errors.brand_id}>
                                                <select value={data.brand_id} onChange={e=>setData('brand_id',e.target.value)} style={{...fs,appearance:'none',cursor:'pointer'}} onFocus={oF} onBlur={oB} required>
                                                    <option value="">{t('select_brand')}</option>
                                                    {brands.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
                                                </select>
                                            </Fld>
                                            <button type="button" onClick={()=>setShowBrand(true)} style={{marginTop:'5px',background:'none',border:'none',color:'#6366f1',fontSize:'0.72rem',fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:'3px',padding:0}}><Plus size={11}/>{t('add_brand')}</button>
                                        </div>
                                        <div>
                                            {lbl(t('unit_of_measure'))}
                                            <Fld icon={Layers}>
                                                <select value={data.unit} onChange={e=>setData('unit',e.target.value)} style={{...fs,appearance:'none',cursor:'pointer'}} onFocus={oF} onBlur={oB}>
                                                    {units.map(u=><option key={u.id} value={u.abbreviation}>{u.name} ({u.abbreviation})</option>)}
                                                </select>
                                            </Fld>
                                            <button type="button" onClick={()=>setShowUnit(true)} style={{marginTop:'5px',background:'none',border:'none',color:'#6366f1',fontSize:'0.72rem',fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:'3px',padding:0}}><Plus size={11}/>{t('add_unit')}</button>
                                        </div>
                                    </div>
                                    <div>
                                        {lbl(t('status'))}
                                        <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                                            {STATUS_OPTS.map(o=><button key={o.value} type="button" onClick={()=>setData('status',o.value)} style={{padding:'0.4rem 0.875rem',borderRadius:'20px',border:'1.5px solid',fontSize:'0.75rem',fontWeight:700,cursor:'pointer',transition:'all 0.15s',borderColor:data.status===o.value?'#8b5cf6':'#ede9fe',background:data.status===o.value?o.bg:'#fff',color:data.status===o.value?o.color:'#9ca3af'}}>{o.label}</button>)}
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card title={t('stock_price')} sub={t('quantity_unit_cost')} icon={DollarSign} acc="#22c55e">
                                <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                                        <div>
                                            {lbl(t('quantity_in_stock'),true)}
                                            <Fld icon={Layers} error={errors.quantity_in_stock}>
                                                <input type="number" min="0" value={data.quantity_in_stock} onChange={e=>setData('quantity_in_stock',e.target.value)} placeholder="0" style={{...fs,textAlign:'right'}} onFocus={oF} onBlur={oB} required/>
                                            </Fld>
                                        </div>
                                        <div>
                                            {lbl(t('price_per_unit'),true)}
                                            <Fld icon={DollarSign} error={errors.unit_price}>
                                                <input type="number" min="0" step="0.01" value={data.unit_price} onChange={e=>setData('unit_price',e.target.value)} placeholder="0.00" style={{...fs,textAlign:'right'}} onFocus={oF} onBlur={oB} required/>
                                            </Fld>
                                        </div>
                                    </div>
                                    {totalValue>0&&<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.875rem 1rem',background:'linear-gradient(135deg,#ede9fe,#f5f3ff)',borderRadius:'12px',border:'1.5px solid #c4b5fd'}}><span style={{fontSize:'0.82rem',fontWeight:700,color:'#6d28d9'}}>{t('total_stock_value')}</span><span style={{fontSize:'1.15rem',fontWeight:800,color:'#4338ca'}}>৳{new Intl.NumberFormat().format(totalValue)}</span></div>}
                                </div>
                            </Card>

                            <Card title={t('assignment')} sub={t('assign_client_project')} icon={Layers} acc="#f59e0b">
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                                    <div>
                                        {lbl(t('client'),true)}
                                        <select value={data.client_id} onChange={e=>setData('client_id',e.target.value)} disabled={!!data.project_id} style={{...fni,appearance:'none',cursor:data.project_id?'not-allowed':'pointer',opacity:data.project_id?0.6:1}} onFocus={oF} onBlur={oB} required>
                                            <option value="">{t('no_client_stock')}</option>
                                            {clients.map(c=><option key={c.id} value={c.id}>{c.company_name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        {lbl(t('project'),true)}
                                        <select value={data.project_id} onChange={e=>setData('project_id',e.target.value)} style={{...fni,appearance:'none',cursor:'pointer'}} onFocus={oF} onBlur={oB} required>
                                            <option value="">{t('no_project')}</option>
                                            {filteredProjects.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* RIGHT */}
                        <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
                            <Card title={t('supplier')} sub={t('supplier')} icon={Truck} acc="#3b82f6">
                                <select value={data.supplier_id} onChange={e=>setData('supplier_id',e.target.value)} style={{...fni,appearance:'none',cursor:'pointer',width:'100%',boxSizing:'border-box'}} onFocus={oF} onBlur={oB} required>
                                    <option value="">{t('no_supplier_direct')}</option>
                                    {suppliers.map(s=><option key={s.id} value={s.id}>{s.company_name}</option>)}
                                </select>
                                <button type="button" onClick={()=>setShowSupplier(true)} style={{marginTop:'8px',background:'none',border:'none',color:'#3b82f6',fontSize:'0.72rem',fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:'3px',padding:0}}><Plus size={11}/>{t('add_supplier')}</button>
                            </Card>
                            <button form="inv-form" type="submit" disabled={processing} style={saveBtn(processing)}>
                                {processing?<Loader2 size={17} className="animate-spin"/>:<Save size={17}/>} {processing?t('saving'):t('save_item')}
                            </button>
                            <Link href={route('inventory.index')} style={{textAlign:'center'}}>
                                <button type="button" style={{width:'100%',padding:'0.7rem',background:'#fff',border:'1.5px solid #ede9fe',borderRadius:'14px',color:'#9ca3af',fontSize:'0.85rem',fontWeight:600,cursor:'pointer'}}>{t('cancel')}</button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>

            {/* Unit Modal */}
            <Modal show={showUnit} onClose={()=>setShowUnit(false)} maxWidth="md">
                <div style={{background:'#fff',borderRadius:'18px',overflow:'hidden'}}>
                    <div style={{padding:'1rem 1.5rem',borderBottom:'1px solid #f5f3ff',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <p style={{fontWeight:800,color:'#1e1b4b',margin:0}}>{t('add_uom')}</p>
                        <button onClick={()=>setShowUnit(false)} style={{background:'#f3f4f6',border:'none',borderRadius:'7px',padding:'5px',cursor:'pointer',color:'#9ca3af',display:'flex'}}><X size={14}/></button>
                    </div>
                    <form onSubmit={e=>{e.preventDefault();unitForm.post(route('units.store'),{onSuccess:()=>{setShowUnit(false);unitForm.reset();router.reload({only:['units']});},preserveScroll:true});}} style={{padding:'1.25rem 1.5rem',display:'flex',flexDirection:'column',gap:'0.875rem'}}>
                        <div>{lbl(t('unit_name'),true)}<input value={unitForm.data.name} onChange={e=>unitForm.setData('name',e.target.value)} placeholder={t('unit_name_placeholder')} style={fni} onFocus={oF} onBlur={oB} required/></div>
                        <div>{lbl(t('abbreviation'),true)}<input value={unitForm.data.abbreviation} onChange={e=>unitForm.setData('abbreviation',e.target.value)} placeholder={t('abbrev_placeholder')} style={fni} onFocus={oF} onBlur={oB} required/></div>
                        <button type="submit" disabled={unitForm.processing} style={{padding:'0.7rem',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',border:'none',borderRadius:'12px',color:'#fff',fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}>
                            {unitForm.processing?<Loader2 size={14} className="animate-spin"/>:<CheckCircle2 size={14}/>} {t('save_unit')}
                        </button>
                    </form>
                </div>
            </Modal>

            {/* Brand Modal */}
            <Modal show={showBrand} onClose={()=>setShowBrand(false)} maxWidth="md">
                <div style={{background:'#fff',borderRadius:'18px',overflow:'hidden'}}>
                    <div style={{padding:'1rem 1.5rem',borderBottom:'1px solid #f5f3ff',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <p style={{fontWeight:800,color:'#1e1b4b',margin:0}}>{t('add_brand')}</p>
                        <button onClick={()=>setShowBrand(false)} style={{background:'#f3f4f6',border:'none',borderRadius:'7px',padding:'5px',cursor:'pointer',color:'#9ca3af',display:'flex'}}><X size={14}/></button>
                    </div>
                    <form onSubmit={e=>{e.preventDefault();brandForm.post(route('brands.store'),{onSuccess:()=>{setShowBrand(false);brandForm.reset();router.reload({only:['brands']});},preserveScroll:true});}} style={{padding:'1.25rem 1.5rem',display:'flex',flexDirection:'column',gap:'0.875rem'}}>
                        <div>{lbl(t('brand_name'),true)}<input value={brandForm.data.name} onChange={e=>brandForm.setData('name',e.target.value)} placeholder={t('brand_name_placeholder')} style={fni} onFocus={oF} onBlur={oB} required/></div>
                        <button type="submit" disabled={brandForm.processing} style={{padding:'0.7rem',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',border:'none',borderRadius:'12px',color:'#fff',fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}>
                            {brandForm.processing?<Loader2 size={14} className="animate-spin"/>:<CheckCircle2 size={14}/>} {t('save_brand')}
                        </button>
                    </form>
                </div>
            </Modal>

            {/* Supplier Modal */}
            <Modal show={showSupplier} onClose={()=>setShowSupplier(false)} maxWidth="lg">
                <div style={{background:'#fff',borderRadius:'18px',overflow:'hidden'}}>
                    <div style={{padding:'1rem 1.5rem',borderBottom:'1px solid #f5f3ff',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <p style={{fontWeight:800,color:'#1e1b4b',margin:0}}>{t('add_supplier')}</p>
                        <button onClick={()=>setShowSupplier(false)} style={{background:'#f3f4f6',border:'none',borderRadius:'7px',padding:'5px',cursor:'pointer',color:'#9ca3af',display:'flex'}}><X size={14}/></button>
                    </div>
                    <form onSubmit={e=>{e.preventDefault();supplierForm.post(route('suppliers.store'),{preserveState:true,onSuccess:()=>{setShowSupplier(false);supplierForm.reset();router.reload({only:['suppliers']});},preserveScroll:true});}} style={{padding:'1.25rem 1.5rem',display:'flex',flexDirection:'column',gap:'0.875rem'}}>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.875rem'}}>
                            <div>{lbl(t('company_name'),true)}<input value={supplierForm.data.company_name} onChange={e=>supplierForm.setData('company_name',e.target.value)} style={fni} onFocus={oF} onBlur={oB} required/></div>
                            <div>{lbl(t('contact_name'),true)}<input value={supplierForm.data.name} onChange={e=>supplierForm.setData('name',e.target.value)} style={fni} onFocus={oF} onBlur={oB} required/></div>
                            <div>{lbl(t('phone_number'),true)}<input value={supplierForm.data.phone} onChange={e=>supplierForm.setData('phone',e.target.value)} style={fni} onFocus={oF} onBlur={oB} required/></div>
                            <div>{lbl(t('email_address'))}<input type="email" value={supplierForm.data.email} onChange={e=>supplierForm.setData('email',e.target.value)} style={fni} onFocus={oF} onBlur={oB}/></div>
                        </div>
                        <button type="submit" disabled={supplierForm.processing} style={{padding:'0.7rem',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',border:'none',borderRadius:'12px',color:'#fff',fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}>
                            {supplierForm.processing?<Loader2 size={14} className="animate-spin"/>:<CheckCircle2 size={14}/>} {t('save_supplier')}
                        </button>
                    </form>
                </div>
            </Modal>

            <style>{`.inv-grid{grid-template-columns:1fr}@media(min-width:900px){.inv-grid{grid-template-columns:1fr 300px!important}}.animate-spin{animation:spin 1s linear infinite}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </FigmaLayout>
    );
}
