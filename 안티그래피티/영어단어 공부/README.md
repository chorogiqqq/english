# 📚 6,000 Essential English Words - Daily 20 Words Vocabulary & Testing System

책, 소설, 신문 미디어 및 학술 논문에서 가장 자주 쓰이는 **6,000개 필수 영단어**를 300일 프로그램(매일 20단어)으로 완벽 암기하고 테스트하는 웹 & 모바일 학습 시스템입니다.

🔗 **라이브 웹사이트 (Live Site)**: [https://chorogiqqq.github.io/english](https://chorogiqqq.github.io/english)

---

## 🌟 주요 기능 (Key Features)

1. **6,000 단어 300일 프로그램 (일일 20단어)**
   - **Level 1 (Days 1–100 / Words 1–2,000)**: 일상생활 및 필수 핵심 어휘
   - **Level 2 (Days 101–200 / Words 2,001–4,000)**: 도서, 소설, 언론 미디어 자주 쓰이는 어휘
   - **Level 3 (Days 201–300 / Words 4,001–6,000)**: 학술 논문 및 과학 전문 어휘

2. **📖 오늘의 학습 단어 (Flashcard & TTS)**
   - 발음기호(IPA), 품사, 한국어 뜻, 예문(영문/한글)
   - Web Speech API 음성 재생 (단어 및 예문 듣기)
   - 3D 입체 플래시카드 뒤집기 및 자동 슬라이드 쇼 모드
   - 카드 뷰 vs 목록 뷰 전환

3. **✍️ 일일 테스트 & 퀴즈 엔진**
   - 4지 선다형 퀴즈 (영단어 - 한국어 뜻 매칭)
   - 받아쓰기 / 스펠링 테스트 (한국어 뜻 및 발음 듣고 영단어 입력)
   - 카드 짝맞추기 게임 (6쌍의 카드 매칭)
   - 틀린 단어 자동 오답 노트 저장

4. **📓 오답 노트 & 북마크 단어장**
   - 틀린 단어 및 미숙 단어 전용 수집
   - 오답 노트 전용 복습 퀴즈 지원

5. **📊 학습 성과 & 300일 달력 매트릭스**
   - 연속 학습 스트릭(Streak), 암기 완료 수, 평균 정답률 계산
   - 300일 달력 매트릭스 (원하는 날짜로 자유 이동)

6. **📱 아이폰 & 안드로이드 앱 지원**
   - **아이폰 (iOS PWA)**: Safari에서 `홈 화면에 추가`하여 설치 필요 없이 전용 모바일 앱으로 동작
   - **안드로이드 (Android Studio)**: `android/` 폴더 내 프로젝트 포함 (100% 오프라인 동작 APK 빌드 지원)

---

## 🛠️ 프로젝트 구조 (Project Structure)

```
c:\Users\USER\Desktop\3기 정은호\안티그래피티\영어단어 공부\
├── index.html                  # 메인 웹앱 파일 (PWA 모바일 지원)
├── css/
│   ├── theme.css               # 다크/라이트 테마 시스템
│   ├── main.css                # 메인 레이아웃 및 반응형 그리드
│   └── components.css         # 3D 카드, 퀴즈 모듈, 300일 매트릭스
├── js/
│   ├── data/
│   │   ├── words-level1.js    # Level 1 (1~2000 단어 데이터)
│   │   ├── words-level2.js    # Level 2 (2001~4000 단어 데이터)
│   │   └── words-level3.js    # Level 3 (4001~6000 단어 데이터)
│   ├── store.js               # LocalStorage 상태 관리
│   ├── tts.js                 # Web Speech API 음성 엔진
│   ├── study.js               # 플래시카드 및 슬라이드 쇼 로직
│   ├── quiz.js                # 4지선다/스펠링/짝맞추기 퀴즈 엔진
│   ├── stats.js               # 300일 매트릭스 및 학습 통계
│   └── app.js                 # 애플리케이션 라우터 및 컨트롤러
├── android/                    # 안드로이드 스튜디오 전용 APK 프로젝트 (Kotlin)
└── scripts/
    └── sync_to_drive.ps1      # Google Drive & GitHub 자동 동기화 스크립트
```

---

## 💾 데이터 백업 및 복원
앱 내 `📊 학습 현황 & 300일 달력` 메뉴 하단의 `💾 데이터 백업 저장 (JSON)` 버튼으로 진도 파일을 다운로드하고 `📂 데이터 복원 불러오기` 버튼으로 기기 간 진도를 자유롭게 복원할 수 있습니다.
