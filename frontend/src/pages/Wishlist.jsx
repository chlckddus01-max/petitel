import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authFetch, isLoggedIn, setPostLoginRedirect } from '../utils/auth'
import { removeFromWishlist } from '../utils/wishlist'
import TopNav from '../components/TopNav'
import MyPageSidebar from '../components/MyPageSidebar'

export default function Wishlist() {
    const navigate = useNavigate()

    const [hotels, setHotels] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    // 방금 해제한 항목을 잠깐 기억해뒀다가 "되돌리기" 토스트에서 복구할 수 있게 한다.
    const [undo, setUndo] = useState(null)

    useEffect(() => {
        if (!isLoggedIn()) {
            setPostLoginRedirect('/mypage/wishlist')
            navigate('/login')
            return
        }

        authFetch('/api/wishlist')
            .then((res) => res.json())
            .then(setHotels)
            .catch(() => setError('찜 목록을 불러오지 못했습니다.'))
            .finally(() => setLoading(false))
    }, [navigate])

    useEffect(() => {
        if (!undo) return
        const timer = setTimeout(() => setUndo(null), 3000)
        return () => clearTimeout(timer)
    }, [undo])

    function handleRemove(hotel) {
        setHotels((prev) => prev.filter((h) => h.id !== hotel.id))
        setUndo(hotel)
        removeFromWishlist(hotel.id)
    }

    function handleUndo() {
        if (!undo) return
        authFetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hotelId: undo.id }),
        }).then((res) => {
            if (res.ok) setHotels((prev) => [undo, ...prev])
        })
        setUndo(null)
    }

    if (!isLoggedIn()) return null

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
            <TopNav />

            <div className="mx-auto flex max-w-7xl gap-6 px-8 pb-20 pt-24">
                <MyPageSidebar active="wishlist" />

                <main className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold text-slate-900">찜한 호텔</h1>

                    {loading && <p className="mt-6 text-sm text-slate-500">불러오는 중...</p>}
                    {error && <p className="mt-6 text-sm text-red-500">{error}</p>}

                    {!loading && !error && hotels.length === 0 && (
                        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
                            <p className="text-sm text-slate-500">아직 찜한 호텔이 없어요</p>
                            <button
                                className="mt-4 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white"
                                onClick={() => navigate('/hotels')}
                            >
                                호텔 둘러보기
                            </button>
                        </div>
                    )}

                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {hotels.map((hotel) => (
                            <div
                                key={hotel.id}
                                className="cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
                                onClick={() => navigate(`/hotels/${hotel.id}`)}
                            >
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200">
                                    <img alt={hotel.name} className="h-full w-full object-cover" src={hotel.image} />
                                    <button
                                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm"
                                        onClick={(e) => { e.stopPropagation(); handleRemove(hotel) }}
                                        aria-label="찜 해제"
                                    >
                                        <span
                                            className="material-symbols-outlined text-lg text-red-500"
                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                        >
                                            favorite
                                        </span>
                                    </button>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-slate-900">{hotel.name}</h3>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="flex items-center gap-1 text-sm font-bold text-amber-500">
                                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            {hotel.rating.toFixed(1)}
                                        </span>
                                        {hotel.pricePerNight != null && (
                                            <span className="text-sm font-bold text-blue-600">
                                                {hotel.pricePerNight.toLocaleString()}원~
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>

            {undo && (
                <div className="fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-full bg-slate-900 px-5 py-3 text-sm text-white shadow-lg">
                    <span>{undo.name} 찜 해제됨</span>
                    <button className="font-bold text-blue-300" onClick={handleUndo}>
                        되돌리기
                    </button>
                </div>
            )}
        </div>
    )
}
