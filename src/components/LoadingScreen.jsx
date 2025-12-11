import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const WarpLine = ({ rotation, delay }) => (
  <motion.div
    className="absolute top-1/2 left-1/2 w-[200vw] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent origin-left"
    style={{ rotate: rotation, x: '-50%', y: '-50%' }}
    initial={{ scaleX: 0, opacity: 0, x: 0 }}
    animate={{ scaleX: [0, 5, 0], opacity: [0, 1, 0], x: ['0%', '50%'] }}
    transition={{
      duration: 0.5,
      delay: delay,
      repeat: Infinity,
      ease: "linear",
      repeatDelay: Math.random() * 0.5
    }}
  />
);

const LoadingScreen = () => {
  const [text, setText] = useState("INITIALIZING");

  useEffect(() => {
    const states = ["ENGAGING WARP DRIVE", "CALIBRATING NAV SYSTEMS", "CONNECTING TO THE VOID", "HYPERSPACE READY"];
    let i = 0;
    const interval = setInterval(() => {
      setText(states[i % states.length]);
      i++;
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Warp Lines / Stars */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(20)].map((_, i) => (
          <WarpLine key={i} rotation={i * 18} delay={Math.random() * 2} />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Central Singularity */}
        <motion.div
          className="w-32 h-32 rounded-full bg-black shadow-[0_0_50px_#00F0FF,inset_0_0_20px_#BC13FE] border border-cyber-cyan/50 backdrop-blur-sm"
          animate={{ scale: [1, 1.1, 0.9, 1], rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 rounded-full border-t-2 border-cyber-cyan animate-spin" />
          <div className="absolute inset-2 rounded-full border-b-2 border-cyber-purple animate-spin-slow" />
        </motion.div>

        {/* Text Glitch Effect */}
        <div className="mt-12 text-center relative">
          <motion.h2
            className="text-2xl font-orbitron font-bold text-white tracking-[0.3em] uppercase"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
          >
            {text}
          </motion.h2>

          <motion.div
            className="h-0.5 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent mt-4"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
          />
        </div>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)] pointer-events-none" />
    </motion.div>
  );
};

export default LoadingScreen;
