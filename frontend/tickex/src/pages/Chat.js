import React, { useState, useEffect, useContext } from 'react';
import { useSocket } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Chat = () => {
  const { socket } = useSocket();
  const { user } = useContext(AuthContext);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [eventChats, setEventChats] = useState([]);

  useEffect(() => {
    fetchChats();
    fetchEventChats();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message) => {
        if (activeChat && (message.chatId === activeChat._id || message.eventId === activeChat._id)) {
          setMessages(prev => [...prev, message]);
        }
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [socket, activeChat]);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(data);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    }
  };

  const fetchEventChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/chat/event-chats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEventChats(data);
    } catch (error) {
      console.error('Failed to fetch event chats:', error);
    }
  };

  const fetchMessages = async (chatId, isEventChat = false) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = isEventChat ? 
        `http://localhost:5000/api/chat/event/${chatId}/messages` :
        `http://localhost:5000/api/chat/${chatId}/messages`;
      
      const { data } = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;

    try {
      const token = localStorage.getItem('token');
      const isEventChat = activeChat.type === 'event';
      
      const endpoint = isEventChat ?
        `http://localhost:5000/api/chat/event/${activeChat._id}/message` :
        `http://localhost:5000/api/chat/${activeChat._id}/message`;

      const { data } = await axios.post(endpoint, {
        content: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(prev => [...prev, data]);
      setNewMessage('');

      // Emit via socket for real-time updates
      if (socket) {
        socket.emit('sendMessage', {
          chatId: activeChat._id,
          eventId: isEventChat ? activeChat._id : null,
          content: newMessage,
          sender: user._id
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const selectChat = (chat, isEventChat = false) => {
    setActiveChat({ ...chat, type: isEventChat ? 'event' : 'direct' });
    fetchMessages(chat._id, isEventChat);
  };

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>💬 Chat</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 'var(--spacing-lg)', height: '70vh' }}>
        {/* Chat List */}
        <div className="card p-0" style={{ overflow: 'hidden' }}>
          <div className="p-lg border-bottom">
            <h3>Conversations</h3>
          </div>
          
          {/* Event Chats */}
          <div className="p-md border-bottom">
            <h4 className="text-sm text-muted mb-sm">Event Chats</h4>
            {eventChats.map(chat => (
              <div
                key={chat._id}
                className={`p-sm rounded-md cursor-pointer mb-xs ${activeChat?._id === chat._id ? 'bg-tertiary' : ''}`}
                onClick={() => selectChat(chat, true)}
                style={{ 
                  ':hover': { backgroundColor: 'var(--bg-tertiary)' },
                  backgroundColor: activeChat?._id === chat._id ? 'var(--bg-tertiary)' : 'transparent'
                }}
              >
                <div className="font-medium text-sm">{chat.title}</div>
                <div className="text-xs text-muted">{chat.participantCount} participants</div>
              </div>
            ))}
          </div>

          {/* Direct Messages */}
          <div className="p-md">
            <h4 className="text-sm text-muted mb-sm">Direct Messages</h4>
            {chats.map(chat => (
              <div
                key={chat._id}
                className={`p-sm rounded-md cursor-pointer mb-xs ${activeChat?._id === chat._id ? 'bg-tertiary' : ''}`}
                onClick={() => selectChat(chat)}
                style={{ 
                  ':hover': { backgroundColor: 'var(--bg-tertiary)' },
                  backgroundColor: activeChat?._id === chat._id ? 'var(--bg-tertiary)' : 'transparent'
                }}
              >
                <div className="font-medium text-sm">{chat.participants.find(p => p._id !== user._id)?.username}</div>
                <div className="text-xs text-muted">{chat.lastMessage?.content || 'No messages yet'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="card p-0" style={{ display: 'flex', flexDirection: 'column' }}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-lg border-bottom">
                <h3>{activeChat.type === 'event' ? activeChat.title : activeChat.participants?.find(p => p._id !== user._id)?.username}</h3>
                <p className="text-muted text-sm">
                  {activeChat.type === 'event' ? `${activeChat.participantCount} participants` : 'Direct message'}
                </p>
              </div>

              {/* Messages */}
              <div className="p-lg" style={{ flex: 1, overflowY: 'auto', maxHeight: '400px' }}>
                {messages.map(message => (
                  <div
                    key={message._id}
                    className={`mb-md ${message.sender._id === user._id ? 'text-right' : ''}`}
                  >
                    <div
                      className={`inline-block p-sm rounded-lg max-w-xs ${
                        message.sender._id === user._id
                          ? 'bg-primary text-black'
                          : 'bg-tertiary'
                      }`}
                    >
                      {message.sender._id !== user._id && (
                        <div className="text-xs text-muted mb-xs">{message.sender.username}</div>
                      )}
                      <div>{message.content}</div>
                      <div className="text-xs mt-xs opacity-70">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-lg border-top">
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    style={{ flex: 1, margin: 0 }}
                  />
                  <button className="btn-primary" onClick={sendMessage}>
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-2xl text-center">
              <div className="text-4xl mb-md">💬</div>
              <h3>Select a conversation</h3>
              <p className="text-muted">Choose a chat from the sidebar to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;