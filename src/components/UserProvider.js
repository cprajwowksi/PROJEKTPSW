import React, {createContext, useState, useContext, useEffect} from 'react';
import {useCookies} from "react-cookie";
import axios from "axios";
const UserContext = createContext();
const UserProvider = ({ children }) => {
    const [cookie, setCookie, removeCookie] = useCookies(['user']);
    const userId = cookie.UserId
    const [user, setUser] = useState(null);
    const setUserContext = (userData) => {
        setUser(userData);
    };
    const getUser =  async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', {
                params: { userId }
            })
            await setUserContext(response.data)
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getUser()
    }, [userId]);



    return (
        <UserContext.Provider value={{ user, setUserContext }}>
            {children}
        </UserContext.Provider>
    );
};

const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext musi być używane wewnątrz UserProvider');
    }
    return context;
};

export { UserProvider, useUserContext };
