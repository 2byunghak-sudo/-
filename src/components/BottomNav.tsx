import React from 'react';
import { 
  BookOpen, 
  Dumbbell, 
  Compass, 
  Award, 
  ClipboardList, 
  Trophy, 
  Sun, 
  Moon 
} from 'lucide-react';
import { ActiveTab } from '../types';
import { soundService } from '../services/sound';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleDarkMode,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'theory', label: '기초규칙', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'skills', label: '기능연습', icon: <Dumbbell className="w-5 h-5" /> },
    { id: 'tactics', label: '전술보드', icon: <Compass className="w-5 h-5" /> },
    { id: 'quiz', label: '퀴즈', icon: <Award className="w-5 h-5" /> },
    { id: 'log', label: '배움일지', icon: <ClipboardList className="w-5 h-5" /> },
    { id: 'scoreboard', label: '점수판', icon: <Trophy className="w-5 h-5" /> },
  ];

  const handleTabClick = (tab: ActiveTab) => {
    soundService.playClick();
    setActiveTab(tab);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-[#E9ECEF] dark:border-slate-800 pb-safe">
      <div className="grid grid-cols-7 items-center h-16 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                isActive
                  ? 'text-amber-500 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-full transition-transform ${isActive ? 'scale-110 bg-amber-50 dark:bg-amber-950/40 text-amber-500' : ''}`}>
                {tab.icon}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate w-full text-center">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Required Bottom Nav Dark/Light Mode Toggle Button */}
        <button
          onClick={() => {
            soundService.playClick();
            toggleDarkMode();
          }}
          className="flex flex-col items-center justify-center py-1 text-slate-500 dark:text-slate-400 hover:text-amber-500 transition-colors"
          title={isDark ? '라이트 모드' : '다크 모드'}
          aria-label="하단 다크모드 토글"
        >
          <div className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">
            {isDark ? '라이트' : '다크'}
          </span>
        </button>
      </div>
    </div>
  );
};
