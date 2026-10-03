import { get, update, onValue, sessionRef } from './firebase-core.js';

const TEAM_COLORS=['#4aa3ff','#56df9b','#ffd166','#ff6b6b','#b990ff','#ff9f43'];
const TEAM_NAMES=['Kelompok 1','Kelompok 2','Kelompok 3','Kelompok 4','Kelompok 5','Kelompok 6'];
const PASS_CORRECT=2;
let activeCode='';
let meta=null;
let teams={};
let unsubMeta=null;
let unsubTeams=null;
let lastCheckpointKey='';
let oldBodyOverflow='';

function slots(){return '<div class="ct-slots">'+Array.from({length:6},()=>'<span class="ct-slot"></span>').join('')+'</div>';}

function injectUI(){
  if(document.getElementById('checkpointOverlay'))return;
  const style=document.createElement('style');
  style.textContent=`
  .checkpoint-overlay{position:fixed;inset:0;z-index:9999;background:#fffdf7;display:none;overflow:auto;color:#174f78;font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
  .checkpoint-overlay.show{display:block}
  .ct-shell{min-height:100vh;display:grid;grid-template-columns:minmax(0,1fr) 340px;background:#fffdf7}
  .ct-board-wrap{padding:10px 12px 82px;min-width:0;background:radial-gradient(circle at 0 4%,rgba(245,207,106,.50) 0 9%,transparent 9.4%),radial-gradient(circle at 100% 0,rgba(136,207,238,.44) 0 9%,transparent 9.4%),#fffdf7}
  .ct-head{text-align:center;margin:0 auto 22px;position:relative;max-width:850px}.ct-crown{font-size:2.2rem;line-height:1;margin-bottom:-4px}.ct-title{display:inline-block;padding:15px 46px 13px;border:3px solid #d1a05f;border-radius:48px;background:#fff8ed;color:#174e78;font-size:clamp(2.7rem,5.1vw,5rem);line-height:1;font-weight:1000;letter-spacing:.035em;box-shadow:0 5px 0 rgba(190,137,61,.12)}
  .ct-ribbon{width:max-content;max-width:92%;margin:-8px auto 0;padding:10px 38px;border-radius:999px;background:#1989c8;color:#fff;font-size:clamp(1.1rem,2.1vw,2rem);font-weight:1000;letter-spacing:.04em;box-shadow:0 5px 14px rgba(25,137,200,.18)}
  .ct-main{position:relative;min-height:700px;padding-bottom:72px}.ct-round{position:relative;height:194px;border-radius:34px;border:2px solid currentColor;overflow:visible;box-shadow:0 8px 18px rgba(17,74,110,.06)}.ct-round+.ct-round{margin-top:26px}
  .ct-r1{color:#178fcf;background:linear-gradient(180deg,#def4ff,#eefbff)}.ct-r2{color:#e9a71a;background:linear-gradient(180deg,#fff1c2,#fff9e2)}.ct-r3{color:#eb5d72;background:linear-gradient(180deg,#ffe0e7,#fff1f4)}
  .ct-round.active{box-shadow:0 0 0 4px rgba(255,255,255,.94),0 0 0 7px currentColor,0 12px 26px rgba(16,77,112,.12)}
  .ct-round-tag{position:absolute;left:92px;top:-17px;min-width:136px;padding:8px 24px;border-radius:999px;background:currentColor;color:#fff;text-align:center;font-weight:1000;font-size:1.08rem;letter-spacing:.055em;z-index:9;box-shadow:0 5px 12px rgba(0,0,0,.10)}
  .ct-lane{position:absolute;left:62px;right:12px;top:62px;height:50px;border-radius:999px;background:currentColor;box-shadow:inset 0 -4px 0 rgba(255,255,255,.2)}
  .ct-arrow{position:absolute;top:70px;color:#fff;font-size:1.72rem;font-weight:1000;letter-spacing:.05em;z-index:4;text-shadow:0 2px 4px rgba(0,0,0,.11)}.ct-a1{left:17%}.ct-a2{left:51%}.ct-a3{right:2%}
  .ct-start,.ct-finish{position:absolute;width:106px;height:106px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:#175a86;color:#fff;border:5px solid #fff;box-shadow:0 0 0 4px #175a86,0 10px 18px rgba(16,77,112,.18);font-weight:1000;z-index:12}.ct-start{left:12px;top:43px}.ct-finish{right:3px;top:43px}.ct-start .ico,.ct-finish .ico{font-size:1.55rem;line-height:1}.ct-start b,.ct-finish b{font-size:1.16rem;margin-top:5px}
  .ct-cp{position:absolute;top:30px;width:29%;height:128px;border-radius:32px;border:3px solid currentColor;background:rgba(255,255,255,.86);box-shadow:0 6px 14px rgba(16,77,112,.07);z-index:6}.ct-cp1{left:24.5%}.ct-cp2{left:60.8%}.ct-cp-title{display:flex;align-items:center;justify-content:center;gap:9px;padding-top:14px;color:#22597f;font-size:1.08rem;font-weight:1000}
  .ct-slots{position:absolute;left:15px;right:15px;bottom:14px;display:grid;grid-template-columns:repeat(6,1fr);gap:7px}.ct-slot{display:block;aspect-ratio:1;border-radius:50%;border:2px solid currentColor;background:rgba(255,255,255,.72)}
  .ct-team-strip{position:absolute;left:48px;right:48px;bottom:0;min-height:64px;border:2px solid #76c8e3;border-radius:22px;background:rgba(255,255,255,.94);display:grid;grid-template-columns:repeat(6,1fr);gap:8px;align-items:center;padding:8px 10px;box-shadow:0 8px 18px rgba(17,74,110,.06)}.ct-team{height:44px;border-radius:17px;display:flex;align-items:center;justify-content:center;gap:9px;background:linear-gradient(180deg,#fff,#f6fbfe);color:#245b82;font-weight:1000}.ct-team-dot{width:25px;height:25px;border-radius:50%;border:3px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,.15)}
  .ct-pawn{position:absolute;width:35px;height:35px;border-radius:50%;transform:translate(-50%,-50%);display:grid;place-items:center;border:3px solid #fff;z-index:25;box-shadow:0 6px 12px rgba(0,0,0,.24),inset 0 3px 7px rgba(255,255,255,.35);transition:left 1.35s cubic-bezier(.2,.85,.25,1),top 1.35s cubic-bezier(.2,.85,.25,1);animation:ctIdle 1.7s ease-in-out infinite alternate}.ct-pawn:after{content:"";position:absolute;left:19%;right:19%;bottom:-8px;height:9px;border-radius:50%;background:inherit;border:2px solid rgba(255,255,255,.92);z-index:-1}.ct-pawn span{font-size:.72rem;font-weight:1000;color:#08314c}.ct-pawn.moving{animation:ctMove .3s ease-in-out infinite alternate}
  @keyframes ctIdle{from{margin-top:0}to{margin-top:-2px}}@keyframes ctMove{from{margin-top:-3px;transform:translate(-50%,-50%) scale(1)}to{margin-top:2px;transform:translate(-50%,-50%) scale(1.08)}}
  .ct-side{background:#fffaf0;border-left:2px solid #84cce7;padding:18px 18px 92px;box-shadow:-10px 0 30px rgba(16,70,104,.06)}.ct-side-title{background:#17638f;color:#fff;border-radius:0 0 24px 24px;text-align:center;font-size:1.45rem;font-weight:1000;padding:12px 10px;margin:-18px 0 18px}.ct-progress-list{display:grid;gap:14px}.ct-progress-item{display:grid;grid-template-columns:50px 1fr auto;align-items:center;gap:12px;padding:16px 14px;border:1px solid #cfe0e8;border-radius:22px;background:#fff;min-height:98px}.ct-num{width:45px;height:45px;border-radius:14px;display:grid;place-items:center;font-weight:1000;font-size:1.18rem;color:#08314c}.ct-progress-item b{display:block;font-size:1.05rem}.ct-progress-item small{display:block;margin-top:5px;color:#64829a;font-size:.95rem}.ct-score{font-weight:1000;color:#cc8400;font-size:1.05rem}
  .ct-bottom{position:fixed;left:0;right:0;bottom:0;z-index:10010;display:flex;align-items:center;justify-content:center;gap:20px;padding:13px 18px;background:rgba(255,253,247,.96);border-top:1px solid #d7e6ed;backdrop-filter:blur(10px);box-shadow:0 -8px 26px rgba(16,70,104,.10)}.ct-bottom strong{color:#174f78}.ct-bottom span{color:#64829a}.ct-continue{border:0;border-radius:16px;padding:13px 24px;background:#47b877;color:#fff;font-weight:1000;font-size:1rem;cursor:pointer;box-shadow:0 8px 18px rgba(71,184,119,.25)}.ct-continue:disabled{opacity:.42;cursor:not-allowed}
  @media(max-width:1100px){.ct-shell{grid-template-columns:1fr 280px}.ct-board-wrap{padding-left:8px;padding-right:8px}.ct-round-tag{left:78px}.ct-cp1{left:23.5%}.ct-cp2{left:60%}}
  @media(max-width:820px){.ct-shell{display:block}.ct-side{border-left:0;border-top:2px solid #84cce7}.ct-main{min-width:760px}.ct-board-wrap{overflow:auto}.ct-head{min-width:760px}.ct-bottom{position:sticky;bottom:0;flex-wrap:wrap}.ct-progress-list{grid-template-columns:repeat(2,1fr)}}
  `;
  document.head.appendChild(style);

  const overlay=document.createElement('div');
  overlay.id='checkpointOverlay';
  overlay.className='checkpoint-overlay';
  overlay.innerHTML=`
    <div class="ct-shell">
      <div class="ct-board-wrap">
        <div class="ct-head"><div class="ct-crown">👑</div><div class="ct-title">TODAY MISSION</div><div class="ct-ribbon">SOC MISSION BOARD</div></div>
        <div class="ct-main" id="ctMain">
          <section class="ct-round ct-r1" data-round="1"><div class="ct-round-tag">ROUND 1</div><div class="ct-start"><span class="ico">⚑</span><b>START</b></div><div class="ct-lane"></div><span class="ct-arrow ct-a1">›››</span><span class="ct-arrow ct-a2">›››</span><span class="ct-arrow ct-a3">›››</span><div class="ct-cp ct-cp1"><div class="ct-cp-title">⚑ <b>CP 1</b></div>${slots()}</div><div class="ct-cp ct-cp2"><div class="ct-cp-title">⚑ <b>CP 2</b></div>${slots()}</div></section>
          <section class="ct-round ct-r2" data-round="2"><div class="ct-round-tag">ROUND 2</div><div class="ct-lane"></div><span class="ct-arrow ct-a1">›››</span><span class="ct-arrow ct-a2">›››</span><span class="ct-arrow ct-a3">›››</span><div class="ct-cp ct-cp1"><div class="ct-cp-title">⚑ <b>CP 1</b></div>${slots()}</div><div class="ct-cp ct-cp2"><div class="ct-cp-title">⚑ <b>CP 2</b></div>${slots()}</div></section>
          <section class="ct-round ct-r3" data-round="3"><div class="ct-round-tag">ROUND 3</div><div class="ct-lane"></div><span class="ct-arrow ct-a1">›››</span><span class="ct-arrow ct-a2">›››</span><span class="ct-arrow ct-a3">›››</span><div class="ct-cp ct-cp1"><div class="ct-cp-title">⚑ <b>CP 1</b></div>${slots()}</div><div class="ct-cp ct-cp2"><div class="ct-cp-title">⚑ <b>CP 2</b></div>${slots()}</div><div class="ct-finish"><span class="ico">🏆</span><b>FINISH</b></div></section>
          <div class="ct-team-strip">${TEAM_NAMES.map((_,i)=>`<div class="ct-team"><span class="ct-team-dot" style="background:${TEAM_COLORS[i]}"></span><span>K${i+1}</span></div>`).join('')}</div>
          <div id="checkpointPawns"></div>
        </div>
      </div>
      <aside class="ct-side"><div class="ct-side-title">TEAM PROGRESS</div><div id="ctProgressList" class="ct-progress-list"></div></aside>
    </div>
    <div class="ct-bottom"><div><strong id="checkpointTitle">ROUND COMPLETE</strong><br><span id="checkpointText">Pion yang memenuhi syarat akan bergerak.</span></div><button id="checkpointContinueBtn" class="ct-continue" disabled>LANJUT ROUND 2 →</button></div>`;
  document.body.appendChild(overlay);
  document.getElementById('checkpointContinueBtn').onclick=continueAfterCheckpoint;
}

