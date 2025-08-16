// Updated client/src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Game from './Game'
import Admin from './Admin'
import "./index.css";

function DebugOverlay() {
  const loc = useLocation();
  return (
    <div style={{position:'fixed',bottom:6,right:6,background:'rgba(0,0,0,0.5)',color:'#fff',padding:'4px 6px',borderRadius:4,fontSize:12,zIndex:9999}}>
      {loc.pathname}{loc.search}{loc.hash}
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700">
      <div>
        <div className="text-xl font-semibold mb-2">Route not found</div>
        <div>Try navigating to /admin or /</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router basename="/">
      <DebugOverlay />
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={
          <div className='bg-green-200 w-full h-[100dvh]'>
            <Game />
          </div>
        } />
        {/* Show NotFound instead of redirect to diagnose matching */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;