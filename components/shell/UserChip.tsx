import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { cn } from '../ui';

export interface UserChipProps {
  name?: string;
  className?: string;
}

const UserChip: React.FC<UserChipProps> = ({ name = 'Guest Writer', className }) => {
  return (
    <Link
      to="/library"
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/30 bg-white/20 text-sm font-medium text-sky-100 transition-all hover:border-meteor-400/50 hover:bg-white/20 hover:text-sky-50',
        className
      )}
    >
      <span className="hidden sm:inline text-sky-100">{name}</span>
      <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center overflow-hidden shadow-glass">
        <User className="w-4 h-4 text-sky-100" />
      </div>
    </Link>
  );
};

export default UserChip;
