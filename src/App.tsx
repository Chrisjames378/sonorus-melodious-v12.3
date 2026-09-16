import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Track, TransportState, ActiveModal, Note } from './types';
import { playNote, playDrum, midiToFreq, SOUND_PRESETS, SoundPreset } from './lib/audioEngine';
import { Header } from './components/Header';
import { Inspector } from './components/Inspector';
import { Timeline } from './components/Timeline';
import { Mixer } from './components/Mixer';
import { PianoRoll } from './components/PianoRoll';

// Modals
import { ValuationModal } from './components/modals/ValuationModal';
import { PayPalModal } from './components/modals/PayPalModal';
import { CloudJamModal } from './components/modals/CloudJamModal';
import { MasteringModal } from './components/modals/MasteringModal';
import { ModularRackModal } from './components/modals/ModularRackModal';
import { MidiMatrixModal } from './components/modals/MidiMatrixModal';
import { SmartChordModal } from './components/modals/SmartChordModal';
import { LiveLoopsModal } from './components/modals/LiveLoopsModal';
import { AtmosPannerModal } from './components/modals/AtmosPannerModal';
import { AiModuleModal } from './components/modals/AiModuleModal';
import { CheckCircle2, X } from 'lucide-react';

const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-1',
    name: 'Trap Door (Gemini Synth)',
    category: 'AI Instrument • Gemini 3 Flash',
    color: 'text-blue-400',
    volume: 80,
    pan: 0,
    muted: false,
    solo: false,
    armed: true,
    active: true,
    synthType: 'saw',
    baseFreq: 440,
    clips: [
      {
        id: 'clip-1',
        name: 'Trap Melody A',
        startBar: 0,
        durationBars: 4,
        color: '#3b82f6',
        notes: [
          { id: 'n1', pitch: 60, step: 0, durationSteps: 2, velocity: 100 },
          { id: 'n2', pitch: 63, step: 4, durationSteps: 2, velocity: 100 },
          { id: 'n3', pitch: 67, step: 8, durationSteps: 2, velocity: 100 },
          { id: 'n4', pitch: 70, step: 12, durationSteps: 2, velocity: 100 },
        ]
      }
    ]
  },
  {
    id: 'track-2',
    name: 'Voice Stem AI (Cloud Jam Share)',
    category: 'WebRTC Jam • Peer #1 Active',
    color: 'text-purple-400',
    volume: 88,
    pan: -15,
    muted: false,
    solo: false,
    armed: false,
    active: false,
    synthType: 'sine',
    baseFreq: 523.25,
    clips: [
      {
        id: 'clip-2',
        name: 'Vocal Stem Lead',
        startBar: 1,
        durationBars: 3,
        color: '#a855f7',
        notes: [
          { id: 'n5', pitch: 65, step: 4, durationSteps: 4, velocity: 90 },
          { id: 'n6', pitch: 67, step: 12, durationSteps: 4, velocity: 90 }
        ]
      }
    ]
  },
  {
    id: 'track-3',
    name: 'Quantum Modular Pad (Reason 14)',
    category: 'Reason Rack • CV Patched',
    color: 'text-red-400',
    volume: 75,
    pan: 20,
    muted: false,
    solo: false,
    armed: false,
    active: false,
    synthType: 'square',
    baseFreq: 329.63,
    clips: [
      {
        id: 'clip-3',
        name: 'Quantum Chord Sequence',
        startBar: 0,
        durationBars: 8,
        color: '#ef4444',
        notes: [
          { id: 'n7', pitch: 48, step: 0, durationSteps: 8, velocity: 110 },
          { id: 'n8', pitch: 52, step: 8, durationSteps: 8, velocity: 110 }
        ]
      }
    ]
  },
  {
    id: 'track-4',
    name: 'Dolby Atmos Drums 3D',
    category: '3D Spatial Audio Engine',
    color: 'text-teal-400',
    volume: 85,
    pan: 0,
    muted: false,
    solo: false,
    armed: false,
    active: false,
    synthType: 'triangle',
    baseFreq: 150,
    clips: [
      {
        id: 'clip-4',
        name: 'Trap Percussion Grid',
        startBar: 0,
        durationBars: 8,
        color: '#14b8a6',
        notes: []
      }
    ]
  }
];

