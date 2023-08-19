"use client"
import form from '@styles/form.module.scss'
import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setSelectedPDF(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle file upload here
    console.log(selectedFile);
  };

  const handleFileUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      if(!selectedFile) return; // If no file selected, return

      const response = await axios.post('./api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Handle the response from the server, e.g., display a success message
      console.log(response.data);
    } catch (error) {
      // Handle errors, e.g., display an error message
      console.error(error);
    }
    setUploading(false);
  };

  const PdfPage = () => {
    return (
      <div>
        <iframe src={selectedPDF} width="100%" height="600px"></iframe>
      </div>
    );
  };

  return (
    <div>

      {selectedPDF && <PdfPage />}

      <h1>Upload PDF</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button type="submit" onClick={() => handleFileUpload(selectedFile)}>
          Upload
        </button>
      </form>

    </div>
  );
};

export default UploadForm;
