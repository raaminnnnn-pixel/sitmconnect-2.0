import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Upload, AlertTriangle, Sparkles, Image as ImageIcon, Camera, User, UserX, Building2, Phone, Home, ShieldCheck, Lock } from 'lucide-react';
import { Category, Priority, ProblemReport, ReportingOption, ResidenceType, UserProfile } from '../types';

interface ReportFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (newReport: Omit<ProblemReport, 'id' | 'status' | 'reportedAt' | 'timeAgo' | 'upvotes'>) => string; // returns report ID
  currentUser?: UserProfile | null;
  onOpenProfileModal?: () => void;
}

export const ReportFormModal: React.FC<ReportFormModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
  currentUser,
  onOpenProfileModal,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Electricity');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('High');
  
  // Student Reporting Mode & Details State
  const [reportingOption, setReportingOption] = useState<ReportingOption>('identified');
  const [reporterName, setReporterName] = useState('');
  const [reporterDept, setReporterDept] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [residenceType, setResidenceType] = useState<ResidenceType>('Hosteller');
  const [roomNo, setRoomNo] = useState('');
  const [floorNo, setFloorNo] = useState('');

  const [imageUrl, setImageUrl] = useState('');
  
  // Submission success state
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

  // Auto-fill user profile when modal opens or profile changes
  useEffect(() => {
    if (isOpen && currentUser) {
      setReporterName(currentUser.name || '');
      setReporterDept(currentUser.department || '');
      setReporterPhone(currentUser.phone || '');
      setResidenceType(currentUser.residenceType || 'Hosteller');
      setRoomNo(currentUser.roomNo || '');
      setFloorNo(currentUser.floorNo || '');
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const categories: { name: Category; icon: string }[] = [
    { name: 'Electricity', icon: '💡' },
    { name: 'Water', icon: '🚰' },
    { name: 'Cleanliness', icon: '🧹' },
    { name: 'Internet/Wi-Fi', icon: '📶' },
    { name: 'Furniture', icon: '🪑' },
    { name: 'Classroom', icon: '🏫' },
    { name: 'Washroom', icon: '🚻' },
    { name: 'Campus Area', icon: '🌳' },
    { name: 'Other', icon: '⚠️' }
  ];

  const sampleLocations = [
    'CSE Block — Room 204',
    'CSE Block — Lab 1',
    'Central Library — Reading Hall',
    'Boys Hostel Wing A — 2nd Floor',
    'Girls Hostel Wing B — Ground Floor',
    'Student Cafeteria — Food Court',
    'Administrative Block — B-102',
    'IT Park — Lab 3',
    'Sports Complex — Badminton Hall',
    'Main Gate & Parking Zone'
  ];

  const samplePhotos = [
    { label: 'Electrical Issue', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400' },
    { label: 'Water Plumbing', url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=400' },
    { label: 'Damaged Furniture', url: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&q=80&w=400' },
    { label: 'Wi-Fi / Network', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400' },
  ];

  const handleImageUploadSimulation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !description.trim()) return;

    const isAnon = reportingOption === 'anonymous';

    const reportId = onSubmitReport({
      title,
      category,
      location,
      description,
      priority,
      imageUrl: imageUrl || undefined,
      isAnonymous: isAnon,
      reporterName: isAnon ? 'Anonymous Student' : (reporterName.trim() || 'Student'),
      reporterDept: isAnon ? undefined : (reporterDept.trim() || undefined),
      reporterPhone: isAnon ? undefined : (reporterPhone.trim() || undefined),
      residenceType: isAnon ? undefined : residenceType,
      roomNo: isAnon || residenceType !== 'Hosteller' ? undefined : (roomNo.trim() || undefined),
      floorNo: isAnon || residenceType !== 'Hosteller' ? undefined : (floorNo.trim() || undefined),
    });

    setSubmittedReportId(reportId);
  };

  const handleResetAndClose = () => {
    setTitle('');
    setLocation('');
    setDescription('');
    setImageUrl('');
    setReporterName('');
    setReporterDept('');
    setReporterPhone('');
    setResidenceType('Hosteller');
    setRoomNo('');
    setFloorNo('');
    setReportingOption('identified');
    setSubmittedReportId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl glass-card rounded-3xl border border-white/20 shadow-2xl overflow-hidden bg-[#1c2541]/95 my-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Report a Campus Problem</h3>
              <p className="text-xs text-slate-400">Fill details to notify campus maintenance crew immediately</p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Show Form OR Success Screen */}
        {submittedReportId ? (
          
          /* Success Screen Animation */
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center animate-checkmark shadow-xl shadow-emerald-500/20">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                ✓ Problem Reported Successfully
              </h4>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Your report has been logged and assigned to the maintenance dispatch team.
              </p>
            </div>

            <div className="inline-block p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/40 text-center space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Generated Report ID</span>
              <div className="text-3xl font-black font-mono bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {submittedReportId}
              </div>
              <p className="text-[11px] text-emerald-400 font-medium">Status: Reported (Queued)</p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleResetAndClose}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all"
              >
                Done & Track Issue
              </button>
              <button
                onClick={() => {
                  setSubmittedReportId(null);
                  setTitle('');
                  setDescription('');
                  setImageUrl('');
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl glass-card text-slate-200 hover:text-white text-sm font-semibold border border-white/10"
              >
                + Report Another
              </button>
            </div>
          </div>

        ) : (

          /* Problem Reporting Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Problem Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Broken Fan in Room 204 / Wi-Fi Down"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Category Grid */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Category <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs font-medium transition-all ${
                      category === cat.name
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-cyan-400 text-white shadow-md'
                        : 'glass-card-light text-slate-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Location & Priority Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Location Manual Text Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Campus Location <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE Block Room 201, Boys Hostel Wing B"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:ring-2 focus:ring-[#c89f78]"
                />
              </div>

              {/* Priority Radio Cards */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Priority Level
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Low', 'Medium', 'High', 'Emergency'] as Priority[]).map((p) => {
                    const active = priority === p;
                    let colorClass = 'border-slate-700 text-slate-400';
                    if (active) {
                      if (p === 'Low') colorClass = 'bg-blue-500/20 border-blue-400 text-blue-300';
                      if (p === 'Medium') colorClass = 'bg-amber-500/20 border-amber-400 text-amber-300';
                      if (p === 'High') colorClass = 'bg-rose-500/20 border-rose-400 text-rose-300';
                      if (p === 'Emergency') colorClass = 'bg-red-600/30 border-red-500 text-red-200 font-bold animate-pulse';
                    }
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`py-2 px-1 rounded-xl border text-[11px] font-bold text-center transition-all ${colorClass}`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Detailed Description <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe what is broken, room number, or specific details for maintenance staff..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Optional Image Upload UI */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
                <span>Attach Photo (Optional)</span>
                <span className="text-[10px] text-slate-400 font-normal">Select sample or upload file</span>
              </label>

              {imageUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 h-40 group">
                  <img src={imageUrl} alt="Uploaded problem preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-lg"
                    >
                      Remove Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="border-2 border-dashed border-white/20 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400/50 hover:bg-white/5 transition-all">
                    <Upload className="w-6 h-6 text-cyan-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-200">Click to upload photo from device</span>
                    <span className="text-[10px] text-slate-400">PNG, JPG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUploadSimulation}
                      className="hidden"
                    />
                  </label>

                  {/* Sample Photo Selection */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Sample Photos:</span>
                    {samplePhotos.map((photo, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setImageUrl(photo.url)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 text-[11px] text-slate-300 shrink-0"
                      >
                        {photo.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Student Reporting Option Selection */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Student Reporting Method <span className="text-red-400">*</span>
              </label>

              {/* Two Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Option 1: Identified */}
                <button
                  type="button"
                  onClick={() => setReportingOption('identified')}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    reportingOption === 'identified'
                      ? 'bg-gradient-to-r from-[#800020]/40 to-[#c89f78]/20 border-[#c89f78] text-white shadow-lg ring-1 ring-[#c89f78]'
                      : 'bg-slate-900/60 text-slate-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${
                    reportingOption === 'identified' ? 'bg-[#800020] text-[#e6c5a0]' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Add My Details</span>
                      <span className="text-[10px] bg-[#c89f78]/20 text-[#e6c5a0] px-1.5 py-0.5 rounded font-mono">Recommended</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                      Include name, department, phone & hostel details for easy contact by maintenance staff.
                    </p>
                  </div>
                </button>

                {/* Option 2: Anonymous */}
                <button
                  type="button"
                  onClick={() => setReportingOption('anonymous')}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    reportingOption === 'anonymous'
                      ? 'bg-gradient-to-r from-[#800020]/40 to-[#c89f78]/20 border-[#c89f78] text-white shadow-lg ring-1 ring-[#c89f78]'
                      : 'bg-slate-900/60 text-slate-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${
                    reportingOption === 'anonymous' ? 'bg-[#800020] text-[#e6c5a0]' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <UserX className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Report Anonymously</div>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                      Submit without sharing personal details. Your identity remains strictly hidden.
                    </p>
                  </div>
                </button>

              </div>

              {/* Conditional Inputs based on Selected Option */}
              {reportingOption === 'identified' ? (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-[#c89f78]/30 space-y-4 animate-in fade-in duration-200">
                  
                  {/* Profile Status Banner */}
                  {currentUser ? (
                    <div className="p-3 rounded-xl bg-[#3d0c14] border border-[#c89f78]/40 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#c89f78]" />
                        <span className="text-[#fdfbf7]">
                          Auto-filled from Account: <strong className="text-[#e6c5a0]">{currentUser.name}</strong> ({currentUser.role === 'management' ? 'Management / Staff' : 'Student'})
                        </span>
                      </div>
                      {onOpenProfileModal && (
                        <button
                          type="button"
                          onClick={onOpenProfileModal}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#e6c5a0] text-[11px] font-bold"
                        >
                          View Account
                        </button>
                      )}
                    </div>
                  ) : (
                    onOpenProfileModal && (
                      <div className="p-3 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-[#c89f78]" />
                          <span className="text-slate-300">Sign in to auto-fill your campus account details</span>
                        </div>
                        <button
                          type="button"
                          onClick={onOpenProfileModal}
                          className="px-2.5 py-1 rounded-lg bg-[#800020] text-white text-[11px] font-bold hover:bg-[#a31c38]"
                        >
                          Sign In / Sign Up
                        </button>
                      </div>
                    )
                  )}

                  <div className="flex items-center gap-2 text-xs font-bold text-[#e6c5a0] pb-2 border-b border-white/10">
                    <User className="w-4 h-4 text-[#c89f78]" />
                    <span>Student Contact & Residence Information</span>
                  </div>

                  {/* Name & Department */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required={reportingOption === 'identified'}
                        placeholder="e.g. Rahul Sharma"
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-white focus:ring-2 focus:ring-[#c89f78]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                        Department / Branch
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CSE / ECE 3rd Sem"
                        value={reporterDept}
                        onChange={(e) => setReporterDept(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-white focus:ring-2 focus:ring-[#c89f78]"
                      />
                    </div>
                  </div>

                  {/* Phone & Residence Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#c89f78]" />
                        <span>Phone Number</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={reporterPhone}
                        onChange={(e) => setReporterPhone(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-white focus:ring-2 focus:ring-[#c89f78]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                        Student Residence Type
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['Hosteller', 'Day Scholar'] as ResidenceType[]).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setResidenceType(type)}
                            className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                              residenceType === type
                                ? 'bg-[#800020] border-[#c89f78] text-[#fdfbf7] shadow-sm'
                                : 'bg-slate-800 text-slate-400 border-white/10 hover:text-white'
                            }`}
                          >
                            {type === 'Hosteller' ? '🏠 Hosteller' : '🚌 Day Scholar'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Conditional Room & Floor No if Hosteller */}
                  {residenceType === 'Hosteller' && (
                    <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                          <Home className="w-3 h-3 text-[#c89f78]" />
                          <span>Hostel Room No.</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Room 304 / Block A"
                          value={roomNo}
                          onChange={(e) => setRoomNo(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-white focus:ring-2 focus:ring-[#c89f78]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-[#c89f78]" />
                          <span>Floor No.</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 3rd Floor / Ground Floor"
                          value={floorNo}
                          onChange={(e) => setFloorNo(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-white focus:ring-2 focus:ring-[#c89f78]"
                        />
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                /* Anonymous Confirmation Banner */
                <div className="p-4 rounded-2xl bg-[#3d0c14]/80 border border-[#c89f78]/40 flex items-center gap-3 animate-in fade-in duration-200">
                  <div className="p-2.5 rounded-xl bg-[#800020] text-[#e6c5a0] shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#fdfbf7]">Anonymous Mode Active</h5>
                    <p className="text-[11px] text-[#e6d5c3] mt-0.5">
                      No personal information, student name, department, phone or room numbers will be stored or shared with maintenance staff.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#800020] via-[#a31c38] to-[#c89f78] text-white font-bold text-base shadow-xl shadow-[#800020]/40 hover:scale-[1.01] transition-all active:scale-95 flex items-center justify-center gap-2 border border-[#c89f78]/30"
              >
                <Sparkles className="w-5 h-5 text-[#fdfbf7]" />
                <span>Submit Report to Maintenance</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
