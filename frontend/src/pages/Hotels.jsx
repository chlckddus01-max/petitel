import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DayPicker } from 'react-day-picker'
import { ko } from 'react-day-picker/locale'
import 'react-day-picker/style.css'

const PET_TYPES = ['강아지', '고양이', '기타']
const PAGE_SIZE = 6

function formatDateRange(range) {
    if (!range?.from) return '날짜 선택'
    const fmt = (d) => `${d.getMonth() + 1}/${d.getDate()}`
    return range.to ? `${fmt(range.from)} - ${fmt(range.to)}` : fmt(range.from)
}

function formatNights(range) {
    if (!range?.from || !range?.to) return null
    const nights = Math.round((range.to - range.from) / (1000 * 60 * 60 * 24))
    return `${nights}박 ${nights + 1}일`
}

function getTokenPayload() {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export default function Hotels() {
    const navigate = useNavigate()
    const user = getTokenPayload()

    const [searchText, setSearchText] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [petType, setPetType] = useState('강아지')
    const [facilities, setFacilities] = useState([])
    const [activeFacilities, setActiveFacilities] = useState([])
    const [hotels, setHotels] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [wishlisted, setWishlisted] = useState(new Set())
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [dateRange, setDateRange] = useState({ from: new Date(2026, 6, 10), to: new Date(2026, 6, 12) })
    const [showCalendar, setShowCalendar] = useState(false)
    const calendarRef = useRef(null)

    // 검색창 입력이 멈추고 300ms 뒤에만 실제 검색어를 반영해 매 타이핑마다 서버에 요청하지 않게 한다.
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchText.trim())
            setPage(1)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchText])

    useEffect(() => {
        fetch('/api/hotels/facilities')
            .then((res) => res.json())
            .then(setFacilities)
            .catch(() => {})
    }, [])

    // 검색어/필터/페이지가 바뀔 때마다 서버에서 그 조건에 맞는 한 페이지 분량만 새로 받아온다.
    useEffect(() => {
        const params = new URLSearchParams()
        if (debouncedSearch) params.set('search', debouncedSearch)
        activeFacilities.forEach((name) => params.append('facility', name))
        params.set('page', String(page))
        params.set('size', String(PAGE_SIZE))

        fetch(`/api/hotels?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                setHotels(data.hotels)
                setPage(data.page)
                setTotalPages(data.totalPages)
                setTotalCount(data.totalCount)
                setError(null)
            })
            .catch(() => setError('호텔 목록을 불러오지 못했습니다.'))
            .finally(() => setLoading(false))
    }, [debouncedSearch, activeFacilities, page])

    useEffect(() => {
        if (!showCalendar) return
        function handleClickOutside(e) {
            if (calendarRef.current && !calendarRef.current.contains(e.target)) {
                setShowCalendar(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showCalendar])

    function toggleFacility(name) {
        setActiveFacilities((prev) =>
            prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
        )
        setPage(1)
    }

    function toggleWishlist(id) {
        setWishlisted((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    return (
        <div className="bg-white text-slate-800 antialiased">
            <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
                    <div
                        className="cursor-pointer text-2xl font-bold tracking-tight text-blue-600"
                        onClick={() => navigate('/')}
                    >
                        Petitel
                    </div>

                    <div className="hidden items-center gap-8 md:flex">
                        <a
                            className="border-b-2 border-blue-600 pb-1 text-sm font-bold text-blue-600"
                            href="#"
                        >
                            호텔찾기
                        </a>
                        <a
                            className="text-sm font-medium text-slate-600 transition-opacity duration-200 hover:text-blue-500 active:scale-95"
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigate('/reservations') }}
                        >
                            예약내역
                        </a>
                        <a
                            className="text-sm font-medium text-slate-600 transition-opacity duration-200 hover:text-blue-500 active:scale-95"
                            href="#"
                        >
                            이용안내
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-sm font-bold text-slate-700">
                                    {user.name} 님
                                </span>
                                <button
                                    className="rounded-full px-6 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 transition-all hover:bg-slate-50 active:scale-95"
                                    onClick={() => {
                                        localStorage.removeItem('accessToken');
                                        localStorage.setItem('kakao_force_login', 'true');
                                        window.location.reload();
                                    }}
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="text-sm font-medium text-slate-600 transition-opacity hover:opacity-80"
                                    onClick={() => navigate('/login')}
                                >
                                    로그인
                                </button>
                                <button
                                    className="rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                                    style={{ background: "linear-gradient(135deg, #1947e8 0%, #869aff 100%)" }}
                                    onClick={() => navigate('/signup')}
                                >
                                    회원가입
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <section className="px-8 pb-8 pt-24">
                <div className="mx-auto max-w-7xl">
                    <div className="relative">
                        <span className="material-symbols-outlined pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                            search
                        </span>
                        <input
                            className="w-full rounded-full border border-slate-200 bg-slate-50 py-4 pl-14 pr-6 text-sm text-slate-700 outline-none transition-colors focus:border-blue-400 focus:bg-white"
                            placeholder="지역·호텔 이름 검색"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>

                    <div className="relative mt-4 flex flex-wrap items-center gap-3" ref={calendarRef}>
                        <button
                            className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600"
                            onClick={() => setShowCalendar((prev) => !prev)}
                        >
                            <span className="material-symbols-outlined text-lg">calendar_month</span>
                            {formatDateRange(dateRange)}
                        </button>
                        {formatNights(dateRange) && (
                            <span className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">
                                {formatNights(dateRange)}
                            </span>
                        )}

                        {showCalendar && (
                            <div
                                className="absolute left-0 top-full z-20 mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
                                style={{ '--rdp-accent-color': '#2563eb', '--rdp-accent-background-color': '#eff6ff' }}
                            >
                                <DayPicker
                                    mode="range"
                                    locale={ko}
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    defaultMonth={dateRange?.from}
                                    disabled={{ before: new Date() }}
                                />
                                <div className="mt-2 flex justify-end">
                                    <button
                                        className="rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white"
                                        onClick={() => setShowCalendar(false)}
                                    >
                                        적용
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                        {PET_TYPES.map((type) => (
                            <button
                                key={type}
                                className={
                                    petType === type
                                        ? 'rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white'
                                        : 'rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-blue-200'
                                }
                                onClick={() => setPetType(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="text-sm font-medium text-slate-500">시설/서비스</span>
                        {facilities.map((facility) => {
                            const active = activeFacilities.includes(facility.name)
                            return (
                                <button
                                    key={facility.name}
                                    className={
                                        active
                                            ? 'flex items-center gap-1.5 rounded-full border border-blue-500 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600'
                                            : 'flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-blue-200'
                                    }
                                    onClick={() => toggleFacility(facility.name)}
                                >
                                    <span className="material-symbols-outlined text-lg">{facility.icon}</span>
                                    {facility.name}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-slate-50 px-8 py-10">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">강남구 추천 호텔</h1>
                            <p className="mt-1 text-sm text-slate-500">
                                총 {totalCount}개의 검색 결과가 있습니다.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">
                                <span className="material-symbols-outlined text-lg">tune</span>
                                필터
                            </button>
                            <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">
                                추천순
                                <span className="material-symbols-outlined text-lg">expand_more</span>
                            </button>
                        </div>
                    </div>

                    {loading && <p className="py-10 text-center text-sm text-slate-500">호텔을 불러오는 중...</p>}
                    {error && <p className="py-10 text-center text-sm text-red-500">{error}</p>}

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {hotels.map((hotel) => (
                            <div
                                key={hotel.id}
                                className="cursor-pointer overflow-hidden rounded-3xl border border-slate-100 bg-white transition-shadow hover:shadow-lg"
                                onClick={() => navigate(`/hotels/${hotel.id}`)}
                            >
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                    <img alt={hotel.name} className="h-full w-full object-cover" src={hotel.image} />

                                    {hotel.listBadge && (
                                        <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                                            {hotel.listBadge}
                                        </span>
                                    )}

                                    <button
                                        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm"
                                        onClick={(e) => { e.stopPropagation(); toggleWishlist(hotel.id) }}
                                    >
                                        <span
                                            className={
                                                wishlisted.has(hotel.id)
                                                    ? "material-symbols-outlined text-lg text-red-500"
                                                    : "material-symbols-outlined text-lg text-slate-400"
                                            }
                                            style={wishlisted.has(hotel.id) ? { fontVariationSettings: "'FILL' 1" } : undefined}
                                        >
                                            favorite
                                        </span>
                                    </button>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="text-lg font-bold text-slate-900">{hotel.name}</h3>
                                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                            <span
                                                className="material-symbols-outlined text-sm text-emerald-600"
                                                style={{ fontVariationSettings: "'FILL' 1" }}
                                            >
                                                star
                                            </span>
                                            {hotel.rating.toFixed(1)} ({hotel.reviewCount})
                                        </span>
                                    </div>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {hotel.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-4 border-t border-dashed border-slate-200 pt-4">
                                        <span className="text-xs text-slate-500">1박기준</span>
                                        <div className="mt-0.5">
                                            <span className="text-2xl font-bold text-blue-600">
                                                {hotel.pricePerNight.toLocaleString()}
                                            </span>{' '}
                                            <span className="text-sm font-bold text-blue-600">KRW</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-12 flex items-center justify-center gap-2">
                            <button
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:border-blue-200 disabled:cursor-not-allowed disabled:opacity-40"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <span className="material-symbols-outlined text-lg">chevron_left</span>
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    className={
                                        p === page
                                            ? 'flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white'
                                            : 'flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-sm font-medium text-slate-600 transition-colors hover:border-blue-200'
                                    }
                                    onClick={() => setPage(p)}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:border-blue-200 disabled:cursor-not-allowed disabled:opacity-40"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                <span className="material-symbols-outlined text-lg">chevron_right</span>
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <footer className="w-full rounded-t-3xl bg-slate-200">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-12 py-8 md:flex-row">
                    <div className="text-lg font-bold text-blue-600">Petitel</div>

                    <p className="text-xs text-slate-500">
                        © 2026 Petitel Premium Pet Care. All rights reserved.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <a className="text-xs text-slate-500 transition-colors hover:text-blue-600" href="#">
                            Privacy Policy
                        </a>
                        <a className="text-xs text-slate-500 transition-colors hover:text-blue-600" href="#">
                            Terms of Service
                        </a>
                        <a className="text-xs text-slate-500 transition-colors hover:text-blue-600" href="#">
                            Contact Us
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
