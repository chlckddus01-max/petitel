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