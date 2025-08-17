import React, { useState } from "react";
import { getDlslApiUrl } from '../config';
import bg from '../assets/bg.jpg'
import logo from '/logo2.png'

const StudentIdInput = ({ setPlayerName, setGameState, setStudentId, onApprovalRequest }) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (inputValue.trim() === "") return;
    
    setIsLoading(true);
    setError("");
    
    try {
      // FETCH
      const response = await fetch(getDlslApiUrl('/api/username'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId: inputValue.trim() })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch student information');
      }

      const data = await response.json();
      
      const studentName = data.displayName || 'Unknown Student';
      
      setPlayerName(studentName);
      setStudentId(inputValue.trim());
      
      if (onApprovalRequest) {
        onApprovalRequest(inputValue.trim(), studentName);
      } else {
        setGameState("mechanics");
      }
      
    } catch (err) {
      setError(err.message || 'An error occurred while fetching student information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
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
      <div className="w-[85%] max-w-md bg-gradient-to-br from-[#ffe8d6] to-[#fcd5ce] border-[6px] border-[#855c42] rounded-[3rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="flex flex-col items-center justify-center w-full h-full rounded-[2.5rem] bg-[#fffef6] p-10 border-4 border-[#b08968] shadow-inner">
          <h1 className="text-[#4a3f2a] text-3xl font-bold mb-6 text-center drop-shadow-sm">
            Enter your Student Number
          </h1>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full max-w-[260px] px-5 py-3 mb-6 text-2xl rounded-2xl border-2 border-[#c4a484] focus:outline-none focus:ring-2 focus:ring-[#7a5e42] text-[#4a3f2a] font-medium text-center bg-[#f9f6f0] placeholder-[#9f7e63] shadow-sm"
            placeholder="Student Number"
            disabled={isLoading}
          />

          {error && (
            <div className="text-red-600 text-center mb-4 px-4 py-2 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <button
            className="start-btn px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-[#fca94c] to-[#fb743f] rounded-xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isLoading || inputValue.trim() === ""}
          >
            {isLoading ? "Fetching..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentIdInput;
