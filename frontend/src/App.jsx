import React, { useState, useEffect } from 'react';
import { apiFetch } from './api';
import CinematicLaunch from './components/CinematicLaunch';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PresentationGuideModal from './components/PresentationGuideModal';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import WhyIsItStuckModal from './components/WhyIsItStuckModal';

import HomeView from './views/HomeView';
import ServicesView from './views/ServicesView';
import ServiceGraphView from './views/ServiceGraphView';
import JourneyView from './views/JourneyView';
import DataPassportView from './views/DataPassportView';
import ConsentWalletView from './views/ConsentWalletView';
import DocumentsView from './views/DocumentsView';
import IntegrationsView from './views/IntegrationsView';
import SystemHealthView from './views/SystemHealthView';
import ConflictsView from './views/ConflictsView';
import LineageView from './views/LineageView';
import AnalyticsView from './views/AnalyticsView';
import AuditView from './views/AuditView';

export default function App() {
  const [showLaunch, setShowLaunch] = useState(false);
  const [mode, setMode] = useState('citizen'); // 'citizen' or 'admin'
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [lang, setLang] = useState('en');

  // Modals
  const [showGuide, setShowGuide] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showStuckModal, setShowStuckModal] = useState(false);

  // Data state
  const [currentCitizen, setCurrentCitizen] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [healthData, setHealthData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [stuckDiagnosis, setStuckDiagnosis] = useState(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [prefilledServiceQuery, setPrefilledServiceQuery] = useState('');
  const [integrationsSubTab, setIntegrationsSubTab] = useState('hub');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [meRes, healthRes, appsRes] = await Promise.all([
        apiFetch('/api/me'),
        apiFetch('/api/system/health'),
        apiFetch('/api/applications')
      ]);

      const meData = await meRes.json();
      setCurrentCitizen(meData.citizen);
      setPersonas(meData.available_personas || []);

      const hData = await healthRes.json();
      setHealthData(hData);

      const aData = await appsRes.json();
      setApplications(aData);

      if (aData.length > 0) {
        const stuckRes = await apiFetch(`/api/applications/${aData[0].id}/stuck`);
        const diag = await stuckRes.json();
        setStuckDiagnosis(diag);
      }
    } catch (err) {
      console.error("Initialization fetch error:", err);
    }
  };

  const handleSwitchCitizen = async (citizenId) => {
    try {
      const res = await apiFetch(`/api/switch-citizen/${citizenId}`, { method: 'POST' });
      const data = await res.json();
      setCurrentCitizen(data.citizen);
      const appsRes = await apiFetch('/api/applications');
      setApplications(await appsRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplicationCreated = (appRecord) => {
    setApplications(prev => [appRecord, ...prev]);
    setActiveTab('journey');
  };

  const handleSimulateRecovery = async () => {
    setIsRecovering(true);
    try {
      await apiFetch('/api/sandbox/simulate-recovery', { method: 'POST' });
      await fetchInitialData();
      if (showStuckModal) {
        setShowStuckModal(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRecovering(false);
    }
  };

  // 21-Step Presentation Flow Executor (Section 49-52, 68)
  const handleExecutePresentationStep = async (stepObj) => {
    if (stepObj.action === 'replay_launch') {
      setShowLaunch(true);
      return;
    }

    if (stepObj.mode) {
      setMode(stepObj.mode);
    }

    if (stepObj.view) {
      setActiveTab(stepObj.view);
    }

    if (stepObj.action === 'fill_scholarship_query' || stepObj.action === 'run_intent_match') {
      setPrefilledServiceQuery('I want to apply for a scholarship');
    } else if (stepObj.action === 'create_scholarship_app') {
      try {
        const res = await apiFetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: 'service_scholarship_01',
            citizen_id: currentCitizen?.id || 'citizen_01'
          })
        });
        const app = await res.json();
        setApplications(prev => [app, ...prev.filter(a => a.id !== app.id)]);
        setActiveTab('journey');
      } catch (e) {
        console.error(e);
      }
    } else if (stepObj.action === 'show_schema_change') {
      setIntegrationsSubTab('schema-mapping');
    } else if (stepObj.action === 'simulate_failure') {
      await apiFetch('/api/sandbox/simulate-failure', { method: 'POST' });
      await fetchInitialData();
    } else if (stepObj.action === 'open_stuck_diagnosis') {
      setShowStuckModal(true);
    } else if (stepObj.action === 'simulate_recovery') {
      await handleSimulateRecovery();
    } else if (stepObj.action === 'open_voice_modal') {
      setShowVoiceModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Cinematic Launch Sequence */}
      {showLaunch && (
        <CinematicLaunch onComplete={() => setShowLaunch(false)} />
      )}

      {/* 2. Top Civic Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mode={mode}
        setMode={setMode}
        currentCitizen={currentCitizen}
        onSwitchCitizen={handleSwitchCitizen}
        personas={personas}
        onOpenVoice={() => setShowVoiceModal(true)}
        onOpenGuide={() => setShowGuide(true)}
        onReplayLaunch={() => setShowLaunch(true)}
        lang={lang}
        setLang={setLang}
      />

      {/* 3. Main Body: Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mode={mode}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          conflictsCount={1}
          schemaAlertsCount={1}
          stuckCount={applications[0]?.stuck_diagnosis?.is_stuck ? 1 : 0}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">
          {activeTab === 'home' && (
            <HomeView
              onNavigate={(tab) => setActiveTab(tab)}
              currentCitizen={currentCitizen}
              activeApplication={applications[0]}
              onOpenStuckModal={() => setShowStuckModal(true)}
              healthData={healthData}
            />
          )}

          {activeTab === 'services' && (
            <ServicesView
              currentCitizen={currentCitizen}
              onApplicationCreated={handleApplicationCreated}
              onNavigate={(tab) => setActiveTab(tab)}
              prefilledQuery={prefilledServiceQuery}
            />
          )}

          {activeTab === 'service-graph' && (
            <ServiceGraphView onNavigate={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'journey' && (
            <JourneyView
              applications={applications}
              onRefresh={fetchInitialData}
              onOpenStuckModal={() => setShowStuckModal(true)}
              onSimulateRecovery={handleSimulateRecovery}
              isRecovering={isRecovering}
            />
          )}

          {activeTab === 'passport' && (
            <DataPassportView currentCitizen={currentCitizen} />
          )}

          {activeTab === 'consent' && (
            <ConsentWalletView currentCitizen={currentCitizen} />
          )}

          {activeTab === 'documents' && (
            <DocumentsView currentCitizen={currentCitizen} />
          )}

          {activeTab === 'system-status' && (
            <SystemHealthView
              onSimulateRecovery={handleSimulateRecovery}
              isRecovering={isRecovering}
            />
          )}

          {activeTab === 'integrations' && (
            <IntegrationsView initialSubTab={integrationsSubTab} />
          )}

          {activeTab === 'conflicts' && (
            <ConflictsView currentCitizen={currentCitizen} />
          )}

          {activeTab === 'lineage' && (
            <LineageView />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView />
          )}

          {activeTab === 'audit' && (
            <AuditView />
          )}

          {activeTab === 'help' && (
            <div className="max-w-4xl mx-auto space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">How GovBridge Works</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                GovBridge is a Government Digital Interoperability Platform connecting ministerial databases (Education, Revenue, UIDAI, PFMS, NSP) into one unified citizen journey.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900">Zero Re-Entry</strong>
                  <p className="text-slate-600">Once your information is verified in an authorized system, you never have to type it again.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900">DPDP Consent Wallet</strong>
                  <p className="text-slate-600">You retain full legal ownership over which government department can access your data.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900">Self-Healing APIs</strong>
                  <p className="text-slate-600">If an external department API has high latency or goes down, GovBridge buffers the request and retries automatically.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900">Transparent Diagnostics</strong>
                  <p className="text-slate-600">Click "Why is my application stuck?" to view live system state rather than generic automated replies.</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer (Section 1, 70 Brand Statement) */}
          <footer className="mt-16 pt-8 border-t border-slate-200 text-center space-y-2 pb-6">
            <p className="text-sm font-semibold text-slate-700 italic">
              “Government systems may be different. The citizen journey shouldn't be.”
            </p>
            <div className="text-xs text-slate-500 font-medium">
              <strong className="text-blue-700">GOVBRIDGE</strong> — One Citizen Journey. Connected Government Systems.
            </div>
            <div className="text-[11px] text-slate-400">
              Smart India Hackathon (SIH 2026) Grand Finalist Edition • Trusted Digital Public Infrastructure
            </div>
          </footer>
        </main>
      </div>

      {/* Global Modals */}
      <PresentationGuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        onExecuteStep={handleExecutePresentationStep}
        currentStepIndex={currentStepIndex}
        setCurrentStepIndex={setCurrentStepIndex}
      />

      <VoiceAssistantModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        role={mode}
      />

      <WhyIsItStuckModal
        isOpen={showStuckModal}
        onClose={() => setShowStuckModal(false)}
        diagnosis={stuckDiagnosis}
        onSimulateRecovery={handleSimulateRecovery}
        isRecovering={isRecovering}
      />
    </div>
  );
}
