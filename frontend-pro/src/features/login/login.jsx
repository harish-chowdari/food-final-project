import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import './login.css';
import logo from '../../images/logo.GCrBBNnxnOwXs1M3EMoAJtlyEtgPZp9fU'
import {useAuth} from '../../context/authContext';

import PopUp from "../../components/popup/popup";
import Loader from '../../components/loader/loader';

const LoginPage = () => {
    const navigate = useNavigate();
    const {login} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('consumer'); // Default user type

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log("Login submitted for:", email, "as a", userType);
        setLoading(true);
        try{
            await login({
                email,
                password,
                userType
            })
            if(userType === "consumer"){
                navigate("/consumer-home");
                
            }else{
                navigate("/provider-home");
            }
        }catch(error){
            console.log("Error logging in:", error);
            setLoading(false);
            if(error?.response?.data?.message){
                setpopUpText(error?.response?.data?.message);
            }
            else{
                setpopUpText("Something Went Wrong")
            }
            setIsPopUpOpen(true);
        }
    };

    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [popUpText, setpopUpText] = useState("")
    const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
    const blurredBackgroundStyles = isBackgroundBlurred
        ? {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(100, 100, 100, 0.5)",
            backdropFilter: "blur(1.8px)",
            zIndex: 1,
        }
        : {};


return (
    <div className="loginFormContainer">
        {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
        {loading && <Loader />}
        <img src={logo} alt="App Logo" className="appLogo" />
        <h2 className="formTitle">Log in to Your Account</h2>
        <form onSubmit={handleSubmit} className="loginForm">
            <div className="userTypeSelection">
            <label>
                <input
                type="radio"
                value="consumer"
                checked={userType === 'consumer'}
                onChange={() => setUserType('consumer')}
                /> Consumer
            </label>
            <label>
                <input
                type="radio"
                value="provider"
                checked={userType === 'provider'}
                onChange={() => setUserType('provider')}
                /> Provider
            </label>
            </div>
            <div className="inputGroup">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            </div>
            <div className="inputGroup">
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </div>
            <button type="submit" className="submitBtn">Log In</button>
        </form>
        <div className="notMember">
            Don't have an account? <Link to="/signup" className="registerLink">Sign up</Link>
        </div>
        <PopUp
        isOpen={isPopUpOpen}
        close={() => setIsPopUpOpen(false)}
        text={popUpText}
        />
    </div>
);
};

export default LoginPage;
