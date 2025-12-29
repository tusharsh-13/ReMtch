import React from "react";
import { motion } from "framer-motion";

export function ReMtchLogo({ size = 80, animated = true }) {
  const logoSize = size;
  const strokeWidth = Math.max(1.5, size / 50);

  const LogoSVG = () => (
    <motion.svg
      width={logoSize}
      height={logoSize}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
      initial={animated ? { opacity: 0, scale: 0.9 } : {}}
      animate={animated ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6 }}
    >
      {/* Outer ring with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      {/* Matching/connection lines - representing "match" concept */}
      <path
        d="M 30 40 Q 60 20, 90 40"
        stroke="url(#logoGradient)"
        strokeWidth={strokeWidth * 1.5}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 30 80 Q 60 100, 90 80"
        stroke="url(#logoGradient)"
        strokeWidth={strokeWidth * 1.5}
        fill="none"
        strokeLinecap="round"
      />

      {/* Central node - representing connection point */}
      <circle
        cx="60"
        cy="60"
        r="12"
        fill="url(#innerGradient)"
      />

      {/* Resume icon (document) on left */}
      <rect
        x="20"
        y="50"
        width="16"
        height="20"
        rx="2"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth={strokeWidth}
      />
      <line
        x1="24"
        y1="56"
        x2="32"
        y2="56"
        stroke="url(#logoGradient)"
        strokeWidth={strokeWidth * 0.8}
      />
      <line
        x1="24"
        y1="62"
        x2="32"
        y2="62"
        stroke="url(#logoGradient)"
        strokeWidth={strokeWidth * 0.8}
      />

      {/* Job/Role icon (briefcase) on right */}
      <path
        d="M 84 52 L 84 68 L 100 68 L 100 52 L 96 52 L 96 64 L 88 64 L 88 52 Z"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 88 52 L 88 48 L 96 48 L 96 52"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* AI sparkle accents */}
      <circle
        cx="45"
        cy="35"
        r="2"
        fill="#fbbf24"
      />
      <circle
        cx="75"
        cy="85"
        r="2"
        fill="#fbbf24"
      />
    </motion.svg>
  );

  return <LogoSVG />;
}
