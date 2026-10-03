import {
  auth, TEACHER_UID, teacherConfigRef, get, set,
  sessionRef, uniqueGameCode, randomPin, serverTimestamp
} from './firebase-core.js';

const createBtn = document.querySelector('#createSessionBtn');
const resumeBtn = document.querySelector('#resumeBtn');
const resumeCode = document.querySelector('#resumeCode');
const secureSetup = document.querySelector('#secureSetup');
const originalCreate = createBtn?.onclick;

function asArray(v){
  if (Array.isArray(v)) return v;
  if (v && typeof v === 'object') return Object.keys(v).sort().map(k=>v[k]);
  return [];
}

function publicQuestion(q,id){
  const out = {...q, id};
  delete out.answer;
  return out;
}

function buildSessionParts(cfg){
  const rounds = asArray(cfg?.rounds).slice(0,3);
  if (rounds.length !== 3) throw new Error('Teacher Setup harus memiliki 3 round.');
  const publicQuestions = {};
  const answerKeys = {};
  rounds.forEach((round,ri)=>{
    const qs = asArray(round?.questions).slice(0,3);
    if (qs.length !== 3) throw new Error(`Round ${ri+1} harus memiliki 3 soal.`);
    qs.forEach((q,qi)=>{
      const id = `r${ri+1}q${qi+1}`;
      if (q?.answer === undefined || q?.answer === null || q?.answer === '') throw new Error(`Kunci jawaban ${id} belum diisi.`);
      publicQuestions[id] = publicQuestion(q,id);
      answerKeys[id] = q.answer;
    });
  });
  return {rounds, publicQuestions, answerKeys};
}

function showMiniMessage(text, good=true){
  let el = document.querySelector('#sharedModeNotice');
  const setup = document.querySelector('#sessionSetup');
  if (!el && setup) {
    el = document.createElement('div');
    el.id = 'sharedModeNotice';
    el.style.cssText='margin-top:10px;font-weight:800;font-size:13px;';
    setup.appendChild(el);
  }
  if (el) {
    el.textContent = text;
    el.style.color = good ? '#27875f' : '#b74b4b';
  }
}

async function sharedConfig(){
  if (typeof auth.authStateReady === 'function') await auth.authStateReady();
  if (auth.currentUser?.uid !== TEACHER_UID) return null;
  const snap = await get(teacherConfigRef('gameConfig'));
  return snap.exists() ? snap.val() : null;
}

async function createFromSharedConfig(){
  const cfg = await sharedConfig();
  if (!cfg) {
    showMiniMessage('Teacher Setup bersama belum ditemukan. Menggunakan konfigurasi HP lama.', false);
    if (typeof originalCreate === 'function') return originalCreate.call(createBtn);
    throw new Error('Konfigurasi bersama belum tersedia. Buka Teacher Setup lalu klik Simpan Pengaturan.');
  }

  const {rounds, publicQuestions, answerKeys} = buildSessionParts(cfg);
  const code = await uniqueGameCode();
  const names = asArray(cfg.teams);
  const colors = asArray(cfg.teamColors);
  const defaultColors = ['#4aa3ff','#56df9b','#ffd166','#ff6b6b','#b990ff','#ff9f43'];
  const teamPins = {};
  const teams = {};
  for (let i=0;i<6;i++) {
    const id = `team${i+1}`;
    teamPins[id] = randomPin();
    teams[id] = {
      name: names[i] || `Kelompok ${i+1}`,
      color: colors[i] || defaultColors[i],
      position:0, score:0, round1:false, round2:false, round3:false, finalScore:0
    };
  }

  const snapshot = {
    gameName: cfg.gameName || 'SOC Mission Board',
    subject: cfg.subject || '',
    className: cfg.className || '',
    topic: cfg.topic || '',
    objective: cfg.objective || '',
    rounds: rounds.map((r,ri)=>({
      name:r?.name || `ROUND ${ri+1}`,
      focus:r?.focus || '',
      difficulty:r?.difficulty || '',
      videoCase:!!r?.videoCase
    }))
  };

  const payload = {
    meta:{
      code,status:'LOBBY',createdBy:auth.currentUser.uid,createdAt:serverTimestamp(),
      currentRound:0,currentQuestion:0,questionState:'WAITING',paused:false,
      source:'teacherSetupShared',configSavedAt:Date.now(),roundNames:snapshot.rounds.map(r=>r.name)
    },
    publicQuestions,teams,teamClaims:{},presence:{},answers:{},revealPublic:{},
    private:{teamPins,answerKeys,gameConfigSnapshot:snapshot}
  };

  await set(sessionRef(code), payload);
  localStorage.setItem('soc_teacher_session', code);
  if (resumeCode) resumeCode.value = code;
  showMiniMessage('✓ Sesi dibuat dari Teacher Setup yang sama dengan Mode Guru.');
  if (resumeBtn) resumeBtn.click();
}

async function refreshSharedNotice(){
  try {
    const cfg = await sharedConfig();
    if (cfg) {
      if (secureSetup) secureSetup.classList.add('hidden');
      showMiniMessage('✓ Mode HP memakai soal yang sama dari Teacher Setup. Perubahan baru diterapkan saat membuat sesi baru.');
    }
  } catch {}
}

if (createBtn) {
  createBtn.onclick = ()=>createFromSharedConfig().catch(err=>{
    showMiniMessage(err?.message || String(err), false);
    alert(err?.message || String(err));
  });
}

refreshSharedNotice();
setTimeout(refreshSharedNotice,1200);
