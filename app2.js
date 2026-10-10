function manualRoundCorrectCount(t,r){
  const qs=new Set();
  (t.answers||[]).forEach(a=>{if(Number(a.round)===r&&a.correct===true)qs.add(Number(a.question));});
  return qs.size;
}
function repairManualProgress(){
  let changed=false;
  run.teams.forEach(t=>{
    let exact=0;
    for(let rr=0;rr<3;rr++){
      if(t.roundCompleted?.[rr]&&manualRoundCorrectCount(t,rr)>=2)exact++;
    }
    if(Number(t.progress||0)!==exact){t.progress=exact;changed=true;}
  });
  if(changed)saveRun();
}

function renderBoard(){
  repairManualProgress();
  $('#boardGameTitle').textContent=config.gameName;
  const maxProgress=Math.max(...run.teams.map(t=>t.progress));
  const stageStatus=n=>maxProgress>=n?'done':(run.roundIndex===n&&!run.gameComplete?'active':'');
  const stageLabel=['START','CHECKPOINT 1','CHECKPOINT 2','FINISH'];
  const stages=stageLabel.map((label,i)=>`<div class="soc-stage ${i===0?'start-stage':''} ${i===3?'finish-stage':''} ${stageStatus(i)}"><div class="stage-icon">${i===0?'🚩':i===3?'🏆':'◆'}</div><b>${label}</b><small>${i===0?'Begin':i===1?'Round 1 complete':i===2?'Round 2 complete':'Round 3 complete'}</small></div>`).join('<div class="stage-line"></div>');
  const pawns=run.teams.map((t,i)=>`<div class="team-board-row"><div class="team-ident"><span class="team-dot" style="background:${config.teamColors[i]}">${i+1}</span><b>${esc(t.name)}</b></div><div class="mini-track">${[0,1,2,3].map(p=>`<span class="mini-node ${t.progress>=p?'reached':''}" style="--team:${config.teamColors[i]}">${t.progress===p?'●':''}</span>`).join('<i></i>')}</div><span class="status-chip">${teamStatus(t)}</span></div>`).join('');
  $('#board').innerHTML=`<div class="board-title-block"><div class="eyebrow">DIGITAL SOCIETY MISSION</div><h3>Think. Connect. Respect.</h3><p>3 Rounds • 3 Questions per Round • 9 Mission Questions • 2 Checkpoints + Finish</p></div><div class="soc-stage-track">${stages}</div><div class="team-board-list">${pawns}</div>`;
  $('#progressPanel').innerHTML=run.teams.map((t,i)=>`<div class="team-progress"><div class="dot" style="background:${config.teamColors[i]}">${i+1}</div><div><b>${esc(t.name)}</b><small>${t.progress===0?'START':t.progress===1?'Checkpoint 1':t.progress===2?'Checkpoint 2':'FINISH'}</small></div><div class="score-pill">${t.score}</div></div>`).join('');
  const next=$('#boardNextBtn');
  if(run.gameComplete){next.textContent='🎤 Final Mission →';next.onclick=()=>go('final');}
  else if(!run.started){next.textContent='Mulai Round 1 →';next.onclick=()=>beginQuestion();}
  else {next.textContent=`Lanjut Round ${run.roundIndex+1} • Question ${run.questionIndex+1} →`;next.onclick=()=>beginQuestion();}
}

function resetQuestionState(){run.drafts=Array(6).fill(null);run.locked=Array(6).fill(false);run.revealed=false;run.lastResults=Array(6).fill(null);}
function beginQuestion(){if(run.gameComplete)return go('final');run.started=true;resetQuestionState();saveRun();renderMission();go('mission');}
$('#startGameBtn').onclick=()=>go('board');
$('#resetRunBtn').onclick=()=>{run=newRun();saveRun();renderBoard();toast('Run permainan direset. Data Teacher Setup dan tes tetap aman.');};

