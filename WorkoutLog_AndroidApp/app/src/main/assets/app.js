/**
 * Workout Tracker - Core Application Logic (With Health Metrics, AI Recommendations, Nutrition & Google Sheets Auto-Sync)
 */

// Initial Seed Data for Demonstration
const DEFAULT_WORKOUT_DATA = [
  {
    id: "w-101",
    date: "2026-08-14",
    category: "weight",
    name: "벤치프레스 (Bench Press)",
    sets: [
      { weight: 60, reps: 10 },
      { weight: 70, reps: 8 },
      { weight: 80, reps: 6 },
      { weight: 80, reps: 5 }
    ],
    memo: "80kg 마지막 세트 보조 없이 완수!"
  },
  {
    id: "w-102",
    date: "2026-08-14",
    category: "bodyweight",
    name: "풀업 (Pull-ups)",
    sets: [
      { weight: 0, reps: 12 },
      { weight: 0, reps: 10 },
      { weight: 0, reps: 8 },
      { weight: 5, reps: 6 } // 추가 중량 5kg
    ],
    memo: "등 자극 위주 수행"
  },
  {
    id: "w-103",
    date: "2026-08-13",
    category: "cardio",
    name: "야외 러닝 (Outdoor Run)",
    sets: [
      { duration: 30, distance: 5.2, calories: 320 }
    ],
    memo: "페이스 5'45\" 케이던스 안정적"
  },
  {
    id: "w-104",
    date: "2026-08-12",
    category: "weight",
    name: "바벨 스쿼트 (Barbell Squat)",
    sets: [
      { weight: 80, reps: 10 },
      { weight: 100, reps: 8 },
      { weight: 110, reps: 6 },
      { weight: 120, reps: 3 }
    ],
    memo: "120kg 신기록 달성(PR)"
  },
  {
    id: "w-105",
    date: "2026-08-11",
    category: "bodyweight",
    name: "딥스 (Dips)",
    sets: [
      { weight: 0, reps: 15 },
      { weight: 0, reps: 12 },
      { weight: 0, reps: 10 }
    ],
    memo: "삼두근 자극 집중"
  },
  {
    id: "w-106",
    date: "2026-08-10",
    category: "weight",
    name: "데드리프트 (Deadlift)",
    sets: [
      { weight: 100, reps: 8 },
      { weight: 120, reps: 6 },
      { weight: 140, reps: 4 }
    ],
    memo: "허리 수직 유지 신경씀"
  }
];

// Preset Exercise Library
const PRESET_EXERCISES = [
  { name: "벤치프레스", category: "weight", target: "가슴" },
  { name: "바벨 스쿼트", category: "weight", target: "하체" },
  { name: "컨벤셔널 데드리프트", category: "weight", target: "전신/등" },
  { name: "오버헤드 프레스", category: "weight", target: "어깨" },
  { name: "바벨 로우", category: "weight", target: "등" },
  { name: "인클라인 덤벨 프레스", category: "weight", target: "가슴" },
  { name: "풀업 / 턱걸이", category: "bodyweight", target: "등" },
  { name: "푸시업 / 팔굽혀펴기", category: "bodyweight", target: "가슴/삼두" },
  { name: "딥스", category: "bodyweight", target: "가슴하부/삼두" },
  { name: "플랭크", category: "bodyweight", target: "코어" },
  { name: "러닝 / 런닝머신", category: "cardio", target: "전신" },
  { name: "사이클 / 자전거", category: "cardio", target: "하체/심폐" },
  { name: "천국의 계단 (스텝밀)", category: "cardio", target: "하체/유산소" },
  { name: "줄줄이 줄넘기", category: "cardio", target: "전신유산소" }
];

// User Configured Google Apps Script Endpoint
const USER_DEFAULT_SHEETS_URL = "https://script.google.com/macros/s/AKfycbzcAcTWwgUhHCvLRCGS4ItGw-ae5ONtIoJpvXjARA154niw2826cbkkXbh1OKu4NyUa_g/exec";

class WorkoutApp {
  constructor() {
    this.workouts = JSON.parse(localStorage.getItem('workout_tracker_data')) || DEFAULT_WORKOUT_DATA;
    
    // User Profile Health Info
    const profile = JSON.parse(localStorage.getItem('workout_user_profile')) || {
      height: 175,
      weight: 70,
      gender: 'male',
      age: 28
    };
    this.userProfile = profile;

    // Google Sheets Auto-Sync Settings (Defaulted to user's URL & AutoSync = True)
    this.sheetsWebAppUrl = localStorage.getItem('workout_sheets_url') || USER_DEFAULT_SHEETS_URL;
    const storedAutoSync = localStorage.getItem('workout_sheets_autosync');
    this.sheetsAutoSync = storedAutoSync !== null ? (storedAutoSync === 'true') : true;

    this.selectedDate = this.getFormattedDate(new Date());
    this.currentCalendarDate = new Date();
    this.editingWorkoutId = null;
    this.selectedCategory = 'weight';
    this.selectedNutritionGoal = 'hypertrophy';
    this.volumeChart = null;
    this.categoryChart = null;

    this.init();
  }

