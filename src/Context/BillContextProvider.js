import React, { createContext, useContext, useEffect, useState } from "react";
import { fillValues, isArrNotEmpty, isPhoneNumber, isRequired, Validate, Validation } from "../helpers/validation";
import { AlertContext } from "./AlertContext";
const BillContext = createContext();

const BillContextProvider = ({ children }) => {
    const ctx = useContext(AlertContext);
    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [gender, setGender] = useState('MALE')
    const [age, setAge] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [tests, setTests] = useState([]);
    const [doctor, setDoctor] = useState('');
    const [totalAmt, setTotalAmt] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [allTests, setAllTests] = useState([]);

    useEffect(() => {
        const getTests = async () => {
            setIsLoading(true);
            const testList = await window.api.getTests();
            if (testList.error) {
                ctx.actions.showDialog("Error", `Oops! looks like some unexpected error occured. Please try again. \n ${testList.error}`);
            }
            setAllTests(testList.data)
            setIsLoading(false);
        }
        getTests()
    }, [])


    const [valid, setValid] = useState(Validation([
        {
            field: "name",
            validations: [isRequired]
        },
        {
            field: "contactNumber",
            validations: [isPhoneNumber, isRequired]
        },
        {
            field:"doctor",
            validations: [isRequired]
        },
        {
            field:"tests",
            validations:[isArrNotEmpty]
        }
    ]
    ))


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
        let itemsDeleted = 0;
        const newTests = []
        tests.forEach(test => {
            if (test.id == singleTestID && itemsDeleted === 0) {
                itemsDeleted++;
                setTotalAmt(totalAmt - test.cost)
            } else {
                newTests.push(test);
            }
        });
        setTests(newTests)
    }

    const submitHandler = async () => {
        const isValid = Validate(valid,{ name, contactNumber, doctor, tests })
        if (!isValid.valid) {
            setValid(isValid.validation)
        } else {
            setIsLoading(true)
            const created = await window.api.generateBill({
                patient_name: name,
                patient_contactNumber: contactNumber,
                age: age,
                gender: gender,
                discount,
                testList: tests,
                total_amount: totalAmt,
                referred_by: doctor
            })
            setIsLoading(false)
            if (created.status === "FAILURE") {
                ctx.actions.showDialog("Failed", "Oops! Some error occured in generating the bill. Please try again.")
            }

        }

    }

    const value = {
        state: { name, contactNumber, discount, tests, doctor, allTests, totalAmt, isLoading, age, gender, valid },
        actions: { setName, setContactNumber, setDiscount, setTests, setDoctor, submitHandler, setTotalAmt, addTest, removeTest, setAge, setGender, setValid }
    }

    return (
        <BillContext.Provider value={value}>
            {children}
        </BillContext.Provider>
    );
};

export { BillContext, BillContextProvider }