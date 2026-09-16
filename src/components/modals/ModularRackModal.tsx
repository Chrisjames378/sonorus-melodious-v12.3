import React, { useState } from 'react';
import { Cpu, X, RefreshCw, Zap } from 'lucide-react';
import { playNote } from '../../lib/audioEngine';

interface ModularRackModalProps {
  onClose: () => void;
  onShowNotification: (msg: string) => void;
}

export const ModularRackModal: React.FC<ModularRackModalProps> = ({ onClose, onShowNotification }) => {
  const [isRearFlipped, setIsRearFlipped] = useState(true);

  const handleFlipRack = () => {
    setIsRearFlipped(!isRearFlipped);
    playNote(600, 'square', 0.15, 0.2);
    onShowNotification(isRearFlipped ? 'Flipped to Front Rack View: Knobs & Sliders Active' : 'Flipped to Rear Rack View: CV & Audio Cables Active!');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4 select-none">
      <div className="w-[680px] max-w-full bg-[#1b1e26] border border-red-500 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#101217] px-4 py-3 border-b border-[#2c303c] flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-red-400" />
            <span className="font-bold text-sm text-white font-mono">
              3. MODULAR VIRTUAL CABLE PATCH BAY (REASON-STYLE)
            </span>
          </div>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 bg-[#12141a] text-xs">
          <div className="bg-[#101217] p-3 rounded-lg border border-[#2c303c] flex justify-between items-center">
            <span className="text-[#9ca3af] font-mono text-xs">
              {isRearFlipped ? 'Rear Panel: CV Modulation & Audio Patching Active' : 'Front Panel: Device Knobs & Master Controls'}
            </span>
            <button
              onClick={handleFlipRack}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded shadow transition flex items-center gap-1.5 font-mono text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Flip Rack View</span>
            </button>
          </div>

          {/* Cable Visualization Panel */}
          <div className="bg-[#101217] p-4 rounded-lg border border-[#2c303c] h-52 relative flex items-center justify-center overflow-hidden">
            {/* Rear Panel Cable Patch SVGs */}
            {isRearFlipped ? (
              <>
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path d="M 120 80 Q 260 10 400 120" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="4" className="animate-pulse" />
                  <path d="M 140 140 Q 300 180 440 90" fill="none" stroke="#3b82f6" strokeWidth="3" />
                  <path d="M 180 60 Q 320 160 480 70" fill="none" stroke="#10b981" strokeWidth="2.5" />
                </svg>

                <div className="absolute inset-0 flex justify-between items-center px-8">
                  <div className="bg-[#12141a] p-3 rounded-lg border border-red-500/60 text-center space-y-1 shadow-md">
                    <div className="font-bold text-red-400 font-mono">Europa LFO 1</div>
                    <div className="text-[10px] text-[#9ca3af] font-mono">CV Output Out</div>
                    <div className="w-3.5 h-3.5 rounded-full bg-red-500 mx-auto mt-2 animate-ping"></div>
                  </div>

                  <div className="bg-[#12141a] p-3 rounded-lg border border-blue-500/60 text-center space-y-1 shadow-md">
                    <div className="font-bold text-blue-400 font-mono">Thor Filter Cutoff</div>
                    <div className="text-[10px] text-[#9ca3af] font-mono">CV Modulation In</div>
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-500 mx-auto mt-2"></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-3 gap-4 w-full px-4">
                <div className="bg-[#12141a] p-3 rounded border border-[#2c303c] text-center space-y-2">
                  <span className="font-bold text-red-400 font-mono">Oscillator 1</span>
                  <input type="range" min="0" max="100" defaultValue="75" className="w-full accent-red-500" />
                  <div className="text-[9px] text-[#9ca3af] font-mono">Sawtooth / 440Hz</div>
                </div>
                <div className="bg-[#12141a] p-3 rounded border border-[#2c303c] text-center space-y-2">
                  <span className="font-bold text-blue-400 font-mono">Ladder Filter</span>
                  <input type="range" min="0" max="100" defaultValue="60" className="w-full accent-blue-500" />
                  <div className="text-[9px] text-[#9ca3af] font-mono">Cutoff: 2.4kHz</div>
                </div>
                <div className="bg-[#12141a] p-3 rounded border border-[#2c303c] text-center space-y-2">
                  <span className="font-bold text-emerald-400 font-mono">ADSR Envelope</span>
                  <input type="range" min="0" max="100" defaultValue="40" className="w-full accent-emerald-500" />
                  <div className="text-[9px] text-[#9ca3af] font-mono">Attack: 12ms</div>
                </div>
              </div>
            )}
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
