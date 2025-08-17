import React from "react";
import { motion } from "framer-motion";
import bg from "../assets/bg.jpg";
import logo from "/logo2.png";

const Mechanics = ({ setGameState, attempts, maxAttempts }) => {
  const handleGo = () => {
    setGameState("stackGame");
  };

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#d8f3dc] via-[#b7e4c7] to-[#95d5b2] p-4"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <img src={logo} alt="" className="w-[275px] lg:w-[325px]" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-gradient-to-br from-[#ffe8d6] to-[#fcd5ce] border-[6px] border-[#855c42] rounded-[3rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center w-full h-full rounded-[2.5rem] bg-[#fffef6] p-10 border-4 border-[#b08968] shadow-inner">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#4a3f2a] text-4xl font-bold mb-3 text-center drop-shadow-sm"
          >
            Paano Laruin
          </motion.h1>

          <div className="w-full space-y-6 mb-5">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center"
            >
              <div className="bg-[#fca94c] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                1
              </div>
              <p className="text-lg text-[#5a4a3a]">
                Buoin muli ang sagradong puno upang matulungan si Maria Makiling
                na maibalik ang ganda ng bundok.
              </p>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center "
            >
              <div className="bg-[#fca94c] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                2
              </div>
              <p className="text-lg text-[#5a4a3a]">
                Magpatong ng maraming piraso ng puno nang may eksaktong
                pagkakaayos.
              </p>
            </motion.div>
         
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center"
            >
              <div className="bg-[#fca94c] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                3
              </div>
              <p className="text-lg text-[#5a4a3a]">
                Ang nangungunang 3 manlalaro pagkatapos ng palaro ay mananalo ng
                premyo.
              </p>
            </motion.div>
          </div>

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 5px 15px rgba(251, 116, 63, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGo}
            className="relative px-10 py-4 text-xl font-bold text-white bg-gradient-to-r from-[#fca94c] to-[#fb743f] rounded-xl shadow-lg overflow-hidden"
          >
            <span className="relative z-10">Magsimula</span>
            <motion.span className="absolute inset-0 bg-gradient-to-r from-[#fb743f] to-[#fca94c] opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Mechanics;
