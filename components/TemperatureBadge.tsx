import React from 'react';
import { Flame, Sun, Sparkles, Snowflake } from 'lucide-react';

interface TemperatureBadgeProps {
  temp: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const TemperatureBadge: React.FC<TemperatureBadgeProps> = ({ temp, size = 'md', showLabel = true }) => {
  // Determine Visual Style
  const getStyle = (t: number) => {
    if (t >= 80) return {
      icon: <Flame className={size === 'lg' ? "w-5 h-5" : "w-3.5 h-3.5"} />,
      bg: 'bg-gradient-to-r from-dawn-400 via-aurora-400 to-meteor-400',
      text: 'text-night-950',
      shadow: 'shadow-glowMix',
      label: '뜨거움'
    };
    if (t >= 50) return {
      icon: <Sun className={size === 'lg' ? "w-5 h-5" : "w-3.5 h-3.5"} />,
      bg: 'bg-white/20 border border-aurora-400/40',
      text: 'text-aurora-400',
      shadow: 'shadow-[0_0_16px_rgba(192,108,255,0.25)]',
      label: '따뜻함'
    };
    if (t >= 36.5) return {
      icon: <Sparkles className={size === 'lg' ? "w-5 h-5" : "w-3.5 h-3.5"} />,
      bg: 'bg-white/20 border border-meteor-400/40',
      text: 'text-meteor-400',
      shadow: 'shadow-[0_0_16px_rgba(95,231,255,0.25)]',
      label: '살아있음'
    };
    return {
      icon: <Snowflake className={size === 'lg' ? "w-5 h-5" : "w-3.5 h-3.5"} />,
      bg: 'bg-white/20 border border-white/30',
      text: 'text-sky-100',
      shadow: 'shadow-glass',
      label: '차가움'
    };
  };

  const style = getStyle(temp);
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <div className={`inline-flex items-center gap-1.5 font-medium rounded-full shadow-sm ${style.bg} ${style.text} ${style.shadow} ${sizeClasses[size]} transition-all duration-300 backdrop-blur`}>
      {style.icon}
      <span className="font-mono font-bold tracking-tight">{temp.toFixed(1)}°C</span>
      {showLabel && <span className="opacity-80 border-l border-current pl-1.5 ml-0.5 text-[0.95em]">{style.label}</span>}
    </div>
  );
};

export default TemperatureBadge;
