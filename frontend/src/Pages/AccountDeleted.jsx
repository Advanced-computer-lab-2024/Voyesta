import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AccountDeleted() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect the user to the homepage or any other page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/'); // Redirect to home or another route
    }, 3000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-4">Account Deleted</h1>
        <p className="text-gray-500">Your account has been deleted successfully.</p>
        <p className="text-gray-500">You will be redirected shortly...</p>
      </div>
    </div>
  );
}

export default AccountDeleted;
