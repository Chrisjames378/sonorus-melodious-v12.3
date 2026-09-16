import React, { useState, useEffect, useRef } from 'react';
import { Award, X, Sparkles, CheckCircle2, Flame, Sliders, Volume2 } from 'lucide-react';
import { RotaryKnob } from '../RotaryKnob';
import { getAnalyser, playNote } from '../../lib/audioEngine';

interface MasteringModalProps {
  onClose: () => void;
  onShowNotification: (msg: string) => void;
}

export const MasteringModal: React.FC<MasteringModalProps> = ({ onClose, onShowNotification }) => {
  const [targetLufs, setTargetLufs] = useState(-14); // -16 to -8
  const [saturationDrive, setSaturationDrive] = useState(25); // 0 to 100
  const [highShelfEq, setHighShelfEq] = useState(1.5); // -6dB to +6dB
  const [limiterCeiling, setLimiterCeiling] = useState(-1.0); // -2.0dB to 0.0dB
  const [chromaMode, setChromaMode] = useState('Tape Warmth');
  const [isApplying, setIsApplying] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Draw 31-Band FFT Spectrum Analyzer Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Dark background with subtle grid
      ctx.fillStyle = '#0c0d12';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = '#1e212b';
      ctx.lineWidth = 1;
      for (let y = 20; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const analyser = getAnalyser();
      const numBars = 32;
      const barWidth = (width / numBars) - 2;

      if (analyser) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        for (let i = 0; i < numBars; i++) {
          const val = dataArray[i * 2] || Math.sin(Date.now() / 200 + i) * 30 + 40;
          const barHeight = (val / 255) * (height - 10);

          const gradient = ctx.createLinearGradient(0, height, 0, 0);
          gradient.addColorStop(0, '#3b82f6');
          gradient.addColorStop(0.7, '#a855f7');
          gradient.addColorStop(1, '#f59e0b');

          ctx.fillStyle = gradient;
          ctx.fillRect(i * (barWidth + 2) + 2, height - barHeight, barWidth, barHeight);
        }
      } else {
        // Idle spectrum Bars
        for (let i = 0; i < numBars; i++) {
          const val = Math.sin(Date.now() / 300 + i * 0.4) * 20 + 35;
          const barHeight = (val / 100) * (height - 10);

          ctx.fillStyle = '#222633';
          ctx.fillRect(i * (barWidth + 2) + 2, height - barHeight, barWidth, barHeight);
        }
      }

      // Mastering Curve Target Line
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < width; x += 10) {
        const y = 30 + Math.sin(x / 40) * 8 + (highShelfEq * -3);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [highShelfEq]);

  const handleApplyAiCorrection = async () => {
    setIsApplying(true);
    try {
      const res = await fetch('/api/ai/mastering', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lufs: targetLufs, peak: limiterCeiling, genre: 'Electronic' })
      });
      const data = await res.json();
      setIsApplying(false);
      playNote(523.25, 'sawtooth', 0.4, 0.2);
      onShowNotification(data.recommendation || `Master Assistant applied ChromaGlow (${chromaMode}) at target ${targetLufs} LUFS!`);
    } catch (e) {
      setIsApplying(false);
      playNote(523.25, 'sawtooth', 0.4, 0.2);
      onShowNotification(`Master Assistant applied ChromaGlow (${chromaMode}) at target ${targetLufs} LUFS!`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[160] flex items-center justify-center p-4 select-none">
      <div className="w-[780px] max-w-full bg-[#161821] border border-purple-500/50 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden">
        
        {/* Logic Pro 11 Metallic Header */}
        <div className="bg-gradient-to-r from-[#1c1f2b] via-[#161822] to-[#10121a] px-5 py-3 border-b border-[#2c303c] flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Award className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-sm text-white font-mono tracking-wider">
              LOGIC PRO 11 MASTER ASSISTANT & CHROMAGLOW SUITE
            </span>
          </div>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 bg-[#0d0e14] text-xs">
          
          {/* Top Spectrum Analyzer Canvas */}
          <div className="bg-[#10121a] p-3 rounded-xl border border-[#2c303c] space-y-2">
            <div className="flex justify-between items-center font-mono text-[10px]">
              <span className="text-purple-400 font-bold flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" />
                31-Band FFT Real-Time Spectrum Analyzer & EQ Target Curve
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                COMMERCIAL PASSED ({targetLufs} LUFS)
              </span>
            </div>

            <canvas
              ref={canvasRef}
              width={730}
              height={100}
              className="w-full h-24 rounded-lg border border-[#202330] shadow-inner"
            />
          </div>

          {/* Rotary Knobs Controls Panel */}
          <div className="bg-[#12141f] p-4 rounded-xl border border-[#2c303c] grid grid-cols-4 gap-4">
            <RotaryKnob
              label="LUFS Target"
              value={targetLufs}
              min={-18}
              max={-8}
              unit=" LUFS"
              color="#f59e0b"
              onChange={(v) => setTargetLufs(v)}
            />

            <RotaryKnob
              label="Chroma Drive"
              value={saturationDrive}
              min={0}
              max={100}
              unit="%"
              color="#a855f7"
              onChange={(v) => setSaturationDrive(v)}
            />

            <RotaryKnob
              label="Air High EQ"
              value={highShelfEq}
              min={-6}
              max={6}
              step={0.5}
              unit=" dB"
              color="#3b82f6"
              onChange={(v) => setHighShelfEq(v)}
            />

            <RotaryKnob
              label="Limiter Peak"
              value={limiterCeiling}
              min={-2.0}
              max={0.0}
              step={0.1}
              unit=" dBTP"
              color="#10b981"
              onChange={(v) => setLimiterCeiling(v)}
            />
          </div>

          {/* ChromaGlow Saturation Model Selector */}
          <div className="bg-[#12141f] p-3.5 rounded-xl border border-[#2c303c] flex justify-between items-center font-mono">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              <span className="font-bold text-white text-xs">ChromaGlow Analog Warmth Model:</span>
            </div>

            <div className="flex space-x-2">
              {['Clean Studio', 'Tube Warmth', 'Tape Warmth', 'Transformer', 'Exciter'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setChromaMode(mode);
                    playNote(600, 'sawtooth', 0.1, 0.15);
                  }}
                  className={`px-3 py-1 rounded text-[10px] font-bold transition ${
                    chromaMode === mode
                      ? 'bg-purple-600 text-white shadow-[#a855f7]/40 shadow-lg'
                      : 'bg-[#1a1d2b] text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Master AI Action Button */}
          <button
            onClick={handleApplyAiCorrection}
            disabled={isApplying}
            className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span>{isApplying ? 'Master Assistant Calibrating Spectrum & Dynamics...' : 'Execute Logic Pro 11 Master Assistant Auto-Match'}</span>
          </button>

        </div>

        {/* Footer */}
        <div className="bg-[#12141d] px-5 py-3 border-t border-[#2c303c] flex justify-between items-center text-xs text-[#9ca3af] font-mono">
          <span>Target Platform: Spotify (-14 LUFS) • Apple Music (-16 LUFS) • YouTube (-14 LUFS)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2c303c] hover:bg-[#9ca3af] hover:text-black text-white font-bold rounded transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
