export const TEAM_COLORS = ['#4aa3ff','#56df9b','#ffd166','#ff6b6b','#b990ff','#ff9f43'];

export const QUESTION_BANK = [
  {
    round: 1,
    roundName: 'ENTER THE NETWORK',
    focus: 'Masyarakat Jaringan / Network Society',
    level: 'UNDERSTAND & IDENTIFY',
    questions: [
      {
        id: 'r1q1',
        name: 'CONNECTED SOCIETY',
        type: 'single-choice',
        score: 10,
        question: 'Kelas IX membuat proyek bersama dengan siswa dari sekolah lain. Mereka membagi tugas melalui grup chat, mengedit dokumen bersama secara daring, dan melakukan rapat video. Ciri masyarakat jaringan yang paling jelas pada situasi tersebut adalah ...',
        options: [
          'A. Hubungan sosial hanya terjadi jika orang bertemu langsung',
          'B. Interaksi dan kerja sama terhubung melalui jaringan komunikasi digital',
          'C. Teknologi membuat manusia tidak lagi membutuhkan kelompok sosial',
          'D. Semua hubungan masyarakat menjadi bersifat pribadi'
        ],
        explanation: 'Masyarakat jaringan ditandai oleh hubungan dan aktivitas sosial yang terhubung melalui jaringan informasi dan komunikasi. Teknologi memungkinkan orang berinteraksi dan bekerja sama meskipun tidak berada di tempat yang sama.'
      },
      {
        id: 'r1q2',
        name: 'NETWORK CHECK',
        type: 'true-false',
        score: 10,
        question: 'Benar atau Salah: Dalam masyarakat jaringan, hubungan sosial dapat terbentuk dan dipertahankan melampaui batas ruang karena didukung teknologi informasi dan komunikasi.',
        options: ['BENAR','SALAH'],
        explanation: 'Pernyataan ini benar. Jaringan digital memungkinkan komunikasi dan pertukaran informasi berlangsung lintas tempat dan waktu, sehingga hubungan sosial tidak selalu bergantung pada pertemuan fisik.'
      },
      {
        id: 'r1q3',
        name: 'MATCH THE NETWORK',
        type: 'matching',
        score: 10,
        question: 'Cocokkan karakteristik masyarakat jaringan dengan contoh yang paling tepat.',
        options: [
          '1. Terhubung melalui jaringan',
          '2. Informasi bergerak cepat',
          '3. Kerja sama tidak dibatasi lokasi'
        ],
        matchOptions: [
          'A. Siswa di Bandung dan Surabaya menyusun presentasi pada dokumen daring yang sama',
          'B. Pengumuman kegiatan sekolah tersebar ke seluruh kelas melalui grup dalam beberapa menit',
          'C. Anggota komunitas saling berkomunikasi melalui platform digital'
        ],
        explanation: 'Jaringan digital menghubungkan orang, mempercepat arus informasi, dan memungkinkan kerja sama berlangsung tanpa harus berada di lokasi yang sama.'
      }
    ]
  },
  {
    round: 2,
    roundName: 'DIGITAL INTERACTION',
    focus: 'Interaksi masyarakat di dunia nyata dan dunia digital',
    level: 'COMPARE & ANALYZE',
    questions: [
      {
        id: 'r2q1',
        name: 'REAL OR DIGITAL?',
        type: 'case-study',
        score: 15,
        question: 'Raka salah memahami pesan singkat dari temannya karena tidak melihat ekspresi wajah dan nada bicara. Saat bertemu langsung, masalah tersebut cepat selesai setelah mereka menjelaskan maksud masing-masing. Kesimpulan yang paling tepat adalah ...',
        options: [
          'A. Interaksi digital selalu lebih buruk daripada interaksi langsung',
          'B. Interaksi langsung memberi lebih banyak petunjuk nonverbal, sedangkan interaksi digital perlu pesan yang lebih jelas agar tidak mudah disalahartikan',
          'C. Komunikasi digital tidak dapat digunakan untuk menyelesaikan masalah',
          'D. Interaksi langsung tidak memerlukan kemampuan berkomunikasi'
        ],
        explanation: 'Interaksi langsung memiliki petunjuk nonverbal seperti ekspresi dan intonasi. Dalam ruang digital, pesan perlu disusun lebih jelas karena sebagian petunjuk tersebut tidak selalu terlihat.'
      },
      {
        id: 'r2q2',
        name: 'DIGITAL INTERACTION SIGNALS',
        type: 'multiple-response',
        score: 15,
        instruction: 'Pilih semua jawaban yang tepat.',
        question: 'Manakah situasi yang menunjukkan karakteristik interaksi digital? Pilih semua jawaban yang tepat.',
        options: [
          'A. Informasi dapat dikirim dengan cepat kepada banyak orang',
          'B. Interaksi hanya dapat berlangsung jika semua orang berada di ruangan yang sama',
          'C. Jejak komunikasi dapat tersimpan sebagai pesan, foto, atau unggahan',
          'D. Orang dapat berinteraksi secara sinkron maupun tidak sinkron',
          'E. Semua informasi digital pasti benar karena dapat dibaca banyak orang'
        ],
        explanation: 'Interaksi digital dapat berlangsung cepat, meninggalkan jejak digital, dan berlangsung secara sinkron maupun tidak sinkron. Namun, informasi digital tetap perlu diperiksa kebenarannya.'
      },
      {
        id: 'r2q3',
        name: 'COMPARE THE SITUATION',
        type: 'case-study',
        score: 15,
        question: 'Kelompok Dina berdiskusi di kelas lalu melanjutkan pembagian tugas melalui grup chat pada malam hari. Agar kerja kelompok tetap efektif, tindakan yang paling tepat adalah ...',
        options: [
          'A. Menganggap pesan grup tidak penting karena diskusi utama sudah terjadi di kelas',
          'B. Menggunakan kelebihan kedua bentuk interaksi: menyepakati keputusan penting saat diskusi, lalu memakai grup digital untuk koordinasi dan dokumentasi tugas',
          'C. Memindahkan seluruh komunikasi ke grup digital agar tidak perlu bertemu sama sekali',
          'D. Mengirim pesan sebanyak mungkin tanpa aturan waktu dan tanpa memastikan semua anggota memahami tugas'
        ],
        explanation: 'Interaksi nyata dan digital dapat saling melengkapi. Pertemuan langsung membantu penjelasan dan negosiasi, sedangkan ruang digital memudahkan koordinasi, dokumentasi, dan komunikasi jarak jauh.'
      }
    ]
  },
  {
    round: 3,
    roundName: 'DIGITAL RESPONSIBILITY',
    focus: 'Respect • Educate • Protect',
    level: 'ANALYZE • EVALUATE • DECIDE',
    videoCase: true,
    questions: [
      {
        id: 'r3q1',
        name: 'FIND THE PROBLEM',
        type: 'multiple-response',
        score: 20,
        instruction: 'Pilih semua jawaban yang tepat berdasarkan video kasus.',
        question: 'Perilaku mana yang menjadi masalah dalam kasus Nisa? Pilih semua jawaban yang tepat.',
        options: [
          'A. Mengambil screenshot percakapan pribadi tanpa persetujuan',
          'B. Meneruskan screenshot ke grup kelas',
          'C. Menanyakan sumber informasi dan apakah informasi sudah diperiksa',
          'D. Menertawakan dan meminta foto lain',
          'E. Menyebarkan informasi yang belum diketahui kebenarannya',
          'F. Mengingatkan bahwa percakapan tersebut bersifat pribadi'
        ],
        explanation: 'Masalah utamanya adalah pelanggaran privasi, penyebaran ulang tanpa izin, komentar yang merendahkan, dan penyebaran informasi yang belum terverifikasi. Memeriksa sumber dan mengingatkan privasi justru merupakan tindakan yang bertanggung jawab.'
      },
      {
        id: 'r3q2',
        name: 'MATCH THE PRINCIPLE',
        type: 'matching',
        score: 20,
        question: 'Cocokkan tindakan berikut dengan prinsip interaksi digital yang paling sesuai.',
        options: [
          '1. Tidak menertawakan atau mempermalukan Nisa di grup',
          '2. Memeriksa sumber sebelum mempercayai dan meneruskan informasi',
          '3. Tidak menyebarkan screenshot pribadi dan menjaga data pribadi'
        ],
        matchOptions: ['A. Respect','B. Educate','C. Protect'],
        explanation: 'Respect berkaitan dengan menghargai orang lain; Educate berkaitan dengan menggunakan informasi secara cerdas dan memeriksa kebenarannya; Protect berkaitan dengan menjaga keamanan, privasi, dan data pribadi.'
      },
      {
        id: 'r3q3',
        name: 'WHAT WOULD YOU DO?',
        type: 'multiple-response',
        score: 20,
        instruction: 'Pilih semua tindakan yang tepat jika kamu berada di dalam grup tersebut.',
        question: 'Setelah melihat screenshot pribadi Nisa tersebar dan muncul informasi yang belum jelas kebenarannya, apa yang sebaiknya kamu lakukan?',
        options: [
          'A. Tidak ikut meneruskan screenshot',
          'B. Mengingatkan anggota grup agar menghentikan penyebaran',
          'C. Memeriksa sumber informasi sebelum mempercayai atau membagikannya',
          'D. Menyimpan screenshot untuk dibagikan nanti kepada teman dekat',
          'E. Mendukung Nisa dan menyarankan melapor kepada guru/orang dewasa tepercaya jika situasi berlanjut',
          'F. Menambahkan komentar lucu agar suasana grup lebih ramai'
        ],
        explanation: 'Tindakan yang bertanggung jawab adalah menghentikan penyebaran, menjaga privasi, memeriksa kebenaran informasi, serta memberi dukungan dan mencari bantuan yang tepat bila diperlukan.'
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
