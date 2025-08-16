// Updated client/src/Admin.jsx
import React, { useState, useEffect } from 'react';
import { getGameApiUrl } from './config';

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple authentication with hardcoded credentials
    const validUsername = 'admin';
    const validPassword = 'booth2025';

    if (username === validUsername && password === validPassword) {
      setIsAuthenticated(true);
      fetchInitialData();
    } else {
      setError('Invalid username or password');
    }
    
    setLoading(false);
  };

  const fetchInitialData = async () => {
    try {
      // Fetch pending requests
      const requestsResponse = await fetch(getGameApiUrl('/api/approval/pending?staffPassword=booth2025'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setPendingRequests(requestsData);
      }
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch(getGameApiUrl('/api/approval/pending?staffPassword=booth2025'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPendingRequests(data);
      }
    } catch (err) {
      console.error('Failed to fetch pending requests:', err);
    }
  };

  const approveRequest = async (requestId) => {
    try {
      const response = await fetch(getGameApiUrl(`/api/approval/approve/${requestId}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ staffPassword: 'booth2025' })
      });

      if (response.ok) {
        fetchPendingRequests();
      } else {
        setError('Failed to approve request');
      }
    } catch (err) {
      setError('Failed to approve request');
    }
  };

  const rejectRequest = async (requestId, reason) => {
    try {
      const response = await fetch(getGameApiUrl(`/api/approval/reject/${requestId}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          staffPassword: 'booth2025',
          reason: reason || 'No reason provided'
        })
      });

      if (response.ok) {
        fetchPendingRequests();
      } else {
        setError('Failed to reject request');
      }
    } catch (err) {
      setError('Failed to reject request');
    }
  };



  useEffect(() => {
    if (isAuthenticated) {
      // Refresh data every 10 seconds
      const interval = setInterval(() => {
        fetchPendingRequests();
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#d8f3dc] via-[#b7e4c7] to-[#95d5b2] p-4">
        <div className="w-full max-w-md bg-gradient-to-br from-[#ffe8d6] to-[#fcd5ce] border-[6px] border-[#855c42] rounded-[3rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] overflow-hidden">
          <div className="flex flex-col items-center justify-center w-full h-full rounded-[2.5rem] bg-[#fffef6] p-10 border-4 border-[#b08968] shadow-inner">
            <h1 className="text-[#4a3f2a] text-3xl font-bold mb-6 text-center drop-shadow-sm">
              Booth Management Login
            </h1>
            <form onSubmit={handleLogin} className="w-full">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-4 py-3 mb-4 text-lg rounded-xl border-2 border-[#c4a484] focus:outline-none focus:ring-2 focus:ring-[#7a5e42] text-[#4a3f2a] font-medium bg-[#f9f6f0] placeholder-[#9f7e63]"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 mb-4 text-lg rounded-xl border-2 border-[#c4a484] focus:outline-none focus:ring-2 focus:ring-[#7a5e42] text-[#4a3f2a] font-medium bg-[#f9f6f0] placeholder-[#9f7e63]"
                required
              />
              {error && (
                <div className="text-red-600 text-center mb-4 px-4 py-2 bg-red-50 rounded-lg border border-red-200">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-[#fca94c] to-[#fb743f] rounded-xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d8f3dc] via-[#b7e4c7] to-[#95d5b2] p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-[#ffe8d6] to-[#fcd5ce] border-[6px] border-[#855c42] rounded-[3rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] overflow-hidden">
          <div className="rounded-[2.5rem] bg-[#fffef6] p-8 border-4 border-[#b08968] shadow-inner">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-[#4a3f2a] text-4xl font-bold drop-shadow-sm">
                Booth Management Dashboard
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-[#6b5b47] text-sm">
                  Welcome, {username}!
                </span>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Pending Approval Requests */}
            <div className="mb-8 p-6 bg-[#f9f6f0] rounded-2xl border-2 border-[#c4a484]">
              <h2 className="text-[#4a3f2a] text-2xl font-bold mb-4">
                Pending Approval Requests ({pendingRequests.length})
              </h2>
              
              {pendingRequests.length === 0 ? (
                <p className="text-[#6b5b47] text-center py-8">No pending requests</p>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.requestId}
                      className="p-4 bg-white rounded-lg border-2 border-[#c4a484] shadow-sm"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-[#4a3f2a] text-lg">
                            {request.studentName}
                          </p>
                          <p className="text-[#6b5b47] text-sm">
                            Student ID: {request.studentId}
                          </p>
                          <p className="text-[#8b7355] text-xs">
                            Requested: {new Date(request.createdAt).toLocaleTimeString()}
                          </p>
                          <p className="text-[#8b7355] text-xs">
                            Time remaining: {Math.floor(request.timeRemaining / 60000)}:{(request.timeRemaining % 60000 / 1000).toFixed(0).padStart(2, '0')}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => approveRequest(request.requestId)}
                            className="px-4 py-2 text-sm font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectRequest(request.requestId, 'Not signed up at booth')}
                            className="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

                         {/* Game Status */}
             <div className="p-6 bg-[#f9f6f0] rounded-2xl border-2 border-[#c4a484]">
               <h2 className="text-[#4a3f2a] text-2xl font-bold mb-4">Game Status</h2>
               <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                 <h3 className="text-green-800 font-bold mb-2">Game is Active</h3>
                 <p className="text-green-700 text-sm mb-2">
                   Students can scan the QR code and request access to play.
                 </p>
                 <p className="text-green-700 text-sm">
                   Approve or reject requests from the list above.
                 </p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;