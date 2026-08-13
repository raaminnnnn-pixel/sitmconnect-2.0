import React, { useState } from 'react';
import { Sparkles, Heart, GraduationCap, Users, ShieldCheck, MapPin, ExternalLink, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenReportModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenReportModal }) => {
  const [imageError, setImageError] = useState(false);

  const teamMembers = [
    { name: 'Rahul Amin', role: 'Lead / Frontend & Architecture', id: '1' },
    { name: 'Kasli Keprai', role: 'UI/UX & Component Design', id: '2' },
    { name: 'Majidul Islam', role: 'State Logic & Data Management', id: '3' },
    { name: 'Elias Ahmed', role: 'Map Visualizer & Modules', id: '4' },
    { name: 'Samina Sultana', role: 'Quality Assurance & Workflow', id: '5' },
    { name: 'Anamika Saikia', role: 'Accessibility & Theme Engineering', id: '6' },
  ];

  return (
    <footer className="mt-20 border-t border-[#5c1321] bg-gradient-to-b from-[#1f050a] via-[#170307] to-[#120205] text-[#d4c3b3] text-xs py-14 relative overflow-hidden">
      {/* Background Subtle Maroon Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-48 bg-gradient-to-b from-[#800020]/20 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Top Grid: Branding, Navigation Links, Categories & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Col 1: Brand & Campus Care Tagline */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#800020] via-[#a31c38] to-[#c89f78] flex items-center justify-center text-[#fdfbf7] font-black text-sm shadow-md shadow-maroon-950/60 border border-[#c89f78]/40">
                SC
              </div>
              <div>
                <span className="text-xl font-black text-[#fdfbf7] tracking-tight block">
                  SITMCONNECT
                </span>
                <span className="text-[10px] font-bold text-[#c89f78] tracking-widest uppercase block -mt-0.5">
                  Campus Care
                </span>
              </div>
            </div>
            <p className="text-xs text-[#d4c3b3] leading-relaxed font-medium italic">
              “Campus Care.”
            </p>
            <p className="text-xs text-[#a89283] leading-relaxed">
              Empowering students, hostel residents, and campus administration with real-time maintenance reporting and resolution tracking.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3d0c14] text-amber-200 text-[10px] font-bold border border-[#c89f78]/40 shadow-sm">
              <GraduationCap className="w-3.5 h-3.5 text-[#c89f78]" />
              <span>B.Tech CSE — 1st Semester Project</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#fdfbf7] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c89f78]"></span>
              Navigation Links
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-[#fdfbf7] hover:translate-x-1 transition-all flex items-center gap-1.5">
                  <span className="text-[#c89f78] text-[10px]">▸</span> Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-[#fdfbf7] hover:translate-x-1 transition-all flex items-center gap-1.5">
                  <span className="text-[#c89f78] text-[10px]">▸</span> Analytics Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('activity')} className="hover:text-[#fdfbf7] hover:translate-x-1 transition-all flex items-center gap-1.5">
                  <span className="text-[#c89f78] text-[10px]">▸</span> My Activity & Outings
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('tracker')} className="hover:text-[#fdfbf7] hover:translate-x-1 transition-all flex items-center gap-1.5">
                  <span className="text-[#c89f78] text-[10px]">▸</span> Track Problems & Status
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('map')} className="hover:text-[#fdfbf7] hover:translate-x-1 transition-all flex items-center gap-1.5">
                  <span className="text-[#c89f78] text-[10px]">▸</span> Interactive Campus Map
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Issue Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#fdfbf7] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c89f78]"></span>
              Issue Categories
            </h4>
            <ul className="space-y-1.5 text-xs text-[#a89283]">
              <li className="flex items-center gap-1.5"><span>💡</span> Electrical & Lighting Repairs</li>
              <li className="flex items-center gap-1.5"><span>🚰</span> Water Supply & Plumbing Leaks</li>
              <li className="flex items-center gap-1.5"><span>🧹</span> Hostel Cleanliness & Sanitation</li>
              <li className="flex items-center gap-1.5"><span>📶</span> Wi-Fi & Internet Infrastructure</li>
              <li className="flex items-center gap-1.5"><span>🛡️</span> Campus Security & SOS</li>
            </ul>
          </div>

          {/* Col 4: Quick Action Report */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#fdfbf7] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c89f78]"></span>
              Report An Issue
            </h4>
            <p className="text-xs text-[#d4c3b3] leading-relaxed">
              Noticed an unresolved problem or faulty equipment on campus? Submit a report in seconds.
            </p>
            <button
              onClick={onOpenReportModal}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#800020] via-[#a31c38] to-[#c89f78] text-[#fdfbf7] font-bold text-xs shadow-md shadow-maroon-950/60 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all border border-[#c89f78]/40 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ Submit Problem Report</span>
            </button>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* DEVELOPED WITH ❤️ BY (Premium Student Team & Group Photo Section)          */}
        {/* ========================================================================= */}
        <div className="pt-8 border-t border-[#5c1321]/80">
          <div className="bg-gradient-to-b from-[#24060c]/90 via-[#1c0307]/95 to-[#170205] rounded-3xl p-6 sm:p-8 border border-[#5c1321] shadow-2xl shadow-maroon-950/80 backdrop-blur-md relative overflow-hidden transition-all duration-300">
            
            {/* Top Section Header with Crimson Glow */}
            <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3d0c14] border border-[#c89f78]/35 text-amber-200 text-xs font-bold shadow-sm">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500 animate-pulse" />
                <span>Student Engineering Showcase</span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-black text-[#fdfbf7] tracking-tight flex items-center justify-center gap-2">
                <span>Developed With</span>
                <span className="inline-block text-rose-400 animate-bounce">❤️</span>
                <span>By</span>
              </h3>
              
              <p className="text-xs sm:text-sm text-[#d4c3b3] font-medium">
                Built by first-year Computer Science & Engineering students as an innovative campus welfare initiative.
              </p>
            </div>

            {/* Group Photo Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group max-w-3xl w-full">
                {/* Subtle Maroon / Burgundy Glow Backing */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-[#800020] via-[#a31c38] to-[#c89f78] rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-500 group-hover:duration-200" />
                
                {/* Photo Frame Container */}
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#c89f78]/40 bg-[#150205] shadow-2xl transition-all duration-500 group-hover:scale-[1.01] group-hover:border-[#c89f78]/80 flex justify-center items-center">
                  {!imageError ? (
                    <img 
                      src="/group photo 1.jpeg" 
                      alt="SITMCONNECT Development Team - Rahul Amin, Kasli Keprai, Majidul Islam, Elias Ahmed, Samina Sultana, Anamika Saikia" 
                      className="w-full max-h-[420px] sm:max-h-[460px] object-contain rounded-2xl transition-transform duration-500 group-hover:brightness-105"
                      onError={() => {
                        // Fallback attempt to alternate encoded path if needed
                        setImageError(true);
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <img 
                      src="/group-photo-1.jpeg" 
                      alt="SITMCONNECT Development Team" 
                      className="w-full max-h-[420px] sm:max-h-[460px] object-contain rounded-2xl"
                    />
                  )}
                  
                  {/* Photo Overlay Caption Strip */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#150205] via-[#150205]/80 to-transparent p-3 sm:p-4 text-center">
                    <span className="text-[11px] sm:text-xs font-bold text-[#fdfbf7] tracking-wide flex items-center justify-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#c89f78]" />
                      <span>SITMCONNECT Core Development Team</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members List (Responsive 3-Column / 2-Row Layout) */}
            <div className="max-w-4xl mx-auto mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {teamMembers.map((member, idx) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[#1a0307]/80 hover:bg-[#340911] border border-[#5c1321]/80 hover:border-[#c89f78]/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-maroon-950/50 group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#3d0c14] border border-[#c89f78]/40 flex items-center justify-center text-[#fdfbf7] font-black text-xs group-hover:scale-105 group-hover:bg-[#800020] transition-transform">
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-[#fdfbf7] group-hover:text-amber-200 transition-colors block truncate">
                        {member.name}
                      </span>
                      <span className="text-[10px] text-[#a89283] group-hover:text-[#d4c3b3] transition-colors block truncate font-medium">
                        B.Tech CSE
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Information Badge */}
            <div className="text-center pt-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#340911] via-[#4a0e19] to-[#340911] border border-[#c89f78]/40 shadow-inner">
                <GraduationCap className="w-4 h-4 text-amber-300" />
                <span className="text-xs sm:text-sm font-extrabold text-[#fdfbf7] tracking-wide">
                  B.Tech CSE — 1st Semester
                </span>
                <span className="text-[11px] text-[#c89f78] font-bold hidden sm:inline">
                  • Scholars Institute of Technology & Management
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar: Copyright & Rights */}
        <div className="pt-6 border-t border-[#5c1321]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#a89283]">
          <p>© {new Date().getFullYear()} SITMCONNECT — Campus Care. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#d4c3b3]">
            <span>Empowering Campus Communities</span>
            <span className="text-[#c89f78]">•</span>
            <span>Campus Care</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

