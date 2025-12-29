import React, { useEffect, useState } from 'react';
import { Review } from '../types';
import { fetchBookDetail } from '../services/mockDataService';
import { User, Calendar } from 'lucide-react';
import { EmptyState } from '../components/ui';

interface MyReview extends Review {
  bookTitle?: string;
  bookCover?: string;
}

const MyLibrary: React.FC = () => {
  const [reviews, setReviews] = useState<MyReview[]>([]);
  
  useEffect(() => {
    // Mock fetching user reviews from localStorage
    const storedReviews = localStorage.getItem('ondo_reviews');
    if (storedReviews) {
      const allReviews: Review[] = JSON.parse(storedReviews);
      // Filter for mock user 'u1' or generic current user check
      // For this MVP, we just show recently added reviews to simulate "My Library" if we match the ID from WriteReview
      const myReviews = allReviews.filter(r => r.userId === 'current_user_1' || r.userId === 'u1');
      
      const enrichReviews = async () => {
        const enriched = await Promise.all(myReviews.map(async (r) => {
          const book = await fetchBookDetail(r.bookId);
          return {
            ...r,
            bookTitle: book?.title,
            bookCover: book?.coverUrl
          };
        }));
        setReviews(enriched.reverse()); // Newest first
      };
      enrichReviews();
    }
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shadow-glass">
          <User className="w-7 h-7 text-sky-100" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-semibold text-sky-50">내 서재</h1>
          <p className="text-sky-100/80">총 {reviews.length}개의 기록</p>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <EmptyState title="아직 남긴 기록이 없습니다." description="첫 번째 온기를 남겨보세요." />
        ) : (
          reviews.map(review => {
            const headline = review.headline ?? review.content ?? '';
            const body = review.body ?? '';
            return (
              <div key={review.id} className="glass-card flex gap-4 bg-white/20 p-4 rounded-2xl shadow-glass border border-white/30">
                <div className="w-16 h-24 flex-shrink-0 bg-night-700/40 rounded-lg overflow-hidden">
                  <img
                    src={review.bookCover}
                    alt={review.bookTitle ?? '책 표지'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sky-50 mb-1">{review.bookTitle}</h3>
                  <div className="flex items-center gap-2 text-xs text-sky-100/80 mb-3">
                    <Calendar className="w-3 h-3" />
                    {new Date(review.createdAt).toLocaleDateString()}
                    {review.isPrivate && <span className="text-dawn-400 bg-white/20 px-1 rounded">비공개</span>}
                  </div>
                  <p className="text-sky-100 font-serif text-sm line-clamp-1">
                    “{headline}”
                  </p>
                  {body && (
                    <p className="text-sky-100/80 text-xs line-clamp-2 mt-1">
                      {body}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyLibrary;
