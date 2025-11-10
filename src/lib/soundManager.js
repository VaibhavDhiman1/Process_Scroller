export class SoundManager {
  constructor() {
    this.sounds = {};
    this.isEnabled = false;
  }
  load(name, url, volume = 0.3) {
    const audio = new Audio(url);
    audio.preload = "auto";
    audio.volume = volume;
    this.sounds[name] = audio;
  }
  enable() { this.isEnabled = true; }
  play(name, delay = 0) {
    if (!this.isEnabled || !this.sounds[name]) return;
    const a = this.sounds[name];
    const run = () => { try { a.currentTime = 0; a.play(); } catch {} };
    delay ? setTimeout(run, delay) : run();
  }
}
