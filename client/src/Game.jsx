import React, { useState, useEffect } from 'react'
import StudentIdInput from './components/StudentIdInput'
import NameInput from './components/NameInput'
import Mechanics from './components/Mechanics';
import StackGame from './components/StackGame';
import { Result } from './components/Results';
import ApprovalWaiting from './components/ApprovalWaiting';
import { getGameApiUrl } from './config';

const GAME_STATES = {
  STUDENT_ID_ENTRY: "studentIdEntry",
  APPROVAL_WAITING: "approvalWaiting",
  NAME_ENTRY: "nameEntry",
  MECHANICS: "mechanics",
  STACK_GAME: "stackGame",
  RESULTS: "results",
};

const Game = () => {
  const [gameState, setGameState] = useState(GAME_STATES.STUDENT_ID_ENTRY);
  const [playerName, setPlayerName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts] = useState(3);
  const [sessionError, setSessionError] = useState("");
  const [requestId, setRequestId] = useState("");

  // No session validation needed - game is accessible via deployed URL
  useEffect(() => {
    // Generate a simple session ID for tracking game attempts
    const gameSessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    setSessionId(gameSessionId);
    setGameState(GAME_STATES.STUDENT_ID_ENTRY);
  }, []);

  // No need to generate new session ID since we use the QR session ID

  // Check if student can still play when entering mechanics
  useEffect(() => {
    if (gameState === GAME_STATES.MECHANICS && studentId && sessionId) {
      checkStudentStatus();
    }
  }, [gameState, studentId, sessionId]);

  const checkStudentStatus = async () => {
    try {
      const response = await fetch(getGameApiUrl(`/api/student-status/${studentId}/${sessionId}`));
      if (response.ok) {
        const data = await response.json();
        setAttempts(data.attempts);
        
        if (!data.canPlay) {
          // Student has used all attempts, show results
          setScore(data.bestScore || 0);
          setGameState(GAME_STATES.RESULTS);
        }
      }
    } catch (error) {
      console.error("Error checking student status:", error);
    }
  };

  const postScoreAndFetchLeaderboard = async () => {
    try {
      // Post the player's score to the backend
      const response = await fetch(getGameApiUrl('/api/scores'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: studentId,
          name: playerName,
          score: score,
          sessionId: sessionId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAttempts(data.attempts);
      }

      // Then fetch the updated leaderboard
      fetchLeaderboard();
    } catch (error) {
      console.error("Error posting score or fetching leaderboard:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(getGameApiUrl('/api/leaderboard'));
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      
      setLeaderboard([
        { name: "EcoMaster", bestScore: 950 },
        { name: "GreenThumb", bestScore: 875 },
        { name: "NatureLover", bestScore: 820 },
        { name: "PlanetSaver", bestScore: 790 },
        { name: "EcoWarrior", bestScore: 755 },
      ]);
    }
  };

  // Handle game completion
  useEffect(() => {
    if (gameState === GAME_STATES.RESULTS) {
      postScoreAndFetchLeaderboard();
    }
  }, [gameState]);

  const handleApprovalRequest = async (studentId, studentName) => {
    try {
      const response = await fetch(getGameApiUrl('/api/approval/request'), {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: studentId,
          studentName: studentName
        })
      });

      if (response.ok) {
        const data = await response.json();
        setRequestId(data.requestId);
        setGameState(GAME_STATES.APPROVAL_WAITING);
      } else {
        throw new Error('Failed to submit approval request');
      }
    } catch (error) {
      console.error('Error submitting approval request:', error);
      // Fall back to direct game access if approval system fails
      setPlayerName(studentName);
      setGameState(GAME_STATES.MECHANICS);
    }
  };

  const handleApprovalSuccess = () => {
    setGameState(GAME_STATES.MECHANICS);
  };

  const handleApprovalRejection = (reason) => {
    setSessionError(`Access denied: ${reason}. Please ensure you've signed up at our booth.`);
    setGameState(GAME_STATES.STUDENT_ID_ENTRY);
  };

  const handlePlayAgain = () => {
    if (attempts < maxAttempts) {
      setScore(0);
      setGameState(GAME_STATES.STACK_GAME);
    } else {
      // Reset everything and go back to student ID entry for new approval
      setPlayerName("");
      setStudentId("");
      setScore(0);
      setAttempts(0);
      setGameState(GAME_STATES.STUDENT_ID_ENTRY);
    }
  };



  return (
    <div className="w-full h-full bg-green-200">
      {gameState === GAME_STATES.STUDENT_ID_ENTRY && (
        <StudentIdInput 
          setPlayerName={setPlayerName}
          setGameState={setGameState}
          setStudentId={setStudentId}
          onApprovalRequest={handleApprovalRequest}
        />
      )}
      {gameState === GAME_STATES.APPROVAL_WAITING && (
        <ApprovalWaiting
          requestId={requestId}
          studentName={playerName}
          onApproved={handleApprovalSuccess}
          onRejected={handleApprovalRejection}
        />
      )}
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