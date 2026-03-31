import FigmaLayout from '@/Layouts/FigmaLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ChartBarIcon,
    StarIcon,
    UserIcon,
    CalendarIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function Index({ reviews, auth }) {
    const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0';
    const avgScore = reviews.length > 0 ? Math.round(reviews.reduce((acc, r) => acc + (r.kpi_score || 0), 0) / reviews.length) : '0';

    return (
        <FigmaLayout user={auth.user}>
            <Head title="Team Performance" />

            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>Team Performance</h1>
                        <p style={{ fontSize: '1rem', color: '#6b7280', margin: '8px 0 0', fontWeight: 500 }}>Overview of member reviews and overall team progress.</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    <div style={statCard}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: '#fffbeb', padding: '10px', borderRadius: '12px' }}><StarIcon className="w-6 h-6 text-amber-500" /></div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase' }}>Average Rating</span>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111827', marginTop: '1rem' }}>{avgRating} <span style={{ fontSize: '1rem', color: '#6b7280', fontWeight: 600 }}>/ 5.0</span></div>
                    </div>
                    <div style={{ ...statCard, background: '#111827', color: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: '#1f2937', padding: '10px', borderRadius: '12px' }}><ChartBarIcon className="w-6 h-6 text-emerald-400" /></div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>Average Score</span>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginTop: '1rem' }}>{avgScore}%</div>
                        <div style={{ width: '100%', height: '6px', background: '#1f2937', borderRadius: '10px', marginTop: '1rem', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ width: `${avgScore}%`, height: '100%', background: '#10b981', borderRadius: '10px' }} />
                        </div>
                    </div>
                </div>

                {/* Table Card */}
                <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', background: '#f9fafb' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', textTransform: 'uppercase', margin: 0 }}>Review History</h3>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
                                    <th style={thStyle}>Member</th>
                                    <th style={thStyle}>Rating</th>
                                    <th style={thStyle}>Score</th>
                                    <th style={thStyle}>Date</th>
                                    <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map((review) => (
                                    <tr key={review.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8' }}>{review.employee?.first_name?.charAt(0)}</div>
                                                <div>
                                                    <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', margin: 0 }}>{review.employee?.first_name} {review.employee?.last_name}</p>
                                                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{review.employee?.designation || 'Staff'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`} style={{ fill: i < review.rating ? 'currentColor' : 'none' }} />)}
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827' }}>{review.kpi_score}%</span>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>
                                                <CalendarIcon className="w-4 h-4" /> {new Date(review.review_date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                                            <Link href={route('employees.show', review.employee_id)}>
                                                <button style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '8px 16px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, color: '#111827', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                    View Profile <ArrowRightIcon className="w-3 h-3" />
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {reviews.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '5rem', textAlign: 'center' }}>
                                            <p style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 600 }}>No performance reviews recorded yet.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </FigmaLayout>
    );
}

const statCard = {
    background: '#fff',
    borderRadius: '24px',
    border: '1px solid #f1f5f9',
    padding: '2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
};

const thStyle = {
    padding: '1.25rem 2rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: 800,
    color: '#64748b',
    textTransform: 'uppercase',
};

const tdStyle = {
    padding: '1.25rem 2rem',
};
