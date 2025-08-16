// Configuration for different environments
const config = {
  development: {
    dlslApiUrl: 'http://localhost:5000', // Same as game server
    gameApiUrl: 'http://localhost:5000'
  },
  production: {
    dlslApiUrl: 'https://your-game-render-url.onrender.com', // Same as game server
    gameApiUrl: 'https://your-game-render-url.onrender.com'
  }
};

// Get current environment
const env = import.meta.env.MODE || 'development';

// Export the appropriate config
export const { dlslApiUrl, gameApiUrl } = config[env];

// Helper function to get the full API URL
export const getDlslApiUrl = (endpoint) => `${dlslApiUrl}${endpoint}`;
export const getGameApiUrl = (endpoint) => `${gameApiUrl}${endpoint}`;
