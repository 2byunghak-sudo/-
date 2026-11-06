import React, { useState, useEffect } from 'react';
import { StudentLogEntry } from '../types';
import { firebaseService } from '../services/firebase';
import { soundService } from '../services/sound';
import { 
  ClipboardList, 
  Save, 
  Star, 
  CheckCircle, 
  Trash2, 
  Printer, 
  Cloud, 
  CloudCheck, 
  Plus, 
  Minus,
  Sparkles,
  Calendar,
  User,
  Clock,
  ExternalLink
} from 'lucide-react';

interface LearningLogProps {
  initialSkill?: string;
  onOpenFirebaseModal: () => void;
  isFirebaseConnected: boolean;
}

export const LearningLog: React.FC<LearningLogProps> = ({
  initialSkill,
  onOpenFirebaseModal,
  isFirebaseConnected,
}) => {
  const [studentName, setStudentName] = useState<string>(() => localStorage.getItem('volleyball_student_name') || '');
  const [studentNumber, setStudentNumber] = useState<string>(() => localStorage.getItem('volleyball_student_num') || '');
  const [targetSkill, setTargetSkill] = useState<string>(initialSkill || '언더핸드 패스');
  const [consecutiveCount, setConsecutiveCount] = useState<number>(0);
  const [selfRating, setSelfRating] = useState<number>(4);
  const [reflection, setReflection] = useState<string>('');
  const [nextGoal, setNextGoal] = useState<string>('');

  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    '준비 자세에서 무릎을 굽히고 공의 낙하지점을 미리 선점했다.': true,
    '임팩트 순간 팔꿈치나 손목 모양을 곧게 유지했다.': true,
    '팀원들과 "마이(내가 칠게)!"를 크고 명확하게 외치며 소통했다.': true,
    '연습 후 체육관 기물과 배구공을 안전하게 정리했다.': true,
  });

  const [logs, setLogs] = useState<StudentLogEntry[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Sync initial skill if changed from parent
  useEffect(() => {
    if (initialSkill) {
      setTargetSkill(initialSkill);
    }
  }, [initialSkill]);

  // Load existing logs and subscribe
  useEffect(() => {
    const unsub = firebaseService.subscribeToLogs((fetchedLogs) => {
      setLogs(fetchedLogs);
    });
    return () => unsub();
  }, []);

  const handleRatingChange = (star: number) => {
    soundService.playClick();
    setSelfRating(star);
  };

  const handleToggleCheck = (key: string) => {
    soundService.playClick();
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert('학생 이름을 입력해 주세요.');
      return;
    }

    setIsSaving(true);
    soundService.playWhistle();

    // Cache user name/num for convenience
    localStorage.setItem('volleyball_student_name', studentName);
    localStorage.setItem('volleyball_student_num', studentNumber);

    try {
      const todayStr = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short'
      });

      const entry = await firebaseService.saveStudentLog({
        studentName,
        studentNumber: studentNumber || '미기재',
        date: todayStr,
        targetSkill,
        consecutiveSuccessCount: consecutiveCount,
        selfRating,
        checkListResults: checklist,
        reflection: reflection || '오늘 최선을 다해 연습했습니다!',
        nextGoal: nextGoal || '다음 시간에도 연속 10회 도전을 이어가기',
      });

      setLogs(prev => [entry, ...prev.filter(l => l.id !== entry.id)]);
      setSaveSuccessMsg(entry.syncedToFirebase ? '클라우드 & 로컬에 안전하게 저장되었습니다!' : '기기에 저장되었습니다!');
      setTimeout(() => setSaveSuccessMsg(null), 3500);

      // Reset form partially
      setReflection('');
      setNextGoal('');
      setConsecutiveCount(0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('이 기록을 삭제하시겠습니까?')) {
      soundService.playClick();
      firebaseService.deleteLog(id);
      setLogs(prev => prev.filter(l => l.id !== id));
    }
  };

  const handlePrint = () => {
    soundService.playClick();
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-amber-500 inline-block"></span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              나의 배구 배움일지 (체육 수행평가 실천 포트폴리오)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            오늘 수업에서 실천한 배구 기술과 연속 성공 기록, 자기성찰을 기록하면 
            {isFirebaseConnected ? ' 실시간 클라우드 DB에 자동 동기화' : ' 기기에 안전하게 자동 보관'}됩니다.
          </p>
        </div>

        {/* Cloud Status & Print */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenFirebaseModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              isFirebaseConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {isFirebaseConnected ? <CloudCheck className="w-4 h-4 text-emerald-500" /> : <Cloud className="w-4 h-4 text-slate-400" />}
            <span>{isFirebaseConnected ? 'Firebase 실시간 연동 중' : '클라우드 DB 연동 설정'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
            title="선생님 제출용 인쇄/PDF 저장"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">일지 인쇄/PDF</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-bold flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            {saveSuccessMsg}
          </span>
          <span className="text-xs opacity-75">자동 저장 완료</span>
        </div>
      )}

      {/* Main Journal Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E9ECEF] dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Student Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-500" />
                학생 성명 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="예: 김배구"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <ClipboardList className="w-3.5 h-3.5 text-amber-500" />
                학년 / 반 / 번호
              </label>
              <input
                type="text"
                placeholder="예: 2학년 3반 15번"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                오늘의 집중 연습 기술
              </label>
              <select
                value={targetSkill}
                onChange={(e) => setTargetSkill(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="언더핸드 패스">언더핸드 패스 (수비 리시브)</option>
                <option value="오버핸드 패스 / 토스">오버핸드 패스 / 토스</option>
                <option value="언더핸드 서브">언더핸드 서브</option>
                <option value="오버핸드 / 플로터 서브">오버핸드 / 플로터 서브</option>
                <option value="스파이크 & 3보 도움닫기">스파이크 & 3보 도움닫기</option>
                <option value="블로킹 & 네트 앞 수비">블로킹 & 네트 앞 수비</option>
                <option value="로테이션 및 W대형 실전 경기">로테이션 및 W대형 실전 경기</option>
              </select>
            </div>
          </div>

          {/* Practice Success Counter & Self Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            {/* Success Counter */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                오늘 연속 성공 횟수 (개인 또는 2인 1조 미션)
              </span>
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    soundService.playClick();
                    setConsecutiveCount(Math.max(0, consecutiveCount - 1));
                  }}
                  className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-100"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="px-5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xl font-extrabold text-amber-500 min-w-[70px] text-center shadow-sm">
                  {consecutiveCount}회
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundService.playBallHit();
                    setConsecutiveCount(consecutiveCount + 1);
                  }}
                  className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold hover:bg-amber-600 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundService.playBallHit();
                    setConsecutiveCount(consecutiveCount + 5);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300"
                >
                  +5회
                </button>
              </div>
            </div>

            {/* Self Rating Star Picker */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                오늘 나의 수업 참여도 및 집중도 자기평가
              </span>
              <div className="flex items-center gap-1.5 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= selfRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-300 dark:fill-slate-700 dark:text-slate-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                  {selfRating}점 / 5점
                </span>
              </div>
            </div>
          </div>

          {/* Practice Checkpoints */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              수업 실천 체크리스트 (해당 사항에 체크)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Object.keys(checklist).map((itemKey) => {
                const isChecked = checklist[itemKey];
                return (
                  <div
                    key={itemKey}
                    onClick={() => handleToggleCheck(itemKey)}
                    className={`cursor-pointer p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                      isChecked
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-amber-500"
                    />
                    <span className="font-medium">{itemKey}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reflection & Next Goal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                오늘의 배움 성찰 (잘된 점 & 보완할 점)
              </label>
              <textarea
                rows={3}
                placeholder="예: 공 밑으로 발을 먼저 움직여서 언더핸드를 하니 공이 흔들리지 않고 세터에게 정확히 갔다. 다음에는 손목 각도를 더 일정하게 유지해야겠다."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                다음 체육 시간 나의 도전 목표
              </label>
              <textarea
                rows={3}
                placeholder="예: 서브 성공률 80% 달성하기, 팀원에게 '나이스 리시브' 큰 소리로 칭찬하기"
                value={nextGoal}
                onChange={(e) => setNextGoal(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? '기록 저장 중...' : '배움일지 안전하게 저장하기'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Historical Student Records */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-amber-500" />
            <span>나의 누적 배움 기록 ({logs.length}건)</span>
          </h3>
          <span className="text-xs text-slate-500">
            {isFirebaseConnected ? '클라우드 DB 동기화됨' : '기기 로컬 스토리지에 보관 중'}
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            아직 작성된 배움일지가 없습니다. 위 입력창에 오늘의 연습 내용을 기록해 보세요!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E9ECEF] dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900 dark:text-white">
                        {log.studentName}
                      </span>
                      <span className="text-xs text-slate-500">
                        {log.studentNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {log.syncedToFirebase ? (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CloudCheck className="w-3 h-3" /> 클라우드
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          로컬
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="기록 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {log.date}
                    </span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      • {log.targetSkill}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold">
                      연속 {log.consecutiveSuccessCount}회 성공
                    </span>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: log.selfRating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 mb-2 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                    <strong className="block text-slate-900 dark:text-white font-bold mb-1">배움 성찰:</strong>
                    {log.reflection}
                  </p>

                  {log.nextGoal && (
                    <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium pl-1">
                      🎯 다음 목표: {log.nextGoal}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
