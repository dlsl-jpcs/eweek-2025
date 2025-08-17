import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Game from './Game';
import Admin from './Admin';
import Leaderboard from './components/Leaderboard';
import "./index.css";

function DebugOverlay() {
  const loc = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const isAdminPath = loc.pathname === '/admin';
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
    
    if (isAdminPath && !isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [loc.pathname, navigate]);

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
        <Route path="/admin" element={
          localStorage.getItem('isAdminAuthenticated') === 'true' ? 
            <Admin /> : 
            <Admin />
        } />
        <Route path="/leaderboard" element={
          <Leaderboard isAdmin={localStorage.getItem('isAdminAuthenticated') === 'true'} />
        } />
        <Route path="/" element={
          <div className='bg-green-200 w-full h-[100dvh]'>
            <Game />
          </div>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;