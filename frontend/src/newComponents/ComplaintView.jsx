import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

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
    <div className="relative w-full max-w-sm overflow-y-scroll bg-white border border-gray-100 rounded-lg dark:bg-gray-700 dark:border-gray-600 h-96">
      {message && (
        <div className={`flex items-center p-4 mt-4 text-sm rounded-lg ${message.includes('successfully') ? 'text-green-800 border border-green-300 bg-green-50 dark:text-green-400 dark:border-green-800' : 'text-red-800 border border-red-300 bg-red-50 dark:text-red-400 dark:border-red-800'}`} role="alert">
          <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">{message.includes('successfully') ? 'Success!' : 'Error!'}</span> {message}
          </div>
        </div>
      )}
      <ul>
        {complaints.map((complaint) => (
          <li key={complaint._id} className="border-b border-gray-100 dark:border-gray-600">
            <a
              href="#"
              className="flex items-center justify-center w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => handleViewDetails(complaint)}
            >
              <div className="absolute left-7 me-3">
                {complaint.status === 'pending' ? (
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 w-6 h-6" />
                ) : (
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 w-6 h-6" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-500">{complaint.title}</h2>
                <p>Status: {complaint.status}</p>
                <span className="text-xs text-blue-600 dark:text-blue-500">{new Date(complaint.date).toLocaleDateString()}</span>
                <a href="#" className="text-blue-600 hover:underline ml-2">View Details</a>
              </div>
            </a>
          </li>
        ))}
      </ul>

      {selectedComplaint && (
        <div id="popup-modal" tabIndex="-1" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={handleCloseModal}>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 md:p-5 text-left">
                <h2 className="text-xl font-bold mb-4 text-center">{selectedComplaint.title}</h2>
                <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">{selectedComplaint.body}</p>
                <p className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">Date: {new Date(selectedComplaint.date).toLocaleDateString()}</p>
                <p className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4">Status: {selectedComplaint.status}</p>
                {role === 'tourist' && (
                  <div className="mt-4 ">
                    <h3 className="text-lg font-bold mb-2">Replies:</h3>
                    <ul className="list-disc list-inside">
                      {selectedComplaint.replies.map((reply, index) => (
                        <li key={index} className="flex items-start gap-2.5 mb-4">
                          <div className="flex flex-col gap-1 w-full max-w-[320px]">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{new Date(reply.date).toLocaleTimeString()}</span>
                            </div>
                            <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                              <p className="text-sm font-normal text-gray-900 dark:text-white">{reply.reply}</p>
                            </div>
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Received</span>
                          </div>
                          <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" data-dropdown-placement="bottom-start" className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600" type="button">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                              <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                            </svg>
                          </button>
                          <div id="dropdownDots" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                              <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Reply</a>
                              </li>
                              <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Forward</a>
                              </li>
                              <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Copy</a>
                              </li>
                              <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                              </li>
                              <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
                              </li>
                            </ul>
                          </div>
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewComplaints;