import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

// Create context
const RecoveryContext = createContext();

// Custom hook to use the RecoveryContext
export const useRecoveryContext = () => {
  return useContext(RecoveryContext);
};

// RecoveryContext provider component
export const RecoveryProvider = ({ children }) => {
  const [userId, setUserId] = useState('');
  const [OTP, setOTP] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState('');
  const [recoveryUserId, setRecoveryUserId] = useState('');

  const sendRecoveryEmail = async () => {
    if (!userId) {
      setMessage('Please enter your user ID');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/send_recovery_email', {
        userId: userId,
        OTP: OTP,
      });
      setMessage(response.data || 'OTP sent successfully!');
    } catch (error) {
      setMessage(error.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RecoveryContext.Provider
      value={{
        userId,
        setUserId,
        OTP,
        setOTP,
        isLoading,
        message,
        setPage,
        page,
        sendRecoveryEmail,
        recoveryUserId,
        setRecoveryUserId
      }}
    >
      {children}
    </RecoveryContext.Provider>
  );
};
