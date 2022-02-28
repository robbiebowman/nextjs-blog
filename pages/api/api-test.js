import useSWR from 'swr';

export default async function handler(req, res) {

  // req = HTTP incoming message, res = HTTP server response
  res.status(200).json({
    data:"Hello Bobby"
  })
}
