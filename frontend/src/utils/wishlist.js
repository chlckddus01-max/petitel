import { authFetch } from './auth'

// Hotels/HotelDetail/Home 세 화면에서 동일하게 쓰는 찜 상태 조회/토글 API 래퍼.
export async function fetchWishlistIds() {
    const res = await authFetch('/api/wishlist')
    if (!res.ok) return new Set()
    const hotels = await res.json()
    return new Set(hotels.map((h) => h.id))
}

export function addToWishlist(hotelId) {
    return authFetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotelId }),
    })
}

export function removeFromWishlist(hotelId) {
    return authFetch(`/api/wishlist/${hotelId}`, { method: 'DELETE' })
}