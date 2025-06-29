import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import AddChat from './AddChat';
import ChatContent from '../Chat/ChatContent';
import axios from 'axios';

const ChatDrawer = ({ open, onClose, domainId }) => {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chats/${domainId}`);
      setChats(res.data);
    } catch (err) {
      console.error("Error fetching chats", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchChats();
    }
  }, [domainId, open]);

  return (
    <div className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-1/4 h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h2 className="text-lg font-semibold text-gray-800">DISCUSSION</h2>
        <button onClick={onClose} aria-label="Close Chat">
          <IoMdClose className="h-6 w-6 text-gray-600 hover:text-gray-800" />
        </button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <ChatContent chats={chats} />
      </div>

      {/* Input box */}
      <div className="p-4 bg-white border-t">
        <AddChat domainId={domainId} onMessageSent={fetchChats} />
      </div>
    </div>
  );
};

export default ChatDrawer;
