import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types';
import TemperatureBadge from './TemperatureBadge';

interface BookCardProps {
  book: Book;
  variant?: 'vertical' | 'horizontal';
}

const BookCard: React.FC<BookCardProps> = ({ book, variant = 'vertical' }) => {
  const temperature = book.currentTemperature ?? book.temperature ?? 0;
  if (variant === 'horizontal') {
    return (
      <Link to={`/book/${book.id}`} className="glass-card group flex gap-5 p-4 bg-white/20 rounded-2xl border border-white/30 backdrop-blur-xl shadow-glass hover:border-meteor-400/30 hover:shadow-glowMix transition-all duration-300">
        <div className="relative w-24 h-36 flex-shrink-0 shadow-[0_8px_22px_rgba(3,8,20,0.55)] rounded-md overflow-hidden group-hover:-translate-y-0.5 transition-transform duration-300">
          <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
        </div>
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <h3 className="font-serif font-semibold text-lg text-sky-50 leading-tight mb-1.5 line-clamp-2 group-hover:text-meteor-400 transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-sky-100/80 font-medium mb-3">{book.author}</p>
            <p className="text-sky-100/80 text-xs line-clamp-2 leading-relaxed mb-3">
              {book.description}
            </p>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <TemperatureBadge temp={temperature} size="sm" />
            <span className="text-[11px] text-sky-100/70 font-mono">
              Last active: {new Date(book.lastActiveAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Vertical (Default)
  return (
    <Link to={`/book/${book.id}`} className="glass-card group flex flex-col gap-4 rounded-2xl p-4 bg-white/20 border border-white/30 backdrop-blur-xl shadow-glass hover:shadow-glowMix transition-all duration-300">
      <div className="relative aspect-[1/1.5] w-full rounded-xl shadow-[0_8px_22px_rgba(3,8,20,0.55)] overflow-hidden bg-night-700/40">
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          loading="lazy"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl"></div>
        {/* Dynamic Overlay based on Temp */}
        {temperature >= 80 && (
           <div className="absolute bottom-0 right-0 p-2">
             <span className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dawn-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-meteor-400"></span>
             </span>
           </div>
        )}
      </div>
      
      <div className="space-y-1.5">
        <div className="flex items-center justify-between mb-1">
           <TemperatureBadge temp={temperature} size="sm" showLabel={false} />
        </div>
        <h3 className="font-serif font-semibold text-base text-sky-50 leading-snug line-clamp-2 group-hover:text-meteor-400 transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-sky-100/80 line-clamp-1 font-medium">{book.author}</p>
      </div>
    </Link>
  );
};

export default BookCard;
