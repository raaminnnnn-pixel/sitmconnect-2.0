import React, { useState } from 'react';
import { 
  ShieldAlert, 
  PlusCircle, 
  LayoutDashboard, 
  FileText, 
  MapPin, 
  UserCheck, 
  PhoneCall, 
  Menu, 
  X,
  Sparkles,
  Home,
  User,
  ShieldCheck,
  Star,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReportModal: () => void;
  onOpenEmergencyModal: () => void;
  onOpenProfileModal: () => void;
  onOpenOutingModal: () => void;
  onOpenRatingModal?: () => void;
  currentUser: UserProfile | null;
  openIssuesCount: number;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onOpenEmergencyModal,
  onOpenProfileModal,
  onOpenOutingModal,
  onOpenRatingModal,
  currentUser,
  openIssuesCount,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'activity', label: 'My Activity', icon: UserCheck },
    { id: 'tracker', label: 'Track Issues', icon: FileText, badge: openIssuesCount },
    { id: 'map', label: 'Campus Map', icon: MapPin },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    
    // Scroll smoothly to section if on home
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#2a080e]/95 backdrop-blur-md border-b border-[#5c1321]/80 shadow-md">
      {/* Primary Top Bar: Brand & Main Navigation Links */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left: Brand Logo & Title */}
        <div 
          id="navbar-brand-logo"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          title="SITMCONNECT - Go to Home"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#800020] via-[#a31c38] to-[#c89f78] flex items-center justify-center text-[#fdfbf7] shadow-md shadow-maroon-950/50 group-hover:scale-105 transition-transform duration-200">
            <span className="font-black text-sm sm:text-base tracking-wider text-[#fdfbf7]">SC</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#fdfbf7] group-hover:text-amber-200 transition-colors">
                SITMCONNECT
              </span>
              <span className="hidden xs:inline-block px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wider bg-[#c89f78]/20 text-[#e6c5a0] border border-[#c89f78]/40 rounded-md">
                Live
              </span>
            </div>
            <p className="text-[10px] text-[#d4c3b3] font-medium leading-none hidden sm:block">Campus Civic Portal</p>
          </div>
        </div>

        {/* Center / Right: Primary Navigation Tabs (Home, Dashboard, My Activity, Track Issues, Campus Map) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#180307] p-1 rounded-xl border border-[#5c1321]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#800020] to-[#5c1321] text-[#fdfbf7] border border-[#c89f78]/40 shadow-sm'
                    : 'text-[#d4c3b3] hover:bg-[#2d080e] hover:text-[#fdfbf7]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#c89f78]' : 'text-[#a38c7e]'}`} />
                <span>{link.label}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded-full ${
                    isActive ? 'bg-[#c89f78] text-[#2a080e]' : 'bg-[#800020] text-[#fdfbf7] border border-[#a31c38]'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Header Quick Actions */}
        <div className="flex md:hidden items-center gap-1.5">
          {/* Quick Theme Toggle for Mobile */}
          {onToggleTheme && (
            <button
              id="mobile-theme-toggle-btn"
              onClick={onToggleTheme}
              className={`p-1.5 rounded-lg border text-xs transition-all shadow-sm ${
                theme === 'light'
                  ? 'bg-amber-100 text-[#800020] border-[#c89f78]'
                  : 'bg-[#2a080e] text-amber-300 border-[#5c1321]'
              }`}
              title={theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          )}

          {/* Quick SOS Trigger */}
          <button
            id="mobile-emergency-btn"
            onClick={onOpenEmergencyModal}
            className="p-1.5 rounded-lg bg-[#58111a] text-rose-200 border border-rose-900/60 shadow-sm"
            title="Emergency Numbers"
          >
            <PhoneCall className="w-4 h-4 animate-pulse" />
          </button>

          {/* Quick Report CTA */}
          <button
            id="mobile-report-btn"
            onClick={onOpenReportModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#800020] to-[#a31c38] text-white text-xs font-bold shadow-sm"
            title="Report Problem"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report</span>
          </button>
          
          {/* Mobile Drawer Hamburger Menu */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-[#3d0c14] text-[#fdfbf7] border border-[#5c1321] hover:bg-[#52101b] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sub-Bar Directly Under Navigation: (Outing, Rate, Theme toggle, SOS, Sign In / Profile, Report) */}
      <div className="hidden md:block w-full bg-[#1c0307]/90 border-t border-[#5c1321]/60 py-1.5">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 flex items-center justify-between gap-2">
          
          {/* Left indicator text / Quick Student Actions */}
          <div className="flex items-center gap-2 text-[11px] text-[#c89f78] font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden lg:inline text-[#d4c3b3]">Campus Services & Actions:</span>
          </div>

          {/* Repositioned Action Buttons Container */}
          <div className="flex items-center gap-1.5 lg:gap-2 ml-auto">
            
            {/* 1. Outing Pass Button */}
            <button
              id="nav-outing-btn"
              onClick={onOpenOutingModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#340911] hover:bg-[#4a0d18] text-amber-200 border border-[#c89f78]/35 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="Hostel Outing Permission & Security Pass"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Outing Pass</span>
            </button>

            {/* 2. Rate Campus Score Button */}
            {onOpenRatingModal && (
              <button
                id="nav-rating-btn"
                onClick={onOpenRatingModal}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#24060b] hover:bg-[#340911] text-amber-200/90 border border-[#5c1321] text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                title="Rate Campus Health & Facilities"
              >
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Rate Campus</span>
              </button>
            )}

            {/* 3. Dark/Light Theme Toggle Button */}
            {onToggleTheme && (
              <button
                id="theme-toggle-btn"
                onClick={onToggleTheme}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm ${
                  theme === 'light'
                    ? 'bg-amber-100 hover:bg-amber-200 text-[#800020] border-[#c89f78]'
                    : 'bg-[#24060b] hover:bg-[#340911] text-amber-300 border-[#5c1321]'
                }`}
                title={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to High-Contrast Light Theme'}
                aria-label="Toggle accessibility color theme"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#800020]" />
                    <span className="hidden xl:inline text-[11px]">Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                    <span className="hidden xl:inline text-[11px]">Light</span>
                  </>
                )}
              </button>
            )}

            {/* 4. SOS / Emergency Helpline Trigger */}
            <button
              id="nav-emergency-btn"
              onClick={onOpenEmergencyModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#58111a]/60 hover:bg-[#731623] text-[#f5efe6] border border-[#800020] text-xs font-semibold transition-all hover:scale-105 active:scale-95"
              title="Campus Emergency Contacts & SOS"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-300 animate-pulse" />
              <span>SOS Helpline</span>
            </button>

            {/* 5. User Account / Profile / Sign In Button */}
            <button
              id="nav-profile-btn"
              onClick={onOpenProfileModal}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all hover:scale-105 active:scale-95 ${
                currentUser
                  ? 'bg-[#340911] border-[#c89f78]/40 text-white shadow-sm'
                  : 'bg-[#800020]/30 hover:bg-[#800020]/60 border-[#c89f78]/30 text-[#e6d5c3]'
              }`}
              title="User Profile & Google ID"
            >
              {currentUser ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-[#800020] border border-[#c89f78] flex items-center justify-center font-bold text-[9px] text-amber-200 overflow-hidden">
                    {currentUser.photoUrl ? (
                      <img src={currentUser.photoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      currentUser.name.charAt(0)
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#fdfbf7] max-w-[90px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#c89f78]" />
                  <span className="text-xs font-semibold text-white">Sign In</span>
                </div>
              )}
            </button>

            {/* 6. Primary Action Button: + Report Problem */}
            <button
              id="nav-report-btn"
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-[#800020] via-[#a31c38] to-[#c89f78] text-[#fdfbf7] font-bold text-xs shadow-md shadow-maroon-950/40 hover:brightness-110 transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Report Problem</span>
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Polished, Mobile-Friendly & Structured) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#24060c] border-b border-[#5c1321] px-4 py-3 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-2xl">
          
          {/* Navigation Links */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c89f78] block">
                Navigation
              </span>
              {onToggleTheme && (
                <button
                  onClick={() => {
                    onToggleTheme();
                  }}
                  className="text-[11px] font-bold text-amber-300 flex items-center gap-1 bg-[#3d0c14] px-2 py-0.5 rounded-md border border-[#5c1321]"
                >
                  {theme === 'light' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                  <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
              )}
            </div>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  id={`drawer-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#800020] to-[#5c1321] text-[#fdfbf7] border border-[#c89f78]/30 shadow-sm'
                      : 'text-[#d4c3b3] hover:bg-[#340911]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#c89f78]' : 'text-[#a38c7e]'}`} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold bg-[#800020] text-white rounded-full">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Actions & Student Services */}
          <div className="pt-2 border-t border-[#5c1321] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#c89f78] px-2 block">
              Student Services
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="drawer-outing-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOutingModal();
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#3d0c14] text-amber-100 border border-[#c89f78]/40 text-xs font-semibold shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Outing Pass</span>
              </button>

              {onOpenRatingModal && (
                <button
                  id="drawer-rating-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenRatingModal();
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#1a0408] text-amber-200 border border-[#5c1321] text-xs font-semibold"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Rate Campus</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                id="drawer-profile-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfileModal();
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#340911] text-[#fdfbf7] border border-[#5c1321] text-xs font-semibold"
              >
                <User className="w-3.5 h-3.5 text-[#c89f78]" />
                <span>{currentUser ? `${currentUser.name.split(' ')[0]}` : 'Sign In'}</span>
              </button>

              <button
                id="drawer-emergency-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEmergencyModal();
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#58111a]/70 text-rose-200 border border-rose-900/60 text-xs font-semibold"
              >
                <PhoneCall className="w-3.5 h-3.5 text-rose-300" />
                <span>Emergency SOS</span>
              </button>
            </div>
          </div>

        </div>
      )}
    </header>
  );
};

