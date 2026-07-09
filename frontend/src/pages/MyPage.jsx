import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authFetch, isLoggedIn, setPostLoginRedirect } from '../utils/auth'
import TopNav from '../components/TopNav'
import MyPageSidebar from '../components/MyPageSidebar'

const STATUS_LABEL = {
    PENDING: '승인대기',
    CONFIRMED: '예약확정',
}

const STATUS_STYLE = {
    PENDING: 'bg-amber-50 text-amber-700',
    CONFIRMED: 'bg-emerald-50 text-emerald-700',
}

export default function MyPage() {
    const navigate = useNavigate()

    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!isLoggedIn()) {
            setPostLoginRedirect('/mypage')
            navigate('/login')
            return
        }

        authFetch('/api/users/me/summary')
            .then((res) => res.json())
            .then(setSummary)
            .catch(() => setError('정보를 불러오지 못했습니다.'))
            .finally(() => setLoading(false))
    }, [navigate])

    if (!isLoggedIn()) return null

    const next = summary?.nextReservation

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
            <TopNav />

            <div className="mx-auto flex max-w-7xl gap-6 px-8 pb-20 pt-24">
                <MyPageSidebar active="home" />

                <main className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold text-slate-900">마이페이지</h1>

                    {loading && <p className="mt-6 text-sm text-slate-500">불러오는 중...</p>}
                    {error && <p className="mt-6 text-sm text-red-500">{error}</p>}

                    {summary && (
                        <>
                            <div className="mt-6 flex flex-wrap gap-4">
                                <button
                                    className="w-40 rounded-2xl bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
                                    onClick={() => navigate('/reservations')}
                                >
                                    <p className="text-3xl font-bold text-blue-600">{summary.upcomingReservationCount}</p>
                                    <p className="mt-1 text-sm text-slate-500">예정된 예약</p>
                                </button>
                                <button
                                    className="w-40 rounded-2xl bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
                                    onClick={() => navigate('/reservations')}
                                >
                                    <p className="text-3xl font-bold text-slate-900">{summary.completedReservationCount}</p>
                                    <p className="mt-1 text-sm text-slate-500">이용완료</p>
                                </button>
                                <button
                                    className="w-40 rounded-2xl bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
                                    onClick={() => navigate('/mypage/wishlist')}
                                >
                                    <p className="text-3xl font-bold text-slate-900">{summary.wishlistCount}</p>
                                    <p className="mt-1 text-sm text-slate-500">찜한 호텔</p>
                                </button>
                            </div>

                            <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-bold text-slate-900">다가오는 예약</h2>
                                    <button
                                        className="text-sm font-bold text-blue-600 hover:underline"
                                        onClick={() => navigate('/reservations')}
                                    >
                                        전체보기
                                    </button>
                                </div>

                                {next ? (
                                    <div className="mt-4 flex items-center gap-4 rounded-2xl bg-amber-50/60 p-4">
                                        <div className="h-14 w-14 shrink-0 rounded-full bg-slate-200" />
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-slate-900">{next.hotelName}</h3>
                                            <p className="mt-0.5 text-sm text-slate-500">
                                                {next.checkIn} ~ {next.checkOut} · {next.petNames?.join(', ')}
                                            </p>
                                        </div>
                                        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[next.status] || 'bg-slate-100 text-slate-500'}`}>
                                            {STATUS_LABEL[next.status] || next.status}
                                        </span>
                                    </div>
                                ) : (
                                    <p className="mt-4 text-sm text-slate-400">다가오는 예약이 없어요</p>
                                )}
                            </section>
                        </>
                    )}
                </main>
            </div>
        </div>
    )
}
