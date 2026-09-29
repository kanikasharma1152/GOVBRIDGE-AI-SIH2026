import { apiFetch } from '../api';
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  RotateCw, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Server, 
  Sliders, 
  Sparkles, 
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SystemHealthView({ 
  onSimulateRecovery, 
  isRecovering 
}) {
  const [connectors, setConnectors] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState([]);

  useEffect(() => {
    fetchConnectors();
  }, [isRecovering]);

  const fetchConnectors = async () => {
    try {
      const res = await apiFetch('/api/integrations');
      const data = await res.json();
      setConnectors(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulateFailure = async () => {
    setIsSimulating(true);
    try {
      await apiFetch('/api/sandbox/simulate-failure', { method: 'POST' });
      addLog("FAILURE SIMULATED: State Revenue API set to UNAVAILABLE (504 Timeout). Active scholarship workflow safely queued.");
      await fetchConnectors();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSimulateRecovery = async () => {
    setIsSimulating(true);
    try {
      await onSimulateRecovery();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
      addLog("SERVICE RECOVERED: State Revenue API restored to HEALTHY. Request resumed. Income verification completed!");
      await fetchConnectors();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString();
    setSimulationLog(prev => [`[${time}] ${msg}`, ...prev.slice(0, 4)]);
  };

  const incomeConn = connectors.find(c => c.id === 'income_api') || {};
  const isIncomeDegraded = incomeConn.status === 'degraded';

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-bold tracking-wider text-blue-700 uppercase font-mono mb-1">
            SYSTEM HEALTH & SANDBOX (SECTIONS 27, 28, 29, 35, 50)
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            SYSTEM HEALTH
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Live telemetry for connected government gateways. Watch GovBridge self-healing queues handle transient outages without losing citizen transactions.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold">
          Controlled Sandbox Environment
        </span>
      </div>

      {/* API SANDBOX / DIGITAL TWIN CONTROLS (Section 35, 50) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-blue-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              API Sandbox Demonstration Controls (Section 35, 50)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Test Interoperability Fault Tolerance
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Action 1: Make Income API Unavailable */}
          <button
            onClick={handleSimulateFailure}
            disabled={isSimulating || isIncomeDegraded}
            className="p-5 rounded-xl border border-amber-300 bg-amber-50/60 hover:bg-amber-100/60 text-left transition space-y-2 cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center justify-between text-amber-900 font-bold text-xs">
              <span>STEP 1: SIMULATE FAILURE</span>
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            </div>
            <div className="text-base font-bold text-slate-900">
              Make Income API Unavailable
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Injects a 504 Gateway Timeout on State Revenue API. The active scholarship workflow is automatically queued with retry enabled.
            </p>
          </button>

          {/* Action 2: Restore Income API (Recovery) */}
          <button
            onClick={handleSimulateRecovery}
            disabled={isSimulating || !isIncomeDegraded}
            className="p-5 rounded-xl border border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100/60 text-left transition space-y-2 cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center justify-between text-emerald-900 font-bold text-xs">
              <span>STEP 2: RESTORE SERVICE</span>
              <RotateCw className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-base font-bold text-slate-900">
              Simulate Service Recovery
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Restores Income API to HEALTHY. GovBridge circuit breaker automatically flushes queued requests and completes the scholarship!
            </p>
          </button>
        </div>

        {/* Live Event Log */}
        {simulationLog.length > 0 && (
          <div className="mt-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1">
            <span className="text-slate-500 font-bold uppercase text-[10px] block">Live Telemetry Event:</span>
            {simulationLog.map((log, idx) => (
              <div key={idx} className="text-blue-900 font-medium">
                {log}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RETRY + FALLBACK QUEUE (Section 27, 29) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider font-mono">
              SECTION 27, 29 WORKFLOW QUEUE
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Self-Healing Queue & Retry Policy
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Status: <strong className="text-slate-800">{isIncomeDegraded ? "1 Queued Request" : "Idle (0 Queued)"}</strong>
          </span>
        </div>

        {/* Flow Representation (Section 27, 29) */}
        <div className="overflow-x-auto pb-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 min-w-[700px]">
            <div className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800">REQUEST</div>
            <span>→</span>
            <div className={`px-3 py-1.5 rounded-lg ${isIncomeDegraded ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-slate-100 text-slate-800'}`}>
              API UNAVAILABLE
            </div>
            <span>→</span>
            <div className={`px-3 py-1.5 rounded-lg ${isIncomeDegraded ? 'bg-blue-100 text-blue-900 font-bold' : 'bg-slate-100 text-slate-800'}`}>
              QUEUE (ATTEMPT 2/5)
            </div>
            <span>→</span>
            <div className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800">RETRY POLICY</div>
            <span>→</span>
            <div className={`px-3 py-1.5 rounded-lg ${!isIncomeDegraded ? 'bg-emerald-100 text-emerald-900 font-bold' : 'bg-slate-100 text-slate-800'}`}>
              SERVICE RECOVERED
            </div>
            <span>→</span>
            <div className={`px-3 py-1.5 rounded-lg ${!isIncomeDegraded ? 'bg-emerald-100 text-emerald-900 font-bold' : 'bg-slate-100 text-slate-800'}`}>
              RESUME WORKFLOW
            </div>
          </div>
        </div>
      </div>

      {/* CONNECTED SYSTEMS STATUS LIST (Section 28) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">
            Connected Government Gateways (Section 28)
          </h2>
          <div className="flex items-center space-x-3 text-xs font-medium">
            <span className="flex items-center space-x-1 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Green = Healthy</span>
            </span>
            <span className="flex items-center space-x-1 text-amber-700">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              <span>Amber = Degraded</span>
            </span>
            <span className="flex items-center space-x-1 text-red-700">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span>Red = Unavailable</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">System Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4">Uptime</th>
                <th className="py-3 px-4">Error Rate</th>
                <th className="py-3 px-4">Last Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {connectors.map((c) => {
                const isDeg = c.status === 'degraded';
                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{c.name}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{c.department}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        isDeg ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        ● {c.status}
                      </span>
                    </td>
                    <td className={`py-3.5 px-4 font-semibold font-mono ${isDeg ? 'text-amber-700' : 'text-slate-700'}`}>
                      {c.latency_ms}ms
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-700">
                      {c.uptime_percentage}%
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {c.error_rate_percentage}%
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(c.last_successful_request).toLocaleTimeString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
