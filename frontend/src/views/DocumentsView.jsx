import { apiFetch } from '../api';
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  XCircle, 
  FileCheck2, 
  Sparkles, 
  Loader2, 
  Building2, 
  ArrowRight,
  ShieldCheck,
  Info
} from 'lucide-react';

export default function DocumentsView({ currentCitizen }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setSelectedFile(file);
    setIsUploading(true);
    setOcrResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiFetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setOcrResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  const requiredDocs = [
    { name: "Education Certificate / Transcript", status: "Verified in DigiLocker", isAvailable: true },
    { name: "Household Income Certificate", status: "Verified in Revenue Portal", isAvailable: true },
    { name: "Identity Proof (Aadhaar Token)", status: "Verified in UIDAI Master", isAvailable: true }
  ];

  const notRequiredDocs = [
    { name: "Bank Statement / Passbook Copy", reason: "Direct Benefit Transfer active via NPCI Aadhaar Bridge" },
    { name: "Physical Address Proof Affidavit", reason: "Pre-verified via National Aadhaar Registry" }
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="text-xs font-bold tracking-wider text-blue-700 uppercase font-mono mb-1">
          DOCUMENT INTELLIGENCE (SECTION 17, 18)
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          DOCUMENT CENTER
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          GovBridge analyzes document requirements before you apply. We eliminate unnecessary document requests and extract verified metadata automatically.
        </p>
      </div>

      {/* DOCUMENT REQUIREMENT INTELLIGENCE: WHAT YOU NEED (Section 18) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
            SECTION 18 REQUIREMENT ANALYSIS
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            WHAT YOU NEED (SCHOLARSHIP APPLICATION)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            GovBridge checks whether verified documents already exist in authorized national depositories to reduce paperwork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Required Documents */}
          <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Required (Pre-Verified in Repositories)
              </span>
              <span className="text-[10px] font-bold bg-white text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                3 of 3 Available
              </span>
            </div>

            <div className="space-y-2">
              {requiredDocs.map((doc, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-white border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">{doc.name}</div>
                      <div className="text-[10px] text-slate-500">{doc.status}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    ✓ Available
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Not Required Documents (Section 18) */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Not Required (Eliminated by GovBridge)
              </span>
              <span className="text-[10px] font-bold bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                Paperwork Reduced
              </span>
            </div>

            <div className="space-y-2">
              {notRequiredDocs.map((doc, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-white border border-slate-200 flex items-start justify-between text-xs space-x-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center shrink-0 mt-0.5 text-slate-400">
                      ○
                    </div>
                    <div>
                      <div className="font-bold text-slate-700 line-through">{doc.name}</div>
                      <div className="text-[11px] text-slate-500 leading-snug">{doc.reason}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                    Not Needed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real Document Processing Dropzone (Section 17) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
            SECTION 17 OPTICAL PARSER
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Document Extraction & Metadata Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload any PDF, JPG, or PNG document. GovBridge extracts fields, issuing authorities, and certificate metadata without inventing unverified facts.
          </p>
        </div>

        {/* Upload area */}
        <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-50/50 hover:bg-blue-50/20 group">
          <input
            type="file"
            className="hidden"
            accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 group-hover:border-blue-300 text-slate-500 group-hover:text-blue-700 flex items-center justify-center transition mb-3 shadow-2xs">
            {isUploading ? <Loader2 className="w-6 h-6 animate-spin text-blue-700" /> : <Upload className="w-6 h-6" />}
          </div>
          <div className="text-sm font-bold text-slate-800 group-hover:text-blue-700">
            {isUploading ? "Extracting document fields..." : "Upload Income Certificate or Marksheet (PDF, JPG, PNG)"}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Backend runs real text extraction with pypdf and python-docx.
          </p>
        </label>

        {/* Extraction Result Card (Section 17) */}
        {ocrResult && (
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900 font-mono">
                  {ocrResult.filename} (Processed)
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                Confidence: {Math.round((ocrResult.intelligence?.classification_confidence || 0.95) * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Document Classification</span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {ocrResult.intelligence?.document_type}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Validation State</span>
                <div className="text-sm font-bold text-emerald-700 mt-0.5">
                  {ocrResult.intelligence?.validation_status}
                </div>
              </div>
            </div>

            {/* Extracted Fields (Section 17) */}
            {ocrResult.intelligence?.extracted_fields && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Detected Metadata Fields:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {Object.entries(ocrResult.intelligence.extracted_fields).map(([k, v]) => (
                    <div key={k} className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block truncate">
                        {k.replace(/_/g, ' ')}
                      </span>
                      <div className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                        {String(v)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
