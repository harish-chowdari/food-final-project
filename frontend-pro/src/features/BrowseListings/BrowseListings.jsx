import React, { useState, useEffect } from "react";
import Design from "./BrowseListings.module.css";
import axios from "../../axios";
import PopUp from "../../components/popup/popup";
import Loader from "../../components/loader/loader";

const BrowseListings = () => {
  const [listings, setListings] = useState([]);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Initially set to true to show loader
  const [popUpText, setPopUpText] = useState("");
  const userId = localStorage.getItem("userId");

  const [email, setEmail] = useState("");

  const fetchUserEmail = async () => {
    try {
      const res = await axios.get(`/auth/consumer-details/${userId}`);
      setEmail(res.data);
      console.log(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false); // Set loading to false in case of error
    }
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get(
          `/consumer/food-not-contains-listings?_id=${userId}`
        );
        setListings(res.data.listings);
        setLoading(false); // Set loading to false after fetching listings
      } catch (error) {
        console.log(error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchUserEmail();
    fetchListings();
  }, []);

  const handleBookNow = async (id, headLine, providerName) => {
    try {
      setLoading(true); // Start loading when "Book Now" is clicked
      const consumerName = prompt("Enter your name:");
      if (!consumerName) {
        setLoading(false); // Stop loading if user cancels
        return;
      }
      const res = await axios.put(`/consumer/bookListing/${id}`, {
        status: "booked",
        consumerName,
        userId,
      });
      if (res.status === 200) {
        setListings(
          listings.map((listing) => {
            if (listing._id === id) {
              return { ...listing, status: "booked", consumerName, userId };
            }
            return listing;
          })
        );

        const bookingResponse = await axios.post("/send-email", {
          userEmail: email,
          userName: consumerName,
          itemName: headLine,
          providerName,
        });

        console.log(bookingResponse.data);
        setPopUpText("You should receive an email about Booking details!");
        setIsPopUpOpen(true);
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        setPopUpText(error?.response?.data?.message);
      } else {
        setPopUpText("Something Went Wrong");
      }
      setIsPopUpOpen(true);
    } finally {
      setLoading(false); // Stop loading in case of error
    }
  };

  return (
    <div className={Design.listingsContainer}>
      {listings.length === 0 ? <h2>Listings are empty</h2> : <h2>Listings</h2>}
      <div className={Design.listingsDivision}>
        {loading && <Loader />}
        {listings.map((listing, index) => (
          <div key={index} className={Design.listingCard}>
            <h3>{listing.headLine}</h3>
            <div className={Design.details}>
              <div className={Design.button}>
                {listing.status !== "booked" &&
                  listing.status !== "claimed" && (
                    <button
                      onClick={() =>
                        handleBookNow(
                          listing._id,
                          listing.headLine,
                          listing.provider.name
                        )
                      }
                    >
                      Book Now
                    </button>
                  )}
                {listing.status === "booked" && (
                  <p>
                    <span className={Design.bookedStatus}> Booked : </span>{" "}
                    {listing.consumerName}{" "}
                  </p>
                )}
                {listing.status === "claimed" && (
                  <p>
                    <span style={{ color: "red" }}> Claimed : </span>{" "}
                    {listing.consumerName}{" "}
                  </p>
                )}
              </div>

              <div className={Design.listingText}>
                <p>
                  <span>Description:</span> {listing.description}
                </p>
                <p>
                  <span>Provider:</span> {listing.provider.name}
                </p>
                <p>
                  <span>Expires On:</span> {listing.useBy.slice(0, 4)}/
                  {listing.useBy.slice(5, 7)}/{listing.useBy.slice(8, 10)}
                </p>
                <p>
                  <span>Mobile No:</span> {listing.phoneNo}
                </p>
                <p>
                  <span>Location:</span> {listing.location}
                </p>
                <p>
                  <span>Contains:</span> {listing.foodContains.join(", ")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <PopUp
        isOpen={isPopUpOpen}
        close={() => setIsPopUpOpen(false)}
        text={popUpText}
      />
    </div>
  );
};

export default BrowseListings;
