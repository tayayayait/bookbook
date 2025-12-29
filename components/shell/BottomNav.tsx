import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, PenLine, User } from 'lucide-react';
import { cn } from '../ui';

const navItems = [
  { to: '/', label: '홈', Icon: BookOpen },
  { to: '/write', label: '기록', Icon: PenLine },
  { to: '/library', label: '서재', Icon: User }
];

const BottomNav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-40 md:hidden">
      <div className="mx-auto max-w-[420px] px-4">
        <div className="grid grid-cols-3 rounded-2xl border border-white/30 bg-night-700/70 backdrop-blur-xl shadow-glass py-2">
          {navItems.map(({ to, label, Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 text-[11px] font-medium tracking-wide transition-all py-2',
                  active ? 'text-meteor-400' : 'text-sky-100/80 hover:text-sky-100'
                )}
              >
                <Icon className={cn('w-5 h-5 transition-transform', active && 'scale-105')} strokeWidth={1.6} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
