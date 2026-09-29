import { apiFetch } from '../api';
import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  Building2, 
  DollarSign, 
  Landmark, 
  CheckCircle2, 
  Lock, 
  Calendar,
  Briefcase,
  Award
} from 'lucide-react';

export default function DataPassportView({ currentCitizen }) {
  const [passportData, setPassportData] = useState(null);

  useEffect(() => {
    fetchPassport();
  }, [currentCitizen]);

  const fetchPassport = async () => {
    try {
      const res = await apiFetch('/api/data-passport');
      const data = await res.json();
      setPassportData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const categories = [
    {
      title: "Identity Information",
      dept: "UIDAI Aadhaar Master",
      icon: ShieldCheck,
      color: "text-blue-700",
      fields: passportData?.passport?.identity || {}
    },
    {
      title: "Education Credentials",
      dept: "DigiLocker / National Academic Depository (NAD)",
      icon: Building2,
      color: "text-indigo-700",
      fields: passportData?.passport?.education || {}
    },
    {
      title: "Income & Welfare Attestation",
      dept: "Department of Revenue & State Land Records",
      icon: DollarSign,
      color: "text-emerald-700",
      fields: passportData?.passport?.income || {}
    },
    {
      title: "Banking & DBT Mandate",
      dept: "NPCI / Public Financial Management System (PFMS)",
      icon: Landmark,
      color: "text-teal-700",
      fields: passportData?.passport?.bank || {}
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-bold tracking-wider text-blue-700 uppercase font-mono mb-1">
            DIGITAL DATA PASSPORT (SECTION 14)
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            MY DATA
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            A structured view of verified information authorized for use across supported government services. This is not an identity replacement, but a transparent citizen data inventory.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-slate-700 shadow-2xs">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>Aadhaar: {passportData?.aadhaar_masked || 'XXXX-XXXX-8821'}</span>
        </div>
      </div>

      {/* Grid of Categories (Section 14) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${cat.color}`} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      {cat.title}
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {cat.dept}
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified</span>
                </span>
              </div>

              {/* Attributes in Category */}
              <div className="space-y-3">
                {Object.entries(cat.fields).map(([k, item]) => (
                  <div
                    key={k}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                        {k.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.2 rounded border border-blue-200">
                        Sharing: Allowed
                      </span>
                    </div>

                    <div className="text-sm font-bold text-slate-900">
                      {item.value}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
                      <span>Source: {item.source}</span>
                      <span>Updated: {item.updated ? new Date(item.updated).toLocaleDateString() : 'Active'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
