import React, { useState } from 'react';
import { FiSend, FiSmile } from 'react-icons/fi';
import axios from 'axios';

const AddChat = ({ domainId, onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    const token = localStorage.getItem("userToken");
    if (!token) {
      setError("You must be logged in to send messages.");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chats`,
        {
          domainId,
          message: message.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('');
      onMessageSent();
    } catch (error) {
      console.error("Failed to send message", error);
      setError(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="space-y-3">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Message Form */}
      <form onSubmit={handleSend} className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            rows="1"
            maxLength="500"
            disabled={isLoading}
          />
          <div className="absolute bottom-2 right-2 flex items-center space-x-1">
            <button
              type="button"
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              disabled={isLoading}
            >
              <FiSmile className="h-4 w-4" />
            </button>
            <span className="text-xs text-gray-400">
              {message.length}/500
            </span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
          aria-label="Send message"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <FiSend className="h-4 w-4" />
          )}
        </button>
      </form>

      {/* Character Limit Warning */}
      {message.length > 400 && (
        <p className="text-xs text-amber-600">
          {message.length > 450 ? 'Character limit approaching!' : 'Message getting long...'}
        </p>
      )}
    </div>
  );
};

export default AddChat;
