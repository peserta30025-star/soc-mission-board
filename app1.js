const TEAM_COLORS_DEFAULT=['#4aa3ff','#56df9b','#ffd166','#ff6b6b','#b990ff','#ff9f43'];
const QUESTIONS_PER_ROUND=3;
const STORAGE_VERSION='v4_digital_society';

const DEFAULT_CONFIG={
  gameName:'SOC Mission Board',
  subject:'IPS',
  className:'IX',
  topic:'Interaksi Masyarakat Abad ke-21',
  objective:'Memahami masyarakat jaringan, membedakan interaksi dunia nyata dan dunia digital, menganalisis bentuk interaksi di era digital, serta menerapkan prinsip Respect, Educate, dan Protect secara bertanggung jawab.',
  videoSrc:'assets/video/digital-case.mp4',
  videoPoster:'hero-visual.webp',
  teams:['Kelompok 1','Kelompok 2','Kelompok 3','Kelompok 4','Kelompok 5','Kelompok 6'],
  teamColors:[...TEAM_COLORS_DEFAULT],
  rounds:[
    {
      name:'ENTER THE NETWORK',
      focus:'Masyarakat Jaringan / Network Society',
      difficulty:'🟢 LEVEL 1 • UNDERSTAND & IDENTIFY',
      questions:[
        {
          name:'CONNECTED SOCIETY', type:'single-choice', score:10,
          question:'Kelas IX membuat proyek bersama dengan siswa dari sekolah lain. Mereka membagi tugas melalui grup chat, mengedit dokumen bersama secara daring, dan melakukan rapat video. Ciri masyarakat jaringan yang paling jelas pada situasi tersebut adalah ...',
          options:['A. Hubungan sosial hanya terjadi jika orang bertemu langsung','B. Interaksi dan kerja sama terhubung melalui jaringan komunikasi digital','C. Teknologi membuat manusia tidak lagi membutuhkan kelompok sosial','D. Semua hubungan masyarakat menjadi bersifat pribadi'],
          answer:'B',
          explanation:'Masyarakat jaringan ditandai oleh hubungan dan aktivitas sosial yang terhubung melalui jaringan informasi dan komunikasi. Teknologi memungkinkan orang berinteraksi dan bekerja sama meskipun tidak berada di tempat yang sama.'
        },
        {
          name:'NETWORK CHECK', type:'true-false', score:10,
          question:'Benar atau Salah: Dalam masyarakat jaringan, hubungan sosial dapat terbentuk dan dipertahankan melampaui batas ruang karena didukung teknologi informasi dan komunikasi.',
          options:['BENAR','SALAH'], answer:'BENAR',
          explanation:'Pernyataan ini benar. Jaringan digital memungkinkan komunikasi dan pertukaran informasi berlangsung lintas tempat dan waktu, sehingga hubungan sosial tidak selalu bergantung pada pertemuan fisik.'
        },
        {
          name:'MATCH THE NETWORK', type:'matching', score:10,
          question:'Cocokkan karakteristik masyarakat jaringan dengan contoh yang paling tepat.',
          options:['1. Terhubung melalui jaringan','2. Informasi bergerak cepat','3. Kerja sama tidak dibatasi lokasi'],
          matchOptions:['A. Siswa di Bandung dan Surabaya menyusun presentasi pada dokumen daring yang sama','B. Pengumuman kegiatan sekolah tersebar ke seluruh kelas melalui grup dalam beberapa menit','C. Anggota komunitas saling berkomunikasi melalui platform digital'],
          answer:['C','B','A'],
          explanation:'Jaringan digital menghubungkan orang, mempercepat arus informasi, dan memungkinkan kerja sama berlangsung tanpa harus berada di lokasi yang sama.'
        }
      ]
    },
    {
      name:'DIGITAL INTERACTION',
      focus:'Interaksi masyarakat di dunia nyata dan dunia digital',
      difficulty:'🟠 LEVEL 2 • COMPARE & ANALYZE',
      questions:[
        {
          name:'REAL OR DIGITAL?', type:'case-study', score:15,
          question:'Raka salah memahami pesan singkat dari temannya karena tidak melihat ekspresi wajah dan nada bicara. Saat bertemu langsung, masalah tersebut cepat selesai setelah mereka menjelaskan maksud masing-masing. Kesimpulan yang paling tepat adalah ...',
          options:['A. Interaksi digital selalu lebih buruk daripada interaksi langsung','B. Interaksi langsung memberi lebih banyak petunjuk nonverbal, sedangkan interaksi digital perlu pesan yang lebih jelas agar tidak mudah disalahartikan','C. Komunikasi digital tidak dapat digunakan untuk menyelesaikan masalah','D. Interaksi langsung tidak memerlukan kemampuan berkomunikasi'],
          answer:'B',
          explanation:'Interaksi langsung memiliki petunjuk nonverbal seperti ekspresi dan intonasi. Dalam ruang digital, pesan perlu disusun lebih jelas karena sebagian petunjuk tersebut tidak selalu terlihat.'
        },
        {
          name:'DIGITAL INTERACTION SIGNALS', type:'multiple-response', score:15,
          instruction:'Pilih semua jawaban yang tepat.',
          question:'Manakah situasi yang menunjukkan karakteristik interaksi digital? Pilih semua jawaban yang tepat.',
          options:['A. Informasi dapat dikirim dengan cepat kepada banyak orang','B. Interaksi hanya dapat berlangsung jika semua orang berada di ruangan yang sama','C. Jejak komunikasi dapat tersimpan sebagai pesan, foto, atau unggahan','D. Orang dapat berinteraksi secara sinkron maupun tidak sinkron','E. Semua informasi digital pasti benar karena dapat dibaca banyak orang'],
          answer:['A','C','D'],
          explanation:'Interaksi digital dapat berlangsung cepat, meninggalkan jejak digital, dan berlangsung secara sinkron maupun tidak sinkron. Namun, informasi digital tetap perlu diperiksa kebenarannya.'
        },
        {
          name:'COMPARE THE SITUATION', type:'case-study', score:15,
          question:'Kelompok Dina berdiskusi di kelas lalu melanjutkan pembagian tugas melalui grup chat pada malam hari. Agar kerja kelompok tetap efektif, tindakan yang paling tepat adalah ...',
          options:['A. Menganggap pesan grup tidak penting karena diskusi utama sudah terjadi di kelas','B. Menggunakan kelebihan kedua bentuk interaksi: menyepakati keputusan penting saat diskusi, lalu memakai grup digital untuk koordinasi dan dokumentasi tugas','C. Memindahkan seluruh komunikasi ke grup digital agar tidak perlu bertemu sama sekali','D. Mengirim pesan sebanyak mungkin tanpa aturan waktu dan tanpa memastikan semua anggota memahami tugas'],
          answer:'B',
          explanation:'Interaksi nyata dan digital dapat saling melengkapi. Pertemuan langsung membantu penjelasan dan negosiasi, sedangkan ruang digital memudahkan koordinasi, dokumentasi, dan komunikasi jarak jauh.'
        }
      ]
    },
    {
      name:'DIGITAL RESPONSIBILITY',
      focus:'Respect • Educate • Protect',
      difficulty:'🟣 LEVEL 3 • ANALYZE, EVALUATE & DECIDE',
      videoCase:true,
      questions:[
        {
          name:'FIND THE PROBLEM', type:'multiple-response', score:20,
          instruction:'Pilih semua jawaban yang tepat berdasarkan video kasus.',
          question:'Perilaku mana yang menjadi masalah dalam kasus Nisa? Pilih semua jawaban yang tepat.',
          options:['A. Mengambil screenshot percakapan pribadi tanpa persetujuan','B. Meneruskan screenshot ke grup kelas','C. Menanyakan sumber informasi dan apakah informasi sudah diperiksa','D. Menertawakan dan meminta foto lain','E. Menyebarkan informasi yang belum diketahui kebenarannya','F. Mengingatkan bahwa percakapan tersebut bersifat pribadi'],
          answer:['A','B','D','E'],
          explanation:'Masalah utamanya adalah pelanggaran privasi, penyebaran ulang tanpa izin, komentar yang merendahkan, dan penyebaran informasi yang belum terverifikasi. Memeriksa sumber dan mengingatkan privasi justru merupakan tindakan yang bertanggung jawab.'
        },
        {
          name:'MATCH THE PRINCIPLE', type:'matching', score:20,
          question:'Cocokkan tindakan berikut dengan prinsip interaksi digital yang paling sesuai.',
          options:['1. Tidak menertawakan atau mempermalukan Nisa di grup','2. Memeriksa sumber sebelum mempercayai dan meneruskan informasi','3. Tidak menyebarkan screenshot pribadi dan menjaga data pribadi'],
          matchOptions:['A. Respect','B. Educate','C. Protect'],
          answer:['A','B','C'],
          explanation:'Respect berkaitan dengan menghargai orang lain; Educate berkaitan dengan menggunakan informasi secara cerdas dan memeriksa kebenarannya; Protect berkaitan dengan menjaga keamanan, privasi, dan data pribadi.'
        },
        {
          name:'WHAT WOULD YOU DO?', type:'multiple-response', score:20,
          instruction:'Pilih semua tindakan yang tepat jika kamu berada di dalam grup tersebut.',
          question:'Setelah melihat screenshot pribadi Nisa tersebar dan muncul informasi yang belum jelas kebenarannya, apa yang sebaiknya kamu lakukan?',
          options:['A. Tidak ikut meneruskan screenshot','B. Mengingatkan anggota grup agar menghentikan penyebaran','C. Memeriksa sumber informasi sebelum mempercayai atau membagikannya','D. Menyimpan screenshot untuk dibagikan nanti kepada teman dekat','E. Mendukung Nisa dan menyarankan melapor kepada guru/orang dewasa tepercaya jika situasi berlanjut','F. Menambahkan komentar lucu agar suasana grup lebih ramai'],
          answer:['A','B','C','E'],
          explanation:'Tindakan yang bertanggung jawab adalah menghentikan penyebaran, menjaga privasi, memeriksa kebenaran informasi, serta memberi dukungan dan mencari bantuan yang tepat bila diperlukan.'
        }
      ]
    }
  ]
};

