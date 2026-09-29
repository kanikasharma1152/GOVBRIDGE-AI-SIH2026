import React from 'react';
import { 
  Shield, 
  Bell, 
  User, 
  Globe, 
  Compass, 
  Mic, 
  RotateCcw,
  CheckCircle2,
  Sliders,
  HelpCircle,
  ChevronDown,
  Download
} from 'lucide-react';

export default function Header({ 
  activeTab,
  setActiveTab,
  mode, 
  setMode, 
  currentCitizen, 
  onSwitchCitizen, 
  personas, 
  onOpenVoice,
  onOpenGuide,
  onReplayLaunch,
  lang,
  setLang,
  unreadCount = 2
}) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'journey', label: 'My Journey' },
    { id: 'documents', label: 'Documents' },
    { id: 'consent', label: 'Consent' },
    { id: 'system-status', label: 'System Status' },
    { id: 'help', label: 'Help' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Gov Info Utility Bar */}
      <div className="bg-slate-100 border-b border-slate-200/80 px-4 lg:px-8 py-1 flex items-center justify-between text-[11px] text-slate-600">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-700 flex items-center space-x-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Digital Public Infrastructure • Government Interoperability Platform</span>
          </span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="hidden sm:inline text-slate-500">Official Demonstration Environment (SIH 2026)</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center space-x-1 hover:text-blue-700 font-medium transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Quick presentation guide trigger */}
          <button
            onClick={onOpenGuide}
            className="flex items-center space-x-1 text-blue-700 hover:text-blue-900 font-semibold cursor-pointer"
            title="Interactive 21-step presentation flow for judges"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Judge Walkthrough (21 Steps)</span>
          </button>

          {/* Direct ZIP Download */}
          <a
            href="/api/download"
            download="GOVBRIDGE_SIH2026.zip"
            className="flex items-center space-x-1 text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
            title="Download complete project ZIP package"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Download ZIP</span>
          </a>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Descriptor (Section 7) */}
        <div className="flex items-center space-x-8">
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-xs">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  GOVBRIDGE
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                  INTEROP CORE
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Government Interoperability Platform
              </p>
            </div>
          </div>

          {/* Primary Navigation (Section 7) */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
                    isActive
                      ? 'text-blue-700 bg-blue-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Utility: Voice Assistant, Persona, Mode Switcher, Notifications */}
        <div className="flex items-center space-x-3">
          {/* Voice Assistant Button (Ask GovBridge) */}
          <button
            onClick={onOpenVoice}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition cursor-pointer"
            title="Ask GovBridge Voice Assistant"
          >
            <Mic className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Ask GovBridge</span>
          </button>

          {/* Citizen Persona Switcher (Section 48) */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5">
            <div className="px-2 py-1 text-xs text-slate-500 flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline font-medium">Citizen:</span>
            </div>
            <select
              value={currentCitizen?.id || "citizen_01"}
              onChange={(e) => onSwitchCitizen(e.target.value)}
              className="bg-white text-xs text-slate-800 font-semibold px-2 py-1 rounded border border-slate-200 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              {personas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.institution}) [DEMO]
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle: Citizen vs Admin */}
          <div className="flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-lg">
            <button
              onClick={() => setMode('citizen')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                mode === 'citizen'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Citizen View
            </button>
            <button
              onClick={() => setMode('admin')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                mode === 'admin'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin View
            </button>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button 
              onClick={() => setActiveTab('journey')}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
