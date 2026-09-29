import React from 'react';
import { 
  Compass, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const PRESENTATION_STEPS = [
  {
    step: 1,
    title: "1. Launch GovBridge",
    desc: "Clean initialization sequence verifying the civic interoperability mesh.",
    view: "home",
    mode: "citizen",
    action: "replay_launch",
    instruction: "Trigger the boot sequence showing verification of services, APIs, and departmental connectors."
  },
  {
    step: 2,
    title: "2. Homepage & Citizen Command Center",
    desc: "Display 'One Citizen Journey. Connected Government Systems' and the visual multi-system coordinator.",
    view: "home",
    mode: "citizen",
    instruction: "Highlight how Citizen coordinates with Education, Income, Identity, Scholarship, and Banking through GovBridge."
  },
  {
    step: 3,
    title: "3. Show Connected Systems (Integration Hub)",
    desc: "Inspect connected ministerial gateways: UIDAI, DigiLocker, Revenue, NPCI PFMS, and NSP.",
    view: "integrations",
    mode: "admin",
    instruction: "Show live API status, latencies, and canonical scopes across integrated departments."
  },
  {
    step: 4,
    title: "4. Citizen Intent: 'I want to apply for a scholarship'",
    desc: "Citizen describes intent in natural language instead of knowing which ministry owns which portal.",
    view: "services",
    mode: "citizen",
    action: "fill_scholarship_query",
    instruction: "Type 'I want to apply for a scholarship' into the Natural Language Discovery Engine."
  },
  {
    step: 5,
    title: "5. Service Discovery & Intent Engine",
    desc: "Transparent reasoning pipeline matches query to National Post-Matric Merit Scholarship.",
    view: "services",
    mode: "citizen",
    action: "run_intent_match",
    instruction: "Show multi-stage intent reasoning and entity extraction."
  },
  {
    step: 6,
    title: "6. Interactive Service Graph",
    desc: "Visual topology of connected services: Identity <-> Education <-> GovBridge <-> Income <-> Scholarship <-> Banking.",
    view: "service-graph",
    mode: "citizen",
    instruction: "Click on any node (e.g. DigiLocker or Income API) to inspect live endpoint latency and data contracts."
  },
  {
    step: 7,
    title: "7. Document Requirement Analysis: What You Need",
    desc: "Evaluates Required vs Not Required to eliminate unnecessary document collection.",
    view: "documents",
    mode: "citizen",
    instruction: "Show how GovBridge determines that required documents are already available from verified registries."
  },
  {
    step: 8,
    title: "8. Consent Wallet (DPDP Act 2023)",
    desc: "Granular citizen consent management with legal purpose, duration, and access log.",
    view: "consent",
    mode: "citizen",
    instruction: "Demonstrate citizen control: grant, deny, or revoke access to specific attributes."
  },
  {
    step: 9,
    title: "9. Zero Re-entry: Enter Once. Reuse With Consent",
    desc: "Pre-verified data found in Data Passport (CGPA 8.85, Income ₹1.8L, SBI A/c). No duplicate typing!",
    view: "passport",
    mode: "citizen",
    instruction: "Point out how verified attributes from Aadhaar and NAD eliminate repetitive manual form-filling."
  },
  {
    step: 10,
    title: "10. Create Application",
    desc: "Citizen submits application using authorized data in 1 click.",
    view: "services",
    mode: "citizen",
    action: "create_scholarship_app",
    instruction: "Click 'Use Existing Information' to launch application APP-GB-2026-8821."
  },
  {
    step: 11,
    title: "11. Unified Application Journey",
    desc: "Multi-stage timeline across UIDAI, DigiLocker, State Revenue, and NPCI.",
    view: "journey",
    mode: "citizen",
    instruction: "Observe Steps 1 & 2 completed, with Step 3 (Income Verification) active."
  },
  {
    step: 12,
    title: "12. Simulate Income API Failure",
    desc: "External State Revenue gateway experiences 504 Gateway Timeout (Latency: 8.9s / 38s lag).",
    view: "system-status",
    mode: "admin",
    action: "simulate_failure",
    instruction: "Trigger simulated failure on Income Verification API."
  },
  {
    step: 13,
    title: "13. Queue + Retry & 'Why Is My Application Stuck?'",
    desc: "GovBridge circuit breaker holds state in retry queue (Attempt 2/5) without crashing application.",
    view: "journey",
    mode: "citizen",
    action: "open_stuck_diagnosis",
    instruction: "Click 'Why Is My Application Stuck?' to view root-cause diagnostics based on actual API state."
  },
  {
    step: 14,
    title: "14. Restore Service (Simulate Recovery)",
    desc: "State Revenue API recovers to HEALTHY status.",
    view: "system-status",
    mode: "admin",
    action: "simulate_recovery",
    instruction: "Click 'Simulate Service Recovery' in the System Health Sandbox."
  },
  {
    step: 15,
    title: "15. Workflow Resumes & Completes!",
    desc: "Self-healing orchestrator flushes retry queue, validates bank DBT, and approves application.",
    view: "journey",
    mode: "citizen",
    instruction: "Return to My Journey to see all steps completed and Digital Sanction generated!"
  },
  {
    step: 16,
    title: "16. Show API Health Monitor",
    desc: "Real-time health monitor displaying latencies, error rates, and uptime across connectors.",
    view: "system-status",
    mode: "admin",
    instruction: "Examine live telemetry across all integration endpoints."
  },
  {
    step: 17,
    title: "17. AI-Assisted Schema Change Detection",
    desc: "DigiLocker renamed 'student_name' to 'student_full_name'. AI suggests mapping to person.name (94%).",
    view: "integrations",
    mode: "admin",
    action: "show_schema_change",
    instruction: "Review the AI schema suggestion and click 'Approve Mapping' with human-in-the-loop authorization."
  },
  {
    step: 18,
    title: "18. Data Conflict Detection",
    desc: "Identity DOB (20 May 2005) differs from Education Certificate (21 May 2005). Silent overwrite blocked!",
    view: "conflicts",
    mode: "admin",
    instruction: "Demonstrate non-silent conflict handling requiring official manual adjudication."
  },
  {
    step: 19,
    title: "19. Data Lineage Explorer",
    desc: "End-to-end provenance: Source -> Department API -> GovBridge -> Scholarship Workflow -> Verification.",
    view: "lineage",
    mode: "admin",
    instruction: "Trace the lineage of Annual Household Income from State Revenue to National Scholarship Portal."
  },
  {
    step: 20,
    title: "20. Bottleneck Analytics",
    desc: "Telemetry identifies Income Verification (8.9s) as the primary bottleneck vs 1.4s for Education.",
    view: "analytics",
    mode: "admin",
    instruction: "Inspect processing-time analytics, failure patterns, and cross-department dependency map."
  },
  {
    step: 21,
    title: "21. Ask GovBridge (Voice Assistant)",
    desc: "Voice-enabled civic assistant answering queries from real-time platform telemetry.",
    view: "home",
    mode: "citizen",
    action: "open_voice_modal",
    instruction: "Ask 'Why is my application stuck?' to hear real-time AI response grounded in system state."
  }
];

export default function PresentationGuideModal({ 
  isOpen, 
  onClose, 
  onExecuteStep, 
  currentStepIndex, 
  setCurrentStepIndex 
}) {
  if (!isOpen) return null;

  const current = PRESENTATION_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < PRESENTATION_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      onExecuteStep(PRESENTATION_STEPS[nextIdx]);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      onExecuteStep(PRESENTATION_STEPS[prevIdx]);
    }
  };

  const handleSelectStep = (idx) => {
    setCurrentStepIndex(idx);
    onExecuteStep(PRESENTATION_STEPS[idx]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-blue-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <span>Judge Presentation Walkthrough</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Step {current.step} of 21
                </span>
              </h2>
              <p className="text-xs text-slate-600">
                Official presentation flow demonstrating full interoperability capabilities
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Active Highlight Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 font-mono">
                  ACTIVE PRESENTATION STEP
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {current.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {current.desc}
                </p>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                current.mode === 'citizen' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {current.mode} View
              </span>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-blue-950">Judge Speaking Note: </strong>
                {current.instruction}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => onExecuteStep(current)}
                className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Jump & Execute This Step</span>
              </button>
              <div className="text-xs text-slate-500 font-mono">
                Target View: <strong className="text-slate-800 uppercase">{current.view}</strong>
              </div>
            </div>
          </div>

          {/* 21 Steps Grid */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              21-Step Presentation Sequence
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {PRESENTATION_STEPS.map((s, idx) => {
                const isSelected = idx === currentStepIndex;
                const isPassed = idx < currentStepIndex;

                return (
                  <button
                    key={s.step}
                    onClick={() => handleSelectStep(idx)}
                    className={`flex items-start space-x-2.5 p-3 rounded-xl text-left border transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 shadow-2xs'
                        : isPassed
                        ? 'bg-slate-50/70 border-slate-200 text-slate-700'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border text-[10px] font-bold flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-blue-600 text-blue-700 font-bold bg-white' : 'border-slate-300 text-slate-400'
                        }`}>
                          {s.step}
                        </div>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <div className={`text-xs font-bold truncate ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                        {s.title.split('. ')[1]}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">{s.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="flex items-center space-x-1 px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleNext}
              disabled={currentStepIndex === PRESENTATION_STEPS.length - 1}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition disabled:opacity-40 cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
