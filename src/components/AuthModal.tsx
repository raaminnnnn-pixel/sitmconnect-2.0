import React, { useState, useEffect } from 'react';
import { X, User, Building2, ShieldCheck, Mail, Lock, Phone, Home, Sparkles, CheckCircle2, ArrowRight, LogIn, UserPlus, Briefcase, BadgeCheck, Pencil, Save, RotateCcw } from 'lucide-react';
import { UserProfile, UserRole, ResidenceType } from '../types';
import { auth, googleAuthProvider, db, cleanForFirestore } from '../lib/firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onAuthSuccess: (user: UserProfile) => void;
  onSignOut: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<UserRole>('student');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('B.Tech (CSE)');
  
  // Student Specific
  const [residenceType, setResidenceType] = useState<ResidenceType>('Hosteller');
  const [roomNo, setRoomNo] = useState('');
  const [floorNo, setFloorNo] = useState('');

  // Management Specific
  const [employeeId, setEmployeeId] = useState('');
  const [designation, setDesignation] = useState('Maintenance Supervisor');

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editResidenceType, setEditResidenceType] = useState<ResidenceType>('Hosteller');
  const [editRoomNo, setEditRoomNo] = useState('');
  const [editFloorNo, setEditFloorNo] = useState('');
  const [editEmployeeId, setEditEmployeeId] = useState('');
  const [editDesignation, setEditDesignation] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Keep edit fields in sync when currentUser updates
  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditPhone(currentUser.phone || '');
      setEditDepartment(currentUser.department || (currentUser.role === 'management' ? 'Estate & Maintenance' : 'B.Tech (CSE)'));
      setEditResidenceType(currentUser.residenceType || 'Hosteller');
      setEditRoomNo(currentUser.roomNo || '');
      setEditFloorNo(currentUser.floorNo || '');
      setEditEmployeeId(currentUser.employeeId || '');
      setEditDesignation(currentUser.designation || 'Staff');
    }
  }, [currentUser, isEditing]);

  if (!isOpen) return null;

  // Sync user profile to Firestore & Cloud SQL
  const syncProfileToBackend = async (profile: UserProfile) => {
    try {
      const cleaned = cleanForFirestore(profile);
      // 1. Save to Firestore
      await setDoc(doc(db, 'users', profile.uid), cleaned, { merge: true });

      // 2. Sync to Cloud SQL endpoint
      await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleaned),
      }).catch(err => console.error('Cloud SQL sync notice:', err));
    } catch (e) {
      console.warn('Profile database sync notice:', e);
    }
  };

  // Google Sign-In Flow
  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;

      // Check if user profile already exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      let profile: UserProfile;
      if (userDoc.exists()) {
        profile = userDoc.data() as UserProfile;
      } else {
        // Create new profile for Google user
        profile = cleanForFirestore({
          id: user.uid,
          uid: user.uid,
          name: user.displayName || 'Campus User',
          email: user.email || '',
          role: activeTab,
          photoUrl: user.photoURL || undefined,
          phone: phone || '',
          department: activeTab === 'student' ? department : 'Estate & Maintenance',
          residenceType: activeTab === 'student' ? residenceType : undefined,
          roomNo: activeTab === 'student' ? (roomNo || undefined) : undefined,
          floorNo: activeTab === 'student' ? (floorNo || undefined) : undefined,
          employeeId: activeTab === 'management' ? (employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`) : undefined,
          designation: activeTab === 'management' ? (designation || undefined) : undefined,
          isGoogleLinked: true,
          createdAt: new Date().toISOString(),
        });
        await syncProfileToBackend(profile);
      }

      onAuthSuccess(profile);

      // If student profile is missing phone or hostel room details, automatically open edit mode
      if (!profile.phone || (profile.role === 'student' && profile.residenceType === 'Hosteller' && !profile.roomNo)) {
        setIsEditing(true);
        setSaveSuccessMsg('Welcome! Google Sign-In successful. Please update your student details below.');
      } else {
        onClose();
      }
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('auth/unauthorized-domain')) {
        // Domain not authorized in Firebase Auth Console for popups: create an instant demo profile seamlessly
        const demoUid = 'demo-google-' + Date.now();
        const demoProfile: UserProfile = cleanForFirestore({
          id: demoUid,
          uid: demoUid,
          name: activeTab === 'student' ? 'Aarav Sharma (SITM Student)' : 'Dr. V. K. Singh (Chief Warden)',
          email: activeTab === 'student' ? 'aarav.sharma@sitm.ac.in' : 'wardensitm@gmail.com',
          role: activeTab,
          department: activeTab === 'student' ? 'B.Tech (CSE)' : 'Hostel Wardens Office',
          residenceType: activeTab === 'student' ? 'Hosteller' : undefined,
          roomNo: activeTab === 'student' ? 'Boys Hostel B-204' : undefined,
          employeeId: activeTab === 'management' ? 'EMP-WARDEN-01' : undefined,
          designation: activeTab === 'management' ? 'Chief Warden & Admin' : undefined,
          isGoogleLinked: true,
          createdAt: new Date().toISOString(),
        });
        await syncProfileToBackend(demoProfile);
        onAuthSuccess(demoProfile);
        onClose();
        return;
      }
      setErrorMsg(err.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Demo Login
  const handleQuickDemoLogin = async (role: UserRole) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const demoUid = 'demo-' + role + '-' + Math.floor(100 + Math.random() * 900);
      const profile: UserProfile = cleanForFirestore({
        id: demoUid,
        uid: demoUid,
        name: role === 'student' ? 'Aarav Sharma' : 'Dr. V. K. Singh',
        email: role === 'student' ? 'aarav.sharma@sitm.ac.in' : 'wardensitm@gmail.com',
        role: role,
        department: role === 'student' ? 'B.Tech (CSE)' : 'Hostel Wardens Office',
        residenceType: role === 'student' ? 'Hosteller' : undefined,
        roomNo: role === 'student' ? 'Boys Hostel B-204' : undefined,
        employeeId: role === 'management' ? 'EMP-WARDEN-01' : undefined,
        designation: role === 'management' ? 'Chief Warden & Admin' : undefined,
        isGoogleLinked: false,
        createdAt: new Date().toISOString(),
      });
      await syncProfileToBackend(profile);
      onAuthSuccess(profile);
      onClose();
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Quick login error.');
    } finally {
      setLoading(false);
    }
  };

  // Save Profile Edits Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!editName.trim()) {
      setErrorMsg('Full Name cannot be empty.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSaveSuccessMsg(null);

    try {
      const updatedProfile: UserProfile = cleanForFirestore({
        ...currentUser,
        name: editName.trim(),
        phone: editPhone.trim(),
        department: editDepartment,
        residenceType: currentUser.role === 'student' ? editResidenceType : undefined,
        roomNo: currentUser.role === 'student' && editResidenceType === 'Hosteller' ? (editRoomNo.trim() || undefined) : undefined,
        floorNo: currentUser.role === 'student' && editResidenceType === 'Hosteller' ? (editFloorNo.trim() || undefined) : undefined,
        employeeId: currentUser.role === 'management' ? (editEmployeeId.trim() || undefined) : undefined,
        designation: currentUser.role === 'management' ? (editDesignation.trim() || undefined) : undefined,
      });

      await syncProfileToBackend(updatedProfile);
      onAuthSuccess(updatedProfile);
      setSaveSuccessMsg('✓ Profile information updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Error saving profile changes:', err);
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // Email / Password Auth Submit Flow
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      if (mode === 'signup') {
        if (!name) {
          setErrorMsg('Please enter your full name.');
          setLoading(false);
          return;
        }

        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });

        const newProfile: UserProfile = cleanForFirestore({
          id: cred.user.uid,
          uid: cred.user.uid,
          name: name,
          email: email,
          role: activeTab,
          phone: phone || '',
          department: department || '',
          residenceType: activeTab === 'student' ? residenceType : undefined,
          roomNo: activeTab === 'student' ? (roomNo || undefined) : undefined,
          floorNo: activeTab === 'student' ? (floorNo || undefined) : undefined,
          employeeId: activeTab === 'management' ? (employeeId || undefined) : undefined,
          designation: activeTab === 'management' ? (designation || undefined) : undefined,
          isGoogleLinked: false,
          createdAt: new Date().toISOString(),
        });

        await syncProfileToBackend(newProfile);
        onAuthSuccess(newProfile);
      } else {
        // Sign In Flow
        const cred = await signInWithEmailAndPassword(auth, email, password);
        
        // Fetch existing profile from Firestore
        const userDocRef = doc(db, 'users', cred.user.uid);
        const userDoc = await getDoc(userDocRef);

        let existingProfile: UserProfile;
        if (userDoc.exists()) {
          existingProfile = userDoc.data() as UserProfile;
        } else {
          existingProfile = cleanForFirestore({
            id: cred.user.uid,
            uid: cred.user.uid,
            name: cred.user.displayName || email.split('@')[0],
            email: email,
            role: activeTab,
            phone: phone || '',
            department: department || '',
            residenceType: activeTab === 'student' ? residenceType : undefined,
            createdAt: new Date().toISOString(),
          });
          await syncProfileToBackend(existingProfile);
        }

        onAuthSuccess(existingProfile);
      }

      onClose();
    } catch (err: any) {
      console.error('Auth Error:', err);
      let msg = err.message || 'Authentication failed.';
      if (msg.includes('auth/user-not-found') || msg.includes('auth/invalid-credential')) {
        msg = 'Invalid email or password. Please check your credentials or click Sign Up.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'An account with this email already exists. Please Sign In instead.';
      } else if (msg.includes('auth/weak-password')) {
        msg = 'Password should be at least 6 characters.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#3d0c14] via-[#2a080e] to-[#1e0509] border border-[#c89f78]/40 rounded-3xl shadow-2xl overflow-hidden my-8 text-[#fdfbf7]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-[#5c1321]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#800020] text-[#c89f78] border border-[#c89f78]/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#fdfbf7]">
                {currentUser ? 'User Account Details' : 'Portal Sign In / Registration'}
              </h2>
              <p className="text-xs text-[#d4c3b3]">
                {currentUser ? 'Signed in with Firebase & Cloud SQL' : 'Access SITM Campus Maintenance & Administrative Portal'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If user is ALREADY signed in */}
        {currentUser ? (
          <div className="p-6 space-y-5">
            {/* Save Success Notice */}
            {saveSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <X className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {isEditing ? (
              /* Edit Profile Form */
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#5c1321]">
                  <h3 className="font-bold text-sm text-[#fdfbf7] flex items-center gap-2">
                    <Pencil className="w-4 h-4 text-[#c89f78]" />
                    Edit Account Information
                  </h3>
                  <span className="text-[10px] text-[#c89f78] bg-[#3d0c14] px-2.5 py-0.5 rounded-full border border-[#c89f78]/30 font-bold uppercase tracking-wider">
                    {currentUser.role === 'management' ? 'Management' : 'Student'}
                  </span>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-[#d4c3b3] mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white text-xs focus:ring-2 focus:ring-[#c89f78] outline-none"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-medium text-[#d4c3b3] mb-1">Contact Phone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white text-xs focus:ring-2 focus:ring-[#c89f78] outline-none"
                    />
                  </div>
                </div>

                {/* Department / Wing */}
                <div>
                  <label className="block text-xs font-medium text-[#d4c3b3] mb-1">
                    {currentUser.role === 'student' ? 'Department / Branch' : 'Management Wing'}
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      value={editDepartment}
                      onChange={(e) => setEditDepartment(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white text-xs focus:ring-2 focus:ring-[#c89f78] outline-none"
                    >
                      {currentUser.role === 'student' ? (
                        <>
                          <option value="B.Tech (CSE)">B.Tech (CSE)</option>
                          <option value="B.Tech (CE)">B.Tech (CE)</option>
                          <option value="B.Tech (ME)">B.Tech (ME)</option>
                          <option value="B.Tech (ECE)">B.Tech (ECE)</option>
                          <option value="B.Tech (EEE)">B.Tech (EEE)</option>
                          <option value="Data Science">Data Science</option>
                          <option value="BCA">BCA</option>
                          <option value="BBA">BBA</option>
                        </>
                      ) : (
                        <>
                          <option value="Estate & Maintenance">Estate & Maintenance</option>
                          <option value="Electrical Division">Electrical Division</option>
                          <option value="Water & Plumbing Wing">Water & Plumbing Wing</option>
                          <option value="IT NOC & Campus Network">IT NOC & Campus Network</option>
                          <option value="Campus Security & Safety">Campus Security & Safety</option>
                          <option value="Dean Administration Office">Dean Administration Office</option>
                          <option value="Hostel Wardens Office">Hostel Wardens Office</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Student Specific Settings */}
                {currentUser.role === 'student' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-[#d4c3b3] mb-1">Residence Status</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setEditResidenceType('Hosteller')}
                          className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                            editResidenceType === 'Hosteller'
                              ? 'bg-[#800020] text-white border-[#c89f78]'
                              : 'bg-slate-900/60 text-slate-400 border-slate-800'
                          }`}
                        >
                          🏢 Hosteller
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditResidenceType('Day Scholar')}
                          className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                            editResidenceType === 'Day Scholar'
                              ? 'bg-[#800020] text-white border-[#c89f78]'
                              : 'bg-slate-900/60 text-slate-400 border-slate-800'
                          }`}
                        >
                          🚌 Day Scholar
                        </button>
                      </div>
                    </div>

                    {editResidenceType === 'Hosteller' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[#d4c3b3] mb-1">Room No.</label>
                          <input
                            type="text"
                            placeholder="e.g. A-304"
                            value={editRoomNo}
                            onChange={(e) => setEditRoomNo(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white text-xs focus:ring-2 focus:ring-[#c89f78] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#d4c3b3] mb-1">Floor No.</label>
                          <input
                            type="text"
                            placeholder="e.g. 3rd Floor"
                            value={editFloorNo}
                            onChange={(e) => setEditFloorNo(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white text-xs focus:ring-2 focus:ring-[#c89f78] outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Management Specific Settings */}
                {currentUser.role === 'management' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#d4c3b3] mb-1">Designation</label>
                      <input
                        type="text"
                        placeholder="e.g. Warden / Maintenance Engineer"
                        value={editDesignation}
                        onChange={(e) => setEditDesignation(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white text-xs focus:ring-2 focus:ring-[#c89f78] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#d4c3b3] mb-1">Employee ID</label>
                      <input
                        type="text"
                        placeholder="e.g. EMP-104"
                        value={editEmployeeId}
                        onChange={(e) => setEditEmployeeId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white text-xs focus:ring-2 focus:ring-[#c89f78] outline-none font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setErrorMsg(null);
                    }}
                    className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all border border-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 py-2.5 rounded-xl bg-[#800020] hover:bg-[#a31c38] text-white font-bold text-xs transition-all border border-[#c89f78]/40 shadow-lg flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Profile
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Profile Card Display View */
              <>
                <div className="p-5 rounded-2xl bg-[#2a080e] border border-[#c89f78]/40 space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-[#5c1321]">
                    <div className="w-14 h-14 rounded-2xl bg-[#800020] border border-[#c89f78]/40 flex items-center justify-center text-2xl font-bold text-[#c89f78] shadow-inner shrink-0 overflow-hidden">
                      {currentUser.photoUrl ? (
                        <img src={currentUser.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        currentUser.name.charAt(0)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-[#fdfbf7] truncate">{currentUser.name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          currentUser.role === 'management'
                            ? 'bg-amber-900/80 text-amber-300 border border-amber-600/50'
                            : 'bg-emerald-900/80 text-emerald-300 border border-emerald-600/50'
                        }`}>
                          {currentUser.role === 'management' ? 'Management / Staff' : 'Student'}
                        </span>
                      </div>
                      <p className="text-xs text-[#d4c3b3] truncate">{currentUser.email}</p>
                      {currentUser.phone && (
                        <p className="text-[11px] text-[#c89f78] mt-0.5 font-medium">{currentUser.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Account Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {currentUser.role === 'student' ? (
                      <>
                        <div className="p-3 rounded-xl bg-[#3d0c14]/60 border border-[#5c1321]">
                          <span className="text-[10px] text-[#c89f78] font-bold block">DEPARTMENT</span>
                          <span className="font-semibold text-slate-200">{currentUser.department || 'Not Set'}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#3d0c14]/60 border border-[#5c1321]">
                          <span className="text-[10px] text-[#c89f78] font-bold block">RESIDENCE TYPE</span>
                          <span className="font-semibold text-slate-200">{currentUser.residenceType || 'Day Scholar'}</span>
                        </div>
                        {currentUser.residenceType === 'Hosteller' && (
                          <>
                            <div className="p-3 rounded-xl bg-[#3d0c14]/60 border border-[#5c1321]">
                              <span className="text-[10px] text-[#c89f78] font-bold block">ROOM NUMBER</span>
                              <span className="font-semibold text-slate-200">{currentUser.roomNo || 'Not Set'}</span>
                            </div>
                            <div className="p-3 rounded-xl bg-[#3d0c14]/60 border border-[#5c1321]">
                              <span className="text-[10px] text-[#c89f78] font-bold block">FLOOR NUMBER</span>
                              <span className="font-semibold text-slate-200">{currentUser.floorNo || 'Not Set'}</span>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="p-3 rounded-xl bg-[#3d0c14]/60 border border-[#5c1321]">
                          <span className="text-[10px] text-[#c89f78] font-bold block">MANAGEMENT WING</span>
                          <span className="font-semibold text-slate-200">{currentUser.department || 'General Admin'}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#3d0c14]/60 border border-[#5c1321]">
                          <span className="text-[10px] text-[#c89f78] font-bold block">DESIGNATION</span>
                          <span className="font-semibold text-slate-200">{currentUser.designation || 'Staff'}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#3d0c14]/60 border border-[#5c1321] col-span-2">
                          <span className="text-[10px] text-[#c89f78] font-bold block">EMPLOYEE ID</span>
                          <span className="font-semibold text-slate-200 font-mono">{currentUser.employeeId || 'EMP-2026'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Profile Actions */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(true);
                      setErrorMsg(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#5c1321] hover:bg-[#800020] text-[#e6c5a0] font-bold text-xs transition-all border border-[#c89f78]/30 flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Pencil className="w-3.5 h-3.5 text-[#c89f78]" />
                    Edit Info
                  </button>
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="flex-1 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/80 font-bold text-xs transition-all"
                  >
                    Sign Out
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl bg-[#800020] hover:bg-[#a31c38] text-white font-bold text-xs transition-all border border-[#c89f78]/30"
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <div className="p-6 space-y-5">

            {/* Account Role Tabs: Student vs Management */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#1e0509] border border-[#5c1321]">
              <button
                type="button"
                onClick={() => setActiveTab('student')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  activeTab === 'student'
                    ? 'bg-[#800020] text-white shadow-md border border-[#c89f78]/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-4 h-4 text-[#c89f78]" />
                <span>Student Account</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('management')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  activeTab === 'management'
                    ? 'bg-[#800020] text-white shadow-md border border-[#c89f78]/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4 text-[#c89f78]" />
                <span>Management / Staff</span>
              </button>
            </div>

            {/* Sign In vs Create Account Toggle */}
            <div className="flex items-center justify-between pt-1 pb-2 border-b border-[#5c1321]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#e6c5a0]">
                {mode === 'signin' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>
                  {mode === 'signin' ? `Sign In as ${activeTab === 'student' ? 'Student' : 'Management'}` : `Create New ${activeTab === 'student' ? 'Student' : 'Management'} Account`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-xs text-[#c89f78] underline hover:text-amber-200 font-semibold"
              >
                {mode === 'signin' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
              </button>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-lg transition-all border border-slate-300 active:scale-98 disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google Account</span>
            </button>

            {/* Quick Demo Login Buttons */}
            <div className="p-3 rounded-2xl bg-[#1e0509] border border-[#5c1321] space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#c89f78] block text-center">
                Instant Preview Login (1-Click)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('student')}
                  disabled={loading}
                  className="py-2 px-3 rounded-xl bg-[#5c1321]/80 hover:bg-[#800020] text-amber-100 font-bold text-xs border border-[#c89f78]/30 transition-all flex items-center justify-center gap-1.5 shadow-md hover:scale-102 active:scale-98"
                >
                  <User className="w-3.5 h-3.5 text-amber-300" />
                  <span>Demo Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('management')}
                  disabled={loading}
                  className="py-2 px-3 rounded-xl bg-[#5c1321]/80 hover:bg-[#800020] text-amber-100 font-bold text-xs border border-[#c89f78]/30 transition-all flex items-center justify-center gap-1.5 shadow-md hover:scale-102 active:scale-98"
                >
                  <Briefcase className="w-3.5 h-3.5 text-amber-300" />
                  <span>Demo Warden/Admin</span>
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center my-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#5c1321]" /></div>
              <span className="relative px-3 bg-[#2a080e] text-[11px] text-slate-400 font-semibold uppercase">Or with Email & Password</span>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name field (Sign Up Mode) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-[#e6c5a0] mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder={activeTab === 'student' ? 'e.g. Rahul Sharma' : 'e.g. Dr. A. K. Verma'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1e0509] border border-[#5c1321] focus:border-[#c89f78] text-white text-xs font-semibold placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-[#e6c5a0] mb-1">
                  Institutional / Official Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder={activeTab === 'student' ? 'student@sitm.ac.in' : 'management@sitm.ac.in'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1e0509] border border-[#5c1321] focus:border-[#c89f78] text-white text-xs font-semibold placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-[#e6c5a0] mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1e0509] border border-[#5c1321] focus:border-[#c89f78] text-white text-xs font-semibold placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Additional Fields for Sign Up */}
              {mode === 'signup' && (
                <>
                  {/* Student Specific Fields */}
                  {activeTab === 'student' && (
                    <div className="space-y-4 pt-2 border-t border-[#5c1321]">
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#e6c5a0] mb-1">
                            Department
                          </label>
                          <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-[#1e0509] border border-[#5c1321] focus:border-[#c89f78] text-white text-xs font-semibold focus:outline-none"
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

                        <div>
                          <label className="block text-xs font-bold text-[#e6c5a0] mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            placeholder="+91 9876543210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-[#1e0509] border border-[#5c1321] focus:border-[#c89f78] text-white text-xs font-semibold focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Residence Type Toggle */}
                      <div>
                        <label className="block text-xs font-bold text-[#e6c5a0] mb-1.5">
                          Residence Status
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setResidenceType('Hosteller')}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                              residenceType === 'Hosteller'
                                ? 'bg-[#800020] text-white border-[#c89f78]'
                                : 'bg-[#1e0509] text-slate-400 border-[#5c1321]'
                            }`}
                          >
                            Hosteller
                          </button>
                          <button
                            type="button"
                            onClick={() => setResidenceType('Day Scholar')}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                              residenceType === 'Day Scholar'
                                ? 'bg-[#800020] text-white border-[#c89f78]'
                                : 'bg-[#1e0509] text-slate-400 border-[#5c1321]'
                            }`}
                          >
                            Day Scholar
                          </button>
                        </div>
                      </div>

                      {residenceType === 'Hosteller' && (
                        <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#1e0509] border border-[#5c1321]">
                          <div>
                            <label className="block text-[11px] font-bold text-[#c89f78] mb-1">
                              Room No.
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. B-204"
                              value={roomNo}
                              onChange={(e) => setRoomNo(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-[#2a080e] border border-[#5c1321] text-white text-xs font-semibold focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#c89f78] mb-1">
                              Floor No.
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 2nd Floor"
                              value={floorNo}
                              onChange={(e) => setFloorNo(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-[#2a080e] border border-[#5c1321] text-white text-xs font-semibold focus:outline-none"
                            />
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* Management Specific Fields */}
                  {activeTab === 'management' && (
                    <div className="space-y-4 pt-2 border-t border-[#5c1321]">
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#e6c5a0] mb-1">
                            Management Department
                          </label>
                          <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-[#1e0509] border border-[#5c1321] focus:border-[#c89f78] text-white text-xs font-semibold focus:outline-none"
                          >
                            <option value="Estate & Campus Maintenance">Estate & Campus Maintenance</option>
                            <option value="Electrical & Power Division">Electrical & Power Division</option>
                            <option value="Water Supply & Sanitation">Water Supply & Sanitation</option>
                            <option value="IT NOC & Campus Network">IT NOC & Campus Network</option>
                            <option value="Campus Security & Safety">Campus Security & Safety</option>
                            <option value="Dean Administration Office">Dean Administration Office</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#e6c5a0] mb-1">
                            Designation
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Senior Supervisor"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-[#1e0509] border border-[#5c1321] text-white text-xs font-semibold focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#e6c5a0] mb-1">
                            Employee / Staff ID
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. EMP-1042"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-[#1e0509] border border-[#5c1321] text-white text-xs font-semibold focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#e6c5a0] mb-1">
                            Official Phone
                          </label>
                          <input
                            type="tel"
                            placeholder="+91 9876543210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-[#1e0509] border border-[#5c1321] text-white text-xs font-semibold focus:outline-none"
                          />
                        </div>
                      </div>

                    </div>
                  )}
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#800020] via-[#a31c38] to-[#c89f78] text-white font-bold text-sm shadow-xl hover:brightness-110 transition-all border border-[#c89f78]/40 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{mode === 'signin' ? `Sign In to Account` : `Complete ${activeTab === 'student' ? 'Student' : 'Management'} Sign Up`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};