function currentCode(){
  const c=(document.getElementById('gameCode')?.textContent||'').replace(/\D/g,'');
  return c.length===6?c:'';
}

function stopWatch(){
  try{unsubMeta?.();}catch{};try{unsubTeams?.();}catch{}
  unsubMeta=null;unsubTeams=null;
}

function attach(code){
  if(!code||code===activeCode)return;
  stopWatch();activeCode=code;
  unsubMeta=onValue(sessionRef(code,'meta'),s=>{meta=s.val()||{};renderCheckpoint();});
  unsubTeams=onValue(sessionRef(code,'teams'),s=>{teams=s.val()||{};renderCheckpoint();});
}

function positionLabel(p){return p===1?'CHECKPOINT 1':p===2?'CHECKPOINT 2':p>=3?'FINISH':'START';}

function pawnPos(progress,i){
  const positions={
    0:[[6.2,17.8],[9.2,17.8],[12.2,17.8],[6.2,22.5],[9.2,22.5],[12.2,22.5]],
    1:[[29.0,18.5],[33.0,18.5],[37.0,18.5],[41.0,18.5],[45.0,18.5],[49.0,18.5]],
    2:[[64.5,50.8],[68.5,50.8],[72.5,50.8],[76.5,50.8],[80.5,50.8],[84.5,50.8]],
    3:[[87.0,82.3],[89.7,82.3],[92.4,82.3],[87.0,87.0],[89.7,87.0],[92.4,87.0]]
  };
  const p=Math.max(0,Math.min(3,Number(progress||0)));
  return {x:positions[p][i][0],y:positions[p][i][1]};
}

