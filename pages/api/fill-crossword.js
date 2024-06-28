import fetch from 'node-fetch';

export default async function fillCrosswordHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const puzzleGrid = req.body;

    if (!Array.isArray(puzzleGrid) || puzzleGrid.length === 0 || !puzzleGrid.every(row => Array.isArray(row))) {
      return res.status(400).json({ error: 'Invalid puzzle grid format' });
    }

    const response = await fetch(`${process.env.PERSONAL_API_URL}/mini-crossword/fill`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(puzzleGrid),
    });

    if (!response.ok || response.status == '204') {
      return res.status(response.status).json({});
    }

    const data = await response.json();
    const mappedPuzzle = data.filledPuzzle?.map(row => row.map(c => c == ' ' ? '#' : c))
    const newData = { ...data, filledPuzzle: mappedPuzzle }
    res.status(200).json(newData);
  } catch (error) {
    console.error('Error in crossword fill handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}