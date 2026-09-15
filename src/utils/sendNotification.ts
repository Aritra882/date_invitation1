import { DateResponse } from '../types';

export async function sendNotification(response: DateResponse) {
  const payload = {
    _subject: '🎉 Srija Confirmed Date Details on Vercel!',
    _captcha: 'false',
    _template: 'table',
    'Recipient Email': 'aritrahazra701@gmail.com',
    'Date Chosen': response.selectedDate,
    'Preferred Time': response.preferredTime || '12:00 PM',
    'Place Chosen': response.place,
    'Sweet Details / Note': response.note || 'None',
    'Confirmed At': new Date().toLocaleString(),
  };

  try {
    // Send email notification to aritrahazra701@gmail.com asynchronously
    fetch('https://formsubmit.co/ajax/aritrahazra701@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch((e) => console.warn('FormSubmit background notification error:', e));

    // Also notify Vercel serverless endpoint as backup
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response),
    }).catch(() => {});
  } catch (err) {
    console.warn('Notification error:', err);
  }
}
