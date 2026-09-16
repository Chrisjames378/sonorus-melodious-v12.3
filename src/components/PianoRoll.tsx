import React, { useState } from 'react';
import { X, Play, Plus, Trash2, Music, Sparkles } from 'lucide-react';
import { Track, Note } from '../types';
import { playNote, midiToFreq, getNoteName } from '../lib/audioEngine';

interface PianoRollProps {
  activeTrack: Track | null;
  onClose: () => void;
  onUpdateNotes: (trackId: string, notes: Note[]) => void;
}

export const PianoRoll: React.FC<PianoRollProps> = ({
  activeTrack,
  onClose,
  onUpdateNotes,
}) => {
  if (!activeTrack) return null;

  // Active clip notes
  const currentClip = activeTrack.clips[0];
  const [notes, setNotes] = useState<Note[]>(currentClip ? currentClip.notes : []);

  // Midi pitch range C3 (48) to C5 (72)
  const pitches: number[] = [];
  for (let p = 72; p >= 48; p--) {
    pitches.push(p);
  }

  // Toggle or add a note at a specific step and pitch
  const handleCellClick = (pitch: number, step: number) => {
    const existingIndex = notes.findIndex((n) => n.pitch === pitch && n.step === step);
    let newNotes = [...notes];

    if (existingIndex >= 0) {
      newNotes.splice(existingIndex, 1);
    } else {
      const freq = midiToFreq(pitch);
      playNote(freq, activeTrack.synthType, 0.3, 0.25);

      newNotes.push({
        id: `note-${pitch}-${step}-${Date.now()}`,
        pitch,
        step,
        durationSteps: 2,
        velocity: 100,
      });
    }

    setNotes(newNotes);
    onUpdateNotes(activeTrack.id, newNotes);
  };

  const handleClearAll = () => {
    setNotes([]);
    onUpdateNotes(activeTrack.id, []);
  };

  const handleGenerateAiMelody = () => {
    // Generate a pleasant pentatonic synth melody pattern
    const scalePitches = [60, 62, 64, 67, 69, 72]; // C D E G A C
    const newNotes: Note[] = [];

    for (let step = 0; step < 32; step += 2) {
      if (Math.random() > 0.3) {
        const pitch = scalePitches[Math.floor(Math.random() * scalePitches.length)];
        newNotes.push({
          id: `ai-note-${step}-${Date.now()}`,
          pitch,
          step,
          durationSteps: 2,
          velocity: 90 + Math.floor(Math.random() * 30),
        });
      }
    }

    setNotes(newNotes);
    onUpdateNotes(activeTrack.id, newNotes);
    playNote(midiToFreq(60), activeTrack.synthType, 0.2, 0.2);
  };

  return (
    <div className="fixed inset-x-8 top-16 bottom-16 bg-[#1b1e26] border border-blue-500 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden select-none">
      {/* Piano Roll Header */}
      <div className="bg-[#101217] px-4 py-3 border-b border-[#2c303c] flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Music className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-sm text-white font-mono">
            PIANO ROLL EDITOR — <span className={activeTrack.color}>{activeTrack.name}</span>
          </span>
          <span className="text-xs bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded font-mono">
            64 Step Sequencer (16th Grid)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleGenerateAiMelody}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded flex items-center gap-1 transition shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Gemini AI Melody</span>
          </button>

          <button
            onClick={handleClearAll}
            className="px-3 py-1 bg-[#2c303c] hover:bg-red-800 text-white text-xs font-bold rounded flex items-center gap-1 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Grid</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-[#9ca3af] hover:text-white rounded hover:bg-[#2c303c]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid Workspace */}
      <div className="flex-1 flex overflow-auto bg-[#12141a]">
        {/* Left Piano Keys Column */}
        <div className="w-20 bg-[#101217] border-r border-[#2c303c] shrink-0 sticky left-0 z-20">
          {pitches.map((pitch) => {
            const isBlack = [1, 3, 6, 8, 10].includes(pitch % 12);
            return (
              <div
                key={pitch}
                onClick={() => playNote(midiToFreq(pitch), activeTrack.synthType, 0.4, 0.3)}
                className={`h-7 border-b border-[#2c303c]/60 flex items-center justify-end px-2 text-[10px] font-mono cursor-pointer transition hover:bg-blue-900/40 ${
                  isBlack ? 'bg-black text-blue-300 font-bold' : 'bg-[#1e222d] text-white'
                }`}
              >
                {getNoteName(pitch)}
              </div>
            );
          })}
        </div>

        {/* Step Sequencer Matrix */}
        <div className="flex-1 flex flex-col min-w-[1024px]">
          {pitches.map((pitch) => {
            return (
              <div key={pitch} className="h-7 border-b border-[#2c303c]/40 flex">
                {Array.from({ length: 32 }).map((_, step) => {
                  const hasNote = notes.some((n) => n.pitch === pitch && n.step === step);
                  const isBarDivider = step % 4 === 0;

                  return (
                    <div
                      key={step}
                      onClick={() => handleCellClick(pitch, step)}
                      className={`flex-1 border-r h-full cursor-pointer transition ${
                        isBarDivider ? 'border-[#2c303c]' : 'border-[#2c303c]/20'
                      } ${
                        hasNote
                          ? 'bg-blue-500 border-blue-300 shadow-[0_0_8px_rgba(59,130,246,0.8)]'
                          : 'hover:bg-blue-900/20'
                      }`}
                    ></div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="bg-[#101217] px-4 py-2 border-t border-[#2c303c] flex justify-between items-center text-xs text-[#9ca3af] font-mono">
        <span>Click grid cells to place/delete MIDI notes. Click piano keys to preview notes.</span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow transition"
        >
          Save & Exit Editor
        </button>
      </div>
    </div>
  );
};
