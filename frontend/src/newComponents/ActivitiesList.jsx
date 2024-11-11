import React from 'react';
import ActivityItem from './ActivityItem';

const ActivitiesList = ({ activities, convertedPrices = [], targetCurrency }) => {
  return (
    <div className="activities-list">
      {activities.map((activity, index) => (
        <ActivityItem
          key={activity._id}
          activity={activity}
          convertedPrice={convertedPrices[index] || activity.price} // Use activity.price as fallback
          targetCurrency={targetCurrency}
        />
      ))}
    </div>
  );
};

export default ActivitiesList;