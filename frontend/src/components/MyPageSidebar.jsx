import { useNavigate } from 'react-router-dom'
import { getTokenPayload, logout } from '../utils/auth'

const MENU_ITEMS = [
    { key: 'home', icon: 'dashboard', label: '마이페이지 홈', path: '/mypage' },
    { key: 'reservations', icon: 'calendar_month', label: '예약내역', path: '/reservations' },
    { key: 'pets', icon: 'pets', label: '반려동물 관리', path: '/mypage/pets' },
    { key: 'wishlist', icon: 'favorite', label: '찜한 호텔', path: '/mypage/wishlist' },
    { key: 'reviews', icon: 'edit_note', label: '내가 쓴 리뷰', path: '/mypage/reviews' },
    { key: 'profile', icon: 'person', label: '프로필 수정', path: '/mypage/profile' },
]

// 마이페이지 계열 화면 전부에서 공유하는 왼쪽 고정 사이드바. active로 현재 위치를 강조 표시한다.
export default function MyPageSidebar({ active }) {
    const navigate = useNavigate()
    const user = getTokenPayload()
    const initial = user?.name ? user.name.slice(0, 1) : '?'

    return (
        <aside className="w-60 shrink-0">
            <div className="flex items-center gap-3 rounded-2xl bg-white p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                    {initial}
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{user?.name} 님</p>
                    <p className="truncate text-xs text-slate-400">{user?.email}</p>
                </div>
            </div>

            <nav className="mt-2 rounded-2xl bg-white p-2">
                {MENU_ITEMS.map((item) => (
                    <button
                        key={item.key}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition-colors ${
                            active === item.key ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                        onClick={() => navigate(item.path)}
                    >
                        <span className="material-symbols-outlined text-xl">{item.icon}</span>
                        {item.label}
                    </button>
                ))}

                <div className="my-2 border-t border-slate-100" />

                <button
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-red-500 transition-colors hover:bg-red-50"
                    onClick={logout}
                >
                    <span className="material-symbols-outlined text-xl">logout</span>
                    로그아웃
                </button>
            </nav>
        </aside>
    )
}
