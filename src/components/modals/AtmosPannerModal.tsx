import React, { useState, useRef, useEffect } from 'react';
import { Tv, X, Radio, RotateCcw, Volume2, Sparkles, Sliders } from 'lucide-react';
import { RotaryKnob } from '../RotaryKnob';
import { playNote } from '../../lib/audioEngine';

interface AtmosPannerModalProps {
  onClose: () => void;
  onShowNotification: (msg: string) => void;
}

export const AtmosPannerModal: React.FC<AtmosPannerModalProps> = ({ onClose, onShowNotification }) => {
  const [soundPos, setSoundPos] = useState({ x: 50, y: 35 }); // Center top-mid
  const [elevation, setElevation] = useState(45); // Height angle 0 to 90
  const [roomSize, setRoomSize] = useState(65);
  const [binauralMode, setBinauralMode] = useState(true);
  const [binauralRender, setBinauralRender] = useState('Apple Spatial Audio / Atmos');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Draw 3D Room Grid and Speaker Array
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Dark Studio Grid Background
    ctx.fillStyle = '#0f1117';
    ctx.fillRect(0, 0, width, height);

    // Concentric Orbit Circles
    const centerX = width / 2;
    const centerY = height / 2;
    const maxR = Math.min(width, height) * 0.42;

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#232733';

    for (let r = 0.25; r <= 1.0; r += 0.25) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxR * r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Crosshair Axis
    ctx.beginPath();
    ctx.moveTo(centerX, 10);
    ctx.lineTo(centerX, height - 10);
    ctx.moveTo(10, centerY);
    ctx.lineTo(width - 10, centerY);
    ctx.stroke();

    // 7.1.4 Atmos Speaker Positions
    const speakers = [
      { name: 'L', angle: -0.25 * Math.PI },
      { name: 'C', angle: 0 },
      { name: 'R', angle: 0.25 * Math.PI },
      { name: 'Ls', angle: -0.65 * Math.PI },
      { name: 'Rs', angle: 0.65 * Math.PI },
      { name: 'Lbr', angle: -0.85 * Math.PI },
      { name: 'Rbr', angle: 0.85 * Math.PI },
    ];

    speakers.forEach((spk) => {
      const sx = centerX + Math.sin(spk.angle) * maxR;
      const sy = centerY - Math.cos(spk.angle) * maxR;

      ctx.fillStyle = '#20232e';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(sx, sy, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#60a5fa';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(spk.name, sx, sy - 10);
    });

    // Listener Center Node
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('HEAD', centerX, centerY + 18);

    // Draggable Sound Object Node
    const objX = (soundPos.x / 100) * width;
    const objY = (soundPos.y / 100) * height;

    // Line from head to sound object
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(objX, objY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Glow aura
    const gradient = ctx.createRadialGradient(objX, objY, 2, objX, objY, 22);
    gradient.addColorStop(0, 'rgba(168, 85, 247, 0.8)');
    gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(objX, objY, 22, 0, Math.PI * 2);
    ctx.fill();

    // Core Sound Node
    ctx.fillStyle = '#c084fc';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(objX, objY, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }, [soundPos]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    const updatePos = (me: PointerEvent) => {
      const xPct = Math.max(5, Math.min(95, ((me.clientX - rect.left) / rect.width) * 100));
      const yPct = Math.max(5, Math.min(95, ((me.clientY - rect.top) / rect.height) * 100));
      setSoundPos({ x: Math.round(xPct), y: Math.round(yPct) });
      playNote(300 + (100 - yPct) * 4, 'sine', 0.1, 0.1);
    };

    updatePos(e.nativeEvent);

    const onPointerMove = (me: PointerEvent) => updatePos(me);
    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[160] flex items-center justify-center p-4 select-none">
      <div className="w-[780px] max-w-full bg-[#161821] border border-[#3b82f6]/50 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden">
        
        {/* Logic Pro Metallic Header Bar */}
        <div className="bg-gradient-to-r from-[#1c1f2b] via-[#161822] to-[#10121a] px-5 py-3 border-b border-[#2c303c] flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping"></div>
            <span className="font-bold text-sm text-white font-mono tracking-wider flex items-center gap-2">
              <Tv className="w-4 h-4 text-blue-400" />
              DOLBY ATMOS 3D SPATIAL AUDIO PANNER (LOGIC PRO 11 CLASS)
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
              7.1.4 BINAURAL ACTIVE
            </span>
            <button onClick={onClose} className="text-[#9ca3af] hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Content Body */}
        <div className="p-5 space-y-4 bg-[#0d0e14] text-xs">
          <div className="grid grid-cols-12 gap-4">
            
            {/* Left 3D Spatial Canvas */}
            <div className="col-span-7 bg-[#10121a] p-3 rounded-xl border border-[#2c303c] flex flex-col items-center justify-between">
              <div className="flex justify-between items-center w-full text-[10px] font-mono text-[#9ca3af] mb-2">
                <span>Drag Audio Object Node in 3D Soundfield</span>
                <span className="text-purple-400 font-bold">X:{soundPos.x}% Y:{soundPos.y}% Z:{elevation}°</span>
              </div>

              <canvas
                ref={canvasRef}
                width={360}
                height={260}
                onPointerDown={handlePointerDown}
                className="rounded-lg border border-[#252836] cursor-crosshair shadow-inner"
              />

              <div className="flex justify-between items-center w-full text-[9px] font-mono text-[#9ca3af] mt-2">
                <span>Front L/C/R Speakers</span>
                <span className="text-blue-400">Rear Surround Array</span>
              </div>
            </div>

            {/* Right Controls & Rotary Knobs */}
            <div className="col-span-5 flex flex-col justify-between space-y-3">
              {/* Binaural Spatial Profile */}
              <div className="bg-[#12141f] p-3 rounded-xl border border-[#2c303c] space-y-2 font-mono">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                  Binaural Headphone Profile
                </span>
                <select
                  value={binauralRender}
                  onChange={(e) => setBinauralRender(e.target.value)}
                  className="w-full bg-[#0a0b10] border border-[#2c303c] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                >
                  <option>Apple Spatial Audio / Atmos</option>
                  <option>Dolby Atmos Renderer (HRTF 1)</option>
                  <option>Logic Pro 11 Binaural Studio</option>
                  <option>Ambisonics B-Format 3D</option>
                </select>
              </div>

              {/* Rotary Knob Controls */}
              <div className="bg-[#12141f] p-4 rounded-xl border border-[#2c303c] grid grid-cols-2 gap-4">
                <RotaryKnob
                  label="Elevation"
                  value={elevation}
                  min={0}
                  max={90}
                  unit="°"
                  color="#a855f7"
                  onChange={(v) => setElevation(v)}
                />

                <RotaryKnob
                  label="Room Size"
                  value={roomSize}
                  min={10}
                  max={100}
                  unit="%"
                  color="#3b82f6"
                  onChange={(v) => setRoomSize(v)}
                />
              </div>

              {/* Spatializer Actions */}
              <div className="bg-[#12141f] p-3 rounded-xl border border-[#2c303c] space-y-2">
                <button
                  onClick={() => {
                    setSoundPos({ x: 50, y: 35 });
                    setElevation(45);
                    playNote(440, 'sine', 0.2, 0.2);
                    onShowNotification('Reset 3D Spatial Audio Object to Front Center Head Origin.');
                  }}
                  className="w-full py-2 bg-[#202330] hover:bg-[#2e3346] text-white font-mono text-xs font-bold rounded flex items-center justify-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Soundfield Origin</span>
                </button>

                <button
                  onClick={() => {
                    playNote(523.25, 'sawtooth', 0.5, 0.2);
                    onShowNotification('Applied 3D Spatial Pan object metadata to active timeline track!');
                    onClose();
                  }}
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-mono text-xs font-bold rounded shadow transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Apply Atmos 3D Metadata</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#12141d] px-5 py-3 border-t border-[#2c303c] flex justify-between items-center text-xs text-[#9ca3af] font-mono">
          <span>Dolby Atmos Object Bed: 7.1.4 Speakers • Binaural HRTF Enabled</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2c303c] hover:bg-[#9ca3af] hover:text-black text-white font-bold rounded transition"
          >
            Close Panner
          </button>
        </div>

      </div>
    </div>
  );
};
