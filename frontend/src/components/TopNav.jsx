import { useNavigate } from 'react-router-dom'
import { getTokenPayload, logout } from '../utils/auth'

// 마이페이지 계열 화면(로그인 필수) 공통 상단 GNB. Home.jsx의 로그인 상태 GNB와 시각적으로 동일하게 맞춘다.
export default function TopNav() {
    const navigate = useNavigate()
    const user = getTokenPayload()

    return (
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
                        className="text-sm font-medium text-slate-600 transition-opacity duration-200 hover:text-blue-500"
                        href="#"
                        onClick={(e) => { e.preventDefault(); navigate('/hotels') }}
                    >
                        호텔찾기
                    </a>
                    <a
                        className="text-sm font-medium text-slate-600 transition-opacity duration-200 hover:text-blue-500"
                        href="#"
                        onClick={(e) => { e.preventDefault(); navigate('/reservations') }}
                    >
                        예약내역
                    </a>
                    <a className="text-sm font-medium text-slate-600 transition-opacity duration-200 hover:text-blue-500" href="#">
                        이용안내
                    </a>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
                        title="알림 (준비 중)"
                        aria-label="알림"
                    >
                        <span className="material-symbols-outlined text-xl">notifications</span>
                    </button>
                    <button
                        className="text-sm font-bold text-slate-700 transition-opacity hover:opacity-70"
                        onClick={() => navigate('/mypage')}
                    >
                        {user?.name} 님
                    </button>
                    <button
                        className="rounded-full px-6 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 transition-all hover:bg-slate-50 active:scale-95"
                        onClick={logout}
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </nav>
    )
}
