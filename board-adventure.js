/* Seminar Mission Board visual override. Keeps all existing game logic and Team Progress unchanged. */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    #page-board .board{position:relative;min-height:860px;border-radius:28px;overflow:hidden;background:#fffdf8;border:1px solid rgba(26,91,132,.18);box-shadow:0 16px 42px rgba(17,58,85,.13)}
    #page-board .seminar-board{position:absolute;inset:0;padding:14px;background:
      radial-gradient(circle at 0% 4%,rgba(245,207,106,.55) 0 9%,transparent 9.5%),
      radial-gradient(circle at 100% 0%,rgba(136,207,238,.5) 0 9%,transparent 9.5%),
      radial-gradient(circle at 4% 100%,rgba(87,168,92,.25) 0 8%,transparent 8.5%),#fffdf7;color:#1d557f}
    #page-board .sm-head{text-align:center;margin:6px auto 14px;position:relative;max-width:700px}
    #page-board .sm-crown{font-size:2.15rem;line-height:1;margin-bottom:-4px}
    #page-board .sm-title{display:inline-block;padding:13px 38px 11px;border:3px solid #d1a05f;border-radius:44px;background:#fff8ed;color:#1d557f;font-size:clamp(2rem,4.3vw,4.1rem);line-height:1;font-weight:1000;letter-spacing:.035em;box-shadow:0 5px 0 rgba(190,137,61,.12)}
    #page-board .sm-ribbon{width:max-content;max-width:92%;margin:-7px auto 0;padding:9px 30px;border-radius:999px;background:#1989c8;color:#fff;font-size:clamp(1rem,2vw,1.9rem);font-weight:1000;letter-spacing:.04em;box-shadow:0 5px 14px rgba(25,137,200,.18)}
    #page-board .sm-content{display:grid;grid-template-columns:minmax(0,1fr) 245px;gap:16px;align-items:start}
    #page-board .sm-main{position:relative;min-height:650px;padding-bottom:78px}
    #page-board .sm-round{position:relative;height:185px;border-radius:34px;border:2px solid currentColor;overflow:visible}
    #page-board .sm-round+.sm-round{margin-top:18px}
    #page-board .sm-r1{color:#178fcf;background:linear-gradient(180deg,#def4ff,#eefbff)}
    #page-board .sm-r2{color:#e9a71a;background:linear-gradient(180deg,#fff1c2,#fff9e2)}
    #page-board .sm-r3{color:#eb5d72;background:linear-gradient(180deg,#ffe0e7,#fff1f4)}
    #page-board .sm-round.active{box-shadow:0 0 0 4px rgba(255,255,255,.92),0 0 0 8px currentColor,0 12px 24px rgba(16,77,112,.12)}
    #page-board .sm-round-tag{position:absolute;left:35px;top:-15px;padding:7px 23px;border-radius:999px;background:currentColor;color:#fff;font-weight:1000;font-size:1.02rem;letter-spacing:.03em;z-index:8}
    #page-board .sm-lane{position:absolute;left:88px;right:12px;top:58px;height:48px;border-radius:999px;background:currentColor;box-shadow:inset 0 -4px 0 rgba(255,255,255,.2)}
    #page-board .sm-arrow{position:absolute;top:67px;color:#fff;font-size:1.7rem;font-weight:1000;letter-spacing:.04em;z-index:4;text-shadow:0 2px 4px rgba(0,0,0,.12)}
    #page-board .sm-a1{left:173px}.sm-a2{left:467px}.sm-a3{right:24px}
    #page-board .sm-start,#page-board .sm-finish{position:absolute;width:100px;height:100px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:#175a86;color:#fff;border:5px solid #fff;box-shadow:0 0 0 4px #175a86,0 10px 18px rgba(16,77,112,.18);font-weight:1000;z-index:9}
    #page-board .sm-start{left:16px;top:43px}.sm-finish{right:14px;top:45px}
    #page-board .sm-start .ico,#page-board .sm-finish .ico{font-size:1.55rem;line-height:1}.sm-start b,.sm-finish b{font-size:1.15rem;margin-top:5px}
    #page-board .sm-cp{position:absolute;top:28px;width:248px;height:126px;border-radius:32px;border:3px solid currentColor;background:rgba(255,255,255,.82);box-shadow:0 6px 14px rgba(16,77,112,.07);z-index:5}
    #page-board .sm-cp1{left:225px}.sm-cp2{left:510px}
    #page-board .sm-cp-title{display:flex;align-items:center;justify-content:center;gap:9px;padding-top:14px;color:#22597f;font-size:1.05rem;font-weight:1000}
    #page-board .sm-slots{position:absolute;left:15px;right:15px;bottom:14px;display:grid;grid-template-columns:repeat(6,1fr);gap:7px}
    #page-board .sm-slot{display:block;aspect-ratio:1;border-radius:50%;border:2px solid currentColor;background:rgba(255,255,255,.7)}
    #page-board .sm-team-strip{position:absolute;left:10px;right:10px;bottom:2px;min-height:62px;border:2px solid #76c8e3;border-radius:22px;background:rgba(255,255,255,.91);display:grid;grid-template-columns:repeat(6,1fr);gap:7px;align-items:center;padding:8px 10px}
    #page-board .sm-team{height:43px;border-radius:17px;display:flex;align-items:center;justify-content:center;gap:9px;background:linear-gradient(180deg,#fff,#f6fbfe);color:#245b82;font-weight:1000}
    #page-board .sm-team-dot{width:24px;height:24px;border-radius:50%;border:3px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,.15)}
    #page-board .sm-side{display:flex;flex-direction:column;gap:12px}
    #page-board .sm-card{border:2px solid #75c6e3;border-radius:21px;background:rgba(255,255,255,.94);padding:10px 12px;color:#245b82;box-shadow:0 6px 14px rgba(16,77,112,.07)}
    #page-board .sm-card-head{margin:-1px -1px 10px;padding:8px 12px;border-radius:14px;background:#155f8f;color:#fff;text-align:center;font-weight:1000;letter-spacing:.04em}
    #page-board .sm-token-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:11px 12px}
    #page-board .sm-token{display:flex;flex-direction:column;align-items:center;text-align:center;gap:5px;font-size:.77rem;font-weight:800}
    #page-board .sm-token .coin{display:grid;place-items:center;width:55px;height:55px;border-radius:50%;color:#fff;font-size:1.42rem;font-weight:1000;box-shadow:inset 0 4px 10px rgba(255,255,255,.24),0 4px 9px rgba(0,0,0,.12)}
    #page-board .coin.blue{background:#2e9de5}.coin.yellow{background:#efb62e}.coin.red{background:#ed5659}.coin.green{background:#54b766}
    #page-board .sm-card ol{margin:0;padding-left:20px;font-size:.84rem;line-height:1.42}
    #page-board .sm-note{text-align:center;font-weight:900;margin-top:8px}.sm-card p{font-size:.84rem;line-height:1.4;margin:0}
    #page-board .sm-pawn{position:absolute;width:34px;height:34px;border-radius:50%;transform:translate(-50%,-50%);display:grid;place-items:center;border:3px solid #fff;z-index:25;box-shadow:0 6px 12px rgba(0,0,0,.24),inset 0 3px 7px rgba(255,255,255,.35);transition:left 1.25s cubic-bezier(.2,.85,.25,1),top 1.25s cubic-bezier(.2,.85,.25,1);animation:smIdle 1.7s ease-in-out infinite alternate}
    #page-board .sm-pawn:after{content:"";position:absolute;left:19%;right:19%;bottom:-8px;height:9px;border-radius:50%;background:inherit;border:2px solid rgba(255,255,255,.92);z-index:-1}
    #page-board .sm-pawn span{font-size:.72rem;font-weight:1000;color:#08314c}.sm-pawn.moving{animation:smMove .3s ease-in-out infinite alternate}
    @keyframes smIdle{from{margin-top:0}to{margin-top:-2px}}@keyframes smMove{from{margin-top:-3px;transform:translate(-50%,-50%) scale(1)}to{margin-top:2px;transform:translate(-50%,-50%) scale(1.08)}}
    @media(max-width:1210px){#page-board .sm-content{grid-template-columns:1fr}#page-board .sm-side{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}#page-board .sm-main{min-height:690px}}
    @media(max-width:900px){#page-board .board{min-height:1030px}#page-board .sm-side{grid-template-columns:1fr}#page-board .sm-cp{width:205px}.sm-cp1{left:160px!important}.sm-cp2{left:390px!important}.sm-a1{left:125px!important}.sm-a2{left:350px!important}.sm-main{min-height:710px}}
    @media(max-width:650px){#page-board .board{min-height:1120px}#page-board .sm-title{font-size:2rem;padding:12px 24px}.sm-ribbon{font-size:1rem!important;padding:8px 18px!important}#page-board .sm-round{height:220px}#page-board .sm-lane{left:14px;right:14px;top:68px;height:36px}#page-board .sm-start{width:76px;height:76px;left:14px;top:22px}#page-board .sm-cp{position:static;width:auto;height:96px;margin:17px 12px 0 97px}#page-board .sm-finish{width:78px;height:78px;right:14px;top:128px}#page-board .sm-arrow{display:none}#page-board .sm-team-strip{grid-template-columns:repeat(3,1fr);bottom:4px}}
  `;
  document.head.appendChild(style);

  function moveSound(){
    try{
      const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
      if(!window.__socBoardAudio)window.__socBoardAudio=new AC();const ctx=window.__socBoardAudio;if(ctx.state==='suspended')ctx.resume();
      const now=ctx.currentTime;[523.25,659.25,783.99].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.0001,now+i*.1);g.gain.exponentialRampToValueAtTime(.11,now+i*.1+.015);g.gain.exponentialRampToValueAtTime(.0001,now+i*.1+.2);o.connect(g).connect(ctx.destination);o.start(now+i*.1);o.stop(now+i*.1+.21);});
    }catch(e){}
  }

  function slots(){return '<div class="sm-slots">'+Array.from({length:6},()=>'<span class="sm-slot"></span>').join('')+'</div>';}
  function pawnPos(progress,i){
    const p={
      0:[[8,34],[11,34],[14,34],[8,40],[11,40],[14,40]],
      1:[[68,33],[71,33],[74,33],[68,39],[71,39],[74,39]],
      2:[[68,56],[71,56],[74,56],[68,62],[71,62],[74,62]],
      3:[[84,79],[87,79],[90,79],[84,85],[87,85],[90,85]]
    };return {x:p[progress][i][0],y:p[progress][i][1]};
  }

  renderBoard=function(){
    $('#boardGameTitle').textContent=config.gameName;
    const board=$('#board');const active=run.gameComplete?3:Math.min(run.roundIndex+1,3);
    const from=moveAnimation?moveAnimation.from:run.teams.map(t=>t.progress);const to=moveAnimation?moveAnimation.to:run.teams.map(t=>t.progress);
    const legend=run.teams.map((t,i)=>`<div class="sm-team"><span class="sm-team-dot" style="background:${config.teamColors[i]}"></span><span>K${i+1}</span></div>`).join('');
    board.innerHTML=`<div class="seminar-board">
      <div class="sm-head"><div class="sm-crown">👑</div><div class="sm-title">TODAY MISSION</div><div class="sm-ribbon">SOC MISSION BOARD</div></div>
      <div class="sm-content"><div class="sm-main">
        <section class="sm-round sm-r1 ${active===1?'active':''}"><div class="sm-round-tag">ROUND 1</div><div class="sm-start"><span class="ico">⚑</span><b>START</b></div><div class="sm-lane"></div><span class="sm-arrow sm-a1">›››</span><span class="sm-arrow sm-a2">›››</span><span class="sm-arrow sm-a3">›››</span><div class="sm-cp sm-cp1"><div class="sm-cp-title">⚑ <b>CP 1</b></div>${slots()}</div><div class="sm-cp sm-cp2"><div class="sm-cp-title">⚑ <b>CP 2</b></div>${slots()}</div></section>
        <section class="sm-round sm-r2 ${active===2?'active':''}"><div class="sm-round-tag">ROUND 2</div><div class="sm-lane"></div><span class="sm-arrow sm-a1">›››</span><span class="sm-arrow sm-a2">›››</span><span class="sm-arrow sm-a3">›››</span><div class="sm-cp sm-cp1"><div class="sm-cp-title">⚑ <b>CP 1</b></div>${slots()}</div><div class="sm-cp sm-cp2"><div class="sm-cp-title">⚑ <b>CP 2</b></div>${slots()}</div></section>
        <section class="sm-round sm-r3 ${active===3?'active':''}"><div class="sm-round-tag">ROUND 3</div><div class="sm-lane"></div><span class="sm-arrow sm-a1">›››</span><span class="sm-arrow sm-a2">›››</span><span class="sm-arrow sm-a3">›››</span><div class="sm-cp sm-cp1"><div class="sm-cp-title">⚑ <b>CP 1</b></div>${slots()}</div><div class="sm-cp sm-cp2"><div class="sm-cp-title">⚑ <b>CP 2</b></div>${slots()}</div><div class="sm-finish"><span class="ico">🏆</span><b>FINISH</b></div></section>
        <div class="sm-team-strip">${legend}</div>
      </div><aside class="sm-side">
        <div class="sm-card"><div class="sm-card-head">TOKEN</div><div class="sm-token-grid"><div class="sm-token"><span class="coin blue">★</span><span>Heritage Token</span></div><div class="sm-token"><span class="coin yellow">⚙</span><span>Change Token</span></div><div class="sm-token"><span class="coin red">◎</span><span>Mission Token</span></div><div class="sm-token"><span class="coin green">❋</span><span>Hint Token</span></div></div></div>
        <div class="sm-card"><div class="sm-card-head">RULE BOOK</div><ol><li>Kerjakan tugas sesuai tahapnya.</li><li>Setelah selesai, bawa hasil untuk validasi.</li><li>Jika benar, pion maju ke checkpoint berikutnya.</li><li>Setelah CP2, lanjut ke ronde berikutnya.</li><li>Pemenang ditentukan dari progres dan kualitas hasil.</li></ol><div class="sm-note">Jadi bagian dari perubahan!</div></div>
        <div class="sm-card"><div class="sm-card-head">MISSION SHEET</div><p>Setiap kelompok memiliki 1 lembar kerja untuk mencatat hasil diskusi dan jawaban.</p></div>
        <div class="sm-card"><div class="sm-card-head">RULE BOOK</div><p>Berisi aturan permainan, alur setiap ronde, dan cara mendapatkan token.</p></div>
      </aside></div></div>`;

    run.teams.forEach((t,i)=>{const p=pawnPos(from[i],i),d=document.createElement('div');d.className='sm-pawn';d.id='smPawn'+i;d.style.left=p.x+'%';d.style.top=p.y+'%';d.style.background=config.teamColors[i];d.title=t.name;d.innerHTML=`<span>${i+1}</span>`;board.querySelector('.sm-main').appendChild(d);});

    $('#progressPanel').innerHTML=run.teams.map((t,i)=>`<div class="team-progress"><div class="dot" style="background:${config.teamColors[i]}">${i+1}</div><div><b>${esc(t.name)}</b><small>${t.progress===0?'START':t.progress===1?'Checkpoint 1':t.progress===2?'Checkpoint 2':'FINISH'}</small></div><div class="score-pill">${t.score}</div></div>`).join('');

    const next=$('#boardNextBtn');if(run.gameComplete){next.textContent='🎤 Final Mission →';next.onclick=()=>go('final');}else if(!run.started){next.textContent='Mulai Round 1 →';next.onclick=()=>beginQuestion();}else{next.textContent=`Lanjut Round ${run.roundIndex+1} • Question ${run.questionIndex+1} →`;next.onclick=()=>beginQuestion();}

    if(moveAnimation){requestAnimationFrame(()=>setTimeout(()=>{moveSound();to.forEach((pr,i)=>{const d=$('#smPawn'+i);if(!d)return;d.classList.add('moving');const p=pawnPos(pr,i);d.style.left=p.x+'%';d.style.top=p.y+'%';});setTimeout(()=>{run.teams.forEach((_,i)=>$('#smPawn'+i)?.classList.remove('moving'));moveAnimation=null;},1400);},120));}
  };

  if(document.querySelector('#page-board.active'))renderBoard();
})();
