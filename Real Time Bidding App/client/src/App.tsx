import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";


interface BidMessage {
  username : string;
  amount : number;
}

const socket: Socket = io('http://localhost:3000');

const App : React.FC = () => {
  
  const [username , setUsername] = useState('');
  const [amount , setAmount] = useState(0);
  const [bidInput , setBidInput] = useState(0);
  const [joined , setJoined] = useState(false);
  const [message , setMessage] = useState('');

  useEffect(() => {
    socket.on('current_bid' , ({username , amount} : BidMessage) => {
      setAmount(amount);
      setUsername(username);
      setMessage(`${username} placed the highest bid of ${amount}`);
    });

    socket.on('bid_update' , ({username , amount} : BidMessage) => {
      setAmount(amount);
      setUsername(username);
      setMessage(`${username} placed the highest bid of amount ${amount}`)
    })

    socket.on('bid_rejected' , ({message} : {message : string}) => {
      setMessage(`Bid Rejected : ${message}`);
    });

    return () => {
      socket.off('current_bid');
      socket.off('bid_update');
      socket.off('bid_rejected');
    };
  } , []);

  const handleJoin = () => {
    if(username.trim()){
      setJoined(true);
    }
  };

  const handleBid = () => {
    socket.emit('new_bid' , {
      username,
      amount : bidInput,
    })
  }

  return (
    <div style = {{padding : 30 , fontFamily : 'sans-serif'}}>
      {
        !joined ? (
          <div>
            <h2>Enter Your Name</h2>
            <input
              placeholder = "Your Name" 
              value = {username}
              onChange = {(e) => setUsername(e.target.value)}
              style = {{padding : 8 , marginRight : 10}}  
            />

            <button onClick = {handleJoin} style = {{padding : 8 }}>
              Join Auction
            </button>
          </div>
        ) : (
          <div>
            <h2>Welcome , {username}</h2>
            <h3>
              Current Highest Bid : ${amount} by {username || '---'} 
            </h3>
            <input
              type = 'number'
              placeholder = "Enter your bid"
              value = {bidInput}
              onChange = {(e) => setBidInput(Number(e.target.value))}
              style = {{padding : 8 , marginRight : 11}}
            />
            <button onClick = {handleBid} style = {{padding : 8}}>
              Place Bid
            </button>
            {message && <p style = {{marginTop : 20}}>{message}</p>}
          </div>
        )
      }
    </div>
  )
}

export default App