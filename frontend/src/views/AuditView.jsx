import { apiFetch } from '../api';
import React, { useState, useEffect } from 'react';
import { 
  ScrollText, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Lock
} from 'lucide-react';

export default function AuditView() {
  const [logs, setLogs] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState('ALL');

  useEffect(() => {
    fetchAudit();
  }, []);

  const fetchAudit = async () => {
    try {
      const res = await apiFetch('/api/audit');
      const data = await res.json();
      setLogs(data);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredLogs = logs.filter(item => {
    const matchesSearch = 
      item.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.actor.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.purpose.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesResult = selectedResult === 'ALL' ? true : item.result === selectedResult;
    return matchesSearch && matchesResult;
  });

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-bold tracking-wider text-blue-700 uppercase font-mono mb-1">
            IMMUTABLE AUDIT TRAIL (SECTION 33)
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            AUDIT LOG
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Tamper-evident record of all inter-system data requests, citizen consent verifications, and cross-department transfers.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold flex items-center space-x-1.5 shadow-2xs">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>Cryptographic Access Log</span>
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search by actor, department, action, or purpose..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
          />
        </div>

        {/* Result Filter Chips */}
        <div className="flex items-center space-x-1 text-xs font-mono">
          {['ALL', 'SUCCESS', 'QUEUED', 'VERIFIED_SUCCESS', 'ALERT_TRIGGERED'].map((res) => (
            <button
              key={res}
              onClick={() => setSelectedResult(res)}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                selectedResult === res
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {res}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Entries List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Audit ID & Timestamp</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Purpose & Statutory Basis</th>
                <th className="py-3.5 px-4">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => {
                const isQueued = log.result === 'QUEUED' || log.result === 'TIMEOUT_INTERCEPTED';
                const isSuccess = log.result.includes('SUCCESS') || log.result.includes('VERIFIED') || log.result.includes('CONSENT');

                return (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                      <div className="font-bold text-slate-900">{log.id}</div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString()} IST
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-blue-700 whitespace-nowrap">
                      {log.actor}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      {log.department}
                    </td>
                    <td className="py-3.5 px-4 text-slate-900 font-semibold">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs text-xs">
                      {log.purpose}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isQueued
                          ? 'bg-amber-100 text-amber-800'
                          : isSuccess
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {log.result}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
