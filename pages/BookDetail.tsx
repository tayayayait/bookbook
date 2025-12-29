import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Book, Review } from '../types';
import { fetchBookDetail, fetchBookReviews } from '../services/mockDataService';
import { ArrowLeft, MessageSquare, PenLine, Loader2, Info, Share2, Quote } from 'lucide-react';
import TemperaturePanel from '../components/TemperaturePanel';
import { Button, EmptyState } from '../components/ui';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        const bookData = await fetchBookDetail(id);
        const reviewData = await fetchBookReviews(id);
        if (bookData) setBook(bookData);
        setReviews(reviewData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <div className="flex justify-center h-[50vh] items-center"><Loader2 className="animate-spin text-sky-100 w-8 h-8"/></div>;
  if (!book) return <div className="text-center py-20 font-serif text-sky-100">존재하지 않는 책입니다.</div>;

  const publicReviews = reviews.filter((review) => !review.isPrivate);

  return (
    <div className="animate-fade-in">
      <nav className="flex items-center justify-between mb-8">
        <Link to="/" className="inline-flex items-center text-sky-100 hover:text-sky-50 transition-colors group">
          <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-serif">목록으로</span>
        </Link>
        <button
          className="p-2 text-sky-100 hover:text-sky-50 transition-colors rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-meteor-400/20"
          aria-label="공유하기"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </nav>

      {/* Book Header Info */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-14 mb-16">
        {/* Cover Image */}
        <div className="w-[180px] md:w-[220px] mx-auto md:mx-0 flex-shrink-0">
          <div className="relative rounded-2xl shadow-glass overflow-hidden bg-white/20 p-2 border border-white/30">
            <img src={book.coverUrl} alt={book.title} className="w-full h-auto object-cover rounded-xl shadow-[0_8px_22px_rgba(3,8,20,0.55)]" />
          </div>
        </div>
        
        {/* Info & Temperature */}
        <div className="flex-1 flex flex-col pt-2">
          <div className="text-center md:text-left mb-6">
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-sky-50 mb-2 leading-tight tracking-tight">
              {book.title}
            </h1>
            <p className="text-base md:text-lg text-sky-100 font-medium">
              {book.author} <span className="text-sky-100/60 font-light mx-2">|</span> {book.publisher}
            </p>
          </div>

          <TemperaturePanel book={book} />

          <p className="text-sky-100 leading-relaxed text-sm md:text-base mb-8 bg-white/20 border border-white/30 rounded-xl p-4">
            {book.description}
          </p>
          
          <div className="mt-auto flex gap-4">
            <Button
              fullWidth
              size="md"
              leftIcon={<PenLine className="w-4 h-4" />}
              onClick={() => navigate(`/write?bookId=${book.id}`)}
            >
              온도 더하기
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
          <div className="flex items-center gap-2 text-sky-50 font-serif font-semibold text-lg">
            <MessageSquare className="w-5 h-5 text-meteor-400" />
            <span>남겨진 온기들 ({publicReviews.length})</span>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
        </div>

        {publicReviews.length === 0 ? (
          <EmptyState
            title="아직 공개된 기록이 없습니다."
            description="첫 번째 온기를 나눠주세요."
            icon={<Info className="w-8 h-8" />}
          />
        ) : (
          <div className="space-y-6">
            {publicReviews.map((review, idx) => {
              const headline = review.headline ?? review.content ?? '';
              const body = review.body ?? '';
              return (
              <div 
                key={review.id} 
                className="glass-card group relative bg-white/20 p-6 md:p-8 rounded-2xl shadow-glass border border-white/30 hover:shadow-glowMix transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Visual Quote Icon */}
                <Quote className="absolute top-6 left-6 w-8 h-8 text-white/10 fill-white/10 -z-0 transform -scale-x-100" />
                
                <div className="relative z-10">
                  <p className="text-sky-50 leading-relaxed font-serif text-lg md:text-xl mb-4">
                    {headline}
                  </p>
                  {body && (
                    <p className="text-sky-100 leading-relaxed text-sm md:text-base mb-6">
                      {body}
                    </p>
                  )}
                  <div className="flex items-center justify-end gap-3 border-t border-white/30 pt-4">
                    <span className="text-xs text-sky-100/80 font-mono">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2 pl-3 border-l border-white/30">
                      <div className="w-6 h-6 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-[10px] font-bold text-sky-100">
                        {review.userNickname.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-sky-100">{review.userNickname}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
