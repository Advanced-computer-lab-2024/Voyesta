import React from 'react';

const ErrorPopup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md text-center">
        <h2 className="text-xl font-bold mb-4">Error</h2>
        <p>{message}</p>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;