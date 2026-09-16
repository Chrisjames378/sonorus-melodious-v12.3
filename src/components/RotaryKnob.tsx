import React, { useState, useRef } from 'react';

interface RotaryKnobProps {
  label: string;
  value: number; // min to max
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  color?: string; // e.g. '#3b82f6'
  onChange: (val: number) => void;
}

export const RotaryKnob: React.FC<RotaryKnobProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  color = '#3b82f6',
  onChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startValRef = useRef(value);

  // Angle from -135deg to +135deg (270deg range)
  const pct = (value - min) / (max - min);
  const angle = -135 + pct * 270;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startYRef.current = e.clientY;
    startValRef.current = value;

    const handlePointerMove = (me: PointerEvent) => {
      const deltaY = startYRef.current - me.clientY; // Up increases
      const range = max - min;
      const stepVal = (deltaY / 120) * range;
      let newVal = Math.min(max, Math.max(min, startValRef.current + stepVal));
      if (step >= 1) newVal = Math.round(newVal);
      else newVal = Number(newVal.toFixed(1));
      onChange(newVal);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <div className="flex flex-col items-center select-none font-mono group">
      {/* Knob Dial Body */}
      <div
        onPointerDown={handlePointerDown}
        className="w-12 h-12 rounded-full relative cursor-ns-resize flex items-center justify-center border-2 border-[#3a3f50] bg-gradient-to-b from-[#2a2d38] to-[#12141a] shadow-lg group-hover:border-[#60a5fa] transition-colors"
      >
        {/* Arc Track Indicator */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="18"
            fill="none"
            stroke="#20232d"
            strokeWidth="3"
          />
          <circle
            cx="24"
            cy="24"
            r="18"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={113}
            strokeDashoffset={113 - pct * 85}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Metallic Cap */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3c4152] via-[#242732] to-[#14161f] border border-[#4d5366] shadow-md flex items-center justify-center relative">
          {/* Indicator Dot / Line */}
          <div
            className="w-0.5 h-3 bg-white rounded-full absolute top-1 shadow-[0_0_4px_rgba(255,255,255,0.8)]"
            style={{ transform: `rotate(${angle}deg)`, transformOrigin: '50% 12px' }}
          ></div>
        </div>
      </div>

      {/* Label and Value readout */}
      <span className="text-[9px] font-bold text-[#9ca3af] uppercase tracking-wider mt-1 group-hover:text-white transition">
        {label}
      </span>
      <span className="text-[10px] font-semibold text-white font-mono">
        {value}{unit}
      </span>
    </div>
  );
};
