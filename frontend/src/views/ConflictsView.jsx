import { apiFetch } from '../api';
import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Check, 
  Clock, 
  UserCheck,
  Building2,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ConflictsView({ currentCitizen }) {
  const [conflicts, setConflicts] = useState([]);
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    fetchConflicts();
  }, [currentCitizen]);

  const fetchConflicts = async () => {
    try {
      const res = await apiFetch('/api/conflicts');
      const data = await res.json();
      setConflicts(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolve = async (conflictId, source) => {
    setIsResolving(true);
    try {
      await apiFetch('/api/conflicts/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conflict_id: conflictId,
          resolved_source: source,
          reviewer_note: "Verified by Authorized Officer after cross-referencing official gazette registry."
        })
      });
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      await fetchConflicts();
    } catch (e) {
      console.error(e);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-bold tracking-wider text-red-700 uppercase font-mono mb-1">
            DATA INTEGRITY & CONFLICT RESOLUTION (SECTIONS 31, 52)
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            DATA CONFLICT DETECTED
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            When connected government systems contain conflicting citizen facts, GovBridge refuses to automatically overwrite data. Manual verification is enforced.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-lg bg-red-50 text-red-800 border border-red-200 text-xs font-semibold flex items-center space-x-1.5">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span>Non-Silent Conflict Policy Active</span>
        </span>
      </div>

      {/* Conflict Cards (Section 31, 52) */}
      <div className="space-y-4">
        {conflicts.map((conf) => {
          const isResolved = conf.status === "resolved";

          return (
            <div
              key={conf.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${
                isResolved
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : 'border-red-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                    isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isResolved ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                      <span>Conflicting Field: {conf.field_name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isResolved ? 'RESOLVED' : 'MANUAL REVIEW REQUIRED'}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 font-mono">
                      Citizen: {conf.citizen_name} ({conf.citizen_id})
                    </p>
                  </div>
                </div>

                <span className="text-xs text-slate-500 font-mono">
                  Detected at: {new Date(conf.detected_at).toLocaleTimeString()}
                </span>
              </div>

              {/* Side-by-Side Comparison (Section 31, 52) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Source A */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-700 uppercase font-mono">SOURCE A (IDENTITY MASTER)</span>
                    <span className="text-slate-500 text-[10px]">{conf.source_a?.confidence}</span>
                  </div>
                  <div className="text-xs text-slate-600">
                    System: <strong className="text-slate-800">{conf.source_a?.system}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xl font-bold font-mono text-slate-900">
                    DOB = {conf.source_a?.value}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Timestamp: {new Date(conf.source_a?.timestamp).toLocaleDateString()}
                  </div>

                  {!isResolved && (
                    <button
                      onClick={() => handleResolve(conf.id, conf.source_a?.system)}
                      disabled={isResolving}
                      className="w-full py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                    >
                      Authorize Source A ({conf.source_a?.value})
                    </button>
                  )}
                </div>

                {/* Source B */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-700 uppercase font-mono">SOURCE B (EDUCATION REPOSITORY)</span>
                    <span className="text-slate-500 text-[10px]">{conf.source_b?.confidence}</span>
                  </div>
                  <div className="text-xs text-slate-600">
                    System: <strong className="text-slate-800">{conf.source_b?.system}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xl font-bold font-mono text-slate-900">
                    DOB = {conf.source_b?.value}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Timestamp: {new Date(conf.source_b?.timestamp).toLocaleDateString()}
                  </div>

                  {!isResolved && (
                    <button
                      onClick={() => handleResolve(conf.id, conf.source_b?.system)}
                      disabled={isResolving}
                      className="w-full py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                    >
                      Authorize Source B ({conf.source_b?.value})
                    </button>
                  )}
                </div>
              </div>

              {/* Policy note */}
              <div className="mt-5 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <strong className="text-slate-800">GovBridge Data Policy: </strong>
                {conf.action_required}
              </div>

              {isResolved && (
                <div className="mt-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Conflict resolved by officer. Authoritative source chosen: <strong>{conf.resolved_source}</strong>. Audit logged in Immutable Ledger.
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
