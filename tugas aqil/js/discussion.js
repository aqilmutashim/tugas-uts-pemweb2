// ==========================================
// STUDY BUDDY - DISCUSSION PAGE CONTROLLER
// ==========================================

const DiscussionController = {
  timerInterval: null,
  pomodoroInterval: null,
  pomodoroSecondsLeft: 25 * 60,
  pomodoroIsRunning: false,
  audioContext: null,
  ambientNode: null,
  isAmbientPlaying: false,

  init() {
    this.startSessionTimer();
    this.setupAutoReply();
  },

  // 1. Session Duration Timer (counts up indefinitely without time limit)
  startSessionTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    const timerElement = document.getElementById("sessionDurationDisplay");
    if (!timerElement) return;

    this.timerInterval = setInterval(() => {
      const disc = window.studyBuddyStore.getActiveDiscussion();
      if (!disc || !disc.isActive) {
        clearInterval(this.timerInterval);
        return;
      }

      const startedAt = new Date(disc.startedAt).getTime();
      const now = Date.now();
      const diffSecs = Math.max(0, Math.floor((now - startedAt) / 1000));

      const hours = Math.floor(diffSecs / 3600);
      const minutes = Math.floor((diffSecs % 3600) / 60);
      const seconds = diffSecs % 60;

      const formatted = [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0")
      ].join(":");

      timerElement.textContent = formatted;
    }, 1000);
  },

  // 2. Chat messaging
  sendTextMessage(text) {
    if (!text || !text.trim()) return;

    const currentUser = window.studyBuddyStore.getCurrentUser();
    const msg = window.studyBuddyStore.addChatMessage({
      sender: "me",
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      type: "text",
      text: text.trim()
    });

    this.renderChatMessages();
    this.scrollToBottom();

    // Trigger realistic buddy reply after a short delay
    this.triggerBuddyAutoResponse(text);
  },

  sendFileMessage(fileData) {
    const currentUser = window.studyBuddyStore.getCurrentUser();
    window.studyBuddyStore.addChatMessage({
      sender: "me",
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      type: "file",
      fileName: fileData.name,
      fileSize: fileData.size || "1.5 MB",
      fileType: fileData.type || "pdf",
      text: fileData.caption || `Mengunggah dokumen: ${fileData.name}`
    });

    this.renderChatMessages();
    this.renderSharedAssets();
    this.scrollToBottom();

    setTimeout(() => {
      this.sendBuddyTextMessage("Terima kasih sudah share filenya! Langsung kubaca dan kubandingkan dengan materi yang kupunya ya.");
    }, 1600);
  },

  sendImageMessage(imageData) {
    const currentUser = window.studyBuddyStore.getCurrentUser();
    window.studyBuddyStore.addChatMessage({
      sender: "me",
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      type: "image",
      imageUrl: imageData.url,
      imageCaption: imageData.caption || "Gambar materi diskusi",
      text: imageData.caption || "Membagikan foto/diagram pembahasan:"
    });

    this.renderChatMessages();
    this.renderSharedAssets();
    this.scrollToBottom();

    setTimeout(() => {
      this.sendBuddyTextMessage("Gambarnya jelas banget! Penjelasan visual begini bikin jauh lebih gampang paham langkah-langkahnya.");
    }, 1500);
  },

  sendLinkMessage(linkData) {
    const currentUser = window.studyBuddyStore.getCurrentUser();
    window.studyBuddyStore.addChatMessage({
      sender: "me",
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      type: "link",
      url: linkData.url,
      urlTitle: linkData.title || linkData.url,
      urlDesc: linkData.desc || "Referensi tambahan untuk materi yang sedang dibahas bersama",
      text: linkData.note ? `${linkData.note} (${linkData.url})` : `Membagikan tautan referensi: ${linkData.title}`
    });

    this.renderChatMessages();
    this.renderSharedAssets();
    this.scrollToBottom();

    setTimeout(() => {
      this.sendBuddyTextMessage("Bagus banget linknya! Langsung kusimpan ke daftar bookmark referensi.");
    }, 1400);
  },

  sendBuddyTextMessage(text) {
    const disc = window.studyBuddyStore.getActiveDiscussion();
    if (!disc) return;

    window.studyBuddyStore.addChatMessage({
      sender: "buddy",
      senderName: disc.buddyName,
      senderAvatar: disc.buddyAvatar,
      type: "text",
      text: text
    });

    this.renderChatMessages();
    this.scrollToBottom();
  },

  triggerBuddyAutoResponse(userText) {
    const disc = window.studyBuddyStore.getActiveDiscussion();
    if (!disc) return;

    const lower = userText.toLowerCase();
    let reply = "Setuju banget! Mari kita catat ini di bagian Catatan Bersama agar tidak lupa saat ujian.";

    if (lower.includes("halo") || lower.includes("hai") || lower.includes("pagi") || lower.includes("malam")) {
      reply = `Halo juga! Senang bisa belajar bareng kamu malam ini. Mau kita mulai dari teori dulu atau langsung ke latihan soal?`;
    } else if (lower.includes("soal") || lower.includes("nomor") || lower.includes("latihan")) {
      reply = `Untuk bagian ini, langkah kuncinya adalah memahami kondisi basisnya dulu, baru kita selesaikan secara runtut. Aku coba tambahkan checklist di samping ya!`;
    } else if (lower.includes("rumus") || lower.includes("konsep") || lower.includes("teori")) {
      reply = `Tepat sekali! Kalau dirangkum, inti formulanya adalah konsistensi di setiap iterasi. Sudah kutambahkan ke Catatan Bersama kita.`;
    } else if (lower.includes("terima kasih") || lower.includes("makasih") || lower.includes("thanks")) {
      reply = `Sama-sama! Kerja tim kita malam ini produktif banget. Jangan ragu kalau ada bagian yang mau diulang ya.`;
    } else if (lower.includes("paham") || lower.includes("ngerti") || lower.includes("bisa")) {
      reply = `Mantap! Kamu cepat banget nangkap materinya. Mau kita lanjutkan ke checklist berikutnya?`;
    }

    // Show simulated typing indicator
    const typingIndicator = document.getElementById("chatTypingIndicator");
    if (typingIndicator) {
      typingIndicator.classList.remove("hidden");
      this.scrollToBottom();
    }

    setTimeout(() => {
      if (typingIndicator) typingIndicator.classList.add("hidden");
      this.sendBuddyTextMessage(reply);
    }, 1800);
  },

  renderChatMessages() {
    const container = document.getElementById("discussionChatMessages");
    if (!container) return;

    const disc = window.studyBuddyStore.getActiveDiscussion();
    if (!disc || !disc.messages) {
      container.innerHTML = `<div class="text-center py-12 text-slate-400">Belum ada pesan dalam sesi diskusi ini.</div>`;
      return;
    }

    container.innerHTML = disc.messages.map(msg => {
      const isMe = msg.sender === "me";
      const alignClass = isMe ? "justify-end" : "justify-start";
      const bubbleClass = isMe 
        ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl rounded-tr-none shadow-md"
        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm";
      const textClass = isMe ? "text-indigo-100" : "text-slate-500 dark:text-slate-400";

      let contentHtml = "";

      if (msg.type === "text") {
        contentHtml = `<p class="leading-relaxed whitespace-pre-wrap text-sm md:text-base">${this.escapeHtml(msg.text)}</p>`;
      } else if (msg.type === "file") {
        contentHtml = `
          <div class="space-y-2">
            ${msg.text ? `<p class="text-sm leading-relaxed">${this.escapeHtml(msg.text)}</p>` : ""}
            <div class="flex items-center gap-3 p-3 rounded-xl ${isMe ? 'bg-indigo-800/60' : 'bg-slate-100 dark:bg-slate-700'}">
              <div class="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-500 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                ${msg.fileType || "PDF"}
              </div>
              <div class="overflow-hidden flex-1">
                <div class="font-medium text-sm truncate">${this.escapeHtml(msg.fileName)}</div>
                <div class="text-xs ${isMe ? 'text-indigo-200' : 'text-slate-400'}">${msg.fileSize || "1.2 MB"} • Tersimpan Otomatis</div>
              </div>
              <button onclick="window.StudyBuddyApp.previewFile('${this.escapeHtml(msg.fileName)}')" class="p-2 rounded-lg ${isMe ? 'hover:bg-indigo-600' : 'hover:bg-slate-200 dark:hover:bg-slate-600'} text-xs font-semibold shrink-0" title="Buka Dokumen">
                ⬇️
              </button>
            </div>
          </div>
        `;
      } else if (msg.type === "image") {
        contentHtml = `
          <div class="space-y-2">
            ${msg.text ? `<p class="text-sm leading-relaxed">${this.escapeHtml(msg.text)}</p>` : ""}
            <div class="overflow-hidden rounded-xl border ${isMe ? 'border-indigo-500' : 'border-slate-200 dark:border-slate-700'}">
              <img src="${msg.imageUrl}" alt="${this.escapeHtml(msg.imageCaption || 'Gambar Materi')}" class="w-full max-h-64 object-cover hover:scale-105 transition-transform cursor-pointer" onclick="window.StudyBuddyApp.previewImage('${msg.imageUrl}', '${this.escapeHtml(msg.imageCaption || '')}')">
              ${msg.imageCaption ? `<div class="p-2 text-xs italic ${isMe ? 'bg-indigo-800/70 text-indigo-100' : 'bg-slate-50 dark:bg-slate-900 text-slate-500'}">${this.escapeHtml(msg.imageCaption)}</div>` : ""}
            </div>
          </div>
        `;
      } else if (msg.type === "link") {
        contentHtml = `
          <div class="space-y-2">
            ${msg.text ? `<p class="text-sm leading-relaxed">${this.escapeHtml(msg.text)}</p>` : ""}
            <a href="${msg.url}" target="_blank" rel="noopener noreferrer" class="block p-3 rounded-xl ${isMe ? 'bg-indigo-800/60 hover:bg-indigo-800' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'} transition-colors group">
              <div class="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1 flex items-center gap-1">
                🔗 LINK REFERENSI
              </div>
              <div class="font-semibold text-sm group-hover:underline truncate">${this.escapeHtml(msg.urlTitle || msg.url)}</div>
              ${msg.urlDesc ? `<div class="text-xs ${isMe ? 'text-indigo-200' : 'text-slate-400'} line-clamp-2 mt-0.5">${this.escapeHtml(msg.urlDesc)}</div>` : ""}
              <div class="text-xs text-indigo-300 mt-1 truncate">${this.escapeHtml(msg.url)}</div>
            </a>
          </div>
        `;
      }

      return `
        <div class="flex items-start gap-3 ${alignClass}">
          ${!isMe ? `<img src="${msg.senderAvatar}" alt="${msg.senderName}" class="w-8 h-8 rounded-full object-cover shrink-0 mt-1 shadow-sm">` : ""}
          <div class="max-w-[85%] md:max-w-[70%]">
            <div class="flex items-center gap-2 mb-1 px-1 ${isMe ? 'justify-end' : 'justify-start'}">
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400">${isMe ? 'Kamu' : msg.senderName}</span>
              <span class="text-[10px] text-slate-400">${msg.time}</span>
            </div>
            <div class="p-3.5 ${bubbleClass}">
              ${contentHtml}
            </div>
          </div>
          ${isMe ? `<img src="${msg.senderAvatar}" alt="${msg.senderName}" class="w-8 h-8 rounded-full object-cover shrink-0 mt-1 shadow-sm">` : ""}
        </div>
      `;
    }).join("");
  },

  renderSharedAssets() {
    const disc = window.studyBuddyStore.getActiveDiscussion();
    if (!disc) return;

    // 1. Documents Tab
    const docsContainer = document.getElementById("sharedDocsList");
    if (docsContainer) {
      if (!disc.sharedDocuments || disc.sharedDocuments.length === 0) {
        docsContainer.innerHTML = `<div class="text-center py-8 text-xs text-slate-400">Belum ada dokumen yang dibagikan dalam sesi ini.</div>`;
      } else {
        docsContainer.innerHTML = disc.sharedDocuments.map(doc => `
          <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div class="flex items-center gap-3 overflow-hidden">
              <div class="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                📄
              </div>
              <div class="overflow-hidden">
                <div class="font-medium text-xs text-slate-800 dark:text-slate-200 truncate">${this.escapeHtml(doc.name)}</div>
                <div class="text-[10px] text-slate-400">${doc.size} • Oleh ${this.escapeHtml(doc.uploadedBy)}</div>
              </div>
            </div>
            <button onclick="window.StudyBuddyApp.previewFile('${this.escapeHtml(doc.name)}')" class="px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg hover:bg-indigo-100 transition-colors">
              Unduh
            </button>
          </div>
        `).join("");
      }
    }

    // 2. Links Tab
    const linksContainer = document.getElementById("sharedLinksList");
    if (linksContainer) {
      if (!disc.sharedLinks || disc.sharedLinks.length === 0) {
        linksContainer.innerHTML = `<div class="text-center py-8 text-xs text-slate-400">Belum ada tautan yang dibagikan.</div>`;
      } else {
        linksContainer.innerHTML = disc.sharedLinks.map(link => `
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">${this.escapeHtml(link.domain)}</span>
              <span class="text-[10px] text-slate-400">Oleh ${this.escapeHtml(link.sharedBy)}</span>
            </div>
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="font-medium text-xs text-indigo-600 dark:text-indigo-400 hover:underline block truncate">
              ${this.escapeHtml(link.title)}
            </a>
          </div>
        `).join("");
      }
    }

    // 3. Photos Tab
    const photosContainer = document.getElementById("sharedPhotosList");
    if (photosContainer) {
      if (!disc.sharedPhotos || disc.sharedPhotos.length === 0) {
        photosContainer.innerHTML = `<div class="text-center py-8 text-xs text-slate-400">Belum ada foto/diagram yang dibagikan.</div>`;
      } else {
        photosContainer.innerHTML = `
          <div class="grid grid-cols-2 gap-2">
            ${disc.sharedPhotos.map(photo => `
              <div class="group relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer" onclick="window.StudyBuddyApp.previewImage('${photo.url}', '${this.escapeHtml(photo.caption)}')">
                <img src="${photo.url}" alt="${this.escapeHtml(photo.caption)}" class="w-full h-24 object-cover group-hover:scale-105 transition-transform">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1.5 opacity-90">
                  <span class="text-[10px] text-white truncate">${this.escapeHtml(photo.caption)}</span>
                </div>
              </div>
            `).join("")}
          </div>
        `;
      }
    }

    // 4. Checklist
    const checklistContainer = document.getElementById("discussionChecklist");
    if (checklistContainer) {
      if (!disc.checklist || disc.checklist.length === 0) {
        checklistContainer.innerHTML = `<div class="text-xs text-slate-400 py-2">Belum ada target belajar. Tambahkan target di bawah.</div>`;
      } else {
        checklistContainer.innerHTML = disc.checklist.map(item => `
          <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors text-xs">
            <input type="checkbox" ${item.done ? "checked" : ""} onchange="window.studyBuddyStore.toggleChecklistItem('${item.id}'); window.DiscussionController.renderSharedAssets();" class="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4">
            <span class="${item.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300 font-medium'}">${this.escapeHtml(item.task)}</span>
          </label>
        `).join("");
      }
    }
  },

  scrollToBottom() {
    const container = document.getElementById("discussionChatMessages");
    if (container) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 50);
    }
  },

  escapeHtml(text) {
    if (!text) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  // 3. Web Audio API Lo-Fi & Pomodoro Beeper (Zero external assets needed!)
  toggleAmbientSound() {
    if (this.isAmbientPlaying) {
      this.stopAmbientSound();
    } else {
      this.playAmbientSound();
    }
  },

  playAmbientSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!this.audioContext) this.audioContext = new AudioContext();

      // Create a soothing pink-noise/binaural generator for study concentration
      const bufferSize = this.audioContext.sampleRate * 2;
      const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.audioContext.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter to simulate soft coffee shop / rain study ambiance
      const filter = this.audioContext.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 650;

      const gain = this.audioContext.createGain();
      gain.gain.value = 0.15;

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioContext.destination);

      whiteNoise.start(0);
      this.ambientNode = { source: whiteNoise, gain: gain };
      this.isAmbientPlaying = true;

      const btn = document.getElementById("ambientAudioToggleBtn");
      if (btn) btn.innerHTML = `🎧 Ambience: Aktif (Soft Rain)`;
    } catch (e) {
      console.warn("Web Audio not supported or blocked:", e);
    }
  },

  stopAmbientSound() {
    if (this.ambientNode && this.ambientNode.source) {
      try {
        this.ambientNode.source.stop();
      } catch (e) {}
      this.ambientNode = null;
    }
    this.isAmbientPlaying = false;
    const btn = document.getElementById("ambientAudioToggleBtn");
    if (btn) btn.innerHTML = `🎧 Play Ambience Belajar`;
  },

  // 4. Pomodoro Focus Timer
  togglePomodoro() {
    if (this.pomodoroIsRunning) {
      this.pausePomodoro();
    } else {
      this.startPomodoro();
    }
  },

  startPomodoro() {
    this.pomodoroIsRunning = true;
    const btn = document.getElementById("pomodoroToggleBtn");
    if (btn) btn.textContent = "Jeda";

    this.pomodoroInterval = setInterval(() => {
      if (this.pomodoroSecondsLeft > 0) {
        this.pomodoroSecondsLeft--;
        this.updatePomodoroDisplay();
      } else {
        this.pausePomodoro();
        this.playBeepNotification();
        alert("Waktu Pomodoro Belajar Selesai! Saatnya istirahat 5 menit bareng Study Buddy.");
        this.pomodoroSecondsLeft = 5 * 60; // 5 min break
        this.updatePomodoroDisplay();
      }
    }, 1000);
  },

  pausePomodoro() {
    this.pomodoroIsRunning = false;
    if (this.pomodoroInterval) clearInterval(this.pomodoroInterval);
    const btn = document.getElementById("pomodoroToggleBtn");
    if (btn) btn.textContent = "Mulai";
  },

  resetPomodoro() {
    this.pausePomodoro();
    this.pomodoroSecondsLeft = 25 * 60;
    this.updatePomodoroDisplay();
  },

  updatePomodoroDisplay() {
    const el = document.getElementById("pomodoroTimeDisplay");
    if (!el) return;
    const m = Math.floor(this.pomodoroSecondsLeft / 60);
    const s = this.pomodoroSecondsLeft % 60;
    el.textContent = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  },

  playBeepNotification() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch(e) {}
  },

  setupAutoReply() {
    // Handled in triggerBuddyAutoResponse
  }
};

window.DiscussionController = DiscussionController;
