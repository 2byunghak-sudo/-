export type ActiveTab = 'theory' | 'skills' | 'tactics' | 'quiz' | 'log' | 'scoreboard';

export interface RuleItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  tag: '기본' | '반칙' | '판정' | '특수';
  summary: string;
  detail: string;
  middleSchoolTip: string;
  commonMistake: string;
}

export interface SkillStep {
  step: number;
  title: string;
  description: string;
  checkpoint: string;
}

export interface VolleyballSkill {
  id: string;
  name: string;
  koreanName: string;
  category: '패스' | '서브' | '공격 및 수비';
  importance: string;
  overview: string;
  posturePoints: string[];
  steps: SkillStep[];
  commonMistakes: { mistake: string; fix: string }[];
  selfCheckItems: string[];
  teacherTip: string;
}

export interface PositionInfo {
  number: number;
  name: string;
  koreanName: string;
  role: string;
  keyResponsibilities: string[];
  recommendedTraits: string;
  zone: string;
}

export interface PlayerToken {
  id: string;
  role: string;
  positionNumber: number; // 1 to 6
  name: string;
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  color: string;
}

export interface QuizQuestion {
  id: number;
  type: 'ox' | 'choice';
  question: string;
  options?: string[];
  answer: number | boolean;
  explanation: string;
  curriculumTopic: string;
}

export interface StudentLogEntry {
  id: string;
  studentName: string;
  studentNumber: string; // e.g. 2학년 3반 15번
  date: string;
  targetSkill: string;
  consecutiveSuccessCount: number;
  selfRating: number; // 1 to 5
  checkListResults: Record<string, boolean>;
  reflection: string;
  nextGoal: string;
  timestamp: number;
  syncedToFirebase?: boolean;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  databaseURL?: string;
}

export interface RefereeSignal {
  id: string;
  name: string;
  call: string;
  action: string;
  description: string;
}
