import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  RotateCw, 
  ArrowRight, 
  HelpCircle,
  Building2,
  Server,
  Sparkles,
  ShieldAlert,
  Award,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function JourneyView({ 
  applications, 
  onRefresh, 
  onOpenStuckModal, 
  onSimulateRecovery,
  isRecovering 
}) {
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    if (applications && applications.length > 0) {
      setSelectedApp(applications[0]);
    }
  }, [applications]);

  if (!selectedApp) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl max-w-4xl mx-auto">
        <h3 className="text-base font-bold text-slate-800">No Active Application Journeys</h3>
        <p className="text-xs text-slate-500 mt-1">
          Apply for a service via the Service Discovery tab to initiate a coordinated journey.
        </p>
      </div>
    );
  }

  const isCompleted = selectedApp.status === "Completed";
  const isStuck = selectedApp.stuck_diagnosis?.is_stuck;

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-bold tracking-wider text-blue-700 uppercase font-mono mb-1">
            UNIFIED APPLICATION JOURNEY (SECTION 19, 20)
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Coordinated Application Timeline
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Track your application as it moves across multiple government departments without needing to visit separate departmental portals.
          </p>
        </div>

        {/* Prominent Action Button: Why is my application stuck? (Section 20) */}
        {isStuck && (
          <button
            onClick={onOpenStuckModal}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition flex items-center space-x-2 shrink-0 cursor-pointer animate-pulse"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>WHY IS MY APPLICATION STUCK?</span>
          </button>
        )}
      </div>

      {/* Application Overview Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-700 font-mono">
            {selectedApp.id} • {selectedApp.department}
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            {selectedApp.service_name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Applicant: <strong className="text-slate-800">{selectedApp.citizen_name}</strong> (Demo Persona)
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-bold uppercase block">Current Stage</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className={`w-2.5 h-2.5 rounded-full ${
                isCompleted 
                  ? 'bg-emerald-600' 
                  : isStuck 
                  ? 'bg-amber-600 animate-pulse' 
                  : 'bg-blue-600'
              }`} />
              <span className={`text-base font-bold ${
                isCompleted 
                  ? 'text-emerald-700' 
                  : isStuck 
                  ? 'text-amber-700' 
                  : 'text-blue-700'
              }`}>
                {selectedApp.status}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              {selectedApp.progress_percentage}% completed
            </span>
          </div>
        </div>
      </div>

      {/* Stuck Alert Box with Explanation (Section 20) */}
      {isStuck && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                TRANSPARENCY DIAGNOSTIC: {selectedApp.current_step}
              </div>
              <p className="text-xs text-amber-900">
                {selectedApp.stuck_diagnosis?.reason} GovBridge has automatically queued the request for retry.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onOpenStuckModal}
              className="px-3 py-1.5 rounded-lg bg-white text-amber-900 border border-amber-300 text-xs font-semibold shadow-2xs hover:bg-amber-100 transition cursor-pointer"
            >
              View Diagnosis
            </button>
            <button
              onClick={onSimulateRecovery}
              disabled={isRecovering}
              className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRecovering ? 'animate-spin' : ''}`} />
              <span>Simulate Recovery</span>
            </button>
          </div>
        </div>
      )}

      {/* Success Banner if Completed */}
      {isCompleted && (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider">
                SCHOLARSHIP APPROVED & SANCTIONED!
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                All 6 inter-ministerial verification stages have been completed successfully. Digital Sanction NSP-2026-DL-8821 generated.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold font-mono text-emerald-800 bg-white px-3 py-1 rounded-full border border-emerald-300">
            100% COMPLETE
          </span>
        </div>
      )}

      {/* Multi-Stage Vertical Timeline (Section 19) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Unified Multi-Department Workflow Stages (Section 19)
        </h3>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200">
          {selectedApp.steps.map((step, idx) => {
            const isStepCompleted = step.status === "completed";
            const isStepDegraded = step.status === "degraded";
            const isStepPending = step.status === "pending";

            return (
              <div key={step.id} className="relative flex items-start space-x-4 pl-2">
                {/* Node indicator */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all ${
                    isStepCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : isStepDegraded
                      ? 'bg-amber-600 border-amber-600 text-white animate-pulse'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {isStepCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isStepDegraded ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>

                {/* Content Card */}
                <div
                  className={`flex-1 p-4 rounded-xl border transition-all ${
                    isStepCompleted
                      ? 'bg-slate-50/70 border-slate-200'
                      : isStepDegraded
                      ? 'bg-amber-50/60 border-amber-300'
                      : 'bg-slate-50/40 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900">
                        {idx + 1}. {step.step_name}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        ({step.system_name})
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-mono">
                      {step.latency_ms > 0 && (
                        <span className="text-slate-500">
                          {step.latency_ms}ms
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-0.5 rounded-full uppercase text-[10px] font-bold ${
                          isStepCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isStepDegraded
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {step.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {step.details}
                  </p>

                  {step.delay_reason && (
                    <div className="mt-2.5 p-3 rounded-lg bg-amber-100/70 border border-amber-300 text-xs text-amber-900">
                      <strong className="block text-[11px] uppercase font-bold">Interoperability Reason:</strong>
                      {step.delay_reason}
                    </div>
                  )}

                  <div className="mt-3 pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Responsible Ministry: <strong className="text-slate-700">{step.department}</strong></span>
                    <span>Status as of: {step.timestamp}</span>
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
