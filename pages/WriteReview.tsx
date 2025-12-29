import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, BookOpen, X } from 'lucide-react';
import { Book, User } from '../types';
import { searchExternalBooks, registerBook, submitReview, fetchBookDetail } from '../services/mockDataService';
import { Button, EmptyState, Input, Textarea, ToggleRow } from '../components/ui';

const CURRENT_USER: User = {
  id: 'current_user_1',
  email: 'user@ondo.app',
  nickname: '기록자'
};

const HEADLINE_MIN = 10;
const BODY_MIN = 30;
const BODY_MAX = 300;

const WriteReview: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedId = searchParams.get('bookId');

  const [step, setStep] = useState<1 | 2>(1); // 1: Search, 2: Write
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [headline, setHeadline] = useState('');
  const [body, setBody] = useState('');
  const [headlineError, setHeadlineError] = useState('');
  const [bodyError, setBodyError] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (preSelectedId) {
      const loadPreSelected = async () => {
        const book = await fetchBookDetail(preSelectedId);
        if (book) {
          setSelectedBook(book);
          setStep(2);
        }
      };
      loadPreSelected();
    }
  }, [preSelectedId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchExternalBooks(query);
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectBook = async (book: Book) => {
    const registeredBook = await registerBook(book);
    setSelectedBook(registeredBook);
    setStep(2);
  };

  const validate = () => {
    const headlineText = headline.trim();
    const bodyText = body.trim();
    let valid = true;

    if (headlineText.length < HEADLINE_MIN) {
      setHeadlineError(`한 줄 평은 최소 ${HEADLINE_MIN}자 이상 필요합니다.`);
      valid = false;
    }

    if (bodyText.length < BODY_MIN) {
      setBodyError(`본문은 최소 ${BODY_MIN}자 이상 필요합니다.`);
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHeadlineError('');
    setBodyError('');

    if (!selectedBook) return;
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitReview(selectedBook.id, headline.trim(), body.trim(), isPrivate, CURRENT_USER);
      navigate(`/book/${selectedBook.id}`);
    } catch (error) {
      alert('기록을 저장하는데 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 1) {
    return (
      <div className="max-w-xl mx-auto py-10 animate-fade-in">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-serif font-semibold mb-3 text-sky-50">어떤 책을 읽으셨나요?</h1>
          <p className="text-sky-100/80">기록을 남길 책을 찾아주세요.</p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="책 제목, 저자명, ISBN으로 검색..."
            leftIcon={<Search className="w-5 h-5" />}
            size="lg"
            rightElement={
              <Button type="submit" size="sm" loading={isSearching}>
                검색
              </Button>
            }
          />
        </form>

        <div className="space-y-3">
          {searchResults.map((book) => (
            <button
              type="button"
              key={book.id}
              onClick={() => handleSelectBook(book)}
              className="glass-card w-full text-left flex gap-5 p-4 rounded-2xl bg-white/20 border border-white/30 hover:border-meteor-400/30 hover:bg-white/20 transition-all shadow-glass group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-meteor-400/20 cursor-pointer"
              aria-label={`${book.title} 선택`}
            >
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-14 h-20 object-cover rounded-md shadow-sm group-hover:shadow-md transition-all"
              />
              <div className="flex flex-col justify-center">
                <h3 className="font-bold text-lg text-sky-50 group-hover:text-meteor-400 transition-colors mb-1">
                  {book.title}
                </h3>
                <p className="text-sky-100/80">{book.author}</p>
                <p className="text-xs text-sky-100/70 mt-1">{book.publisher}</p>
              </div>
            </button>
          ))}

          {searchResults.length === 0 && !isSearching && query && (
            <EmptyState
              size="sm"
              title="검색 결과가 없습니다."
              description="다른 키워드로 다시 시도해 주세요."
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-4 animate-fade-in-up">
      <div className="glass-card flex items-center gap-5 mb-8 bg-white/20 p-5 rounded-2xl border border-white/30 shadow-glass relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3">
          <button
            onClick={() => setStep(1)}
            className="p-1 rounded-full hover:bg-white/20 text-sky-100 hover:text-sky-50 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-meteor-400/20"
            aria-label="다시 책 선택하기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <img
          src={selectedBook?.coverUrl}
          alt={selectedBook?.title ?? '선택한 책'}
          className="w-16 h-24 object-cover rounded shadow-md"
        />
        <div className="flex-1 pr-8">
          <h3 className="font-serif font-semibold text-xl leading-tight mb-1 text-sky-50">{selectedBook?.title}</h3>
          <p className="text-sky-100/80 text-sm font-medium">{selectedBook?.author}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/20 text-xs text-sky-100">
            <BookOpen className="w-3 h-3" />
            <span>기록 준비 중</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label className="block text-sky-50 font-serif font-semibold text-lg">한 줄 평</label>
          <Input
            value={headline}
            onChange={(e) => {
              setHeadline(e.target.value);
              if (headlineError) setHeadlineError('');
            }}
            placeholder="오늘의 느낌을 한 문장으로 남겨주세요."
            size="lg"
            error={!!headlineError}
          />
          <div className="flex items-center justify-between text-xs text-sky-100/80">
            <span>최소 {HEADLINE_MIN}자</span>
            <span className="font-mono">{headline.trim().length}자</span>
          </div>
          {headlineError && <p className="text-xs text-rose-300">{headlineError}</p>}
        </div>

        <div className="space-y-3">
          <label className="block text-sky-50 font-serif font-semibold text-lg">본문</label>
          <Textarea
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              if (bodyError) setBodyError('');
            }}
            placeholder="책을 읽으며 남기고 싶은 온기를 조금 더 자세히 적어주세요."
            maxLength={BODY_MAX}
            rows={6}
            showCount
            error={!!bodyError}
          />
          <div className="flex items-center justify-between text-xs text-sky-100/80">
            <span>최소 {BODY_MIN}자</span>
            <span className="font-mono">{body.trim().length} / {BODY_MAX}</span>
          </div>
          {bodyError && <p className="text-xs text-rose-300">{bodyError}</p>}
        </div>

        <ToggleRow
          title="나만 보기"
          description="다른 사람에게 공개되지 않는 개인 기록입니다."
          checked={isPrivate}
          onChange={setIsPrivate}
        />

        <p className="text-xs text-sky-100/80">
          같은 책에는 하루에 한 번만 온도에 반영됩니다.
        </p>

        <Button
          type="submit"
          fullWidth
          loading={isSubmitting}
          leftIcon={!isSubmitting ? <BookOpen className="w-5 h-5" /> : undefined}
          disabled={isSubmitting}
        >
          기록 남기기
        </Button>
      </form>
    </div>
  );
};

export default WriteReview;
