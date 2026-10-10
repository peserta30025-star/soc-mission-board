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
      difficulty:'🟢 LEVEL 1 • LOTS — UNDERSTAND & IDENTIFY',
      questions:[
        {
          name:'CIRI MASYARAKAT JARINGAN', type:'single-choice', score:10, cognitiveLevel:'LOTS',
          question:'Kelas IX menggunakan grup pesan, dokumen daring, dan panggilan video untuk bekerja sama dengan siswa dari sekolah lain. Ciri masyarakat jaringan yang paling tampak pada situasi tersebut adalah ...',
          options:['A. Interaksi sosial hanya berlangsung melalui pertemuan langsung','B. Interaksi sosial terhubung melalui jaringan komunikasi digital','C. Interaksi sosial berlangsung tanpa pertukaran informasi','D. Interaksi sosial berpusat pada kegiatan individu tanpa jaringan'],
          answer:'B',
          explanation:'Masyarakat jaringan ditandai oleh hubungan sosial yang terhubung melalui jaringan informasi dan komunikasi. Teknologi memungkinkan kerja sama tetap berlangsung meskipun orang berada di tempat yang berbeda.'
        },
        {
          name:'ARUS INFORMASI', type:'single-choice', score:10, cognitiveLevel:'LOTS',
          question:'Pernyataan yang paling tepat menggambarkan masyarakat jaringan adalah ...',
          options:['A. Hubungan masyarakat dibatasi oleh kedekatan wilayah tempat tinggal','B. Arus informasi dan interaksi dapat melintasi ruang melalui teknologi','C. Komunikasi digital menggantikan seluruh bentuk interaksi langsung','D. Informasi di jaringan digital selalu dapat dipercaya tanpa pemeriksaan'],
          answer:'B',
          explanation:'Dalam masyarakat jaringan, informasi dan interaksi dapat bergerak melampaui batas ruang dengan bantuan teknologi. Namun, interaksi langsung tetap ada dan informasi digital tetap perlu diperiksa.'
        },
        {
          name:'CONTOH KERJA SAMA JARINGAN', type:'single-choice', score:10, cognitiveLevel:'LOTS',
          question:'Kegiatan yang paling tepat menunjukkan kerja sama dalam masyarakat jaringan adalah ...',
          options:['A. Seorang siswa mengerjakan tugas sendiri tanpa berkomunikasi','B. Siswa membaca sumber belajar secara mandiri di perpustakaan','C. Siswa dari dua kota menyunting dokumen yang sama secara daring','D. Siswa mengumpulkan tugas cetak kepada guru setelah pelajaran'],
          answer:'C',
          explanation:'Kerja sama dalam masyarakat jaringan terlihat ketika orang yang berada di lokasi berbeda dapat berkolaborasi melalui jaringan digital.'
        }
      ]
    },
    {
      name:'DIGITAL INTERACTION',
      focus:'Interaksi masyarakat di dunia nyata dan dunia digital',
      difficulty:'🟠 LEVEL 2 • MOTS — APPLY & ANALYZE',
      questions:[
        {
          name:'KOMUNIKASI YANG JELAS', type:'single-choice', score:15, cognitiveLevel:'MOTS',
          question:'Raka salah memahami pesan singkat dari temannya karena tidak melihat ekspresi dan nada bicara. Tindakan yang paling tepat agar komunikasi digital berikutnya lebih jelas adalah ...',
          options:['A. Menulis pesan dengan jelas lalu memastikan penerima memahaminya','B. Menghindari semua komunikasi digital dan hanya bertemu langsung','C. Mengirim lebih banyak pesan tanpa menunggu tanggapan penerima','D. Menggunakan singkatan sebanyak mungkin agar pesan lebih cepat dikirim'],
          answer:'A',
          explanation:'Komunikasi digital memiliki keterbatasan petunjuk nonverbal. Pesan yang jelas dan konfirmasi pemahaman dapat mengurangi salah tafsir.'
        },
        {
          name:'MEMADUKAN INTERAKSI', type:'single-choice', score:15, cognitiveLevel:'MOTS',
          question:'Kelompok Dina membahas keputusan penting saat bertemu di kelas, lalu menggunakan grup pesan untuk membagi tugas dan mengirim hasil kerja. Alasan penggunaan kedua bentuk interaksi tersebut tepat adalah ...',
          options:['A. Interaksi langsung dan digital dapat saling melengkapi sesuai kebutuhan','B. Interaksi digital selalu lebih efektif daripada pertemuan langsung','C. Interaksi langsung hanya diperlukan jika jaringan internet tidak tersedia','D. Interaksi digital membuat kesepakatan kelompok tidak lagi diperlukan'],
          answer:'A',
          explanation:'Interaksi langsung membantu penjelasan dan kesepakatan, sedangkan interaksi digital memudahkan koordinasi dan dokumentasi. Keduanya dapat digunakan sesuai kebutuhan.'
        },
        {
          name:'CEK INFORMASI GRUP', type:'single-choice', score:15, cognitiveLevel:'MOTS',
          question:'Informasi jadwal kegiatan di grup kelas berubah setelah beberapa kali diteruskan. Tindakan yang paling tepat sebelum membagikan informasi tersebut adalah ...',
          options:['A. Membagikan versi yang paling baru karena terlihat lebih meyakinkan','B. Memeriksa pesan sumber dan mengonfirmasi informasi kepada pihak terkait','C. Menunggu sampai banyak teman membagikan informasi yang sama','D. Menghapus semua pesan agar tidak ada informasi yang beredar di grup'],
          answer:'B',
          explanation:'Sebelum meneruskan informasi, siswa perlu memeriksa sumber awal dan mengonfirmasi kepada pihak yang berwenang agar tidak menyebarkan informasi yang keliru.'
        }
      ]
    },
    {
      name:'DIGITAL RESPONSIBILITY',
      focus:'Literasi digital, hoaks, dan tanggung jawab bermedia • Respect • Educate • Protect',
      difficulty:'🟣 LEVEL 3 • MOTS–HOTS — ANALYZE, EVALUATE & DECIDE',
      videoCase:true,
      questions:[
        {
          name:'VERIFY BEFORE SHARE', type:'single-choice', score:20, cognitiveLevel:'MOTS',
          instruction:'Tonton video “Berita Nyata” pada layar guru, lalu jawab berdasarkan informasi yang ditampilkan.',
          question:'Dalam video, sebuah cuplikan viral dibagikan bersama klaim tertentu. Sebelum meneruskan cuplikan serupa, tindakan yang paling tepat adalah ...',
          options:['A. Membagikannya segera agar teman menerima informasi lebih cepat','B. Memeriksa sumber, konteks, dan pembanding tepercaya sebelum membagikan','C. Menambahkan pendapat pribadi agar isi unggahan lebih menarik','D. Mengirimkannya hanya kepada teman dekat tanpa memeriksa informasi'],
          answer:'B',
          explanation:'Informasi yang viral belum tentu benar. Sebelum membagikan, kita perlu memeriksa sumber asli, memahami konteks, dan membandingkannya dengan sumber tepercaya.'
        },
        {
          name:'RESPONS YANG BERTANGGUNG JAWAB', type:'single-choice', score:20, cognitiveLevel:'HOTS',
          instruction:'Gunakan kasus dalam video untuk menilai tindakan yang paling bertanggung jawab.',
          question:'Seorang teman mengunggah cuplikan dari video dengan tuduhan terhadap seseorang, tetapi belum ada sumber tepercaya yang mendukung tuduhan tersebut. Respons yang paling bertanggung jawab adalah ...',
          options:['A. Ikut memberi komentar agar unggahan segera mendapat perhatian','B. Meminta penyebaran dihentikan dan mengajak teman memeriksa kebenarannya','C. Membagikan ulang dengan catatan bahwa informasinya mungkin belum benar','D. Menyimpan cuplikan lalu mengirimkannya secara pribadi kepada teman lain'],
          answer:'B',
          explanation:'Tindakan yang bertanggung jawab adalah menghentikan penyebaran informasi yang belum terverifikasi dan mengajak orang lain memeriksa kebenarannya. Ini mencerminkan sikap Respect, Educate, dan Protect.'
        },
        {
          name:'ATURAN BERBAGI INFORMASI', type:'single-choice', score:20, cognitiveLevel:'HOTS',
          instruction:'Nilai pilihan aturan berdasarkan pelajaran dari video.',
          question:'Sekolah ingin membuat aturan berbagi informasi di grup kelas berdasarkan pelajaran dari video. Aturan yang paling efektif adalah ...',
          options:['A. Informasi populer boleh dibagikan jika sudah dibahas oleh banyak akun','B. Informasi dibagikan setelah sumber, konteks, dan dampaknya diperiksa','C. Informasi dari internet hanya boleh dibagikan oleh ketua kelas','D. Informasi yang diteruskan oleh teman dianggap cukup dapat dipercaya'],
          answer:'B',
          explanation:'Aturan yang baik tidak bergantung pada popularitas atau siapa yang membagikan. Informasi perlu diperiksa sumber, konteks, kebenaran, dan dampaknya sebelum diteruskan.'
        }
      ]
    }
  ]};

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