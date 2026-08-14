/* ==========================================================================
   SPEECH SYNTHESIS ENGINE (TTS.js)
   Native Web Speech API for English Pronunciation Audio
   ========================================================================== */

class TTSEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = null;
    this.rate = 0.9; // Slightly slower for crisp clear learning audio
    this.pitch = 1.0;
    this.initVoice();
  }

  initVoice() {
    if (!this.synth) return;

    const loadVoices = () => {
      const voices = this.synth.getVoices();
      // Prefer US or UK English female/male natural voices
      this.voice = voices.find(v => v.lang.includes("en-US") || v.lang.includes("en-GB") || v.lang.startsWith("en"));
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  speak(text, onEndCallback = null) {
    if (!this.synth || !text) return;

    this.synth.cancel(); // Stop active speaking

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.lang = "en-US";
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    if (onEndCallback) {
      utterance.onend = onEndCallback;
      utterance.onerror = onEndCallback;
    }

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

window.ttsEngine = new TTSEngine();
