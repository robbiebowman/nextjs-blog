import { setCookies, checkCookies, getCookie, removeCookies } from 'cookies-next';

const todaysDailyCookieKey = "TodayDaily"
const dailyRecord = "DailyRecord"

export function getTodaysDailyAnswers() {
    return { answers: ["-", "+", "+"], date: "2022-03-08" }
}

export function hasCompletedToday() {
    return true
}

export function saveTodaysDailyAnswers(answers) {

}

export function getAllDailyAnswers() {
    return { Easy: 8, Medium: 3, Hard: 7, streak: 5 }
}

// getDailyCookieValue(getCookie(getDailyCookieKey()))
// setCookies(getDailyCookieKey(), ans, { sameSite: 'lax' });

function getDailyCookieValue(rawString) {
    if (!rawString) return []
    console.log(`String is: ${rawString}`)
    const value = JSON.parse(rawString)
    console.log(`First is: ${value[0]}`)
    console.log(`Second is: ${value[1]}`)
    console.log(`Third is: ${value[2]}`)
    return value
}