import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';

const SetConditions = ({ }) => {
    const defaultConditionsObj = {
        firstQuestionNumber: 16,
        lastQuestionPage: 10,
    };
    
  const [conditionsObj, setConditionsObj] = useState(defaultConditionsObj);

    useEffect(() => {
        Cookies.set('firstQuestionNumber', conditionsObj.firstQuestionNumber);
        Cookies.set('lastQuestionPage', conditionsObj.lastQuestionPage);
        //const savedConditions = Cookies.getJSON('conditionsObj');
        // if (!savedConditions) {
        //     alert("please answer the following questions for the program to run")
        // }
    }, [conditionsObj]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setConditionsObj((prevConditions) => ({
      ...prevConditions,
      [name]: value,
    }));

  };


  return (
    <div>
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
    </div>
);
};

export default SetConditions;