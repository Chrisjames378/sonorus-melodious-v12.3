import React from 'react';
import { Track } from '../types';
import { Sliders, Volume2, Award } from 'lucide-react';

interface MixerProps {
  tracks: Track[];
  isPlaying: boolean;
  onVolumeChange: (trackId: string, value: number) => void;
  onToggleMute: (trackId: string) => void;
  onToggleSolo: (trackId: string) => void;
}

export const Mixer: React.FC<MixerProps> = ({
  tracks,
  isPlaying,
  onVolumeChange,
  onToggleMute,
  onToggleSolo,
}) => {
  return (
    <div className="h-44 bg-[#1b1e26] border-t border-[#2c303c] flex flex-col shrink-0 select-none">
      {/* Console Header */}
      <div className="h-6 bg-[#101217] border-b border-[#2c303c] px-4 flex justify-between items-center text-[10px] font-bold text-[#9ca3af] font-mono">
        <span className="flex items-center gap-1.5 text-blue-400">
          <Sliders className="w-3 h-3" />
          MULTIPLIER MIXER & 50 AI CHANNELS
        </span>
        <span className="text-purple-400 flex items-center gap-1">
          <Award className="w-3 h-3" />
          MASTER OUTPUT: -0.1 dB (Compliance Pass)
        </span>
      </div>

      {/* Channel Strips Container */}
      <div className="flex-1 flex overflow-x-auto divide-x divide-[#2c303c] p-2 space-x-2">
        {tracks.map((track) => {
          // Dynamic calculated simulated meter level
          const meterHeight = isPlaying && !track.muted
            ? Math.min(100, Math.max(15, (track.volume * 0.8) + (Math.sin(Date.now() / 100) * 20)))
            : 0;

          return (
            <div
              key={track.id}
              className="w-24 bg-[#12141a] rounded p-1.5 flex flex-col items-center justify-between shrink-0 border border-[#2c303c]/60"
            >
              {/* Track Name */}
              <div className={`text-[9px] font-bold truncate w-full text-center ${track.color}`}>
                {track.name}
              </div>

              {/* Meter Box */}
              <div className="w-full bg-[#101217] h-14 rounded relative flex justify-center items-center border border-[#2c303c]">
                <div className="w-1.5 h-11 bg-[#2c303c] rounded-full relative overflow-hidden flex flex-col justify-end">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 via-emerald-400 to-amber-400 transition-all duration-75 rounded-full"
                    style={{ height: `${meterHeight}%` }}
                  ></div>
                </div>
              </div>

              {/* Volume Fader */}
              <input
                type="range"
                min="0"
                max="100"
                value={track.volume}
                onChange={(e) => onVolumeChange(track.id, Number(e.target.value))}
                className="w-full accent-blue-500 my-0.5 h-1 cursor-pointer"
              />

              {/* Mute/Solo Toggles & dB readout */}
              <div className="flex items-center justify-between w-full text-[8px] font-mono text-[#9ca3af]">
                <button
                  onClick={() => onToggleMute(track.id)}
                  className={`px-1 py-0.2 rounded font-bold ${
                    track.muted ? 'bg-red-600 text-white' : 'hover:text-white'
                  }`}
                >
                  M
                </button>
                <span className="text-[8px] font-mono text-[#9ca3af]">
                  {track.muted ? 'Muted' : `-${((100 - track.volume) * 0.2).toFixed(1)}dB`}
                </span>
                <button
                  onClick={() => onToggleSolo(track.id)}
                  className={`px-1 py-0.2 rounded font-bold ${
                    track.solo ? 'bg-yellow-600 text-white' : 'hover:text-white'
                  }`}
                >
                  S
                </button>
              </div>
            </div>
          );
        })}

        {/* Master Output Channel Strip */}
        <div className="w-28 bg-[#101217] border border-blue-500/40 rounded p-1.5 flex flex-col items-center justify-between shrink-0 ml-auto shadow-md">
          <div className="text-[9px] font-bold text-amber-400 truncate w-full text-center font-mono">
            MASTER AI
          </div>

          <div className="w-full bg-[#12141a] h-14 rounded relative flex justify-center items-center space-x-1.5 border border-[#2c303c]">
            <div className="w-1.5 h-11 bg-[#2c303c] rounded-full relative overflow-hidden flex flex-col justify-end">
              <div
                className="w-full bg-gradient-to-t from-blue-500 via-emerald-400 to-amber-400 transition-all duration-75"
                style={{ height: isPlaying ? '82%' : '0%' }}
              ></div>
            </div>
            <div className="w-1.5 h-11 bg-[#2c303c] rounded-full relative overflow-hidden flex flex-col justify-end">
              <div
                className="w-full bg-gradient-to-t from-blue-500 via-emerald-400 to-amber-400 transition-all duration-75"
                style={{ height: isPlaying ? '80%' : '0%' }}
              ></div>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            defaultValue="90"
            className="w-full accent-amber-500 my-0.5 h-1 cursor-pointer"
          />

          <div className="text-[8px] font-mono text-amber-400 font-bold">
            -0.1 dB (LUFS -14)
          </div>
        </div>
      </div>
    </div>
  );
};
