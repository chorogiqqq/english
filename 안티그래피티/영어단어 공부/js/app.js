/* ==========================================================================
   APPLICATION MAIN CONTROLLER (App.js)
   Router, Day Picker Modal, Search Modal, Theme Switcher, Backup/Restore
   ========================================================================== */

class AppController {
  constructor() {
    this.currentView = "study";
    this.initDOM();
  }

  initDOM() {
    // Header & Day Selectors
    this.dayPrevBtn = document.getElementById("dayPrevBtn");
    this.dayNextBtn = document.getElementById("dayNextBtn");
    this.currentDayBadge = document.getElementById("currentDayBadge");
    this.currentDayText = document.getElementById("currentDayText");
    this.currentLevelTag = document.getElementById("currentLevelTag");
    this.themeToggleBtn = document.getElementById("themeToggleBtn");
    this.searchBtn = document.getElementById("searchBtn");

    // Header Progress Summary
    this.headerProgressFill = document.getElementById("headerProgressFill");
    this.headerProgressText = document.getElementById("headerProgressText");

    // Views Tabs
    this.tabBtns = document.querySelectorAll(".tab-btn");
    this.viewSections = document.querySelectorAll(".view-section");

    // Day Jump Modal
    this.dayModalOverlay = document.getElementById("dayModalOverlay");
    this.dayGridModal = document.getElementById("dayGridModal");
    this.closeDayModalBtn = document.getElementById("closeDayModalBtn");

    // Search Modal
    this.searchModalOverlay = document.getElementById("searchModalOverlay");
    this.closeSearchModalBtn = document.getElementById("closeSearchModalBtn");
    this.searchInputEl = document.getElementById("searchInput");
    this.searchResultsContainer = document.getElementById("searchResultsContainer");

    // Data Export / Reset
    this.btnExportData = document.getElementById("btnExportData");
    this.btnImportData = document.getElementById("btnImportData");
    this.btnResetData = document.getElementById("btnResetData");
    this.importFileInput = document.getElementById("importFileInput");

    this.bindEvents();
    this.initApp();
  }

