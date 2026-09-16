import React, { useState } from 'react';
import { 
  Play, Pause, Square, RotateCcw, Circle, RotateCw, Volume2, 
  ChevronDown, Activity, Sparkles, Users, Award, ShieldCheck, 
  Layers, CreditCard, DollarSign, Table, Cpu, Zap, Radio, Bot
} from 'lucide-react';
import { TransportState, ActiveModal } from '../types';
import { Oscilloscope } from './Oscilloscope';

interface HeaderProps {
  transport: TransportState;
  onTogglePlay: () => void;
  onStop: () => void;
  onReturnToZero: () => void;
  onToggleRecord: () => void;
  onToggleMetronome: () => void;
  onToggleLoop: () => void;
  onOpenModal: (modal: ActiveModal) => void;
}

export const Header: React.FC<HeaderProps> = ({
  transport,
  onTogglePlay,
  onStop,
  onReturnToZero,
  onToggleRecord,
  onToggleMetronome,
  onToggleLoop,
  onOpenModal
}) => {
  const [powerhouseOpen, setPowerhouseOpen] = useState(false);

  const formatTimecode = () => {
    const { bar, beat, sixteenth, milliseconds } = transport;
    const msStr = String(milliseconds).padStart(3, '0');
    return `${bar}. ${beat}. ${sixteenth}. ${msStr}`;
  };

  return (
    <header className="bg-[#101217] border-b border-[#2c303c] h-12 flex items-center justify-between px-3 md:px-4 z-40 select-none">
      {/* Left: Branding & Core Engine Badges */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-[#1b1e26] px-2.5 py-1 rounded border border-[#2c303c] shadow-sm">
          <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
          <span className="font-bold tracking-wider text-[11px] md:text-xs bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent font-mono">
            SONORUS MELODIOUS v12.3
          </span>
        </div>
        <div className="text-[10px] text-[#9ca3af] hidden xl:flex items-center space-x-2 border-l border-[#2c303c] pl-3 font-mono">
          <span className="text-blue-400 font-semibold">Gemini 3 Flash</span>
          <span>•</span>
          <span className="text-purple-400 font-semibold">Logic 12.3</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">Acoustica 8</span>
          <span>•</span>
          <span className="text-amber-400 font-semibold">Reason 14</span>
        </div>
      </div>

      {/* Center: Transport & Timecode */}
      <div className="flex items-center space-x-2 md:space-x-3 bg-[#1b1e26] px-3 py-1 rounded-full border border-[#2c303c] shadow-inner">
        <div className="font-mono text-amber-400 font-bold tracking-widest text-xs md:text-sm w-28 md:w-32 text-center">
          {formatTimecode()}
        </div>
        
        <div className="flex items-center space-x-1 text-[#9ca3af]">
          <button
            onClick={onToggleMetronome}
            className={`p-1.5 rounded hover:text-white transition ${transport.metronomeActive ? 'text-amber-400 bg-amber-950/40' : ''}`}
            title="Metronome Click"
          >
            <Radio className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleLoop}
            className={`p-1.5 rounded hover:text-white transition ${transport.loopActive ? 'text-blue-400 bg-blue-950/40' : ''}`}
            title="Cycle Loop Mode"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-[1px] bg-[#2c303c]"></div>

        {/* Transport Buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onToggleRecord}
            className={`w-7 h-7 rounded-full flex items-center justify-center border transition shadow ${
              transport.isRecording 
                ? 'bg-red-600 text-white border-red-400 animate-pulse' 
                : 'bg-red-950/40 text-red-500 border-red-800/60 hover:bg-red-800 hover:text-white'
            }`}
            title="Record Track"
          >
            <Circle className="w-3 h-3 fill-current" />
          </button>
          
          <button
            onClick={onTogglePlay}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition shadow-lg ${
              transport.isPlaying
                ? 'bg-amber-600 text-white hover:bg-amber-500 shadow-amber-600/30'
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/30'
            }`}
            title={transport.isPlaying ? "Pause Playback" : "Play Transport"}
          >
            {transport.isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={onStop}
            className="w-7 h-7 rounded-full bg-[#2c303c] text-[#d1d5db] flex items-center justify-center hover:bg-[#9ca3af] hover:text-black transition"
            title="Stop Playback"
          >
            <Square className="w-3 h-3 fill-current" />
          </button>

          <button
            onClick={onReturnToZero}
            className="w-7 h-7 rounded-full bg-[#2c303c] text-[#d1d5db] flex items-center justify-center hover:bg-[#9ca3af] hover:text-black transition"
            title="Return to Bar 1"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        <div className="font-mono text-[11px] text-blue-400 font-semibold px-2 bg-black/40 rounded hidden sm:flex items-center space-x-1">
          <span>{transport.bpm.toFixed(1)} BPM</span>
        </div>

        <Oscilloscope isPlaying={transport.isPlaying} />
      </div>

      {/* Right: Feature Buttons & Powerhouse Dropdown */}
      <div className="flex items-center space-x-1.5 md:space-x-2">
        <button
          onClick={() => onOpenModal('valuation')}
          className="px-2.5 py-1 text-xs bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded font-semibold flex items-center space-x-1 shadow transition"
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Valuation</span>
        </button>

        <button
          onClick={() => onOpenModal('paypal')}
          className="px-2.5 py-1 text-xs bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white rounded font-semibold flex items-center space-x-1 shadow transition"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">PayPal Pass</span>
        </button>

        <button
          onClick={() => onOpenModal('liveLoops')}
          className="px-2.5 py-1 text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded font-semibold flex items-center space-x-1 shadow transition"
        >
          <Table className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Live Loops</span>
        </button>

        {/* Powerhouse Features Dropdown */}
        <div className="relative">
          <button
            onClick={() => setPowerhouseOpen(!powerhouseOpen)}
            className="px-2.5 py-1 text-xs bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded font-semibold flex items-center space-x-1 shadow transition"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span className="hidden md:inline">Powerhouse</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {powerhouseOpen && (
            <div 
              className="absolute right-0 mt-1.5 w-72 bg-[#1b1e26] border border-[#2c303c] rounded-lg shadow-2xl p-2 space-y-1 z-50 text-xs font-sans"
              onMouseLeave={() => setPowerhouseOpen(false)}
            >
              <div className="text-[10px] font-bold text-blue-400 uppercase px-2 py-1 bg-blue-950/60 rounded flex justify-between items-center">
                <span>Top 5 Powerhouse Features</span>
                <Sparkles className="w-3 h-3 text-amber-400" />
              </div>

              <button
                onClick={() => { onOpenModal('collab'); setPowerhouseOpen(false); }}
                className="w-full text-left px-2.5 py-2 hover:bg-blue-900/40 rounded text-[#d1d5db] flex items-center justify-between transition"
              >
                <span>1. Live Cloud Jam & MIDI Share</span>
                <Users className="w-3.5 h-3.5 text-blue-400" />
              </button>

              <button
                onClick={() => { onOpenModal('mastering'); setPowerhouseOpen(false); }}
                className="w-full text-left px-2.5 py-2 hover:bg-purple-900/40 rounded text-[#d1d5db] flex items-center justify-between transition"
              >
                <span>2. AI Mastering Pre-Flight Check</span>
                <Award className="w-3.5 h-3.5 text-purple-400" />
              </button>

              <button
                onClick={() => { onOpenModal('modular'); setPowerhouseOpen(false); }}
                className="w-full text-left px-2.5 py-2 hover:bg-red-900/40 rounded text-[#d1d5db] flex items-center justify-between transition"
              >
                <span>3. Reason Modular Patch Bay</span>
                <Cpu className="w-3.5 h-3.5 text-red-400" />
              </button>

              <button
                onClick={() => { onOpenModal('midi'); setPowerhouseOpen(false); }}
                className="w-full text-left px-2.5 py-2 hover:bg-emerald-900/40 rounded text-[#d1d5db] flex items-center justify-between transition"
              >
                <span>4. Hardware MIDI/OSC Matrix</span>
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
              </button>

              <button
                onClick={() => { onOpenModal('chords'); setPowerhouseOpen(false); }}
                className="w-full text-left px-2.5 py-2 hover:bg-amber-900/40 rounded text-[#d1d5db] flex items-center justify-between transition"
              >
                <span>5. Smart Chord & Voice-Leading AI</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => onOpenModal(46)}
          className="px-2.5 py-1 text-xs bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded font-semibold flex items-center space-x-1 shadow transition"
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">50 AI Modules</span>
        </button>
      </div>
    </header>
  );
};
