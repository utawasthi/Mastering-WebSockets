import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [username , setUsername] = useState('');
  const [inputName , setInputName] = useState('');
  const [usersCount , setUsersCount] = useState(0);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('chat_message' , (data) => {
      setChat((prev) => [...prev , data]);
    });

    socketRef.current.on('users_count' , (count) => {
      setUsersCount(count);
    });

    // Clean up the socket connection on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socketRef.current.emit('send_message', { message });
      setMessage('');
    }
  };

  const handleJoin = () => {
    if(inputName.trim()){
      setUsername(inputName);
      socketRef.current.emit('join' , inputName);
    }
  }

   return (
    <div style={{ padding: 20 }}>
      <h2>🗨️ Real Time Chat</h2>
      <p>👥 Online Users: {usersCount}</p>

      {!username ? (
        <>
          <input
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Enter your name"
          />
          <button onClick={handleJoin}>Join</button>
        </>
      ) : (
        <>
          <div style={{ maxHeight: '300px', overflowY: 'auto', margin: '10px 0', border: '1px solid #ccc', padding: 10 }}>
            {chat.map((msg, idx) => (
              <p key={idx}>
                <strong>{msg.sender}:</strong> {msg.message}
              </p>
            ))}
          </div>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
          />
          <button onClick={sendMessage}>Send</button>
        </>
      )}
    </div>
  );
}

export default App;
