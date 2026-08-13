import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck 
} from 'lucide-react';

interface HeroProps {
  onOpenReportModal: () => void;
  onExploreClick: () => void;
  onOpenOutingModal?: () => void;
  totalResolvedCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenReportModal,
  onExploreClick,
  onOpenOutingModal,
  totalResolvedCount
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:py-24 bg-gradient-to-b from-[#2a080e] via-[#4a0b14] to-[#2d080e]">
      
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#800020]/30 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[350px] bg-[#c89f78]/20 rounded-full blur-[110px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Centered Hero Content Box */}
        <div className="space-y-8 relative">
          
          {/* Cinematic Background Video Layer - Positioned directly behind the "Fixing Our Campus, Together." content area */}
          <div 
            className="absolute -inset-6 sm:-inset-10 lg:-inset-12 z-0 pointer-events-none overflow-hidden rounded-3xl"
            style={{
              maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 35%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0) 90%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 35%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0) 90%)'
            }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover scale-110 opacity-70"
              src="/campus sitm.mp4"
            />

            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#2a080e]/85 via-[#3b0a11]/50 to-[#2a080e]/85" />

            {/* Soft Radial Vignette Tint */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 25%, #2a080e 90%)'
              }}
            />
          </div>

          <div className="relative z-10 space-y-6 max-w-3xl mx-auto">

            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d0c14]/90 text-[#e6c5a0] border border-[#c89f78]/40 text-xs font-semibold tracking-wide backdrop-blur-md shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#c89f78] animate-pulse" />
              <span>Smart Civic Tech for Modern Campuses</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#c89f78] animate-ping" />
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#fdfbf7] tracking-tight leading-[1.12]">
              Campus{' '}
              <span className="bg-gradient-to-r from-[#f7f1e5] via-[#d4a373] to-[#e6c5a0] bg-clip-text text-transparent">
                Care.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-[#e6d5c3] font-normal max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              Report campus problems. Track their progress. Make your college better. 
              An open digital platform connecting students directly with maintenance teams.
            </p>

            {/* CTA Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="hero-report-problem-btn"
                onClick={onOpenReportModal}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#800020] via-[#a31c38] to-[#c89f78] text-[#fdfbf7] font-bold text-base shadow-xl shadow-maroon-950/60 hover:brightness-110 transition-all hover:scale-105 active:scale-95 group border border-[#c89f78]/30"
              >
                <span>+ Report a Problem</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {onOpenOutingModal && (
                <button
                  id="hero-outing-pass-btn"
                  onClick={onOpenOutingModal}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#3d0c14]/90 hover:bg-[#5c1321] text-[#e6c5a0] font-bold text-base shadow-xl shadow-maroon-950/40 border border-[#c89f78]/50 hover:border-[#c89f78] transition-all hover:scale-105 active:scale-95 group backdrop-blur-md"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Outing Pass</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
