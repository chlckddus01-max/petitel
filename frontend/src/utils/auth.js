const POST_LOGIN_REDIRECT_KEY = 'postLoginRedirect'

export function isLoggedIn() {
    return !!localStorage.getItem('accessToken')
}

export function setPostLoginRedirect(path) {
    localStorage.setItem(POST_LOGIN_REDIRECT_KEY, path)
}

export function consumePostLoginRedirect() {
    const path = localStorage.getItem(POST_LOGIN_REDIRECT_KEY)
    localStorage.removeItem(POST_LOGIN_REDIRECT_KEY)
    return path
}

// JWT의 payload(email/name)만 화면 표시용으로 디코딩한다. 서명 검증은 하지 않는다 — 이건 백엔드가
// 매 요청마다 이미 하고 있고, 여기서는 그냥 로그인된 사용자 이름 등을 보여주는 용도라 서명까지 볼 필요가 없다.
export function getTokenPayload() {
    const token = localStorage.getItem('accessToken')
    if (!token) return null
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
        const json = decodeURIComponent(
            atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        )
        return JSON.parse(json)
    } catch {
        return null
    }
}

// accessToken을 Authorization 헤더에 자동으로 실어주는 fetch. 로그인 필요한 API(반려동물, 예약 등)에서 공용으로 쓴다.
export function authFetch(url, options = {}) {
    const token = localStorage.getItem('accessToken')
    return fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    })
}