import { useState } from "react";
import { FileText, Download, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Reports() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reports, setReports] = useState([
    { id: "REP-001", name: "Final Reliability Summary", type: "Summary", date: "2026-07-16", status: "Generated" },
    { id: "REP-002", name: "MISRA C:2012 Compliance Log", type: "Compliance", date: "2026-07-15", status: "Generated" },
    { id: "REP-003", name: "Runtime Error Analysis - Phase 1", type: "Detailed", date: "2026-07-14", status: "Generated" },
  ]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newReport = {
        id: `REP-00${reports.length + 1}`,
        name: `Automated Reliability Report #${reports.length + 1}`,
        type: "System Analysis",
        date: new Date().toISOString().split('T')[0],
        status: "Generated"
      };
      setReports(prev => [newReport, ...prev]);
      setIsGenerating(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-surface border border-brand-border p-6 rounded-2xl flex flex-col items-center text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
            {isGenerating ? <Loader2 className="h-7 w-7 text-blue-500 animate-spin" /> : <FileText className="h-7 w-7 text-blue-500" />}
          </div>
          <div>
            <h4 className="text-white font-medium">Generate New Report</h4>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">Create professional defense-standard technical documentation based on current analysis findings.</p>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
          >
            {isGenerating ? "Processing..." : "Initialize Engine"}
          </button>
        </div>
      </div>

      <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
        <div className="p-4 border-b border-brand-border bg-slate-900/50">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Archived Documents</h3>
        </div>
        <div className="divide-y divide-slate-800/50">
          <AnimatePresence initial={false}>
            {reports.map((report) => (
              <motion.div 
                key={report.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-brand-bg rounded-xl border border-brand-border">
                    <FileText className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <h5 className="text-slate-200 font-medium text-sm">{report.name}</h5>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter mt-0.5">{report.id} • {report.type} • {report.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/20">
                    <CheckCircle className="h-3 w-3" />
                    {report.status}
                  </span>
                  <button className="p-2 bg-brand-bg hover:bg-slate-800 border border-brand-border rounded-lg text-slate-400 hover:text-white transition-all shadow-sm">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
