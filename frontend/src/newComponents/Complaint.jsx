import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ComplaintFilter from './ComplaintFilter';
import SortByDate from './SortByDate';
import ViewComplaints from './ComplaintView';
import CreateComplaint from './CreateComplaint';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const ComplaintsView = ({ role }) => {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [reply, setReply] = useState('');
  const [message, setMessage] = useState('');
  const [isCreatingComplaint, setIsCreatingComplaint] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/${role}/getComplaints`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  }, [role]);

  const filteredComplaints = complaints
    .filter(complaint => statusFilter === '' || complaint.status === statusFilter)
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortOrder === 'desc') {
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const handleCloseModal = () => {
    setSelectedComplaint(null);
    setIsCreatingComplaint(false);
  };

  const handleStatusChange = async (status) => {
    try {
      const response = await axios.patch(`http://localhost:3000/api/${role}/updateComplaintStatus/${selectedComplaint._id}`, { status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSelectedComplaint({ ...selectedComplaint, status: response.data.status });
      setComplaints(complaints.map(c => c._id === selectedComplaint._id ? { ...c, status: response.data.status } : c));
      setMessage('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage('Error updating status');
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`http://localhost:3000/api/${role}/replyToComplaint/${selectedComplaint._id}`, { reply }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSelectedComplaint({ ...selectedComplaint, replies: response.data.replies });
      setComplaints(complaints.map(c => c._id === selectedComplaint._id ? { ...c, replies: response.data.replies } : c));
      setReply('');
      setMessage('Reply added successfully');
    } catch (error) {
      console.error('Error adding reply:', error);
      setMessage('Error adding reply');
    }
  };

  const handleComplaintCreated = () => {
    setIsCreatingComplaint(false);
    // Refresh the complaints list
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/${role}/getComplaints`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  };

  const handleResetFilters = () => {
    setStatusFilter('');
    setSortOrder('');
  };

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-lg px-4 2xl:px-0">
        <div className="lg:flex lg:items-center lg:justify-between lg:gap-4">
          <h2 className="shrink-0 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Complaints ({filteredComplaints.length})</h2>

          {role === 'admin' && (
            <div className="flex gap-4">
              <ComplaintFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
              <SortByDate sortOrder={sortOrder} setSortOrder={setSortOrder} />
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 mb-3 me-3 text-sm font-medium text-center text-white bg-red-700 rounded-lg md:mb-0 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
            </div>
          )}

          {role === 'tourist' && (
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 mb-3 me-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg md:mb-0 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => setIsCreatingComplaint(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Create Complaint
            </button>
          )}
        </div>

        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-200 dark:divide-gray-800">
            {filteredComplaints.map((complaint, index) => (
              <div key={index} className="space-y-4 py-6 md:py-8">
                <div className="grid gap-4">
                  <div>
                    <span className="inline-block rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300 md:mb-0">{complaint.replies.length} replies</span>
                  </div>
                  <a href="#" className="text-xl font-semibold text-gray-900 hover:underline dark:text-white" onClick={() => handleViewDetails(complaint)}>{complaint.title}</a>
                </div>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">{complaint.body}</p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Submitted {new Date(complaint.date).toLocaleDateString()} by
                  <a href="#" className="text-gray-900 hover:underline dark:text-white"> {complaint.tourist?.name || 'Unknown'}</a>
                </p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status: <span className={`font-semibold ${complaint.status === 'resolved' ? 'text-green-600' : 'text-red-600'}`}>{complaint.status}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {selectedComplaint && (
          <ViewComplaints
            baseUrl={`http://localhost:3000/api/${role}`}
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

        {isCreatingComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
            <div className="relative p-4 w-full max-w-xl max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button
                  type="button"
                  className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={handleCloseModal}
                >
                  <FontAwesomeIcon icon={faTimes} />
                  <span className="sr-only">Close modal</span>
                </button>
                <CreateComplaint
                  baseUrl={`http://localhost:3000/api/${role}`}
                  onComplaintCreated={handleComplaintCreated}
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center lg:justify-start">
          <button type="button" className="w-full rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto">View more complaints</button>
        </div>
      </div>
    </section>
  );
};

export default ComplaintsView;