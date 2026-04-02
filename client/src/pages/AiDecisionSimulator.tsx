import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../services/api";
import QuestionCard from "../components/UI/QuestionCard";
import ResultModal from "../components/UI/ResultModal";

const AiDecisionSimulator = ({ onBack }: { onBack: () => void }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [current, setCurrent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const progress = Math.min((history.length / 5) * 100, 100);

  const start = async () => {
    setLoading(true);
    try {
      const res = await api.post("/ai-decision", { history: [] });
      setCurrent(res.data);
    } catch (err: any) {
      alert("AI request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (answer: string) => {
    const updatedHistory = [...history, { question: current.question, answer }];
    setHistory(updatedHistory);
    setLoading(true);
    try {
      const res = await api.post("/ai-decision", { history: updatedHistory });
      setCurrent(res.data);
      if (res.data.type === "result") setShowResult(true);
    } catch (err: any) {
      alert("AI request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto p-6 md:p-12 relative flex flex-col">
      {/* --- ENRICHED BACK BUTTON --- */}
      <div className="flex items-center justify-between mb-12">
        <motion.button
          whileHover={{ x: -4, backgroundColor: "rgba(0,0,0,0.05)" }}
          whileTap={{ scale: 0.96 }}
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 font-medium transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Exit Simulator
        </motion.button>

        {current && (
           <div className="flex items-center gap-3">
             <div className="text-right">
               <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Progress</p>
               <p className="text-sm font-black text-indigo-600">{Math.round(progress)}%</p>
             </div>
             <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-indigo-500"
                />
             </div>
           </div>
        )}
      </div>

      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          {!current && !loading && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-12"
            >
              <div className="inline-block p-4 bg-indigo-50 rounded-3xl mb-6">
                <span className="text-4xl">🤖</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">AI Decision Lab</h1>
              <p className="text-slate-500 mb-10 max-w-sm mx-auto">Answer a few prompts and let our neural engine simulate your best path forward.</p>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={start} 
                className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-bold shadow-xl transition-all"
              >
                Start AI Simulation
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
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full"
                />
                <motion.div 
                   animate={{ scale: [1, 1.2, 1] }}
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="absolute inset-0 flex items-center justify-center text-2xl"
                >
                  🧠
                </motion.div>
              </div>
              <p className="mt-8 text-slate-800 font-bold text-lg tracking-tight">Processing logic...</p>
              <p className="text-slate-400 text-sm mt-1">AI is generating your next branch</p>
            </motion.div>
          )}

          {current?.type === "question" && !loading && (
            <QuestionCard 
              key={current.question} 
              question={current.question} 
              options={current.options} 
              onAnswer={handleAnswer} 
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showResult && (
          <ResultModal 
            result={current} 
            onRestart={() => {
              setHistory([]);
              setCurrent(null);
              setShowResult(false);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiDecisionSimulator;