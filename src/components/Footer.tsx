import React from 'react';
import { Sparkles, Heart, Code, Github, ExternalLink } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenReportModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenReportModal }) => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#070d1e] text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#800020] to-[#c89f78] flex items-center justify-center text-white font-extrabold text-sm">
                SC
              </div>
              <span className="text-xl font-black text-white tracking-tight">SITMCONNECT</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering college students and maintenance teams to collaborate on campus infrastructure fixes.
            </p>
            <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/30">
              🎓 1st Semester CSE Capstone Project
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform Links</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-cyan-400 transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-cyan-400 transition-colors">
                  Analytics Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('tracker')} className="hover:text-cyan-400 transition-colors">
                  Problem Directory & Tracker
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('map')} className="hover:text-cyan-400 transition-colors">
                  Interactive Campus Map
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Problem Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Issue Categories</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>💡 Electrical & Lighting Repairs</li>
              <li>🚰 Water & Plumbing Leaks</li>
              <li>🧹 Sanitation & Trash Overflow</li>
              <li>📶 Campus Wi-Fi & Network APs</li>
              <li>🪑 Classroom Desks & Furniture</li>
            </ul>
          </div>

          {/* Col 4: Quick Action */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Report An Issue</h4>
            <p className="text-xs text-slate-400">
              Noticed something broken on campus? Submit a report in under 30 seconds.
            </p>
            <button
              onClick={onOpenReportModal}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md hover:scale-105 transition-all"
            >
              + Submit Report
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 CampusFix Civic Tech Initiative. Built with HTML5, Tailwind CSS & JavaScript.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for Computer Science & Engineering</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>
        </div>

      </div>
    </footer>
  );
};
