import React from "react";
import Logout from "../Pages/Authentication/Logout";
import UserProfile from "../Pages/Authentication/UserProfile";
import axios from "axios";
import { useState, useEffect } from "react";

const Nav = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null);

  // On component mount, fetch the user and photo
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const token = localStorage.getItem('token'); // Retrieve token from local storage
  //       if (!token) {
  //         setError("User not authenticated. Please log in.");
  //         setLoading(false); // Stop loading
  //         return;
  //       }

  //       // Send the token to fetch user data
  //       const response = await axios.get('http://localhost:5000/api/auth/getbank', {
  //         headers: {
  //           'auth-token': token, // Send token in 'auth-token' header as required by fetchuser middleware
  //         },
  //       });

  //       // Check if user data exists and set it
  //       if (response.data) {
  //         setUser(response.data);
  //         const data = response.data;
  //       } else {
  //         setError('No user data found.');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user data:', error);
  //       setError('Error fetching user data. Please try again.');
  //     } finally {
  //       setLoading(false); // Stop loading in both success and error cases
  //     }
  //   };

  //   fetchUser();
  // }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token in local storage", token);

        // Check if token exists, otherwise show error and return
        if (!token) {
          setError("User not authenticated. Please log in.");
          setLoading(false);
          return;
        }

        // Make the API request with the token
        const response = await axios.get(
          "http://localhost:5000/api/auth/getbank",
          {
            headers: {
              "auth-token": token, // Attach token to the header for authentication
            },
          }
        );

        // Check if response contains data and update state
        if (response.data) {
          setUser(response.data);
        } else {
          setError("No user data found.");
        }
      } catch (error) {
        // Handle error during API call
        console.error("Error fetching user data:", error);
        if (error.response) {
          // Handle server-side error
          setError(error.response.data.error || "Error fetching user data.");
        } else {
          // Handle client-side error (e.g., network issues)
          setError("Error fetching user data. Please try again.");
        }
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };

    fetchUser(); // Call the async function
  }, []);

  const { bankName } = user || {};

  return (
    <>
      <style>
        {`
    @media (max-width: 576px) {
      .hidden-on-mobile, .logout-container {
        display: none;
      }
      .height {
        max-height: 70px;
      }
      .btn-info{
      max-height: 40px
      }
    }
  `}
      </style>

      {/* <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <button type="button" id="sidebarCollapse" className="btn btn-info">
          <i className="fas fa-align-left" />
          <i className="bx bx-menu"></i>
        </button>
        <button
          className="btn btn-dark d-inline-block d-lg-none ml-auto"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-align-justify" />
        </button>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link navbar-brand" href="#">
                AVS Verify
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link mt-2" href="#">
                Onboarding Solution
              </a>
            </li>
            <li className="nav-item" style={{marginLeft:'800px'}}>
              <Logout/>
            </li>
          </ul>
        </div>
      </nav> */}

      <nav className="container-fluid navbar navbar-expand-lg navbar-light bg-light height">
        <div className="d-flex">
          <button type="button" id="sidebarCollapse" className="btn btn-info" style={{height:'40px'}}>
            <i className="fas fa-align-left" />
            <i className="bx bx-menu"></i>
        </button>
        <div>
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="navbar-brand" href="#">
                {bankName}
              </a>
            </li>
            <li className="nav-item hidden-on-mobile">
              <a className="nav-link mt-2 text" href="#">
                Onboarding Solution
              </a>
            </li>
            <li className="nav-item hidden-on-mobile" style={{marginLeft:'820px',marginTop:'10px'}}>
              <Logout/>
            </li>
            <li className="nav-item hidden-on-mobile">
              <UserProfile/>
            </li>
          </ul>
        </div>
        </div>
      </nav>

      {/* <nav>
        <div className="container-fluid">
          <div className="d-flex justify-content-center align-items-center">
            <div className="row">
              <div className="col-2">
                <button
                  type="button"
                  id="sidebarCollapse"
                  className="btn btn-info"
                  style={{ height: "40px" }}
                >
                  <i className="fas fa-align-left" />
                  <i className="bx bx-menu"></i>
                </button>
              </div>
              <div className="col-4">
                <li>
                  <a href="#">
                    {bankName}
                  </a>
                </li>
                <li>
                  <a href="#">
                    Onboarding Solution
                  </a>
                </li>
              </div>
              <div className="col-2">
                <li
                  className="nav-item hidden-on-mobile"
                  style={{ marginLeft: "820px", marginTop: "10px" }}
                >
                  <Logout />
                </li>
              </div>
              <div className="col-2">
                <li className="nav-item hidden-on-mobile">
                  <UserProfile />
                </li>
              </div>
            </div>
          </div>
        </div>
      </nav> */}
    </>
  );
};

export default Nav;
