// ==========================================
// STUDY BUDDY - MATCHMAKING ENGINE & SCORING
// ==========================================

const MatchmakingEngine = {
  /**
   * Search for buddies based on criteria
   * @param {Object} query - { subject, topic, mode, meetupTime, meetupLocation, level, learningStyle }
   * @param {Array} buddiesList - Array of buddy objects from store
   * @returns {Array} buddies sorted by match score with breakdown
   */
  findMatches(query, buddiesList) {
    if (!buddiesList || buddiesList.length === 0) return [];

    const results = buddiesList.map(buddy => {
      const scoreData = this.calculateScore(query, buddy);
      return {
        ...buddy,
        matchScore: scoreData.score,
        matchBreakdown: scoreData.breakdown,
        matchingReasons: scoreData.reasons
      };
    });

    // Sort descending by score
    return results.sort((a, b) => b.matchScore - a.matchScore);
  },

  /**
   * Calculate compatibility score between search query and a buddy candidate
   */
  calculateScore(query, buddy) {
    let score = 50; // Base baseline score
    const reasons = [];
    const breakdown = {
      subject: 0,
      topic: 0,
      mode: 0,
      time: 0,
      level: 0
    };

    const buddyCriteria = buddy.criteria || {};
    const buddySubjects = (buddyCriteria.subjects || []).map(s => s.toLowerCase());
    const buddyTopics = (buddyCriteria.topics || "").toLowerCase();
    const buddyMode = (buddyCriteria.mode || "both").toLowerCase();

    // 1. Subject match (Max 25 pts)
    if (query.subject && query.subject !== "Semua Pelajaran") {
      const qSubject = query.subject.toLowerCase();
      const hasSubject = buddySubjects.some(s => s.includes(qSubject) || qSubject.includes(s));
      if (hasSubject) {
        score += 25;
        breakdown.subject = 25;
        reasons.push(`Keduanya mempelajari bidang ${query.subject}`);
      } else {
        score -= 10;
      }
    } else {
      score += 15; // generic bonus if searching all
      breakdown.subject = 15;
    }

    // 2. Specific Topic / Materi keywords (Max 20 pts)
    if (query.topic && query.topic.trim()) {
      const queryKeywords = query.topic.toLowerCase().split(/[\s,]+/).filter(w => w.length > 2);
      let matchCount = 0;
      queryKeywords.forEach(kw => {
        if (buddyTopics.includes(kw) || (buddy.bio && buddy.bio.toLowerCase().includes(kw))) {
          matchCount++;
        }
      });

      if (matchCount > 0) {
        const topicBonus = Math.min(20, matchCount * 10);
        score += topicBonus;
        breakdown.topic = topicBonus;
        reasons.push(`Topik materi spesifik sangat cocok (${queryKeywords.slice(0, 2).join(", ")})`);
      }
    } else {
      score += 10;
      breakdown.topic = 10;
    }

    // 3. Mode Belajar & Meetup Compatibility (Max 15 pts)
    if (query.mode) {
      const qMode = query.mode.toLowerCase();
      if (qMode === "both" || buddyMode === "both" || qMode === buddyMode) {
        score += 15;
        breakdown.mode = 15;
        if (qMode === "offline" || (qMode === "both" && buddyMode !== "online")) {
          reasons.push("Sama-sama bersedia meetup belajar tatap muka");
        } else {
          reasons.push("Kompatibel untuk sesi diskusi online interaktif");
        }
      } else {
        score -= 5;
      }
    }

    // 4. Waktu Bertemu / Jadwal Availability (Max 15 pts)
    if (query.meetupTime) {
      const qTime = query.meetupTime.toLowerCase();
      const buddyAvail = (buddyCriteria.availability || []).join(" ").toLowerCase();
      
      const timeKeywords = ["pagi", "siang", "sore", "malam", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];
      let hasTimeOverlap = false;
      timeKeywords.forEach(tk => {
        if (qTime.includes(tk) && buddyAvail.includes(tk)) {
          hasTimeOverlap = true;
        }
      });

      if (hasTimeOverlap || buddyAvail.includes("fleksibel")) {
        score += 15;
        breakdown.time = 15;
        reasons.push("Jadwal ketersediaan waktu belajar saling cocok");
      } else {
        score += 5;
        breakdown.time = 5;
      }
    } else {
      score += 10;
      breakdown.time = 10;
    }

    // 5. University / Rating synergy (Max 10 pts)
    if (buddy.rating >= 4.8) {
      score += 10;
      reasons.push(`Study Buddy berprestasi dengan rating tinggi (${buddy.rating}⭐)`);
    } else {
      score += 5;
    }

    // Bound between 60% and 99%
    score = Math.min(99, Math.max(58, score));

    if (reasons.length === 0) {
      reasons.push("Tingkat kemampuan belajar seimbang dan saling melengkapi");
    }

    return { score, breakdown, reasons };
  },

  /**
   * Helper to format human friendly match percentage
   */
  formatScoreBadge(score) {
    if (score >= 90) return { label: `${score}% Sangat Cocok`, colorClass: "badge-match-high" };
    if (score >= 75) return { label: `${score}% Cocok`, colorClass: "badge-match-med" };
    return { label: `${score}% Cukup Cocok`, colorClass: "badge-match-low" };
  }
};

window.MatchmakingEngine = MatchmakingEngine;
