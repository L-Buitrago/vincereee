import { motion } from "framer-motion";

const InfiniteTicker = ({ text }: { text: string }) => {
  return (
    <div className="relative w-full py-10 overflow-hidden bg-black border-y border-white/5 select-none">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
        className="flex whitespace-nowrap gap-20 items-center"
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className="text-4xl md:text-6xl font-serif italic text-white/10 uppercase tracking-tighter">
            {text} — 
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default InfiniteTicker;
