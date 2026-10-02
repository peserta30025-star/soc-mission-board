/* SOC Mission Board — incremental enhancements without rebuilding the existing app */
(function(){
  const SOC_PRE_BANK=[
    'Dari beberapa contoh kegiatan siswa, tentukan mana yang menunjukkan ciri masyarakat jaringan dan jelaskan alasannya singkat.',
    'Bandingkan satu ciri interaksi tatap muka dan satu ciri interaksi digital.',
    'Sebuah informasi dari grup kelas belum jelas sumbernya. Apa yang sebaiknya dilakukan sebelum membagikannya?',
    'Apa risiko membagikan screenshot percakapan pribadi tanpa izin?',
    'Pilih tindakan yang paling tepat untuk menghargai orang lain sekaligus menjaga keamanan dalam komunikasi digital.'
  ];
  const SOC_POST_BANK=[
    'Jelaskan bagaimana jaringan digital dapat membantu kerja sama siswa yang berada di tempat berbeda.',
    'Pada situasi salah paham di grup chat, kapan komunikasi langsung lebih tepat digunakan?',
    'Analisis dua dampak yang mungkin muncul jika informasi yang belum terverifikasi terus disebarkan.',
    'Tentukan tindakan yang mencerminkan Respect, Educate, dan Protect pada kasus penyebaran screenshot pribadi.',
    'Jika kamu menjadi anggota grup kelas yang melihat pelanggaran privasi, tindakan apa yang paling bertanggung jawab dan mengapa?'
  ];

  const style=document.createElement('style');
  style.textContent=`
    .question-bank{padding-left:22px;line-height:1.65}.question-bank li+li{margin-top:8px}
    .round1-stage{border-color:#74c98c!important}.round1-stage.active,.round1-stage.done{background:#effcf3!important;border-color:#2f9e57!important}
    .round2-stage{border-color:#efbd55!important}.round2-stage.active,.round2-stage.done{background:#fff8df!important;border-color:#d99b16!important}
    .round3-stage{border-color:#b58ad5!important}.round3-stage.active,.round3-stage.done{background:#f8efff!important;border-color:#864fb1!important}
    .pawn-runway{position:relative;height:92px;margin:-12px 4% 20px;border-top:2px dashed rgba(45,105,140,.18);border-bottom:2px dashed rgba(45,105,140,.10)}
    .board-pawn{position:absolute;transform:translateX(-50%);width:31px;height:31px;border-radius:50%;display:grid;place-items:center;color:#0c3148;font-size:.72rem;font-weight:1000;border:3px solid #fff;box-shadow:0 5px 12px rgba(12,50,75,.22);transition:left 1s cubic-bezier(.22,.9,.25,1)}
    .board-pawn:after{content:"";position:absolute;left:20%;right:20%;bottom:-7px;height:8px;border-radius:50%;background:inherit;border:2px solid rgba(255,255,255,.9);z-index:-1}
    @media(max-width:600px){.pawn-runway{margin:0 2% 18px}.board-pawn{width:27px;height:27px}.question-bank{padding-left:18px}}
  `;
  document.head.appendChild(style);

  if(typeof config!=='undefined' && (!config.videoPoster||config.videoPoster==='hero-visual.webp')){
    config.videoPoster='assets/video/digital-case-poster.svg';
    if(typeof saveConfig==='function')saveConfig();
  }

  function fillQuestionBank(kind){
    const target=document.querySelector(kind==='pre'?'#preQuestionBank':'#postQuestionBank');
    if(!target)return;
    const items=kind==='pre'?SOC_PRE_BANK:SOC_POST_BANK;
    target.innerHTML=items.map((q,i)=>`<li><b>${i+1}.</b> ${esc(q)}</li>`).join('');
  }

  const originalRenderTest=renderTest;
  renderTest=function(kind){
    originalRenderTest(kind);
    fillQuestionBank(kind);
    if(kind!=='post')return;
    const body=$('#postBody');if(!body)return;
    const table=body.closest('table');
    if(table){const tr=table.querySelector('thead tr');if(tr)tr.innerHTML='<th>#</th><th>Nama Siswa</th><th>Pre-Test</th><th>Post-Test</th><th>Gain</th><th>Kelompok</th><th>Kategori Akhir</th><th>Aksi</th>';}
    body.innerHTML=students.map((s,i)=>{
      const pre=s.pre===''?'':Number(s.pre),post=s.post===''?'':Number(s.post);
      const gain=(pre===''||post==='')?'—':`${post-pre>=0?'+':''}${post-pre}`;
      return `<tr><td>${i+1}</td><td><input data-i="${i}" class="stu-name" value="${esc(s.name)}"></td><td>${pre===''?'—':pre}</td><td><input data-i="${i}" class="stu-post" type="number" min="0" max="100" value="${esc(s.post)}"></td><td><b>${gain}</b></td><td><input data-i="${i}" class="stu-group" value="${esc(s.group)}"></td><td><span class="status-chip">${post===''?'—':scoreCategory(post)}</span></td><td><button class="btn danger remove-stu" data-i="${i}" style="padding:8px 10px">Hapus</button></td></tr>`;
    }).join('');
    $$('.remove-stu').forEach(b=>b.onclick=()=>{syncStudents('post');students.splice(+b.dataset.i,1);saveStudents();renderTest('post');});
  };

  const originalRenderBoard=renderBoard;
  renderBoard=function(){
    originalRenderBoard();
    const board=$('#board'); if(!board)return;
    const stages=board.querySelectorAll('.soc-stage');
    if(stages[1])stages[1].classList.add('round1-stage');
    if(stages[2])stages[2].classList.add('round2-stage');
    if(stages[3])stages[3].classList.add('round3-stage');
    const stageLeft=[2,34,66,98];
    const fromProgress=moveAnimation?moveAnimation.from:run.teams.map(t=>t.progress);
    const runway=document.createElement('div');runway.className='pawn-runway';runway.setAttribute('aria-label','Posisi pion kelompok');
    runway.innerHTML=run.teams.map((t,i)=>`<div class="board-pawn" id="boardPawn${i}" title="${esc(t.name)}" aria-label="${esc(t.name)} berada pada progres ${fromProgress[i]} dari 3" style="left:${stageLeft[fromProgress[i]]}%;top:${6+(i%3)*20+(i>=3?9:0)}px;background:${config.teamColors[i]}">${i+1}</div>`).join('');
    const list=board.querySelector('.team-board-list');if(list)board.insertBefore(runway,list);else board.appendChild(runway);
    if(moveAnimation){const target=moveAnimation.to.slice();requestAnimationFrame(()=>setTimeout(()=>{target.forEach((p,i)=>{const pawn=$(`#boardPawn${i}`);if(pawn)pawn.style.left=`${stageLeft[p]}%`;});setTimeout(()=>{moveAnimation=null;},1100);},90));}
  };

  fillQuestionBank('pre');
  fillQuestionBank('post');
  if(document.querySelector('#page-board.active'))renderBoard();
})();
