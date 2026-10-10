(()=>{
  if(window.self!==window.top)return;
  if(document.getElementById('socCopyrightCredit'))return;

  const style=document.createElement('style');
  style.textContent=`
    #socCopyrightCredit{
      position:fixed;
      right:12px;
      bottom:8px;
      z-index:99999;
      padding:4px 8px;
      border-radius:999px;
      font:600 10px/1.2 system-ui,-apple-system,"Segoe UI",sans-serif;
      letter-spacing:.02em;
      color:rgba(22,79,120,.72);
      background:rgba(255,255,255,.76);
      border:1px solid rgba(22,79,120,.12);
      box-shadow:0 2px 8px rgba(0,0,0,.05);
      backdrop-filter:blur(5px);
      -webkit-backdrop-filter:blur(5px);
      pointer-events:none;
      user-select:none;
    }
    @media(max-width:640px){
      #socCopyrightCredit{
        right:8px;
        bottom:6px;
        font-size:9px;
        padding:3px 7px;
        opacity:.88;
      }
    }
  `;
  document.head.appendChild(style);

  const credit=document.createElement('div');
  credit.id='socCopyrightCredit';
  credit.setAttribute('aria-label','Hak cipta SOC Mission Board oleh Fatwa Aliyah');
  credit.textContent='© 2026 SOC Mission Board • by Fatwa Aliyah';
  document.body.appendChild(credit);
})();