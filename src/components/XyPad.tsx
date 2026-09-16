import React, { useState, useRef } from 'react';
import { Sliders, Activity } from 'lucide-react';
import { setMasterFilter } from '../lib/audioEngine';

export const XyPad: React.FC = () => {
  const [cutoff, setCutoff] = useState(12000); // 200Hz - 18000Hz
  const [resonance, setResonance] = useState(2.0); // 0.1 - 10.0
  const [pos, setPos] = useState({ x: 75, y: 30 }); // Percentage position
  const padRef = useRef<HTMLDivElement | null>(null);

  const handlePointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const xPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    setPos({ x: xPct, y: yPct });

    // X axis: Filter Cutoff (200Hz to 18000Hz logarithmic scale)
    const newCutoff = Math.round(200 * Math.pow(90, xPct / 100));
    // Y axis: Resonance Q (10.0 at top down to 0.1 at bottom)
    const newRes = Number(((100 - yPct) / 10).toFixed(1));

    setCutoff(newCutoff);
    setResonance(newRes);

    setMasterFilter(newCutoff, newRes);
  };

  return (
    <div className="bg-[#12141a] p-3 rounded-lg border border-[#2c303c] space-y-2 select-none">
      <div className="flex justify-between items-center text-[10px] font-mono">
        <span className="font-semibold text-purple-400 flex items-center gap-1">
          <Activity className="w-3.5 h-3.5" />
          Master FX XY Pad
        </span>
        <span className="text-[#9ca3af]">
          {cutoff}Hz • Q:{resonance}
        </span>
      </div>

      <div
        ref={padRef}
        onPointerDown={handlePointer}
        onPointerMove={(e) => { if (e.buttons === 1) handlePointer(e); }}
        className="h-24 bg-[#101217] rounded border border-[#2c303c] relative cursor-crosshair overflow-hidden shadow-inner flex items-center justify-center"
      >
        {/* Background Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-20">
          <div className="border-r border-b border-[#2c303c]"></div>
          <div className="border-r border-b border-[#2c303c]"></div>
          <div className="border-r border-b border-[#2c303c]"></div>
          <div className="border-b border-[#2c303c]"></div>
        </div>

        {/* Axis Labels */}
        <span className="absolute bottom-1 right-2 text-[8px] font-mono text-[#9ca3af] pointer-events-none">Cutoff →</span>
        <span className="absolute top-1 left-2 text-[8px] font-mono text-[#9ca3af] pointer-events-none">↑ Res</span>

        {/* Crosshair Cursor Puck */}
        <div
          className="absolute w-4 h-4 rounded-full bg-purple-500 border-2 border-white -ml-2 -mt-2 shadow-[0_0_12px_rgba(168,85,247,0.9)] pointer-events-none transition-transform duration-75"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        ></div>
      </div>
    </div>
  );
};
