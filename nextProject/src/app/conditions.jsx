import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';

const Conditions = ({ selectedFile, setShowConditions }) => {
    const defaultConditionsObj = {
        firstQuestionNumber: 16,
        lastQuestionPage: 10,
    };
    
  const [conditionsObj, setConditionsObj] = useState(defaultConditionsObj);

  useEffect(() => {

    selectedFile.firstQuestionNumber = conditionsObj.firstQuestionNumber,
    selectedFile.lastQuestionPage = conditionsObj.lastQuestionPage,
    
    console.log(selectedFile);
  }, [conditionsObj, selectedFile]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setConditionsObj((prevConditions) => ({
      ...prevConditions,
      [name]: value,
    }));

  };


  return (
    <div>
      { selectedFile && ( <h1> {selectedFile.name} </h1> )}
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