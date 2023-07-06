import home from '@styles/home.module.scss'
import UploadForm from '@app/uploadForm'
//import React, { useState } from 'react';


const Home = () => {
  return (
    <section className="">
      <h1 className={home.header}>HSC Pastpaper Wizard
        <br className="" />
      </h1>
      <div className={home.body}>
        <UploadForm/>
      </div>

    </section>
  )
}

export default Home