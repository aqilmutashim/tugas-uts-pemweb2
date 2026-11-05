// ==========================================
// STUDY BUDDY - MAIN APPLICATION CONTROLLER
// ==========================================

const StudyBuddyApp = {
  currentPage: "home",
  selectedRating: 5,
  activeHistoryDetailRecord: null,

  init() {
    // 1. Check Theme preference
    this.applyTheme(window.studyBuddyStore.state.settings?.theme || "light");

    // 2. Setup hash routing
    window.addEventListener("hashchange", () => this.handleHashChange());
    const initialHash = window.location.hash.replace("#", "") || "home";

    // 3. Populate form templates
    this.populateCriteriaSubjectCheckboxes();

    // 4. Subscribe to Store updates
    window.studyBuddyStore.subscribe(() => {
      this.updateNavbarBadges();
      if (this.currentPage === "home") this.renderHomePage();
      if (this.currentPage === "discussion") this.renderDiscussionPage();
      if (this.currentPage === "profile") this.renderProfilePage();
      if (this.currentPage === "history") this.renderHistoryPage();
    });

    // 5. Initial route
    this.navigateTo(initialHash);
    this.updateNavbarUserInfo();
    this.updateNavbarBadges();

    // Init Discussion Controller
    window.DiscussionController.init();
  },

  handleHashChange() {
    const page = window.location.hash.replace("#", "") || "home";
    this.navigateTo(page);
  },

  navigateTo(pageName) {
    if (!window.studyBuddyStore.isLoggedIn() && pageName !== "login") {
      pageName = "login";
    }

    this.currentPage = pageName;
    window.location.hash = pageName;

    // Hide all view sections
    document.querySelectorAll(".page-view").forEach(el => el.classList.add("hidden"));

    // Show target section
    const target = document.getElementById(`view-${pageName}`);
    if (target) {
      target.classList.remove("hidden");
    }

    // Update nav active states
    document.querySelectorAll(".nav-item").forEach(btn => {
      const p = btn.getAttribute("data-page");
      if (p === pageName) {
        btn.classList.add("bg-indigo-50", "text-indigo-600", "dark:bg-indigo-950", "dark:text-indigo-400");
        btn.classList.remove("text-slate-600", "dark:text-slate-300");
      } else {
        btn.classList.remove("bg-indigo-50", "text-indigo-600", "dark:bg-indigo-950", "dark:text-indigo-400");
        btn.classList.add("text-slate-600", "dark:text-slate-300");
      }
    });

    // Trigger page-specific renders
    if (pageName === "home") this.renderHomePage();
    else if (pageName === "request-match") this.renderRequestMatchPage();
    else if (pageName === "create-criteria") this.renderCreateCriteriaPage();
    else if (pageName === "discussion") this.renderDiscussionPage();
    else if (pageName === "profile") this.renderProfilePage();
    else if (pageName === "history") this.renderHistoryPage();
    else if (pageName === "settings") this.renderSettingsPage();

    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  // ================= NAVBAR & COMMON =================
  updateNavbarUserInfo() {
    const user = window.studyBuddyStore.getCurrentUser();
    if (!user) return;

    const navAvatar = document.getElementById("navUserAvatar");
    const navName = document.getElementById("navUserName");
    const dropdownName = document.getElementById("dropdownUserName");
    const dropdownMajor = document.getElementById("dropdownUserMajor");
    const heroName = document.getElementById("homeHeroUserName");

    if (navAvatar) navAvatar.src = user.avatar;
    if (navName) navName.textContent = user.name;
    if (dropdownName) dropdownName.textContent = user.name;
    if (dropdownMajor) dropdownMajor.textContent = user.major;
    if (heroName) heroName.textContent = user.name.split(" ")[0];
  },

  updateNavbarBadges() {
    const pendingReqs = window.studyBuddyStore.getIncomingRequests();
    const badge = document.getElementById("incomingBadgeCount");
    const homeBadge = document.getElementById("homeIncomingCountBadge");

    if (badge) {
      if (pendingReqs.length > 0) {
        badge.textContent = pendingReqs.length;
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
    }

    if (homeBadge) {
      homeBadge.textContent = `${pendingReqs.length} Menunggu`;
    }

    const disc = window.studyBuddyStore.getActiveDiscussion();
    const liveBadge = document.getElementById("navDiscussionLiveBadge");
    const homeBanner = document.getElementById("homeActiveDiscussionBanner");

    if (liveBadge) {
      if (disc && disc.isActive) liveBadge.classList.remove("hidden");
      else liveBadge.classList.add("hidden");
    }

    if (homeBanner) {
      if (disc && disc.isActive) {
        homeBanner.classList.remove("hidden");
        const bAvatar = document.getElementById("homeActiveBuddyAvatar");
        const bName = document.getElementById("homeActiveBuddyName");
        const bTopic = document.getElementById("homeActiveTopic");
        if (bAvatar) bAvatar.src = disc.buddyAvatar;
        if (bName) bName.textContent = disc.buddyName;
        if (bTopic) bTopic.textContent = disc.topic;
      } else {
        homeBanner.classList.add("hidden");
      }
    }
  },

  toggleUserDropdown() {
    const menu = document.getElementById("userDropdownMenu");
    if (menu) menu.classList.toggle("hidden");
  },

  toggleMobileMenu() {
    const drawer = document.getElementById("mobileMenuDrawer");
    if (drawer) drawer.classList.toggle("hidden");
  },

  toggleTheme() {
    const isDark = document.documentElement.classList.toggle("dark");
    const theme = isDark ? "dark" : "light";
    window.studyBuddyStore.updateSettings({ theme });
    this.showToast("Tema Diubah", `Beralih ke mode ${theme === "dark" ? "gelap" : "terang"}`);
  },

  applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },

  // ================= 1. HOME PAGE CONTROLLER =================
  renderHomePage() {
    this.updateNavbarUserInfo();
    this.updateNavbarBadges();

    // Render incoming requests snippet on home
    const incomingContainer = document.getElementById("homeIncomingRequestsList");
    if (incomingContainer) {
      const reqs = window.studyBuddyStore.getIncomingRequests();
      if (reqs.length === 0) {
        incomingContainer.innerHTML = `
          <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <div class="text-3xl mb-2">🎉</div>
            <p class="text-xs text-slate-500 font-medium">Tidak ada permintaan match yang tertunda saat ini.</p>
            <button onclick="window.StudyBuddyApp.simulateIncomingRequest()" class="mt-3 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline">
              + Simulasi Permintaan Baru
            </button>
          </div>
        `;
      } else {
        incomingContainer.innerHTML = reqs.map(req => `
          <div class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-600 transition-all space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <img src="${req.senderAvatar}" alt="${req.senderName}" class="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30">
                <div>
                  <h4 class="font-bold text-sm text-slate-800 dark:text-slate-100">${req.senderName}</h4>
                  <p class="text-[11px] text-slate-400">${req.senderMajor}</p>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold ${MatchmakingEngine.formatScoreBadge(req.matchScore).colorClass}">
                ${req.matchScore}% Cocok
              </span>
            </div>

            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
              <div class="font-semibold text-slate-700 dark:text-slate-300">📖 ${req.subject}</div>
              <div class="text-[11px] text-slate-500 line-clamp-1">🎯 Topik: ${req.topic}</div>
              <div class="text-[11px] text-indigo-600 dark:text-indigo-400">⏰ Waktu: ${req.proposedTime}</div>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <button onclick="window.StudyBuddyApp.rejectRequestFromCard('${req.id}')" class="flex-1 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                Tolak
              </button>
              <button onclick="window.StudyBuddyApp.acceptRequestFromCard('${req.id}')" class="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors">
                Terima & Diskusi
              </button>
            </div>
          </div>
        `).join("");
      }
    }

    // Render history match on homepage (Requirement 6: "pengguna dapat melihat history match di homepage")
    const histContainer = document.getElementById("homeMatchHistoryList");
    if (histContainer) {
      const historyList = window.studyBuddyStore.getStudyHistory();
      if (historyList.length === 0) {
        histContainer.innerHTML = `<div class="p-6 rounded-2xl bg-white dark:bg-slate-800 text-center text-xs text-slate-400">Belum ada riwayat sesi belajar yang tersimpan.</div>`;
      } else {
        histContainer.innerHTML = historyList.slice(0, 3).map(item => `
          <div class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-start gap-3.5">
              <img src="${item.buddyAvatar}" alt="${item.buddyName}" class="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/20 shrink-0">
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="font-bold text-sm text-slate-800 dark:text-slate-100">${item.buddyName}</h4>
                  <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">${item.subject}</span>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">${item.topic}</p>
                <div class="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                  <span>📅 ${item.date}</span>
                  <span>⏱️ ${item.duration}</span>
                  <span>💬 ${item.chatCount} Chat</span>
                  <span>📁 ${item.docCount} Dok</span>
                </div>
              </div>
            </div>
            <button onclick="window.StudyBuddyApp.openHistoryDetailModal('${item.id}')" class="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-bold text-xs text-slate-700 dark:text-slate-200 transition-colors shrink-0">
              Buka Arsip Sesi
            </button>
          </div>
        `).join("");
      }
    }
  },

  // ================= 2. REQUEST MATCH CONTROLLER =================
  renderRequestMatchPage() {
    this.handleSearchMatches();
  },

  handleSearchMatches(e) {
    if (e) e.preventDefault();

    const subject = document.getElementById("reqSubjectSelect")?.value || "Semua Pelajaran";
    const topic = document.getElementById("reqTopicInput")?.value || "";
    const mode = document.getElementById("reqModeSelect")?.value || "both";
    const meetupTime = document.getElementById("reqMeetupTimeInput")?.value || "";
    const meetupLocation = document.getElementById("reqLocationInput")?.value || "";
    const level = document.getElementById("reqLevelSelect")?.value || "Semua Level";

    const query = { subject, topic, mode, meetupTime, meetupLocation, level };
    const candidates = window.studyBuddyStore.state.availableBuddies || [];
    const matchedResults = MatchmakingEngine.findMatches(query, candidates);

    const container = document.getElementById("matchSearchResultsGrid");
    const subtitle = document.getElementById("matchResultsSubtitle");
    if (subtitle) {
      subtitle.textContent = `Menampilkan ${matchedResults.length} mahasiswa dengan kecocokan tertinggi untuk kriteria ini`;
    }

    if (!container) return;

    if (matchedResults.length === 0) {
      container.innerHTML = `<div class="col-span-full py-12 text-center text-slate-400">Tidak ada teman belajar yang cocok dengan filter kriteria tersebut.</div>`;
      return;
    }

    container.innerHTML = matchedResults.map(buddy => {
      const badge = MatchmakingEngine.formatScoreBadge(buddy.matchScore);
      return `
        <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-lg hover:border-indigo-400 transition-all flex flex-col justify-between space-y-4">
          
          <!-- Top Buddy Header -->
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-3">
                <img src="${buddy.avatar}" alt="${buddy.name}" class="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/30">
                <div>
                  <h3 class="font-extrabold text-sm text-slate-800 dark:text-slate-100">${buddy.name}</h3>
                  <p class="text-xs text-indigo-600 dark:text-indigo-400 font-medium">${buddy.major}</p>
                  <p class="text-[10px] text-slate-400">${buddy.university}</p>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-black ${badge.colorClass} shadow-sm shrink-0">
                ${badge.label}
              </span>
            </div>

            <!-- Bio -->
            <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              "${buddy.bio}"
            </p>

            <!-- Matching Reasons (Why this buddy matches) -->
            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700/60 space-y-1">
              <div class="text-[10px] font-bold uppercase text-slate-400">Alasan Kecocokan:</div>
              <ul class="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                ${(buddy.matchingReasons || []).slice(0, 2).map(r => `<li class="flex items-center gap-1"><span>✨</span> <span class="truncate">${r}</span></li>`).join("")}
              </ul>
            </div>

            <!-- Criteria Details -->
            <div class="space-y-1 text-xs">
              <div class="text-[11px] text-slate-400">Mata Pelajaran:</div>
              <div class="flex flex-wrap gap-1">
                ${(buddy.criteria.subjects || []).map(s => `<span class="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold">${s}</span>`).join("")}
              </div>
              <div class="text-[11px] text-slate-400 mt-1">Jadwal & Lokasi:</div>
              <div class="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                ⏰ ${(buddy.criteria.availability || []).slice(0, 2).join(", ")}
              </div>
              <div class="text-[11px] text-slate-500">
                📍 ${buddy.criteria.meetupLocation}
              </div>
            </div>
          </div>

          <!-- Action Button: Kirim Match Request -->
          <button onclick="window.StudyBuddyApp.sendMatchRequestToBuddy('${buddy.id}', '${buddy.name}', '${buddy.avatar}')" class="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2">
            <span>🤝 Kirim Match Request</span>
          </button>

        </div>
      `;
    }).join("");
  },

  sendMatchRequestToBuddy(buddyId, buddyName, buddyAvatar) {
    const subject = document.getElementById("reqSubjectSelect")?.value || "Pemrograman Web";
    const topic = document.getElementById("reqTopicInput")?.value || "Diskusi Materi Kuliah & Tugas";
    const meetupTime = document.getElementById("reqMeetupTimeInput")?.value || "Malam ini, 19:30 WIB";

    // Play sound notification
    window.DiscussionController.playBeepNotification();

    this.showToast(
      "Match Request Terkirim!",
      `Permintaan match telah dikirim ke ${buddyName} untuk topik ${subject}.`
    );

    // Prompt user to simulate instant acceptance for presentation demo
    setTimeout(() => {
      const instantAccept = confirm(
        `[SIMULASI STUDY BUDDY]\n\n${buddyName} menyukai kriteriamu dan bersedia matching!\n\nApakah kamu ingin langsung membuka mode diskusi bersama ${buddyName}?`
      );
      if (instantAccept) {
        // Create active discussion with this buddy
        window.studyBuddyStore.state.activeDiscussion = {
          sessionId: "session_" + Date.now(),
          buddyId: buddyId,
          buddyName: buddyName,
          buddyAvatar: buddyAvatar,
          buddyStatus: "Online",
          subject: subject,
          topic: topic,
          mode: "Online Discussion Room",
          startedAt: new Date().toISOString(),
          isActive: true,
          messages: [
            {
              id: "msg_init_auto",
              sender: "buddy",
              senderName: buddyName,
              senderAvatar: buddyAvatar,
              type: "text",
              text: `Halo! Permintaan match belajarmu sudah kuterima. Senang bisa belajar ${subject} bareng kamu. Mari kita mulai diskusinya!`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ],
          sharedNotes: `# Catatan Diskusi: ${subject}\n**Topik**: ${topic}\n**Peserta**: ${window.studyBuddyStore.getCurrentUser().name} & ${buddyName}\n\n---\n\n### Rangkuman & Pembahasan:\n`,
          sharedDocuments: [],
          sharedLinks: [],
          sharedPhotos: [],
          checklist: [
            { id: "chk_1", task: `Review materi ${topic}`, done: false },
            { id: "chk_2", task: "Bahas latihan soal bersama", done: false }
          ]
        };
        window.studyBuddyStore.saveState();
        this.navigateTo("discussion");
      }
    }, 800);
  },

  // ================= 3. CREATE CRITERIA CONTROLLER =================
  populateCriteriaSubjectCheckboxes() {
    const container = document.getElementById("criteriaSubjectCheckboxes");
    if (!container) return;

    const subjects = window.studyBuddyStore.state.subjectCategories.filter(s => s !== "Semua Pelajaran");
    const userSubjects = window.studyBuddyStore.getCurrentUser().criteria?.subjects || [];

    container.innerHTML = subjects.map(s => {
      const isChecked = userSubjects.includes(s) ? "checked" : "";
      return `
        <label class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 cursor-pointer hover:border-indigo-500 transition-colors text-xs">
          <input type="checkbox" name="critSubjects" value="${s}" ${isChecked} class="rounded text-indigo-600 focus:ring-indigo-500">
          <span class="font-medium text-slate-700 dark:text-slate-300 truncate">${s}</span>
        </label>
      `;
    }).join("");
  },

  renderCreateCriteriaPage() {
    const user = window.studyBuddyStore.getCurrentUser();
    const criteria = user.criteria || {};

    const openCheck = document.getElementById("critIsOpenCheckbox");
    const topicsArea = document.getElementById("critTopicsTextarea");
    const modeSelect = document.getElementById("critModeSelect");
    const levelSelect = document.getElementById("critLevelSelect");
    const availInput = document.getElementById("critAvailabilityInput");
    const locInput = document.getElementById("critLocationInput");
    const styleSelect = document.getElementById("critStyleSelect");
    const goalsInput = document.getElementById("critGoalsInput");

    if (openCheck) openCheck.checked = criteria.isOpenForMatching !== false;
    if (topicsArea) topicsArea.value = criteria.topics || "";
    if (modeSelect) modeSelect.value = criteria.mode || "both";
    if (levelSelect) levelSelect.value = criteria.level || "Menengah";
    if (availInput) availInput.value = (criteria.availability || []).join(", ");
    if (locInput) locInput.value = criteria.meetupLocation || "";
    if (styleSelect) styleSelect.value = criteria.learningStyle || "Praktik Langsung & Bahas Latihan Soal";
    if (goalsInput) goalsInput.value = criteria.goals || "";

    this.populateCriteriaSubjectCheckboxes();
  },

  handleSaveCriteria(e) {
    if (e) e.preventDefault();

    const selectedSubjects = Array.from(document.querySelectorAll("input[name='critSubjects']:checked")).map(el => el.value);
    const topics = document.getElementById("critTopicsTextarea")?.value || "";
    const mode = document.getElementById("critModeSelect")?.value || "both";
    const level = document.getElementById("critLevelSelect")?.value || "Menengah";
    const availabilityRaw = document.getElementById("critAvailabilityInput")?.value || "";
    const availability = availabilityRaw.split(/[,;]+/).map(s => s.trim()).filter(Boolean);
    const meetupLocation = document.getElementById("critLocationInput")?.value || "";
    const learningStyle = document.getElementById("critStyleSelect")?.value || "";
    const goals = document.getElementById("critGoalsInput")?.value || "";
    const isOpenForMatching = document.getElementById("critIsOpenCheckbox")?.checked ?? true;

    if (selectedSubjects.length === 0) {
      alert("Harap pilih minimal 1 mata pelajaran!");
      return;
    }

    window.studyBuddyStore.updateUserCriteria({
      subjects: selectedSubjects,
      topics,
      mode,
      level,
      availability,
      meetupLocation,
      learningStyle,
      goals,
      isOpenForMatching
    });

    this.showToast("Kriteria Berhasil Disimpan!", "Profil kriteriamu kini aktif dan dapat dicocokkan oleh pengguna lain.");
    this.navigateTo("profile");
  },

  // ================= 4. POP-UP ACCEPT / REJECT MATCH REQUEST (Concept #3 & Page 4) =================
  openIncomingRequestsModal() {
    const modal = document.getElementById("modalIncomingRequests");
    const content = document.getElementById("modalRequestsContent");
    if (!modal || !content) return;

    const reqs = window.studyBuddyStore.getIncomingRequests();

    if (reqs.length === 0) {
      content.innerHTML = `
        <div class="text-center py-10 space-y-3">
          <div class="text-4xl">📭</div>
          <h4 class="font-bold text-base text-slate-800 dark:text-slate-100">Tidak Ada Permintaan Baru</h4>
          <p class="text-xs text-slate-400">Saat ini belum ada pengguna lain yang mengirimkan match request kepadamu.</p>
          <button onclick="window.StudyBuddyApp.simulateIncomingRequest()" class="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors">
            ⚡ Kirim Simulasi Request Masuk
          </button>
        </div>
      `;
    } else {
      content.innerHTML = reqs.map(req => `
        <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm">
          
          <!-- Requester Header -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <img src="${req.senderAvatar}" alt="${req.senderName}" class="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/40">
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="font-extrabold text-base text-slate-800 dark:text-slate-100">${req.senderName}</h4>
                  <span class="text-xs font-bold text-amber-500">⭐ ${req.senderRating}</span>
                </div>
                <p class="text-xs text-indigo-600 dark:text-indigo-400 font-medium">${req.senderMajor}</p>
                <p class="text-[10px] text-slate-400">Mengajukan ${req.timestamp}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="px-3 py-1 rounded-full text-xs font-black ${MatchmakingEngine.formatScoreBadge(req.matchScore).colorClass} shadow-sm">
                ${req.matchScore}% Match
              </span>
            </div>
          </div>

          <!-- Request Note / Message -->
          <div class="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs italic text-slate-600 dark:text-slate-300">
            "${req.note}"
          </div>

          <!-- Matching Details -->
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="p-2 rounded-lg bg-white dark:bg-slate-800">
              <span class="text-[10px] text-slate-400 block">Pelajaran & Topik:</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">${req.subject} (${req.topic})</span>
            </div>
            <div class="p-2 rounded-lg bg-white dark:bg-slate-800">
              <span class="text-[10px] text-slate-400 block">Waktu & Tempat:</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">${req.proposedTime} • ${req.meetupLocation}</span>
            </div>
          </div>

          <!-- Matching Reasons -->
          <div class="space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kesesuaian Kriteria:</span>
            <ul class="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
              ${(req.matchingReasons || []).map(r => `<li class="flex items-center gap-1.5"><span class="text-emerald-500">✓</span> ${r}</li>`).join("")}
            </ul>
          </div>

          <!-- Action Buttons: Accept / Reject -->
          <div class="flex items-center gap-3 pt-2">
            <button onclick="window.StudyBuddyApp.rejectIncomingRequest('${req.id}')" class="flex-1 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 font-bold text-xs transition-colors">
              ✕ Tolak Permintaan
            </button>
            <button onclick="window.StudyBuddyApp.acceptIncomingRequest('${req.id}')" class="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5">
              ✓ Terima & Mulai Diskusi
            </button>
          </div>

        </div>
      `).join("");
    }

    modal.classList.remove("hidden");
  },

  closeIncomingRequestsModal() {
    const modal = document.getElementById("modalIncomingRequests");
    if (modal) modal.classList.add("hidden");
  },

  acceptIncomingRequest(requestId) {
    const disc = window.studyBuddyStore.acceptRequest(requestId);
    this.closeIncomingRequestsModal();
    if (disc) {
      this.showToast(
        "Match Diterima!",
        `Kamu dan ${disc.buddyName} sekarang berada di Mode Diskusi Aktif tanpa batas waktu.`
      );
      this.navigateTo("discussion");
    }
  },

  rejectIncomingRequest(requestId) {
    window.studyBuddyStore.rejectRequest(requestId);
    this.showToast("Permintaan Ditolak", "Permintaan match telah dihapus dari daftar masuk.");
    this.openIncomingRequestsModal();
  },

  acceptRequestFromCard(requestId) {
    this.acceptIncomingRequest(requestId);
  },

  rejectRequestFromCard(requestId) {
    window.studyBuddyStore.rejectRequest(requestId);
    this.showToast("Permintaan Ditolak", "Permintaan match telah ditolak.");
    this.renderHomePage();
  },

  simulateIncomingRequest() {
    const pool = [
      {
        requesterId: "buddy_fauzan",
        senderName: "Fauzan Nugraha",
        senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        senderMajor: "Teknik Elektro - UGM",
        senderRating: 4.7,
        subject: "Kalkulus II",
        topic: "Latihan Soal Ujian Integral Lipat Dua",
        proposedTime: "Malam ini, 20:00 WIB",
        mode: "Online Discussion Room",
        meetupLocation: "Study Buddy Virtual Room",
        matchScore: 95,
        matchingReasons: [
          "Sama-sama mengambil mata pelajaran Kalkulus II",
          "Ketersediaan jadwal cocok di malam hari",
          "Rating belajar tinggi dan saling melengkapi"
        ],
        note: "Halo Aqil! Aku lagi persiapan latihan soal integral lipat untuk ujian minggu depan. Mau belajar dan diskusikan pembahasannya bareng?"
      },
      {
        requesterId: "buddy_clara",
        senderName: "Clara Wijaya",
        senderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        senderMajor: "DKV & UI/UX - Binus",
        senderRating: 5.0,
        subject: "UI/UX Design",
        topic: "Review Heuristic & Design System Component",
        proposedTime: "Besok Sore, 16:00 WIB",
        mode: "Online / Meetup Senopati",
        meetupLocation: "Online Discussion Room",
        matchScore: 98,
        matchingReasons: [
          "Mendalami materi UI/UX & Web Frontend",
          "Metode belajar review portofolio dan studi kasus",
          "Rating sempurna 5.0⭐"
        ],
        note: "Hai Aqil! Tertarik sharing knowledge desain UI dan kode frontend bareng di Study Buddy?"
      }
    ];

    const pick = pool[Math.floor(Math.random() * pool.length)];
    window.studyBuddyStore.addIncomingRequest(pick);

    window.DiscussionController.playBeepNotification();
    this.showToast("🔔 Permintaan Match Baru Masuk!", `${pick.senderName} mengirim match request untuk ${pick.subject}`);

    // Automatically trigger the Pop-up modal! (Page 4 requirement)
    setTimeout(() => {
      this.openIncomingRequestsModal();
    }, 400);
  },

  // ================= 5. DISCUSSION PAGE CONTROLLER (Page 5 & Concept #4 & #5) =================
  renderDiscussionPage() {
    const disc = window.studyBuddyStore.getActiveDiscussion();
    if (!disc || !disc.isActive) {
      const container = document.getElementById("view-discussion");
      if (container) {
        container.innerHTML = `
          <div class="max-w-xl mx-auto py-16 text-center space-y-4">
            <div class="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl mx-auto shadow-sm">
              💬
            </div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Tidak Ada Sesi Diskusi Aktif</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              Kamu sedang tidak berada dalam mode diskusi. Mulailah dengan melakukan <strong>Request Match</strong> atau menerima <strong>Permintaan Match Masuk</strong>.
            </p>
            <div class="flex items-center justify-center gap-3 pt-2">
              <button onclick="window.StudyBuddyApp.navigateTo('request-match')" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md">
                🔍 Cari Teman Belajar
              </button>
              <button onclick="window.StudyBuddyApp.openIncomingRequestsModal()" class="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs">
                📬 Cek Permintaan Masuk
              </button>
            </div>
          </div>
        `;
      }
      return;
    }

    // Populate header info
    const bAvatar = document.getElementById("discBuddyAvatar");
    const bName = document.getElementById("discBuddyName");
    const pill = document.getElementById("discSubjectPill");
    const topicText = document.getElementById("discTopicText");
    const typingName = document.getElementById("typingBuddyName");

    if (bAvatar) bAvatar.src = disc.buddyAvatar;
    if (bName) bName.textContent = disc.buddyName;
    if (pill) pill.textContent = disc.subject;
    if (topicText) topicText.textContent = disc.topic;
    if (typingName) typingName.textContent = disc.buddyName.split(" ")[0];

    // Populate shared notes editor
    const notesEditor = document.getElementById("sharedNotesEditor");
    if (notesEditor) {
      notesEditor.value = disc.sharedNotes || "";
    }

    // Render Chat & Assets
    window.DiscussionController.renderChatMessages();
    window.DiscussionController.renderSharedAssets();
    window.DiscussionController.startSessionTimer();
  },

  handleSendChatMessage(e) {
    if (e) e.preventDefault();
    const input = document.getElementById("chatMessageInput");
    if (!input || !input.value.trim()) return;
    window.DiscussionController.sendTextMessage(input.value);
    input.value = "";
  },

  handleNotesChange(e) {
    const text = e.target.value;
    window.studyBuddyStore.updateSharedNotes(text);
  },

  handleAddChecklistItem(e) {
    if (e) e.preventDefault();
    const input = document.getElementById("newChecklistInput");
    if (!input || !input.value.trim()) return;
    window.studyBuddyStore.addChecklistItem(input.value.trim());
    input.value = "";
    window.DiscussionController.renderSharedAssets();
  },

  switchDiscussionTab(tabName) {
    ["notes", "assets", "pomodoro"].forEach(t => {
      const btn = document.getElementById(`discTabBtn-${t}`);
      const content = document.getElementById(`discTabContent-${t}`);
      if (t === tabName) {
        if (btn) {
          btn.classList.add("bg-white", "dark:bg-slate-700", "text-indigo-600", "dark:text-indigo-400", "font-bold", "shadow-sm");
          btn.classList.remove("text-slate-500", "font-semibold");
        }
        if (content) content.classList.remove("hidden");
      } else {
        if (btn) {
          btn.classList.remove("bg-white", "dark:bg-slate-700", "text-indigo-600", "dark:text-indigo-400", "font-bold", "shadow-sm");
          btn.classList.add("text-slate-500", "font-semibold");
        }
        if (content) content.classList.add("hidden");
      }
    });
  },

  // Attachment Modals
  openAttachDocumentModal() {
    document.getElementById("modalAttachDoc")?.classList.remove("hidden");
  },
  openAttachLinkModal() {
    document.getElementById("modalAttachLink")?.classList.remove("hidden");
  },
  openAttachPhotoModal() {
    document.getElementById("modalAttachPhoto")?.classList.remove("hidden");
  },
  closeAttachModals() {
    document.getElementById("modalAttachDoc")?.classList.add("hidden");
    document.getElementById("modalAttachLink")?.classList.add("hidden");
    document.getElementById("modalAttachPhoto")?.classList.add("hidden");
  },

  submitAttachDoc() {
    const name = document.getElementById("docUploadNameInput")?.value || "Materi_Belajar_Bersama.pdf";
    const caption = document.getElementById("docUploadCaptionInput")?.value || "";
    window.DiscussionController.sendFileMessage({
      name,
      caption,
      size: "2.1 MB",
      type: name.endsWith(".pdf") ? "pdf" : "doc"
    });
    this.closeAttachModals();
    this.showToast("Dokumen Terkirim!", "Dokumen otomatis masuk ke daftar berkas bersama dan tersimpan ke arsip.");
  },

  submitAttachLink() {
    const url = document.getElementById("linkUploadUrlInput")?.value || "https://developer.mozilla.org";
    const title = document.getElementById("linkUploadTitleInput")?.value || "Dokumentasi & Referensi Belajar";
    window.DiscussionController.sendLinkMessage({ url, title });
    this.closeAttachModals();
    this.showToast("Link Terkirim!", "Tautan referensi tersimpan di arsip.");
  },

  submitAttachPhoto() {
    const url = document.getElementById("photoPresetSelect")?.value;
    const caption = document.getElementById("photoCaptionInput")?.value || "Foto pembahasan materi";
    window.DiscussionController.sendImageMessage({ url, caption });
    this.closeAttachModals();
    this.showToast("Foto Terkirim!", "Foto materi berhasil dibagikan.");
  },

  previewImage(url, caption) {
    const modal = document.getElementById("modalImageLightbox");
    const img = document.getElementById("lightboxImage");
    const cap = document.getElementById("lightboxCaption");
    if (modal && img) {
      img.src = url;
      if (cap) cap.textContent = caption || "";
      modal.classList.remove("hidden");
    }
  },

  previewFile(fileName) {
    alert(`[Simulasi Download]\nMengunduh dokumen: "${fileName}"\nDokumen ini aman dan telah diarsipkan secara permanen.`);
  },

  // AKHIRI MODE DISKUSI (Concept #4 & #5: Simpan otomatis semua aset)
  openEndDiscussionModal() {
    const modal = document.getElementById("modalEndDiscussion");
    if (modal) modal.classList.remove("hidden");
    this.selectedRating = 5;
    this.updateRatingStars();
  },

  closeEndDiscussionModal() {
    const modal = document.getElementById("modalEndDiscussion");
    if (modal) modal.classList.add("hidden");
  },

  setModalRating(val) {
    this.selectedRating = val;
    this.updateRatingStars();
  },

  updateRatingStars() {
    const group = document.getElementById("ratingStarsGroup");
    if (!group) return;
    const stars = group.querySelectorAll("span");
    stars.forEach((s, idx) => {
      s.style.opacity = idx < this.selectedRating ? "1" : "0.3";
    });
  },

  confirmEndDiscussion() {
    const reviewNote = document.getElementById("endSessionReviewInput")?.value || "Sesi belajar sangat kondusif, interaktif, dan materi tersampaikan tuntas!";
    const archived = window.studyBuddyStore.endDiscussion(this.selectedRating, reviewNote);
    this.closeEndDiscussionModal();

    if (archived) {
      this.showToast(
        "Sesi Selesai & Diarsipkan Otomatis!",
        `Semua chat, dokumen (${archived.docCount}), link (${archived.linkCount}), dan foto (${archived.photoCount}) telah disimpan ke Riwayat.`
      );
      this.navigateTo("history");
    }
  },

  // ================= 6. PROFILE PAGE CONTROLLER =================
  renderProfilePage() {
    const user = window.studyBuddyStore.getCurrentUser();
    if (!user) return;

    // Header info
    document.getElementById("profileUserAvatar").src = user.avatar;
    document.getElementById("profileUserName").textContent = user.name;
    document.getElementById("profileUserMajor").textContent = `${user.major} • ${user.university}`;
    document.getElementById("profileUserBio").textContent = user.bio;

    // Stats
    document.getElementById("statStudyHours").textContent = user.studyHours;
    document.getElementById("statSessionsCount").textContent = user.sessionsCount;
    document.getElementById("statRating").textContent = `${user.rating} ⭐`;
    document.getElementById("statReviewsCount").textContent = user.reviewsCount;

    // Badges
    const badgeContainer = document.getElementById("profileBadgesContainer");
    if (badgeContainer) {
      badgeContainer.innerHTML = (user.badges || []).map(b => `
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <span>${b.icon}</span> ${b.name}
        </span>
      `).join("");
    }

    // Active Criteria display in profile (Requirement 2)
    const crit = user.criteria || {};
    const openBadge = document.getElementById("profileIsOpenBadge");
    if (openBadge) {
      if (crit.isOpenForMatching !== false) {
        openBadge.textContent = "Aktif Dicari Pengguna Lain";
        openBadge.className = "text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
      } else {
        openBadge.textContent = "Pencarian Nonaktif";
        openBadge.className = "text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
      }
    }

    const subContainer = document.getElementById("profileCriteriaSubjects");
    if (subContainer) {
      subContainer.innerHTML = (crit.subjects || []).map(s => `
        <span class="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">${s}</span>
      `).join("");
    }

    const topElem = document.getElementById("profileCriteriaTopics");
    if (topElem) topElem.textContent = crit.topics || "Belum ada topik spesifik";

    const availElem = document.getElementById("profileCriteriaAvailability");
    if (availElem) {
      availElem.innerHTML = (crit.availability || []).map(a => `
        <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px]">${a}</span>
      `).join("");
    }

    const locElem = document.getElementById("profileCriteriaLocation");
    if (locElem) locElem.textContent = `${crit.mode === 'online' ? 'Online Saja' : crit.mode === 'offline' ? 'Offline Meetup' : 'Online & Offline'} (${crit.meetupLocation || 'Fleksibel'})`;

    const styElem = document.getElementById("profileCriteriaStyle");
    if (styElem) styElem.textContent = crit.learningStyle || "-";

    const goalElem = document.getElementById("profileCriteriaGoals");
    if (goalElem) goalElem.textContent = crit.goals || "-";
  },

  openEditProfileModal() {
    const user = window.studyBuddyStore.getCurrentUser();
    const newName = prompt("Ubah Nama Lengkap:", user.name);
    if (newName && newName.trim()) {
      const newBio = prompt("Ubah Bio Singkat:", user.bio);
      window.studyBuddyStore.updateCurrentUser({
        name: newName.trim(),
        bio: newBio ? newBio.trim() : user.bio
      });
      this.updateNavbarUserInfo();
      this.renderProfilePage();
      this.showToast("Profil Diperbarui", "Informasi profilmu berhasil disimpan.");
    }
  },

  changeAvatarPrompt() {
    const sampleAvatars = [
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    ];
    const pick = prompt("Masukkan URL Foto Profil baru atau tekan OK untuk memilih avatar preset:", sampleAvatars[2]);
    if (pick) {
      window.studyBuddyStore.updateCurrentUser({ avatar: pick.trim() });
      this.updateNavbarUserInfo();
      this.renderProfilePage();
      this.showToast("Avatar Diubah", "Foto profil berhasil diperbarui.");
    }
  },

  // ================= 7. HISTORY PAGE CONTROLLER (Page 7 & Concept #5) =================
  renderHistoryPage() {
    this.filterHistory();
  },

  filterHistory() {
    const query = document.getElementById("historySearchInput")?.value.toLowerCase() || "";
    const historyList = window.studyBuddyStore.getStudyHistory();
    const container = document.getElementById("fullHistoryCardsContainer");
    if (!container) return;

    const filtered = historyList.filter(item => {
      return (
        item.buddyName.toLowerCase().includes(query) ||
        item.subject.toLowerCase().includes(query) ||
        item.topic.toLowerCase().includes(query) ||
        (item.summary && item.summary.toLowerCase().includes(query))
      );
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="p-12 text-center rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div class="text-4xl mb-2">📂</div>
          <p class="text-sm font-semibold text-slate-600 dark:text-slate-300">Tidak ada riwayat diskusi yang cocok.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(item => `
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all space-y-4">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <img src="${item.buddyAvatar}" alt="${item.buddyName}" class="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-extrabold text-base text-slate-800 dark:text-slate-100">${item.buddyName}</h3>
                <span class="text-xs font-bold text-amber-500">⭐ ${item.ratingGiven || 5}.0</span>
              </div>
              <p class="text-xs font-medium text-indigo-600 dark:text-indigo-400">${item.subject} • ${item.topic}</p>
              <p class="text-[11px] text-slate-400 mt-0.5">${item.date} • Durasi: ${item.duration}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="window.StudyBuddyApp.openHistoryDetailModal('${item.id}')" class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5">
              <span>📖 Buka Arsip Lengkap</span>
            </button>
          </div>
        </div>

        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
          ${item.summary || 'Arsip sesi diskusi pembelajaran bersama.'}
        </p>

        <!-- Stored Assets Badges -->
        <div class="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-700/60">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1">💬 <strong>${item.chatCount || (item.messages?.length || 0)}</strong> Percakapan</span>
            <span class="flex items-center gap-1">📄 <strong>${item.docCount || (item.documents?.length || 0)}</strong> Dokumen</span>
            <span class="flex items-center gap-1">🔗 <strong>${item.linkCount || (item.links?.length || 0)}</strong> Link Web</span>
            <span class="flex items-center gap-1">🖼️ <strong>${item.photoCount || (item.photos?.length || 0)}</strong> Foto</span>
          </div>
          <span class="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
            ✓ Arsip Terenkripsi & Permanen
          </span>
        </div>

      </div>
    `).join("");
  },

  openHistoryDetailModal(histId) {
    const item = window.studyBuddyStore.getHistoryById(histId);
    if (!item) return;

    this.activeHistoryDetailRecord = item;
    const modal = document.getElementById("modalHistoryDetail");
    const body = document.getElementById("histDetailBody");
    const title = document.getElementById("histDetailTitle");
    const sub = document.getElementById("histDetailSubtitle");

    if (title) title.textContent = `Arsip Sesi: ${item.subject} bersama ${item.buddyName}`;
    if (sub) sub.textContent = `${item.date} • Total Waktu Belajar: ${item.duration}`;

    if (body) {
      body.innerHTML = `
        <!-- Shared Notes -->
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">📝 Catatan Kolaboratif yang Tersimpan:</h4>
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs whitespace-pre-wrap leading-relaxed">
            ${item.sharedNotes || 'Tidak ada catatan tertulis.'}
          </div>
        </div>

        <!-- Documents & Links -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">📄 Dokumen yang Dibagikan:</h4>
            <div class="space-y-1.5">
              ${(item.documents && item.documents.length > 0) 
                ? item.documents.map(d => `
                    <div class="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                      <span class="truncate font-medium">${d.name}</span>
                      <button onclick="window.StudyBuddyApp.previewFile('${d.name}')" class="text-indigo-600 font-bold ml-2">Unduh</button>
                    </div>
                  `).join("")
                : '<div class="text-xs text-slate-400">Tidak ada dokumen.</div>'
              }
            </div>
          </div>

          <div class="space-y-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">🔗 Tautan & Link Tersimpan:</h4>
            <div class="space-y-1.5">
              ${(item.links && item.links.length > 0) 
                ? item.links.map(l => `
                    <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                      <a href="${l.url}" target="_blank" class="text-indigo-600 font-medium hover:underline block truncate">${l.title || l.url}</a>
                    </div>
                  `).join("")
                : '<div class="text-xs text-slate-400">Tidak ada link.</div>'
              }
            </div>
          </div>
        </div>

        <!-- Photos -->
        ${item.photos && item.photos.length > 0 ? `
          <div class="space-y-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">🖼️ Foto & Diagram Materi:</h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              ${item.photos.map(p => `
                <div class="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer" onclick="window.StudyBuddyApp.previewImage('${p.url}', '${p.caption || ''}')">
                  <img src="${p.url}" alt="${p.caption || ''}" class="w-full h-32 object-cover hover:scale-105 transition-transform">
                  <div class="p-2 text-[10px] text-slate-500 truncate bg-slate-50 dark:bg-slate-900">${p.caption || 'Foto Materi'}</div>
                </div>
              `).join("")}
            </div>
          </div>
        ` : ''}

        <!-- Chat Transcript Sample -->
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">💬 Transkrip Obrolan Diskusi:</h4>
          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 max-h-56 overflow-y-auto">
            ${(item.messages && item.messages.length > 0)
              ? item.messages.map(m => `
                  <div class="text-xs">
                    <span class="font-bold text-indigo-600 dark:text-indigo-400">${m.senderName}:</span>
                    <span class="text-slate-700 dark:text-slate-300 ml-1">${m.text || m.fileName || m.url || '[Lampiran Media]'}</span>
                  </div>
                `).join("")
              : '<div class="text-xs text-slate-400">Transkrip kosong.</div>'
            }
          </div>
        </div>
      `;
    }

    modal?.classList.remove("hidden");
  },

  closeHistoryDetailModal() {
    document.getElementById("modalHistoryDetail")?.classList.add("hidden");
  },

  exportCurrentHistoryRecord() {
    if (!this.activeHistoryDetailRecord) return;
    const r = this.activeHistoryDetailRecord;
    const reportText = `=========================================
STUDY BUDDY - LAPORAN ARSIP SESI BELAJAR
=========================================
Mata Pelajaran: ${r.subject}
Topik Diskusi : ${r.topic}
Teman Belajar : ${r.buddyName}
Waktu Sesi    : ${r.date}
Total Durasi  : ${r.duration}
Rating Sesi   : ${r.ratingGiven || 5} / 5
Ulasan        : ${r.reviewText || '-'}

-----------------------------------------
CATATAN BERSAMA:
-----------------------------------------
${r.sharedNotes || '-'}

-----------------------------------------
DOKUMEN TERLAMPIR:
-----------------------------------------
${(r.documents || []).map(d => `- ${d.name} (${d.size || '1 MB'})`).join("\n") || 'Tidak ada'}

-----------------------------------------
LINK REFERENSI:
-----------------------------------------
${(r.links || []).map(l => `- ${l.title}: ${l.url}`).join("\n") || 'Tidak ada'}

=========================================
Diarsipkan otomatis oleh Study Buddy App
`;

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `StudyBuddy_Arsip_${r.subject.replace(/\s+/g, "_")}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast("Berhasil Diunduh!", "File ringkasan sesi diskusi tersimpan di perangkatmu.");
  },

  // ================= 8. SETTINGS CONTROLLER =================
  renderSettingsPage() {
    const s = window.studyBuddyStore.state.settings || {};
    const soundCheck = document.getElementById("settingSoundCheckbox");
    const offCheck = document.getElementById("settingOfflineCheckbox");

    if (soundCheck) soundCheck.checked = s.soundNotification !== false;
    if (offCheck) offCheck.checked = s.allowOfflineMeetup !== false;
  },

  updateSettingToggle(key, value) {
    window.studyBuddyStore.updateSettings({ [key]: value });
    this.showToast("Pengaturan Disimpan", `${key} diperbarui.`);
  },

  resetAllDemoData() {
    if (confirm("Apakah kamu yakin ingin mengembalikan semua data ke pengaturan awal demo?")) {
      window.studyBuddyStore.resetToDefault();
      this.showToast("Data Direset!", "Semua data kembali ke konfigurasi awal Study Buddy.");
      this.navigateTo("home");
    }
  },

  // ================= 9. AUTH FLOW (Page 9) =================
  quickLoginAs(persona) {
    if (persona === "aqil") {
      window.studyBuddyStore.login({
        id: "user_aqil",
        name: "Aqil Pratama",
        username: "aqil_dev",
        email: "aqil.pratama@student.univ.ac.id",
        major: "Teknik Informatika",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
      });
    } else if (persona === "sarah") {
      window.studyBuddyStore.login({
        id: "user_sarah",
        name: "Sarah Amalia",
        username: "sarah_si",
        email: "sarah@student.univ.ac.id",
        major: "Sistem Informasi",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
      });
    } else if (persona === "dimas") {
      window.studyBuddyStore.login({
        id: "user_dimas",
        name: "Dimas Arya",
        username: "dimas_itb",
        email: "dimas@student.itb.ac.id",
        major: "Teknik Komputer",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80"
      });
    }

    this.updateNavbarUserInfo();
    this.showToast("Login Berhasil!", `Selamat datang, ${window.studyBuddyStore.getCurrentUser().name}`);
    this.navigateTo("home");
  },

  handleLoginForm(e) {
    if (e) e.preventDefault();
    const email = document.getElementById("loginEmailInput")?.value || "aqil.pratama@student.univ.ac.id";
    window.studyBuddyStore.login({ email });
    this.showToast("Login Berhasil!", "Selamat datang kembali di Study Buddy.");
    this.navigateTo("home");
  },

  confirmLogout() {
    document.getElementById("modalLogoutConfirm")?.classList.remove("hidden");
  },

  executeLogout() {
    document.getElementById("modalLogoutConfirm")?.classList.add("hidden");
    window.studyBuddyStore.logout();
    this.showToast("Berhasil Keluar", "Kamu telah logout dari Study Buddy.");
    this.navigateTo("login");
  },

  // ================= TOAST NOTIFICATION UTILITY =================
  showToast(title, message, duration = 3500) {
    const container = document.getElementById("toastNotificationContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "p-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-xl flex items-start gap-3 pointer-events-auto transition-all transform translate-y-4 opacity-0 max-w-sm chat-fade-in";
    toast.innerHTML = `
      <div class="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold text-sm">
        ✨
      </div>
      <div class="flex-1 overflow-hidden">
        <h4 class="font-bold text-xs leading-snug">${title}</h4>
        <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">${message}</p>
      </div>
      <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-slate-600 text-xs">✕</button>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove("translate-y-4", "opacity-0");
    });

    setTimeout(() => {
      toast.classList.add("translate-y-4", "opacity-0");
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

window.StudyBuddyApp = StudyBuddyApp;

// Auto-run on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.StudyBuddyApp.init();
});
