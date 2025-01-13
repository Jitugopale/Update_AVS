import React, { useState } from "react";
import axios from "axios"; // Axios to make HTTP requests
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import MainNavbar from "./MainNavbar";
import img from "./images/back2.jpg"
import { useRecoveryContext } from '../Authentication/RecoveryContext.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState(""); // State for userId
  const [password, setPassword] = useState(""); // State for password
  const [error, setError] = useState(""); // State for error messages
  const [message, setMessage] = useState(""); // State for success messages
  // const [clickedFields, setClickedFields] = useState({
  //   email: false,
  //   password: false,
  // });
  const navigate = useNavigate();
  const { setRecoveryUserId } = useRecoveryContext(); // Destructure setRecoveryUserId

  // Handle form submission
  // const handleLogin = async (e) => {
  //   e.preventDefault(); // Prevent page reload on form submission
  //   setError(""); // Reset error messages
  //   setMessage(""); // Reset success messages
    

  //   try {
  //     // Send the login request to the backend
  //     const response = await axios.post("http://localhost:5000/api/auth/banklogin", {
  //       userId,
  //       password,
  //     });

  //     // On success, show a success message
  //     setMessage(response.data.message);
  //     console.log("Login successful, redirecting to Dashboard...");
  //     navigate('/dashboard');
  //   } catch (err) {
  //     // Handle error response
  //     if (err.response && err.response.data) {
  //       setError(err.response.data.error || "Something went wrong!");
  //     } else {
  //       setError("Server not reachable.");
  //     }
  //   }
  // };
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
  
    try {
      const response = await axios.post("http://localhost:5000/api/auth/banklogin", {
        userId,
        password,
      });
  
      // Check if the response contains authToken
      if (response.data.authToken) {
        setMessage(response.data.message);
        localStorage.setItem('token', response.data.authToken); // Store the authToken in localStorage
        console.log("Login successful, redirecting to Dashboard...");
        navigate('/dashboard'); // Redirect to the dashboard
      } else {
        setError("Login failed. No token received.");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Something went wrong!");
      } else {
        setError("Server not reachable.");
      }
    }
  };
  
  

   // Function to handle password reset
   // Function to handle password reset
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

  return (
    <>
       <div style={{ backgroundImage: `url(${img})`, height:'100vh'}}>
       <MainNavbar/>
        <div className="container-fluid d-flex align-items-center justify-content-center" style={{marginTop:'70px'}}>
   
        {/* <div className="col-12 text-center mb-4">
          <div className="bg-primary text-white py-2">
            <img src="/path-to-logo.png" alt="Company Logo" style={{ maxHeight: "50px" }} className="me-2" />
            <span className="fs-4 fw-bold">In-so-Tech Pvt. Ltd.</span>
          </div>
        </div> */}
       

        {/* Login Box */}
      
          <div className="card shadow" style={{ width: "400px" }}>
            <div className="card-body">
              <h3 className="text-center mb-4">Login</h3>
              <form onSubmit={handleLogin}>
                {/* Username Field */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">USERNAME *</label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    placeholder="Username"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)} // Update state on change
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">PASSWORD *</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Update state on change
                    required
                  />
                </div>

                {/* Forgot Password Link */}
                <div className="mb-3 text-center">
                  <a onClick={handlePasswordReset} style={{cursor:'pointer'}} className="text-decoration-none">Forgot Password?</a>
                </div>

                {/* Login Button */}
                <button type="submit" className="btn btn-success w-100">LOGIN</button>

                {/* Register Link */}
                <div className="mt-3 text-center">
                  <span>Don't have an account? </span>
                  <Link to="/register" className="text-decoration-none">Register Here</Link>
                </div>
              </form>

              {/* Display error or success message */}
              {error && <div className="alert alert-danger mt-3">{error}</div>}
              {message && <div className="alert alert-success mt-3">{message}</div>}
            </div>
          </div>
      
    
    </div>
       </div>
    </>
  );
};

export default LoginPage;
