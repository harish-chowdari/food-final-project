import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import styles from "./Bookings.module.css";
import PopUp from "../../components/popup/popup";
import Loader from '../../components/loader/loader';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [popUpText, setpopUpText] = useState("");
  const [showFeedback, setShowFeedback] = useState({});

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/booking/get-bookings/${userId}`);
        setBookings(response.data.bookings);
        setLoading(false);
        if (response.data.message) {
          console.log("bookings are empty");
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  const toggleFeedback = itemId => {
    setShowFeedback(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId] || false 
    }));
  };

  const submitFeedback = async (itemId, providerId) => {
    try {
      setLoading(true);
      
      if (!feedbackText.trim()) {
        setpopUpText("Please enter something before submitting.");
        setIsPopUpOpen(true);
        return;
      }
  
      const res = await axios.post('/feedback/send-feedback', {
        providerId,
        itemId,
        feedback: feedbackText
      });
  
      if (res.data.alreadySubmitted) {
        setpopUpText(<span className={styles.redText}>{res.data.alreadySubmitted}</span>);
        setIsPopUpOpen(true);
      } else {
        setpopUpText(res.data.feedbackResponse);
        setIsPopUpOpen(true);
      }

      setShowFeedback(true)
      
  
      setFeedbackText("");
    } catch (error) {
      console.error('Error submitting feedback:', error);
      if (error?.response?.data?.message) {
        setpopUpText(error?.response?.data?.message);
      } else {
        setpopUpText("Something Went Wrong")
      }
      setIsPopUpOpen(true);
    } finally { 
      setLoading(false);
    }
  };

  return (
    <div className={styles.bookingsContainer}>
{bookings.length === 0 ? <h2 className={styles.bookingsHeader}>Bookings are empty</h2>   :  <h2 className={styles.bookingsHeader}>Bookings</h2>
}
      {loading && <Loader />}
      <div className={styles.card}>
        {bookings.map(booking => (
          <div key={booking._id} className={styles.bookingsItem}>
            <div className={styles.details} style={{ display: showFeedback[booking._id] ? 'none' : 'block' }}>
              <p><span>Headline:</span> {booking.itemId.headLine}</p>
              <p><span>Description:</span> {booking.itemId.description}</p>
              <p><span>Expires On :</span> {booking.itemId.useBy.slice(0, 4)}/{booking.itemId.useBy.slice(5, 7)}/{booking.itemId.useBy.slice(8, 10)}</p>
              <p><span>Location:</span> {booking.itemId.location}</p>
              <p><span>Mobile No:</span> {booking.itemId.phoneNo}</p>

              <p><span>Provider:</span> {booking.itemId.provider.name}</p>
              <button onClick={() => toggleFeedback(booking._id)} className={styles.feedbackButton}>
                Feedback
              </button>
            </div>

            {showFeedback[booking._id] && (
              <div className={styles.feedback}>
                <textarea 
                  className={styles.feedbackTextarea} 
                  placeholder="Enter your feedback" 
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
                <button onClick={() => submitFeedback(booking.itemId, booking.itemId.provider._id)}>Submit</button>
              </div>
            )}
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

export default Bookings;
