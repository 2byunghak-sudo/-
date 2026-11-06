import React, { useState, useEffect } from 'react';
import { REFEREE_SIGNALS } from '../data/volleyballData';
import { soundService } from '../services/sound';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  Clock, 
  Volume2, 
  Play, 
  Pause, 
  CheckCircle2, 
  ChevronRight,
  ShieldAlert,
  ArrowRightLeft,
  Users
} from 'lucide-react';

export const ScoreboardSection: React.FC = () => {
  const [teamAName, setTeamAName] = useState<string>('A팀 (청팀)');
  const [teamBName, setTeamBName] = useState<string>('B팀 (백팀)');
  
  const [scoreA, setScoreA] = useState<number>(0);
  const [scoreB, setScoreB] = useState<number>(0);
  const [setsA, setSetsA] = useState<number>(0);
  const [setsB, setSetsB] = useState<number>(0);
  
  const [serveTeam, setServeTeam] = useState<'A' | 'B'>('A');
  const [targetSetPoints, setTargetSetPoints] = useState<number>(25); // 25 points or 15 points
  const [setWinner, setSetWinner] = useState<string | null>(null);

  // Timeout 30-second timer
  const [timeoutSeconds, setTimeoutSeconds] = useState<number>(30);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [activeTimeoutTeam, setActiveTimeoutTeam] = useState<string | null>(null);

  // Active Referee signal modal
  const [showSignalsModal, setShowSignalsModal] = useState<boolean>(false);

  // Check Set Victory Condition (25 points or 15, must lead by at least 2)
  const isDeuce = scoreA >= targetSetPoints - 1 && scoreB >= targetSetPoints - 1;

  const checkVictory = (newA: number, newB: number) => {
    if (newA >= targetSetPoints && newA - newB >= 2) {
      setSetWinner(teamAName);
      setSetsA(prev => prev + 1);
      soundService.playWhistle();
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch {}
    } else if (newB >= targetSetPoints && newB - newA >= 2) {
      setSetWinner(teamBName);
      setSetsB(prev => prev + 1);
      soundService.playWhistle();
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const handleScoreChange = (team: 'A' | 'B', delta: number) => {
    soundService.playBallHit();
    if (team === 'A') {
      const next = Math.max(0, scoreA + delta);
      setScoreA(next);
      if (delta > 0) {
        setServeTeam('A');
        checkVictory(next, scoreB);
      }
    } else {
      const next = Math.max(0, scoreB + delta);
      setScoreB(next);
      if (delta > 0) {
        setServeTeam('B');
        checkVictory(scoreA, next);
      }
    }
  };

  const handleSwitchSides = () => {
    soundService.playWhistle();
    // Swap teams
    const tempName = teamAName;
    setTeamAName(teamBName);
    setTeamBName(tempName);

    const tempScore = scoreA;
    setScoreA(scoreB);
    setScoreB(tempScore);

    const tempSets = setsA;
    setSetsA(setsB);
    setSetsB(tempSets);

    setServeTeam(serveTeam === 'A' ? 'B' : 'A');
  };

  const handleNextSet = () => {
    soundService.playWhistle();
    setScoreA(0);
    setScoreB(0);
    setSetWinner(null);
  };

  const handleResetMatch = () => {
    if (confirm('점수를 모두 초기화하시겠습니까?')) {
      soundService.playClick();
      setScoreA(0);
      setScoreB(0);
      setSetsA(0);
      setSetsB(0);
      setSetWinner(null);
      setIsTimerRunning(false);
      setTimeoutSeconds(30);
    }
  };

  // 30s Timeout countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeoutSeconds > 0) {
      interval = setInterval(() => {
        setTimeoutSeconds(prev => {
          if (prev <= 1) {
            soundService.playWhistle();
            setIsTimerRunning(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeoutSeconds]);

  const startTimeout = (team: string) => {
    soundService.playWhistle();
    setActiveTimeoutTeam(team);
    setTimeoutSeconds(30);
    setIsTimerRunning(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-amber-500 inline-block"></span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              실전 경기 스코어보드 & 심판 도우미
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            중학교 체육 실습 경기, 리그전, 랠리 포인트를 쉽게 기록하고 서브권과 듀스를 자동 판별합니다.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Target points toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => {
                soundService.playClick();
                setTargetSetPoints(25);
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                targetSetPoints === 25 ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              25점 정규
            </button>
            <button
              onClick={() => {
                soundService.playClick();
                setTargetSetPoints(15);
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                targetSetPoints === 15 ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              15점 단축
            </button>
          </div>

          <button
            onClick={handleSwitchSides}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors"
            title="코트 체인지 (좌우 팀 맞교환)"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>코트 체인지</span>
          </button>

          <button
            onClick={() => {
              soundService.playWhistle();
              setShowSignalsModal(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-200"
          >
            <span>심판 수신호 도감</span>
          </button>

          <button
            onClick={handleResetMatch}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
            title="점수 초기화"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Deuce Notification Banner */}
      {isDeuce && !setWinner && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-center font-black text-sm animate-pulse flex items-center justify-center gap-2">
          <span>🔥 듀스(Deuce) 상황! 상대팀보다 먼저 2점 차이를 벌려야 승리합니다!</span>
        </div>
      )}

      {/* Set Winner Modal/Banner */}
      {setWinner && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center shadow-lg animate-fadeIn">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-2xl sm:text-3xl font-black mb-1">
            {setWinner} 세트 승리!
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 mb-4">
            최종 점수: {scoreA} 대 {scoreB}
          </p>
          <button
            onClick={handleNextSet}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-md transition-all"
          >
            다음 세트 시작하기 (점수 리셋)
          </button>
        </div>
      )}

      {/* Main Scoreboard Display Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E9ECEF] dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        {/* Set Score indicator */}
        <div className="text-center mb-6">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            세트 스코어 (Sets Won)
          </span>
          <div className="flex items-center justify-center gap-6 mt-2">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {setsA}
            </span>
            <span className="text-slate-300 dark:text-slate-700 font-bold">:</span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {setsB}
            </span>
          </div>
        </div>

        {/* 2-Column Team Score Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Team A Card */}
          <div className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between ${
            serveTeam === 'A'
              ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20 ring-4 ring-blue-500/10'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={teamAName}
                  onChange={(e) => setTeamAName(e.target.value)}
                  className="font-extrabold text-base sm:text-lg bg-transparent text-slate-900 dark:text-white border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none max-w-[180px]"
                />
                {serveTeam === 'A' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-600 text-white flex items-center gap-1 shadow-sm animate-pulse">
                    🏐 서브권
                  </span>
                )}
              </div>

              {/* Big Score Display */}
              <div className="text-center py-6">
                <span className="font-mono text-7xl sm:text-8xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">
                  {scoreA}
                </span>
              </div>
            </div>

            {/* Score Controls */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleScoreChange('A', 1)}
                  className="py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-2xl shadow-md shadow-blue-500/30 transition-all"
                >
                  +1
                </button>
                <button
                  onClick={() => handleScoreChange('A', -1)}
                  className="py-4 rounded-2xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xl transition-all"
                >
                  -1
                </button>
              </div>

              <button
                onClick={() => startTimeout(teamAName)}
                className="w-full py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 hover:bg-blue-50"
              >
                ⏱️ {teamAName} 작전타임 (30초)
              </button>
            </div>
          </div>

          {/* Team B Card */}
          <div className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between ${
            serveTeam === 'B'
              ? 'border-rose-500 bg-rose-50/30 dark:bg-rose-950/20 ring-4 ring-rose-500/10'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={teamBName}
                  onChange={(e) => setTeamBName(e.target.value)}
                  className="font-extrabold text-base sm:text-lg bg-transparent text-slate-900 dark:text-white border-b border-transparent hover:border-slate-300 focus:border-rose-500 focus:outline-none max-w-[180px]"
                />
                {serveTeam === 'B' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-600 text-white flex items-center gap-1 shadow-sm animate-pulse">
                    🏐 서브권
                  </span>
                )}
              </div>

              {/* Big Score Display */}
              <div className="text-center py-6">
                <span className="font-mono text-7xl sm:text-8xl font-black text-rose-600 dark:text-rose-400 tracking-tighter">
                  {scoreB}
                </span>
              </div>
            </div>

            {/* Score Controls */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleScoreChange('B', 1)}
                  className="py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-2xl shadow-md shadow-rose-500/30 transition-all"
                >
                  +1
                </button>
                <button
                  onClick={() => handleScoreChange('B', -1)}
                  className="py-4 rounded-2xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xl transition-all"
                >
                  -1
                </button>
              </div>

              <button
                onClick={() => startTimeout(teamBName)}
                className="w-full py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-50"
              >
                ⏱️ {teamBName} 작전타임 (30초)
              </button>
            </div>
          </div>
        </div>

        {/* 30-Second Timeout Active Overlay / Card */}
        {isTimerRunning && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-500 text-white flex items-center justify-between shadow-lg animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-lg">
                ⏱️
              </div>
              <div>
                <span className="font-bold text-sm block">
                  [{activeTimeoutTeam}] 30초 작전타임 진행 중
                </span>
                <span className="text-xs text-amber-100">
                  시간 종료 시 자동으로 체육선생님 휘슬 호각 소리가 울립니다.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-3xl font-black">
                {timeoutSeconds}초
              </span>
              <button
                onClick={() => setIsTimerRunning(false)}
                className="px-3 py-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-xs font-bold"
              >
                종료
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Referee Hand Signals Reference Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E9ECEF] dark:border-slate-800 p-6 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              배구 심판 수신호 (주심 & 부심 판정 가이드)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              체육 수업 경기에서 심판을 맡은 학생이 취해야 할 올바른 제스처와 콜입니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {REFEREE_SIGNALS.map((sig) => (
            <div
              key={sig.id}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-1.5">
                <strong className="text-sm font-bold text-slate-900 dark:text-white">
                  {sig.name}
                </strong>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  {sig.call}
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-200 font-semibold mb-1">
                👉 {sig.action}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-tight">
                {sig.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
