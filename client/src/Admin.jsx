import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import bg from "./assets/bg.jpg";
import maya from "./assets/maya.png"

const Admin = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/leaderboard")
      .then((res) => res.json())
      .then((data) => setLeaderboard(data));
  }, []);

  return (
    <div
      className="relative flex flex-col justify-center items-center min-h-screen p-4 gap-3"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <img src={maya} className="absolute h-100 bottom-7 left-40" alt="" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-[40%] bg-gradient-to-br from-[#ffe8d6] to-[#fcd5ce] border-[6px] border-[#855c42] rounded-[2.5rem] lg:rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center w-full h-full rounded-[2rem] lg:rounded-[1.5rem] bg-[#fffef6] p-6 lg:p-4 border-4 border-[#b08968] shadow-inner">
          <motion.h2
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#4a3f2a] text-4xl  font-bold mb-4 text-center drop-shadow-sm m-2"
          >
            Leaderboard
          </motion.h2>

          <div className="w-full space-y-2">
            {leaderboard.slice(0,5).map((player, index) => (
              <motion.div
                key={player._id || `${player.name}-${player.score}-${index}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`flex items-center justify-between p-3 lg:p-2 rounded-xl ${
                  index === 0
                    ? "bg-[#f8e8d8] border-2 border-[#fca94c]"
                    : index === 1
                    ? "bg-[#f0f0e8] border-2 border-[#b08968]"
                    : index === 2
                    ? "bg-[#f5e6d3] border-2 border-[#cd7f32]"
                    : "bg-[#fffef6] border-2 border-[#d4a373]"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`rounded-full w-7 h-7 lg:w-6 lg:h-6 flex items-center justify-center mr-3 ${
                      index === 0
                        ? "bg-[#fca94c] text-white"
                        : index === 1
                        ? "bg-[#b08968] text-white"
                        : index === 2
                        ? "bg-[#cd7f32] text-white"
                        : "bg-[#d4a373] text-white"
                    }`}
                  >
                    <span className="font-bold text-sm">{index + 1}</span>
                  </div>
                  <span className="text-base lg:text-sm text-[#5a4a3a] font-medium">
                    {player.name}
                  </span>
                </div>
                <span
                  className={`text-lg lg:text-base font-bold ${
                    index === 0
                      ? "text-[#fb743f]"
                      : index === 1
                      ? "text-[#b08968]"
                      : index === 2
                      ? "text-[#cd7f32]"
                      : "text-[#5a4a3a]"
                  }`}
                >
                  {player.score}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Admin;
