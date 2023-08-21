import { FunnelIcon } from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react';

const Conditions = ({ selectedFile, setSelectedFile, setShowConditions, files, setFiles }) => {
  
  
    const defaultConditionsObj = {
      firstQuestionNumber: selectedFile.firstQuestionNumber,
      lastQuestionPage: selectedFile.lastQuestionPage,
    };
    
  const [conditionsObj, setConditionsObj] = useState(defaultConditionsObj);
  //const fileName = selectedFile ? selectedFile.name : '';

  useEffect(() => {

    //console.log(updatedSelectedFile);
    console.log(files);

  }, [conditionsObj]);

  function onButton() {

    const updatedSelectedFile = {
      ...selectedFile,
      firstQuestionNumber: conditionsObj.firstQuestionNumber,
      lastQuestionPage: conditionsObj.lastQuestionPage,
    };
    

    setShowConditions(false)
    updateFile(files,updatedSelectedFile);
    setSelectedFile(updatedSelectedFile); // Assuming you have a `setSelectedFile` function in your state.
  }
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setConditionsObj((prevConditions) => ({
      ...prevConditions,
      [name]: value,
    }));

  };

  const updateFile = (files, updatedFile) => {
    const indexToUpdate = files.findIndex((file) => file.key === updatedFile.key);
  
    if (indexToUpdate !== -1) {

      // const updatedFiles = [...files];
      // const fileToUpdate = updatedFiles[indexToUpdate];
  
      // // Update the properties of the existing file object
      // fileToUpdate.firstQuestionNumber = updatedFile.firstQuestionNumber;
      // fileToUpdate.lastQuestionPage = updatedFile.lastQuestionPage;
  
      // // Set the state with the updated files array
      // setFiles(updatedFiles);

      const fileToUpdate = files[indexToUpdate]
      fileToUpdate.firstQuestionNumber = updatedFile.firstQuestionNumber
      fileToUpdate.lastQuestionPage = updatedFile.lastQuestionPage

    }
    //return files;
  };


  return (
    <div>
      { selectedFile && <h1>{selectedFile.name}</h1> }
        <div className="border rounded p-4 my-4">
            <label htmlFor="firstQuestionNumber" className="block mb-2">What is the first short response question number?</label>
            <input
            type="number"
            id="firstQuestionNumber"
            name="firstQuestionNumber"
            value={conditionsObj.firstQuestionNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
            />
        </div>
        <div className="border rounded p-4 my-4">
            <label htmlFor="lastQuestionPage" className="block mb-2">What page is the last question on?</label>
            <input
            type="number"
            id="lastQuestionPage"
            name="lastQuestionPage"
            value={conditionsObj.lastQuestionPage}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
            />
        </div>

        <div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={ onButton }>OK</button>
        </div>
        
        <div className="pdf-frame">
            <iframe src={selectedFile.preview} className="pdf-iframe"></iframe>
          </div>
    </div>

);
};

export default Conditions;