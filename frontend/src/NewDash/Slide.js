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
      const [PasswordisOpen, setPasswordIsOpen] = useState(false);
      const [EnableisOpen, setEnableisOpen] = useState(false);
      const [RoleisOpen, setRoleisOpen] = useState(false);
      const [BankCreditisOpen, setBankCreditisOpen] = useState(false);
      const [AVSAdminisOpen, setAVSAdminisOpen] = useState(false);
      const [AdminBankisOpen, setAVSAdminBankisOpen] = useState(false);
      const [AddBankCreditisOpen, setAddBankCreditisOpen] = useState(false);
      const [ActivationisOpen, setActivationisOpen] = useState(false);
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

      const togglePasswordSubmenu = (e) => {
        e.preventDefault();
        setPasswordIsOpen((prevState) => !prevState);
      };
      const toggleEnableSubmenu = (e) => {
        e.preventDefault();
        setEnableisOpen((prevState) => !prevState);
      };
      const toggleRoleSubmenu = (e) => {
        e.preventDefault();
        setRoleisOpen((prevState) => !prevState);
      };
      const toggleBankCreditSubmenu = (e) => {
        e.preventDefault();
        setBankCreditisOpen((prevState) => !prevState);
      };
      const toggleAVSAdminSubmenu = (e) => {
        e.preventDefault();
        setAVSAdminisOpen((prevState) => !prevState);
      };
      const toggleAdminBankSubmenu = (e) => {
        e.preventDefault();
        setAVSAdminBankisOpen((prevState) => !prevState);
      };
      const toggleAddBankCreditSubmenu = (e) => {
        e.preventDefault();
        setAddBankCreditisOpen((prevState) => !prevState);
      };
      const toggleActivationSubmenu = (e) => {
        e.preventDefault();
        setActivationisOpen((prevState) => !prevState);
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
      
      const role = user?.role || 'admin'; // Default role set to "user"
  

      
  return (
    <>
      <nav id="sidebar">
        <ul className="list-unstyled components">
           <li>
          {/* Conditionally render based on user role */}
          
          <Link to={role === 'admin' ? "/adminDashboard" : "/dashboard"}>
            {role === 'admin' ? "Admin Dashboard" : "Dashboard"}
          </Link>
          
        </li>
         {/* User Only Routes */}
         {role === "user" && ( 
          <>
           <li>
                <Link
                  href="#pageSubmenu"
                  onClick={toggleBankCreditSubmenu}
                  className="dropdown-toggle"
                  aria-expanded={BankCreditisOpen}
                >
                  API Credits
                  <i
                    className={`bx ms-2 ${
                      BankCreditisOpen ? "bx-chevron-down" : "bx-chevron-right"
                    }`}
                  ></i>
                </Link>
                <ul
                  className={`collapse list-unstyled ${BankCreditisOpen ? "show" : ""}`}
                  id="pageSubmenu"
                >
                  <li>
                    <Link to="apicredits">API Credits</Link>
                  </li>
                </ul>
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
                <Link
                  href="#pageSubmenu"
                  onClick={togglePasswordSubmenu}
                  className="dropdown-toggle"
                  aria-expanded={PasswordisOpen}
                >
                  Password Change
                  <i
                    className={`bx ms-2 ${
                      PasswordisOpen ? "bx-chevron-down" : "bx-chevron-right"
                    }`}
                  ></i>
                </Link>
                <ul
                  className={`collapse list-unstyled ${PasswordisOpen ? "show" : ""}`}
                  id="pageSubmenu"
                >
                  <li>
                    <Link to="passchange">Password Change</Link>
                  </li>
                </ul>
              </li>
          <li>
                <Link
                  href="#pageSubmenu"
                  onClick={toggleUserSubmenu}
                  className="dropdown-toggle"
                  aria-expanded={UserisOpen}
                >
                  Master
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
                    <Link to="usercreated">User Creation</Link>
                  </li>
                  <li>
                    <Link to="master">Branch Master</Link>
                  </li>
                  <li>
                    <Link to="rolemaster">Role Master</Link>
                  </li>
                </ul>
              </li>
          {/* <li>
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
                    <Link to="master">Branch Create</Link>
                  </li>
                </ul>
              </li> */}
          {/* <li>
                <Link
                  href="#pageSubmenu"
                  onClick={toggleRoleSubmenu}
                  className="dropdown-toggle"
                  aria-expanded={BranchisOpen}
                >
                  Role Master
                  <i
                    className={`bx ms-2 ${
                      RoleisOpen ? "bx-chevron-down" : "bx-chevron-right"
                    }`}
                  ></i>
                </Link>
                <ul
                  className={`collapse list-unstyled ${RoleisOpen ? "show" : ""}`}
                  id="pageSubmenu"
                >
                  <li>
                    <Link to="rolemaster">Role Master</Link>
                  </li>
                </ul>
              </li> */}
          <li>
                <Link
                  href="#pageSubmenu"
                  onClick={toggleEnableSubmenu}
                  className="dropdown-toggle"
                  aria-expanded={EnableisOpen}
                >
                  User Enable/Disable
                  <i
                    className={`bx ms-2 ${
                      EnableisOpen ? "bx-chevron-down" : "bx-chevron-right"
                    }`}
                  ></i>
                </Link>
                <ul
                  className={`collapse list-unstyled ${EnableisOpen ? "show" : ""}`}
                  id="pageSubmenu"
                >
                  <li>
                    <Link to="userenabdis">User Enable/Disable</Link>
                  </li>

               
                </ul>
                
              </li>

              <li style={{marginLeft:'35px'}} className='mt-2'>
                <ul>
                <Logout/>
                </ul>
            
          </li>
              
              
              </>

        
          )} 


         {/* Admin-Only Routes */}
        {role === "admin" && (
          <>
           <li>
                <Link
                  href="#pageSubmenu"
                  onClick={toggleAVSAdminSubmenu}
                  className="dropdown-toggle"
                  aria-expanded={AVSAdminisOpen}
                >
                  AVS ADMIN
                  <i
                    className={`bx ms-2 ${
                      AVSAdminisOpen ? "bx-chevron-down" : "bx-chevron-right"
                    }`}
                  ></i>
                </Link>
                <ul
                  className={`collapse list-unstyled ${AVSAdminisOpen ? "show" : ""}`}
                  id="pageSubmenu"
                >
                  <li>
                    <Link to="avsAdmin">AVS ADMIN</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link
                  href="#pageSubmenu"
                  onClick={toggleAdminBankSubmenu}
                  className="dropdown-toggle"
                  aria-expanded={AdminBankisOpen}
                >
                  Admin Bank Register
                  <i
                    className={`bx ms-2 ${
                      AdminBankisOpen ? "bx-chevron-down" : "bx-chevron-right"
                    }`}
                  ></i>
                </Link>
                <ul
                  className={`collapse list-unstyled ${AdminBankisOpen ? "show" : ""}`}
                  id="pageSubmenu"
                >
                  <li>
                    <Link to="adminbank">Admin Bank Register</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link
                  href="#pageSubmenu"
                  onClick={toggleAddBankCreditSubmenu}
                  className="dropdown-toggle"
                  aria-expanded={AddBankCreditisOpen}
                >
                  Add Credit
                  <i
                    className={`bx ms-2 ${
                      AddBankCreditisOpen ? "bx-chevron-down" : "bx-chevron-right"
                    }`}
                  ></i>
                </Link>
                <ul
                  className={`collapse list-unstyled ${AddBankCreditisOpen ? "show" : ""}`}
                  id="pageSubmenu"
                >
                  <li>
                    <Link to="bankCredit">Add Credit</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link
                  href="#pageSubmenu"
                  onClick={toggleActivationSubmenu}
                  className="dropdown-toggle"
                  aria-expanded={ActivationisOpen}
                >
                  Activation
                  <i
                    className={`bx ms-2 ${
                      ActivationisOpen ? "bx-chevron-down" : "bx-chevron-right"
                    }`}
                  ></i>
                </Link>
                <ul
                  className={`collapse list-unstyled ${ActivationisOpen ? "show" : ""}`}
                  id="pageSubmenu"
                >
                  <li>
                    <Link to="activate">Activation</Link>
                  </li>
                </ul>
              </li>
               <li style={{marginLeft:'35px'}} className='mt-2'>
                <ul>
                <Logout/>
                </ul>
            
          </li>

           
          </>
        )}
         
        </ul>
      </nav>
    </>
  )
}

export default Slide
