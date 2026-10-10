import { auth, TEACHER_UID, teacherConfigRef, get, update } from './firebase-core.js';

const STORAGE_KEY='mb_config_v4_digital_society';
const VERSION='question_rules_smp_20261010_v1';
const VIDEO_SRC='https://drive.google.com/file/d/1CaxrhuVf8C_qMxjxAAIwzJdO3mTu8Hey/preview';

const ROUNDS=[
  {
    name:'ENTER THE NETWORK',
    focus:'Masyarakat Jaringan / Network Society',
    difficulty:'🟢 LEVEL 1 • LOTS — UNDERSTAND & IDENTIFY',
    questions:[
      {name:'CIRI MASYARAKAT JARINGAN',type:'single-choice',score:10,cognitiveLevel:'LOTS',question:'Kelas IX menggunakan grup pesan, dokumen daring, dan panggilan video untuk bekerja sama dengan siswa dari sekolah lain. Ciri masyarakat jaringan yang paling tampak pada situasi tersebut adalah ...',options:['A. Interaksi sosial hanya berlangsung melalui pertemuan langsung','B. Interaksi sosial terhubung melalui jaringan komunikasi digital','C. Interaksi sosial berlangsung tanpa pertukaran informasi','D. Interaksi sosial berpusat pada kegiatan individu tanpa jaringan'],answer:'B',explanation:'Masyarakat jaringan ditandai oleh hubungan sosial yang terhubung melalui jaringan informasi dan komunikasi. Teknologi memungkinkan kerja sama tetap berlangsung meskipun orang berada di tempat yang berbeda.'},
      {name:'ARUS INFORMASI',type:'single-choice',score:10,cognitiveLevel:'LOTS',question:'Pernyataan yang paling tepat menggambarkan masyarakat jaringan adalah ...',options:['A. Hubungan masyarakat dibatasi oleh kedekatan wilayah tempat tinggal','B. Arus informasi dan interaksi dapat melintasi ruang melalui teknologi','C. Komunikasi digital menggantikan seluruh bentuk interaksi langsung','D. Informasi di jaringan digital selalu dapat dipercaya tanpa pemeriksaan'],answer:'B',explanation:'Dalam masyarakat jaringan, informasi dan interaksi dapat bergerak melampaui batas ruang dengan bantuan teknologi. Namun, interaksi langsung tetap ada dan informasi digital tetap perlu diperiksa.'},
      {name:'CONTOH KERJA SAMA JARINGAN',type:'single-choice',score:10,cognitiveLevel:'LOTS',question:'Kegiatan yang paling tepat menunjukkan kerja sama dalam masyarakat jaringan adalah ...',options:['A. Seorang siswa mengerjakan tugas sendiri tanpa berkomunikasi','B. Siswa membaca sumber belajar secara mandiri di perpustakaan','C. Siswa dari dua kota menyunting dokumen yang sama secara daring','D. Siswa mengumpulkan tugas cetak kepada guru setelah pelajaran'],answer:'C',explanation:'Kerja sama dalam masyarakat jaringan terlihat ketika orang yang berada di lokasi berbeda dapat berkolaborasi melalui jaringan digital.'}
    ]
  },
  {
    name:'DIGITAL INTERACTION',
    focus:'Interaksi masyarakat di dunia nyata dan dunia digital',
    difficulty:'🟠 LEVEL 2 • MOTS — APPLY & ANALYZE',
    questions:[
      {name:'KOMUNIKASI YANG JELAS',type:'single-choice',score:15,cognitiveLevel:'MOTS',question:'Raka salah memahami pesan singkat dari temannya karena tidak melihat ekspresi dan nada bicara. Tindakan yang paling tepat agar komunikasi digital berikutnya lebih jelas adalah ...',options:['A. Menulis pesan dengan jelas lalu memastikan penerima memahaminya','B. Menghindari semua komunikasi digital dan hanya bertemu langsung','C. Mengirim lebih banyak pesan tanpa menunggu tanggapan penerima','D. Menggunakan singkatan sebanyak mungkin agar pesan lebih cepat dikirim'],answer:'A',explanation:'Komunikasi digital memiliki keterbatasan petunjuk nonverbal. Pesan yang jelas dan konfirmasi pemahaman dapat mengurangi salah tafsir.'},
      {name:'MEMADUKAN INTERAKSI',type:'single-choice',score:15,cognitiveLevel:'MOTS',question:'Kelompok Dina membahas keputusan penting saat bertemu di kelas, lalu menggunakan grup pesan untuk membagi tugas dan mengirim hasil kerja. Alasan penggunaan kedua bentuk interaksi tersebut tepat adalah ...',options:['A. Interaksi langsung dan digital dapat saling melengkapi sesuai kebutuhan','B. Interaksi digital selalu lebih efektif daripada pertemuan langsung','C. Interaksi langsung hanya diperlukan jika jaringan internet tidak tersedia','D. Interaksi digital membuat kesepakatan kelompok tidak lagi diperlukan'],answer:'A',explanation:'Interaksi langsung membantu penjelasan dan kesepakatan, sedangkan interaksi digital memudahkan koordinasi dan dokumentasi. Keduanya dapat digunakan sesuai kebutuhan.'},
      {name:'CEK INFORMASI GRUP',type:'single-choice',score:15,cognitiveLevel:'MOTS',question:'Informasi jadwal kegiatan di grup kelas berubah setelah beberapa kali diteruskan. Tindakan yang paling tepat sebelum membagikan informasi tersebut adalah ...',options:['A. Membagikan versi yang paling baru karena terlihat lebih meyakinkan','B. Memeriksa pesan sumber dan mengonfirmasi informasi kepada pihak terkait','C. Menunggu sampai banyak teman membagikan informasi yang sama','D. Menghapus semua pesan agar tidak ada informasi yang beredar di grup'],answer:'B',explanation:'Sebelum meneruskan informasi, siswa perlu memeriksa sumber awal dan mengonfirmasi kepada pihak yang berwenang agar tidak menyebarkan informasi yang keliru.'}
    ]
  },
  {
    name:'DIGITAL RESPONSIBILITY',
    focus:'Literasi digital, hoaks, dan tanggung jawab bermedia • Respect • Educate • Protect',
    difficulty:'🟣 LEVEL 3 • MOTS–HOTS — ANALYZE, EVALUATE & DECIDE',
    videoCase:true,
    questions:[
      {name:'VERIFY BEFORE SHARE',type:'single-choice',score:20,cognitiveLevel:'MOTS',instruction:'Tonton video “Berita Nyata” pada layar guru, lalu jawab berdasarkan informasi yang ditampilkan.',question:'Dalam video, sebuah cuplikan viral dibagikan bersama klaim tertentu. Sebelum meneruskan cuplikan serupa, tindakan yang paling tepat adalah ...',options:['A. Membagikannya segera agar teman menerima informasi lebih cepat','B. Memeriksa sumber, konteks, dan pembanding tepercaya sebelum membagikan','C. Menambahkan pendapat pribadi agar isi unggahan lebih menarik','D. Mengirimkannya hanya kepada teman dekat tanpa memeriksa informasi'],answer:'B',explanation:'Informasi yang viral belum tentu benar. Sebelum membagikan, kita perlu memeriksa sumber asli, memahami konteks, dan membandingkannya dengan sumber tepercaya.'},
      {name:'RESPONS YANG BERTANGGUNG JAWAB',type:'single-choice',score:20,cognitiveLevel:'HOTS',instruction:'Gunakan kasus dalam video untuk menilai tindakan yang paling bertanggung jawab.',question:'Seorang teman mengunggah cuplikan dari video dengan tuduhan terhadap seseorang, tetapi belum ada sumber tepercaya yang mendukung tuduhan tersebut. Respons yang paling bertanggung jawab adalah ...',options:['A. Ikut memberi komentar agar unggahan segera mendapat perhatian','B. Meminta penyebaran dihentikan dan mengajak teman memeriksa kebenarannya','C. Membagikan ulang dengan catatan bahwa informasinya mungkin belum benar','D. Menyimpan cuplikan lalu mengirimkannya secara pribadi kepada teman lain'],answer:'B',explanation:'Tindakan yang bertanggung jawab adalah menghentikan penyebaran informasi yang belum terverifikasi dan mengajak orang lain memeriksa kebenarannya. Ini mencerminkan sikap Respect, Educate, dan Protect.'},
      {name:'ATURAN BERBAGI INFORMASI',type:'single-choice',score:20,cognitiveLevel:'HOTS',instruction:'Nilai pilihan aturan berdasarkan pelajaran dari video.',question:'Sekolah ingin membuat aturan berbagi informasi di grup kelas berdasarkan pelajaran dari video. Aturan yang paling efektif adalah ...',options:['A. Informasi populer boleh dibagikan jika sudah dibahas oleh banyak akun','B. Informasi dibagikan setelah sumber, konteks, dan dampaknya diperiksa','C. Informasi dari internet hanya boleh dibagikan oleh ketua kelas','D. Informasi yang diteruskan oleh teman dianggap cukup dapat dipercaya'],answer:'B',explanation:'Aturan yang baik tidak bergantung pada popularitas atau siapa yang membagikan. Informasi perlu diperiksa sumber, konteks, kebenaran, dan dampaknya sebelum diteruskan.'}
    ]
  }
];

