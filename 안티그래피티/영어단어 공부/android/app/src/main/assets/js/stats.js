/* ==========================================================================
   STATS & WEAK WORDS CONTROLLER (Stats.js)
   Dashboard Stats, 300-Day Grid Matrix, Wrong Words Notebook, Dictionary Search
   ========================================================================== */

class StatsController {
  constructor() {
    this.initDOM();
  }

  initDOM() {
    // Stats Cards
    this.statMasteredValEl = document.getElementById("statMasteredVal");
    this.statMasteredPctEl = document.getElementById("statMasteredPct");
    this.statStreakValEl = document.getElementById("statStreakVal");
    this.statDaysValEl = document.getElementById("statDaysVal");
    this.statAccuracyValEl = document.getElementById("statAccuracyVal");

    // Matrix
    this.matrixGridEl = document.getElementById("matrixGrid");

    // Weak words / Bookmarks
    this.weakListContainer = document.getElementById("weakListContainer");
    this.bookmarkListContainer = document.getElementById("bookmarkListContainer");
    this.btnStartWeakQuiz = document.getElementById("btnStartWeakQuiz");

    this.bindEvents();
  }

  bindEvents() {
    if (this.btnStartWeakQuiz) {
      this.btnStartWeakQuiz.addEventListener("click", () => {
        const wrongList = window.vocabStore.getWrongWordsList();
        if (wrongList.length === 0) {
          alert("오답 노트에 저장된 단어가 없습니다!");
          return;
        }
        if (window.appController) window.appController.switchView("quiz");
        window.quizController.startQuizWithWords(wrongList, "4choice", "오답 노트 전용 복습 퀴즈");
      });
    }
  }

  renderDashboard() {
    const stats = window.vocabStore.getOverallStats();

    if (this.statMasteredValEl) this.statMasteredValEl.textContent = stats.masteredCount.toLocaleString();
    if (this.statMasteredPctEl) this.statMasteredPctEl.textContent = `${stats.masteredPct}% 달성`;
    if (this.statStreakValEl) this.statStreakValEl.textContent = `${stats.streakDays}일`;
    if (this.statDaysValEl) this.statDaysValEl.textContent = `${stats.totalDaysStudied} / 300일`;
    if (this.statAccuracyValEl) this.statAccuracyValEl.textContent = `${stats.avgAccuracy}%`;

    this.render300DayMatrix();
    this.renderWeakWordsList();
    this.renderBookmarksList();
  }

  render300DayMatrix() {
    if (!this.matrixGridEl) return;
    this.matrixGridEl.innerHTML = "";

    const currentDay = window.vocabStore.getCurrentDay();
    const progressMap = window.vocabStore.state.dayProgressMap || {};

    for (let day = 1; day <= 300; day++) {
      const box = document.createElement("div");
      box.className = "day-box";
      box.textContent = day;

      if (day === currentDay) {
        box.classList.add("active-day");
      }

      if (progressMap[day] && progressMap[day].studied) {
        box.classList.add("completed");
      }

      box.addEventListener("click", () => {
        if (window.appController) window.appController.selectDay(day);
      });

      this.matrixGridEl.appendChild(box);
    }
  }

  renderWeakWordsList() {
    if (!this.weakListContainer) return;
    this.weakListContainer.innerHTML = "";

    const wrongList = window.vocabStore.getWrongWordsList();
    if (wrongList.length === 0) {
      this.weakListContainer.innerHTML = `
        <div style="text-align:center; padding:2rem; color:var(--text-muted);">
          🎉 오답 노트가 비어있습니다. 틀린 단어가 없습니다!
        </div>
      `;
      return;
    }

    const listEl = document.createElement("div");
    listEl.className = "word-list-container";

    wrongList.forEach(w => {
      const itemEl = document.createElement("div");
      itemEl.className = "word-list-item";
      itemEl.innerHTML = `
        <div class="word-list-info">
          <div class="word-list-main">
            <span class="word-list-en">${w.word}</span>
            <span class="card-pos">${w.pos || "단어"}</span>
            <span class="card-phonetic">${w.phonetic || ""}</span>
            <span class="tag-level-1" style="background:rgba(239,68,68,0.15); color:var(--danger-500);">오답 횟수: ${w.count || 1}회</span>
          </div>
          <div class="word-list-ko">${w.meaning}</div>
        </div>
        <div style="display:flex; gap:0.5rem; align-items:center;">
          <button class="btn btn-sm btn-outline remove-weak-btn" data-id="${w.id}">삭제</button>
        </div>
      `;
      listEl.appendChild(itemEl);
    });

    this.weakListContainer.appendChild(listEl);

    this.weakListContainer.querySelectorAll(".remove-weak-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        window.vocabStore.removeWrongWord(id);
        this.renderWeakWordsList();
      });
    });
  }

  renderBookmarksList() {
    if (!this.bookmarkListContainer) return;
    this.bookmarkListContainer.innerHTML = "";

    const bmList = window.vocabStore.getBookmarkedWords();
    if (bmList.length === 0) {
      this.bookmarkListContainer.innerHTML = `
        <div style="text-align:center; padding:2rem; color:var(--text-muted);">
          ☆ 북마크된 단어가 없습니다. 학습 카드에서 별 아이콘을 눌러 추가해보세요!
        </div>
      `;
      return;
    }

    const listEl = document.createElement("div");
    listEl.className = "word-list-container";

    bmList.forEach(w => {
      const itemEl = document.createElement("div");
      itemEl.className = "word-list-item";
      itemEl.innerHTML = `
        <div class="word-list-info">
          <div class="word-list-main">
            <span class="word-list-en">${w.word}</span>
            <span class="card-pos">${w.pos}</span>
            <span class="card-phonetic">${w.phonetic}</span>
          </div>
          <div class="word-list-ko">${w.meaning}</div>
        </div>
        <div style="display:flex; gap:0.5rem; align-items:center;">
          <button class="card-bookmark-btn active remove-bm-btn" data-id="${w.id}">★</button>
        </div>
      `;
      listEl.appendChild(itemEl);
    });

    this.bookmarkListContainer.appendChild(listEl);

    this.bookmarkListContainer.querySelectorAll(".remove-bm-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        window.vocabStore.toggleBookmark(id);
        this.renderBookmarksList();
      });
    });
  }
}

window.statsController = new StatsController();
