import { auth, TEACHER_UID, teacherConfigRef, get, update } from './firebase-core.js';

const STORAGE_KEY = 'mb_config_v4_digital_society';
const RELOAD_GUARD = 'soc_shared_config_reloaded';
const CONTENT_VERSION = 'round3_berita_nyata_v1';
const VIDEO_SRC = 'https://drive.google.com/file/d/1CaxrhuVf8C_qMxjxAAIwzJdO3mTu8Hey/preview';

const ROUND3 = {
  name:'DIGITAL RESPONSIBILITY',
  focus:'Literasi digital, hoaks, dan tanggung jawab bermedia • Respect • Educate • Protect',
  difficulty:'🟣 LEVEL 3 • ANALYZE, EVALUATE & DECIDE',
  videoCase:true,
  questions:[
    {
      name:'VERIFY THE CLAIM', type:'multiple-response', score:20,
      instruction:'Tonton video “Berita Nyata” pada layar guru. Pilih semua jawaban yang tepat berdasarkan kasus dalam video.',
      question:'Dalam video, seorang pengguna menerima video kekerasan lalu ikut menyebarkan tuduhan sebelum memastikan kebenarannya. Tindakan mana yang dapat memperbesar penyebaran hoaks? Pilih semua jawaban yang tepat.',
      options:['A. Langsung menyimpulkan siapa pelaku tanpa memeriksa sumber dan konteks video','B. Mengunggah ulang video dengan judul atau tuduhan yang provokatif','C. Memeriksa sumber asli, konteks, dan informasi dari sumber tepercaya terlebih dahulu','D. Membagikan video karena sedang ramai dan memancing emosi','E. Menahan diri untuk tidak membagikan sampai informasi terverifikasi'],
      answer:['A','B','D'],
      explanation:'Hoaks mudah menyebar ketika orang terburu-buru menyimpulkan, menambahkan tuduhan, dan membagikan konten karena emosi. Sikap yang bertanggung jawab adalah berhenti sejenak, memeriksa sumber, konteks, dan kebenaran informasi sebelum membagikannya.'
    },
    {
      name:'MATCH THE DIGITAL PRINCIPLE', type:'matching', score:20,
      question:'Cocokkan tindakan yang tepat setelah menerima video viral dengan prinsip Respect, Educate, dan Protect.',
      options:['1. Tidak menghina atau menuduh seseorang sebelum fakta terbukti','2. Memeriksa sumber asli, konteks video, dan membandingkan informasi dengan sumber tepercaya','3. Tidak ikut menyebarkan konten menyesatkan serta melaporkan konten jika berpotensi merugikan orang lain'],
      matchOptions:['A. Respect','B. Educate','C. Protect'],
      answer:['A','B','C'],
      explanation:'Respect berarti menghargai martabat dan nama baik orang lain. Educate berarti bersikap kritis, memeriksa sumber dan konteks. Protect berarti mencegah penyebaran konten yang merugikan serta menjaga diri dan orang lain dari dampak informasi palsu.'
    },
    {
      name:'VERIFY BEFORE SHARE', type:'case-study', score:20,
      instruction:'Pilih keputusan yang paling bertanggung jawab.',
      question:'Jika video kekerasan serupa masuk ke grup kelas dengan caption “pelakunya harus dipenjara”, tetapi sumber dan konteks videonya belum jelas, tindakan paling tepat adalah ...',
      options:['A. Langsung meneruskan agar teman-teman cepat tahu','B. Menahan penyebaran, mencari sumber asli dan konteks video, membandingkan dengan sumber tepercaya, lalu hanya membagikan informasi jika sudah terverifikasi','C. Menambahkan judul yang lebih menarik agar banyak orang memperhatikan','D. Menyimpan video dan membagikannya hanya kepada teman dekat'],
      answer:'B',
      explanation:'Informasi viral belum tentu benar. Langkah yang bertanggung jawab adalah menghentikan penyebaran sementara, melakukan verifikasi, dan tidak menambah tuduhan yang belum terbukti. Jejak digital dan penyebaran hoaks dapat merugikan orang lain.'
    }
  ]
};

