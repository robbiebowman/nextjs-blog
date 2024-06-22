
export const getPuzzleId = (puzzle) => {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(JSON.stringify(puzzle)).digest('hex')
}