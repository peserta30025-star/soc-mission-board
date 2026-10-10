import { auth, TEACHER_UID, teacherConfigRef, get, update } from './firebase-core.js';

const STORAGE_KEY='mb_config_v4_digital_society';
const VERSION='question_rules_smp_20261010_v2';
const VIDEO_SRC='https://drive.google.com/file/d/1CaxrhuVf8C_qMxjxAAIwzJdO3mTu8Hey/preview';

const ROUNDS=[
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
          name:'NETWORK CHECK', type:'true-false', score:10, cognitiveLevel:'LOTS',
          instruction:'Tentukan apakah pernyataan berikut benar atau salah.',
          question:'Dalam masyarakat jaringan, interaksi sosial dapat berlangsung melampaui batas tempat karena didukung teknologi informasi dan komunikasi.',
          options:['BENAR','SALAH'],
          answer:'BENAR',
          explanation:'Pernyataan benar. Teknologi informasi dan komunikasi memungkinkan orang berinteraksi dan bertukar informasi meskipun berada di lokasi yang berbeda.'
        },
        {
          name:'MATCH THE NETWORK', type:'matching', score:10, cognitiveLevel:'LOTS',
          instruction:'Cocokkan setiap karakteristik dengan contoh yang paling tepat. Setiap pilihan digunakan satu kali.',
          question:'Cocokkan karakteristik masyarakat jaringan berikut dengan contohnya.',
          options:['1. Terhubung melalui jaringan','2. Informasi bergerak cepat','3. Kerja sama tidak dibatasi lokasi'],
          matchOptions:['A. Pengumuman kegiatan sekolah diterima seluruh kelas melalui grup dalam beberapa menit','B. Siswa di dua kota menyunting dokumen daring yang sama','C. Anggota komunitas berkomunikasi melalui platform digital'],
          answer:['C','A','B'],
          explanation:'Terhubung melalui jaringan ditunjukkan oleh komunikasi melalui platform digital; informasi bergerak cepat ditunjukkan oleh penyebaran pengumuman dalam beberapa menit; kerja sama lintas lokasi ditunjukkan oleh penyuntingan dokumen daring bersama.'
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
          name:'DIGITAL INTERACTION SIGNALS', type:'multiple-response', score:15, cognitiveLevel:'MOTS',
          instruction:'Pilih DUA jawaban yang tepat.',
          question:'Dua ciri yang menunjukkan interaksi digital adalah ...',
          options:['A. Informasi dapat dikirim kepada banyak orang dalam waktu singkat','B. Interaksi hanya dapat terjadi jika semua orang berada di tempat yang sama','C. Komunikasi dapat berlangsung pada waktu yang sama atau berbeda','D. Informasi digital selalu benar karena dapat diakses banyak orang'],
          answer:['A','C'],
          explanation:'Interaksi digital memungkinkan penyebaran informasi secara cepat dan komunikasi sinkron maupun tidak sinkron. Interaksi tidak harus terjadi di tempat yang sama, dan informasi digital tetap perlu diperiksa kebenarannya.'
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
          name:'MATCH THE PRINCIPLE', type:'matching', score:20, cognitiveLevel:'MOTS',
          instruction:'Cocokkan setiap tindakan dengan prinsip yang paling sesuai. Setiap pilihan digunakan satu kali.',
          question:'Berdasarkan video, cocokkan tindakan berikut dengan prinsip Respect, Educate, dan Protect.',
          options:['1. Tidak menuduh seseorang sebelum informasi terbukti','2. Memeriksa sumber dan konteks sebelum percaya atau membagikan','3. Menghentikan penyebaran konten yang belum terverifikasi'],
          matchOptions:['A. Respect','B. Educate','C. Protect'],
          answer:['A','B','C'],
          explanation:'Respect berarti menghargai orang lain dan tidak menuduh tanpa dasar. Educate berarti memeriksa sumber dan konteks. Protect berarti mencegah penyebaran informasi yang dapat merugikan diri sendiri atau orang lain.'
        },
        {
          name:'RESPONS PALING BERTANGGUNG JAWAB', type:'multiple-response', score:20, cognitiveLevel:'HOTS',
          instruction:'Pilih DUA jawaban yang paling tepat.',
          question:'Seorang teman mengirim cuplikan viral ke grup kelas, tetapi sumber dan konteksnya belum jelas. Dua tindakan yang paling bertanggung jawab adalah ...',
          options:['A. Menahan diri untuk tidak meneruskan cuplikan tersebut','B. Memeriksa sumber asli dan membandingkannya dengan informasi tepercaya','C. Membagikannya kembali dengan catatan bahwa informasinya belum pasti','D. Menyimpannya lalu mengirimkannya secara pribadi kepada teman dekat'],
          answer:['A','B'],
          explanation:'Tindakan yang bertanggung jawab adalah tidak ikut menyebarkan informasi yang belum jelas serta melakukan verifikasi melalui sumber asli dan sumber tepercaya. Membagikan ulang, meskipun disertai catatan, tetap dapat memperluas penyebaran informasi yang belum terverifikasi.'
        }
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
