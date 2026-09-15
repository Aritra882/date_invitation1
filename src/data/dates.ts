import { AllowedDate } from '../types';

export const MIN_DATE_STR = '2026-09-26';
export const MAX_DATE_STR = '2026-10-09';

export function getAllowedDates(): AllowedDate[] {
  const dates: AllowedDate[] = [];
  const current = new Date(2026, 8, 26); // Sept 26, 2026 (month is 0-indexed: 8 = Sept)
  const end = new Date(2026, 9, 9); // Oct 9, 2026 (month 9 = Oct)

  while (current <= end) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const dayOfWeek = current.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = current.toLocaleDateString('en-US', { month: 'short' });
    const dayNumber = current.getDate();
    const isWeekend = current.getDay() === 0 || current.getDay() === 6;

    dates.push({
      dateString,
      displayDate: `${dayOfWeek}, ${monthName} ${dayNumber}`,
      dayOfWeek,
      dayNumber,
      monthName,
      isWeekend,
    });

    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export interface RomanticGifPreset {
  id: string;
  name: string;
  url: string;
  tagline: string;
}

export const PINTEREST_PIN_IMAGE = 'https://i.pinimg.com/originals/9c/41/96/9c419620fb275cf5ab408b6485d438e5.jpg';

export const GIF_PRESETS: RomanticGifPreset[] = [
  {
    id: 'pinterest-date-couples',
    name: 'Romantic Date Graphic (Pinterest)',
    url: 'https://i.pinimg.com/originals/9c/41/96/9c419620fb275cf5ab408b6485d438e5.jpg',
    tagline: 'Sweet couple date illustration',
  },
  {
    id: 'peach-flowers',
    name: 'Peach Bear with Flower',
    url: 'https://media.giphy.com/media/L4lvBzeiy0z6w/giphy.gif',
    tagline: 'Sweet shy bear offering a flower',
  },
  {
    id: 'shy-bunny',
    name: 'Shy Cute Bunny',
    url: 'https://media.giphy.com/media/26FLdmIp6wJr91JAI/giphy.gif',
    tagline: 'Gentle blush & shy wave',
  },
  {
    id: 'bubu-dudu-hugs',
    name: 'Bubu & Dudu Sweetness',
    url: 'https://media.giphy.com/media/cMhPpDTQnk0eZDQiZk/giphy.gif',
    tagline: 'Cozy and adorable',
  },
  {
    id: 'cute-shy-cat',
    name: 'Peeking Kitten',
    url: 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif',
    tagline: 'Wide curious eyes',
  },
];

export const CELEBRATION_GIF = 'https://media.giphy.com/media/M90mJvfWfd5mbUuULX/giphy.gif';

export const PLACE_SUGGESTIONS = [
  'A cozy quiet cafe with good matcha or pastries ☕',
  'A sunset stroll & ice cream by the waterfront 🍦🌅',
  'An aesthetic bookstore + coffee date 📚✨',
  'That little Italian or ramen spot we talked about 🍝',
  'A surprise picnic in a peaceful park 🧺🍓',
  'Any cozy corner where we can talk for hours 🛋️',
];
