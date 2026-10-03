(() => {
  const isTeam = /(^|\/)team\.html(?:$|[?#])/i.test(location.pathname + location.search);
  const role = isTeam ? 'team' : 'teacher';
  const prefKey = `soc_adventure_music_embedded_v3_${role}`;
  let enabled = localStorage.getItem(prefKey) !== '0';
  let started = false;
  let audio = null;
  let audioPromise = null;

  const style = document.createElement('style');
  style.textContent = `
    .soc-music-btn{position:fixed;right:18px;bottom:18px;z-index:2147483000;border:1px solid rgba(255,255,255,.78);border-radius:999px;padding:11px 15px;background:rgba(15,91,134,.94);color:#fff;font:800 13px/1.1 Inter,system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 8px 24px rgba(12,61,92,.22);backdrop-filter:blur(8px);cursor:pointer;user-select:none}
    .soc-music-btn.off{background:rgba(95,112,124,.88)}
    .soc-music-btn.ready{background:rgba(218,143,0,.94)}
    .soc-music-btn.error{background:rgba(181,67,67,.94)}
    .soc-music-btn:active{transform:translateY(1px)}
    @media(max-width:680px){.soc-music-btn{right:12px;bottom:12px;padding:10px 12px;font-size:12px}}
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'soc-music-btn';
  btn.setAttribute('aria-label','Musik petualangan');
  document.body.appendChild(btn);

  function updateButton(state=''){
    btn.classList.toggle('off', !enabled);
    btn.classList.toggle('ready', enabled && !started && state !== 'error');
    btn.classList.toggle('error', state === 'error');
    btn.textContent = state === 'error' ? '🎵 Ketuk Musik Lagi' : !enabled ? '🔇 Musik: OFF' : started ? '🔊 Musik: ON' : '🎵 Musik: Siap';
  }

  function loadAudio(){
    if(audio) return Promise.resolve(audio);
    if(audioPromise) return audioPromise;
    audioPromise = fetch('assets/adventure-loop.txt?v=20261003-music4', {cache:'no-store'})
      .then(r => {
        if(!r.ok) throw new Error(`Audio data ${r.status}`);
        return r.text();
      })
      .then(b64 => {
        const clean = b64.trim();
        if(clean.length < 1000) throw new Error('Audio data terlalu pendek');
        audio = new Audio('data:audio/mpeg;base64,' + clean);
        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = role === 'team' ? 0.20 : 0.38;
        audio.setAttribute('playsinline','');
        audio.addEventListener('playing', () => { started = true; updateButton(); });
        audio.addEventListener('pause', () => { if(!audio.ended){ started = false; updateButton(); } });
        audio.addEventListener('error', () => { started = false; updateButton('error'); });
        return audio;
      })
      .catch(err => {
        console.warn('SOC music load failed:', err);
        audioPromise = null;
        updateButton('error');
        throw err;
      });
    return audioPromise;
  }

  async function playMusic(){
    if(!enabled) return;
    try{
      const a = await loadAudio();
      if(a.ended) a.currentTime = 0;
      await a.play();
      started = true;
      updateButton();
    }catch(err){
      started = false;
      updateButton('error');
      console.warn('SOC music play blocked:', err);
    }
  }

  function stopMusic(){
    enabled = false;
    localStorage.setItem(prefKey,'0');
    if(audio) audio.pause();
    started = false;
    updateButton();
  }

  function turnOn(){
    enabled = true;
    localStorage.setItem(prefKey,'1');
    playMusic();
  }

  btn.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    if(enabled && started) stopMusic();
    else turnOn();
  });

  const unlock = e => {
    if(e?.target === btn) return;
    if(enabled && !started) playMusic();
  };
  window.addEventListener('pointerdown', unlock, {passive:true});
  window.addEventListener('touchstart', unlock, {passive:true});
  window.addEventListener('keydown', unlock, {passive:true});
  document.addEventListener('visibilitychange', () => {
    if(document.visibilityState === 'visible' && enabled && !started) playMusic();
  });

  loadAudio().catch(()=>{});
  updateButton();
})();
