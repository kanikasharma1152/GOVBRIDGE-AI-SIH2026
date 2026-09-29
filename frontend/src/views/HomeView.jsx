import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Building2, 
  FileText, 
  Sparkles, 
  Search, 
  AlertTriangle,
  Lock,
  ChevronRight,
  Zap,
  RotateCw,
  HelpCircle
} from 'lucide-react';

export default function HomeView({ 
  onNavigate, 
  currentCitizen, 
  activeApplication, 
  onOpenStuckModal, 
  healthData 
}) {
  const steps = [
    { name: "Application", status: "completed" },
    { name: "Document Check", status: "completed" },
    { name: "Education Verification", status: "completed" },
    { name: "Income Verification", status: activeApplication?.status === 'Completed' ? 'completed' : 'in_progress' },
    { name: "Final Review", status: activeApplication?.status === 'Completed' ? 'completed' : 'pending' }
  ];

  return (
    <div className="space-y-12 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* 1. Hero Section (Section 8) */}
      <section className="pt-6 sm:pt-10 pb-8 border-b border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline and CTAs */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>National Digital Public Infrastructure</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              ONE CITIZEN JOURNEY.
              <br />
              <span className="text-blue-700">
                CONNECTED GOVERNMENT SYSTEMS.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              GOVBRIDGE connects fragmented government services, data systems, and workflows so citizens can complete services with less repetition and greater transparency.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('services')}
                className="px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm shadow-sm transition flex items-center space-x-2 cursor-pointer"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('service-graph')}
                className="px-6 py-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm transition flex items-center space-x-2 cursor-pointer"
              >
                <span>View How GOVBRIDGE Works</span>
              </button>
            </div>

            {/* Core Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Form Re-Entry</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>DPDP Act 2023 Consent Guarded</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Real-Time Self-Healing APIs</span>
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual (Section 9) */}
          {/* Clean visual representation: Citizen -> Education, Income, Identity, Scholarship, Banking through GOVBRIDGE */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  System Coordination Visualizer
                </span>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Many Systems → One Journey
                </span>
              </div>

              {/* Clean Diagram */}
              <div className="relative flex items-center justify-between py-4">
                {/* Left: Citizen Node */}
                <div className="flex flex-col items-center z-10">
                  <div className="w-14 h-14 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-md">
                    Citizen
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 mt-2">
                    {currentCitizen?.name || 'Citizen'}
                  </span>
                  <span className="text-[10px] text-slate-400">Single Request</span>
                </div>

                {/* Center: GOVBRIDGE Hub */}
                <div className="flex flex-col items-center z-10">
                  <div className="w-16 h-16 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center font-extrabold text-xs shadow-lg border-2 border-blue-600">
                    <span className="text-blue-400 text-[10px] tracking-widest font-mono">CORE</span>
                    <span>GOVBRIDGE</span>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full mt-2 border border-blue-200">
                    Coordination Layer
                  </span>
                </div>

                {/* Right: Connected Departments Stack */}
                <div className="flex flex-col space-y-2 z-10">
                  {[
                    { name: 'Education', code: 'NAD' },
                    { name: 'Income', code: 'Revenue' },
                    { name: 'Identity', code: 'UIDAI' },
                    { name: 'Scholarship', code: 'NSP' },
                    { name: 'Banking', code: 'PFMS' },
                  ].map((dept, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between space-x-2 w-36 shadow-2xs"
                    >
                      <span className="truncate">{dept.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{dept.code}</span>
                    </div>
                  ))}
                </div>

                {/* Connecting SVG Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                  <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" className="animate-flow-line" />
                  <line x1="50%" y1="50%" x2="72%" y2="20%" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" className="animate-flow-line" />
                  <line x1="50%" y1="50%" x2="72%" y2="35%" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" className="animate-flow-line" />
                  <line x1="50%" y1="50%" x2="72%" y2="50%" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" className="animate-flow-line" />
                  <line x1="50%" y1="50%" x2="72%" y2="65%" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" className="animate-flow-line" />
                  <line x1="50%" y1="50%" x2="72%" y2="80%" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" className="animate-flow-line" />
                </svg>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
                Connected government systems coordinate automatically in real time.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Citizen Command Center (Section 10) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
              CITIZEN COMMAND CENTER
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
              MY GOVERNMENT JOURNEY
            </h2>
          </div>

          <button
            onClick={() => onNavigate('journey')}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center space-x-1 cursor-pointer"
          >
            <span>View Full Journey Timeline</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Active Application Card (Section 10) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-medium text-slate-500">Active Application</span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {activeApplication?.service_name || "National Post-Matric Merit Scholarship Scheme 2026"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Reference ID: <span className="font-mono text-slate-700">{activeApplication?.id || "APP-GB-2026-8821"}</span> • Ministry of Education & Social Justice
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5 ${
                activeApplication?.status === 'Completed'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${activeApplication?.status === 'Completed' ? 'bg-emerald-600' : 'bg-amber-600 animate-pulse'}`}></span>
                <span>{activeApplication?.status === 'Completed' ? 'Approved & Sanctioned' : 'Verification in Progress'}</span>
              </span>

              {activeApplication?.stuck_diagnosis?.is_stuck && (
                <button
                  onClick={onOpenStuckModal}
                  className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition flex items-center space-x-1 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Why is it stuck?</span>
                </button>
              )}
            </div>
          </div>

          {/* Clean Civic Progress Stepper (Section 10) */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Verification Progress
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              {steps.map((st, i) => {
                const isDone = st.status === 'completed';
                const isCurrent = st.status === 'in_progress';

                return (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 ${
                      isDone
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                        : isCurrent
                        ? 'bg-blue-50/70 border-blue-300 text-blue-900 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase">Stage 0{i + 1}</span>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-slate-300" />
                      )}
                    </div>

                    <div className="text-xs font-bold leading-tight">
                      {st.name}
                    </div>

                    <span className="text-[10px] font-semibold">
                      {isDone ? "Completed ✓" : isCurrent ? "Active In Progress ●" : "Pending ○"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quick Civic Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Find a Service with Natural Language */}
        <div 
          onClick={() => onNavigate('services')}
          className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-6 shadow-sm transition cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition">
            Find a Government Service
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tell GovBridge what you need in plain words (e.g. “I want to apply for a scholarship”) without needing to know which department provides it.
          </p>
          <div className="pt-2 flex items-center text-xs font-semibold text-blue-700">
            <span>Discover Services</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: My Data & Zero Re-entry */}
        <div 
          onClick={() => onNavigate('passport')}
          className="bg-white border border-slate-200 hover:border-emerald-400 rounded-2xl p-6 shadow-sm transition cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition">
            Enter Once. Reuse With Consent.
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            View your verified academic and income credentials. When a new government scheme requires them, reuse authorized data in one click.
          </p>
          <div className="pt-2 flex items-center text-xs font-semibold text-emerald-700">
            <span>View Data Passport</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Consent Wallet (DPDP) */}
        <div 
          onClick={() => onNavigate('consent')}
          className="bg-white border border-slate-200 hover:border-purple-400 rounded-2xl p-6 shadow-sm transition cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition">
            My Consents (DPDP Act 2023)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Manage granular sharing permissions. Review what data is being requested, by which ministry, why, and easily revoke access anytime.
          </p>
          <div className="pt-2 flex items-center text-xs font-semibold text-purple-700">
            <span>Manage Permissions</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>
    </div>
  );
}
