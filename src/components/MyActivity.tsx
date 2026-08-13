import React, { useState } from 'react';
import { 
  UserCheck, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  ArrowRight, 
  PlusCircle, 
  Calendar, 
  MapPin, 
  QrCode, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  Building2, 
  Home, 
  Phone, 
  Mail, 
  ThumbsUp, 
  User, 
  Lock, 
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  LogOut,
  Info
} from 'lucide-react';
import { ProblemReport, OutingRequest, CampusRating, UserProfile, OutingStatus, Status } from '../types';
import { QRCodeSVG } from 'qrcode.react';

interface MyActivityProps {
  currentUser: UserProfile | null;
  reports: ProblemReport[];
  outings: OutingRequest[];
  ratings: CampusRating[];
  onOpenReportModal: () => void;
  onOpenOutingModal: () => void;
  onOpenRatingModal: () => void;
  onOpenProfileModal: () => void;
  onSelectReport?: (reportId: string) => void;
  onQuickSignIn?: (account: UserProfile) => void;
}

export const MyActivity: React.FC<MyActivityProps> = ({
  currentUser,
  reports,
  outings,
  ratings,
  onOpenReportModal,
  onOpenOutingModal,
  onOpenRatingModal,
  onOpenProfileModal,
  onSelectReport,
  onQuickSignIn,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'reports' | 'outings' | 'ratings'>('all');
  const [selectedPassForQR, setSelectedPassForQR] = useState<OutingRequest | null>(null);

  // Identify student's own items based on name, email, or user ID
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

  // Calculate Personal Statistics
  const totalReportsCount = myReports.length;
  const openReportsCount = myReports.filter((r) => r.status === 'Reported').length;
  const inProgressReportsCount = myReports.filter((r) => r.status === 'In Progress' || r.status === 'Seen').length;
  const resolvedReportsCount = myReports.filter((r) => r.status === 'Resolved').length;

  const totalOutingsCount = myOutings.length;
  const approvedOutingsCount = myOutings.filter((o) => o.status === 'Approved').length;
  const pendingOutingsCount = myOutings.filter((o) => o.status === 'Pending Approval').length;
  const checkedOutOutingsCount = myOutings.filter((o) => o.status === 'Checked Out').length;

  const totalUpvotesReceived = myReports.reduce((acc, curr) => acc + (curr.upvotes || 0), 0);

  // Status helper badge styles
  const getReportStatusBadge = (status: Status) => {
    switch (status) {
      case 'Resolved':
        return {
          bg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
          icon: CheckCircle2,
          label: 'Resolved & Fixed',
        };
      case 'In Progress':
        return {
          bg: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
          icon: Clock,
          label: 'In Progress (Assigned)',
        };
      case 'Seen':
        return {
          bg: 'bg-blue-950/80 border-blue-500/40 text-blue-300',
          icon: Eye,
          label: 'Reviewed by Staff',
        };
      default:
        return {
          bg: 'bg-rose-950/80 border-rose-500/40 text-rose-300',
          icon: AlertCircle,
          label: 'Reported (Pending Review)',
        };
    }
  };

  const getOutingStatusBadge = (status: OutingStatus) => {
    switch (status) {
      case 'Approved':
        return {
          bg: 'bg-emerald-950/90 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400/30',
          icon: ShieldCheck,
          label: 'Approved (Gate Pass Active)',
        };
      case 'Checked Out':
        return {
          bg: 'bg-cyan-950/90 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/30',
          icon: ArrowRight,
          label: 'Checked Out (Out of Campus)',
        };
      case 'Returned':
        return {
          bg: 'bg-slate-900 border-slate-700 text-slate-300',
          icon: CheckCircle,
          label: 'Completed & Returned',
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-950/90 border-rose-500 text-rose-200',
          icon: XCircle,
          label: 'Request Rejected',
        };
      default:
        return {
          bg: 'bg-amber-950/90 border-amber-400 text-amber-200 animate-pulse',
          icon: Clock,
          label: 'Pending Warden Approval',
        };
    }
  };

  return (
    <div id="student-activity-dashboard" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      {/* 1. Header Profile & Identification Card */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#2a080e] via-[#3d0c14] to-[#1f0509] border border-[#c89f78]/40 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#800020]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#c89f78]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#800020] border-2 border-[#c89f78] flex items-center justify-center overflow-hidden shadow-xl shadow-maroon-950/60">
                {currentUser?.photoUrl ? (
                  <img
                    src={currentUser.photoUrl}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-9 h-9 text-amber-200" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#1f0509] flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#fdfbf7] tracking-tight">
                  {currentUser?.name || 'Guest Student'}
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#800020] text-amber-200 border border-[#c89f78]/50 shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>{currentUser?.role === 'management' ? 'Staff / Management' : 'SITM Student'}</span>
                </span>
                {currentUser?.residenceType && (
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#3d0c14] text-[#e6d5c3] border border-[#5c1321]">
                    {currentUser.residenceType}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#d4c3b3]">
                {currentUser?.department && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#c89f78]" />
                    <span>{currentUser.department}</span>
                  </span>
                )}
                {currentUser?.email && (
                  <span className="flex items-center gap-1.5 font-mono text-[#c89f78]">
                    <Mail className="w-3.5 h-3.5 text-[#c89f78]" />
                    <span>{currentUser.email}</span>
                  </span>
                )}
                {currentUser?.roomNo && (
                  <span className="flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Room: {currentUser.roomNo} ({currentUser.floorNo || 'Campus'})</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Triggers in Profile Header */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenProfileModal}
              className="px-4 py-2.5 rounded-xl bg-[#3d0c14] hover:bg-[#5c1321] text-[#fdfbf7] border border-[#c89f78]/40 text-xs font-bold transition-all shadow-md flex items-center gap-2 hover:scale-105"
            >
              <UserCheck className="w-4 h-4 text-amber-300" />
              <span>{currentUser ? 'Edit Profile & Google ID' : 'Sign In / Connect Profile'}</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#a31c38] text-white font-bold text-xs shadow-lg shadow-maroon-950/50 hover:brightness-110 transition-all flex items-center gap-2 hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ New Report</span>
            </button>

            <button
              onClick={onOpenOutingModal}
              className="px-4 py-2.5 rounded-xl bg-[#2a080e] hover:bg-[#3d0c14] text-amber-200 border border-[#c89f78]/40 text-xs font-bold transition-all flex items-center gap-2 hover:scale-105"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>+ Outing Pass</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Personal Statistics Cards Grid (4 KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: My Reported Issues */}
        <div className="bg-[#fbf8f3] p-5 rounded-2xl shadow-xl border border-[#e6d5c3] flex flex-col justify-between hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[#800020] text-xs font-extrabold uppercase tracking-wider">My Issues Logged</span>
            <div className="w-8 h-8 rounded-lg bg-[#800020]/10 text-[#800020] flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#3b0a11] font-mono">{totalReportsCount}</span>
            <div className="flex items-center gap-1.5">
              {openReportsCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  {openReportsCount} Open
                </span>
              )}
              {resolvedReportsCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {resolvedReportsCount} Fixed
                </span>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <div className="h-1.5 bg-[#e6d5c3] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#800020] rounded-full transition-all duration-500"
                style={{
                  width: `${totalReportsCount > 0 ? (resolvedReportsCount / totalReportsCount) * 100 : 0}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-[#6e5849] font-medium flex items-center justify-between">
              <span>Resolution Rate</span>
              <strong className="text-[#800020]">
                {totalReportsCount > 0 ? Math.round((resolvedReportsCount / totalReportsCount) * 100) : 0}%
              </strong>
            </p>
          </div>
        </div>

        {/* Card 2: My Outing Passes */}
        <div className="bg-[#fbf8f3] p-5 rounded-2xl shadow-xl border border-[#e6d5c3] flex flex-col justify-between hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-emerald-800 text-xs font-extrabold uppercase tracking-wider">Hostel Outing Passes</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#3b0a11] font-mono">{totalOutingsCount}</span>
            <div className="flex items-center gap-1.5">
              {approvedOutingsCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {approvedOutingsCount} Approved
                </span>
              )}
              {pendingOutingsCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {pendingOutingsCount} Pending
                </span>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <div className="h-1.5 bg-[#e6d5c3] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{
                  width: `${totalOutingsCount > 0 ? (approvedOutingsCount / totalOutingsCount) * 100 : 0}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-[#6e5849] font-medium flex items-center justify-between">
              <span>Chief Warden Approvals</span>
              <strong className="text-emerald-800 font-bold">{approvedOutingsCount} Active</strong>
            </p>
          </div>
        </div>

        {/* Card 3: My Campus Rating */}
        <div className="bg-[#fbf8f3] p-5 rounded-2xl shadow-xl border border-[#e6d5c3] flex flex-col justify-between hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-amber-800 text-xs font-extrabold uppercase tracking-wider">Campus Health Score</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#3b0a11] font-mono">
              {myRating ? `${myRating.overallHealthScore}/100` : 'Not Rated'}
            </span>
            <button
              onClick={onOpenRatingModal}
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200 transition-colors"
            >
              {myRating ? 'Update ⭐' : '+ Rate Now'}
            </button>
          </div>
          <div className="space-y-1">
            <div className="h-1.5 bg-[#e6d5c3] rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${myRating ? myRating.overallHealthScore : 0}%` }}
              />
            </div>
            <p className="text-[11px] text-[#6e5849] font-medium">
              {myRating ? `Cleanliness: ${myRating.cleanliness}★ | Wi-Fi: ${myRating.internet}★` : 'Rate campus maintenance & hygiene'}
            </p>
          </div>
        </div>

        {/* Card 4: Community Upvotes & Impact */}
        <div className="bg-[#fbf8f3] p-5 rounded-2xl shadow-xl border border-[#e6d5c3] flex flex-col justify-between hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[#a31c38] text-xs font-extrabold uppercase tracking-wider">Community Endorsements</span>
            <div className="w-8 h-8 rounded-lg bg-[#a31c38]/10 text-[#a31c38] flex items-center justify-center">
              <ThumbsUp className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#3b0a11] font-mono">{totalUpvotesReceived}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#800020]/10 text-[#800020] border border-[#800020]/20">
              Student Upvotes
            </span>
          </div>
          <div className="space-y-1">
            <div className="h-1.5 bg-[#e6d5c3] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#800020] to-[#c89f78] rounded-full w-full" />
            </div>
            <p className="text-[11px] text-[#6e5849] font-medium">Peer support on your reported tickets</p>
          </div>
        </div>

      </div>

      {/* 3. Interactive Filter Tabs Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#5c1321] pb-4">
        <div className="flex items-center gap-2 bg-[#140306] p-1.5 rounded-2xl border border-[#5c1321]">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-[#800020] text-[#fdfbf7] shadow-md'
                : 'text-[#d4c3b3] hover:text-[#fdfbf7] hover:bg-[#2a080e]'
            }`}
          >
            <span>All My Activity</span>
          </button>

          <button
            onClick={() => setActiveFilter('outings')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'outings'
                ? 'bg-[#800020] text-[#fdfbf7] shadow-md'
                : 'text-[#d4c3b3] hover:text-[#fdfbf7] hover:bg-[#2a080e]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Outing Passes ({myOutings.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('reports')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'reports'
                ? 'bg-[#800020] text-[#fdfbf7] shadow-md'
                : 'text-[#d4c3b3] hover:text-[#fdfbf7] hover:bg-[#2a080e]'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>My Reports ({myReports.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('ratings')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'ratings'
                ? 'bg-[#800020] text-[#fdfbf7] shadow-md'
                : 'text-[#d4c3b3] hover:text-[#fdfbf7] hover:bg-[#2a080e]'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>My Ratings ({myRating ? 1 : 0})</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#d4c3b3]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Live Sync Active</span>
          </span>
        </div>
      </div>

      {/* 4. Section 1: Hostel Outing Passes (If in All or Outings tab) */}
      {(activeFilter === 'all' || activeFilter === 'outings') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-extrabold text-[#fdfbf7] tracking-tight">
                Hostel Outing Passes & Gate Security Status
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                {myOutings.length} Total
              </span>
            </div>

            <button
              onClick={onOpenOutingModal}
              className="text-xs font-bold text-[#c89f78] hover:text-white flex items-center gap-1 bg-[#3d0c14] hover:bg-[#5c1321] px-3 py-1.5 rounded-xl border border-[#c89f78]/30 transition-all"
            >
              <span>+ Apply for Outing Pass</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myOutings.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#2a080e]/60 border border-[#5c1321] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#3d0c14] text-amber-200 mx-auto flex items-center justify-center border border-[#c89f78]/30">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-base font-bold text-[#fdfbf7]">No Outing Passes Requested Yet</h4>
              <p className="text-xs text-[#d4c3b3] max-w-md mx-auto">
                Need to leave campus for medical visits, family events, or project shopping? 
                Generate an AI-drafted email permission with automated Chief Warden approval & QR Gate Pass.
              </p>
              <button
                onClick={onOpenOutingModal}
                className="px-6 py-2.5 rounded-xl bg-[#800020] hover:bg-[#a31c38] text-white text-xs font-bold shadow-lg transition-all"
              >
                Apply for Hostel Outing Pass Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myOutings.map((outing) => {
                const badge = getOutingStatusBadge(outing.status);
                const Icon = badge.icon;
                const isApproved = outing.status === 'Approved';

                return (
                  <div
                    key={outing.id}
                    className="p-5 rounded-2xl bg-gradient-to-br from-[#2a080e] to-[#1f0509] border border-[#5c1321] hover:border-[#c89f78]/60 transition-all shadow-xl space-y-4 relative group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#c89f78] bg-[#3d0c14] px-2 py-0.5 rounded border border-[#5c1321]">
                            {outing.id}
                          </span>
                          <span className="text-[11px] text-[#d4c3b3]">{outing.timeAgo || 'Recent'}</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#fdfbf7] mt-1 line-clamp-1">{outing.purpose}</h4>
                      </div>

                      {/* Status Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shrink-0 ${badge.bg}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{outing.status}</span>
                      </span>
                    </div>

                    {/* Schedule Details */}
                    <div className="p-3 rounded-xl bg-[#140306] border border-[#5c1321] grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#e6c5a0] block mb-0.5">Departure</span>
                        <div className="font-semibold text-white flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#c89f78]" />
                          <span>{outing.goingDate}</span>
                        </div>
                        <div className="text-[11px] text-amber-200 font-mono mt-0.5">
                          <Clock className="w-3 h-3 inline mr-1 text-[#c89f78]" />
                          {outing.goingTime}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#e6c5a0] block mb-0.5">Expected Return</span>
                        <div className="font-semibold text-white flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{outing.returnDate}</span>
                        </div>
                        <div className="text-[11px] text-emerald-300 font-mono mt-0.5">
                          <Clock className="w-3 h-3 inline mr-1 text-emerald-400" />
                          {outing.returnTime}
                        </div>
                      </div>
                    </div>

                    {/* Security Pass Code & Approver Note */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#5c1321] text-xs">
                      <div className="flex items-center gap-2">
                        {outing.gateSecurityPassCode && (
                          <div className="flex items-center gap-1 bg-[#3d0c14] px-2.5 py-1 rounded-lg border border-[#c89f78]/30 font-mono text-[11px] text-amber-200">
                            <QrCode className="w-3.5 h-3.5 text-amber-300" />
                            <span>{outing.gateSecurityPassCode}</span>
                          </div>
                        )}
                        {outing.approvedBy && (
                          <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Signed by Chief Warden</span>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedPassForQR(outing)}
                        className="px-3 py-1.5 rounded-xl bg-[#800020] hover:bg-[#a31c38] text-[#fdfbf7] text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                      >
                        <QrCode className="w-3.5 h-3.5 text-amber-300" />
                        <span>View Gate Pass QR</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. Section 2: Student Problem Reports (If in All or Reports tab) */}
      {(activeFilter === 'all' || activeFilter === 'reports') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-extrabold text-[#fdfbf7] tracking-tight">
                My Reported Maintenance Issues
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#3d0c14] text-amber-200 border border-[#c89f78]/40">
                {myReports.length} Total
              </span>
            </div>

            <button
              onClick={onOpenReportModal}
              className="text-xs font-bold text-[#c89f78] hover:text-white flex items-center gap-1 bg-[#3d0c14] hover:bg-[#5c1321] px-3 py-1.5 rounded-xl border border-[#c89f78]/30 transition-all"
            >
              <span>+ Report Another Issue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myReports.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#2a080e]/60 border border-[#5c1321] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#3d0c14] text-amber-200 mx-auto flex items-center justify-center border border-[#c89f78]/30">
                <AlertCircle className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="text-base font-bold text-[#fdfbf7]">No Campus Issues Reported by You</h4>
              <p className="text-xs text-[#d4c3b3] max-w-md mx-auto">
                Noticed any broken electricals, leaking plumbing, poor Wi-Fi, or damaged furniture? 
                Log a quick report and track maintenance team resolution in real time.
              </p>
              <button
                onClick={onOpenReportModal}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#a31c38] text-white text-xs font-bold shadow-lg transition-all"
              >
                + Report a Problem Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myReports.map((report) => {
                const badge = getReportStatusBadge(report.status);
                const Icon = badge.icon;

                return (
                  <div
                    key={report.id}
                    className="p-5 rounded-2xl bg-[#2a080e] border border-[#5c1321] hover:border-[#c89f78]/60 transition-all shadow-xl space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Meta Bar */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#c89f78] bg-[#3d0c14] px-2 py-0.5 rounded border border-[#5c1321]">
                            {report.id}
                          </span>
                          <span className="text-[11px] text-[#d4c3b3]">{report.timeAgo}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${badge.bg}`}>
                          <Icon className="w-3 h-3" />
                          <span>{report.status}</span>
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-[#fdfbf7] mt-2 line-clamp-1">{report.title}</h4>
                      
                      <div className="flex items-center gap-2 text-xs text-[#d4c3b3] mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#c89f78]" />
                        <span>{report.location}</span>
                        <span>•</span>
                        <span className="text-amber-200 font-semibold">{report.category}</span>
                      </div>

                      <p className="text-xs text-[#e6d5c3] mt-2 line-clamp-2 leading-relaxed">
                        {report.description}
                      </p>
                    </div>

                    {/* Progress Tracker Stepper */}
                    <div className="pt-2 border-t border-[#5c1321] space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#d4c3b3]">
                        <span className={report.status === 'Reported' ? 'text-amber-300 font-bold' : ''}>1. Reported</span>
                        <span className={report.status === 'Seen' ? 'text-blue-300 font-bold' : ''}>2. Seen</span>
                        <span className={report.status === 'In Progress' ? 'text-amber-300 font-bold' : ''}>3. In Progress</span>
                        <span className={report.status === 'Resolved' ? 'text-emerald-400 font-bold' : ''}>4. Resolved</span>
                      </div>

                      <div className="w-full bg-[#140306] h-1.5 rounded-full overflow-hidden flex">
                        <div
                          className={`h-full transition-all duration-500 ${
                            report.status === 'Resolved'
                              ? 'w-full bg-emerald-500'
                              : report.status === 'In Progress'
                              ? 'w-3/4 bg-amber-500'
                              : report.status === 'Seen'
                              ? 'w-1/2 bg-blue-500'
                              : 'w-1/4 bg-rose-500'
                          }`}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#d4c3b3] pt-1">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3 text-[#c89f78]" />
                          <span>{report.upvotes || 0} upvotes</span>
                        </span>
                        {report.assignedTeam && (
                          <span className="text-[10px] text-amber-200 bg-[#3d0c14] px-2 py-0.5 rounded border border-[#5c1321]">
                            {report.assignedTeam}
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. Section 3: Student Campus Facility Ratings (If in All or Ratings tab) */}
      {(activeFilter === 'all' || activeFilter === 'ratings') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <h2 className="text-xl font-extrabold text-[#fdfbf7] tracking-tight">
                My Campus Facility Reviews & Ratings
              </h2>
            </div>

            <button
              onClick={onOpenRatingModal}
              className="text-xs font-bold text-[#c89f78] hover:text-white flex items-center gap-1 bg-[#3d0c14] hover:bg-[#5c1321] px-3 py-1.5 rounded-xl border border-[#c89f78]/30 transition-all"
            >
              <span>{myRating ? 'Edit Rating Score' : '+ Submit Facility Rating'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myRating ? (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#2a080e] via-[#3d0c14] to-[#1f0509] border border-[#c89f78]/40 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-200 bg-[#800020] px-2 py-0.5 rounded">
                      My Submitted Score: {myRating.overallHealthScore}/100 ⭐
                    </span>
                    <span className="text-xs text-[#d4c3b3]">{new Date(myRating.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">Campus Satisfaction Assessment</h4>
                </div>

                <button
                  onClick={onOpenRatingModal}
                  className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#a31c38] text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>Update Rating</span>
                </button>
              </div>

              {/* 5-Star Metrics Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                {[
                  { label: 'Cleanliness', score: myRating.cleanliness, emoji: '🧹' },
                  { label: 'Infrastructure', score: myRating.infrastructure, emoji: '🏫' },
                  { label: 'Electricity', score: myRating.electricity, emoji: '💡' },
                  { label: 'Water Supply', score: myRating.water, emoji: '🚰' },
                  { label: 'Campus Wi-Fi', score: myRating.internet, emoji: '📶' },
                ].map((metric) => (
                  <div key={metric.label} className="p-3 rounded-2xl bg-[#140306] border border-[#5c1321] text-center space-y-1">
                    <span className="text-lg">{metric.emoji}</span>
                    <div className="text-[11px] font-bold text-[#e6c5a0]">{metric.label}</div>
                    <div className="text-sm font-black text-amber-300 font-mono flex items-center justify-center gap-1">
                      <span>{metric.score}</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </div>
                  </div>
                ))}
              </div>

              {myRating.feedback && (
                <div className="p-3.5 rounded-2xl bg-[#140306]/80 border border-[#5c1321] text-xs text-[#fdfbf7] italic">
                  "{myRating.feedback}"
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-[#2a080e]/60 border border-[#5c1321] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#3d0c14] text-amber-200 mx-auto flex items-center justify-center border border-[#c89f78]/30">
                <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
              </div>
              <h4 className="text-base font-bold text-[#fdfbf7]">No Campus Facility Ratings Yet</h4>
              <p className="text-xs text-[#d4c3b3] max-w-md mx-auto">
                Share your 1-to-5 star evaluation on Cleanliness, Power continuity, RO water, Wi-Fi speed, and Academic Infrastructure to help administration improve campus quality.
              </p>
              <button
                onClick={onOpenRatingModal}
                className="px-6 py-2.5 rounded-xl bg-[#800020] hover:bg-[#a31c38] text-white text-xs font-bold shadow-lg transition-all"
              >
                ⭐ Rate Campus Facilities Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* 7. Modal: Full Gate Pass QR Code Viewer */}
      {selectedPassForQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#2a080e] border-2 border-[#c89f78] rounded-3xl p-6 shadow-2xl text-center space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-[#5c1321] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-[#fdfbf7]">Official SITM Gate Pass</h3>
              </div>
              <button
                onClick={() => setSelectedPassForQR(null)}
                className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl inline-block shadow-inner">
              <QRCodeSVG
                value={`SITM-GATE-PASS:${selectedPassForQR.id}|${selectedPassForQR.studentName}|${selectedPassForQR.hostelRoom}|${selectedPassForQR.gateSecurityPassCode}|STATUS:${selectedPassForQR.status}`}
                size={180}
                level="H"
                includeMargin
              />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-mono font-bold text-amber-300 bg-[#3d0c14] py-1 px-3 rounded-lg inline-block border border-[#c89f78]/30">
                Security Code: {selectedPassForQR.gateSecurityPassCode || 'SITM-GP-88210'}
              </div>
              <h4 className="text-sm font-bold text-white">{selectedPassForQR.studentName}</h4>
              <p className="text-xs text-[#d4c3b3]">{selectedPassForQR.hostelRoom}</p>
            </div>

            <div className="p-3 rounded-xl bg-[#140306] border border-[#5c1321] text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#e6c5a0]">Purpose:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">{selectedPassForQR.purpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#e6c5a0]">Departure:</span>
                <span className="font-mono text-amber-200">{selectedPassForQR.goingDate} @ {selectedPassForQR.goingTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#e6c5a0]">Expected Return:</span>
                <span className="font-mono text-emerald-300">{selectedPassForQR.returnDate} @ {selectedPassForQR.returnTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#e6c5a0]">Warden Approval:</span>
                <span className="font-bold text-emerald-400">{selectedPassForQR.approvedBy || 'Approved by Chief Warden'}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPassForQR(null)}
              className="w-full py-2.5 rounded-xl bg-[#800020] hover:bg-[#a31c38] text-white font-bold text-xs shadow-lg transition-all"
            >
              Done / Close Pass
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
