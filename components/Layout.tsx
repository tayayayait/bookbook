import React from 'react';
import Header from './shell/Header';
import BottomNav from './shell/BottomNav';
import FabWrite from './shell/FabWrite';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-shell min-h-screen flex flex-col font-sans text-sky-50 antialiased selection:bg-meteor-400 selection:text-night-950 bg-night-900 bg-night-sky">
      <div className="relative z-10">
        <Header />
        <main className="flex-1 max-w-5xl w-full mx-auto px-5 md:px-8 py-10 md:py-12 mb-24 md:mb-12">
          {children}
        </main>
        <BottomNav />
        <FabWrite />
      </div>
    </div>
  );
};

export default Layout;
