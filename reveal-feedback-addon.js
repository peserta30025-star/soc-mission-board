import { get, onValue, sessionRef, currentQuestionKey } from './firebase-core.js?v=20261004-answerfix1';

const TEAM_NAMES=['Kelompok 1','Kelompok 2','Kelompok 3','Kelompok 4','Kelompok 5','Kelompok 6'];
let teacherCode='';
let teacherUnsub=null;
let teamUnsub=null;
let teacherToken='';
let teamToken='';

function safe(v=''){
  return String(v).replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
}

function injectStyle(){
  if(document.getElementById('revealFeedbackStyle'))return;
  const s=document.createElement('style');
  s.id='revealFeedbackStyle';
  s.textContent=`
    .rf-panel{margin:18px 0;padding:20px;border-radius:20px;border:2px solid #83cceb;background:linear-gradient(180deg,#f4fbff,#ffffff);box-shadow:0 10px 24px rgba(14,79,118,.08);color:#174f78}
    .rf-panel.hidden{display:none!important}.rf-title{font-weight:1000;font-size:1.2rem;margin-bottom:14px}.rf-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.rf-box{padding:14px 16px;border-radius:16px;background:#fff;border:1px solid #d6e8f1}.rf-box b{display:block;margin-bottom:7px;color:#174f78}.rf-answer{font-weight:900;line-height:1.5;color:#146a3a}.rf-explain{line-height:1.65;color:#345f79}.rf-team-summary{margin-top:14px;padding-top:14px;border-top:1px dashed #b8d8e7;display:flex;gap:10px;flex-wrap:wrap}.rf-chip{padding:7px 10px;border-radius:999px;font-weight:800;font-size:.88rem}.rf-chip.ok{background:#e7f8ee;color:#187044}.rf-chip.no{background:#fff0f0;color:#ad3e48}.rf-chip.none{background:#f1f4f6;color:#6e7f89}
    .rf-student{margin-top:16px;text-align:left}.rf-status{font-size:1.05rem;font-weight:1000;margin-bottom:12px}.rf-status.ok{color:#187044}.rf-status.no{color:#b13c47}.rf-label{font-size:.78rem;font-weight:1000;letter-spacing:.08em;color:#cf8b00;margin:12px 0 5px}.rf-your-answer{color:#315d77;font-weight:800;line-height:1.5}.rf-correct-answer{color:#187044;font-weight:1000;line-height:1.55}.rf-note{margin-top:12px;padding:12px;border-radius:14px;background:#eef8ff;color:#315d77;line-height:1.6}
    @media(max-width:720px){.rf-grid{grid-template-columns:1fr}.rf-panel{padding:16px}}
  `;
  document.head.appendChild(s);
}

function optionText(letter,q){
  const raw=String(letter??'').trim();
  if(!raw)return '—';
  if(/^[A-Z]$/i.test(raw)&&Array.isArray(q?.options)){
    const idx=raw.toUpperCase().charCodeAt(0)-65;
    if(idx>=0&&idx<q.options.length){
      const option=String(q.options[idx]??'').trim();
      if(new RegExp('^'+raw.toUpperCase()+'\\s*[.):-]\\s*','i').test(option))return option;
      return `${raw.toUpperCase()}. ${option}`;
    }
  }
  return raw;
}

function answerHtml(answer,q){
  if(answer==null||answer==='')return '—';
  if(q?.type==='matching'&&Array.isArray(answer)){
    return answer.map((a,i)=>{
      const idx=String(a||'').toUpperCase().charCodeAt(0)-65;
      const right=Array.isArray(q.matchOptions)&&idx>=0?q.matchOptions[idx]:a;
      return `<div>${safe(q.options?.[i]||`Item ${i+1}`)} → <b>${safe(right||a)}</b></div>`;
    }).join('');
  }
  if(Array.isArray(answer))return answer.map(a=>`<div>${safe(optionText(a,q))}</div>`).join('');
  return safe(optionText(answer,q));
}

function ensureTeacherPanel(){
  let p=document.getElementById('teacherRevealDiscussion');
  if(p)return p;
  const opts=document.getElementById('teacherOptions');
  if(!opts)return null;
  p=document.createElement('div');p.id='teacherRevealDiscussion';p.className='rf-panel hidden';
  opts.insertAdjacentElement('afterend',p);return p;
}

function ensureStudentPanel(){
  let p=document.getElementById('studentRevealDiscussion');
  if(p)return p;
  const status=document.getElementById('statusPanel');
  if(!status)return null;
  p=document.createElement('div');p.id='studentRevealDiscussion';p.className='rf-panel rf-student hidden';
  status.appendChild(p);return p;
}