function renderVideoCase(round,q){
  const wrap=$('#videoCaseWrap'); if(!wrap)return;
  if(!round.videoCase){wrap.innerHTML='';wrap.style.display='none';return;}
  wrap.style.display='block';
  const src=config.videoSrc||'assets/video/digital-case.mp4';
  const driveMatch=String(src).match(/drive\.google\.com\/file\/d\/([^/]+)/);
  const media=driveMatch
    ? `<div class="video-shell"><iframe title="Video kasus Berita Nyata" src="https://drive.google.com/file/d/${driveMatch[1]}/preview" allow="autoplay; fullscreen" allowfullscreen style="width:100%;aspect-ratio:16/9;border:0;border-radius:18px;background:#111"></iframe></div>`
    : `<div class="video-shell"><video id="caseVideo" controls preload="metadata" poster="${esc(config.videoPoster||'assets/video/digital-case-poster.svg')}"><source src="${esc(src)}" type="video/mp4">Browser ini belum dapat memutar video.</video><div class="video-fallback" id="videoFallback">Jika video belum tersedia, gunakan ringkasan kasus di bawah.</div></div>`;
  if(q===0){
    wrap.innerHTML=`<div class="video-case card"><div class="eyebrow">WATCH THE CASE</div><h3>“Berita Nyata” — Verifikasi Informasi Digital</h3><p class="muted">Tonton sampai selesai. Perhatikan bagaimana sebuah cuplikan diberi klaim, disebarkan, lalu diperiksa kembali kebenaran dan konteksnya. Catat bukti penting pada LKPD.</p>${media}<details class="case-transcript"><summary>Ringkasan kasus cadangan</summary><p>Sebuah cuplikan viral beredar bersama klaim tertentu. Pengguna yang menerima konten tersebut terburu-buru mempercayai dan menyebarkannya. Setelah diperiksa, klaim yang beredar tidak sesuai dengan konteks sebenarnya. Pelajaran utama: periksa sumber, konteks, dan kebenaran informasi sebelum membagikannya.</p></details></div>`;
    const v=$('#caseVideo'); if(v)v.addEventListener('error',()=>$('#videoFallback')?.classList.add('show'));
  } else {
    wrap.innerHTML=`<div class="notice">🎬 <b>Gunakan kembali video “Berita Nyata”.</b> Hubungkan jawaban dengan verifikasi sumber, konteks informasi, dampak penyebaran, serta prinsip Respect–Educate–Protect.</div>`;
  }
}

function questionProgressHTML(q,revealed=false){return `<div class="question-progress"><b>Question ${q+1} of 3</b><div class="progress-dots">${[0,1,2].map(i=>`<span class="${i<q||revealed&&i===q?'complete':i===q?'current':''}">${i<q||revealed&&i===q?'✓':i===q?'●':'○'}</span>`).join('')}</div></div>`;}

function renderMission(){
  const {round,question,r,q}=questionAt();
  const banner=document.querySelector('.round-banner'); if(banner)banner.dataset.round=String(r+1);
  $('#missionRoundTag').textContent=`ROUND ${r+1}`; $('#missionRoundName').textContent=round.name; $('#missionName').textContent=question.name; $('#difficultyBadge').textContent=round.difficulty;
  $('#questionProgress').innerHTML=questionProgressHTML(q,false);
  $('#questionText').textContent=question.question;
  const instr=$('#questionInstruction'); if(instr)instr.textContent=question.instruction||'Diskusikan alasan jawaban kalian dan catat hasil analisis pada LKPD sebelum mengunci jawaban.';
  renderVideoCase(round,q);
  const opts=$('#questionOptions');
  if(question.type==='matching'){
    opts.innerHTML=`<div class="matching-preview">${question.options.map((x,i)=>`<div><b>${esc(x)}</b><span>→ pilih pasangan ${i+1}</span></div>`).join('')}</div><div class="match-bank">${(question.matchOptions||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div>`;
  } else if(question.type==='true-false'){
    opts.innerHTML='<div class="option-preview"><b>BENAR</b></div><div class="option-preview"><b>SALAH</b></div>';
  } else {
    opts.innerHTML=question.options.map(x=>`<div class="option-preview">${esc(x)}</div>`).join('');
  }
  $('#teamAnswers').innerHTML=run.teams.map((t,i)=>answerCard(i,question)).join(''); bindAnswerEvents(question); updateLockCounter();
}

