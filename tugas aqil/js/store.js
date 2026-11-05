// ==========================================
// STUDY BUDDY - CENTRAL STORE & STATE MANAGEMENT
// ==========================================

const STORAGE_KEY = "study_buddy_app_state_v1";

class StudyBuddyStore {
  constructor() {
    this.subscribers = [];
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all required fields exist
        return {
          ...INITIAL_MOCK_DATA,
          ...parsed,
          currentUser: { ...INITIAL_MOCK_DATA.currentUser, ...(parsed.currentUser || {}) },
          settings: { ...INITIAL_MOCK_DATA.settings, ...(parsed.settings || {}) }
        };
      }
    } catch (e) {
      console.warn("Could not load from localStorage, initializing fresh data:", e);
    }
    return JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.notifySubscribers();
    } catch (e) {
      console.error("Failed to save state to localStorage:", e);
    }
  }

  resetToDefault() {
    this.state = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
    this.saveState();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notifySubscribers() {
    this.subscribers.forEach(cb => {
      try {
        cb(this.state);
      } catch (err) {
        console.error("Subscriber error:", err);
      }
    });
  }

  // Auth getters & actions
  isLoggedIn() {
    return this.state.isLoggedIn !== false;
  }

  getCurrentUser() {
    return this.state.currentUser;
  }

  updateCurrentUser(updates) {
    this.state.currentUser = { ...this.state.currentUser, ...updates };
    this.saveState();
  }

  updateUserCriteria(criteriaUpdates) {
    this.state.currentUser.criteria = {
      ...this.state.currentUser.criteria,
      ...criteriaUpdates
    };
    this.saveState();
  }

  login(userPayload) {
    this.state.isLoggedIn = true;
    if (userPayload) {
      this.state.currentUser = { ...this.state.currentUser, ...userPayload };
    }
    this.saveState();
  }

  logout() {
    this.state.isLoggedIn = false;
    this.saveState();
  }

  // Incoming Requests
  getIncomingRequests() {
    return (this.state.incomingRequests || []).filter(r => r.status === "pending");
  }

  getAllRequests() {
    return this.state.incomingRequests || [];
  }

  getRequestById(id) {
    return (this.state.incomingRequests || []).find(r => r.id === id);
  }

  acceptRequest(requestId) {
    const req = this.getRequestById(requestId);
    if (!req) return null;

    req.status = "accepted";

    // Set as active discussion
    this.state.activeDiscussion = {
      sessionId: "session_" + Date.now(),
      buddyId: req.requesterId,
      buddyName: req.senderName,
      buddyAvatar: req.senderAvatar,
      buddyStatus: "Online",
      subject: req.subject,
      topic: req.topic,
      mode: req.mode,
      startedAt: new Date().toISOString(),
      isActive: true,
      messages: [
        {
          id: "msg_init_1",
          sender: "buddy",
          senderName: req.senderName,
          senderAvatar: req.senderAvatar,
          type: "text",
          text: `Halo ${this.state.currentUser.name}! Senang banget kamu menerima permintaan belajarku untuk mata pelajaran ${req.subject}. Siap mulai diskusinya?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      sharedNotes: `# Catatan Diskusi Bersama: ${req.subject}\n**Topik**: ${req.topic}\n**Peserta**: ${this.state.currentUser.name} & ${req.senderName}\n**Waktu Mulai**: ${new Date().toLocaleTimeString()}\n\n---\n\n### Rangkuman & Pembahasan Soal:\n- Catat rumus, kesepakatan solusi, dan ringkasan materi di sini bersama!\n`,
      sharedDocuments: [],
      sharedLinks: [],
      sharedPhotos: [],
      checklist: [
        { id: "chk_1", task: `Review dasar materi ${req.topic}`, done: false },
        { id: "chk_2", task: "Bahas soal studi kasus bersama", done: false },
        { id: "chk_3", task: "Rangkum kesimpulan & tindak lanjut", done: false }
      ]
    };

    this.saveState();
    return this.state.activeDiscussion;
  }

  rejectRequest(requestId) {
    const req = this.getRequestById(requestId);
    if (req) {
      req.status = "rejected";
      this.saveState();
    }
  }

  addIncomingRequest(newRequest) {
    if (!this.state.incomingRequests) {
      this.state.incomingRequests = [];
    }
    this.state.incomingRequests.unshift({
      id: "req_" + Date.now(),
      timestamp: "Baru saja",
      status: "pending",
      ...newRequest
    });
    this.saveState();
  }

  // Active Discussion
  getActiveDiscussion() {
    return this.state.activeDiscussion;
  }

  addChatMessage(message) {
    if (!this.state.activeDiscussion) return;
    const msg = {
      id: "msg_" + Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...message
    };
    this.state.activeDiscussion.messages.push(msg);

    // If message contains document, link, or photo, sync to respective lists
    if (msg.type === "file") {
      this.state.activeDiscussion.sharedDocuments.push({
        id: "doc_" + Date.now(),
        name: msg.fileName,
        size: msg.fileSize || "1.2 MB",
        uploadedBy: msg.senderName,
        uploadedAt: msg.time,
        type: msg.fileType || "doc"
      });
    } else if (msg.type === "link") {
      this.state.activeDiscussion.sharedLinks.push({
        id: "link_" + Date.now(),
        url: msg.url,
        title: msg.urlTitle || msg.url,
        domain: (function(u) {
          try { return new URL(u).hostname; } catch(e) { return u; }
        })(msg.url),
        sharedBy: msg.senderName
      });
    } else if (msg.type === "image") {
      this.state.activeDiscussion.sharedPhotos.push({
        id: "photo_" + Date.now(),
        url: msg.imageUrl,
        caption: msg.imageCaption || "Foto Pembahasan Materi",
        uploadedBy: msg.senderName,
        uploadedAt: msg.time
      });
    }

    this.saveState();
    return msg;
  }

  updateSharedNotes(notesText) {
    if (this.state.activeDiscussion) {
      this.state.activeDiscussion.sharedNotes = notesText;
      this.saveState();
    }
  }

  toggleChecklistItem(itemId) {
    if (this.state.activeDiscussion && this.state.activeDiscussion.checklist) {
      const item = this.state.activeDiscussion.checklist.find(i => i.id === itemId);
      if (item) {
        item.done = !item.done;
        this.saveState();
      }
    }
  }

  addChecklistItem(taskText) {
    if (this.state.activeDiscussion) {
      if (!this.state.activeDiscussion.checklist) {
        this.state.activeDiscussion.checklist = [];
      }
      this.state.activeDiscussion.checklist.push({
        id: "chk_" + Date.now(),
        task: taskText,
        done: false
      });
      this.saveState();
    }
  }

  // End Discussion & Automatically Save to History (Concept #4 & #5)
  endDiscussion(rating = 5, reviewText = "Sesi belajar sangat bermanfaat dan interaktif!") {
    const disc = this.state.activeDiscussion;
    if (!disc || !disc.isActive) return null;

    const startTime = new Date(disc.startedAt);
    const endTime = new Date();
    const durationMinutes = Math.max(1, Math.round((endTime - startTime) / (1000 * 60)));
    const durationStr = durationMinutes >= 60 
      ? `${Math.floor(durationMinutes / 60)} Jam ${durationMinutes % 60} Menit`
      : `${durationMinutes} Menit`;

    // Create complete archive object
    const archiveRecord = {
      id: "hist_" + Date.now(),
      buddyId: disc.buddyId,
      buddyName: disc.buddyName,
      buddyAvatar: disc.buddyAvatar,
      buddyMajor: disc.buddyMajor || "Teman Belajar Study Buddy",
      subject: disc.subject,
      topic: disc.topic,
      mode: disc.mode,
      date: `Hari ini, ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} WIB`,
      duration: durationStr,
      status: "Selesai & Diarsipkan Otomatis",
      ratingGiven: rating,
      reviewText: reviewText,
      chatCount: disc.messages.length,
      docCount: disc.sharedDocuments.length,
      linkCount: disc.sharedLinks.length,
      photoCount: disc.sharedPhotos.length,
      summary: `Diskusi tuntas mengenai topik ${disc.topic} pada mata pelajaran ${disc.subject}. Mengarsipkan ${disc.messages.length} pesan percakapan, ${disc.sharedDocuments.length} dokumen, ${disc.sharedLinks.length} link referensi, dan catatan kolaboratif.`,
      sharedNotes: disc.sharedNotes,
      messages: [...disc.messages],
      documents: [...disc.sharedDocuments],
      links: [...disc.sharedLinks],
      photos: [...disc.sharedPhotos],
      checklist: disc.checklist ? [...disc.checklist] : []
    };

    // Add to history at the beginning
    if (!this.state.studyHistory) {
      this.state.studyHistory = [];
    }
    this.state.studyHistory.unshift(archiveRecord);

    // Update user stats
    this.state.currentUser.studyHours = Math.round((this.state.currentUser.studyHours + (durationMinutes / 60)) * 10) / 10;
    this.state.currentUser.sessionsCount += 1;

    // Reset active discussion
    this.state.activeDiscussion = null;

    this.saveState();
    return archiveRecord;
  }

  // History getters
  getStudyHistory() {
    return this.state.studyHistory || [];
  }

  getHistoryById(id) {
    return (this.state.studyHistory || []).find(h => h.id === id);
  }

  // Settings
  updateSettings(newSettings) {
    this.state.settings = { ...this.state.settings, ...newSettings };
    this.saveState();
  }
}

// Export singleton
window.studyBuddyStore = new StudyBuddyStore();
