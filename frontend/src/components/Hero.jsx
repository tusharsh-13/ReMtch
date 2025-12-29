import React from "react";
import { motion } from "framer-motion";
import { Cpu, FileText, Gauge, Sparkles } from "lucide-react";

export function Hero({ onAnalyzeClick }) {
  return (
    <section className="grid gap-8 md:grid-cols-[1.4fr,1fr] mb-10 md:mb-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] text-slate-300">
          <Sparkles className="h-3 w-3 text-amber-300" />
          <span>AI-first resume intelligence for modern hiring teams</span>
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            Smart Resume Parser +{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
              Role Match Engine
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-xl">
            Upload a resume, paste a job description, and get a structured
            candidate profile with an intelligent match score in seconds.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onAnalyzeClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400 text-sm font-medium shadow-lg shadow-indigo-900/40 hover:shadow-indigo-700/40 transition-all"
          >
            Analyze Resume
          </button>
          <span className="text-xs text-slate-400">
            No storage. Pure analysis. Designed to plug into real hiring workflows.
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <FeaturePill icon={FileText} label="Resume Parsing" />
          <FeaturePill icon={Cpu} label="Smart Role Matching" />
          <FeaturePill icon={Gauge} label="Match Score Engine" />
          <FeaturePill icon={Sparkles} label="Structured Profiles" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        className="glass-panel p-5 md:p-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-sky-400/10 pointer-events-none" />
        <div className="relative space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Live Matching Engine</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300">
              Online
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <StatCard label="Avg Match" value="76%" accent="from-indigo-400 to-sky-400" />
            <StatCard label="Latency" value="&lt; 1.2s" accent="from-emerald-400 to-teal-400" />
            <StatCard label="Resumes" value="Multi-format" accent="from-violet-400 to-fuchsia-400" />
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Powered by TF‑IDF + cosine similarity and skill overlap for transparent,
            explainable scoring.
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function FeaturePill({ icon: Icon, label }) {
  return (
    <div className="glass-panel flex items-center gap-2 px-3 py-2 border-white/10">
      <Icon className="h-3.5 w-3.5 text-indigo-300" />
      <span className="text-[11px] text-slate-200">{label}</span>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <div className="text-[11px] text-slate-400 mb-1">{label}</div>
      <div
        className={`text-sm font-semibold bg-gradient-to-r ${accent} text-transparent bg-clip-text`}
      >
        {value}
      </div>
    </div>
  );
}