function answerCard(i,q){
  let control=''; const hidden=run.locked[i]?'style="display:none"':'';
  if(q.type==='matching'){
    control=`<div class="structured" ${hidden}>${q.options.map((label,j)=>`<div class="structured-row"><span class="mini muted">${esc(label)}</span><select class="match-select" data-team="${i}" data-part="${j}"><option value="">— Pilih pasangan —</option>${q.matchOptions.map((v,k)=>`<option value="${String.fromCharCode(65+k)}">${esc(v)}</option>`).join('')}</select></div>`).join('')}</div>`;
  } else {
    const vals=q.type==='true-false'?['BENAR','SALAH']:q.options.map((_,idx)=>String.fromCharCode(65+idx));
    const multi=q.type==='multiple-response';
    control=`<div class="answer-select ${multi?'multi-select':''}" ${hidden}>${vals.map(v=>`<button type="button" data-team="${i}" data-val="${v}">${v}</button>`).join('')}</div>${multi?'<div class="mini muted">Boleh memilih lebih dari satu.</div>':''}`;
  }
  return `<div class="team-answer ${run.locked[i]?'locked':''}" id="teamAnswer${i}"><div class="team-answer-head"><b>${esc(run.teams[i].name)}</b><span class="status-badge">${run.locked[i]?'🔒 ANSWER LOCKED':'READY'}</span></div>${control}<button class="btn secondary lock-btn" data-team="${i}" ${run.locked[i]?'style="display:none"':''}>🔒 LOCK ANSWER</button></div>`;
}

function bindAnswerEvents(q){
  $$('.answer-select button').forEach(b=>b.onclick=()=>{
    const i=+b.dataset.team;if(run.locked[i])return;
    if(q.type==='multiple-response'){
      const arr=Array.isArray(run.drafts[i])?[...run.drafts[i]]:[]; const v=b.dataset.val; const p=arr.indexOf(v); if(p>=0)arr.splice(p,1);else arr.push(v); run.drafts[i]=arr.sort(); b.classList.toggle('selected');
    } else {
      run.drafts[i]=b.dataset.val; $$(`.answer-select button[data-team="${i}"]`).forEach(x=>x.classList.toggle('selected',x===b));
    }
  });
  $$('.lock-btn').forEach(b=>b.onclick=()=>lockAnswer(+b.dataset.team,q));
}
function lockAnswer(i,q){
  if(run.locked[i])return; let val=run.drafts[i];
  if(q.type==='matching'){
    const sels=$$(`.match-select[data-team="${i}"]`); const arr=sels.map(s=>s.value); if(arr.some(v=>!v))return toast('Lengkapi semua pasangan untuk kelompok ini.'); val=arr; run.drafts[i]=arr;
  } else if(q.type==='multiple-response'){
    if(!Array.isArray(val)||!val.length)return toast('Pilih minimal satu jawaban terlebih dahulu.');
  } else if(!val) return toast('Pilih jawaban terlebih dahulu.');
  run.locked[i]=true; saveRun(); const card=$(`#teamAnswer${i}`); card.classList.add('locked'); card.querySelector('.status-badge').textContent='🔒 ANSWER LOCKED'; card.querySelectorAll('.answer-select,.structured,.mini.muted').forEach(x=>x.style.display='none'); card.querySelector('.lock-btn').style.display='none'; updateLockCounter();
}
function updateLockCounter(){const n=run.locked.filter(Boolean).length;$('#lockCounter').textContent=`${n} / 6 ANSWER LOCKED`;$('#revealBtn').disabled=n<6||run.revealed;}
$('#revealBtn').onclick=()=>revealAnswers();

