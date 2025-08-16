// Updated client/src/App.jsx
import { useState, useEffect } from 'react'
import Game from './Game'
import Admin from './Admin'
import "./index.css";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if we're on the admin route
    const path = window.location.pathname;
    if (path === '/admin') {
      setIsAdmin(true);
    }
  }, []);

  // If not admin, show the game
  if (!isAdmin) {
    return (
      <div className='bg-green-200 w-full h-[100dvh]'>
        <Game />
      </div>
    );
  }

  // If admin, show admin component
  return <Admin />;
}

export default App