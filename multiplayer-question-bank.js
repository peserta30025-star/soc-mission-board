export const TEAM_COLORS = ['#4aa3ff','#56df9b','#ffd166','#ff6b6b','#b990ff','#ff9f43'];

export const QUESTION_BANK = [
  {
    round:1, roundName:'ENTER THE NETWORK', focus:'Masyarakat Jaringan / Network Society', level:'LOTS — UNDERSTAND & IDENTIFY',
    questions:[
      {id:'r1q1',name:'CIRI MASYARAKAT JARINGAN',type:'single-choice',score:10,cognitiveLevel:'LOTS',question:'Kelas IX menggunakan grup pesan, dokumen daring, dan panggilan video untuk bekerja sama dengan siswa dari sekolah lain. Ciri masyarakat jaringan yang paling tampak pada situasi tersebut adalah ...',options:['A. Interaksi sosial hanya berlangsung melalui pertemuan langsung','B. Interaksi sosial terhubung melalui jaringan komunikasi digital','C. Interaksi sosial berlangsung tanpa pertukaran informasi','D. Interaksi sosial berpusat pada kegiatan individu tanpa jaringan'],answer:'B',explanation:'Masyarakat jaringan ditandai oleh hubungan sosial yang terhubung melalui jaringan informasi dan komunikasi. Teknologi memungkinkan kerja sama tetap berlangsung meskipun orang berada di tempat yang berbeda.'},
      {id:'r1q2',name:'ARUS INFORMASI',type:'single-choice',score:10,cognitiveLevel:'LOTS',question:'Pernyataan yang paling tepat menggambarkan masyarakat jaringan adalah ...',options:['A. Hubungan masyarakat dibatasi oleh kedekatan wilayah tempat tinggal','B. Arus informasi dan interaksi dapat melintasi ruang melalui teknologi','C. Komunikasi digital menggantikan seluruh bentuk interaksi langsung','D. Informasi di jaringan digital selalu dapat dipercaya tanpa pemeriksaan'],answer:'B',explanation:'Dalam masyarakat jaringan, informasi dan interaksi dapat bergerak melampaui batas ruang dengan bantuan teknologi. Namun, interaksi langsung tetap ada dan informasi digital tetap perlu diperiksa.'},
      {id:'r1q3',name:'CONTOH KERJA SAMA JARINGAN',type:'single-choice',score:10,cognitiveLevel:'LOTS',question:'Kegiatan yang paling tepat menunjukkan kerja sama dalam masyarakat jaringan adalah ...',options:['A. Seorang siswa mengerjakan tugas sendiri tanpa berkomunikasi','B. Siswa membaca sumber belajar secara mandiri di perpustakaan','C. Siswa dari dua kota menyunting dokumen yang sama secara daring','D. Siswa mengumpulkan tugas cetak kepada guru setelah pelajaran'],answer:'C',explanation:'Kerja sama dalam masyarakat jaringan terlihat ketika orang yang berada di lokasi berbeda dapat berkolaborasi melalui jaringan digital.'}
    ]
  },
  {
    round:2, roundName:'DIGITAL INTERACTION', focus:'Interaksi masyarakat di dunia nyata dan dunia digital', level:'MOTS — APPLY & ANALYZE',
    questions:[
      {id:'r2q1',name:'KOMUNIKASI YANG JELAS',type:'single-choice',score:15,cognitiveLevel:'MOTS',question:'Raka salah memahami pesan singkat dari temannya karena tidak melihat ekspresi dan nada bicara. Tindakan yang paling tepat agar komunikasi digital berikutnya lebih jelas adalah ...',options:['A. Menulis pesan dengan jelas lalu memastikan penerima memahaminya','B. Menghindari semua komunikasi digital dan hanya bertemu langsung','C. Mengirim lebih banyak pesan tanpa menunggu tanggapan penerima','D. Menggunakan singkatan sebanyak mungkin agar pesan lebih cepat dikirim'],answer:'A',explanation:'Komunikasi digital memiliki keterbatasan petunjuk nonverbal. Pesan yang jelas dan konfirmasi pemahaman dapat mengurangi salah tafsir.'},
      {id:'r2q2',name:'MEMADUKAN INTERAKSI',type:'single-choice',score:15,cognitiveLevel:'MOTS',question:'Kelompok Dina membahas keputusan penting saat bertemu di kelas, lalu menggunakan grup pesan untuk membagi tugas dan mengirim hasil kerja. Alasan penggunaan kedua bentuk interaksi tersebut tepat adalah ...',options:['A. Interaksi langsung dan digital dapat saling melengkapi sesuai kebutuhan','B. Interaksi digital selalu lebih efektif daripada pertemuan langsung','C. Interaksi langsung hanya diperlukan jika jaringan internet tidak tersedia','D. Interaksi digital membuat kesepakatan kelompok tidak lagi diperlukan'],answer:'A',explanation:'Interaksi langsung membantu penjelasan dan kesepakatan, sedangkan interaksi digital memudahkan koordinasi dan dokumentasi. Keduanya dapat digunakan sesuai kebutuhan.'},
      {id:'r2q3',name:'CEK INFORMASI GRUP',type:'single-choice',score:15,cognitiveLevel:'MOTS',question:'Informasi jadwal kegiatan di grup kelas berubah setelah beberapa kali diteruskan. Tindakan yang paling tepat sebelum membagikan informasi tersebut adalah ...',options:['A. Membagikan versi yang paling baru karena terlihat lebih meyakinkan','B. Memeriksa pesan sumber dan mengonfirmasi informasi kepada pihak terkait','C. Menunggu sampai banyak teman membagikan informasi yang sama','D. Menghapus semua pesan agar tidak ada informasi yang beredar di grup'],answer:'B',explanation:'Sebelum meneruskan informasi, siswa perlu memeriksa sumber awal dan mengonfirmasi kepada pihak yang berwenang agar tidak menyebarkan informasi yang keliru.'}
    ]
  },
  {
    round:3, roundName:'DIGITAL RESPONSIBILITY', focus:'Literasi digital, hoaks, dan tanggung jawab bermedia • Respect • Educate • Protect', level:'MOTS–HOTS — ANALYZE, EVALUATE & DECIDE', videoCase:true,
    questions:[
      {id:'r3q1',name:'VERIFY BEFORE SHARE',type:'single-choice',score:20,cognitiveLevel:'MOTS',instruction:'Tonton video “Berita Nyata” pada layar guru, lalu jawab berdasarkan informasi yang ditampilkan.',question:'Dalam video, sebuah cuplikan viral dibagikan bersama klaim tertentu. Sebelum meneruskan cuplikan serupa, tindakan yang paling tepat adalah ...',options:['A. Membagikannya segera agar teman menerima informasi lebih cepat','B. Memeriksa sumber, konteks, dan pembanding tepercaya sebelum membagikan','C. Menambahkan pendapat pribadi agar isi unggahan lebih menarik','D. Mengirimkannya hanya kepada teman dekat tanpa memeriksa informasi'],answer:'B',explanation:'Informasi yang viral belum tentu benar. Sebelum membagikan, kita perlu memeriksa sumber asli, memahami konteks, dan membandingkannya dengan sumber tepercaya.'},
      {id:'r3q2',name:'RESPONS YANG BERTANGGUNG JAWAB',type:'single-choice',score:20,cognitiveLevel:'HOTS',instruction:'Gunakan kasus dalam video untuk menilai tindakan yang paling bertanggung jawab.',question:'Seorang teman mengunggah cuplikan dari video dengan tuduhan terhadap seseorang, tetapi belum ada sumber tepercaya yang mendukung tuduhan tersebut. Respons yang paling bertanggung jawab adalah ...',options:['A. Ikut memberi komentar agar unggahan segera mendapat perhatian','B. Meminta penyebaran dihentikan dan mengajak teman memeriksa kebenarannya','C. Membagikan ulang dengan catatan bahwa informasinya mungkin belum benar','D. Menyimpan cuplikan lalu mengirimkannya secara pribadi kepada teman lain'],answer:'B',explanation:'Tindakan yang bertanggung jawab adalah menghentikan penyebaran informasi yang belum terverifikasi dan mengajak orang lain memeriksa kebenarannya. Ini mencerminkan sikap Respect, Educate, dan Protect.'},
      {id:'r3q3',name:'ATURAN BERBAGI INFORMASI',type:'single-choice',score:20,cognitiveLevel:'HOTS',instruction:'Nilai pilihan aturan berdasarkan pelajaran dari video.',question:'Sekolah ingin membuat aturan berbagi informasi di grup kelas berdasarkan pelajaran dari video. Aturan yang paling efektif adalah ...',options:['A. Informasi populer boleh dibagikan jika sudah dibahas oleh banyak akun','B. Informasi dibagikan setelah sumber, konteks, dan dampaknya diperiksa','C. Informasi dari internet hanya boleh dibagikan oleh ketua kelas','D. Informasi yang diteruskan oleh teman dianggap cukup dapat dipercaya'],answer:'B',explanation:'Aturan yang baik tidak bergantung pada popularitas atau siapa yang membagikan. Informasi perlu diperiksa sumber, konteks, kebenaran, dan dampaknya sebelum diteruskan.'}
    ]
  }
];

export function flattenQuestions() {
  return QUESTION_BANK.flatMap((round) => round.questions.map((q, index) => ({
    ...q,
    round: round.round,
    roundName: round.roundName,
    focus: round.focus,
    level: round.level,
    questionInRound: index + 1
  })));
}

export function getQuestion(roundIndex, questionIndex) {
  return QUESTION_BANK?.[roundIndex]?.questions?.[questionIndex] || null;
}