function validateAnswer(given,question){
  if(question.type==='multiple-response'){
    const a=(Array.isArray(given)?given:[]).map(norm).sort(); const b=(Array.isArray(question.answer)?question.answer:[]).map(norm).sort(); return a.length===b.length&&a.every((x,i)=>x===b[i]);
  }
  if(question.type==='matching'){
    const a=Array.isArray(given)?given.map(norm):[]; const b=Array.isArray(question.answer)?question.answer.map(norm):[]; return a.length===b.length&&a.every((x,i)=>x===b[i]);
  }
  return norm(given)===norm(question.answer);
}
function answerLabel(ans){return Array.isArray(ans)?ans.join(' • '):String(ans||'');}
function revealAnswers(){
  const {question,r,q}=questionAt(); if(run.locked.some(x=>!x))return; run.revealed=true;
  run.teams.forEach((t,i)=>{
    const ok=validateAnswer(run.drafts[i],question); run.lastResults[i]=ok; t.lastCorrect=ok;
    const alreadyCorrect=t.answers.some(a=>a.round===r&&a.question===q&&a.correct);
    t.answers.push({round:r,question:q,answer:deepClone(run.drafts[i]),correct:ok,attempt:1+t.answers.filter(a=>a.round===r&&a.question===q).length});
    if(ok&&!alreadyCorrect){t.score+=question.score;t.roundScores[r]+=question.score;}
  });
  saveRun(); renderResult(); go('result');
}
function renderResult(){
  const {question,r,q}=questionAt();
  $('#resultProgress').innerHTML=questionProgressHTML(q,true);
  $('#correctAnswerDisplay').textContent=answerLabel(question.answer);
  $('#answerExplanation').textContent=question.explanation||'';
  const wrong=run.lastResults.filter(x=>x===false).length;
  $('#resultGrid').innerHTML=run.teams.map((t,i)=>`<div class="result-card ${run.lastResults[i]?'ok':'no'}"><div class="team-answer-head"><b>${esc(t.name)}</b><span style="font-size:1.4rem">${run.lastResults[i]?'✓ Correct':'✕ Incorrect'}</span></div><h3>${run.lastResults[i]?'MISSION PASSED! 🎉':'NOT YET!'}</h3><p>${run.lastResults[i]?'Jawaban kelompokmu tepat. Perhatikan bagaimana konsep tersebut muncul dalam kehidupan masyarakat digital.':'Jawaban belum tepat. Periksa kembali informasi pada kasus dan diskusikan alasan kelompokmu.'}</p></div>`).join('');
  const retry=$('#retryWrongBtn'); retry.style.display=wrong?'inline-flex':'none'; retry.onclick=retryIncorrect;
  const next=$('#goBoardAfterResult');
  if(q<2){next.textContent=`Lanjut ke Question ${q+2} →`;next.onclick=()=>advanceQuestion();}
  else {next.textContent=`🎉 ROUND ${r+1} COMPLETE →`;next.onclick=()=>completeRound();}
}
function retryIncorrect(){
  run.revealed=false;
  run.teams.forEach((t,i)=>{if(run.lastResults[i]===false){run.locked[i]=false;run.drafts[i]=null;}else{run.locked[i]=true;}});
  saveRun(); renderMission(); go('mission'); toast('Jawaban yang belum tepat dibuka kembali. Kelompok lain tetap terkunci.');
}
function advanceQuestion(){run.questionIndex++;resetQuestionState();saveRun();renderMission();go('mission');}
function completeRound(){
  const r=run.roundIndex; const from=run.teams.map(t=>t.progress);
  const qualified=[]; const stayed=[];
  run.teams.forEach(t=>{
    t.roundCompleted[r]=true;
    const correct=manualRoundCorrectCount(t,r);
    if(correct>=2){
      t.progress=Math.min(3,Number(t.progress||0)+1);
      qualified.push({name:t.name,correct});
    }else{
      stayed.push({name:t.name,correct});
    }
  });
  const to=run.teams.map(t=>t.progress); moveAnimation={from,to};
  const completedRound=r+1; run.questionIndex=0; run.roundIndex++;
  if(run.roundIndex>=3){run.gameComplete=true;run.roundIndex=2;run.questionIndex=2;}
  resetQuestionState(); saveRun(); go('board');
  const passedNames=qualified.map(x=>x.name);
  const stayedNames=stayed.map(x=>x.name);
  if(passedNames.length){
    $('#celebrateTitle').textContent=`🎉 SELAMAT ${passedNames.join(', ')}!`;
    $('#celebrateText').textContent=`Pion berhasil maju 1 checkpoint karena benar minimal 2 dari 3 soal: ${qualified.map(x=>`${x.name} (${x.correct}/3)`).join(', ')}.${stayedNames.length?` Kelompok yang tetap di posisi sebelumnya: ${stayed.map(x=>`${x.name} (${x.correct}/3)`).join(', ')}.`:''}`;
  }else{
    $('#celebrateTitle').textContent=`ROUND ${completedRound} SELESAI`;
    $('#celebrateText').textContent='Belum ada kelompok yang mencapai minimal 2 dari 3 jawaban benar. Semua pion tetap di posisi sebelumnya; poin tetap tersimpan.';
  }
  setTimeout(()=>$('#celebration').classList.add('show'),350);
}
$('#closeCelebrate').onclick=()=>$('#celebration').classList.remove('show');

