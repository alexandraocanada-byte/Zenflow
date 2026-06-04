/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private ambientNoise: AudioWorkletNode | ScriptProcessorNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Synthesize a beautiful, rich Tibetan Singing Bowl sound
  // Bowls resonate at a fundamental frequency with rich, warm upper-partials and a slow natural decay
  public playSingingBowl(fundamental: number = 220) {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.4, now + 0.1);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 5.0); // 5 sec decay
      masterGain.connect(this.ctx.destination);

      // Tibetan bowls have strong overtone frequencies: fundamental * 1.5, * 2.1, * 2.8, * 3.6
      const partials = [
        { ratio: 1.0, volume: 1.0, detune: 0 },
        { ratio: 1.498, volume: 0.6, detune: 1.5 },   // Clean fifth
        { ratio: 2.102, volume: 0.4, detune: -2 },
        { ratio: 2.81, volume: 0.2, detune: 3 },
        { ratio: 3.59, volume: 0.15, detune: -1 }
      ];

      partials.forEach(p => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Use sine wave for pure warm resonances
        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamental * p.ratio, now);
        osc.detune.setValueAtTime(p.detune, now);

        // LFO for the signature acoustic "singing" throb/wobble (approx 3Hz - 6Hz)
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(4.5, now);
        lfoGain.gain.setValueAtTime(3.0, now); // subtle frequency detune oscillation
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        gain.gain.setValueAtTime(p.volume * 0.2, now);
        // Exponential fade of individual partials (higher overtones fade faster)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (5.0 / p.ratio));

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        lfo.start(now);

        osc.stop(now + 5.5);
        lfo.stop(now + 5.5);
      });

    } catch (err) {
      console.warn('AudioContext failed to play singing bowl:', err);
    }
  }

  // Synthesize soft ocean/wind ambient sound recursively or via script node
  public toggleAmbientWind(): boolean {
    try {
      this.init();
      if (!this.ctx) return false;

      if (this.isAmbientPlaying) {
        this.stopAmbientWind();
        return false;
      }

      const now = this.ctx.currentTime;
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Create pink/brownish organic noise
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Warm brown noise lowpass filter approximation
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain compensation
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      this.ambientFilter = this.ctx.createBiquadFilter();
      this.ambientFilter.type = 'lowpass';
      this.ambientFilter.frequency.setValueAtTime(150, now); // Soft rumble

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.12, now + 1.5); // Smooth fade-in

      // Create an LFO to simulate swelling sea waves or howling wind
      const lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.12, now); // 1 cycle per 8 seconds

      const lfoFilterGain = this.ctx.createGain();
      lfoFilterGain.gain.setValueAtTime(280, now); // Sweep filter between 150Hz and 430Hz

      const lfoVolumeGain = this.ctx.createGain();
      lfoVolumeGain.gain.setValueAtTime(0.04, now); // Wave swell amplitude modulation

      lfo.connect(lfoFilterGain);
      lfoFilterGain.connect(this.ambientFilter.frequency);

      lfo.connect(lfoVolumeGain);
      lfoVolumeGain.connect(this.ambientGain.gain);

      noiseNode.connect(this.ambientFilter);
      this.ambientFilter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      noiseNode.start(now);
      this.isAmbientPlaying = true;
      this.ambientNoise = noiseNode as any; // Cast for keeping state references

      lfo.start(now);

      return true;
    } catch (err) {
      console.warn('Could not launch therapeutic ocean wind:', err);
      return false;
    }
  }

  public stopAmbientWind() {
    try {
      if (this.ctx && this.ambientGain && this.ambientNoise) {
        const now = this.ctx.currentTime;
        this.ambientGain.gain.cancelScheduledValues(now);
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0); // 1 sec fade-out
        setTimeout(() => {
          try {
            if (this.ambientNoise) {
              (this.ambientNoise as any).stop();
            }
            this.ambientNoise = null;
            this.isAmbientPlaying = false;
          } catch (_) {}
        }, 1100);
      } else {
        this.isAmbientPlaying = false;
      }
    } catch (err) {
      console.warn('Error closing ambient synthesizer:', err);
      this.isAmbientPlaying = false;
    }
  }

  public isPlaying(): boolean {
    return this.isAmbientPlaying;
  }
}

export const audioEngine = new AudioEngine();
