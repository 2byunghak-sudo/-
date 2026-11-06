import React from 'react';
import { 
  BookOpen, 
  Dumbbell, 
  Compass, 
  Award, 
  ClipboardList, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Cloud, 
  HelpCircle
} from 'lucide-react';
import { ActiveTab } from '../types';
import { soundService } from '../services/sound';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  onOpenFirebaseModal: () => void;
  onOpenDeployModal: () => void;
  isFirebaseConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleDarkMode,
  soundEnabled,
  toggleSound,
  onOpenFirebaseModal,
  onOpenDeployModal,
  isFirebaseConnected,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'theory', label: '배구 기초 & 규칙', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'skills', label: '기본 기능 마스터', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'tactics', label: '전술 & 로테이션', icon: <Compass className="w-4 h-4" />, badge: '인터랙티브' },
    { id: 'quiz', label: '형성평가 퀴즈', icon: <Award className="w-4 h-4" /> },
    { id: 'log', label: '나의 배움일지', icon: <ClipboardList className="w-4 h-4" />, badge: '기록' },
    { id: 'scoreboard', label: '심판 스코어보드', icon: <Trophy className="w-4 h-4" /> },
  ];

  const handleTabClick = (tab: ActiveTab) => {
    soundService.playClick();
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-[#E9ECEF] dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleTabClick('theory')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <span className="text-2xl select-none" role="img" aria-label="volleyball">🏐</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  스파이크온!
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  중학교 체육
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                스마트 배구 수업 & 전술/기록 학습 가이드
              </p>
            </div>
          </div>

          {/* Desktop & Tablet Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && !isActive && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Tools: Sound, Cloud/Firebase, Guide, Dark Mode */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Firebase Status Badge */}
            <button
              onClick={onOpenFirebaseModal}
              title={isFirebaseConnected ? 'Firebase 클라우드 연동됨' : '데이터 저장 설정 (로컬/클라우드)'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isFirebaseConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <Cloud className={`w-3.5 h-3.5 ${isFirebaseConnected ? 'text-emerald-500' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">
                {isFirebaseConnected ? '클라우드 동기화' : '저장소 설정'}
              </span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                toggleSound();
                soundService.playClick();
              }}
              title={soundEnabled ? '효과음 켜짐 (클릭시 음소거)' : '효과음 꺼짐'}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              aria-label="Toggle sound"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => {
                toggleDarkMode();
                soundService.playClick();
              }}
              title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Teacher Deploy & Class Guide */}
            <button
              onClick={onOpenDeployModal}
              title="수업 배포 & Vercel 가이드"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-opacity"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>배포 & 활용법</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
