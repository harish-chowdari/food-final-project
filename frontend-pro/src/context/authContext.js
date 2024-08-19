import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate(); // Import navigate hook

    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null)

    const [providerId, setProviderId] = useState(null)

    // Simulated login function
    const login = async (credentials) => {
        try {
            let response;
            if (credentials.userType === "consumer") {
                response = await axios.post('/auth/login-consumer', credentials);
                // navigate("/consumer-home")
                setUser(response.data.user);

                setUserId(response.data.user._id);

                localStorage.setItem('userId', response.data.user._id); // Set consumer ID in localStorage

            } else {
                response = await axios.post('/auth/login-provider', credentials);
                // navigate("/provider-home")
                setUser(response.data.user);

                setProviderId(response.data.user._id);

                localStorage.setItem('providerId', response.data.user._id);
            }
            console.log("User logged in successfully:", response.data.user._id);
            setUser(response.data.user);
            setUserId(response.data.user._id);
            // Redirect based on user type
            if (credentials.userType === "consumer") {
                navigate("/consumer-home");
            } else {
                navigate("/provider-home");
            }
        } catch (error) {
            throw error;
        }
    };


    return (
        <AuthContext.Provider value={{ user, userId, providerId, login }}>
            {children}
        </AuthContext.Provider>
    );
};
