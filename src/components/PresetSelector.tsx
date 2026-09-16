import React from 'react';
import { Disc, Sparkles } from 'lucide-react';
import { SOUND_PRESETS, SoundPreset } from '../lib/audioEngine';

interface PresetSelectorProps {
  currentPresetId: string;
  onSelectPreset: (preset: SoundPreset) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentPresetId,
  onSelectPreset,
}) => {
  return (
    <div className="bg-[#12141a] p-3 rounded-lg border border-[#2c303c] space-y-2 select-none">
      <div className="flex justify-between items-center text-[10px] font-mono">
        <span className="font-semibold text-emerald-400 flex items-center gap-1">
          <Disc className="w-3.5 h-3.5" />
          Studio Sound Bank Presets
        </span>
        <span className="text-[#9ca3af]">5 Style Kits</span>
      </div>

      <div className="grid grid-cols-1 gap-1.5 font-mono text-[10px]">
        {SOUND_PRESETS.map((preset) => {
          const isSelected = preset.id === currentPresetId;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`w-full p-2 rounded border text-left flex justify-between items-center transition ${
                isSelected
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow'
                  : 'bg-[#101217] border-[#2c303c] text-[#d1d5db] hover:bg-[#20232b]'
              }`}
            >
              <div className="truncate">
                <div className="font-bold truncate">{preset.name}</div>
                <div className="text-[9px] text-[#9ca3af] truncate">{preset.genre} • {preset.bpm} BPM</div>
              </div>
              {isSelected && <Sparkles className="w-3 h-3 text-emerald-400 shrink-0 ml-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
