import fetch from 'node-fetch';

export default async function fillCrosswordHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const words = req.body;

    const response = await fetch(`${process.env.PERSONAL_API_URL}/mini-crossword/fill-clues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(words),
    });

    console.log(`response is: ${JSON.stringify(response)}`)
    const data = await response.json();
    res.status(200).json(data.clues);
  } catch (error) {
    console.error('Error in clue fill handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}