import React from 'react';
import { 
  AlertTriangle, 
  X, 
  RotateCw, 
  CheckCircle2, 
  Clock, 
  Server, 
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WhyIsItStuckModal({ 
  isOpen, 
  onClose, 
  diagnosis, 
  onSimulateRecovery,
  isRecovering = false 
}) {
  if (!isOpen || !diagnosis) return null;

  const handleRecover = async () => {
    await onSimulateRecovery();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white border border-slate-300 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-amber-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                WHY IS MY APPLICATION STUCK? (SECTION 20)
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Live workflow dependency inspection across ministerial gateways
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Main Status Block */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 font-mono">Current Application Stage</span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {diagnosis.current_step || "Income Verification"}
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                ● SERVICE TEMPORARILY UNAVAILABLE
              </span>
            </div>

            {/* Diagnostic Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-500 font-bold uppercase text-[10px] block">Waiting For Department API</span>
                <div className="text-slate-800 font-semibold mt-1">
                  {diagnosis.dependency || "Income Department API (Revenue Gateway)"}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-500 font-bold uppercase text-[10px] block">GovBridge Action</span>
                <div className="text-blue-700 font-bold mt-1">
                  Request Queued • Automatic Retry Active
                </div>
              </div>
            </div>

            {/* Actual Root Cause (Section 20: Do NOT create fake explanations) */}
            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-1">
              <strong className="block text-[11px] uppercase font-bold text-amber-900">
                Actual Workflow Dependency Status:
              </strong>
              <p className="leading-relaxed">
                {diagnosis.reason || "Income Verification API is temporarily unavailable (504 Gateway Timeout on legacy endpoint). GovBridge has queued the request with automated retry policy."}
              </p>
            </div>
          </div>

          {/* Interactive Recovery Action Box */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-emerald-950 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Simulate Service Recovery (SIH Demo)</span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Restore the mock Income API to HEALTHY. GovBridge will resume the workflow immediately.
              </p>
            </div>

            <button
              onClick={handleRecover}
              disabled={isRecovering}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition flex items-center justify-center space-x-2 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRecovering ? 'animate-spin' : ''}`} />
              <span>{isRecovering ? 'Restoring...' : 'Simulate Recovery'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
