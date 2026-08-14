// Embedded Default Lyric Data ('파도와 교복')
const DEFAULT_LRC = `[ti:파도와 교복]
[re:SUNO 가사 다운로더]
[id:97f334e2-3237-45b7-8750-0b09650f1950]

[00:15.16]창문 너머로 바람이 와
[00:22.02]젖은 운동장 냄새를 데리고
[00:25.77]구겨진 하루를 펼치면
[00:36.86]네가 웃던 장면이 나와
[00:44.28]손바닥 위에 남은 온기
[00:50.58]조금은 흐려져도 괜찮아
[00:57.92]오늘의 나는 느리게 가도
[01:02.23]내일의 나를 안아줄래
[01:09.73]멀리서 들려오는 파도 소리
[01:13.40]내 마음 끝을 살짝 적셔와
[01:16.99]넘어져도 다시 일어날 수 있게
[01:20.66]너의 이름이 등을 밀어줘
[01:25.61]괜찮아, 천천히 가도 돼
[01:29.60]우리의 여름은 아직 길어
[01:39.81]눈물 끝에 피는 햇살처럼
[01:46.99]너는 너답게 빛나면 돼
[01:54.73]괜찮아, 천천히 가도 돼
[01:58.88]오늘도 우린 잘 버티잖아
[02:08.85]서툰 마음도 괜찮다고
[02:16.51]서로에게 말해주자
[02:24.25]하얀 운동화에 묻은 먼지
[02:28.32]그날의 설렘처럼 남아 있고
[02:37.89]한 번쯤 흔들린 나날들도
[02:42.28]지금의 나를 만들었어
[02:49.70]골목 끝 작은 아이스크림 가게
[02:56.09]녹아내린 시간들 사이로
[03:00.55]네가 건넨 한마디 덕분에
[03:07.97]나는 아직 여름을 믿어
[03:15.15]멀리서 들려오는 파도 소리
[03:18.83]내 마음 끝을 살짝 적셔와
[03:22.41]넘어져도 다시 일어날 수 있게
[03:26.09]너의 이름이 등을 밀어줘
[03:28.88]괜찮아, 천천히 가도 돼
[03:39.49]우리의 여름은 아직 길어
[03:46.99]눈물 끝에 피는 햇살처럼
[03:54.25]너는 너답게 빛나면 돼
[03:58.64]괜찮아, 천천히 가도 돼
[04:09.09]오늘도 우린 잘 버티잖아
[04:16.11]서툰 마음도 괜찮다고
[04:23.77]서로에게 말해주자
[04:27.84]조용히 눈을 감아봐
[04:28.80]지나간 날도 결국 길이 돼
[04:38.61]부서진 꿈의 모서리에도
[04:42.04]새로운 빛은 스며들어
[04:49.30]괜찮아, 천천히 가도 돼
[04:55.85]우리의 여름은 아직 길어
[05:00.39]눈물 끝에 피는 햇살처럼
[05:10.69]너는 너답게 빛나면 돼
[05:18.35]괜찮아, 천천히 가도 돼
[05:25.45]오늘도 우린 잘 버티잖아
[05:29.36]서툰 마음도 괜찮다고
[05:40.21]서로에게 말해주자`;

// DOM Element Selectors
const audioPlayer = document.getElementById('audioPlayer');
const btnPlayPause = document.getElementById('btnPlayPause');
const playIcon = document.getElementById('playIcon');
const albumArt = document.getElementById('albumArt');
const progressBarBg = document.getElementById('progressBarBg');
const progressBarFill = document.getElementById('progressBarFill');
const currentTimeEl = document.getElementById('currentTime');
const durationTimeEl = document.getElementById('durationTime');
const btnRewind = document.getElementById('btnRewind');
const btnForward = document.getElementById('btnForward');
const btnLoop = document.getElementById('btnLoop');
const volumeSlider = document.getElementById('volumeSlider');
const btnMute = document.getElementById('btnMute');
const volumeIcon = document.getElementById('volumeIcon');
const speedSelect = document.getElementById('speedSelect');
const fileInput = document.getElementById('fileInput');

