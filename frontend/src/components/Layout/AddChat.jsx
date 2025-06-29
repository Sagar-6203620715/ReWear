import React, { useState } from 'react';
import axios from 'axios';

const AddChat = ({ domainId, onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('anonymous');

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chats`, {
        domainId,
        user,
        message,
      });
      setMessage('');
      onMessageSent();  // Notify parent to refresh messages
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        className="flex-1 border rounded p-2"
        placeholder="Type your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">
        Send
      </button>
    </div>
  );
};


export default AddChat;
