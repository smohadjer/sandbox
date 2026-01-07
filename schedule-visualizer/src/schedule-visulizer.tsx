import React, { useState } from 'react';
import { 
  Info, 
  Clock, 
  Mail, 
  Phone, 
  Smartphone, 
  Printer, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Building2,
  ArrowRight,
  ShieldAlert,
  X
} from 'lucide-react';

// --- MOCK DATA (Simulating the XML Files based on the XSD) ---

// In a real app, this would be the parsed XML content
const SCHEDULES = {
  standard: {
    id: "sched_std_01",
    name: "Standard Protocol (Email First)",
    description: "Best for Class II/III recalls. Prioritizes email communication with a follow-up next day.",
    rounds: [
      {
        duration: "PT0M", // Immediate
        notifications: [
          {
            type: "responder",
            to: ["DistributionPointResponders"],
            channels: [{ type: "email", whenMissing: "phone" }],
            filter: "All Locations"
          },
          {
            type: "client_initiator",
            to: ["ClientInitiatorUsers"],
            channels: [{ type: "email" }],
            filter: "Recall Team"
          }
        ]
      },
      {
        duration: "PT24H", // 24 Hours later
        notifications: [
          {
            type: "responder",
            to: ["DistributionPointResponders"],
            channels: [{ type: "phone", skipIfAlreadyAttempted: false }],
            // Translating PointStatusRange: maxPointStatus="accessed"
            filter: "Locations that have NOT confirmed receipt" 
          },
          {
            type: "client_cc",
            to: ["ClientOverseerUsers"],
            channels: [{ type: "email" }],
            filter: "Compliance Officers"
          }
        ]
      }
    ]
  },
  urgent: {
    id: "sched_urg_01",
    name: "Urgent/Class I (Multi-Channel Blast)",
    description: "High severity. Uses SMS, Email, and Phone simultaneously. Includes regulatory notification.",
    rounds: [
      {
        duration: "PT0M",
        notifications: [
          {
            type: "master_alert",
            to: ["DistributionPointResponders"],
            channels: [
              { type: "sms" },
              { type: "email" },
              { type: "phone" }
            ],
            filter: "All Affected Locations"
          },
          {
            type: "third_party",
            to: ["ThirdPartyContacts"],
            channels: [{ type: "email" }],
            filter: "Regulatory Agencies (FDA/USDA)"
          }
        ]
      },
      {
        duration: "PT4H",
        notifications: [
          {
            type: "responder",
            to: ["DistributionPointResponders"],
            channels: [{ type: "phone" }],
            filter: "Locations that have NOT opened the notification"
          }
        ]
      }
    ]
  }
};

// --- HELPER COMPONENTS ---

const DurationLabel = ({ duration }: { duration: string }) => {
  let label = duration;
  let color = "bg-gray-100 text-gray-600";
  
  // Simple XML Duration parser simulation
  if (duration === "PT0M") {
    label = "Immediately (Start of Recall)";
    color = "bg-green-100 text-green-800 border-green-200";
  } else if (duration === "PT4H") {
    label = "+ 4 Hours Later";
    color = "bg-amber-100 text-amber-800 border-amber-200";
  } else if (duration === "PT24H") {
    label = "+ 24 Hours (Next Day)";
    color = "bg-blue-100 text-blue-800 border-blue-200";
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border ${color} w-fit`}>
      <Clock size={16} />
      <span>{label}</span>
    </div>
  );
};

const ChannelIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'email': return <Mail size={16} />;
    case 'phone': return <Phone size={16} />;
    case 'sms': return <Smartphone size={16} />;
    case 'fax': return <Printer size={16} />;
    default: return <Mail size={16} />;
  }
};

const ChannelDisplay = ({ channel }: { channel: any }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-200 px-2 py-1 rounded shadow-sm">
      <div className={`p-1 rounded bg-gray-100 text-gray-600`}>
        <ChannelIcon type={channel.type} />
      </div>
      <span className="font-medium capitalize">{channel.type.replace('_', ' ')}</span>
      
      {channel.whenMissing && (
        <>
          <ArrowRight size={12} className="text-gray-400" />
          <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
            <span>Fallback:</span>
            <ChannelIcon type={channel.whenMissing} />
          </div>
        </>
      )}
    </div>
  );
};

const RecipientBadge = ({ to }: { to: string[] }) => {
  // Mapping complex XML types to Business Terms
  const map: Record<string, { label: string, icon: React.ReactNode, color: string }> = {
    "DistributionPointResponders": { label: "Stores / Warehouses", icon: <Building2 size={14} />, color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
    "ClientInitiatorUsers": { label: "Recall Initiator", icon: <Users size={14} />, color: "bg-purple-50 text-purple-700 border-purple-100" },
    "ClientOverseerUsers": { label: "Compliance & Legal", icon: <ShieldAlert size={14} />, color: "bg-gray-50 text-gray-700 border-gray-100" },
    "ThirdPartyContacts": { label: "Regulatory Bodies", icon: <AlertTriangle size={14} />, color: "bg-red-50 text-red-700 border-red-100" },
  };

  // Taking first for demo simplicity
  const type = to[0];
  const conf = map[type] || { label: type, icon: <Users size={14} />, color: "bg-gray-100" };

  return (
    <span className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold border ${conf.color}`}>
      {conf.icon}
      {conf.label}
    </span>
  );
};

