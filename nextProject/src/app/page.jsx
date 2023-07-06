import '@styles/globals.scss'
import home from '@styles/home.module.scss'
import UploadForm from '@app/uploadForm'
import Dropzone from '@app/Dropzone'
//import React, { useState } from 'react';


const Home = () => {
  return (
    <section className="">
      <h1 className={home.header}>HSC Pastpaper Wizard
        <br className="" />
      </h1>
      <div className={home.body}>
        {/* <UploadForm/> */}
        <Dropzone />
      </div>

    </section>
  )
}

export default Home