// Updated client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Game from './Game'
import Admin from './Admin'
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={
          <div className='bg-green-200 w-full h-[100dvh]'>
            <Game />
          </div>
        } />
        {/* Catch-all route for SPA routing */}
        <Route path="*" element={
          <div className='bg-green-200 w-full h-[100dvh]'>
            <Game />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App