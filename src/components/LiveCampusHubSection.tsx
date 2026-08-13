import React from 'react';
import { 
  Lightbulb, 
  Droplet, 
  Wifi, 
  Armchair, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  CheckCircle2,
  Activity,
  Zap,
  Flame
} from 'lucide-react';

export const LiveCampusHubSection: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-[#2a080e] via-[#3b0a11] to-[#2a080e] border-y border-[#5c1321] relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#800020]/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3d0c14] border border-[#c89f78]/30 text-xs font-bold text-[#e6c5a0]">
            <Activity className="w-3.5 h-3.5 text-[#c89f78] animate-pulse" />
            <span>Real-time Campus Operations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#fdfbf7] tracking-tight">
            Live Maintenance Hub
          </h2>
          <p className="text-sm text-[#d4c3b3]">
            Active campus monitoring console tracking live issue status, department routing, and resolution metrics across SITM.
          </p>
        </div>

        {/* Main Grid: Card & Category Features */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Category Badges & Quick Stats */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xl font-bold text-[#fdfbf7] flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#c89f78]" />
              <span>Monitored Campus Domains</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#2a080e]/90 border border-[#5c1321] flex items-center gap-3 hover:border-[#c89f78]/40 transition-all">
                <div className="p-2 rounded-xl bg-[#800020] text-amber-300">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#fdfbf7]">Electricity & Fans</h4>
                  <p className="text-[10px] text-[#c89f78]">Instant Dispatch</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#2a080e]/90 border border-[#5c1321] flex items-center gap-3 hover:border-[#c89f78]/40 transition-all">
                <div className="p-2 rounded-xl bg-[#800020] text-amber-300">
                  <Droplet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#fdfbf7]">Water & Plumbing</h4>
                  <p className="text-[10px] text-[#c89f78]">24/7 Hostel Line</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#2a080e]/90 border border-[#5c1321] flex items-center gap-3 hover:border-[#c89f78]/40 transition-all">
                <div className="p-2 rounded-xl bg-[#800020] text-amber-300">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#fdfbf7]">Wi-Fi & Network</h4>
                  <p className="text-[10px] text-[#c89f78]">NOC Monitored</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#2a080e]/90 border border-[#5c1321] flex items-center gap-3 hover:border-[#c89f78]/40 transition-all">
                <div className="p-2 rounded-xl bg-[#800020] text-amber-300">
                  <Armchair className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#fdfbf7]">Furniture & Classrooms</h4>
                  <p className="text-[10px] text-[#c89f78]">Carpentry Squad</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#3d0c14]/60 border border-[#c89f78]/30 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#c89f78] shrink-0" />
              <p className="text-xs text-[#e6d5c3] leading-relaxed">
                All maintenance requests are timestamped and assigned directly to specialized campus maintenance teams with automated escalation.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Campus Hub Card */}
          <div className="lg:col-span-7 relative">
            <div className="relative glass-card rounded-3xl p-6 sm:p-8 border border-[#c89f78]/40 shadow-2xl overflow-hidden bg-gradient-to-br from-[#3b0a11] via-[#2a080e] to-[#4a0b14]">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#5c1321]">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-mono text-[#d4c3b3]">campus_hub_console.v1</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#800020]/60 text-[#fdfbf7] border border-[#c89f78]/40 text-[11px] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#c89f78] animate-pulse" />
                  <span>Real-time Active</span>
                </div>
              </div>

              {/* Graphic Campus Illustration Representation */}
              <div className="py-5 space-y-3.5">
                
                {/* Simulated Campus Block Card 1 */}
                <div className="p-4 rounded-2xl bg-[#2a080e]/95 border border-[#5c1321] flex items-center justify-between hover:border-[#c89f78]/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#58111a] text-amber-300 flex items-center justify-center font-bold text-lg">
                      💡
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#fdfbf7]">Lecture Room 204 Fan</h4>
                      <p className="text-xs text-[#d4c3b3]">CSE Block • Priority: High</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-red-950/80 text-red-300 border border-red-900/60">
                    Reported
                  </span>
                </div>

                {/* Simulated Campus Block Card 2 */}
                <div className="p-4 rounded-2xl bg-[#2a080e]/95 border border-[#5c1321] flex items-center justify-between hover:border-[#c89f78]/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#58111a] text-amber-400 flex items-center justify-center font-bold text-lg">
                      🚰
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#fdfbf7]">Washroom Leakage</h4>
                      <p className="text-xs text-[#d4c3b3]">Boys Hostel • Plumber On Site</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-amber-950/80 text-amber-300 border border-amber-900/60">
                    In Progress
                  </span>
                </div>

                {/* Simulated Campus Block Card 3 */}
                <div className="p-4 rounded-2xl bg-[#2a080e]/95 border border-[#5c1321] flex items-center justify-between hover:border-[#c89f78]/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#58111a] text-emerald-400 flex items-center justify-center font-bold text-lg">
                      📶
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#fdfbf7]">Library Reading Hall Lights</h4>
                      <p className="text-xs text-[#d4c3b3]">Library • Fixed by Tech Crew</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-900/60 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Resolved</span>
                  </span>
                </div>

              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 border-t border-[#5c1321] flex items-center justify-between text-xs text-[#d4c3b3]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#c89f78]" />
                  Avg Resolution Speed: <strong className="text-white">4.2 Hours</strong>
                </span>
                <span className="font-mono text-[#c89f78] font-bold">SC-CONSOLE-ACTIVE</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
