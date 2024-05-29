import { getCookie, hasCookie, setCookie } from 'cookies-next';

const cookiePrefix = "completed-mini-crossword-"

export function setCompleted(dateString) {
    const cookieName = cookiePrefix + "-" + dateString
    if (!hasCookie(cookieName)) {
        setCookie(cookieName, false)
    } else {
        setCookie(cookieName, true)
    }
}

export function hasCompleted(dateString) {
    const cookieName = cookiePrefix + "-" + dateString
    if (!hasCookie(cookieName)) {
        setCookie(cookieName, false)
        return false
    } else {
        return getCookie(cookieName) == true
    }
}
