export default async function handler(req, res) {
  const { date } = req.query
  const url = `${process.env.PERSONAL_API_URL}/title-game?date=${date}`
  const response = await fetch(url).then(res => {
    return res.json()
  })
  res.status(200).json(response)
}
