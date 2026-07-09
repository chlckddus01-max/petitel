import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authFetch, isLoggedIn, logout, setPostLoginRedirect } from '../utils/auth'
import TopNav from '../components/TopNav'
import MyPageSidebar from '../components/MyPageSidebar'
import ConfirmModal from '../components/ConfirmModal'

export default function ProfileEdit() {
    const navigate = useNavigate()

    const [me, setMe] = useState(null)
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [profileSaving, setProfileSaving] = useState(false)
    const [profileMessage, setProfileMessage] = useState(null)
    const [profileError, setProfileError] = useState(null)

    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [passwordSaving, setPasswordSaving] = useState(false)
    const [passwordError, setPasswordError] = useState(null)

    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const [withdrawError, setWithdrawError] = useState(null)

    useEffect(() => {
        if (!isLoggedIn()) {
            setPostLoginRedirect('/mypage/profile')
            navigate('/login')
            return
        }

        authFetch('/api/users/me')
            .then((res) => res.json())
            .then((data) => {
                setMe(data)
                setName(data.name)
                setPhone(data.phone)
            })
            .catch(() => setProfileError('정보를 불러오지 못했습니다.'))
            .finally(() => setLoading(false))
    }, [navigate])

    async function handleProfileSubmit(e) {
        e.preventDefault()
        setProfileError(null)
        setProfileMessage(null)
        setProfileSaving(true)
        try {
            const res = await authFetch('/api/users/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                setProfileError(data.message || '수정에 실패했습니다.')
                return
            }
            setProfileMessage('저장됐습니다.')
        } catch {
            setProfileError('서버에 연결할 수 없습니다.')
        } finally {
            setProfileSaving(false)
        }
    }

    async function handlePasswordSubmit(e) {
        e.preventDefault()
        setPasswordError(null)
        setPasswordSaving(true)
        try {
            const res = await authFetch('/api/users/me/password', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                setPasswordError(data.message || '비밀번호 변경에 실패했습니다.')
                return
            }
            setCurrentPassword('')
            setNewPassword('')
            setShowPasswordModal(false)
        } catch {
            setPasswordError('서버에 연결할 수 없습니다.')
        } finally {
            setPasswordSaving(false)
        }
    }

    function handleMarketingToggle() {
        const next = !me.marketingAgreed
        setMe((prev) => ({ ...prev, marketingAgreed: next }))
        authFetch('/api/users/me/marketing', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ marketingAgreed: next }),
        }).then((res) => {
            if (!res.ok) setMe((prev) => ({ ...prev, marketingAgreed: !next }))
        })
    }

    async function handleWithdraw() {
        setWithdrawError(null)
        const res = await authFetch('/api/users/me', { method: 'DELETE' })
        if (res.ok) {
            logout()
            return
        }
        const data = await res.json().catch(() => ({}))
        setWithdrawError(data.message || '탈퇴에 실패했습니다.')
        setShowWithdrawModal(false)
    }

    if (!isLoggedIn()) return null

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
            <TopNav />

            <div className="mx-auto flex max-w-7xl gap-6 px-8 pb-20 pt-24">
                <MyPageSidebar active="profile" />

                <main className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold text-slate-900">프로필 수정</h1>

                    {loading && <p className="mt-6 text-sm text-slate-500">불러오는 중...</p>}

                    {me && (
                        <div className="mt-6 max-w-xl rounded-2xl bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                                    {me.name.slice(0, 1)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{me.name}</p>
                                    <p className="text-sm text-slate-400">{me.email}</p>
                                </div>
                            </div>

                            <form onSubmit={handleProfileSubmit} className="mt-6 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500">이름</label>
                                    <input
                                        className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500">이메일</label>
                                    <input
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400"
                                        value={me.email}
                                        disabled
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500">휴대폰 번호</label>
                                    <input
                                        className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>

                                <div className="border-t border-slate-100 pt-4">
                                    {me.provider === 'LOCAL' && (
                                        <button
                                            type="button"
                                            className="flex w-full items-center justify-between py-1 text-left text-sm font-bold text-slate-700"
                                            onClick={() => setShowPasswordModal(true)}
                                        >
                                            비밀번호 변경
                                            <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                                        </button>
                                    )}

                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-700">마케팅 정보 수신</span>
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={me.marketingAgreed}
                                            onClick={handleMarketingToggle}
                                            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${me.marketingAgreed ? 'bg-blue-600' : 'bg-slate-200'}`}
                                        >
                                            <span
                                                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${me.marketingAgreed ? 'translate-x-6' : 'translate-x-1'}`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {profileError && <p className="text-sm text-red-500">{profileError}</p>}
                                {profileMessage && <p className="text-sm text-emerald-600">{profileMessage}</p>}

                                <button
                                    type="submit"
                                    disabled={profileSaving}
                                    className="w-full rounded-full bg-blue-600 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {profileSaving ? '저장 중...' : '저장하기'}
                                </button>
                            </form>

                            <div className="mt-4 text-center">
                                {withdrawError && <p className="mb-2 text-sm text-red-500">{withdrawError}</p>}
                                <button
                                    className="text-sm text-red-500 hover:underline"
                                    onClick={() => setShowWithdrawModal(true)}
                                >
                                    회원 탈퇴
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {showPasswordModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
                    onClick={(e) => e.target === e.currentTarget && setShowPasswordModal(false)}
                >
                    <form onSubmit={handlePasswordSubmit} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                        <h2 className="text-lg font-bold text-slate-900">비밀번호 변경</h2>

                        <div className="mt-4">
                            <label className="text-xs font-bold text-slate-500">현재 비밀번호</label>
                            <input
                                type="password"
                                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="mt-4">
                            <label className="text-xs font-bold text-slate-500">새 비밀번호 (8자 이상)</label>
                            <input
                                type="password"
                                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        {passwordError && <p className="mt-3 text-sm text-red-500">{passwordError}</p>}

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowPasswordModal(false)}
                                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                disabled={passwordSaving}
                                className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                            >
                                {passwordSaving ? '변경 중...' : '변경하기'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showWithdrawModal && (
                <ConfirmModal
                    title="정말 탈퇴하시겠어요?"
                    message="탈퇴 시 계정 정보가 비활성화되며 되돌릴 수 없습니다. 진행 중인 예약이 있으면 탈퇴할 수 없어요."
                    confirmText="탈퇴하기"
                    cancelText="취소"
                    onConfirm={handleWithdraw}
                    onCancel={() => setShowWithdrawModal(false)}
                />
            )}
        </div>
    )
}
