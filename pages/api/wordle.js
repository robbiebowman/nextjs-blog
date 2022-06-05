import useSWR from 'swr';

export default async function handler(req, res) {
  const { hardMode, guesses, results } = req.query

  try {
    const response = await fetch(`${process.env.PERSONAL_API_URL}/wordle?guesses=${guesses}&results=${results}&hardMode=${hardMode}`)
      .then(r => {
        console.log(`Response is ${r.status}`)
        if (r.status >= 400) {
          throw new Error()
        } else {
          return r.json()
        }
      })
  
    res.status(200).json(response)
  } catch (error) {
    res.status(400).send("Couldn't find a valid answer")
  }
}
