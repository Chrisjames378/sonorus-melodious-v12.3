export interface Note {
  id: string;
  pitch: number; // MIDI note number (e.g. 60 = C4)
  step: number; // 0 to 63 (16 bars of 16th notes)
  durationSteps: number;
  velocity: number;
}

export interface Clip {
  id: string;
  name: string;
  startBar: number;
  durationBars: number;
  color: string;
  notes: Note[];
}

export interface Track {
  id: string;
  name: string;
  category: string;
  color: string; // Tailwind color class or hex
  volume: number; // 0 - 100
  pan: number; // -50 to 50
  muted: boolean;
  solo: boolean;
  armed: boolean;
  active: boolean;
  clips: Clip[];
  synthType: 'saw' | 'sine' | 'square' | 'triangle' | 'fm';
  baseFreq: number;
}

export interface AiModule {
  id: number;
  name: string;
  category: string;
  color: string;
  icon: string;
  description: string;
}

export interface LoopCell {
  id: string;
  trackIndex: number; // 0: Drums, 1: Bass, 2: Synth, 3: Vocal/FX
  cellIndex: number;
  name: string;
  bars: number;
  active: boolean;
  freq: number;
}

export type ActiveModal =
  | 'valuation'
  | 'paypal'
  | 'collab'
  | 'mastering'
  | 'modular'
  | 'midi'
  | 'chords'
  | 'liveLoops'
  | 'pianoRoll'
  | 'atmos'
  | number // AI Module ID
  | null;

export interface TransportState {
  isPlaying: boolean;
  isRecording: boolean;
  bpm: number;
  currentStep: number;
  loopActive: boolean;
  metronomeActive: boolean;
  bar: number;
  beat: number;
  sixteenth: number;
  milliseconds: number;
}
