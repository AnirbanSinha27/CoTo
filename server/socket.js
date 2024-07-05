import { io } from 'socket.io-client';

let socket = null;

export const initSocket = async () => {
    if (!socket) {
        const options = {
            reconnectionAttempts: Infinity,
            timeout: 10000,
            transports: ['websocket'],
        };
        socket = io(import.meta.env.VITE_BACKEND_URL, options);

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    }

    return socket;
};
export default initSocket;