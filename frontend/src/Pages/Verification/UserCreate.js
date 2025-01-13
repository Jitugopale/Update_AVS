import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BranchUserTable from './BranchUserTable';

const UserCreate = () => {
  const [userId, setUserId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchNextUserId = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/newUser/nextUserId');
        setUserId(response.data.nextUserId);
      } catch (error) {
        console.error('Error fetching next user ID:', error);
      }
    };

    fetchNextUserId();
  }, []);

  const handleClear = () => {
    setUserId('');
    setBranchId('');
    setMobileNumber('');
    setPassword('');
    setUserName('');
    setBranchName('');
    setEmail('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    const newUser = {
      userId,
      branchId,
      mobileNumber,
      password,
      userName,
      branchName,
      email,
      confirmPassword,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/newUser/newBranchUser', newUser);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Server error');
    }
  };

  return (
    <>
      <div className="container">
        <div className="p-3" style={{ maxWidth: '1200px', width: '100%' }}>
          <h5 className="mb-3">Dashboard / Branch Master Details</h5>

          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="userId" className="form-label">User ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="userId"
                  value={userId}
                  readOnly
                />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="branchId" className="form-label">Branch ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="branchId"
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="password" className="form-label">Set Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="userName" className="form-label">User Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="branchName" className="form-label">Branch Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="branchName"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="email" className="form-label">Email ID</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex justify-content-center mt-4">
              <button type="submit" className="btn btn-primary me-3">Submit</button>
              <button type="reset" className="btn btn-secondary" onClick={handleClear}>Clear</button>
            </div>
          </form>
          <BranchUserTable />
        </div>
      </div>
    </>
  );
};

export default UserCreate;
