import useSWR from 'swr';

export default async function handler(req, res) {

  const response = await fetch("https://nextjs.org/docs/api-routes/introduction")

  // req = HTTP incoming message, res = HTTP server response
  res.status(200).json({
    response: response
  })
}
