import { setCookies, checkCookies, getCookie, removeCookies } from 'cookies-next';

const todaysDailyAnswersKey = "TodayDaily" // ["-", "+", "+"]
const lastDailyDateKey = "LastDailyDate" // "2022-03-08"
const dailyRecordKey = "DailyRecord" // { Easy: 8, Medium: 3, Hard: 7, streak: 5 }
const cookieOptions = { sameSite: 'lax' }

export function getLastDailyAnswers() {
    if (!checkCookies(todaysDailyAnswersKey)) {
        return null
    }
    const answers = JSON.parse(getCookie(todaysDailyAnswersKey))
    return answers
}

export function hasCompletedToday() {
    if (!checkCookies(lastDailyDateKey)) return false
    const lastDaily = getCookie(lastDailyDateKey)
    return lastDaily == getFormattedDate(new Date())
}

export function saveTodaysDailyAnswers(answers, correct) {
    if (hasCompletedToday()) return
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    const dailyRecords = getAllDailyAnswers() || { Easy: 0, Medium: 0, Hard: 0, streak: 1 }
    if (correct[0]) dailyRecords.Easy += 1
    if (correct[1]) dailyRecords.Medium += 1
    if (correct[2]) dailyRecords.Hard += 1
    
    const yesterdaysDaily = getLastDailyAnswers() // Called before we overwrite with today's answers, therefore yesterday's
    if (yesterdaysDaily && getFormattedDate(yesterday) == yesterdaysDaily.date) dailyRecords.streak += 1
    setCookies(dailyRecordKey, JSON.stringify(dailyRecords), cookieOptions)

    const lastCompletedDate = getFormattedDate(new Date())
    setCookies(lastDailyDateKey, lastCompletedDate, cookieOptions)

    setCookies(todaysDailyAnswersKey, answers, cookieOptions)
}

export function getAllDailyAnswers() {
    if (!checkCookies(dailyRecordKey)) return { Easy: 0, Medium: 0, Hard: 0, streak: 1 }
    const dailyRecord = getCookie(dailyRecordKey);
    console.log(dailyRecord)
    return JSON.parse(dailyRecord)
}

function getFormattedDate(date) {
    console.log(`Date is ${date}`)
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}