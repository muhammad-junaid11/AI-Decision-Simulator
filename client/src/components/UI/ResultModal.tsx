import { motion } from "framer-motion";
import { X } from "lucide-react";
import { downloadResultPDF } from "../../utils/downloadResultPDF";
import { FileDown } from "lucide-react";

interface AiResult {
  title: string;
  description: string;
  suggestions: string[];
}

interface DebateHistoryItem {
  agent: string;
  opinion: string;
  reasoning: string;
}

interface FinalVerdict {
  verdict: string;
  summary: string;
}

interface DebateResult {
  type: "debate";
  history: DebateHistoryItem[];
  finalVerdict: FinalVerdict | null;
}

interface ResultModalProps {
  result: AiResult | DebateResult;
  onRestart: () => void;
  loading?: boolean;
}

const ResultModal = ({ result, onRestart, loading }: ResultModalProps) => {
  const isDebate = "type" in result && result.type === "debate";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      
      {/* BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onRestart}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
      >

        <div className="flex items-center justify-between p-6 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              ✨
            </div>
            <span className="font-bold text-slate-800">
              {isDebate ? "Debate Result" : "Simulation Result"}
            </span>
          </div>

          <button
            onClick={onRestart}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
          >
            <X size={20} />
          </button>
        </div>


        <div className="flex-1 overflow-y-auto p-8">

          {!isDebate ? (
            <>
              <h2 className="text-3xl font-black mb-4">
                {(result as AiResult).title}
              </h2>

              <p className="text-slate-600 mb-6">
                {(result as AiResult).description}
              </p>

              <div className="space-y-3">
                {(result as AiResult).suggestions?.map((s, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl">
                    {s}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
            
              <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-4">
                AI Agents Opinions
              </h4>

              <div className="space-y-6">
                {(result as DebateResult).history?.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-5 bg-slate-50 rounded-2xl"
                  >
                    <p className="font-bold text-indigo-600 mb-2">
                      {item.agent}
                    </p>

                    <p className="text-sm mb-2">
                      {item.opinion}
                    </p>

                    <p className="text-sm text-slate-600">
                      {item.reasoning}
                    </p>
                  </motion.div>
                ))}
              </div>

              {loading && (
                <motion.div className="flex items-center gap-3 p-4 mt-4 bg-slate-50 rounded-2xl">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.8,
                          delay: i * 0.15,
                        }}
                        className="w-2 h-2 bg-indigo-400 rounded-full"
                      />
                    ))}
                  </div>

                  <p className="text-sm text-slate-400">
                    Generating response...
                  </p>
                </motion.div>
              )}

              {!loading && (result as DebateResult).finalVerdict && (
                <motion.div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-green-500 mb-4">
                    Final Verdict
                  </h4>

                  <div className="p-5 bg-green-50 rounded-2xl">
                    <p className="font-black text-lg">
                      {(result as DebateResult).finalVerdict?.verdict}
                    </p>
                    <p className="text-sm text-slate-600 mt-2">
                      {(result as DebateResult).finalVerdict?.summary}
                    </p>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>

        <div className="p-6 border-t">

          <motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => downloadResultPDF(result as any)}
  className="w-full mb-3 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
>
  <FileDown size={18} />
  Download PDF Report
</motion.button>

          <button
            onClick={onRestart}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold"
          >
            Finish & Restart
          </button>

        </div>

      </motion.div>
    </div>
  );
};

export default ResultModal;