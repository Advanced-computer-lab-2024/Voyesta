import React, { useState } from 'react';
import axios from 'axios';

const UploadDocuments = ({ userType }) => {
  const [idDocument, setIdDocument] = useState(null);
  const [additionalDocument, setAdditionalDocument] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e, setFile) => {
	setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
	e.preventDefault();
	
	try {
		let formData = new FormData();			
		formData.append('idDocument', idDocument);
	  const resID = await axios.post(`http://localhost:3000/api/cloudinary/uploadId`, formData, getAuthHeaders());
	  
		formData = new FormData();
		formData.append('additionalDocument', additionalDocument);
		const resDocument = await axios.post(`http://localhost:3000/api/cloudinary/uploadAdditionalDocument`, formData, getAuthHeaders());
	  
		setMessage('Documents uploaded successfully!');
	  console.log(resID.data);
		console.log(resDocument.data);
	} catch (err) {
	  setMessage('Failed to upload documents.');
	  console.error(err);
	}
  };

  const getAuthHeaders = () => {
	return {
	  headers: {
		Authorization: `Bearer ${localStorage.getItem('token')}`,
	  },
	};
  };

  return (
	<div className="upload-documents">
	  <h2>Upload Documents</h2>
	  <form onSubmit={handleUpload}>
		<div>
		  <label>ID Document:</label>
		  <input type="file" onChange={(e) => handleFileChange(e, setIdDocument)} />
		</div>
		<div>
		  <label>
			{userType === 'tourGuide' ? 'Certificates' : 'Taxation Registry Card'}:
		  </label>
		  <input type="file" onChange={(e) => handleFileChange(e, setAdditionalDocument)} />
		</div>
		<button type="submit">Upload</button>
	  </form>
	  {message && <p>{message}</p>}
	</div>
  );
};

export default UploadDocuments;