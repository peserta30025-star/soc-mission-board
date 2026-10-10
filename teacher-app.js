import {
  auth, db, TEACHER_UID, teacherLogin, logout, watchAuth,
  ref, get, set, update, remove, onValue, serverTimestamp,
  sessionRef, teacherConfigRef, uniqueGameCode, randomPin,
  validateAnswer, currentQuestionKey
} from './firebase-core.js';
import { QUESTION_BANK, TEAM_COLORS, flattenQuestions, getQuestion } from './multiplayer-question-bank.js?v=20261010-questionrules1';

const $ = (s) => document.querySelector(s);
const TEAMS = Array.from({length: 6}, (_, i) => ({ id: `team${i+1}`, name: `Kelompok ${i+1}`, color: TEAM_COLORS[i] }));
let sessionCode = '';
let session = null;
let unsubSession = [];
let showPins = false;
let answerKeysReady = false;

function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400);}
function safe(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function qKey(meta=session?.meta||{}){return currentQuestionKey(meta);}
function currentPublicQuestion(){if(!session?.meta)return null;return session.publicQuestions?.[qKey()]||null;}
function clearSessionListeners(){unsubSession.forEach(fn=>{try{fn();}catch{}});unsubSession=[];}

async function loadKeyStatus(){
  const snap = await get(teacherConfigRef('answerKeys'));
  answerKeysReady = snap.exists();
  $('#secureSetup').classList.toggle('hidden', answerKeysReady);
  return answerKeysReady;
}

$('#teacherLoginBtn').onclick = async () => {
  $('#loginError').textContent='';
  try{
    await teacherLogin($('#teacherEmail').value.trim(), $('#teacherPassword').value);
  }catch(err){$('#loginError').textContent=err.message||'Login gagal.';}
};

$('#logoutBtn').onclick = async()=>{clearSessionListeners();await logout();location.reload();};

watchAuth(async(user)=>{
  if(!user){$('#loginView').classList.remove('hidden');$('#teacherApp').classList.add('hidden');return;}
  if(user.uid!==TEACHER_UID){await logout();return;}
  $('#loginView').classList.add('hidden');$('#teacherApp').classList.remove('hidden');
  await loadKeyStatus();
  const last=localStorage.getItem('soc_teacher_session');
  if(last){$('#resumeCode').value=last;}
});

$('#saveKeysBtn').onclick = async()=>{
  try{
    const parsed=JSON.parse($('#answerKeySeed').value.trim());
    const required=flattenQuestions().map(q=>q.id);
    const missing=required.filter(id=>!(id in parsed));
    if(missing.length)throw new Error('Kunci belum lengkap: '+missing.join(', '));
    await set(teacherConfigRef('answerKeys'),parsed);
    answerKeysReady=true;$('#secureSetup').classList.add('hidden');toast('Secure Answer Keys tersimpan.');
  }catch(err){$('#keySetupMessage').textContent=err.message||'JSON tidak valid.';}
};

async function createSession(){
  if(!answerKeysReady){toast('Simpan Secure Answer Keys terlebih dahulu.');return;}
  const code=await uniqueGameCode();
  const keySnap=await get(teacherConfigRef('answerKeys'));
  const answerKeys=keySnap.val();
  const publicQuestions={};
  flattenQuestions().forEach(q=>{publicQuestions[q.id]={...q};delete publicQuestions[q.id].answer;});
  const teamPins={};const teams={};
  TEAMS.forEach((t,i)=>{teamPins[t.id]=randomPin();teams[t.id]={name:t.name,color:t.color,position:0,score:0,round1:false,round2:false,round3:false,finalScore:0};});
  const payload={
    meta:{code,status:'LOBBY',createdBy:auth.currentUser.uid,createdAt:serverTimestamp(),currentRound:0,currentQuestion:0,questionState:'WAITING',paused:false},
    publicQuestions,teams,teamClaims:{},presence:{},answers:{},revealPublic:{},
    private:{teamPins,answerKeys}
  };
  await set(sessionRef(code),payload);
  localStorage.setItem('soc_teacher_session',code);
  await attachSession(code);toast(`Game Code ${code} dibuat.`);
}

$('#createSessionBtn').onclick=()=>createSession().catch(e=>toast(e.message));
$('#resumeBtn').onclick=()=>{const c=$('#resumeCode').value.replace(/\D/g,'').slice(0,6);if(c.length!==6)return toast('Masukkan 6 digit Game Code.');attachSession(c).catch(e=>toast(e.message));};

async function attachSession(code){
  const snap=await get(sessionRef(code,'meta'));
  if(!snap.exists()){toast('Session tidak ditemukan.');return;}
  sessionCode=code;localStorage.setItem('soc_teacher_session',code);$('#resumeCode').value=code;
  clearSessionListeners();
  session={meta:snap.val(),publicQuestions:{},teams:{},teamClaims:{},presence:{},answers:{},revealPublic:{},private:{}};
  const paths=['meta','publicQuestions','teams','teamClaims','presence','answers','revealPublic','private'];
  paths.forEach(path=>{
    const unsub=onValue(sessionRef(code,path),(s)=>{
      session[path]=s.val()||{};
      renderAll();
    },(err)=>toast(`Gagal membaca ${path}: ${err.message}`));
    unsubSession.push(unsub);
  });
  $('#dashboard').classList.remove('hidden');
  renderAll();
}

function connectedTeams(){return TEAMS.filter(t=>session?.teamClaims?.[t.id]?.uid);}
function onlineTeams(){return TEAMS.filter(t=>session?.presence?.[t.id]?.state==='online');}
function lockedTeams(){const key=qKey();return TEAMS.filter(t=>session?.answers?.[key]?.[t.id]?.locked===true);}

function renderAll(){
  if(!session)return;
  const meta=session.meta||{};
  $('#gameCode').textContent=sessionCode||'------';
  $('#sessionStatus').textContent=meta.status||'LOBBY';
  $('#onlineCount').textContent=`${onlineTeams().length} / 6 Teams Online`;
  $('#missionPosition').textContent=`Round ${Number(meta.currentRound||0)+1} • Q${Number(meta.currentQuestion||0)+1}`;
  renderLobby();renderBoard();renderMission();renderFinalMission();
}

function renderLobby(){
  const pins=session.private?.teamPins||{};
  $('#teamLobby').innerHTML=TEAMS.map((t)=>{
    const claim=session.teamClaims?.[t.id];const p=session.presence?.[t.id];
    const state=p?.state==='online'?'online':claim?'reconnecting':'offline';
    const label=state==='online'?'🟢 Connected':state==='reconnecting'?'🟡 Reconnecting':'⚪ Not Connected';
    return `<div class="team-row"><span class="team-dot" style="background:${t.color}"></span><div><b>${t.name}</b><small class="presence ${state}">${label}</small></div><span class="pin">${showPins?(pins[t.id]||'----'):'••••'}</span><button class="btn tiny replace-device" data-team="${t.id}">${claim?'Replace Device':'Clear'}</button></div>`;
  }).join('');
  document.querySelectorAll('.replace-device').forEach(b=>b.onclick=async()=>{
    const id=b.dataset.team;if(!confirm(`Hapus koneksi ${id}? Gunakan ini hanya untuk mengganti HP kelompok.`))return;
    await update(sessionRef(sessionCode),{[`teamClaims/${id}`]:null,[`presence/${id}`]:null});
  });
  $('#connectedCount').textContent=`${connectedTeams().length} / 6 Teams Connected`;
  $('#startMissionBtn').disabled=session.meta?.status!=='LOBBY';
}

$('#togglePinsBtn').onclick=()=>{showPins=!showPins;$('#togglePinsBtn').textContent=showPins?'Hide PIN':'Show PIN';renderLobby();};

$('#startMissionBtn').onclick=async()=>{
  if(!sessionCode)return;
  if(connectedTeams().length<6&&!confirm(`${connectedTeams().length}/6 team terhubung. Start Anyway?`))return;
  await update(sessionRef(sessionCode,'meta'),{status:'PLAYING',currentRound:0,currentQuestion:0,questionState:'WAITING',paused:false});
};

function renderBoard(){
  const teams=session.teams||{};
  const pos=[5,35,66,94];
  $('#boardPawns').innerHTML=TEAMS.map((t,i)=>{const p=Number(teams[t.id]?.position||0);const row=(i%3)*2+(i>=3?9:0);return `<span class="pawn" data-label="${i+1}" style="left:${pos[Math.max(0,Math.min(3,p))]}%;top:${row}px;background:${t.color}"></span>`;}).join('');
  $('#missionProgressTable').innerHTML=`<table class="progress-table"><thead><tr><th>Team</th><th>R1</th><th>R2</th><th>R3</th><th>Position</th><th>Score</th></tr></thead><tbody>${TEAMS.map(t=>{const x=teams[t.id]||{};return `<tr><td>${t.name}</td><td>${x.round1?'✅':'🔒'}</td><td>${x.round2?'✅':'🔒'}</td><td>${x.round3?'✅':'🔒'}</td><td>${['START','CP1','CP2','FINISH'][x.position||0]}</td><td>${x.score||0}</td></tr>`;}).join('')}</tbody></table>`;
}

function renderMission(){
  const meta=session.meta||{};const q=currentPublicQuestion();
  const r=QUESTION_BANK[meta.currentRound||0];
  $('#roundTag').textContent=`ROUND ${Number(meta.currentRound||0)+1}`;
  $('#roundTitle').textContent=r?.roundName||'MISSION';
  $('#questionName').textContent=q?`Question ${Number(meta.currentQuestion||0)+1} of 3 • ${q.name}`:'Question';
  $('#questionState').textContent=meta.questionState||'WAITING';
  $('#scoreLabel').textContent=q?`${q.score} pts`:'—';
  $('#teacherQuestion').textContent=q?.question||'Buat atau resume sesi terlebih dahulu.';
  $('#teacherOptions').innerHTML=q?.type==='matching'?(q.options||[]).map((x,i)=>`<div class="option"><b>${safe(x)}</b><br><small>${safe(q.matchOptions?.[i]||'')}</small></div>`).join(''):(q?.options||[]).map(x=>`<div class="option">${safe(x)}</div>`).join('');
  const showVideo=Number(meta.currentRound||0)===2&&Number(meta.currentQuestion||0)===0;
  $('#videoCase').classList.toggle('hidden',!showVideo);
  const video=$('#caseVideo');if(showVideo&&video&&!video.dataset.bound){video.dataset.bound='1';video.addEventListener('error',()=>$('#videoFallback').classList.remove('hidden'));}
  const key=qKey();const answers=session.answers?.[key]||{};
  $('#answerStatus').innerHTML=TEAMS.map(t=>{const a=answers[t.id];let status='⏳ Answering',cls='';let result='';if(a?.locked){status='🔒 Locked';cls='locked';if(meta.questionState==='REVEALED'&&typeof a.correct==='boolean')result=`<div class="result ${a.correct?'correct':'incorrect'}">${a.correct?'✅ Correct':'✕ Not Yet'}</div>`;}return `<div class="answer-card ${cls}"><b>${t.name}</b><div>${status}</div>${result}</div>`;}).join('');
  $('#lockedCount').textContent=`${lockedTeams().length} / 6 Teams Locked`;
  $('#openQuestionBtn').disabled=meta.status!=='PLAYING'||meta.questionState!=='WAITING';
  $('#revealBtn').disabled=meta.status!=='PLAYING'||meta.questionState!=='ANSWERING'||lockedTeams().length<6;
  $('#revealAnywayBtn').disabled=meta.status!=='PLAYING'||meta.questionState!=='ANSWERING';
  $('#nextBtn').disabled=meta.questionState!=='REVEALED';
  $('#pauseBtn').textContent=meta.status==='PAUSED'?'▶ RESUME MISSION':'⏸ PAUSE MISSION';
}

$('#openQuestionBtn').onclick=async()=>{
  const meta=session?.meta;if(!meta||meta.status!=='PLAYING')return;
  await update(sessionRef(sessionCode,'meta'),{questionState:'ANSWERING'});
};

async function reveal(force=false){
  const meta=session.meta||{};if(meta.questionState!=='ANSWERING')return;
  if(!force&&lockedTeams().length<6)return;
  if(force&&lockedTeams().length<6&&!confirm(`Baru ${lockedTeams().length}/6 team locked. Reveal Anyway?`))return;
  const key=qKey(meta);const expected=session.private?.answerKeys?.[key];
  if(expected===undefined){toast('Answer key tidak ditemukan.');return;}
  const q=currentPublicQuestion();const updates={};
  for(const t of TEAMS){
    const a=session.answers?.[key]?.[t.id];if(!a?.locked)continue;
    const ok=validateAnswer(a.answer,expected);updates[`answers/${key}/${t.id}/correct`]=ok;
    if(!a.scored){updates[`answers/${key}/${t.id}/scored`]=true;if(ok){const old=Number(session.teams?.[t.id]?.score||0);updates[`teams/${t.id}/score`]=old+Number(q?.score||0);}}
  }
  updates[`revealPublic/${key}`]={answer:expected,explanation:q?.explanation||'',revealedAt:serverTimestamp()};
  updates['meta/questionState']='REVEALED';
  await update(sessionRef(sessionCode),updates);
}
$('#revealBtn').onclick=()=>reveal(false).catch(e=>toast(e.message));
$('#revealAnywayBtn').onclick=()=>reveal(true).catch(e=>toast(e.message));

function roundCorrectCount(teamId, roundIndex){
  let correct=0;
  for(let qi=1;qi<=3;qi++){
    const key=`r${roundIndex+1}q${qi}`;
    const a=session?.answers?.[key]?.[teamId];
    const expected=session?.private?.answerKeys?.[key];
    if(a?.locked&&expected!==undefined&&validateAnswer(a.answer,expected))correct++;
  }
  return correct;
}

function passedRoundsBefore(teamId, roundIndex){
  let passed=0;
  for(let rr=0;rr<roundIndex;rr++)if(roundCorrectCount(teamId,rr)>=2)passed++;
  return passed;
}

$('#nextBtn').onclick=async()=>{
  const m=session.meta||{};if(m.questionState!=='REVEALED')return;
  const r=Number(m.currentRound||0),q=Number(m.currentQuestion||0);const updates={};
  if(q<2){
    updates['meta/currentQuestion']=q+1;
    updates['meta/questionState']='WAITING';
  }else{
    const moves={},counts={},from={},to={};
    TEAMS.forEach(t=>{
      const correct=roundCorrectCount(t.id,r);
      const pass=correct>=2;
      const before=passedRoundsBefore(t.id,r);
      const exactPos=Math.min(3,before+(pass?1:0));
      counts[t.id]=correct;
      moves[t.id]=pass;
      from[t.id]=Math.min(3,before);
      to[t.id]=exactPos;
      updates[`teams/${t.id}/position`]=exactPos;
      updates[`teams/${t.id}/round${r+1}`]=pass;
    });
    updates['meta/checkpointMoves']=moves;
    updates['meta/checkpointCorrectCounts']=counts;
    updates['meta/checkpointFromPositions']=from;
    updates['meta/checkpointToPositions']=to;
    updates['meta/questionState']='CHECKPOINT';
  }
  await update(sessionRef(sessionCode),updates);
};

$('#pauseBtn').onclick=async()=>{
  const m=session.meta||{};if(m.status==='PAUSED')await update(sessionRef(sessionCode,'meta'),{status:'PLAYING',paused:false});
  else if(m.status==='PLAYING')await update(sessionRef(sessionCode,'meta'),{status:'PAUSED',paused:true});
};

function renderFinalMission(){
  const show=session?.meta?.status==='FINAL_MISSION'||session?.meta?.status==='COMPLETED';$('#finalMissionPanel').classList.toggle('hidden',!show);if(!show)return;
  $('#finalScoreInputs').innerHTML=TEAMS.map(t=>`<div class="final-score"><b>${t.name}</b><br><label>Skor 0–10 <input class="final-input" data-team="${t.id}" type="number" min="0" max="10" value="${Number(session.teams?.[t.id]?.finalScore||0)}"></label></div>`).join('');
}

$('#saveFinalBtn').onclick=async()=>{const u={};document.querySelectorAll('.final-input').forEach(x=>u[`teams/${x.dataset.team}/finalScore`]=Math.max(0,Math.min(10,Number(x.value||0))));await update(sessionRef(sessionCode),u);toast('Final Mission tersimpan.');};
$('#completeSessionBtn').onclick=async()=>{if(!confirm('Tandai sesi sebagai COMPLETED?'))return;await update(sessionRef(sessionCode,'meta'),{status:'COMPLETED'});};

$('#resetSessionBtn').onclick=async()=>{
  if(!sessionCode)return;if(!confirm('Semua jawaban, skor, progress, dan posisi pion untuk sesi ini akan dihapus. Lanjutkan?'))return;
  const pins=session.private?.teamPins||{};const keys=session.private?.answerKeys||{};const teams={};TEAMS.forEach(t=>teams[t.id]={name:t.name,color:t.color,position:0,score:0,round1:false,round2:false,round3:false,finalScore:0});
  await update(sessionRef(sessionCode),{meta:{code:sessionCode,status:'LOBBY',createdBy:auth.currentUser.uid,createdAt:serverTimestamp(),currentRound:0,currentQuestion:0,questionState:'WAITING',paused:false},teams,teamClaims:null,presence:null,answers:null,revealPublic:null,private:{teamPins:pins,answerKeys:keys}});toast('Session direset.');
};