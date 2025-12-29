import React from "react";

export function MatchScoreCircle({ score }) {
  const normalized = Math.max(0, Math.min(100, score ?? 0));
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="42"
          className="stroke-white/10"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          className="transition-all duration-500 ease-out"
          strokeWidth="8"
          strokeLinecap="round"
          stroke="url(#grad)"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-semibold">{normalized.toFixed(0)}%</div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400">
          Match
        </div>
      </div>
    </div>
  );
}


