import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Defect, DefectType, Severity } from "../types";
import { motion } from "motion/react";
import { AlertCircle, Bug, CheckCircle, ShieldAlert } from "lucide-react";

interface DashboardProps {
  defects: Defect[];
}

export default function Dashboard({ defects }: DashboardProps) {
  // Stats calculations
  const typeData = Object.values(DefectType).map(type => ({
    name: type,
    count: defects.filter(d => d.type === type).length
  }));

  const severityData = Object.values(Severity).map(severity => ({
    name: severity,
    count: defects.filter(d => d.severity === severity).length
  }));

  const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
  const SEVERITY_COLORS: Record<string, string> = {
    [Severity.CRITICAL]: "#ef4444",
    [Severity.HIGH]: "#f97316",
    [Severity.MEDIUM]: "#eab308",
    [Severity.LOW]: "#3b82f6"
  };

  const stats = [
    { label: "Total Defects", value: defects.length, icon: Bug, color: "text-slate-400" },
    { label: "Critical", value: defects.filter(d => d.severity === Severity.CRITICAL).length, icon: ShieldAlert, color: "text-red-500" },
    { label: "In Review", value: defects.filter(d => d.status === "In Review").length, icon: AlertCircle, color: "text-orange-400" },
    { label: "Resolved", value: defects.filter(d => d.status === "Resolved").length, icon: CheckCircle, color: "text-green-500" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left 2/3 Column */}
      <div className="lg:col-span-2 space-y-6 flex flex-col">
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-surface border border-brand-border p-4 rounded-xl shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-xl font-mono text-white mt-1">{stat.value}</h3>
                </div>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Chart Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-brand-surface border border-brand-border p-6 rounded-xl flex-1 flex flex-col min-h-[350px]"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Defect Distribution by Module</h3>
            <span className="text-[10px] text-slate-500 font-mono tracking-tighter">Updated: {new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0a0c10", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }}
                  itemStyle={{ color: "#f8fafc" }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bottom AI Performance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-slate-900 to-brand-surface border border-blue-500/20 rounded-xl p-4 flex items-center justify-between shadow-lg shadow-blue-500/5">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">AI Correction Accuracy</span>
              <span className="text-2xl font-mono text-blue-400">98.2%</span>
            </div>
            <div className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-400 rounded-full animate-spin-slow"></div>
          </div>
          <div className="bg-gradient-to-br from-slate-900 to-brand-surface border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between shadow-lg shadow-emerald-500/5">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Manual Time Saved</span>
              <span className="text-2xl font-mono text-emerald-400">142h</span>
            </div>
            <div className="w-10 h-10 border-4 border-emerald-500/10 border-t-emerald-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right 1/3 Column */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-brand-surface border border-blue-500/30 rounded-xl flex flex-col shadow-2xl shadow-blue-500/5 overflow-hidden flex-1"
        >
          <div className="p-4 bg-blue-500/10 border-b border-blue-500/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 glow"></div>
              <h2 className="text-[10px] font-bold text-blue-300 uppercase tracking-[0.2em]">AI Reliability Assistant</h2>
            </div>
          </div>
          <div className="p-6 flex flex-col gap-6 flex-1">
            <div className="text-[11px] leading-relaxed text-slate-300 space-y-4">
              <p className="text-blue-400 font-bold uppercase tracking-widest text-[10px]">[SYSTEM STATUS]</p>
              <p>LLM Agent is currently monitoring the codebase. <span className="text-emerald-400">98.2% of identified defects</span> have valid AI-generated repair guides available.</p>
              
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <p className="text-slate-500 font-mono italic">"The last analysis run detected a potential null pointer dereference in navigation_core.c:142."</p>
                <div className="flex items-center gap-2 text-rose-400">
                  <AlertCircle className="h-3 w-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Priority Alert</span>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <button className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-300 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all">
                Generate Technical Report
              </button>
              <p className="text-center text-[10px] text-slate-500 uppercase font-mono tracking-widest">v1.2.0-MVP // sLLM ACTIVE</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-brand-surface border border-brand-border p-6 rounded-xl"
        >
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">Severity Distribution</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={8}
                  dataKey="count"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name] || "#3b82f6"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0a0c10", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {severityData.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: SEVERITY_COLORS[entry.name] }} />
                  <span className="text-slate-500">{entry.name}</span>
                </div>
                <span className="text-slate-300 font-mono">{entry.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
