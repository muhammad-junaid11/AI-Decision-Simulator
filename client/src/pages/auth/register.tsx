import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { api } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, UserPlus, AlertCircle, ArrowRight } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

type RegisterInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<RegisterInputs>();

  // const password = watch("password");

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    if (data.password !== data.confirmPassword) {
      setServerError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setServerError(null);
    try {
      const res = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      login(res.data);
      navigate("/login");
    } catch (err: any) {
      setServerError(err.response?.data?.message || "Error creating account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6">
      {/* Top Accent Line */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 to-violet-400" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px]"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-[1.5rem] shadow-xl mb-4"
          >
            <UserPlus className="text-indigo-600" size={28} />
          </motion.div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
          <p className="text-slate-500 mt-2">Join the AI Decision Lab today</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50"
        >
          <AnimatePresence mode="wait">
            {serverError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-semibold"
              >
                <AlertCircle size={18} />
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-5">
            {/* Name Field */}
            <div className="relative">
              <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input
                  {...register("name", { required: "What should we call you?" })}
                  placeholder="John Doe"
                  className={`input-field pl-12 ${errors.name ? 'border-red-100' : ''}`}
                />
              </div>
              {errors.name && <p className="text-red-500 text-[11px] mt-1.5 ml-1 font-medium">{errors.name.message}</p>}
            </div>

            {/* Email Field */}
            <div className="relative">
              <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input
                  {...register("email", { 
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                  })}
                  placeholder="name@example.com"
                  className={`input-field pl-12 ${errors.email ? 'border-red-100' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-[11px] mt-1.5 ml-1 font-medium">{errors.email.message}</p>}
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    {...register("password", { 
                      required: "Password is required", 
                      minLength: { value: 6, message: "6+ chars" } 
                    })}
                    type="password"
                    placeholder="••••••"
                    className="input-field pl-11 text-sm"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 ml-1">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    {...register("confirmPassword", { required: "Confirm required" })}
                    type="password"
                    placeholder="••••••"
                    className="input-field pl-11 text-sm"
                  />
                </div>
              </div>
            </div>
            {(errors.password || errors.confirmPassword) && (
              <p className="text-red-500 text-[11px] font-medium ml-1">
                {errors.password?.message || errors.confirmPassword?.message}
              </p>
            )}

            <button
              disabled={isLoading}
              className="w-full btn-primary mt-4 flex items-center justify-center gap-3 group bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8 text-slate-500 text-sm font-medium"
        >
          Already a member?{" "}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline underline-offset-4">
            Sign In here
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;