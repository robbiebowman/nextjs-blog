import useSWR from 'swr';

export default async function handler(req, res) {

  const response = await fetch(process.env.PERSONAL_API_URL + "/chess-evals?difficulty=Medium").then(res => res.json())

  console.log(response)
  // req = HTTP incoming message, res = HTTP server response
  res.status(200).json(response)
}
