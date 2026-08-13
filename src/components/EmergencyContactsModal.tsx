import React from 'react';
import { X, ShieldAlert, HeartPulse, Building2, Flame, PhoneCall, Copy, Check } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../data/initialData';

interface EmergencyContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyContactsModal: React.FC<EmergencyContactsModalProps> = ({ isOpen, onClose }) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6 text-red-400" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-emerald-400" />;
      case 'Building2': return <Building2 className="w-6 h-6 text-cyan-400" />;
      case 'Flame': return <Flame className="w-6 h-6 text-amber-400" />;
      default: return <PhoneCall className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg glass-card rounded-3xl border border-red-500/30 shadow-2xl overflow-hidden bg-[#1c2541]/95">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-red-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">🚨 Campus Emergency Directory</h3>
              <p className="text-xs text-red-300">24/7 Rapid Response Helplines</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {EMERGENCY_CONTACTS.map((contact) => (
            <div 
              key={contact.id}
              className="p-4 rounded-2xl glass-card-light border border-white/10 hover:border-red-500/40 transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                  {getIcon(contact.iconName)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{contact.department}</h4>
                  <p className="text-xs text-slate-300">{contact.contactPerson}</p>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">{contact.extension}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <a
                  href={`tel:${contact.phone}`}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-md hover:scale-105 transition-transform flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
                <button
                  onClick={() => handleCopy(contact.phone, contact.id)}
                  className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {copiedId === contact.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>{contact.phone}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}

          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-center text-[11px] text-slate-400">
            Internal intercom phones located in every block near staircase entrances.
          </div>
        </div>

      </div>
    </div>
  );
};