  init() {
    this.saveData();
    this.bindEvents();
    this.renderSelectedDate();
    this.renderDailyWorkouts();
    this.renderCalendar();
    this.renderLibrary();
    this.updateDashboardSummary();
    this.updateHealthMetricsDisplay();
    this.renderAIRecommendations();
    this.renderNutritionGuide();
  }

  saveData() {
    localStorage.setItem('workout_tracker_data', JSON.stringify(this.workouts));
    localStorage.setItem('workout_user_profile', JSON.stringify(this.userProfile));
    localStorage.setItem('workout_sheets_url', this.sheetsWebAppUrl);
    localStorage.setItem('workout_sheets_autosync', this.sheetsAutoSync);
  }

  getFormattedDate(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // --- Health Metrics & BMI Calculations ---
  calculateBMI() {
    const hMeters = this.userProfile.height / 100;
    if (!hMeters || hMeters <= 0) return 0;
    const bmi = this.userProfile.weight / (hMeters * hMeters);
    return Math.round(bmi * 10) / 10;
  }

  getBMICategory(bmi) {
    if (bmi < 18.5) return { text: '저체중', class: 'underweight', advice: '체중 증량을 위해 충분한 탄수화물/단백질 섭취와 웨이트 트레이닝을 권장합니다.' };
    if (bmi <= 22.9) return { text: '정상', class: 'normal', advice: '건강한 정상 체중을 유지 중입니다! 근가비대와 유산소 운동을 균형 있게 병행해 보세요.' };
    if (bmi <= 24.9) return { text: '과체중 (비만 전단계)', class: 'overweight', advice: '적절한 체중 관리를 위해 유산소 운동 비중을 늘리고 식이조절을 병행하는 것이 좋습니다.' };
    return { text: '비만', class: 'obese', advice: '꾸준한 유산소 운동과 체중 감량을 위한 식이요법 관리가 적극 추천됩니다.' };
  }

  calculateStandardWeight() {
    const hMeters = this.userProfile.height / 100;
    const factor = this.userProfile.gender === 'female' ? 21 : 22;
    return Math.round(hMeters * hMeters * factor * 10) / 10;
  }

  calculateBMR() {
    const w = this.userProfile.weight;
    const h = this.userProfile.height;
    const a = this.userProfile.age || 28;
    const genderOffset = this.userProfile.gender === 'female' ? -161 : 5;
    const bmr = (10 * w) + (6.25 * h) - (5 * a) + genderOffset;
    return Math.round(bmr);
  }

  calculateTDEE() {
    return Math.round(this.calculateBMR() * 1.375);
  }

  updateHealthMetricsDisplay() {
    const bmi = this.calculateBMI();
    const cat = this.getBMICategory(bmi);
    const stdW = this.calculateStandardWeight();
    const bmr = this.calculateBMR();
    const tdee = this.calculateTDEE();

    const navText = document.getElementById('nav-profile-summary-text');
    if (navText) {
      navText.textContent = `키: ${this.userProfile.height}cm | 체중: ${this.userProfile.weight}kg (BMI: ${bmi} ${cat.text})`;
    }

    if (document.getElementById('res-bmi-val')) {
      document.getElementById('res-bmi-val').textContent = bmi;
      
      const badge = document.getElementById('res-bmi-badge');
      badge.textContent = cat.text;
      badge.className = `bmi-status-tag ${cat.class}`;

      document.getElementById('res-std-weight-val').textContent = `${stdW} kg`;
      document.getElementById('res-bmr-val').textContent = `${bmr.toLocaleString()} kcal`;
      document.getElementById('res-tdee-val').textContent = `${tdee.toLocaleString()} kcal`;
      document.getElementById('res-advice-text').textContent = cat.advice;

      const clampedBmi = Math.min(Math.max(bmi, 15), 32);
      const percentage = ((clampedBmi - 15) / (32 - 15)) * 100;
      document.getElementById('bmi-pin-indicator').style.left = `${percentage}%`;
    }
  }

  calculateWorkoutCalories(item) {
    const weight = this.userProfile.weight || 70;
    let totalKcal = 0;

    if (item.category === 'cardio') {
      item.sets.forEach(s => {
        if (s.calories && s.calories > 0) {
          totalKcal += Number(s.calories);
        } else {
          const duration = Number(s.duration) || 0;
          totalKcal += 8.5 * weight * (duration / 60);
        }
      });
    } else if (item.category === 'weight') {
      item.sets.forEach(s => {
        const reps = Number(s.reps) || 0;
        const load = Number(s.weight) || 0;
        const setDurationMins = Math.max(1.5, (reps * 4 + 60) / 60);
        const baseKcal = 6.0 * weight * (setDurationMins / 60);
        const intensityFactor = 1 + (load / 200);
        totalKcal += baseKcal * intensityFactor;
      });
    } else if (item.category === 'bodyweight') {
      item.sets.forEach(s => {
        const reps = Number(s.reps) || 0;
        const setDurationMins = Math.max(1.5, (reps * 3 + 45) / 60);
        totalKcal += 5.0 * weight * (setDurationMins / 60);
      });
    }

    return Math.round(totalKcal);
  }

  // --- Google Sheets Sync Engine ---
  sendToGoogleSheets(workoutItem) {
    if (!this.sheetsWebAppUrl || !this.sheetsAutoSync) return;

    const payload = {
      ...workoutItem,
      calories: this.calculateWorkoutCalories(workoutItem)
    };

    fetch(this.sheetsWebAppUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(() => {
      console.log('Successfully posted workout to Google Sheets');
    }).catch(err => {
      console.error('Google Sheets sync error:', err);
    });
  }

  syncAllToGoogleSheets() {
    if (!this.sheetsWebAppUrl) {
      alert("먼저 구글 Apps Script 웹 앱 URL을 입력해 주세요.");
      return;
    }

    let count = 0;
    this.workouts.forEach(item => {
      const payload = {
        ...item,
        calories: this.calculateWorkoutCalories(item)
      };
      fetch(this.sheetsWebAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      count++;
    });

    this.showToast(`전체 ${count}개 운동 데이터 구글 시트로 동기화 완료!`);
  }

  // --- AI Smart Workout Recommendation Engine ---
  renderAIRecommendations() {
    const container = document.getElementById('ai-rec-cards-container');
    if (!container) return;

    const recentWorkouts = this.workouts.slice(0, 15);
    const categoryCounts = { weight: 0, cardio: 0, bodyweight: 0 };
    let highestWeightPR = { name: '바벨 스쿼트', weight: 100 };

    recentWorkouts.forEach(w => {
      if (categoryCounts[w.category] !== undefined) categoryCounts[w.category]++;
      if (w.category === 'weight') {
        w.sets.forEach(s => {
          if (s.weight > highestWeightPR.weight) {
            highestWeightPR = { name: w.name, weight: s.weight };
          }
        });
      }
    });

    const recommendations = [];

    if (highestWeightPR.weight > 0) {
      const nextTargetWeight = highestWeightPR.weight + 2.5;
      recommendations.push({
        tag: '📈 점진적 과부하 AI 추천',
        title: `${highestWeightPR.name} ${nextTargetWeight}kg 도전`,
        desc: `최근 최고 기록 ${highestWeightPR.weight}kg 완수를 바탕으로, 다음 세션에서는 +2.5kg 증량한 ${nextTargetWeight}kg으로 5회 3세트에 도전해 보세요!`,
        actionText: '스쿼트 루틴 적용',
        name: highestWeightPR.name,
        category: 'weight'
      });
    }

    if (categoryCounts.cardio === 0 || categoryCounts.cardio < categoryCounts.weight / 3) {
      recommendations.push({
        tag: '🏃 심폐지구력 & 지방 연소',
        title: 'Zone 2 인클라인 런닝머신 30분',
        desc: '최근 유산소 운동 비중이 상대적으로 낮습니다. 심폐 기능 강화 및 체지방 분해를 위해 경사도 5%, 속도 5.5km/h 인터벌 추천!',
        actionText: '유산소 추가',
        name: '인클라인 런닝머신 (Zone 2)',
        category: 'cardio'
      });
    }

    recommendations.push({
      tag: '🧘 코어 & 전신 안정성',
      title: '플랭크 & 맨몸 딥스 수퍼세트',
      desc: '상체 근육 휴식 및 코어 강화 시즌입니다. 플랭크 1분 3세트와 딥스 12회 4세트로 상체 볼륨과 코어를 다져보세요.',
      actionText: '맨몸운동 추가',
      name: '플랭크 & 딥스',
      category: 'bodyweight'
    });

    container.innerHTML = recommendations.map(rec => `
      <div class="ai-rec-card">
        <div>
          <div class="ai-rec-tag">${rec.tag}</div>
          <div class="ai-rec-title">${rec.title}</div>
          <div class="ai-rec-desc">${rec.desc}</div>
        </div>
        <button class="primary-btn btn-sm" onclick="app.quickAddFromLibrary('${rec.name}', '${rec.category}')">
          <i class="fas fa-plus-circle"></i> ${rec.actionText}
        </button>
      </div>
    `).join('');
  }

  // --- 1:1 Nutrition & Protein Guide ---
  renderNutritionGuide() {
    const weight = this.userProfile.weight || 70;
    const tdee = this.calculateTDEE();
    const goal = this.selectedNutritionGoal;

    let proteinMultiplier = 1.8;
    let calorieMultiplier = 1.1;

    if (goal === 'fatloss') {
      proteinMultiplier = 2.2;
      calorieMultiplier = 0.85;
    } else if (goal === 'maintain') {
      proteinMultiplier = 1.6;
      calorieMultiplier = 1.0;
    }

    const targetCalories = Math.round(tdee * calorieMultiplier);
    const targetProtein = Math.round(weight * proteinMultiplier);
    const targetFats = Math.round((targetCalories * 0.25) / 9);
    const targetCarbs = Math.round((targetCalories - (targetProtein * 4 + targetFats * 9)) / 4);

    const chickenBreastCount = (targetProtein / 30).toFixed(1);
    const eggCount = Math.round(targetProtein / 6);

    document.getElementById('macro-protein-val').textContent = `${targetProtein} g`;
    document.getElementById('macro-protein-food').textContent = `닭가슴살 약 ${chickenBreastCount}덩이 (100g 기준) / 계란 ${eggCount}개 분량`;

    document.getElementById('macro-carbs-val').textContent = `${targetCarbs} g`;
    document.getElementById('macro-fats-val').textContent = `${targetFats} g`;
  }

  bindEvents() {
    // Open Google Sheets Modal
    document.getElementById('open-sheets-modal-btn').addEventListener('click', () => {
      document.getElementById('sheets-web-app-url').value = this.sheetsWebAppUrl;
      document.getElementById('sheets-auto-sync-checkbox').checked = this.sheetsAutoSync;
      document.getElementById('sheets-modal').classList.add('active');
    });

    document.querySelectorAll('.close-sheets-modal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('sheets-modal').classList.remove('active');
      });
    });

    document.getElementById('save-sheets-config-btn').addEventListener('click', () => {
      this.sheetsWebAppUrl = document.getElementById('sheets-web-app-url').value.trim();
      this.sheetsAutoSync = document.getElementById('sheets-auto-sync-checkbox').checked;
      this.saveData();
      document.getElementById('sheets-modal').classList.remove('active');
      this.showToast("구글 스프레드시트 연동 설정이 저장되었습니다.");
    });

    document.getElementById('copy-script-code-btn').addEventListener('click', () => {
      const codeText = document.getElementById('apps-script-code-text').textContent;
      navigator.clipboard.writeText(codeText).then(() => {
        this.showToast("Google Apps Script 코드가 복사되었습니다!");
      });
    });

    document.getElementById('sync-all-to-sheets-btn').addEventListener('click', () => {
      this.syncAllToGoogleSheets();
    });

    // Open Profile Modal
    document.getElementById('open-profile-modal-btn').addEventListener('click', () => {
      document.getElementById('profile-height-input').value = this.userProfile.height;
      document.getElementById('profile-weight-input').value = this.userProfile.weight;
      document.getElementById('profile-gender-select').value = this.userProfile.gender || 'male';
      document.getElementById('profile-age-input').value = this.userProfile.age || 28;
      
      this.updateHealthMetricsDisplay();
      document.getElementById('profile-modal').classList.add('active');
    });

    // Close Profile Modal
    document.querySelectorAll('.close-profile-modal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('profile-modal').classList.remove('active');
      });
    });

    ['profile-height-input', 'profile-weight-input', 'profile-gender-select', 'profile-age-input'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => {
        this.userProfile.height = parseFloat(document.getElementById('profile-height-input').value) || 175;
        this.userProfile.weight = parseFloat(document.getElementById('profile-weight-input').value) || 70;
        this.userProfile.gender = document.getElementById('profile-gender-select').value;
        this.userProfile.age = parseInt(document.getElementById('profile-age-input').value) || 28;

        this.updateHealthMetricsDisplay();
        this.renderNutritionGuide();
      });
    });

    document.getElementById('save-profile-btn').addEventListener('click', () => {
      this.saveData();
      this.renderDailyWorkouts();
      this.updateDashboardSummary();
      this.renderAIRecommendations();
      this.renderNutritionGuide();
      document.getElementById('profile-modal').classList.remove('active');
      this.showToast("신체 정보 및 건강지표가 저장되었습니다.");
    });

    document.querySelectorAll('.goal-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.goal-pill').forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        this.selectedNutritionGoal = pill.dataset.goal;
        this.renderNutritionGuide();
      });
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabTarget = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(`tab-${tabTarget}`).classList.add('active');

        if (tabTarget === 'stats') {
          this.renderCharts();
          this.renderPRTable();
        } else if (tabTarget === 'calendar') {
          this.renderCalendar();
        } else if (tabTarget === 'ai-guide') {
          this.renderAIRecommendations();
          this.renderNutritionGuide();
        }
      });
    });

    const dateInput = document.getElementById('selected-date-picker');
    dateInput.value = this.selectedDate;
    dateInput.addEventListener('change', (e) => {
      this.selectedDate = e.target.value;
      this.renderSelectedDate();
      this.renderDailyWorkouts();
    });

    document.getElementById('prev-date-btn').addEventListener('click', () => {
      const current = new Date(this.selectedDate);
      current.setDate(current.getDate() - 1);
      this.selectedDate = this.getFormattedDate(current);
      document.getElementById('selected-date-picker').value = this.selectedDate;
      this.renderSelectedDate();
      this.renderDailyWorkouts();
    });

    document.getElementById('next-date-btn').addEventListener('click', () => {
      const current = new Date(this.selectedDate);
      current.setDate(current.getDate() + 1);
      this.selectedDate = this.getFormattedDate(current);
      document.getElementById('selected-date-picker').value = this.selectedDate;
      this.renderSelectedDate();
      this.renderDailyWorkouts();
    });

    document.getElementById('today-date-btn').addEventListener('click', () => {
      this.selectedDate = this.getFormattedDate(new Date());
      document.getElementById('selected-date-picker').value = this.selectedDate;
      this.renderSelectedDate();
      this.renderDailyWorkouts();
    });

    document.getElementById('theme-toggle-btn').addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      document.getElementById('theme-toggle-btn').innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
      if (document.getElementById('tab-stats').classList.contains('active')) {
        this.renderCharts();
      }
    });

    document.getElementById('open-add-modal-btn').addEventListener('click', () => {
      this.openWorkoutModal();
    });

    document.querySelectorAll('.cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        this.selectedCategory = pill.dataset.category;
        this.updateModalSetFields();
      });
    });

    document.getElementById('add-set-row-btn').addEventListener('click', () => {
      this.addSetRowInput();
    });

    document.querySelectorAll('.close-modal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeModal();
      });
    });

    document.getElementById('workout-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveWorkoutEntry();
    });

    document.getElementById('export-data-btn').addEventListener('click', () => {
      const exportObj = {
        userProfile: this.userProfile,
        workouts: this.workouts
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `workout_backup_${this.selectedDate}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      this.showToast("데이터 백업 파일이 다운로드 되었습니다!");
    });

    document.getElementById('import-file-input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          if (Array.isArray(importedData)) {
            this.workouts = importedData;
          } else if (importedData.workouts && Array.isArray(importedData.workouts)) {
            this.workouts = importedData.workouts;
            if (importedData.userProfile) {
              this.userProfile = importedData.userProfile;
            }
          }
          this.saveData();
          this.renderDailyWorkouts();
          this.updateDashboardSummary();
          this.updateHealthMetricsDisplay();
          this.renderAIRecommendations();
          this.renderNutritionGuide();
          this.showToast("성공적으로 데이터를 불러왔습니다!");
        } catch (err) {
          alert("유효하지 않은 JSON 데이터 파일입니다.");
        }
      };
      reader.readAsText(file);
    });

    document.getElementById('cal-prev-month').addEventListener('click', () => {
      this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() - 1);
      this.renderCalendar();
    });

    document.getElementById('cal-next-month').addEventListener('click', () => {
      this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + 1);
      this.renderCalendar();
    });
  }

  renderSelectedDate() {
    const dateObj = new Date(this.selectedDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
    const dateText = dateObj.toLocaleDateString('ko-KR', options);
    
    document.getElementById('display-date-text').textContent = dateText;
    
    const todayStr = this.getFormattedDate(new Date());
    const isToday = this.selectedDate === todayStr;
    document.getElementById('today-badge-el').style.display = isToday ? 'inline-block' : 'none';
  }

  renderDailyWorkouts() {
    const dailyItems = this.workouts.filter(item => item.date === this.selectedDate);
    const listContainer = document.getElementById('workout-list-container');

    if (dailyItems.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-dumbbell"></i>
          <h3>이날은 기록된 운동이 없습니다</h3>
          <p>상단의 '+ 운동 기록 추가' 버튼을 눌러 운동 일지를 작성해보세요!</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = dailyItems.map(item => {
      let categoryLabel = '웨이트';
      let categoryClass = 'weight';
      if (item.category === 'cardio') { categoryLabel = '유산소'; categoryClass = 'cardio'; }
      if (item.category === 'bodyweight') { categoryLabel = '맨몸운동'; categoryClass = 'bodyweight'; }

      const estimatedKcal = this.calculateWorkoutCalories(item);

      let setRowsHTML = '';
      if (item.category === 'cardio') {
        setRowsHTML = item.sets.map((s, idx) => `
          <tr>
            <td><span class="set-number-tag">${idx + 1}세트</span></td>
            <td><strong>${s.duration || 0}</strong> 분</td>
            <td><strong>${s.distance || 0}</strong> km</td>
            <td><strong>${s.calories || Math.round(8.5 * (this.userProfile.weight || 70) * ((s.duration || 0) / 60))}</strong> kcal</td>
          </tr>
        `).join('');
      } else {
        setRowsHTML = item.sets.map((s, idx) => `
          <tr>
            <td><span class="set-number-tag">${idx + 1}세트</span></td>
            <td><strong>${s.weight || 0}</strong> kg</td>
            <td><strong>${s.reps || 0}</strong> 회</td>
            <td>볼륨: ${ (s.weight || 0) * (s.reps || 0) } kg</td>
          </tr>
        `).join('');
      }

      const tableHeaders = item.category === 'cardio'
        ? `<th>세트</th><th>시간</th><th>거리</th><th>소모 칼로리</th>`
        : `<th>세트</th><th>중량</th><th>횟수</th><th>총 볼륨</th>`;

      return `
        <div class="workout-card category-${categoryClass}">
          <div class="workout-card-header">
            <div class="exercise-meta">
              <span class="category-badge ${categoryClass}">${categoryLabel}</span>
              <span class="calorie-badge" title="체중 ${this.userProfile.weight}kg 기준 추정 소모 칼로리"><i class="fas fa-fire"></i> 약 ${estimatedKcal} kcal</span>
              <h3 class="exercise-title">${this.escapeHtml(item.name)}</h3>
            </div>
            <div class="exercise-actions">
              <button class="action-icon-btn" onclick="app.editWorkoutEntry('${item.id}')" title="수정"><i class="fas fa-pen"></i></button>
              <button class="action-icon-btn delete" onclick="app.deleteWorkoutEntry('${item.id}')" title="삭제"><i class="fas fa-trash"></i></button>
            </div>
          </div>

          <table class="set-table">
            <thead>
              <tr>${tableHeaders}</tr>
            </thead>
            <tbody>
              ${setRowsHTML}
            </tbody>
          </table>

          ${item.memo ? `<div class="workout-memo"><i class="fas fa-sticky-note"></i> ${this.escapeHtml(item.memo)}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  updateDashboardSummary() {
    const todayStr = this.selectedDate;
    const dailyItems = this.workouts.filter(w => w.date === todayStr);

    let totalVolume = 0;
    let totalCalories = 0;

    dailyItems.forEach(w => {
      if (w.category !== 'cardio') {
        w.sets.forEach(s => {
          totalVolume += (Number(s.weight) || 0) * (Number(s.reps) || 0);
        });
      }
      totalCalories += this.calculateWorkoutCalories(w);
    });

    document.getElementById('dash-volume-val').textContent = totalVolume.toLocaleString();
    document.getElementById('dash-calories-val').textContent = totalCalories.toLocaleString();
    document.getElementById('dash-count-val').textContent = dailyItems.length;

    const workoutDates = [...new Set(this.workouts.map(w => w.date))].sort().reverse();
    let streak = 0;
    let checkDate = new Date();
    
    const todayFormatted = this.getFormattedDate(checkDate);
    checkDate.setDate(checkDate.getDate() - 1);
    const yestFormatted = this.getFormattedDate(checkDate);

    if (workoutDates.includes(todayFormatted) || workoutDates.includes(yestFormatted)) {
      let curr = new Date(workoutDates.includes(todayFormatted) ? todayFormatted : yestFormatted);
      while (workoutDates.includes(this.getFormattedDate(curr))) {
        streak++;
        curr.setDate(curr.getDate() - 1);
      }
    }

    document.getElementById('dash-streak-val').textContent = streak;
  }

  openWorkoutModal(workoutToEdit = null) {
    const modal = document.getElementById('workout-modal');
    const form = document.getElementById('workout-form');
    form.reset();

    if (workoutToEdit) {
      this.editingWorkoutId = workoutToEdit.id;
      document.getElementById('modal-title-text').textContent = '운동 기록 수정';
      document.getElementById('exercise-name-input').value = workoutToEdit.name;
      document.getElementById('exercise-memo-input').value = workoutToEdit.memo || '';
      
      this.selectedCategory = workoutToEdit.category;
      document.querySelectorAll('.cat-pill').forEach(p => {
        p.classList.toggle('selected', p.dataset.category === workoutToEdit.category);
      });

      this.renderSetRowInputs(workoutToEdit.sets);
    } else {
      this.editingWorkoutId = null;
      document.getElementById('modal-title-text').textContent = '새 운동 추가';
      this.selectedCategory = 'weight';
      document.querySelectorAll('.cat-pill').forEach(p => {
        p.classList.toggle('selected', p.dataset.category === 'weight');
      });
      this.renderSetRowInputs([ { weight: '', reps: '' } ]);
    }

    modal.classList.add('active');
  }

  closeModal() {
    document.getElementById('workout-modal').classList.remove('active');
  }

  updateModalSetFields() {
    this.renderSetRowInputs([{ weight: '', reps: '', duration: '', distance: '' }]);
  }

  renderSetRowInputs(setsArray) {
    const container = document.getElementById('sets-inputs-container');
    const header = document.getElementById('sets-input-header-el');

    if (this.selectedCategory === 'cardio') {
      header.innerHTML = `<div>세트</div><div>시간 (분)</div><div>거리 (km)</div><div></div>`;
      container.innerHTML = setsArray.map((s, i) => `
        <div class="set-row">
          <span class="set-num">${i + 1}</span>
          <input type="number" step="1" class="form-control input-duration" value="${s.duration || ''}" placeholder="30">
          <input type="number" step="0.1" class="form-control input-distance" value="${s.distance || ''}" placeholder="5.0">
          <button type="button" class="action-icon-btn delete" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
        </div>
      `).join('');
    } else {
      header.innerHTML = `<div>세트</div><div>중량 (kg)</div><div>횟수 (회)</div><div></div>`;
      container.innerHTML = setsArray.map((s, i) => `
        <div class="set-row">
          <span class="set-num">${i + 1}</span>
          <input type="number" step="0.5" class="form-control input-weight" value="${s.weight !== undefined ? s.weight : ''}" placeholder="60">
          <input type="number" step="1" class="form-control input-reps" value="${s.reps || ''}" placeholder="10">
          <button type="button" class="action-icon-btn delete" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
        </div>
      `).join('');
    }
  }

  addSetRowInput() {
    const container = document.getElementById('sets-inputs-container');
    const currentRows = container.querySelectorAll('.set-row').length;
    const newIdx = currentRows + 1;

    let newRow = document.createElement('div');
    newRow.className = 'set-row';

    if (this.selectedCategory === 'cardio') {
      newRow.innerHTML = `
        <span class="set-num">${newIdx}</span>
        <input type="number" step="1" class="form-control input-duration" placeholder="30">
        <input type="number" step="0.1" class="form-control input-distance" placeholder="5.0">
        <button type="button" class="action-icon-btn delete" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
      `;
    } else {
      const prevWeightInput = container.querySelector('.set-row:last-child .input-weight');
      const defaultWeight = prevWeightInput ? prevWeightInput.value : '';

      newRow.innerHTML = `
        <span class="set-num">${newIdx}</span>
        <input type="number" step="0.5" class="form-control input-weight" value="${defaultWeight}" placeholder="60">
        <input type="number" step="1" class="form-control input-reps" placeholder="10">
        <button type="button" class="action-icon-btn delete" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
      `;
    }

    container.appendChild(newRow);
  }

  saveWorkoutEntry() {
    const name = document.getElementById('exercise-name-input').value.trim();
    const memo = document.getElementById('exercise-memo-input').value.trim();

    if (!name) {
      alert("운동 종목명을 입력해주세요.");
      return;
    }

    const setRows = document.querySelectorAll('#sets-inputs-container .set-row');
    const sets = [];

    setRows.forEach(row => {
      if (this.selectedCategory === 'cardio') {
        const duration = parseFloat(row.querySelector('.input-duration').value) || 0;
        const distance = parseFloat(row.querySelector('.input-distance').value) || 0;
        if (duration > 0 || distance > 0) {
          const estimatedKcal = Math.round(8.5 * (this.userProfile.weight || 70) * (duration / 60));
          sets.push({ duration, distance, calories: estimatedKcal });
        }
      } else {
        const weight = parseFloat(row.querySelector('.input-weight').value) || 0;
        const reps = parseInt(row.querySelector('.input-reps').value) || 0;
        if (reps > 0 || weight >= 0) {
          sets.push({ weight, reps });
        }
      }
    });

    if (sets.length === 0) {
      alert("적어도 하나의 세트 데이터를 입력해주세요.");
      return;
    }

    let savedEntry = null;

    if (this.editingWorkoutId) {
      const targetIndex = this.workouts.findIndex(w => w.id === this.editingWorkoutId);
      if (targetIndex !== -1) {
        this.workouts[targetIndex] = {
          ...this.workouts[targetIndex],
          category: this.selectedCategory,
          name,
          sets,
          memo
        };
        savedEntry = this.workouts[targetIndex];
      }
      this.showToast("운동 기록이 수정되었습니다.");
    } else {
      const newEntry = {
        id: 'w-' + Date.now(),
        date: this.selectedDate,
        category: this.selectedCategory,
        name,
        sets,
        memo
      };
      this.workouts.unshift(newEntry);
      savedEntry = newEntry;
      this.showToast("새 운동 기록이 추가되었습니다!");
    }

    if (savedEntry) {
      this.sendToGoogleSheets(savedEntry);
    }

    this.saveData();
    this.closeModal();
    this.renderDailyWorkouts();
    this.updateDashboardSummary();
    this.renderCalendar();
    this.renderAIRecommendations();
  }

  editWorkoutEntry(id) {
    const target = this.workouts.find(w => w.id === id);
    if (target) {
      this.openWorkoutModal(target);
    }
  }

  deleteWorkoutEntry(id) {
    if (confirm("정말 이 운동 기록을 삭제하시겠습니까?")) {
      this.workouts = this.workouts.filter(w => w.id !== id);
      this.saveData();
      this.renderDailyWorkouts();
      this.updateDashboardSummary();
      this.renderCalendar();
      this.renderAIRecommendations();
      this.showToast("기록이 삭제되었습니다.");
    }
  }

  // --- Statistics & Charts ---
  renderCharts() {
    this.renderVolumeChart();
    this.renderCategoryChart();
  }

  renderVolumeChart() {
    const ctx = document.getElementById('volumeChartCanvas').getContext('2d');
    
    const dateMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = this.getFormattedDate(d);
      dateMap[dateStr] = 0;
    }

    this.workouts.forEach(w => {
      if (dateMap[w.date] !== undefined && w.category !== 'cardio') {
        w.sets.forEach(s => {
          dateMap[w.date] += (Number(s.weight) || 0) * (Number(s.reps) || 0);
        });
      }
    });

    const labels = Object.keys(dateMap).map(d => d.slice(5));
    const dataValues = Object.values(dateMap);

    if (this.volumeChart) {
      this.volumeChart.destroy();
    }

    this.volumeChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: '총 운동 볼륨 (kg)',
          data: dataValues,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          fill: true,
          tension: 0.35,
          borderWidth: 3,
          pointBackgroundColor: '#a78bfa',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
        }
      }
    });
  }

  renderCategoryChart() {
    const ctx = document.getElementById('categoryChartCanvas').getContext('2d');

    const counts = { weight: 0, cardio: 0, bodyweight: 0 };
    this.workouts.forEach(w => {
      if (counts[w.category] !== undefined) counts[w.category]++;
    });

    if (this.categoryChart) {
      this.categoryChart.destroy();
    }

    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['웨이트', '유산소', '맨몸운동'],
        datasets: [{
          data: [counts.weight, counts.cardio, counts.bodyweight],
          backgroundColor: ['#8b5cf6', '#06b6d4', '#10b981'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#94a3b8' } }
        }
      }
    });
  }

  renderPRTable() {
    const prContainer = document.getElementById('pr-grid-container');
    const prMap = {};

    this.workouts.forEach(w => {
      if (w.category !== 'cardio') {
        w.sets.forEach(s => {
          const wgt = Number(s.weight) || 0;
          if (!prMap[w.name] || wgt > prMap[w.name].weight) {
            prMap[w.name] = { weight: wgt, reps: s.reps, category: w.category };
          }
        });
      }
    });

    const entries = Object.entries(prMap);
    if (entries.length === 0) {
      prContainer.innerHTML = '<p style="color:var(--text-muted)">기록된 웨이트/맨몸 운동 최고 기록이 없습니다.</p>';
      return;
    }

    prContainer.innerHTML = entries.map(([name, record]) => `
      <div class="pr-item">
        <div>
          <div class="pr-item-name">${this.escapeHtml(name)}</div>
          <div class="pr-item-category">${record.category === 'weight' ? '웨이트' : '맨몸운동'}</div>
        </div>
        <div class="pr-item-record">${record.weight} kg <span style="font-size:0.8rem;color:var(--text-muted)">(${record.reps}회)</span></div>
      </div>
    `).join('');
  }

  // --- Calendar View ---
  renderCalendar() {
    const year = this.currentCalendarDate.getFullYear();
    const month = this.currentCalendarDate.getMonth();

    document.getElementById('cal-month-title').textContent = `${year}년 ${month + 1}월`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid = document.getElementById('calendar-grid-days');
    grid.innerHTML = '';

    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'calendar-day-cell other-month';
      grid.appendChild(emptyCell);
    }

    const todayStr = this.getFormattedDate(new Date());

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const cell = document.createElement('div');
      cell.className = 'calendar-day-cell';
      if (dateStr === todayStr) cell.classList.add('today');
      if (dateStr === this.selectedDate) cell.classList.add('selected');

      const dayWorkouts = this.workouts.filter(w => w.date === dateStr);
      const categoriesDone = [...new Set(dayWorkouts.map(w => w.category))];

      const dotsHTML = categoriesDone.map(c => `<span class="dot ${c}"></span>`).join('');

      cell.innerHTML = `
        <span class="day-number">${day}</span>
        <div class="day-dots">${dotsHTML}</div>
      `;

      cell.addEventListener('click', () => {
        this.selectedDate = dateStr;
        document.getElementById('selected-date-picker').value = this.selectedDate;
        this.renderSelectedDate();
        this.renderDailyWorkouts();
        this.renderCalendar();
        
        document.querySelector('.tab-btn[data-tab="daily"]').click();
      });

      grid.appendChild(cell);
    }
  }

  // --- Exercise Library ---
  renderLibrary() {
    const container = document.getElementById('library-grid-container');
    container.innerHTML = PRESET_EXERCISES.map(item => `
      <div class="preset-card" onclick="app.quickAddFromLibrary('${item.name}', '${item.category}')">
        <div class="preset-info">
          <h4>${item.name}</h4>
          <span>부위: ${item.target}</span>
        </div>
        <button class="primary-btn btn-sm"><i class="fas fa-plus"></i> 선택</button>
      </div>
    `).join('');
  }

  quickAddFromLibrary(name, category) {
    document.querySelector('.tab-btn[data-tab="daily"]').click();
    this.selectedCategory = category;
    this.openWorkoutModal({
      id: null,
      name,
      category,
      sets: category === 'cardio' ? [{ duration: 30, distance: 5 }] : [{ weight: 60, reps: 10 }]
    });
  }

  showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle" style="color:var(--success-color)"></i> ${msg}`;
    document.getElementById('toast-container').appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }
}

// Global App Instance
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new WorkoutApp();
});
