import {
  auth, db, teamAnonymousLogin, logout,
  ref, get, set, onValue, onDisconnect, serverTimestamp,
  sessionRef, currentQuestionKey
} from './firebase-core.js';

const $=(s)=>document.querySelector(s);
let code='';let teamId='';let teamName='';let teamPin='';let meta=null;let question=null;let selected=null;let ownAnswer=null;let revealData=null;
let unsubs=[];let questionToken='';let answerUnsub=null;let revealUnsub=null;let firebaseConnected=false;

function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200);}
function safe(v=''){return String(v).replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));}
function currentKey(){return meta?currentQuestionKey(meta):'';}
function clearUnsubs(){unsubs.forEach(fn=>{try{fn();}catch{}});unsubs=[];if(answerUnsub){answerUnsub();answerUnsub=null;}if(revealUnsub){revealUnsub();revealUnsub=null;}}

async function refreshPresence(){
  if(!firebaseConnected||!code||!teamId||!auth.currentUser)return;
  try{await setupPresence(auth.currentUser.uid);}catch(err){console.warn('Presence refresh skipped:',err);}
}

onValue(ref(db,'.info/connected'),snap=>{
  const online=snap.val()===true;firebaseConnected=online;
  const b=$('#connectionBadge');b.textContent=online?'🟢 Online':'🟡 Reconnecting';b.className='connection-badge '+(online?'online':'reconnecting');
  if(online)refreshPresence();
});

document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshPresence();});
window.addEventListener('focus',()=>refreshPresence());

$('#joinBtn').onclick=()=>joinFromForm();
$('#leaveBtn').onclick=async()=>{localStorage.removeItem('soc_team_join');clearUnsubs();await logout();location.reload();};

async function joinFromForm(auto=false){
  $('#joinError').textContent='';
  const saved=auto?JSON.parse(localStorage.getItem('soc_team_join')||'null'):null;
  code=(saved?.code||$('#gameCodeInput').value).replace(/\D/g,'').slice(0,6);
  teamId=saved?.teamId||$('#teamSelect').value;
  teamPin=saved?.pin||$('#teamPinInput').value.replace(/\D/g,'').slice(0,4);
  if(code.length!==6||teamPin.length!==4){if(!auto)$('#joinError').textContent='Game Code harus 6 digit dan PIN harus 4 digit.';return;}
  const joinBtn=$('#joinBtn');
  if(joinBtn){joinBtn.disabled=true;joinBtn.textContent='CONNECTING...';}
  try{
    const user=await teamAnonymousLogin();
    const metaSnap=await get(sessionRef(code,'meta'));
    if(!metaSnap.exists())throw new Error('Game Code tidak ditemukan.');
    try{
      await set(sessionRef(code,`teamClaims/${teamId}`),{uid:user.uid,pin:teamPin,claimedAt:serverTimestamp()});
    }catch(err){
      console.error('Team claim rejected:',err);
      throw new Error('PIN salah atau Team sudah dipakai perangkat lain. Periksa PIN atau minta Teacher memilih Replace Device.');
    }
    teamName=`Kelompok ${Number(teamId.replace('team',''))}`;
    localStorage.setItem('soc_team_join',JSON.stringify({code,teamId,pin:teamPin}));
    try{
      await setupPresence(user.uid);
    }catch(err){
      console.error('Presence rejected:',err);
      throw new Error('PIN sudah diterima, tetapi koneksi Team belum diizinkan oleh Firebase Rules bagian presence.');
    }
    $('#joinView').classList.add('hidden');$('#missionView').classList.remove('hidden');
    $('#teamName').textContent=teamName.toUpperCase();$('#teamSession').textContent=`✅ Connected • Game ${code}`;
    attachSessionListeners();
  }catch(err){
    if(!auto)$('#joinError').textContent=err.message||'Tidak dapat join mission.';else localStorage.removeItem('soc_team_join');
  }finally{
    if(joinBtn&&!$('#joinView').classList.contains('hidden')){joinBtn.disabled=false;joinBtn.textContent='JOIN MISSION';}
  }
}

