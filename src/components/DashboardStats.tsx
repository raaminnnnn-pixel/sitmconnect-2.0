import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  UserCheck, 
  ShieldCheck, 
  Star, 
  ArrowRight,
  PlusCircle,
  ThumbsUp
} from 'lucide-react';
import { ProblemReport, OutingRequest, CampusRating, UserProfile } from '../types';

interface DashboardStatsProps {
  openCount: number;
  inProgressCount: number;
  resolvedCount: number;
  totalCount: number;
  currentUser?: UserProfile | null;
  reports?: ProblemReport[];
  outings?: OutingRequest[];
  ratings?: CampusRating[];
  onOpenReportModal?: () => void;
  onOpenOutingModal?: () => void;
  onOpenRatingModal?: () => void;
  onOpenProfileModal?: () => void;
  onSwitchToMyActivity?: () => void;
}

/**
 * Animated Counter Hook for smooth number counting animation
 */
const useAnimatedNumber = (target: number, duration: number = 800) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const initial = current;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuad = 1 - Math.pow(1 - progress, 3); // Smooth ease out
      setCurrent(Math.floor(initial + (target - initial) * easeOutQuad));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCurrent(target);
      }
    };

    window.requestAnimationFrame(step);
  }, [target, duration]);

  return current;
};

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  openCount,
  inProgressCount,
  resolvedCount,
  totalCount,
  currentUser,
  reports = [],
  outings = [],
  ratings = [],
  onOpenReportModal,
  onOpenOutingModal,
  onOpenRatingModal,
  onOpenProfileModal,
  onSwitchToMyActivity,
}) => {
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'my-activity'>('overview');

  const animatedOpen = useAnimatedNumber(openCount);
  const animatedInProgress = useAnimatedNumber(inProgressCount);
  const animatedResolved = useAnimatedNumber(resolvedCount);
  const animatedTotal = useAnimatedNumber(totalCount);

  // Student's personal items
  const myReports = reports.filter((r) => {
    if (!currentUser) return false;
    return (
      (r.reporterName && r.reporterName.toLowerCase() === currentUser.name.toLowerCase()) ||
      (r.reporterPhone && currentUser.phone && r.reporterPhone === currentUser.phone) ||
      ((r as any).reporterEmail && (r as any).reporterEmail === currentUser.email) ||
      ((r as any).reporterId && (r as any).reporterId === (currentUser.uid || currentUser.id))
    );
  });

  const myOutings = outings.filter((o) => {
    if (!currentUser) return false;
    return (
      o.studentEmail.toLowerCase() === currentUser.email.toLowerCase() ||
      o.studentName.toLowerCase() === currentUser.name.toLowerCase() ||
      o.studentId === currentUser.id ||
      o.studentId === currentUser.uid
    );
  });

  const myRating = ratings.find((r) => {
    if (!currentUser) return false;
    return (
      r.userId === currentUser.uid ||
      r.userId === currentUser.id ||
      (currentUser.email && r.userEmail?.toLowerCase() === currentUser.email?.toLowerCase())
    );
  });

  const myApprovedOutings = myOutings.filter((o) => o.status === 'Approved').length;
  const myPendingOutings = myOutings.filter((o) => o.status === 'Pending Approval').length;
  const myResolvedReports = myReports.filter((r) => r.status === 'Resolved').length;
  const totalUpvotes = myReports.reduce((acc, curr) => acc + (curr.upvotes || 0), 0);

  // Resolution Rate percentage calculation
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  return (
    <section id="dashboard" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[#c89f78] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Operational Analytics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#fdfbf7] tracking-tight">
            Student Issue Dashboard
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Dashboard Tab Selector */}
          <div className="bg-[#140306] p-1 rounded-2xl border border-[#5c1321] flex items-center shadow-inner">
            <button
              onClick={() => setDashboardTab('overview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dashboardTab === 'overview'
                  ? 'bg-[#800020] text-[#fdfbf7] shadow-md'
                  : 'text-[#d4c3b3] hover:text-white'
              }`}
            >
              Campus Overview
            </button>
            <button
              onClick={() => {
                setDashboardTab('my-activity');
                if (onSwitchToMyActivity) onSwitchToMyActivity();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dashboardTab === 'my-activity'
                  ? 'bg-[#800020] text-[#fdfbf7] shadow-md'
                  : 'text-[#d4c3b3] hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>My Activity</span>
              {(myReports.length > 0 || myOutings.length > 0) && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black text-[10px] font-black">
                  {myReports.length + myOutings.length}
                </span>
              )}
            </button>
          </div>

          <div className="bg-[#3b0a11]/80 px-4 py-2 rounded-xl text-xs font-semibold text-[#f5efe6] border border-[#5c1321] flex items-center gap-2 shadow-md">
            <TrendingUp className="w-4 h-4 text-[#c89f78]" />
            <span>Resolution Rate: <strong className="text-[#c89f78] font-bold">{resolutionRate}%</strong></span>
          </div>
        </div>
      </div>

      {dashboardTab === 'overview' ? (
        /* Grid of 4 Campus Overview Stat Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* 1. Open Issues Card */}
          <div className="bg-[#fbf8f3] p-5 rounded-2xl shadow-xl flex flex-col justify-between h-36 hover:transform hover:-translate-y-1 transition-all border border-[#e6d5c3] group relative">
            <div className="flex items-center justify-between">
              <span className="text-[#800020] text-xs font-extrabold uppercase tracking-wider">Open Issues</span>
              <div className="w-8 h-8 rounded-lg bg-[#58111a]/10 text-[#800020] flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#3b0a11] tracking-tight font-mono">{animatedOpen}</span>
              <span className="text-[10px] font-bold text-[#800020] bg-[#800020]/10 px-2 py-0.5 rounded-full border border-[#800020]/20">
                Needs Action
              </span>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 bg-[#e6d5c3] rounded-full overflow-hidden">
                <div className="h-full bg-[#800020] rounded-full transition-all duration-500" style={{ width: `${totalCount > 0 ? (openCount / totalCount) * 100 : 0}%` }}></div>
              </div>
              <p className="text-[10px] text-[#6e5849] truncate font-medium">Newly reported issues awaiting review</p>
            </div>
          </div>

          {/* 2. In Progress Card */}
          <div className="bg-[#fbf8f3] p-5 rounded-2xl shadow-xl flex flex-col justify-between h-36 hover:transform hover:-translate-y-1 transition-all border border-[#e6d5c3] group relative">
            <div className="flex items-center justify-between">
              <span className="text-amber-700 text-xs font-extrabold uppercase tracking-wider">In Progress</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100/60 text-amber-800 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#3b0a11] tracking-tight font-mono">{animatedInProgress}</span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                Work Started
              </span>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 bg-[#e6d5c3] rounded-full overflow-hidden">
                <div className="h-full bg-amber-600 rounded-full transition-all duration-500" style={{ width: `${totalCount > 0 ? (inProgressCount / totalCount) * 100 : 0}%` }}></div>
              </div>
              <p className="text-[10px] text-[#6e5849] truncate font-medium">Assigned to maintenance teams</p>
            </div>
          </div>

          {/* 3. Resolved Card */}
          <div className="bg-[#fbf8f3] p-5 rounded-2xl shadow-xl flex flex-col justify-between h-36 hover:transform hover:-translate-y-1 transition-all border border-[#e6d5c3] group relative">
            <div className="flex items-center justify-between">
              <span className="text-emerald-700 text-xs font-extrabold uppercase tracking-wider">Resolved</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100/60 text-emerald-800 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#3b0a11] tracking-tight font-mono">{animatedResolved}</span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                Completed
              </span>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 bg-[#e6d5c3] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${totalCount > 0 ? (resolvedCount / totalCount) * 100 : 0}%` }}></div>
              </div>
              <p className="text-[10px] text-[#6e5849] truncate font-medium">Successfully fixed & verified</p>
            </div>
          </div>

          {/* 4. Total Reports Card */}
          <div className="bg-[#fbf8f3] p-5 rounded-2xl shadow-xl flex flex-col justify-between h-36 hover:transform hover:-translate-y-1 transition-all border border-[#e6d5c3] group relative">
            <div className="flex items-center justify-between">
              <span className="text-[#a31c38] text-xs font-extrabold uppercase tracking-wider">Total Reports</span>
              <div className="w-8 h-8 rounded-lg bg-[#a31c38]/10 text-[#a31c38] flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#3b0a11] tracking-tight font-mono">{animatedTotal}</span>
              <span className="text-[10px] font-bold text-[#a31c38] bg-[#a31c38]/10 px-2 py-0.5 rounded-full border border-[#a31c38]/20">
                Lifetime
              </span>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 bg-[#e6d5c3] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#800020] to-[#c89f78] rounded-full w-full"></div>
              </div>
              <p className="text-[10px] text-[#6e5849] truncate font-medium">Cumulative reports logged</p>
            </div>
          </div>

        </div>
      ) : (
        /* Personal Student Activity Snapshot Grid */
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Personal Card 1: My Reports */}
            <div className="bg-[#fbf8f3] p-5 rounded-2xl shadow-xl flex flex-col justify-between h-36 hover:transform hover:-translate-y-1 transition-all border border-[#e6d5c3] group">
              <div className="flex items-center justify-between">
                <span className="text-[#800020] text-xs font-extrabold uppercase tracking-wider">My Logged Tickets</span>
                <div className="w-8 h-8 rounded-lg bg-[#800020]/10 text-[#800020] flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-[#3b0a11] font-mono">{myReports.length}</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {myResolvedReports} Resolved
                </span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 bg-[#e6d5c3] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#800020] rounded-full" 
                    style={{ width: `${myReports.length > 0 ? (myResolvedReports / myReports.length) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#6e5849] truncate font-medium">Personal reported maintenance issues</p>
              </div>
            </div>

            {/* Personal Card 2: My Outing Passes */}
            <div className="bg-[#fbf8f3] p-5 rounded-2xl shadow-xl flex flex-col justify-between h-36 hover:transform hover:-translate-y-1 transition-all border border-[#e6d5c3] group">
              <div className="flex items-center justify-between">
                <span className="text-emerald-800 text-xs font-extrabold uppercase tracking-wider">Outing Passes</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-[#3b0a11] font-mono">{myOutings.length}</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {myApprovedOutings} Approved
                </span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 bg-[#e6d5c3] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full" 
                    style={{ width: `${myOutings.length > 0 ? (myApprovedOutings / myOutings.length) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#6e5849] truncate font-medium">
                  {myPendingOutings > 0 ? `${myPendingOutings} awaiting warden approval` : 'Gate security pass access'}
                </p>
              </div>
            </div>

            {/* Personal Card 3: My Campus Rating */}
            <div className="bg-[#fbf8f3] p-5 rounded-2xl shadow-xl flex flex-col justify-between h-36 hover:transform hover:-translate-y-1 transition-all border border-[#e6d5c3] group">
              <div className="flex items-center justify-between">
                <span className="text-amber-800 text-xs font-extrabold uppercase tracking-wider">Campus Score</span>
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-[#3b0a11] font-mono">
                  {myRating ? `${myRating.overallHealthScore}/100` : 'Not Rated'}
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  {myRating ? 'Rated ⭐' : 'Pending'}
                </span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 bg-[#e6d5c3] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${myRating ? myRating.overallHealthScore : 0}%` }} />
                </div>
                <p className="text-[10px] text-[#6e5849] truncate font-medium">Your 5-star campus facility review</p>
              </div>
            </div>

            {/* Personal Card 4: Community Upvotes */}
            <div className="bg-[#fbf8f3] p-5 rounded-2xl shadow-xl flex flex-col justify-between h-36 hover:transform hover:-translate-y-1 transition-all border border-[#e6d5c3] group">
              <div className="flex items-center justify-between">
                <span className="text-[#a31c38] text-xs font-extrabold uppercase tracking-wider">Student Upvotes</span>
                <div className="w-8 h-8 rounded-lg bg-[#a31c38]/10 text-[#a31c38] flex items-center justify-center">
                  <ThumbsUp className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-[#3b0a11] font-mono">{totalUpvotes}</span>
                <span className="text-[10px] font-bold text-[#800020] bg-[#800020]/10 px-2 py-0.5 rounded-full">
                  Peer Support
                </span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 bg-[#e6d5c3] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#800020] to-[#c89f78] rounded-full w-full" />
                </div>
                <p className="text-[10px] text-[#6e5849] truncate font-medium">Total endorsements received</p>
              </div>
            </div>

          </div>

          {/* Quick Outing Pass Status Callout if student has outings */}
          {myOutings.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#2a080e] border border-[#5c1321] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#fdfbf7]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-amber-200">Latest Outing Request: {myOutings[0].id}</span>
                  <p className="text-[#d4c3b3]">{myOutings[0].purpose} • Status: <strong className="text-emerald-400">{myOutings[0].status}</strong></p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onOpenOutingModal && (
                  <button
                    onClick={onOpenOutingModal}
                    className="px-3.5 py-1.5 rounded-xl bg-[#800020] hover:bg-[#a31c38] text-white font-bold text-xs shadow flex items-center gap-1"
                  >
                    <span>View Gate Pass QR</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

    </section>
  );
};

