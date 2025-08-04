import React, { useState } from 'react'
import NameInput from './components/NameInput'
import Mechanics from './components/Mechanics';


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
      {/* {gameState === "stackGame" && <StackGame />} */}
      {/* {gameState === "results" && <Results />} */}
    </div>
  );
}

export default Game