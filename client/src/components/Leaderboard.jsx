import React, { useState, useEffect } from 'react';
import { getGameApiUrl } from '../config';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(getGameApiUrl('/api/leaderboard'));
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        const data = await response.json();
        setScores(data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-bold text-blue-600">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-red-500 text-lg mb-4">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const topThree = scores.slice(0, 3);
  const otherScores = scores.slice(3);

  const getPodiumClass = (index) => {
    switch(index) {
      case 0: return 'h-48 bg-yellow-100 border-yellow-300';
      case 1: return 'h-36 bg-gray-100 border-gray-300';
      case 2: return 'h-32 bg-amber-100 border-amber-200';
      default: return 'h-24 bg-white border-gray-200';
    }
  };

  const getMedal = (index) => {
    switch(index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">Leaderboard</h1>
        
        {scores.length === 0 ? (
          <div className="text-center text-gray-600">No scores yet. Be the first to play!</div>
        ) : (
          <div>
            {/* Podium for top 3 */}
            <div className="flex justify-center items-end gap-4 mb-8">
              {topThree.length > 1 && (
                <div className="flex flex-col items-center w-1/4">
                  <div className={`w-full rounded-t-lg border-2 border-b-0 p-4 text-center ${getPodiumClass(1)}`}>
                    <div className="text-4xl">{getMedal(1)}</div>
                    <div className="font-bold text-lg">2nd</div>
                  </div>
                  <div className="w-full bg-white p-3 text-center border-2 border-t-0 rounded-b-lg">
                    <div className="font-medium truncate">{topThree[1]?.name || '---'}</div>
                    <div className="text-blue-600 font-bold">{topThree[1]?.bestScore || 0}</div>
                  </div>
                </div>
              )}

              {topThree.length > 0 && (
                <div className="flex flex-col items-center w-1/3">
                  <div className={`w-full rounded-t-lg border-2 border-b-0 p-4 text-center ${getPodiumClass(0)}`}>
                    <div className="text-4xl">{getMedal(0)}</div>
                    <div className="font-bold text-xl">1st</div>
                  </div>
                  <div className="w-full bg-white p-4 text-center border-2 border-t-0 rounded-b-lg">
                    <div className="font-bold text-lg truncate">{topThree[0]?.name || '---'}</div>
                    <div className="text-blue-600 font-bold text-xl">{topThree[0]?.bestScore || 0}</div>
                  </div>
                </div>
              )}

              {topThree.length > 2 && (
                <div className="flex flex-col items-center w-1/4">
                  <div className={`w-full rounded-t-lg border-2 border-b-0 p-4 text-center ${getPodiumClass(2)}`}>
                    <div className="text-4xl">{getMedal(2)}</div>
                    <div className="font-bold text-lg">3rd</div>
                  </div>
                  <div className="w-full bg-white p-3 text-center border-2 border-t-0 rounded-b-lg">
                    <div className="font-medium truncate">{topThree[2]?.name || '---'}</div>
                    <div className="text-blue-600 font-bold">{topThree[2]?.bestScore || 0}</div>
                  </div>
                </div>
              )}
            </div>

            {/* others */}
            {otherScores.length > 0 && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <h2 className="text-xl font-semibold p-4 border-b border-gray-200 text-gray-700">
                  Other Players
                </h2>
                <div className="divide-y divide-gray-200">
                  {otherScores.map((entry, index) => (
                    <div key={entry._id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="font-bold text-gray-700 w-8">{index + 4}.</span>
                          <span className="ml-2">{entry.name}</span>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
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
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Showing top {scores.length} players. Play now to see your name on the leaderboard!</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
