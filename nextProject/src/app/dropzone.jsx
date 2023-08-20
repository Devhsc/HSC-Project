'use client'
import axios from 'axios';
import Cookies from 'js-cookie';
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/solid'

const requestConfig = {
  // Increase the timeout to 60 seconds (or any other suitable value)
  timeout: 60000, // 60,000 milliseconds = 60 seconds
};

const Dropzone = ({ className, files, setFiles, setProcess, setProgress, setPDFURL, setDisplayPDF ,setSelectedFile, setShowConditions}) => {
  const [rejected, setRejected] = useState([])
  

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {

    if (acceptedFiles?.length) {
        setFiles(previousFiles => [

        // Reset uploaded flag for existing files
          ...previousFiles.map(file =>
            Object.assign(file, {
              //preview: URL.createObjectURL(file),
              uploaded: false, // Set the initial value of the uploaded property to false
            })
          ),
          ...acceptedFiles.map(file =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
              uploaded: false, // Set the initial value of the uploaded property to false
              key: Date.now().toString() + "_" + file.name,
              firstQuestionNumber: 16,
              lastQuestionPage: 10,
            })
          )
        ]);
        setSelectedFile(acceptedFiles[0]);
        setShowConditions(true);

      }

    if (rejectedFiles?.length) {
      setRejected(previousFiles => [...previousFiles, ...rejectedFiles])
    }
    
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': [] //only accept pdfs
    },
    maxSize: 1024 * 1000,
    maxFiles: 5,
    onDrop
  })

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files.forEach(file => URL.revokeObjectURL(file.preview))
  }, [files])

  const removeFile = name => {
    setFiles(files => files.filter(file => file.name !== name))
  }

  const removeAll = () => {
    setFiles([])
    setRejected([])
  }

  const removeRejected = name => {
    setRejected(files => files.filter(({ file }) => file.name !== name))
  }

  async function upload () {

    let args = ""
    //console.log(files)
    if (files.length == 0) return

    //uploading
    setProcess('uploading')
    console.log(files)
    for (const file of files) {
        // Skip files that have already been uploaded
        if (file.uploaded){
            alert('already uploaded, please wait for the server to process the files')
            return
        }
    
        // Create a new FormData instance for each file
        const formData = new FormData();
        //formData.append('file', file);
        formData.append('file', file, file.key); //rename the file to have a unique name (to allow duplicate file names)
        formData.append('key', file.key);
    
        try {
          const response = await axios.post('./api/upload', formData, {
              headers: {'Content-Type': 'multipart/form-data',},
              onUploadProgress: (progressEvent) => {
                  console.log(progressEvent)
                  const progressPercentage = Math.round(progressEvent.progress * 100);
                  setProgress(progressPercentage);
              },
              ...requestConfig,
            } 
          );

          // Handle the response from the server, e.g., display a success message
          console.log(response.data);

          // Update the file object with uploaded status
          file.uploaded = true;
      } catch (error) {
          // Handle errors, e.g., display an error message
          console.error(error);
          return
      }

      args = args + file.key + " " + file.firstQuestionNumber + " " + file.lastQuestionPage + " "

    }
    
    
}

async function process (args) {

  setProcess('processing')

  console.log(args);

  Cookies.set('args', args, { expires: 1, path: '/' });
  
  try {
    const response = await fetch('/api/process');
    if (response.ok) {
      const data = await response.json();
      console.log(data.pdfURL);
      setPDFURL(data.pdfURL);
    } else {
      // Handle other response statuses here
      console.error('PDF processing failed');
    }
  } catch (error) {
    console.error('PDF processing error:', error);
  }


};

async function uploadAction() {

  setDisplayPDF(false);
  upload().then(() => {
    // process(); // Call process after the upload is completed successfully
    // setDisplayPDF(true);
  });

}

async function processAction(){
  setDisplayPDF(false);
  const args = await upload() //arguments for runnin the python script
  process(args); // Call process after the upload is completed successfully
  setDisplayPDF(true);
}
      

  return (
    <form>
      <div
        {...getRootProps({
            className: ` ${className.gradientL} flex items-center justify-center gap-4 rounded-lg border-solid hover:animate-pulse hover:border-dashed border-2 border-violet-200 p-16`
        })}
      >
        <input {...getInputProps({ name: 'file' })} />
        <div className='flex flex-col items-center justify-center gap-4'>
          <ArrowUpTrayIcon className='h-5 w-5 fill-current' />
          <div className='opacity-20'>
            {isDragActive ? (
                <p><i>Drag & drop files here, or click to select files</i></p>
            ) : (
                <p>Drag & drop files here, or click to select files</p>
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      <section className='mt-10'>
        <div className='flex gap-4'>
          {/* <h2 className='title text-3xl font-semibold'>Preview</h2> */}
          <button
            type='button'
            onClick={removeAll}
            className='mt-1 rounded-md border border-pink-400 px-3 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-pink-400 hover:text-white'
          >
            Remove all files
          </button>
          <button
            type='button'
            onClick={() => uploadAction()}
            className='ml-auto mt-1 rounded-md border border-purple-400 px-3 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-purple-400 hover:text-white'
          >
            Upload
          </button>
          <button
            type='button'
            onClick={() => processAction()}
            className='ml-auto mt-1 rounded-md border border-blue-400 px-3 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-purple-400 hover:text-white'
          >
            process
          </button>
        </div>

      </section>
    </form>

  )
}

export default Dropzone