const lrcContainer = document.getElementById('lrcContainer');
const txtContainer = document.getElementById('txtContainer');
const srtContainer = document.getElementById('srtContainer');
const lyricsViewport = document.getElementById('lyricsViewport');
const srtOverlayBox = document.getElementById('srtOverlayBox');
const tabButtons = document.querySelectorAll('.tab-btn');

// State Variables
let currentMode = 'lrc'; // 'lrc', 'txt', 'srt'
let parsedLrc = [];
let parsedSrt = [];
let rawTxt = '';
let activeLrcIndex = -1;
let isUserScrolling = false;
let userScrollTimeout = null;

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
  // Load Default Data
  loadLRCData(DEFAULT_LRC);
  fetchDefaultFiles();

  // Event Listeners
  btnPlayPause.addEventListener('click', togglePlayPause);
  audioPlayer.addEventListener('timeupdate', onTimeUpdate);
  audioPlayer.addEventListener('loadedmetadata', onMetadataLoaded);
  audioPlayer.addEventListener('ended', onAudioEnded);

  progressBarBg.addEventListener('click', seekAudio);

  btnRewind.addEventListener('click', () => { audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10); });
  btnForward.addEventListener('click', () => { audioPlayer.currentTime = Math.min(audioPlayer.duration || 0, audioPlayer.currentTime + 10); });
  btnLoop.addEventListener('click', toggleLoop);

  volumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = parseFloat(e.target.value);
    updateVolumeIcon();
  });
  btnMute.addEventListener('click', toggleMute);

  speedSelect.addEventListener('change', (e) => {
    audioPlayer.playbackRate = parseFloat(e.target.value);
  });

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      switchMode(btn.dataset.mode);
    });
  });

  fileInput.addEventListener('change', handleFileUpload);

  lyricsViewport.addEventListener('scroll', () => {
    isUserScrolling = true;
    clearTimeout(userScrollTimeout);
    userScrollTimeout = setTimeout(() => {
      isUserScrolling = false;
    }, 2500);
  });
});

// Try fetching default files (파도.srt, 파도.txt) if served via HTTP server
async function fetchDefaultFiles() {
  try {
    const resTxt = await fetch('파도.txt');
    if (resTxt.ok) {
      rawTxt = await resTxt.text();
      txtContainer.textContent = rawTxt;
    }
  } catch (e) {
    console.log('Using embedded default text');
  }

  try {
    const resSrt = await fetch('파도.srt');
    if (resSrt.ok) {
      const srtText = await resSrt.text();
      loadSRTData(srtText);
    }
  } catch (e) {
    console.log('No external SRT loaded yet');
  }
}

// LRC Parser
function parseLRC(lrcText) {
  const lines = lrcText.split(/\r?\n/);
  const result = [];
  const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/;
  
  lines.forEach(line => {
    const match = timeRegex.exec(line);
    if (match) {
      const min = parseInt(match[1], 10);
      const sec = parseInt(match[2], 10);
      const msStr = match[3] || '0';
      const ms = parseInt(msStr.padEnd(3, '0').slice(0, 3), 10) / 1000;
      const time = min * 60 + sec + ms;
      const text = line.replace(/\[\d{2}:\d{2}(?:\.\d{2,3})?\]/g, '').trim();
      if (text) {
        result.push({ time, text });
      }
    }
  });
  
  result.sort((a, b) => a.time - b.time);
  return result;
}

