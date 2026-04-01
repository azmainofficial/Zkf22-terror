import React, { useState, useEffect } from 'react';
import { Save, Calculator, Printer, CheckSquare, Square, Pencil } from 'lucide-react';
import { router } from '@inertiajs/react';

const styles = {
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem', fontSize: '0.85rem' },
    th: { border: '1px solid #e2e8f0', padding: '12px', background: '#f8fafc', textAlign: 'left', fontWeight: 700, color: '#475569' },
    td: { border: '1px solid #e2e8f0', padding: '8px 12px', background: '#fff' },
    input: { width: '100%', border: 'none', background: 'transparent', outline: 'none', padding: '4px', textAlign: 'right', fontWeight: 600, color: '#0f172a' },
    inputLeft: { width: '100%', border: 'none', background: 'transparent', outline: 'none', padding: '4px', textAlign: 'left', fontWeight: 600, color: '#0f172a' },
    totalRow: { background: '#f1f5f9', fontWeight: 800 },
    label: { color: '#64748b', fontWeight: 600 },
    bangla: { fontFamily: 'inherit', color: '#1e293b' },
};

const ProjectCalculationTable = ({ project, canEdit: externalCanEdit, onChange }) => {
    const isNew = !project.id;
    const [isEditing, setIsEditing] = useState(isNew);
    
    // Define all available elective rows
    const availableFields = [
        { id: 'soil_removal_ord', label: 'Soil Removal (Ordinary) / মাটি অপসারন (সাধারন)' },
        { id: 'soil_removal_base', label: 'Soil Removal (Basement) / মাটি অপসারন (বেসমেন্ট)' },
        { id: 'debris_removal', label: 'Debris Removal Fee / বর্জ্য অপসারন ফি' },
        { id: 'water', label: 'Water / পানি' },
        { id: 'mosque', label: 'Mosque Contribution / মসজিদ সাহায্য' },
        { id: 'ammonia', label: 'Ammonia / অ্যামোনিয়া' },
        { id: 'plan_form', label: 'Plan Approval Form / নকশা অনুমোদন ফরম' },
        { id: 'letters', label: 'Letters & Distribution / চিঠিপত্র বিলি' },
        { id: 'others', label: 'Others / অন্যান্য' },
        { id: 'ammonia_printing', label: 'Ammonia Printing / অ্যামোনিয়া প্রিন্টিং চার্জ' },
        { id: 'soil_test', label: 'Soil Test / সয়েল টেস্ট' },
        { id: 'copy_fee', label: 'Extra Copy Fee (3-4) / কপি ফি' },
        { id: 'holding', label: 'Holding Tax / হোল্ডিং' },
        { id: 'arch_fee', label: 'Architectural Plan Fee / আর্কিটেক্ট প্ল্যান ফি' },
        { id: 'struct_fee', label: 'Structural Plan Fee / স্ট্রাকচারাল প্ল্যান ফি' },
        { id: 'elec_fee', label: 'Electrical Plan Fee / ইলেকট্রিক্যাল প্ল্যান ফি' },
        { id: 'plumb_fee', label: 'Plumbing Plan Fee / প্লাম্বিং ফি' },
        { id: 'three_d_fee', label: '3D Design Fee / থ্রিডি ডিজাইন ফি' },
    ];

    const [data, setData] = useState({
        location: '',
        area: 0, rate: 0,
        part1: 0, part2: 0,
        vat_percent: 15,
        soil_removal_ord: 0, soil_removal_base: 0,
        debris_removal: 0, water: 0, mosque: 0, ammonia: 0,
        plan_form: 0, letters: 0, others: 0, ammonia_printing: 0,
        soil_test: 0, copy_fee: 0, holding: 0,
        arch_fee: 0, struct_fee: 0, elec_fee: 0, plumb_fee: 0, three_d_fee: 0,
        enabled_fields: availableFields.map(f => f.id), // All enabled by default on new
        ...(project.contract_details || {})
    });

    const [totals, setTotals] = useState({
        area_amount: 0, total_plan_fee: 0, vat_amount: 0, subtotal: 0, grand_total: 0
    });

    useEffect(() => {
        const area_amount   = (Number(data.area) || 0) * (Number(data.rate) || 0);
        const parts_total   = (Number(data.part1) || 0) + (Number(data.part2) || 0);
        const total_plan_fee = parts_total > 0 ? parts_total : area_amount;
        const vat_percent   = Number(data.vat_percent) || 0;
        const vat_amount    = (total_plan_fee * vat_percent) / 100;
        const other_fees = availableFields
            .filter(f => data.enabled_fields?.includes(f.id))
            .filter(f => !f.id.endsWith('_fee')) // Fees added after subtotal
            .reduce((sum, f) => sum + (Number(data[f.id]) || 0), 0);

        const subtotal = total_plan_fee + vat_amount + other_fees;

        const fee_totals = availableFields
            .filter(f => data.enabled_fields?.includes(f.id))
            .filter(f => f.id.endsWith('_fee'))
            .reduce((sum, f) => sum + (Number(data[f.id]) || 0), 0);

        const grand_total = subtotal + fee_totals;
        const newTotals = { area_amount, total_plan_fee, vat_amount, subtotal, grand_total };
        setTotals(newTotals);
        if (onChange) onChange({ ...data, ...newTotals });
    }, [data]);

    // Sync local data with prop changes (Essential for Inertia updates)
    useEffect(() => {
        if (!isEditing) {
            setData({
                location: '',
                area: 0, rate: 0,
                part1: 0, part2: 0,
                vat_percent: 15,
                soil_removal_ord: 0, soil_removal_base: 0,
                debris_removal: 0, water: 0, mosque: 0, ammonia: 0,
                plan_form: 0, letters: 0, others: 0, ammonia_printing: 0,
                soil_test: 0, copy_fee: 0, holding: 0,
                arch_fee: 0, struct_fee: 0, elec_fee: 0, plumb_fee: 0, three_d_fee: 0,
                enabled_fields: availableFields.map(f => f.id),
                ...(project.contract_details || {})
            });
        }
    }, [project.contract_details, isEditing]);

    const handleChange = (field, value) => setData(prev => ({ ...prev, [field]: value }));

    const toggleField = (fieldId) => {
        const enabled = data.enabled_fields || [];
        const newList = enabled.includes(fieldId) 
            ? enabled.filter(id => id !== fieldId)
            : [...enabled, fieldId];
        setData(prev => ({ ...prev, enabled_fields: newList }));
    };

    const handleSave = () => {
        router.patch(route('projects.update', project.id), {
            title: project.title,
            client_id: project.client_id,
            status: project.status,
            contract_details: { ...data, ...totals },
            budget: totals.grand_total,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
                alert('Project data saved successfully!');
            }
        });
    };

    const fmt = (n) => Number(n || 0).toLocaleString();

    // ── Print only the cost calculation as a clean A4 report (no new tab) ──
    const printCalc = () => {
        const N = (v) => Number(v || 0).toLocaleString();

        const rows = [
            { desc: 'Client Name / ID',                     v1: `${project.client?.name || '—'} (ID: ${project.client?.id || '—'})`, v2: '', amt: '', span: true },
            { desc: 'Location / ঠিকানা',                    v1: data.location || '—',                                                v2: '', amt: '', span: true },
            { desc: 'Area = / এরিয়া',                        v1: N(data.area),      v2: N(data.rate),             amt: N(totals.area_amount) },
            { desc: '1st Part',                             v1: '',                v2: N(data.part1),            amt: '' },
            { desc: '2nd Part',                             v1: '',                v2: N(data.part2),            amt: '' },
            { desc: 'Total Plan Fee = / মোট নকশা ফি',       v1: '', v2: '',        amt: N(totals.total_plan_fee), type: 'sub' },
            { desc: `VAT (${data.vat_percent}%) / ভ্যাট`,  v1: '', v2: `${data.vat_percent}%`, amt: N(totals.vat_amount) },
            { desc: 'Soil Removal (Ordinary) / মাটি অপসারন (সাধারন)', v1: '', v2: '', amt: N(data.soil_removal_ord) },
            { desc: 'Soil Removal (Basement) / মাটি অপসারন (বেসমেন্ট)', v1: '', v2: '', amt: N(data.soil_removal_base) },
            { desc: 'Debris Removal Fee / বর্জ্য অপসারন ফি', v1: '', v2: '', amt: N(data.debris_removal) },
            { desc: 'Water / পানি',                         v1: '', v2: '', amt: N(data.water) },
            { desc: 'Mosque Contribution / মসজিদ সাহায্য',  v1: '', v2: '', amt: N(data.mosque) },
            { desc: 'Ammonia / অ্যামোনিয়া',                v1: '', v2: '', amt: N(data.ammonia) },
            { desc: 'Plan Approval Form / নকশা অনুমোদন ফরম', v1: '', v2: '', amt: N(data.plan_form) },
            { desc: 'Letters & Distribution / চিঠিপত্র বিলি', v1: '', v2: '', amt: N(data.letters) },
            { desc: 'Others / অন্যান্য',                    v1: '', v2: '', amt: N(data.others) },
            { desc: 'Ammonia Printing / অ্যামোনিয়া প্রিন্টিং চার্জ', v1: '', v2: '', amt: N(data.ammonia_printing) },
            { desc: 'Soil Test / সয়েল টেস্ট',              v1: '', v2: '', amt: N(data.soil_test) },
            { desc: 'Extra Copy Fee (3-4) / কপি ফি',        v1: '', v2: '', amt: N(data.copy_fee), id: 'copy_fee' },
            { desc: 'Holding Tax / হোল্ডিং',               v1: '', v2: '', amt: N(data.holding), id: 'holding' },
            { desc: 'Subtotal / মোট =',                    v1: '', v2: '', amt: N(totals.subtotal), type: 'sub' },
            { desc: 'Architectural Plan Fee / আর্কিটেক্ট প্ল্যান ফি', v1: '', v2: '', amt: N(data.arch_fee), id: 'arch_fee' },
            { desc: 'Structural Plan Fee / স্ট্রাকচারাল প্ল্যান ফি',   v1: '', v2: '', amt: N(data.struct_fee), id: 'struct_fee' },
            { desc: 'Electrical Plan Fee / ইলেকট্রিক্যাল প্ল্যান ফি', v1: '', v2: '', amt: N(data.elec_fee), id: 'elec_fee' },
            { desc: 'Plumbing Plan Fee / প্লাম্বিং ফি',    v1: '', v2: '', amt: N(data.plumb_fee), id: 'plumb_fee' },
            { desc: '3D Design Fee / থ্রিডি ডিজাইন ফি',    v1: '', v2: '', amt: N(data.three_d_fee), id: 'three_d_fee' },
            { desc: 'GRAND TOTAL / সর্বমোট =',             v1: '', v2: '', amt: N(totals.grand_total), type: 'grand' },
        ].filter(r => r.type === 'sub' || r.type === 'grand' || !r.id || data.enabled_fields?.includes(r.id));

        const rowsHtml = rows.map(({ desc, v1, v2, amt, span, type }, i) => {
            const isGrand = type === 'grand';
            const isSub   = type === 'sub';
            const isEven  = i % 2 === 0;
            const bg      = isGrand ? '#0f172a' : isSub ? '#dde3ed' : isEven ? '#f8fafc' : '#ffffff';
            const clr     = isGrand ? '#ffffff' : '#0f172a';
            const fw      = (isGrand || isSub) ? '700' : '400';
            const bdr     = `border:1px solid ${isGrand ? '#334155' : '#d1d5db'};`;
            const cell    = `${bdr}padding:9px 14px;vertical-align:top;word-break:break-word;white-space:normal;`;
            if (span) {
                return `<tr style="background:${bg};color:${clr};">
                    <td style="${cell}font-weight:600;color:#6b7280;width:52%;">${desc}</td>
                    <td colspan="2" style="${cell}font-weight:600;">${v1}</td>
                    <td style="${cell}width:18%;"></td>
                </tr>`;
            }
            return `<tr style="background:${bg};color:${clr};">
                <td style="${cell}font-weight:${fw};width:52%;">${desc}</td>
                <td style="${cell}text-align:right;width:15%;">${v1}</td>
                <td style="${cell}text-align:right;width:15%;">${v2}</td>
                <td style="${cell}text-align:right;width:18%;font-weight:${isGrand || isSub ? '700' : '500'};">${amt}</td>
            </tr>`;
        }).join('');

        const html = `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8"/>
<title>Project Cost Calculation — ${project.title || project.id}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @page { size: A4 portrait; margin: 20mm; }
  body {
    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    font-size: 11.5px;
    line-height: 1.55;
    color: #1e293b;
    background: #fff;
  }

  /* ── Report Header ── */
  .rpt-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 12px;
    margin-bottom: 16px;
    border-bottom: 2.5px solid #0f172a;
  }
  .rpt-title  { font-size: 18px; font-weight: 800; color: #0f172a; letter-spacing: -0.4px; }
  .rpt-sub    { font-size: 11px; color: #475569; margin-top: 4px; }
  .rpt-sub strong { color: #0f172a; }
  .rpt-meta   { text-align: right; font-size: 10.5px; color: #475569; line-height: 1.8; }
  .rpt-meta strong { color: #0f172a; }

  /* ── Table ── */
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    margin-top: 4px;
  }
  thead th {
    background: #1e293b;
    color: #fff;
    padding: 10px 14px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border: 1px solid #334155;
    word-break: break-word;
    white-space: normal;
  }
  thead th:nth-child(1) { width: 52%; text-align: left; }
  thead th:nth-child(2),
  thead th:nth-child(3) { width: 15%; text-align: right; }
  thead th:nth-child(4) { width: 18%; text-align: right; }

  tbody tr { page-break-inside: avoid; }

  /* ── Signature block ── */
  .sig-row {
    display: flex;
    justify-content: space-between;
    margin-top: 32px;
    padding-top: 8px;
  }
  .sig { text-align: center; flex: 1; }
  .sig-line {
    border-top: 1px solid #94a3b8;
    padding-top: 6px;
    font-size: 10px;
    color: #64748b;
    margin: 0 16px;
  }

  /* ── Footer ── */
  .rpt-footer {
    margin-top: 14px;
    padding-top: 8px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    font-size: 9.5px;
    color: #94a3b8;
  }
</style>
</head><body>

<div class="rpt-header">
  <div>
    <div class="rpt-title">Project Cost Calculation Report</div>
    <div class="rpt-sub">Project: <strong>${project.title || '—'}</strong></div>
    <div class="rpt-sub">Client: <strong>${project.client?.name || '—'}</strong>${project.client?.company_name ? ' &nbsp;·&nbsp; ' + project.client.company_name : ''}</div>
  </div>
  <div class="rpt-meta">
    <div>Date: <strong>${new Date().toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></div>
    <div>Status: <strong>${project.status || '—'}</strong></div>
    ${project.start_date ? `<div>Start Date: <strong>${project.start_date}</strong></div>` : ''}
  </div>
</div>

<table>
  <thead>
    <tr>
      <th>Description / বিবরণ</th>
      <th>Value 1</th>
      <th>Value 2</th>
      <th>Amount (BDT)</th>
    </tr>
  </thead>
  <tbody>${rowsHtml}</tbody>
</table>

<div class="sig-row">
  <div class="sig"><div class="sig-line">Prepared By</div></div>
  <div class="sig"><div class="sig-line">Checked By</div></div>
  <div class="sig"><div class="sig-line">Authorized Signatory</div></div>
</div>

<div class="rpt-footer">
  <span>This document is computer generated &mdash; Confidential</span>
  <span>Printed: ${new Date().toLocaleString()}</span>
</div>

</body></html>`;

        // Use a hidden iframe — no new tab opens
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:none;';
        document.body.appendChild(iframe);
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
        iframe.contentWindow.focus();
        setTimeout(() => {
            iframe.contentWindow.print();
            setTimeout(() => document.body.removeChild(iframe), 1000);
        }, 400);
    };

    return (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                        <Calculator size={20} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Project Cost Calculation</h3>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Reference to Excel sheet workflow</p>
                    </div>
                </div>
                {externalCanEdit && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="button" onClick={printCalc} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#64748b', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                            <Printer size={16} /> Print Report
                        </button>
                        {!onChange && (
                            <>
                                {!isEditing ? (
                                    <button type="button" onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#4f46e5', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                                        <Pencil size={16} /> Edit Calculation
                                    </button>
                                ) : (
                                    <button type="button" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#10b981', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                                        <Save size={16} /> Save Changes
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            <table style={styles.table}>
                <thead>
                    <tr>
                        {isEditing && <th style={{ ...styles.th, width: '40px', textAlign: 'center' }}></th>}
                        <th style={{ ...styles.th, width: '40%' }}>Description / বিবরণ</th>
                        <th style={{ ...styles.th, width: '18%', textAlign: 'center' }}>Value 1</th>
                        <th style={{ ...styles.th, width: '18%', textAlign: 'center' }}>Value 2</th>
                        <th style={{ ...styles.th, width: '20%', textAlign: 'right' }}>Amount [BDT]</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {isEditing && <td style={styles.td}></td>}
                        <td style={styles.td}><span style={styles.label}>Client Name / ID</span></td>
                        <td colSpan="2" style={{ ...styles.td, fontWeight: 800, color: '#0f172a' }}>{project.client?.name} (ID: {project.client?.id})</td>
                        <td style={styles.td}></td>
                    </tr>
                    <tr>
                        {isEditing && <td style={styles.td}></td>}
                        <td style={styles.td}><span style={styles.label}>Location / ঠিকানা</span></td>
                        <td style={styles.td} colSpan="3">
                            <input style={styles.inputLeft} placeholder="Enter Project Location" value={data.location} onChange={e => handleChange('location', e.target.value)} disabled={!isEditing} />
                        </td>
                    </tr>
                    <tr>
                        {isEditing && <td style={styles.td}></td>}
                        <td style={styles.td}><span style={styles.bangla}>Area = / এরিয়া</span></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.area} onChange={e => handleChange('area', e.target.value)} disabled={!isEditing} /></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.rate} onChange={e => handleChange('rate', e.target.value)} disabled={!isEditing} /></td>
                        <td style={{ ...styles.td, textAlign: 'right', fontWeight: 800 }}>{fmt(totals.area_amount)}</td>
                    </tr>
                    <tr>
                        {isEditing && <td style={styles.td}></td>}
                        <td style={styles.td}><span style={styles.label}>1st Part</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.part1} onChange={e => handleChange('part1', e.target.value)} disabled={!isEditing} /></td>
                        <td style={styles.td}></td>
                    </tr>
                    <tr>
                        {isEditing && <td style={styles.td}></td>}
                        <td style={styles.td}><span style={styles.label}>2nd Part</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.part2} onChange={e => handleChange('part2', e.target.value)} disabled={!isEditing} /></td>
                        <td style={styles.td}></td>
                    </tr>
                    <tr style={styles.totalRow}>
                        {isEditing && <td style={styles.td}></td>}
                        <td style={styles.td}><span style={styles.bangla}>Total Plan Fee = / মোট নকশা ফি</span></td>
                        <td style={styles.td} colSpan="2"></td>
                        <td style={{ ...styles.td, textAlign: 'right' }}>{fmt(totals.total_plan_fee)}</td>
                    </tr>
                    <tr>
                        {isEditing && <td style={styles.td}></td>}
                        <td style={styles.td}><span style={styles.bangla}>VAT (%) / ভ্যাট</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                <input type="number" style={{ ...styles.input, width: '50px' }} value={data.vat_percent} onChange={e => handleChange('vat_percent', e.target.value)} disabled={!isEditing} />%
                            </div>
                        </td>
                        <td style={{ ...styles.td, textAlign: 'right' }}>{fmt(totals.vat_amount)}</td>
                    </tr>
                    {availableFields.filter(f => !f.id.endsWith('_fee')).map((f) => {
                        const isEnabled = data.enabled_fields?.includes(f.id);
                        if (!isEnabled && !isEditing) return null;

                        return (
                            <tr key={f.id} style={{ opacity: isEnabled ? 1 : 0.5 }}>
                                {isEditing && (
                                    <td style={{ ...styles.td, textAlign: 'center', cursor: 'pointer' }} onClick={() => toggleField(f.id)}>
                                        {isEnabled ? <CheckSquare size={16} color="#4f46e5" /> : <Square size={16} color="#94a3b8" />}
                                    </td>
                                )}
                                <td style={styles.td}><span style={styles.bangla}>{f.label}</span></td>
                                <td style={styles.td}></td>
                                <td style={styles.td}></td>
                                <td style={styles.td}>
                                    <input 
                                        type="number" 
                                        style={styles.input} 
                                        value={data[f.id]} 
                                        onChange={e => handleChange(f.id, e.target.value)} 
                                        disabled={!isEditing || !isEnabled} 
                                    />
                                </td>
                            </tr>
                        );
                    })}
                    <tr style={styles.totalRow}>
                        {isEditing && <td style={styles.td}></td>}
                        <td style={styles.td}><span style={styles.bangla}>Subtotal / মোট =</span></td>
                        <td style={styles.td} colSpan="2"></td>
                        <td style={{ ...styles.td, textAlign: 'right' }}>{fmt(totals.subtotal)}</td>
                    </tr>
                    {availableFields.filter(f => f.id.endsWith('_fee')).map((f) => {
                        const isEnabled = data.enabled_fields?.includes(f.id);
                        if (!isEnabled && !isEditing) return null;

                        return (
                            <tr key={f.id} style={{ opacity: isEnabled ? 1 : 0.5 }}>
                                {isEditing && (
                                    <td style={{ ...styles.td, textAlign: 'center', cursor: 'pointer' }} onClick={() => toggleField(f.id)}>
                                        {isEnabled ? <CheckSquare size={16} color="#4f46e5" /> : <Square size={16} color="#94a3b8" />}
                                    </td>
                                )}
                                <td style={styles.td}><span style={styles.bangla}>{f.label}</span></td>
                                <td style={styles.td}></td>
                                <td style={styles.td}></td>
                                <td style={styles.td}>
                                    <input 
                                        type="number" 
                                        style={styles.input} 
                                        value={data[f.id]} 
                                        onChange={e => handleChange(f.id, e.target.value)} 
                                        disabled={!isEditing || !isEnabled} 
                                    />
                                </td>
                            </tr>
                        );
                    })}
                    <tr style={{ ...styles.totalRow, background: '#0f172a', color: '#fff' }}>
                        {isEditing && <td style={{ ...styles.td, border: 'none', background: '#0f172a' }}></td>}
                        <td style={{ ...styles.td, border: 'none', background: '#0f172a' }}><span style={{ color: '#fff' }}>Grand Total / সর্বমোট =</span></td>
                        <td style={{ ...styles.td, border: 'none', background: '#0f172a' }} colSpan="2"></td>
                        <td style={{ ...styles.td, textAlign: 'right', border: 'none', background: '#0f172a' }}>{fmt(totals.grand_total)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ProjectCalculationTable;
