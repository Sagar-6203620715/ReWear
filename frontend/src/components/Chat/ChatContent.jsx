import React, { useEffect, useRef } from 'react';

const ChatContent = ({ chats }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  return (
    <div className="p-4 space-y-4">
      {chats.map((chat, index) => (
        <div key={index} className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gray-500 text-white flex items-center justify-center rounded-full font-semibold">
            {chat.user.charAt(0).toUpperCase()}
          </div>
          <div className="bg-gray-100 p-3 rounded-lg shadow-sm max-w-md">
            <div className="text-sm font-semibold text-gray-700">{chat.user}</div>
            <div className="text-base text-gray-800">{chat.message}</div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatContent;
