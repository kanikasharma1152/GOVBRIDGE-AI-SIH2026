import React, { useState } from 'react';
import { 
  Shield, 
  BookOpen, 
  DollarSign, 
  Landmark, 
  Award, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Key, 
  ArrowRight,
  Info
} from 'lucide-react';

const GRAPH_NODES = [
  {
    id: "identity_api",
    name: "Identity System (UIDAI)",
    shortName: "IDENTITY",
    dept: "Ministry of Electronics & IT (MeitY)",
    x: 400,
    y: 70,
    status: "healthy",
    latency: "112ms",
    auth: "OAuth2.0 + mTLS + HMAC Token",
    version: "v3.4.1",
    dataProvided: ["person.name", "person.date_of_birth", "person.gender", "person.address"],
    dataRequested: ["aadhaar_token", "biometric_hash"],
    dependencies: ["Aadhaar Master HSM", "UIDAI Biometric Engine"],
    lastSync: "2026-09-28T20:58:12Z",
    services: ["Identity Verification", "Biometric e-KYC", "Demographic Attestation"],
    icon: Shield
  },
  {
    id: "education_api",
    name: "Education System (DigiLocker/NAD)",
    shortName: "EDUCATION",
    dept: "Ministry of Education & DigiLocker",
    x: 160,
    y: 220,
    status: "healthy",
    latency: "185ms",
    auth: "DigiLocker Partner API Key + RSA-4096",
    version: "v2.8.0",
    dataProvided: ["education.institution", "education.enrollment_id", "education.cgpa", "education.degree_awarded"],
    dataRequested: ["abc_id", "aadhaar_ref"],
    dependencies: ["UGC Academic Bank of Credits (ABC)", "DigiLocker Central Vault"],
    lastSync: "2026-09-28T20:59:01Z",
    services: ["University Transcripts", "Marksheet Depository", "Course Attestation"],
    icon: BookOpen
  },
  {
    id: "govbridge_core",
    name: "GovBridge Interoperability Core",
    shortName: "GOVBRIDGE",
    dept: "National Interoperability Infrastructure",
    x: 400,
    y: 220,
    status: "healthy",
    latency: "12ms",
    auth: "Internal Mutual TLS + Token Broker",
    version: "v2.0.0",
    dataProvided: ["canonical.data_layer", "canonical.eligibility_passed"],
    dataRequested: ["all_ministerial_tokens"],
    dependencies: ["Canonical Schema Registry", "Circuit Breaker Queue"],
    lastSync: "2026-09-28T21:00:00Z",
    services: ["Service Graph Routing", "Zero Re-entry Engine", "Consent Engine"],
    icon: Layers
  },
  {
    id: "income_api",
    name: "Income Department Gateway",
    shortName: "INCOME",
    dept: "Department of Revenue & State Land Records",
    x: 640,
    y: 220,
    status: "degraded",
    latency: "8.9s (38.2s peak lag)",
    auth: "State Gateway JWT Bearer + e-Pramaan",
    version: "v1.9.4",
    dataProvided: ["financial.income.annual_gross", "financial.income.certificate_number", "financial.income.status"],
    dataRequested: ["certificate_no", "applicant_aadhaar_hash"],
    dependencies: ["State Sub-Registrar Database", "Income Tax PAN Linker"],
    lastSync: "2026-09-28T20:41:10Z",
    services: ["Income Certificate Verification", "EWS Status Check"],
    icon: DollarSign
  },
  {
    id: "scholarship_api",
    name: "Scholarship System (NSP)",
    shortName: "SCHOLARSHIP",
    dept: "Ministry of Social Justice & Higher Education",
    x: 400,
    y: 350,
    status: "healthy",
    latency: "95ms",
    auth: "GovBridge Enterprise OAuth2.0 Token",
    version: "v5.2.0",
    dataProvided: ["scholarship.application_id", "scholarship.sanction_amount"],
    dataRequested: ["person.name", "person.dob", "education.cgpa", "financial.income.annual_gross", "financial.bank.account_status"],
    dependencies: ["GovBridge Core", "Central Sanction Engine"],
    lastSync: "2026-09-28T20:59:30Z",
    services: ["Post-Matric Merit Scheme", "Central Sector Scheme"],
    icon: Award
  },
  {
    id: "bank_api",
    name: "Banking & Payment System (PFMS)",
    shortName: "BANKING",
    dept: "Ministry of Finance & NPCI",
    x: 400,
    y: 450,
    status: "healthy",
    latency: "310ms",
    auth: "NPCI PKI Token + Encrypted Payload",
    version: "v4.1.0",
    dataProvided: ["financial.bank.account_status", "financial.bank.ifsc_valid", "financial.bank.dbt_enabled"],
    dataRequested: ["aadhaar_hash", "ifsc_code", "bank_acc_hash"],
    dependencies: ["Aadhaar Payment Bridge System (APBS)", "Core Banking Solution (CBS)"],
    lastSync: "2026-09-28T20:57:44Z",
    services: ["Aadhaar Seeding Verification", "Direct Benefit Transfer (DBT)"],
    icon: Landmark
  }
];

