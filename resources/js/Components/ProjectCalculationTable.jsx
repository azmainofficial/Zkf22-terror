import React, { useState, useEffect } from 'react';
import { Save, Calculator, HelpCircle, FileText, Printer } from 'lucide-react';
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

const ProjectCalculationTable = ({ project, canEdit, onChange }) => {
    const [data, setData] = useState({
        location: '',
        area: 0,
        rate: 0,
        part1: 0,
        part2: 0,
        vat_percent: 15,
        soil_removal_ord: 0,
        soil_removal_base: 0,
        debris_removal: 0,
        water: 0,
        mosque: 0,
        ammonia: 0,
        plan_form: 0,
        letters: 0,
        others: 0,
        ammonia_printing: 0,
        soil_test: 0,
        copy_fee: 0,
        holding: 0,
        arch_fee: 0,
        struct_fee: 0,
        elec_fee: 0,
        plumb_fee: 0,
        three_d_fee: 0,
        ...(project.contract_details || {})
    });

    const [totals, setTotals] = useState({
        area_amount: 0,
        total_plan_fee: 0,
        vat_amount: 0,
        subtotal: 0,
        grand_total: 0
    });

    useEffect(() => {
        const area_amount = (Number(data.area) || 0) * (Number(data.rate) || 0);
        
        // Plan fee is usually area * rate, but maybe user wants to override with parts
        // Let's make it the max or priority based on common BD practice: if area_amount is set, it's the fee.
        const parts_total = (Number(data.part1) || 0) + (Number(data.part2) || 0);
        const total_plan_fee = parts_total > 0 ? parts_total : area_amount;
        
        const vat_percent = Number(data.vat_percent) || 0;
        const vat_amount = (total_plan_fee * vat_percent) / 100;
        
        const other_fees = 
            (Number(data.soil_removal_ord) || 0) + 
            (Number(data.soil_removal_base) || 0) +
            (Number(data.debris_removal) || 0) +
            (Number(data.water) || 0) +
            (Number(data.mosque) || 0) +
            (Number(data.ammonia) || 0) +
            (Number(data.plan_form) || 0) +
            (Number(data.letters) || 0) +
            (Number(data.others) || 0) +
            (Number(data.ammonia_printing) || 0) +
            (Number(data.soil_test) || 0) +
            (Number(data.copy_fee) || 0) +
            (Number(data.holding) || 0);

        const subtotal = total_plan_fee + vat_amount + other_fees;

        const grand_total = subtotal + 
            (Number(data.arch_fee) || 0) + 
            (Number(data.struct_fee) || 0) + 
            (Number(data.elec_fee) || 0) + 
            (Number(data.plumb_fee) || 0) + 
            (Number(data.three_d_fee) || 0);

        const newTotals = { area_amount, total_plan_fee, vat_amount, subtotal, grand_total };
        setTotals(newTotals);

        if (onChange) {
            onChange({ ...data, ...newTotals });
        }
    }, [data]);

    const handleChange = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        router.patch(route('projects.update', project.id), {
            ...project,
            contract_details: { ...data, ...totals },
            budget: totals.grand_total,
        }, {
            preserveScroll: true,
            onSuccess: () => alert('Project data saved successfully!')
        });
    };

    const fmt = (n) => n.toLocaleString();

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
                {canEdit && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="button" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#64748b', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                            <Printer size={16} /> Print
                        </button>
                        {!onChange && (
                            <button type="button" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#4f46e5', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                                <Save size={16} /> Save Changes
                            </button>
                        )}
                    </div>
                )}
            </div>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={{ ...styles.th, width: '40%' }}>Descroption / বিবরণ</th>
                        <th style={{ ...styles.th, width: '20%', textAlign: 'center' }}>Value 1</th>
                        <th style={{ ...styles.th, width: '20%', textAlign: 'center' }}>Value 2</th>
                        <th style={{ ...styles.th, width: '20%', textAlign: 'right' }}>Amount [BDT]</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={styles.td}><span style={styles.label}>Client Name / ID</span></td>
                        <td colSpan="2" style={{ ...styles.td, fontWeight: 800, color: '#0f172a' }}>{project.client?.name} (ID: {project.client?.id})</td>
                        <td style={styles.td}></td>
                    </tr>
                    <tr>
                        <td style={styles.td}><span style={styles.label}>Location / ঠিকানা</span></td>
                        <td style={styles.td} colSpan="3">
                            <input style={styles.inputLeft} placeholder="Enter Project Location" value={data.location} onChange={e => handleChange('location', e.target.value)} disabled={!canEdit} />
                        </td>
                    </tr>

                    {/* Area Calculation */}
                    <tr>
                        <td style={styles.td}><span style={styles.bangla}>Area = / এরিয়া</span></td>
                        <td style={styles.td}>
                            <input type="number" style={styles.input} value={data.area} onChange={e => handleChange('area', e.target.value)} disabled={!canEdit} />
                        </td>
                        <td style={styles.td}>
                            <input type="number" style={styles.input} value={data.rate} onChange={e => handleChange('rate', e.target.value)} disabled={!canEdit} />
                        </td>
                        <td style={{ ...styles.td, textAlign: 'right', fontWeight: 800 }}>{fmt(totals.area_amount)}</td>
                    </tr>

                    {/* Plan Fee */}
                    <tr>
                        <td style={styles.td}><span style={styles.label}>1st Part</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}>
                            <input type="number" style={styles.input} value={data.part1} onChange={e => handleChange('part1', e.target.value)} disabled={!canEdit} />
                        </td>
                        <td style={styles.td}></td>
                    </tr>
                    <tr>
                        <td style={styles.td}><span style={styles.label}>2nd Part</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}>
                             <input type="number" style={styles.input} value={data.part2} onChange={e => handleChange('part2', e.target.value)} disabled={!canEdit} />
                        </td>
                        <td style={styles.td}></td>
                    </tr>
                    <tr style={styles.totalRow}>
                        <td style={styles.td}><span style={styles.bangla}>Total Plan Fee = / মোট নকশা ফি</span></td>
                        <td style={styles.td} colSpan="2"></td>
                        <td style={{ ...styles.td, textAlign: 'right' }}>{fmt(totals.total_plan_fee)}</td>
                    </tr>

                    {/* VAT */}
                    <tr>
                        <td style={styles.td}><span style={styles.bangla}>VAT (%) / ভ্যাট</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                <input type="number" style={{ ...styles.input, width: '50px' }} value={data.vat_percent} onChange={e => handleChange('vat_percent', e.target.value)} disabled={!canEdit} />%
                            </div>
                        </td>
                        <td style={{ ...styles.td, textAlign: 'right' }}>{fmt(totals.vat_amount)}</td>
                    </tr>

                    {/* Other Fees */}
                    <tr>
                        <td style={styles.td}><span style={styles.bangla}>Soil Removal (Ord) / মাটি অপসারন (সাধারন)</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.soil_removal_ord} onChange={e => handleChange('soil_removal_ord', e.target.value)} disabled={!canEdit} /></td>
                    </tr>
                    <tr>
                        <td style={styles.td}><span style={styles.bangla}>Soil Removal (Basement) / মাটি অপসারন (বেসমেন্ট)</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.soil_removal_base} onChange={e => handleChange('soil_removal_base', e.target.value)} disabled={!canEdit} /></td>
                    </tr>
                    <tr>
                        <td style={styles.td}><span style={styles.bangla}>Debris Removal Fee / বর্জ্য অপসারন ফি</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.debris_removal} onChange={e => handleChange('debris_removal', e.target.value)} disabled={!canEdit} /></td>
                    </tr>
                    <tr>
                        <td style={styles.td}><span style={styles.bangla}>Water / পানি</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.water} onChange={e => handleChange('water', e.target.value)} disabled={!canEdit} /></td>
                    </tr>
                    <tr>
                        <td style={styles.td}><span style={styles.bangla}>Mosque contribution / মসজিদ সাহায্য</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.mosque} onChange={e => handleChange('mosque', e.target.value)} disabled={!canEdit} /></td>
                    </tr>
                    <tr>
                        <td style={styles.td}><span style={styles.bangla}>Ammonia / অ্যামোনিয়া</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.ammonia} onChange={e => handleChange('ammonia', e.target.value)} disabled={!canEdit} /></td>
                    </tr>
                    <tr>
                        <td style={styles.td}><span style={styles.bangla}>Plan Approval Form / নকশা অনুমোদন ফরম</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.plan_form} onChange={e => handleChange('plan_form', e.target.value)} disabled={!canEdit} /></td>
                    </tr>
                    <tr>
                        <td style={styles.td}><span style={styles.bangla}>Letters & Distribution / চিঠিপত্র বিলি</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.letters} onChange={e => handleChange('letters', e.target.value)} disabled={!canEdit} /></td>
                    </tr>
                    <tr>
                        <td style={styles.td}><span style={styles.bangla}>Others / অন্যান্য</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.others} onChange={e => handleChange('others', e.target.value)} disabled={!canEdit} /></td>
                    </tr>
                    <tr>
                        <td style={styles.td}><span style={styles.bangla}>Ammonia Printing / অ্যামোনিয়া প্রিন্টিং চার্জ</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.ammonia_printing} onChange={e => handleChange('ammonia_printing', e.target.value)} disabled={!canEdit} /></td>
                    </tr>
                    <tr>
                        <td style={styles.td}><span style={styles.bangla}>Soil Test / সয়েল টেস্ট</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.soil_test} onChange={e => handleChange('soil_test', e.target.value)} disabled={!canEdit} /></td>
                    </tr>
                    <tr>
                        <td style={styles.td}><span style={styles.bangla}>Extra Copy Fee (3-4) / কপি ফি</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.copy_fee} onChange={e => handleChange('copy_fee', e.target.value)} disabled={!canEdit} /></td>
                    </tr>
                    <tr>
                        <td style={styles.td}><span style={styles.bangla}>Holding Tax / হোল্ডিং</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.holding} onChange={e => handleChange('holding', e.target.value)} disabled={!canEdit} /></td>
                    </tr>

                    <tr style={styles.totalRow}>
                        <td style={styles.td}><span style={styles.bangla}>Subtotal / মোট =</span></td>
                        <td style={styles.td} colSpan="2"></td>
                        <td style={{ ...styles.td, textAlign: 'right' }}>{fmt(totals.subtotal)}</td>
                    </tr>

                    {/* Final Architecture Fees */}
                    <tr>
                        <td style={styles.td}><span style={styles.bangla}>Architectural Plan Fee / আর্কিটেক্ট প্ল্যান ফি</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.arch_fee} onChange={e => handleChange('arch_fee', e.target.value)} disabled={!canEdit} /></td>
                    </tr>
                    <tr>
                        <td style={styles.td}><span style={styles.bangla}>Structural Plan Fee / স্ট্রাকচারাল প্ল্যান ফি</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.struct_fee} onChange={e => handleChange('struct_fee', e.target.value)} disabled={!canEdit} /></td>
                    </tr>
                    <tr>
                        <td style={styles.td}><span style={styles.bangla}>Electrical Plan Fee / ইলেকট্রিক্যাল প্ল্যান ফি</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.elec_fee} onChange={e => handleChange('elec_fee', e.target.value)} disabled={!canEdit} /></td>
                    </tr>
                    <tr>
                        <td style={styles.td}><span style={styles.bangla}>Plumbing Plan Fee / প্লাম্বিং ফি</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.plumb_fee} onChange={e => handleChange('plumb_fee', e.target.value)} disabled={!canEdit} /></td>
                    </tr>
                    <tr>
                        <td style={styles.td}><span style={styles.bangla}>3D Design Fee / থ্রিডি ফি</span></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}></td>
                        <td style={styles.td}><input type="number" style={styles.input} value={data.three_d_fee} onChange={e => handleChange('three_d_fee', e.target.value)} disabled={!canEdit} /></td>
                    </tr>

                    <tr style={{ ...styles.totalRow, background: '#0f172a', color: '#fff' }}>
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
