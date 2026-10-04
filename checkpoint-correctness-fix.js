import { get, update, onValue, sessionRef, validateAnswer } from './firebase-core.js?v=20261004-movementfix2';

const TEAM_IDS=['team1','team2','team3','team4','team5','team6'];
const PASS_CORRECT=2;
let activeCode='';
let unsubMeta=null;
let repairing=false;
let pending=false;

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
    let previousPassed=0;
    for(let rr=1;rr<=r;rr++){
      const c=countRound(teamId,rr,answers,keys,answerUpdates);
      const passed=c>=PASS_CORRECT;
      if(passed)previousPassed++;
      if(teams?.[teamId]?.[`round${rr}`]!==passed)updates[`teams/${teamId}/round${rr}`]=passed;
    }

    const currentCorrect=countRound(teamId,r+1,answers,keys,answerUpdates);
    const pass=currentCorrect>=PASS_CORRECT;
    const newPos=Math.min(3,previousPassed+(pass?1:0));

    counts[teamId]=currentCorrect;
    moves[teamId]=pass;
    from[teamId]=Math.min(3,previousPassed);
    to[teamId]=newPos;

    if(Number(teams?.[teamId]?.position||0)!==newPos)updates[`teams/${teamId}/position`]=newPos;
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

  if(Object.keys(updates).length)await update(sessionRef(code),updates);
}

async function repairCheckpoint(code,meta){
  if(repairing){pending=true;return;}
  repairing=true;
  try{await calculateCheckpoint(code,meta);}catch(err){console.error('Checkpoint correctness repair:',err);}
  finally{
    repairing=false;
    if(pending){pending=false;repairCheckpoint(code,meta);}
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
  const r=Number(meta.currentRound||0),q=Number(meta.currentQuestion||0);
  if(q<2){
    await update(sessionRef(code,'meta'),{currentQuestion:q+1,questionState:'WAITING'});
    return;
  }
  await calculateCheckpoint(code,meta);
}

function bindNext(){
  const btn=document.getElementById('nextBtn');
  if(!btn||btn.dataset.correctMovementFix==='1')return;
  btn.dataset.correctMovementFix='1';
  btn.addEventListener('click',nextWithCorrectMovement,true);
}

function attach(code){
  if(!code||code===activeCode)return;
  if(unsubMeta){try{unsubMeta();}catch{}}
  activeCode=code;
  unsubMeta=onValue(sessionRef(code,'meta'),snap=>{
    const meta=snap.val()||{};
    if(meta.questionState==='CHECKPOINT')repairCheckpoint(code,meta);
  });
}

setInterval(()=>{
  bindNext();
  const code=currentCode();
  if(code)attach(code);
},300);
