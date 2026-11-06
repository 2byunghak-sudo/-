import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/volleyballData';
import { QuizQuestion } from '../types';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { soundService } from '../services/sound';

export const QuizSection: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number | boolean>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showReviewOnly, setShowReviewOnly] = useState<boolean>(false);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIdx];
  const hasAnsweredCurrent = userAnswers[currentQ.id] !== undefined;

  const handleAnswer = (ans: number | boolean) => {
    if (hasAnsweredCurrent) return;

    setUserAnswers(prev => ({ ...prev, [currentQ.id]: ans }));
    setShowExplanation(true);

    const isCorrect = ans === currentQ.answer;
    if (isCorrect) {
      soundService.playCorrect();
    } else {
      soundService.playWrong();
    }
  };

  const handleNext = () => {
    soundService.playClick();
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setShowExplanation(false);
    } else {
      // Completed all questions!
      setIsCompleted(true);
      soundService.playWhistle();

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    }
  };

  const handleRestart = () => {
    soundService.playClick();
    setCurrentIdx(0);
    setUserAnswers({});
    setShowExplanation(false);
    setIsCompleted(false);
    setShowReviewOnly(false);
  };

  // Score Calculation
  const totalQuestions = QUIZ_QUESTIONS.length;
  const correctCount = QUIZ_QUESTIONS.filter(q => userAnswers[q.id] === q.answer).length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  const getTierBadge = (score: number) => {
    if (score === 100) return { title: '🏆 배구 국가대표급 마스터', desc: '완벽합니다! 모든 규칙과 기능을 완벽하게 꿰뚫고 있어요.', color: 'from-amber-500 to-yellow-400' };
    if (score >= 80) return { title: '⚡ 팀의 주전 에이스', desc: '훌륭해요! 실전 경기와 수행평가에서 뛰어난 활약을 펼칠 준비가 되었습니다.', color: 'from-emerald-500 to-teal-500' };
    if (score >= 60) return { title: '🏐 무한 잠재력 배구 유망주', desc: '좋아요! 오답 노트를 한 번 더 복습하면 완벽한 에이스가 될 수 있습니다.', color: 'from-blue-500 to-indigo-500' };
    return { title: '🌱 기초 튼튼 배구 꿈나무', desc: '배구 규칙 이론과 기본 기능을 다시 한번 차근차근 복습해 보세요!', color: 'from-purple-500 to-rose-500' };
  };

  const tier = getTierBadge(scorePercent);

  // Completed Screen
  if (isCompleted) {
    const wrongQuestions = QUIZ_QUESTIONS.filter(q => userAnswers[q.id] !== q.answer);

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn select-none">
        {/* Results Hero Card */}
        <div className="text-center p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9ECEF] dark:border-slate-800 shadow-md">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-4xl shadow-lg shadow-orange-500/20">
            {scorePercent >= 80 ? '🏅' : '🏐'}
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-bold mb-2">
            체육과 형성평가 최종 결과
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2">
            {scorePercent}점 / 100점
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            총 {totalQuestions}문제 중 <strong className="text-amber-500 font-bold">{correctCount}문제</strong>를 맞혔습니다.
          </p>

          <div className={`mt-6 p-4 rounded-2xl bg-gradient-to-r ${tier.color} text-white shadow-sm`}>
            <span className="text-lg font-black block mb-1">{tier.title}</span>
            <p className="text-xs text-white/90">{tier.desc}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/25 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>처음부터 다시 풀기</span>
            </button>
            {wrongQuestions.length > 0 && (
              <button
                onClick={() => {
                  soundService.playClick();
                  setShowReviewOnly(!showReviewOnly);
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-rose-500" />
                <span>{showReviewOnly ? '전체 보기' : `틀린 문제 오답 노트 (${wrongQuestions.length}개)`}</span>
              </button>
            )}
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span>{showReviewOnly ? '틀린 문제 집중 복습 노트' : '전체 문항 풀이 및 해설'}</span>
          </h3>

          <div className="space-y-3">
            {(showReviewOnly ? wrongQuestions : QUIZ_QUESTIONS).map((q) => {
              const userAns = userAnswers[q.id];
              const isCorrect = userAns === q.answer;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCorrect
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {q.curriculumTopic}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        문제 {q.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      {isCorrect ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> 정답
                        </span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> 오답
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                    {q.question}
                  </p>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                      💡 정답 해설:
                    </div>
                    <p>{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz Question Screen
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn select-none">
      {/* Top Progress Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#E9ECEF] dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <Award className="w-4 h-4" />
            배구 형성평가 자가진단
          </span>
          <span>
            문제 <strong className="text-slate-900 dark:text-white text-sm">{currentIdx + 1}</strong> / {totalQuestions}
          </span>
        </div>

        {/* Linear Progress */}
        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E9ECEF] dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 mb-4">
          {currentQ.curriculumTopic} • {currentQ.type === 'ox' ? 'OX 퀴즈' : '4지선다형'}
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed mb-6">
          Q{currentIdx + 1}. {currentQ.question}
        </h2>

        {/* Answer Options: OX or 4 Choices */}
        {currentQ.type === 'ox' ? (
          <div className="grid grid-cols-2 gap-4">
            {[true, false].map((val) => {
              const isSelected = userAnswers[currentQ.id] === val;
              const isCorrectAnswer = currentQ.answer === val;
              let btnClass = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100';

              if (hasAnsweredCurrent) {
                if (isCorrectAnswer) {
                  btnClass = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
                } else if (isSelected && !isCorrectAnswer) {
                  btnClass = 'bg-rose-500 text-white border-rose-600';
                } else {
                  btnClass = 'opacity-40 bg-slate-100 dark:bg-slate-800 border-transparent';
                }
              }

              return (
                <button
                  key={String(val)}
                  disabled={hasAnsweredCurrent}
                  onClick={() => handleAnswer(val)}
                  className={`p-6 sm:p-8 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center font-black ${btnClass}`}
                >
                  <span className="text-4xl sm:text-5xl mb-2">{val ? '⭕ O' : '❌ X'}</span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {val ? '그렇다 (맞음)' : '아니다 (틀림)'}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {currentQ.options?.map((optionText, optIdx) => {
              const isSelected = userAnswers[currentQ.id] === optIdx;
              const isCorrectAnswer = currentQ.answer === optIdx;
              let btnClass = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100';

              if (hasAnsweredCurrent) {
                if (isCorrectAnswer) {
                  btnClass = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30';
                } else if (isSelected && !isCorrectAnswer) {
                  btnClass = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200';
                } else {
                  btnClass = 'opacity-40 bg-slate-100 dark:bg-slate-800 border-transparent';
                }
              }

              return (
                <button
                  key={optIdx}
                  disabled={hasAnsweredCurrent}
                  onClick={() => handleAnswer(optIdx)}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center gap-3 ${btnClass}`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    hasAnsweredCurrent && isCorrectAnswer
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                  }`}>
                    {optIdx + 1}
                  </span>
                  <span className="leading-relaxed">{optionText}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Immediate Feedback Explanation Drawer */}
        {showExplanation && (
          <div className="mt-6 p-5 rounded-2xl bg-amber-50/60 dark:bg-slate-800/90 border border-amber-200 dark:border-slate-700 text-xs sm:text-sm animate-fadeIn">
            <div className="flex items-center gap-2 mb-2 font-bold">
              {userAnswers[currentQ.id] === currentQ.answer ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5" /> 딩동댕! 정확하게 이해하셨네요!
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <XCircle className="w-5 h-5" /> 아쉽네요! 해설을 확인해 보세요.
                </span>
              )}
            </div>

            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              {currentQ.explanation}
            </p>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 transition-all"
              >
                <span>{currentIdx < totalQuestions - 1 ? '다음 문제 풀기' : '최종 결과 확인'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
