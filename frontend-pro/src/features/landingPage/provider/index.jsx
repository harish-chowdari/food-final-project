import React from 'react';
import { Link } from 'react-router-dom';
import "./index.css"

import { useAuth } from '../../../context/authContext';

const ProviderHomePage = () => {
    const { user } = useAuth();
    return (
        <div className="providerHomePage">
            <h1>Welcome, {user.name}!</h1>
            
            <div className="dashboard">
                <Link to="/create-listing" className="dashboardLink">Create New Listing</Link>
                <Link to="/view-listings" className="dashboardLink">Manage My Listings</Link>
            </div>

            <div className="activeListingsSummary">
                <h2>Active Listings Summary</h2>
            </div>
        </div>
    );
};

export default ProviderHomePage;
