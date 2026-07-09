import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authFetch, isLoggedIn, setPostLoginRedirect } from '../utils/auth'
import TopNav from '../components/TopNav'
import MyPageSidebar from '../components/MyPageSidebar'

export default function MyReviews() {
    const navigate = useNavigate()
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!isLoggedIn()) {
            setPostLoginRedirect('/mypage/reviews')
            navigate('/login')
            return
        }

        authFetch('/api/reviews/mine')
            .then((res) => res.json())
            .then(setReviews)
            .catch(() => setError('리뷰 목록을 불러오지 못했습니다.'))
            .finally(() => setLoading(false))
    }, [navigate])

    if (!isLoggedIn()) return null

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
            <TopNav />

            <div className="mx-auto flex max-w-7xl gap-6 px-8 pb-20 pt-24">
                <MyPageSidebar active="reviews" />

                <main className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold text-slate-900">내가 쓴 리뷰</h1>

                    {loading && <p className="mt-6 text-sm text-slate-500">불러오는 중...</p>}
                    {error && <p className="mt-6 text-sm text-red-500">{error}</p>}

                    {!loading && !error && reviews.length === 0 && (
                        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
                            <p className="text-sm text-slate-500">아직 작성한 리뷰가 없어요</p>
                        </div>
                    )}

                    <div className="mt-6 space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="rounded-2xl bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900">{review.hotelName}</h3>
                                    <span className="flex items-center gap-1 text-sm font-bold text-amber-500">
                                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        {review.rating}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-slate-600">{review.content}</p>
                                <p className="mt-3 text-xs text-slate-400">
                                    {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                                </p>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}
