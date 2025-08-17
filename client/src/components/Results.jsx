import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export const Result = ({ playerName, score, leaderboard, attempts, maxAttempts, onPlayAgain }) => {
  const [playerRank, setPlayerRank] = useState(null);
  const hasPostedScore = useRef(false);

  useEffect(() => {
    if (leaderboard && playerName && typeof score === "number") {
      const rank = leaderboard.findIndex(
        (entry) => entry.name === playerName && entry.bestScore === score
      );
      setPlayerRank(rank !== -1 ? rank + 1 : null);
    }
  }, [leaderboard, playerName, score]);

  const canPlayAgain = attempts < maxAttempts;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#d8f3dc] via-[#b7e4c7] to-[#95d5b2] p-4">
      <div className="w-full max-w-lg lg:max-w-md xl:max-w-sm space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-gradient-to-br from-[#ffe8d6] to-[#fcd5ce] border-[6px] border-[#855c42] rounded-[2.5rem] lg:rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] overflow-hidden"
        >
          <div className="flex flex-col items-center justify-center w-full h-full rounded-[2rem] lg:rounded-[1.5rem] bg-[#fffef6] p-6 lg:p-5 border-4 border-[#b08968] shadow-inner">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[#4a3f2a] text-3xl lg:text-2xl font-bold mb-4 text-center drop-shadow-sm"
            >
              Game Over!
            </motion.h1>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-[#fffef6] border-2 border-[#b08968] rounded-full px-6 py-3 lg:px-5 lg:py-2 shadow-inner"
            >
              <p className="text-2xl lg:text-xl font-bold text-[#5a4a3a]">
                Your Score: <span className="text-[#fb743f]">{score}</span>
                {/* rank */}
                {playerRank && (
                  <span className="ml-4 text-[#b08968] text-lg">(Rank: {playerRank})</span>
                )} 
              </p>
            </motion.div>

            {/* Attempts logic: show Retry on first attempt, register prompt after max attempts */}
            {canPlayAgain ? (
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={onPlayAgain}
                className="mt-4 px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-[#fca94c] to-[#fb743f] rounded-xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-150"
              >
                Retry (Attempt {attempts + 1} of {maxAttempts})
              </motion.button>
            ) : (
              <>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-4 p-4 bg-[#fef2f2] border-2 border-[#fca5a5] rounded-xl"
                >
                  <p className="text-[#dc2626] text-center font-medium">
                    You've used all {maxAttempts} attempts for this session.
                  </p>
                </motion.div>
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  onClick={() => alert('Please register at our booth again to get more attempts.')} 
                  className="mt-3 px-6 py-3 text-base font-bold text-white bg-[#ef4444] rounded-xl shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-150"
                >
                  Register at Booth to Play Again
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full bg-gradient-to-br from-[#ffe8d6] to-[#fcd5ce] border-[6px] border-[#855c42] rounded-[2.5rem] lg:rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] overflow-hidden"
        >
          <div className="flex flex-col items-center justify-center w-full h-full rounded-[2rem] lg:rounded-[1.5rem] bg-[#fffef6] p-6 lg:p-4 border-4 border-[#b08968] shadow-inner">
            <motion.h2
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[#4a3f2a] text-2xl lg:text-xl font-bold mb-4 text-center drop-shadow-sm"
            >
              Leaderboard
            </motion.h2>

            <div className="w-full space-y-2">
              {leaderboard.map((player, index) => (
                <motion.div
                  key={player._id || `${player.name}-${player.bestScore}-${index}`}
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
                    {player.bestScore}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="w-full mt-4 p-3 bg-[#fffef6] border-2 border-[#fb743f] rounded-xl shadow-inner"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="rounded-full w-7 h-7 lg:w-6 lg:h-6 bg-[#fb743f] text-white flex items-center justify-center mr-3">
                    <span className="font-bold text-sm">?</span>
                  </div>
                  <span className="text-base lg:text-sm text-[#5a4a3a] font-medium">
                    {playerName}
                  </span>
                </div>
                <span className="text-lg lg:text-base font-bold text-[#fb743f]">
                  {score}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