  bindEvents() {
    // Tab Navigation
    this.tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetView = btn.dataset.tab;
        this.switchView(targetView);
      });
    });

    // Day Prev / Next Buttons
    if (this.dayPrevBtn) {
      this.dayPrevBtn.addEventListener("click", () => {
        const cur = window.vocabStore.getCurrentDay();
        if (cur > 1) this.selectDay(cur - 1);
      });
    }

    if (this.dayNextBtn) {
      this.dayNextBtn.addEventListener("click", () => {
        const cur = window.vocabStore.getCurrentDay();
        if (cur < 300) this.selectDay(cur + 1);
      });
    }

    // Open Day Picker Modal
    if (this.currentDayBadge) {
      this.currentDayBadge.addEventListener("click", () => this.openDayModal());
    }
    if (this.closeDayModalBtn) {
      this.closeDayModalBtn.addEventListener("click", () => this.closeDayModal());
    }

    // Open Search Modal
    if (this.searchBtn) {
      this.searchBtn.addEventListener("click", () => this.openSearchModal());
    }
    if (this.closeSearchModalBtn) {
      this.closeSearchModalBtn.addEventListener("click", () => this.closeSearchModal());
    }

    // Theme Toggle
    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener("click", () => this.toggleTheme());
    }

    // Search Input Real-time Filtering
    if (this.searchInputEl) {
      this.searchInputEl.addEventListener("input", (e) => {
        this.handleSearch(e.target.value);
      });
    }

    // Data Backup / Restore Buttons
    if (this.btnExportData) {
      this.btnExportData.addEventListener("click", () => this.exportBackupJSON());
    }
    if (this.btnImportData) {
      this.btnImportData.addEventListener("click", () => {
        if (this.importFileInput) this.importFileInput.click();
      });
    }
    if (this.importFileInput) {
      this.importFileInput.addEventListener("change", (e) => this.importBackupJSON(e));
    }
    if (this.btnResetData) {
      this.btnResetData.addEventListener("click", () => {
        if (confirm("정말로 모든 학습 진도와 데이터를 초기화하시겠습니까?")) {
          window.vocabStore.resetAllProgress();
          location.reload();
        }
      });
    }
  }

  initApp() {
    // Set Saved Theme
    const savedTheme = window.vocabStore.getTheme();
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (this.themeToggleBtn) {
      this.themeToggleBtn.textContent = savedTheme === "dark" ? "☀️ 맑음" : "🌙 어둠";
    }

    // Load Initial Day & Header
    const initialDay = window.vocabStore.getCurrentDay();
    this.selectDay(initialDay, false);
    this.updateGlobalHeader();
  }

  selectDay(dayNum, shouldSwitchToStudy = true) {
    window.vocabStore.setCurrentDay(dayNum);

    const level = window.vocabStore.getLevelForDay(dayNum);
    if (this.currentDayText) this.currentDayText.textContent = `Day ${dayNum}`;
    
    if (this.currentLevelTag) {
      this.currentLevelTag.className = `current-level-tag tag-level-${level}`;
      if (level === 1) this.currentLevelTag.textContent = "Level 1: 일상어휘";
      else if (level === 2) this.currentLevelTag.textContent = "Level 2: 책/미디어";
      else if (level === 3) this.currentLevelTag.textContent = "Level 3: 학술논문";
    }

    if (this.dayPrevBtn) this.dayPrevBtn.disabled = dayNum <= 1;
    if (this.dayNextBtn) this.dayNextBtn.disabled = dayNum >= 300;

    // Load Day into Study & Quiz Controllers
    if (window.studyController) window.studyController.loadDay(dayNum);

    this.closeDayModal();
    if (shouldSwitchToStudy && this.currentView !== "study") {
      this.switchView("study");
    }

    this.updateGlobalHeader();
  }

  switchView(viewName) {
    this.currentView = viewName;

    // Update active tab buttons
    this.tabBtns.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === viewName);
    });

    // Show active section
    this.viewSections.forEach(section => {
      const isTarget = section.id === `${viewName}View`;
      section.classList.toggle("active", isTarget);
    });

    // Render Stats or Quiz if selected
    if (viewName === "stats" && window.statsController) {
      window.statsController.renderDashboard();
    } else if (viewName === "quiz" && window.quizController) {
      // Ensure quiz menu is visible
      const qMenu = document.getElementById("quizMenuBox");
      const qActive = document.getElementById("quizActiveContainer");
      const qRes = document.getElementById("quizResultBox");
      if (qMenu) qMenu.style.display = "grid";
      if (qActive) qActive.style.display = "none";
      if (qRes) qRes.style.display = "none";
    }
  }

  updateGlobalHeader() {
    const stats = window.vocabStore.getOverallStats();
    if (this.headerProgressFill) {
      this.headerProgressFill.style.width = `${stats.masteredPct}%`;
    }
    if (this.headerProgressText) {
      this.headerProgressText.textContent = `${stats.masteredCount} / 6,000단어 (${stats.masteredPct}%)`;
    }
  }

  toggleTheme() {
    const current = window.vocabStore.getTheme();
    const nextTheme = current === "dark" ? "light" : "dark";
    window.vocabStore.setTheme(nextTheme);

    document.documentElement.setAttribute("data-theme", nextTheme);
    if (this.themeToggleBtn) {
      this.themeToggleBtn.textContent = nextTheme === "dark" ? "☀️ 맑음" : "🌙 어둠";
    }
  }

  // --- Day Grid Picker Modal ---
  openDayModal() {
    if (!this.dayModalOverlay || !this.dayGridModal) return;
    this.dayGridModal.innerHTML = "";

    const currentDay = window.vocabStore.getCurrentDay();
    const progressMap = window.vocabStore.state.dayProgressMap || {};

    for (let day = 1; day <= 300; day++) {
      const box = document.createElement("div");
      box.className = "day-box";
      box.textContent = day;

      if (day === currentDay) box.classList.add("active-day");
      if (progressMap[day] && progressMap[day].studied) box.classList.add("completed");

      box.addEventListener("click", () => {
        this.selectDay(day);
      });

      this.dayGridModal.appendChild(box);
    }

    this.dayModalOverlay.classList.add("active");
  }

  closeDayModal() {
    if (this.dayModalOverlay) this.dayModalOverlay.classList.remove("active");
  }

  // --- Dictionary Search Modal ---
  openSearchModal() {
    if (this.searchModalOverlay) {
      this.searchModalOverlay.classList.add("active");
      if (this.searchInputEl) {
        this.searchInputEl.value = "";
        this.searchInputEl.focus();
      }
      this.handleSearch("");
    }
  }

  closeSearchModal() {
    if (this.searchModalOverlay) this.searchModalOverlay.classList.remove("active");
  }

  handleSearch(query) {
    if (!this.searchResultsContainer) return;
    this.searchResultsContainer.innerHTML = "";

    const q = query.trim().toLowerCase();
    const allWords = window.WORDS_LEVEL1.concat(window.WORDS_LEVEL2, window.WORDS_LEVEL3);

    const filtered = allWords.filter(w => {
      if (!q) return false;
      return w.word.toLowerCase().includes(q) || w.meaning.includes(q);
    }).slice(0, 50); // Limit search results to 50 items

    if (!q) {
      this.searchResultsContainer.innerHTML = `
        <div style="text-align:center; padding:2rem; color:var(--text-muted);">
          🔍 영단어 또는 한국어 뜻을 입력하세요 (6,000 단어 전체 검색)
        </div>
      `;
      return;
    }

    if (filtered.length === 0) {
      this.searchResultsContainer.innerHTML = `
        <div style="text-align:center; padding:2rem; color:var(--text-muted);">
          검색 결과가 없습니다.
        </div>
      `;
      return;
    }

    const listEl = document.createElement("div");
    listEl.className = "word-list-container";

    filtered.forEach(w => {
      const isMastered = window.vocabStore.isWordMastered(w.id);
      const isBookmarked = window.vocabStore.isWordBookmarked(w.id);

      const itemEl = document.createElement("div");
      itemEl.className = "word-list-item";
      itemEl.innerHTML = `
        <div class="word-list-info">
          <div class="word-list-main">
            <span class="tag-level-${w.level}">Day ${w.day}</span>
            <span class="word-list-en">${w.word}</span>
            <span class="card-pos">${w.pos}</span>
            <span class="card-phonetic">${w.phonetic}</span>
            <button class="audio-btn btn-search-speak" data-word="${w.word}">🔊</button>
          </div>
          <div class="word-list-ko">${w.meaning}</div>
        </div>
        <div style="display:flex; gap:0.5rem; align-items:center;">
          <button class="card-bookmark-btn search-bm-btn ${isBookmarked ? "active" : ""}" data-id="${w.id}">
            ${isBookmarked ? "★" : "☆"}
          </button>
          <button class="status-toggle-btn ${isMastered ? "mastered" : ""} search-master-btn" data-id="${w.id}">
            ${isMastered ? "✓ 암기" : "○ 미완료"}
          </button>
        </div>
      `;
      listEl.appendChild(itemEl);
    });

    this.searchResultsContainer.appendChild(listEl);

    // Bind event listeners for search item buttons
    this.searchResultsContainer.querySelectorAll(".btn-search-speak").forEach(btn => {
      btn.addEventListener("click", (e) => {
        window.ttsEngine.speak(e.target.dataset.word);
      });
    });

    this.searchResultsContainer.querySelectorAll(".search-bm-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        const bm = window.vocabStore.toggleBookmark(id);
        e.target.classList.toggle("active", bm);
        e.target.innerHTML = bm ? "★" : "☆";
      });
    });

    this.searchResultsContainer.querySelectorAll(".search-master-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        const mastered = window.vocabStore.toggleMastered(id);
        e.target.classList.toggle("mastered", mastered);
        e.target.innerHTML = mastered ? "✓ 암기" : "○ 미완료";
        this.updateGlobalHeader();
      });
    });
  }

  // --- Data Backup / Restore ---
  exportBackupJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.vocabStore.state, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vocab6000_backup_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  importBackupJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed && parsed.currentDay) {
          window.vocabStore.state = parsed;
          window.vocabStore.saveState();
          alert("학습 진도 데이터가 성공적으로 복원되었습니다!");
          location.reload();
        } else {
          alert("올바르지 않은 백업 파일 형식입니다.");
        }
      } catch (err) {
        alert("파일 읽기 중 오류가 발생했습니다.");
      }
    };
    reader.readAsText(file);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.appController = new AppController();
});
