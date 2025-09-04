// API Configuration for ReWear
// This handles both monorepo deployment (relative URLs) and separate deployment (environment variables)

const getBackendUrl = () => {
  // For monorepo deployment, use relative URL
  // For separate deployment, use environment variable
  return import.meta.env.VITE_BACKEND_URL || '/api';
};

export const API_BASE_URL = getBackendUrl();

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  HEALTH: buildApiUrl('health'),
  USERS: {
    PROFILE: buildApiUrl('users/profile'),
    DASHBOARD: buildApiUrl('users/dashboard'),
    BY_ID: (id) => buildApiUrl(`users/${id}`),
  },
  ITEMS: {
    ALL: buildApiUrl('items'),
    BY_ID: (id) => buildApiUrl(`items/${id}`),
    USER_ITEMS: (userId) => buildApiUrl(`items/user/${userId}`),
  },
  ADMIN: {
    DASHBOARD: buildApiUrl('admin/dashboard'),
    USERS: buildApiUrl('admin/users'),
    ITEMS: buildApiUrl('admin/items'),
    SWAPS: buildApiUrl('admin/swaps'),
    ANALYTICS: buildApiUrl('admin/analytics'),
    USER_ACTION: (userId, action) => buildApiUrl(`admin/users/${userId}/${action}`),
    ITEM_ACTION: (itemId, action) => buildApiUrl(`admin/items/${itemId}/${action}`),
    SWAP_ACTION: (swapId, action) => buildApiUrl(`admin/swaps/${swapId}/${action}`),
  },
  UPLOAD: buildApiUrl('upload'),
  SWAPS: buildApiUrl('swaps'),
  SUBSCRIBERS: buildApiUrl('subscribers'),
};
