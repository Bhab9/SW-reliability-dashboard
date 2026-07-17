/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Defect } from "./types";
import { mockDefects } from "./data/mockData";
import Dashboard from "./components/Dashboard";
import DefectTable from "./components/DefectTable";
import DefectDetail from "./components/DefectDetail";
import FileUpload from "./components/FileUpload";
import Reports from "./components/Reports";
import { Plane, LayoutDashboard, List, FileText, Settings, LogOut, Search, Bell, Upload } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "list" | "import" | "reports">("dashboard");
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);
  const [defects, setDefects] = useState<Defect[]>(mockDefects);

  const handleNewDefects = (newDefects: Defect[]) => {
    setDefects(prev => [...newDefects, ...prev]);
  };

  const handleApplyFixes = () => {
    setDefects(prev => prev.map(d => ({ ...d, status: "Resolved" as any })));
  };

  return (
    <div className="min-h-screen bg-brand-bg text-slate-200 font-sans flex flex-col overflow-hidden">
      {/* Top Navbar */}
      <nav className="h-14 border-b border-brand-border bg-brand-surface flex items-center justify-between px-6 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded flex items-center justify-center font-bold text-white">A</div>
          <span className="text-lg font-semibold tracking-tight text-white">SW Reliability Dashboard</span>
          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-mono ml-2 uppercase">v1.2.0-MVP</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>On-Premise LLM Active</span>
          </div>
          <div className="h-4 w-px bg-slate-800"></div>
          <div className="flex items-center gap-4">
            <button className="hover:text-white transition-colors">Documentation</button>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-xs transition-all font-medium">Export Report (MOD-Spec)</button>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-brand-border bg-brand-surface/50 p-4 flex flex-col gap-6 shrink-0 overflow-y-auto">
          <section>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Project</label>
              <div className="mt-2 p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <p className="text-sm font-medium text-slate-200">Avionics_Flight_Ctrl_v4</p>
                <p className="text-[11px] text-slate-500">Last analysis: 14:20:05</p>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navigation</label>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "dashboard" ? "bg-blue-600/10 text-blue-400 border border-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.05)]" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Analysis Dashboard
              </button>
              <button
                onClick={() => setActiveTab("list")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "list" ? "bg-blue-600/10 text-blue-400 border border-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.05)]" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <List className="h-4 w-4" />
                Defect Matrix
              </button>
              <button
                onClick={() => setActiveTab("import")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "import" ? "bg-blue-600/10 text-blue-400 border border-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.05)]" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Upload className="h-4 w-4" />
                Data Ingestion
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "reports" ? "bg-blue-600/10 text-blue-400 border border-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.05)]" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <FileText className="h-4 w-4" />
                Technical Reports
              </button>
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Analysis Metrics</label>
            <div className="space-y-3 mt-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Critical Defects</span>
                <span className="text-rose-400 font-mono">{defects.filter(d => d.severity === "Critical").length}</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500" style={{ width: `${(defects.filter(d => d.severity === "Critical").length / defects.length) * 100}%` }}></div>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Total Findings</span>
                <span className="text-amber-400 font-mono">{defects.length}</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: '100%' }}></div>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Resolved Rate</span>
                <span className="text-emerald-400 font-mono">
                  {Math.round((defects.filter(d => d.status === "Resolved" || d.status === "Closed").length / defects.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${(defects.filter(d => d.status === "Resolved" || d.status === "Closed").length / defects.length) * 100}%` }}></div>
              </div>
            </div>
          </section>

          <div className="mt-auto pt-4 border-t border-slate-800">
            <div className="flex items-center gap-3 p-2 bg-blue-500/5 rounded-lg border border-blue-500/10">
              <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 text-lg">🤖</div>
              <div className="text-[11px]">
                <p className="font-bold text-blue-300 uppercase">sLLM Agent</p>
                <p className="text-slate-400">Llama 3-8B Ready</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-brand-bg">
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {activeTab === "dashboard" ? (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <header className="flex justify-between items-end">
                    <h1 className="text-2xl font-light text-white">Analysis Dashboard <span className="text-slate-500 font-mono text-sm ml-2">#SPR-901-2026</span></h1>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-medium border border-slate-700 transition-colors">Rescan Codebase</button>
                      <button 
                        onClick={handleApplyFixes}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs font-medium shadow-lg shadow-blue-900/20 transition-all"
                      >
                        Apply All Fixes
                      </button>
                    </div>
                  </header>
                  <Dashboard defects={defects} />
                </motion.div>
              ) : activeTab === "list" ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <header className="flex justify-between items-end">
                    <h1 className="text-2xl font-light text-white">Defect Matrix <span className="text-slate-500 font-mono text-sm ml-2">Total Findings: {defects.length}</span></h1>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-medium border border-slate-700 transition-colors">Filter Results</button>
                    </div>
                  </header>
                  <DefectTable defects={defects} onSelectDefect={setSelectedDefect} />
                </motion.div>
              ) : activeTab === "import" ? (
                <motion.div
                  key="import"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <header className="flex justify-between items-end">
                    <h1 className="text-2xl font-light text-white">Data Ingestion <span className="text-slate-500 font-mono text-sm ml-2">Supported: Sparrow, Polyspace</span></h1>
                  </header>
                  <div className="p-8">
                  <FileUpload onUpload={handleNewDefects} />
                </div>
                </motion.div>
              ) : (
                <motion.div
                  key="reports"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <header className="flex justify-between items-end">
                    <h1 className="text-2xl font-light text-white">Technical Reports <span className="text-slate-500 font-mono text-sm ml-2">Defense Standard Layout</span></h1>
                  </header>
                  <Reports />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {selectedDefect && (
          <DefectDetail 
            defect={selectedDefect} 
            onClose={() => setSelectedDefect(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

