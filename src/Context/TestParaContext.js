import React, { createContext, useEffect, useState } from "react";
const TestParaContext = createContext();

const TestParaContextProvider = ({ children }) => {
    const [name, setName] = useState('');
    const [unit, setUnit] = useState('');
    const [range, setRange]= useState('');
    const [description, setDescription]= useState('');
    const [testID, setTestID]= useState('');

    const [isOpen, setIsOpen]=useState(false);

    const addTestParameter=()=>{
        setIsOpen(false)
        console.log(testID)
        console.log("sfsdf")
        window.api.addTestParameter({
            name,
            unit,
            range,
            description,
            testID
        })
    }

    const value = {
        state: { name, unit, range, description, isOpen, testID},
        actions: { setName, setUnit, setRange, setDescription, setIsOpen, addTestParameter, setTestID}
    }
    return (
        <TestParaContext.Provider value={value}>
            {children}
        </TestParaContext.Provider>
    );
};

export { TestParaContext, TestParaContextProvider }