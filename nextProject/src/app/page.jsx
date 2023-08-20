'use client'
import '@styles/globals.scss'
import home from '@styles/home.module.scss'
import popup from '@styles/popup.module.scss'

//import UploadForm from '@app/uploadForm'
import Dropzone from '@app/dropzone'
import AcceptedFiles from '@app/acceptedFiles'
import UploadProgress from '@app/uploadProgress'
import Conditions from '@app/conditions'


import React, { useState, useEffect } from 'react';


const Home = () => {

  const [files, setFiles] = useState([]);
  const [process, setProcess] = useState('none');
  const [progress, setProgress] = useState(0);
  const [pdfURL, setPDFURL] = useState('none')
  const [displayPDF, setDisplayPDF] = useState(false)
  const [showConditions, setShowConditions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // New state for selected file
  

  const removeFile = (key) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.key !== key));
  };

  console.log("pdfURL: " + pdfURL);

  return (
    <section className="">
      <div className={home.window}>
        <h1 className={home.header}> Auto Q Exam Papers </h1>
        {/* Conditional rendering for mainPdfView */}
        {pdfURL !== 'none' && displayPDF && (
          <div className={home.mainPdfView}>
            <iframe src={pdfURL} className={home.pdfIframe}></iframe>
          </div>
        )}
        {showConditions == true && (
          <div className={popup.popup}>
            <Conditions className={popup.content} selectedFile={selectedFile} setSelectedFile={setSelectedFile} setShowConditions={setShowConditions} files={files} setFiles={setFiles}/>
          </div>
        )}
        <div className={home.body}>
          {/* <UploadProgress progress={progress}/> */}
          <div className={home.dropzone}>
            <Dropzone className={home} files={files} setFiles={setFiles} setProcess={setProcess} setProgress={setProgress} setPDFURL={setPDFURL} setDisplayPDF={setDisplayPDF} setSelectedFile={setSelectedFile} setShowConditions={setShowConditions} />
          </div>
          <div className={home.acceptedFiles}>
            <AcceptedFiles className={home} files={files} removeFile={removeFile} setSelectedFile={setSelectedFile} setShowConditions={setShowConditions}/>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home