function deepClone(x){return JSON.parse(JSON.stringify(x));}
function loadJSON(k,fallback){try{const v=JSON.parse(localStorage.getItem(k));return v??fallback;}catch{return fallback;}}
function esc(s=''){return String(s).replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));}
function norm(v){return String(v??'').trim().toUpperCase().replace(/\s+/g,'');}

let config=loadJSON(`mb_config_${STORAGE_VERSION}`,deepClone(DEFAULT_CONFIG));
let students=loadJSON('mb_students',[]);
let run=loadJSON(`mb_run_${STORAGE_VERSION}`,null);
let moveAnimation=null;

function makeTeam(name,i){return {name,progress:0,score:0,roundScores:[0,0,0],flash:0,answers:[],roundCompleted:[false,false,false],lastCorrect:false,color:config.teamColors?.[i]||TEAM_COLORS_DEFAULT[i]};}
function newRun(){return {roundIndex:0,questionIndex:0,started:false,gameComplete:false,finalMissionComplete:false,teams:config.teams.map(makeTeam),drafts:Array(6).fill(null),locked:Array(6).fill(false),revealed:false,lastResults:Array(6).fill(null)};}
if(!run||!run.teams||run.teams.length!==6||run.roundIndex===undefined) run=newRun();

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function saveRun(){localStorage.setItem(`mb_run_${STORAGE_VERSION}`,JSON.stringify(run));}
function saveConfig(){localStorage.setItem(`mb_config_${STORAGE_VERSION}`,JSON.stringify(config));}
function saveStudents(){localStorage.setItem('mb_students',JSON.stringify(students));}
function toast(msg){const t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400);}
function go(page){
  $$('.page').forEach(p=>p.classList.remove('active'));
  const p=$('#page-'+page); if(p)p.classList.add('active');
  $$('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.go===page));
  if(page==='board')renderBoard();
  if(page==='setup')renderSetup();
  if(page==='pretest')renderTest('pre');
  if(page==='posttest')renderTest('post');
  if(page==='scoreboard')renderScoreboard();
  if(page==='evaluation')renderEvaluation();
  if(page==='final')renderFinalMission();
  window.scrollTo({top:0,behavior:'smooth'});
}
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));

