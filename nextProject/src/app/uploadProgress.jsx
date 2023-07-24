'use client'

import ProgressBar from 'react-bootstrap/ProgressBar';


const UploadProgress = ({process, progress}) => {

  return (
    //heading with process variable
    <div>
      <h1>{process}</h1>
      <ProgressBar animated now={progress} label={`${progress}%`} />
    </div>
  );
};

export default UploadProgress;