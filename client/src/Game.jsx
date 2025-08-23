import React, { useState, useEffect, useRef } from 'react'
import NameInput from './components/NameInput'
import Mechanics from './components/Mechanics';
import StackGame from './components/StackGame/StackGame';
import { Result } from './components/Results';
import ApprovalWaiting from './components/ApprovalWaiting';
import { getGameApiUrl } from './config';
import bgSound from '/cozy.mp3';

const GAME_STATES = {
  STUDENT_ID_ENTRY: "studentIdEntry",
  APPROVAL_WAITING: "approvalWaiting",
  NAME_ENTRY: "nameEntry",
  MECHANICS: "mechanics",
  STACK_GAME: "stackGame",
  RESULTS: "results",
};

const Game = () => {
  // start with name entry instead of student id entry
  const [gameState, setGameState] = useState(GAME_STATES.NAME_ENTRY);
  const [playerName, setPlayerName] = useState("");
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts] = useState(100); //dito palitan attempts
  const [sessionError, setSessionError] = useState("");
  const [requestId, setRequestId] = useState("");

   const bgAudioRef = useRef(null);

   useEffect(() => {
     // create audio instance
     bgAudioRef.current = new Audio(bgSound);
     bgAudioRef.current.loop = true;
     bgAudioRef.current.volume = 0.2;

     return () => {
       // stop sound on unmount
       bgAudioRef.current.pause();
       bgAudioRef.current = null;
     };
   }, []);

   useEffect(() => {
     // play only in allowed states
     if (
       gameState === GAME_STATES.STUDENT_ID_ENTRY ||
       gameState === GAME_STATES.APPROVAL_WAITING ||
       gameState === GAME_STATES.MECHANICS ||
       gameState === GAME_STATES.RESULTS
     ) {
       bgAudioRef.current.play().catch((err) => {
         console.log("Audio play failed:", err);
       });
     } else {
       bgAudioRef.current.pause();
       bgAudioRef.current.currentTime = 0; // reset position
     }
   }, [gameState]);

  useEffect(() => {
    // session id generator
    const gameSessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    setSessionId(gameSessionId);
    // Use name-entry state (no student ID flow)
    setGameState(GAME_STATES.NAME_ENTRY);
  }, []);

  useEffect(() => {
    // when in mechanics, check status using playerName+sessionId
    if (gameState === GAME_STATES.MECHANICS && playerName && sessionId) {
      checkStudentStatus();
    }
  }, [gameState, playerName, sessionId]);

  const checkStudentStatus = async () => {
    try {
      const identifier = encodeURIComponent(playerName);
      const response = await fetch(getGameApiUrl(`/api/student-status/${identifier}/${sessionId}`));
      if (response.ok) {
        const data = await response.json();
        setAttempts(data.attempts);
        
        if (!data.canPlay) {
          // pag ubos na attempts
          setScore(data.bestScore || 0);
          setGameState(GAME_STATES.RESULTS);
        }
      }
    } catch (error) {
      console.error("Error checking student status:", error);
    }
  };

  // post score, tapos update leaderboard tapos fetch updated lb
  const postScoreAndFetchLeaderboard = async () => {
    try {
      const response = await fetch(getGameApiUrl('/api/scores'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playerName,
          score: score,
          sessionId: sessionId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAttempts(data.attempts);
      }
    } catch (error) {
      console.error("Error posting score or fetching leaderboard:", error);
    }
  };

  // Leaderboard fetching is disabled in the client (UI hidden)
  const fetchLeaderboard = async () => {};

  useEffect(() => {
    if (gameState === GAME_STATES.RESULTS) {
      postScoreAndFetchLeaderboard();
    }
  }, [gameState]);

  // Approval flow is disabled for name-only registration

  const handlePlayAgain = () => {
    if (attempts < maxAttempts) {
      setScore(0);
      setGameState(GAME_STATES.STACK_GAME);
    } else {
      setPlayerName("");
      // studentId no longer used
      setScore(0);
      setAttempts(0);
        setGameState(GAME_STATES.NAME_ENTRY);
    }
  };



  return (
    <div className="w-full h-full bg-green-200">
      {gameState === GAME_STATES.NAME_ENTRY && (
        <NameInput 
          playerName={playerName}
          setPlayerName={setPlayerName}
          setGameState={setGameState}
        />
      )}
      {gameState === GAME_STATES.MECHANICS && (
        <Mechanics 
          setGameState={setGameState}
          attempts={attempts}
          maxAttempts={maxAttempts}
        />
      )} 
      {gameState === GAME_STATES.STACK_GAME && (
        <StackGame 
          name={playerName}
          score={score}
          setScore={setScore}
          setGameState={setGameState}
          attempts={attempts}
          maxAttempts={maxAttempts}
        />
      )}
      {gameState === GAME_STATES.RESULTS && (
        <Result 
          playerName={playerName} 
          score={score} 
          leaderboard={leaderboard}
          attempts={attempts}
          maxAttempts={maxAttempts}
          onPlayAgain={handlePlayAgain}
        />
        )}
    </div>
  );
}

export default Game