async function renderTeacher(meta,code){
  const panel=ensureTeacherPanel();if(!panel)return;
  if(!meta||meta.questionState!=='REVEALED'){panel.classList.add('hidden');panel.innerHTML='';return;}
  const key=currentQuestionKey(meta);teacherToken=key;
  const [qSnap,rSnap,aSnap]=await Promise.all([
    get(sessionRef(code,`publicQuestions/${key}`)),
    get(sessionRef(code,`revealPublic/${key}`)),
    get(sessionRef(code,`answers/${key}`))
  ]);
  if(teacherToken!==key)return;
  const q=qSnap.val()||{};const reveal=rSnap.val()||{};const answers=aSnap.val()||{};
  const summary=TEAM_NAMES.map((name,i)=>{
    const a=answers[`team${i+1}`];
    if(!a?.locked)return `<span class="rf-chip none">${name}: belum menjawab</span>`;
    return `<span class="rf-chip ${a.correct===true?'ok':'no'}">${name}: ${a.correct===true?'✓ benar':'✕ salah'}</span>`;
  }).join('');
  panel.innerHTML=`<div class="rf-title">📘 PEMBAHASAN JAWABAN</div><div class="rf-grid"><div class="rf-box"><b>✅ Jawaban Benar</b><div class="rf-answer">${answerHtml(reveal.answer,q)}</div></div><div class="rf-box"><b>💡 Mengapa jawaban ini benar?</b><div class="rf-explain">${safe(reveal.explanation||q.explanation||'Pembahasan belum tersedia.')}</div></div></div><div class="rf-team-summary">${summary}</div>`;
  panel.classList.remove('hidden');
}

function attachTeacher(code){
  if(!code||code===teacherCode)return;
  if(teacherUnsub){try{teacherUnsub();}catch{}}
  teacherCode=code;
  teacherUnsub=onValue(sessionRef(code,'meta'),snap=>renderTeacher(snap.val()||{},code).catch(console.warn));
}

async function renderStudent(meta,code,teamId){
  const panel=ensureStudentPanel();if(!panel)return;
  if(!meta||meta.questionState!=='REVEALED'){panel.classList.add('hidden');panel.innerHTML='';return;}
  const key=currentQuestionKey(meta);teamToken=key;
  const [qSnap,rSnap,aSnap]=await Promise.all([
    get(sessionRef(code,`publicQuestions/${key}`)),
    get(sessionRef(code,`revealPublic/${key}`)),
    get(sessionRef(code,`answers/${key}/${teamId}`))
  ]);
  if(teamToken!==key)return;
  const q=qSnap.val()||{};const reveal=rSnap.val()||{};const own=aSnap.val()||{};
  const answered=own.locked===true;const ok=own.correct===true;
  const status=!answered?'Kelompok belum mengunci jawaban sebelum Reveal.':ok?'Jawaban kelompokmu BENAR.':'Jawaban kelompokmu belum tepat. Lihat jawaban benar dan pembahasannya di bawah.';
  const cls=answered&&ok?'ok':'no';
  panel.innerHTML=`<div class="rf-title">📘 PEMBAHASAN SETELAH REVEAL</div><div class="rf-status ${cls}">${answered&&ok?'✅':'✕'} ${safe(status)}</div>${answered?`<div class="rf-label">JAWABAN KELOMPOKMU</div><div class="rf-your-answer">${answerHtml(own.answer,q)}</div>`:''}<div class="rf-label">JAWABAN BENAR</div><div class="rf-correct-answer">${answerHtml(reveal.answer,q)}</div><div class="rf-label">PEMBAHASAN</div><div class="rf-note">${safe(reveal.explanation||q.explanation||'Pembahasan belum tersedia.')}</div>`;
  panel.classList.remove('hidden');
}

function attachStudent(){
  const saved=JSON.parse(localStorage.getItem('soc_team_join')||'null');
  const code=String(saved?.code||'').replace(/\D/g,'').slice(0,6);const teamId=saved?.teamId||'';
  if(code.length!==6||!teamId)return;
  const key=`${code}-${teamId}`;
  if(teamUnsub&&teamUnsub.__key===key)return;
  if(teamUnsub){try{teamUnsub();}catch{}}
  const unsub=onValue(sessionRef(code,'meta'),snap=>renderStudent(snap.val()||{},code,teamId).catch(console.warn));
  unsub.__key=key;teamUnsub=unsub;
}

injectStyle();
setInterval(()=>{
  const code=(document.getElementById('gameCode')?.textContent||'').replace(/\D/g,'').slice(0,6);
  if(document.getElementById('teacherApp')&&code.length===6)attachTeacher(code);
  if(document.getElementById('missionView'))attachStudent();
},500);
