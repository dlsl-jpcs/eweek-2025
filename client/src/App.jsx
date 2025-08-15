import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./Game";
import Admin from "./Admin";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/leaderboard" element={<Admin />} />
        <Route path="/" element={<Game />} />
        <Route
          path="*"
          element={
            <div className="flex justify-center items-center h-[100dvh]">
              <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
