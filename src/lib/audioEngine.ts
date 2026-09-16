// Web Audio API Synth Engine for Sonorus Melodious DAW with Analyser & Master Filter

let ctx: AudioContext | null = null;
let masterAnalyser: AnalyserNode | null = null;
let masterFilter: BiquadFilterNode | null = null;
let masterGain: GainNode | null = null;

export function getAudioContext(): AudioContext {
  if (!ctx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    ctx = new AudioCtxClass();

    // Master Gain
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.85, ctx.currentTime);

    // Master Filter
    masterFilter = ctx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.setValueAtTime(12000, ctx.currentTime);
    masterFilter.Q.setValueAtTime(2.0, ctx.currentTime);

    // Master Analyser
    masterAnalyser = ctx.createAnalyser();
    masterAnalyser.fftSize = 256;

    // Signal Chain: MasterGain -> MasterFilter -> MasterAnalyser -> Destination
    masterGain.connect(masterFilter);
    masterFilter.connect(masterAnalyser);
    masterAnalyser.connect(ctx.destination);
  }

  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

export function getAnalyser(): AnalyserNode | null {
  getAudioContext();
  return masterAnalyser;
}

export function setMasterFilter(frequency: number, resonance: number) {
  const audio = getAudioContext();
  if (masterFilter) {
    masterFilter.frequency.setTargetAtTime(frequency, audio.currentTime, 0.05);
    masterFilter.Q.setTargetAtTime(resonance, audio.currentTime, 0.05);
  }
}

export function setMasterVolume(volPercent: number) {
  const audio = getAudioContext();
  if (masterGain) {
    masterGain.gain.setTargetAtTime(volPercent / 100, audio.currentTime, 0.05);
  }
}

export function playNote(
  freq: number,
  type: OscillatorType = 'sawtooth',
  duration: number = 0.5,
  volume: number = 0.2
) {
  try {
    const audio = getAudioContext();
    const osc = audio.createOscillator();
    const gain = audio.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audio.currentTime);

    gain.gain.setValueAtTime(volume, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);

    osc.connect(gain);
    if (masterGain) {
      gain.connect(masterGain);
    } else {
      gain.connect(audio.destination);
    }

    osc.start();
    osc.stop(audio.currentTime + duration);
  } catch (e) {
    console.warn("Audio playback error:", e);
  }
}

export function playDrum(type: 'kick' | 'snare' | 'hihat' | 'sub808') {
  try {
    const audio = getAudioContext();
    const now = audio.currentTime;
    const dest = masterGain || audio.destination;

    if (type === 'kick') {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.3);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'hihat') {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(9000, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'snare') {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.22);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'sub808') {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.exponentialRampToValueAtTime(32.7, now + 0.7);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.7);
    }
  } catch (e) {
    console.warn("Drum playback error:", e);
  }
}

export function midiToFreq(midiNote: number): number {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}

export const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function getNoteName(midiNote: number): string {
  const octave = Math.floor(midiNote / 12) - 1;
  const name = NOTE_NAMES[midiNote % 12];
  return `${name}${octave}`;
}

export interface SoundPreset {
  id: string;
  name: string;
  genre: string;
  bpm: number;
  scale: string;
  chords: string;
}

export const SOUND_PRESETS: SoundPreset[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Synthwave 2077',
    genre: 'Cyberpunk / Darksynth',
    bpm: 128,
    scale: 'C minor',
    chords: 'Cm9 — Abmaj7 — Fm11 — G7(alt)'
  },
  {
    id: 'lofi',
    name: 'Lofi Chillhop Vinyl',
    genre: 'Lofi Hip Hop',
    bpm: 85,
    scale: 'F major',
    chords: 'Fmaj9 — Dm9 — Gm11 — C13'
  },
  {
    id: 'cinematic',
    name: 'Cinematic Orchestral Hans',
    genre: 'Cinematic / Epic',
    bpm: 110,
    scale: 'D minor',
    chords: 'Dm — Bb — F — C'
  },
  {
    id: 'edm',
    name: 'EDM Mainstage Anthem',
    genre: 'Future Rave / House',
    bpm: 130,
    scale: 'A minor',
    chords: 'Am — F — C — G'
  },
  {
    id: 'trap',
    name: 'Atlanta 808 Trap Heavy',
    genre: 'Trap / Hip Hop',
    bpm: 140,
    scale: 'F# minor',
    chords: 'F#m9 — Dmaj7 — C#7 — Bm11'
  }
];
