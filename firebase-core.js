import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth, setPersistence, browserLocalPersistence, signInAnonymously,
  signInWithEmailAndPassword, signOut, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  getDatabase, ref, get, set, update, remove, onValue, onDisconnect,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { firebaseConfig, TEACHER_UID } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export { TEACHER_UID, ref, get, set, update, remove, onValue, onDisconnect, serverTimestamp };

await setPersistence(auth, browserLocalPersistence);

export async function teacherLogin(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  if (cred.user.uid !== TEACHER_UID) {
    await signOut(auth);
    throw new Error('Akun ini bukan akun Teacher yang diizinkan.');
  }
  return cred.user;
}

export async function teamAnonymousLogin() {
  if (typeof auth.authStateReady === 'function') await auth.authStateReady();
  if (auth.currentUser) return auth.currentUser;
  const cred = await signInAnonymously(auth);
  return cred.user;
}

export async function logout() {
  await signOut(auth);
}

export function watchAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export function sessionRef(code, path = '') {
  const clean = String(code || '').replace(/\D/g, '').slice(0, 6);
  return ref(db, `sessions/${clean}${path ? '/' + path : ''}`);
}

export function teacherConfigRef(path = '') {
  return ref(db, `teacherConfig${path ? '/' + path : ''}`);
}

function normalizeToken(v) {
  const raw = String(v ?? '').trim().toUpperCase();
  if (!raw) return '';
  const choice = raw.match(/^([A-Z])(?:\s*$|[.):-]\s*|\s+)/);
  if (choice) return choice[1];
  return raw.replace(/\s+/g, ' ');
}

export function normalizeAnswer(v) {
  if (Array.isArray(v)) return v.map(normalizeToken).filter(Boolean).sort();
  return normalizeToken(v);
}

export function validateAnswer(given, expected) {
  const a = normalizeAnswer(given);
  const b = normalizeAnswer(expected);
  if (Array.isArray(a) || Array.isArray(b)) {
    const aa = Array.isArray(a) ? a : (a === '' ? [] : [a]);
    const bb = Array.isArray(b) ? b : (b === '' ? [] : [b]);
    return aa.length === bb.length && aa.every((x, i) => x === bb[i]);
  }
  return a === b;
}

export function currentQuestionKey(meta) {
  return `r${Number(meta.currentRound || 0) + 1}q${Number(meta.currentQuestion || 0) + 1}`;
}

export function randomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function randomPin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export async function codeExists(code) {
  const snap = await get(sessionRef(code, 'meta/code'));
  return snap.exists();
}

export async function uniqueGameCode() {
  for (let i = 0; i < 12; i++) {
    const code = randomCode();
    if (!(await codeExists(code))) return code;
  }
  throw new Error('Tidak dapat membuat Game Code unik. Coba lagi.');
}
