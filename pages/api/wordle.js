import useSWR from 'swr';


export default async function handler(req, res) {

  const response = await fetch("http://localhost:8080/wordle?guesses=&results=&hardMode=false").then(res => res.json())

  
  // req = HTTP incoming message, res = HTTP server response
  res.status(200).json(response)

}
