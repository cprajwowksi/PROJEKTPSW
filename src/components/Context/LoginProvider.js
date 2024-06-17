import React, { createContext, useState } from 'react';

const SignUpContext = createContext();

const SignUpProvider = ({ children }) => {
    const [signUpClicked, setSignUpClicked] = useState(false);

    return (
        <SignUpContext.Provider value={{ signUpClicked, setSignUpClicked }}>
            {children}
        </SignUpContext.Provider>
    );
};

export { SignUpProvider, SignUpContext };