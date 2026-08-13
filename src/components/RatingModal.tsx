import React, { useState } from 'react';
import { 
  X, Star, Sparkles, Building, Zap, Droplets, Wifi, 
  Send, ThumbsUp, CheckCircle2, ShieldCheck, HeartPulse
} from 'lucide-react';
import { CampusRating, UserProfile } from '../types';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSubmitRating: (rating: CampusRating) => void;
  existingUserRating?: CampusRating | null;
}

interface MetricConfig {
  id: 'cleanliness' | 'infrastructure' | 'electricity' | 'water' | 'internet';
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  iconBg: string;
}

const METRICS: MetricConfig[] = [
  {
    id: 'cleanliness',
    name: 'Campus Cleanliness & Hygiene',
    desc: 'Washrooms, hostel corridors, cafeteria hygiene, campus trash clearance',
    icon: Sparkles,
    color: 'text-emerald-400',
    iconBg: 'bg-emerald-950/80 border-emerald-500/30',
  },
  {
    id: 'infrastructure',
    name: 'Campus Infrastructure',
    desc: 'Classrooms, computer & hardware labs, central library, smart boards & desks',
    icon: Building,
    color: 'text-blue-400',
    iconBg: 'bg-blue-950/80 border-blue-500/30',
  },
  {
    id: 'electricity',
    name: 'Electricity & Power Continuity',
    desc: '24x7 generator/solar backup, room lighting, lab sockets, zero voltage drop',
    icon: Zap,
    color: 'text-amber-400',
    iconBg: 'bg-amber-950/80 border-amber-500/30',
  },
  {
    id: 'water',
    name: 'Water Supply & Drinking RO',
    desc: 'Purified RO water dispensers, regular filter changes, 24x7 running water',
    icon: Droplets,
    color: 'text-cyan-400',
    iconBg: 'bg-cyan-950/80 border-cyan-500/30',
  },
  {
    id: 'internet',
    name: 'Internet & Campus Wi-Fi',
    desc: 'High-speed optical fiber, Wi-Fi coverage across hostels, labs, and library',
    icon: Wifi,
    color: 'text-indigo-400',
    iconBg: 'bg-indigo-950/80 border-indigo-500/30',
  },
];

