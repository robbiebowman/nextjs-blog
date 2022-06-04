import useSWR from 'swr';

export default async function handler(req, res) {
  console.log("Requesting some wordle answers")
  const { hardMode, guesses, results } = req.query
  console.log(`${JSON.stringify(req.query)}, results: ${results}, guesses:${guesses}, hardMode: ${hardMode}`)
  const response = await fetch(`${process.env.PERSONAL_API_URL}/wordle?guesses=${guesses}&results=${results}&hardMode=${hardMode}`).then(res => res.json())
  console.log(`Response: ${JSON.stringify(response)}`)
  
  // req = HTTP incoming message, res = HTTP server response
  res.status(200).json(response)
}
