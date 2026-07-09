import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authFetch, isLoggedIn, setPostLoginRedirect } from '../utils/auth'
import TopNav from '../components/TopNav'
import MyPageSidebar from '../components/MyPageSidebar'
import PetForm from '../components/PetForm'

const SPECIES_LABEL = { DOG: '강아지', CAT: '고양이', ETC: '기타' }

export default function Pets() {
    const navigate = useNavigate()

    const [pets, setPets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!isLoggedIn()) {
            setPostLoginRedirect('/mypage/pets')
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
            <TopNav />

            <div className="mx-auto flex max-w-7xl gap-6 px-8 pb-20 pt-24">
                <MyPageSidebar active="pets" />

                <main className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold text-slate-900">반려동물 관리</h1>
                    <p className="mt-1 text-sm text-slate-500">총 {pets.length}마리</p>

                    <div className="mt-6 flex gap-6">
                        <div className="min-w-0 flex-1">
                            {loading && <p className="text-sm text-slate-500">불러오는 중...</p>}
                            {error && <p className="text-sm text-red-500">{error}</p>}

                            <div className="flex flex-wrap gap-4">
                                {pets.map((pet) => (
                                    <div
                                        key={pet.id}
                                        className="flex w-64 items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"
                                    >
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                            <span className="material-symbols-outlined">pets</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-bold text-slate-900">
                                                {pet.name} · {pet.breed || SPECIES_LABEL[pet.species]}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                {[pet.age != null ? `${pet.age}세` : null, pet.weight != null ? `${pet.weight}kg` : null]
                                                    .filter(Boolean)
                                                    .join(' · ') || '추가 정보 없음'}
                                            </p>
                                        </div>
                                        <button
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                                            onClick={() => handleDelete(pet)}
                                            aria-label={`${pet.name} 삭제`}
                                        >
                                            <span className="material-symbols-outlined text-lg">close</span>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {!loading && !error && pets.length === 0 && (
                                <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                                    등록된 반려동물이 없습니다. 오른쪽에서 먼저 등록해주세요.
                                </p>
                            )}
                        </div>

                        <div className="w-80 shrink-0">
                            <h2 className="mb-3 font-bold text-slate-900">반려동물 등록</h2>
                            <PetForm onCreated={handleCreated} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
