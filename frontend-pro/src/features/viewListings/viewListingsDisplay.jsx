import React, { useState, useEffect } from 'react';
import Design from "./viewListings.module.css";
import axios from '../../axios';
import Loader from '../../components/loader/loader';
import PopUp from '../../components/popup/popup';


 
const ListingsDisplay = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [popUpText, setPopUpText] = useState("");
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const providerId = localStorage.getItem("providerId");

 
    const fetchListings = async () => {
        try {
            const res = await axios.get(`/provider/listings/${providerId}`);
            const fetchedListings = res.data.listings;
            const bookingsRes = await axios.get("/booking/get-all-bookings");
            const bookings = bookingsRes.data.bookings;

            const updatedListings = fetchedListings.map(listing => {
                const isBooked = bookings.some(booking => {
                    return booking.items && booking.items.some(item => item.itemId && item.itemId._id === listing._id);
                });
                return { ...listing, isBooked };
            });

            setListings(updatedListings);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setPopUpText("Error fetching listings. Please try again.");
            setIsPopUpOpen(true);
        }
    };

    useEffect(() => {
        
        fetchListings();
    }, [providerId]);

    
    
    const addToClaimed = async (itemId, userId, headLine, quantity) => {
        try {
            const bookingRes = await axios.post("/booking/add-to-bookings", { userId, itemId });
            if (bookingRes.data.userClaimed) {
                setPopUpText(bookingRes.data.userClaimed);
                setIsPopUpOpen(true);
                fetchListings()

                const res = await axios.put(`/consumer/bookListing/${itemId}`, { status: 'claimed', userId });

                const statisticsRes = await axios.post(`/provider/add-statistics/${providerId}`, {
                    headLine: headLine,
                    quantity: quantity 
                });
                console.log(statisticsRes.data);


                if (res.status === 200) {
                    setListings(listings.map(listing => {
                        if (listing._id === itemId) {
                            return { ...listing, status: 'claimed' };
                        }
                        return listing;
                    }));
                }                
                
    
                fetchListings();
            } else if (bookingRes.data.alreadyClaimed) {
                setPopUpText(bookingRes.data.alreadyClaimed);
                setIsPopUpOpen(true);
            } else {
                setPopUpText(bookingRes.data.userIdNotFound);
                setIsPopUpOpen(true);
                console.log(bookingRes.data);
            }
        } catch(error) {
            console.log(error);
            setPopUpText("Error adding to bookings. Please try again.");
            setIsPopUpOpen(true);
        }
    };
    




    return (
        <div className={Design.listingsContainer}>
            <h2>Listings</h2>
            {loading ? (
                <Loader />
            ) : listings.length === 0 ? (
                <p style={{margin : "20px", textAlign:"center", fontSize:"22px"}}>No listings available</p>
            ) : (
                <div className={Design.listingsDivision}>
                    {listings.map((listing, index) => (
                        <div key={index} className={Design.listingCard}>
                            <h3>{listing.headLine}</h3>
                            <div className={Design.details}>
                                <div className={Design.status}>
                                    <p>
                                        <span>Status </span> {listing.status ? (
                                            <p className={Design.booked}> {listing.status} </p>
                                        ) : (
                                            <span className={Design.pending}>Pending</span>
                                        )}
                                    </p>
                                    <p>
                                        <span>Consumer </span> {listing.consumerName ? (
                                            <p> {listing.consumerName} </p>
                                        ) : (
                                            <p> -- </p>
                                        )}
                                    </p>
                                </div>
                            { listing.status === "claimed"  ? 
                            <button className={Design.claimed} 
                            disabled style={{cursor:"not-allowed"}}>Claimed</button> 
                            : 
                            <button className={Design.claimed} 
                                onClick={() => addToClaimed(listing._id, listing.userId, listing.headLine, listing.quantity)}>Claimed
                            </button>}

                                <div className={Design.listingText}>
                                    <p><span>Description:</span> {listing.description}</p>
                                    <p><span>Provider:</span> {listing.provider.name}</p>
                                    <p><span>Expires On:</span> {listing.useBy.slice(0, 4)}/{listing.useBy.slice(5, 7)}/{listing.useBy.slice(8, 10)}</p>
                                    <p><span>Mobile No:</span> {listing.phoneNo}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <PopUp isOpen={isPopUpOpen} close={() => setIsPopUpOpen(false)} text={popUpText} />
        </div>
    );
};

export default ListingsDisplay;
