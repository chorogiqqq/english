/* ==========================================================================
   STUDY CONTROLLER (Study.js)
   Flashcard Learning, 3D Flip, Auto-play Slideshow, List View Toggle
   ========================================================================== */

class StudyController {
  constructor() {
    this.words = [];
    this.currentIndex = 0;
    this.isFlipped = false;
    this.isAutoPlaying = false;
    this.autoPlayTimer = null;
    this.viewMode = "card"; // "card" or "list"

    this.initDOM();
  }

  initDOM() {
    // Flashcard Elements
    this.cardEl = document.getElementById("flashcard");
    this.cardWordEl = document.getElementById("cardWord");
    this.cardPhoneticEl = document.getElementById("cardPhonetic");
    this.cardPosEl = document.getElementById("cardPos");
    this.cardMeaningEl = document.getElementById("cardMeaning");
    this.cardExampleEnEl = document.getElementById("cardExampleEn");
    this.cardExampleKoEl = document.getElementById("cardExampleKo");
    this.cardIndexTagEl = document.getElementById("cardIndexTag");
    this.cardBookmarkBtn = document.getElementById("cardBookmarkBtn");
    this.statusToggleBtn = document.getElementById("statusToggleBtn");

    // Controls
    this.prevBtn = document.getElementById("studyPrevBtn");
    this.nextBtn = document.getElementById("studyNextBtn");
    this.audioBtnFront = document.getElementById("audioBtnFront");
    this.audioBtnBack = document.getElementById("audioBtnBack");
    this.autoPlayBtn = document.getElementById("autoPlayBtn");
    this.viewToggleBtn = document.getElementById("viewToggleBtn");

    this.cardWrapper = document.getElementById("flashcardWrapper");
    this.listViewContainer = document.getElementById("listViewContainer");

    this.bindEvents();
  }

