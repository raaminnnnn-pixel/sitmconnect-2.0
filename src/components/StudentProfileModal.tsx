import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Home, 
  CheckCircle2, 
  LogOut, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Camera,
  Edit3,
  UserCheck
} from 'lucide-react';
import { StudentProfile, ResidenceType } from '../types';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile | null;
  onSaveProfile: (profile: StudentProfile) => void;
  onSignOut: () => void;
}

// Preset Google Accounts for quick 1-click Google Sign-In demonstration
const SAMPLE_GOOGLE_ACCOUNTS = [
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@sitm.edu.in',
    department: 'B.Tech (CSE)',
    phone: '9876543210',
    residenceType: 'Hosteller' as ResidenceType,
    roomNo: 'A-304',
    floorNo: '3rd Floor',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  },
  {
    name: 'Priya Nair',
    email: 'priya.nair@sitm.edu.in',
    department: 'B.Tech (ECE)',
    phone: '9812345678',
    residenceType: 'Day Scholar' as ResidenceType,
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  },
  {
    name: 'Aniket Verma',
    email: 'aniket.v@gmail.com',
    department: 'B.Tech (ME)',
    phone: '9765432109',
    residenceType: 'Hosteller' as ResidenceType,
    roomNo: 'B-102',
    floorNo: '1st Floor',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  }
];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onSignOut,
}) => {
  const [googleAuthMode, setGoogleAuthMode] = useState(!profile);
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState<typeof SAMPLE_GOOGLE_ACCOUNTS[0] | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('B.Tech (CSE)');
  const [residenceType, setResidenceType] = useState<ResidenceType>('Hosteller');
  const [roomNo, setRoomNo] = useState('');
  const [floorNo, setFloorNo] = useState('');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  // Sync state when modal opens or profile changes
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhotoUrl(profile.photoUrl || '');
      setPhone(profile.phone);
      setDepartment(profile.department);
      setResidenceType(profile.residenceType);
      setRoomNo(profile.roomNo || '');
      setFloorNo(profile.floorNo || '');
      setGoogleAuthMode(false);
    } else {
      setGoogleAuthMode(true);
      // Pre-fill default sample Google user
      const defaultAcc = SAMPLE_GOOGLE_ACCOUNTS[0];
      setSelectedGoogleAccount(defaultAcc);
      setName(defaultAcc.name);
      setEmail(defaultAcc.email);
      setPhotoUrl(defaultAcc.photoUrl);
      setPhone(defaultAcc.phone);
      setDepartment(defaultAcc.department);
      setResidenceType(defaultAcc.residenceType);
      setRoomNo(defaultAcc.roomNo || '');
      setFloorNo(defaultAcc.floorNo || '');
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSelectGoogleAccount = (acc: typeof SAMPLE_GOOGLE_ACCOUNTS[0]) => {
    setSelectedGoogleAccount(acc);
    setName(acc.name);
    setEmail(acc.email);
    setPhotoUrl(acc.photoUrl);
    setPhone(acc.phone);
    setDepartment(acc.department);
    setResidenceType(acc.residenceType);
    setRoomNo(acc.roomNo || '');
    setFloorNo(acc.floorNo || '');
  };

  const handleCompleteGoogleSignIn = () => {
    setGoogleAuthMode(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !department.trim()) return;

    const updatedProfile: StudentProfile = {
      id: profile?.id || `STU-${Date.now().toString().slice(-4)}`,
      uid: profile?.uid || profile?.id || `STU-${Date.now().toString().slice(-4)}`,
      role: 'student',
      name: name.trim(),
      email: email.trim(),
      photoUrl: photoUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      phone: phone.trim(),
      department: department.trim(),
      residenceType,
      roomNo: residenceType === 'Hosteller' ? roomNo.trim() : undefined,
      floorNo: residenceType === 'Hosteller' ? floorNo.trim() : undefined,
      isGoogleLinked: true,
      createdAt: profile?.createdAt || new Date().toISOString(),
    };

    onSaveProfile(updatedProfile);
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#2a080e] via-[#3d0c14] to-[#1f0509] border border-[#c89f78]/40 rounded-3xl shadow-2xl overflow-hidden my-8 text-white">
        
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-[#5c1321] flex items-center justify-between bg-[#2a080e]/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#800020] to-[#c89f78] text-white shadow-md">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#fdfbf7]">Student Profile</h3>
              <p className="text-xs text-[#d4c3b3]">
                {profile ? 'Manage your Google Student ID & Campus details' : 'Create Student Profile with Google'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">

          {/* Success Overlay Banner */}
          {isSavedSuccess && (
            <div className="p-4 rounded-2xl bg-[#800020] border border-[#c89f78] text-[#fdfbf7] flex items-center gap-3 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-6 h-6 text-[#c89f78] shrink-0" />
              <div>
                <h4 className="text-sm font-bold">Profile Saved Successfully!</h4>
                <p className="text-xs text-[#e6d5c3]">Your student details are ready for automatic issue reporting.</p>
              </div>
            </div>
          )}

          {/* STEP 1: Google Account Authentication / Linking */}
          {googleAuthMode ? (
            <div className="space-y-6">
              
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 border border-white/20 mb-1">
                  {/* Official Google G Logo */}
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-extrabold text-[#fdfbf7]">Sign in with Google</h4>
                <p className="text-xs text-[#d4c3b3] max-w-sm mx-auto">
                  Connect your SITM student Google Workspace or personal Google account to quickly report campus issues.
                </p>
              </div>

              {/* Sample Google Account Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#e6c5a0]">
                  Select or Connect Google Account
                </label>

                {SAMPLE_GOOGLE_ACCOUNTS.map((acc) => {
                  const isSelected = selectedGoogleAccount?.email === acc.email;
                  return (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => handleSelectGoogleAccount(acc)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#800020]/80 to-[#c89f78]/30 border-[#c89f78] text-white shadow-lg ring-1 ring-[#c89f78]'
                          : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={acc.photoUrl}
                          alt={acc.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#c89f78]/50"
                        />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{acc.name}</span>
                            <span className="text-[10px] bg-[#c89f78]/20 text-[#e6c5a0] px-1.5 py-0.2 rounded font-mono">Verified</span>
                          </div>
                          <div className="text-[11px] text-slate-300">{acc.email}</div>
                        </div>
                      </div>

                      {isSelected && <CheckCircle2 className="w-5 h-5 text-[#c89f78]" />}
                    </button>
                  );
                })}
              </div>

              {/* Manual Input Mode toggle if user wants custom email */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                <div className="text-xs font-bold text-slate-300">Or Enter Custom Google Details</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                  <input
                    type="email"
                    placeholder="student@sitm.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>
              </div>

              {/* Continue to Profile Details */}
              <button
                type="button"
                onClick={handleCompleteGoogleSignIn}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#800020] via-[#a31c38] to-[#c89f78] text-white font-bold text-sm shadow-xl shadow-[#800020]/40 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                <span>Continue with Selected Google Account</span>
                <Sparkles className="w-4 h-4 text-[#fdfbf7]" />
              </button>

            </div>
          ) : (

            /* STEP 2: Profile Details Form */
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Connected Google Account Header Badge */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-[#c89f78]/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#c89f78]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{name}</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#800020] text-[#e6c5a0] border border-[#c89f78]/30 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-[#c89f78]" />
                        <span>Google Workspace</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">{email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setGoogleAuthMode(true)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#c89f78] border border-white/10 font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Switch</span>
                </button>
              </div>

              {/* Personal Campus Information */}
              <div className="space-y-4">
                
                {/* Phone & Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#c89f78]" />
                      <span>Phone Number <span className="text-red-400">*</span></span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white focus:ring-2 focus:ring-[#c89f78]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#c89f78]" />
                      <span>Department / Branch <span className="text-red-400">*</span></span>
                    </label>
                    <select
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white focus:ring-2 focus:ring-[#c89f78] bg-slate-900"
                    >
                      <option value="B.Tech (CSE)">B.Tech (CSE)</option>
                      <option value="B.Tech (CE)">B.Tech (CE)</option>
                      <option value="B.Tech (ME)">B.Tech (ME)</option>
                      <option value="B.Tech (ECE)">B.Tech (ECE)</option>
                      <option value="B.Tech (EEE)">B.Tech (EEE)</option>
                      <option value="Data Science">Data Science</option>
                      <option value="BCA">BCA</option>
                      <option value="BBA">BBA</option>
                    </select>
                  </div>
                </div>

                {/* Residence Type Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
                    Campus Residence Type <span className="text-red-400">*</span>
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    {(['Hosteller', 'Day Scholar'] as ResidenceType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setResidenceType(type)}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          residenceType === type
                            ? 'bg-[#800020] border-[#c89f78] text-[#fdfbf7] shadow-lg ring-1 ring-[#c89f78]'
                            : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {type === 'Hosteller' ? <Home className="w-4 h-4 text-[#c89f78]" /> : <Building2 className="w-4 h-4 text-[#c89f78]" />}
                        <span>{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conditional Hosteller Fields */}
                {residenceType === 'Hosteller' && (
                  <div className="p-4 rounded-2xl bg-[#3d0c14]/60 border border-[#c89f78]/30 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                        <Home className="w-3.5 h-3.5 text-[#c89f78]" />
                        <span>Hostel Room No.</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Room 304 / Block A"
                        value={roomNo}
                        onChange={(e) => setRoomNo(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white focus:ring-2 focus:ring-[#c89f78]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-[#c89f78]" />
                        <span>Floor No.</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 3rd Floor"
                        value={floorNo}
                        onChange={(e) => setFloorNo(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white focus:ring-2 focus:ring-[#c89f78]"
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                {profile && (
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#800020] via-[#a31c38] to-[#c89f78] text-white font-bold text-xs shadow-lg shadow-[#800020]/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#fdfbf7]" />
                    <span>Save Student Profile</span>
                  </button>
                </div>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};
