import React from 'react';
import { DollarSign, X, TrendingUp, Award, Zap, ShieldCheck } from 'lucide-react';

interface ValuationModalProps {
  onClose: () => void;
}

export const ValuationModal: React.FC<ValuationModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4 select-none">
      <div className="w-[720px] max-w-full bg-[#1b1e26] border border-amber-500 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#101217] px-4 py-3 border-b border-[#2c303c] flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm text-white font-mono">
              BUSINESS VALUATION & MONETIZATION MASTER ANALYSIS
            </span>
          </div>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 bg-[#12141a] text-xs max-h-[75vh] overflow-y-auto">
          {/* Seed IP Valuation */}
          <div className="bg-[#101217] p-3.5 rounded-lg border border-[#2c303c] space-y-2">
            <div className="font-semibold text-amber-400 text-sm flex items-center gap-1.5 font-mono">
              <TrendingUp className="w-4 h-4" />
              Asset & IP Valuation (Seed / Pre-Revenue)
            </div>
            <p className="text-[#d1d5db] text-xs leading-relaxed">
              Valued at <strong class="text-emerald-400 font-mono text-sm">$15,000 to $40,000 USD</strong> for the containerized zero-install single-file browser DAW architecture uniting Logic, Acoustica, Reason, and 50 AI modules.
            </p>
          </div>

          {/* ARR Multiplier Valuation */}
          <div className="bg-[#101217] p-3.5 rounded-lg border border-[#2c303c] space-y-2">
            <div className="font-semibold text-blue-400 text-sm flex items-center gap-1.5 font-mono">
              <Zap className="w-4 h-4" />
              SaaS ARR Multiplier Valuation ($9.99/mo Cloud Pass)
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-[#12141a] p-3 rounded border border-[#2c303c]">
                <div className="text-[#9ca3af] text-[10px] font-mono">500 Subscribers ($60k ARR)</div>
                <div className="text-blue-400 font-bold font-mono text-base mt-1">$240K - $480K</div>
              </div>
              <div className="bg-[#12141a] p-3 rounded border border-[#2c303c]">
                <div className="text-[#9ca3af] text-[10px] font-mono">2,000 Subscribers ($240k ARR)</div>
                <div className="text-emerald-400 font-bold font-mono text-base mt-1">$960K - $1.92M</div>
              </div>
            </div>
          </div>

          {/* Powerhouse Feature Integration Roadmap */}
          <div className="bg-[#101217] p-3.5 rounded-lg border border-[#2c303c] space-y-2">
            <div className="font-semibold text-purple-400 text-sm flex items-center gap-1.5 font-mono">
              <Award className="w-4 h-4" />
              Top 5 Powerhouse Roadmap Integration
            </div>
            <div className="text-[11px] text-[#9ca3af] space-y-1.5 leading-relaxed font-mono">
              <div>1. Real-Time Collaborative Cloud Jam Room & MIDI Session Share (WebRTC P2P)</div>
              <div>2. AI-Powered Mastering & Distribution Delivery Check (LUFS Compliance)</div>
              <div>3. Reason-Style Modular Virtual Cable Patch Bay (CV/Audio Routing)</div>
              <div>4. Hardware MIDI Controller & OSC Mapping Matrix (Persistent MIDI Learn)</div>
              <div>5. Smart Chord Progression & Voice-Leading AI Generator (Prompt Studio)</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#101217] px-4 py-3 border-t border-[#2c303c] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded text-xs transition shadow"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
