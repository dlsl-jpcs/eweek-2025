import React, { useState, useEffect } from 'react';
import { getGameApiUrl } from '../config';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(getGameApiUrl('/api/leaderboard'));
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        const data = await response.json();
        setLeaderboard(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard. Please try again later.');
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getMedal = (position) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${position}.`;
    }
  };

  return (
    <div className="min-h-screen bg-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Tala Makiling</h1>
          <h2 className="text-xl text-green-700">JPCS E-Week Booth Game 2025</h2>
          <h3 className="text-2xl font-semibold text-green-800 mt-6 mb-4">Leaderboard</h3>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            <p className="mt-2 text-green-700">Loading leaderboard...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Top 3 Players */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b">
              {leaderboard.slice(0, 3).map((entry, index) => {
                const position = index + 1;
                const medal = getMedal(position);
                
                return (
                  <div key={index} className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-4xl mb-2">{medal}</div>
                    <div className="text-xl font-bold text-center">{entry.name}</div>
                    {entry.studentId && (
                      <div className="text-sm text-gray-600 mb-2">{entry.studentId}</div>
                    )}
                    <div className="text-2xl font-bold text-yellow-700">
                      {entry.bestScore || entry.score}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rest of the leaderboard in 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              {leaderboard.slice(3).map((entry, index) => {
                const position = index + 4; // Start from position 4
                return (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-lg font-medium w-8">{position}.</span>
                      <div>
                        <div className="font-medium">{entry.name}</div>
                        {entry.studentId && (
                          <div className="text-xs text-gray-500">{entry.studentId}</div>
                        )}
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {entry.bestScore || entry.score}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {leaderboard.length === 0 && !loading && (
              <div className="text-center py-10 text-gray-500">
                No scores yet. Be the first to play!
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Showing top 50 players. Play now to see your name on the leaderboard!</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
