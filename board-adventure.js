/* Adventure Mission Board visual override. Keeps all existing game logic unchanged. */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    #page-board .board{min-height:780px;aspect-ratio:1.42/1;background:linear-gradient(180deg,#dff5ff 0%,#eef9dd 42%,#fff1c8 100%);border:1px solid rgba(13,82,127,.2);overflow:hidden;position:relative}
    #page-board .board:before{content:"";position:absolute;inset:0;background:
      radial-gradient(circle at 10% 18%,rgba(255,255,255,.95) 0 3.5%,transparent 3.8%),
      radial-gradient(circle at 18% 16%,rgba(255,255,255,.8) 0 2.8%,transparent 3.1%),
      radial-gradient(circle at 88% 12%,rgba(255,255,255,.9) 0 4%,transparent 4.3%),
      radial-gradient(ellipse at 18% 88%,rgba(58,151,83,.45) 0 16%,transparent 16.5%),
      radial-gradient(ellipse at 82% 86%,rgba(62,156,91,.42) 0 18%,transparent 18.5%),
      linear-gradient(165deg,transparent 0 55%,rgba(64,165,214,.18) 55% 62%,transparent 62% 100%);
      pointer-events:none;z-index:0}
    #page-board .board:after{content:"";position:absolute;left:7%;right:7%;top:17%;bottom:10%;background:
      radial-gradient(circle at 10% 15%,#6dac62 0 2.2%,transparent 2.5%),
      radial-gradient(circle at 18% 22%,#4f9151 0 2.4%,transparent 2.7%),
      radial-gradient(circle at 80% 17%,#6dac62 0 2.2%,transparent 2.5%),
      radial-gradient(circle at 86% 38%,#4f9151 0 2.4%,transparent 2.7%),
      radial-gradient(circle at 16% 72%,#6dac62 0 2.4%,transparent 2.7%),
      radial-gradient(circle at 74% 74%,#4f9151 0 2.6%,transparent 2.9%);
      opacity:.72;pointer-events:none;z-index:0}
    #page-board .mb-title{z-index:3}
    #page-board .mb-title-main{font-size:clamp(2rem,4vw,3.7rem)}
    #page-board .mb-title-sub{background:#8b5a2b;color:#fff;border:3px solid #e7ba73;box-shadow:0 6px 0 #5b351a}
    #page-board .mb-round{z-index:2;height:19%;left:3%;right:3%;overflow:visible}
    #page-board .mb-round.r1{top:18%;color:#228b57;background:linear-gradient(90deg,rgba(231,255,235,.94),rgba(245,255,248,.92))}
    #page-board .mb-round.r2{top:41%;color:#d89400;background:linear-gradient(90deg,rgba(255,247,209,.94),rgba(255,252,232,.92))}
    #page-board .mb-round.r3{top:64%;color:#8a4bc0;background:linear-gradient(90deg,rgba(246,232,255,.94),rgba(255,243,251,.92))}
    #page-board .mb-round-label{left:8%;top:7%;font-size:clamp(.82rem,1.45vw,1.18rem);max-width:44%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #page-board .mb-track{left:8%;right:8%;top:52%;height:18%;box-shadow:inset 0 2px 4px rgba(255,255,255,.5)}
    #page-board .mb-track:after{content:"•  •  •  •  •  •  •  •  •  •";left:7%;right:7%;top:50%;transform:translateY(-54%);font-size:1.45rem;letter-spacing:.18em;color:white;text-shadow:none;white-space:nowrap;overflow:hidden}
    #page-board .round-goal{top:13%;width:29%;height:74%;background:rgba(255,255,255,.9)}
    #page-board .goal-r1{left:64%}
    #page-board .goal-r2{left:7%}
    #page-board .goal-r3{left:64%}
    #page-board .mb-start{left:2.1%;top:23.5%;width:13%;background:#165d8b;color:#165d8b}
    #page-board .mb-finish{right:2.1%;top:69%;width:13%;background:#7e4db2;color:#7e4db2}
    #page-board .mb-start .inner,#page-board .mb-finish .inner{font-size:clamp(.72rem,1.35vw,1.05rem)}
    #page-board .mb-team-legend{bottom:1.7%;height:7.2%;z-index:7}
    #page-board .pawn{z-index:20;width:36px;height:36px;transition:left 1.35s cubic-bezier(.2,.85,.25,1),top 1.35s cubic-bezier(.2,.85,.25,1);animation:mbPawnIdle 1.8s ease-in-out infinite alternate}
    #page-board .pawn.moving{animation:mbPawnMove .34s ease-in-out infinite alternate}
    @keyframes mbPawnIdle{from{margin-top:0}to{margin-top:-2px}}
    @keyframes mbPawnMove{from{margin-top:-3px;transform:translate(-50%,-50%) scale(1)}to{margin-top:2px;transform:translate(-50%,-50%) scale(1.08)}}
    #page-board .adventure-note{position:absolute;left:4%;bottom:10.5%;z-index:5;background:#fff3c8;border:2px solid #c69338;border-radius:14px;padding:8px 13px;color:#664317;font-weight:900;font-size:.78rem;transform:rotate(-2deg);box-shadow:0 5px 12px rgba(80,55,20,.12)}
    #page-board .route-arrow{position:absolute;z-index:3;font-size:1.9rem;font-weight:1000;color:#fff;text-shadow:0 2px 5px rgba(0,0,0,.16)}
    #page-board .route-arrow.a1{left:51%;top:27%}.route-arrow.a2{left:48%;top:50%;transform:rotate(180deg)}.route-arrow.a3{left:51%;top:73%}
    @media(max-width:1050px){#page-board .board{min-height:680px}}
    @media(max-width:700px){#page-board .board{min-height:600px}.board-layout{display:block!important}.board-layout>.card{margin:18px 0 0!important;max-width:none!important}.mb-team-legend{grid-template-columns:repeat(3,1fr)!important;height:12%!important}.adventure-note{display:none}}
  `;
  document.head.appendChild(style);

  function moveSound(){
    try{
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return;
      const ctx=new AC();
      const start=ctx.currentTime;
      const notes=[392,494,587,784];
      notes.forEach((freq,i)=>{
        const osc=ctx.createOscillator();
        const gain=ctx.createGain();
        osc.type='triangle';osc.frequency.value=freq;
        gain.gain.setValueAtTime(0.0001,start+i*.15);
        gain.gain.exponentialRampToValueAtTime(.11,start+i*.15+.025);
        gain.gain.exponentialRampToValueAtTime(.0001,start+i*.15+.13);
        osc.connect(gain);gain.connect(ctx.destination);
        osc.start(start+i*.15);osc.stop(start+i*.15+.14);
      });
      setTimeout(()=>{try{ctx.close()}catch(e){}},1000);
    }catch(e){}
  }

  function pawnPos(progress,i){
    const teamOffset=[-4.5,-2.7,-.9,.9,2.7,4.5][i]||0;
    const yOffset=[-2.5,0,2.5,-2.5,0,2.5][i]||0;
    if(progress<=0)return{x:8.5+teamOffset*.45,y:31+yOffset};
    if(progress===1)return{x:70+teamOffset,y:31+yOffset};
    if(progress===2)return{x:13+teamOffset,y:54+yOffset};
    return{x:70+teamOffset,y:77+yOffset};
  }

  function slots(){return Array.from({length:6},()=>'<div class="mb-slot"></div>').join('');}
  function goal(title,cls,done,active){return `<div class="mb-checkpoint round-goal ${cls} ${done?'done':''} ${active?'active':''}"><div class="mb-cp-head"><span class="flag">⚑</span><span>${title}</span></div><div class="mb-slots">${slots()}</div></div>`;}

  renderBoard=function(){
    $('#boardGameTitle').textContent=config.gameName;
    const board=$('#board');
    const maxProgress=Math.max(...run.teams.map(t=>t.progress));
    const activeRound=run.gameComplete?3:run.roundIndex+1;
    board.innerHTML=`
      <div class="mb-title"><div class="mb-title-main">MISSION BOARD</div><div class="mb-title-sub">THINK • CONNECT • RESPECT</div></div>
      <div class="mb-round r1"><div class="mb-track"></div><div class="mb-round-label">ROUND 1 • ENTER THE NETWORK</div>${goal('CHECKPOINT 1','goal-r1',maxProgress>=1,activeRound===1)}</div>
      <div class="mb-round r2"><div class="mb-track"></div><div class="mb-round-label">ROUND 2 • DIGITAL INTERACTION</div>${goal('CHECKPOINT 2','goal-r2',maxProgress>=2,activeRound===2)}</div>
      <div class="mb-round r3"><div class="mb-track"></div><div class="mb-round-label">ROUND 3 • DIGITAL RESPONSIBILITY</div>${goal('FINISH','goal-r3',maxProgress>=3,activeRound===3)}</div>
      <div class="mb-start"><div class="inner"><span class="flag">🚩</span>START</div></div>
      <div class="mb-finish"><div class="inner"><span class="flag">🏆</span>FINISH</div></div>
      <div class="route-arrow a1">➜</div><div class="route-arrow a2">➜</div><div class="route-arrow a3">➜</div>
      <div class="adventure-note">Satu tim • satu misi • maju setelah round selesai!</div>
      <div class="mb-team-legend">${run.teams.map((t,i)=>`<div class="mb-legend-item" style="background:${config.teamColors[i]}18"><span class="mb-legend-dot" style="background:${config.teamColors[i]}"></span><span>K${i+1}</span></div>`).join('')}</div>`;

    const from=moveAnimation?moveAnimation.from:run.teams.map(t=>t.progress);
    const to=moveAnimation?moveAnimation.to:run.teams.map(t=>t.progress);
    run.teams.forEach((t,i)=>{
      const p=pawnPos(from[i],i);
      const d=document.createElement('div');
      d.className=`pawn p${i+1}`;d.id=`pawn${i}`;
      d.style.background=config.teamColors[i]||TEAM_COLORS_DEFAULT[i];
      d.style.left=p.x+'%';d.style.top=p.y+'%';
      d.title=t.name;d.setAttribute('aria-label',`${t.name}, progres ${t.progress} dari 3`);
      d.innerHTML=`<span>${i+1}</span>`;board.appendChild(d);
    });

    $('#progressPanel').innerHTML=run.teams.map((t,i)=>`<div class="team-progress"><div class="dot" style="background:${config.teamColors[i]}">${i+1}</div><div><b>${esc(t.name)}</b><small>${t.progress===0?'START':t.progress===1?'Checkpoint 1':t.progress===2?'Checkpoint 2':'FINISH'}</small></div><div class="score-pill">${t.score}</div></div>`).join('');

    const next=$('#boardNextBtn');
    if(run.gameComplete){next.textContent='🎤 Final Mission →';next.onclick=()=>go('final');}
    else if(!run.started){next.textContent='Mulai Round 1 →';next.onclick=()=>beginQuestion();}
    else {next.textContent=`Lanjut Round ${run.roundIndex+1} • Question ${run.questionIndex+1} →`;next.onclick=()=>beginQuestion();}

    if(moveAnimation){
      requestAnimationFrame(()=>setTimeout(()=>{
        moveSound();
        to.forEach((progress,i)=>{
          const pawn=$(`#pawn${i}`);if(!pawn)return;
          pawn.classList.add('moving');
          const p=pawnPos(progress,i);pawn.style.left=p.x+'%';pawn.style.top=p.y+'%';
        });
        setTimeout(()=>{run.teams.forEach((_,i)=>$(`#pawn${i}`)?.classList.remove('moving'));moveAnimation=null;},1500);
      },120));
    }
  };

  if(document.querySelector('#page-board.active'))renderBoard();
})();