function keys(rounds){
  const out={};
  rounds.forEach((r,ri)=>r.questions.forEach((q,qi)=>out[`r${ri+1}q${qi+1}`]=q.answer));
  return out;
}

function readLocal(){
  try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');}catch{return null;}
}

async function migrate(){
  if(typeof auth.authStateReady==='function') await auth.authStateReady();
  if(auth.currentUser?.uid!==TEACHER_UID) return false;

  const remoteSnap=await get(teacherConfigRef('gameConfig'));
  const base=remoteSnap.exists()?remoteSnap.val():(readLocal()||{});
  if(base?.contentVersion===VERSION) return false;

  const next={...base,
    videoSrc:VIDEO_SRC,
    videoPoster:'assets/video/digital-case-poster.svg',
    contentVersion:VERSION,
    rounds:ROUNDS
  };
  localStorage.setItem(STORAGE_KEY,JSON.stringify(next));
  await update(teacherConfigRef(),{
    gameConfig:next,
    answerKeys:keys(ROUNDS),
    gameConfigUpdatedAt:Date.now()
  });
  return true;
}

const create=document.querySelector('#createSessionBtn');
if(create) create.disabled=true;

migrate().then(changed=>{
  if(create) create.disabled=false;
  if(changed && document.querySelector('#page-setup')){
    const k='soc_question_rules_reload_'+VERSION;
    if(sessionStorage.getItem(k)!=='1'){
      sessionStorage.setItem(k,'1');
      location.reload();
    }
  }
}).catch(err=>{
  if(create) create.disabled=false;
  console.error('Question rules migration failed',err);
});
