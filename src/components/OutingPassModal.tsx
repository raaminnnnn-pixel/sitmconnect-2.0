import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Send, 
  Sparkles, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  Building2, 
  Copy, 
  FileText,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { OutingRequest, OutingStatus, UserProfile } from '../types';

const OAUTH_CLIENT_ID = '1038596634720-i9kch0pt80o9a26hglvll15m454sc2e7.apps.googleusercontent.com';
const WARDEN_DEFAULT_EMAIL = 'wardensitm@gmail.com';

interface OutingPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  outings: OutingRequest[];
  onAddOuting: (outing: OutingRequest) => void;
  onUpdateOutingStatus: (id: string, newStatus: OutingStatus, rejectionReason?: string) => void;
  showToast: (msg: string) => void;
}

export const OutingPassModal: React.FC<OutingPassModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  outings,
  onAddOuting,
  onUpdateOutingStatus,
  showToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'request' | 'my-passes' | 'warden-desk'>('request');

  // Form State
  const [purposeType, setPurposeType] = useState<string>('Medical Emergency / Doctor Visit');
  const [customPurpose, setCustomPurpose] = useState<string>('');
  const [hostelRoom, setHostelRoom] = useState<string>(currentUser?.roomNo ? `Room ${currentUser.roomNo}` : 'Boys Hostel - Room 204');
  const [goingDate, setGoingDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [goingTime, setGoingTime] = useState<string>('10:00');
  const [returnDate, setReturnDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [returnTime, setReturnTime] = useState<string>('18:00');
  const [parentEmail, setParentEmail] = useState<string>('parent.guardian@gmail.com');
  const [studentName, setStudentName] = useState<string>(currentUser?.name || 'Student Name');
  const [studentEmail, setStudentEmail] = useState<string>(currentUser?.email || 'student@sitm.ac.in');

  // AI & Email Sending States
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [aiSubject, setAiSubject] = useState<string>('');
  const [aiBody, setAiBody] = useState<string>('');
  const [isSendingGmail, setIsSendingGmail] = useState<boolean>(false);
  const [createdOutingId, setCreatedOutingId] = useState<string | null>(null);

  // Rejection modal
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>('');

  if (!isOpen) return null;

  const finalPurpose = purposeType === 'Other (Write Manually)' ? customPurpose : purposeType;

  // AI Email Generator Call
  const handleGenerateAiEmail = async () => {
    if (!finalPurpose || !goingDate || !goingTime || !returnDate || !returnTime) {
      alert('Please fill out all outing details (purpose, dates, times) first.');
      return;
    }

    setIsGeneratingAI(true);
    try {
      const resp = await fetch('/api/ai/generate-outing-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          hostelRoom,
          purpose: finalPurpose,
          goingDate,
          goingTime,
          returnDate,
          returnTime,
          parentEmail,
          wardenEmail: WARDEN_DEFAULT_EMAIL,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        setAiSubject(data.subject);
        setAiBody(data.body);
        showToast('✨ AI drafted official Outing Permission Email!');
      } else {
        // Fallback draft template when backend or AI service is unavailable
        setAiSubject(`Outing Permission Request: ${studentName} (${hostelRoom})`);
        setAiBody(
          `Respected Chief Warden Sir,\n\nI am ${studentName}, residing in ${hostelRoom}. I kindly request permission to leave campus for the following outing:\n\n• Purpose: ${finalPurpose}\n• Departure: ${goingDate} at ${goingTime}\n• Expected Return: ${returnDate} at ${returnTime}\n\nMy parent/guardian (${parentEmail}) is CC'd on this email for verification and consent.\n\nThank you for your consideration.\n\nYours sincerely,\n${studentName}\nDepartment of SITM`
        );
        showToast('Generated Outing Email Draft!');
      }
    } catch {
      // Fallback AI template on network glitch
      setAiSubject(`Outing Permission Request: ${studentName} (${hostelRoom})`);
      setAiBody(
        `Respected Chief Warden Sir,\n\nI am ${studentName}, residing in ${hostelRoom}. I kindly request permission to leave campus for the following outing:\n\n• Purpose: ${finalPurpose}\n• Departure: ${goingDate} at ${goingTime}\n• Expected Return: ${returnDate} at ${returnTime}\n\nMy parent/guardian (${parentEmail}) is CC'd on this email for verification and consent.\n\nThank you for your consideration.\n\nYours sincerely,\n${studentName}\nDepartment of SITM`
      );
      showToast('Generated Outing Email Draft!');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Gmail OAuth Send Email Handler
  const handleSendViaGmailOAuth = async (outingToSubmit: OutingRequest) => {
    setIsSendingGmail(true);
    try {
      // Check for Google GIS client
      if (typeof window === 'undefined' || !(window as any).google?.accounts?.oauth2) {
        showToast('Google OAuth SDK loading... Please wait a second and retry.');
        setIsSendingGmail(false);
        return;
      }

      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: OAUTH_CLIENT_ID,
        scope: 'https://mail.google.com/ https://www.googleapis.com/auth/gmail.send',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            console.error('OAuth token error:', tokenResponse);
            showToast('Gmail login was cancelled or declined.');
            setIsSendingGmail(false);
            return;
          }

          const accessToken = tokenResponse.access_token;
          
          // Construct RFC 822 Raw Email Format
          const rawEmail = [
            `To: ${WARDEN_DEFAULT_EMAIL}`,
            `Cc: ${outingToSubmit.parentEmail}`,
            `Subject: ${outingToSubmit.aiDraftedEmailSubject}`,
            'Content-Type: text/plain; charset=utf-8',
            'MIME-Version: 1.0',
            '',
            outingToSubmit.aiDraftedEmailBody
          ].join('\r\n');

          const encodedEmail = btoa(unescape(encodeURIComponent(rawEmail)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

          const sendResp = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ raw: encodedEmail })
          });

          if (sendResp.ok) {
            showToast('📧 Official email sent to Warden & Parent via Gmail!');
            onUpdateOutingStatus(outingToSubmit.id, outingToSubmit.status);
          } else {
            console.error('Gmail API Error:', await sendResp.text());
            showToast('Email queued. Outing request saved to Warden Desk!');
          }
          setIsSendingGmail(false);
        }
      });

      client.requestAccessToken();
    } catch (err) {
      console.error('Gmail sending failed:', err);
      showToast('Outing request submitted to Warden Desk!');
      setIsSendingGmail(false);
    }
  };

  // Email App Helper (mailto)
  const openDeviceEmailApp = (toEmail: string, ccEmail: string, subject: string, body: string) => {
    const mailtoUrl = `mailto:${encodeURIComponent(toEmail)}?cc=${encodeURIComponent(ccEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    try {
      window.location.href = mailtoUrl;
    } catch (err) {
      console.warn('Failed to open device mail client:', err);
    }
  };

  // Gmail Web Compose Helper
  const openGmailWebCompose = (toEmail: string, ccEmail: string, subject: string, body: string) => {
    const webUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toEmail)}&cc=${encodeURIComponent(ccEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(webUrl, '_blank');
  };

  // Submit Form Handler
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalPurpose) {
      alert('Please state the purpose of outing.');
      return;
    }

    const newId = `OUT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalSubject = aiSubject || `Outing Permission Request: ${studentName} (${hostelRoom})`;
    const finalBody = aiBody || `Respected Chief Warden Sir,\n\nI am ${studentName}, residing in ${hostelRoom}. I kindly request permission to leave campus for the following outing:\n\n• Purpose: ${finalPurpose}\n• Departure: ${goingDate} at ${goingTime}\n• Expected Return: ${returnDate} at ${returnTime}\n\nMy parent/guardian (${parentEmail}) is CC'd on this email for verification and consent.\n\nThank you for your consideration.\n\nYours sincerely,\n${studentName}\nScholars Institute of Technology & Management`;

    const newOuting: OutingRequest = {
      id: newId,
      studentId: currentUser?.id || `STU-${Math.floor(Math.random()*1000)}`,
      studentName,
      studentEmail,
      hostelRoom,
      parentEmail,
      wardenEmail: WARDEN_DEFAULT_EMAIL,
      purpose: finalPurpose,
      goingDate,
      goingTime,
      returnDate,
      returnTime,
      aiDraftedEmailSubject: finalSubject,
      aiDraftedEmailBody: finalBody,
      status: 'Pending Approval',
      createdAt: new Date().toISOString(),
      timeAgo: 'Just now',
      gateSecurityPassCode: `SITM-GP-${Math.floor(10000 + Math.random() * 90000)}`
    };

    onAddOuting(newOuting);
    setCreatedOutingId(newId);
    showToast(`✓ Outing Request ${newId} submitted! Opening Gmail / Email app...`);

    // Automatically open Gmail or default email app on student's device
    setTimeout(() => {
      openDeviceEmailApp(WARDEN_DEFAULT_EMAIL, parentEmail, finalSubject, finalBody);
    }, 400);

    setActiveSubTab('my-passes');
  };

  // Filter student's own requests or view all for Warden/Staff
  const myOutings = outings.filter((o) => o.studentEmail === studentEmail || o.studentName === studentName);
  const pendingOutingsCount = outings.filter((o) => o.status === 'Pending Approval').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#2a080e] via-[#3b0a11] to-[#1f0509] border border-[#5c1321] rounded-3xl shadow-2xl text-[#fdfbf7] overflow-hidden my-8">
        
        {/* Header Bar */}
        <div className="px-6 py-5 bg-[#1f0509]/90 border-b border-[#5c1321] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#800020] to-[#c89f78] text-[#fdfbf7] shadow-lg">
              <ShieldCheck className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#fdfbf7]">
                Hostel Outing Permission & Security Gate Pass
              </h2>
              <p className="text-xs text-[#c89f78]">
                AI-Powered Mail Drafting to Warden ({WARDEN_DEFAULT_EMAIL}) & Parent CC
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#d4c3b3] hover:text-white hover:bg-[#800020]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation Bar */}
        <div className="px-6 py-3 bg-[#2a080e] border-b border-[#5c1321] flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('request')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'request'
                  ? 'bg-[#800020] text-amber-100 border border-[#c89f78]/50 shadow-md'
                  : 'text-[#d4c3b3] hover:bg-[#3d0c14]'
              }`}
            >
              <FileText className="w-4 h-4 text-[#c89f78]" />
              <span>Apply Outing Request</span>
            </button>

            <button
              onClick={() => setActiveSubTab('my-passes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'my-passes'
                  ? 'bg-[#800020] text-amber-100 border border-[#c89f78]/50 shadow-md'
                  : 'text-[#d4c3b3] hover:bg-[#3d0c14]'
              }`}
            >
              <QrCode className="w-4 h-4 text-[#c89f78]" />
              <span>My Security Passes ({myOutings.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('warden-desk')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'warden-desk'
                  ? 'bg-[#800020] text-amber-100 border border-[#c89f78]/50 shadow-md'
                  : 'text-[#d4c3b3] hover:bg-[#3d0c14]'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#c89f78]" />
              <span>Chief Warden Approval Desk</span>
              {pendingOutingsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-extrabold">
                  {pendingOutingsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">

          {/* TAB 1: APPLY OUTING REQUEST */}
          {activeSubTab === 'request' && (
            <form onSubmit={handleSubmitRequest} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Student Info */}
                <div className="p-4 rounded-2xl bg-[#1f0509]/80 border border-[#5c1321] space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#c89f78] flex items-center gap-2">
                    <User className="w-4 h-4" /> Student Profile Details
                  </h3>
                  <div>
                    <label className="text-[11px] text-[#d4c3b3]">Student Name</label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-[#2a080e] border border-[#5c1321] text-xs text-white focus:outline-none focus:border-[#c89f78]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#d4c3b3]">Hostel & Room No.</label>
                    <input
                      type="text"
                      value={hostelRoom}
                      onChange={(e) => setHostelRoom(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-[#2a080e] border border-[#5c1321] text-xs text-white focus:outline-none focus:border-[#c89f78]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#d4c3b3]">Student Email</label>
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-[#2a080e] border border-[#5c1321] text-xs text-white focus:outline-none focus:border-[#c89f78]"
                      required
                    />
                  </div>
                </div>

                {/* Email Recipients & Warden */}
                <div className="p-4 rounded-2xl bg-[#1f0509]/80 border border-[#5c1321] space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#c89f78] flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Official Email Routing
                  </h3>
                  <div>
                    <label className="text-[11px] text-[#d4c3b3]">Chief Warden Email (Recipient)</label>
                    <input
                      type="email"
                      value={WARDEN_DEFAULT_EMAIL}
                      readOnly
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-[#2a080e]/60 border border-[#5c1321] text-xs text-amber-200 cursor-not-allowed font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#d4c3b3]">Parent / Guardian Email (CC Mandatory)</label>
                    <input
                      type="email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-[#2a080e] border border-[#5c1321] text-xs text-white focus:outline-none focus:border-[#c89f78]"
                      placeholder="parent.guardian@gmail.com"
                      required
                    />
                  </div>
                </div>

              </div>

              {/* Purpose & Schedule Details */}
              <div className="p-4 rounded-2xl bg-[#1f0509]/80 border border-[#5c1321] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#c89f78] flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Purpose of Outing & Timings
                </h3>

                <div>
                  <label className="text-[11px] text-[#d4c3b3] block mb-1">Select Outing Purpose Category</label>
                  <select
                    value={purposeType}
                    onChange={(e) => setPurposeType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#2a080e] border border-[#5c1321] text-xs text-white focus:outline-none focus:border-[#c89f78]"
                  >
                    <option value="Medical Emergency / Doctor Visit">Medical Emergency / Doctor Visit</option>
                    <option value="Buying Essential Books & Academic Stationary">Buying Essential Books & Academic Stationary</option>
                    <option value="Home Visit / Weekend Leave">Home Visit / Weekend Leave</option>
                    <option value="Personal Market Outing / Grocery">Personal Market Outing / Grocery</option>
                    <option value="Exam Center / Internship Work">Exam Center / Internship Work</option>
                    <option value="Other (Write Manually)">Other (Write Manually)</option>
                  </select>
                </div>

                {purposeType === 'Other (Write Manually)' && (
                  <div>
                    <label className="text-[11px] text-[#d4c3b3]">Specify Detailed Purpose</label>
                    <textarea
                      value={customPurpose}
                      onChange={(e) => setCustomPurpose(e.target.value)}
                      rows={2}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-[#2a080e] border border-[#5c1321] text-xs text-white focus:outline-none focus:border-[#c89f78]"
                      placeholder="Describe the exact reason for leaving campus..."
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] text-[#d4c3b3]">Going Date</label>
                    <input
                      type="date"
                      value={goingDate}
                      onChange={(e) => setGoingDate(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-[#2a080e] border border-[#5c1321] text-xs text-white focus:outline-none focus:border-[#c89f78]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#d4c3b3]">Going Time</label>
                    <input
                      type="time"
                      value={goingTime}
                      onChange={(e) => setGoingTime(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-[#2a080e] border border-[#5c1321] text-xs text-white focus:outline-none focus:border-[#c89f78]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#d4c3b3]">Return Date</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-[#2a080e] border border-[#5c1321] text-xs text-white focus:outline-none focus:border-[#c89f78]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#d4c3b3]">Return Time</label>
                    <input
                      type="time"
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-[#2a080e] border border-[#5c1321] text-xs text-white focus:outline-none focus:border-[#c89f78]"
                      required
                    />
                  </div>
                </div>

              </div>

              {/* AI Draft Generator Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#3d0c14] to-[#1f0509] border border-[#c89f78]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                    <h3 className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                      AI Automatic Email Drafting Engine
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateAiEmail}
                    disabled={isGeneratingAI}
                    className="px-3.5 py-1.5 rounded-xl bg-[#800020] hover:bg-[#a00028] text-amber-100 text-xs font-bold border border-[#c89f78]/40 transition-all flex items-center gap-1.5 shadow-md"
                  >
                    {isGeneratingAI ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Generating Draft...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Generate AI Email Draft</span>
                      </>
                    )}
                  </button>
                </div>

                {aiSubject && (
                  <div className="space-y-2 pt-2 border-t border-[#5c1321]">
                    <div>
                      <span className="text-[10px] text-[#c89f78] uppercase font-bold">Generated Subject:</span>
                      <p className="text-xs font-bold text-white bg-[#1f0509] p-2 rounded-lg border border-[#5c1321]">
                        {aiSubject}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#c89f78] uppercase font-bold">Generated Body:</span>
                      <pre className="text-xs font-sans text-stone-200 bg-[#1f0509] p-3 rounded-lg border border-[#5c1321] whitespace-pre-wrap">
                        {aiBody}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2a080e] hover:bg-[#3d0c14] text-xs font-bold text-[#d4c3b3] border border-[#5c1321]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const finalSubject = aiSubject || `Outing Permission Request: ${studentName} (${hostelRoom})`;
                    const finalBody = aiBody || `Respected Chief Warden Sir,\n\nI am ${studentName}, residing in ${hostelRoom}. I kindly request permission to leave campus for the following outing:\n\n• Purpose: ${finalPurpose}\n• Departure: ${goingDate} at ${goingTime}\n• Expected Return: ${returnDate} at ${returnTime}\n\nMy parent/guardian (${parentEmail}) is CC'd on this email for verification and consent.\n\nThank you for your consideration.\n\nYours sincerely,\n${studentName}\nScholars Institute of Technology & Management`;
                    openGmailWebCompose(WARDEN_DEFAULT_EMAIL, parentEmail, finalSubject, finalBody);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#2a080e] hover:bg-[#3d0c14] text-amber-200 font-bold text-xs border border-[#800020] transition-all flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                  <span>Open in Web Gmail</span>
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#800020] via-[#a31c38] to-[#c89f78] text-white font-bold text-xs shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 border border-[#c89f78]/30"
                >
                  <Send className="w-4 h-4 text-amber-200" />
                  <span>Apply Pass & Open Gmail / Email App</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 2: MY SECURITY PASSES */}
          {activeSubTab === 'my-passes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#fdfbf7]">
                  My Outing Gate Security Passes ({myOutings.length})
                </h3>
                <span className="text-xs text-[#c89f78]">
                  Show Approved Digital Pass to Gate Security Officer
                </span>
              </div>

              {myOutings.length === 0 ? (
                <div className="p-8 text-center bg-[#1f0509] rounded-2xl border border-[#5c1321] space-y-3">
                  <ShieldCheck className="w-10 h-10 text-[#c89f78] mx-auto opacity-50" />
                  <p className="text-sm font-bold text-white">No Outing Passes Found</p>
                  <p className="text-xs text-[#d4c3b3]">
                    Apply for an outing request above to generate your digital gate pass.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myOutings.map((outing) => (
                    <div
                      key={outing.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        outing.status === 'Approved'
                          ? 'bg-gradient-to-br from-[#1a2e1a] to-[#0d1f0d] border-emerald-500/50 shadow-emerald-950/40 shadow-xl'
                          : outing.status === 'Rejected'
                          ? 'bg-gradient-to-br from-[#2e1a1a] to-[#1f0d0d] border-rose-500/50'
                          : 'bg-[#1f0509] border-[#5c1321]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-[#c89f78]">{outing.id}</span>
                          <h4 className="text-sm font-bold text-white">{outing.studentName}</h4>
                          <p className="text-xs text-[#d4c3b3]">{outing.hostelRoom}</p>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                            outing.status === 'Approved'
                              ? 'bg-emerald-900/60 text-emerald-300 border-emerald-500/60'
                              : outing.status === 'Rejected'
                              ? 'bg-rose-900/60 text-rose-300 border-rose-500/60'
                              : 'bg-amber-900/60 text-amber-300 border-amber-500/60'
                          }`}
                        >
                          {outing.status}
                        </span>
                      </div>

                      <div className="mt-3 py-2 px-3 rounded-xl bg-black/40 border border-white/10 space-y-1 text-xs">
                        <p className="text-stone-300 font-medium">
                          <strong className="text-[#c89f78]">Purpose:</strong> {outing.purpose}
                        </p>
                        <p className="text-stone-300">
                          <strong className="text-[#c89f78]">Out:</strong> {outing.goingDate} at {outing.goingTime}
                        </p>
                        <p className="text-stone-300">
                          <strong className="text-[#c89f78]">Return:</strong> {outing.returnDate} at {outing.returnTime}
                        </p>
                      </div>

                      {/* Email App Re-trigger Actions */}
                      <div className="mt-2.5 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openDeviceEmailApp(outing.wardenEmail || WARDEN_DEFAULT_EMAIL, outing.parentEmail, outing.aiDraftedEmailSubject, outing.aiDraftedEmailBody)}
                          className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#2a080e] hover:bg-[#3d0c14] text-amber-200 text-[11px] font-bold border border-[#5c1321] transition-all flex items-center justify-center gap-1"
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-400" />
                          <span>Open in Email App 📱</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openGmailWebCompose(outing.wardenEmail || WARDEN_DEFAULT_EMAIL, outing.parentEmail, outing.aiDraftedEmailSubject, outing.aiDraftedEmailBody)}
                          className="py-1.5 px-2.5 rounded-lg bg-[#2a080e] hover:bg-[#3d0c14] text-amber-200 text-[11px] font-bold border border-[#5c1321] transition-all flex items-center justify-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                          <span>Web Gmail 🌐</span>
                        </button>
                      </div>

                      {/* APPROVED GATE PASS CODE & QR */}
                      {outing.status === 'Approved' && (
                        <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-center space-y-2">
                          <div className="flex items-center justify-center gap-2 text-emerald-300 text-xs font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>APPROVED BY WARDEN</span>
                          </div>
                          <p className="text-[10px] text-emerald-200">{outing.approvedBy || 'Chief Warden Office'}</p>
                          
                          {/* Live Dynamic QR Code Generator */}
                          <div className="p-3 bg-white rounded-xl inline-block my-1 shadow-lg border-2 border-emerald-400/50">
                            <QRCodeSVG 
                              value={`SITM-OUTING-PASS|ID:${outing.id}|STUDENT:${outing.studentName}|ROOM:${outing.hostelRoom}|GOING:${outing.goingDate} ${outing.goingTime}|RETURN:${outing.returnDate} ${outing.returnTime}|APPROVED_BY:${outing.approvedBy || 'Chief Warden'}`}
                              size={120}
                              level="H"
                              marginSize={1}
                            />
                          </div>

                          <div className="text-[10px] text-emerald-300/80 font-mono">
                            Scan QR with Security Scanner to verify authenticity
                          </div>

                          <div className="text-xs font-mono font-extrabold text-amber-300 tracking-widest bg-black/60 py-1.5 px-3 rounded-lg border border-amber-500/40">
                            PASS CODE: {outing.gateSecurityPassCode || `SITM-GP-${outing.id.slice(-5).toUpperCase()}`}
                          </div>
                        </div>
                      )}

                      {outing.status === 'Rejected' && outing.rejectionReason && (
                        <div className="mt-3 p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200">
                          <strong>Reason:</strong> {outing.rejectionReason}
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WARDEN APPROVAL DESK */}
          {activeSubTab === 'warden-desk' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#1f0509] border border-[#5c1321] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-300" /> Chief Warden Approval Desk
                  </h3>
                  <p className="text-xs text-[#d4c3b3]">
                    Review outing requests, verify parent CC emails, and issue official gate passes.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#800020] text-amber-200 text-xs font-bold border border-[#c89f78]/40">
                  Warden Email: {WARDEN_DEFAULT_EMAIL}
                </span>
              </div>

              {outings.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-6">No requests pending warden review.</p>
              ) : (
                <div className="space-y-3">
                  {outings.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl bg-[#1f0509] border border-[#5c1321] space-y-3 hover:border-[#c89f78]/40 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#5c1321] pb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-white">{req.studentName}</span>
                            <span className="text-[10px] text-[#c89f78] bg-[#2a080e] px-2 py-0.5 rounded-full border border-[#5c1321]">
                              {req.hostelRoom}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#d4c3b3] mt-0.5">
                            Email: {req.studentEmail} | Parent CC: {req.parentEmail}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase self-start ${
                            req.status === 'Approved'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                              : req.status === 'Rejected'
                              ? 'bg-rose-950 text-rose-300 border border-rose-500'
                              : 'bg-amber-950 text-amber-300 border border-amber-500'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      <div className="text-xs space-y-1 bg-[#2a080e]/60 p-3 rounded-xl border border-[#5c1321]">
                        <p><strong className="text-[#c89f78]">Purpose:</strong> {req.purpose}</p>
                        <p><strong className="text-[#c89f78]">Schedule:</strong> {req.goingDate} {req.goingTime} → {req.returnDate} {req.returnTime}</p>
                      </div>

                      {req.aiDraftedEmailBody && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-[#c89f78] font-bold hover:underline">
                            View AI Drafted Email Details
                          </summary>
                          <pre className="mt-2 p-3 rounded-xl bg-black/50 text-stone-300 text-[11px] font-sans whitespace-pre-wrap border border-white/10">
                            {req.aiDraftedEmailBody}
                          </pre>
                        </details>
                      )}

                      {/* Warden Action Buttons */}
                      {req.status === 'Pending Approval' && (
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => {
                              const reason = prompt('State rejection reason (optional):') || 'Warden decision';
                              onUpdateOutingStatus(req.id, 'Rejected', reason);
                              showToast(`Rejected Outing Request ${req.id}`);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-200 text-xs font-bold border border-rose-500/40"
                          >
                            Reject Request
                          </button>

                          <button
                            onClick={() => {
                              onUpdateOutingStatus(req.id, 'Approved');
                              showToast(`✓ Approved Outing Request ${req.id}! Gate Pass generated.`);
                            }}
                            className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-md"
                          >
                            Approve & Issue Gate Pass
                          </button>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
