import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the root element for accessibility

function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [photo, setPhoto] = useState(null);

  // On component mount, fetch the user and photo
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        if (!token) {
          setError("User not authenticated. Please log in.");
          setLoading(false); // Stop loading
          return;
        }

        // Send the token to fetch user data
        const response = await axios.get('http://localhost:5000/api/auth/getbank', {
          headers: {
            'auth-token': token, // Send token in 'auth-token' header as required by fetchuser middleware
          },
        });

        // Check if user data exists and set it
        if (response.data) {
          setUser(response.data);
          const storedPhoto = localStorage.getItem(`userPhoto_${response.data.bankName}`); // Fetch photo from local storage based on userId
          setPhoto(storedPhoto || response.data.photo); // Set the photo from localStorage or API response
        } else {
          setError('No user data found.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data. Please try again.');
      } finally {
        setLoading(false); // Stop loading in both success and error cases
      }
    };

    fetchUser();
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const uploadedPhoto = reader.result; // Set the uploaded photo as base64
        setPhoto(uploadedPhoto);

        // Save the uploaded photo in localStorage using the unique userId
        const userId = user ? user.bankName : null;
        if (userId) {
          localStorage.setItem(`userPhoto_${userId}`, uploadedPhoto); // Save the photo with a unique key
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the authentication token
    // Do not remove photo from localStorage to persist it across sessions
    window.location.reload(); // Reload page to reflect changes
  };

  const { bankName } = user || {};

  return (
    <div>
      <div style={styles.profileCircle} onClick={() => setModalIsOpen(true)}>
        {photo ? (
          <img src={photo} alt="User Avatar" style={styles.avatar} />
        ) : (
          <span style={styles.initials}>{bankName?.charAt(0)}{bankName?.charAt(0)}</span>
        )}
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={modalStyles}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>User Profile</h2>
          <span style={styles.closeIcon} onClick={() => setModalIsOpen(false)}>
            &times; {/* X mark for closing the modal */}
          </span>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : user ? (
          <div style={styles.modalContent}>
            <div style={styles.uploadSection}>
              {photo ? (
                <img src={photo} alt="Uploaded" style={styles.uploadedPhoto} />
              ) : (
                <div style={styles.defaultPhoto}>
                  <span style={styles.initials}>{bankName?.charAt(0)}{bankName?.charAt(0)}</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={styles.fileInput} />
            </div>
            <div style={styles.userData}>
              <p style={styles.userInfo}>First Name: {bankName}</p>
              <p style={styles.userInfo}>Last Name: {bankName}</p>
              <p style={styles.userInfo}>Email: {bankName}</p>
              <p style={styles.userInfo}>Address: {bankName}</p>
              <p style={styles.userInfo}>Phone Number: {bankName}</p>
              <p style={styles.userInfo}>City: {bankName}</p>
            </div>
            <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
          </div>
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
  modalTitle: {
    color: '#333',
    marginBottom: '10px',
  },
  modalContent: {
    backgroundColor: '#f9f9f9', // Light background for modal
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
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

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    width: '400px',
    backgroundColor: '#fff', // Set a background color
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
  },
};

export default UserProfile;