function renderProgress(){
  const list=document.getElementById('ctProgressList');if(!list)return;
  const counts=meta?.checkpointCorrectCounts||{};
  list.innerHTML=Array.from({length:6},(_,i)=>{
    const id=`team${i+1}`,t=teams[id]||{};const p=Number(t.position||0);const c=counts[id];
    const detail=meta?.questionState==='CHECKPOINT'&&c!==undefined?`${positionLabel(p)} • ${c}/3 benar`:positionLabel(p);
    return `<div class="ct-progress-item"><div class="ct-num" style="background:${TEAM_COLORS[i]}">${i+1}</div><div><b>${t.name||TEAM_NAMES[i]}</b><small>${detail}</small></div><div class="ct-score">${Number(t.score||0)}</div></div>`;
  }).join('');
}

function renderCheckpoint(){
  injectUI();
  const overlay=document.getElementById('checkpointOverlay');
  if(!meta||meta.questionState!=='CHECKPOINT'){
    if(overlay.classList.contains('show')){overlay.classList.remove('show');document.body.style.overflow=oldBodyOverflow;}
    return;
  }
  const r=Number(meta.currentRound||0);
  const target=Math.min(3,r+1);
  const moves=meta.checkpointMoves||{};
  const passed=TEAM_NAMES.filter((_,i)=>moves[`team${i+1}`]===true);
  document.getElementById('checkpointTitle').textContent=r<2?`ROUND ${r+1} SELESAI — CHECKPOINT ${target}`:'ROUND 3 SELESAI — FINISH';
  document.getElementById('checkpointText').textContent=passed.length?`Pion bergerak hanya untuk kelompok yang lolos minimal ${PASS_CORRECT}/3: ${passed.join(', ')}.`:`Belum ada kelompok yang mencapai minimal ${PASS_CORRECT}/3. Semua pion tetap di tempat.`;
  const continueBtn=document.getElementById('checkpointContinueBtn');
  continueBtn.textContent=r<2?`LANJUT ROUND ${r+2} →`:'LANJUT FINAL MISSION →';
  continueBtn.disabled=true;
  document.querySelectorAll('.ct-round').forEach(x=>x.classList.toggle('active',Number(x.dataset.round)===r+1));
  if(!overlay.classList.contains('show')){oldBodyOverflow=document.body.style.overflow;document.body.style.overflow='hidden';overlay.classList.add('show');overlay.scrollTop=0;}
  renderProgress();

  const key=`${activeCode}-${r}-${target}-${JSON.stringify(moves)}`;
  const holder=document.getElementById('checkpointPawns');
  if(lastCheckpointKey!==key){
    lastCheckpointKey=key;
    const from=meta.checkpointFromPositions||{};
    const to=meta.checkpointToPositions||{};
    holder.innerHTML=Array.from({length:6},(_,i)=>{
      const id=`team${i+1}`;
      const startPos=Math.max(0,Math.min(3,Number(from[id] ?? teams[id]?.position ?? 0)));
      const finalPos=Math.max(0,Math.min(3,Number(to[id] ?? teams[id]?.position ?? startPos)));
      const p=pawnPos(startPos,i);
      return `<span class="ct-pawn" data-team="${id}" data-target="${finalPos}" data-moved="${moves[id]===true?'1':'0'}" style="left:${p.x}%;top:${p.y}%;background:${TEAM_COLORS[i]}"><span>${i+1}</span></span>`;
    }).join('');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const moving=[];
      holder.querySelectorAll('.ct-pawn').forEach((pawn,i)=>{
        const moved=pawn.dataset.moved==='1';
        const p=pawnPos(Number(pawn.dataset.target),i);
        if(moved){pawn.classList.add('moving');moving.push(pawn);}else{pawn.style.transition='none';}
        pawn.style.left=p.x+'%';pawn.style.top=p.y+'%';
      });
      if(moving.length)playMoveSound();
      setTimeout(()=>{moving.forEach(p=>p.classList.remove('moving'));renderProgress();continueBtn.disabled=false;},moving.length?1500:250);
    }));
  }else{continueBtn.disabled=false;}
}

