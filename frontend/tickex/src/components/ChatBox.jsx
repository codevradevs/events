import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';

export default function ChatBox({ roomId, token }) {
  const { messages, send } = useChat(roomId, token);
  const [text, setText] = useState('');
  
  return (
    <div>
      <div style={{ maxHeight: 300, overflow: 'auto' }}>
        {messages.map(m => <div key={m._id}><strong>{m.sender}</strong>: {m.text}</div>)}
      </div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => { send(text); setText(''); }}>Send</button>
    </div>
  );
}
