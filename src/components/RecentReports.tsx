import React from 'react';
import { Clock, MapPin, Tag, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ProblemReport } from '../types';

interface RecentReportsProps {
  reports: ProblemReport[];
  onViewAllClick: () => void;
}

export const RecentReports: React.FC<RecentReportsProps> = ({ reports, onViewAllClick }) => {
  // Take top 3 recent reports
  const recentItems = reports.slice(0, 3);

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-[#c89f78] uppercase tracking-wider">Live Feed</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fdfbf7] tracking-tight">
            Recent Campus Reports
          </h2>
        </div>

        <button
          onClick={onViewAllClick}
          className="flex items-center gap-1.5 text-xs font-bold text-[#c89f78] hover:text-[#e6c5a0] transition-colors group"
        >
          <span>View All Reports ({reports.length})</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentItems.map((report) => {
          let borderStripe = 'border-l-4 border-[#800020]';
          let priorityBadge = 'bg-[#800020]/20 text-[#f5efe6] border-[#800020]/40';
          
          if (report.status === 'In Progress') {
            borderStripe = 'border-l-4 border-amber-600';
            priorityBadge = 'bg-amber-950/80 text-amber-300 border-amber-800/60';
          } else if (report.status === 'Resolved') {
            borderStripe = 'border-l-4 border-emerald-600';
            priorityBadge = 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60';
          }

          return (
            <div 
              key={report.id}
              className={`p-4 bg-[#2a080e]/95 border border-[#5c1321] ${borderStripe} rounded-r-xl shadow-xl flex flex-col justify-between hover:border-[#c89f78]/40 transition-all`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-[10px] font-bold text-[#c89f78]">
                    {report.id}
                  </span>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${priorityBadge}`}>
                    {report.priority}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#fdfbf7] mb-1.5 leading-snug">
                  {report.title}
                </h4>

                <p className="text-xs text-[#d4c3b3] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#c89f78] inline" />
                  <span>{report.location}</span>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#5c1321]/80 flex items-center justify-between text-[11px] text-[#d4c3b3]">
                <span className="flex items-center gap-1 italic text-[#a38c7e]">
                  <Clock className="w-3 h-3 text-[#a38c7e]" />
                  {report.timeAgo}
                </span>
                <span className="font-semibold text-[#f5efe6]">{report.upvotes} Affected</span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
