import React, { useState } from 'react';
import { MapPin, Building2, AlertCircle, CheckCircle2, Clock, Info, Navigation, Sparkles, X } from 'lucide-react';
import { CAMPUS_BUILDINGS } from '../data/initialData';
import { ProblemReport, Building } from '../types';

interface CampusMapProps {
  reports: ProblemReport[];
  onOpenReportModal: () => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({ reports, onOpenReportModal }) => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(CAMPUS_BUILDINGS[0]);
  const [selectedReport, setSelectedReport] = useState<ProblemReport | null>(null);

  // Get active issues for a building
  const getBuildingReports = (buildingNameOrCode: string) => {
    return reports.filter(r => 
      r.location.toLowerCase().includes(buildingNameOrCode.toLowerCase()) ||
      r.mapCoordinates?.buildingId === buildingNameOrCode.toLowerCase().replace(/\s+/g, '-')
    );
  };

  return (
    <section id="map" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Navigation className="w-3.5 h-3.5" />
            <span>Interactive Visual Grid</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#fdfbf7] tracking-tight">
            Interactive Campus Map
          </h2>
          <p className="text-sm text-[#d4c3b3] mt-1">
            Click on buildings or animated problem markers to view active maintenance tickets on campus.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 bg-[#2a080e] px-4 py-2 rounded-xl border border-[#5c1321] text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#800020] animate-ping" />
            <span className="text-[#f5efe6] font-bold">🔴 High / Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-[#f5efe6] font-bold">🟡 Medium / In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-[#f5efe6] font-bold">🟢 Resolved</span>
          </div>
        </div>
      </div>

      {/* Main Map Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Visual HTML/CSS Campus Map Frame */}
        <div className="lg:col-span-8 bg-[#210509] rounded-3xl p-6 border border-[#5c1321] relative overflow-hidden shadow-2xl min-h-[520px] flex flex-col justify-between">
          
          {/* Map Grid Pattern Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(rgba(200, 159, 120, 0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Map Title Header Overlay */}
          <div className="relative z-10 flex items-center justify-between pb-4 border-b border-[#5c1321]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#c89f78]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#c89f78]">
                CAMPUS_GEO_GRID // SECTOR_MAP
              </span>
            </div>
            <span className="text-[11px] text-[#a38c7e] font-mono">
              GPS Scale: 1 : 2500
            </span>
          </div>

          {/* HTML/CSS Buildings & Markers Canvas */}
          <div className="relative w-full h-[420px] my-4 rounded-2xl bg-gradient-to-br from-[#2a080e] via-[#3d0c14]/80 to-[#1f0509] border border-[#5c1321] overflow-hidden">
            
            {/* Campus Road Networks (CSS Styled Paths) */}
            <div className="absolute top-1/2 left-0 right-0 h-8 bg-[#3d0c14]/90 border-y border-[#5c1321] -translate-y-1/2 flex items-center justify-around text-[10px] text-[#c89f78] font-mono tracking-widest">
              <span>◄ MAIN CAMPUS AVENUE ►</span>
              <span>◄ COLLEGE CIRCLE ROAD ►</span>
            </div>
            <div className="absolute left-1/2 top-0 bottom-0 w-8 bg-[#3d0c14]/90 border-x border-[#5c1321] -translate-x-1/2 flex flex-col justify-around text-[10px] text-[#c89f78] font-mono tracking-widest">
              <span className="rotate-90">CENTRAL</span>
              <span className="rotate-90">PATH</span>
            </div>

            {/* Building Blocks Rendered on CSS Map */}
            {CAMPUS_BUILDINGS.map((bldg) => {
              const bldgReports = getBuildingReports(bldg.name);
              const hasEmergency = bldgReports.some(r => r.priority === 'Emergency' || r.priority === 'High');
              const isSelected = selectedBuilding?.id === bldg.id;

              return (
                <div
                  key={bldg.id}
                  onClick={() => {
                    setSelectedBuilding(bldg);
                    if (bldgReports.length > 0) {
                      setSelectedReport(bldgReports[0]);
                    } else {
                      setSelectedReport(null);
                    }
                  }}
                  style={{ top: bldg.top, left: bldg.left }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 ${
                    isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                  }`}
                >
                  <div className={`p-3 rounded-2xl border backdrop-blur-md shadow-lg flex flex-col items-center gap-1 min-w-[110px] text-center ${
                    isSelected 
                      ? 'bg-[#800020]/40 border-[#c89f78] text-[#fdfbf7] ring-2 ring-[#c89f78]/50'
                      : 'bg-[#2a080e]/95 border-[#5c1321] text-[#f5efe6] hover:border-[#c89f78]/50'
                  }`}>
                    
                    <Building2 className={`w-5 h-5 ${isSelected ? 'text-[#c89f78]' : 'text-[#a38c7e]'}`} />
                    <span className="text-[11px] font-bold leading-tight">{bldg.code}</span>
                    <span className="text-[9px] text-[#d4c3b3] truncate max-w-[90px]">{bldg.name}</span>

                    {/* Animated Problem Marker Pulse */}
                    {bldgReports.length > 0 && (
                      <span className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-black shadow-md flex items-center gap-1 ${
                        hasEmergency 
                          ? 'bg-[#800020] text-white animate-bounce border border-[#c89f78]' 
                          : 'bg-[#c89f78] text-[#2a080e]'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        {bldgReports.length} Issue{bldgReports.length > 1 ? 's' : ''}
                      </span>
                    )}

                  </div>
                </div>
              );
            })}

            {/* Individual Problem Markers on Map */}
            {reports.map((report) => {
              if (!report.mapCoordinates) return null;
              
              let markerBg = 'bg-amber-500';
              if (report.priority === 'High' || report.priority === 'Emergency') markerBg = 'bg-[#800020] animate-pulse text-white';
              if (report.status === 'Resolved') markerBg = 'bg-emerald-500';

              return (
                <button
                  key={report.id}
                  onClick={() => {
                    setSelectedReport(report);
                    const b = CAMPUS_BUILDINGS.find(x => x.id === report.mapCoordinates?.buildingId);
                    if (b) setSelectedBuilding(b);
                  }}
                  style={{ top: report.mapCoordinates.top, left: report.mapCoordinates.left }}
                  className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full ${markerBg} shadow-lg hover:scale-125 transition-transform border border-[#c89f78]/30`}
                  title={`${report.title} (${report.id})`}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#fdfbf7]" />
                </button>
              );
            })}

          </div>

          <p className="text-xs text-[#d4c3b3] text-center relative z-10 pt-2 border-t border-[#5c1321]">
            Tip: Tap any building icon to see its full problem list or report a new issue for that location.
          </p>

        </div>

        {/* Selected Building / Problem Popup Details Panel */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-6 border border-[#5c1321] shadow-2xl space-y-6 bg-[#2a080e]/95">
          
          {selectedBuilding ? (
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#5c1321]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#800020]/30 text-[#c89f78] border border-[#c89f78]/30">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#fdfbf7]">{selectedBuilding.name}</h3>
                    <p className="text-xs text-[#d4c3b3]">Sector Code: <span className="font-mono text-[#c89f78]">{selectedBuilding.code}</span></p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#f5efe6] mt-4 leading-relaxed">
                {selectedBuilding.description}
              </p>

              {/* Active Issues List for Selected Building */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d4c3b3]">
                    Active Reported Tickets ({getBuildingReports(selectedBuilding.name).length})
                  </span>
                </div>

                {getBuildingReports(selectedBuilding.name).length === 0 ? (
                  <div className="p-4 rounded-2xl bg-[#1f0509] border border-emerald-500/40 text-center text-xs text-emerald-300 font-semibold">
                    ✓ All clear! No open issues reported in this building.
                  </div>
                ) : (
                  getBuildingReports(selectedBuilding.name).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedReport(item)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedReport?.id === item.id
                          ? 'bg-[#800020]/40 border-[#c89f78] text-[#fdfbf7] shadow-md'
                          : 'bg-[#1f0509]/80 border-[#5c1321] text-[#f5efe6] hover:border-[#c89f78]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-mono font-bold text-[#c89f78]">{item.id}</span>
                        <span className="px-2 py-0.5 rounded bg-[#3d0c14] text-[#f5efe6] font-semibold border border-[#5c1321]">
                          {item.priority}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#fdfbf7] truncate">{item.title}</h4>
                      <div className="flex items-center justify-between text-[10px] text-[#d4c3b3] mt-2">
                        <span>{item.category}</span>
                        <span className="text-[#c89f78] font-bold">{item.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-[#5c1321]">
                <button
                  onClick={onOpenReportModal}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#800020] via-[#a31c38] to-[#c89f78] text-[#fdfbf7] font-bold text-xs shadow-lg shadow-maroon-900/40 hover:brightness-110 transition-all"
                >
                  + Report Issue for {selectedBuilding.code}
                </button>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <Info className="w-10 h-10 text-[#a38c7e] mx-auto" />
              <p className="text-sm font-semibold text-[#f5efe6]">Select a building on the map to view reports</p>
            </div>
          )}

        </div>

      </div>

    </section>
  );
};
