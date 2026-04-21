import { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import AiDecisionSimulator from "../AIDecisionSimulator/AiDecisionSimulator";
import DebateSimulator from "../Debate/Debate";
import Navbar from "../../components/Layout/Navbar";

import {
  Sparkles,
  ArrowRight,
  LayoutGrid,
  Zap,
  MessageSquare,
  Rocket,
} from "lucide-react";

import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isAI = location.pathname === "/dashboard/ai";
  const isDebate = location.pathname === "/dashboard/debate";

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [user, loading, navigate]);

  if (loading) return null;
  if (!user) return null;

  // FULL PAGE RENDER BASED ON ROUTE
  if (isAI)
    return (
      <AiDecisionSimulator onBack={() => navigate("/dashboard")} />
    );

  if (isDebate)
    return (
      <DebateSimulator onBack={() => navigate("/dashboard")} />
    );

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
            <p className="text-sm text-slate-400 font-medium">
              System Status
            </p>
            <div className="flex items-center gap-2 text-green-500 font-bold text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              AI Neural Engine Online
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          <motion.div
            whileHover={{
              y: -8,
              boxShadow: "0 30px 60px -12px rgba(0,0,0,0.08)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/dashboard/ai")}
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

          <motion.div
            whileHover={{
              y: -8,
              boxShadow: "0 30px 60px -12px rgba(0,0,0,0.08)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/dashboard/debate")}
            className="group relative p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] cursor-pointer overflow-hidden transition-all"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-colors" />

            <div className="relative z-10">
              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:bg-indigo-600 transition-all duration-500">
                <MessageSquare size={28} />
              </div>

              <h2 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-2">
                AI Debate Simulator
                <Zap size={18} className="text-amber-400 fill-amber-400" />
              </h2>

              <p className="text-slate-500 leading-relaxed mb-8">
                Watch AI agents debate complex decisions and analyze multiple perspectives in real-time.
              </p>

              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider">
                Start Debate
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{
              y: -8,
              boxShadow: "0 30px 60px -12px rgba(0,0,0,0.08)",
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] overflow-hidden transition-all opacity-80 cursor-not-allowed"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-slate-100 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="w-14 h-14 bg-slate-200 text-slate-600 rounded-2xl flex items-center justify-center mb-6">
                <Rocket size={28} />
              </div>

              <h2 className="text-2xl font-black text-slate-700 mb-2 flex items-center gap-2">
                Coming Soon
                <Zap size={18} className="text-slate-400" />
              </h2>

              <p className="text-slate-400 leading-relaxed mb-8">
                New AI-powered modules and intelligent tools are under development. Stay tuned for more tools coming on your way!
              </p>

              <div className="flex items-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-wider">
                Stay Tuned
                <ArrowRight size={16} />
              </div>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;