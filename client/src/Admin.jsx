import React, { useState } from 'react';

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                Game Status
              </h2>
              <p className="text-blue-700">
                The booth game is currently active and accepting players.
              </p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h2 className="text-xl font-semibold text-green-800 mb-4">
                Admin Access
              </h2>
              <p className="text-green-700">
                You are logged in as an administrator.
              </p>
            </div>
          </div>
          
          <div className="mt-6 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h2 className="text-xl font-semibold text-yellow-800 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <p className="text-yellow-700">• Monitor game activity</p>
              <p className="text-yellow-700">• View player statistics</p>
              <p className="text-yellow-700">• Manage booth settings</p>
            </div>
          </div>
          
          <div className="mt-6 bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">
              System Information
            </h2>
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