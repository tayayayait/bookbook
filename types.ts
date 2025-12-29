// 도서 상태 정의
export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  coverUrl: string;
  description: string;
  currentTemperature: number; // 현재 온도 (0 ~ 100도)
  accumulatedTemperature: number; // 누적 온도 (감쇠 전 기록 누적값)
  temperature?: number; // legacy: currentTemperature와 동일하게 유지
  lastActiveAt: string; // ISO Date string
  totalReviews: number;
}

// 서평 정의
export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userNickname: string;
  headline: string; // 한 줄 평
  body?: string; // 본문 서평 (선택)
  content?: string; // legacy: headline/body 이전 구조
  isPrivate: boolean;
  createdAt: string;
}

// 사용자 정의
export interface User {
  id: string;
  email: string;
  nickname: string;
}

// API 응답 래퍼
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