async function setupPresence(uid){
  const pRef=sessionRef(code,`presence/${teamId}`);
  await set(pRef,{state:'online',uid,lastSeen:serverTimestamp()});
  try{
    await onDisconnect(pRef).set({state:'offline',uid,lastSeen:serverTimestamp()});
  }catch(err){
    console.warn('onDisconnect registration skipped:',err);
  }
}

function attachSessionListeners(){
  clearUnsubs();
  unsubs.push(onValue(sessionRef(code,'meta'),async snap=>{
    if(!snap.exists()){showStatus('⚠️','Session berakhir','Sesi tidak ditemukan. Hubungi Teacher.');return;}
    meta=snap.val();
    await attachQuestionData();render();
  }));
}

async function attachQuestionData(){
  if(!meta)return;const token=currentKey();
  if(token===questionToken)return;questionToken=token;selected=null;ownAnswer=null;revealData=null;
  if(answerUnsub){answerUnsub();answerUnsub=null;}if(revealUnsub){revealUnsub();revealUnsub=null;}
  const qSnap=await get(sessionRef(code,`publicQuestions/${token}`));question=qSnap.val();
  answerUnsub=onValue(sessionRef(code,`answers/${token}/${teamId}`),snap=>{ownAnswer=snap.val();render();});
  revealUnsub=onValue(sessionRef(code,`revealPublic/${token}`),snap=>{revealData=snap.val();render();});
}

function render(){
  if(!meta)return;
  $('#roundLabel').textContent=`ROUND ${Number(meta.currentRound||0)+1}`;
  $('#questionProgress').textContent=`Question ${Number(meta.currentQuestion||0)+1} / 3`;
  if(meta.status==='PAUSED'){disableQuestion();showStatus('⏸','MISSION PAUSED','Waiting for Teacher...');return;}
  if(meta.status==='LOBBY'){disableQuestion();showStatus('⏳','Waiting for Teacher...','Sesi sudah terhubung. Guru belum memulai permainan.');return;}
  if(meta.status==='FINAL_MISSION'){
    disableQuestion();showStatus('🏆','FINAL MISSION — WHAT WOULD YOU DO?','Gunakan LKPD untuk mengidentifikasi masalah, menentukan prinsip Respect/Educate/Protect, menyusun solusi, lalu siapkan Flash Pitch.');return;
  }
  if(meta.status==='COMPLETED'){disableQuestion();showStatus('🎉','MISSION COMPLETE','Terima kasih. Tunggu arahan guru untuk Post-Test dan Reflection.');return;}
  if(meta.questionState==='WAITING'){disableQuestion();showStatus('⏳','WAITING FOR NEXT MISSION','Soal akan dibuka oleh Teacher.');return;}
  if(meta.questionState==='ANSWERING'){
    if(ownAnswer?.locked){disableQuestion();showStatus('🔒','ANSWER LOCKED','Jawaban kelompok telah dikunci. Waiting for Teacher...');return;}
    renderQuestion();showStatus('💬','DISCUSS & ANSWER','Pilih jawaban setelah berdiskusi dan mencatat alasan pada LKPD.',true);return;
  }
  if(meta.questionState==='REVEALED'){renderQuestion(true);renderResult();return;}
  disableQuestion();showStatus('⏳','Waiting for Teacher...','Menunggu instruksi berikutnya.');
}

function disableQuestion(){
  $('#questionTitle').textContent='Waiting for Teacher...';$('#questionText').textContent='';$('#answerArea').innerHTML='';$('#lockBtn').disabled=true;
}