function questionAt(r=run.roundIndex,q=run.questionIndex){const round=config.rounds[r];return {round,question:round.questions[q],r,q};}
function teamStatus(t){if(t.progress>=3)return 'Completed';if(t.progress>0||t.answers.length)return 'In Progress';return 'Not Started';}
function scoreCategory(v){const n=Number(v)||0;return n<60?'Perlu Penguatan':n<80?'Berkembang':'Sudah Memahami';}

function renderSetup(){
  $('#cfgGameName').value=config.gameName; $('#cfgSubject').value=config.subject; $('#cfgClass').value=config.className; $('#cfgTopic').value=config.topic; $('#cfgObjective').value=config.objective;
  if($('#cfgVideoSrc')) $('#cfgVideoSrc').value=config.videoSrc||'assets/video/digital-case.mp4';
  $('#teamNameInputs').innerHTML=config.teams.map((t,i)=>`<div class="field"><label class="label">Kelompok ${i+1}</label><input class="team-name-cfg" data-i="${i}" value="${esc(t)}"><label class="mini muted">Warna pion</label><input type="color" class="team-color-cfg" data-i="${i}" value="${config.teamColors?.[i]||TEAM_COLORS_DEFAULT[i]}"></div>`).join('');
  const typeOptions=(m)=>['single-choice','true-false','multiple-response','matching','case-study'].map(v=>`<option value="${v}" ${m.type===v?'selected':''}>${v}</option>`).join('');
  $('#missionEditors').innerHTML=config.rounds.map((r,ri)=>`<div class="card round-editor"><div class="eyebrow">ROUND ${ri+1}</div><div class="field"><label class="label">Nama Round</label><input class="round-name" data-r="${ri}" value="${esc(r.name)}"></div><div class="field"><label class="label">Fokus</label><input class="round-focus" data-r="${ri}" value="${esc(r.focus)}"></div><div class="field"><label class="label">Label tingkat</label><input class="round-diff" data-r="${ri}" value="${esc(r.difficulty)}"></div>${r.questions.map((m,qi)=>`<details class="mission-editor" ${qi===0?'open':''}><summary>Question ${qi+1} — ${esc(m.name)}</summary><div class="field" style="margin-top:12px"><label class="label">Nama Tantangan</label><input class="q-name" data-r="${ri}" data-q="${qi}" value="${esc(m.name)}"></div><div class="field"><label class="label">Tipe</label><select class="q-type" data-r="${ri}" data-q="${qi}">${typeOptions(m)}</select></div><div class="field"><label class="label">Soal / Kasus</label><textarea class="q-question" data-r="${ri}" data-q="${qi}">${esc(m.question)}</textarea></div><div class="field"><label class="label">Pilihan utama (pisahkan dengan |)</label><textarea class="q-options" data-r="${ri}" data-q="${qi}">${esc((m.options||[]).join('|'))}</textarea></div><div class="field"><label class="label">Pilihan pasangan untuk Matching (pisahkan dengan |)</label><textarea class="q-match" data-r="${ri}" data-q="${qi}">${esc((m.matchOptions||[]).join('|'))}</textarea></div><div class="grid two"><div class="field"><label class="label">Kunci (multi/matching pisahkan dengan |)</label><input class="q-answer" data-r="${ri}" data-q="${qi}" value="${esc(Array.isArray(m.answer)?m.answer.join('|'):m.answer)}"></div><div class="field"><label class="label">Skor</label><input type="number" min="0" class="q-score" data-r="${ri}" data-q="${qi}" value="${m.score||0}"></div></div><div class="field"><label class="label">Feedback edukatif</label><textarea class="q-expl" data-r="${ri}" data-q="${qi}">${esc(m.explanation||'')}</textarea></div></details>`).join('')}</div>`).join('');
}

