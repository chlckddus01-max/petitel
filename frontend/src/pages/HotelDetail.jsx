import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { isLoggedIn, setPostLoginRedirect } from '../utils/auth'
import { addToWishlist, fetchWishlistIds, removeFromWishlist } from '../utils/wishlist'
import ConfirmModal from '../components/ConfirmModal'

const SWIPE_THRESHOLD_PX = 40

export default function HotelDetail() {
    const navigate = useNavigate()
    const { id } = useParams()

    const [hotel, setHotel] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [wishlisted, setWishlisted] = useState(false)
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [activeImage, setActiveImage] = useState(0)
    const touchStartX = useRef(null)

    useEffect(() => {
        fetch(`/api/hotels/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error('not found')
                return res.json()
            })
            .then((data) => {
                setHotel(data)
                setActiveImage(0)
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false))
    }, [id])

    useEffect(() => {
        if (!isLoggedIn()) return
        fetchWishlistIds().then((ids) => setWishlisted(ids.has(id)))
    }, [id])

    function toggleWishlist() {
        if (!isLoggedIn()) {
            setPostLoginRedirect(`/hotels/${id}`)
            navigate('/login')
            return
        }

        const wasWishlisted = wishlisted
        setWishlisted(!wasWishlisted)

        const request = wasWishlisted ? removeFromWishlist(id) : addToWishlist(id)
        request.then((res) => {
            if (!res.ok) setWishlisted(wasWishlisted)
        })
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white text-slate-800">
                <p className="text-sm text-slate-500">호텔 정보를 불러오는 중...</p>
            </div>
        )
    }

    if (notFound || !hotel) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-slate-800">
                <p className="text-lg font-bold">호텔을 찾을 수 없습니다.</p>
                <button
                    className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white"
                    onClick={() => navigate('/hotels')}
                >
                    호텔 목록으로
                </button>
            </div>
        )
    }

    function goToReservation() {
        if (isLoggedIn()) {
            navigate(`/reservations/new?hotelId=${hotel.id}`)
            return
        }
        setShowLoginModal(true)
    }

    function confirmLogin() {
        setPostLoginRedirect(`/reservations/new?hotelId=${hotel.id}`)
        navigate('/login')
    }

    const images = hotel.images?.length > 0 ? hotel.images : [hotel.image]

    function goToImage(index) {
        setActiveImage((index + images.length) % images.length)
    }

    function handleTouchStart(e) {
        touchStartX.current = e.touches[0].clientX
    }

    function handleTouchEnd(e) {
        if (touchStartX.current === null) return
        const delta = e.changedTouches[0].clientX - touchStartX.current
        touchStartX.current = null
        if (delta <= -SWIPE_THRESHOLD_PX) goToImage(activeImage + 1)
        else if (delta >= SWIPE_THRESHOLD_PX) goToImage(activeImage - 1)
    }

    return (
        <div className="bg-white text-slate-800 antialiased">
            <div
                className="relative aspect-[16/9] w-full touch-pan-y overflow-hidden bg-slate-100 sm:aspect-[16/7]"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <img alt={hotel.name} className="h-full w-full object-cover" src={images[activeImage]} />

                <button
                    className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm"
                    onClick={() => navigate('/hotels')}
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>

                <div className="absolute right-4 top-4 flex gap-3">
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm"
                        onClick={() => navigator.share ? navigator.share({ title: hotel.name, url: window.location.href }) : null}
                    >
                        <span className="material-symbols-outlined">ios_share</span>
                    </button>
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm"
                        onClick={toggleWishlist}
                    >
                        <span
                            className={
                                wishlisted
                                    ? 'material-symbols-outlined text-red-500'
                                    : 'material-symbols-outlined text-slate-600'
                            }
                            style={wishlisted ? { fontVariationSettings: "'FILL' 1" } : undefined}
                        >
                            favorite
                        </span>
                    </button>
                </div>

                {images.length > 1 && (
                    <>
                        <button
                            className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-sm hover:bg-white"
                            onClick={() => goToImage(activeImage - 1)}
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button
                            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-sm hover:bg-white"
                            onClick={() => goToImage(activeImage + 1)}
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </>
                )}

                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {images.map((image, index) => (
                        <button
                            key={image}
                            aria-label={`${index + 1}번째 사진 보기`}
                            onClick={() => goToImage(index)}
                            className={index === activeImage ? 'h-1.5 w-1.5 rounded-full bg-white' : 'h-1.5 w-1.5 rounded-full bg-white/50'}
                        />
                    ))}
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-6 pb-32 pt-6">
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <h1 className="text-xl font-bold text-slate-900">{hotel.name}</h1>

                    <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                        <span
                            className="material-symbols-outlined text-base text-amber-500"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            star
                        </span>
                        <span className="font-bold text-slate-700">{hotel.rating.toFixed(1)}</span>
                        <span>({hotel.reviewCount} reviews)</span>
                        <span>·</span>
                        <span>{hotel.address}</span>
                    </div>

                    <div className="mt-6 grid grid-cols-4 gap-4 border-t border-slate-100 pt-6">
                        {hotel.facilities.map((facility) => (
                            <div key={facility.name} className="flex flex-col items-center gap-2">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                    <span className="material-symbols-outlined">{facility.icon}</span>
                                </div>
                                <span className="text-xs font-medium text-slate-600">{facility.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <section className="mt-10">
                    <div className="flex items-end justify-between">
                        <h2 className="text-xl font-bold text-slate-900">예약 가능한 룸</h2>
                        <span className="text-sm font-medium text-slate-500">{hotel.rooms.length} Rooms</span>
                    </div>

                    <div className="mt-4 space-y-4">
                        {hotel.rooms.map((room) => (
                            <div
                                key={room.id}
                                className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4"
                            >
                                <div className="h-16 w-16 shrink-0 rounded-xl bg-slate-100" />

                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900">{room.name}</h3>
                                    <p className="mt-1 text-xs text-slate-500">최대 {room.maxPets}마리 동반 가능</p>
                                </div>

                                <div className="text-right">
                                    <span className="text-lg font-bold text-blue-600">
                                        {room.pricePerNight.toLocaleString()}
                                    </span>{' '}
                                    <span className="text-xs font-bold text-blue-600">KRW</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-10">
                    <div className="flex items-end justify-between">
                        <h2 className="text-xl font-bold text-slate-900">최근 리뷰</h2>
                        <button className="flex items-center gap-1 text-sm font-bold text-blue-600">
                            전체보기
                            <span className="material-symbols-outlined text-base">chevron_right</span>
                        </button>
                    </div>

                    <div className="mt-4 space-y-3">
                        {hotel.reviews.map((review, idx) => (
                            <div key={idx} className="rounded-2xl bg-slate-50 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-slate-200" />
                                        <span className="text-sm font-bold text-slate-800">{review.reviewerName}</span>
                                    </div>
                                    <span className="flex items-center gap-1 text-sm font-bold text-amber-500">
                                        <span
                                            className="material-symbols-outlined text-base"
                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                        >
                                            star
                                        </span>
                                        {review.rating}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-slate-600">{review.content}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="fixed bottom-0 left-0 right-0 flex items-center gap-4 border-t border-slate-100 bg-white/95 px-6 py-4 backdrop-blur-md">
                <button
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-slate-200"
                    onClick={() => setWishlisted((prev) => !prev)}
                >
                    <span
                        className={
                            wishlisted
                                ? 'material-symbols-outlined text-red-500'
                                : 'material-symbols-outlined text-slate-600'
                        }
                        style={wishlisted ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                        favorite
                    </span>
                </button>
                <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 py-4 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                    onClick={goToReservation}
                >
                    예약하기
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
            </div>

            {showLoginModal && (
                <ConfirmModal
                    title="로그인이 필요합니다"
                    message="예약을 진행하려면 로그인이 필요합니다. 로그인 페이지로 이동할까요?"
                    confirmText="로그인하기"
                    cancelText="취소"
                    onConfirm={confirmLogin}
                    onCancel={() => setShowLoginModal(false)}
                />
            )}
        </div>
    )
}
