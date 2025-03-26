import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Cookies from "js-cookie";

const Logout = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal state
  const navigate = useNavigate();

  // Manual Logout Function
 // Manual Logout Function
const handleLogout = () => {
  const confirmLogout = window.confirm("Are you sure you want to log out?");
  if (confirmLogout) {
    setLoading(true);
    setTimeout(() => {
      try {
        sessionStorage.removeItem('token');  // Clear sessionStorage
        sessionStorage.removeItem('userData');

        Cookies.remove('token');  // Clear Cookies
        Cookies.remove('userData');

        navigate('/login');
      } catch (error) {
        console.error("Error during logout", error);
      } finally {
        setLoading(false);
      }
    }, 500);
  }
};

// Confirm Auto Logout
const confirmAutoLogout = () => {
  setShowModal(false);

  sessionStorage.removeItem("token");  // Clear sessionStorage
  sessionStorage.removeItem("userData");

  Cookies.remove("token");  // Clear Cookies
  Cookies.remove("userData");

  navigate("/login");
};


  // Auto Logout after 2 minutes of inactivity
  useEffect(() => {
    let logoutTimer;

    // const resetTimer = () => {
    //   clearTimeout(logoutTimer);
    //   logoutTimer = setTimeout(() => {
    //     setShowModal(true); // Show modal instead of alert
    //   }, 120000); // 2 minutes (120,000 ms)
    // };

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
        setShowModal(true); // Show modal instead of alert
      }, 1800000); // 30 minutes (1,800,000 ms)
    };
    

    // Attach event listeners to detect user activity
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    resetTimer(); // Start the timer

    // Cleanup function when component unmounts
    return () => {
      clearTimeout(logoutTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [navigate]);


  return (
    <>
      <div role="alert">
        <button
          style={{
            bottom: '6px',
            right: '60px',
            display: 'flex',
            position: 'relative',
          }}
          className="btn btn-danger"
          onClick={handleLogout}
          disabled={loading}
          aria-label="Logout button"
        >
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      {/* Auto Logout Modal */}
      <Modal show={showModal} onHide={confirmAutoLogout} centered>
        <Modal.Header closeButton>
          <Modal.Title>Session Timeout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have been inactive for 30 minutes. You will be logged out.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={confirmAutoLogout}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Logout;