function playMoveSound(){
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    if(!window.__socCheckpointAudio)window.__socCheckpointAudio=new C();const ctx=window.__socCheckpointAudio;if(ctx.state==='suspended')ctx.resume();
    const now=ctx.currentTime;[523.25,659.25,783.99,987.77].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.0001,now+i*.11);g.gain.exponentialRampToValueAtTime(.10,now+i*.11+.018);g.gain.exponentialRampToValueAtTime(.0001,now+i*.11+.18);o.connect(g).connect(ctx.destination);o.start(now+i*.11);o.stop(now+i*.11+.2);});
  }catch{}
}

async function continueAfterCheckpoint(){
  const code=currentCode()||activeCode;if(!code)return;
  const snap=await get(sessionRef(code,'meta'));const m=snap.val()||{};
  if(m.questionState!=='CHECKPOINT')return;
  const r=Number(m.currentRound||0);
  if(r<2)await update(sessionRef(code,'meta'),{currentRound:r+1,currentQuestion:0,questionState:'WAITING'});
  else await update(sessionRef(code,'meta'),{status:'FINAL_MISSION',questionState:'COMPLETED'});
}

async function checkpointAwareNext(){
  const code=currentCode();if(!code)return;
  const metaSnap=await get(sessionRef(code,'meta'));const m=metaSnap.val()||{};
  if(m.questionState!=='REVEALED')return;
  const r=Number(m.currentRound||0),q=Number(m.currentQuestion||0);
  if(q<2){await update(sessionRef(code,'meta'),{currentQuestion:q+1,questionState:'WAITING'});return;}

  const [answersSnap,teamsSnap]=await Promise.all([get(sessionRef(code,'answers')),get(sessionRef(code,'teams'))]);
  const allAnswers=answersSnap.val()||{};
  const currentTeams=teamsSnap.val()||{};
  const moves={};const counts={};const from={};const to={};
  const updates={'meta/questionState':'CHECKPOINT'};

  for(let i=1;i<=6;i++){
    const id=`team${i}`;
    let correct=0;
    for(let qi=1;qi<=3;qi++){
      if(allAnswers[`r${r+1}q${qi}`]?.[id]?.correct===true)correct++;
    }
    counts[id]=correct;
    const oldPos=Math.max(0,Math.min(3,Number(currentTeams[id]?.position||0)));
    const pass=correct>=PASS_CORRECT;
    const newPos=pass?Math.min(3,oldPos+1):oldPos;
    moves[id]=pass;
    from[id]=oldPos;
    to[id]=newPos;
    updates[`teams/${id}/position`]=newPos;
    updates[`teams/${id}/round${r+1}`]=pass;
  }

  updates['meta/checkpointMoves']=moves;
  updates['meta/checkpointCorrectCounts']=counts;
  updates['meta/checkpointFromPositions']=from;
  updates['meta/checkpointToPositions']=to;
  await update(sessionRef(code),updates);
}

function hookNextButton(){
  const btn=document.getElementById('nextBtn');
  if(!btn||btn.dataset.checkpointHook==='v2')return;
  btn.dataset.checkpointHook='v2';
  btn.onclick=()=>checkpointAwareNext().catch(err=>console.error('Checkpoint flow:',err));
}

injectUI();
setInterval(()=>{hookNextButton();const c=currentCode();if(c)attach(c);},500);
