import React, { useState } from 'react';
import { VOLLEYBALL_SKILLS } from '../data/volleyballData';
import { VolleyballSkill, ActiveTab } from '../types';
import { 
  CheckCircle, 
  AlertCircle, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import { soundService } from '../services/sound';

interface SkillsSectionProps {
  onSelectSkillForLog?: (skillName: string) => void;
  setActiveTab?: (tab: ActiveTab) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  onSelectSkillForLog,
  setActiveTab
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState<string>('underhand-pass');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const activeSkill: VolleyballSkill = 
    VOLLEYBALL_SKILLS.find(s => s.id === selectedSkillId) || VOLLEYBALL_SKILLS[0];

  const handleCheckboxToggle = (itemText: string) => {
    soundService.playClick();
    setCheckedItems(prev => ({
      ...prev,
      [itemText]: !prev[itemText]
    }));
  };

  const handleJumpToLog = () => {
    soundService.playWhistle();
    if (onSelectSkillForLog) {
      onSelectSkillForLog(activeSkill.koreanName);
    }
    if (setActiveTab) {
      setActiveTab('log');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Skill Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-amber-500 inline-block"></span>
            배구 4대 기본 기능 마스터 가이드
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            중학교 체육 수행평가와 실전 경기에서 가장 중요한 기본자세와 핵심 팁을 단계별로 익혀보세요.
          </p>
        </div>

        {/* Skill Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {VOLLEYBALL_SKILLS.map((skill) => {
            const isSelected = skill.id === selectedSkillId;
            return (
              <button
                key={skill.id}
                onClick={() => {
                  soundService.playClick();
                  setSelectedSkillId(skill.id);
                  setCheckedItems({});
                }}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center border ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300 dark:ring-amber-800'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{skill.category}</span>
                <span className="text-[13px] tracking-tight truncate w-full mt-0.5">
                  {skill.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Skill Focus Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#E9ECEF] dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                {activeSkill.category}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {activeSkill.name}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {activeSkill.koreanName}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-2xl font-medium">
              {activeSkill.importance}
            </p>
          </div>

          {/* Action: Practice Audio & Jump to Log */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
            <button
              onClick={() => {
                soundService.playBallHit();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              title="임팩트 타구 소리 듣기"
            >
              <Volume2 className="w-4 h-4 text-amber-500" />
              <span>타구음 체험</span>
            </button>
            <button
              onClick={handleJumpToLog}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 transition-all"
            >
              <span>이 기술로 배움일지 작성</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tactical Diagram & Core Posture Points */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
          {/* Posture Checkpoints (8 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-500" />
              핵심 자세 및 동작 포인트 (체육선생님 가이드)
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {activeSkill.posturePoints.map((point, idx) => {
                const [title, desc] = point.split(': ');
                return (
                  <div 
                    key={idx} 
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <strong className="text-slate-900 dark:text-white font-bold text-sm">
                        {title}
                      </strong>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 pl-7 leading-relaxed">
                      {desc || title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Interactive Diagram / Illustration Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/50 dark:from-slate-800 dark:to-slate-800/70 border border-amber-200 dark:border-slate-700">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  동작 시각화 다이어그램
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-slate-700">
                  표준 자세
                </span>
              </div>

              {/* Dynamic SVG graphic for each skill */}
              <div className="relative w-full h-48 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-slate-700 flex items-center justify-center overflow-hidden p-2">
                {selectedSkillId === 'underhand-pass' && (
                  <svg viewBox="0 0 300 180" className="w-full h-full">
                    {/* Floor line */}
                    <line x1="20" y1="160" x2="280" y2="160" stroke="#94A3B8" strokeWidth="3" />
                    {/* Player Silhouette Simplified for clear mechanics */}
                    {/* Bent knees and body */}
                    <circle cx="110" cy="50" r="16" fill="#F59E0B" />
                    {/* Torso tilted forward */}
                    <line x1="110" y1="66" x2="135" y2="110" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" />
                    {/* Bent legs */}
                    <polyline points="135,110 160,135 155,160" fill="none" stroke="#1E293B" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="130,110 120,135 125,160" fill="none" stroke="#475569" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Outstretched arms straight */}
                    <line x1="115" y1="78" x2="185" y2="105" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
                    {/* Locked hands */}
                    <ellipse cx="190" cy="107" rx="8" ry="6" fill="#D97706" />
                    {/* Volleyball incoming trajectory */}
                    <path d="M 260 30 Q 210 80 188 100" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="4,4" />
                    {/* Volleyball target arc */}
                    <path d="M 188 100 Q 150 20 80 40" fill="none" stroke="#10B981" strokeWidth="3" markerEnd="url(#arrow)" />
                    {/* Volleyball Ball */}
                    <circle cx="205" cy="85" r="13" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
                    <text x="205" y="89" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#78350F">🏐</text>
                    <text x="190" y="130" fontSize="10" fontWeight="bold" fill="#F59E0B" textAnchor="middle">손목 위 5~10cm</text>
                    <text x="75" y="145" fontSize="11" fontWeight="bold" fill="#3B82F6">무릎 굽힘 45°</text>
                  </svg>
                )}

                {selectedSkillId === 'overhand-pass' && (
                  <svg viewBox="0 0 300 180" className="w-full h-full">
                    <line x1="20" y1="160" x2="280" y2="160" stroke="#94A3B8" strokeWidth="3" />
                    {/* Player Head */}
                    <circle cx="150" cy="65" r="16" fill="#F59E0B" />
                    {/* Torso straight upright */}
                    <line x1="150" y1="81" x2="150" y2="125" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" />
                    {/* Legs slightly spring bent */}
                    <polyline points="150,125 140,142 142,160" fill="none" stroke="#1E293B" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="150,125 160,142 158,160" fill="none" stroke="#475569" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Arms raised up to forehead */}
                    <line x1="145" y1="88" x2="128" y2="60" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
                    <line x1="128" y1="60" x2="142" y2="40" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
                    <line x1="155" y1="88" x2="172" y2="60" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
                    <line x1="172" y1="60" x2="158" y2="40" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
                    {/* Diamond hand shape on forehead */}
                    <polygon points="144,38 150,33 156,38 150,44" fill="none" stroke="#EF4444" strokeWidth="2" />
                    {/* Ball on top of diamond */}
                    <circle cx="150" cy="24" r="14" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
                    <text x="150" y="28" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#78350F">🏐</text>
                    <text x="150" y="115" fontSize="10" fontWeight="bold" fill="#EF4444" textAnchor="middle">이마 위 10~15cm 삼각형</text>
                    <text x="230" y="45" fontSize="10" fontWeight="bold" fill="#10B981">손가락 탄성 패스</text>
                  </svg>
                )}

                {selectedSkillId === 'volleyball-serve' && (
                  <svg viewBox="0 0 300 180" className="w-full h-full">
                    {/* End Line */}
                    <line x1="170" y1="130" x2="170" y2="160" stroke="#EF4444" strokeWidth="3" />
                    <text x="170" y="172" fontSize="9" fontWeight="bold" fill="#EF4444" textAnchor="middle">엔드라인 (밟지 말 것!)</text>
                    <line x1="20" y1="160" x2="280" y2="160" stroke="#94A3B8" strokeWidth="3" />
                    {/* Server body */}
                    <circle cx="110" cy="65" r="15" fill="#F59E0B" />
                    <line x1="110" y1="80" x2="115" y2="125" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" />
                    <line x1="115" y1="125" x2="135" y2="160" stroke="#1E293B" strokeWidth="7" strokeLinecap="round" />
                    <line x1="115" y1="125" x2="95" y2="160" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
                    {/* Tossing arm */}
                    <line x1="112" y1="88" x2="135" y2="105" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
                    {/* Striking arm swinging back */}
                    <line x1="108" y1="88" x2="80" y2="110" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
                    {/* Serve Ball */}
                    <circle cx="138" cy="95" r="13" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
                    <text x="138" y="99" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#78350F">🏐</text>
                    {/* Ball flight trajectory over net */}
                    <path d="M 142 95 Q 220 20 280 40" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="3,3" />
                    <text x="240" y="30" fontSize="10" fontWeight="bold" fill="#10B981">네트 너머로 슛!</text>
                  </svg>
                )}

                {selectedSkillId === 'spike-and-block' && (
                  <svg viewBox="0 0 300 180" className="w-full h-full">
                    {/* Net */}
                    <line x1="210" y1="40" x2="210" y2="160" stroke="#1E293B" strokeWidth="4" />
                    <rect x="207" y="30" width="6" height="15" fill="#EF4444" />
                    <text x="210" y="25" fontSize="8" fontWeight="bold" fill="#EF4444" textAnchor="middle">NET</text>
                    <line x1="20" y1="160" x2="280" y2="160" stroke="#94A3B8" strokeWidth="3" />
                    {/* Spiker jumped high in air */}
                    <circle cx="160" cy="40" r="14" fill="#F59E0B" />
                    <line x1="160" y1="54" x2="165" y2="90" stroke="#DC2626" strokeWidth="7" strokeLinecap="round" />
                    {/* Legs pulled up in air */}
                    <polyline points="165,90 150,105 145,120" fill="none" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
                    {/* Hitting arm extended high overhead */}
                    <line x1="162" y1="58" x2="182" y2="25" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
                    {/* Ball at highest point */}
                    <circle cx="190" cy="18" r="13" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
                    <text x="190" y="22" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#78350F">🏐</text>
                    {/* Spike trajectory downward */}
                    <line x1="195" y1="22" x2="260" y2="90" stroke="#EF4444" strokeWidth="3" />
                    <text x="250" y="80" fontSize="10" fontWeight="bold" fill="#EF4444">스파이크 타구각</text>
                    {/* Blocker on other side */}
                    <line x1="235" y1="60" x2="235" y2="110" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" />
                    <line x1="235" y1="60" x2="225" y2="35" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
                    <text x="255" y="40" fontSize="9" fontWeight="bold" fill="#3B82F6">블로킹 벽</text>
                  </svg>
                )}
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold block mb-1">체육 선생님 한마디:</span>
              <p>{activeSkill.teacherTip}</p>
            </div>
          </div>
        </div>

        {/* 4 Steps Breakdown */}
        <div className="my-8">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-amber-500" />
            4단계 동작 순서 & 순간 점검 기준
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {activeSkill.steps.map((step) => (
              <div 
                key={step.step}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-500 text-white">
                      STEP {step.step}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      순서 {step.step}/4
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                  <strong>체크:</strong> {step.checkpoint}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mistakes & Solutions */}
        <div className="my-8">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            중학생들이 가장 자주 하는 실수 & 즉각 교정 처방
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {activeSkill.commonMistakes.map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 flex flex-col justify-between"
              >
                <div>
                  <span className="inline-flex items-center gap-1 font-bold text-rose-700 dark:text-rose-300 mb-2">
                    <HelpCircle className="w-3.5 h-3.5" />
                    자주 발생하는 오류 #{idx + 1}
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 font-medium mb-3">
                    {item.mistake}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 text-emerald-700 dark:text-emerald-400 font-semibold">
                  ✓ {item.fix}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Self-Checklist for Student Self-Assessment */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                나의 기능 자세 자가진단 체크리스트
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                수업 중 또는 연습 후 자신이 올바르게 실천했는지 체크해보세요!
              </p>
            </div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
              달성도: {Object.values(checkedItems).filter(Boolean).length} / {activeSkill.selfCheckItems.length}개
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3">
            {activeSkill.selfCheckItems.map((checkText, idx) => {
              const isDone = !!checkedItems[checkText];
              return (
                <div
                  key={idx}
                  onClick={() => handleCheckboxToggle(checkText)}
                  className={`cursor-pointer p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    isDone
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => {}} // handled by parent div
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span className="text-xs font-medium select-none">
                    {checkText}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleJumpToLog}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 transition-colors shadow-sm"
            >
              <span>자가진단 결과 배움일지에 저장하기</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
