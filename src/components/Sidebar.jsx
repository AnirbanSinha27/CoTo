import React, { useState, useEffect, useRef } from 'react';
import { coto } from '../assets/index';
import Client from './Client';
import toast from 'react-hot-toast';
import ACTIONS from '../../server/Actions.js';
import initSocket from '../../server/socket.js';
import { useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';

const Sidebar = () => {
    const [clients, setClients] = useState([]);
    const socketRef = useRef(null);
    const { roomId } = useParams();
    const location = useLocation();
    const reactNavigator = useNavigate();
    const toastTimeoutRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', handleErrors);
            socketRef.current.on('connect_failed', handleErrors);

            function handleErrors(error) {
                console.error('Socket error', error);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // Listening for joined event
            socketRef.current.on(ACTIONS.JOINED, ({ clients: updatedClients, username, socketId }) => {
                if (username !== location.state?.username) {
                    debounceToastS(`${username} joined the room.`);
                }
                setClients(updatedClients);
            });

            // Listening for disconnected event
            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                debounceToastE(`${username} left the room.`);
                setClients(prevClients => prevClients.filter(client => client.socketId !== socketId));
            });
        };

        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
                clearTimeout(toastTimeoutRef.current);
            }
        };
    }, [location.state?.username, reactNavigator, roomId]);

    const debounceToastS = (message) => {
        clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = setTimeout(() => {
            toast.success(message);
        }, 300); // Adjust debounce time as needed
    };

    const debounceToastE = (message) => {
        clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = setTimeout(() => {
            toast.error(message);
        }, 300); // Adjust debounce time as needed
    };

    const copyRoom = () => {
        try {
            navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    };

    const handleLeave = () => {
        reactNavigator('/');
    };

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className="sidebar bg-slate-900 text-white w-52 h-full fixed py-4 px-3 flex flex-col justify-between">
            <div className="flex items-center justify-center mb-4">
                <a href="/"><img src={coto} alt="CoTo" className="w-13 h-12 mr-2" /></a>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold mb-1 text-center font-sans text-indigo-500">CoTo</h1>
                    <h6 className="text-xs text-center mb-2">Code Together</h6>
                </div>
            </div>
            <div className="border-t border-gray-400 mb-4"></div>
            <h3 className="text-sm font-semibold mb-2 ml-4">Connected</h3>
            <div className="grid grid-cols-2 gap-2 ml-4">
                {clients.map(client => (
                    <Client username={client.username} key={client.socketId} />
                ))}

            </div>
            <div className="flex flex-col items-center justify-center space-y-4 mt-auto">
                <button onClick={copyRoom} className="bg-white font-semibold text-gray-900 py-2 px-4 rounded-md hover:bg-gray-200 w-full">Copy Room Id</button>
                <button onClick={handleLeave} className="bg-indigo-600 font-semibold text-white py-2 px-4 rounded-md hover:bg-red-600 w-full">Leave</button>
            </div>
        </div>
    );
};

export default Sidebar;
