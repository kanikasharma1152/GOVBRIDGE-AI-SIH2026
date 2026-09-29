import React from 'react';
import { 
  Network, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Activity, 
  Clock, 
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  Zap,
  ArrowRight,
  Layers,
  FileCheck2,
  Lock
} from 'lucide-react';

export default function CommandCenterView({ 
  healthData, 
  onNavigate, 
  currentCitizen, 
  onOpenStuckModal,
  onOpenVoice 
}) {
  const stats = healthData?.stats || {
    connected_systems: 24,
    healthy_services: 21,
    degraded_services: 2,
    offline_services: 1,
    active_requests: 1284,
    pending_workflows: 326,
    failed_requests_intercepted: 18
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Notice */}
      <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-sky-950/40 border border-sky-500/20 text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-sky-300 font-semibold">ECOSYSTEM TELEMETRY ENGINE</span>
          <span className="text-slate-400">• High-density Civic Interoperability Command Center</span>
        </div>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
          DEMO DATA — SIMULATED ENVIRONMENT
        </span>
      </div>

      {/* Hero Headline Section (Req 7) */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase mb-2">
          GOVERNMENT DIGITAL INTEROPERABILITY COMMAND CENTER
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          ONE CITIZEN JOURNEY.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">
            CONNECTED GOVERNMENT SYSTEMS.
          </span>
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mt-3 leading-relaxed">
          Transforming fragmented ministerial silos into one coordinated citizen journey. Zero re-entry, cross-department data pipelines, DPDP consent enforcement, and self-healing workflow orchestration.
        </p>
      </div>

      {/* Key Metrics Grid (Req 7) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Real-time System State (Demo Telemetry)
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Refreshed 2s ago
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* 1. Connected Systems */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono font-semibold">CONNECTED</span>
              <Network className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {stats.connected_systems}
            </div>
            <div className="text-[10px] text-sky-400 font-mono mt-1">24 Connected</div>
          </div>

          {/* 2. Healthy Services */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-950/60 hover:border-emerald-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono font-semibold">HEALTHY</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">
              {stats.healthy_services}
            </div>
            <div className="text-[10px] text-emerald-300 font-mono mt-1">21 Healthy</div>
          </div>

          {/* 3. Degraded */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-950/60 hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono font-semibold">DEGRADED</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 tracking-tight">
              {stats.degraded_services}
            </div>
            <div className="text-[10px] text-amber-300 font-mono mt-1">2 Degraded</div>
          </div>

          {/* 4. Offline */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-red-950/60 hover:border-red-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono font-semibold">OFFLINE</span>
              <XCircle className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400 tracking-tight">
              {stats.offline_services}
            </div>
            <div className="text-[10px] text-red-300 font-mono mt-1">1 Offline</div>
          </div>

          {/* 5. Active Requests */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono font-semibold">ACTIVE</span>
              <Activity className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-sky-400 tracking-tight font-mono">
              1,284
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Live requests</div>
          </div>

          {/* 6. Pending Workflows */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono font-semibold">QUEUED</span>
              <Clock className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-indigo-300 tracking-tight font-mono">
              326
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Buffered in queue</div>
          </div>

          {/* 7. Failed Intercepted */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-mono font-semibold">INTERCEPTED</span>
              <ShieldAlert className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-300 tracking-tight font-mono">
              18
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Circuit protected</div>
          </div>
        </div>
      </div>

      {/* Interactive Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Zero Re-entry Scholarship */}
        <div 
          onClick={() => onNavigate('services')}
          className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950/30 border border-sky-500/30 hover:border-sky-500/60 transition cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Zap className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-sky-400 transition" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition">
            Zero Re-entry Service Discovery
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Apply for National Scholarships using pre-verified academic and income credentials without filling repeated forms.
          </p>
          <div className="mt-4 flex items-center space-x-2 text-xs text-sky-400 font-semibold font-mono">
            <span>Launch Intent Engine</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Application Stuck Diagnostic */}
        <div 
          onClick={onOpenStuckModal}
          className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950/30 border border-amber-500/30 hover:border-amber-500/60 transition cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
            "Why Is My Application Stuck?"
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Diagnose active workflow lag: Income Verification API timeout intercepted. View root cause and simulate recovery.
          </p>
          <div className="mt-4 flex items-center space-x-2 text-xs text-amber-400 font-semibold font-mono">
            <span>Open Diagnostic Tracer</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Digital Twin Sandbox */}
        <div 
          onClick={() => onNavigate('system-health')}
          className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-purple-950/30 border border-purple-500/30 hover:border-purple-500/60 transition cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Activity className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition">
            Digital Twin & Sandbox
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Test cross-department resilience. Simulate API timeouts, circuit-breaker queues, and AI schema change detections.
          </p>
          <div className="mt-4 flex items-center space-x-2 text-xs text-purple-400 font-semibold font-mono">
            <span>Enter Simulation Sandbox</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Live Transaction Stream */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Live Interoperability Ledger (Recent Activity)
            </h3>
          </div>
          <button 
            onClick={() => onNavigate('audit')}
            className="text-xs text-sky-400 hover:text-sky-300 font-mono flex items-center space-x-1"
          >
            <span>View Full Audit Trail</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] text-slate-500">20:55:01</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                QUEUED
              </span>
              <span className="text-slate-300">GovBridge Self-Healing Daemon</span>
              <span className="text-slate-500 hidden sm:inline">→ Exponential backoff retry attempt 2/5 for State Revenue endpoint</span>
            </div>
            <span className="text-slate-400 text-[11px]">Revenue Gateway</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] text-slate-500">19:14:22</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px]">
                SCHEMA DRIFT
              </span>
              <span className="text-slate-300">DigiLocker NAD Academic API</span>
              <span className="text-slate-500 hidden sm:inline">→ Renamed 'student_name' to 'student_full_name' (AI matched 94%)</span>
            </div>
            <span className="text-slate-400 text-[11px]">Schema AI</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] text-slate-500">18:30:06</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                VERIFIED
              </span>
              <span className="text-slate-300">National Academic Depository</span>
              <span className="text-slate-500 hidden sm:inline">→ DTU B.Tech CSE CGPA 8.85 verified for Kanika Sharma</span>
            </div>
            <span className="text-slate-400 text-[11px]">DigiLocker</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] text-slate-500">18:28:45</span>
              <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px]">
                DPDP CONSENT
              </span>
              <span className="text-slate-300">Citizen Kanika Sharma</span>
              <span className="text-slate-500 hidden sm:inline">→ Granted tokenized data sharing for National Scholarship Scheme</span>
            </div>
            <span className="text-slate-400 text-[11px]">Consent Wallet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
