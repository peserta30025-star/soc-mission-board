import { get, update, onValue, sessionRef, validateAnswer } from './firebase-core.js?v=20261004-answerfix1';

const TEAM_IDS=['team1','team2','team3','team4','team5','team6'];
let activeCode='';
let unsubMeta=null;
let repairing=false;
let pending=false;

function currentCode(){
  const code=(document.getElementById('gameCode')?.textContent||'').replace(/\D/g,'').slice(0,6);
  return code.length===6?code:'';
}

async function repairSession(code){
  if(repairing){pending=true;return;}
  repairing=true;
  try{
    const [answersSnap,keysSnap,questionsSnap,teamsSnap]=await Promise.all([
      get(sessionRef(code,'answers')),
      get(sessionRef(code,'private/answerKeys')),
      get(sessionRef(code,'publicQuestions')),
      get(sessionRef(code,'teams'))
    ]);
    const answers=answersSnap.val()||{};
    const keys=keysSnap.val()||{};
    const questions=questionsSnap.val()||{};
    const teams=teamsSnap.val()||{};
    const updates={};

    for(const teamId of TEAM_IDS){
      let total=0;
      for(const [key,expected] of Object.entries(keys)){
        const a=answers?.[key]?.[teamId];
        if(!a?.locked)continue;
        const ok=validateAnswer(a.answer,expected);
        if(a.correct!==ok)updates[`answers/${key}/${teamId}/correct`]=ok;
        if(ok)total+=Number(questions?.[key]?.score||0);
      }
      if(Number(teams?.[teamId]?.score||0)!==total)updates[`teams/${teamId}/score`]=total;
    }

    if(Object.keys(updates).length)await update(sessionRef(code),updates);
  }catch(err){
    console.warn('Correctness repair skipped:',err);
  }finally{
    repairing=false;
    if(pending){pending=false;repairSession(code);}
  }
}

function attach(code){
  if(!code||code===activeCode)return;
  if(unsubMeta){try{unsubMeta();}catch{}}
  activeCode=code;
  unsubMeta=onValue(sessionRef(code,'meta'),snap=>{
    const meta=snap.val()||{};
    if(meta.questionState==='REVEALED'||meta.questionState==='CHECKPOINT')repairSession(code);
  });
}

setInterval(()=>{
  const code=currentCode();
  if(code)attach(code);
},400);