const STAR_LABELS = [
  '',
  '1 - Poor (Critical Attention Needed)',
  '2 - Fair (Below Expectations)',
  '3 - Good (Satisfactory)',
  '4 - Very Good (High Quality)',
  '5 - Excellent (World Class)',
];

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmitRating,
  existingUserRating,
}) => {
  const [cleanliness, setCleanliness] = useState<number>(existingUserRating?.cleanliness || 4);
  const [infrastructure, setInfrastructure] = useState<number>(existingUserRating?.infrastructure || 4);
  const [electricity, setElectricity] = useState<number>(existingUserRating?.electricity || 5);
  const [water, setWater] = useState<number>(existingUserRating?.water || 4);
  const [internet, setInternet] = useState<number>(existingUserRating?.internet || 4);
  
  const [studentName, setStudentName] = useState<string>(currentUser?.name || existingUserRating?.userName || '');
  const [department, setDepartment] = useState<string>(currentUser?.department || existingUserRating?.department || 'CSE');
  const [residenceType, setResidenceType] = useState<'Hosteller' | 'Day Scholar'>(
    currentUser?.residenceType || existingUserRating?.residenceType || 'Hosteller'
  );
  const [feedback, setFeedback] = useState<string>(existingUserRating?.feedback || '');
  const [hoveredStar, setHoveredStar] = useState<{ metricId: string; star: number } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  // Calculate live health score out of 100 based on weighted averages
  const avgStars = (cleanliness + infrastructure + electricity + water + internet) / 5;
  const calculatedHealthScore = Math.round((avgStars / 5) * 100);

  const getMetricValue = (id: MetricConfig['id']) => {
    switch (id) {
      case 'cleanliness': return cleanliness;
      case 'infrastructure': return infrastructure;
      case 'electricity': return electricity;
      case 'water': return water;
      case 'internet': return internet;
    }
  };

  const setMetricValue = (id: MetricConfig['id'], val: number) => {
    switch (id) {
      case 'cleanliness': setCleanliness(val); break;
      case 'infrastructure': setInfrastructure(val); break;
      case 'electricity': setElectricity(val); break;
      case 'water': setWater(val); break;
      case 'internet': setInternet(val); break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ratingData: CampusRating = {
      id: existingUserRating?.id || `CR-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      userId: currentUser?.uid || currentUser?.id || `anon-${Date.now()}`,
      userName: studentName.trim() || 'Verified SITM Student',
      userEmail: currentUser?.email || 'student@sitm.ac.in',
      department: department.trim() || 'Engineering & Tech',
      residenceType,
      cleanliness,
      infrastructure,
      electricity,
      water,
      internet,
      overallHealthScore: calculatedHealthScore,
      feedback: feedback.trim(),
      createdAt: new Date().toISOString(),
      upvotes: existingUserRating?.upvotes || 0,
    };

    onSubmitRating(ratingData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#1e0509] border border-[#5c1321] rounded-3xl shadow-2xl overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#2a080e] via-[#3d0c14] to-[#2a080e] border-b border-[#5c1321] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#800020] text-amber-300 border border-[#c89f78]/40 shadow-lg shadow-maroon-950/50">
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#fdfbf7] tracking-tight">
                Rate Campus Health & Facilities
              </h2>
              <p className="text-xs text-[#d4c3b3]">
                Your rating directly updates SITM's Real-Time Health Index & Maintenance Priority
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#3d0c14] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-950/60 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-emerald-300">Thank You For Your Feedback!</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Your facility rating of <span className="font-bold text-amber-300 font-mono">{calculatedHealthScore}/100</span> has been recorded into the live Campus Health Score Index.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Live Computed Overall Health Gauge Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2a080e] via-[#3d0c14] to-[#1e0509] border border-[#5c1321] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#120305] border border-[#5c1321] text-center shrink-0">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
                    {calculatedHealthScore}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-bold">/ 100</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#c89f78]">
                      Your Overall Rating Index
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Average: <span className="font-bold text-white font-mono">{avgStars.toFixed(1)} / 5.0 Stars</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(avgStars)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 5 Rating Categories Grid */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#c89f78] flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                <span>Rate 5 Core Campus Facilities (1 to 5 Stars)</span>
              </h3>

              <div className="space-y-3">
                {METRICS.map((metric) => {
                  const Icon = metric.icon;
                  const currentVal = getMetricValue(metric.id);
                  const activeHover = hoveredStar?.metricId === metric.id ? hoveredStar.star : 0;
                  const displayStar = activeHover || currentVal;

                  return (
                    <div
                      key={metric.id}
                      className="p-3.5 rounded-2xl bg-[#2a080e]/60 border border-[#5c1321] hover:border-[#800020] transition-all space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl border shrink-0 ${metric.iconBg} ${metric.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-[#fdfbf7]">
                              {metric.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 leading-snug">
                              {metric.desc}
                            </p>
                          </div>
                        </div>

                        {/* Interactive Star Buttons */}
                        <div className="flex items-center gap-1 self-end sm:self-center">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const isFilled = star <= displayStar;
                            return (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setMetricValue(metric.id, star)}
                                onMouseEnter={() => setHoveredStar({ metricId: metric.id, star })}
                                onMouseLeave={() => setHoveredStar(null)}
                                className="p-1 rounded-lg hover:bg-black/40 transition-transform active:scale-90"
                                title={`${star} Stars`}
                              >
                                <Star
                                  className={`w-6 h-6 transition-colors ${
                                    isFilled
                                      ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                                      : 'text-slate-600 hover:text-amber-200'
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Star Label Status indicator */}
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#3d0c14] text-slate-400">
                        <span className="font-mono text-amber-300 font-semibold">
                          Score: {currentVal} / 5
                        </span>
                        <span className="italic text-slate-300">
                          {STAR_LABELS[displayStar] || STAR_LABELS[currentVal]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Student Metadata & Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Name (or Anonymous)
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 rounded-xl bg-[#120305] border border-[#5c1321] text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Department / Branch
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. CSE 4th Sem"
                  className="w-full px-3 py-2 rounded-xl bg-[#120305] border border-[#5c1321] text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Residence Type
                </label>
                <select
                  value={residenceType}
                  onChange={(e) => setResidenceType(e.target.value as 'Hosteller' | 'Day Scholar')}
                  className="w-full px-3 py-2 rounded-xl bg-[#120305] border border-[#5c1321] text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Hosteller">Hosteller (Campus Resident)</option>
                  <option value="Day Scholar">Day Scholar</option>
                </select>
              </div>
            </div>

            {/* Feedback and Suggestions */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Constructive Feedback & Suggestions (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Mention specific areas that need improvement or praise maintenance teams (e.g. 'Wi-Fi speeds are great in library, but water pressure in 3rd floor bathroom needs fixing')..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#120305] border border-[#5c1321] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#5c1321]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-[#2a080e] hover:bg-[#3d0c14] text-slate-300 font-bold text-xs border border-[#5c1321] transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#800020] via-[#a31c38] to-[#c89f78] hover:brightness-110 text-white font-bold text-xs border border-[#c89f78]/40 shadow-xl shadow-maroon-950/60 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-amber-200" />
                <span>Submit Campus Rating ⭐</span>
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};
