import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateComplaint from './CreateComplaint';
import ViewComplaints from './ComplaintView';
import ComplaintFilter from './ComplaintFilter';

const CombinedComplaints = ({ baseUrl, role }) => {
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [reply, setReply] = useState('');
  const [activeTab, setActiveTab] = useState('viewComplaints');
  const [sortOrder, setSortOrder] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`${baseUrl}/getComplaints`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [baseUrl, selectedComplaint, reply, message]);

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const handleCloseModal = () => {
    setSelectedComplaint(null);
    setReply('');
    setMessage('');
  };

  const handleStatusChange = async (status) => {
    try {
      const response = await axios.patch(`${baseUrl}/updateComplaintStatus/${selectedComplaint._id}`, { status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSelectedComplaint({ ...selectedComplaint, status: response.data.status });
      setComplaints(complaints.map(c => c._id === selectedComplaint._id ? { ...c, status: response.data.status } : c));
      setMessage('Status updated successfully.');
    } catch (error) {
      setMessage('Error updating status.');
      console.error('Error updating status:', error);
    }
  };

  const handleReplySubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.patch(`${baseUrl}/replyToComplaint/${selectedComplaint._id}`, { reply }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage('Reply sent successfully.');
      setReply('');
    } catch (error) {
      setMessage('Error sending reply.');
      console.error('Error sending reply:', error);
    }
  };

  const handleSortOrderChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    const sortedComplaints = [...complaints].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (newSortOrder === 'asc') {
        return dateA - dateB;
      } else if (newSortOrder === 'desc') {
        return dateB - dateA;
      }
      return 0;
    });
    setComplaints(sortedComplaints);
  };

  const handleComplaintCreated = () => {
    fetchComplaints();
    setActiveTab('viewComplaints');
  };

  const filteredComplaints = complaints.filter(complaint => 
    statusFilter === '' || complaint.status === statusFilter
  );

  return (
    <div className="flex">
      {/* Filter and Sort */}
      {activeTab === 'viewComplaints' && (
        <div className="w-1/5 bg-red-300 p-4">
          <ComplaintFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
          <div className="flex justify-center w-full bg-red-300 p-4">
            <div className="w-full max-w-xs">
              <h2 className="text-lg font-bold mb-4 bg-green-200 p-2 text-center">Sort by Date</h2>
              <div className="mb-4 text-center">
                <label>Sort Order:</label>
                <select value={sortOrder} onChange={handleSortOrderChange} className="w-full p-2 border border-gray-400 rounded">
                  <option value="" disabled>Select an option</option>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow flex justify-center">
        <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
          <h1 className="text-2xl text-gray-600 font-bold mb-3">Complaint Management</h1>
          
          {/* Tab Navigation */}
          <div className="flex justify-around border-b mb-4">
            <button
              className={`p-2 ${activeTab === 'viewComplaints' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('viewComplaints')}
            >
              View Complaints
            </button>
            {role === 'tourist' && (
              <button
                className={`p-2 ${activeTab === 'createComplaint' ? 'border-b-2 border-blue-500' : ''}`}
                onClick={() => setActiveTab('createComplaint')}
              >
                Create Complaint
              </button>
            )}
          </div>

          {/* Content based on Active Tab */}
          {activeTab === 'viewComplaints' && (
            <ViewComplaints
              baseUrl={baseUrl}
              role={role}
              complaints={filteredComplaints}
              setComplaints={setComplaints}
              selectedComplaint={selectedComplaint}
              setSelectedComplaint={setSelectedComplaint}
              handleViewDetails={handleViewDetails}
              handleCloseModal={handleCloseModal}
              handleStatusChange={handleStatusChange}
              handleReplySubmit={handleReplySubmit}
              reply={reply}
              setReply={setReply}
              message={message}
              setMessage={setMessage}
            />
          )}
          {activeTab === 'createComplaint' && role === 'tourist' && (
            <CreateComplaint baseUrl={baseUrl} onComplaintCreated={handleComplaintCreated} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CombinedComplaints;