// Updated client/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Game from './Game'
import Admin from './Admin'
import "./index.css";

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={
          <div className='bg-green-200 w-full h-[100dvh]'>
            <Game />
          </div>
        } />
        {/* Redirect all other paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;