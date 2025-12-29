import React from 'react';
import { Book } from '../types';
import TemperatureBadge from './TemperatureBadge';

export interface TemperaturePanelProps {
  book: Book;
}

const TemperaturePanel: React.FC<TemperaturePanelProps> = ({ book }) => {
  const current = book.currentTemperature ?? book.temperature ?? 0;
  const accumulated = book.accumulatedTemperature ?? current;
  const progress = Math.min(current, 100);
  const lastActiveLabel = book.lastActiveAt
    ? new Date(book.lastActiveAt).toLocaleDateString()
    : '-';

  return (
    <div className="glass-card bg-white/20 p-6 rounded-2xl border border-white/30 shadow-glass mb-6 relative overflow-hidden group backdrop-blur-xl">
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
        <TemperatureBadge temp={current} size="lg" showLabel={false} />
      </div>

      <div className="flex items-end justify-between mb-3">
        <span className="text-xs font-semibold text-sky-100 uppercase tracking-[0.2em]">현재 온도</span>
        <span className="text-3xl font-mono font-bold text-sky-50">
          {current.toFixed(1)}<span className="text-lg text-sky-100">°C</span>
        </span>
      </div>

      <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-meteor-400 via-aurora-400 to-dawn-400 transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex justify-between mt-2 text-xs text-sky-100/80 font-mono">
        <span>0°C</span>
        <span>36.5°C</span>
        <span>100°C</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-sky-100/80">
        <span className="font-mono">누적 온도 {accumulated.toFixed(1)}°C</span>
        <span className="font-mono">마지막 기록 {lastActiveLabel}</span>
      </div>
    </div>
  );
};

export default TemperaturePanel;
