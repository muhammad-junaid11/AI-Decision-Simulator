import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1 
    }
  },
  exit: { opacity: 0, x: -50 }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const QuestionCard = ({ question, options, onAnswer }: any) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="p-8 bg-white/80 backdrop-blur-md border border-white rounded-3xl shadow-2xl"
    >
      <motion.span className="text-indigo-500 font-semibold uppercase tracking-wider text-sm">
        Question
      </motion.span>
      <motion.h2 className="text-2xl font-bold mt-2 mb-8 text-gray-800 leading-tight">
        {question}
      </motion.h2>
      
      <div className="grid gap-4">
        {options.map((opt: string, i: number) => (
          <motion.button
            key={i}
            variants={itemVariants}
            whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnswer(opt)}
            className="w-full text-left p-5 rounded-2xl border-2 border-gray-100 transition-colors hover:border-indigo-300 group flex justify-between items-center"
          >
            <span className="font-medium text-gray-700">{opt}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500">→</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
export default QuestionCard;