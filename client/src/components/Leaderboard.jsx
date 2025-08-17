import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGameApiUrl } from '../config';

const Leaderboard = ({ isAdmin }) => {
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

  // Function to get medal emoji based on position
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
          
          {isAdmin && (
            <div className="mt-4">
              <Link 
                to="/admin"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Admin
              </Link>
            </div>
          )}
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
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-green-700 uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.slice(0, 50).map((entry, index) => {
                  const position = index + 1;
                  const isTop3 = position <= 3;
                  const isTop10 = position <= 10;
                  
                  return (
                    <tr 
                      key={index} 
                      className={`${isTop3 ? 'bg-yellow-50' : ''} ${isTop10 ? 'font-semibold' : ''} hover:bg-green-50 transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`${isTop3 ? 'text-2xl' : 'text-lg'}`}>
                          {getMedal(position)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{entry.name}</div>
                        {entry.studentId && (
                          <div className="text-xs text-gray-500">{entry.studentId}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          isTop3 ? 'bg-yellow-100 text-yellow-800' : 
                          isTop10 ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {entry.bestScore || entry.score}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
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
