import React, { useState, useEffect } from 'react';

const Conditions = ({ selectedFile, setSelectedFile, setShowConditions, files, setFiles }) => {
  
  
    const defaultConditionsObj = {
      firstQuestionNumber: selectedFile.firstQuestionNumber,
      lastQuestionPage: selectedFile.lastQuestionPage,
    };
    
  const [conditionsObj, setConditionsObj] = useState(defaultConditionsObj);
  //const fileName = selectedFile ? selectedFile.name : '';

  useEffect(() => {

    const updatedSelectedFile = {
      ...selectedFile,
      firstQuestionNumber: conditionsObj.firstQuestionNumber,
      lastQuestionPage: conditionsObj.lastQuestionPage,
    };
    
    //console.log(updatedSelectedFile);
    console.log(files);
    updateFile(files,updatedSelectedFile);
    setSelectedFile(updatedSelectedFile); // Assuming you have a `setSelectedFile` function in your state.

  }, [conditionsObj]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setConditionsObj((prevConditions) => ({
      ...prevConditions,
      [name]: value,
    }));

  };

  const updateFile = (files, updatedFile) => { //replaces the old file with the new file object made here 

    const indexToUpdate = files.findIndex(file => file.key === updatedFile.key);
  

    if (indexToUpdate !== -1) {
      const updatedFiles = [...files]; 
      updatedFiles[indexToUpdate] = updatedFile;
  
      setFiles(updatedFiles);
    }
      return files;
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
            value={selectedFile.firstQuestionNumber}
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
            value={selectedFile.lastQuestionPage}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
            />
        </div>

        <div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowConditions(false)}>OK</button>
        </div>
        
        <div className="pdf-frame">
            <iframe src={selectedFile.preview} className="pdf-iframe"></iframe>
          </div>
    </div>

);
};

export default Conditions;