  bindEvents() {
    if (this.cardEl) {
      this.cardEl.addEventListener("click", (e) => {
        // Prevent flip if clicking audio or bookmark buttons directly
        if (e.target.closest(".audio-btn") || e.target.closest(".card-bookmark-btn")) return;
        this.flipCard();
      });
    }

    if (this.prevBtn) this.prevBtn.addEventListener("click", () => this.prevWord());
    if (this.nextBtn) this.nextBtn.addEventListener("click", () => this.nextWord());

    if (this.audioBtnFront) {
      this.audioBtnFront.addEventListener("click", (e) => {
        e.stopPropagation();
        this.speakCurrentWord();
      });
    }

    if (this.audioBtnBack) {
      this.audioBtnBack.addEventListener("click", (e) => {
        e.stopPropagation();
        this.speakCurrentExample();
      });
    }

    if (this.cardBookmarkBtn) {
      this.cardBookmarkBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleCurrentBookmark();
      });
    }

    if (this.statusToggleBtn) {
      this.statusToggleBtn.addEventListener("click", () => {
        this.toggleCurrentMastered();
      });
    }

    if (this.autoPlayBtn) {
      this.autoPlayBtn.addEventListener("click", () => this.toggleAutoPlay());
    }

    if (this.viewToggleBtn) {
      this.viewToggleBtn.addEventListener("click", () => this.toggleViewMode());
    }

    // Keyboard Shortcuts (Arrow Left, Arrow Right, Spacebar for Flip, Key M for Master)
    document.addEventListener("keydown", (e) => {
      const studySection = document.getElementById("studyView");
      if (!studySection || !studySection.classList.contains("active")) return;
      if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;

      if (e.code === "Space") {
        e.preventDefault();
        this.flipCard();
      } else if (e.code === "ArrowLeft") {
        this.prevWord();
      } else if (e.code === "ArrowRight") {
        this.nextWord();
      } else if (e.code === "KeyS") {
        this.speakCurrentWord();
      } else if (e.code === "KeyM") {
        this.toggleCurrentMastered();
      }
    });
  }

  loadDay(dayNum) {
    this.words = window.vocabStore.getWordsForDay(dayNum);
    this.currentIndex = 0;
    this.isFlipped = false;
    this.stopAutoPlay();

    window.vocabStore.markDayStudied(dayNum);
    this.render();
  }

  getCurrentWord() {
    return this.words[this.currentIndex] || null;
  }

  render() {
    const word = this.getCurrentWord();
    if (!word) return;

    if (this.cardEl) this.cardEl.classList.remove("flipped");
    this.isFlipped = false;

    // Render Front & Back
    if (this.cardWordEl) this.cardWordEl.textContent = word.word;
    if (this.cardPhoneticEl) this.cardPhoneticEl.textContent = word.phonetic;
    if (this.cardPosEl) this.cardPosEl.textContent = word.pos;
    if (this.cardMeaningEl) this.cardMeaningEl.textContent = word.meaning;
    if (this.cardExampleEnEl) this.cardExampleEnEl.textContent = word.exampleEn;
    if (this.cardExampleKoEl) this.cardExampleKoEl.textContent = word.exampleKo;

    if (this.cardIndexTagEl) {
      this.cardIndexTagEl.textContent = `${this.currentIndex + 1} / ${this.words.length}`;
    }

    // Bookmark state
    const isBookmarked = window.vocabStore.isWordBookmarked(word.id);
    if (this.cardBookmarkBtn) {
      this.cardBookmarkBtn.classList.toggle("active", isBookmarked);
      this.cardBookmarkBtn.innerHTML = isBookmarked ? "★" : "☆";
    }

    // Mastered State
    const isMastered = window.vocabStore.isWordMastered(word.id);
    if (this.statusToggleBtn) {
      this.statusToggleBtn.classList.toggle("mastered", isMastered);
      this.statusToggleBtn.innerHTML = isMastered
        ? `<span>✓</span> 암기 완료`
        : `<span>○</span> 복습 필요`;
    }

    // Render List view if active
    if (this.viewMode === "list") {
      this.renderListView();
    }
  }

  flipCard() {
    if (!this.cardEl) return;
    this.isFlipped = !this.isFlipped;
    this.cardEl.classList.toggle("flipped", this.isFlipped);
  }

  nextWord() {
    if (this.currentIndex < this.words.length - 1) {
      this.currentIndex++;
      this.render();
    } else if (this.isAutoPlaying) {
      this.stopAutoPlay();
    }
  }

  prevWord() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.render();
    }
  }

  toggleCurrentBookmark() {
    const word = this.getCurrentWord();
    if (!word) return;
    const isBookmarked = window.vocabStore.toggleBookmark(word.id);
    if (this.cardBookmarkBtn) {
      this.cardBookmarkBtn.classList.toggle("active", isBookmarked);
      this.cardBookmarkBtn.innerHTML = isBookmarked ? "★" : "☆";
    }
  }

  toggleCurrentMastered() {
    const word = this.getCurrentWord();
    if (!word) return;
    const isMastered = window.vocabStore.toggleMastered(word.id);
    if (this.statusToggleBtn) {
      this.statusToggleBtn.classList.toggle("mastered", isMastered);
      this.statusToggleBtn.innerHTML = isMastered
        ? `<span>✓</span> 암기 완료`
        : `<span>○</span> 복습 필요`;
    }
    // Update global stats progress
    if (window.appController) window.appController.updateGlobalHeader();
  }

  speakCurrentWord() {
    const word = this.getCurrentWord();
    if (word) {
      window.ttsEngine.speak(word.word);
    }
  }

  speakCurrentExample() {
    const word = this.getCurrentWord();
    if (word) {
      window.ttsEngine.speak(word.exampleEn);
    }
  }

  toggleAutoPlay() {
    if (this.isAutoPlaying) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }

  startAutoPlay() {
    this.isAutoPlaying = true;
    if (this.autoPlayBtn) {
      this.autoPlayBtn.classList.add("btn-primary");
      this.autoPlayBtn.classList.remove("btn-secondary");
      this.autoPlayBtn.innerHTML = "⏸ 자동재생 중지";
    }

    const runStep = () => {
      if (!this.isAutoPlaying) return;
      this.speakCurrentWord();

      // Flip after 2 seconds
      setTimeout(() => {
        if (!this.isAutoPlaying) return;
        this.flipCard();

        // Move next after 3 seconds
        setTimeout(() => {
          if (!this.isAutoPlaying) return;
          if (this.currentIndex < this.words.length - 1) {
            this.nextWord();
            runStep();
          } else {
            this.stopAutoPlay();
          }
        }, 3000);
      }, 2000);
    };

    runStep();
  }

  stopAutoPlay() {
    this.isAutoPlaying = false;
    if (this.autoPlayBtn) {
      this.autoPlayBtn.classList.remove("btn-primary");
      this.autoPlayBtn.classList.add("btn-secondary");
      this.autoPlayBtn.innerHTML = "▶ 자동 슬라이드";
    }
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === "card" ? "list" : "card";
    if (this.viewToggleBtn) {
      this.viewToggleBtn.textContent = this.viewMode === "card" ? "📋 전체 목록 보기" : "🎴 플래시카드 보기";
    }

    if (this.viewMode === "list") {
      if (this.cardWrapper) this.cardWrapper.style.display = "none";
      if (this.listViewContainer) this.listViewContainer.style.display = "block";
      this.renderListView();
    } else {
      if (this.cardWrapper) this.cardWrapper.style.display = "block";
      if (this.listViewContainer) this.listViewContainer.style.display = "none";
    }
  }

  renderListView() {
    if (!this.listViewContainer) return;
    this.listViewContainer.innerHTML = "";

    const listEl = document.createElement("div");
    listEl.className = "word-list-container";

    this.words.forEach((w, idx) => {
      const isMastered = window.vocabStore.isWordMastered(w.id);
      const isBookmarked = window.vocabStore.isWordBookmarked(w.id);

      const itemEl = document.createElement("div");
      itemEl.className = "word-list-item";
      itemEl.innerHTML = `
        <div class="word-list-info">
          <div class="word-list-main">
            <span class="word-index-tag">#${idx + 1}</span>
            <span class="word-list-en">${w.word}</span>
            <span class="card-pos">${w.pos}</span>
            <span class="card-phonetic">${w.phonetic}</span>
            <button class="audio-btn btn-speak-list" data-word="${w.word}">🔊</button>
          </div>
          <div class="word-list-ko">${w.meaning}</div>
          <div class="example-en" style="margin-top:0.3rem;">${w.exampleEn}</div>
        </div>
        <div style="display:flex; gap:0.5rem; align-items:center;">
          <button class="card-bookmark-btn list-bm-btn ${isBookmarked ? "active" : ""}" data-id="${w.id}">
            ${isBookmarked ? "★" : "☆"}
          </button>
          <button class="status-toggle-btn ${isMastered ? "mastered" : ""} list-master-btn" data-id="${w.id}">
            ${isMastered ? "✓ 암기" : "○ 미완료"}
          </button>
        </div>
      `;

      listEl.appendChild(itemEl);
    });

    this.listViewContainer.appendChild(listEl);

    // Event listeners inside list view
    this.listViewContainer.querySelectorAll(".btn-speak-list").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const text = e.target.dataset.word;
        window.ttsEngine.speak(text);
      });
    });

    this.listViewContainer.querySelectorAll(".list-bm-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const wId = parseInt(e.target.dataset.id);
        const bm = window.vocabStore.toggleBookmark(wId);
        e.target.classList.toggle("active", bm);
        e.target.innerHTML = bm ? "★" : "☆";
      });
    });

    this.listViewContainer.querySelectorAll(".list-master-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const wId = parseInt(e.target.dataset.id);
        const mastered = window.vocabStore.toggleMastered(wId);
        e.target.classList.toggle("mastered", mastered);
        e.target.innerHTML = mastered ? "✓ 암기" : "○ 미완료";
        if (window.appController) window.appController.updateGlobalHeader();
      });
    });
  }
}

window.studyController = new StudyController();
