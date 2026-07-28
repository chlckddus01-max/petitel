import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { DayPicker } from 'react-day-picker'
import { ko } from 'react-day-picker/locale'
import 'react-day-picker/style.css'
import { authFetch, isLoggedIn, setPostLoginRedirect } from '../utils/auth'
import PetForm from '../components/PetForm'

function formatDateRange(range) {
    if (!range?.from) return '날짜 선택'
    const fmt = (d) => `${d.getMonth() + 1}/${d.getDate()}`
    return range.to ? `${fmt(range.from)} - ${fmt(range.to)}` : fmt(range.from)
}

function nightsOf(range) {
    if (!range?.from || !range?.to) return 0
    return Math.round((range.to - range.from) / (1000 * 60 * 60 * 24))
}

function toDateParam(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

export default function ReservationNew() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const hotelId = searchParams.get('hotelId')

    const [hotel, setHotel] = useState(null)
    const [loading, setLoading] = useState(true)
    const [pets, setPets] = useState([])
    const [selectedRoomId, setSelectedRoomId] = useState(null)
    const [selectedPetIds, setSelectedPetIds] = useState([])
    const [dateRange, setDateRange] = useState(undefined)
    const [showCalendar, setShowCalendar] = useState(false)
    const [showPetForm, setShowPetForm] = useState(false)
    const [requestNote, setRequestNote] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [notFound, setNotFound] = useState(false)
    const calendarRef = useRef(null)

    useEffect(() => {
        if (!isLoggedIn()) {
            setPostLoginRedirect(`/reservations/new?hotelId=${hotelId}`)
            navigate('/login')
            return
        }
        if (!hotelId) {
            navigate('/hotels')
            return
        }

        Promise.all([
            fetch(`/api/hotels/${hotelId}`).then((res) => {
                if (!res.ok) throw { notFound: true }
                return res.json()
            }),
            authFetch('/api/pets').then((res) => {
                if (!res.ok) throw new Error('pets fetch failed')
                return res.json()
            }),
        ])
            .then(([hotelData, petsData]) => {
                setHotel(hotelData)
                setPets(petsData)
                if (hotelData.rooms?.length > 0) setSelectedRoomId(hotelData.rooms[0].id)
            })
            .catch((err) => {
                if (err?.notFound) {
                    setNotFound(true)
                    return
                }
                setError('예약 정보를 불러오지 못했습니다.')
            })
            .finally(() => setLoading(false))
    }, [hotelId, navigate])

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

    function togglePet(petId) {
        setSelectedPetIds((prev) =>
            prev.includes(petId) ? prev.filter((id) => id !== petId) : [...prev, petId]
        )
    }

    function handlePetCreated(pet) {
        setPets((prev) => [pet, ...prev])
        setSelectedPetIds((prev) => [...prev, pet.id])
        setShowPetForm(false)
    }

    const selectedRoom = hotel?.rooms.find((r) => r.id === selectedRoomId)
    const nights = nightsOf(dateRange)
    const totalPrice = selectedRoom && nights > 0 ? selectedRoom.pricePerNight * nights : 0

    const canSubmit = selectedRoomId && dateRange?.from && dateRange?.to && selectedPetIds.length > 0 && !submitting

    async function handleSubmit() {
        setSubmitting(true)
        setError(null)
        try {
            const res = await authFetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomId: selectedRoomId,
                    checkIn: toDateParam(dateRange.from),
                    checkOut: toDateParam(dateRange.to),
                    petIds: selectedPetIds,
                    requestNote: requestNote || null,
                }),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.message || '예약에 실패했습니다.')
                return
            }
            navigate('/reservations')
        } catch {
            setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white text-slate-800">
                <p className="text-sm text-slate-500">불러오는 중...</p>
            </div>
        )
    }

    if (notFound) {
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

    if (!hotel) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-slate-800">
                <p className="text-sm text-slate-500">{error || '예약 정보를 불러오지 못했습니다.'}</p>
                <button
                    className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white"
                    onClick={() => navigate('/hotels')}
                >
                    호텔 목록으로
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
            <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
                <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100"
                        onClick={() => navigate(`/hotels/${hotelId}`)}
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold">예약하기</h1>
                    <div className="w-10" />
                </div>
            </nav>

            <main className="mx-auto max-w-3xl px-6 pb-32 pt-24">
                <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">{hotel.address}</p>
                    <h2 className="mt-1 text-xl font-bold">{hotel.name}</h2>
                </section>

                <section className="mt-8">
                    <h3 className="text-lg font-bold">객실 선택</h3>
                    <div className="mt-4 space-y-3">
                        {hotel.rooms.map((room) => (
                            <button
                                key={room.id}
                                type="button"
                                onClick={() => setSelectedRoomId(room.id)}
                                className={
                                    room.id === selectedRoomId
                                        ? 'flex w-full items-center gap-4 rounded-2xl border-2 border-blue-500 bg-blue-50 p-4 text-left'
                                        : 'flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 text-left transition-colors hover:border-blue-200'
                                }
                            >
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900">{room.name}</h4>
                                    <p className="mt-1 text-xs text-slate-500">최대 {room.maxPets}마리 동반 가능</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-bold text-blue-600">
                                        {room.pricePerNight.toLocaleString()}
                                    </span>{' '}
                                    <span className="text-xs font-bold text-blue-600">KRW</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="mt-8">
                    <h3 className="text-lg font-bold">체크인 · 체크아웃</h3>
                    <div className="relative mt-4" ref={calendarRef}>
                        <button
                            type="button"
                            className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700"
                            onClick={() => setShowCalendar((prev) => !prev)}
                        >
                            <span className="material-symbols-outlined text-lg text-blue-600">calendar_month</span>
                            {formatDateRange(dateRange)}
                            {nights > 0 && <span className="ml-auto text-slate-500">{nights}박</span>}
                        </button>

                        {showCalendar && (
                            <div className="absolute left-0 top-full z-20 mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                                <DayPicker
                                    mode="range"
                                    locale={ko}
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    disabled={{ before: new Date() }}
                                />
                                <div className="mt-2 flex justify-end">
                                    <button
                                        type="button"
                                        className="rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white"
                                        onClick={() => setShowCalendar(false)}
                                    >
                                        적용
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <section className="mt-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">반려동물 선택</h3>
                        {!showPetForm && (
                            <button
                                type="button"
                                className="flex items-center gap-1 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600 transition-colors hover:bg-blue-100"
                                onClick={() => setShowPetForm(true)}
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                반려동물 추가
                            </button>
                        )}
                    </div>

                    {showPetForm && (
                        <div className="mt-4">
                            <PetForm onCreated={handlePetCreated} onCancel={() => setShowPetForm(false)} />
                        </div>
                    )}

                    {!showPetForm && pets.length === 0 && (
                        <p className="mt-4 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                            등록된 반려동물이 없습니다. 위의 "반려동물 추가"로 먼저 등록해주세요.
                        </p>
                    )}

                    <div className="mt-4 space-y-3">
                        {pets.map((pet) => {
                            const selected = selectedPetIds.includes(pet.id)
                            return (
                                <button
                                    key={pet.id}
                                    type="button"
                                    onClick={() => togglePet(pet.id)}
                                    className={
                                        selected
                                            ? 'flex w-full items-center gap-4 rounded-2xl border-2 border-blue-500 bg-blue-50 p-4 text-left'
                                            : 'flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 text-left transition-colors hover:border-blue-200'
                                    }
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                        <span className="material-symbols-outlined text-lg">pets</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900">{pet.name}</h4>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {[pet.breed, pet.age != null ? `${pet.age}살` : null].filter(Boolean).join(' · ') || '정보 없음'}
                                        </p>
                                    </div>
                                    <span
                                        className={
                                            selected
                                                ? 'material-symbols-outlined text-blue-600'
                                                : 'material-symbols-outlined text-slate-300'
                                        }
                                        style={selected ? { fontVariationSettings: "'FILL' 1" } : undefined}
                                    >
                                        check_circle
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </section>

                <section className="mt-8">
                    <h3 className="text-lg font-bold">요청사항</h3>
                    <textarea
                        value={requestNote}
                        onChange={(e) => setRequestNote(e.target.value)}
                        rows={3}
                        placeholder="숙소에 전달할 요청사항이 있다면 입력해주세요 (선택)"
                        className="mt-4 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500"
                    />
                </section>

                {error && (
                    <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                        {error}
                    </div>
                )}
            </main>

            <div className="fixed bottom-0 left-0 right-0 border-t border-slate-100 bg-white/95 px-6 py-4 backdrop-blur-md">
                <div className="mx-auto flex max-w-3xl items-center gap-4">
                    <div className="flex-1">
                        <span className="text-xs text-slate-500">총 {nights > 0 ? `${nights}박` : '-'}</span>
                        <div>
                            <span className="text-xl font-bold text-blue-600">{totalPrice.toLocaleString()}</span>{' '}
                            <span className="text-xs font-bold text-blue-600">KRW</span>
                        </div>
                    </div>
                    <button
                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 py-4 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                    >
                        {submitting ? '예약 중...' : '예약 확정하기'}
                    </button>
                </div>
            </div>
        </div>
    )
}
