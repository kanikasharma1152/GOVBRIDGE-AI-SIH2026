import React from 'react';
import {
  Home,
  Search,
  Network,
  Milestone,
  FileCheck2,
  Lock,
  FileText,
  PlugZap,
  Activity,
  AlertTriangle,
  GitBranch,
  BarChart3,
  ScrollText,
  Mic,
  ChevronLeft,
  ChevronRight,
  Shield,
  HelpCircle
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  mode, 
  collapsed, 
  setCollapsed,
  conflictsCount = 1,
  schemaAlertsCount = 1,
  stuckCount = 1
}) {
  const citizenNav = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'services', label: 'Find a Service', icon: Search, badge: 'Zero Re-entry' },
    { id: 'service-graph', label: 'Service Graph', icon: Network },
    { id: 'journey', label: 'My Journey', icon: Milestone, badge: stuckCount > 0 ? 'Active' : null, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'passport', label: 'My Data', icon: FileCheck2 },
    { id: 'consent', label: 'My Consents', icon: Lock, badge: 'DPDP' },
    { id: 'documents', label: 'Document Center', icon: FileText },
    { id: 'system-status', label: 'System Status', icon: Activity },
    { id: 'voice', label: 'Voice Assistant', icon: Mic }
  ];

  const adminNav = [
    { id: 'integrations', label: 'Integration Hub', icon: PlugZap, badge: schemaAlertsCount > 0 ? 'Drift' : null, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'service-graph', label: 'Service Graph', icon: Network },
    { id: 'system-status', label: 'Health & Sandbox', icon: Activity, badge: 'Digital Twin' },
    { id: 'conflicts', label: 'Data Conflicts', icon: AlertTriangle, badge: conflictsCount > 0 ? `${conflictsCount}` : null, badgeColor: 'bg-red-100 text-red-800' },
    { id: 'lineage', label: 'Data Lineage', icon: GitBranch },
    { id: 'analytics', label: 'Bottlenecks & SLA', icon: BarChart3, badge: '8.9s Lag', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'audit', label: 'Audit Log', icon: ScrollText },
    { id: 'journey', label: 'Application Tracer', icon: Milestone }
  ];

  const navItems = mode === 'citizen' ? citizenNav : adminNav;

  return (
    <aside
      className={`h-[calc(100vh-65px)] border-r border-slate-200 bg-white flex flex-col justify-between transition-all duration-200 sticky top-[65px] z-30 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Nav Items */}
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? 'NAV' : (mode === 'citizen' ? 'Citizen Navigation' : 'Infrastructure Administration')}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center rounded-xl px-3 py-2.5 text-xs font-semibold transition cursor-pointer relative ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-blue-700' : 'text-slate-400'
                }`}
              />

              {!collapsed && (
                <span className="ml-3 truncate tracking-tight flex-1 text-left">
                  {item.label}
                </span>
              )}

              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {collapsed && item.badge && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Collapse Button */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 transition cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : (
            <div className="flex items-center space-x-2 text-xs font-semibold">
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
