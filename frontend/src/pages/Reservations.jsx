import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authFetch, isLoggedIn, setPostLoginRedirect } from '../utils/auth'

const STATUS_LABEL = {
    PENDING: '승인 대기',
    CONFIRMED: '예약 확정',
    REJECTED: '거절됨',
    CANCELLED: '취소됨',
    COMPLETED: '이용 완료',
}

const STATUS_STYLE = {
    PENDING: 'bg-amber-50 text-amber-700',
    CONFIRMED: 'bg-emerald-50 text-emerald-700',
    REJECTED: 'bg-red-50 text-red-700',
    CANCELLED: 'bg-slate-100 text-slate-500',
    COMPLETED: 'bg-blue-50 text-blue-700',
}

export default function Reservations() {
    const navigate = useNavigate()
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!isLoggedIn()) {
            setPostLoginRedirect('/reservations')
            navigate('/login')
            return
        }

        authFetch('/api/reservations')
            .then((res) => res.json())
            .then(setReservations)
            .catch(() => setError('예약내역을 불러오지 못했습니다.'))
            .finally(() => setLoading(false))
    }, [navigate])

    if (!isLoggedIn()) return null

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
            <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
                <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100"
                        onClick={() => navigate('/')}
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold">예약내역</h1>
                    <div className="w-10" />
                </div>
            </nav>

            <main className="mx-auto max-w-3xl px-6 pb-20 pt-24">
                {loading && <p className="text-sm text-slate-500">불러오는 중...</p>}
                {error && <p className="text-sm text-red-500">{error}</p>}

                {!loading && !error && reservations.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
                        <p className="text-sm text-slate-500">아직 예약 내역이 없습니다.</p>
                        <button
                            className="mt-4 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white"
                            onClick={() => navigate('/hotels')}
                        >
                            호텔 둘러보기
                        </button>
                    </div>
                )}

                <div className="space-y-4">
                    {reservations.map((r) => (
                        <div key={r.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="font-bold text-slate-900">{r.hotelName}</h3>
                                    <p className="mt-0.5 text-sm text-slate-500">{r.roomName}</p>
                                </div>
                                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[r.status] || 'bg-slate-100 text-slate-500'}`}>
                                    {STATUS_LABEL[r.status] || r.status}
                                </span>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-dashed border-slate-200 pt-4 text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-base text-slate-400">calendar_month</span>
                                    {r.checkIn} ~ {r.checkOut} ({r.nights}박)
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-base text-slate-400">pets</span>
                                    {r.petNames.join(', ')}
                                </span>
                            </div>

                            {r.requestNote && (
                                <p className="mt-2 text-xs text-slate-500">요청사항: {r.requestNote}</p>
                            )}

                            <div className="mt-3 text-right">
                                <span className="text-lg font-bold text-blue-600">{r.totalPrice.toLocaleString()}</span>{' '}
                                <span className="text-xs font-bold text-blue-600">KRW</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
