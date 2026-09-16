import React, { useState } from 'react';
import { Bot, X, Play, Zap, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';
import { playNote } from '../../lib/audioEngine';

interface AiModuleModalProps {
  moduleId: number;
  onClose: () => void;
  onShowNotification: (msg: string) => void;
}

export const AiModuleModal: React.FC<AiModuleModalProps> = ({
  moduleId,
  onClose,
  onShowNotification,
}) => {
  const [isRunning, setIsRunning] = useState(false);

  // Determine category & style based on module ID
  let cat = "Gemini 3 Flash AI";
  let color = "text-blue-400 border-blue-500";
  let btnColor = "bg-blue-600 hover:bg-blue-500";

  if (moduleId > 10 && moduleId <= 20) {
    cat = "Acon Acoustica 8 Audio Engine";
    color = "text-purple-400 border-purple-500";
    btnColor = "bg-purple-600 hover:bg-purple-500";
  } else if (moduleId > 20 && moduleId <= 32) {
    cat = "Logic Pro 12.3 Smart Engine";
    color = "text-emerald-400 border-emerald-500";
    btnColor = "bg-emerald-600 hover:bg-emerald-500";
  } else if (moduleId > 32 && moduleId <= 40) {
    cat = "Reason 14 Modular DSP Rack";
    color = "text-red-400 border-red-500";
    btnColor = "bg-red-600 hover:bg-red-500";
  } else if (moduleId > 40) {
    cat = "Dolby Atmos Immersive 3D Panner";
    color = "text-teal-400 border-teal-500";
    btnColor = "bg-teal-600 hover:bg-teal-500";
  }

  const handleTestAudio = () => {
    playNote(300 + moduleId * 15, 'sawtooth', 0.4, 0.25);
  };

  const handleExecuteTask = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      onShowNotification(`AI Module #${moduleId} (${cat}) successfully executed DSP task with neural precision.`);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4 select-none">
      <div className={`w-[640px] max-w-full bg-[#1b1e26] border rounded-xl shadow-2xl flex flex-col overflow-hidden ${color.split(' ')[1]}`}>
        {/* Header */}
        <div className="bg-[#101217] px-4 py-3 border-b border-[#2c303c] flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bot className={`w-5 h-5 ${color.split(' ')[0]}`} />
            <span className="font-bold text-sm text-white font-mono">
              [AI MODULE #{moduleId}] POWERHOUSE DSP ENGINE
            </span>
          </div>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 bg-[#12141a] text-xs">
          <div className="flex justify-between items-center bg-[#101217] p-3.5 rounded-lg border border-[#2c303c]">
            <div>
              <span className={`font-bold font-mono text-sm ${color.split(' ')[0]}`}>{cat}</span>
              <div className="text-[11px] text-[#9ca3af] mt-1 font-mono">
                Advanced neural audio processing unit #{moduleId} optimized for high-performance studio workflows.
              </div>
            </div>
            <button
              onClick={handleTestAudio}
              className={`px-3.5 py-2 text-white font-bold rounded shadow transition shrink-0 ml-2 ${btnColor}`}
            >
              Test AI Audio
            </button>
          </div>

          <div className="bg-[#101217] p-3.5 rounded-lg border border-[#2c303c] space-y-2">
            <div className="flex justify-between items-center font-mono">
              <span className="font-semibold text-[#9ca3af]">Neural DSP Status</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ONLINE (Gemini 3 Flash Ready)
              </span>
            </div>

            <div className="h-10 bg-[#12141a] rounded border border-[#2c303c] relative flex items-center px-3 overflow-hidden">
              <div className={`w-full h-2 rounded animate-pulse ${isRunning ? 'bg-amber-400' : 'bg-blue-500'}`}></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#101217] px-4 py-3 border-t border-[#2c303c] flex justify-end space-x-2">
          <button
            onClick={handleExecuteTask}
            disabled={isRunning}
            className={`px-4 py-1.5 text-white font-bold rounded text-xs shadow transition flex items-center gap-1.5 ${btnColor}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRunning ? 'Processing Neural Weights...' : 'Execute AI Task'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2c303c] hover:bg-[#9ca3af] hover:text-black text-white font-bold rounded text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
