import { apiFetch } from '../api';
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  FileCheck2, 
  Building2, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  Layers,
  Send,
  Loader2,
  Lock,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ServicesView({ 
  currentCitizen, 
  onApplicationCreated, 
  onNavigate,
  prefilledQuery = '' 
}) {
  const [query, setQuery] = useState(prefilledQuery || 'I want to apply for a scholarship');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [intentResult, setIntentResult] = useState(null);
  const [servicesList, setServicesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);

  useEffect(() => {
    fetchServices();
    if (prefilledQuery) {
      setQuery(prefilledQuery);
      handleDiscover(prefilledQuery);
    } else {
      handleDiscover('I want to apply for a scholarship');
    }
  }, [prefilledQuery]);

  const fetchServices = async () => {
    try {
      const res = await apiFetch('/api/services');
      const data = await res.json();
      setServicesList(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDiscover = async (textToSearch) => {
    const text = textToSearch || query;
    if (!text.trim()) return;

    setIsDiscovering(true);
    try {
      const res = await apiFetch('/api/services/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text, citizen_id: currentCitizen?.id || 'citizen_01' })
      });
      const data = await res.json();
      setIntentResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleApplyWithZeroReentry = async () => {
    if (!intentResult?.matched_service) return;
    setIsSubmittingApp(true);
    try {
      const res = await apiFetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizen_id: currentCitizen?.id || 'citizen_01',
          service_id: intentResult.matched_service.id,
          use_authorized_data: true,
          authorized_fields: intentResult.required_data
        })
      });
      const appRecord = await res.json();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
      onApplicationCreated(appRecord);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingApp(false);
    }
  };

  const categories = ['All', 'Scholarship & Higher Education', 'Welfare & Economic Status', 'Academic Depository', 'Urban Mobility & Student Support', 'Social Security & Pension'];

  const filteredServices = servicesList.filter(s => 
    selectedCategory === 'All' ? true : s.category === selectedCategory
  );

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="text-xs font-bold tracking-wider text-blue-700 uppercase font-mono mb-1">
          SERVICE DISCOVERY (SECTION 11, 12)
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Find a Government Service
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Describe your requirement naturally. GovBridge automatically determines the relevant government departments, eligibility criteria, and required documents.
        </p>
      </div>

      {/* Natural Language Prompt Search Box (Section 11, 12) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-blue-700" />
          <span>Natural Language Discovery Engine</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDiscover(query)}
              placeholder="E.g., “I want to apply for a scholarship” or “I need financial support for my education”"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
            />
          </div>
          <button
            onClick={() => handleDiscover(query)}
            disabled={isDiscovering}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm shadow-sm transition flex items-center justify-center space-x-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isDiscovering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Find Service</span>
          </button>
        </div>

        {/* Quick Example Prompt Chips */}
        <div className="flex flex-wrap gap-2 items-center text-xs pt-1">
          <span className="text-slate-500 font-medium">Try asking:</span>
          {[
            "I want to apply for a scholarship",
            "I need financial support for my education",
            "Verify my college degree credentials",
            "Student concessional transit mobility pass"
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(prompt);
                handleDiscover(prompt);
              }}
              className="px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
            >
              “{prompt}”
            </button>
          ))}
        </div>
      </div>

      {/* Discovery Pipeline & Recommended Service (Section 11, 12, 16) */}
      {intentResult && (
        <div className="space-y-6">
          {/* Reasoning Pipeline: Citizen Request -> Intent Detection -> Entity Extraction -> Service Matching -> Eligibility -> Application Journey */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                  Discovery Pipeline Explanation
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                  Confidence: {Math.round(intentResult.confidence * 100)}%
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Citizen Persona: <strong className="text-slate-800">{currentCitizen?.name}</strong>
              </span>
            </div>

            {/* Stepper Pipeline */}
            <div className="overflow-x-auto pb-1">
              <div className="flex items-center space-x-2 text-xs font-medium text-slate-600 min-w-[700px]">
                <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-bold text-slate-800 shadow-2xs">
                  Citizen Request
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-bold text-slate-800 shadow-2xs">
                  Intent Detection
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-bold text-slate-800 shadow-2xs">
                  Entity Extraction
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="px-3 py-1.5 rounded-lg bg-blue-700 text-white font-bold shadow-xs">
                  Service Matching
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold shadow-xs">
                  Eligibility & Existing Data
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-bold text-slate-800 shadow-2xs">
                  Application Journey
                </div>
              </div>
            </div>

            {/* Explanation lines */}
            <div className="space-y-1.5 text-xs text-slate-700 pt-1">
              {intentResult.reasoning.map((r, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Service Details (Section 11) */}
          <div className="bg-white border-2 border-blue-600/30 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 font-mono">
                  RECOMMENDED SERVICE
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {intentResult.matched_service.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Administering Department: <strong className="text-slate-700">{intentResult.matched_service.department}</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Processing Standard</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {intentResult.matched_service.avg_processing_time}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {intentResult.matched_service.description}
            </p>

            {/* Eligibility & Involved Departments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Eligibility Criteria
                </span>
                <ul className="space-y-1.5 text-slate-600">
                  {intentResult.matched_service.eligibility_criteria.map((crit, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Connected Ministerial Systems (5 Gateways)
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {intentResult.connected_systems.map((sys, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium text-xs shadow-2xs"
                    >
                      {sys.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ZERO RE-ENTRY ENGINE (Section 16) */}
            <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-300 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-3">
                <div className="flex items-center space-x-2">
                  <FileCheck2 className="w-5 h-5 text-emerald-700" />
                  <div>
                    <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider">
                      ENTER ONCE. REUSE WITH CONSENT. (SECTION 16)
                    </h3>
                    <p className="text-xs text-emerald-800">
                      GovBridge detected verified records in authorized government systems.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-800 bg-white px-3 py-1 rounded-full border border-emerald-300">
                  100% Pre-Verified Data
                </span>
              </div>

              {/* Already Available Data attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(intentResult.available_verified_data).map(([fieldKey, info]) => (
                  <div key={fieldKey} className="p-3 rounded-lg bg-white border border-emerald-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block truncate">
                      {fieldKey.split('.').pop()?.replace(/_/g, ' ')}
                    </span>
                    <div className="text-sm font-bold text-slate-900 mt-0.5 truncate">
                      {info.value}
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                      Source: {info.source}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button: Use Existing Information */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-emerald-900 font-medium flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Data sharing requires your explicit DPDP consent in the next step.</span>
                </div>

                <button
                  onClick={handleApplyWithZeroReentry}
                  disabled={isSubmittingApp}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingApp ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Use Existing Information (Apply Now)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Catalog (Section 11) */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Government Services Catalog</h2>
            <p className="text-xs text-slate-600">Explore supported interoperable government schemes</p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold font-mono text-blue-700 uppercase">
                    {service.department}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {service.current_status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {service.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {service.description}
                </p>

                <div className="pt-1">
                  <span className="text-[10px] font-bold text-slate-700 uppercase">Eligibility Criteria:</span>
                  <ul className="mt-1 space-y-1 text-xs text-slate-500">
                    {service.eligibility_criteria.slice(0, 2).map((c, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  SLA: <strong className="text-emerald-700">{service.avg_processing_time}</strong>
                </span>

                <button
                  onClick={() => {
                    setQuery(service.name);
                    handleDiscover(service.name);
                  }}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center space-x-1 cursor-pointer"
                >
                  <span>Select Scheme</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
