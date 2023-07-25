import React from 'react';
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/solid'

const AcceptedFilesWindow = ({ className, files, removeFile }) => {
  return (
        <div className='mt-6'>
            <h3 className='title mt-10 border-b pb-3 text-lg font-semibold text-stone-600 text-center'>
            Accepted Files
            </h3>
                <div className='overflow-auto'>
                {/* <hr className={`mt-1 ${className.underline}`} /> */}
                <ul className='mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
                {files.map(file => (
                    <li key={file.key} className='relative h-32 w-32 rounded-md shadow-lg'>
                        <div className='h-full w-full rounded-md object-contain'>
                            <iframe src={`${file.preview}#page=1`} width="100%" height="600px"></iframe>
                        </div>
                    <button
                        type='button'
                        className='absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full border border-rose-400 bg-rose-400 transition-colors hover:bg-white'
                        onClick={() => removeFile(file.key)}
                    >
                        <XMarkIcon className='h-5 w-5 fill-white transition-colors hover:fill-rose-400' />
                    </button>
                    <p className='mt-2 text-[12px] font-medium text-stone-500'>
                        {file.key}
                    </p>
                    </li>

                ))}
                </ul>
            </div>
        </div>
  )
}

export default AcceptedFilesWindow;