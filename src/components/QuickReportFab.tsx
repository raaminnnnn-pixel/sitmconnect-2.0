import React from 'react';
import { Plus, Zap } from 'lucide-react';

interface QuickReportFabProps {
  onOpenReportModal: () => void;
}

export const QuickReportFab: React.FC<QuickReportFabProps> = ({ onOpenReportModal }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onOpenReportModal}
        className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-2xl shadow-blue-600/30 hover:scale-110 active:scale-95 transition-all duration-300 border border-blue-500/40"
      >
        <Zap className="w-4 h-4 text-blue-200" />
        <span className="hidden sm:inline">+ Report a Problem</span>
        <Plus className="w-5 h-5 sm:hidden" />
      </button>
    </div>
  );
};
