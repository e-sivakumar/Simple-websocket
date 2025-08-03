// client/src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000'); // make sure backend runs here

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, { type: 'server', text: data }]);
    });
   

    return () => socket.off('receive_message');
  }, []);


  const sendMessage = () => {
    if (message.trim() === '') return;

    socket.emit('send_message', message);
    setChat((prev) => [...prev, { type: 'client', text: message }]);
    setMessage('');
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="container h-[100%] w-[100%] max-w-[1280px] ">
      <div className=' pl-4 h-[10%] bg-gray-700 w-auto flex flex-row'>
<img className='w-auto h-[90%] rounded-full cursor-pointer bg-slate-100' src="/user-icon.png" alt="" />
      <h2 className='text-left w-auto font-semibold text-xl pl-5 pt-3 text-white'>Me</h2>
     {/* {topMessage.length>0 && (<p className='text-white'>{topMessage}</p>)} */}
     </div>
     <div className='relative flex flex-col h-[90%] w-[100%] ' >

      <div className="chat-box h-[100%] p-[10px] pb-[100px]  box-border ">
        {chat.map((msg, i) => (
          <div key={i} className={`message ${msg.type}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-fader"></div>
      <div className="input-container absolute bottom-5 flex justify-center items-center mx-auto w-[100%] ">
        <div className='w-[90%] flex items-center gap-2 '>
        <input
        autoFocus
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleEnter}
        />
        <button className='rounded-full p-2 text-white flex justify-center items-center' onClick={sendMessage}>
          <svg viewBox="0 0 24 24" height="24" width="24"  fill="none"><title>wds-ic-send-filled</title><path d="M5.4 19.425C5.06667 19.5583 4.75 19.5291 4.45 19.3375C4.15 19.1458 4 18.8666 4 18.5V14L12 12L4 9.99997V5.49997C4 5.1333 4.15 4.85414 4.45 4.66247C4.75 4.4708 5.06667 4.44164 5.4 4.57497L20.8 11.075C21.2167 11.2583 21.425 11.5666 21.425 12C21.425 12.4333 21.2167 12.7416 20.8 12.925L5.4 19.425Z" fill="white"></path></svg>
          </button>
      </div>
      </div>
     </div>

    </div>
  );
}

export default App;
