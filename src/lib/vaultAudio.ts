// High-Fidelity Web Audio Synthesizer Engine for SlabVault Bank-Grade Experience

class VaultAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;

  constructor() {
    // Check saved mute preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('slabvault_audio_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('slabvault_audio_muted', String(this.isMuted));
    }
    if (!this.isMuted) {
      this.playButtonTick();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  /**
   * Sound FX: Luxurious Aerodynamic Slab Flip Whoosh
   * Velvety smooth air-displacement sweep with warm harmonic body and zero fatiguing clicks
   */
  public playSlabFlip() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 0.24;

    // 1. Silky Aerodynamic Noise Sweep (Velvet Airflow)
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    // Generate pink-weighted soft noise
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.18;
    }

    const noiseSrc = this.ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;

    // Resonant bandpass filter sweeping gracefully up and down
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(2.2, now);
    filter.frequency.setValueAtTime(320, now);
    filter.frequency.exponentialRampToValueAtTime(1250, now + 0.07);
    filter.frequency.exponentialRampToValueAtTime(380, now + duration);

    // Smooth bell-curve gain envelope
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.28 * this.volume, now + 0.06);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseSrc.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noiseSrc.start(now);
    noiseSrc.stop(now + duration);

    // 2. Warm Harmonic Sub-Body (Gives physical weight and luxury heft)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    const subFilter = this.ctx.createBiquadFilter();

    subFilter.type = 'lowpass';
    subFilter.frequency.setValueAtTime(450, now);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(130, now);
    subOsc.frequency.exponentialRampToValueAtTime(280, now + 0.06);
    subOsc.frequency.exponentialRampToValueAtTime(95, now + 0.22);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.18 * this.volume, now + 0.05);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    subOsc.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(this.ctx.destination);

    subOsc.start(now);
    subOsc.stop(now + 0.23);

    // 3. Ultra-soft high air shimmer (subtle friction sheen)
    const sheenOsc = this.ctx.createOscillator();
    const sheenGain = this.ctx.createGain();
    const sheenFilter = this.ctx.createBiquadFilter();

    sheenFilter.type = 'bandpass';
    sheenFilter.frequency.setValueAtTime(2200, now);
    sheenFilter.Q.setValueAtTime(1.8, now);

    sheenOsc.type = 'sine';
    sheenOsc.frequency.setValueAtTime(800, now);
    sheenOsc.frequency.exponentialRampToValueAtTime(1600, now + 0.06);
    sheenOsc.frequency.exponentialRampToValueAtTime(600, now + 0.18);

    sheenGain.gain.setValueAtTime(0.001, now);
    sheenGain.gain.linearRampToValueAtTime(0.05 * this.volume, now + 0.05);
    sheenGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    sheenOsc.connect(sheenFilter);
    sheenFilter.connect(sheenGain);
    sheenGain.connect(this.ctx.destination);

    sheenOsc.start(now);
    sheenOsc.stop(now + 0.19);
  }

  /**
   * Sound FX: Bank-Grade Heavy Depository Vault Airlock & Hydraulic Release
   * Deep sub-bass thud, pneumatic air pressure hiss, and heavy steel gear lock
   */
  public playVaultAirlock() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Sub-bass seismic structural thud
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(95, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.45);

    subGain.gain.setValueAtTime(0.6 * this.volume, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);

    subOsc.start(now);
    subOsc.stop(now + 0.52);

    // 2. High-pressure pneumatic airlock hiss (synthesized noise)
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.4);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(480, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(90, now + 0.38);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.22 * this.volume, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.42);

    // 3. Precision titanium latch click
    setTimeout(() => {
      if (!this.ctx || this.isMuted) return;
      const t = this.ctx.currentTime;
      const latch = this.ctx.createOscillator();
      const latchGain = this.ctx.createGain();
      latch.type = 'triangle';
      latch.frequency.setValueAtTime(1600, t);
      latch.frequency.exponentialRampToValueAtTime(400, t + 0.05);

      latchGain.gain.setValueAtTime(0.2 * this.volume, t);
      latchGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      latch.connect(latchGain);
      latchGain.connect(this.ctx.destination);
      latch.start(t);
      latch.stop(t + 0.07);
    }, 110);
  }

  /**
   * Sound FX: Holographic Laser Scanner / Optical Frequency Sweep
   */
  public playLaserScan() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(6, now);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(2800, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.28);

    gain.gain.setValueAtTime(0.18 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  /**
   * Sound FX: Celestial Gem Mint Chime (PSA 10 / Trophy Grail Arpeggio)
   */
  public playGemMintChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const freqs = [1046.5, 1318.51, 1567.98, 2093.0]; // C6, E6, G6, C7 arpeggio
    const now = this.ctx.currentTime;

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const noteTime = now + idx * 0.065;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.2 * this.volume, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.48);
    });
  }

  /**
   * Sound FX: Tactile UI Micro-Click
   */
  public playButtonTick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.02);

    gain.gain.setValueAtTime(0.15 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }
}

export const vaultAudio = new VaultAudioEngine();
