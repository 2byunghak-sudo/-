import React, { useState } from 'react';
import { 
  COURT_DIMENSIONS, 
  POSITIONS_DATA, 
  VOLLEYBALL_RULES 
} from '../data/volleyballData';
import { 
  Layers, 
  AlertTriangle, 
  Hand, 
  ShieldAlert, 
  ArrowRightLeft, 
  Maximize2, 
  Zap, 
  RotateCw, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Info,
  Users
} from 'lucide-react';
import { soundService } from '../services/sound';

export const TheorySection: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('전체');
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>('three-touch');
  const [activeGenderNet, setActiveGenderNet] = useState<'boys' | 'girls'>('boys');
  const [activePositionTab, setActivePositionTab] = useState<number>(1);

  const getRuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers': return <Layers className="w-5 h-5 text-amber-500" />;
      case 'AlertTriangle': return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case 'HandStop': return <Hand className="w-5 h-5 text-orange-500" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'ArrowRightLeft': return <ArrowRightLeft className="w-5 h-5 text-blue-500" />;
      case 'Maximize2': return <Maximize2 className="w-5 h-5 text-emerald-500" />;
      case 'Zap': return <Zap className="w-5 h-5 text-indigo-500" />;
      case 'RotateCw': return <RotateCw className="w-5 h-5 text-purple-500" />;
      default: return <Info className="w-5 h-5 text-amber-500" />;
    }
  };

  const filteredRules = selectedTag === '전체' 
    ? VOLLEYBALL_RULES 
    : VOLLEYBALL_RULES.filter(r => r.tag === selectedTag);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-8 text-white shadow-lg shadow-orange-500/10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3 border border-white/25">
            <span>🏐 2022 개정 교육과정 중학교 체육과 연계</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            배구(Volleyball) 기초 이론 & 경기 규칙
          </h1>
          <p className="text-sm sm:text-base text-amber-50 font-normal leading-relaxed">
            배구는 신체 직접 접촉 없이 네트를 사이에 두고 팀원들과 호흡을 맞춰 공을 3번 이내에 넘기는 
            <strong className="font-semibold text-white"> 신사적이고 협동심 넘치는 네트형 경쟁 스포츠</strong>입니다!
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-amber-100">
            <span className="bg-black/15 px-2.5 py-1 rounded-md">✓ 부상 위험이 적은 안전한 경기</span>
            <span className="bg-black/15 px-2.5 py-1 rounded-md">✓ 리시브-토스-스파이크 3단 협동</span>
            <span className="bg-black/15 px-2.5 py-1 rounded-md">✓ 시계방향 로테이션 공평 참여</span>
          </div>
        </div>
        <div className="absolute -right-6 -bottom-8 opacity-15 text-white select-none pointer-events-none text-9xl font-black">
          🏐
        </div>
      </section>

      {/* Interactive Court Dimension Explorer */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-[#E9ECEF] dark:border-slate-800 p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                규격 가이드
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                배구 코트 규격 & 네트 높이 알아보기
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              정규 코트는 가로 18m, 세로 9m이며 네트를 기준으로 9m x 9m 정사각형 구역으로 나뉩니다.
            </p>
          </div>

          {/* Net Height Toggle for Middle School */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
            <button
              onClick={() => {
                soundService.playClick();
                setActiveGenderNet('boys');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeGenderNet === 'boys'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              중학 남학생 (2.30m)
            </button>
            <button
              onClick={() => {
                soundService.playClick();
                setActiveGenderNet('girls');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeGenderNet === 'girls'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              중학 여학생 (2.15m)
            </button>
          </div>
        </div>

        {/* Court SVG Diagram */}
        <div className="relative rounded-xl overflow-hidden border-2 border-amber-500/40 bg-gradient-to-b from-sky-50 to-amber-50 dark:from-slate-800/60 dark:to-slate-800/90 p-4 sm:p-6 mb-5">
          <svg viewBox="0 0 800 440" className="w-full h-auto drop-shadow-md select-none font-sans">
            {/* Free Zone Surround */}
            <rect x="20" y="20" width="760" height="400" rx="12" fill="#E2E8F0" className="dark:fill-slate-800" stroke="#CBD5E1" strokeWidth="2" />
            
            {/* Main Court (18m x 9m -> 640 x 320 px) */}
            <rect x="80" y="60" width="640" height="320" rx="4" fill="#F97316" fillOpacity="0.85" stroke="#FFFFFF" strokeWidth="4" />
            
            {/* Attack Zones (Front Court 3m each side -> 106.6px) */}
            <rect x="293.3" y="60" width="106.7" height="320" fill="#EA580C" fillOpacity="0.9" />
            <rect x="400" y="60" width="106.7" height="320" fill="#EA580C" fillOpacity="0.9" />

            {/* Attack Lines (3m from center line) */}
            <line x1="293.3" y1="60" x2="293.3" y2="380" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="6,4" />
            <line x1="506.7" y1="60" x2="506.7" y2="380" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="6,4" />

            {/* Center Line & Net */}
            <line x1="400" y1="50" x2="400" y2="390" stroke="#FFFFFF" strokeWidth="5" />
            {/* Net representation */}
            <line x1="400" y1="40" x2="400" y2="400" stroke="#1E293B" strokeWidth="7" strokeDasharray="4,2" />
            
            {/* Red & White Antennas */}
            <rect x="396" y="45" width="8" height="25" fill="#EF4444" rx="2" />
            <rect x="396" y="370" width="8" height="25" fill="#EF4444" rx="2" />
            <text x="400" y="35" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="bold">안테나 (외측 아웃)</text>

            {/* Service Zones (behind end lines) */}
            <line x1="60" y1="60" x2="60" y2="380" stroke="#3B82F6" strokeWidth="3" strokeDasharray="4,4" />
            <line x1="740" y1="60" x2="740" y2="380" stroke="#3B82F6" strokeWidth="3" strokeDasharray="4,4" />

            {/* Dimension Labels */}
            <text x="400" y="215" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="800">
              NET (네트)
            </text>
            <text x="400" y="235" textAnchor="middle" fill="#FEF08A" fontSize="13" fontWeight="bold">
              {activeGenderNet === 'boys' ? '중학 남: 2.30m' : '중학 여: 2.15m'}
            </text>

            {/* Left Court (Team A) */}
            <text x="186" y="220" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="bold">
              A팀 코트 (9m x 9m)
            </text>
            <text x="346" y="100" textAnchor="middle" fill="#FEF08A" fontSize="12" fontWeight="bold">
              전위 3m 구역
            </text>
            <text x="186" y="100" textAnchor="middle" fill="#FEF08A" fontSize="12" fontWeight="bold">
              후위 6m 구역
            </text>

            {/* Right Court (Team B) */}
            <text x="614" y="220" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="bold">
              B팀 코트 (9m x 9m)
            </text>
            <text x="454" y="100" textAnchor="middle" fill="#FEF08A" fontSize="12" fontWeight="bold">
              전위 3m 구역
            </text>
            <text x="614" y="100" textAnchor="middle" fill="#FEF08A" fontSize="12" fontWeight="bold">
              후위 6m 구역
            </text>

            {/* Overall Dimensions text */}
            <text x="400" y="415" textAnchor="middle" fill="#475569" fontSize="12" fontWeight="bold">
              ◀ 총 경기장 길이: 18m (엔드라인 사이) ▶
            </text>
            <text x="750" y="220" textAnchor="middle" fill="#475569" fontSize="12" fontWeight="bold" transform="rotate(90, 750, 220)">
              ◀ 코트 너비: 9m ▶
            </text>
          </svg>
        </div>

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5">전체 코트 규격</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">18m × 9m</span>
            <span className="text-[11px] text-slate-500 block">팀당 9m 정방형</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5">어택 라인 (공격선)</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">네트 앞 3m</span>
            <span className="text-[11px] text-slate-500 block">전위와 후위 분리</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <span className="text-amber-700 dark:text-amber-300 block mb-0.5">중학교 네트 높이</span>
            <span className="text-sm font-bold text-amber-900 dark:text-amber-100">
              남 2.30m / 여 2.15m
            </span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 block">(성인: 남 2.43m / 여 2.24m)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5">수업용 배구공</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">260~280g</span>
            <span className="text-[11px] text-slate-500 block">소프트/EVA 폼 안전 배구공</span>
          </div>
        </div>
      </section>

      {/* 8 Fundamental Rules with Interactive Filter */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-amber-500 inline-block"></span>
              중학생이 꼭 알아야 할 배구 8대 핵심 규칙
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              카드를 클릭하면 상세한 해설과 체육선생님의 꿀팁을 확인할 수 있습니다.
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {['전체', '기본', '반칙', '판정', '특수'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  soundService.playClick();
                  setSelectedTag(tag);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedTag === tag
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRules.map((rule) => {
            const isExpanded = expandedRuleId === rule.id;
            return (
              <div
                key={rule.id}
                onClick={() => {
                  soundService.playClick();
                  setExpandedRuleId(isExpanded ? null : rule.id);
                }}
                className={`cursor-pointer rounded-2xl border transition-all duration-200 p-5 bg-white dark:bg-slate-900 ${
                  isExpanded
                    ? 'border-amber-400 dark:border-amber-500 shadow-md ring-1 ring-amber-400/20'
                    : 'border-[#E9ECEF] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                      {getRuleIcon(rule.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {rule.tag}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {rule.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {rule.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="p-1 text-slate-400 hover:text-slate-600">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-3 font-medium leading-relaxed">
                  {rule.summary}
                </p>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs leading-relaxed">
                    <p className="text-slate-600 dark:text-slate-300">
                      {rule.detail}
                    </p>

                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                      <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        체육선생님의 실전 꿀팁
                      </span>
                      <p className="text-amber-800 dark:text-amber-300">
                        {rule.middleSchoolTip}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                      <span className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5 mb-1">
                        <HelpCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        가장 흔한 오해 & 실수
                      </span>
                      <p className="text-rose-800 dark:text-rose-300">
                        {rule.commonMistake}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Position & Libero Deep Dive */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-[#E9ECEF] dark:border-slate-800 p-5 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            코트 위 6명의 포지션과 역할 이해하기
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
          배구는 1번부터 6번까지 번호 순서로 자리가 정해져 있으며, 각 번호마다 고유한 역할과 존이 있습니다.
        </p>

        {/* Position Tab Selectors */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
          {POSITIONS_DATA.map((pos) => {
            const isSelected = activePositionTab === pos.number;
            return (
              <button
                key={pos.number}
                onClick={() => {
                  soundService.playClick();
                  setActivePositionTab(pos.number);
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300 dark:ring-amber-800'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-lg font-extrabold">{pos.number}번</span>
                <span className="text-[11px] font-medium tracking-tight mt-0.5 truncate w-full">
                  {pos.koreanName.split(' ')[0]}
                </span>
                <span className={`text-[10px] mt-1 px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-amber-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  {pos.zone.includes('전위') ? '전위' : '후위'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Position Details */}
        {(() => {
          const activePos = POSITIONS_DATA.find(p => p.number === activePositionTab) || POSITIONS_DATA[0];
          return (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xl">
                    {activePos.number}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {activePos.koreanName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activePos.name} • {activePos.zone}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mb-4">
                {activePos.role}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white block mb-2">
                    주요 임무 & 플레이
                  </span>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    {activePos.keyResponsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white block mb-2">
                    추천되는 역량 & 플레이 스타일
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 mb-3">
                    {activePos.recommendedTraits}
                  </p>
                  <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-[11px]">
                    💡 <strong>로테이션 팁:</strong> 우리 팀이 서브권을 새로 얻으면, 2번 자리에 있던 선수가 1번 자리로 이동하여 서브를 넣게 됩니다!
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>
    </div>
  );
};