const GRAPH_EDGES = [
  { from: "identity_api", to: "govbridge_core", label: "Demographic Proof" },
  { from: "education_api", to: "govbridge_core", label: "CGPA 8.85 / 10" },
  { from: "income_api", to: "govbridge_core", label: "Income ₹1,80,000" },
  { from: "govbridge_core", to: "scholarship_api", label: "Orchestrated Payload" },
  { from: "scholarship_api", to: "bank_api", label: "DBT Payment Mandate" }
];

export default function ServiceGraphView({ onNavigate }) {
  const [selectedNode, setSelectedNode] = useState(GRAPH_NODES[2]); // Default to GovBridge Core

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-bold tracking-wider text-blue-700 uppercase font-mono mb-1">
            GOVERNMENT SERVICE GRAPH (SECTION 13)
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Interconnected Government Systems Graph
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Visual topology of connected government departments. Click any system to inspect APIs, data exchanged, dependencies, and permissions.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-semibold">
          <span className="flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Healthy (5)</span>
          </span>
          <span className="flex items-center space-x-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            <span>Degraded (1)</span>
          </span>
        </div>
      </div>

      {/* Main Interactive Diagram and Inspector (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Graph Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Connected Architecture Diagram
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Click node to inspect
            </span>
          </div>

          <svg className="w-full h-full min-h-[440px]" viewBox="0 0 800 520">
            {/* Edges */}
            {GRAPH_EDGES.map((edge, idx) => {
              const from = GRAPH_NODES.find(n => n.id === edge.from);
              const to = GRAPH_NODES.find(n => n.id === edge.to);
              if (!from || !to) return null;

              const isConnectedToSelected = selectedNode?.id === edge.from || selectedNode?.id === edge.to;

              return (
                <g key={idx}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isConnectedToSelected ? "#2563eb" : "#cbd5e1"}
                    strokeWidth={isConnectedToSelected ? 2.5 : 1.5}
                    strokeDasharray={edge.from === 'income_api' ? "4 4" : "none"}
                  />
                  <text
                    x={(from.x + to.x) / 2}
                    y={(from.y + to.y) / 2 - 6}
                    fill={isConnectedToSelected ? "#1d4ed8" : "#64748b"}
                    fontSize="10"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {GRAPH_NODES.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isCore = node.id === 'govbridge_core';
              const isDegraded = node.status === 'degraded';

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer"
                >
                  {/* Outer circle / box */}
                  <rect
                    x="-65"
                    y="-28"
                    width="130"
                    height="56"
                    rx="12"
                    fill={isCore ? "#0f172a" : isSelected ? "#eff6ff" : "#ffffff"}
                    stroke={
                      isCore
                        ? "#1d4ed8"
                        : isSelected
                        ? "#2563eb"
                        : isDegraded
                        ? "#f59e0b"
                        : "#e2e8f0"
                    }
                    strokeWidth={isSelected || isCore ? 2.5 : 1.5}
                  />

                  {/* Status dot */}
                  <circle
                    cx="50"
                    cy="-14"
                    r="4"
                    fill={isDegraded ? "#d97706" : "#16a34a"}
                  />

                  {/* Node label */}
                  <text
                    textAnchor="middle"
                    y="-2"
                    fill={isCore ? "#ffffff" : isSelected ? "#1d4ed8" : "#0f172a"}
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="Inter, sans-serif"
                  >
                    {node.shortName}
                  </text>

                  <text
                    textAnchor="middle"
                    y="14"
                    fill={isCore ? "#93c5fd" : "#64748b"}
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {node.latency}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Identity • Education • Income • Scholarship • Banking</span>
            <span>Coordinated by GovBridge</span>
          </div>
        </div>

        {/* Node Specification Inspector (5 cols) (Section 13) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Department Inspector (Section 13)
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {selectedNode.name}
              </h2>
            </div>

            <span className={`px-2.5 py-0.5 rounded text-xs font-semibold uppercase ${
              selectedNode.status === 'degraded'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              ● {selectedNode.status}
            </span>
          </div>

          <div className="text-xs text-slate-600 font-medium">
            Owner Department: <strong className="text-slate-800">{selectedNode.dept}</strong>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Current Latency</span>
              <div className={`text-sm font-bold mt-0.5 ${selectedNode.status === 'degraded' ? 'text-amber-700' : 'text-slate-900'}`}>
                {selectedNode.latency}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase">API Version</span>
              <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                {selectedNode.version}
              </div>
            </div>
          </div>

          {/* Data Exchanged (Section 13) */}
          <div className="space-y-2 text-xs">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Data Exchanged (Canonical Scopes)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedNode.dataProvided.map((f, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-mono">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Connected Services (Section 13) */}
          <div className="space-y-2 text-xs">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Supported Services
            </span>
            <ul className="space-y-1 text-slate-600">
              {selectedNode.services.map((s, i) => (
                <li key={i} className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Authentication & Dependencies */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1 text-slate-600">
            <div>
              <strong className="text-slate-700">Authentication: </strong>
              <span className="font-mono text-[11px]">{selectedNode.auth}</span>
            </div>
            <div>
              <strong className="text-slate-700">Dependencies: </strong>
              <span>{selectedNode.dependencies.join(', ')}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono pt-1">
              Last Synchronization: {new Date(selectedNode.lastSync).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
