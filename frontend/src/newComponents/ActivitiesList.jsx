// ActivitiesList.jsx
import React from 'react';
import ActivityItem from './ActivityItem';

const ActivitiesList = ({fetchActivities, activities, role, baseUrl }) => {
  return (
    <div className='flex flex-col gap-1'>
      {activities.length > 0 ? (
        activities.map((activity) => (
          <ActivityItem key={activity._id} fetchActivities={fetchActivities} baseUrl={baseUrl} activity={activity} role={role} />
        ))
      ) : (
        <p>No activities found.</p>
      )}
    </div>
  );
};

export default ActivitiesList;