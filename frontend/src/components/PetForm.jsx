import { useState } from 'react'
import { authFetch } from '../utils/auth'

const SPECIES_OPTIONS = [
    { value: 'DOG', label: '강아지' },
    { value: 'CAT', label: '고양이' },
    { value: 'ETC', label: '기타' },
]

// 마이페이지의 "반려동물 관리"와 예약 화면의 "+ 반려동물 추가"가 공용으로 쓰는 등록 폼.
// 등록에 성공하면 onCreated(방금 만든 pet)만 호출하고, 그걸로 뭘 할지(목록에 추가 / 예약에 바로 선택)는 호출한 쪽이 정한다.
export default function PetForm({ onCreated, onCancel }) {
    const [form, setForm] = useState({
        name: '',
        species: 'DOG',
        breed: '',
        weight: '',
        age: '',
        neutered: false,
        notes: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    function handleChange(e) {
        const { name, value, type, checked } = e.target
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
        setError(null)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const res = await authFetch('/api/pets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    species: form.species,
                    breed: form.breed || null,
                    weight: form.weight === '' ? null : Number(form.weight),
                    age: form.age === '' ? null : Number(form.age),
                    neutered: form.neutered,
                    notes: form.notes || null,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || '반려동물 등록에 실패했습니다.')
                return
            }

            onCreated(data)
        } catch {
            setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700" htmlFor="pet-name">이름</label>
                    <input
                        id="pet-name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700" htmlFor="pet-species">종류</label>
                    <select
                        id="pet-species"
                        name="species"
                        value={form.species}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-500"
                    >
                        {SPECIES_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700" htmlFor="pet-breed">품종</label>
                    <input
                        id="pet-breed"
                        name="breed"
                        value={form.breed}
                        onChange={handleChange}
                        placeholder="선택 입력"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700" htmlFor="pet-age">나이</label>
                    <input
                        id="pet-age"
                        name="age"
                        type="number"
                        min="0"
                        max="30"
                        value={form.age}
                        onChange={handleChange}
                        placeholder="선택 입력"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700" htmlFor="pet-weight">몸무게(kg)</label>
                    <input
                        id="pet-weight"
                        name="weight"
                        type="number"
                        step="0.1"
                        min="0"
                        value={form.weight}
                        onChange={handleChange}
                        placeholder="선택 입력"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-500"
                    />
                </div>
                <div className="flex items-end pb-2.5">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input name="neutered" type="checkbox" checked={form.neutered} onChange={handleChange} />
                        중성화 완료
                    </label>
                </div>
            </div>

            <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700" htmlFor="pet-notes">특이사항</label>
                <textarea
                    id="pet-notes"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={2}
                    placeholder="알레르기, 성격, 건강 상태 등 (선택)"
                    className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-500"
                />
            </div>

            {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                </div>
            )}

            <div className="flex gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
                    >
                        취소
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                >
                    {loading ? '등록 중...' : '반려동물 등록'}
                </button>
            </div>
        </form>
    )
}
