import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiMessageCircle } from 'react-icons/fi';
import AddChat from './AddChat';
import ChatContent from '../Chat/ChatContent';
import axios from 'axios';

const ChatDrawer = ({ open, onClose, domainId }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChats = async () => {
    if (!domainId) return;
    
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chats/${domainId}`);
      setChats(res.data);
    } catch (err) {
      console.error("Error fetching chats", err);
      setError('Failed to load chat messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && domainId) {
      fetchChats();
    }
  }, [domainId, open]);

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && !event.target.closest('.chat-drawer')) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Chat Drawer */}
      <div 
        className={`chat-drawer fixed top-0 right-0 w-full max-w-sm sm:max-w-md lg:max-w-lg h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col z-50 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <FiMessageCircle className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Discussion</h2>
              <p className="text-sm text-gray-500">Share your thoughts</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            aria-label="Close chat"
          >
            <IoMdClose className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading messages...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center">
                <div className="text-red-500 mb-2">
                  <svg className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 mb-3">{error}</p>
                <button 
                  onClick={fetchChats}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <ChatContent messages={chats || []} />
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="border-t border-gray-200 bg-white p-4">
          <AddChat domainId={domainId} onMessageSent={fetchChats} />
        </div>
      </div>
    </>
  );
};

export default ChatDrawer;
