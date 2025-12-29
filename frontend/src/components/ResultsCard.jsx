import React from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Mail, Phone, School, Briefcase, Award } from "lucide-react";
import { MatchScoreCircle } from "./MatchScoreCircle.jsx";

export function ResultsCard({ result }) {
  if (!result) return null;

  const { candidate_profile, match_score, matched_skills, missing_skills, semantic_similarity, skill_match_percentage } =
    result;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="glass-panel p-5 md:p-6 mt-4"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-400 flex items-center justify-center">
              <BadgeCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-slate-400">Candidate Profile</div>
              <div className="text-lg font-semibold">
                {candidate_profile.name || "Name not detected"}
              </div>
            </div>
          </div>

          <div className="grid gap-3 text-xs text-slate-300">
            <ContactRow icon={Mail} label={candidate_profile.email || "Email not detected"} />
            <ContactRow icon={Phone} label={candidate_profile.phone || "Phone not detected"} />
          </div>

          <div className="space-y-2 text-xs">
            <SectionHeading label="Skills" />
            {candidate_profile.skills?.length ? (
              <div className="flex flex-wrap gap-2">
                {candidate_profile.skills.map((skill) => (
                  <span key={skill} className="tag-pill">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 text-xs">No skills detected.</div>
            )}
          </div>

          <TwoColumnSection
            icon={School}
            title="Education"
            items={candidate_profile.education}
            fallback="No education entries detected."
          />
          <TwoColumnSection
            icon={Briefcase}
            title="Experience"
            items={candidate_profile.experience}
            fallback="No experience entries detected."
          />
          <TwoColumnSection
            icon={Award}
            title="Certifications"
            items={candidate_profile.certifications}
            fallback="No certifications detected."
          />
        </div>

        <div className="w-full md:w-64 lg:w-72 flex flex-col items-center md:items-stretch">
          <div className="glass-panel w-full p-4 flex flex-col items-center gap-3 border-indigo-500/40 bg-gradient-to-b from-indigo-900/60 to-slate-950/80">
            <MatchScoreCircle score={match_score} />
            <div className="text-xs text-slate-300 text-center">
              Final Score = <span className="font-medium">0.7 × Skill Match</span> +{" "}
              <span className="font-medium">0.3 × Semantic Similarity</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] w-full">
              <Metric label="Skill Match" value={`${skill_match_percentage.toFixed(1)}%`} />
              <Metric label="Semantic" value={`${semantic_similarity.toFixed(1)}%`} />
            </div>
          </div>

          <div className="mt-4 w-full space-y-3 text-xs">
            <div>
              <SectionHeading label="Matched Skills" tone="positive" />
              {matched_skills?.length ? (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {matched_skills.map((skill) => (
                    <span
                      key={skill}
                      className="tag-pill border-emerald-400/40 text-emerald-200 bg-emerald-500/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-slate-400 text-xs mt-1">No direct skill matches.</div>
              )}
            </div>

            <div>
              <SectionHeading label="Missing Skills" tone="negative" />
              {missing_skills?.length ? (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {missing_skills.map((skill) => (
                    <span
                      key={skill}
                      className="tag-pill border-red-400/40 text-red-200 bg-red-500/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-slate-400 text-xs mt-1">
                  No missing skills detected from the JD list.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function ContactRow({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 text-slate-300">
      <Icon className="h-3.5 w-3.5 text-slate-400" />
      <span>{label}</span>
    </div>
  );
}

function SectionHeading({ label, tone }) {
  const color =
    tone === "positive"
      ? "text-emerald-300"
      : tone === "negative"
      ? "text-red-300"
      : "text-slate-200";
  return <div className={`text-[11px] uppercase tracking-wide ${color}`}>{label}</div>;
}

function TwoColumnSection({ icon: Icon, title, items, fallback }) {
  return (
    <div className="space-y-1 text-xs">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-slate-400" />
        <SectionHeading label={title} />
      </div>
      {items?.length ? (
        <ul className="list-disc list-inside text-slate-300 space-y-0.5">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        <div className="text-slate-400">{fallback}</div>
      )}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
      <div className="text-[11px] text-slate-400">{label}</div>
      <div className="text-xs font-semibold text-slate-100">{value}</div>
    </div>
  );
}


