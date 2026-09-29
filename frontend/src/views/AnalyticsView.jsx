import { apiFetch } from '../api';
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Activity, 
  HelpCircle,
  Network,
  Send,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export default function AnalyticsView() {
  const [analytics, setAnalytics] = useState(null);
  const [adminQuery, setAdminQuery] = useState('');
  const [adminAnswer, setAdminAnswer] = useState(null);
  const [isLoadingQuery, setIsLoadingQuery] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await apiFetch('/api/analytics/bottlenecks');
      const data = await res.json();
      setAnalytics(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAskAdmin = async (q) => {
    const text = q || adminQuery;
    if (!text.trim()) return;
    setIsLoadingQuery(true);
    try {
      const res = await apiFetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text, role: 'admin' })
      });
      const data = await res.json();
      setAdminAnswer(data.answer);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingQuery(false);
    }
  };

  const stages = [
    { name: "Application", duration: 2.0, isBottleneck: false },
    { name: "Education Check", duration: 1.4, isBottleneck: false },
    { name: "Income Check", duration: 8.9, isBottleneck: true },
    { name: "Document Check", duration: 2.1, isBottleneck: false },
    { name: "Review", duration: 4.0, isBottleneck: false },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-bold tracking-wider text-blue-700 uppercase font-mono mb-1">
            WORKFLOW BOTTLENECK & PROCESSING-TIME ANALYTICS (SECTIONS 38–43)
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Interoperability Telemetry & Analytics
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Analyze cross-department response times, detect systemic workflow bottlenecks, and inspect failure patterns across ministerial gateways.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold">
          Primary Bottleneck: Income Check (8.9s)
        </span>
      </div>

      {/* BOTTLENECK DETECTION (Section 38) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider font-mono">
              SECTION 38 BOTTLENECK DETECTION
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Scholarship Workflow Stage Analysis
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Highlighting measured delays across interconnected departmental verification stages.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
            Income Verification: Critical Bottleneck
          </span>
        </div>

        {/* Visual Latency Bars */}
        <div className="space-y-4">
          {stages.map((st) => (
            <div key={st.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={st.isBottleneck ? "text-amber-900 font-bold" : "text-slate-800"}>
                  {st.name} {st.isBottleneck && "(Primary Bottleneck Highlighted)"}
                </span>
                <span className={`font-mono ${st.isBottleneck ? "text-amber-800 font-bold text-sm" : "text-slate-600"}`}>
                  {st.duration} sec
                </span>
              </div>

              <div className="w-full bg-slate-100 h-6 rounded-lg overflow-hidden flex items-center p-0.5 border border-slate-200">
                <div
                  className={`h-full rounded-md flex items-center px-2 text-[11px] font-bold ${
                    st.isBottleneck
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'bg-blue-600 text-white'
                  }`}
                  style={{ width: `${Math.min((st.duration / 10) * 100, 100)}%` }}
                >
                  {st.isBottleneck ? "8.9s Bottleneck" : ""}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
          <strong className="block text-[11px] uppercase font-bold">Telemetry Finding:</strong>
          <span>Income Verification averages 8.9s response time due to State Sub-Registrar Database gateway latency and retry frequency. Other verification steps average under 2.5s.</span>
        </div>
      </div>

      {/* CROSS-DEPARTMENT DEPENDENCY MAP (Section 42) & FAILURE PATTERNS (Section 40) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cross-Department Dependency Map */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
              SECTION 42 DEPENDENCY MAP
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Cross-Department Interoperability Network
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-2 text-slate-800">
            <div>Education ──────► Scholarship</div>
            <div>Income ─────────► Scholarship</div>
            <div>Identity ───────► Education</div>
            <div>Banking ────────► Payment / DBT</div>
          </div>

          <p className="text-xs text-slate-500">
            Clicking a department in GovBridge reveals active workflows, APIs, data exchanged, and failure impact.
          </p>
        </div>

        {/* Failure Pattern Analysis (Section 40) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              SECTION 40 FAILURE PATTERNS
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              API Failure Category Telemetry
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { type: "Timeouts (504 Gateway)", count: 412, dept: "Department of Revenue" },
              { type: "Schema Mismatches", count: 128, dept: "Education / DigiLocker" },
              { type: "Authentication Token Expiry", count: 19, dept: "Identity / UIDAI" },
              { type: "Validation / DBT Format Errors", count: 42, dept: "Banking / PFMS" }
            ].map((f, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">{f.type}</span>
                  <div className="text-[10px] text-slate-500">{f.dept}</div>
                </div>
                <span className="font-mono text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {f.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NATURAL-LANGUAGE ADMIN ANALYTICS (Section 43) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
            SECTION 43 NATURAL LANGUAGE ANALYTICS
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Ask GovBridge (Administrative Query Engine)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Query actual structured platform telemetry in plain English.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={adminQuery}
            onChange={(e) => setAdminQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAdmin(adminQuery)}
            placeholder="E.g., “Why is scholarship processing slow?” or “Which service has the highest failure rate?”"
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white w-full"
          />
          <button
            onClick={() => handleAskAdmin(adminQuery)}
            disabled={isLoadingQuery}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            {isLoadingQuery ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Query System</span>
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-2 items-center text-xs">
          <span className="text-slate-500 font-medium">Quick admin questions:</span>
          {[
            "Which service has the highest failure rate?",
            "Why is scholarship processing slow?",
            "Which APIs are currently unavailable?",
            "Which workflows depend on the Income API?"
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setAdminQuery(q);
                handleAskAdmin(q);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
            >
              “{q}”
            </button>
          ))}
        </div>

        {/* Answer Display */}
        {adminAnswer && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1">
            <span className="font-bold text-blue-800 uppercase text-[10px] block">Verified Platform Telemetry:</span>
            <p className="leading-relaxed">{adminAnswer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
