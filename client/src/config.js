// Configuration for different environments
const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }
  // In production, use the current domain
  return window.location.origin;
};

const baseUrl = getBaseUrl();

// Export the configuration
export const dlslApiUrl = baseUrl;
export const gameApiUrl = baseUrl;

// Helper function to get the full API URL
export const getDlslApiUrl = (endpoint) => `${dlslApiUrl}${endpoint}`;
export const getGameApiUrl = (endpoint) => `${gameApiUrl}${endpoint}`;