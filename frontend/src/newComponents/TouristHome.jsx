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

      {/* Highlights Section */}
      <section className="highlights">
        <h2>Top Activities</h2>
        <div className="destination-grid">
          {activities.slice(0, 3).map((activity, index) => (
            <div className="destination-card" key={index}>
              <img src={activity.image} alt={activity.name} />
              <div className="destination-info">
                <h3>{activity.name}</h3>
                <p>Starting at ${activity.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Personalized Recommendations */}
      <section className="recommendations">
        <h2>Just For You</h2>
        <div className="recommendation-scroll">
          {itineraries.slice(0, 3).map((itinerary, index) => (
            <div className="recommendation-card" key={index}>
              <img src={itinerary.image} alt={itinerary.name} />
              <h3>{itinerary.name}</h3>
            </div>
          ))}
        </div>
      </section>  

      {/* Newsletter Section */}
      <section className="newsletter">
        <h2>Join Our Travel Community</h2>
        <p>Get insider tips and the best deals delivered to your inbox.</p>
        <div className="newsletter-form">
          <input type="email" placeholder="Your email address" />
          <button>Subscribe</button>
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
