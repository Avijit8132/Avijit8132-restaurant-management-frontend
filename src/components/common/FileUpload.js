import React, { useState, useRef } from "react";
function FileUpload({ handleFile }) {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const buttonref = useRef();
  function handleMultipleChange(event) {
    setFiles([...event.target.files]);
    handleFile([event.target.files]);
  }

  function handleMultipleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
  }

  return (
    <div className="App">
      <button
        for="files"
        style={{ margin: "14px" }}
        onClick={() => buttonref.current.click()}
      >
        Attach File
      </button>
      <input
        type="file"
        style={{ visibility: "hidden" }}
        ref={buttonref}
        multiple
        onChange={handleMultipleChange}
      />
      {/* {uploadedFiles.map((file, index) => (
        <img key={index} src={file} alt={`Uploaded content ${index}`} />
      ))} */}
    </div>
  );
}

export default FileUpload;
