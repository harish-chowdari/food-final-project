import React from 'react';
import { Link } from 'react-router-dom';
import "./index.css"

import { useAuth } from '../../../context/authContext';

const ConsumerHomePage = () => {
    const { user } = useAuth();

    


    return (
        <div className="providerHomePage">
            <h1>Welcome, {user.name}!</h1>
            <div className="dashboard">
                <Link to="/browse-listings" className="dashboardLink">Browse Listings</Link>
                <Link to="/bookings" className="dashboardLink">View Bookings</Link>
 
            </div>
            {/* Placeholder for a summary of active listings */}
            <div className="activeListingsSummary">
                <h2>Active Listings Summary</h2>
                {/* This could be a list or a summary of active listings */}
            </div>
        </div>
    );
};

export default ConsumerHomePage;
