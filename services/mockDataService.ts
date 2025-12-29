import { Book, Review, User } from '../types';
import { searchNaverBooks } from './naverBookService';

const STORAGE_KEY_BOOKS = 'ondo_books';
const STORAGE_KEY_REVIEWS = 'ondo_reviews';
const STORAGE_KEY_EVENTS = 'ondo_events';

const TEMP_INCREMENT = 1.5;
const TEMP_DECAY_PER_DAY = 0.4;
const DECAY_CHECK_INTERVAL_DAYS = 1;

const DAY_MS = 24 * 60 * 60 * 1000;
const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * DAY_MS).toISOString();

const SEED_BOOKS: Book[] = [
  {
    id: 'seed_1',
    isbn: 'SEED-001',
    title: 'Sample Book One',
    author: 'Jane Doe',
    publisher: 'Ondo Press',
    coverUrl: 'https://dummyimage.com/200x300/2b4170/e7e5e4&text=Book+One',
    description: 'A warm starter book for the demo library.',
    currentTemperature: 82.4,
    accumulatedTemperature: 82.4,
    temperature: 82.4,
    lastActiveAt: daysAgo(0),
    totalReviews: 12
  },
  {
    id: 'seed_2',
    isbn: 'SEED-002',
    title: 'Sample Book Two',
    author: 'Alex Kim',
    publisher: 'Night Sky House',
    coverUrl: 'https://dummyimage.com/200x300/223055/e7e5e4&text=Book+Two',
    description: 'A second sample with a cooler tone.',
    currentTemperature: 74.1,
    accumulatedTemperature: 74.1,
    temperature: 74.1,
    lastActiveAt: daysAgo(2),
    totalReviews: 7
  },
  {
    id: 'seed_3',
    isbn: 'SEED-003',
    title: 'Sample Book Three',
    author: 'Morgan Lee',
    publisher: 'Aurora Studio',
    coverUrl: 'https://dummyimage.com/200x300/35508c/e7e5e4&text=Book+Three',
    description: 'Demo entry to keep the shelf populated.',
    currentTemperature: 66.8,
    accumulatedTemperature: 66.8,
    temperature: 66.8,
    lastActiveAt: daysAgo(5),
    totalReviews: 4
  },
  {
    id: 'seed_4',
    isbn: 'SEED-004',
    title: 'Sample Book Four',
    author: 'Chris Park',
    publisher: 'Meteor Books',
    coverUrl: 'https://dummyimage.com/200x300/1a2440/e7e5e4&text=Book+Four',
    description: 'A calm sample to round out the grid.',
    currentTemperature: 61.2,
    accumulatedTemperature: 61.2,
    temperature: 61.2,
    lastActiveAt: daysAgo(9),
    totalReviews: 2
  }
];

// 초기 더미 데이터는 제거하고 빈 배열로 시작합니다.
const INITIAL_BOOKS: Book[] = SEED_BOOKS;
const INITIAL_REVIEWS: Review[] = [];

type EventType = 'review';

interface ReviewEvent {
  id: string;
  type: EventType;
  bookId: string;
  userId: string;
  createdAt: string;
  counted?: boolean;
}

const normalizeBook = (book: Book): Book => {
  const current = book.currentTemperature ?? book.temperature ?? 0;
  const accumulated = book.accumulatedTemperature ?? current;
  return {
    ...book,
    currentTemperature: current,
    accumulatedTemperature: accumulated,
    temperature: book.temperature ?? current
  };
};

const normalizeReview = (review: Review): Review => {
  const headline = review.headline ?? review.content ?? '';
  const body = review.body ?? '';
  return {
    ...review,
    headline,
    body,
    content: review.content ?? headline
  };
};

const normalizeEvent = (event: ReviewEvent): ReviewEvent => ({
  ...event,
  type: 'review'
});

const getStoredEvents = (): ReviewEvent[] => {
  const stored = localStorage.getItem(STORAGE_KEY_EVENTS);
  const events = stored ? (JSON.parse(stored) as ReviewEvent[]) : [];
  return events.map(normalizeEvent);
};

const saveEvents = (events: ReviewEvent[]) => {
  localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
};

const getStoredBooks = (): Book[] => {
  const stored = localStorage.getItem(STORAGE_KEY_BOOKS);
  const parsed = stored ? (JSON.parse(stored) as Book[]) : [];
  const base = parsed.length > 0 ? parsed : INITIAL_BOOKS;
  const normalized = base.map(normalizeBook);
  if (!stored || parsed.length === 0) {
    saveBooks(normalized);
  }
  return normalized;
};

const getStoredReviews = (): Review[] => {
  const stored = localStorage.getItem(STORAGE_KEY_REVIEWS);
  const reviews = stored ? (JSON.parse(stored) as Review[]) : INITIAL_REVIEWS;
  return reviews.map(normalizeReview);
};

const saveBooks = (books: Book[]) => {
  localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
};

const saveReviews = (reviews: Review[]) => {
  localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
};

const toDayKey = (date: Date) => date.toISOString().slice(0, 10);

const hasReviewEventToday = (events: ReviewEvent[], userId: string, bookId: string) => {
  const todayKey = toDayKey(new Date());
  return events.some((event) => event.userId === userId && event.bookId === bookId && toDayKey(new Date(event.createdAt)) === todayKey);
};

