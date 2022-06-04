import useSWR from 'swr';

export default async function handler(req, res) {
  const { hardMode, guesses, results } = req.query

  const response = await fetch(`${process.env.PERSONAL_API_URL}/wordle?guesses=${guesses}&results=${results}&hardMode=${hardMode}`)
    .then(r => { if (r.status >= 400) { 
      throw "Couldn't find a valid answer"
    } else { 
      return r.json() 
    } })
    .catch(error => res.status(400).json({ error }))

  res.status(200).json(response)
}
