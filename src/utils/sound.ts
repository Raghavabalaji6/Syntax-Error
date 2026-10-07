// Web Audio API ambient noise & bell synthesizer

let audioCtx: AudioContext | null = null;
let activeNoiseNode: AudioNode | null = null;
let activeGainNode: GainNode | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export type AmbientSoundType = 'none' | 'rain' | 'whitenoise' | 'binaural';

export function playAmbientSound(type: AmbientSoundType, volume = 0.3) {
  stopAmbientSound();

  if (type === 'none') return;

  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'rain') {
      // Pink / Brownish filtered noise for gentle rain
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.12;
      }
    } else if (type === 'whitenoise') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.08;
      }
    } else if (type === 'binaural') {
      // 40Hz focus binaural hum
      for (let i = 0; i < bufferSize; i++) {
        const t = i / ctx.sampleRate;
        data[i] = (Math.sin(2 * Math.PI * 136.1 * t) * 0.2 + (Math.random() * 2 - 1) * 0.02) * 0.1;
      }
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Filter to make rain warm & non-harsh
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = type === 'rain' ? 850 : 2500;

    const gain = ctx.createGain();
    gain.gain.value = volume;

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noiseSource.start();

    activeNoiseNode = noiseSource;
    activeGainNode = gain;
  } catch (err) {
    console.warn('Web Audio error:', err);
  }
}

export function stopAmbientSound() {
  if (activeNoiseNode) {
    try {
      (activeNoiseNode as any).stop?.();
      activeNoiseNode.disconnect();
    } catch (e) {
      // ignore
    }
    activeNoiseNode = null;
  }
  if (activeGainNode) {
    try {
      activeGainNode.disconnect();
    } catch (e) {
      // ignore
    }
    activeGainNode = null;
  }
}

export function playCelebrationChime() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = ctx.currentTime + idx * 0.12;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.7);
    });
  } catch (e) {
    // ignore
  }
}
