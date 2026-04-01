import { motion } from "framer-motion";
import { X } from "lucide-react"; // Or use a plain "✕" string

interface ResultModalProps {
  result: {
    title: string;
    description: string;
    suggestions: string[];
  };
  onRestart: () => void;
}

const ResultModal = ({ result, onRestart }: ResultModalProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 1. Backdrop: Soft dark blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onRestart}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
      />

      {/* 2. Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* --- FIXED HEADER --- */}
        <div className="flex items-center justify-between p-6 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              ✨
            </div>
            <span className="font-bold text-slate-800 tracking-tight">Simulation Result</span>
          </div>
          <button 
            onClick={onRestart}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- SCROLLABLE CONTENT BODY --- */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-black text-slate-900 mb-4 leading-[1.1]">
              {result.title}
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed text-lg">
              {result.description}
            </p>
          </motion.div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-500">
              Next Steps & Suggestions
            </h4>
            <div className="grid gap-3">
              {result.suggestions.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-white rounded-md shadow-sm border border-slate-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                    {i + 1}
                  </span>
                  <p className="text-slate-700 text-sm font-medium leading-snug">{s}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Subtle padding at bottom of scroll area */}
          <div className="h-4" />
        </div>

        {/* --- FIXED FOOTER --- */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 hover:shadow-indigo-100 transition-all flex items-center justify-center gap-2"
          >
            Finish & Restart
          </motion.button>
        </div>
      </motion.div>

      {/* --- INLINE CSS FOR THE SCROLLBAR --- */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default ResultModal;