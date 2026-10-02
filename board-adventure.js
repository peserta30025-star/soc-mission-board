/* Seminar Mission Board visual override. Only the board visual is changed; Team Progress and game logic stay intact. */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    #page-board .board{position:relative;min-height:900px;aspect-ratio:1.12/1;border-radius:28px;overflow:hidden;background:#fffdf8;border:1px solid rgba(26,91,132,.18);box-shadow:0 16px 42px rgba(17,58,85,.13)}
    #page-board .seminar-board{position:absolute;inset:0;padding:16px 18px 14px;background:
      radial-gradient(circle at 0 4%,rgba(245,207,106,.52) 0 10%,transparent 10.4%),
      radial-gradient(circle at 100% 0,rgba(136,207,238,.46) 0 10%,transparent 10.4%),
      radial-gradient(circle at 4% 100%,rgba(87,168,92,.25) 0 9%,transparent 9.4%),#fffdf7;color:#1d557f}
    #page-board .sm-head{text-align:center;margin:5px auto 20px;position:relative;max-width:760px}
    #page-board .sm-crown{font-size:2.2rem;line-height:1;margin-bottom:-3px}
    #page-board .sm-title{display:inline-block;padding:14px 42px 12px;border:3px solid #d1a05f;border-radius:44px;background:#fff8ed;color:#174e78;font-size:clamp(2.1rem,4.6vw,4.25rem);line-height:1;font-weight:1000;letter-spacing:.035em;box-shadow:0 5px 0 rgba(190,137,61,.12)}
    #page-board .sm-ribbon{width:max-content;max-width:92%;margin:-8px auto 0;padding:9px 32px;border-radius:999px;background:#1989c8;color:#fff;font-size:clamp(1rem,2vw,1.9rem);font-weight:1000;letter-spacing:.04em;box-shadow:0 5px 14px rgba(25,137,200,.18)}
    #page-board .sm-main{position:relative;min-height:690px;padding-bottom:74px}
    #page-board .sm-round{position:relative;height:190px;border-radius:34px;border:2px solid currentColor;overflow:visible}
    #page-board .sm-round+.sm-round{margin-top:22px}
    #page-board .sm-r1{color:#178fcf;background:linear-gradient(180deg,#def4ff,#eefbff)}
    #page-board .sm-r2{color:#e9a71a;background:linear-gradient(180deg,#fff1c2,#fff9e2)}
    #page-board .sm-r3{color:#eb5d72;background:linear-gradient(180deg,#ffe0e7,#fff1f4)}
    #page-board .sm-round.active{box-shadow:0 0 0 4px rgba(255,255,255,.92),0 0 0 7px currentColor,0 12px 24px rgba(16,77,112,.10)}
    #page-board .sm-round-tag{position:absolute;left:96px;top:-15px;padding:7px 24px;border-radius:999px;background:currentColor;color:#fff;font-weight:1000;font-size:1.05rem;letter-spacing:.03em;z-index:8}
    #page-board .sm-lane{position:absolute;left:62px;right:10px;top:61px;height:50px;border-radius:999px;background:currentColor;box-shadow:inset 0 -4px 0 rgba(255,255,255,.2)}
    #page-board .sm-arrow{position:absolute;top:69px;color:#fff;font-size:1.75rem;font-weight:1000;letter-spacing:.05em;z-index:4;text-shadow:0 2px 4px rgba(0,0,0,.11)}
    #page-board .sm-a1{left:165px}.sm-a2{left:50%}.sm-a3{right:18px}
    #page-board .sm-start,#page-board .sm-finish{position:absolute;width:108px;height:108px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:#175a86;color:#fff;border:5px solid #fff;box-shadow:0 0 0 4px #175a86,0 10px 18px rgba(16,77,112,.18);font-weight:1000;z-index:12}
    #page-board .sm-start{left:12px;top:42px}.sm-finish{right:-4px;top:42px}
    #page-board .sm-start .ico,#page-board .sm-finish .ico{font-size:1.55rem;line-height:1}.sm-start b,.sm-finish b{font-size:1.2rem;margin-top:5px}
    #page-board .sm-cp{position:absolute;top:28px;width:29.5%;height:128px;border-radius:32px;border:3px solid currentColor;background:rgba(255,255,255,.83);box-shadow:0 6px 14px rgba(16,77,112,.07);z-index:6}
    #page-board .sm-cp1{left:24.5%}.sm-cp2{left:61.5%}
    #page-board .sm-cp-title{display:flex;align-items:center;justify-content:center;gap:9px;padding-top:14px;color:#22597f;font-size:1.08rem;font-weight:1000}
    #page-board .sm-slots{position:absolute;left:15px;right:15px;bottom:14px;display:grid;grid-template-columns:repeat(6,1fr);gap:7px}
    #page-board .sm-slot{display:block;aspect-ratio:1;border-radius:50%;border:2px solid currentColor;background:rgba(255,255,255,.7)}
    #page-board .sm-team-strip{position:absolute;left:48px;right:48px;bottom:0;min-height:62px;border:2px solid #76c8e3;border-radius:22px;background:rgba(255,255,255,.91);display:grid;grid-template-columns:repeat(6,1fr);gap:8px;align-items:center;padding:8px 10px}
    #page-board .sm-team{height:43px;border-radius:17px;display:flex;align-items:center;justify-content:center;gap:9px;background:linear-gradient(180deg,#fff,#f6fbfe);color:#245b82;font-weight:1000}
    #page-board .sm-team-dot{width:25px;height:25px;border-radius:50%;border:3px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,.15)}
    #page-board .sm-pawn{position:absolute;width:35px;height:35px;border-radius:50%;transform:translate(-50%,-50%);display:grid;place-items:center;border:3px solid #fff;z-index:25;box-shadow:0 6px 12px rgba(0,0,0,.24),inset 0 3px 7px rgba(255,255,255,.35);transition:left 1.25s cubic-bezier(.2,.85,.25,1),top 1.25s cubic-bezier(.2,.85,.25,1);animation:smIdle 1.7s ease-in-out infinite alternate}
    #page-board .sm-pawn:after{content:"";position:absolute;left:19%;right:19%;bottom:-8px;height:9px;border-radius:50%;background:inherit;border:2px solid rgba(255,255,255,.92);z-index:-1}
    #page-board .sm-pawn span{font-size:.72rem;font-weight:1000;color:#08314c}.sm-pawn.moving{animation:smMove .3s ease-in-out infinite alternate}
    @keyframes smIdle{from{margin-top:0}to{margin-top:-2px}}@keyframes smMove{from{margin-top:-3px;transform:translate(-50%,-50%) scale(1)}to{margin-top:2px;transform:translate(-50%,-50%) scale(1.08)}}
    @media(max-width:1050px){#page-board .board{min-height:850px}.sm-cp1{left:23%!important}.sm-cp2{left:60%!important}}
    @media(max-width:760px){#page-board .board{min-height:980px;aspect-ratio:auto}#page-board .sm-title{font-size:2rem;padding:12px 24px}.sm-ribbon{font-size:1rem!important;padding:8px 18px!important}#page-board .sm-round{height:220px}#page-board .sm-lane{left:14px;right:14px;top:70px;height:36px}#page-board .sm-start{width:76px;height:76px;left:14px;top:22px}#page-board .sm-cp{position:static;width:auto;height:96px;margin:17px 12px 0 97px}#page-board .sm-finish{width:78px;height:78px;right:14px;top:128px}#page-board .sm-arrow{display:none}#page-board .sm-team-strip{grid-template-columns:repeat(3,1fr);left:12px;right:12px}}
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
      0:[[7.5,24.5],[10.3,24.5],[13.1,24.5],[7.5,29.5],[10.3,29.5],[13.1,29.5]],
      1:[[69,25.7],[72,25.7],[75,25.7],[69,30.7],[72,30.7],[75,30.7]],
      2:[[69,49.6],[72,49.6],[75,49.6],[69,54.6],[72,54.6],[75,54.6]],
      3:[[84,73.4],[87,73.4],[90,73.4],[84,78.4],[87,78.4],[90,78.4]]
    };return {x:p[progress][i][0],y:p[progress][i][1]};
  }

  renderBoard=function(){
    $('#boardGameTitle').textContent=config.gameName;
    const board=$('#board');const active=run.gameComplete?3:Math.min(run.roundIndex+1,3);
    const from=moveAnimation?moveAnimation.from:run.teams.map(t=>t.progress);const to=moveAnimation?moveAnimation.to:run.teams.map(t=>t.progress);
    const legend=run.teams.map((t,i)=>`<div class="sm-team"><span class="sm-team-dot" style="background:${config.teamColors[i]}"></span><span>K${i+1}</span></div>`).join('');
    board.innerHTML=`<div class="seminar-board">
      <div class="sm-head"><div class="sm-crown">👑</div><div class="sm-title">TODAY MISSION</div><div class="sm-ribbon">SOC MISSION BOARD</div></div>
      <div class="sm-main">
        <section class="sm-round sm-r1 ${active===1?'active':''}"><div class="sm-round-tag">ROUND 1</div><div class="sm-start"><span class="ico">⚑</span><b>START</b></div><div class="sm-lane"></div><span class="sm-arrow sm-a1">›››</span><span class="sm-arrow sm-a2">›››</span><span class="sm-arrow sm-a3">›››</span><div class="sm-cp sm-cp1"><div class="sm-cp-title">⚑ <b>CP 1</b></div>${slots()}</div><div class="sm-cp sm-cp2"><div class="sm-cp-title">⚑ <b>CP 2</b></div>${slots()}</div></section>
        <section class="sm-round sm-r2 ${active===2?'active':''}"><div class="sm-round-tag">ROUND 2</div><div class="sm-lane"></div><span class="sm-arrow sm-a1">›››</span><span class="sm-arrow sm-a2">›››</span><span class="sm-arrow sm-a3">›››</span><div class="sm-cp sm-cp1"><div class="sm-cp-title">⚑ <b>CP 1</b></div>${slots()}</div><div class="sm-cp sm-cp2"><div class="sm-cp-title">⚑ <b>CP 2</b></div>${slots()}</div></section>
        <section class="sm-round sm-r3 ${active===3?'active':''}"><div class="sm-round-tag">ROUND 3</div><div class="sm-lane"></div><span class="sm-arrow sm-a1">›››</span><span class="sm-arrow sm-a2">›››</span><span class="sm-arrow sm-a3">›››</span><div class="sm-cp sm-cp1"><div class="sm-cp-title">⚑ <b>CP 1</b></div>${slots()}</div><div class="sm-cp sm-cp2"><div class="sm-cp-title">⚑ <b>CP 2</b></div>${slots()}</div><div class="sm-finish"><span class="ico">🏆</span><b>FINISH</b></div></section>
        <div class="sm-team-strip">${legend}</div>
      </div>
    </div>`;

    from.forEach((progress,i)=>{const p=pawnPos(progress,i),d=document.createElement('div');d.className='sm-pawn';d.id=`pawn${i}`;d.style.left=p.x+'%';d.style.top=p.y+'%';d.style.background=config.teamColors[i];d.title=run.teams[i].name;d.innerHTML=`<span>${i+1}</span>`;board.appendChild(d);});

    /* Team Progress is intentionally preserved exactly as before. */
    $('#progressPanel').innerHTML=run.teams.map((t,i)=>`<div class="team-progress"><div class="dot" style="background:${config.teamColors[i]}">${i+1}</div><div><b>${esc(t.name)}</b><small>${t.progress===0?'START':t.progress===1?'Checkpoint 1':t.progress===2?'Checkpoint 2':'FINISH'}</small></div><div class="score-pill">${t.score}</div></div>`).join('');

    const next=$('#boardNextBtn');
    if(run.gameComplete){next.textContent='🎤 Final Mission →';next.onclick=()=>go('final');}
    else if(!run.started){next.textContent='Mulai Round 1 →';next.onclick=()=>beginQuestion();}
    else{next.textContent=`Lanjut Round ${run.roundIndex+1} • Question ${run.questionIndex+1} →`;next.onclick=()=>beginQuestion();}

    if(moveAnimation){requestAnimationFrame(()=>setTimeout(()=>{moveSound();to.forEach((progress,i)=>{const pawn=$(`#pawn${i}`);if(!pawn)return;pawn.classList.add('moving');const p=pawnPos(progress,i);pawn.style.left=p.x+'%';pawn.style.top=p.y+'%';});setTimeout(()=>{run.teams.forEach((_,i)=>$(`#pawn${i}`)?.classList.remove('moving'));moveAnimation=null;},1450);},120));}
  };

  if(document.querySelector('#page-board.active'))renderBoard();
})();
