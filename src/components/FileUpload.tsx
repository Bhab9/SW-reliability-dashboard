import { useState } from "react";
import { Upload, File, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setFile(file);
    setUploading(true);
    // Simulate parsing
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="bg-brand-surface border border-brand-border p-10 rounded-2xl shadow-xl shadow-black/20">
      <div className="max-w-xl mx-auto text-center space-y-4">
        <h3 className="text-xl font-light text-white">Import Reliability Test Results</h3>
        <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Supported formats: Sparrow CSV, Polyspace XML, LDRA Excel</p>
        
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); }}
          className={`mt-8 border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center gap-6 ${
            isDragging ? "border-blue-500 bg-blue-500/5 shadow-[0_0_30px_rgba(59,130,246,0.1)]" : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
          }`}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept=".csv,.xml,.xlsx,.xls"
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-5 w-full">
            <div className="w-20 h-20 bg-brand-bg rounded-2xl flex items-center justify-center border border-brand-border shadow-lg">
              <Upload className="h-10 w-10 text-slate-500" />
            </div>
            <div className="space-y-2">
              <p className="text-slate-200 font-medium text-lg">Click to upload or drag and drop</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">RELIABILITY DATA PACKET</p>
            </div>
          </label>
        </div>

        <AnimatePresence>
          {uploading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3 pt-6"
            >
              <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest animate-pulse">Mapping source code structure...</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3 pt-6"
            >
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Import Complete: {file?.name}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
