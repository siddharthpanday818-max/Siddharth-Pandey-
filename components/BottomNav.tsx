import React from 'react';
import { NAV_ITEMS } from '../constants';
import type { Screen } from '../types';
import { useApp } from '../App';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
  const { t } = useApp();
  return (
    <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-200 shadow-lg flex justify-around items-center rounded-t-2xl">
      {NAV_ITEMS.map((item) => {
        const isActive = activeScreen === item.id;
        const colorClass = isActive ? 'text-blue-600' : 'text-slate-500';

        return (
          <button
            key={item.id}
            onClick={() => setActiveScreen(item.id)}
            className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 transform hover:scale-110 focus:outline-none ${colorClass}`}
          >
            <item.icon className="w-7 h-7" />
            <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
              {t(item.label)}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;