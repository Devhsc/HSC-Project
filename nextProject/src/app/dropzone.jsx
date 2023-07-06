'use client'
import axios from 'axios';
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/solid'

const Dropzone = ({ className }) => {
  const [files, setFiles] = useState([])
  const [rejected, setRejected] = useState([])
  //const [selectedPDF, setSelectedPDF] = useState(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {

    console.log(acceptedFiles)

    if (acceptedFiles?.length) {
        setFiles(previousFiles => [
        //if allowing multiple files
          ...previousFiles,
          ...acceptedFiles.map(file =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
              uploaded: false, // Set the initial value of the uploaded property to false
            })
          )
        ]);
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


async function action() {
    //if (!files) return

    for (const file of files) {
        // Skip files that have already been uploaded
        if (file.uploaded) continue;
    
        // Create a new FormData instance for each file
        const formData = new FormData();
        formData.append('file', file);
    
        try {
        const response = await axios.post('./api/upload', formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
    
        // Handle the response from the server, e.g., display a success message
        console.log(response.data);
    
        // Update the file object with uploaded status
        file.uploaded = true;
        } catch (error) {
        // Handle errors, e.g., display an error message
        console.error(error);
        }
    }
}
      

  return (
    <form>
      <div
        {...getRootProps({
          className: className
        })}
      >
        <input {...getInputProps({ name: 'file' })} />
        <div className='flex flex-col items-center justify-center gap-4'>
          <ArrowUpTrayIcon className='h-5 w-5 fill-current' />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag & drop files here, or click to select files</p>
          )}
        </div>
      </div>

      {/* Preview */}
      <section className='mt-10'>
        <div className='flex gap-4'>
          <h2 className='title text-3xl font-semibold'>Preview</h2>
          <button
            type='button'
            onClick={removeAll}
            className='mt-1 rounded-md border border-rose-400 px-3 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-rose-400 hover:text-white'
          >
            Remove all files
          </button>
          <button
            type='button'
            onClick={() => action()}
            className='ml-auto mt-1 rounded-md border border-purple-400 px-3 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-purple-400 hover:text-white'
          >
            Upload
          </button>
        </div>

        {/* Accepted files */}
        <h3 className='title mt-10 border-b pb-3 text-lg font-semibold text-stone-600'>
          Accepted Files
        </h3>
        <ul className='mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
          {files.map(file => (
            <li key={file.name} className='relative h-32 rounded-md shadow-lg'>
              {/* <Image
                src={file.preview}
                alt={file.name}
                width={100}
                height={100}
                onLoad={() => {
                  URL.revokeObjectURL(file.preview)
                }}
                className='h-full w-full rounded-md object-contain'
              /> */}
            <div className='h-full w-full rounded-md object-contain'>
                <iframe src={`${file.preview}#page=1`} width="100%" height="600px"></iframe>
            </div>
              <button
                type='button'
                className='absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full border border-rose-400 bg-rose-400 transition-colors hover:bg-white'
                onClick={() => removeFile(file.name)}
              >
                <XMarkIcon className='h-5 w-5 fill-white transition-colors hover:fill-rose-400' />
              </button>
              <p className='mt-2 text-[12px] font-medium text-stone-500'>
                {file.name}
              </p>
            </li>

          ))}
        </ul>

        {/* Rejected Files
        <h3 className='title mt-24 border-b pb-3 text-lg font-semibold text-stone-600'>
          Rejected Files
        </h3>
        <ul className='mt-6 flex flex-col'>
          {rejected.map(({ file, errors }) => (
            <li key={file.name} className='flex items-start justify-between'>
              <div>
                <p className='mt-2 text-sm font-medium text-stone-500'>
                  {file.name}
                </p>
                <ul className='text-[12px] text-red-400'>
                  {errors.map(error => (
                    <li key={error.code}>{error.message}</li>
                  ))}
                </ul>
              </div>
              <button
                type='button'
                className='mt-1 rounded-md border border-rose-400 px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-rose-400 hover:text-white'
                onClick={() => removeRejected(file.name)}
              >
                remove
              </button>
            </li>
          ))}
        </ul> */}
      </section>
    </form>
  )
}

export default Dropzone