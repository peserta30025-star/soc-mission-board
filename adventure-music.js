(() => {
  const isTeam = /(^|\/)team\.html(?:$|[?#])/i.test(location.pathname + location.search);
  const role = isTeam ? 'team' : 'teacher';
  const prefKey = `soc_adventure_music_${role}`;
  const defaultEnabled = role === 'teacher';
  let stored = localStorage.getItem(prefKey);
  let enabled = stored === null ? defaultEnabled : stored === '1';
  let started = false;

  // Audio extracted from the user-provided WhatsApp video. Only the music/audio is used.
  const audio = new Audio('https://drive.google.com/uc?export=download&id=1I5yDKy1WFw2JV6C4p8GqXDIV58FDgf0Z');
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = role === 'team' ? 0.16 : 0.32;

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
    btn.textContent = state === 'error' ? '🎵 Ketuk untuk Musik' : !enabled ? '🔇 Musik: OFF' : started ? '🔊 Musik: ON' : '🎵 Musik: Siap';
  }

  async function playMusic(){
    if(!enabled) return;
    try{
      await audio.play();
      started = true;
      updateButton();
    }catch{
      started = false;
      updateButton('error');
    }
  }

  function stopMusic(){
    enabled = false;
    localStorage.setItem(prefKey,'0');
    audio.pause();
    started = false;
    updateButton();
  }

  function turnOn(){
    enabled = true;
    localStorage.setItem(prefKey,'1');
    playMusic();
  }

  btn.addEventListener('click', e => {
    e.stopPropagation();
    if(enabled && started) stopMusic();
    else turnOn();
  });

  const unlock = () => {
    if(enabled && !started) playMusic();
  };
  window.addEventListener('pointerdown', unlock, {passive:true});
  window.addEventListener('keydown', unlock, {passive:true});
  document.addEventListener('visibilitychange', () => {
    if(document.visibilityState === 'visible' && enabled && !started) playMusic();
  });

  updateButton();
})();
