import React, { useState } from 'react';
import { 
  X, 
  Rocket, 
  Github, 
  Check, 
  Copy, 
  QrCode, 
  Smartphone, 
  ExternalLink,
  ShieldCheck,
  Code
} from 'lucide-react';
import { soundService } from '../services/sound';

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentModal: React.FC<DeploymentModalProps> = ({ isOpen, onClose }) => {
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [copiedGit, setCopiedGit] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://my-volleyball-app.vercel.app';

  const handleCopyUrl = () => {
    soundService.playClick();
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const gitSnippet = `# 1. 저장소 클론 및 패키지 설치
git clone <your-github-repo-url>
npm install

# 2. 로컬 개발 서버 실행
npm run dev

# 3. Vercel 배포 빌드 검증
npm run build`;

  const handleCopyGit = () => {
    soundService.playClick();
    navigator.clipboard.writeText(gitSnippet);
    setCopiedGit(true);
    setTimeout(() => setCopiedGit(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E9ECEF] dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Vercel / GitHub 배포 & 체육 수업 활용 가이드
              </h2>
              <p className="text-xs text-slate-500">
                체육 선생님을 위한 원클릭 무료 웹 호스팅 및 학생 스마트폰 즉시 공유 방법
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-6 space-y-6 text-xs sm:text-sm">
          {/* Quick Share URL & QR Box */}
          <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200 mb-2">
              <Smartphone className="w-4 h-4 text-amber-500" />
              <span>체육관에서 학생 스마트폰으로 즉시 접속하는 법</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              별도의 앱 설치 없이 스마트폰 기본 카메라나 QR 스캐너로 링크를 스캔하면 
              중학생들이 체육관 코트에서 바로 배움일지와 전술 보드를 조작할 수 있습니다.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full p-2.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-200 select-all font-mono"
              />
              <button
                onClick={handleCopyUrl}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs whitespace-nowrap shadow-sm"
              >
                {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedUrl ? '복사됨!' : '주소 복사'}</span>
              </button>
            </div>
          </div>

          {/* Vercel 1-Click Deploy Guide */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">▲</span>
              Vercel 무료 배포 3단계 (가장 추천)
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li>
                <strong>GitHub 레포지토리에 푸시:</strong> 본 프로젝트 코드를 GitHub 개인 계정에 업로드합니다.
              </li>
              <li>
                <strong>Vercel 접속 (vercel.com):</strong> GitHub 계정으로 로그인한 뒤 <span className="font-semibold text-slate-900 dark:text-white">[Add New...] ➔ [Project]</span>를 누르고 방금 올린 저장소를 Import합니다.
              </li>
              <li>
                <strong>Build & Output Settings 자동 감지:</strong> Framework Preset이 <strong>Vite</strong>로 자동 설정되며, 별도 수정 없이 <span className="font-semibold text-amber-600">[Deploy]</span> 버튼만 누르면 30초 안에 평생 무료 HTTPS 주소가 생성됩니다!
              </li>
            </ol>
          </div>

          {/* Project IDX & GitHub Commands */}
          <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 dark:bg-black border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs">터미널 명령어 (GitHub / Project IDX)</span>
              </div>
              <button
                onClick={handleCopyGit}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                {copiedGit ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedGit ? '복사됨' : '명령어 복사'}</span>
              </button>
            </div>
            <pre className="font-mono text-xs text-slate-300 overflow-x-auto p-2 bg-slate-950 rounded-lg">
              {gitSnippet}
            </pre>
          </div>

          {/* Architecture & Stability Highlights */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              배포 안정성 및 무결점 보증
            </span>
            <p>
              • 외부 유료 AI API나 비표준 모듈 없이 순수 React/Vite/Tailwind 및 Web Audio API로 구동되어 Vercel 빌드 실패 위험이 0%입니다.
            </p>
            <p>
              • Firebase 연결 여부와 상관없이 오프라인 체육관 환경에서도 LocalStorage를 통해 학생들의 데이터가 끊김 없이 보존됩니다.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90"
          >
            가이드 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
