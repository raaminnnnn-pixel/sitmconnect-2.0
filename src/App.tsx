import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DashboardStats } from './components/DashboardStats';
import { ProblemTracker } from './components/ProblemTracker';
import { CampusMap } from './components/CampusMap';
import { CampusHealthScore } from './components/CampusHealthScore';
import { RecentReports } from './components/RecentReports';
import { LiveCampusHubSection } from './components/LiveCampusHubSection';
import { ReportFormModal } from './components/ReportFormModal';
import { QuickReportFab } from './components/QuickReportFab';
import { EmergencyContactsModal } from './components/EmergencyContactsModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

import { OutingPassModal } from './components/OutingPassModal';
import { RatingModal } from './components/RatingModal';
import { MyActivity } from './components/MyActivity';
import { ProblemReport, Status, UserProfile, OutingRequest, OutingStatus, CampusRating } from './types';
import { INITIAL_PROBLEMS, INITIAL_OUTINGS, INITIAL_RATINGS } from './data/initialData';
import { CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

import { auth, db, cleanForFirestore } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, setDoc, getDocs } from 'firebase/firestore';

const LOCAL_STORAGE_KEY = 'campusfix_reports_v1';
const USER_STORAGE_KEY = 'sitm_user_profile_v1';
const OUTINGS_STORAGE_KEY = 'sitm_hostel_outings_v1';
const RATINGS_STORAGE_KEY = 'sitm_campus_ratings_v1';
const THEME_STORAGE_KEY = 'sitm_theme_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      console.error('Failed to load theme preference:', e);
    }
    return 'dark';
  });

  // Apply theme class to document element on mount and update
  useEffect(() => {
    try {
      if (theme === 'light') {
        document.documentElement.classList.add('light-theme');
      } else {
        document.documentElement.classList.remove('light-theme');
      }
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      showToast(next === 'light' ? 'Switched to High-Contrast Light Theme' : 'Switched to Dark Theme');
      return next;
    });
  };

  const [reports, setReports] = useState<ProblemReport[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load local storage:', e);
    }
    return INITIAL_PROBLEMS;
  });

  const [outings, setOutings] = useState<OutingRequest[]>(() => {
    try {
      const saved = localStorage.getItem(OUTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load outings storage:', e);
    }
    return INITIAL_OUTINGS;
  });

  const [ratings, setRatings] = useState<CampusRating[]>(() => {
    try {
      const saved = localStorage.getItem(RATINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load ratings storage:', e);
    }
    return INITIAL_RATINGS;
  });

  // User Profile & Auth State (Students & Management)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load user profile:', e);
    }
    return {
      id: 'STU-1001',
      uid: 'demo-student-rahul',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@sitm.edu.in',
      phone: '+91 98765 43210',
      role: 'student',
      department: 'B.Tech - Computer Science (6th Sem)',
      residenceType: 'Hosteller',
      roomNo: 'A-304',
      floorNo: '3rd Floor',
    };
  });

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [outingModalOpen, setOutingModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const profile = userDoc.data() as UserProfile;
            setCurrentUser(profile);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
          } else {
            const fallbackProfile: UserProfile = {
              id: user.uid,
              uid: user.uid,
              name: user.displayName || 'Campus User',
              email: user.email || '',
              role: 'student',
              photoUrl: user.photoURL || undefined,
            };
            setCurrentUser(fallbackProfile);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(fallbackProfile));
          }
        } catch (err) {
          console.error('Error fetching user profile on auth change:', err);
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync reports & ratings from Firestore on startup
  useEffect(() => {
    const fetchRemoteData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'reports'));
        const remoteReports: ProblemReport[] = [];
        querySnapshot.forEach((docSnap) => {
          remoteReports.push(docSnap.data() as ProblemReport);
        });
        if (remoteReports.length > 0) {
          setReports((prev) => {
            const combinedMap = new Map();
            prev.forEach((r) => combinedMap.set(r.id, r));
            remoteReports.forEach((r) => combinedMap.set(r.id, r));
            return Array.from(combinedMap.values());
          });
        }

        // Fetch remote student ratings
        const ratingsSnapshot = await getDocs(collection(db, 'ratings'));
        const remoteRatings: CampusRating[] = [];
        ratingsSnapshot.forEach((docSnap) => {
          remoteRatings.push(docSnap.data() as CampusRating);
        });
        if (remoteRatings.length > 0) {
          setRatings((prev) => {
            const combinedMap = new Map();
            prev.forEach((r) => combinedMap.set(r.id, r));
            remoteRatings.forEach((r) => combinedMap.set(r.id, r));
            return Array.from(combinedMap.values());
          });
        }
      } catch (err) {
        console.error('Error fetching data from Firestore:', err);
      }
    };

    fetchRemoteData();
  }, []);

  const handleSignOutUser = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      setAuthModalOpen(false);
      showToast('Successfully signed out of account.');
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  // Save to LocalStorage whenever reports update
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to save to local storage:', e);
    }
  }, [reports]);

  // Save outings to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(OUTINGS_STORAGE_KEY, JSON.stringify(outings));
    } catch (e) {
      console.error('Failed to save outings to local storage:', e);
    }
  }, [outings]);

  // Save ratings to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
    } catch (e) {
      console.error('Failed to save ratings to local storage:', e);
    }
  }, [ratings]);

  // Student Campus Rating Handlers
  const handleAddRating = (newRating: CampusRating) => {
    setRatings((prev) => {
      // Check if current user already rated and update, or prepend
      const existingIdx = prev.findIndex(r => r.userId === newRating.userId && newRating.userId !== 'anonymous');
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newRating;
        return updated;
      }
      return [newRating, ...prev];
    });

    // Sync rating to Firestore
    setDoc(doc(db, 'ratings', newRating.id), cleanForFirestore(newRating))
      .catch((e) => console.warn('Firestore rating save warning:', e?.message || e));

    showToast(`✓ Rated! Overall Campus Score: ${newRating.overallHealthScore}/100 ⭐`);
  };

  const handleUpvoteRating = (ratingId: string) => {
    setRatings((prev) =>
      prev.map((r) => (r.id === ratingId ? { ...r, upvotes: (r.upvotes || 0) + 1 } : r))
    );
  };

  // Outing Request Handlers
  const handleAddOuting = (newOuting: OutingRequest) => {
    setOutings((prev) => [newOuting, ...prev]);

    // Sync to Firestore with fallback
    setDoc(doc(db, 'outings', newOuting.id), cleanForFirestore(newOuting))
      .catch((e) => console.warn('Firestore outing save warning:', e?.message || e));
  };

  const handleUpdateOutingStatus = (id: string, newStatus: OutingStatus, rejectionReason?: string) => {
    setOutings((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: newStatus,
              approvedBy: newStatus === 'Approved' ? 'Dr. V. K. Singh (Chief Warden)' : undefined,
              approvedAt: newStatus === 'Approved' ? new Date().toISOString() : undefined,
              rejectionReason
            }
          : o
      )
    );

    // Sync status to Firestore with fallback
    setDoc(
      doc(db, 'outings', id),
      cleanForFirestore({
        status: newStatus,
        approvedBy: newStatus === 'Approved' ? 'Dr. V. K. Singh (Chief Warden)' : undefined,
        approvedAt: newStatus === 'Approved' ? new Date().toISOString() : undefined,
        rejectionReason
      }),
      { merge: true }
    ).catch((e) => console.warn('Firestore outing status update warning:', e?.message || e));
  };

  // Show auto-dismiss toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Submit new problem handler (Syncs with Firebase Firestore & Cloud SQL)
  const handleAddNewReport = (newReportData: Omit<ProblemReport, 'id' | 'status' | 'reportedAt' | 'timeAgo' | 'upvotes'>): string => {
    const nextIdNumber = 1024 + reports.length;
    const newId = `CF-${nextIdNumber}`;

    const newReport: ProblemReport = {
      ...newReportData,
      id: newId,
      status: 'Reported',
      reportedAt: new Date().toISOString(),
      timeAgo: 'Just now',
      upvotes: 1,
      reporterName: currentUser ? currentUser.name : newReportData.reporterName,
      reporterDept: currentUser ? currentUser.department : newReportData.reporterDept,
      reporterPhone: currentUser ? currentUser.phone : newReportData.reporterPhone,
    };

    // 1. Local State Update
    setReports((prev) => [newReport, ...prev]);

    // 2. Sync to Firestore (clean undefined properties)
    const reportData = cleanForFirestore({
      ...newReport,
      reportedBy: currentUser ? currentUser.uid : 'anonymous',
    });
    setDoc(doc(db, 'reports', newId), reportData).catch((e) => console.warn('Firestore report save warning:', e?.message || e));

    // 3. Sync to Cloud SQL endpoint
    fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
    }).catch((e) => console.error('Cloud SQL report sync error:', e));

    showToast(`✓ Report ${newId} logged successfully!`);
    return newId;
  };

  // Update status handler (Admin & direct clicks)
  const handleUpdateStatus = (id: string, newStatus: Status) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    showToast(`Status for ${id} updated to "${newStatus}"`);
  };

  // Delete report handler
  const handleDeleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    showToast(`Report ${id} deleted.`);
  };

  // Upvote / Me Too handler
  const handleUpvote = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
    showToast(`Upvoted report ${id}!`);
  };

  // Reset demo data handler
  const handleResetSeedData = () => {
    setReports(INITIAL_PROBLEMS);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    showToast('Reset to default demo reports.');
  };

  // Metric counts
  const openCount = reports.filter((r) => r.status === 'Reported').length;
  const inProgressCount = reports.filter((r) => r.status === 'In Progress' || r.status === 'Seen').length;
  const resolvedCount = reports.filter((r) => r.status === 'Resolved').length;
  const totalCount = reports.length;

  return (
    <div className={`min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200 ${
      theme === 'light'
        ? 'bg-[#faf7f2] text-[#1a0407]'
        : 'bg-gradient-to-b from-[#2a080e] via-[#3d0c14] to-[#1f0509] text-[#f7f1e5]'
    }`}>
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 animate-bounce">
          <div className="glass-card px-5 py-3 rounded-2xl border border-[#c89f78] text-[#fdfbf7] font-bold text-xs shadow-2xl flex items-center gap-2 bg-[#3b0a11]/95">
            <CheckCircle2 className="w-4 h-4 text-[#c89f78]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setReportModalOpen(true)}
        onOpenEmergencyModal={() => setEmergencyModalOpen(true)}
        onOpenProfileModal={() => setAuthModalOpen(true)}
        onOpenOutingModal={() => setOutingModalOpen(true)}
        onOpenRatingModal={() => setRatingModalOpen(true)}
        currentUser={currentUser}
        openIssuesCount={openCount}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 space-y-12">
        
        {/* Render View based on activeTab or show seamless single-page experience on 'home' */}
        {activeTab === 'home' && (
          <>
            <Hero
              onOpenReportModal={() => setReportModalOpen(true)}
              onOpenOutingModal={() => setOutingModalOpen(true)}
              onExploreClick={() => {
                const el = document.getElementById('map');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setActiveTab('map');
              }}
              totalResolvedCount={resolvedCount}
            />

            <LiveCampusHubSection />

            <DashboardStats
              openCount={openCount}
              inProgressCount={inProgressCount}
              resolvedCount={resolvedCount}
              totalCount={totalCount}
              currentUser={currentUser}
              reports={reports}
              outings={outings}
              ratings={ratings}
              onOpenReportModal={() => setReportModalOpen(true)}
              onOpenOutingModal={() => setOutingModalOpen(true)}
              onOpenRatingModal={() => setRatingModalOpen(true)}
              onOpenProfileModal={() => setAuthModalOpen(true)}
              onSwitchToMyActivity={() => setActiveTab('activity')}
            />

            <RecentReports
              reports={reports}
              onViewAllClick={() => setActiveTab('tracker')}
            />

            <CampusHealthScore
              ratings={ratings}
              reports={reports}
              onOpenRatingModal={() => setRatingModalOpen(true)}
              onUpvoteRating={handleUpvoteRating}
            />

            <CampusMap
              reports={reports}
              onOpenReportModal={() => setReportModalOpen(true)}
            />

            <ProblemTracker
              reports={reports}
              onUpvote={handleUpvote}
              onOpenReportModal={() => setReportModalOpen(true)}
            />
          </>
        )}

        {activeTab === 'dashboard' && (
          <div className="pt-8">
            <DashboardStats
              openCount={openCount}
              inProgressCount={inProgressCount}
              resolvedCount={resolvedCount}
              totalCount={totalCount}
              currentUser={currentUser}
              reports={reports}
              outings={outings}
              ratings={ratings}
              onOpenReportModal={() => setReportModalOpen(true)}
              onOpenOutingModal={() => setOutingModalOpen(true)}
              onOpenRatingModal={() => setRatingModalOpen(true)}
              onOpenProfileModal={() => setAuthModalOpen(true)}
              onSwitchToMyActivity={() => setActiveTab('activity')}
            />
            <CampusHealthScore
              ratings={ratings}
              reports={reports}
              onOpenRatingModal={() => setRatingModalOpen(true)}
              onUpvoteRating={handleUpvoteRating}
            />
            <RecentReports
              reports={reports}
              onViewAllClick={() => setActiveTab('tracker')}
            />
          </div>
        )}

        {(activeTab === 'activity' || activeTab === 'my-activity') && (
          <div className="pt-4">
            <MyActivity
              currentUser={currentUser}
              reports={reports}
              outings={outings}
              ratings={ratings}
              onOpenReportModal={() => setReportModalOpen(true)}
              onOpenOutingModal={() => setOutingModalOpen(true)}
              onOpenRatingModal={() => setRatingModalOpen(true)}
              onOpenProfileModal={() => setAuthModalOpen(true)}
              onSelectReport={(reportId) => {
                setActiveTab('tracker');
              }}
            />
          </div>
        )}

        {activeTab === 'tracker' && (
          <div className="pt-8">
            <ProblemTracker
              reports={reports}
              onUpvote={handleUpvote}
              onOpenReportModal={() => setReportModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'map' && (
          <div className="pt-8">
            <CampusMap
              reports={reports}
              onOpenReportModal={() => setReportModalOpen(true)}
            />
          </div>
        )}

      </main>

      {/* Floating Action Button */}
      <QuickReportFab onOpenReportModal={() => setReportModalOpen(true)} />

      {/* Report Form Modal */}
      <ReportFormModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSubmitReport={handleAddNewReport}
        currentUser={currentUser}
        onOpenProfileModal={() => {
          setReportModalOpen(false);
          setAuthModalOpen(true);
        }}
      />

      {/* User Auth Modal (Students & Management) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          showToast(`✓ Welcome, ${user.name}! Signed in as ${user.role === 'management' ? 'Management / Staff' : 'Student'}.`);
        }}
        onSignOut={handleSignOutUser}
      />

      {/* Hostel Outing Permission & Gate Security Pass Modal */}
      <OutingPassModal
        isOpen={outingModalOpen}
        onClose={() => setOutingModalOpen(false)}
        currentUser={currentUser}
        outings={outings}
        onAddOuting={handleAddOuting}
        onUpdateOutingStatus={handleUpdateOutingStatus}
        showToast={showToast}
      />

      {/* Student Campus Health Rating Modal */}
      <RatingModal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        currentUser={currentUser}
        onSubmitRating={handleAddRating}
        existingUserRating={ratings.find(
          (r) =>
            currentUser &&
            (r.userId === currentUser.uid || r.userId === currentUser.id || (currentUser.email && r.userEmail === currentUser.email))
        )}
      />

      {/* Emergency Contacts Modal */}
      <EmergencyContactsModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setReportModalOpen(true)}
      />

    </div>
  );
}
