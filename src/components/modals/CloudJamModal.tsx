import React from 'react';
import { Users, X, Radio, Copy, Wifi } from 'lucide-react';

interface CloudJamModalProps {
  onClose: () => void;
  onShowNotification: (msg: string) => void;
}

export const CloudJamModal: React.FC<CloudJamModalProps> = ({ onClose, onShowNotification }) => {
  const handleCopyLink = () => {
    const link = 'https://sonorusmelodious.live/jam/session-9982';
    navigator.clipboard.writeText(link).then(() => {
      onShowNotification('Secure WebRTC session link copied to clipboard!');
    }).catch(() => {
      onShowNotification('Session link copied: ' + link);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4 select-none">
      <div className="w-[600px] max-w-full bg-[#1b1e26] border border-blue-500 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#101217] px-4 py-3 border-b border-[#2c303c] flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm text-white font-mono">
              1. REAL-TIME CLOUD JAM ROOM & MIDI SHARE
            </span>
          </div>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 bg-[#12141a] text-xs">
          <div className="bg-[#101217] p-3.5 rounded-lg border border-[#2c303c] space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-400 font-mono text-xs flex items-center gap-1.5">
                <Wifi className="w-4 h-4 text-emerald-400" />
                WebRTC P2P Session Status: Connected
              </span>
              <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                Latency: 14ms
              </span>
            </div>
            <p className="text-[11px] text-[#9ca3af] leading-relaxed">
              Invite producers anywhere in the world to join your timeline, send live MIDI notes, and adjust mixer faders collaboratively.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-[#9ca3af] font-semibold font-mono text-[11px]">
              Active Session Participants:
            </div>

            <div className="bg-[#101217] p-3 rounded-lg border border-[#2c303c] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="font-medium text-white font-mono">Alex (Producer - Berlin, DE)</span>
              </div>
              <span className="text-[10px] text-[#9ca3af] font-mono">MIDI Ch. 1 • Fader: 0.0dB</span>
            </div>

            <div className="bg-[#101217] p-3 rounded-lg border border-[#2c303c] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="font-medium text-white font-mono">Elena (Sound Designer - Tokyo, JP)</span>
              </div>
              <span className="text-[10px] text-[#9ca3af] font-mono">MIDI Ch. 2 • Fader: -2.1dB</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow transition flex items-center justify-center gap-1.5"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Secure Share Link</span>
            </button>

            <button
              onClick={() => onShowNotification('Broadcasting live MIDI note stream to all peers...')}
              className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded shadow transition flex items-center justify-center gap-1.5"
            >
              <Radio className="w-4 h-4" />
              <span>Test MIDI Stream Broadcast</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#101217] px-4 py-3 border-t border-[#2c303c] flex justify-end">
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
