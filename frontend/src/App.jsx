import React, { useEffect, useRef, useState } from "react";
import { Layout } from "./components/Layout.jsx";
import { CenteredAnalyzer } from "./components/CenteredAnalyzer.jsx";
import { ResultsCard } from "./components/ResultsCard.jsx";
import { ToastProvider, useToast } from "./components/ToastProvider.jsx";
import { IntroScreen } from "./components/IntroScreen.jsx";
import { matchResume } from "./services/api.js";

function AppInner() {
  const [hasEntered, setHasEntered] = useState(false);
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const resultsRef = useRef(null);
  const { addToast } = useToast();

  // Auto-enter if user has already visited in this session
  useEffect(() => {
    if (sessionStorage.getItem("remtch_entered") === "1") {
      setHasEntered(true);
    }
  }, []);

  const handleEnter = () => {
    setHasEntered(true);
    sessionStorage.setItem("remtch_entered", "1");
  };

  const handleAnalyze = async () => {
    if (!file) {
      addToast({
        type: "error",
        title: "Resume required",
        description: "Please upload a PDF or TXT resume to analyze.",
      });
      return;
    }
    if (!jobDescription.trim()) {
      addToast({
        type: "error",
        title: "Job description missing",
        description: "Paste a job description so we can compute the match.",
      });
      return;
    }

    try {
      setIsLoading(true);
      setResult(null);
      const data = await matchResume(file, jobDescription);
      setResult(data);
      addToast({
        type: "success",
        title: "Match computed",
        description: "We generated a structured profile and match score.",
      });
      // Scroll to results after a short delay
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        "Something went wrong while analyzing the resume. Please try again.";
      addToast({
        type: "error",
        title: "Analysis failed",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <IntroScreen isVisible={!hasEntered} onEnter={handleEnter} />
      {hasEntered && (
        <Layout>
          <CenteredAnalyzer
            file={file}
            setFile={setFile}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />
          {result && (
            <div ref={resultsRef} className="px-6 md:px-12 pb-12">
              <ResultsCard result={result} />
            </div>
          )}
        </Layout>
      )}
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}


