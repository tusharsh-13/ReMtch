import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileUp, Loader2, Paperclip, Send } from "lucide-react";
import { ReMtchLogo } from "./ReMtchLogo.jsx";

export function CenteredAnalyzer({
  file,
  setFile,
  jobDescription,
  setJobDescription,
  onAnalyze,
  isLoading,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".txt"))) {
      setFile(droppedFile);
    }
  };

  const handleAnalyzeClick = () => {
    if (file && jobDescription.trim()) {
      onAnalyze();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Logo and Title Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 flex justify-center"
        >
          <ReMtchLogo size={120} animated={true} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-3"
        >
          <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
            ReMtch
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-sm md:text-base text-slate-400 max-w-md mx-auto"
        >
          AI-powered resume screening & role matching in seconds
        </motion.p>
      </motion.div>

      {/* Chatbox-style Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="w-full max-w-4xl space-y-6"
      >
        {/* Resume Upload Section */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-2xl border-2 border-dashed transition-all ${
            isDragging
              ? "border-indigo-500 bg-indigo-500/10"
              : "border-slate-700 bg-slate-900/40 hover:bg-slate-900/60"
          }`}
        >
          <label className="flex flex-col items-center justify-center gap-3 px-6 py-8 cursor-pointer">
            <FileUp className={`h-8 w-8 ${file ? "text-emerald-400" : "text-slate-500"}`} />
            <div className="text-center">
              <div className="text-sm font-medium text-slate-200 mb-1">
                {file ? file.name : "Upload Resume (PDF or TXT)"}
              </div>
              <div className="text-xs text-slate-500">
                {file ? "Click to change file" : "Drag & drop or click to browse"}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Job Description Input - Chatbox Style */}
        <div className="relative">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-700/70 shadow-xl overflow-hidden">
            <div className="flex items-start gap-3 p-4">
              <div className="flex-shrink-0 mt-1">
                <Paperclip className="h-5 w-5 text-slate-400" />
              </div>
              <textarea
                className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 outline-none resize-none text-sm md:text-base"
                rows="6"
                placeholder="Paste or type the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between px-4 pb-4 pt-2 border-t border-slate-700/50">
              <div className="text-xs text-slate-500">
                Powered by spaCy NLP & TF-IDF matching
              </div>
              <button
                onClick={handleAnalyzeClick}
                disabled={isLoading || !file || !jobDescription.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400 text-sm font-semibold shadow-lg shadow-indigo-900/40 hover:shadow-indigo-700/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Analyze Match
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="mt-12 text-center"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-xs text-slate-500"
        >
          Scroll down for results
        </motion.div>
      </motion.div>
    </div>
  );
}
