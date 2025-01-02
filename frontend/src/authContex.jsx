import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContex = createContext();

// Custom hook to access auth context
export const useAuth = () => useContext(AuthContex);

// AuthProvider component to wrap your app with the auth context
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    // Check and set user from localStorage
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) setCurrentUser(userId);
    }, []);

    const value = { currentUser, setCurrentUser };

    return <AuthContex.Provider value={value}>{children}</AuthContex.Provider>;
};
