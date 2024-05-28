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
    console.log(`Cookie called: ${cookieName}`)
    if (!hasCookie(cookieName)) {
        setCookie(cookieName, false)
        console.log(`Cookie returning false`)
        return false
    } else {
        console.log(`Cookie value: ${getCookie(cookieName) == true}`)
        return getCookie(cookieName) == true
    }
}
