import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const App = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('general');
  const [message, setMessage] = useState('');
  const [typingUser, setTypingUser] = useState(null);
  const typingTimeout = useRef(null);
  const [joined, setJoined] = useState(false);

  const joinRoom = () => {
    if (username && room) {
      socket.emit('join', { username, room });
      console.log(`${username} joined`);
      setJoined(true);
    }
  };

  const handleTyping = () => {
    socket.emit('typing', { username });
    clearTimeout(typingTimeout.current);

    console.log(`${username} is Typing`);

    typingTimeout.current = setTimeout(() => {
      socket.emit('stop_typing', { username });
      console.log(`${username} stopped typing`);
    }, 1000);
  };

  useEffect(() => {
    socket.on('typing', ({ username }) => {
      setTypingUser(username);
    });

    socket.on('stop_typing', () => {
      setTypingUser(null);
    });

    return () => {
      socket.off('typing');
      socket.off('stop_typing');
    };
  }, []);

  return (
    <div style={{ padding: 30, fontFamily: 'Arial' }}>
      {!joined ? (
        <>
          <h2>Join Chat Room</h2>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: 8, marginRight: 10 }}
          />
          <button onClick={joinRoom} style={{ padding: 8 }}>
            Join
          </button>
        </>
      ) : (
        <>
          <h3>Room: {room}</h3>
          <div style={{ marginTop: 20 }}>
            <input
              placeholder="Type your message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              style={{ padding: 8, width: 300 }}
            />
            {typingUser && (
              <p style={{ color: 'white', marginTop: 10 }}>
                {typingUser} is typing...
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
