// Configuration for different environments
const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    // Make sure this matches your server's port (default is 5000)
    return 'http://localhost:5000';
  }
  // In production, use the deployed backend URL from environment variable
  return import.meta.env.VITE_BACKEND_URL || 'https://talamakiling-server.onrender.com';
};

const baseUrl = getBaseUrl();

// Export the configuration
export const dlslApiUrl = baseUrl;
export const gameApiUrl = baseUrl;

// Helper function to get the full API URL
export const getDlslApiUrl = (endpoint) => `${dlslApiUrl}${endpoint}`;
export const getGameApiUrl = (endpoint) => `${gameApiUrl}${endpoint}`;
