import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authFetch, isLoggedIn, setPostLoginRedirect } from '../utils/auth'
import TopNav from '../components/TopNav'
import MyPageSidebar from '../components/MyPageSidebar'

const STATUS_LABEL = {
    PENDING: '승인대기',
    CONFIRMED: '예약확정',
    REJECTED: '거절됨',
    CANCELLED: '취소됨',
}

const STATUS_STYLE = {
    PENDING: 'bg-amber-50 text-amber-700',
    CONFIRMED: 'bg-emerald-50 text-emerald-700',
    REJECTED: 'bg-red-50 text-red-700',
    CANCELLED: 'bg-slate-100 text-slate-500',
}

// 서버는 상태를 별도로 'COMPLETED'로 바꾸지 않는다 — "이용완료"는 CONFIRMED + 체크아웃일이 지남으로 판단한다
// (설계서 15번 화면의 정의를 그대로 따름, 백엔드 ReservationService와 동일 기준).
function isCompleted(reservation) {
    return reservation.status === 'CONFIRMED' && new Date(reservation.checkOut) < new Date()
}

function displayStatus(r) {
    return isCompleted(r) ? 'COMPLETED' : r.status
}

const FILTER_TABS = [
    { key: 'ALL', label: '전체' },
    { key: 'CONFIRMED', label: '예약확정' },
    { key: 'COMPLETED', label: '이용완료' },
    { key: 'CANCELLED', label: '취소됨' },
]

export default function Reservations() {
    const navigate = useNavigate()
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState('ALL')

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

    const filtered = filter === 'ALL' ? reservations : reservations.filter((r) => displayStatus(r) === filter)

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
            <TopNav />

            <div className="mx-auto flex max-w-7xl gap-6 px-8 pb-20 pt-24">
                <MyPageSidebar active="reservations" />

                <main className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold text-slate-900">예약내역</h1>

                    <div className="mt-4 flex gap-2">
                        {FILTER_TABS.map((tab) => (
                            <button
                                key={tab.key}
                                className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                                    filter === tab.key ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                                }`}
                                onClick={() => setFilter(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {loading && <p className="mt-6 text-sm text-slate-500">불러오는 중...</p>}
                    {error && <p className="mt-6 text-sm text-red-500">{error}</p>}

                    {!loading && !error && filtered.length === 0 && (
                        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
                            <p className="text-sm text-slate-500">해당하는 예약 내역이 없습니다.</p>
                            <button
                                className="mt-4 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white"
                                onClick={() => navigate('/hotels')}
                            >
                                호텔 둘러보기
                            </button>
                        </div>
                    )}

                    <div className="mt-4 space-y-4">
                        {filtered.map((r) => (
                            <div key={r.id} className="rounded-2xl bg-white p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{r.hotelName}</h3>
                                        <p className="mt-0.5 text-sm text-slate-500">{r.roomName}</p>
                                    </div>
                                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${isCompleted(r) ? 'bg-blue-50 text-blue-700' : STATUS_STYLE[r.status] || 'bg-slate-100 text-slate-500'}`}>
                                        {isCompleted(r) ? '이용완료' : STATUS_LABEL[r.status] || r.status}
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

                                <div className="mt-3 flex items-center justify-between">
                                    {isCompleted(r) ? (
                                        <button
                                            className="text-sm font-bold text-blue-600 hover:underline"
                                            onClick={() =>
                                                navigate(
                                                    r.hasReview
                                                        ? '/mypage/reviews'
                                                        : `/mypage/reviews/write?reservationId=${r.id}&hotelName=${encodeURIComponent(r.hotelName)}`
                                                )
                                            }
                                        >
                                            {r.hasReview ? '내 리뷰 보기' : '리뷰 작성하기'}
                                        </button>
                                    ) : (
                                        <span />
                                    )}
                                    <div className="text-right">
                                        <span className="text-lg font-bold text-blue-600">{r.totalPrice.toLocaleString()}</span>{' '}
                                        <span className="text-xs font-bold text-blue-600">KRW</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}
