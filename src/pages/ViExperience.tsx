import { motion } from "framer-motion";
import { Bot, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ViExperienceSurvey from "@/components/v3/ViExperienceSurvey";

const ViExperience = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-[#0f172a] selection:bg-primary/10">
      {/* Soft Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-100/20 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-50 p-6 flex justify-between items-center max-w-7xl mx-auto w-full"
      >
        <Link to="/" className="text-xl font-display font-bold flex items-center gap-2 group text-[#0f172a]">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary transition-all">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          Vincere <span className="text-primary italic">VI</span>
        </Link>
        <button onClick={() => navigate("/")} className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-2 font-bold">
          <ArrowLeft className="w-4 h-4" /> Voltar para o início
        </button>
      </motion.header>

      <main className="container mx-auto px-4 pt-8 pb-24 relative z-10 max-w-5xl">
        <ViExperienceSurvey />
      </main>
    </div>
  );
};

export default ViExperience;
