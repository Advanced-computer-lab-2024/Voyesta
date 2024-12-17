import React from 'react';
import ActivityItem from './ActivityItem';
import '../css/activities.css'; // Import the CSS file for styling
// Import the CSS file for styling

<<<<<<< HEAD
const ActivitiesList = ({ activities, convertedPrices = [], targetCurrency, role, baseUrl, setSuccessMessage }) => {

  console.log(setSuccessMessage);

=======
const ActivitiesList = ({fetchActivities, activities, convertedPrices = [], targetCurrency, role, baseUrl }) => {
>>>>>>> 6469cc2305d262f78037f8e83186459bbeffad9e
  return (
    <div className="activities-grid">
      {activities.map((activity, index) => (
        <ActivityItem
          key={activity._id}
          activity={activity}
          convertedPrice={convertedPrices[index] || activity.price} // Use activity.price as fallback
          targetCurrency={targetCurrency} 
          role={role}
          baseUrl={baseUrl}
<<<<<<< HEAD
          setSuccessMessage = {setSuccessMessage}
=======
          fetchActivities={fetchActivities}
>>>>>>> 6469cc2305d262f78037f8e83186459bbeffad9e
        />
      ))}
    </div>
  );
};

export default ActivitiesList;