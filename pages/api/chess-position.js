import useSWR from 'swr';

export default async function handler(req, res) {
  const { difficulty } = req.query
  const response = await fetch(`${process.env.PERSONAL_API_URL}/chess-evals?difficulty=${difficulty}`).then(res => res.json())

  console.log(response)
  // req = HTTP incoming message, res = HTTP server response
  setTimeout(() => {

    res.status(200).json(response)
  }, 2000)
}