function renderQuestion(readonly=false){
  if(!question)return;
  $('#questionTitle').textContent=question.name||'Mission Question';$('#questionText').textContent=question.question||'';
  const area=$('#answerArea');
  if(question.type==='matching'){
    const prior=Array.isArray(ownAnswer?.answer)?ownAnswer.answer:[];
    area.innerHTML=(question.options||[]).map((label,i)=>`<div class="match-row"><b>${safe(label)}</b><select class="match-select" data-i="${i}" ${readonly?'disabled':''}><option value="">— Pilih pasangan —</option>${(question.matchOptions||[]).map((v,k)=>{const val=String.fromCharCode(65+k);return `<option value="${val}" ${prior[i]===val?'selected':''}>${safe(v)}</option>`;}).join('')}</select></div>`).join('');
    if(!readonly)area.querySelectorAll('.match-select').forEach(s=>s.onchange=()=>{selected=[...area.querySelectorAll('.match-select')].map(x=>x.value);updateLockButton();});
  }else{
    const multi=question.type==='multiple-response';const prior=ownAnswer?.answer;
    area.innerHTML=(question.options||[]).map((text,i)=>{const val=String.fromCharCode(65+i);const checked=Array.isArray(prior)?prior.includes(val):prior===val;return `<label class="answer-option ${checked?'selected':''}"><input type="${multi?'checkbox':'radio'}" name="answer" value="${val}" ${checked?'checked':''} ${readonly?'disabled':''}><span>${safe(text)}</span></label>`;}).join('');
    if(!readonly)area.querySelectorAll('input').forEach(inp=>inp.onchange=()=>{
      if(multi){selected=[...area.querySelectorAll('input:checked')].map(x=>x.value).sort();}else selected=area.querySelector('input:checked')?.value||null;
      area.querySelectorAll('.answer-option').forEach(l=>l.classList.toggle('selected',l.querySelector('input').checked));updateLockButton();
    });
  }
  $('#lockBtn').disabled=readonly||ownAnswer?.locked||!hasCompleteAnswer();
}

function hasCompleteAnswer(){
  if(question?.type==='matching')return Array.isArray(selected)&&selected.length===(question.options||[]).length&&selected.every(Boolean);
  if(question?.type==='multiple-response')return Array.isArray(selected)&&selected.length>0;
  return !!selected;
}
function updateLockButton(){$('#lockBtn').disabled=!hasCompleteAnswer()||meta?.questionState!=='ANSWERING';}

$('#lockBtn').onclick=async()=>{
  if(!hasCompleteAnswer()||meta?.questionState!=='ANSWERING')return;
  $('#lockBtn').disabled=true;toast('Submitting Answer...');
  try{
    await set(sessionRef(code,`answers/${currentKey()}/${teamId}`),{answer:selected,locked:true,uid:auth.currentUser.uid,submittedAt:serverTimestamp()});
  }catch(err){toast(err.message||'Jawaban gagal dikirim.');$('#lockBtn').disabled=false;}
};

function showStatus(icon,title,text){
  $('#statusIcon').textContent=icon;$('#statusTitle').textContent=title;$('#statusText').textContent=text;$('#feedbackBox').classList.add('hidden');
}

function renderResult(){
  if(!ownAnswer||typeof ownAnswer.correct!=='boolean'){showStatus('⏳','REVEALED','Memuat hasil kelompok...');return;}
  const ok=ownAnswer.correct;$('#statusIcon').textContent=ok?'✅':'✕';$('#statusTitle').textContent=ok?'MISSION PASSED':'NOT YET';$('#statusText').textContent=ok?'Jawaban kelompokmu tepat.':'Jawaban kelompokmu belum tepat.';
  const f=$('#feedbackBox');f.className='feedback '+(ok?'ok':'no');f.innerHTML=`<b>Correct Answer:</b> ${safe(Array.isArray(revealData?.answer)?revealData.answer.join(' • '):revealData?.answer||'—')}<br><br>${safe(revealData?.explanation||'')}`;f.classList.remove('hidden');
}

(async()=>{if(typeof auth.authStateReady==='function')await auth.authStateReady();const saved=localStorage.getItem('soc_team_join');if(saved)joinFromForm(true);})();
