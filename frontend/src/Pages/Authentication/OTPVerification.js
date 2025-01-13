import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { useRecoveryContext } from '../Authentication/RecoveryContext';

const OTPVerification = () => {
  const [userId, setUserId] = useState(''); // Replaced email with userId state
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { recoveryUserId } = useRecoveryContext(); // Assuming userId is coming from RecoveryContext
  const navigate = useNavigate(); // Initialize navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

     // Log the userId being passed
  console.log('Sending userId:', recoveryUserId || userId);

    // Check if the new password is provided
    if (!newPassword) {
      setError('New password is required.');
      setLoading(false);
      return;
    }

    try {
      // Send userId, OTP, and newPassword to backend
      const response = await axios.post('http://localhost:5000/api/auth/verify_otp', {
        userId: recoveryUserId || userId, // Send userId instead of email
        otp,
        newPassword,  // New password is being sent to the backend
      });

      // Handle success response
      if (response.data.message) {
        alert('Password successfully updated!');
        navigate('/login'); // Redirect to login after success
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container contain-2 mt-5">
      <h2 className="heading-login">Verify OTP and Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="userId" className="form-label">Enter Your User ID</label>
          <input
            type="text"
            className="form-control"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)} // Handle userId input change
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="otp" className="form-label">Enter OTP</label>
          <input
            type="text"
            className="form-control"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-danger">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default OTPVerification;
