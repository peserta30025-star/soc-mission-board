(() => {
  const isTeam = /(^|\/)team\.html(?:$|[?#])/i.test(location.pathname + location.search);
  const role = isTeam ? 'team' : 'teacher';
  const prefKey = `soc_adventure_music_${role}`;
  const defaultEnabled = role === 'teacher';
  let wanted = localStorage.getItem(prefKey);
  if (wanted === null) wanted = defaultEnabled ? '1' : '0';
  let enabled = wanted === '1';
  let ctx = null;
  let master = null;
  let timer = null;
  let cycleEnd = 0;
  let started = false;

  const style = document.createElement('style');
  style.textContent = `
    .soc-music-btn{position:fixed;right:18px;bottom:18px;z-index:2147483000;border:1px solid rgba(255,255,255,.78);border-radius:999px;padding:11px 15px;background:rgba(15,91,134,.94);color:#fff;font:800 13px/1.1 Inter,system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 8px 24px rgba(12,61,92,.22);backdrop-filter:blur(8px);cursor:pointer;user-select:none}
    .soc-music-btn.off{background:rgba(95,112,124,.88)}
    .soc-music-btn.ready{background:rgba(218,143,0,.94)}
    .soc-music-btn:active{transform:translateY(1px)}
    @media(max-width:680px){.soc-music-btn{right:12px;bottom:12px;padding:10px 12px;font-size:12px}}
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'soc-music-btn';
  btn.setAttribute('aria-label','Musik petualangan');
  document.body.appendChild(btn);

  const note = (n) => {
    const map = {C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,B4:493.88,C5:523.25,D5:587.33,E5:659.25,G5:783.99,A5:880};
    return map[n] || 440;
  };

  const melody = [
    ['E4',.00,.28],['G4',.36,.28],['A4',.72,.46],['G4',1.28,.28],
    ['E4',1.64,.28],['D4',2.00,.28],['E4',2.36,.52],
    ['G4',3.00,.28],['A4',3.36,.28],['C5',3.72,.46],['A4',4.28,.28],
    ['G4',4.64,.28],['E4',5.00,.28],['D4',5.36,.52]
  ];
  const bass = [
    ['C4',0,1.3],['G4',1.5,1.3],['A4',3.0,1.3],['F4',4.5,1.3]
  ];

  function ensureAudio(){
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = role === 'team' ? 0.028 : 0.052;
    master.connect(ctx.destination);
  }

  function tone(freq, start, dur, type='triangle', vol=.16){
    if (!ctx || !master) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq,start);
    g.gain.setValueAtTime(0,start);
    g.gain.linearRampToValueAtTime(vol,start+.025);
    g.gain.exponentialRampToValueAtTime(.0001,start+dur);
    o.connect(g); g.connect(master);
    o.start(start); o.stop(start+dur+.05);
  }

  function bell(freq,start){
    tone(freq,start,.55,'sine',.10);
    tone(freq*2,start+.01,.32,'sine',.028);
  }

  function scheduleCycle(from){
    if (!enabled || !ctx) return;
    const base = from;
    melody.forEach(([n,t,d],i)=>{
      tone(note(n),base+t,d,'triangle',i%4===2?.18:.13);
      if (i===2 || i===9) bell(note(n)*2,base+t+.02);
    });
    bass.forEach(([n,t,d])=>tone(note(n)/2,base+t,d,'sine',.06));
    // Soft marching pulse to make it feel like an adventure without overpowering class audio.
    for(let i=0;i<12;i++) tone(i%2===0?98:110,base+i*.5,.08,'sine',.025);
    cycleEnd = base + 6.15;
  }

  function scheduleAhead(){
    if (!enabled || !ctx) return;
    const now = ctx.currentTime;
    if (cycleEnd < now + 1.2) scheduleCycle(Math.max(now+.05, cycleEnd || now+.05));
  }

  async function startMusic(){
    if (!enabled) return;
    ensureAudio();
    if (!ctx) return;
    try{ if (ctx.state === 'suspended') await ctx.resume(); }catch{}
    if (!started){
      started = true;
      cycleEnd = 0;
      scheduleAhead();
      timer = setInterval(scheduleAhead,700);
    }
    updateButton();
  }

  function stopMusic(){
    enabled = false;
    localStorage.setItem(prefKey,'0');
    if (timer){clearInterval(timer);timer=null;}
    started = false;
    cycleEnd = 0;
    if (master && ctx){
      try{master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setTargetAtTime(.0001,ctx.currentTime,.05);}catch{}
    }
    updateButton();
  }

  function turnOn(){
    enabled = true;
    localStorage.setItem(prefKey,'1');
    if (master && ctx) master.gain.value = role === 'team' ? 0.028 : 0.052;
    startMusic();
  }

  function updateButton(){
    btn.classList.toggle('off',!enabled);
    btn.classList.toggle('ready',enabled && !started);
    btn.textContent = !enabled ? '🔇 Musik: OFF' : started ? '🔊 Musik: ON' : '🎵 Musik: Siap';
    btn.title = role === 'team' ? 'Musik petualangan di HP ini' : 'Musik petualangan untuk Mode Guru dan Mode HP Siswa';
  }

  btn.addEventListener('click',(e)=>{
    e.stopPropagation();
    if (enabled) stopMusic(); else turnOn();
  });

  // Browsers require a user gesture before sound can start. On the teacher page,
  // music is ready by default and begins with the first click/tap/keyboard action.
  const unlock = () => {
    if (enabled && !started) startMusic();
  };
  window.addEventListener('pointerdown',unlock,{passive:true});
  window.addEventListener('keydown',unlock,{passive:true});
  document.addEventListener('visibilitychange',()=>{
    if (document.visibilityState==='visible' && enabled && started && ctx?.state==='suspended') ctx.resume().catch(()=>{});
  });

  updateButton();
})();