// --- MAIN APPLICATION COMPONENT ---

export function SchedulePrototype() {
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("standard");
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const activeSchedule = SCHEDULES[selectedScheduleId as keyof typeof SCHEDULES];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-8">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Recall Event</h1>
        <p className="text-slate-500">Configure the parameters for the product withdrawal.</p>
      </div>

      {/* Main Form Area */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        
        {/* Schedule Selector Section */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Notification Schedule Strategy
          </label>
          <div className="flex gap-4 items-start">
            <div className="relative flex-grow">
              <select 
                value={selectedScheduleId}
                onChange={(e) => setSelectedScheduleId(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-300 hover:border-slate-400 px-4 py-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 cursor-pointer"
              >
                <option value="standard">Standard Protocol (Email First)</option>
                <option value="urgent">Urgent/Class I (Multi-Channel Blast)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            {/* THE SOLUTION: The Interactive Info Button */}
            <button 
              onClick={() => setShowInfo(true)}
              className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg font-medium transition-colors border border-blue-200"
            >
              <Info size={20} />
              <span>Analyze Impact</span>
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {activeSchedule.description}
          </p>
        </div>

        {/* Dummy form fields to provide context */}
        <div className="grid grid-cols-2 gap-6 opacity-50 pointer-events-none select-none">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Recall Title</label>
            <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded p-2" value="Frozen Spinach Lot #9921" readOnly />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Affected SKUs</label>
            <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded p-2" value="12 items selected" readOnly />
          </div>
        </div>

      </div>

      {/* --- THE VISUALIZER MODAL --- */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-slate-900">Schedule Impact Analysis</h2>
                  <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide bg-blue-600 text-white">
                    {selectedScheduleId === 'urgent' ? 'High Priority' : 'Standard'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 max-w-lg">
                  Visualizing workflow defined in <code className="bg-slate-200 px-1 py-0.5 rounded text-xs">schedule_{selectedScheduleId}.xml</code>
                </p>
              </div>
              <button 
                onClick={() => setShowInfo(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body: The Timeline */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
              <div className="relative border-l-2 border-slate-200 ml-4 space-y-12">
                
                {activeSchedule.rounds.map((round, rIndex) => (
                  <div key={rIndex} className="relative pl-8">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-600 border-4 border-white shadow-sm ring-1 ring-slate-200"></div>

                    {/* Time Header */}
                    <div className="mb-4">
                      <DurationLabel duration={round.duration} />
                    </div>

                    {/* Notifications Grid for this Round */}
                    <div className="grid gap-4">
                      {round.notifications.map((notif, nIndex) => (
                        <div key={nIndex} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                          
                          {/* Header: WHO & LOGIC */}
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Audience</div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <RecipientBadge to={notif.to} />
                                {notif.filter && (
                                  <span className="text-sm text-slate-600 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                                    <span className="text-slate-400">Filter:</span>
                                    {notif.filter}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Logic Badge (e.g. based on XSD PointStatus) */}
                            {notif.filter.includes("NOT") ? (
                                <div className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 px-2 py-1 rounded">
                                    <AlertTriangle size={12} />
                                    <span>Conditional</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded">
                                    <CheckCircle2 size={12} />
                                    <span>All Targets</span>
                                </div>
                            )}
                          </div>

                          <div className="h-px bg-slate-100 w-full my-3"></div>

                          {/* Body: CHANNELS */}
                          <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Channels</div>
                            <div className="flex flex-wrap gap-2">
                              {notif.channels.map((channel, cIndex) => (
                                <ChannelDisplay key={cIndex} channel={channel} />
                              ))}
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* End of Timeline */}
                <div className="relative pl-8">
                  <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-slate-300"></div>
                  <div className="text-slate-400 text-sm italic">
                    End of automated workflow. Further actions require manual intervention.
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button 
                onClick={() => setShowInfo(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
              >
                Close
              </button>
              <button 
                onClick={() => {
                    // Logic to actually confirm selection
                    setShowInfo(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm"
              >
                Confirm this Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}