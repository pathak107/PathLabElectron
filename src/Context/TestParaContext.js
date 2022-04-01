import React, { createContext, useContext, useState } from "react";
import { isRequired, Validate, Validation } from "../helpers/validation";
import { AlertContext } from "./AlertContext";
const TestParaContext = createContext();

const TestParaContextProvider = ({ children }) => {
    const diaCtx = useContext(AlertContext)
    const [name, setName] = useState('');
    const [unit, setUnit] = useState('');
    const [range, setRange] = useState('');
    const [description, setDescription] = useState('');
    const [testID, setTestID] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [isForNewTest, setIsForNewTest] = useState(false)

    const [isOpen, setIsOpen] = useState(false);

    const [valid, setValid]=useState(Validation([
        {
            field:'name',
            validations:[isRequired]
        }
    ]))

    const addTestParameter = async (paraForNewTest) => {
        const isValid=Validate(valid, {name})
        if(!isValid.valid){
            setValid(isValid.validation)
            return
        }
        if (!isForNewTest) {
            setIsLoading(true);
            console.log(testID)
            const created = await window.api.addTestParameter({
                name,
                unit,
                range,
                description,
                testID
            })
            setIsLoading(false);
            setIsOpen(false);
            if (created.status === "FAILURE") {
                diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured in creating test parameter. Please try again.`);
            }
        } else {
            paraForNewTest({
                name,
                unit,
                range,
                description,
            })
            setIsOpen(false);
        }
    }

    const value = {
        state: { name, unit, range, description, isOpen, testID, isLoading, isForNewTest, valid },
        actions: { setName, setUnit, setRange, setDescription, setIsOpen, addTestParameter, setTestID, setIsLoading, setIsForNewTest }
    }
    return (
        <TestParaContext.Provider value={value}>
            {children}
        </TestParaContext.Provider>
    );
};

export { TestParaContext, TestParaContextProvider }