const applyDecayIfNeeded = (books: Book[]): Book[] => {
  const now = new Date();
  return books.map((book) => {
    if (!book.lastActiveAt) return book;
    const lastActive = new Date(book.lastActiveAt);
    const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < DECAY_CHECK_INTERVAL_DAYS) return book;

    const decayedTemp = Math.max(0, (book.currentTemperature ?? book.temperature ?? 0) - TEMP_DECAY_PER_DAY * diffDays);
    return {
      ...book,
      currentTemperature: parseFloat(decayedTemp.toFixed(1)),
      temperature: parseFloat(decayedTemp.toFixed(1))
    };
  });
};

// --- API Services ---

// 1. 책 목록 가져오기 (정렬 옵션: hot | new)
export const fetchBooks = async (filter: 'hot' | 'new'): Promise<Book[]> => {
  // 네트워크 지연 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 600)); 
  
  let books = getStoredBooks();
  books = applyDecayIfNeeded(books);
  saveBooks(books);

  const getTemp = (book: Book) => book.currentTemperature ?? book.temperature ?? 0;
  
  if (filter === 'hot') {
    // 온도가 높은 순
    return [...books].sort((a, b) => getTemp(b) - getTemp(a));
  } else {
    // 최근 활동 순 (Last Active)
    return [...books].sort((a, b) => 
      new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime()
    );
  }
};

// 2. 단일 책 정보 가져오기
export const fetchBookDetail = async (id: string): Promise<Book | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  let books = getStoredBooks();
  books = applyDecayIfNeeded(books);
  saveBooks(books);
  return books.find(b => b.id === id);
};

// 3. 책의 리뷰 가져오기
export const fetchBookReviews = async (bookId: string): Promise<Review[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const reviews = getStoredReviews();
  return reviews
    .filter(r => r.bookId === bookId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// 4. 서평 작성하기 (핵심 로직: 온도 상승)
export const submitReview = async (
  bookId: string, 
  headline: string,
  body: string,
  isPrivate: boolean,
  user: User
): Promise<Review> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // 처리 시간
  
  const reviews = getStoredReviews();
  const books = getStoredBooks();
  const events = getStoredEvents();
  
  const bookIndex = books.findIndex(b => b.id === bookId);
  if (bookIndex === -1) throw new Error("Book not found");

  const newReview: Review = {
    id: `r${Date.now()}`,
    bookId,
    userId: user.id,
    userNickname: user.nickname,
    headline,
    body,
    content: headline,
    isPrivate,
    createdAt: new Date().toISOString()
  };

  // 저장
  reviews.unshift(newReview);
  saveReviews(reviews);

  // 온도 업데이트 로직 (MVP 단순화)
  // 리뷰 작성 시 1.5도 상승, 최대 100도
  const alreadyCountedToday = hasReviewEventToday(events, user.id, bookId);
  const currentTemp = books[bookIndex].currentTemperature ?? books[bookIndex].temperature ?? 0;
  const accumulatedTemp = books[bookIndex].accumulatedTemperature ?? currentTemp;
  const newTemp = Math.min(100, currentTemp + TEMP_INCREMENT);

  books[bookIndex] = {
    ...books[bookIndex],
    currentTemperature: alreadyCountedToday ? currentTemp : parseFloat(newTemp.toFixed(1)),
    accumulatedTemperature: alreadyCountedToday
      ? accumulatedTemp
      : parseFloat((accumulatedTemp + TEMP_INCREMENT).toFixed(1)),
    temperature: alreadyCountedToday ? currentTemp : parseFloat(newTemp.toFixed(1)),
    lastActiveAt: new Date().toISOString(),
    totalReviews: books[bookIndex].totalReviews + 1
  };

  events.unshift({
    id: `e${Date.now()}`,
    type: 'review',
    bookId,
    userId: user.id,
    createdAt: new Date().toISOString(),
    counted: !alreadyCountedToday
  });
  saveEvents(events);
  saveBooks(books);

  return newReview;
};

// 5. 책 검색 (네이버 Book API → 실패 시 내부 데이터만 반환)
export const searchExternalBooks = async (query: string): Promise<Book[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const internalBooks = getStoredBooks();

  const normalizedQuery = query.trim();
  const internalMatches = internalBooks.filter(b =>
    b.title.includes(normalizedQuery) ||
    b.author.includes(normalizedQuery) ||
    b.isbn.includes(normalizedQuery)
  );

  if (!normalizedQuery) return internalMatches;

  const mergeBooks = (primary: Book[], secondary: Book[]) => {
    const map = new Map<string, Book>();
    const keyOf = (book: Book) => book.isbn || `${book.title}|${book.publisher}`;
    primary.forEach((book) => map.set(keyOf(book), book));
    secondary.forEach((book) => {
      const key = keyOf(book);
      if (!map.has(key)) map.set(key, book);
    });
    return Array.from(map.values());
  };

  try {
    const externalBooks = await searchNaverBooks(normalizedQuery, 10, 1);
    return mergeBooks(internalMatches, externalBooks);
  } catch (error) {
    console.warn('Naver book API failed, fallback to internal data', error);
    return internalMatches;
  }
};

// 6. 새 책 등록 (검색된 외부 책을 내부 DB로 편입)
export const registerBook = async (book: Book): Promise<Book> => {
  const books = getStoredBooks();
  // 이미 존재하는지 확인 (ISBN 기준)
  const existing = books.find(b => b.isbn === book.isbn);
  if (existing) return existing;

  // 새 책 등록
  const newBook = {
    ...book,
    id: `b_${Date.now()}`,
    currentTemperature: 36.5,
    accumulatedTemperature: 36.5,
    temperature: 36.5
  }; // 사람 체온으로 시작
  books.push(newBook);
  saveBooks(books);
  return newBook;
};
