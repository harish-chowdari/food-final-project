import React, { useState, useEffect } from 'react';
import axios from '../../../axios';
import Design from "./ConsumerFB.module.css";
import Loader from '../../../components/loader/loader';

const ConsumerFB = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('/feedback/all-feedbacks');
        setFeedbacks(response.data.feedbacks);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className={Design.feedbackContainer}>
      <h2>Consumer Feedback</h2>

      {loading ? (
        <Loader />
      ) : ( 
        <div className={Design.feedbacks}>
          {feedbacks.map(feedback => {
            const providerName = feedback.providerId?.name || "Unknown Provider"; // Safety check for null
            return (
              <div key={feedback._id} className={Design.providerDiv}>
                <h3 className={Design.providerName}>Provider: {providerName}</h3>
                
                <div className={Design.feedbackDiv}>
                  {feedback.feedbackItems.map(feedbackItem => {
                    const itemName = feedbackItem.itemId?.headLine || "N/A"; // Safety check for null
                    const feedbackText = feedbackItem.feedback || "No Feedback";
                    const useByDate = feedbackItem.itemId 
                      ? new Date(feedbackItem.itemId.useBy).toLocaleDateString() 
                      : "N/A"; // Safety check for null
                    
                    return (
                      <div className={Design.pTags} key={feedbackItem._id}>
                        <p className={Design.itemName}><span>Item Name :</span> {itemName}</p>
                        <p className={Design.feedbackText}><span className={Design.feedbackSpan}>Feedback :</span> {feedbackText}</p>
                        <p className={Design.date}><span>Date :</span> {useByDate}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConsumerFB;
