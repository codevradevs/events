import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Image as ImageIcon,
  Smile,
  Paperclip,
  ChevronLeft,
  Search
} from 'lucide-react';

// Mock chats data
const mockChats = [
  {
    _id: '1',
    name: 'Nairobi Gamers',
    isGroup: true,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
    lastMessage: 'Who\'s coming to the LAN party tomorrow?',
    lastMessageTime: '2 min ago',
    unread: 3,
    members: 234,
  },
  {
    _id: '2',
    name: 'DJ Tempo',
    isGroup: false,
    image: '',
    lastMessage: 'Thanks for buying tickets!',
    lastMessageTime: '1 hour ago',
    unread: 0,
    online: true,
  },
  {
    _id: '3',
    name: 'Weekend Runners',
    isGroup: true,
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400',
    lastMessage: 'Great run today everyone!',
    lastMessageTime: '3 hours ago',
    unread: 0,
    members: 189,
  },
  {
    _id: '4',
    name: 'Sarah',
    isGroup: false,
    image: '',
    lastMessage: 'See you at the concert!',
    lastMessageTime: 'Yesterday',
    unread: 1,
    online: false,
  },
  {
    _id: '5',
    name: 'Music Lovers KE',
    isGroup: true,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
    lastMessage: 'New event just dropped!',
    lastMessageTime: '2 days ago',
    unread: 0,
    members: 567,
  },
];

// Mock messages
const mockMessages = [
  { _id: '1', sender: 'them', text: 'Hey! How are you?', time: '10:00 AM' },
  { _id: '2', sender: 'me', text: 'I\'m good! Excited for the event this weekend?', time: '10:05 AM' },
  { _id: '3', sender: 'them', text: 'Absolutely! Can\'t wait. Did you get your tickets?', time: '10:06 AM' },
  { _id: '4', sender: 'me', text: 'Yes, got them yesterday! VIP section 🎉', time: '10:08 AM' },
  { _id: '5', sender: 'them', text: 'Nice! See you there!', time: '10:10 AM' },
];

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  // const { user } = useAuthStore();
  const [selectedChat, setSelectedChat] = useState(id || null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = mockChats.find(c => c._id === selectedChat);

  const filteredChats = mockChats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      _id: Date.now().toString(),
      sender: 'me',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  // Mobile view - show chat list or chat detail
  if (!selectedChat) {
    return (
      <div className="min-h-screen pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-white mb-6">Messages</h1>
          
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#141419] border-white/10 text-white placeholder:text-[#A1A1AA] h-12"
            />
          </div>

          {/* Chat List */}
          <div className="space-y-2">
            {filteredChats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat._id)}
                className="flex items-center space-x-4 p-4 bg-[#141419] border border-white/10 rounded-xl cursor-pointer hover:border-[#B6FF2E]/30 transition-colors"
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={chat.image} />
                    <AvatarFallback className="bg-[#B6FF2E] text-[#07070A]">
                      {chat.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {!chat.isGroup && chat.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#141419]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white truncate">{chat.name}</h3>
                    <span className="text-xs text-[#A1A1AA]">{chat.lastMessageTime}</span>
                  </div>
                  <p className="text-sm text-[#A1A1AA] truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 bg-[#B6FF2E] rounded-full flex items-center justify-center">
                    <span className="text-xs text-[#07070A] font-bold">{chat.unread}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 bg-[#141419] border border-white/10 rounded-t-2xl">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSelectedChat(null)}
              className="lg:hidden text-[#A1A1AA] hover:text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={activeChat?.image} />
                <AvatarFallback className="bg-[#B6FF2E] text-[#07070A]">
                  {activeChat?.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!activeChat?.isGroup && activeChat?.online && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#141419]" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">{activeChat?.name}</h3>
              <p className="text-xs text-[#A1A1AA]">
                {activeChat?.isGroup 
                  ? `${activeChat.members} members` 
                  : activeChat?.online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-[#A1A1AA] hover:text-white">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-[#A1A1AA] hover:text-white">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-[#A1A1AA] hover:text-white">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-[#07070A] border-x border-white/10 min-h-[400px] max-h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                  msg.sender === 'me'
                    ? 'bg-[#B6FF2E] text-[#07070A] rounded-br-none'
                    : 'bg-[#141419] text-white rounded-bl-none'
                }`}
              >
                <p>{msg.text}</p>
                <span className={`text-xs ${msg.sender === 'me' ? 'text-[#07070A]/60' : 'text-[#A1A1AA]'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form 
          onSubmit={sendMessage}
          className="flex items-center space-x-2 p-4 bg-[#141419] border border-white/10 rounded-b-2xl"
        >
          <button type="button" className="p-2 text-[#A1A1AA] hover:text-white">
            <Paperclip className="w-5 h-5" />
          </button>
          <button type="button" className="p-2 text-[#A1A1AA] hover:text-white">
            <ImageIcon className="w-5 h-5" />
          </button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[#07070A] border-white/10 text-white placeholder:text-[#A1A1AA]"
          />
          <button type="button" className="p-2 text-[#A1A1AA] hover:text-white">
            <Smile className="w-5 h-5" />
          </button>
          <Button 
            type="submit"
            className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90 px-4"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}