import React, { useState } from 'react';
import { Layers, X, Sliders, CheckCircle2 } from 'lucide-react';

interface MidiMatrixModalProps {
  onClose: () => void;
  onShowNotification: (msg: string) => void;
}

export const MidiMatrixModal: React.FC<MidiMatrixModalProps> = ({ onClose, onShowNotification }) => {
  const [learning, setLearning] = useState(false);

  const handleMidiLearn = () => {
    setLearning(!learning);
    if (!learning) {
      onShowNotification('MIDI Learn mode active! Move any physical knob or fader on your connected hardware controller.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4 select-none">
      <div className="w-[600px] max-w-full bg-[#1b1e26] border border-emerald-500 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#101217] px-4 py-3 border-b border-[#2c303c] flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm text-white font-mono">
              4. HARDWARE MIDI CONTROLLER & OSC MAPPING MATRIX
            </span>
          </div>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 bg-[#12141a] text-xs">
          <div className="bg-[#101217] p-3.5 rounded-lg border border-[#2c303c] space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-emerald-400 font-mono text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Persistent MIDI Device Listener: Connected
              </span>
              <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                Akai MPC / Launchpad Pro
              </span>
            </div>
            <p className="text-[11px] text-[#9ca3af] leading-relaxed">
              Right-click any DAW knob or mixer slider, hit "MIDI Learn," and map physical hardware controls instantly.
            </p>
          </div>

          <div className="space-y-2 font-mono">
            <div className="bg-[#101217] p-3 rounded-lg border border-[#2c303c] flex justify-between items-center text-[11px]">
              <span className="text-white">Knob 1 (CC #74)</span>
              <span className="text-emerald-400 font-semibold">→ Filter Cutoff (Track 1)</span>
            </div>
            <div className="bg-[#101217] p-3 rounded-lg border border-[#2c303c] flex justify-between items-center text-[11px]">
              <span className="text-white">Fader 1 (CC #7)</span>
              <span className="text-emerald-400 font-semibold">→ Master Volume Fader</span>
            </div>
            <div className="bg-[#101217] p-3 rounded-lg border border-[#2c303c] flex justify-between items-center text-[11px]">
              <span className="text-white">Pad 1 (Note C1 / #36)</span>
              <span className="text-emerald-400 font-semibold">→ Kick Sample Trigger</span>
            </div>
          </div>

          <button
            onClick={handleMidiLearn}
            className={`w-full py-2.5 font-bold rounded shadow transition flex items-center justify-center gap-1.5 ${
              learning ? 'bg-amber-600 text-white animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{learning ? 'Listening for Hardware CC Input...' : 'Enable Global MIDI Learn Mode'}</span>
          </button>
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
