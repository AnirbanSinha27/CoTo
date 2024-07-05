import React, { useState } from 'react';
import { coto } from '../assets';
import { v4 } from 'uuid';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (!roomId || !username) {
      toast.error("Room ID and Username is required!");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: {
        username,
      }
    })
  };

  const createRoom = (e) => {
    e.preventDefault();
    const id = v4();
    setRoomId(id);
    toast.success("Created a new room");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="bg-slate-800 p-8 pt-5 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center mb-4 justify-center mr-10">
          <a href="/"><img src={coto} alt="CoTo" className="w-13 h-12 mr-2" /></a>
          <div>
            <h1 className="text-5xl font-bold mb-2 text-center pt-5 font-sans text-indigo-500">CoTo</h1>
            <h6 className="pb-2 text-white text-xs text-center mr-5 font-semibold">Code Together</h6>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="roomId" className="block text-sm font-medium text-gray-300">Room ID</label>
          <input
            type="text"
            id="roomId"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter Room ID"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter Username"
          />
        </div>
        <button
          onClick={handleJoinRoom}
          className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Join Room
        </button>
        <div className="mt-4 text-center">
          <a href="/" onClick={createRoom} className="text-indigo-600 hover:underline">Don't have a room? Create one</a>
        </div>
      </div>
      <div className="fixed bottom-2 text-gray-300 text-xs text-center w-full">
        <h6>© Built by <a href="https://www.github.com/AnirbanSinha27" className="hover:underline text-indigo-500">Anirban Sinha</a></h6>
      </div>
    </div>
  );
};

export default HomePage;
