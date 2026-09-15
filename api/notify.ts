export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { selectedDate, place, preferredTime, note } = req.body || {};

  try {
    const response = await fetch('https://formsubmit.co/ajax/aritrahazra701@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: '🎉 Srija Confirmed Date Details on Vercel!',
        'Date Chosen': selectedDate,
        'Preferred Time': preferredTime || '12:00 PM',
        'Place Chosen': place,
        'Sweet Details / Note': note || 'None',
        'Submitted At': new Date().toISOString(),
      }),
    });

    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
