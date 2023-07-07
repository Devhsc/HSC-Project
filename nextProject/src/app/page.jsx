'use client'
import '@styles/globals.scss'
import home from '@styles/home.module.scss'
//import UploadForm from '@app/uploadForm'
import Dropzone from '@app/dropzone'
import AcceptedFiles from '@app/acceptedFiles'
import React, { useState } from 'react';


const Home = () => {

  const [files, setFiles] = useState([]);

  const removeFile = (name) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== name));
  };

  return (
    <section className="">
      <h1 className={home.text}>HSC Pastpaper Wizard
        
      </h1>
      <div className={home.body}>
        <div className={home.dropzone}>
          <Dropzone className={home} files={files} setFiles={setFiles} />
        </div>
        <div className={home.acceptedFiles}>
          <AcceptedFiles className={home} files={files} removeFile={removeFile} />
        </div>
      </div>
    </section>
  )
}

export default Home