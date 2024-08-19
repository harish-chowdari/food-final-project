import React, { useState } from 'react';
import './registration.css'; 
import { Link,useNavigate } from 'react-router-dom';
import logo from "../../images/logo.GCrBBNnxnOwXs1M3EMoAJtlyEtgPZp9fU"

import axios from "../../axios";
import PopUp from "../../components/popup/popup";
import Loader from '../../components/loader/loader';


const RegistrationForm = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('consumer'); 

  const [name, setname] = useState();
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [contactInfo, setcontactInfo] = useState();
  const [address, setaddress] = useState();
  const [businessName, setbusinessName] = useState()

  const [foodNotContains, setFoodNotContains] = useState('');


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



      const handleSubmit = async (e) => {
        e.preventDefault();
        try{
          setLoading(true);
          if(userType === "consumer"){
            await axios.post("/auth/registration-consumer", {
              name,
              email,
              password,
              foodNotContains: foodNotContains.split(',')
            })
          }
          else{
            await axios.post("/auth/registration-provider", {
              name,
              email,
              password,
              contactInfo,
              address,
              businessName
            }) 
          }
          navigate("/");
        }catch(error){
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


      

  return (
    <div className="registrationFormContainer">
      {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
      {loading && <Loader />}
      <img src={logo} alt="App Logo" className="appLogo" /> {/* Logo at the top */}
      <h2 className="formTitle">Register as a Food Savior</h2>
      <div className="userTypeToggle">
        <button className={userType === 'consumer' ? 'active' : ''} onClick={() => setUserType('consumer')}>Consumer</button>
        <button className={userType === 'provider' ? 'active' : ''} onClick={() => setUserType('provider')}>Provider</button>
      </div>
      <form onSubmit={handleSubmit} className="registrationForm">
        {/* Common fields */}
        <div className="inputGroup">
          <input 
            type="text" 
            placeholder="Name" 
            value={name}
            onChange={(e) => setname(e.target.value)}
            required />
        </div>
        <div className="inputGroup">
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required />
        </div>

        <div className="inputGroup">
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required />
        </div>

        
     {   userType === 'provider' ? <></> :
        <div className="inputGroup">
        <input
            type="text"
            placeholder="Food Not Contains (comma-separated)"
            value={foodNotContains}
            onChange={(e) => setFoodNotContains(e.target.value)}
            required />
    </div>}

        {/* Provider-specific fields */}
        {userType === 'provider' && (
          <>
            <div className="inputGroup">
              <input 
                type="text" 
                placeholder="Business Name" 
                value={businessName}
                onChange={(e) => setbusinessName(e.target.value)}
                required />
            </div>
            <div className="inputGroup">
              <input 
                type="text" 
                placeholder="Address" 
                value={address}
                onChange={(e) => setaddress(e.target.value)}
                required />
            </div>
            <div className="inputGroup">
              <input
                type="text"
                value={contactInfo} 
                placeholder="Contact Information" 
                onChange={(e) => setcontactInfo(e.target.value)} 
                required />
            </div>
          </>
        )}
        <button type="submit" className="submitBtn">Register</button>
      </form>
      <div className="alreadyMember">
        Already have an account? <Link to="/" className="loginLink">Log in</Link>
      </div>
      <PopUp
        isOpen={isPopUpOpen}
        close={() => setIsPopUpOpen(false)}
        text={popUpText}
      />
    </div>
  );
};

export default RegistrationForm;
