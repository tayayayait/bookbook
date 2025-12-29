import React from 'react';
import { Link } from 'react-router-dom';
import { ThermometerSun } from 'lucide-react';
import UserChip from './UserChip';
import { getCurrentUser } from '../../services/authService';

export interface HeaderProps {
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  const currentUser = getCurrentUser();
  const displayName = userName || currentUser?.nickname || 'Guest Writer';
  return (
    <header className="sticky top-0 z-50 bg-night-700/70 backdrop-blur-xl border-b border-white/30 transition-all duration-300">
      <div className="max-w-5xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/20 text-meteor-400 ring-1 ring-white/15 shadow-glowCyan transition-transform group-hover:rotate-6">
            <ThermometerSun className="w-5 h-5" />
          </span>
          <span className="font-serif font-semibold text-xl tracking-tight text-sky-50">Ondo</span>
        </Link>
        <UserChip name={displayName} />
      </div>
    </header>
  );
};

export default Header;
