import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authFetch, getTokenPayload, isLoggedIn, setPostLoginRedirect } from '../utils/auth'
import PetForm from '../components/PetForm'

const SPECIES_LABEL = { DOG: '강아지', CAT: '고양이', ETC: '기타' }

export default function MyPage() {
    const navigate = useNavigate()
    const user = getTokenPayload()

    const [pets, setPets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        if (!isLoggedIn()) {
            setPostLoginRedirect('/mypage')
            navigate('/login')
            return
        }

        authFetch('/api/pets')
            .then((res) => res.json())
            .then(setPets)
            .catch(() => setError('반려동물 목록을 불러오지 못했습니다.'))
            .finally(() => setLoading(false))
    }, [navigate])

    function handleCreated(pet) {
        setPets((prev) => [pet, ...prev])
        setShowForm(false)
    }

    async function handleDelete(pet) {
        if (!window.confirm(`${pet.name}을(를) 삭제할까요?`)) return
        const res = await authFetch(`/api/pets/${pet.id}`, { method: 'DELETE' })
        if (res.ok) {
            setPets((prev) => prev.filter((p) => p.id !== pet.id))
        }
    }

    if (!isLoggedIn()) return null

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
            <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
                <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100"
                        onClick={() => navigate('/')}
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold">마이페이지</h1>
                    <div className="w-10" />
                </div>
            </nav>

            <main className="mx-auto max-w-3xl px-6 pb-20 pt-24">
                <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">안녕하세요</p>
                    <h2 className="mt-1 text-xl font-bold">{user?.name} 님</h2>
                    <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
                </section>

                <section className="mt-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold">반려동물 관리</h3>
                            <p className="mt-0.5 text-xs text-slate-500">등록해두면 예약할 때 바로 선택할 수 있어요</p>
                        </div>
                        {!showForm && (
                            <button
                                className="flex items-center gap-1 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600 transition-colors hover:bg-blue-100"
                                onClick={() => setShowForm(true)}
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                반려동물 추가
                            </button>
                        )}
                    </div>

                    {showForm && (
                        <div className="mt-4">
                            <PetForm onCreated={handleCreated} onCancel={() => setShowForm(false)} />
                        </div>
                    )}

                    {loading && <p className="mt-6 text-sm text-slate-500">불러오는 중...</p>}
                    {error && <p className="mt-6 text-sm text-red-500">{error}</p>}

                    {!loading && !error && pets.length === 0 && !showForm && (
                        <p className="mt-6 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                            등록된 반려동물이 없습니다. 예약하려면 먼저 반려동물을 등록해주세요.
                        </p>
                    )}

                    <div className="mt-4 space-y-3">
                        {pets.map((pet) => (
                            <div
                                key={pet.id}
                                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                    <span className="material-symbols-outlined">pets</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-900">{pet.name}</h4>
                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                                            {SPECIES_LABEL[pet.species] || pet.species}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {[pet.breed, pet.age != null ? `${pet.age}살` : null, pet.weight != null ? `${pet.weight}kg` : null]
                                            .filter(Boolean)
                                            .join(' · ') || '추가 정보 없음'}
                                    </p>
                                </div>
                                <button
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                    onClick={() => handleDelete(pet)}
                                    aria-label={`${pet.name} 삭제`}
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}
