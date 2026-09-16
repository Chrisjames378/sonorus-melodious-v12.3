import React, { useEffect, useRef } from 'react';
import { getAnalyser } from '../lib/audioEngine';

interface OscilloscopeProps {
  isPlaying: boolean;
}

export const Oscilloscope: React.FC<OscilloscopeProps> = ({ isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

      const analyser = getAnalyser();

      if (analyser && isPlaying) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#60a5fa'; // neon blue waveform line
        ctx.shadowColor = '#3b82f6';
        ctx.shadowBlur = 6;
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
      } else {
        // Subtle ambient idle sine wave when transport is paused
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#2c303c';
        ctx.beginPath();
        const now = Date.now() / 300;
        for (let x = 0; x < width; x += 2) {
          const y = height / 2 + Math.sin(x / 12 + now) * (isPlaying ? 8 : 2);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  return (
    <div className="w-36 h-7 bg-[#101217] rounded border border-[#2c303c] overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
      <canvas ref={canvasRef} width={144} height={28} className="w-full h-full" />
    </div>
  );
};
