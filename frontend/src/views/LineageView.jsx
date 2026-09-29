import { apiFetch } from '../api';
import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Database,
  Building2
} from 'lucide-react';

export default function LineageView() {
  const [lineages, setLineages] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    fetchLineages();
  }, []);

  const fetchLineages = async () => {
    try {
      const res = await apiFetch('/api/lineage');
      const data = await res.json();
      setLineages(data);
    } catch (e) {
      console.error(e);
    }
  };

  const activeLineage = lineages[selectedIdx] || lineages[0];

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-bold tracking-wider text-blue-700 uppercase font-mono mb-1">
            DATA PROVENANCE & LINEAGE (SECTION 32)
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            WHERE DID THIS DATA COME FROM?
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Trace the complete end-to-end journey of verified citizen attributes: from originating department databases to final scheme authorization.
          </p>
        </div>

        {/* Attribute Selector */}
        <div className="flex items-center space-x-2">
          {lineages.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedIdx === idx
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {activeLineage && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-blue-700 font-mono">
                Canonical Field: {activeLineage.canonical_field}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {activeLineage.label}: <strong className="text-emerald-700 font-mono">{activeLineage.current_value}</strong>
              </h2>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Audit Token: {activeLineage.audit_id}
            </div>
          </div>

          {/* Stepper Pipeline (Section 32): Source -> Department API -> GovBridge -> Scholarship Workflow -> Verification */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Data Lineage Provenance Pipeline (Section 32)
            </span>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {activeLineage.nodes.map((node, i) => (
                <div
                  key={node.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-500 mb-1">
                      <span>Step {i + 1}</span>
                      <span className="text-emerald-700">✓ {node.status}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {node.label}
                    </h4>
                    <p className="text-[11px] text-slate-600 font-mono mt-1 leading-snug">
                      {node.sub}
                    </p>
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono uppercase pt-2 border-t border-slate-200/80">
                    Type: {node.type}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
            <strong>Provenance Security Guarantee:</strong>
            <p className="text-slate-600">
              Data retrieved via authenticated departmental APIs, checked against DPDP consent parameters, normalized through GovBridge canonical schemas, and verified for scheme eligibility.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
