import { apiFetch } from '../api';
import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  ArrowRight,
  Info
} from 'lucide-react';

export default function ConsentWalletView({ currentCitizen }) {
  const [consents, setConsents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchConsents();
  }, [currentCitizen]);

  const fetchConsents = async () => {
    try {
      const res = await apiFetch('/api/consent');
      const data = await res.json();
      setConsents(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAction = async (consentId, action) => {
    setIsLoading(true);
    try {
      await apiFetch('/api/consent/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent_id: consentId, action })
      });
      await fetchConsents();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-bold tracking-wider text-blue-700 uppercase font-mono mb-1">
            CONSENT MANAGEMENT (SECTION 15)
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            MY CONSENTS
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Complete transparency into which government departments have requested access to your data, why it is needed, and full citizen control to revoke permissions anytime.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center space-x-1.5 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>DPDP Act 2023 Compliant</span>
        </span>
      </div>

      {/* Statutory Flow (Section 15): REQUEST -> EXPLANATION -> CITIZEN CONSENT -> MINIMUM REQUIRED DATA -> TRANSFER -> AUDIT */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Statutory Data Sharing Flow (Section 15)
        </span>
        <div className="overflow-x-auto pb-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 min-w-[720px]">
            <div className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-800">1. REQUEST</div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-800">2. EXPLANATION</div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">3. CITIZEN CONSENT</div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div className="px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">4. MINIMUM REQUIRED DATA</div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-800">5. TRANSFER</div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div className="px-3 py-1.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">6. AUDIT</div>
          </div>
        </div>
      </div>

      {/* Consents List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Active & Historical Consents
        </h2>

        <div className="space-y-4">
          {consents.map((consent) => {
            const isActive = consent.status === 'active';
            const isRevoked = consent.status === 'revoked';

            return (
              <div
                key={consent.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-semibold text-blue-700">
                      Requested by: <strong className="text-slate-800">{consent.requested_by}</strong>
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      {consent.service_name}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                    isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    ● {consent.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Data Needed */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                      Information Being Shared:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {consent.data_needed.map((item, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800 font-semibold shadow-2xs">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Purpose & Legal Basis */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                      Specific Purpose:
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {consent.purpose}
                    </p>
                    <div className="text-[11px] text-emerald-700 font-medium pt-1">
                      Legal Basis: {consent.legal_basis}
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Allow / Revoke */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    Duration: <strong className="text-slate-700">{consent.duration}</strong>
                  </span>

                  <div className="flex items-center space-x-2">
                    {isActive ? (
                      <button
                        onClick={() => handleAction(consent.id, 'revoke')}
                        disabled={isLoading}
                        className="px-4 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold transition cursor-pointer"
                      >
                        Revoke Consent
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction(consent.id, 'approve')}
                        disabled={isLoading}
                        className="px-4 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold transition cursor-pointer"
                      >
                        Allow Consent
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
