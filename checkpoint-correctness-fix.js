import { get, update, onValue, sessionRef, validateAnswer } from './firebase-core.js?v=20261004-movementfix3';

const TEAM_IDS=['team1','team2','team3','team4','team5','team6'];
const TEAM_NAMES=['Kelompok 1','Kelompok 2','Kelompok 3','Kelompok 4','Kelompok 5','Kelompok 6'];
const PASS_CORRECT=2;
let activeCode='';
let unsubMeta=null;
let repairing=false;
let pending=false;
let lastMeta=null;

function currentCode(){
  const code=(document.getElementById('gameCode')?.textContent||'').replace(/\D/g,'').slice(0,6);
  return code.length===6?code:'';
}

function countRound(teamId,roundNumber,answers,keys,answerUpdates){
  let correct=0;
  for(let qi=1;qi<=3;qi++){
    const key=`r${roundNumber}q${qi}`;
    const a=answers?.[key]?.[teamId];
    const expected=keys?.[key];
    if(!a?.locked||expected===undefined)continue;
    const ok=validateAnswer(a.answer,expected);
    if(a.correct!==ok)answerUpdates[`answers/${key}/${teamId}/correct`]=ok;
    if(ok)correct++;
  }
  return correct;
}

function scoreForTeam(teamId,answers,keys,questions,answerUpdates){
  let score=0;
  for(const [key,expected] of Object.entries(keys||{})){
    const a=answers?.[key]?.[teamId];
    if(!a?.locked)continue;
    const ok=validateAnswer(a.answer,expected);
    if(a.correct!==ok)answerUpdates[`answers/${key}/${teamId}/correct`]=ok;
    if(ok)score+=Number(questions?.[key]?.score||0);
  }
  return score;
}

function sameObj(a,b){return JSON.stringify(a||{})===JSON.stringify(b||{});}

function updateCongrats(meta){
  if(!meta||meta.questionState!=='CHECKPOINT')return;
  const title=document.getElementById('checkpointTitle');
  const text=document.getElementById('checkpointText');
  if(!text)return;
  const r=Number(meta.currentRound||0);
  const passed=TEAM_IDS.filter(id=>meta.checkpointMoves?.[id]===true).map(id=>TEAM_NAMES[Number(id.replace('team',''))-1]);
  if(title) title.textContent=r<2?`ROUND ${r+1} SELESAI — CHECKPOINT ${r+1}`:'ROUND 3 SELESAI — FINISH';
  text.textContent=passed.length
    ? `🎉 Selamat ${passed.join(', ')}! Pion kalian berhasil maju. Kelompok lain tetap di posisi sebelumnya. Syarat maju: minimal ${PASS_CORRECT} dari 3 jawaban benar.`
    : `Belum ada kelompok yang memenuhi minimal ${PASS_CORRECT} dari 3 jawaban benar. Semua pion tetap di posisi sebelumnya; poin yang diperoleh tetap tersimpan.`;
}

