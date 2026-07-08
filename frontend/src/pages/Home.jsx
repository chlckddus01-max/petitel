import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

export default function Home() {

    const navigate = useNavigate()
    const user = getTokenPayload()
    const [recommendedHotels, setRecommendedHotels] = useState([])

    const goToSearch = () => {
        navigate('/hotels')
    }

    useEffect(() => {
        fetch('/api/hotels?page=1&size=20')
            .then((res) => res.json())
            .then((data) => {
                const topRated = [...data.hotels].sort((a, b) => b.rating - a.rating).slice(0, 3)
                setRecommendedHotels(topRated)
            })
            .catch(() => {})
    }, [])

    return (
        <div className="bg-slate-50 text-slate-800 antialiased">
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
                            onClick={(e) => { e.preventDefault(); navigate('/hotels') }}
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

            <header className="overflow-hidden bg-white px-6 pb-16 pt-32 md:pb-24 md:pt-48">
                <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
                    <div className="space-y-8">
                        <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold tracking-wide text-blue-600">
                            PREMIUM CARE
                        </div>

                        <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-7xl">
                            우리 아이를 위한
                            <br />
                            <span className="text-blue-600">편안한 호텔 예약</span>
                        </h1>

                        <p className="max-w-lg text-lg leading-relaxed text-slate-500 md:text-xl">
                            검증된 프리미엄 펫 호텔을 지금 바로 검색하고 예약하세요. 소중한
                            반려동물을 위한 가장 편안한 하룻밤을 약속합니다.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button
                                className="flex items-center gap-2 rounded-full px-10 py-4 text-lg font-bold text-white shadow-xl shadow-blue-500/25 transition-all active:scale-95"
                                style={{ background: "linear-gradient(135deg, #1947e8 0%, #869aff 100%)" }}
                                onClick={goToSearch}
                            >
                                예약하러 가기
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-blue-100 opacity-60 blur-3xl" />

                        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                            <img
                                alt="Happy pet"
                                className="aspect-[4/5] w-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuxkqWCF5OOToNcqlGDGy9TtzVwTFQcQXH5_dW-IcdMa77LawvdCh9zDyX5LXHyEu0GBJslbOY6-_3VQN7lUFL52jCt3s4dIW-BsC_aol3YvSw_eTjhqieC4rq2-RNtttW0rNfTL_ZyxDJMfi73Hux-zTJGD-w10l3R9Tj81JFRlbNm4A55E9-XAK1alwvtdOCXCJOBDLnMFTtexaonDFC_o6pdQ4oHPnOeqwjRynIlvSCNpS5aqE_HBHfKq9fofq3Ur_QtlHI-elQ"
                            />
                        </div>

                        <div
                            className="hidden rounded-2xl bg-white p-6 md:absolute md:-bottom-6 md:-left-6 md:block"
                            style={{ boxShadow: "0 12px 32px -4px rgba(25, 71, 232, 0.08)" }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                                    <span className="material-symbols-outlined">verified</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">100% 검증된 업체</p>
                                    <p className="text-xs text-slate-500">전문 스태프가 상주하며 케어합니다</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 왜 Petitel 호텔인가 - 기존 4개 카테고리(미용/호텔/데이케어/건강관리) 대신
               호텔 서비스 하나에 집중하는 신뢰 요소로 교체 */}
            <section className="bg-slate-50 px-6 py-24">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <h2 className="mb-4 text-3xl font-bold">펫티텔 호텔이 다른 이유</h2>
                            <p className="text-lg text-slate-500">
                                소중한 반려동물을 맡기기 전, 가장 먼저 확인해야 할 것들.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        <div
                            className="group cursor-pointer rounded-3xl bg-white p-8 transition-all duration-300 hover:-translate-y-2"
                            style={{ boxShadow: "0 12px 32px -4px rgba(25, 71, 232, 0.08)" }}
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                <span className="material-symbols-outlined text-3xl">verified</span>
                            </div>
                            <h3 className="mb-2 text-xl font-bold">검증된 시설</h3>
                            <p className="text-sm text-slate-500">입점 심사를 통과한 호텔만 등록</p>
                        </div>

                        <div
                            className="group cursor-pointer rounded-3xl bg-white p-8 transition-all duration-300 hover:-translate-y-2"
                            style={{ boxShadow: "0 12px 32px -4px rgba(25, 71, 232, 0.08)" }}
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-slate-500 group-hover:text-white">
                                <span className="material-symbols-outlined text-3xl">videocam</span>
                            </div>
                            <h3 className="mb-2 text-xl font-bold">24시간 CCTV</h3>
                            <p className="text-sm text-slate-500">언제든 실시간으로 확인 가능</p>
                        </div>

                        <div
                            className="group cursor-pointer rounded-3xl bg-white p-8 transition-all duration-300 hover:-translate-y-2"
                            style={{ boxShadow: "0 12px 32px -4px rgba(25, 71, 232, 0.08)" }}
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                                <span className="material-symbols-outlined text-3xl">groups</span>
                            </div>
                            <h3 className="mb-2 text-xl font-bold">여러 마리 동반</h3>
                            <p className="text-sm text-slate-500">여러 마리도 한 번에 예약</p>
                        </div>

                        <div
                            className="group cursor-pointer rounded-3xl bg-white p-8 transition-all duration-300 hover:-translate-y-2"
                            style={{ boxShadow: "0 12px 32px -4px rgba(25, 71, 232, 0.08)" }}
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 transition-colors group-hover:bg-red-500 group-hover:text-white">
                                <span className="material-symbols-outlined text-3xl">bolt</span>
                            </div>
                            <h3 className="mb-2 text-xl font-bold">실시간 예약확정</h3>
                            <p className="text-sm text-slate-500">호텔 승인 즉시 알림으로 확인</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 추천 펫 샵 - 미용살롱/데이케어가 섞여있던 3개 카드를 전부 호텔로 교체 */}
            <section className="bg-slate-100 px-6 py-24">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 flex items-end justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">추천 호텔</h2>
                            <p className="mt-1 text-sm text-slate-500">평점이 높은 인기 호텔들을 확인해보세요</p>
                        </div>
                        <button
                            className="flex items-center gap-2 font-bold text-blue-600 hover:opacity-70"
                            onClick={goToSearch}
                        >
                            전체보기 <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {recommendedHotels.map((hotel) => (
                            <div
                                key={hotel.id}
                                className="group overflow-hidden rounded-3xl bg-white transition-all hover:-translate-y-1 cursor-pointer"
                                style={{ boxShadow: "0 12px 32px -4px rgba(25, 71, 232, 0.08)" }}
                                onClick={() => navigate(`/hotels/${hotel.id}`)}
                            >
                                <div className="relative h-64">
                                    <img
                                        alt={hotel.name}
                                        className="h-full w-full object-cover"
                                        src={hotel.image}
                                    />
                                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 backdrop-blur-md">
                                        {hotel.address}
                                    </div>
                                    <button
                                        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 backdrop-blur-md transition-colors hover:text-blue-600"
                                        onClick={(e) => e.stopPropagation()}
                                        aria-label="찜하기"
                                    >
                                        <span className="material-symbols-outlined text-lg">favorite_border</span>
                                    </button>
                                </div>
                                <div className="p-6">
                                    <div className="mb-2 flex items-start justify-between">
                                        <h4 className="text-lg font-bold">{hotel.name}</h4>
                                        <div className="flex items-center text-sm font-bold">
                                            <span className="material-symbols-outlined mr-1 text-sm text-yellow-400">
                                                star
                                            </span>
                                            {hotel.rating.toFixed(1)}
                                        </div>
                                    </div>
                                    <p className="mb-4 text-sm text-slate-500">{hotel.tags.join(' · ')}</p>
                                    <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-4">
                                        <p className="text-sm font-bold text-slate-900">
                                            1박 {hotel.pricePerNight.toLocaleString()}원~
                                        </p>
                                        <button
                                            className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-100"
                                            onClick={(e) => { e.stopPropagation(); navigate(`/hotels/${hotel.id}`); }}
                                        >
                                            상세보기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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

            <div className="fixed bottom-6 left-6 right-6 z-50 md:hidden">
                <div className="flex items-center justify-around rounded-full border border-white/20 bg-white/80 p-2 shadow-2xl backdrop-blur-xl">
                    <a className="flex flex-col items-center p-2 text-blue-600" href="#">
                        <span className="material-symbols-outlined">home</span>
                        <span className="mt-1 text-[10px] font-bold">홈</span>
                    </a>
                    <a
                        className="flex flex-col items-center p-2 text-slate-400"
                        href="#"
                        onClick={(e) => { e.preventDefault(); navigate('/hotels') }}
                    >
                        <span className="material-symbols-outlined">search</span>
                        <span className="mt-1 text-[10px] font-medium">검색</span>
                    </a>
                    <a
                        className="flex flex-col items-center p-2 text-slate-400"
                        href="#"
                        onClick={(e) => { e.preventDefault(); navigate('/reservations') }}
                    >
                        <span className="material-symbols-outlined">calendar_month</span>
                        <span className="mt-1 text-[10px] font-medium">예약</span>
                    </a>
                    <a
                        className="flex flex-col items-center p-2 text-slate-400"
                        href="#"
                        onClick={(e) => { e.preventDefault(); navigate('/mypage') }}
                    >
                        <span className="material-symbols-outlined">person</span>
                        <span className="mt-1 text-[10px] font-medium">프로필</span>
                    </a>
                </div>
            </div>
        </div>
    )
}
