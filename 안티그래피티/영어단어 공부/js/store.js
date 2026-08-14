/* ==========================================================================
   APP STATE STORE (Store.js)
   LocalStorage Persistence, Progress, Bookmarks, Wrong Words, Streak Logic
   ========================================================================== */

const STORAGE_KEY = "VOCAB6000_STORE_V1";

class VocabStore {
  constructor() {
    this.state = this.loadState();
  }

  getDefaultState() {
    return {
      currentDay: 1,
      theme: "dark",
      masteredWords: [], // Array of word IDs
      bookmarkedWords: [], // Array of word IDs
      wrongWordsMap: {}, // wordId -> { id, word, meaning, count, lastTested }
      dayProgressMap: {}, // day -> { studied: bool, quizPassed: bool, quizScore: num, completedAt: str }
      testHistory: [], // Array of { id, date, day, mode, score, total }
      lastActiveDate: new Date().toISOString().split("T")[0],
      streakDays: 1
    };
  }

  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this.getDefaultState();
      const parsed = JSON.parse(raw);
      return { ...this.getDefaultState(), ...parsed };
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
      return this.getDefaultState();
    }
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("Failed to save state to localStorage:", e);
    }
  }

  // --- Day & Level Access ---
  getCurrentDay() {
    return this.state.currentDay || 1;
  }

  setCurrentDay(dayNum) {
    if (dayNum < 1) dayNum = 1;
    if (dayNum > 300) dayNum = 300;
    this.state.currentDay = dayNum;
    this.saveState();
  }

  getLevelForDay(day) {
    if (day <= 100) return 1;
    if (day <= 200) return 2;
    return 3;
  }

  // Get 20 words for a given day (1..300)
  getWordsForDay(dayNum) {
    const level = this.getLevelForDay(dayNum);
    let dataset = [];
    if (level === 1) dataset = window.WORDS_LEVEL1 || [];
    else if (level === 2) dataset = window.WORDS_LEVEL2 || [];
    else if (level === 3) dataset = window.WORDS_LEVEL3 || [];

    return dataset.filter(w => w.day === dayNum);
  }

  // Get word by ID (1..6000)
  getWordById(id) {
    const level = id <= 2000 ? 1 : id <= 4000 ? 2 : 3;
    let dataset = [];
    if (level === 1) dataset = window.WORDS_LEVEL1 || [];
    else if (level === 2) dataset = window.WORDS_LEVEL2 || [];
    else if (level === 3) dataset = window.WORDS_LEVEL3 || [];

    return dataset.find(w => w.id === id);
  }

  // --- Mastered Words Toggles ---
  isWordMastered(wordId) {
    return this.state.masteredWords.includes(wordId);
  }

  toggleMastered(wordId) {
    const index = this.state.masteredWords.indexOf(wordId);
    if (index >= 0) {
      this.state.masteredWords.splice(index, 1);
    } else {
      this.state.masteredWords.push(wordId);
    }
    this.saveState();
    return this.isWordMastered(wordId);
  }

  // --- Bookmark Toggles ---
  isWordBookmarked(wordId) {
    return this.state.bookmarkedWords.includes(wordId);
  }

  toggleBookmark(wordId) {
    const index = this.state.bookmarkedWords.indexOf(wordId);
    if (index >= 0) {
      this.state.bookmarkedWords.splice(index, 1);
    } else {
      this.state.bookmarkedWords.push(wordId);
    }
    this.saveState();
    return this.isWordBookmarked(wordId);
  }

  getBookmarkedWords() {
    return this.state.bookmarkedWords.map(id => this.getWordById(id)).filter(Boolean);
  }

  // --- Wrong Words (오답 노트) ---
  logWrongWord(wordObj) {
    if (!wordObj || !wordObj.id) return;
    const wId = wordObj.id;
    if (!this.state.wrongWordsMap[wId]) {
      this.state.wrongWordsMap[wId] = {
        id: wId,
        word: wordObj.word,
        meaning: wordObj.meaning,
        level: wordObj.level,
        day: wordObj.day,
        count: 1,
        lastTested: new Date().toISOString()
      };
    } else {
      this.state.wrongWordsMap[wId].count += 1;
      this.state.wrongWordsMap[wId].lastTested = new Date().toISOString();
    }
    this.saveState();
  }

  removeWrongWord(wordId) {
    if (this.state.wrongWordsMap[wordId]) {
      delete this.state.wrongWordsMap[wordId];
      this.saveState();
    }
  }

  getWrongWordsList() {
    return Object.values(this.state.wrongWordsMap).map(item => {
      const full = this.getWordById(item.id);
      return full || item;
    });
  }

  // --- Day Completion & Progress ---
  markDayStudied(dayNum) {
    if (!this.state.dayProgressMap[dayNum]) {
      this.state.dayProgressMap[dayNum] = {};
    }
    this.state.dayProgressMap[dayNum].studied = true;
    this.state.dayProgressMap[dayNum].studiedAt = new Date().toISOString();
    this.updateStreak();
    this.saveState();
  }

  recordQuizScore(dayNum, score, total, mode = "4choice") {
    if (!this.state.dayProgressMap[dayNum]) {
      this.state.dayProgressMap[dayNum] = {};
    }
    const pct = Math.round((score / total) * 100);
    this.state.dayProgressMap[dayNum].quizPassed = pct >= 80;
    this.state.dayProgressMap[dayNum].lastScore = pct;

    this.state.testHistory.unshift({
      id: Date.now(),
      date: new Date().toLocaleDateString("ko-KR"),
      day: dayNum,
      mode: mode,
      score: score,
      total: total,
      pct: pct
    });

    // Limit test history to last 50 entries
    if (this.state.testHistory.length > 50) {
      this.state.testHistory.pop();
    }

    this.updateStreak();
    this.saveState();
  }

  updateStreak() {
    const today = new Date().toISOString().split("T")[0];
    const lastDate = this.state.lastActiveDate;

    if (!lastDate) {
      this.state.lastActiveDate = today;
      this.state.streakDays = 1;
    } else if (lastDate === today) {
      // Same day, streak remains
    } else {
      const prevDate = new Date();
      prevDate.setDate(prevDate.getDate() - 1);
      const yesterdayStr = prevDate.toISOString().split("T")[0];

      if (lastDate === yesterdayStr) {
        this.state.streakDays += 1;
      } else {
        this.state.streakDays = 1;
      }
      this.state.lastActiveDate = today;
    }
  }

  // --- Dashboard Stats Calculations ---
  getOverallStats() {
    const totalWords = 6000;
    const masteredCount = this.state.masteredWords.length;
    const totalDaysStudied = Object.keys(this.state.dayProgressMap).length;
    const bookmarkedCount = this.state.bookmarkedWords.length;
    const wrongCount = Object.keys(this.state.wrongWordsMap).length;

    let totalScoreSum = 0;
    let totalTests = this.state.testHistory.length;
    this.state.testHistory.forEach(t => {
      totalScoreSum += t.pct;
    });

    const avgAccuracy = totalTests > 0 ? Math.round(totalScoreSum / totalTests) : 0;

    return {
      totalWords,
      masteredCount,
      masteredPct: Math.round((masteredCount / totalWords) * 100),
      totalDaysStudied,
      streakDays: this.state.streakDays || 1,
      bookmarkedCount,
      wrongCount,
      avgAccuracy
    };
  }

  // --- Theme ---
  getTheme() {
    return this.state.theme || "dark";
  }

  setTheme(themeName) {
    this.state.theme = themeName;
    this.saveState();
  }

  // Reset Progress
  resetAllProgress() {
    this.state = this.getDefaultState();
    this.saveState();
  }
}

window.vocabStore = new VocabStore();
