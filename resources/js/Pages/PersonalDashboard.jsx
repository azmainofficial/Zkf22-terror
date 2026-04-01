import React, { useState } from 'react';
import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head } from '@inertiajs/react';
import { Calendar, Clock, Download, FileText, CheckCircle2, User, HelpCircle } from 'lucide-react';
import { t, getLanguage } from '../Lang/translation';

export default function PersonalDashboard({ auth, employee, attendance_calendar, payslips, today_date, current_time }) {
    
    // Convert object to map easier access
    const getStatusForDate = (dateString) => {
        if (!attendance_calendar || !attendance_calendar[dateString]) return null;
        return attendance_calendar[dateString][0]; // get the first log for the day (usually check-in)
    };

    // Calendar logic
    const today = new Date();
    const currentMonthNum = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonthNum + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonthNum, 1).getDay();

    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

    const locale = getLanguage() === 'bn' ? 'bn-BD' : 'en-US';
    const dayLabels = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];

    return (
        <FigmaLayout user={auth.user}>
            <Head title={t('my_operations_hub')} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                        {t('welcome_back')} {auth.user.name.split(' ')[0]}
                    </h1>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>
                        {today_date} • {current_time}
                    </p>
                </div>

                {!employee ? (
                    <div style={{ padding: '4rem', textAlign: 'center', background: '#fff', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                        <User size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                        <h2 style={{ margin: '0 0 8px', fontSize: '1.25rem', color: '#0f172a' }}>{t('no_id_profile_linked')}</h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>{t('no_id_desc')}</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem', alignItems: 'start' }}>
                        
                        {/* LEFT COLUMN */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            
                            {/* Shift Info Strip */}
                            <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', padding: '24px', borderRadius: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 10px 25px rgba(79,70,229,0.15)' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                                    <Clock size={28} />
                                </div>
                                <div>
                                    <h3 style={{ margin: '0 0 4px', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.9 }}>{t('available_shift_time')}</h3>
                                    {employee.shift ? (
                                        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>{employee.shift.start_time.slice(0,5)} - {employee.shift.end_time.slice(0,5)}</p>
                                    ) : (
                                        <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>{t('standard_working_hours')}</p>
                                    )}
                                </div>
                            </div>

                            {/* Calendar Block */}
                            <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '24px', padding: '32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{t('attendance_log')}</h2>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', background: '#f8fafc', padding: '6px 14px', borderRadius: '20px' }}>{t('current_month')}</span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
                                    {dayLabels.map(d => (
                                        <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', paddingBottom: '1rem' }}>{d}</div>
                                    ))}
                                    
                                    {calendarDays.map((day, idx) => {
                                        if (!day) return <div key={`empty-${idx}`} />;
                                        
                                        const dateStr = `${currentYear}-${String(currentMonthNum + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                                        const log = getStatusForDate(dateStr);
                                        const isToday = day === today.getDate();

                                        let bg = '#FAFAFA';
                                        let border = '#f1f5f9';
                                        if (log) {
                                            bg = '#f0fdf4'; // Checked in
                                            border = '#bbf7d0';
                                        }

                                        return (
                                            <div key={day} style={{ 
                                                aspectRatio: '1', borderRadius: '12px', background: bg, border: `1.5px solid ${isToday ? '#4f46e5' : border}`, 
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' 
                                            }}>
                                                <span style={{ fontSize: '1rem', fontWeight: 800, color: isToday ? '#4f46e5' : '#475569' }}>
                                                    {getLanguage() === 'bn' ? day.toLocaleString('bn-BD') : day}
                                                </span>
                                                {log && <div style={{ marginTop: '4px', fontSize: '0.65rem', fontWeight: 800, color: '#10b981' }}>{log.time.slice(0,5)}</div>}
                                                {isToday && !log && <div style={{ marginTop: '4px', fontSize: '0.65rem', fontWeight: 800, color: '#f59e0b' }}>{t('pending')}</div>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '24px', padding: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f5f3ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FileText size={20} />
                                    </div>
                                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{t('recent_payslips')}</h2>
                                </div>
                                
                                {payslips && payslips.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {payslips.map(ps => {
                                            const slipDateName = new Date(ps.year, ps.month - 1).toLocaleString(locale, { month: 'long', year: 'numeric' });
                                            return (
                                                <div key={ps.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{slipDateName}</p>
                                                        <p style={{ margin: '2px 0 0', fontSize: '0.75rem', fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'capitalize' }}>
                                                            <CheckCircle2 size={12} /> {t(ps.status)}
                                                        </p>
                                                    </div>
                                                    <a href={`/payroll/${ps.id}/slip`} target="_blank" style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                                        <Download size={16} />
                                                    </a>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                                        <HelpCircle size={32} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, fontWeight: 500 }}>{t('no_payslips_yet')}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </FigmaLayout>
    );
}