// Musical QWERTY keyboard pitch mapping
const KEY_NOTE_MAP: Record<string, number> = {
  a: 60, // C4
  w: 61, // C#4
  s: 62, // D4
  e: 63, // D#4
  d: 64, // E4
  f: 65, // F4
  t: 66, // F#4
  g: 67, // G4
  y: 68, // G#4
  h: 69, // A4
  u: 70, // A#4
  j: 71, // B4
  k: 72, // C5
};

export default function App() {
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [activeTrackId, setActiveTrackId] = useState<string>('track-1');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [currentPresetId, setCurrentPresetId] = useState<string>('cyberpunk');

  // Transport state
  const [transport, setTransport] = useState<TransportState>({
    isPlaying: false,
    isRecording: false,
    bpm: 128.0,
    currentStep: 0,
    loopActive: true,
    metronomeActive: false,
    bar: 1,
    beat: 1,
    sixteenth: 1,
    milliseconds: 0,
  });

  // AI Chord recognition state
  const [detectedChords, setDetectedChords] = useState<string>("Cm9 — Abmaj7 — Fm11 — G7(alt)");
  const [isAnalyzingChords, setIsAnalyzingChords] = useState<boolean>(false);

  // Toast notification
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // Auto dismiss toast notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Audio interval ref
  const intervalRef = useRef<any>(null);

  // Transport Tick Logic
  useEffect(() => {
    if (transport.isPlaying) {
      const stepMs = (60000 / transport.bpm) / 4; // 16th note duration

      intervalRef.current = setInterval(() => {
        setTransport((prev) => {
          const nextStep = prev.currentStep + 1;
          const totalSteps = prev.loopActive ? 64 : 128; // 4 bars cycle loop
          const effectiveStep = nextStep % totalSteps;

          const bar = Math.floor(effectiveStep / 16) + 1;
          const beat = Math.floor((effectiveStep / 4) % 4) + 1;
          const sixteenth = Math.floor(effectiveStep % 4) + 1;
          const milliseconds = (effectiveStep * stepMs) % 1000;

          // Sound trigger for active step notes
          tracks.forEach((tr) => {
            if (!tr.muted) {
              tr.clips.forEach((clip) => {
                clip.notes.forEach((note) => {
                  if (note.step === effectiveStep % 32) {
                    playNote(midiToFreq(note.pitch), tr.synthType, 0.3, 0.2);
                  }
                });
              });
            }
          });

          // Metronome click on beat 1
          if (prev.metronomeActive && sixteenth === 1) {
            playNote(880, 'sine', 0.08, 0.15);
          }

          return {
            ...prev,
            currentStep: effectiveStep,
            bar,
            beat,
            sixteenth,
            milliseconds: Math.floor(milliseconds),
          };
        });
      }, stepMs);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [transport.isPlaying, transport.bpm, transport.loopActive, transport.metronomeActive, tracks]);

  // Keyboard Shortcuts & Musical Typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const keyLower = e.key.toLowerCase();

      // Musical Typing (A, S, D, F, G, H, J, K etc.)
      if (KEY_NOTE_MAP[keyLower]) {
        const pitch = KEY_NOTE_MAP[keyLower];
        const activeTrack = tracks.find((t) => t.id === activeTrackId);
        const synthType = activeTrack ? activeTrack.synthType : 'saw';
        playNote(midiToFreq(pitch), synthType, 0.35, 0.25);
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setTransport((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
      } else if (e.key === 'r' || e.key === 'R') {
        setTransport((prev) => ({ ...prev, isRecording: !prev.isRecording }));
      } else if (e.key === 'm' || e.key === 'M') {
        setTransport((prev) => ({ ...prev, metronomeActive: !prev.metronomeActive }));
      } else if (e.key === 'l' || e.key === 'L') {
        setTransport((prev) => ({ ...prev, loopActive: !prev.loopActive }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTrackId, tracks]);

  // Preset Selection Handler
  const handleSelectPreset = (preset: SoundPreset) => {
    setCurrentPresetId(preset.id);
    setTransport((prev) => ({ ...prev, bpm: preset.bpm }));
    setDetectedChords(preset.chords);
    playNote(440, 'sawtooth', 0.2, 0.2);
    showNotification(`Loaded Preset Kit: "${preset.name}" (${preset.bpm} BPM • ${preset.scale})`);
  };

  // Transport Handlers
  const handleTogglePlay = () => {
    setTransport((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleStop = () => {
    setTransport((prev) => ({ ...prev, isPlaying: false }));
  };

  const handleReturnToZero = () => {
    setTransport((prev) => ({
      ...prev,
      currentStep: 0,
      bar: 1,
      beat: 1,
      sixteenth: 1,
      milliseconds: 0,
    }));
  };

  const handleToggleRecord = () => {
    setTransport((prev) => ({ ...prev, isRecording: !prev.isRecording }));
  };

  const handleToggleMetronome = () => {
    setTransport((prev) => ({ ...prev, metronomeActive: !prev.metronomeActive }));
  };

  const handleToggleLoop = () => {
    setTransport((prev) => ({ ...prev, loopActive: !prev.loopActive }));
  };

  // Track Handlers
  const handleSelectTrack = (trackId: string) => {
    setActiveTrackId(trackId);
  };

  const handleToggleMute = (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, muted: !t.muted } : t))
    );
  };

  const handleToggleSolo = (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, solo: !t.solo } : t))
    );
  };

  const handleToggleArm = (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, armed: !t.armed } : t))
    );
  };

  const handleVolumeChange = (trackId: string, value: number) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, volume: value } : t))
    );
  };

  const handleAddTrack = () => {
    const id = `track-${tracks.length + 1}`;
    const newTrack: Track = {
      id,
      name: `AI Neural Synth ${tracks.length + 1}`,
      category: 'Gemini 3 Flash • DSP Slot',
      color: 'text-amber-400',
      volume: 80,
      pan: 0,
      muted: false,
      solo: false,
      armed: false,
      active: false,
      synthType: 'fm',
      baseFreq: 440,
      clips: [
        {
          id: `clip-${id}`,
          name: 'Generative Pad',
          startBar: 0,
          durationBars: 4,
          color: '#f59e0b',
          notes: []
        }
      ]
    };

    setTracks((prev) => [...prev, newTrack]);
    setActiveTrackId(id);
    showNotification(`Created new track: "${newTrack.name}"`);
  };

  const handleUpdateNotes = (trackId: string, notes: Note[]) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === trackId && t.clips.length > 0) {
          const updatedClips = [...t.clips];
          updatedClips[0] = { ...updatedClips[0], notes };
          return { ...t, clips: updatedClips };
        }
        return t;
      })
    );
  };

  const handleRunChordAnalysis = async () => {
    setIsAnalyzingChords(true);
    try {
      const res = await fetch('/api/ai/chords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Harmonic analysis of active timeline', key: 'C minor' })
      });
      const data = await res.json();
      setIsAnalyzingChords(false);
      setDetectedChords(data.chords || "Dm9 — G13 — Cmaj9 — A7(b9)");
    } catch (e) {
      setIsAnalyzingChords(false);
      const chords = ["Cmaj9 — Am11 — F#m7(b5) — B7", "Dm9 — G13 — Cmaj7 — A7", "Cm9 — Fm11 — Abmaj7/Bb — G7(alt)"];
      setDetectedChords(chords[Math.floor(Math.random() * chords.length)]);
    }
  };

  const activeTrack = tracks.find((t) => t.id === activeTrackId) || null;

  return (
    <div className="h-screen w-screen flex flex-col bg-[#12141a] text-[#d1d5db] overflow-hidden select-none">
      {/* Top Header Transport */}
      <Header
        transport={transport}
        onTogglePlay={handleTogglePlay}
        onStop={handleStop}
        onReturnToZero={handleReturnToZero}
        onToggleRecord={handleToggleRecord}
        onToggleMetronome={handleToggleMetronome}
        onToggleLoop={handleToggleLoop}
        onOpenModal={(modal) => setActiveModal(modal)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Track Inspector */}
        <Inspector
          activeTrack={activeTrack}
          onOpenModal={(modal) => setActiveModal(modal)}
          onRunChordAnalysis={handleRunChordAnalysis}
          detectedChords={detectedChords}
          isAnalyzingChords={isAnalyzingChords}
          currentPresetId={currentPresetId}
          onSelectPreset={handleSelectPreset}
        />

        {/* Central Timeline & Mixer */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <Timeline
            tracks={tracks}
            activeTrackId={activeTrackId}
            onSelectTrack={handleSelectTrack}
            onToggleMute={handleToggleMute}
            onToggleSolo={handleToggleSolo}
            onToggleArm={handleToggleArm}
            onOpenPianoRoll={() => setActiveModal('pianoRoll')}
            onAddTrack={handleAddTrack}
            onOpenModal={(modal) => setActiveModal(modal)}
            isPlaying={transport.isPlaying}
            currentStep={transport.currentStep}
          />

          <Mixer
            tracks={tracks}
            isPlaying={transport.isPlaying}
            onVolumeChange={handleVolumeChange}
            onToggleMute={handleToggleMute}
            onToggleSolo={handleToggleSolo}
          />
        </div>
      </div>

      {/* Interactive Piano Roll / Step Sequencer Modal */}
      {activeModal === 'pianoRoll' && (
        <PianoRoll
          activeTrack={activeTrack}
          onClose={() => setActiveModal(null)}
          onUpdateNotes={handleUpdateNotes}
        />
      )}

      {/* Modals */}
      {activeModal === 'valuation' && (
        <ValuationModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'paypal' && (
        <PayPalModal
          onClose={() => setActiveModal(null)}
          onShowNotification={showNotification}
        />
      )}

      {activeModal === 'collab' && (
        <CloudJamModal
          onClose={() => setActiveModal(null)}
          onShowNotification={showNotification}
        />
      )}

      {activeModal === 'mastering' && (
        <MasteringModal
          onClose={() => setActiveModal(null)}
          onShowNotification={showNotification}
        />
      )}

      {activeModal === 'modular' && (
        <ModularRackModal
          onClose={() => setActiveModal(null)}
          onShowNotification={showNotification}
        />
      )}

      {activeModal === 'midi' && (
        <MidiMatrixModal
          onClose={() => setActiveModal(null)}
          onShowNotification={showNotification}
        />
      )}

      {activeModal === 'chords' && (
        <SmartChordModal
          onClose={() => setActiveModal(null)}
          onShowNotification={showNotification}
          onDropChordsToTimeline={(newChords) => setDetectedChords(newChords)}
        />
      )}

      {activeModal === 'liveLoops' && (
        <LiveLoopsModal
          onClose={() => setActiveModal(null)}
          onShowNotification={showNotification}
        />
      )}

      {activeModal === 'atmos' && (
        <AtmosPannerModal
          onClose={() => setActiveModal(null)}
          onShowNotification={showNotification}
        />
      )}

      {typeof activeModal === 'number' && (
        <AiModuleModal
          moduleId={activeModal}
          onClose={() => setActiveModal(null)}
          onShowNotification={showNotification}
        />
      )}

      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-[#1b1e26] border border-blue-500 text-white px-4 py-3 rounded-lg shadow-2xl z-[200] flex items-center space-x-3 text-xs animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
          <span className="font-mono">{notification}</span>
          <button onClick={closeNotification} className="text-[#9ca3af] hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
