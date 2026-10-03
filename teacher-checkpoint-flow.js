import { db, get, update, onValue, sessionRef } from './firebase-core.js';

const TEAM_COLORS=['#4aa3ff','#56df9b','#ffd166','#ff6b6b','#b990ff','#ff9f43'];
let activeCode='';
let meta=null;
let teams={};
let unsubMeta=null;
let unsubTeams=null;
let lastCheckpointKey='';

function injectUI(){
  if(document.getElementById('checkpointOverlay'))return;
  const style=document.createElement('style');
  style.textContent=`
  .checkpoint-overlay{position:fixed;inset:0;z-index:9999;background:rgba(8,38,58,.78);backdrop-filter:blur(8px);display:none;align-items:center;justify-content:center;padding:28px}
  .checkpoint-overlay.show{display:flex}
  .checkpoint-card{width:min(1180px,96vw);background:linear-gradient(180deg,#fffdf7,#eef9ff);border:1px solid #cfe4ef;border-radius:30px;box-shadow:0 30px 80px rgba(0,0,0,.28);padding:28px}
  .checkpoint-head{text-align:center;margin-bottom:22px}.checkpoint-kicker{font-weight:1000;letter-spacing:.16em;color:#cf8b00}.checkpoint-head h2{font-size:2rem;margin:8px 0;color:#174f78}.checkpoint-head p{margin:0;color:#64829a;font-weight:700}
  .checkpoint-board{position:relative;display:grid;grid-template-columns:auto 1fr auto 1fr auto 1fr auto;align-items:center;gap:14px;padding:34px 26px 74px;border-radius:24px;background:linear-gradient(180deg,#eaf8ff,#fff7dd);overflow:hidden;border:1px solid #cfe4ef}
  .checkpoint-stage{width:128px;height:112px;border-radius:26px;background:#fff;border:3px solid #75c9e6;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;z-index:2;box-shadow:0 10px 24px rgba(16,70,104,.12)}
  .checkpoint-stage.active{border-color:#f0ad25;box-shadow:0 0 0 7px rgba(240,173,37,.18),0 12px 28px rgba(16,70,104,.16);transform:scale(1.05)}
  .checkpoint-stage span{font-size:2rem}.checkpoint-stage b{margin-top:6px;font-size:1rem}.checkpoint-line{height:10px;border-radius:999px;background:#badce9}
  .checkpoint-pawns{position:absolute;left:7%;right:7%;bottom:18px;height:42px}.checkpoint-pawn{position:absolute;width:34px;height:34px;border-radius:50%;border:4px solid #fff;box-shadow:0 5px 12px rgba(0,0,0,.25);transition:left 1.15s cubic-bezier(.2,.8,.2,1);display:grid;place-items:center;font-weight:1000;color:#08314c;font-size:.75rem}
  .checkpoint-actions{display:flex;justify-content:center;margin-top:22px}.checkpoint-continue{border:0;border-radius:16px;padding:14px 24px;background:#47b877;color:#fff;font-weight:1000;font-size:1.05rem;cursor:pointer;box-shadow:0 8px 18px rgba(71,184,119,.25)}
  @media(max-width:760px){.checkpoint-card{padding:18px}.checkpoint-board{grid-template-columns:repeat(7,minmax(54px,1fr));overflow:auto;padding-left:12px;padding-right:12px}.checkpoint-stage{width:86px;height:88px}.checkpoint-head h2{font-size:1.45rem}}
  `;
  document.head.appendChild(style);

  const overlay=document.createElement('div');
  overlay.id='checkpointOverlay';
  overlay.className='checkpoint-overlay';
  overlay.innerHTML=`
    <div class="checkpoint-card">
      <div class="checkpoint-head">
        <div class="checkpoint-kicker">SOC MISSION BOARD</div>
        <h2 id="checkpointTitle">ROUND COMPLETE</h2>
        <p id="checkpointText">Pion bergerak menuju checkpoint berikutnya.</p>
      </div>
      <div class="checkpoint-board">
        <div class="checkpoint-stage" data-pos="0"><span>🚩</span><b>START</b></div><i class="checkpoint-line"></i>
        <div class="checkpoint-stage" data-pos="1"><span>◆</span><b>CHECKPOINT 1</b></div><i class="checkpoint-line"></i>
        <div class="checkpoint-stage" data-pos="2"><span>◆</span><b>CHECKPOINT 2</b></div><i class="checkpoint-line"></i>
        <div class="checkpoint-stage" data-pos="3"><span>🏆</span><b>FINISH</b></div>
        <div id="checkpointPawns" class="checkpoint-pawns"></div>
      </div>
      <div class="checkpoint-actions"><button id="checkpointContinueBtn" class="checkpoint-continue">LANJUT ROUND 2 →</button></div>
    </div>`;
  document.body.appendChild(overlay);
  document.getElementById('checkpointContinueBtn').onclick=continueAfterCheckpoint;
}

