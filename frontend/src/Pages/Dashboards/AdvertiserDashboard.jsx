import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ActivityProfile from '../../components/ActivityComponents/ActivityProfile';
import AdvertiserProfile from '../../components/AdvertiserComponents/AvertiserProfie';
import NavBar from '../../components/NavBar';

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
              
            }/>
            <Route path="/activity" element={
              <ActivityProfile  
                baseUrl="http://localhost:3000/api/advertiser"
                title = "Advertiser" 
              />} 
            />
          </Routes>
        </div>
    );
  }
  
  export default AdvertiserDashboard;




// function AdvertiserDashboard() {
//     return (
//       <div>
//         <AdvertiserNavbar /> {/* Use the custom navbar for advertisers */}
//         <Routes>
//           {/* Home or default route */}
//           <Route exact path="/" element={<div>Advertiser Home</div>} />
  
//           {/* View Advertiser Profile */}
//           <Route path="/view-profile" element={
//             <ViewAdvertiserProfile 
//               baseUrl="http://localhost:3000/api/advertiser/profile" 
//               title="View Advertiser Profile"
//             />
//           }/>
  
//           {/* Manage Advertiser Profile (Create/Update) */}
//           <Route path="/manage-profile" element={
//             <AdvertiserProfileManagement 
//               baseUrl="http://localhost:3000/api/advertiser/profile" 
//               title="Manage Profile" 
//             />
//           }/>
  
//           {/* View Advertiser Products */}
//           {/* <Route path="/products" element={<AdvertiserProductsView />} /> */}
//         </Routes>
//       </div>
//     );
//   }
  
//   export default AdvertiserDashboard;










// function AdvertiserDashboard(){
//     return(
//       <div>
//         <AdvertiserNavbar />
        
//         {/* <Routes>
//           <Route exact path="/" element={<div>Home</div>}/>
//           <Route path="/AdvertiserProfile" element={
//             <AdvertiserProfileManagement 
//               baseUrl="http://localhost:3000/api/activityCategory"
//               title = "Profile" 
//             />
//           }/> */}
//           {/* <Route path="/ActivityManagement" element={
//             <ActivityManagement 
//             baseUrl="http://localhost:3000/api/preferenceTag"
//             title="Activity" 
//           />}/> */}
//           <Route path="/products" element={<AdminProductsView />}/>
//           <Route path="/account-management" element={
//             <AdminAccountManagement 
//               baseUrl="http://localhost:3000/api/admin"
//               title = "Account Management" 
//             />}/>
//       </Routes>       
//       </div>
//     );

// import React from "react";
// import AdvertiserNavbar from "../../components/AdvertiserNavbar"; // Your custom advertiser navbar
// import { Routes, Route } from "react-router-dom";
// import AdvertiserProfileView from "../../components/AdvertiserProfileView"; // Component to view advertiser profile
// import AdvertiserProfileManagement from "../../components/AdvertiserProfileManagement"; // Component to manage profile (create/update)
// import AdvertiserProductsView from "../../components/AdvertiserProductsView"; // Component to view advertiser's products




