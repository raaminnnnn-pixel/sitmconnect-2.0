import React, { useState } from 'react';
import { UserCheck, Eye, Play, CheckCircle2, Trash2, RefreshCw, AlertTriangle, Shield, Check } from 'lucide-react';
import { ProblemReport, Status } from '../types';

interface AdminDashboardProps {
  reports: ProblemReport[];
  onUpdateStatus: (id: string, newStatus: Status) => void;
  onDeleteReport: (id: string) => void;
  onResetSeedData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  reports,
  onUpdateStatus,
  onDeleteReport,
  onResetSeedData,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const pendingCount = reports.filter(r => r.status === 'Reported').length;
  const seenCount = reports.filter(r => r.status === 'Seen').length;
  const inProgressCount = reports.filter(r => r.status === 'In Progress').length;
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length;

  const filteredReports = filterStatus === 'All' 
    ? reports 
    : reports.filter(r => r.status === filterStatus);

  return (
    <section id="admin" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Admin Panel Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Campus Maintenance Dispatch Console</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Admin Issue Management
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Staff & Maintenance portal to view reported issues, update progress, and mark resolved.
          </p>
        </div>

        {/* Reset Seed Data Control */}
        <button
          onClick={() => {
            if (window.confirm('Reset all demo report data back to initial state?')) {
              onResetSeedData();
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-white/10"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Admin Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        
        <div className="glass-card rounded-2xl p-4 border border-red-500/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Review</span>
          <div className="text-2xl font-black text-red-400 font-mono mt-1">🔴 {pendingCount}</div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-blue-500/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Seen / Acknowledged</span>
          <div className="text-2xl font-black text-blue-400 font-mono mt-1">👁️ {seenCount}</div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-amber-500/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">In Progress</span>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">🟡 {inProgressCount}</div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-emerald-500/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Resolved</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">🟢 {resolvedCount}</div>
        </div>

      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-400 mr-2 shrink-0">Filter Table:</span>
        {['All', 'Reported', 'Seen', 'In Progress', 'Resolved'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              filterStatus === st
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'glass-card-light text-slate-300 hover:text-white'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Issues Table */}
      <div className="glass-card rounded-3xl border border-white/15 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            
            {/* Table Header */}
            <thead className="bg-[#2a080e]/90 text-[#e6c5a0] font-bold uppercase tracking-wider border-b border-[#5c1321]">
              <tr>
                <th className="p-4">Report ID & Title</th>
                <th className="p-4">Location</th>
                <th className="p-4">Student Details</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Current Status</th>
                <th className="p-4 text-center">Quick Admin Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#5c1321]/50 text-slate-200">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                    No reports match this status filter.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-[#800020]/20 transition-colors">
                    
                    {/* Issue Title & ID */}
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#e6c5a0] bg-[#800020]/40 px-2 py-0.5 rounded text-[11px] border border-[#c89f78]/30">
                          {report.id}
                        </span>
                        <span className="text-slate-400 text-[11px]">{report.category}</span>
                      </div>
                      <div className="font-bold text-white text-sm">{report.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{report.description}</div>
                    </td>

                    {/* Location */}
                    <td className="p-4 font-semibold text-slate-200">
                      {report.location}
                    </td>

                    {/* Student / Reporter Details */}
                    <td className="p-4">
                      {report.isAnonymous ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#e6c5a0] bg-[#3d0c14] px-2 py-1 rounded border border-[#c89f78]/30">
                          🔒 Anonymous
                        </span>
                      ) : (
                        <div className="space-y-0.5 text-xs">
                          <div className="font-bold text-white">{report.reporterName || 'Student'}</div>
                          {report.reporterDept && <div className="text-[11px] text-[#c89f78]">{report.reporterDept}</div>}
                          {report.reporterPhone && <div className="text-[11px] text-slate-300 font-mono">📞 {report.reporterPhone}</div>}
                          {report.residenceType && (
                            <div className="text-[10px] text-slate-300 mt-1">
                              <span className="px-1.5 py-0.5 bg-[#800020]/50 text-[#e6c5a0] border border-[#c89f78]/30 rounded font-semibold">
                                {report.residenceType}
                              </span>
                              {report.residenceType === 'Hosteller' && (report.roomNo || report.floorNo) && (
                                <span className="ml-1 text.slate-400">
                                  {report.roomNo && `Rm: ${report.roomNo}`} {report.floorNo && `(${report.floorNo})`}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Priority */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                        report.priority === 'High' || report.priority === 'Emergency'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : report.priority === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {report.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className="font-bold text-slate-100 flex items-center gap-1.5">
                        {report.status === 'Reported' && '🔴 Reported'}
                        {report.status === 'Seen' && '🔵 Seen'}
                        {report.status === 'In Progress' && '🟡 In Progress'}
                        {report.status === 'Resolved' && '🟢 Resolved'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        
                        {/* Mark as Seen Button */}
                        <button
                          onClick={() => onUpdateStatus(report.id, 'Seen')}
                          disabled={report.status !== 'Reported'}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                            report.status === 'Reported'
                              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                          title="Mark as Seen"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Seen</span>
                        </button>

                        {/* Start Work Button */}
                        <button
                          onClick={() => onUpdateStatus(report.id, 'In Progress')}
                          disabled={report.status === 'In Progress' || report.status === 'Resolved'}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                            report.status !== 'In Progress' && report.status !== 'Resolved'
                              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                          title="Start Work"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Start Work</span>
                        </button>

                        {/* Resolve Button */}
                        <button
                          onClick={() => onUpdateStatus(report.id, 'Resolved')}
                          disabled={report.status === 'Resolved'}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                            report.status !== 'Resolved'
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          }`}
                          title="Resolve Issue"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{report.status === 'Resolved' ? 'Resolved ✓' : 'Resolve'}</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete report ${report.id}?`)) {
                              onDeleteReport(report.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </section>
  );
};
