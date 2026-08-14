/* ==========================================================================
   QUIZ & TEST ENGINE (Quiz.js)
   4-Choice Multiple Choice, Spelling Dictation, Matching Card Game
   ========================================================================== */

class QuizController {
  constructor() {
    this.currentMode = null; // "4choice", "spelling", "matching", "weak"
    this.words = [];
    this.currentIndex = 0;
    this.score = 0;
    this.isAnswered = false;

    // Matching mode state
    this.selectedMatchingCards = [];
    this.matchedPairsCount = 0;

    this.initDOM();
  }

  initDOM() {
    this.quizMenuBox = document.getElementById("quizMenuBox");
    this.quizActiveContainer = document.getElementById("quizActiveContainer");
    this.quizResultBox = document.getElementById("quizResultBox");

    this.quizTitleEl = document.getElementById("quizTitle");
    this.quizScoreTextEl = document.getElementById("quizScoreText");
    this.quizProgressBarEl = document.getElementById("quizProgressBar");

    // Quiz Cards in Menu
    this.btnMode4Choice = document.getElementById("btnMode4Choice");
    this.btnModeSpelling = document.getElementById("btnModeSpelling");
    this.btnModeMatching = document.getElementById("btnModeMatching");

    this.bindEvents();
  }

  bindEvents() {
    if (this.btnMode4Choice) {
      this.btnMode4Choice.addEventListener("click", () => this.startQuiz("4choice"));
    }
    if (this.btnModeSpelling) {
      this.btnModeSpelling.addEventListener("click", () => this.startQuiz("spelling"));
    }
    if (this.btnModeMatching) {
      this.btnModeMatching.addEventListener("click", () => this.startQuiz("matching"));
    }
  }

  startQuizForDay(dayNum, mode = "4choice") {
    this.words = window.vocabStore.getWordsForDay(dayNum);
    this.startQuizWithWords(this.words, mode, `Day ${dayNum} 테스트`);
  }

  startQuizWithWords(wordsList, mode = "4choice", customTitle = "단어 테스트") {
    if (!wordsList || wordsList.length === 0) {
      alert("테스트할 단어가 없습니다.");
      return;
    }

    this.currentMode = mode;
    this.words = [...wordsList];
    // Shuffle words for quiz
    this.shuffle(this.words);

    this.currentIndex = 0;
    this.score = 0;
    this.isAnswered = false;

    if (this.quizMenuBox) this.quizMenuBox.style.display = "none";
    if (this.quizResultBox) this.quizResultBox.style.display = "none";
    if (this.quizActiveContainer) this.quizActiveContainer.style.display = "block";

    if (this.quizTitleEl) this.quizTitleEl.textContent = customTitle;

    if (this.currentMode === "matching") {
      this.renderMatchingGame();
    } else {
      this.renderQuestion();
    }
  }

  startQuiz(mode) {
    const currentDay = window.vocabStore.getCurrentDay();
    this.startQuizForDay(currentDay, mode);
  }

  renderQuestion() {
    if (this.currentIndex >= this.words.length) {
      this.finishQuiz();
      return;
    }

    this.isAnswered = false;
    const currentWord = this.words[this.currentIndex];
    const total = this.words.length;

    if (this.quizScoreTextEl) {
      this.quizScoreTextEl.textContent = `문제 ${this.currentIndex + 1} / ${total} (점수: ${this.score})`;
    }
    if (this.quizProgressBarEl) {
      const pct = Math.round((this.currentIndex / total) * 100);
      this.quizProgressBarEl.style.width = `${pct}%`;
    }

    this.quizActiveContainer.innerHTML = "";

    if (this.currentMode === "4choice") {
      this.render4ChoiceQuestion(currentWord);
    } else if (this.currentMode === "spelling") {
      this.renderSpellingQuestion(currentWord);
    }
  }

