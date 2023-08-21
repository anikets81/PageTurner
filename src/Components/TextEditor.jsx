import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ onChange, height }) => {
  const [value, setValue] = useState("");

  const handleTextEditorChange = (editorvalue) => {
    setValue(editorvalue);
    onChange(editorvalue);
  };

  return (
    <ReactQuill
      style={{ height: height }}
      theme="snow"
      value={value}
      onChange={handleTextEditorChange}
    />
  );
};

export default TextEditor;
