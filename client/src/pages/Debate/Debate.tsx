import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ResultModal from "../../components/UI/ResultModal";

type DebateResponse = {
  agent: string;
  opinion: string;
  reasoning: string;
};

const DebateSimulator = ({ onBack }: { onBack: () => void }) => {
  const [topic, setTopic] = useState("");
  const [current, setCurrent] = useState<DebateResponse[] | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState<any>(null);

  const startDebate = () => {
    if (!topic.trim()) {
      alert("Please enter a debate topic.");
      return;
    }

    setLoading(true);
    setCurrent([]);
    setVerdict(null);
    setShowResult(false);

    const eventSource = new EventSource(
      `http://localhost:5000/api/debate-stream?problem=${encodeURIComponent(
        topic
      )}`
    );

    eventSource.onmessage = (event) => {
      const parsed = JSON.parse(event.data);

      if (parsed.type === "agent") {
        setCurrent((prev) => {
          const updated = [...(prev || []), parsed.data];

          // Show modal when first agent response arrives
          if (!showResult) setShowResult(true);

          return updated;
        });
      }

      if (parsed.type === "verdict") {
        setVerdict(parsed.data);
        setLoading(false);
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      alert("Connection error. Please try again.");
      eventSource.close();
      setLoading(false);
    };
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto p-6 md:p-12 relative flex flex-col">
      {/* BACK BUTTON */}
      <div className="flex items-center justify-between mb-12">
        <motion.button
          whileHover={{ x: -4, backgroundColor: "rgba(0,0,0,0.05)" }}
          whileTap={{ scale: 0.96 }}
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 font-medium transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Exit Debate
        </motion.button>
      </div>

      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          {/* START SCREEN */}
          {!current?.length && !loading && !showResult && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-12"
            >
              <div className="inline-block p-4 bg-green-50 rounded-3xl mb-6">
                <span className="text-4xl">🗣️</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                AI Debate Lab
              </h1>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                Let three AI agents debate your decision problem and present
                structured opinions.
              </p>

              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && startDebate()}
                placeholder="e.g. Should I start a business or stay in my job?"
                className="w-full max-w-sm mx-auto block px-5 py-4 rounded-2xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 mb-6 text-sm"
              />

              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={startDebate}
                className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-bold shadow-xl transition-all"
              >
                Start Debate
              </motion.button>
            </motion.div>
          )}

          {loading && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="relative w-20 h-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                  }}
                  className="absolute inset-0 border-[3px] border-green-100 border-t-green-600 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 flex items-center justify-center text-2xl"
                >
                  🧠
                </motion.div>
              </div>
              <p className="mt-8 text-slate-800 font-bold text-lg tracking-tight">
                Generating debate...
              </p>
              <p className="text-slate-400 text-sm mt-1">
                AI agents are formulating opinions
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showResult && current && (
          <ResultModal
            result={{ type: "debate", history: current, finalVerdict: verdict }}
            onRestart={() => {
              setCurrent(null);
              setTopic("");
              setShowResult(false);
              setVerdict(null);
            }}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DebateSimulator;