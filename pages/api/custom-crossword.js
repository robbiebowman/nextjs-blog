export default async function handler(req, res) {
  const { id } = req.query
  const response = await fetch(`${process.env.PERSONAL_API_URL}/mini-crossword?id=${id}`).then(res => res.json())
  res.status(200).json(response)
}
