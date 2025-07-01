import React from 'react';

const NotAuthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Not Authorized</h1>
      <p className="text-gray-700">You do not have permission to access this page.</p>
    </div>
  </div>
);

export default NotAuthorized; 