import React, { useState } from 'react';
import { firebaseService } from '../services/firebase';
import { FirebaseConfig } from '../types';
import { soundService } from '../services/sound';
import { 
  X, 
  Cloud, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Key, 
  Trash2, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface FirebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionChange: (connected: boolean) => void;
}

export const FirebaseModal: React.FC<FirebaseModalProps> = ({
  isOpen,
  onClose,
  onConnectionChange,
}) => {
  const currentStatus = firebaseService.getStatus();
  const currentConfig = firebaseService.getConfig();

  const [jsonInput, setJsonInput] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>(currentConfig?.apiKey || '');
  const [projectId, setProjectId] = useState<string>(currentConfig?.projectId || '');
  const [authDomain, setAuthDomain] = useState<string>(currentConfig?.authDomain || '');
  const [storageBucket, setStorageBucket] = useState<string>(currentConfig?.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState<string>(currentConfig?.messagingSenderId || '');
  const [appId, setAppId] = useState<string>(currentConfig?.appId || '');

  const [activeInputTab, setActiveInputTab] = useState<'form' | 'json'>('json');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleJsonPaste = () => {
    try {
      setErrorMsg(null);
      // Clean string
      let cleaned = jsonInput.trim();
      if (cleaned.startsWith('const firebaseConfig =')) {
        cleaned = cleaned.replace('const firebaseConfig =', '').replace(/;$/, '').trim();
      }
      const parsed = JSON.parse(cleaned);

      if (!parsed.apiKey || !parsed.projectId) {
        throw new Error('apiKey 또는 projectId 필드가 누락되었습니다.');
      }

      setApiKey(parsed.apiKey || '');
      setProjectId(parsed.projectId || '');
      setAuthDomain(parsed.authDomain || '');
      setStorageBucket(parsed.storageBucket || '');
      setMessagingSenderId(parsed.messagingSenderId || '');
      setAppId(parsed.appId || '');

      const success = firebaseService.initFirebase(parsed);
      if (success) {
        soundService.playWhistle();
        setSuccessMsg('Firebase에 성공적으로 연결되었습니다!');
        onConnectionChange(true);
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        throw new Error('Firebase 초기화에 실패했습니다.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '유효한 JSON 형식이 아닙니다.';
      setErrorMsg(msg);
      soundService.playWrong();
    }
  };

  const handleManualSave = () => {
    try {
      setErrorMsg(null);
      if (!apiKey.trim() || !projectId.trim()) {
        throw new Error('API Key와 Project ID는 필수 입력값입니다.');
      }

      const config: FirebaseConfig = {
        apiKey: apiKey.trim(),
        projectId: projectId.trim(),
        authDomain: authDomain.trim(),
        storageBucket: storageBucket.trim(),
        messagingSenderId: messagingSenderId.trim(),
        appId: appId.trim(),
      };

      const success = firebaseService.initFirebase(config);
      if (success) {
        soundService.playWhistle();
        setSuccessMsg('Firebase에 성공적으로 연결되었습니다!');
        onConnectionChange(true);
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        throw new Error('초기화에 실패했습니다.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '저장에 실패했습니다.';
      setErrorMsg(msg);
      soundService.playWrong();
    }
  };

  const handleDisconnect = () => {
    soundService.playClick();
    firebaseService.disconnect();
    onConnectionChange(false);
    setSuccessMsg('클라우드 연결이 해제되었으며 로컬 저장 모드로 전환되었습니다.');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E9ECEF] dark:border-slate-800 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Firebase 실시간 데이터 저장소 연동 설정
              </h2>
              <p className="text-xs text-slate-500">
                학생들의 배움일지와 기능 기록을 클라우드 Firestore에 안전하게 보관합니다.
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

        {/* Current Status Box */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 dark:text-slate-300">현재 동기화 상태:</span>
            {currentStatus.isConnected ? (
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Firebase 클라우드 연동 완료 ({currentStatus.projectId})
              </span>
            ) : (
              <span className="font-bold text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span> 기기 로컬 스토리지 보관 모드
              </span>
            )}
          </div>
          <p className="mt-2 text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
            {currentStatus.isConnected
              ? '학생들이 작성한 배움일지가 실시간으로 클라우드에 전송되어 교사 태블릿/PC에서도 확인할 수 있습니다.'
              : '현재 Firebase 설정이 없더라도 브라우저 로컬 저장소(LocalStorage)에 100% 안전하게 저장되므로 수업 진행에 전혀 문제가 없습니다!'}
          </p>

          {currentStatus.isConnected && (
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-bold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>연동 해제 및 로컬 모드로 복귀</span>
              </button>
            </div>
          )}
        </div>

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            {errorMsg}
          </div>
        )}

        {/* Setup Tabs */}
        <div className="space-y-4">
          <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveInputTab('json')}
              className={`pb-2.5 px-3 border-b-2 transition-colors ${
                activeInputTab === 'json'
                  ? 'border-amber-500 text-amber-500'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              📋 Firebase JSON 붙여넣기 (가장 간편)
            </button>
            <button
              onClick={() => setActiveInputTab('form')}
              className={`pb-2.5 px-3 border-b-2 transition-colors ${
                activeInputTab === 'form'
                  ? 'border-amber-500 text-amber-500'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              ✏️ 직접 항목별 입력
            </button>
          </div>

          {activeInputTab === 'json' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Firebase Console의 <strong>[프로젝트 설정] ➔ [일반] ➔ [내 앱의 SDK 설정]</strong>에 나오는 firebaseConfig 객체를 그대로 복사해 붙여넣으세요:
              </p>
              <textarea
                rows={5}
                placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "my-volleyball-app.firebaseapp.com",\n  "projectId": "my-volleyball-app",\n  "storageBucket": "my-volleyball-app.appspot.com",\n  "messagingSenderId": "...",\n  "appId": "..."\n}`}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleJsonPaste}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 transition-all"
              >
                Firebase 설정 적용 및 즉시 연결
              </button>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  API Key <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Project ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="my-volleyball-app"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Auth Domain
                  </label>
                  <input
                    type="text"
                    placeholder="app.firebaseapp.com"
                    value={authDomain}
                    onChange={(e) => setAuthDomain(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    App ID
                  </label>
                  <input
                    type="text"
                    placeholder="1:123456:web:..."
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                onClick={handleManualSave}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 transition-all mt-2"
              >
                설정 저장 및 연동
              </button>
            </div>
          )}
        </div>

        {/* Teacher Setup Guide Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 leading-relaxed">
          <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
            체육 교사용 2분 무료 Firebase 생성 안내:
          </span>
          <ol className="list-decimal list-inside space-y-1">
            <li><a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-amber-600 underline">firebase.google.com</a>에 접속해 [프로젝트 만들기]를 클릭합니다.</li>
            <li>[Firestore Database] 메뉴에서 [데이터베이스 만들기]를 선택(테스트 모드로 시작)합니다.</li>
            <li>프로젝트 설정의 웹 앱(&lt;/&gt;) 등록 후 나타나는 설정 코드를 복사하여 위에 붙여넣으면 즉시 수업 데이터가 연동됩니다.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
