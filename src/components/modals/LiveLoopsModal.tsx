import React, { useState } from 'react';
import { Table, X, Play, Zap } from 'lucide-react';
import { playNote, playDrum } from '../../lib/audioEngine';

interface LiveLoopsModalProps {
  onClose: () => void;
  onShowNotification: (msg: string) => void;
}

export const LiveLoopsModal: React.FC<LiveLoopsModalProps> = ({ onClose, onShowNotification }) => {
  const [activeCells, setActiveCells] = useState<Record<string, boolean>>({});

  const toggleCell = (trackIdx: number, cellIdx: number, name: string) => {
    const key = `${trackIdx}-${cellIdx}`;
    const nextState = !activeCells[key];
    setActiveCells((prev) => ({ ...prev, [key]: nextState }));

    if (nextState) {
      if (trackIdx === 0) playDrum('kick');
      else if (trackIdx === 1) playDrum('sub808');
      else if (trackIdx === 2) playNote(440 + cellIdx * 50, 'sawtooth', 0.4, 0.2);
      else playNote(880, 'sine', 0.2, 0.15);
    }
  };

  const launchScene = () => {
    setActiveCells({
      '0-0': true,
      '1-0': true,
      '2-0': true,
      '3-0': true,
    });
    playDrum('kick');
    playDrum('sub808');
    playNote(440, 'sawtooth', 0.5, 0.2);
    onShowNotification('Launched Scene 1 across all synchronized loop tracks!');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4 select-none">
      <div className="w-[720px] max-w-full bg-[#1b1e26] border border-amber-500 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#101217] px-4 py-3 border-b border-[#2c303c] flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Table className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm text-white font-mono">
              LIVE LOOP LAUNCHER GRID (LOGIC / ABLETON STYLE)
            </span>
          </div>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 bg-[#12141a] text-xs">
          <div className="flex justify-between items-center bg-[#101217] p-3 rounded-lg border border-[#2c303c]">
            <span className="text-[#9ca3af] font-mono">
              Trigger scenes or individual loop cells synchronized to 128.0 BPM tempo.
            </span>
            <button
              onClick={launchScene}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded shadow transition flex items-center gap-1.5 font-mono"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Scene 1</span>
            </button>
          </div>

          {/* 4x4 Cells Grid */}
          <div className="grid grid-cols-4 gap-3 text-center font-semibold font-mono">
            <div className="text-blue-400 text-xs font-bold">Drums & Perc</div>
            <div className="text-purple-400 text-xs font-bold">Basslines</div>
            <div className="text-emerald-400 text-xs font-bold">Melody/Synths</div>
            <div className="text-teal-400 text-xs font-bold">Vocals/FX</div>

            {/* Row 1 */}
            <div
              onClick={() => toggleCell(0, 0, 'Trap Kick 1')}
              className={`h-16 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition ${
                activeCells['0-0']
                  ? 'bg-blue-600 text-white border-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                  : 'bg-[#101217] border-[#2c303c] text-blue-300 hover:border-blue-500'
              }`}
            >
              <span className="text-xs font-bold">Trap Kick 1</span>
              <span className="text-[9px] opacity-70">1 Bar</span>
            </div>

            <div
              onClick={() => toggleCell(1, 0, '808 Sub A')}
              className={`h-16 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition ${
                activeCells['1-0']
                  ? 'bg-purple-600 text-white border-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.6)]'
                  : 'bg-[#101217] border-[#2c303c] text-purple-300 hover:border-purple-500'
              }`}
            >
              <span className="text-xs font-bold">808 Sub A</span>
              <span className="text-[9px] opacity-70">2 Bar</span>
            </div>

            <div
              onClick={() => toggleCell(2, 0, 'Arp Lead')}
              className={`h-16 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition ${
                activeCells['2-0']
                  ? 'bg-emerald-600 text-white border-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                  : 'bg-[#101217] border-[#2c303c] text-emerald-300 hover:border-emerald-500'
              }`}
            >
              <span className="text-xs font-bold">Arp Lead</span>
              <span className="text-[9px] opacity-70">4 Bar</span>
            </div>

            <div
              onClick={() => toggleCell(3, 0, 'Vocal Chop')}
              className={`h-16 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition ${
                activeCells['3-0']
                  ? 'bg-teal-600 text-white border-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.6)]'
                  : 'bg-[#101217] border-[#2c303c] text-teal-300 hover:border-teal-500'
              }`}
            >
              <span className="text-xs font-bold">Vocal Chop</span>
              <span className="text-[9px] opacity-70">1 Bar</span>
            </div>

            {/* Row 2 */}
            <div
              onClick={() => toggleCell(0, 1, 'Hi-Hat Fill')}
              className={`h-16 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition ${
                activeCells['0-1']
                  ? 'bg-blue-600 text-white border-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                  : 'bg-[#101217] border-[#2c303c] text-blue-300 hover:border-blue-500'
              }`}
            >
              <span className="text-xs font-bold">Hi-Hat Fill</span>
              <span className="text-[9px] opacity-70">1 Bar</span>
            </div>

            <div
              onClick={() => toggleCell(1, 1, 'Acid Synth Bass')}
              className={`h-16 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition ${
                activeCells['1-1']
                  ? 'bg-purple-600 text-white border-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.6)]'
                  : 'bg-[#101217] border-[#2c303c] text-purple-300 hover:border-purple-500'
              }`}
            >
              <span className="text-xs font-bold">Acid Bass</span>
              <span className="text-[9px] opacity-70">2 Bar</span>
            </div>

            <div
              onClick={() => toggleCell(2, 1, 'Neo-Soul Chord')}
              className={`h-16 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition ${
                activeCells['2-1']
                  ? 'bg-emerald-600 text-white border-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                  : 'bg-[#101217] border-[#2c303c] text-emerald-300 hover:border-emerald-500'
              }`}
            >
              <span className="text-xs font-bold">Neo-Soul Pad</span>
              <span className="text-[9px] opacity-70">4 Bar</span>
            </div>

            <div
              onClick={() => toggleCell(3, 1, 'Riser Sweep')}
              className={`h-16 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition ${
                activeCells['3-1']
                  ? 'bg-teal-600 text-white border-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.6)]'
                  : 'bg-[#101217] border-[#2c303c] text-teal-300 hover:border-teal-500'
              }`}
            >
              <span className="text-xs font-bold">Riser Sweep</span>
              <span className="text-[9px] opacity-70">2 Bar</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#101217] px-4 py-3 border-t border-[#2c303c] flex justify-between items-center text-xs text-[#9ca3af] font-mono">
          <span>Quantization: 1 Bar • Follow Action: Enabled</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2c303c] hover:bg-[#9ca3af] hover:text-black text-white font-bold rounded transition"
          >
            Close Grid
          </button>
        </div>
      </div>
    </div>
  );
};
