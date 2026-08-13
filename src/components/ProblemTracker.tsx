import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Tag, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Eye, 
  ThumbsUp, 
  Sparkles,
  ChevronDown,
  Layers
} from 'lucide-react';
import { ProblemReport, Category, Status, Priority } from '../types';

interface ProblemTrackerProps {
  reports: ProblemReport[];
  onUpvote: (id: string) => void;
  onOpenReportModal: () => void;
}

export const ProblemTracker: React.FC<ProblemTrackerProps> = ({
  reports,
  onUpvote,
  onOpenReportModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  const categories = ['All', 'Electricity', 'Water', 'Cleanliness', 'Internet/Wi-Fi', 'Furniture', 'Classroom', 'Washroom', 'Campus Area', 'Other'];
  const statuses = ['All', 'Reported', 'Seen', 'In Progress', 'Resolved'];
  const priorities = ['All', 'Low', 'Medium', 'High', 'Emergency'];

  // Filter Reports based on search, category, status, priority
  const filteredReports = reports.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || item.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  // Timeline step active helper
  const getTimelineStepIndex = (status: Status) => {
    switch (status) {
      case 'Reported': return 0;
      case 'Seen': return 1;
      case 'In Progress': return 2;
      case 'Resolved': return 3;
      default: return 0;
    }
  };

  return (
    <section id="tracker" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Real-time Issue Tracker</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Campus Problem Directory
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Track status, timelines, and community upvotes for reported infrastructure problems.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
        >
          + Submit New Report
        </button>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 mb-6 border border-white/10 space-y-4">
        
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search problems by title, location or ID (e.g. CF-1024, Library, Room 204)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl glass-input text-sm focus:ring-2 focus:ring-[#c89f78] font-medium"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Secondary Category & Priority Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#24060b] text-[#f5efe6] border border-[#5c1321] px-3 py-1.5 rounded-lg font-medium text-xs focus:ring-1 focus:ring-[#c89f78]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-[#24060b] text-[#f5efe6] border border-[#5c1321] px-3 py-1.5 rounded-lg font-medium text-xs focus:ring-1 focus:ring-[#c89f78]"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Quick Status Filter Buttons Row directly above problem list */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-[#20050a]/90 p-2.5 sm:p-3 rounded-2xl border border-[#5c1321]">
        
        {/* Status Filter Buttons: All, Reported, In Progress, Resolved */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          
          {/* Button: All */}
          <button
            id="filter-status-all"
            onClick={() => setSelectedStatus('All')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
              selectedStatus === 'All'
                ? 'bg-gradient-to-r from-[#800020] via-[#a31c38] to-[#c89f78] text-[#fdfbf7] shadow-md shadow-maroon-950/60 border border-[#c89f78]/60'
                : 'bg-[#2f070f] text-[#d4c3b3] hover:text-white hover:bg-[#420a15] border border-[#5c1321]/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
              selectedStatus === 'All' ? 'bg-[#2a080e] text-[#fdfbf7]' : 'bg-[#180307] text-[#c89f78]'
            }`}>
              {reports.length}
            </span>
          </button>

          {/* Button: Reported */}
          <button
            id="filter-status-reported"
            onClick={() => setSelectedStatus('Reported')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
              selectedStatus === 'Reported'
                ? 'bg-rose-900/90 text-rose-100 border border-rose-500/80 shadow-md shadow-rose-950/60'
                : 'bg-[#2f070f] text-rose-300/80 hover:text-rose-100 hover:bg-[#420a15] border border-[#5c1321]/80'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Reported</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
              selectedStatus === 'Reported' ? 'bg-rose-950 text-rose-200' : 'bg-[#180307] text-rose-300'
            }`}>
              {reports.filter((r) => r.status === 'Reported').length}
            </span>
          </button>

          {/* Button: In Progress */}
          <button
            id="filter-status-in-progress"
            onClick={() => setSelectedStatus('In Progress')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
              selectedStatus === 'In Progress'
                ? 'bg-amber-900/90 text-amber-100 border border-amber-500/80 shadow-md shadow-amber-950/60'
                : 'bg-[#2f070f] text-amber-300/80 hover:text-amber-100 hover:bg-[#420a15] border border-[#5c1321]/80'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>In Progress</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
              selectedStatus === 'In Progress' ? 'bg-amber-950 text-amber-200' : 'bg-[#180307] text-amber-300'
            }`}>
              {reports.filter((r) => r.status === 'In Progress').length}
            </span>
          </button>

          {/* Button: Resolved */}
          <button
            id="filter-status-resolved"
            onClick={() => setSelectedStatus('Resolved')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
              selectedStatus === 'Resolved'
                ? 'bg-emerald-900/90 text-emerald-100 border border-emerald-500/80 shadow-md shadow-emerald-950/60'
                : 'bg-[#2f070f] text-emerald-300/80 hover:text-emerald-100 hover:bg-[#420a15] border border-[#5c1321]/80'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Resolved</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
              selectedStatus === 'Resolved' ? 'bg-emerald-950 text-emerald-200' : 'bg-[#180307] text-emerald-300'
            }`}>
              {reports.filter((r) => r.status === 'Resolved').length}
            </span>
          </button>

        </div>

        {/* Showing Count summary & reset */}
        <div className="flex items-center gap-2 text-xs text-slate-300 font-medium ml-auto">
          <span>Showing <strong className="text-white">{filteredReports.length}</strong> of {reports.length}</span>
          {(selectedStatus !== 'All' || selectedCategory !== 'All' || selectedPriority !== 'All' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedStatus('All');
                setSelectedCategory('All');
                setSelectedPriority('All');
                setSearchTerm('');
              }}
              className="text-xs text-[#c89f78] hover:underline font-bold ml-1"
            >
              Reset
            </button>
          )}
        </div>

      </div>

      {/* Problem Cards Grid */}
      {filteredReports.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-white/10 space-y-4">
          <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-xl font-bold text-white">No Matching Reports Found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Try adjusting your search criteria or filters, or be the first to report a problem!
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedStatus('All');
              setSelectedPriority('All');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-cyan-400 text-xs font-bold border border-cyan-500/30 hover:bg-slate-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map((report) => {
            const currentStepIdx = getTimelineStepIndex(report.status);

            // Priority Colors
            let priorityBadgeClass = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            if (report.priority === 'Medium') priorityBadgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
            if (report.priority === 'High') priorityBadgeClass = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
            if (report.priority === 'Emergency') priorityBadgeClass = 'bg-red-600/30 text-red-200 border-red-500 font-bold animate-pulse';

            // Status Badge Colors
            let statusBadgeClass = 'bg-red-500/20 text-red-300 border-red-500/30';
            if (report.status === 'Seen') statusBadgeClass = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            if (report.status === 'In Progress') statusBadgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
            if (report.status === 'Resolved') statusBadgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

            return (
              <div 
                key={report.id}
                className="glass-card rounded-2xl p-6 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Card Header: ID, Priority & Status Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                        {report.id}
                      </span>
                      <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-lg border ${priorityBadgeClass}`}>
                        {report.priority}
                      </span>
                    </div>

                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${statusBadgeClass}`}>
                      {report.status}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {report.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {report.description}
                  </p>

                  {/* Location & Reported Date */}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-b border-white/10 py-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-slate-200 font-semibold">{report.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{report.category}</span>
                    </div>
                    <div className="flex items-center gap-1.5 ml-auto">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{report.timeAgo}</span>
                    </div>
                  </div>

                  {/* Status Timeline Progress Bar Visual */}
                  <div className="mt-5 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Progress Timeline
                    </span>

                    <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold">
                      {['Reported', 'Seen', 'In Progress', 'Resolved'].map((step, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div key={step} className="flex flex-col items-center gap-1">
                            <div 
                              className={`w-full h-2 rounded-full transition-all duration-500 ${
                                isDone 
                                  ? idx === 3 ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-cyan-500 shadow-sm shadow-cyan-500/50'
                                  : 'bg-slate-800'
                              }`} 
                            />
                            <span className={`truncate px-1 ${
                              isCurrent ? 'text-cyan-400 font-black' : isDone ? 'text-slate-200' : 'text-slate-500'
                            }`}>
                              ● {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Footer Controls: Upvote & Reporter Info */}
                <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="text-[11px] text-slate-300">
                    {report.isAnonymous ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#3d0c14] text-[#e6c5a0] border border-[#c89f78]/30 font-semibold">
                        🔒 Anonymous Report
                      </span>
                    ) : (
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-medium">
                          <span className="text-slate-400">By:</span>
                          <span className="text-[#fdfbf7] font-bold">{report.reporterName || 'Student'}</span>
                          {report.reporterDept && <span className="text-[#c89f78]">({report.reporterDept})</span>}
                          {report.residenceType && (
                            <span className="px-1.5 py-0.2 text-[10px] bg-[#800020]/40 text-[#e6c5a0] border border-[#c89f78]/30 rounded font-semibold ml-1">
                              {report.residenceType}
                            </span>
                          )}
                        </div>
                        {report.residenceType === 'Hosteller' && (report.roomNo || report.floorNo) && (
                          <div className="text-[10px] text-slate-400 flex items-center gap-2">
                            {report.roomNo && <span>Room: <strong className="text-slate-200">{report.roomNo}</strong></span>}
                            {report.floorNo && <span>Floor: <strong className="text-slate-200">{report.floorNo}</strong></span>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onUpvote(report.id)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#3d0c14] hover:bg-[#800020] text-[#e6c5a0] border border-[#c89f78]/40 font-bold transition-all hover:scale-105 active:scale-95"
                    title="Upvote / Me Too affected"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-[#c89f78]" />
                    <span>{report.upvotes} Affected</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
