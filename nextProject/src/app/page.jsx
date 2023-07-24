'use client'
import '@styles/globals.scss'
import home from '@styles/home.module.scss'
//import UploadForm from '@app/uploadForm'
import Dropzone from '@app/dropzone'
import AcceptedFiles from '@app/acceptedFiles'
import UploadProgress from '@app/uploadProgress'
import DisplayPdf from '@app/DisplayPDF'

import React, { useState, useEffect } from 'react';


const Home = () => {

  const [files, setFiles] = useState([]);
  const [process, setProcess] = useState('none');
  const [progress, setProgress] = useState(0);
  const [pdfURL, setPDFURL] = useState('none')
  const [displayPDF, setDisplayPDF] = useState(false)
  

  const removeFile = (key) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.key !== key));
  };

  console.log("pdfURL: " + pdfURL);

  return (
    <section className="">
      <div className={home.window}>
        <h1 className={home.header}>HSC Pastpaper Wizard</h1>
        {/* Conditional rendering for mainPdfView */}
        {displayPDF && (
          <div className={home.mainPdfView}>
            <iframe src={pdfURL} className={home.pdfIframe}></iframe>
          </div>
        )}
        <div className={home.body}>
          <UploadProgress progress={progress}/>
          <div className={home.dropzone}>
            <Dropzone className={home} files={files} setFiles={setFiles} setProcess={setProcess} setProgress={setProgress} setPDFURL={setPDFURL} setDisplayPDF={setDisplayPDF}  />
          </div>
          <div className={home.acceptedFiles}>
            <AcceptedFiles className={home} files={files} removeFile={removeFile} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home