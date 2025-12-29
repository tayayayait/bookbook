import React from 'react';
import { Link } from 'react-router-dom';
import { PenLine } from 'lucide-react';

const FabWrite: React.FC = () => {
  return (
    <div className="hidden md:block fixed bottom-10 right-[max(2rem,calc(50%-28rem))] z-40">
      <Link
        to="/write"
        className="group flex items-center gap-3 bg-gradient-to-r from-meteor-400 via-aurora-400 to-dawn-400 text-night-950 pl-6 pr-8 py-3.5 rounded-full shadow-glowMix hover:shadow-glowPurple transition-all duration-300 hover:-translate-y-0.5"
      >
        <PenLine className="w-5 h-5 group-hover:rotate-6 transition-transform" />
        <span className="tracking-wide font-medium">온도 남기기</span>
      </Link>
    </div>
  );
};

export default FabWrite;
