import React, { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FiUser } from 'react-icons/fi';

const socket = io(import.meta.env.VITE_BACKEND_URL);

const ChatContent = ({ messages = [] }) => {
  const messagesEndRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const currentUserId = userInfo?._id;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDisplayName = (chat) => {
    if (!chat.user) return 'Anonymous';
    
    if (typeof chat.user === 'string') {
      return chat.user.charAt(0).toUpperCase() + chat.user.slice(1);
    } else if (typeof chat.user === 'object' && chat.user.name) {
      return chat.user.name;
    }
    
    return 'Anonymous';
  };

  const getInitials = (chat) => {
    const name = getDisplayName(chat);
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const isCurrentUser = (chat) => {
    if (!chat.user) return false;
    
    if (typeof chat.user === 'string') {
      return chat.user === currentUserId;
    } else if (typeof chat.user === 'object' && chat.user._id) {
      return chat.user._id === currentUserId;
    }
    
    return false;
  };

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <FiUser className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
          <p className="text-gray-500 text-sm">
            Be the first to start the conversation!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {messages.map((chat, index) => {
        const isOwnMessage = isCurrentUser(chat);
        const displayName = getDisplayName(chat);
        const initials = getInitials(chat);
        const messageTime = formatTime(chat.createdAt || chat.timestamp);

        return (
          <div 
            key={chat._id || index} 
            className={`flex items-start space-x-3 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              isOwnMessage 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-300 text-gray-700'
            }`}>
              {initials || '?'}
            </div>

            {/* Message Bubble */}
            <div className={`flex-1 max-w-xs sm:max-w-md lg:max-w-lg ${isOwnMessage ? 'text-right' : ''}`}>
              <div className={`inline-block p-3 rounded-2xl shadow-sm ${
                isOwnMessage 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                {/* Message Header */}
                <div className={`flex items-center justify-between mb-1 ${
                  isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <span className="text-xs font-medium">
                    {isOwnMessage ? 'You' : displayName}
                  </span>
                  {messageTime && (
                    <span className="text-xs">
                      {messageTime}
                    </span>
                  )}
                </div>

                {/* Message Content */}
                <div className="text-sm leading-relaxed break-words">
                  {chat.message}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContent;
