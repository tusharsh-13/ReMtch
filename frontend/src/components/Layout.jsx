import React from "react";
import { ReMtchLogo } from "./ReMtchLogo.jsx";

export function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <header className="px-6 md:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ReMtchLogo size={32} animated={false} />
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide text-slate-200">
              ReMtch
            </span>
            <span className="text-[11px] text-slate-500">
              AI Resume Intelligence
            </span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs text-slate-400">
          <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">
            Production-grade matching
          </span>
          <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">
            spaCy NLP · FastAPI · React
          </span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="px-6 md:px-12 py-6 text-[11px] text-slate-500 flex justify-between border-t border-white/5">
        <span>AI-powered resume screening & role matching in seconds.</span>
        <span className="hidden md:inline">
          Powered by spaCy NLP · FastAPI · React · Tailwind
        </span>
      </footer>
    </div>
  );
}


