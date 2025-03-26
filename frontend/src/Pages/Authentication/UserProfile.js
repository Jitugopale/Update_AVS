import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import userprofile from "../Authentication/images/userProfile.png"

Modal.setAppElement('#root'); // Set the root element for accessibility

function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [superAdminKey, setSuperAdminKey] = useState("");
  const [userKey, setUserKey] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [branch, setBranch] = useState("");



  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData");
  
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        console.log("Stored User Profile:", parsedData);
  
        setSuperAdminKey(parsedData?.userkey || "N/A");
        setUserKey(parsedData?.userkey || "N/A"); // ✅ Fixed casing
        setToken(parsedData?.access_token || "N/A");
        setEmail(parsedData?.email || "N/A");
        setRole(parsedData?.role || "N/A");
        setUsername(parsedData?.username || "N/A");
        setBranch(parsedData?.branch || "N/A");
      } catch (error) {
        console.error("Error parsing userData:", error);
      }
    }
  }, []);

  return (
    <div>
      <div style={styles.profileCircle} onClick={() => setModalIsOpen(true)}>
        {/* <span style={styles.initials}>{username ? username.charAt(0).toUpperCase() : "U"}</span> */}
        <img 
    src={userprofile} 
    alt="User Profile" 
    style={styles.profileImage} 
  />

      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={modalStyles}>
        <div style={styles.modalHeader}>
          <h4 style={styles.modalTitle}>User Profile</h4>
          <span style={styles.closeIcon} onClick={() => setModalIsOpen(false)}>
            &times; {/* X mark for clhnhgnhosing the modal */}
          </span>
        </div>
        {loading ? (
          <>
          <p>{error}</p>
          <div style={styles.modalContent}>
            <div style={styles.userData}>
            <p style={styles.userInfo}>Bank: {username}</p>
              <p style={styles.userInfo}>superAdminKey: {superAdminKey}</p>
              <p style={styles.userInfo}>UserKey: {userKey}</p>
              <p style={styles.userInfo}>Email ID: {email}</p>
              <p style={styles.userInfo}>Role: {role}</p>
              {/* <p 
  style={{ 
    ...styles.userInfo, 
    display: branch && branch.trim() !== "" ? "block" : "none" 
  }}
>
  Branch: {branch}
</p> */}



              {/* <p style={styles.userInfo}>Address: {bankName}</p>
              <p style={styles.userInfo}>Phone Number: {bankName}</p>
              <p style={styles.userInfo}>City: {bankName}</p> */}
            </div>
          </div>
          </>
        ) : (
          <p>No user data available.</p>
        )}
      </Modal>
    </div>
  );
}

const styles = {
  profileCircle: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid #ccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'absolute', // Adjust this to place it in the upper right corner
    top: '10px',
    right: '20px',
    backgroundColor: '#f0f0f0',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
  },
  avatar: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  initials: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#555',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%', 
    height: '100%', 
    borderRadius: '50%', 
    objectFit: 'cover'
  },  
  modalTitle: {
    color: '#333',
    marginBottom: '10px',
  },
  modalContent: {
    backgroundColor: '#f9f9f9', // Light background for modal
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    overflowX:"auto"
  },
  uploadSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '15px',
  },
  defaultPhoto: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#d3d3d3', // Light gray color for default photo
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px',
  },
  fileInput: {
    marginTop: '10px',
    // marginLeft: '200px',
  },
  uploadedPhoto: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '10px',
  },
  userData: {
    color: '#000', // Black text for user data
  },
  userInfo: {
    margin: '5px 0',
  },
  closeIcon: {
    fontSize: '24px',
    cursor: 'pointer',
    color: '#333', // Color of the close icon
  },
  logoutButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#ff4d4d',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '5px',
  },
};

// const modalStyles = {
//   content: {
//     top: '50%',
//     left: '50%',
//     right: 'auto',
//     bottom: 'auto',
//     transform: 'translate(-50%, -50%)',
//     padding: '20px',
//     width: '400px',
//     backgroundColor: '#fff', // Set a background color
//     borderRadius: '10px',
//     boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
//   },
// };


const modalStyles = {
  content: {
    position: 'fixed', // Ensure it's properly centered
    top: '30%',
    left: '83%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    width: '400px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
    zIndex: 1050, // Ensure it appears above other elements
  },
  overlay: {
    position: 'fixed', // Ensures it covers the entire screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dim background
    zIndex: 1040,
  },
};


export default UserProfile;
