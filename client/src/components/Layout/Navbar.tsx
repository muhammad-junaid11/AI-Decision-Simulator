import { motion } from "framer-motion";
import { LogOut, Bell } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <nav className="fixed top-0 inset-x-0 z-[100] px-6 py-4">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[2rem] px-6 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <span className="font-black text-xl italic">A</span>
          </div>
          <span className="font-black text-slate-900 tracking-tighter text-xl hidden sm:block">
            AI.LAB
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white" />
          </button>

          <div className="h-8 w-[1px] bg-slate-100 mx-2" />

          <div className="flex items-center gap-3 group cursor-pointer pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                Authorized
              </p>
              <p className="text-sm font-bold text-slate-800 leading-none">
                {user.name.split(' ')[0]}
              </p>
            </div>

            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100">
                {user.name.charAt(0)}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#fee2e2", color: "#ef4444" }}
              onClick={logout}
              className="p-2.5 text-slate-400 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;