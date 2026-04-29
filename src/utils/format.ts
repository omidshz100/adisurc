import { Language } from '../types';

const LOCALE: Record<Language, string> = {
  en: 'en-US',
  it: 'it-IT',
  fa: 'fa-IR',
  ar: 'ar-EG',
};

export function formatDate(lang: Language): string {
  const date = new Date();
  const locale = LOCALE[lang];
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
  const day = new Intl.DateTimeFormat(locale, { day: 'numeric' }).format(date);
  if (lang === 'en') {
    const month = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date);
    return `${weekday.toUpperCase()}, ${month.toUpperCase()} ${day}`;
  }
  if (lang === 'it') {
    const month = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date);
    return `${weekday.toUpperCase()}, ${day} ${month.toUpperCase()}`;
  }
  const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
  return `${weekday}، ${day} ${month}`;
}

export function formatClock(date: Date, lang: Language): string {
  return new Intl.DateTimeFormat(LOCALE[lang], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(date);
}

export function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function formatShortDate(ts: number): string {
  const d = new Date(ts);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

export function getDateKey(ts: number): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatGroupLabel(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = getDateKey(Date.now());
  if (dateKey === today) return `Today · ${days[date.getDay()]} ${months[m - 1]} ${d}`;
  return `${days[date.getDay()]} ${months[m - 1]} ${d}`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
