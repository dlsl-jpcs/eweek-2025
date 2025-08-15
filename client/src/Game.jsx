import React, { useState } from 'react'
import NameInput from './components/NameInput'
import Mechanics from './components/Mechanics';
import StackGame from './components/StackGame/StackGame';
import { Result } from './components/Results';


const GAME_STATES = {
  NAME_ENTRY: "nameEntry",
  MECHANICS: "mechanics",
  // countdown?
  STACK_GAME: "stackGame",
  RESULTS: "results",
};

const Game = () => {

  const [gameState, setGameState] = useState(GAME_STATES.NAME_ENTRY);
  const [playerName, setPlayerName] = useState("");
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

 
  /* useEffect(() => {
    if (gameState === GAME_STATES.RESULTS) {
      postScoreAndFetchLeaderboard();
    }
  }, [gameState]);

  const postScoreAndFetchLeaderboard = async () => {
    try {
      // Post the player's score to the backend
      await fetch(`${API_URL}/scores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playerName,
          score: score,
        }),
      });

      // Then fetch the updated leaderboard
      fetchLeaderboard();
    } catch (error) {
      console.error("Error posting score or fetching leaderboard:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_URL}/leaderboard`);
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      
      setLeaderboard([
        { rank: 1, name: "EcoMaster", score: 950 },
        { rank: 2, name: "GreenThumb", score: 875 },
        { rank: 3, name: "NatureLover", score: 820 },
        { rank: 4, name: "PlanetSaver", score: 790 },
        { rank: 5, name: "EcoWarrior", score: 755 },
      ]);
    }
  }; */

  return (
    <div className="w-full h-full bg-green-200">
      {gameState === "nameEntry" && <NameInput 
        playerName={playerName}
        setPlayerName={setPlayerName}
        setGameState={setGameState}
      />}
      {gameState === "mechanics" && <Mechanics 
        setGameState={setGameState}
      />} 
      { gameState === "stackGame" && <StackGame 
        name={name}
        score={score}
        setScore={setScore}
        setGameState={setGameState}
      />}
      {gameState === "results" && <Result playerName={playerName} score={score} /* leaderboard{leaderboard} *//>} 
    </div>
  );
}

export default Game