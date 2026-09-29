import { apiFetch } from '../api';
import React, { useState, useEffect } from 'react';
import { 
  PlugZap, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Check, 
  Layers, 
  FileCode, 
  ArrowRight,
  Server,
  Building2,
  Lock,
  Clock,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ONBOARDING_PIPELINE = [
  "DISCOVER",
  "CONFIGURE",
  "SCHEMA MAP",
  "AUTHENTICATE",
  "SANDBOX TEST",
  "VALIDATE",
  "APPROVE",
  "ACTIVATE"
];

export default function IntegrationsView({ initialSubTab = 'hub' }) {
  const [integrations, setIntegrations] = useState([]);
  const [schemaMappings, setSchemaMappings] = useState([]);
  const [schemaAlerts, setSchemaAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState(initialSubTab);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [intRes, mapRes, alertRes] = await Promise.all([
        apiFetch('/api/integrations'),
        apiFetch('/api/schema/mappings'),
        apiFetch('/api/schema/alerts')
      ]);
      setIntegrations(await intRes.json());
      setSchemaMappings(await mapRes.json());
      setSchemaAlerts(await alertRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveMapping = async (mappingId) => {
    setIsApproving(true);
    try {
      await apiFetch('/api/schema/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mapping_id: mappingId, approved_by: 'Interoperability_Administrator' })
      });
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsApproving(false);
    }
  };

  const pendingAlert = schemaAlerts.find(a => a.status === 'detected') || schemaAlerts[0];
  const pendingMapping = schemaMappings.find(m => m.external_field === 'student_full_name');

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-bold tracking-wider text-blue-700 uppercase font-mono mb-1">
            GOVERNMENT INTEGRATION HUB & API GATEWAY (SECTIONS 21–24, 30, 34, 51)
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            INTEGRATION HUB
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Central interoperability layer managing ministerial APIs, canonical data models, AI schema discovery, and schema drift detection.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center space-x-1 p-1 bg-slate-100 border border-slate-200 rounded-xl">
          <button
            onClick={() => setActiveTab('hub')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'hub' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Connected Systems ({integrations.length})
          </button>
          <button
            onClick={() => setActiveTab('schema-mapping')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'schema-mapping' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Schema Discovery & Drift</span>
            {pendingAlert?.status === 'detected' && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* SCHEMA CHANGE DETECTION DEMO CARD (Sections 30, 51) */}
      {pendingAlert && (
        <div className={`p-6 rounded-2xl border transition-all ${
          pendingAlert.status === 'resolved'
            ? 'bg-emerald-50/70 border-emerald-300'
            : 'bg-white border-2 border-amber-400 shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                pendingAlert.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {pendingAlert.status === 'resolved' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <span>SCHEMA CHANGE DETECTED (SECTION 30, 51)</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    pendingAlert.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {pendingAlert.status.toUpperCase()}
                  </span>
                </h3>
                <p className="text-xs text-slate-600">
                  Target System: <strong className="text-slate-800">{pendingAlert.system_name}</strong>
                </p>
              </div>
            </div>

            <span className="text-xs text-slate-500 font-mono">
              Detected at: {new Date(pendingAlert.detected_at).toLocaleTimeString()}
            </span>
          </div>

          {/* Change Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Previous Schema Field</span>
              <div className="text-sm font-mono font-bold text-slate-500 line-through mt-1">
                {pendingAlert.old_field}
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">Outgoing API Payload Key</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] text-amber-800 font-bold uppercase">New Schema Field</span>
              <div className="text-sm font-mono font-bold text-amber-950 mt-1">
                {pendingAlert.new_field}
              </div>
              <span className="text-[10px] text-amber-700 font-mono mt-1 block">New Inbound API Key</span>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] text-blue-800 font-bold uppercase">AI Suggested Canonical Mapping</span>
              <div className="text-sm font-mono font-bold text-blue-900 mt-1">
                {pendingAlert.canonical_target}
              </div>
              <span className="text-[10px] text-blue-700 font-semibold mt-1 block">
                Confidence: {pendingAlert.confidence_score}%
              </span>
            </div>
          </div>

          {/* Affected Services */}
          <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <strong className="text-slate-800">Impact: </strong>
            <span>Education → Scholarship Workflow. Affected mapping: <code className="text-blue-700 font-bold">person.name</code></span>
          </div>

          {/* Actions */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-medium">
              {pendingAlert.status === 'resolved'
                ? "Mapping approved by Administrator. Integration operates with 100% SLA."
                : "AI-assisted suggestion requires administrator review before activation."}
            </div>

            {pendingAlert.status !== 'resolved' ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleApproveMapping(pendingMapping?.id || 'map_001')}
                  disabled={isApproving}
                  className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isApproving ? "Approving..." : "Approve Mapping"}</span>
                </button>
              </div>
            ) : (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>INTEGRATION HEALTHY</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* CANONICAL DATA MODEL (Section 22, 23) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
            CANONICAL DATA LAYER (SECTION 22, 23)
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Different Department Schemas → One Canonical Model
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Government systems name fields differently. GovBridge standardizes them into canonical representations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase font-sans">Department A (Education)</span>
            <div className="p-2 bg-white rounded border border-slate-200 text-slate-800 font-bold">student_name</div>
            <div className="p-2 bg-white rounded border border-slate-200 text-slate-800 font-bold">dob</div>
            <div className="p-2 bg-white rounded border border-slate-200 text-slate-800 font-bold">institution_code</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase font-sans">Department B (Revenue/NSP)</span>
            <div className="p-2 bg-white rounded border border-slate-200 text-slate-800 font-bold">applicantName</div>
            <div className="p-2 bg-white rounded border border-slate-200 text-slate-800 font-bold">birth_date</div>
            <div className="p-2 bg-white rounded border border-slate-200 text-slate-800 font-bold">gross_annual_income</div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
            <span className="text-[10px] font-bold text-blue-800 uppercase font-sans">GovBridge Canonical Model</span>
            <div className="p-2 bg-white rounded border border-blue-300 text-blue-900 font-bold">person.name</div>
            <div className="p-2 bg-white rounded border border-blue-300 text-blue-900 font-bold">person.date_of_birth</div>
            <div className="p-2 bg-white rounded border border-blue-300 text-blue-900 font-bold">education.institution</div>
          </div>
        </div>
      </div>

      {/* Integration Onboarding Pipeline (Section 36) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Integration Onboarding Pipeline (Section 36)
        </span>
        <div className="overflow-x-auto pb-1">
          <div className="flex items-center space-x-1.5 text-xs font-mono min-w-[700px]">
            {ONBOARDING_PIPELINE.map((st, i) => (
              <React.Fragment key={st}>
                <div className={`px-3 py-2 rounded-lg border font-bold ${
                  i < 6
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : i === 6
                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}>
                  {i + 1}. {st}
                </div>
                {i < ONBOARDING_PIPELINE.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Available Systems Marketplace (Section 34) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Connected Systems in Integration Hub ({integrations.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((conn) => {
            const isDeg = conn.status === 'degraded';
            return (
              <div
                key={conn.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 uppercase font-mono">
                      {conn.department}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {conn.name}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
                    isDeg ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    ● {conn.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Latency</span>
                    <div className={`font-bold mt-0.5 ${isDeg ? 'text-amber-700' : 'text-slate-900'}`}>
                      {conn.latency_ms}ms
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Uptime</span>
                    <div className="font-bold text-emerald-700 mt-0.5">
                      {conn.uptime_percentage}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Error Rate</span>
                    <div className="font-bold text-slate-700 mt-0.5">
                      {conn.error_rate_percentage}%
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-mono truncate">
                  Endpoint: <span className="text-slate-800">{conn.endpoint_url}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
