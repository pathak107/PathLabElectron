import React, { createContext, useContext, useEffect, useState } from "react";
import { AlertContext } from "./AlertContext";
const BillContext = createContext();

const BillContextProvider = ({ children }) => {
    const ctx = useContext(AlertContext);
    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [discount, setDiscount] = useState(0);
    const [tests, setTests] = useState([]);
    const [doctor, setDoctor] = useState('');
    const [totalAmt, setTotalAmt] = useState(0);

    const [isLoading, setIsLoading]=useState(false);
    const [allTests, setAllTests]=useState([]);

    useEffect(()=>{
        setIsLoading(true);
        window.api.getTests();
        window.api.response((testList)=>{
            if(testList.error){
                ctx.actions.showDialog("Error", `Oops! looks like some unexpected error occured. Please try again. \n ${testList.error}`);
            }
            setAllTests(testList.data)
        });
        setIsLoading(false);
    },[])


    const addTest = (singleTestID) => {
        allTests.forEach(test => {
            if (test.id == singleTestID) {
                const newTests = [...tests]
                newTests.push(test)
                setTotalAmt(totalAmt + test.cost)
                setTests(newTests);
            }
        });
    }

    const removeTest = (singleTestID) => {
        let itemsDeleted=0;
        const newTests=[]
        tests.forEach(test => {
            if (test.id == singleTestID && itemsDeleted===0) {
                itemsDeleted++;
                setTotalAmt(totalAmt - test.cost)
            }else{
                newTests.push(test);
            }
        });
        setTests(newTests)
    }

    const submitHandler = () => {
        console.log(name);
        console.log(contactNumber);
        console.log(discount);
        console.log(tests);
        console.log(doctor);
        window.api.generateBill({
            patient_name:name,
            patient_contactNumber:contactNumber,
            discount,
            testList:tests,
            total_amount:totalAmt,
            referred_by: doctor
        })
    }

    const value = {
        state: { name, contactNumber, discount, tests, doctor, allTests, totalAmt, isLoading },
        actions: { setName, setContactNumber, setDiscount, setTests, setDoctor, submitHandler, setTotalAmt, addTest, removeTest }
    }

    return (
        <BillContext.Provider value={value}>
            {children}
        </BillContext.Provider>
    );
};

export { BillContext, BillContextProvider }