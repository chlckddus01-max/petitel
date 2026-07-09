import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { consumePostLoginRedirect } from '../utils/auth'

export default function Login() {
    const navigate = useNavigate()

    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    function handleChange(e) {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
        setError(null)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || '로그인에 실패했습니다.')
                return
            }

            localStorage.setItem('accessToken', data.accessToken)
            navigate(consumePostLoginRedirect() || '/')
        } catch {
            setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.')
        } finally {
            setLoading(false)
        }
    }

    function loginWithKakao() {
        const forceLogin = localStorage.getItem('kakao_force_login') === 'true';
        localStorage.removeItem('kakao_force_login');
        // Vercel 프록시(상대경로)를 거치면 인가 요청 쿠키가 petitel.vercel.app에 저장되는데,
        // 카카오 콜백은 Railway 도메인으로 직접 오기 때문에 그 쿠키가 전달이 안 된다.
        // 그래서 처음부터 백엔드 도메인으로 직접 이동시켜 전체 흐름을 한 도메인 안에서 끝낸다.
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
        window.location.href = backendUrl + "/oauth2/authorization/kakao" + (forceLogin ? "?prompt_login=true" : "");
    }

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
                            className="text-sm font-medium text-slate-600 transition-opacity duration-200 hover:text-blue-500 active:scale-95"
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
                    </div>
                </div>
            </nav>

            <main className="flex min-h-screen items-center justify-center px-6 pt-16">
                <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">
                    <h1 className="text-center text-2xl font-bold text-slate-900">다시 만나 반가워요</h1>
                    <p className="mt-2 text-center text-sm text-slate-500">
                        프리미엄 펫케어 서비스, 펫티텔에 오신 것을 환영합니다
                    </p>

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-slate-700" htmlFor="email">
                                이메일
                            </label>
                            <input
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500"
                                id="email"
                                name="email"
                                type="email"
                                placeholder="example@petitel.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-slate-700" htmlFor="password">
                                비밀번호
                            </label>
                            <input
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500"
                                id="password"
                                name="password"
                                type="password"
                                placeholder="비밀번호 입력"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                {error}
                            </div>
                        )}

                        <button
                            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? '로그인 중...' : '로그인'}
                        </button>

                        <div className="flex items-center gap-3 py-1">
                            <div className="h-px flex-1 bg-slate-200" />
                            <span className="text-xs text-slate-400">또는 소셜 계정으로 로그인</span>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <button
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] py-3.5 text-sm font-bold text-[#3C1E1E] transition-opacity hover:opacity-90"
                            type="button"
                            onClick={loginWithKakao}
                        >
                            <span className="material-symbols-outlined text-lg">chat_bubble</span>
                            카카오로 로그인
                        </button>

                        <p className="pt-2 text-center text-sm text-slate-500">
                            계정이 없으신가요?{' '}
                            <button
                                className="font-bold text-blue-600 hover:underline"
                                type="button"
                                onClick={() => navigate('/signup')}
                            >
                                회원가입
                            </button>
                        </p>
                    </form>
                </div>
            </main>
        </div>
    )
}