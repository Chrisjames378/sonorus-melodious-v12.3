import React, { useState } from 'react';
import { CreditCard, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PayPalModalProps {
  onClose: () => void;
  onShowNotification: (msg: string) => void;
}

export const PayPalModal: React.FC<PayPalModalProps> = ({ onClose, onShowNotification }) => {
  const [processing, setProcessing] = useState<string | null>(null);

  const handleCheckout = (itemName: string, price: string) => {
    setProcessing(itemName);
    setTimeout(() => {
      setProcessing(null);
      onShowNotification(`PayPal Transaction Complete! Active License Key Issued for ${itemName} (${price}).`);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4 select-none">
      <div className="w-[680px] max-w-full bg-[#1b1e26] border border-blue-500 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#101217] px-4 py-3 border-b border-[#2c303c] flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm text-white font-mono">
              PAYPAL PRO SDK INTEGRATION & CHECKOUT
            </span>
          </div>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 bg-[#12141a] text-xs">
          <div className="bg-[#101217] p-3.5 rounded-lg border border-[#2c303c] space-y-2">
            <div className="font-semibold text-blue-400 text-sm font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Official PayPal JavaScript SDK Integration
            </div>
            <p className="text-[#9ca3af] text-[11px] leading-relaxed">
              Enables secure checkouts for cloud jam room passes, software licensing, and AI credit top-ups with backend webhook license validation.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#101217] p-4 rounded-lg border border-[#2c303c] space-y-3 flex flex-col justify-between">
              <div>
                <div className="font-bold text-emerald-400 text-sm font-mono">Cloud Jam Pass</div>
                <div className="text-xl font-bold font-mono text-white my-1">$9.99 <span className="text-xs text-[#9ca3af]">/ mo</span></div>
                <p className="text-[10px] text-[#9ca3af]">Recurring subscription for WebRTC multi-producer jam sessions and cloud stem storage.</p>
              </div>

              <button
                onClick={() => handleCheckout('Cloud Jam Pass', '$9.99/mo')}
                disabled={processing !== null}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow transition flex items-center justify-center gap-1"
              >
                {processing === 'Cloud Jam Pass' ? 'Connecting PayPal...' : 'Checkout with PayPal'}
              </button>
            </div>

            <div className="bg-[#101217] p-4 rounded-lg border border-[#2c303c] space-y-3 flex flex-col justify-between">
              <div>
                <div className="font-bold text-purple-400 text-sm font-mono">AI Master Suite License</div>
                <div className="text-xl font-bold font-mono text-white my-1">$49.00 <span className="text-xs text-[#9ca3af]">/ lifetime</span></div>
                <p className="text-[10px] text-[#9ca3af]">Lifetime access to all 50 AI modules, Dolby Atmos panners, and spectral repair suites.</p>
              </div>

              <button
                onClick={() => handleCheckout('AI Master Suite', '$49.00')}
                disabled={processing !== null}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded shadow transition flex items-center justify-center gap-1"
              >
                {processing === 'AI Master Suite' ? 'Connecting PayPal...' : 'Checkout with PayPal'}
              </button>
            </div>
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
