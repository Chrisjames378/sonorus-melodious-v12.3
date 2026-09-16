import React, { useState } from 'react';
import { Track, ActiveModal } from '../types';
import { Volume2, VolumeX, Mic, Disc, Layers, Edit3, Plus, Bot, Users, Cpu, LayoutGrid, Sliders, Tv, Sparkles, Play } from 'lucide-react';
import { playDrum, playNote } from '../lib/audioEngine';

interface TimelineProps {
  tracks: Track[];
  activeTrackId: string;
  onSelectTrack: (trackId: string) => void;
  onToggleMute: (trackId: string) => void;
  onToggleSolo: (trackId: string) => void;
  onToggleArm: (trackId: string) => void;
  onOpenPianoRoll: () => void;
  onAddTrack: () => void;
  onOpenModal: (modal: ActiveModal) => void;
  isPlaying: boolean;
  currentStep: number;
}

export const Timeline: React.FC<TimelineProps> = ({
  tracks,
  activeTrackId,
  onSelectTrack,
  onToggleMute,
  onToggleSolo,
  onToggleArm,
  onOpenPianoRoll,
  onAddTrack,
  onOpenModal,
  isPlaying,
  currentStep,
}) => {
  const [workspaceMode, setWorkspaceMode] = useState<'arrange' | 'loops' | 'mixer' | 'atmos'>('arrange');

  // Playhead position percentage based on 64 total steps
  const playheadPercent = ((currentStep % 64) / 64) * 100;

  return (
    <div className="flex-1 flex flex-col bg-[#101217] overflow-hidden relative select-none">
      
      {/* Logic Pro 11 Multi-View Header Bar */}
      <div className="h-8 bg-[#1b1e26] border-b border-[#2c303c] flex items-center justify-between px-3 font-mono text-[10px] text-[#9ca3af] z-10 shrink-0">
        
        {/* Workspace Mode Tabs */}
        <div className="flex space-x-1">
          <button
            onClick={() => setWorkspaceMode('arrange')}
            className={`px-2.5 py-1 rounded-t border-t border-x text-[10px] font-bold flex items-center gap-1 transition ${
              workspaceMode === 'arrange'
                ? 'bg-[#101217] border-[#3b82f6] text-blue-400 shadow'
                : 'bg-[#14161f] border-transparent text-[#9ca3af] hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Arrangement</span>
          </button>

          <button
            onClick={() => setWorkspaceMode('loops')}
            className={`px-2.5 py-1 rounded-t border-t border-x text-[10px] font-bold flex items-center gap-1 transition ${
              workspaceMode === 'loops'
                ? 'bg-[#101217] border-[#a855f7] text-purple-400 shadow'
                : 'bg-[#14161f] border-transparent text-[#9ca3af] hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3 h-3" />
            <span>Live Loops Grid</span>
          </button>

          <button
            onClick={() => setWorkspaceMode('mixer')}
            className={`px-2.5 py-1 rounded-t border-t border-x text-[10px] font-bold flex items-center gap-1 transition ${
              workspaceMode === 'mixer'
                ? 'bg-[#101217] border-[#10b981] text-emerald-400 shadow'
                : 'bg-[#14161f] border-transparent text-[#9ca3af] hover:text-white'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Console Mixer</span>
          </button>

          <button
            onClick={() => onOpenModal('atmos')}
            className={`px-2.5 py-1 rounded-t border-t border-x text-[10px] font-bold flex items-center gap-1 transition ${
              workspaceMode === 'atmos'
                ? 'bg-[#101217] border-[#f59e0b] text-amber-400 shadow'
                : 'bg-[#14161f] border-transparent text-[#9ca3af] hover:text-white'
            }`}
          >
            <Tv className="w-3 h-3" />
            <span>3D Atmos Panner</span>
          </button>
        </div>

        {/* Header Right Status */}
        <div className="text-blue-400 flex items-center space-x-2">
          <Bot className="w-3.5 h-3.5 animate-pulse" />
          <span className="font-semibold hidden md:inline">Logic Pro 11 Suite • 50 AI Slots</span>
        </div>
      </div>

      {/* VIEW 1: Arrangement View */}
      {workspaceMode === 'arrange' && (
        <>
          {/* Timeline Ruler */}
          <div className="h-6 bg-[#151720] border-b border-[#2c303c] flex items-center px-4 font-mono text-[10px] text-[#9ca3af] justify-between z-10 shrink-0">
            <div className="flex space-x-12 pl-48">
              <span>1.1</span>
              <span>2.1</span>
              <span>3.1</span>
              <span>4.1</span>
              <span>5.1</span>
              <span>6.1</span>
              <span>7.1</span>
              <span>8.1</span>
            </div>
          </div>

          {/* Playhead Overlay */}
          <div 
            className="absolute top-14 bottom-9 w-[2px] bg-red-500 z-30 pointer-events-none transition-all duration-75 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            style={{ left: `calc(12rem + (100% - 12rem) * ${playheadPercent / 100})` }}
          >
            <div className="w-2.5 h-2.5 bg-red-500 rotate-45 -ml-[4px] -mt-[4px]"></div>
          </div>

          {/* Tracks Container */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#2c303c]">
            {tracks.map((track) => {
              const isActive = track.id === activeTrackId;

              return (
                <div
                  key={track.id}
                  onClick={() => onSelectTrack(track.id)}
                  className={`h-20 flex items-center px-3 transition relative group cursor-pointer ${
                    isActive ? 'bg-[#252a36]' : 'bg-[#1b1e26] hover:bg-[#20232b]'
                  }`}
                >
                  {/* Track Header Controls */}
                  <div className="w-48 pr-3 border-r border-[#2c303c] flex flex-col justify-center h-full shrink-0">
                    <div className="font-bold text-xs truncate flex items-center justify-between">
                      <span className={`${track.color} truncate font-semibold`}>{track.name}</span>
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-500 animate-pulse' : 'bg-[#2c303c]'}`}></span>
                    </div>

                    <div className="text-[10px] text-[#9ca3af] font-mono truncate mb-1">
                      {track.category}
                    </div>

                    {/* Track Quick Action Buttons */}
                    <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleMute(track.id)}
                        className={`px-1.5 py-0.5 text-[9px] rounded font-mono font-bold transition ${
                          track.muted ? 'bg-red-900 text-white' : 'bg-[#101217] text-[#9ca3af] hover:text-white'
                        }`}
                      >
                        M
                      </button>
                      <button
                        onClick={() => onToggleSolo(track.id)}
                        className={`px-1.5 py-0.5 text-[9px] rounded font-mono font-bold transition ${
                          track.solo ? 'bg-yellow-600 text-white' : 'bg-[#101217] text-[#9ca3af] hover:text-white'
                        }`}
                      >
                        S
                      </button>
                      <button
                        onClick={() => onToggleArm(track.id)}
                        className={`px-1.5 py-0.5 text-[9px] rounded font-mono font-bold transition ${
                          track.armed ? 'bg-red-600 text-white' : 'bg-[#101217] text-[#9ca3af] hover:text-white'
                        }`}
                      >
                        R
                      </button>

                      {isActive && (
                        <button
                          onClick={onOpenPianoRoll}
                          className="ml-auto px-1.5 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[9px] font-bold flex items-center gap-1 font-mono transition shadow"
                          title="Edit MIDI Notes"
                        >
                          <Edit3 className="w-2.5 h-2.5" />
                          <span>MIDI</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Clip Track Lane */}
                  <div className="flex-1 h-14 relative ml-3 bg-[#101217] rounded border border-[#2c303c]/80 overflow-hidden flex items-center px-2">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20">
                      <div className="border-r border-[#2c303c] w-1/4"></div>
                      <div className="border-r border-[#2c303c] w-1/4"></div>
                      <div className="border-r border-[#2c303c] w-1/4"></div>
                      <div className="border-r border-[#2c303c] w-1/4"></div>
                    </div>

                    {/* Render Audio Clip Blocks */}
                    {track.clips.map((clip) => (
                      <div
                        key={clip.id}
                        className="absolute top-1 bottom-1 rounded border flex items-center px-2 overflow-hidden shadow-sm transition hover:brightness-110"
                        style={{
                          left: `${(clip.startBar / 8) * 100}%`,
                          width: `${(clip.durationBars / 8) * 100}%`,
                          backgroundColor: clip.color + '25',
                          borderColor: clip.color,
                        }}
                      >
                        <span className="text-[10px] font-mono font-bold text-white truncate drop-shadow z-10">
                          {clip.name}
                        </span>

                        {/* Simulated Waveform Visual */}
                        <div className="absolute inset-x-2 inset-y-1 flex items-center justify-around opacity-40">
                          <div className="h-4 w-1 bg-white rounded-full"></div>
                          <div className="h-8 w-1 bg-white rounded-full"></div>
                          <div className="h-10 w-1 bg-white rounded-full"></div>
                          <div className="h-6 w-1 bg-white rounded-full"></div>
                          <div className="h-9 w-1 bg-white rounded-full"></div>
                          <div className="h-5 w-1 bg-white rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* VIEW 2: Live Loops Grid View */}
      {workspaceMode === 'loops' && (
        <div className="flex-1 p-4 bg-[#0d0e14] overflow-y-auto space-y-4 font-mono text-xs">
          <div className="flex justify-between items-center text-purple-400 font-bold border-b border-[#2c303c] pb-2">
            <span className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              LOGIC LIVE LOOPS LAUNCH MATRIX (4x4 CELLS)
            </span>
            <span className="text-emerald-400 text-[10px]">QUANTIZED SAMPLE LAUNCHER</span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {['Trap Beat A', 'Sub 808 Loop', 'Vocal Chop Lead', 'Cyber Synth Arp',
              'Lofi Vinyl Groove', 'Analog Brass Hit', 'Quantum FX Riser', 'Atmos Spatial Pad',
              'Future Bass Drop', 'Hi-Hat 16th Roll', 'Gemini AI Voice', 'Acid Bassline 303',
              'Chroma Snare Clap', 'Stutter Vox Chords', 'Ambient Shimmer', 'Impact Sub Bomb'].map((loopName, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (idx % 2 === 0) playDrum('kick');
                  else playNote(440 + idx * 20, 'sawtooth', 0.4, 0.25);
                }}
                className="h-24 bg-[#141722] hover:bg-[#202536] border border-[#2c303c] hover:border-purple-500 rounded-xl p-3 flex flex-col justify-between text-left transition shadow-md group relative overflow-hidden"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#9ca3af] group-hover:text-purple-300">CELL 0{idx + 1}</span>
                  <Play className="w-3.5 h-3.5 text-purple-400 opacity-60 group-hover:opacity-100" />
                </div>
                <div className="font-bold text-white group-hover:text-purple-200 text-xs truncate">
                  {loopName}
                </div>
                <div className="text-[9px] text-emerald-400 font-bold">128 BPM • 4 Bars</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Track Controls & Add Track */}
      <div className="h-9 bg-[#1b1e26] border-t border-[#2c303c] px-4 flex justify-between items-center text-xs shrink-0">
        <button
          onClick={onAddTrack}
          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold font-mono flex items-center gap-1 transition shadow"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New AI Track</span>
        </button>

        <div className="text-[10px] text-[#9ca3af] font-mono flex items-center space-x-3">
          <span>Active Track: <strong className="text-blue-400">{tracks.find(t => t.id === activeTrackId)?.name}</strong></span>
          <span>•</span>
          <button 
            onClick={onOpenPianoRoll}
            className="text-amber-400 hover:underline font-semibold flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" />
            <span>Open Piano Roll Sequencer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
