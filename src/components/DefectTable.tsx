import { Defect, Severity, DefectType } from "../types";
import { Search, Filter, ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "../lib/utils";

interface DefectTableProps {
  defects: Defect[];
  onSelectDefect: (defect: Defect) => void;
}

export default function DefectTable({ defects, onSelectDefect }: DefectTableProps) {
  return (
    <div className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden shadow-2xl shadow-black/40">
      <div className="p-4 border-b border-brand-border bg-slate-900/50 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Defect Priority Queue</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search IDs, files..."
              className="pl-8 pr-4 py-1.5 bg-brand-bg border border-brand-border rounded text-[11px] text-slate-300 focus:outline-none focus:border-blue-500/50 transition-all w-48"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900/30 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
            <tr>
              <th className="px-6 py-3 border-b border-brand-border">Severity</th>
              <th className="px-6 py-3 border-b border-brand-border">Violation ID</th>
              <th className="px-6 py-3 border-b border-brand-border">Module</th>
              <th className="px-6 py-3 border-b border-brand-border">File Location</th>
              <th className="px-6 py-3 border-b border-brand-border text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-xs font-mono">
            {defects.map((defect) => (
              <tr 
                key={defect.id} 
                className={cn(
                  "hover:bg-slate-800/40 transition-colors cursor-pointer group",
                  defect.severity === Severity.CRITICAL && "bg-rose-500/5 text-rose-100"
                )}
                onClick={() => onSelectDefect(defect)}
              >
                <td className="px-6 py-3">
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase",
                    defect.severity === Severity.CRITICAL && "bg-rose-500 text-white",
                    defect.severity === Severity.HIGH && "bg-amber-500 text-white",
                    defect.severity === Severity.MEDIUM && "bg-slate-700 text-white",
                    defect.severity === Severity.LOW && "bg-slate-800 text-slate-400"
                  )}>
                    {defect.severity}
                  </span>
                </td>
                <td className="px-6 py-3 text-slate-300">{defect.id}</td>
                <td className="px-6 py-3 text-slate-500">{defect.module}</td>
                <td className="px-6 py-3 text-slate-400">
                  {defect.filePath.split('/').pop()}:{defect.lineNumber}
                </td>
                <td className="px-6 py-3 text-right">
                  <span className={cn(
                    "font-medium",
                    defect.status === "Open" && "text-rose-400",
                    defect.status === "In Review" && "text-amber-400",
                    defect.status === "Resolved" && "text-emerald-400",
                    defect.status === "Closed" && "text-slate-500"
                  )}>
                    {defect.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