// SRT Parser
function parseSRT(srtText) {
  const blocks = srtText.trim().split(/\n\s*\n/);
  const result = [];
  
  blocks.forEach(block => {
    const lines = block.split(/\r?\n/);
    if (lines.length >= 2) {
      let timeIndex = 0;
      if (!lines[0].includes('-->') && lines[1] && lines[1].includes('-->')) {
        timeIndex = 1;
      }
      const timeLine = lines[timeIndex];
      if (timeLine && timeLine.includes('-->')) {
        const [startStr, endStr] = timeLine.split('-->').map(s => s.trim());
        const startTime = parseSRTTime(startStr);
        const endTime = parseSRTTime(endStr);
        const text = lines.slice(timeIndex + 1).join(' ').trim();
        if (text) {
          result.push({ startTime, endTime, text });
        }
      }
    }
  });
  return result;
}

function parseSRTTime(timeStr) {
  const parts = timeStr.replace(',', '.').split(':');
  if (parts.length === 3) {
    const h = parseFloat(parts[0]);
    const m = parseFloat(parts[1]);
    const s = parseFloat(parts[2]);
    return h * 3600 + m * 60 + s;
  }
  return 0;
}

// Load LRC Data into UI
function loadLRCData(lrcText) {
  parsedLrc = parseLRC(lrcText);
  lrcContainer.innerHTML = '';
  
  if (parsedLrc.length === 0) {
    lrcContainer.innerHTML = '<p style="color:var(--text-muted);">등록된 싱크 가사가 없습니다.</p>';
    return;
  }

  parsedLrc.forEach((item, index) => {
    const lineEl = document.createElement('div');
    lineEl.className = 'lrc-line';
    lineEl.dataset.index = index;
    lineEl.dataset.time = item.time;
    lineEl.textContent = item.text;

    lineEl.addEventListener('click', () => {
      audioPlayer.currentTime = item.time;
      if (audioPlayer.paused) {
        audioPlayer.play();
        updatePlayState(true);
      }
    });

    lrcContainer.appendChild(lineEl);
  });
}

// Load SRT Data into UI
function loadSRTData(srtText) {
  parsedSrt = parseSRT(srtText);
  srtContainer.innerHTML = '';
  
  parsedSrt.forEach((item, index) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'srt-item';
    itemEl.dataset.index = index;
    
    const timeEl = document.createElement('div');
    timeEl.className = 'srt-time';
    timeEl.textContent = `${formatTime(item.startTime)} --> ${formatTime(item.endTime)}`;
    
    const textEl = document.createElement('div');
    textEl.textContent = item.text;
    
    itemEl.appendChild(timeEl);
    itemEl.appendChild(textEl);

    itemEl.addEventListener('click', () => {
      audioPlayer.currentTime = item.startTime;
      if (audioPlayer.paused) {
        audioPlayer.play();
        updatePlayState(true);
      }
    });

    srtContainer.appendChild(itemEl);
  });
}

// Audio Player Events & Logic
function togglePlayPause() {
  if (audioPlayer.paused) {
    audioPlayer.play().then(() => updatePlayState(true)).catch(err => {
      console.warn('Playback error:', err);
    });
  } else {
    audioPlayer.pause();
    updatePlayState(false);
  }
}

function updatePlayState(isPlaying) {
  if (isPlaying) {
    playIcon.className = 'fa-solid fa-pause';
    albumArt.classList.add('playing');
  } else {
    playIcon.className = 'fa-solid fa-play';
    albumArt.classList.remove('playing');
  }
}

function onMetadataLoaded() {
  durationTimeEl.textContent = formatTime(audioPlayer.duration);
}

function onTimeUpdate() {
  const current = audioPlayer.currentTime;
  const duration = audioPlayer.duration || 1;

  // Update Progress Bar
  const pct = (current / duration) * 100;
  progressBarFill.style.width = `${pct}%`;
  currentTimeEl.textContent = formatTime(current);

  // Update Synced Lyrics
  if (currentMode === 'lrc' && parsedLrc.length > 0) {
    updateLrcSync(current);
  } else if (currentMode === 'srt' && parsedSrt.length > 0) {
    updateSrtSync(current);
  }
}

