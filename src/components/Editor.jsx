import React, { useState, useEffect,useCallback } from 'react';
import EditorPanel from './EditorPanel';
import { html1, css1, js1 } from "../assets/index";
import useLocalStorage from "../hooks/useLocalStorage";
import { useParams,useLocation } from 'react-router-dom';
import initSocket from '../../server/socket'; // Adjust the path as needed
import ACTIONS from '../../server/Actions'; // Adjust the path as needed

const Editor = () => {
  const [html, setHtml] = useLocalStorage('html', '');
  const [css, setCss] = useLocalStorage('css', '');
  const [js, setJs] = useLocalStorage('js', '');
  const [srcDoc, setSrcDoc] = useState('');
  const { roomId } = useParams();
  const location = useLocation();
  const { username } = location.state || {};
  const [socket, setSocket] = useState(null);

  const initializeSocket = useCallback(async () => {
    try {
      const socketInstance = await initSocket(); // Initialize socket.io connection
      setSocket(socketInstance);

      socketInstance.emit(ACTIONS.JOIN, { roomId, username });

      return () => {
        socketInstance.disconnect();
      };
    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }
  }, [roomId]);

  useEffect(() => {
    const cleanup = initializeSocket();
    return () => {
      if (cleanup) cleanup();
    };
  }, [initializeSocket]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
        </html>
      `);
    }, 500);

    return () => clearTimeout(timeout);
  }, [html, css, js]);

  return (
    <div className="ml-52 w-full h-screen bg-white flex flex-col">
      <div className="flex-grow flex flex-col">
        <div className="flex flex-row h-1/2">
          <div className="flex-1 h-full w-1">
            {socket && <EditorPanel language="xml" roomId={roomId} value={html} onChange={setHtml} socket={socket} image={html1} displayName={"HTML"}/>}
          </div>
          <div className="flex-1 h-full w-1">
            {socket && <EditorPanel language="css" roomId={roomId} value={css} onChange={setCss} socket={socket} image={css1} displayName={"CSS"}/>}
          </div>
          <div className="flex-1 h-full w-1">
            {socket && <EditorPanel language="javascript" roomId={roomId} value={js} onChange={setJs} socket={socket} image={js1} displayName={"JavaScript"}/>}
          </div>
        </div>
        <div className="flex-grow">
          <iframe
            srcDoc={srcDoc}
            title="output"
            sandbox="allow-scripts"
            width="100%"
            height="100%"
            frameBorder="0"
            className="w-full h-full bg-white"
          />
        </div>
      </div>
    </div>
  );
}

export default Editor;
