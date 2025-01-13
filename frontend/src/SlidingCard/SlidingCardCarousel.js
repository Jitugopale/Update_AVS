import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SlidingCardCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [verificationCounts, setVerificationCounts] = useState({
    pancard: 0,
    aadhar: 0,
    udyancard: 0,
    pandetail: 0,
    voter: 0,
    passport: 0,
    credit: 0,
    gst: 0,
  });

  // Extract only the valid keys for verification counts
  const keys = Object.keys(verificationCounts);

  // Fetch verification counts from the backend on component mount
  useEffect(() => {
    const fetchVerificationCounts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/count/verification-count');
        if (response.status === 200) {
          const filteredData = Object.keys(response.data)
            .filter((key) => verificationCounts.hasOwnProperty(key)) // Filter out unwanted fields
            .reduce((obj, key) => {
              obj[key] = response.data[key];
              return obj;
            }, {});
          setVerificationCounts(filteredData);
        }
      } catch (error) {
        console.error('Error fetching verification counts:', error.message);
      }
    };

    fetchVerificationCounts();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % keys.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? keys.length - 1 : prevIndex - 1));
  };

  return (
    <div className="sliding-card-container text-center mt-4">
      <h4>Verification Items</h4>
      <div className="card-carousel d-flex align-items-center justify-content-center">
        {/* Left Arrow */}
        <button className="btn btn-outline-primary mx-2" onClick={handlePrev}>
          &lt;
        </button>

        {/* Current Card */}
        <div className="card h-100 p-3 shadow">
          <h6>
            {keys[currentIndex]?.charAt(0).toUpperCase() + keys[currentIndex]?.slice(1)}
          </h6>
          <div className="card-count">{verificationCounts[keys[currentIndex]]}</div>
        </div>

        {/* Right Arrow */}
        <button className="btn btn-outline-primary mx-2" onClick={handleNext}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default SlidingCardCarousel;