function updateLrcSync(currentTime) {
  let activeIndex = -1;

  for (let i = 0; i < parsedLrc.length; i++) {
    if (currentTime >= parsedLrc[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  if (activeIndex !== activeLrcIndex) {
    activeLrcIndex = activeIndex;
    const lines = lrcContainer.querySelectorAll('.lrc-line');
    
    lines.forEach((line, idx) => {
      if (idx === activeIndex) {
        line.classList.add('active');
        if (!isUserScrolling) {
          line.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // Update overlay
        srtOverlayBox.textContent = line.textContent;
        srtOverlayBox.classList.add('visible');
      } else {
        line.classList.remove('active');
      }
    });
  }
}

function updateSrtSync(currentTime) {
  const srtItems = srtContainer.querySelectorAll('.srt-item');
  let activeText = '';

  parsedSrt.forEach((item, idx) => {
    const el = srtItems[idx];
    if (currentTime >= item.startTime && currentTime <= item.endTime) {
      el.classList.add('active');
      activeText = item.text;
      if (!isUserScrolling) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      el.classList.remove('active');
    }
  });

  if (activeText) {
    srtOverlayBox.textContent = activeText;
    srtOverlayBox.classList.add('visible');
  } else {
    srtOverlayBox.classList.remove('visible');
  }
}

function seekAudio(e) {
  const rect = progressBarBg.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const seekTime = (clickX / width) * audioPlayer.duration;
  audioPlayer.currentTime = seekTime;
}

function toggleLoop() {
  audioPlayer.loop = !audioPlayer.loop;
  btnLoop.classList.toggle('active', audioPlayer.loop);
}

function toggleMute() {
  audioPlayer.muted = !audioPlayer.muted;
  updateVolumeIcon();
}

function updateVolumeIcon() {
  if (audioPlayer.muted || audioPlayer.volume === 0) {
    volumeIcon.className = 'fa-solid fa-volume-xmark';
  } else if (audioPlayer.volume < 0.5) {
    volumeIcon.className = 'fa-solid fa-volume-low';
  } else {
    volumeIcon.className = 'fa-solid fa-volume-high';
  }
}

function onAudioEnded() {
  updatePlayState(false);
  srtOverlayBox.classList.remove('visible');
}

// Mode Switcher (LRC / TXT / SRT)
function switchMode(mode) {
  currentMode = mode;
  lrcContainer.style.display = mode === 'lrc' ? 'flex' : 'none';
  txtContainer.style.display = mode === 'txt' ? 'block' : 'none';
  srtContainer.style.display = mode === 'srt' ? 'flex' : 'none';

  if (mode === 'txt' && !txtContainer.textContent) {
    txtContainer.textContent = parsedLrc.map(item => item.text).join('\n');
  }
}

// Custom File Upload Handler
function handleFileUpload(e) {
  const files = Array.from(e.target.files);

  files.forEach(file => {
    const ext = file.name.split('.').pop().toLowerCase();

    if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(ext)) {
      audioPlayer.src = URL.createObjectURL(file);
      document.getElementById('songTitle').textContent = file.name.replace(/\.[^/.]+$/, "");
      document.getElementById('artistName').textContent = '로컬 오디오 파일';
      audioPlayer.play().then(() => updatePlayState(true));
    } else if (ext === 'lrc') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        loadLRCData(evt.target.result);
        switchMode('lrc');
      };
      reader.readAsText(file);
    } else if (ext === 'srt') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        loadSRTData(evt.target.result);
        switchMode('srt');
      };
      reader.readAsText(file);
    } else if (ext === 'txt') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        rawTxt = evt.target.result;
        txtContainer.textContent = rawTxt;
        switchMode('txt');
      };
      reader.readAsText(file);
    }
  });
}

// Helper: Time Formatter (seconds to mm:ss)
function formatTime(seconds) {
  if (isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
