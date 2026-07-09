import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authFetch, isLoggedIn, setPostLoginRedirect } from '../utils/auth'
import TopNav from '../components/TopNav'
import MyPageSidebar from '../components/MyPageSidebar'

function StarPicker({ value, onChange, size = 'text-2xl' }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n}점`}>
                    <span
                        className={`material-symbols-outlined ${size} ${value >= n ? 'text-amber-500' : 'text-slate-200'}`}
                        style={value >= n ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                        star
                    </span>
                </button>
            ))}
        </div>
    )
}

export default function ReviewWrite() {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const reservationId = params.get('reservationId')
    const hotelName = params.get('hotelName')

    const [rating, setRating] = useState(0)
    const [cleanlinessRating, setCleanlinessRating] = useState(0)
    const [kindnessRating, setKindnessRating] = useState(0)
    const [content, setContent] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    if (!isLoggedIn()) {
        setPostLoginRedirect(`/mypage/reviews/write?reservationId=${reservationId || ''}`)
        navigate('/login')
        return null
    }

    if (!reservationId) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-slate-800">
                <p className="text-sm text-slate-500">잘못된 접근입니다.</p>
                <button className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white" onClick={() => navigate('/reservations')}>
                    예약내역으로
                </button>
            </div>
        )
    }

    async function handleSubmit() {
        setError(null)

        if (rating === 0) {
            setError('전체 별점을 선택해주세요.')
            return
        }
        if (content.trim().length < 10) {
            setError('리뷰는 10자 이상 입력해주세요.')
            return
        }

        setSubmitting(true)
        try {
            const res = await authFetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reservationId,
                    rating,
                    cleanlinessRating: cleanlinessRating || null,
                    kindnessRating: kindnessRating || null,
                    content: content.trim(),
                }),
            })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                setError(data.message || '리뷰 작성에 실패했습니다.')
                return
            }
            navigate('/mypage/reviews')
        } catch {
            setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
            <TopNav />

            <div className="mx-auto flex max-w-7xl gap-6 px-8 pb-20 pt-24">
                <MyPageSidebar active="reviews" />

                <main className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold text-slate-900">리뷰 작성</h1>

                    <div className="mt-6 flex gap-6">
                        <div className="min-w-0 flex-1 space-y-6">
                            {hotelName && (
                                <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
                                    <div className="h-14 w-14 shrink-0 rounded-full bg-slate-200" />
                                    <h2 className="font-bold text-slate-900">{hotelName}</h2>
                                </div>
                            )}

                            <div className="rounded-2xl bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-700">전체적으로 만족하셨나요?</span>
                                    <StarPicker value={rating} onChange={setRating} />
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-700">청결도</span>
                                    <StarPicker value={cleanlinessRating} onChange={setCleanlinessRating} size="text-xl" />
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-700">친절도</span>
                                    <StarPicker value={kindnessRating} onChange={setKindnessRating} size="text-xl" />
                                </div>

                                <p className="mb-2 mt-6 text-sm font-bold text-slate-700">상세 후기</p>
                                <textarea
                                    className="w-full rounded-2xl border border-slate-200 p-4 text-sm focus:border-blue-500 focus:outline-none"
                                    rows={6}
                                    placeholder="다른 보호자들에게 도움이 될 솔직한 후기를 남겨주세요. (최소 10자)"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    maxLength={1000}
                                />
                                <p className="mt-1 text-right text-xs text-slate-400">{content.length} / 1000</p>
                            </div>
                        </div>

                        <div className="w-72 shrink-0">
                            <div className="rounded-2xl bg-white p-5 shadow-sm">
                                <p className="text-sm text-slate-500">
                                    작성한 리뷰는 다른 보호자들에게 큰 도움이 돼요. 솔직한 후기를 남겨주세요!
                                </p>
                                {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="mt-4 w-full rounded-full bg-blue-600 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {submitting ? '등록 중...' : '리뷰 등록하기'}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
