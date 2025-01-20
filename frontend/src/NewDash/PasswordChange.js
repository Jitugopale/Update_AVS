import React from 'react'
import { useNavigate } from "react-router-dom";
import { useRecoveryContext } from '../Pages/Authentication/RecoveryContext';
import axios from "axios"; // Axios to make HTTP request
import { useState } from "react";

const PasswordChange = () => {
    const [userId, setUserId] = useState(""); // State for userId
    const navigate = useNavigate();
    const { setRecoveryUserId } = useRecoveryContext(); // Destructure setRecoveryUserId
    const handlePasswordReset = async () => {
        if (userId) {
          setRecoveryUserId(userId); // Set the recovery userId in the context
    
          try {
            const response = await axios.post("http://localhost:5000/api/auth/send_recovery_email", {
              userId, // Use userId for password recovery
            });
    
            console.log(response.data);
            alert("A recovery email has been sent to your email address.");
            navigate("/otp-verification"); // Navigate to OTP Verification page directly
          } catch (error) {
            console.error("Error sending recovery email:", error);
            alert("Failed to send recovery email. Please try again later.");
          }
        } else {
          alert("Please enter your username to reset the password.");
        }
      };

      const inputStyle = {
        marginBottom: "10px",
        padding: "8px",
        width: "30%",
        boxSizing: "border-box",
      };
      

  return (
    <>
         <div className="container-fluid">
             <div className="d-flex align-items-center justify-content-center">
             <div
        className="p-2 mt-2"
        style={{ maxWidth: '1200px', width: '100%' }}
      >
             <h1 className="card-title" style={{color:'green'}}>RESET PASSWORD</h1>

             <label htmlFor="username" className="form-label mt-3">Enter USERNAME *</label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    placeholder="Username"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)} // Update state on change
                    required
                    style={inputStyle}
                  />
                  <div className="mb-3">
                  <a onClick={handlePasswordReset} style={{cursor:'pointer'}} className="text-decoration-none"><button>Submit</button></a>
                </div>
                </div>
              </div>
         </div>
    </>
  )
}

export default PasswordChange
