export default async function handler(req, res) {
  const { date } = req.query
  const response = await fetch(`${process.env.PERSONAL_API_URL}/mini-crossword?date=${date}`).then(res => res.json())
  res.status(200).json(response)
}
