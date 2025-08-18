import React, { useState, useEffect } from "react";
import { getGameApiUrl } from "../config";
import bg from "../assets/bg.jpg";
import mayaqt from "../assets/maya.png";

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(getGameApiUrl("/api/leaderboard"));
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }
        const data = await response.json();
        setScores(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-amber-50">
        <div className="text-2xl font-bold text-orange-600">
          Loading leaderboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 p-4">
        <div className="text-red-600 text-lg mb-4">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const topThree = scores.slice(0, 3);
  const otherScores = scores.slice(3);

  const getPodiumClass = (index) => {
    switch (index) {
      case 0:
        return "h-48 bg-yellow-200 border-yellow-400";
      case 1:
        return "h-36 bg-orange-100 border-orange-300";
      case 2:
        return "h-32 bg-amber-100 border-amber-300";
      default:
        return "h-24 bg-cream-50 border-amber-200";
    }
  };

  const getMedal = (index) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return "";
    }
  };

  return (
    <div
      className="relative min-h-screen p-4 md:p-8"
      style={{
        backgroundColor: "#f5f0e6", 
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <img src={mayaqt} alt="" className="hidden lg:block lg:absolute h-[420px] left-20 top-1"  />
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold text-center mb-8 text-brown-800"
          style={{ color: "#5c3a21" }}
        >
          Leaderboard
        </h1>

        {scores.length === 0 ? (
          <div
            className="text-center text-brown-600"
            style={{ color: "#7a5c3a" }}
          >
            No scores yet. Be the first to play!
          </div>
        ) : (
          <div>
            {/* Podium for top 3 */}
            <div className="flex justify-center items-end gap-4 mb-8">
              {topThree.length > 1 && (
                <div className="flex flex-col items-center w-1/4">
                  <div
                    className={`w-full rounded-t-lg border-2 border-b-0 p-4 text-center ${getPodiumClass(
                      1
                    )}`}
                  >
                    <div className="text-4xl">{getMedal(1)}</div>
                    <div
                      className="font-bold text-lg"
                      style={{ color: "#a65a2a" }}
                    >
                      2nd
                    </div>
                  </div>
                  <div
                    className="w-full bg-cream-50 p-3 text-center border-2 border-t-0 rounded-b-lg"
                    style={{
                      backgroundColor: "#fff9ec",
                      borderColor: "#d4a76a",
                    }}
                  >
                    <div
                      className="font-medium truncate text-brown-800"
                      style={{ color: "#5c3a21" }}
                    >
                      {topThree[1]?.name || "---"}
                    </div>
                    <div className="font-bold" style={{ color: "#8c4a1f" }}>
                      {topThree[1]?.bestScore || 0}
                    </div>
                  </div>
                </div>
              )}

              {topThree.length > 0 && (
                <div className="flex flex-col items-center w-1/3">
                  <div
                    className={`w-full rounded-t-lg border-2 border-b-0 p-4 text-center ${getPodiumClass(
                      0
                    )}`}
                  >
                    <div className="text-4xl">{getMedal(0)}</div>
                    <div
                      className="font-bold text-xl"
                      style={{ color: "#d97706" }}
                    >
                      1st
                    </div>
                  </div>
                  <div
                    className="w-full bg-cream-50 p-4 text-center border-2 border-t-0 rounded-b-lg"
                    style={{
                      backgroundColor: "#fff9ec",
                      borderColor: "#d4a76a",
                    }}
                  >
                    <div
                      className="font-bold text-lg truncate text-brown-800"
                      style={{ color: "#5c3a21" }}
                    >
                      {topThree[0]?.name || "---"}
                    </div>
                    <div
                      className="font-bold text-xl"
                      style={{ color: "#8c4a1f" }}
                    >
                      {topThree[0]?.bestScore || 0}
                    </div>
                  </div>
                </div>
              )}

              {topThree.length > 2 && (
                <div className="flex flex-col items-center w-1/4">
                  <div
                    className={`w-full rounded-t-lg border-2 border-b-0 p-4 text-center ${getPodiumClass(
                      2
                    )}`}
                  >
                    <div className="text-4xl">{getMedal(2)}</div>
                    <div
                      className="font-bold text-lg"
                      style={{ color: "#b45309" }}
                    >
                      3rd
                    </div>
                  </div>
                  <div
                    className="w-full bg-cream-50 p-3 text-center border-2 border-t-0 rounded-b-lg"
                    style={{
                      backgroundColor: "#fff9ec",
                      borderColor: "#d4a76a",
                    }}
                  >
                    <div
                      className="font-medium truncate text-brown-800"
                      style={{ color: "#5c3a21" }}
                    >
                      {topThree[2]?.name || "---"}
                    </div>
                    <div className="font-bold" style={{ color: "#8c4a1f" }}>
                      {topThree[2]?.bestScore || 0}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* others */}
            {otherScores.length > 0 && (
              <div
                className="rounded-lg shadow-md overflow-hidden"
                style={{
                  backgroundColor: "#fff9ec",
                  borderColor: "#d4a76a",
                  borderWidth: "1px",
                }}
              >
                <h2
                  className="text-xl font-semibold p-4 border-b"
                  style={{ color: "#5c3a21", borderColor: "#d4a76a" }}
                >
                  Other Players
                </h2>
                <div className="divide-y" style={{ borderColor: "#d4a76a" }}>
                  {otherScores.map((entry, index) => (
                    <div
                      key={entry._id}
                      className="p-4 hover:bg-amber-50"
                      style={{ backgroundColor: "#fff9ec" }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span
                            className="font-bold w-8"
                            style={{ color: "#5c3a21" }}
                          >
                            {index + 4}.
                          </span>
                          <span className="ml-2" style={{ color: "#5c3a21" }}>
                            {entry.name}
                          </span>
                        </div>
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: "#fef3c7",
                            color: "#92400e",
                          }}
                        >
                          {entry.bestScore || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center text-sm" style={{ color: "#7a5c3a" }}>
          <p>
            Showing top {scores.length} players. Play now to see your name on
            the leaderboard!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