  // --- 4-CHOICE MULTIPLE CHOICE QUIZ ---
  render4ChoiceQuestion(targetWord) {
    const box = document.createElement("div");
    box.className = "quiz-box";

    // Select 3 random options from other words in pool
    const allWords = window.WORDS_LEVEL1.concat(window.WORDS_LEVEL2, window.WORDS_LEVEL3);
    const options = [targetWord];
    while (options.length < 4) {
      const rand = allWords[Math.floor(Math.random() * allWords.length)];
      if (!options.find(o => o.id === rand.id || o.meaning === rand.meaning)) {
        options.push(rand);
      }
    }
    this.shuffle(options);

    box.innerHTML = `
      <div class="quiz-question-header">
        <span>[ 4지 선다 퀴즈 ]</span>
        <button class="audio-btn btn-quiz-speak" style="margin-left:auto;">🔊 발음 듣기</button>
      </div>
      <div class="quiz-target-word">${targetWord.word}</div>
      <div class="card-phonetic" style="text-align:center; margin-bottom:1.5rem;">${targetWord.phonetic} | ${targetWord.pos}</div>
      <div class="quiz-options-grid">
        ${options.map((opt, i) => `
          <button class="quiz-option-btn" data-id="${opt.id}">
            <span class="option-num">${i + 1}</span>
            <span>${opt.meaning}</span>
          </button>
        `).join("")}
      </div>
      <div id="quizFeedbackBox" style="margin-top:1.5rem; text-align:center; font-weight:700;"></div>
    `;

    this.quizActiveContainer.appendChild(box);

    box.querySelector(".btn-quiz-speak").addEventListener("click", () => {
      window.ttsEngine.speak(targetWord.word);
    });

    const optBtns = box.querySelectorAll(".quiz-option-btn");
    optBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        if (this.isAnswered) return;
        this.isAnswered = true;

        const selectedId = parseInt(btn.dataset.id);
        const feedbackBox = document.getElementById("quizFeedbackBox");

        if (selectedId === targetWord.id) {
          btn.classList.add("correct");
          this.score++;
          feedbackBox.innerHTML = `<span style="color:var(--success-500);">⭕ 정답입니다! (${targetWord.word} = ${targetWord.meaning})</span>`;
          window.vocabStore.toggleMastered(targetWord.id);
        } else {
          btn.classList.add("wrong");
          feedbackBox.innerHTML = `<span style="color:var(--danger-500);">❌ 오답입니다! 정답: ${targetWord.word} (${targetWord.meaning})</span>`;
          // Highlight correct answer
          optBtns.forEach(b => {
            if (parseInt(b.dataset.id) === targetWord.id) b.classList.add("correct");
          });
          // Log wrong word
          window.vocabStore.logWrongWord(targetWord);
        }

        setTimeout(() => {
          this.currentIndex++;
          this.renderQuestion();
        }, 1600);
      });
    });
  }

  // --- SPELLING DICTATION TEST ---
  renderSpellingQuestion(targetWord) {
    const box = document.createElement("div");
    box.className = "quiz-box";

    box.innerHTML = `
      <div class="quiz-question-header">
        <span>[ 받아쓰기 / 스펠링 테스트 ]</span>
        <button class="audio-btn btn-quiz-speak" style="margin-left:auto;">🔊 발음 듣기</button>
      </div>
      <div class="quiz-target-word" style="font-size:1.8rem; color:var(--primary-500);">${targetWord.meaning}</div>
      <div class="card-phonetic" style="text-align:center; margin-bottom:1.5rem;">품사: ${targetWord.pos} | 예문: ${targetWord.exampleEn}</div>
      <div class="spelling-input-group">
        <input type="text" id="spellingInput" class="spelling-input" placeholder="영단어 입력..." autocomplete="off" />
        <button id="btnSubmitSpelling" class="btn btn-primary btn-lg">정답 제출 ↵</button>
      </div>
      <div id="quizFeedbackBox" style="margin-top:1.5rem; text-align:center; font-weight:700;"></div>
    `;

    this.quizActiveContainer.appendChild(box);

    const input = box.querySelector("#spellingInput");
    input.focus();

    box.querySelector(".btn-quiz-speak").addEventListener("click", () => {
      window.ttsEngine.speak(targetWord.word);
    });

    const submit = () => {
      if (this.isAnswered) return;
      const userVal = input.value.trim().toLowerCase();
      if (!userVal) return;

      this.isAnswered = true;
      const feedbackBox = document.getElementById("quizFeedbackBox");

      if (userVal === targetWord.word.toLowerCase()) {
        input.style.borderColor = "var(--success-500)";
        this.score++;
        feedbackBox.innerHTML = `<span style="color:var(--success-500);">🎉 정확합니다! (${targetWord.word})</span>`;
        window.vocabStore.toggleMastered(targetWord.id);
      } else {
        input.style.borderColor = "var(--danger-500)";
        feedbackBox.innerHTML = `<span style="color:var(--danger-500);">❌ 오답입니다! 정답: ${targetWord.word}</span>`;
        window.vocabStore.logWrongWord(targetWord);
      }

      setTimeout(() => {
        this.currentIndex++;
        this.renderQuestion();
      }, 1600);
    };

    box.querySelector("#btnSubmitSpelling").addEventListener("click", submit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") submit();
    });
  }

  // --- MATCHING CARD GAME ---
  renderMatchingGame() {
    this.quizActiveContainer.innerHTML = "";

    // Pick 6 words for matching
    const gameWords = this.words.slice(0, 6);
    this.matchedPairsCount = 0;
    this.selectedMatchingCards = [];

    const cards = [];
    gameWords.forEach(w => {
      cards.push({ type: "en", id: w.id, text: w.word, wordObj: w });
      cards.push({ type: "ko", id: w.id, text: w.meaning, wordObj: w });
    });
    this.shuffle(cards);

    const box = document.createElement("div");
    box.className = "quiz-box";
    box.style.maxWidth = "800px";

    box.innerHTML = `
      <div class="quiz-question-header">
        <span>[ 카드 짝맞추기 게임 ]</span>
        <span>알맞은 영어 단어와 한국어 뜻을 매칭하세요!</span>
      </div>
      <div class="matching-grid" id="matchingGrid">
        ${cards.map((c, i) => `
          <div class="matching-card" data-idx="${i}" data-id="${c.id}" data-type="${c.type}">
            ${c.text}
          </div>
        `).join("")}
      </div>
      <div id="quizFeedbackBox" style="margin-top:1.5rem; text-align:center; font-weight:700;"></div>
    `;

    this.quizActiveContainer.appendChild(box);

    const cardEls = box.querySelectorAll(".matching-card");
    cardEls.forEach(el => {
      el.addEventListener("click", () => {
        if (el.classList.contains("matched") || el.classList.contains("selected")) return;

        el.classList.add("selected");
        this.selectedMatchingCards.push({ element: el, id: el.dataset.id, type: el.dataset.type });

        if (this.selectedMatchingCards.length === 2) {
          const [c1, c2] = this.selectedMatchingCards;

          if (c1.id === c2.id && c1.type !== c2.type) {
            // Match success!
            setTimeout(() => {
              c1.element.classList.add("matched");
              c2.element.classList.add("matched");
              this.matchedPairsCount++;
              this.score++;

              if (this.matchedPairsCount === gameWords.length) {
                const feedbackBox = document.getElementById("quizFeedbackBox");
                feedbackBox.innerHTML = `<span style="color:var(--success-500); font-size:1.2rem;">🏆 모든 짝을 맞추었습니다!</span>`;
                setTimeout(() => this.finishQuiz(), 1500);
              }
            }, 300);
          } else {
            // Match failed
            setTimeout(() => {
              c1.element.classList.remove("selected");
              c2.element.classList.remove("selected");
            }, 600);
          }

          this.selectedMatchingCards = [];
        }
      });
    });
  }

  finishQuiz() {
    const total = this.currentMode === "matching" ? Math.min(this.words.length, 6) : this.words.length;
    const currentDay = window.vocabStore.getCurrentDay();

    window.vocabStore.recordQuizScore(currentDay, this.score, total, this.currentMode);

    if (this.quizActiveContainer) this.quizActiveContainer.style.display = "none";
    if (this.quizResultBox) {
      this.quizResultBox.style.display = "block";
      const pct = Math.round((this.score / total) * 100);

      this.quizResultBox.innerHTML = `
        <div class="quiz-box" style="text-align:center;">
          <div style="font-size:3rem; margin-bottom:0.5rem;">${pct >= 80 ? "🎉" : "💪"}</div>
          <h2 style="font-size:1.8rem; font-weight:800; margin-bottom:0.5rem;">테스트 완료!</h2>
          <div style="font-size:1.2rem; color:var(--text-secondary); margin-bottom:1.5rem;">
            총 ${total}문제 중 <strong style="color:var(--primary-500);">${this.score}개</strong> 정답 (${pct}점)
          </div>
          <div style="display:flex; justify-content:center; gap:1rem;">
            <button id="btnRetryQuiz" class="btn btn-secondary btn-lg">🔄 다시 테스트</button>
            <button id="btnFinishQuizBack" class="btn btn-primary btn-lg">📖 학습 화면으로 돌아가기</button>
          </div>
        </div>
      `;

      this.quizResultBox.querySelector("#btnRetryQuiz").addEventListener("click", () => {
        this.startQuiz(this.currentMode);
      });

      this.quizResultBox.querySelector("#btnFinishQuizBack").addEventListener("click", () => {
        if (window.appController) window.appController.switchView("study");
      });
    }

    if (window.appController) window.appController.updateGlobalHeader();
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

window.quizController = new QuizController();