$('#saveConfigBtn').addEventListener('click',()=>{
  config.gameName=$('#cfgGameName').value.trim()||'SOC Mission Board'; config.subject=$('#cfgSubject').value.trim(); config.className=$('#cfgClass').value.trim(); config.topic=$('#cfgTopic').value.trim(); config.objective=$('#cfgObjective').value.trim();
  if($('#cfgVideoSrc')) config.videoSrc=$('#cfgVideoSrc').value.trim()||'assets/video/digital-case.mp4';
  $$('.team-name-cfg').forEach(x=>config.teams[+x.dataset.i]=x.value.trim()||`Kelompok ${+x.dataset.i+1}`);
  $$('.team-color-cfg').forEach(x=>config.teamColors[+x.dataset.i]=x.value);
  for(let r=0;r<3;r++){
    config.rounds[r].name=$(`.round-name[data-r="${r}"]`).value.trim();
    config.rounds[r].focus=$(`.round-focus[data-r="${r}"]`).value.trim();
    config.rounds[r].difficulty=$(`.round-diff[data-r="${r}"]`).value.trim();
    for(let q=0;q<3;q++){
      const item=config.rounds[r].questions[q];
      item.name=$(`.q-name[data-r="${r}"][data-q="${q}"]`).value.trim();
      item.type=$(`.q-type[data-r="${r}"][data-q="${q}"]`).value;
      item.question=$(`.q-question[data-r="${r}"][data-q="${q}"]`).value.trim();
      item.options=$(`.q-options[data-r="${r}"][data-q="${q}"]`).value.split('|').map(v=>v.trim()).filter(Boolean);
      item.matchOptions=$(`.q-match[data-r="${r}"][data-q="${q}"]`).value.split('|').map(v=>v.trim()).filter(Boolean);
      const raw=$(`.q-answer[data-r="${r}"][data-q="${q}"]`).value.split('|').map(v=>v.trim()).filter(Boolean);
      item.answer=['multiple-response','matching'].includes(item.type)?raw:(raw[0]||'');
      item.score=+$(`.q-score[data-r="${r}"][data-q="${q}"]`).value||0;
      item.explanation=$(`.q-expl[data-r="${r}"][data-q="${q}"]`).value.trim();
    }
  }
  saveConfig(); run=newRun(); saveRun(); toast('Pengaturan disimpan. Run baru siap dimainkan.');
});
$('#resetConfigBtn').addEventListener('click',()=>{config=deepClone(DEFAULT_CONFIG);saveConfig();run=newRun();saveRun();renderSetup();toast('Konfigurasi kembali ke default Interaksi Masyarakat Abad ke-21.');});

