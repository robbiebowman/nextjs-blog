import fetch from 'node-fetch';

export default async function fillCrosswordHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const response = await fetch(`${process.env.PERSONAL_API_URL}/mini-crossword/create-custom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ puzzle: req.body.puzzle, clues: req.body.clues }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in crossword fill handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}