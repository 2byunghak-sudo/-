import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { TheorySection } from './components/TheorySection';
import { SkillsSection } from './components/SkillsSection';
import { TacticsBoard } from './components/TacticsBoard';
import { QuizSection } from './components/QuizSection';
import { LearningLog } from './components/LearningLog';
import { ScoreboardSection } from './components/ScoreboardSection';
import { FirebaseModal } from './components/FirebaseModal';
import { DeploymentModal } from './components/DeploymentModal';
import { firebaseService } from './services/firebase';
import { soundService } from './services/sound';
import { 
  Heart, 
  HelpCircle, 
  Sparkles, 
  Share2, 
  ShieldCheck, 
  Smartphone,
  ExternalLink 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('theory');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('volleyball_theme') === 'dark';
    }
    return false;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => soundService.isEnabled());
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(() => firebaseService.getStatus().isConnected);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState<boolean>(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);
  const [selectedSkillForLog, setSelectedSkillForLog] = useState<string>('언더핸드 패스');

  // Handle Dark mode class on html/document root
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('volleyball_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('volleyball_theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  const toggleSound = () => {
    const next = soundService.toggleSound();
    setSoundEnabled(next);
  };

  const handleSelectSkillForLog = (skillName: string) => {
    setSelectedSkillForLog(skillName);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#0F172A] transition-colors duration-200">
      {/* Top Sticky Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
        isFirebaseConnected={isFirebaseConnected}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12">
        {activeTab === 'theory' && <TheorySection />}

        {activeTab === 'skills' && (
          <SkillsSection
            onSelectSkillForLog={handleSelectSkillForLog}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tactics' && <TacticsBoard />}

        {activeTab === 'quiz' && <QuizSection />}

        {activeTab === 'log' && (
          <LearningLog
            initialSkill={selectedSkillForLog}
            onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
            isFirebaseConnected={isFirebaseConnected}
          />
        )}

        {activeTab === 'scoreboard' && <ScoreboardSection />}
      </main>

      {/* Bottom Sticky Navigation for Mobile (9:16) with required Dark Mode toggle */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Teacher Modals */}
      <FirebaseModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
        onConnectionChange={(connected) => setIsFirebaseConnected(connected)}
      />

      <DeploymentModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />

      {/* Footer */}
      <footer className="hidden md:block border-t border-[#E9ECEF] dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-xs text-slate-500 dark:text-slate-400 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              스파이크온! (SpikeOn!)
            </span>
            <span>•</span>
            <span>중학교 체육과 배구 영역 스마트 학습 지원 시스템</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDeployModalOpen(true)}
              className="hover:text-amber-500 transition-colors flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>수업 배포 안내</span>
            </button>
            <button
              onClick={() => setIsFirebaseModalOpen(true)}
              className="hover:text-amber-500 transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isFirebaseConnected ? 'Firebase 동기화 중' : '데이터 저장 설정'}</span>
            </button>
            <span>© 중학교 체육 배구 프로젝트</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