function renderTest(kind){
  if(students.length===0) students=Array.from({length:6},(_,i)=>({name:'',group:`Kelompok ${(i%6)+1}`,pre:'',post:''}));
  const body=$(kind==='pre'?'#preBody':'#postBody');
  body.innerHTML=students.map((s,i)=>{const val=s[kind];return `<tr><td>${i+1}</td><td><input data-i="${i}" class="stu-name" value="${esc(s.name)}"></td><td><input data-i="${i}" class="stu-${kind}" type="number" min="0" max="100" value="${esc(val)}"></td><td><input data-i="${i}" class="stu-group" value="${esc(s.group)}"></td><td><span class="status-chip">${val===''?'—':scoreCategory(val)}</span></td><td><button class="btn danger remove-stu" data-i="${i}" style="padding:8px 10px">Hapus</button></td></tr>`;}).join('');
  $$('.remove-stu').forEach(b=>b.onclick=()=>{syncStudents(kind);students.splice(+b.dataset.i,1);saveStudents();renderTest(kind);});
}
function syncStudents(kind){$$('.stu-name').forEach(x=>students[+x.dataset.i].name=x.value);$$(`.stu-${kind}`).forEach(x=>students[+x.dataset.i][kind]=x.value);$$('.stu-group').forEach(x=>students[+x.dataset.i].group=x.value);}
function addStudent(kind){syncStudents(kind);students.push({name:'',group:'Kelompok 1',pre:'',post:''});renderTest(kind);}
$('#addStudentPre').onclick=()=>addStudent('pre'); $('#addStudentPost').onclick=()=>addStudent('post');
$('#savePre').onclick=()=>{syncStudents('pre');saveStudents();renderTest('pre');toast('Data pre-test tersimpan.');};
$('#savePost').onclick=()=>{syncStudents('post');saveStudents();renderTest('post');toast('Data post-test tersimpan.');};