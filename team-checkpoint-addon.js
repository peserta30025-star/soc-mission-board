import { onValue, sessionRef } from './firebase-core.js';

let code='';
let teamId='';
let meta=null;
let teamState=null;
let unsubMeta=null;
let unsubTeam=null;

function safe(v=''){
  return String(v).replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
}

function loadJoin(){
  try{
    const saved=JSON.parse(localStorage.getItem('soc_team_join')||'null');
    if(!saved?.code||!saved?.teamId)return null;
    return {code:String(saved.code).replace(/\D/g,'').slice(0,6),teamId:String(saved.teamId)};
  }catch{return null;}
}

function positionLabel(p){
  p=Number(p||0);
  if(p>=3)return 'FINISH';
  if(p===2)return 'CHECKPOINT 2';
  if(p===1)return 'CHECKPOINT 1';
  return 'START';
}

function ensureStyle(){
  if(document.getElementById('teamCheckpointStyle'))return;
  const s=document.createElement('style');
  s.id='teamCheckpointStyle';
  s.textContent=`
    .team-cp-card{margin-top:14px;padding:16px;border-radius:18px;border:1px solid #cfe2eb;background:linear-gradient(180deg,#fff,#f7fcfe);text-align:left;box-shadow:0 8px 20px rgba(16,70,104,.08)}
    .team-cp-card.pass{border-color:#9ed8b3;background:linear-gradient(180deg,#f3fff7,#eaf9f0)}
    .team-cp-card.stay{border-color:#efcf91;background:linear-gradient(180deg,#fffaf0,#fff3d9)}
    .team-cp-kicker{font-size:.72rem;font-weight:1000;letter-spacing:.12em;color:#c48100;text-transform:uppercase}
    .team-cp-title{font-size:1.2rem;font-weight:1000;margin:5px 0 8px;color:#174f78}
    .team-cp-msg{line-height:1.5;color:#4f7289;font-weight:700}
    .team-cp-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px}
    .team-cp-stat{padding:10px;border-radius:13px;background:rgba(255,255,255,.88);border:1px solid #d9e8ee;text-align:center}
    .team-cp-stat b{display:block;font-size:1.05rem;color:#174f78}.team-cp-stat small{display:block;margin-top:3px;color:#6d8799;font-size:.72rem;font-weight:800}
    .team-cp-track{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;align-items:center;margin-top:14px}
    .team-cp-step{padding:8px 4px;border-radius:999px;border:1px solid #d6e5ec;background:#fff;text-align:center;font-size:.72rem;font-weight:900;color:#7890a0}
    .team-cp-step.done{background:#dff5e7;border-color:#a9dab9;color:#277e4b}.team-cp-step.current{background:#e5f5fd;border-color:#7fc5e5;color:#17658f;box-shadow:0 0 0 2px rgba(32,143,208,.12)}
    @media(max-width:430px){.team-cp-stats{grid-template-columns:1fr}.team-cp-track{gap:4px}.team-cp-step{font-size:.65rem;padding:7px 2px}}
  `;
  document.head.appendChild(s);
}

