export const TEAM_COLORS = ['#4aa3ff','#56df9b','#ffd166','#ff6b6b','#b990ff','#ff9f43'];

export const QUESTION_BANK = [
    {
      round:1, roundName:'ENTER THE NETWORK',
      focus:'Masyarakat Jaringan / Network Society',
      level:'🟢 LEVEL 1 • LOTS — UNDERSTAND & IDENTIFY',
      questions:[
        {
          id:'r1q1', name:'CIRI MASYARAKAT JARINGAN', type:'single-choice', score:10, cognitiveLevel:'LOTS',
          question:'Kelas IX menggunakan grup pesan, dokumen daring, dan panggilan video untuk bekerja sama dengan siswa dari sekolah lain. Ciri masyarakat jaringan yang paling tampak pada situasi tersebut adalah ...',
          options:['A. Interaksi sosial hanya berlangsung melalui pertemuan langsung','B. Interaksi sosial terhubung melalui jaringan komunikasi digital','C. Interaksi sosial berlangsung tanpa pertukaran informasi','D. Interaksi sosial berpusat pada kegiatan individu tanpa jaringan'],
          answer:'B',
          explanation:'Masyarakat jaringan ditandai oleh hubungan sosial yang terhubung melalui jaringan informasi dan komunikasi. Teknologi memungkinkan kerja sama tetap berlangsung meskipun orang berada di tempat yang berbeda.'
        },
        {
          id:'r1q2', name:'NETWORK CHECK', type:'true-false', score:10, cognitiveLevel:'LOTS',
          instruction:'Tentukan apakah pernyataan berikut benar atau salah.',
          question:'Dalam masyarakat jaringan, interaksi sosial dapat berlangsung melampaui batas tempat karena didukung teknologi informasi dan komunikasi.',
          options:['BENAR','SALAH'],
          answer:'BENAR',
          explanation:'Pernyataan benar. Teknologi informasi dan komunikasi memungkinkan orang berinteraksi dan bertukar informasi meskipun berada di lokasi yang berbeda.'
        },
        {
          id:'r1q3', name:'MATCH THE NETWORK', type:'matching', score:10, cognitiveLevel:'LOTS',
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
      round:2, roundName:'DIGITAL INTERACTION',
      focus:'Interaksi masyarakat di dunia nyata dan dunia digital',
      level:'🟠 LEVEL 2 • MOTS — APPLY & ANALYZE',
      questions:[
        {
          id:'r2q1', name:'KOMUNIKASI YANG JELAS', type:'single-choice', score:15, cognitiveLevel:'MOTS',
          question:'Raka salah memahami pesan singkat dari temannya karena tidak melihat ekspresi dan nada bicara. Tindakan yang paling tepat agar komunikasi digital berikutnya lebih jelas adalah ...',
          options:['A. Menulis pesan dengan jelas lalu memastikan penerima memahaminya','B. Menghindari semua komunikasi digital dan hanya bertemu langsung','C. Mengirim lebih banyak pesan tanpa menunggu tanggapan penerima','D. Menggunakan singkatan sebanyak mungkin agar pesan lebih cepat dikirim'],
          answer:'A',
          explanation:'Komunikasi digital memiliki keterbatasan petunjuk nonverbal. Pesan yang jelas dan konfirmasi pemahaman dapat mengurangi salah tafsir.'
        },
        {
          id:'r2q2', name:'DIGITAL INTERACTION SIGNALS', type:'multiple-response', score:15, cognitiveLevel:'MOTS', selectionCount:2,
          instruction:'Pilih DUA jawaban yang tepat.',
          question:'Dua ciri yang menunjukkan interaksi digital adalah ...',
          options:['A. Informasi dapat dikirim kepada banyak orang dalam waktu singkat','B. Interaksi hanya dapat terjadi jika semua orang berada di tempat yang sama','C. Komunikasi dapat berlangsung pada waktu yang sama atau berbeda','D. Informasi digital selalu benar karena dapat diakses banyak orang'],
          answer:['A','C'],
          explanation:'Interaksi digital memungkinkan penyebaran informasi secara cepat dan komunikasi sinkron maupun tidak sinkron. Interaksi tidak harus terjadi di tempat yang sama, dan informasi digital tetap perlu diperiksa kebenarannya.'
        },
        {
          id:'r2q3', name:'CEK INFORMASI GRUP', type:'single-choice', score:15, cognitiveLevel:'MOTS',
          question:'Informasi jadwal kegiatan di grup kelas berubah setelah beberapa kali diteruskan. Tindakan yang paling tepat sebelum membagikan informasi tersebut adalah ...',
          options:['A. Membagikan versi yang paling baru karena terlihat lebih meyakinkan','B. Memeriksa pesan sumber dan mengonfirmasi informasi kepada pihak terkait','C. Menunggu sampai banyak teman membagikan informasi yang sama','D. Menghapus semua pesan agar tidak ada informasi yang beredar di grup'],
          answer:'B',
          explanation:'Sebelum meneruskan informasi, siswa perlu memeriksa sumber awal dan mengonfirmasi kepada pihak yang berwenang agar tidak menyebarkan informasi yang keliru.'
        }
      ]
    },
    {
      round:3, roundName:'DIGITAL RESPONSIBILITY',
      focus:'Literasi digital, hoaks, dan tanggung jawab bermedia • Respect • Educate • Protect',
      level:'🟣 LEVEL 3 • MOTS–HOTS — ANALYZE, EVALUATE & DECIDE',
      videoCase:true,
      questions:[
        {
          id:'r3q1', name:'VERIFY BEFORE SHARE', type:'single-choice', score:20, cognitiveLevel:'MOTS',
          instruction:'Tonton video “Berita Nyata” pada layar guru, lalu jawab berdasarkan informasi yang ditampilkan.',
          question:'Dalam video, sebuah cuplikan viral dibagikan bersama klaim tertentu. Sebelum meneruskan cuplikan serupa, tindakan yang paling tepat adalah ...',
          options:['A. Membagikannya segera agar teman menerima informasi lebih cepat','B. Memeriksa sumber, konteks, dan pembanding tepercaya sebelum membagikan','C. Menambahkan pendapat pribadi agar isi unggahan lebih menarik','D. Mengirimkannya hanya kepada teman dekat tanpa memeriksa informasi'],
          answer:'B',
          explanation:'Informasi yang viral belum tentu benar. Sebelum membagikan, kita perlu memeriksa sumber asli, memahami konteks, dan membandingkannya dengan sumber tepercaya.'
        },
        {
          id:'r3q2', name:'MATCH THE PRINCIPLE', type:'matching', score:20, cognitiveLevel:'MOTS',
          instruction:'Cocokkan setiap tindakan dengan prinsip yang paling sesuai. Setiap pilihan digunakan satu kali.',
          question:'Berdasarkan video, cocokkan tindakan berikut dengan prinsip Respect, Educate, dan Protect.',
          options:['1. Tidak menuduh seseorang sebelum informasi terbukti','2. Memeriksa sumber dan konteks sebelum percaya atau membagikan','3. Menghentikan penyebaran konten yang belum terverifikasi'],
          matchOptions:['A. Respect','B. Educate','C. Protect'],
          answer:['A','B','C'],
          explanation:'Respect berarti menghargai orang lain dan tidak menuduh tanpa dasar. Educate berarti memeriksa sumber dan konteks. Protect berarti mencegah penyebaran informasi yang dapat merugikan diri sendiri atau orang lain.'
        },
        {
          id:'r3q3', name:'RESPONS PALING BERTANGGUNG JAWAB', type:'multiple-response', score:20, cognitiveLevel:'HOTS', selectionCount:2,
          instruction:'Pilih DUA jawaban yang paling tepat.',
          question:'Seorang teman mengirim cuplikan viral ke grup kelas, tetapi sumber dan konteksnya belum jelas. Dua tindakan yang paling bertanggung jawab adalah ...',
          options:['A. Menahan diri untuk tidak meneruskan cuplikan tersebut','B. Memeriksa sumber asli dan membandingkannya dengan informasi tepercaya','C. Membagikannya kembali dengan catatan bahwa informasinya belum pasti','D. Menyimpannya lalu mengirimkannya secara pribadi kepada teman dekat'],
          answer:['A','B'],
          explanation:'Tindakan yang bertanggung jawab adalah tidak ikut menyebarkan informasi yang belum jelas serta melakukan verifikasi melalui sumber asli dan sumber tepercaya. Membagikan ulang, meskipun disertai catatan, tetap dapat memperluas penyebaran informasi yang belum terverifikasi.'
        }
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
