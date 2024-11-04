import React from 'react';

const ViewComplaints = ({
  baseUrl,
  role,
  complaints,
  setComplaints,
  selectedComplaint,
  setSelectedComplaint,
  handleViewDetails,
  handleCloseModal,
  handleStatusChange,
  handleReplySubmit,
  reply,
  setReply,
  message,
  setMessage
}) => {
  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-5/5 mx-auto">
      {message && <p className="text-red-500 mb-4">{message}</p>}
      <ul className="text-center">
        {complaints.map((complaint) => (
          <li key={complaint._id} className="border-b border-gray-200 last:border-0 p-2">
            <h2 className="text-lg font-medium text-gray-500">{complaint.title}</h2>
            <p>Status: {complaint.status}</p>
            <button
              className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
              onClick={() => handleViewDetails(complaint)}
            >
              View Details
            </button>
          </li>
        ))}
      </ul>

      {selectedComplaint && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">{selectedComplaint.title}</h2>
            <p><strong>Body:</strong> {selectedComplaint.body}</p>
            <p><strong>Date:</strong> {new Date(selectedComplaint.date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {selectedComplaint.status}</p>
            {role === 'tourist' && (
              <div className="mt-4">
                <h3 className="text-lg font-bold mb-2">Replies:</h3>
                <ul className="list-disc list-inside">
                  {selectedComplaint.replies.map((reply, index) => (
                    <li key={index} className="text-left">
                      <p>{reply.reply}</p>
                      <p className="text-sm text-gray-500">{new Date(reply.date).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {role === 'admin' && (
              <>
                <div className="flex justify-around mt-4">
                {selectedComplaint.status !== 'resolved' && (
                    <>
                  <button
                    className="bg-green-500 text-white rounded-lg p-2 hover:bg-green-700"
                    onClick={() => handleStatusChange('resolved')}
                  >
                    Mark as Resolved
                  </button>
                  
                    <button
                      className="bg-yellow-500 text-white rounded-lg p-2 hover:bg-yellow-700"
                      onClick={() => handleStatusChange('pending')}
                    >
                      Mark as Pending
                    </button>
                    </>
                  )}
                </div>
                <form onSubmit={handleReplySubmit} className="mt-4">
                  <label htmlFor="reply" className="block text-sm font-medium text-gray-700">Reply</label>
                  <textarea
                    id="reply"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
                  >
                    Send Reply
                  </button>
                </form>
              </>
            )}
            {message && <p className="text-green-500 mt-4">{message}</p>}
            <button
              className="bg-red-500 text-white rounded-lg p-2 mt-4 hover:bg-red-700"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewComplaints;