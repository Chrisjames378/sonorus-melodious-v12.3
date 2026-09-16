import React from 'react';
import { Cpu, Sparkles, DollarSign, CreditCard, Bot, Network, Award, Tv, ArrowRight } from 'lucide-react';
import { Track, ActiveModal } from '../types';
import { XyPad } from './XyPad';
import { PresetSelector } from './PresetSelector';
import { SoundPreset } from '../lib/audioEngine';

interface InspectorProps {
  activeTrack: Track | null;
  onOpenModal: (modal: ActiveModal) => void;
  onRunChordAnalysis: () => void;
  detectedChords: string;
  isAnalyzingChords: boolean;
  currentPresetId: string;
  onSelectPreset: (preset: SoundPreset) => void;
}

export const Inspector: React.FC<InspectorProps> = ({
  activeTrack,
  onOpenModal,
  onRunChordAnalysis,
  detectedChords,
  isAnalyzingChords,
  currentPresetId,
  onSelectPreset,
}) => {
  return (
    <div className="w-72 bg-[#1b1e26] border-r border-[#2c303c] flex flex-col text-xs z-20 select-none">
      {/* Header */}
      <div className="p-2.5 bg-[#101217] border-b border-[#2c303c] font-bold flex justify-between items-center">
        <span className="text-blue-400 flex items-center gap-1.5 font-mono text-[11px]">
          <Cpu className="w-3.5 h-3.5" />
          TRACK INSPECTOR & AI
        </span>
        <span className="text-[#9ca3af] truncate max-w-[120px] font-mono text-[10px]">
          {activeTrack ? activeTrack.name : 'No Track'}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        
        {/* Gemini 3 Flash AI Core Panel */}
        <div className="bg-[#12141a] p-3 rounded-lg border border-[#2c303c] space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-blue-400 flex items-center gap-1 font-mono text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Gemini 3 Flash AI Core
            </span>
            <span className="text-[9px] bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded font-mono font-semibold">
              Active
            </span>
          </div>

          <p className="text-[10px] text-[#9ca3af] leading-relaxed">
            Real-time harmonic progression detection & voice-leading engine.
          </p>

          <div className="bg-[#101217] p-2.5 rounded-md text-center font-mono text-emerald-400 text-xs font-bold border border-[#2c303c] shadow-inner min-h-[42px] flex items-center justify-center">
            {isAnalyzingChords ? (
              <span className="text-blue-400 animate-pulse text-[11px]">
                Analyzing Harmonic Progression...
              </span>
            ) : (
              detectedChords
            )}
          </div>

          <button
            onClick={onRunChordAnalysis}
            disabled={isAnalyzingChords}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold transition shadow flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Run Gemini AI Analysis</span>
          </button>
        </div>

        {/* Master FX XY Filter Pad */}
        <XyPad />

        {/* Sound Bank Presets */}
        <PresetSelector
          currentPresetId={currentPresetId}
          onSelectPreset={onSelectPreset}
        />

        {/* Active Track Settings Quick Controls */}
        {activeTrack && (
          <div className="bg-[#12141a] p-3 rounded-lg border border-[#2c303c] space-y-2.5">
            <div className="flex justify-between items-center border-b border-[#2c303c] pb-1.5">
              <span className="font-semibold text-white truncate">{activeTrack.name}</span>
              <span className="text-[10px] text-blue-400 font-mono uppercase">{activeTrack.synthType}</span>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] text-[#9ca3af] mb-1 font-mono">
                  <span>Track Gain</span>
                  <span>{activeTrack.volume}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={activeTrack.volume} 
                  readOnly 
                  className="w-full accent-blue-500 h-1 bg-[#2c303c] rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-[#9ca3af] mb-1 font-mono">
                  <span>Pan</span>
                  <span>{activeTrack.pan === 0 ? 'C' : activeTrack.pan < 0 ? `L${Math.abs(activeTrack.pan)}` : `R${activeTrack.pan}`}</span>
                </div>
                <input 
                  type="range" 
                  min="-50" 
                  max="50" 
                  value={activeTrack.pan} 
                  readOnly 
                  className="w-full accent-purple-500 h-1 bg-[#2c303c] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Business Valuation & Monetization Quick Access */}
        <div className="bg-[#12141a] p-3 rounded-lg border border-amber-500/40 space-y-2">
          <div className="font-semibold text-amber-400 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              Monetization & Valuation
            </span>
            <span className="text-[9px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded font-mono">
              v12.3
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenModal('valuation')}
              className="p-2 bg-[#101217] hover:bg-[#20232b] rounded border border-[#2c303c] text-center text-[10px] text-amber-300 transition font-semibold flex items-center justify-center gap-1"
            >
              <DollarSign className="w-3 h-3" />
              Valuation
            </button>
            <button
              onClick={() => onOpenModal('paypal')}
              className="p-2 bg-[#101217] hover:bg-[#20232b] rounded border border-[#2c303c] text-center text-[10px] text-blue-300 transition font-semibold flex items-center justify-center gap-1"
            >
              <CreditCard className="w-3 h-3" />
              PayPal SDK
            </button>
          </div>
        </div>

        {/* Channel Insert FX Chain */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1 flex justify-between items-center font-mono">
            <span>Insert FX Chain</span>
            <span className="text-blue-400">50 AI Slots</span>
          </div>

          <div
            onClick={() => onOpenModal(1)}
            className="bg-[#12141a] hover:bg-[#20232b] p-2.5 rounded border border-[#2c303c] cursor-pointer flex justify-between items-center transition group"
          >
            <span className="group-hover:text-blue-300 text-[11px] truncate">0. Gemini Melody Generator AI</span>
            <Bot className="w-3.5 h-3.5 text-blue-400 shrink-0 ml-1" />
          </div>

          <div
            onClick={() => onOpenModal('modular')}
            className="bg-[#12141a] hover:bg-[#20232b] p-2.5 rounded border border-[#2c303c] cursor-pointer flex justify-between items-center transition group"
          >
            <span className="group-hover:text-red-300 text-[11px] truncate">1. Modular Patch Bay CV Link</span>
            <Network className="w-3.5 h-3.5 text-red-400 shrink-0 ml-1" />
          </div>

          <div
            onClick={() => onOpenModal('mastering')}
            className="bg-[#12141a] hover:bg-[#20232b] p-2.5 rounded border border-[#2c303c] cursor-pointer flex justify-between items-center transition group"
          >
            <span className="group-hover:text-purple-300 text-[11px] truncate">2. AI Mastering Delivery Check</span>
            <Award className="w-3.5 h-3.5 text-purple-400 shrink-0 ml-1" />
          </div>

          <div
            onClick={() => onOpenModal(41)}
            className="bg-[#12141a] hover:bg-[#20232b] p-2.5 rounded border border-[#2c303c] cursor-pointer flex justify-between items-center transition group"
          >
            <span className="group-hover:text-teal-300 text-[11px] truncate">3. Dolby Atmos 3D Panner AI</span>
            <Tv className="w-3.5 h-3.5 text-teal-400 shrink-0 ml-1" />
          </div>

          <button
            onClick={() => onOpenModal(10)}
            className="w-full py-1.5 bg-[#101217] hover:bg-[#20232b] text-[#9ca3af] hover:text-white rounded border border-[#2c303c] text-[10px] font-mono transition flex items-center justify-center gap-1 mt-1"
          >
            <span>+ Add AI Effect Slot (46 Available)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
};
