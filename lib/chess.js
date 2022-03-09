export async function loadNewRandomPuzzle(difficulty) {
    return fetch("/api/chess-position?difficulty=" + difficulty).then(res => res.json())
}

export async function loadDailyPuzzle(day, month, difficulty) {
    return fetch(`/api/chess-daily?day=${day}&month=${month}&difficulty=${difficulty}`).then(res => res.json())
}


export function isCorrect(evaluation, answer) {
    const wasMate = evaluation[0] == '#'
    var wasCorrect
    if (wasMate) {
        wasCorrect = answer == evaluation[1]
    } else {
        wasCorrect = (answer == "+" && evaluation > 0) || (answer == "-" && evaluation < 0) || (answer == "=" && evaluation == 0)
    }
    return wasCorrect
}

export function getDailyNumber() {
    const firstEverPuzzle = new Date(2022, 2, 7)
    const today = new Date()
    return Math.floor((today.getTime() - firstEverPuzzle.getTime()) / (1000 * 60 * 60 * 24)) + 1
}

export function getDailyCookieKey() {
    return `Day${getDailyNumber()}`
}

export function getDailyCookieValue(rawString) {
    if (!rawString) return []
    console.log(`String is: ${rawString}`)
    const value = JSON.parse(rawString)
    console.log(`First is: ${value[0]}`)
    console.log(`Second is: ${value[1]}`)
    console.log(`Third is: ${value[2]}`)
    return value
}