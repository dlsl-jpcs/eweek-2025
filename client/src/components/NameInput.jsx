import React, { useState } from "react";
import bg from "../assets/bg.jpg"

const NameInput = ({ playerName, setPlayerName, setGameState }) => {
  const [inputValue, setInputValue] = useState(playerName);

  const handleStart = () => {
    if (inputValue.trim() === "") return;
    setPlayerName(inputValue.trim());
    setGameState("mechanics");
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#d8f3dc] via-[#b7e4c7] to-[#95d5b2] p-4"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-lg bg-gradient-to-br from-[#ffe8d6] to-[#fcd5ce] border-[6px] border-[#855c42] rounded-[3rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="flex flex-col items-center justify-center w-full h-full rounded-[2.5rem] bg-[#fffef6] p-10 border-4 border-[#b08968] shadow-inner">
          <h1 className="text-[#4a3f2a] text-4xl font-bold mb-6 text-center drop-shadow-sm">
            Enter your name
          </h1>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full max-w-[260px] font-sora px-5 py-3 mb-6 text-2xl rounded-2xl border-2 border-[#c4a484] focus:outline-none focus:ring-2 focus:ring-[#7a5e42] text-[#4a3f2a] font-medium text-center bg-[#f9f6f0] placeholder-[#9f7e63] shadow-sm"
            placeholder="Name"
          />
          <button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 5px 15px rgba(251, 116, 63, 0.4)",
            }}
            className="start-btn px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-[#fca94c] to-[#fb743f] rounded-xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-150"
            onClick={handleStart}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default NameInput;
