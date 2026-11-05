// ==========================================
// STUDY BUDDY - INITIAL MOCK DATA
// ==========================================

const INITIAL_MOCK_DATA = {
  currentUser: {
    id: "user_aqil",
    name: "Aqil Pratama",
    username: "aqil_dev",
    email: "aqil.pratama@student.univ.ac.id",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    university: "Universitas Indonesia",
    major: "Teknik Informatika (Semester 4)",
    bio: "Passionate di web development, algoritma, dan matematika diskrit. Selalu terbuka berdiskusi dan membedah latihan soal bareng!",
    phone: "0812-3456-7890",
    rating: 4.9,
    reviewsCount: 19,
    studyHours: 48.5,
    sessionsCount: 26,
    badges: [
      { name: "Top Study Buddy", icon: "⭐", desc: "Rating di atas 4.8 dari 15+ sesi" },
      { name: "Web Dev Wizard", icon: "💻", desc: "Menyelesaikan 10+ diskusi pemrograman" },
      { name: "Fast Responder", icon: "⚡", desc: "Rata-rata respon request di bawah 5 menit" },
      { name: "Disiplin Belajar", icon: "🎯", desc: "Menuntaskan semua checklist diskusi" }
    ],
    criteria: {
      subjects: ["Pemrograman Web", "Struktur Data & Algoritma", "Kalkulus II", "Basis Data"],
      topics: "React, JavaScript Modern, Binary Search Tree, Graph BFS/DFS, Integral Lipat Dua, Normalisasi SQL",
      level: "Menengah",
      mode: "both", // 'online', 'offline', 'both'
      availability: ["Senin Malam (19:00 - 21:30)", "Rabu Sore (15:30 - 18:00)", "Sabtu Pagi & Siang", "Minggu Fleksibel"],
      meetupLocation: "Perpustakaan Pusat UI Depok / Kafe Sekitar Margonda",
      learningStyle: "Praktik Langsung & Bahas Latihan Soal",
      goals: "Persiapan Ujian Akhir Semester & Finalisasi Proyek Web",
      isOpenForMatching: true
    }
  },

  availableBuddies: [
    {
      id: "buddy_sarah",
      name: "Sarah Amalia",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      university: "Universitas Indonesia",
      major: "Sistem Informasi",
      bio: "Suka eksplorasi algoritma dan database. Lagi butuh teman diskusi untuk persiapan materi Tree & Graph!",
      rating: 4.9,
      reviewsCount: 14,
      studyHours: 32,
      criteria: {
        subjects: ["Struktur Data & Algoritma", "Basis Data", "Matematika Diskrit"],
        topics: "Tree Traversal, Graph Algoritma Dijkstra, SQL Query Optimization",
        level: "Menengah",
        mode: "both",
        availability: ["Senin Malam", "Kamis Sore", "Sabtu Fleksibel"],
        meetupLocation: "Perpustakaan UI / Kafe Margonda",
        learningStyle: "Visual & Diskusi Santai",
        goals: "Kuasai materi Graph & lulus quiz dengan nilai A"
      }
    },
    {
      id: "buddy_dimas",
      name: "Dimas Arya",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      university: "Institut Teknologi Bandung",
      major: "Teknik Informatika",
      bio: "Fullstack enthusiast. Suka pair-programming dan review kode bareng. Ayo sharing knowledge!",
      rating: 4.8,
      reviewsCount: 22,
      studyHours: 54,
      criteria: {
        subjects: ["Pemrograman Web", "Pemrograman Berorientasi Objek", "Struktur Data & Algoritma"],
        topics: "React Hooks, Tailwind CSS, REST API, Async/Await, OOP Design Pattern",
        level: "Lanjutan",
        mode: "online",
        availability: ["Selasa Malam", "Jumat Malam", "Minggu Siang"],
        meetupLocation: "Online via Discussion Room (Discord / GMeet)",
        learningStyle: "Hands-on Code & Live Debugging",
        goals: "Menyelesaikan aplikasi portofolio semester ini"
      }
    },
    {
      id: "buddy_clara",
      name: "Clara Wijaya",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      university: "Universitas Bina Nusantara",
      major: "Desain Komunikasi Visual & UI/UX",
      bio: "UI/UX Designer. Suka bahas human-computer interaction, usability testing, dan bedah design system.",
      rating: 5.0,
      reviewsCount: 17,
      studyHours: 41,
      criteria: {
        subjects: ["UI/UX Design", "Pemrograman Web", "Desain Grafis"],
        topics: "Figma Component Library, Usability Heuristics, HTML/CSS Semantik",
        level: "Menengah",
        mode: "both",
        availability: ["Rabu Pagi", "Kamis Siang", "Sabtu Sore"],
        meetupLocation: "Kafe Temu Kopi Senopati / Online",
        learningStyle: "Review Portofolio & Brainstorming Kasus Nyata",
        goals: "Membuat redesign aplikasi pendidikan yang usable"
      }
    },
    {
      id: "buddy_fauzan",
      name: "Fauzan Nugraha",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      university: "Universitas Gadjah Mada",
      major: "Teknik Elektro",
      bio: "Fokus ke fisika terapan, kalkulus, dan sinyal. Senang bantu teman yang kesulitan memahami konsep turunan & integral.",
      rating: 4.7,
      reviewsCount: 11,
      studyHours: 29,
      criteria: {
        subjects: ["Kalkulus II", "Fisika Dasar", "Matematika Teknik"],
        topics: "Integral Lipat, Persamaan Diferensial, Rangkaian Listrik",
        level: "Lanjutan",
        mode: "online",
        availability: ["Senin Sore", "Rabu Malam", "Sabtu Malam"],
        meetupLocation: "Online Discussion Room",
        learningStyle: "Bahas Step-by-Step Rumus & Bedah Soal Ujian",
        goals: "Persiapan Ujian Tengah Semester bersama"
      }
    },
    {
      id: "buddy_alisha",
      name: "Alisha Zahra",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
      university: "Universitas Padjadjaran",
      major: "Hubungan Internasional",
      bio: "IELTS 7.5 scorer. Senang latihan speaking bahasa Inggris, presentation skills, dan diskusi artikel akademik.",
      rating: 4.9,
      reviewsCount: 25,
      studyHours: 60,
      criteria: {
        subjects: ["Bahasa Inggris", "Public Speaking", "Academic Writing"],
        topics: "IELTS/TOEFL Preparation, Essay Structure, Daily Conversational Practice",
        level: "Menengah",
        mode: "both",
        availability: ["Selasa Pagi", "Kamis Malam", "Minggu Pagi"],
        meetupLocation: "Perpusda Bandung / Online Meet",
        learningStyle: "Speaking & Roleplay Diskusi Bahasa Inggris",
        goals: "Target skor IELTS 8.0 & persiapan student exchange"
      }
    },
    {
      id: "buddy_budi",
      name: "Budi Hartono",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      university: "Institut Teknologi Sepuluh Nopember",
      major: "Statistika & Sains Data",
      bio: "Data enthusiast. Suka belajar statistika inferensia, machine learning dasar, dan visualisasi data dengan Python.",
      rating: 4.8,
      reviewsCount: 16,
      studyHours: 38,
      criteria: {
        subjects: ["Statistika", "Basis Data", "Pemrograman Web"],
        topics: "Regresi Linear, Uji Hipotesis, Pandas, Query SQL",
        level: "Menengah",
        mode: "online",
        availability: ["Senin Siang", "Jumat Sore", "Minggu Malam"],
        meetupLocation: "Online Discussion Room",
        learningStyle: "Analisis Dataset Nyata & Diskusi Interpretasi",
        goals: "Selesaikan paper tugas akhir statistika"
      }
    }
  ],

  incomingRequests: [
    {
      id: "req_001",
      requesterId: "buddy_sarah",
      senderName: "Sarah Amalia",
      senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      senderMajor: "Sistem Informasi - UI",
      senderRating: 4.9,
      subject: "Struktur Data & Algoritma",
      topic: "Bahas Latihan Soal Tree Traversal & Implementasi Binary Search Tree",
      proposedTime: "Hari ini, 19:30 - 21:00 WIB",
      mode: "Online Discussion Room",
      meetupLocation: "Online di Study Buddy Room",
      matchScore: 96,
      matchingReasons: [
        "Sama-sama mengambil mata pelajaran Struktur Data & Algoritma",
        "Topik relevan: Binary Search Tree",
        "Waktu belajar cocok: Senin Malam",
        "Satu almamater: Universitas Indonesia"
      ],
      note: "Halo Aqil! Aku lihat kriteria profilmu sangat paham tentang Binary Search Tree. Minggu depan kelasku ada kuis. Mau belajar dan bedah latihan soal bareng malam ini di mode diskusi?",
      timestamp: "10 menit yang lalu",
      status: "pending" // 'pending', 'accepted', 'rejected'
    },
    {
      id: "req_002",
      requesterId: "buddy_dimas",
      senderName: "Dimas Arya",
      senderAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      senderMajor: "Teknik Informatika - ITB",
      senderRating: 4.8,
      subject: "Pemrograman Web",
      topic: "State Management & Optimasi Rendering Komponen React",
      proposedTime: "Besok, 15:00 WIB",
      mode: "Online / Meetup Fleksibel",
      meetupLocation: "Study Buddy Virtual Room",
      matchScore: 93,
      matchingReasons: [
        "Sama-sama mendalami React & JavaScript Modern",
        "Gaya belajar cocok: Hands-on Code & Live Debugging",
        "Tingkat kemampuan seimbang: Menengah - Lanjutan"
      ],
      note: "Hai bro Aqil! Aku lagi ngerjain project web dan mau diskusi santai tentang optimasi React Hooks. Tertarik belajar bareng besok?",
      timestamp: "1 jam yang lalu",
      status: "pending"
    }
  ],

  activeDiscussion: {
    sessionId: "session_active_01",
    buddyId: "buddy_sarah",
    buddyName: "Sarah Amalia",
    buddyAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    buddyStatus: "Online",
    subject: "Struktur Data & Algoritma",
    topic: "Binary Search Tree & Latihan Soal Traversal",
    mode: "Online Study Room",
    startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
    isActive: true,
    messages: [
      {
        id: "msg_1",
        sender: "sarah",
        senderName: "Sarah Amalia",
        senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        type: "text",
        text: "Halo Aqil! Terima kasih sudah menerima match request belajarnya. Siap mulai bedah materi Binary Search Tree?",
        time: "19:30"
      },
      {
        id: "msg_2",
        sender: "me",
        senderName: "Aqil Pratama",
        senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        type: "text",
        text: "Halo Sarah! Sama-sama, senang bisa belajar bareng. Aku sudah siapkan catatan konsep dasar BST dan beberapa variasi soal traversal.",
        time: "19:32"
      },
      {
        id: "msg_3",
        sender: "sarah",
        senderName: "Sarah Amalia",
        senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        type: "file",
        fileName: "Latihan_Soal_BST_Diktat_Kampus.pdf",
        fileSize: "2.4 MB",
        fileType: "pdf",
        text: "Ini diktat latihan soal dari dosenku minggu ini, coba kita cek nomor 3 dan 5 ya!",
        time: "19:35"
      },
      {
        id: "msg_4",
        sender: "me",
        senderName: "Aqil Pratama",
        senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        type: "image",
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80",
        imageCaption: "Visualisasi Tree: In-Order, Pre-Order, dan Post-Order Traversal",
        text: "Nah ini diagram visualisasi urutan traversal yang kemarin kubuat, sangat membantu untuk menghafal logikanya.",
        time: "19:40"
      },
      {
        id: "msg_5",
        sender: "sarah",
        senderName: "Sarah Amalia",
        senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        type: "link",
        url: "https://visualgo.net/en/bst",
        urlTitle: "VisuAlgo - Binary Search Tree Visualization & Animation",
        urlDesc: "Interactive animation tool to visualize BST insertion, deletion, and search algorithms step-by-step.",
        text: "Keren banget diagramnya! Btw ini link simulator interaktif VisuAlgo yang biasa kupakai untuk ngetes skenario insert & delete node:",
        time: "19:44"
      },
      {
        id: "msg_6",
        sender: "me",
        senderName: "Aqil Pratama",
        senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        type: "text",
        text: "Mantap! Yuk kita bahas soal nomor 3 sekarang di tab Catatan Bersama di sebelah kanan.",
        time: "19:48"
      }
    ],
    sharedNotes: `# Catatan Diskusi Bersama: Binary Search Tree
**Tanggal**: Sesi Berlangsung
**Peserta**: Aqil Pratama & Sarah Amalia
**Mata Pelajaran**: Struktur Data & Algoritma

---

### 1. Karakteristik Binary Search Tree (BST)
- Setiap node memiliki maksimal 2 anak (left & right).
- Semua nilai di **sub-tree kiri** selalu **LEBIH KECIL** dari root.
- Semua nilai di **sub-tree kanan** selalu **LEBIH BESAR** dari root.
- Kompleksitas waktu pencarian rata-rata: **O(log N)** (Worst case O(N) jika skewed).

### 2. Algoritma Traversal:
1. **In-Order (Left, Root, Right)**: Menghasilkan urutan angka terurut dari kecil ke besar!
2. **Pre-Order (Root, Left, Right)**: Bagus untuk membuat salinan pohon / kloning struktur.
3. **Post-Order (Left, Right, Root)**: Bagus untuk operasi penghapusan pohon dari daun ke akar.

### 3. Solusi Soal Latihan No. 3:
- Input angka: [15, 10, 20, 8, 12, 17, 25]
- Root utama = 15
- In-Order traversal: 8 -> 10 -> 12 -> 15 -> 17 -> 20 -> 25 (Terbukti terurut ascending).
- Sarah: "Paham banget sekarang! Jadi trik cepat ujian kalau In-Order BST pasti hasilnya urut!"
`,
    sharedDocuments: [
      {
        id: "doc_1",
        name: "Latihan_Soal_BST_Diktat_Kampus.pdf",
        size: "2.4 MB",
        uploadedBy: "Sarah Amalia",
        uploadedAt: "19:35",
        type: "pdf"
      },
      {
        id: "doc_2",
        name: "Ringkasan_Rumus_Kompleksitas_Tree.docx",
        size: "820 KB",
        uploadedBy: "Aqil Pratama",
        uploadedAt: "19:50",
        type: "doc"
      }
    ],
    sharedLinks: [
      {
        id: "link_1",
        url: "https://visualgo.net/en/bst",
        title: "VisuAlgo - BST Interactive Tool",
        domain: "visualgo.net",
        sharedBy: "Sarah Amalia"
      },
      {
        id: "link_2",
        url: "https://leetcode.com/tag/binary-search-tree/",
        title: "LeetCode BST Practice Problems",
        domain: "leetcode.com",
        sharedBy: "Aqil Pratama"
      }
    ],
    sharedPhotos: [
      {
        id: "photo_1",
        url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
        caption: "Visualisasi Tree: In-Order, Pre-Order, Post-Order",
        uploadedBy: "Aqil Pratama",
        uploadedAt: "19:40"
      }
    ],
    checklist: [
      { id: "chk_1", task: "Review sifat dasar Binary Search Tree", done: true },
      { id: "chk_2", task: "Praktik urutan 3 jenis Traversal (In, Pre, Post)", done: true },
      { id: "chk_3", task: "Bahas soal latihan No. 3 (Insert 7 Node)", done: true },
      { id: "chk_4", task: "Eksplorasi kasus delete node dengan 2 anak (In-order successor)", done: false },
      { id: "chk_5", task: "Review quiz prediksi bareng", done: false }
    ]
  },

  studyHistory: [
    {
      id: "hist_001",
      buddyId: "buddy_clara",
      buddyName: "Clara Wijaya",
      buddyAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      buddyMajor: "DKV & UI/UX - Binus",
      subject: "UI/UX Design",
      topic: "Wireframing & Prototyping Study Buddy Platform",
      mode: "Offline Meetup (Kafe Temu Kopi Senopati)",
      date: "Kemarin, 14:00 - 16:15 WIB",
      duration: "2 Jam 15 Menit",
      status: "Selesai & Diarsipkan",
      ratingGiven: 5,
      reviewText: "Clara luar biasa solutif! Diskusi desain interface jadi jauh lebih rapi dan intuitif.",
      chatCount: 42,
      docCount: 2,
      linkCount: 3,
      photoCount: 4,
      summary: "Mendiskusikan arsitektur informasi aplikasi Study Buddy, membuat wireframe lo-fi untuk alur matching, serta menyepakati palet warna modern indigo & emerald.",
      sharedNotes: `# Ringkasan Sesi UI/UX bersama Clara
1. Memilih palet warna Indigo-600 sebagai primary color dan Emerald-500 sebagai accent success.
2. Alur Request Match harus memiliki indikator persentase kecocokan (Match Score).
3. Halaman diskusi wajib memiliki catatan kolaboratif dan tombol akhiri diskusi yang jelas.
4. Semua aset harus otomatis masuk ke arsip begitu sesi ditutup.`,
      documents: [
        { name: "Design_System_Draft_v1.pdf", size: "3.8 MB", type: "pdf" },
        { name: "User_Journey_Map_StudyBuddy.png", size: "1.2 MB", type: "png" }
      ],
      links: [
        { title: "Figma Community Study Template", url: "https://figma.com/@studybuddy" },
        { title: "Nielsen Norman Usability Checklist", url: "https://nngroup.com/articles" }
      ],
      photos: [
        { caption: "Sketsa Wireframe Kasar di Kertas", url: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500&auto=format&fit=crop&q=80" },
        { caption: "Moodboard Warna & Tipografi", url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&auto=format&fit=crop&q=80" }
      ]
    },
    {
      id: "hist_002",
      buddyId: "buddy_fauzan",
      buddyName: "Fauzan Nugraha",
      buddyAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      buddyMajor: "Teknik Elektro - UGM",
      subject: "Kalkulus II",
      topic: "Integral Lipat Dua & Aplikasi Luas Daerah",
      mode: "Online Discussion Room",
      date: "3 Hari yang lalu, 20:00 - 21:40 WIB",
      duration: "1 Jam 40 Menit",
      status: "Selesai & Diarsipkan",
      ratingGiven: 5,
      reviewText: "Fauzan jago banget jelasin konsep integral lipat dengan visualisasi 3D! Sangat terbantu.",
      chatCount: 38,
      docCount: 3,
      linkCount: 2,
      photoCount: 2,
      summary: "Membedah 5 soal latihan ujian bab integral lipat dua menggunakan koordinat kutub (polar coordinates). Menghitung luas volume benda putar.",
      sharedNotes: `# Ringkasan Belajar Kalkulus II - Integral Lipat
- Rumus dasar konversi koordinat kartesius ke polar: x = r cos(theta), y = r sin(theta), dx dy = r dr d(theta).
- Selalu gambarkan batas daerah D terlebih dahulu sebelum menentukan urutan integrasi.`,
      documents: [
        { name: "Kumpulan_Soal_UAS_Kalkulus_UGM.pdf", size: "4.1 MB", type: "pdf" },
        { name: "Coretan_Penyelesaian_Soal_Integral.pdf", size: "1.9 MB", type: "pdf" }
      ],
      links: [
        { title: "GeoGebra 3D Grapher", url: "https://geogebra.org/3d" },
        { title: "WolframAlpha Integral Step-by-Step", url: "https://wolframalpha.com" }
      ],
      photos: [
        { caption: "Grafik Irisan Permukaan 3D", url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=80" }
      ]
    },
    {
      id: "hist_003",
      buddyId: "buddy_alisha",
      buddyName: "Alisha Zahra",
      buddyAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
      buddyMajor: "Hubungan Internasional - Unpad",
      subject: "Bahasa Inggris",
      topic: "Speaking Practice: IELTS Part 2 & Part 3",
      mode: "Online Discussion Room",
      date: "5 Hari yang lalu, 16:00 - 17:15 WIB",
      duration: "1 Jam 15 Menit",
      status: "Selesai & Diarsipkan",
      ratingGiven: 5,
      reviewText: "Alisha sangat ramah dan memberikan feedback pelafalan yang konstruktif. Percaya diri speaking-ku naik pesat!",
      chatCount: 29,
      docCount: 1,
      linkCount: 4,
      photoCount: 1,
      summary: "Latihan berbicara lancar selama 2 menit tanpa jeda topik 'Describe a memorable journey'. Pembahasan idiom dan transisi kalimat akademik.",
      sharedNotes: `# Vocab & Idioms Baru dari Sesi Alisha:
- "Off the beaten track" = Tempat yang jarang dikunjungi turis
- "A breath of fresh air" = Suasana baru yang menyegarkan
- Gunakan struktur: Past Experience -> Impact -> Why it matters`,
      documents: [
        { name: "IELTS_Speaking_Band_9_CheatSheet.pdf", size: "1.5 MB", type: "pdf" }
      ],
      links: [
        { title: "BBC Learning English - 6 Minute English", url: "https://bbc.co.uk/learningenglish" },
        { title: "Cambridge Dictionary Phonetics", url: "https://dictionary.cambridge.org" }
      ],
      photos: [
        { caption: "Mind Map Jawaban Part 2", url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop&q=80" }
      ]
    }
  ],

  settings: {
    theme: "light", // 'light' or 'dark'
    soundNotification: true,
    autoAcceptHighMatch: false,
    showOnlineStatus: true,
    emailNotification: true,
    allowOfflineMeetup: true,
    studyReminderMinutes: 15
  },

  subjectCategories: [
    "Semua Pelajaran",
    "Pemrograman Web",
    "Struktur Data & Algoritma",
    "Kalkulus II",
    "Basis Data",
    "UI/UX Design",
    "Bahasa Inggris",
    "Fisika Dasar",
    "Statistika",
    "Matematika Diskrit",
    "Kecerdasan Buatan (AI)",
    "Akuntansi Dasar"
  ]
};

// Export to window
if (typeof window !== "undefined") {
  window.INITIAL_MOCK_DATA = INITIAL_MOCK_DATA;
}
