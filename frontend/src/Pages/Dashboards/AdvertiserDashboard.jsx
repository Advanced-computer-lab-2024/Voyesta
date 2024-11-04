import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AdvertiserProfile from '../../components/AdvertiserComponents/AvertiserProfie';
import NavBar from '../../components/NavBar';
import ActivitiesView from '../../newComponents/ActivitiesView';


const navLinks = [
  { path: "/advertiser/", label: "Home" },
  { path: "/advertiser/profile", label: "Profile" },
  { path: "/advertiser/activity", label: "Activity" }
];


function AdvertiserDashboard() {
    return (
      <div>
         <NavBar navLinks={navLinks} />
          <Routes>
            <Route exact path="/" element={<div>Home</div>}/>
            <Route path="/profile" element={
              <AdvertiserProfile />
              
            } />
            <Route path="/activity" element={
              
              // <ActivityProfile  
              //   baseUrl="http://localhost:3000/api/advertiser"
              //   title = "Advertiser" 
              // /> 
              
              <ActivitiesView baseUrl="http://localhost:3000/api/advertiser" role="advertiser" />
            } />
          </Routes>
        </div>
    );
  }
  
  export default AdvertiserDashboard;