function clone(x){return JSON.parse(JSON.stringify(x));}
function readLocalConfig(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');}catch{return null;}}
function normalizeRounds(rounds){if(Array.isArray(rounds))return rounds;if(rounds&&typeof rounds==='object')return Object.keys(rounds).sort().map(k=>rounds[k]);return [];}

function migrateRound3(cfg){
  if(!cfg)return {cfg,changed:false};
  const rounds=normalizeRounds(cfg.rounds);
  const already=cfg.contentVersion===CONTENT_VERSION && rounds?.[2]?.questions?.[0]?.name==='VERIFY THE CLAIM';
  if(already)return {cfg,changed:false};
  const next=clone(cfg); const nextRounds=normalizeRounds(next.rounds);
  while(nextRounds.length<3)nextRounds.push({name:'',focus:'',difficulty:'',questions:[]});
  nextRounds[2]=clone(ROUND3); next.rounds=nextRounds;
  next.videoSrc=VIDEO_SRC; next.videoPoster='assets/video/digital-case-poster.svg'; next.contentVersion=CONTENT_VERSION;
  return {cfg:next,changed:true};
}

function buildAnswerKeys(cfg){
  const out={};
  normalizeRounds(cfg?.rounds).slice(0,3).forEach((round,ri)=>{
    const qs=Array.isArray(round?.questions)?round.questions:Object.values(round?.questions||{});
    qs.slice(0,3).forEach((q,qi)=>{if(q&&q.answer!==undefined&&q.answer!==null&&q.answer!=='')out[`r${ri+1}q${qi+1}`]=q.answer;});
  });
  return out;
}

async function pushSharedConfig(cfg){
  if(!cfg||auth.currentUser?.uid!==TEACHER_UID)return;
  await update(teacherConfigRef(),{gameConfig:cfg,answerKeys:buildAnswerKeys(cfg),gameConfigUpdatedAt:Date.now()});
}

function updateSetupLabels(){
  const setup=document.querySelector('#page-setup'); if(!setup)return;
  const headP=setup.querySelector('.section-head p'); if(headP)headP.textContent='Satu Teacher Setup untuk Mode Guru dan Mode HP Siswa. Perubahan soal berlaku pada permainan/sesi baru.';
  const saveCard=document.querySelector('#saveConfigBtn')?.closest('.card');
  const note=saveCard?.querySelector('.muted.mini'); if(note)note.textContent='Disimpan ke akun guru dan otomatis dipakai oleh Mode Guru + Mode HP Siswa.';
  let status=document.querySelector('#sharedConfigStatus');
  if(!status&&saveCard){status=document.createElement('div');status.id='sharedConfigStatus';status.className='mini muted';status.style.marginTop='6px';saveCard.querySelector('div')?.appendChild(status);}
}
function showStatus(text,good=true){updateSetupLabels();const el=document.querySelector('#sharedConfigStatus');if(el){el.textContent=text;el.style.color=good?'#27875f':'#b74b4b';el.style.fontWeight='800';}}

function installRound3VideoRenderer(){
  if(typeof window.renderVideoCase!=='function')return;
  window.renderVideoCase=function(round,q){
    const wrap=document.querySelector('#videoCaseWrap'); if(!wrap)return;
    if(!round?.videoCase){wrap.innerHTML='';wrap.style.display='none';return;}
    wrap.style.display='block';
    if(q===0){
      wrap.innerHTML=`<div class="video-case card"><div class="eyebrow">WATCH THE CASE</div><h3>“Berita Nyata” — Video Viral dan Hoaks</h3><p class="muted">Tonton sampai selesai. Perhatikan bagaimana sebuah video diterima, diberi kesimpulan atau tuduhan, lalu disebarkan. Catat pada LKPD: informasi apa yang seharusnya diverifikasi sebelum membagikan konten?</p><div class="video-shell"><iframe title="Video kasus Berita Nyata" src="${VIDEO_SRC}" allow="autoplay; fullscreen" allowfullscreen style="width:100%;aspect-ratio:16/9;border:0;border-radius:18px;background:#111"></iframe></div><details class="case-transcript"><summary>Ringkasan kasus cadangan</summary><p>Seorang pengguna menerima video kekerasan, lalu terburu-buru mempercayai narasi yang menyertainya dan mengunggah kembali video dengan tuduhan terhadap seseorang. Konten tersebut menyebar luas. Belakangan, tuduhan itu dinyatakan sebagai hoaks atau fitnah dan penyebarannya menimbulkan konsekuensi. Inti kasus: jangan langsung percaya atau menyebarkan konten sebelum memeriksa sumber, konteks, dan kebenarannya.</p></details></div>`;
    }else{
      wrap.innerHTML='<div class="notice">🎬 <b>Gunakan kembali kasus video “Berita Nyata”.</b> Hubungkan jawaban kalian dengan verifikasi informasi, dampak hoaks, serta prinsip Respect–Educate–Protect.</div>';
    }
  };
}

async function syncFromFirebase(){
  if(typeof auth.authStateReady==='function')await auth.authStateReady();
  if(auth.currentUser?.uid!==TEACHER_UID)return;
  updateSetupLabels(); installRound3VideoRenderer();
  const snap=await get(teacherConfigRef('gameConfig'));
  if(!snap.exists()){
    const m=migrateRound3(readLocalConfig());
    if(m.cfg){localStorage.setItem(STORAGE_KEY,JSON.stringify(m.cfg));await pushSharedConfig(m.cfg);showStatus('✓ Round 3 “Berita Nyata” tersinkron ke Mode Guru + Mode HP.');}
    else showStatus('Teacher Setup siap. Simpan sekali agar dipakai kedua mode.',true);
    return;
  }
  const m=migrateRound3(snap.val()); const remote=m.cfg;
  if(m.changed)await pushSharedConfig(remote);
  const remoteText=JSON.stringify(remote), localText=localStorage.getItem(STORAGE_KEY)||'';
  if(remoteText!==localText){
    localStorage.setItem(STORAGE_KEY,remoteText);
    if(sessionStorage.getItem(RELOAD_GUARD)!==remoteText){sessionStorage.setItem(RELOAD_GUARD,remoteText);location.reload();return;}
  }
  sessionStorage.removeItem(RELOAD_GUARD);
  showStatus(m.changed?'✓ Round 3 diperbarui: video “Berita Nyata” + 3 soal baru tersinkron.':'✓ Teacher Setup terhubung ke Mode Guru + Mode HP Siswa.');
}

function bindSaveButtons(){
  updateSetupLabels();
  const saveBtn=document.querySelector('#saveConfigBtn');
  if(saveBtn&&!saveBtn.dataset.sharedSyncBound){saveBtn.dataset.sharedSyncBound='1';saveBtn.addEventListener('click',()=>setTimeout(async()=>{try{const cfg=readLocalConfig();if(!cfg)throw new Error('Konfigurasi lokal belum tersedia.');await pushSharedConfig(cfg);showStatus('✓ Tersimpan. Soal ini sekarang menjadi sumber untuk Mode Guru dan Mode HP.');}catch(e){showStatus('Sinkronisasi Firebase gagal: '+(e?.message||e),false);}},0));}
  const resetBtn=document.querySelector('#resetConfigBtn');
  if(resetBtn&&!resetBtn.dataset.sharedSyncBound){resetBtn.dataset.sharedSyncBound='1';resetBtn.addEventListener('click',()=>setTimeout(async()=>{try{const cfg=readLocalConfig();if(cfg)await pushSharedConfig(cfg);showStatus('✓ Konfigurasi default disinkronkan ke kedua mode.');}catch(e){showStatus('Sinkronisasi Firebase gagal: '+(e?.message||e),false);}},0));}
}

installRound3VideoRenderer();
bindSaveButtons();
syncFromFirebase().catch(e=>showStatus('Sinkronisasi belum tersedia: '+(e?.message||e),false));