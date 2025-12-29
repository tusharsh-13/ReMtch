import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReMtchLogo } from "./ReMtchLogo.jsx";

export function IntroScreen({ isVisible, onEnter }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6 flex justify-center"
            >
              <ReMtchLogo size={140} animated={true} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="text-5xl md:text-6xl font-semibold tracking-tight mb-4"
            >
              <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
                ReMtch
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="text-sm md:text-base text-slate-300 max-w-md mx-auto mb-8"
            >
              Seamlessly analyze resumes against live job descriptions and get a clear,
              structured match breakdown.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              onClick={onEnter}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-slate-900 text-sm font-semibold shadow-lg shadow-white/10 hover:bg-slate-100 transition-colors"
            >
              Enter ReMtch
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


