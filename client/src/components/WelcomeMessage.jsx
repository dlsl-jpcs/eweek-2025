import React from "react";
import { motion } from "framer-motion";

const WelcomeMessage = ({ playerName, setGameState }) => {
  const handleContinue = () => {
    setGameState("mechanics");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#d8f3dc] via-[#b7e4c7] to-[#95d5b2] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-gradient-to-br from-[#ffe8d6] to-[#fcd5ce] border-[6px] border-[#855c42] rounded-[3rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center w-full h-full rounded-[2.5rem] bg-[#fffef6] p-10 border-4 border-[#b08968] shadow-inner">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <h1 className="text-[#4a3f2a] text-4xl font-bold mb-2 drop-shadow-sm">
              Welcome,
            </h1>
            <h2 className="text-[#fb743f] text-3xl font-bold drop-shadow-sm">
              {playerName}!
            </h2>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <p className="text-[#6b5b47] text-lg">
              Ready to rebuild the sacred tree and help Maria Makiling?
            </p>
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 5px 15px rgba(251, 116, 63, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            className="relative px-10 py-4 text-xl font-bold text-white bg-gradient-to-r from-[#fca94c] to-[#fb743f] rounded-xl shadow-lg overflow-hidden"
          >
            <span className="relative z-10">Let's Play!</span>
            <motion.span className="absolute inset-0 bg-gradient-to-r from-[#fb743f] to-[#fca94c] opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeMessage;
