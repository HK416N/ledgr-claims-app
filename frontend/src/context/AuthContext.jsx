//imports

import { useNavigate } from "react-router";
import { createContext, useEffect, useContext, useState } from "react";

export const AuthContext = createContext(null); //https://react.dev/reference/react/createContext

export const Authenticator = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser)); //String -> Obj
        }
    }, []);

    const  login = (newToken, newUser) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser)); //LocalStorage stores Strings

        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setToken(null);
        setUser(null);

        navigate('/login');
    };


    return(
        <>
        <AuthContext.Provider value={{ token, user, login, logout}}> 
            {children}
        </AuthContext.Provider>
        </>
    );

};

//custom hook

export const useAuth = () => useContext(AuthContext);