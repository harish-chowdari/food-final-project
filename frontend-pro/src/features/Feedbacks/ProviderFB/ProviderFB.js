import React, { useState, useEffect } from 'react';
import axios from '../../../axios';
import Design from "./ProviderFB.module.css";
import Loader from '../../../components/loader/loader';
import { useParams } from 'react-router-dom';

const ProviderFB = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { providerId } = useParams();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(`/feedback/feedbacks-by-provider/${providerId}`);
        setFeedbacks(response.data.feedbacks);
        setLoading(false); // Set loading to false after fetching feedbacks
      } catch (error) {
        console.error('Error fetching provider feedbacks:', error);
        setLoading(false); // Set loading to false in case of error
      }
    }; 

    fetchFeedbacks();
  }, [providerId]); 

  return (
    <div className={Design.feedbackContainer}>
      
      {loading ? (
        <Loader />
      ) : (
        <div className={Design.feedbacks}>
          {feedbacks.length === 0 ? (
            <p>No feedbacks available</p>
          ) : (
            feedbacks.map(feedback => (
              <div key={feedback._id} className={Design.feedbackItem}>
                <h3 className={Design.providerName}>Your Feedbacks</h3>
                
                <div className={Design.feedbackDiv}>
                  {feedback.feedbackItems.map(feedbackItem => (
                    <div key={feedbackItem._id} className={Design.item}>
                      <div className={Design.feedbackDetails}>
                        <p className={Design.itemName}><span>Item Name:</span> {feedbackItem.itemId ? feedbackItem.itemId.headLine : "N/A"}</p>
                        <p className={Design.feedbackText}><span>Feedback:</span> {feedbackItem.feedback}</p>
                        <p className={Design.date}><span>Date:</span> {feedbackItem.itemId ? new Date(feedbackItem.itemId.useBy).toLocaleDateString() : "N/A"}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ProviderFB;
