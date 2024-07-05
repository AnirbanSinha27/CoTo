import React, { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/addon/fold/foldgutter.css';
import { Controlled as ControlledEditor } from 'react-codemirror2';
import ACTIONS from '../../server/Actions'; // Adjust the path as needed
import  {debounce,throttle} from 'lodash';

const EditorPanel = ({ language, displayName, value, image, onChange, socket }) => {
  const editorRef = useRef(null);
  const { roomId } = useParams(); // Get roomId from params

  useEffect(() => {
    const handleCodeChange = ({ code, language: codeLanguage }) => {
      if (codeLanguage === language && editorRef.current) {
        const editorInstance = editorRef.current.editor;
        const currentCode = editorInstance.getValue();

        // Update editor content only if received code is different
        if (code !== currentCode) {
          editorInstance.setValue(code);
        }
      }
    };

    if (socket) {
      socket.on(ACTIONS.CODE_CHANGE, handleCodeChange);
    }

    return () => {
      if (socket) {
        socket.off(ACTIONS.CODE_CHANGE, handleCodeChange);
      }
    };
  }, [socket, language]);

  // const handleChange = (editor, data, value) => {
  //   onChange(value); // Update local state

  //   if (socket) {
  //     socket.emit(ACTIONS.CODE_CHANGE, {
  //       roomId: roomId,
  //       code: value,
  //       language: language, // Send the language to identify the editor
  //     });
  //   }
  // };

  const throttledEmitChange = useRef(throttle((value) => {
    if (socket) {
      socket.emit(ACTIONS.CODE_CHANGE, {
        roomId: roomId,
        code: value,
        language: language,
      });
    }
  }, 500)).current;

  const debouncedHandleChange = useRef(debounce((editor, data, value) => {
    onChange(value); // Update local state
    throttledEmitChange(value);
  }, 500)).current;

  return (
    <div className="flex-grow flex flex-col p-2 bg-gray-800 h-full">
      <div className="flex justify-between  items-center bg-gray-900 text-white p-2 pl-5 rounded-t-md font-serif">
        <span>{displayName}</span>
        <img src={image} alt={displayName} className="h-7 w-9" />
      </div>
      <div className="flex-grow overflow-hidden">
        <ControlledEditor
          ref={editorRef}
          className="h-full editor-container"
          onBeforeChange={(editor, data, value) => {
            onChange(value); // Update local state
          }}
          onChange={debouncedHandleChange} // Emit socket event
          value={value}
          options={{
            lineWrapping: true,
            lint: true,
            mode: language,
            theme: 'material', // Change theme
            lineNumbers: true,
            foldGutter: true, // Enable code folding
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"], // Add gutters
            matchBrackets: true, // Highlight matching brackets
            autoCloseBrackets: true, // Auto close brackets
          }}
        />
      </div>
    </div>
  );
};

export default EditorPanel;