async function calculateCheckpoint(code,metaOverride=null){
  const [metaSnap,answersSnap,keysSnap,questionsSnap,teamsSnap]=await Promise.all([
    metaOverride?Promise.resolve({val:()=>metaOverride}):get(sessionRef(code,'meta')),
    get(sessionRef(code,'answers')),
    get(sessionRef(code,'private/answerKeys')),
    get(sessionRef(code,'publicQuestions')),
    get(sessionRef(code,'teams'))
  ]);
  const meta=metaSnap.val()||{};
  const answers=answersSnap.val()||{};
  const keys=keysSnap.val()||{};
  const questions=questionsSnap.val()||{};
  const teams=teamsSnap.val()||{};
  const r=Number(meta.currentRound||0);
  const moves={},counts={},from={},to={};
  const updates={};
  const answerUpdates={};

  for(const teamId of TEAM_IDS){
    let passedBefore=0;
    for(let rr=1;rr<=r;rr++){
      const c=countRound(teamId,rr,answers,keys,answerUpdates);
      const passed=c>=PASS_CORRECT;
      if(passed)passedBefore++;
      if(teams?.[teamId]?.[`round${rr}`]!==passed)updates[`teams/${teamId}/round${rr}`]=passed;
    }

    const currentCorrect=countRound(teamId,r+1,answers,keys,answerUpdates);
    const pass=currentCorrect>=PASS_CORRECT;
    const exactPos=Math.min(3,passedBefore+(pass?1:0));

    counts[teamId]=currentCorrect;
    moves[teamId]=pass;
    from[teamId]=Math.min(3,passedBefore);
    to[teamId]=exactPos;

    if(Number(teams?.[teamId]?.position||0)!==exactPos)updates[`teams/${teamId}/position`]=exactPos;
    if(teams?.[teamId]?.[`round${r+1}`]!==pass)updates[`teams/${teamId}/round${r+1}`]=pass;

    const score=scoreForTeam(teamId,answers,keys,questions,answerUpdates);
    if(Number(teams?.[teamId]?.score||0)!==score)updates[`teams/${teamId}/score`]=score;
  }

  Object.assign(updates,answerUpdates);
  if(!sameObj(meta.checkpointMoves,moves))updates['meta/checkpointMoves']=moves;
  if(!sameObj(meta.checkpointCorrectCounts,counts))updates['meta/checkpointCorrectCounts']=counts;
  if(!sameObj(meta.checkpointFromPositions,from))updates['meta/checkpointFromPositions']=from;
  if(!sameObj(meta.checkpointToPositions,to))updates['meta/checkpointToPositions']=to;
  if(meta.questionState!=='CHECKPOINT')updates['meta/questionState']='CHECKPOINT';

  if(Object.keys(updates).length){
    await update(sessionRef(code),updates);
    const mergedMeta={...meta,checkpointMoves:moves,checkpointCorrectCounts:counts,checkpointFromPositions:from,checkpointToPositions:to,questionState:'CHECKPOINT'};
    lastMeta=mergedMeta;
    setTimeout(()=>updateCongrats(mergedMeta),60);
  }else{
    lastMeta=meta;
    updateCongrats(meta);
  }
}

async function repairCheckpoint(code,meta){
  if(repairing){pending=true;lastMeta=meta;return;}
  repairing=true;
  try{await calculateCheckpoint(code,meta);}catch(err){console.error('Checkpoint truth repair:',err);}
  finally{
    repairing=false;
    if(pending){pending=false;repairCheckpoint(code,lastMeta||meta);}
  }
}

async function nextWithCorrectMovement(e){
  const code=currentCode();
  if(!code)return;
  e.preventDefault();
  e.stopImmediatePropagation();

  const metaSnap=await get(sessionRef(code,'meta'));
  const meta=metaSnap.val()||{};
  if(meta.questionState!=='REVEALED')return;
  const q=Number(meta.currentQuestion||0);
  if(q<2){
    await update(sessionRef(code,'meta'),{currentQuestion:q+1,questionState:'WAITING'});
    return;
  }
  await calculateCheckpoint(code,meta);
}

function bindNext(){
  const btn=document.getElementById('nextBtn');
  if(!btn||btn.dataset.correctMovementFix==='3')return;
  btn.dataset.correctMovementFix='3';
  btn.addEventListener('click',nextWithCorrectMovement,true);
}

function attach(code){
  if(!code||code===activeCode)return;
  if(unsubMeta){try{unsubMeta();}catch{}}
  activeCode=code;
  unsubMeta=onValue(sessionRef(code,'meta'),snap=>{
    const meta=snap.val()||{};
    lastMeta=meta;
    if(meta.questionState==='CHECKPOINT')repairCheckpoint(code,meta);
  });
}

setInterval(()=>{
  bindNext();
  const code=currentCode();
  if(code)attach(code);
  if(lastMeta?.questionState==='CHECKPOINT')updateCongrats(lastMeta);
},300);
