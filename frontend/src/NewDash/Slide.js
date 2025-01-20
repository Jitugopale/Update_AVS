import React from 'react'
import { Link } from 'react-router-dom'
import axios from "axios";
import { useState, useEffect } from 'react';
import Logout from '../Pages/Authentication/Logout';

const Slide = () => {
      const [isOpen, setIsOpen] = useState(false);
      const [PanSuiteisOpen, setPanIsOpen] = useState(false);
      const [IdentityisOpen, setItentityIsOpen] = useState(false);
      const [CorporateisOpen, setCorporateIsOpen] = useState(false);
      const [CreditisOpen, setCreditIsOpen] = useState(false);
      const [BranchisOpen, setBranchIsOpen] = useState(false);
      const [UserisOpen, setUserIsOpen] = useState(false);
       const [user, setUser] = useState(null);
        const [loading, setLoading] = useState(true); // State for loading
        const [error, setError] = useState(null);
      
    
    const toggleSubmenu = (e) => {
        e.preventDefault();
        setIsOpen((prevState) => !prevState);
      };
    
      const togglePanSuiteSubmenu = (e) => {
        e.preventDefault();
        setPanIsOpen((prevState) => !prevState);
      };
    
      const toggleIdentitySubmenu = (e) => {
        e.preventDefault();
        setItentityIsOpen((prevState) => !prevState);
      };

      const toggleCorporateSubmenu = (e) => {
        e.preventDefault();
        setCorporateIsOpen((prevState) => !prevState);
      };
      
      const toggleCreditSubmenu = (e) => {
        e.preventDefault();
        setCreditIsOpen((prevState) => !prevState);
      };

      const toggleBranchSubmenu = (e) => {
        e.preventDefault();
        setBranchIsOpen((prevState) => !prevState);
      };
      
      const toggleUserSubmenu = (e) => {
        e.preventDefault();
        setUserIsOpen((prevState) => !prevState);
      };

      useEffect(() => {
        const fetchUser = async () => {
          try {
            const token = localStorage.getItem('token');
            console.log("Token in local storage", token);
    
            // Check if token exists, otherwise show error and return
            if (!token) {
              setError("User not authenticated. Please log in.");
              setLoading(false);
              return;
            }
    
            // Make the API request with the token
            const response = await axios.get('http://localhost:5000/api/auth/getbank', {
              headers: {
                'auth-token': token, // Attach token to the header for authentication
              },
            });
    
            // Check if response contains data and update state
            if (response.data) {
              setUser(response.data);
            } else {
              setError('No user data found.');
            }
          } catch (error) {
            // Handle error during API call
            console.error('Error fetching user data:', error);
            if (error.response) {
              // Handle server-side error
              setError(error.response.data.error || 'Error fetching user data.');
            } else {
              // Handle client-side error (e.g., network issues)
              setError('Error fetching user data. Please try again.');
            }
          } finally {
            // Set loading to false regardless of success or failure
            setLoading(false);
          }
        };
    
        fetchUser(); // Call the async function
      }, []);
      
      const { role } = user || {};
  

      
  return (
    <>
      <nav id="sidebar">
        <ul className="list-unstyled components">
           <li>
          {/* Conditionally render based on user role */}
          {role === 'admin' ? (
            <Link to="/adminDashboard">Admin Dashboard</Link>
          ) : (
            <Link to="/dashboard">Dashboard</Link>
          )}
        </li>
          <li>
            <Link
              href="#pageSubmenu"
              onClick={toggleSubmenu}
              className="dropdown-toggle"
              aria-expanded={isOpen}
            >
              Verification
              <i
                className={`bx ms-2 ${
                  isOpen ? "bx-chevron-down" : "bx-chevron-right"
                }`}
              ></i>
            </Link>
            <ul
              className={`collapse list-unstyled ${isOpen ? "show" : ""}`}
              id="pageSubmenu"
            >
              {/* Pan suite */}
              <li>
                <Link
                  href="#pageSubmenu"
                  onClick={togglePanSuiteSubmenu}
                  className="dropdown-toggle"
                  aria-expanded={PanSuiteisOpen}
                >
                  PAN SUITE
                  <i
                    className={`bx ms-2 ${
                      PanSuiteisOpen ? "bx-chevron-down" : "bx-chevron-right"
                    }`}
                  ></i>
                </Link>
                <ul
                  className={`collapse list-unstyled ${PanSuiteisOpen ? "show" : ""}`}
                  id="pageSubmenu"
                >
                  <li>
                  <Link to="pan"  className="color">PAN</Link>
                  </li>
                  <li>
                  <Link to="pandetail"  className="color">PAN DETAIL</Link>
                  </li>
                </ul>
              </li>
              {/* Pan suite */}
              {/* INDIVIDUAL IDENTIFY VERIFICATION */}
              <li>
                <Link
                  href="#pageSubmenu"
                  onClick={toggleIdentitySubmenu}
                  className="dropdown-toggle"
                  aria-expanded={IdentityisOpen}
                >
                  INDIVIDUAL IDENTIFY
                  <i
                    className={`bx ms-2 ${
                      IdentityisOpen ? "bx-chevron-down" : "bx-chevron-right"
                    }`}
                  ></i>
                </Link>
                <ul
                  className={`collapse list-unstyled ${IdentityisOpen ? "show" : ""}`}
                  id="pageSubmenu"
                >
                  <li>
                  <Link to="aadhaar"  className="color">AADHAAR VERIFICATION</Link>
                  </li>
                  <li>
                  <Link to="voter"  className="color">VOTER</Link>
                  </li>
                  <li>
                  <Link to="passport"  className="color">PASSPORT ID</Link>
                  </li>
                </ul>
              </li>
              {/* INDIVIDUAL IDENTIFY VERIFICATION */}
              {/* CORPORATE VERIFICATION */}
              <li>
                <Link
                  href="#pageSubmenu"
                  onClick={toggleCorporateSubmenu}
                  className="dropdown-toggle"
                  aria-expanded={CorporateisOpen}
                >
                  CORPORATE VERIFICATION
                  <i
                    className={`bx ms-2 ${
                      CorporateisOpen ? "bx-chevron-down" : "bx-chevron-right"
                    }`}
                  ></i>
                </Link>
                <ul
                  className={`collapse list-unstyled ${CorporateisOpen ? "show" : ""}`}
                  id="pageSubmenu"
                >
                  <li>
                  <Link to="gst"  className="color">GST VERIFICATION</Link>
                  </li>
                  <li>
                  <Link to="udyam"  className="color">UDYAM AADHAAR</Link>
                  </li>
                </ul>
              </li>
              {/* CORPORATE VERIFICATION */}
              {/* CREDIT CHECK */}
              <li>
                <Link
                  href="#pageSubmenu"
                  onClick={toggleCreditSubmenu}
                  className="dropdown-toggle"
                  aria-expanded={CreditisOpen}
                >
                  CREDIT CHECK
                  <i
                    className={`bx ms-2 ${
                      CreditisOpen ? "bx-chevron-down" : "bx-chevron-right"
                    }`}
                  ></i>
                </Link>
                <ul
                  className={`collapse list-unstyled ${CreditisOpen ? "show" : ""}`}
                  id="pageSubmenu"
                >
                  <li>
                  <Link to="credit"  className="color">COMBO CIBIL</Link>
                  </li>
                </ul>
              </li>
              {/* CREDIT CHECK */}
            </ul>
          </li>

          <li>
            <Link to="passwordChange">Password Change</Link>
          </li>
          <li>
                <Link
                  href="#pageSubmenu"
                  onClick={toggleUserSubmenu}
                  className="dropdown-toggle"
                  aria-expanded={UserisOpen}
                >
                  Branch User Create
                  <i
                    className={`bx ms-2 ${
                      UserisOpen ? "bx-chevron-down" : "bx-chevron-right"
                    }`}
                  ></i>
                </Link>
                <ul
                  className={`collapse list-unstyled ${UserisOpen ? "show" : ""}`}
                  id="pageSubmenu"
                >
                  <li>
                    <Link to="userCreate">User Create</Link>
                  </li>
                </ul>
              </li>
          <li>
                <Link
                  href="#pageSubmenu"
                  onClick={toggleBranchSubmenu}
                  className="dropdown-toggle"
                  aria-expanded={BranchisOpen}
                >
                  Branch Create
                  <i
                    className={`bx ms-2 ${
                      BranchisOpen ? "bx-chevron-down" : "bx-chevron-right"
                    }`}
                  ></i>
                </Link>
                <ul
                  className={`collapse list-unstyled ${BranchisOpen ? "show" : ""}`}
                  id="pageSubmenu"
                >
                  <li>
                    <Link to="branch">Branch Create</Link>
                  </li>
                </ul>
              </li>
          {/* <li>
            <Link to="#">Branch Create</Link>
          </li> */}
          {/* <li>
            <Link to="#">User Branch Change</Link>
          </li>
          <li>
            <Link to="#">Onboarding Suit</Link>
          </li>
          <li>
            <Link to="#">Complaint</Link>
          </li> */}
          <li style={{marginLeft:'70px'}} className='mt-2'>
            <Logout/>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Slide
