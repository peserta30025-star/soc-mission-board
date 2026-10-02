const TEAM_COLORS=['#4aa3ff','#56df9b','#ffd166','#ff6b6b','#b990ff','#ff9f43'];
const DEFAULT_CONFIG={
 gameName:'SOC Mission Board',subject:'IPS',className:'IX',topic:'Kearifan Lokal di Tengah Arus Modernisasi dan Globalisasi',objective:'Menganalisis kearifan lokal, perubahan akibat modernisasi dan globalisasi, serta menentukan solusi pelestarian yang relevan.',
 teams:['Kelompok 1','Kelompok 2','Kelompok 3','Kelompok 4','Kelompok 5','Kelompok 6'],
 rounds:[
  {name:'LOCAL WISDOM EXPLORER',subtitle:'THE BEGINNING',difficulty:'⭐ EXPLORER • BASIC',missions:[
   {name:'THE FIRST CLUE',type:'mcq',question:'Manakah pasangan kearifan lokal dan daerah asal yang tepat?',options:['A. Subak — Bali','B. Sasi — Jawa Barat','C. Awig-awig — Sumatera Barat','D. Mapalus — Papua'],answer:'A',score:10,explanation:'Subak merupakan sistem pengairan tradisional yang berkembang di Bali.'},
   {name:'VALUE FINDER',type:'mcq',question:'Nilai utama yang paling tampak dalam tradisi gotong royong adalah ...',options:['A. Individualisme','B. Kerja sama dan solidaritas','C. Persaingan bebas','D. Konsumerisme'],answer:'B',score:10,explanation:'Gotong royong menekankan kerja sama dan solidaritas dalam kehidupan masyarakat.'}
  ]},
  {name:'CHANGE CHALLENGE',subtitle:'THE CHALLENGE',difficulty:'⭐⭐ CHALLENGER • INTERMEDIATE',missions:[
   {name:'CHANGE SIGNAL',type:'mcq',question:'Generasi muda mulai jarang mengikuti tradisi lokal karena lebih tertarik pada budaya populer digital. Faktor yang paling berkaitan dengan kondisi tersebut adalah ...',options:['A. Perubahan gaya hidup dan arus informasi global','B. Letak geografis semata','C. Bertambahnya hasil pertanian','D. Menurunnya jumlah sekolah'],answer:'A',score:15,explanation:'Arus informasi global dan perubahan gaya hidup dapat menggeser pola minat generasi muda.'},
   {name:'CAUSE & IMPACT',type:'mcq',question:'Jika praktik kearifan lokal semakin jarang dilakukan, dampak yang paling mungkin terjadi adalah ...',options:['A. Identitas budaya lokal makin kuat tanpa upaya apa pun','B. Pengetahuan lokal berisiko hilang antargenerasi','C. Semua teknologi otomatis berhenti digunakan','D. Tidak ada perubahan sosial'],answer:'B',score:15,explanation:'Ketika praktik tidak diwariskan, pengetahuan dan makna budaya dapat terputus antargenerasi.'}
  ]},
  {name:'HERITAGE RESCUE',subtitle:'THE FINAL QUEST',difficulty:'⭐⭐⭐ MASTER • ADVANCED',missions:[
   {name:'RESCUE ANALYSIS',type:'mcq',question:'Sebuah tradisi lokal mulai ditinggalkan karena dianggap tidak relevan. Strategi paling tepat untuk menjaga keberlanjutannya adalah ...',options:['A. Melarang seluruh budaya baru','B. Membiarkannya tanpa dokumentasi','C. Mengadaptasi cara penyampaian tanpa menghilangkan nilai inti','D. Mengganti seluruh unsur tradisi dengan tren global'],answer:'C',score:20,explanation:'Pelestarian dapat dilakukan melalui adaptasi media dan cara penyampaian sambil menjaga nilai inti tradisi.'},
   {name:'FINAL ACTION PLAN',type:'structured',question:'Analisis kasus berikut: tradisi lokal mulai ditinggalkan akibat perubahan gaya hidup dan perkembangan teknologi. Pilih kombinasi paling tepat untuk lima komponen analisis.',options:['IDENTIFY','CAUSE','IMPACT','SOLUTION','ACTION'],answer:'B|C|A|D|B',score:20,explanation:'Validasi menggunakan kombinasi jawaban terstruktur: masalah, penyebab, dampak, solusi, dan aksi.'}
  ]}
 ]
};
function deepClone(x){return JSON.parse(JSON.stringify(x))}
function loadJSON(k,fallback){try{const v=JSON.parse(localStorage.getItem(k));return v??fallback}catch{return fallback}}
let config=loadJSON('mb_config',deepClone(DEFAULT_CONFIG));
let students=loadJSON('mb_students',[]);
let run=loadJSON('mb_run',null);
let moveAnimation=null;
function newRun(){return {missionIndex:0,started:false,gameComplete:false,teams:config.teams.map((n,i)=>({name:n,progress:0,score:0,roundScores:[0,0,0],flash:0,answers:[],lastCorrect:false})),drafts:Array(6).fill(null),locked:Array(6).fill(false),revealed:false,pendingMoves:Array(6).fill(false)}}
if(!run||!run.teams||run.teams.length!==6) run=newRun();
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function saveRun(){localStorage.setItem('mb_run',JSON.stringify(run))} function saveConfig(){localStorage.setItem('mb_config',JSON.stringify(config))} function saveStudents(){localStorage.setItem('mb_students',JSON.stringify(students))}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function go(page){$$('.page').forEach(p=>p.classList.remove('active'));const p=$('#page-'+page);if(p)p.classList.add('active');$$('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.go===page));if(page==='board')renderBoard();if(page==='setup')renderSetup();if(page==='pretest')renderTest('pre');if(page==='posttest')renderTest('post');if(page==='scoreboard')renderScoreboard();if(page==='evaluation')renderEvaluation();window.scrollTo({top:0,behavior:'smooth'})}
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
function missionAt(i=run.missionIndex){const r=Math.floor(i/2),m=i%2;return {round:config.rounds[r],mission:config.rounds[r].missions[m],r,m}}
function progressLabel(p){const labels=['START','Round 1 • CP 1','Round 1 • CP 2','Round 2 • CP 1','Round 2 • CP 2','Round 3 • CP 1','Round 3 • CP 2'];return labels[Math.max(0,Math.min(6,p))]}
function renderSetup(){
 $('#cfgGameName').value=config.gameName;$('#cfgSubject').value=config.subject;$('#cfgClass').value=config.className;$('#cfgTopic').value=config.topic;$('#cfgObjective').value=config.objective;
 $('#teamNameInputs').innerHTML=config.teams.map((t,i)=>`<div class="field"><label class="label">Kelompok ${i+1}</label><input class="team-name-cfg" data-i="${i}" value="${esc(t)}"></div>`).join('');
 $('#missionEditors').innerHTML=config.rounds.map((r,ri)=>`<div class="card round-editor"><div class="eyebrow">ROUND ${ri+1}</div><div class="field"><label class="label">Nama Round</label><input class="round-name" data-r="${ri}" value="${esc(r.name)}"></div><div class="field"><label class="label">Label tingkat</label><input class="round-diff" data-r="${ri}" value="${esc(r.difficulty)}"></div>${r.missions.map((m,mi)=>`<details class="mission-editor" open><summary>Mission ${mi+1} — ${esc(m.name)}</summary><div class="field" style="margin-top:12px"><label class="label">Nama Misi</label><input class="m-name" data-r="${ri}" data-m="${mi}" value="${esc(m.name)}"></div><div class="field"><label class="label">Jenis Soal</label><select class="m-type" data-r="${ri}" data-m="${mi}"><option value="mcq" ${m.type==='mcq'?'selected':''}>Pilihan Ganda</option><option value="truefalse" ${m.type==='truefalse'?'selected':''}>Benar / Salah</option><option value="structured" ${m.type==='structured'?'selected':''}>Analisis Terstruktur 5 Komponen</option></select></div><div class="field"><label class="label">Soal / Kasus</label><textarea class="m-question" data-r="${ri}" data-m="${mi}">${esc(m.question)}</textarea></div><div class="field"><label class="label">Pilihan / Label (pisahkan dengan |)</label><textarea class="m-options" data-r="${ri}" data-m="${mi}">${esc(m.options.join('|'))}</textarea></div><div class="grid two"><div class="field"><label class="label">Kunci</label><input class="m-answer" data-r="${ri}" data-m="${mi}" value="${esc(m.answer)}"></div><div class="field"><label class="label">Skor</label><input type="number" min="0" class="m-score" data-r="${ri}" data-m="${mi}" value="${m.score}"></div></div><div class="field"><label class="label">Feedback / Penjelasan</label><textarea class="m-expl" data-r="${ri}" data-m="${mi}">${esc(m.explanation||'')}</textarea></div></details>`).join('')}</div>`).join('');
}
function esc(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
$('#saveConfigBtn').addEventListener('click',()=>{
 config.gameName=$('#cfgGameName').value.trim()||'Mission Board';config.subject=$('#cfgSubject').value.trim();config.className=$('#cfgClass').value.trim();config.topic=$('#cfgTopic').value.trim();config.objective=$('#cfgObjective').value.trim();
 $$('.team-name-cfg').forEach(x=>config.teams[+x.dataset.i]=x.value.trim()||`Kelompok ${+x.dataset.i+1}`);
 $$('.round-name').forEach(x=>config.rounds[+x.dataset.r].name=x.value.trim());$$('.round-diff').forEach(x=>config.rounds[+x.dataset.r].difficulty=x.value.trim());
 for(let r=0;r<3;r++)for(let m=0;m<2;m++){const q=config.rounds[r].missions[m];q.name=$(`.m-name[data-r="${r}"][data-m="${m}"]`).value.trim();q.type=$(`.m-type[data-r="${r}"][data-m="${m}"]`).value;q.question=$(`.m-question[data-r="${r}"][data-m="${m}"]`).value.trim();q.options=$(`.m-options[data-r="${r}"][data-m="${m}"]`).value.split('|').map(v=>v.trim()).filter(Boolean);q.answer=$(`.m-answer[data-r="${r}"][data-m="${m}"]`).value.trim().toUpperCase();q.score=+$(`.m-score[data-r="${r}"][data-m="${m}"]`).value||0;q.explanation=$(`.m-expl[data-r="${r}"][data-m="${m}"]`).value.trim()}
 saveConfig();run=newRun();saveRun();toast('Pengaturan disimpan. Run baru siap dimainkan.');
});
$('#resetConfigBtn').addEventListener('click',()=>{config=deepClone(DEFAULT_CONFIG);saveConfig();run=newRun();saveRun();renderSetup();toast('Konfigurasi dikembalikan ke default.')});
function renderTest(kind){if(students.length===0)students=Array.from({length:6},(_,i)=>({name:'',group:`Kelompok ${(i%6)+1}`,pre:'',post:''}));const body=$(kind==='pre'?'#preBody':'#postBody');body.innerHTML=students.map((s,i)=>`<tr><td>${i+1}</td><td><input data-i="${i}" class="stu-name" value="${esc(s.name)}"></td><td><input data-i="${i}" class="stu-${kind}" type="number" min="0" max="100" value="${esc(s[kind])}"></td><td><input data-i="${i}" class="stu-group" value="${esc(s.group)}"></td><td><button class="btn danger remove-stu" data-i="${i}" style="padding:8px 10px">Hapus</button></td></tr>`).join('');$$('.remove-stu').forEach(b=>b.onclick=()=>{syncStudents(kind);students.splice(+b.dataset.i,1);saveStudents();renderTest(kind)})}
function syncStudents(kind){$$('.stu-name').forEach(x=>students[+x.dataset.i].name=x.value);$$(`.stu-${kind}`).forEach(x=>students[+x.dataset.i][kind]=x.value);$$('.stu-group').forEach(x=>students[+x.dataset.i].group=x.value)}
function addStudent(kind){syncStudents(kind);students.push({name:'',group:'Kelompok 1',pre:'',post:''});renderTest(kind)}
$('#addStudentPre').onclick=()=>addStudent('pre');$('#addStudentPost').onclick=()=>addStudent('post');$('#savePre').onclick=()=>{syncStudents('pre');saveStudents();toast('Data pre-test tersimpan.')};$('#savePost').onclick=()=>{syncStudents('post');saveStudents();toast('Data post-test tersimpan.')};
const BOARD_SLOT_X={cp1:[31.1,34.9,38.7,42.5,46.3,50.1],cp2:[62.3,66.1,69.9,73.7,77.5,81.3]};
const BOARD_ROW_Y=[34.0,56.5,79.0];
const BOARD_START=[{x:7.7,y:31.8},{x:10.0,y:31.2},{x:12.3,y:31.8},{x:7.7,y:35.0},{x:10.0,y:35.7},{x:12.3,y:35.0}];
function pawnPosition(progress,teamIndex){
 if(progress<=0)return BOARD_START[teamIndex]||BOARD_START[0];
 const idx=Math.max(1,Math.min(6,progress))-1;
 const row=Math.floor(idx/2),cp=(idx%2===0?'cp1':'cp2');
 return {x:BOARD_SLOT_X[cp][teamIndex],y:BOARD_ROW_Y[row]};
}
