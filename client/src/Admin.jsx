import React, { useState, useEffect, useCallback } from 'react';
import { getGameApiUrl } from './config';

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  const staffPassword = password; // reuse the same password for API auth

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username === 'admin' && password === 'booth2025') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setPending([]);
    setActionMsg('');
  };

  const fetchPending = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const url = getGameApiUrl(`/api/approval/pending?staffPassword=${encodeURIComponent(staffPassword || '')}`);
      const res = await fetch(url);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to load pending requests (${res.status})`);
      }
      const data = await res.json();
      setPending(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load pending requests');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, staffPassword]);

  useEffect(() => {
    if (!isAuthenticated) return;
    // initial fetch
    fetchPending();
    // poll every 2s
    const id = setInterval(fetchPending, 2000);
    return () => clearInterval(id);
  }, [isAuthenticated, fetchPending]);

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

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-green-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Booth Management Login
          </h1>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
          </form>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Username: admin</p>
            <p>Password: booth2025</p>
          </div>
        </div>
      </div>
    );
  }

  // Show admin dashboard if authenticated
  return (
    <div className="min-h-screen bg-green-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Booth Management Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>

          {error && (
            <div className="mb-4 text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">{error}</div>
          )}
          {actionMsg && (
            <div className="mb-4 text-blue-700 bg-blue-50 border border-blue-200 px-3 py-2 rounded">{actionMsg}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">Pending Requests</h2>
              {loading && <div className="text-blue-700">Loading…</div>}
              {!loading && pending.length === 0 && (
                <div className="text-blue-700">No pending requests.</div>
              )}
              <ul className="space-y-3">
                {pending.map((p) => (
                  <li key={p.requestId} className="bg-white border border-blue-200 rounded p-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">{p.studentName}</div>
                      <div className="text-sm text-gray-600">ID: {p.studentId}</div>
                    </div>
                    <div className="space-x-2">
                      <button onClick={() => approve(p.requestId)} className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600">Approve</button>
                      <button onClick={() => reject(p.requestId)} className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600">Reject</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Admin Access</h2>
              <p className="text-green-700">You are logged in as an administrator.</p>
            </div>
          </div>

          <div className="mt-6 bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">System Information</h2>
            <div className="space-y-2 text-purple-700">
              <p>• Frontend: React + Vite</p>
              <p>• Backend: Node.js + Express</p>
              <p>• Database: MongoDB Atlas</p>
              <p>• Deployment: Render</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;