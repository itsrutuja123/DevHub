// Provide global auth context
import React from "react";
import { createContext, useState, useEffect, useContext } from "react";

const AuthContex = createContext();

// Custom hook to access auth context
export const useAuth = () => useContext(AuthContex);

export const AuthProvider = ({ childern }) => {
    const [currentUser, setCurrentUser] = useState(null);

    // Check and set user from localStorage
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) setCurrentUser(userId);
    }, []);

    // Provide current user and setter
    const value = { currentUser, setCurrentUser };

    return <AuthContex.Provider value={value}>{childern}</AuthContex.Provider>;
};
