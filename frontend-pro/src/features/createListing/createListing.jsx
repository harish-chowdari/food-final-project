import React, { useState } from 'react';
import './createListing.css';
import { Link } from 'react-router-dom'; 

import { useAuth } from '../../context/authContext';


import PopUp from "../../components/popup/popup";
import Loader from '../../components/loader/loader';

import axios from "../../axios"

const CreateListingForm = () => {
    const { user } = useAuth();
    const [listingDetails, setListingDetails] = useState({
        description:'',
        location:'',
        contactInfo:'',
        dietaryRestrictions:'',
        provider:'',
        useBy:'',
        headLine:'',
        phoneNo:'',
        foodContains: [],
        quantity : 1 // Add foodContains array
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "foodContains") {
            const foodContainsArr = value.split(','); // Assuming foodContains values are comma-separated
            setListingDetails({ ...listingDetails, [name]: foodContainsArr });
        } else {
            setListingDetails({ ...listingDetails, [name]: value });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            listingDetails.provider = user._id;
            setLoading(true);
            await axios.post("/provider/createListing", listingDetails);
            setListingDetails({
                description:'',
                location:'',
                contactInfo:'',
                dietaryRestrictions:'',
                provider:'',
                useBy:'',
                headLine:'',
                phoneNo:'',
                foodContains: [],
                quantity : 1 // Reset the form fields
            });
            setpopUpText("Listing Created Successfully");
            setIsPopUpOpen(true);
            setLoading(false);
            
        }catch(error){
            console.log("Error creating listing:", error);
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
        <>
            {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
            {loading && <Loader />}
            <h1 className='create-listing-heading'>Hello, {user.name}!</h1>
            
            <form className="createListingForm" onSubmit={handleSubmit}>
            <h2>Create New Listing</h2>
            <div className="formField">
                <label htmlFor="headLine">Head Line</label>
                <input
                type="text"
                id="headLine"
                name="headLine"
                value={listingDetails.headLine}
                onChange={handleChange}
                required
                />
            </div>
            <div className="formField">
                <label htmlFor="description">Description</label>
                <input
                type="text"
                id="description"
                name="description"
                value={listingDetails.description}
                onChange={handleChange}
                required
                />
            </div>
            <div className="formField">
                <label htmlFor="location">Location</label>
                <input
                type="text"
                id="location"
                name="location"
                value={listingDetails.location}
                onChange={handleChange}
                required
                />
            </div>
            <div className="formField">
                <label htmlFor="useBy">Expiration Date</label>
                <input
                type="date"
                id="useBy"
                name="useBy"
                value={listingDetails.useBy}
                onChange={handleChange}
                required
                />
            </div>
            <div className="formField">
                <label htmlFor="contactInfo">Contact Info</label>
                <input
                type="text"
                id="contactInfo"
                name="contactInfo"
                value={listingDetails.contactInfo}
                onChange={handleChange}
                />
            </div>

            <div className="formField">
                <label htmlFor="phoneNo">Phone Number</label>
                <input
                type="number"
                id="phoneNo"
                name="phoneNo"
                value={listingDetails.phoneNo}
                onChange={handleChange}
                />
            </div>

            <div className="formField">
                <label htmlFor="dietaryRestrictions">Dietary Restrictions</label>
                <input
                type="text"
                id="dietaryRestrictions"
                name="dietaryRestrictions"
                value={listingDetails.dietaryRestrictions}
                onChange={handleChange}
                />
            </div>

            <div className="formField">
                <label htmlFor="foodContains">Food Contains (comma-separated)</label>
                <input
                type="text"
                id="foodContains"
                name="foodContains"
                placeholder='Ex : nuts, sugar'
                value={listingDetails.foodContains.join(',')} // Join array elements with commas
                onChange={handleChange}
                />
            </div>

            <div className="formField">
            <label htmlFor="quantity">Quantity</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={listingDetails.quantity}
                        onChange={handleChange}
                        required
                    />
            </div>


            <button type="submit" className="submitBtn">Submit Listing</button>
            </form>
            <PopUp
                isOpen={isPopUpOpen}
                close={() => setIsPopUpOpen(false)}
                text={popUpText}
            /> 
        </>
    );
};

export default CreateListingForm;