function renderCheckpoint(){
  if(!meta||meta.questionState!=='CHECKPOINT'||!teamId)return;
  ensureStyle();

  const idx=Number(teamId.replace('team',''))||0;
  const name=teamState?.name||`Kelompok ${idx}`;
  const correct=Number(meta.checkpointCorrectCounts?.[teamId]||0);
  const moved=meta.checkpointMoves?.[teamId]===true;
  const pos=Number(meta.checkpointToPositions?.[teamId] ?? teamState?.position ?? 0);
  const score=Number(teamState?.score||0);
  const round=Number(meta.currentRound||0)+1;
  const posText=positionLabel(pos);

  const qTitle=document.getElementById('questionTitle');
  const qText=document.getElementById('questionText');
  const area=document.getElementById('answerArea');
  const lock=document.getElementById('lockBtn');
  const icon=document.getElementById('statusIcon');
  const title=document.getElementById('statusTitle');
  const text=document.getElementById('statusText');
  const feedback=document.getElementById('feedbackBox');
  const roundLabel=document.getElementById('roundLabel');
  const progress=document.getElementById('questionProgress');
  if(!qTitle||!qText||!area||!icon||!title||!text||!feedback)return;

  if(roundLabel)roundLabel.textContent=`ROUND ${round}`;
  if(progress)progress.textContent='Round selesai';
  qTitle.textContent=`ROUND ${round} SELESAI`;
  qText.textContent=moved
    ? `${name} memenuhi syarat minimal 2 dari 3 jawaban benar.`
    : `${name} belum memenuhi syarat minimal 2 dari 3 jawaban benar.`;
  if(lock)lock.disabled=true;

  const steps=['START','CP 1','CP 2','FINISH'];
  area.innerHTML=`
    <div class="team-cp-card ${moved?'pass':'stay'}">
      <div class="team-cp-kicker">HASIL CHECKPOINT</div>
      <div class="team-cp-title">${moved?'🎉 Pion kelompokmu berhasil maju!':'💪 Pion kelompokmu tetap di posisi sebelumnya'}</div>
      <div class="team-cp-msg">${moved
        ? `Selamat <b>${safe(name)}</b>! Kalian mendapatkan <b>${correct}/3 jawaban benar</b> dan pion maju ke <b>${safe(posText)}</b>.`
        : `<b>${safe(name)}</b> mendapatkan <b>${correct}/3 jawaban benar</b>. Pion tidak bergerak, tetapi poin yang sudah diperoleh tetap tersimpan.`}</div>
      <div class="team-cp-stats">
        <div class="team-cp-stat"><b>${correct}/3</b><small>JAWABAN BENAR</small></div>
        <div class="team-cp-stat"><b>${safe(posText)}</b><small>POSISI PION</small></div>
        <div class="team-cp-stat"><b>${score}</b><small>TOTAL POIN</small></div>
      </div>
      <div class="team-cp-track">${steps.map((label,i)=>`<div class="team-cp-step ${i<pos?'done':''} ${i===pos?'current':''}">${label}</div>`).join('')}</div>
    </div>`;

  icon.textContent=moved?'🎉':'💪';
  title.textContent=moved?'SELAMAT! PION MAJU':'ROUND SELESAI';
  text.textContent=moved
    ? `Kalian lolos checkpoint dengan ${correct}/3 jawaban benar.`
    : `Kalian memperoleh ${correct}/3 jawaban benar. Pion tetap di ${posText}, poin tetap tersimpan.`;
  feedback.className='feedback '+(moved?'ok':'no');
  feedback.innerHTML=moved
    ? `<b>✅ Berhasil maju ke ${safe(posText)}</b><br>Total poin saat ini: <b>${score}</b>`
    : `<b>⛔ Pion tidak bergerak</b><br>Syarat maju adalah minimal <b>2 dari 3</b> jawaban benar. Total poin saat ini tetap <b>${score}</b>.`;
  feedback.classList.remove('hidden');
}

function stop(){
  try{unsubMeta?.();}catch{}
  try{unsubTeam?.();}catch{}
  unsubMeta=null;unsubTeam=null;
}

function attach(join){
  if(!join||join.code.length!==6)return;
  if(join.code===code&&join.teamId===teamId)return;
  stop();
  code=join.code;teamId=join.teamId;meta=null;teamState=null;
  unsubMeta=onValue(sessionRef(code,'meta'),snap=>{meta=snap.val()||null;setTimeout(renderCheckpoint,40);});
  unsubTeam=onValue(sessionRef(code,`teams/${teamId}`),snap=>{teamState=snap.val()||{};setTimeout(renderCheckpoint,40);});
}

setInterval(()=>{
  const join=loadJoin();
  if(join)attach(join);
  if(meta?.questionState==='CHECKPOINT')renderCheckpoint();
},300);