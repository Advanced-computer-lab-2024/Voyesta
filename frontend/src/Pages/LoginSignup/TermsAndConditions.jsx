import React, { useState } from 'react';

const TermsAndConditions = ({ onAccept }) => {
  const [accepted, setAccepted] = useState(false);

  const handleAcceptChange = (e) => {
    setAccepted(e.target.checked);
  };

  const handleContinue = () => {
    if (accepted) {
      onAccept();
    }
  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Terms and Conditions</h1>
      <div className="text-left overflow-y-auto h-64 p-4 border border-gray-300 rounded-lg">
        <p>
          <strong>1. Introduction</strong>
          <br />
          Welcome to our platform. By accessing or using our services, you agree to be bound by these terms and conditions.
        </p>
        <p>
          <strong>2. Use of the Platform</strong>
          <br />
          You agree to use the platform in accordance with all applicable laws and regulations. You must not use the platform for any unlawful or fraudulent purposes.
        </p>
        <p>
          <strong>3. User Accounts</strong>
          <br />
          You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
        </p>
        <p>
          <strong>4. Content</strong>
          <br />
          You retain ownership of the content you post on the platform. However, by posting content, you grant us a non-exclusive, royalty-free, worldwide license to use, reproduce, modify, and distribute your content.
        </p>
        <p>
          <strong>5. Prohibited Activities</strong>
          <br />
          You agree not to engage in any of the following prohibited activities: (a) copying, distributing, or disclosing any part of the platform in any medium; (b) using any automated system to access the platform; (c) interfering with the proper functioning of the platform.
        </p>
        <p>
          <strong>6. Termination</strong>
          <br />
          We may terminate or suspend your access to the platform at any time, without prior notice or liability, for any reason, including if you breach these terms and conditions.
        </p>
        <p>
          <strong>7. Limitation of Liability</strong>
          <br />
          To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
        </p>
        <p>
          <strong>8. Governing Law</strong>
          <br />
          These terms and conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which our company is established.
        </p>
        <p>
          <strong>9. Changes to Terms and Conditions</strong>
          <br />
          We reserve the right to modify these terms and conditions at any time. We will notify you of any changes by posting the new terms and conditions on the platform. Your continued use of the platform after any such changes constitutes your acceptance of the new terms and conditions.
        </p>
        <p>
          <strong>10. Contact Us</strong>
          <br />
          If you have any questions about these terms and conditions, please contact us at support@example.com.
        </p>
      </div>
      <div className="mt-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={accepted}
            onChange={handleAcceptChange}
          />
          <span className="ml-2">I accept the terms and conditions</span>
        </label>
      </div>
      <button
        onClick={handleContinue}
        className={`bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 ${!accepted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        disabled={!accepted}
      >
        Continue
      </button>
    </div>
  );
};

export default TermsAndConditions;