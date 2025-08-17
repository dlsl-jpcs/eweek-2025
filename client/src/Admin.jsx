import React, { useState, useEffect, useCallback } from 'react';
import { getGameApiUrl } from './config';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  });
  const [error, setError] = useState('');
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const staffPassword = password;

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username === 'admin' && password === 'booth2025') {
      setIsAuthenticated(true);
      localStorage.setItem('isAdminAuthenticated', 'true');
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAdminAuthenticated');
    setUsername('');
    setPassword('');
    setPending([]);
    setActionMsg('');
  };

  const fetchPending = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const isFirstLoad = isInitialLoad;
      if (isFirstLoad) {
        setLoading(true);
      } else {
        setActionMsg('Refreshing requests...');
      }
      
      const url = getGameApiUrl('/api/approval/pending');
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffPassword: password })
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to load pending requests (${res.status})`);
      }
      
      const data = await res.json();
      setPending(prevPending => {
        // Only update if we have new data
        if (JSON.stringify(prevPending) !== JSON.stringify(data)) {
          return Array.isArray(data) ? data : [];
        }
        return prevPending;
      });
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load pending requests');
    } finally {
      if (isInitialLoad) {
        setLoading(false);
        setIsInitialLoad(false);
      } else {
        setActionMsg('');
      }
    }
  }, [isAuthenticated, staffPassword]);

  // Store the password in a ref to avoid dependency issues
  const passwordRef = useRef(password);
  useEffect(() => {
    passwordRef.current = password;
  }, [password]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Initial fetch
    fetchPending();
    
    // Set up refresh interval
    const id = setInterval(() => {
      fetchPending();
    }, 2000);
    
    return () => clearInterval(id);
  }, [isAuthenticated, isInitialLoad]); // Remove fetchPending from dependencies

  const approve = async (requestId) => {
    try {
      setActionMsg('Approving...');
      const res = await fetch(getGameApiUrl(`/api/approval/approve/${requestId}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffPassword })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Approve failed (${res.status})`);
      }
      setActionMsg('Approved');
      fetchPending();
    } catch (err) {
      setActionMsg('');
      setError(err.message || 'Approve failed');
    }
  };

  const reject = async (requestId) => {
    try {
      setActionMsg('Rejecting...');
      const res = await fetch(getGameApiUrl(`/api/approval/reject/${requestId}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffPassword, reason: 'Not eligible' })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Reject failed (${res.status})`);
      }
      setActionMsg('Rejected');
      fetchPending();
    } catch (err) {
      setActionMsg('');
      setError(err.message || 'Reject failed');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-green-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-800 mb-1">Tala Makiling</h1>
            <h2 className="text-lg text-green-700 mb-4">JPCS E-Week Booth Game 2025</h2>
            <h3 className="text-2xl font-semibold text-gray-800">Admin Login</h3>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            {error && (
              <div className="mb-4 text-red-600 text-center text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Sign In
            </button>
          </form>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Tala Makiling</h1>
          <h2 className="text-xl text-green-700">JPCS E-Week Booth Game 2025</h2>
          <h3 className="text-2xl font-semibold text-green-800 mt-6 mb-2">Admin Dashboard</h3>
          
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">

          {error && (
            <div className="mb-4 text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">{error}</div>
          )}
          <div className="flex justify-between items-center mb-4">
            {actionMsg && (
              <div className="text-blue-700 bg-blue-50 border border-blue-200 px-3 py-2 rounded flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {actionMsg}
              </div>
            )}
            <button 
              onClick={fetchPending}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
              title="Refresh requests"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Pending Approval Requests</h2>
              <p className="text-sm text-gray-500">Review and manage student access requests</p>
            </div>
            
            {loading ? (
              <div className="p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                <p className="mt-2 text-green-700">Loading requests...</p>
              </div>
            ) : pending.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No pending requests</h3>
                <p className="mt-1 text-sm text-gray-500">All caught up! Check back later for new requests.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pending.map((p) => (
                      <tr key={p.requestId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{p.studentName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{p.studentId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button 
                            onClick={() => approve(p.requestId)}
                            className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => reject(p.requestId)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 bg-green-50 border-b border-green-200">
                <h3 className="text-lg font-medium text-green-800">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button 
                    onClick={() => fetchPending()}
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-700">Refresh Requests</span>
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <Link 
                    to="/leaderboard"
                    className="block w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">View Leaderboard</span>
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
                <h3 className="text-lg font-medium text-blue-800">System Status</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Pending Requests</span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {pending.length} pending
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Last Updated</span>
                    <span className="text-sm text-gray-500">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Status</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx={4} cy={4} r={3} />
                      </svg>
                      Operational
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;