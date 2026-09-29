import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, FastForward } from 'lucide-react';

const INITIALIZATION_STEPS = [
  "SERVICE NETWORK",
  "API GATEWAY",
  "IDENTITY CONNECTOR",
  "EDUCATION CONNECTOR",
  "INCOME CONNECTOR",
  "DOCUMENT INTELLIGENCE",
  "CONSENT ENGINE",
  "WORKFLOW ORCHESTRATOR",
  "SYSTEM HEALTH",
  "DATA LINEAGE",
  "AI INTELLIGENCE"
];

export default function CinematicLaunch({ onComplete }) {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < INITIALIZATION_STEPS.length) {
      const timer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, INITIALIZATION_STEPS[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(exitTimer);
    }
  }, [currentIndex, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-slate-800 select-none">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">GOVBRIDGE</h1>
              <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider">
                Government Interoperability Platform
              </p>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition cursor-pointer flex items-center space-x-1"
          >
            <span>Skip</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Verification Checklist */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            GOVERNMENT INTEROPERABILITY INITIALIZING...
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono max-h-56 overflow-y-auto pr-1">
            {INITIALIZATION_STEPS.map((step, idx) => {
              const isDone = completedSteps.includes(step);
              const isCurrent = currentIndex === idx;

              return (
                <div
                  key={step}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition ${
                    isDone
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                      : isCurrent
                      ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                      {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />}
                    </div>
                  )}
                  <span className="truncate">{step}</span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="pt-2">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-blue-700 transition-all duration-150"
                style={{ width: `${(completedSteps.length / INITIALIZATION_STEPS.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold mt-2">
              <span>DPDP ACT 2023 SECURITY STANDARD</span>
              <span>{Math.round((completedSteps.length / INITIALIZATION_STEPS.length) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
