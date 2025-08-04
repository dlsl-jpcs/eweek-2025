import { useState } from 'react'
import Game from './Game'
import "./index.css";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='bg-green-200 w-full h-[100dvh]'>
      <Game />
    </div>
  );
}

export default App
