import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateActivity from './CreateActivity'; // Import your CreateActivity component
import ActivityCard from './ActivityCard';

const ActivityManagement = () => {
  const [activeTab, setActiveTab] = useState('viewActivity');
  // const [activity, setActivity] = useState(null);
  const [activities, setActivities] = useState([]);


  // Form fields for view/edit activity
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [specialDiscounts, setSpecialDiscounts] = useState('');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [viewStatus, setViewStatus] = useState("");

  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MDNiYjhmNzNkYjdkZTU3YmEyMjRiNCIsInR5cGUiOiJhZHZlcnRpc2VyIiwiaWF0IjoxNzI4Mjk3ODcxLCJleHAiOjE3NTQyMTc4NzF9.J75YSz_DmEuLdm1WvtiEIb6EFf5Q-qjKqAmFB5wWV9Y"
  const token = localStorage.getItem("token");
  const baseUrl = 'http://localhost:3000/api/advertiser'; // Adjust this based on your backend

  useEffect(() => {
    if (activeTab === 'viewActivity' || activeTab === 'editActivity') {
      fetchActivity();
    }
  }, [activeTab]);

  const getAuthHeaders = () =>{
    // console.log(token);
    return {
    headers: {
        Authorization: `Bearer ${token}`
       }}
    };
  // Fetch the activity details
  const fetchActivity = async () => {
      setViewStatus("Loading...");
      axios.get("http://localhost:3000/api/advertiser/getActivity", getAuthHeaders())
      .then(res => {
        console.log(res.data);
        setActivities(res.data);
        setViewStatus("");
        if(res.data.length ===0){
          setViewStatus("No activities found! Create Activities");
        }
      })
      .catch(e => {
        console.log(e)
        setMessage("error while fetching ")});
      
      // setActivity(response.data);

      // Set the form values for edit mode
      // if (response.data) {
      //   
      // }
   
  };


  const handleUpdateActivity = async (e) => {
    e.preventDefault();

    const updatedActivityData = {
      name,
      description,
      date,
      time,
      location,
      price: parseFloat(price),
      category,
      tags: tags.split(',').map((tag) => tag.trim()),
      specialDiscounts,
      bookingOpen,
    };

    try {
      await axios.put(`${baseUrl}/update`, updatedActivityData);
      setMessage('Activity updated successfully.');
      fetchActivity(); // Refetch the activity details after update
    } catch (error) {
      console.error('Error updating activity:', error);
      setMessage('Error updating activity.');
    }
  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Activity Management</h1>

      {/* Tab Navigation */}
      <div className="flex justify-around border-b mb-4">
        <button
          className={`p-2 ${activeTab === 'viewActivity' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('viewActivity')}
        >
          View Activity
        </button>
        {/* <button
          className={`p-2 ${activeTab === 'editActivity' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('editActivity')}
        >
          Edit Activity
        </button> */}
        <button
          className={`p-2 ${activeTab === 'createActivity' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('createActivity')}
        >
          Create Activity
        </button>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === 'viewActivity'? (
        <>
        {
          activities.map(activity => (
            <ActivityCard key={activity._id} activity={activity} getAuthHeaders={getAuthHeaders} fetchActivities={fetchActivity} />
          ))
        }
        {
          (viewStatus === "") ? null : <p className='text-gray-500 text-sm'>{viewStatus}</p>
        }
        
        </>
      ) : activeTab === 'createActivity' && (
        <CreateActivity getAuthHeaders={getAuthHeaders}/>
      )}

      {/* Display Message */}
      {message && (
        <p className={`mt-4 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ActivityManagement;
