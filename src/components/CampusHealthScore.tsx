import React, { useState } from 'react';
import { 
  Activity, Building, Zap, Droplets, Wifi, Sparkles, 
  TrendingUp, Star, MessageSquare, ThumbsUp, HeartPulse,
  Filter, CheckCircle2, UserCheck, ShieldCheck, ChevronRight
} from 'lucide-react';
import { CampusRating, ProblemReport } from '../types';

interface CampusHealthScoreProps {
  ratings: CampusRating[];
  reports: ProblemReport[];
  onOpenRatingModal: () => void;
  onUpvoteRating?: (id: string) => void;
}

export const CampusHealthScore: React.FC<CampusHealthScoreProps> = ({
  ratings,
  reports,
  onOpenRatingModal,
  onUpvoteRating,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  // Compute live dynamic scores from student ratings
  const totalRatings = ratings.length;

  const getCategoryAvg = (key: 'cleanliness' | 'infrastructure' | 'electricity' | 'water' | 'internet') => {
    if (totalRatings === 0) return 4.0;
    const sum = ratings.reduce((acc, curr) => acc + (curr[key] || 4), 0);
    return sum / totalRatings;
  };

  const cleanlinessAvg = getCategoryAvg('cleanliness');
  const infrastructureAvg = getCategoryAvg('infrastructure');
  const electricityAvg = getCategoryAvg('electricity');
  const waterAvg = getCategoryAvg('water');
  const internetAvg = getCategoryAvg('internet');

  // Overall Health Score (converted to 100 scale)
  const overallAvgStars = (cleanlinessAvg + infrastructureAvg + electricityAvg + waterAvg + internetAvg) / 5;
  
  // Factor in problem report resolution speed/ratio (bonus up to +5 points)
  const resolvedProblems = reports.filter(r => r.status === 'Resolved').length;
  const totalProblems = reports.length;
  const resolutionBonus = totalProblems > 0 ? (resolvedProblems / totalProblems) * 5 : 4;
  
  const healthScore = Math.min(Math.max(Math.round((overallAvgStars / 5) * 95 + resolutionBonus), 60), 99);

  const metricsData = [
    {
      id: 'cleanliness',
      name: 'Cleanliness & Hygiene',
      avg: cleanlinessAvg,
      score: Math.round((cleanlinessAvg / 5) * 100),
      icon: Sparkles,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      iconBg: 'bg-emerald-950/80 border-emerald-500/30',
      status: cleanlinessAvg >= 4.2 ? 'Sanitized Daily' : cleanlinessAvg >= 3.5 ? 'Satisfactory' : 'Needs Attention',
    },
    {
      id: 'infrastructure',
      name: 'Campus Infrastructure',
      avg: infrastructureAvg,
      score: Math.round((infrastructureAvg / 5) * 100),
      icon: Building,
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
      iconBg: 'bg-blue-950/80 border-blue-500/30',
      status: infrastructureAvg >= 4.2 ? 'Modern & Maintained' : infrastructureAvg >= 3.5 ? 'Good Condition' : 'Maintenance Required',
    },
    {
      id: 'electricity',
      name: 'Electricity & Power',
      avg: electricityAvg,
      score: Math.round((electricityAvg / 5) * 100),
      icon: Zap,
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      iconBg: 'bg-amber-950/80 border-amber-500/30',
      status: electricityAvg >= 4.2 ? '24x7 Solar/Grid Backup' : electricityAvg >= 3.5 ? 'Stable' : 'Frequent Drops',
    },
    {
      id: 'water',
      name: 'Water Supply & RO',
      avg: waterAvg,
      score: Math.round((waterAvg / 5) * 100),
      icon: Droplets,
      color: 'bg-cyan-500',
      textColor: 'text-cyan-400',
      iconBg: 'bg-cyan-950/80 border-cyan-500/30',
      status: waterAvg >= 4.2 ? 'Purified RO & Continuous' : waterAvg >= 3.5 ? 'Adequate' : 'Pressure Issues',
    },
    {
      id: 'internet',
      name: 'Internet & Wi-Fi',
      avg: internetAvg,
      score: Math.round((internetAvg / 5) * 100),
      icon: Wifi,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-400',
      iconBg: 'bg-indigo-950/80 border-indigo-500/30',
      status: internetAvg >= 4.2 ? 'High-Speed Fiber' : internetAvg >= 3.5 ? 'Standard Speed' : 'Coverage Gaps',
    },
  ];

  const handleVote = (ratingId: string) => {
    if (votedIds.has(ratingId)) return;
    setVotedIds(prev => new Set(prev).add(ratingId));
    if (onUpvoteRating) {
      onUpvoteRating(ratingId);
    }
  };

  // Filter feedback reviews
  const filteredRatings = ratings.filter(r => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'feedback-only') return Boolean(r.feedback && r.feedback.trim().length > 0);
    return true;
  });

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-b from-[#2d080e] via-[#1f0509] to-[#140306] rounded-3xl p-6 sm:p-10 border border-[#5c1321] shadow-2xl relative overflow-hidden">
        
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#800020]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#c89f78]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#5c1321]/80">
          <div>
            <div className="flex items-center gap-2 text-[#c89f78] text-xs font-bold uppercase tracking-wider mb-1">
              <HeartPulse className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Verified Student Evaluation Index</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#fdfbf7] tracking-tight">
              Campus Health & Facility Scorecard
            </h2>
            <p className="text-xs sm:text-sm text-[#d4c3b3] mt-1 max-w-xl">
              Real-time rating aggregated directly from student feedback across Cleanliness, Infrastructure, Electricity, Water, and Wi-Fi.
            </p>
          </div>

          <button
            onClick={onOpenRatingModal}
            className="self-start md:self-center px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#800020] via-[#a31c38] to-[#c89f78] hover:brightness-110 text-white font-bold text-xs sm:text-sm border border-[#c89f78]/40 shadow-xl shadow-maroon-950/60 transition-all hover:scale-105 active:scale-95 flex items-center gap-2.5 shrink-0"
          >
            <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Rate Campus Facilities ⭐</span>
          </button>
        </div>

        {/* Main Grid: Circular Index Meter & 5 Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8">
          
          {/* Left Column: Circular Health Score Gauge */}
          <div className="lg:col-span-5 text-center flex flex-col items-center justify-center space-y-4">
            
            <div className="flex items-center gap-2 text-[#c89f78] text-xs font-bold uppercase tracking-wider">
              <Activity className="w-4 h-4 animate-pulse text-[#c89f78]" />
              <span>Real-Time Composite Index</span>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 my-2 flex items-center justify-center">
              
              {/* Outer Glow Ring */}
              <div 
                className="w-full h-full circular-chart transition-all duration-1000 p-3.5 shadow-2xl shadow-[#800020]/40"
                style={{ '--percentage': `${healthScore}%` } as React.CSSProperties}
              >
                {/* Inner Mask Circle */}
                <div className="w-full h-full bg-[#140306] rounded-full flex flex-col items-center justify-center border border-[#5c1321] p-4 text-center">
                  <span className="text-5xl sm:text-6xl font-black font-mono bg-gradient-to-r from-[#f7f1e5] via-[#d4a373] to-[#c89f78] bg-clip-text text-transparent">
                    {healthScore}
                  </span>
                  <span className="text-xs font-extrabold text-[#d4c3b3] mt-0.5 font-mono">/ 100 SCORE</span>
                  <span className="mt-2.5 px-3 py-1 rounded-full bg-[#800020]/40 text-amber-200 text-[10px] font-bold border border-[#c89f78]/30 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-amber-300" />
                    {healthScore >= 80 ? 'Optimal Performance' : healthScore >= 70 ? 'Good Standard' : 'Requires Attention'}
                  </span>
                </div>
              </div>

            </div>

            <div className="flex items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1 font-mono">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <strong className="text-white font-bold">{totalRatings}</strong> Student Ratings
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 font-mono">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <strong className="text-white font-bold">{overallAvgStars.toFixed(1)}</strong> / 5.0 Avg
              </span>
            </div>

            <p className="text-[11px] text-[#a38c7e] max-w-xs leading-relaxed">
              Weighted calculation of verified student responses and maintenance problem resolution records.
            </p>

          </div>

          {/* Right Column: 5 Facilities Breakdown Progress Rows */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="pb-2 border-b border-[#5c1321] flex items-center justify-between">
              <h4 className="text-sm sm:text-base font-bold text-[#fdfbf7]">
                Facility Breakdown & Student Satisfaction
              </h4>
              <span className="text-[11px] font-mono text-[#c89f78] bg-[#3d0c14] px-2.5 py-0.5 rounded-full border border-[#5c1321]">
                5 CORE PILLARS
              </span>
            </div>

            <div className="space-y-3.5">
              {metricsData.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div 
                    key={metric.id} 
                    className="p-3 rounded-2xl bg-[#1a0407]/80 border border-[#5c1321] hover:border-[#800020] transition-all space-y-2"
                  >
                    
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg border ${metric.iconBg} ${metric.textColor}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[#f5efe6] font-bold block">{metric.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{metric.status}</span>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="font-mono font-bold text-white text-xs">
                            {metric.avg.toFixed(1)}
                          </span>
                        </div>
                        <span className="font-mono font-extrabold text-[#c89f78] text-xs w-10 text-right">
                          {metric.score}%
                        </span>
                      </div>
                    </div>

                    {/* Metric Bar */}
                    <div className="w-full h-2 rounded-full bg-[#120305] border border-[#3d0c14] overflow-hidden p-0.5">
                      <div 
                        className={`h-full rounded-full ${metric.color} transition-all duration-1000 shadow-sm`}
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>

                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-[11px] text-[#a38c7e] flex items-center justify-between">
              <span>Updated in real-time as students submit new ratings.</span>
              <button 
                onClick={onOpenRatingModal}
                className="text-amber-300 hover:text-amber-200 font-bold underline transition-colors"
              >
                Add Your Evaluation →
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Student Reviews & Verified Community Feedback Feed */}
      <div className="bg-[#1a0407] rounded-3xl p-6 sm:p-8 border border-[#5c1321] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#3d0c14]">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Student Reviews & Facility Feedback
              </h3>
              <p className="text-xs text-slate-400">
                Transparent community suggestions for campus administrative improvement
              </p>
            </div>
          </div>

          {/* Quick Filter */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#800020] text-amber-200 border border-[#c89f78]/50'
                  : 'bg-[#2a080e] text-slate-400 hover:text-white border border-[#5c1321]'
              }`}
            >
              All Ratings ({ratings.length})
            </button>
            <button
              onClick={() => setSelectedCategory('feedback-only')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'feedback-only'
                  ? 'bg-[#800020] text-amber-200 border border-[#c89f78]/50'
                  : 'bg-[#2a080e] text-slate-400 hover:text-white border border-[#5c1321]'
              }`}
            >
              With Comments
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRatings.map((rating) => {
            const isVoted = votedIds.has(rating.id);
            const votes = (rating.upvotes || 0) + (isVoted ? 1 : 0);

            return (
              <div
                key={rating.id}
                className="p-4 rounded-2xl bg-[#23060a] border border-[#5c1321] hover:border-[#800020] transition-all space-y-3 flex flex-col justify-between"
              >
                {/* Header Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#800020] to-[#c89f78] text-white flex items-center justify-center font-black text-xs shadow-md">
                        {rating.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#fdfbf7]">
                            {rating.userName}
                          </span>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {rating.department || 'CSE'} • {rating.residenceType || 'Hosteller'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#120305] border border-[#5c1321]">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-mono font-bold text-amber-200">
                        {rating.overallHealthScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Rating Stars Quick Pill Matrix */}
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                    <span className="px-2 py-0.5 rounded-md bg-[#120305] text-emerald-300 border border-emerald-500/20">
                      🧹 Clean: {rating.cleanliness}★
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#120305] text-blue-300 border border-blue-500/20">
                      🏛️ Infra: {rating.infrastructure}★
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#120305] text-amber-300 border border-amber-500/20">
                      ⚡ Power: {rating.electricity}★
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#120305] text-cyan-300 border border-cyan-500/20">
                      💧 Water: {rating.water}★
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#120305] text-indigo-300 border border-indigo-500/20">
                      📶 Wi-Fi: {rating.internet}★
                    </span>
                  </div>

                  {/* Feedback Text */}
                  {rating.feedback && (
                    <p className="text-xs text-slate-300 italic bg-[#150306] p-3 rounded-xl border border-[#3d0c14] leading-relaxed">
                      "{rating.feedback}"
                    </p>
                  )}
                </div>

                {/* Footer timestamp & upvote */}
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#3d0c14] text-slate-400">
                  <span className="font-mono">
                    {new Date(rating.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>

                  <button
                    onClick={() => handleVote(rating.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all ${
                      isVoted
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-[#150306] border-[#3d0c14] text-slate-400 hover:text-white hover:border-[#5c1321]'
                    }`}
                  >
                    <ThumbsUp className={`w-3 h-3 ${isVoted ? 'fill-amber-300' : ''}`} />
                    <span>Helpful ({votes})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
