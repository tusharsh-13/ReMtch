import React from "react";
import { motion } from "framer-motion";
import { FileUp, Loader2 } from "lucide-react";

export function LandingScreen({
  file,
  setFile,
  jobDescription,
  setJobDescription,
  onAnalyze,
  isLoading,
}) {
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[90vh] py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/70 to-black pointer-events-none" />
      <div className="orb-glow" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-4 text-center px-6"
      >
        <div className="logo-mark">
          <div className="logo-inner">R</div>
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
          Re<span className="text-sky-300">Mtch</span>
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-xl">
          Upload a resume and paste a job description. ReMtch analyzes fit with an AI
          spaCy assistant to enrich entity understanding and deliver clear match insights.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 w-full max-w-4xl mt-8"
      >
        <div className="chat-panel glass-panel border border-white/10">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <label className="upload-box flex items-center gap-3 px-3 py-2 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:border-sky-400/60 transition">
              <FileUp className="h-5 w-5 text-sky-300" />
              <div className="flex flex-col text-left">
                <span className="text-xs text-slate-200">
                  {file ? file.name : "Upload resume (PDF/TXT)"}
                </span>
                <span className="text-[11px] text-slate-500">
                  Your file stays local—no storage.
                </span>
              </div>
              <input
                type="file"
                accept=".pdf,.txt"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            <div className="flex-1">
              <textarea
                className="w-full h-20 md:h-24 rounded-xl bg-slate-950/70 border border-white/10 px-3 py-2 text-xs text-slate-100 outline-none resize-none focus:border-sky-400/70 focus:ring-1 focus:ring-sky-400/30"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <button
              onClick={onAnalyze}
              disabled={isLoading}
              className="shrink-0 h-12 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-sm font-semibold text-white shadow-lg hover:shadow-sky-700/40 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing
                </span>
              ) : (
                "Analyze"
              )}
            </button>
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 mt-8 text-xs text-slate-400">
        Scroll for detailed profile and match breakdown ↓
      </div>
    </section>
  );
}


