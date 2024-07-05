import React from 'react';
import Sidebar from '../components/Sidebar';
import Editor from '../components/Editor';

const EditorPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Editor />
    </div>
  );
}

export default EditorPage;

