import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AiDecisionSimulator from "../AiDecisionSimulator";
import Navbar from "../../components/Layout/Navbar";
import { Sparkles, ArrowRight, LayoutGrid, Zap } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const [mode, setMode] = useState<"list" | "ai">("list");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  if (!user) return null; // prevent flash

  if (mode === "ai") {
    return <AiDecisionSimulator onBack={() => setMode("list")} />;
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />

      <main className="p-8 md:p-16 pt-32 md:pt-40">
        <header className="max-w-4xl mx-auto mb-12 flex justify-between items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-indigo-600 font-bold tracking-widest text-[10px] uppercase mb-3"
            >
              <LayoutGrid size={14} />
              Central Command
            </motion.div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Decision Dashboard
            </h1>
          </div>

          <div className="hidden md:block text-right">
            <p className="text-sm text-slate-400 font-medium">System Status</p>
            <div className="flex items-center gap-2 text-green-500 font-bold text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              AI Neural Engine Online
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ y: -8, boxShadow: "0 30px 60px -12px rgba(0,0,0,0.08)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMode("ai")}
            className="group relative p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] cursor-pointer overflow-hidden transition-all"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-colors" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:bg-indigo-600 transition-all duration-500">
                <Sparkles size={28} />
              </div>

              <h2 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-2">
                AI Career Simulator
                <Zap size={18} className="text-amber-400 fill-amber-400" />
              </h2>

              <p className="text-slate-500 leading-relaxed mb-8">
                Experience a dynamic AI-powered simulation to navigate complex career paths and decisions.
              </p>

              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider">
                Launch Engine
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
              </div>
            </div>
          </motion.div>

          <div className="p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center group">
            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-4 group-hover:bg-slate-300 transition-colors">
              <span className="text-2xl font-bold">+</span>
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
              New Module Coming Soon
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;