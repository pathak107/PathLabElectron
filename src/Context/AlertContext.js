import React, { createContext, useState } from "react";
const AlertContext = createContext();

const AlertContextProvider = ({ children }) => {
    const [heading, setHeading] = useState('');
    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen]=useState(false);

    const showDialog=(heading, message)=>{
        setIsOpen(true);
        setHeading(heading);
        setMessage(message)
    }

    const value = {
        state: { heading, isOpen, message},
        actions: { setIsOpen, setHeading, setMessage, showDialog}
    }
    return (
        <AlertContext.Provider value={value}>
            {children}
        </AlertContext.Provider>
    );
};

export { AlertContext, AlertContextProvider }