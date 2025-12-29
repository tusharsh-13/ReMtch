import React from "react";
import { motion } from "framer-motion";
import { FileUp, Loader2 } from "lucide-react";

export function AnalyzerPanel({
  file,
  setFile,
  jobDescription,
  setJobDescription,
  onAnalyze,
  isLoading,
}) {
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="glass-panel p-5 md:p-6"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-200">Resume</span>
            <span className="text-slate-500">
              Supports <span className="font-medium">PDF</span> and{" "}
              <span className="font-medium">TXT</span>
            </span>
          </div>
          <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-slate-600/80 rounded-2xl px-4 py-6 cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-colors">
            <FileUp className="h-5 w-5 text-indigo-300" />
            <div className="text-xs text-slate-200">
              {file ? file.name : "Click to upload resume"}
            </div>
            <div className="text-[11px] text-slate-500">
              Max ~5MB · We don&apos;t store your files.
            </div>
            <input
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-200">Job Description</span>
            <span className="text-slate-500">Paste or type directly</span>
          </div>
          <textarea
            className="w-full h-40 md:h-44 rounded-2xl bg-slate-950/70 border border-slate-700/70 px-3 py-2 text-xs text-slate-100 outline-none resize-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
            placeholder="Paste the target job description here. The engine will extract required skills and compute both skill overlap and semantic similarity."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="text-slate-400">
          Parsing with <span className="font-medium text-slate-200">pdfplumber</span> · Matching
          via <span className="font-medium text-slate-200">TF-IDF + cosine similarity</span>.
        </div>
        <button
          onClick={onAnalyze}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-900 text-xs font-semibold shadow-md hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Loader2 className="h-3.5 w-3.5 text-slate-700" />
              Analyze Match
            </>
          )}
        </button>
      </div>
    </motion.section>
  );
}


