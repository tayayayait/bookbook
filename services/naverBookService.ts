import { Book } from '../types';

const NAVER_BOOK_ENDPOINT = '/naver/v1/search/book.json';
const PLACEHOLDER_COVER = 'https://dummyimage.com/200x300/e7e5e4/78716c&text=No+Cover';

interface NaverBookItem {
  title: string;
  link: string;
  image: string;
  author: string;
  discount: string;
  publisher: string;
  isbn: string;
  description: string;
  pubdate: string;
}

interface NaverBookResponse {
  total: number;
  start: number;
  display: number;
  items: NaverBookItem[];
}

const stripTags = (value: string) => value.replace(/<[^>]*>/g, '');

const decodeHtml = (value: string) => {
  if (typeof document === 'undefined') return value;
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
};

const cleanText = (value: string) => decodeHtml(stripTags(value ?? '').trim());

const parseIsbn = (raw: string) => {
  const parts = raw
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean);
  const isbn13 = parts.find((part) => part.length === 13) ?? '';
  const isbn10 = parts.find((part) => part.length === 10) ?? '';
  return { isbn13, isbn10, raw };
};

const toStableId = (isbn: string, title: string, publisher: string) => {
  if (isbn) return `naver_${isbn}`;
  const base = `${title}|${publisher}`.replace(/\s+/g, '-').toLowerCase();
  return `naver_${encodeURIComponent(base)}`;
};

export const searchNaverBooks = async (
  query: string,
  display = 10,
  start = 1
): Promise<Book[]> => {
  const url = `${NAVER_BOOK_ENDPOINT}?query=${encodeURIComponent(query)}&display=${display}&start=${start}`;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Naver book API error: ${response.status}`);
  }

  const data = (await response.json()) as NaverBookResponse;
  return (data.items ?? []).map((item) => {
    const title = cleanText(item.title);
    const author = cleanText(item.author) || '미상';
    const publisher = cleanText(item.publisher) || '미상';
    const description = cleanText(item.description);
    const { isbn13, isbn10, raw } = parseIsbn(item.isbn ?? '');
    const isbn = isbn13 || isbn10 || raw;

    return {
      id: toStableId(isbn, title, publisher),
      isbn,
      title,
      author,
      publisher,
      coverUrl: item.image || PLACEHOLDER_COVER,
      description,
      currentTemperature: 0,
      accumulatedTemperature: 0,
      temperature: 0,
      lastActiveAt: new Date(0).toISOString(),
      totalReviews: 0
    };
  });
};
