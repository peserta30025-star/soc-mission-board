import { auth, TEACHER_UID, teacherConfigRef, get, set, update } from './firebase-core.js';

const STORAGE_KEY = 'mb_config_v4_digital_society';
const RELOAD_GUARD = 'soc_shared_config_reloaded';

function readLocalConfig(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); }
  catch { return null; }
}

function normalizeRounds(rounds){
  if (Array.isArray(rounds)) return rounds;
  if (rounds && typeof rounds === 'object') return Object.keys(rounds).sort().map(k=>rounds[k]);
  return [];
}

function buildAnswerKeys(cfg){
  const out = {};
  normalizeRounds(cfg?.rounds).slice(0,3).forEach((round,ri)=>{
    const qs = Array.isArray(round?.questions) ? round.questions : Object.values(round?.questions || {});
    qs.slice(0,3).forEach((q,qi)=>{
      if (q && q.answer !== undefined && q.answer !== null && q.answer !== '') out[`r${ri+1}q${qi+1}`] = q.answer;
    });
  });
  return out;
}

async function pushSharedConfig(cfg){
  if (!cfg || auth.currentUser?.uid !== TEACHER_UID) return;
  const answerKeys = buildAnswerKeys(cfg);
  await update(teacherConfigRef(), {
    gameConfig: cfg,
    answerKeys,
    gameConfigUpdatedAt: Date.now()
  });
}

function updateSetupLabels(){
  const setup = document.querySelector('#page-setup');
  if (!setup) return;
  const headP = setup.querySelector('.section-head p');
  if (headP) headP.textContent = 'Satu Teacher Setup untuk Mode Guru dan Mode HP Siswa. Perubahan soal berlaku pada permainan/sesi baru.';
  const saveCard = document.querySelector('#saveConfigBtn')?.closest('.card');
  const note = saveCard?.querySelector('.muted.mini');
  if (note) note.textContent = 'Disimpan ke akun guru dan otomatis dipakai oleh Mode Guru + Mode HP Siswa.';
  let status = document.querySelector('#sharedConfigStatus');
  if (!status && saveCard) {
    status = document.createElement('div');
    status.id = 'sharedConfigStatus';
    status.className = 'mini muted';
    status.style.marginTop = '6px';
    saveCard.querySelector('div')?.appendChild(status);
  }
}

function showStatus(text, good=true){
  updateSetupLabels();
  const el = document.querySelector('#sharedConfigStatus');
  if (el) {
    el.textContent = text;
    el.style.color = good ? '#27875f' : '#b74b4b';
    el.style.fontWeight = '800';
  }
}

async function syncFromFirebase(){
  if (typeof auth.authStateReady === 'function') await auth.authStateReady();
  if (auth.currentUser?.uid !== TEACHER_UID) return;
  updateSetupLabels();
  const snap = await get(teacherConfigRef('gameConfig'));
  if (!snap.exists()) {
    const local = readLocalConfig();
    if (local) {
      await pushSharedConfig(local);
      showStatus('✓ Konfigurasi awal tersinkron ke kedua mode.');
    } else {
      showStatus('Teacher Setup siap. Simpan sekali agar dipakai kedua mode.', true);
    }
    return;
  }
  const remote = snap.val();
  const remoteText = JSON.stringify(remote);
  const localText = localStorage.getItem(STORAGE_KEY) || '';
  if (remoteText !== localText) {
    localStorage.setItem(STORAGE_KEY, remoteText);
    if (sessionStorage.getItem(RELOAD_GUARD) !== remoteText) {
      sessionStorage.setItem(RELOAD_GUARD, remoteText);
      location.reload();
      return;
    }
  }
  sessionStorage.removeItem(RELOAD_GUARD);
  showStatus('✓ Teacher Setup terhubung ke Mode Guru + Mode HP Siswa.');
}

function bindSaveButtons(){
  updateSetupLabels();
  const saveBtn = document.querySelector('#saveConfigBtn');
  if (saveBtn && !saveBtn.dataset.sharedSyncBound) {
    saveBtn.dataset.sharedSyncBound = '1';
    saveBtn.addEventListener('click',()=>{
      setTimeout(async()=>{
        try {
          const cfg = readLocalConfig();
          if (!cfg) throw new Error('Konfigurasi lokal belum tersedia.');
          await pushSharedConfig(cfg);
          showStatus('✓ Tersimpan. Soal ini sekarang menjadi sumber untuk Mode Guru dan Mode HP.');
        } catch (e) {
          showStatus('Sinkronisasi Firebase gagal: ' + (e?.message || e), false);
        }
      },0);
    });
  }
  const resetBtn = document.querySelector('#resetConfigBtn');
  if (resetBtn && !resetBtn.dataset.sharedSyncBound) {
    resetBtn.dataset.sharedSyncBound = '1';
    resetBtn.addEventListener('click',()=>{
      setTimeout(async()=>{
        try {
          const cfg = readLocalConfig();
          if (cfg) await pushSharedConfig(cfg);
          showStatus('✓ Konfigurasi default disinkronkan ke kedua mode.');
        } catch(e) {
          showStatus('Sinkronisasi Firebase gagal: ' + (e?.message || e), false);
        }
      },0);
    });
  }
}

bindSaveButtons();
syncFromFirebase().catch(e=>showStatus('Sinkronisasi belum tersedia: '+(e?.message||e), false));
