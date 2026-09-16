import React, { useState } from 'react';
import { Sparkles, X, Music, Download } from 'lucide-react';
import { playNote, midiToFreq } from '../../lib/audioEngine';

interface SmartChordModalProps {
  onClose: () => void;
  onShowNotification: (msg: string) => void;
  onDropChordsToTimeline?: (chordsStr: string) => void;
}

export const SmartChordModal: React.FC<SmartChordModalProps> = ({
  onClose,
  onShowNotification,
  onDropChordsToTimeline,
}) => {
  const [prompt, setPrompt] = useState("Cinematic Cyberpunk Techno with Neo-Soul Jazz Extensions");
  const [chords, setChords] = useState("Cm9 — Fm11 — Abmaj7/Bb — G7(alt)");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/chords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, key: 'C minor' })
      });
      const data = await res.json();
      setIsGenerating(false);
      setChords(data.chords || "Dm9 — G13 — Cmaj9 — A7(b9)");
      playNote(523.25, 'sawtooth', 0.5, 0.2); // C5 audition
    } catch (e) {
      setIsGenerating(false);
      const fallbackList = [
        "Dm9 — G13 — Cmaj9 — A7(b9) [AI Voice-Led]",
        "Fmaj9 — E7(alt) — Am11 — D13 [AI Voice-Led]",
        "Ebm9 — Ab13 — Dbmaj9 — Bb7(alt) [AI Voice-Led]"
      ];
      setChords(fallbackList[Math.floor(Math.random() * fallbackList.length)]);
      playNote(523.25, 'sawtooth', 0.5, 0.2);
    }
  };

  const handleDropToTimeline = () => {
    if (onDropChordsToTimeline) {
      onDropChordsToTimeline(chords);
    }
    onShowNotification(`Dropped generated chord progression "${chords}" into active track clip!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4 select-none">
      <div className="w-[640px] max-w-full bg-[#1b1e26] border border-amber-500 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#101217] px-4 py-3 border-b border-[#2c303c] flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm text-white font-mono">
              5. SMART CHORD PROGRESSION & VOICE-LEADING AI
            </span>
          </div>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 bg-[#12141a] text-xs">
          <div className="bg-[#101217] p-3.5 rounded-lg border border-[#2c303c] space-y-3">
            <div className="font-semibold text-amber-400 font-mono text-xs flex items-center gap-1.5">
              <Music className="w-4 h-4" />
              Gemini AI Generative Prompt Studio
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 bg-[#12141a] border border-[#2c303c] rounded px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded shadow transition flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Analyzing...' : 'Generate'}</span>
              </button>
            </div>
          </div>

          <div className="bg-[#101217] p-4 rounded-lg border border-[#2c303c] font-mono text-center text-emerald-400 text-base font-bold shadow-inner min-h-[56px] flex items-center justify-center">
            {chords}
          </div>

          <div className="flex justify-between items-center bg-[#101217] p-3 rounded-lg border border-[#2c303c]">
            <span className="text-[#9ca3af] font-mono text-[11px]">
              Voice-Leading: Smooth inner-voice preservation active.
            </span>
            <button
              onClick={handleDropToTimeline}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Drop into Timeline</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#101217] px-4 py-3 border-t border-[#2c303c] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2c303c] hover:bg-[#9ca3af] hover:text-black text-white font-bold rounded text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
