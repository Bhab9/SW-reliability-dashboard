import { useState } from "react";
import { Defect, AnalysisResponse, Severity } from "../types";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Code2, AlertTriangle, Lightbulb, ChevronRight, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface DefectDetailProps {
  defect: Defect | null;
  onClose: () => void;
}

export default function DefectDetail({ defect, onClose }: DefectDetailProps) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!defect) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codeSnippet: defect.codeSnippet,
          description: defect.description,
          type: defect.type
        }),
      });
      
      if (!response.ok) throw new Error("Failed to analyze");
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError("AI Analysis failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!defect) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="bg-brand-bg border border-brand-border w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-brand-border flex items-center justify-between bg-brand-surface/80">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-1 h-8 rounded-full",
              defect.severity === Severity.CRITICAL ? "bg-rose-500" : "bg-blue-500"
            )}></div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{defect.id}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-brand-bg text-slate-400 border border-brand-border uppercase font-mono">
                  {defect.type}
                </span>
              </div>
              <h2 className="text-lg font-medium text-white">{defect.filePath.split('/').pop()} <span className="text-slate-500 mx-1">/</span> Line {defect.lineNumber}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-brand-bg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Problem Statement</h3>
                </div>
                <div className="bg-brand-surface p-5 rounded-xl border border-brand-border shadow-inner">
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    "{defect.description}"
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="h-3.5 w-3.5 text-blue-500" />
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Source Context</h3>
                </div>
                <div className="bg-slate-950 p-5 rounded-xl border border-brand-border font-mono text-[11px] overflow-x-auto shadow-inner">
                  <pre className="text-blue-200/80 leading-relaxed">
                    <code>{defect.codeSnippet}</code>
                  </pre>
                </div>
              </section>
            </div>

            <div className="bg-brand-surface border border-blue-500/20 rounded-2xl p-6 flex flex-col shadow-2xl shadow-blue-500/5">
              <AnimatePresence mode="wait">
                {!analysis && !loading && (
                  <motion.div
                    key="trigger"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col items-center justify-center text-center py-10"
                  >
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 glow">
                      <Sparkles className="h-8 w-8 text-blue-500" />
                    </div>
                    <h4 className="text-lg font-medium text-white mb-2">AI Code Analysis Assistant</h4>
                    <p className="text-xs text-slate-400 max-w-[280px] leading-relaxed mb-8">
                      Run On-Premise sLLM reasoning to detect buffer overflows, memory leaks, and safety violations.
                    </p>
                    <button
                      onClick={handleAnalyze}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
                    >
                      Consult Intelligence Engine
                    </button>
                  </motion.div>
                )}

                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col items-center justify-center gap-4 py-20"
                  >
                    <div className="relative">
                      <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                      <div className="absolute inset-0 rounded-full glow animate-pulse"></div>
                    </div>
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest animate-pulse">Reasoning in progress...</p>
                  </motion.div>
                )}

                {analysis && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 flex flex-col gap-6"
                  >
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg w-fit">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 glow"></div>
                      <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Agent Reasoning Output</span>
                    </div>

                    <div className="space-y-6">
                      <section>
                        <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-2">[REASONING]</h4>
                        <div className="markdown-body text-xs">
                          <ReactMarkdown>{analysis.analysis}</ReactMarkdown>
                        </div>
                      </section>

                      <div className="h-px bg-slate-800 w-full"></div>

                      <section>
                        <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-2">[CORRECTION]</h4>
                        <div className="markdown-body text-xs text-emerald-100/90">
                          <ReactMarkdown>{analysis.suggestion}</ReactMarkdown>
                        </div>
                      </section>
                    </div>

                    <button className="w-full bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-300 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all mt-auto">
                      Generate PDF Report (Defense Spec)
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
