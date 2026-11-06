import { FirebaseApp, initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  Firestore,
  onSnapshot
} from 'firebase/firestore';
import { FirebaseConfig, StudentLogEntry } from '../types';

const STORAGE_KEY_CONFIG = 'volleyball_firebase_config';
const STORAGE_KEY_LOGS = 'volleyball_student_logs';

class FirebaseService {
  private app: FirebaseApp | null = null;
  private db: Firestore | null = null;
  private isConnected: boolean = false;
  private config: FirebaseConfig | null = null;

  constructor() {
    this.initFromStorageOrEnv();
  }

  // Attempt to load Firebase credentials from localStorage or import.meta.env
  private initFromStorageOrEnv() {
    try {
      // 1. Check local storage for user/teacher configured Firebase keys
      const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig) as FirebaseConfig;
        if (parsed.apiKey && parsed.projectId) {
          this.initFirebase(parsed);
          return;
        }
      }

      // 2. Check environment variables if available
      const envApiKey = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_FIREBASE_API_KEY;
      const envProjectId = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_FIREBASE_PROJECT_ID;

      if (envApiKey && envProjectId) {
        const envConfig: FirebaseConfig = {
          apiKey: envApiKey,
          authDomain: (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_FIREBASE_AUTH_DOMAIN || '',
          projectId: envProjectId,
          storageBucket: (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_FIREBASE_STORAGE_BUCKET || '',
          messagingSenderId: (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
          appId: (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_FIREBASE_APP_ID || '',
        };
        this.initFirebase(envConfig);
      }
    } catch {
      this.isConnected = false;
    }
  }

  public initFirebase(config: FirebaseConfig): boolean {
    try {
      if (!config.apiKey || !config.projectId) {
        return false;
      }
      this.config = config;
      const existingApps = getApps();
      if (existingApps.length > 0) {
        this.app = existingApps[0];
      } else {
        this.app = initializeApp(config);
      }
      this.db = getFirestore(this.app);
      this.isConnected = true;
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
      return true;
    } catch (err) {
      console.warn('Firebase init notice:', err);
      this.isConnected = false;
      return false;
    }
  }

  public disconnect() {
    this.app = null;
    this.db = null;
    this.isConnected = false;
    this.config = null;
    localStorage.removeItem(STORAGE_KEY_CONFIG);
  }

  public getStatus(): { isConnected: boolean; projectId?: string; hasCustomConfig: boolean } {
    return {
      isConnected: this.isConnected,
      projectId: this.config?.projectId,
      hasCustomConfig: Boolean(this.config?.apiKey),
    };
  }

  public getConfig(): FirebaseConfig | null {
    return this.config;
  }

  // Save student log (automatically saves to LocalStorage, and to Firestore if connected)
  public async saveStudentLog(entry: Omit<StudentLogEntry, 'id' | 'timestamp'>): Promise<StudentLogEntry> {
    const newEntry: StudentLogEntry = {
      ...entry,
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now(),
      syncedToFirebase: false,
    };

    // 1. Always save locally first for high reliability in gym/offline class
    const localLogs = this.getLocalLogs();
    localLogs.unshift(newEntry);
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(localLogs));

    // 2. If Firebase is active, sync to Firestore
    if (this.isConnected && this.db) {
      try {
        const docRef = await addDoc(collection(this.db, 'volleyball_student_logs'), {
          ...newEntry,
          syncedToFirebase: true,
          serverTimestamp: new Date().toISOString(),
        });
        newEntry.syncedToFirebase = true;
        newEntry.id = docRef.id;

        // Update local status with synced flag
        const updatedLocal = this.getLocalLogs().map(item => 
          item.timestamp === newEntry.timestamp ? { ...item, syncedToFirebase: true, id: docRef.id } : item
        );
        localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updatedLocal));
      } catch (err) {
        console.warn('Firebase sync deferred, stored locally:', err);
      }
    }

    return newEntry;
  }

  // Get all logs (merges Firestore if connected, or returns local)
  public async getStudentLogs(): Promise<StudentLogEntry[]> {
    if (this.isConnected && this.db) {
      try {
        const q = query(collection(this.db, 'volleyball_student_logs'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const cloudLogs: StudentLogEntry[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as StudentLogEntry;
          cloudLogs.push({ ...data, id: doc.id, syncedToFirebase: true });
        });
        if (cloudLogs.length > 0) {
          // Merge with local logs by ID
          const local = this.getLocalLogs();
          const map = new Map<string, StudentLogEntry>();
          local.forEach(l => map.set(l.id, l));
          cloudLogs.forEach(c => map.set(c.id, c));
          const merged = Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
          localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(merged));
          return merged;
        }
      } catch (err) {
        console.warn('Could not fetch cloud logs, using local:', err);
      }
    }
    return this.getLocalLogs();
  }

  // Real-time listener for teacher dashboard or class scoreboard
  public subscribeToLogs(callback: (logs: StudentLogEntry[]) => void): () => void {
    if (this.isConnected && this.db) {
      try {
        const q = query(collection(this.db, 'volleyball_student_logs'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const list: StudentLogEntry[] = [];
          snapshot.forEach(doc => {
            list.push({ ...(doc.data() as StudentLogEntry), id: doc.id, syncedToFirebase: true });
          });
          callback(list);
        }, (err) => {
          console.warn('Snapshot listener error, returning local logs:', err);
          callback(this.getLocalLogs());
        });
        return unsubscribe;
      } catch {
        // Fallback
      }
    }
    // If not connected, emit current local logs once
    callback(this.getLocalLogs());
    return () => {};
  }

  public getLocalLogs(): StudentLogEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_LOGS);
      if (!data) return [];
      return JSON.parse(data) as StudentLogEntry[];
    } catch {
      return [];
    }
  }

  public deleteLog(id: string) {
    const list = this.getLocalLogs().filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(list));
  }

  public clearAllLocalLogs() {
    localStorage.removeItem(STORAGE_KEY_LOGS);
  }
}

export const firebaseService = new FirebaseService();