function roundMark(t,r){return t.roundCompleted[r]?'✓ Completed':(run.roundIndex===r&&!run.gameComplete?'● In Progress':'🔒 Not Started');}
function renderScoreboard(){
  $('#scoreBody').innerHTML=run.teams.map((t,i)=>`<tr><td><b><span class="team-inline-dot" style="background:${config.teamColors[i]}"></span>${esc(t.name)}</b></td><td>${roundMark(t,0)}</td><td>${roundMark(t,1)}</td><td>${roundMark(t,2)}</td><td><b>${t.progress>=3?'FINISH':`${t.progress}/3`}</b><br><span class="mini muted">${teamStatus(t)}</span></td><td>${t.score}</td><td>${t.flash||0}/10</td></tr>`).join('');
}

function renderFinalMission(){
  $('#finalMissionScores').innerHTML=run.teams.map((t,i)=>`<div class="field"><label class="label">${esc(t.name)} • Flash Pitch (0–10)</label><input type="number" class="final-flash-score" data-i="${i}" min="0" max="10" value="${t.flash||0}"></div>`).join('');
  const status=$('#finalMissionStatus'); if(status)status.textContent=run.finalMissionComplete?'✓ Final Mission sudah dinilai.':'Nilai Flash Pitch setelah kelompok menyampaikan analisisnya.';
}
$('#saveFinalMission').onclick=()=>{$$('.final-flash-score').forEach(x=>run.teams[+x.dataset.i].flash=Math.max(0,Math.min(10,+x.value||0)));run.finalMissionComplete=true;saveRun();renderFinalMission();toast('Nilai Final Mission / Flash Pitch tersimpan.');};
$('#goPostFromFinal').onclick=()=>go('posttest');

function renderEvaluation(){
  const valid=students.filter(s=>s.name.trim()); const vals=arr=>arr.map(x=>Number(x)).filter(Number.isFinite); const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
  const pre=vals(valid.map(s=>s.pre)), post=vals(valid.map(s=>s.post)); const ap=avg(pre),ao=avg(post),inc=ao-ap;
  $('#evalMetrics').innerHTML=`<div class="metric"><span class="label">Jumlah Siswa</span><strong>${valid.length}</strong></div><div class="metric"><span class="label">Rata-rata Pre-Test</span><strong>${ap.toFixed(1)}</strong></div><div class="metric"><span class="label">Rata-rata Post-Test</span><strong>${ao.toFixed(1)}</strong></div><div class="metric"><span class="label">Gain / Perubahan</span><strong>${inc>=0?'+':''}${inc.toFixed(1)}</strong></div>`;
  $('#learningProgressTable').innerHTML=valid.length?`<div class="table-wrap"><table><thead><tr><th>Siswa</th><th>Pre-Test</th><th>Post-Test</th><th>Gain</th><th>Kategori Akhir</th></tr></thead><tbody>${valid.map(s=>{const a=+s.pre||0,b=+s.post||0,d=b-a;return `<tr><td>${esc(s.name)}</td><td>${a}</td><td>${b}</td><td>${d>=0?'+':''}${d}</td><td>${scoreCategory(b)}</td></tr>`;}).join('')}</tbody></table></div>`:'<div class="notice">Belum ada data siswa.</div>';
  $('#missionProgressEval').innerHTML=run.teams.map((t,i)=>`<div class="mission-eval-row"><b>${esc(t.name)}</b><span>${t.roundCompleted[0]?'✓':'○'} R1</span><span>${t.roundCompleted[1]?'✓':'○'} R2</span><span>${t.roundCompleted[2]?'✓':'○'} R3</span><span>${run.finalMissionComplete?'✓':'○'} Final Mission</span></div>`).join('');
}

renderSetup();renderBoard();