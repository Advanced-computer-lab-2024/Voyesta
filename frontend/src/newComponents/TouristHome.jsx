import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/HomeTourist.css"; // Add styles separately for a clean structure

const HomePage = () => {
  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/tourist/getActivity", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    const fetchItineraries = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/tourist/getItinerary", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setItineraries(response.data);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    fetchActivities();
    fetchItineraries();
  }, []);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <video className="hero-video" autoPlay loop muted>
          <source src="/src/assets/beachVod.mp4" type="video/mp4" />
        </video>
        <div className="hero-content">
          <h1>Your World Awaits</h1>
          <p>Discover, Explore, Wander</p>
        </div>
      </section>

      

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <a href="#">About Us</a>
          <a href="#">Contact</a>
          <a href="#">FAQ</a>
          <a href="#">Blog</a>
        </div>
        <div className="social-media">
          <a href="#">Instagram</a>
          <a href="#">Facebook</a>
          <a href="#">YouTube</a>
        </div>
        <p>&copy; 2024 TravelCo. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
