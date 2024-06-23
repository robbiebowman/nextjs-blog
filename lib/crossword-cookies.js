import { getCookie, hasCookie, setCookie } from 'cookies-next';

const completedCookiePrefix = "completed-mini-crossword-"

export function setCompleted(dateString) {
    const cookieName = completedCookiePrefix + "-" + dateString
    if (!hasCookie(cookieName)) {
        setCookie(cookieName, false)
    } else {
        setCookie(cookieName, true)
    }
}

export function hasCompleted(dateString) {
    const cookieName = completedCookiePrefix + "-" + dateString
    if (!hasCookie(cookieName)) {
        setCookie(cookieName, false)
        return false
    } else {
        return getCookie(cookieName) == true
    }
}

const progressCookiePrefix = "progress-mini-crossword"

export function getGridProgress(puzzleId) {
    const cookieName = progressCookiePrefix + "-" + puzzleId
    if (!hasCookie(cookieName)) {
        return null
    } else {
        return getCookie(cookieName)
    }
}
export function setGridProgress(puzzleId, grid) {
    const cookieName = progressCookiePrefix + "-" + puzzleId
    setCookie(cookieName, grid)
}