function currentCode(){
  const c=(document.getElementById('gameCode')?.textContent||'').replace(/\D/g,'');
  return c.length===6?c:'';
}

function stopWatch(){
  try{unsubMeta?.();}catch{};try{unsubTeams?.();}catch{};
  unsubMeta=null;unsubTeams=null;
}

function attach(code){
  if(!code||code===activeCode)return;
  stopWatch();activeCode=code;
  unsubMeta=onValue(sessionRef(code,'meta'),s=>{meta=s.val()||{};renderCheckpoint();});
  unsubTeams=onValue(sessionRef(code,'teams'),s=>{teams=s.val()||{};renderCheckpoint();});
}

function renderCheckpoint(){
  injectUI();
  const overlay=document.getElementById('checkpointOverlay');
  if(!meta||meta.questionState!=='CHECKPOINT'){overlay.classList.remove('show');return;}
  const r=Number(meta.currentRound||0);
  const target=Math.min(3,r+1);
  document.getElementById('checkpointTitle').textContent=r<2?`ROUND ${r+1} COMPLETE — CHECKPOINT ${target}`:'ROUND 3 COMPLETE — FINISH!';
  document.getElementById('checkpointText').textContent=r<2?'Pion bergerak ke checkpoint. Setelah animasi selesai, lanjutkan ke round berikutnya.':'Pion bergerak ke FINISH sebelum Final Mission.';
  document.getElementById('checkpointContinueBtn').textContent=r<2?`LANJUT ROUND ${r+2} →`:'LANJUT FINAL MISSION →';
  document.querySelectorAll('.checkpoint-stage').forEach(x=>x.classList.toggle('active',Number(x.dataset.pos)===target));
  overlay.classList.add('show');

  const key=`${activeCode}-${r}-${target}`;
  const pos=[5,35,66,94];
  const holder=document.getElementById('checkpointPawns');
  if(lastCheckpointKey!==key){
    lastCheckpointKey=key;
    holder.innerHTML=Object.keys(teams).sort().map((id,i)=>{
      const finalPos=Math.max(0,Math.min(3,Number(teams[id]?.position||target)));
      const startPos=Math.max(0,finalPos-1);
      const top=(i%3)*3+(i>=3?17:0);
      return `<span class="checkpoint-pawn" data-target="${finalPos}" style="left:${pos[startPos]}%;top:${top}px;background:${TEAM_COLORS[i]||'#4aa3ff'}">${i+1}</span>`;
    }).join('');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      holder.querySelectorAll('.checkpoint-pawn').forEach(p=>{p.style.left=`${pos[Number(p.dataset.target)]}%`;});
      playMoveSound();
    }));
  }
}

function playMoveSound(){
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const ctx=new C();const now=ctx.currentTime;
    [0,0.12,0.24].forEach((d,i)=>{const o=ctx.createOscillator();const g=ctx.createGain();o.frequency.value=[520,660,820][i];g.gain.setValueAtTime(.0001,now+d);g.gain.exponentialRampToValueAtTime(.09,now+d+.02);g.gain.exponentialRampToValueAtTime(.0001,now+d+.11);o.connect(g);g.connect(ctx.destination);o.start(now+d);o.stop(now+d+.13);});
  }catch{}
}

async function continueAfterCheckpoint(){
  const code=currentCode()||activeCode;if(!code)return;
  const snap=await get(sessionRef(code,'meta'));const m=snap.val()||{};
  if(m.questionState!=='CHECKPOINT')return;
  const r=Number(m.currentRound||0);
  if(r<2){
    await update(sessionRef(code,'meta'),{currentRound:r+1,currentQuestion:0,questionState:'WAITING'});
  }else{
    await update(sessionRef(code,'meta'),{status:'FINAL_MISSION',questionState:'COMPLETED'});
  }
}

async function checkpointAwareNext(){
  const code=currentCode();if(!code)return;
  const snap=await get(sessionRef(code,'meta'));const m=snap.val()||{};
  if(m.questionState!=='REVEALED')return;
  const r=Number(m.currentRound||0),q=Number(m.currentQuestion||0);
  if(q<2){
    await update(sessionRef(code,'meta'),{currentQuestion:q+1,questionState:'WAITING'});
    return;
  }
  const updates={'meta/questionState':'CHECKPOINT'};
  for(let i=1;i<=6;i++){
    updates[`teams/team${i}/position`]=r+1;
    updates[`teams/team${i}/round${r+1}`]=true;
  }
  await update(sessionRef(code),updates);
}

function hookNextButton(){
  const btn=document.getElementById('nextBtn');
  if(!btn||btn.dataset.checkpointHook==='1')return;
  btn.dataset.checkpointHook='1';
  btn.onclick=()=>checkpointAwareNext().catch(err=>console.error('Checkpoint flow:',err));
}

injectUI();
setInterval(()=>{hookNextButton();const c=currentCode();if(c)attach(c);},500);
