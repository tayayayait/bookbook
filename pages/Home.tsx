import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '../types';
import { fetchBooks, registerBook, searchExternalBooks } from '../services/mockDataService';
import BookCard from '../components/BookCard';
import { ArrowRight, Search } from 'lucide-react';
import { Button, EmptyState, Input, Modal, Skeleton } from '../components/ui';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [hotBooks, setHotBooks] = useState<Book[]>([]);
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [hot, recent] = await Promise.all([
          fetchBooks('hot'),
          fetchBooks('new')
        ]);
        setHotBooks(hot.slice(0, 4));
        setRecentBooks(recent);
      } catch (error) {
        console.error("Failed to load books", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = query.trim();
    if (!normalized) return;

    setIsSearching(true);
    setHasSearched(true);
    setSearchError('');
    try {
      const results = await searchExternalBooks(normalized);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed', error);
      setSearchResults([]);
      setSearchError('검색이 잠시 원활하지 않습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectBook = async (book: Book) => {
    const registered = await registerBook(book);
    navigate(`/write?bookId=${registered.id}`);
  };

  if (loading) {
    return (
      <div className="space-y-12 animate-fade-in pb-10">
        <section className="glass-card relative py-12 md:py-16 px-6 md:px-10 text-center overflow-hidden rounded-[28px] bg-white/20 border border-white/30 backdrop-blur-xl shadow-glass">
          <div className="space-y-4 max-w-2xl mx-auto">
            <Skeleton className="h-6 w-24 mx-auto" variant="text" />
            <Skeleton className="h-10 w-3/4 mx-auto" variant="text" />
            <Skeleton className="h-10 w-2/3 mx-auto" variant="text" />
            <Skeleton className="h-4 w-1/2 mx-auto" variant="text" />
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" variant="text" />
            <Skeleton className="h-4 w-56" variant="text" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="space-y-3">
                <Skeleton className="aspect-[1/1.5] w-full" />
                <Skeleton className="h-4 w-3/4" variant="text" />
                <Skeleton className="h-3 w-1/2" variant="text" />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" variant="text" />
            <Skeleton className="h-4 w-56" variant="text" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex gap-4">
                <Skeleton className="w-20 h-28" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" variant="text" />
                  <Skeleton className="h-3 w-1/2" variant="text" />
                  <Skeleton className="h-3 w-2/3" variant="text" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
      <div className="space-y-14 animate-fade-in pb-10">
      {/* Hero Section */}
      <section className="glass-card relative py-12 md:py-16 px-6 md:px-10 text-center md:text-left overflow-hidden rounded-[28px] bg-white/20 border border-white/30 backdrop-blur-xl shadow-glass">
        <div className="absolute -top-24 -left-20 h-64 w-64 rounded-full bg-meteor-400/20 blur-3xl"></div>
        <div className="absolute -top-16 right-0 h-56 w-56 rounded-full bg-aurora-400/25 blur-3xl"></div>
        <div className="relative z-10 space-y-4 max-w-2xl mx-auto md:mx-0">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-[11px] font-medium uppercase tracking-[0.3em] text-sky-100">
            Beta
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-semibold text-sky-50 leading-tight">
            책은 읽힐 때<br/>
            비로소 <span className="text-meteor-400 italic">온기</span>를 가집니다.
          </h1>
          <p className="text-sky-100/80 text-sm md:text-base max-w-md md:max-w-lg mx-auto md:mx-0 leading-relaxed pt-1">
            비교 없이 기록만 남기는 곳.<br/>
            오직 '지금 읽히는지'만을 기록합니다.
          </p>
          <div className="pt-4 flex items-center justify-center md:justify-start">
            <Button
              variant="secondary"
              leftIcon={<Search className="w-4 h-4" />}
              onClick={() => setIsSearchOpen(true)}
            >
              책 찾아보기
            </Button>
          </div>
        </div>
      </section>

      {/* Hot Books Section */}
      <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-6 px-1">
          <div>
            <h2 className="text-xl md:text-2xl font-serif font-semibold flex items-center gap-2 text-sky-50">
              지금 읽히는 책
            </h2>
            <p className="text-xs text-sky-100/80 mt-1">실시간으로 기록이 쌓이고 있는 도서들</p>
          </div>
        </div>
        {hotBooks.length === 0 ? (
          <EmptyState
            size="sm"
            title="아직 기록된 책이 없어요."
            description="검색으로 첫 번째 책을 추가해 보세요."
            action={(
              <Button variant="secondary" onClick={() => setIsSearchOpen(true)}>
                책 검색하기
              </Button>
            )}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {hotBooks.map((book) => (
              <BookCard key={book.id} book={book} variant="vertical" />
            ))}
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="flex items-center gap-4 py-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
        <span className="text-sky-100 text-xs uppercase tracking-[0.3em]">최근 기록</span>
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
      </div>

      {/* Recently Warmed Section */}
      <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-6 px-1">
          <div>
            <h2 className="text-xl md:text-2xl font-serif font-semibold flex items-center gap-2 text-sky-50">
              방금 데워진 책
            </h2>
            <p className="text-xs text-sky-100/80 mt-1">방금 누군가가 온기를 남기고 간 책들</p>
          </div>
        </div>
        {recentBooks.length === 0 ? (
          <EmptyState
            size="sm"
            title="아직 온기가 쌓인 책이 없어요."
            description="첫 기록을 남기면 여기에 모여요."
            action={(
              <Button variant="secondary" onClick={() => setIsSearchOpen(true)}>
                책 검색하기
              </Button>
            )}
          />
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {recentBooks.map(book => (
                <BookCard key={book.id} book={book} variant="horizontal" />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button variant="text" rightIcon={<ArrowRight className="w-4 h-4" />}>
                더 많은 기록 보기
              </Button>
            </div>
          </>
        )}
      </section>

      <Modal
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="책 검색"
        description="책 제목, 저자명, ISBN으로 검색할 수 있어요."
        footer={
          <Button variant="secondary" onClick={() => setIsSearchOpen(false)}>
            닫기
          </Button>
        }
      >
        <form onSubmit={handleSearch} className="space-y-4">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="읽고 싶은 책을 검색하세요."
            leftIcon={<Search className="w-5 h-5" />}
            size="lg"
            rightElement={
              <Button type="submit" size="sm" loading={isSearching}>
                검색
              </Button>
            }
          />
          {searchError && <p className="text-xs text-sky-100/80">{searchError}</p>}
          {hasSearched && !isSearching && searchResults.length === 0 && !searchError && (
            <EmptyState size="sm" title="검색 결과가 없습니다." description="다른 키워드로 다시 검색해 주세요." />
          )}
          {searchResults.length > 0 && (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {searchResults.map((book) => (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => handleSelectBook(book)}
                  className="glass-card w-full text-left flex gap-5 p-4 rounded-2xl bg-white/20 border border-white/30 hover:border-meteor-400/30 hover:bg-white/20 transition-all shadow-glass group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-meteor-400/20"
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
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default Home;
