import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "./AadharVerification.css";
import DateComponent from "./DateComponent";
import * as XLSX from "xlsx"; // Import xlsx library

// Inline styles
const containerStyle = {
    maxWidth:'1000px',
   maxWidth: '1200px',
    width: '100%',
    padding: "16px",
    boxSizing: "border-box",
  };

  const inputStyle = {
    marginBottom: "10px",
    padding: "8px",
    width: "30%",
    boxSizing: "border-box",
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  };
  const styles={
    statusBar: {
      backgroundColor: "#f1f1f1",
      padding: "10px",
      display: "flex",
      justifyContent: "space-between",
      border: "1px solid #ccc",
      marginBottom: "20px",
    },
    button: {
      marginRight: "10px",
      padding: "5px 10px",
      backgroundColor: "#008080",
      color: "white",
      border: "none",
      cursor: "pointer",
    },
  }

const AadhaarVerificationPage = () => {
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

    useEffect(() => {
      const fetchVerificationCounts = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/count/verification-count"
          );
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
          console.error("Error fetching verification counts:", error.message);
        }
      };
  
      fetchVerificationCounts();
    }, []);

    useEffect(() => {
      const fetchVerifiedUsers = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/adhar/verified"
          );
          setVerifiedUsers(response.data); // Set the fetched data into the state
        } catch (error) {
          console.error("Error fetching verified users:", error);
        }
      };
      fetchVerifiedUsers();
    },[]);
  
    const [aadhaarNumber, setAadhaarNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [aadhaarDetails, setAadhaarDetails] = useState(null);
  
    // Date range filtering
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [verifiedUsers, setVerifiedUsers] = useState([]);
    const [verifiedData, setVerifiedData] = useState(null);


  // Fetch verified Aadhaar details (either all or based on date range)
  useEffect(() => {
    const fetchVerifiedUsers = async () => {
      try {
        const storedVerifiedUsers = JSON.parse(localStorage.getItem("verifiedUsers")) || [];
        setVerifiedUsers(storedVerifiedUsers);
      } catch (error) {
        console.error("Error fetching verified users:", error);
      }
    };

    fetchVerifiedUsers();
  }, [startDate, endDate]);

  // const handleAdharPdf = (aadhaarDetails) => {
  //   const doc = new jsPDF();
    
  //   // Add title to the PDF
  //   doc.setFont("helvetica", "bold");
  //   doc.setFontSize(16);
  //   doc.text("Aadhaar Verification Details", 14, 20);
    
  //   // Draw a line below the title
  //   doc.setLineWidth(0.5);
  //   doc.line(10, 22, 200, 22);
    
  //   // Add Aadhaar profile image
  //   const imageData = `data:image/jpeg;base64,${aadhaarDetails.profile_image}`;
  //   doc.addImage(imageData, 'JPEG', 14, 30, 35, 35);  // (x, y, width, height)
    
  //   // Add personal details to the PDF
  //   doc.setFont("helvetica", "normal");
  //   doc.setFontSize(12);
  //   doc.text(`Aadhaar Number: ${aadhaarDetails.aadhaar_number}`, 14, 75);
  //   doc.text(`Name: ${aadhaarDetails.full_name}`, 14, 85);
  //   doc.text(`Gender: ${aadhaarDetails.gender}`, 14, 95);
  //   doc.text(`DOB: ${aadhaarDetails.dob}`, 14, 105);
    
  //   // Add address (make sure it's formatted correctly)
  //   doc.text("Address:", 14, 115);
  //   const addressLines = [
  //     aadhaarDetails.address.house,
  //     aadhaarDetails.address.street,
  //     aadhaarDetails.address.landmark,
  //     aadhaarDetails.address.loc,
  //     aadhaarDetails.address.po,
  //     aadhaarDetails.address.subdist,
  //     aadhaarDetails.address.dist,
  //     aadhaarDetails.address.state,
  //     aadhaarDetails.address.country,
  //     aadhaarDetails.address.zip,
  //   ]
  //   .filter(Boolean) // Remove any empty lines
  //   .join(", ");
    
  //   const addressSplit = doc.splitTextToSize(addressLines, 180);
  //   doc.text(addressSplit, 14, 120);
    
  //   // Footer with additional info
  //   doc.setFont("helvetica", "italic");
  //   doc.setFontSize(10);
  //   doc.text("Generated by Aadhaar Verification System", 14, 290);
    
  //   // Save the PDF
  //   doc.save(`${aadhaarDetails.full_name}_aadhaar_verification.pdf`);
  // };

  const handleExcelDownload = () => {
    // Mapping the verified users data to the format required for Excel
    const excelData = verifiedUsers.map((user, index) => ({
     'SrNo': index + 1, // Serial number
      'Aadhaar No': user?.verifiedData?.data?.aadhaar_number || "N/A", // Aadhaar number or fallback
      'Name': user?.verifiedData?.data?.full_name || "N/A", // Full name or fallback
      'Gender': user?.verifiedData?.data?.gender || "N/A", // Gender or fallback
      'DOB': user?.verifiedData?.data?.dob || "N/A", // Date of Birth or fallback
      'Address': [
        user?.verifiedData?.data?.address?.house,
        user?.verifiedData?.data?.address?.street,
        user?.verifiedData?.data?.address?.landmark,
        user?.verifiedData?.data?.address?.loc,
        user?.verifiedData?.data?.address?.po,
        user?.verifiedData?.data?.address?.subdist,
        user?.verifiedData?.data?.address?.dist,
        user?.verifiedData?.data?.address?.state,
        user?.verifiedData?.data?.address?.country,
        user?.verifiedData?.data?.address?.zip,
      ]
        .filter(Boolean) // Filter out undefined or null values
        .join(", ") || "No Address Available", // Join valid fields or provide a fallback
      'Verification Date': user?.formattedDate || "N/A", // Verification date or fallback
    }));
  
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Convert excelData to a worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
  
    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Verified Users");
  
    // Trigger the download of the Excel file
    XLSX.writeFile(wb, "Verified_Users.xlsx");
  };


const handleAdharPdf = (aadhaarDetails) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth(); // Page width
  const pageHeight = doc.internal.pageSize.getHeight(); // Page height

  // Add a full-page border
  doc.setDrawColor(0); // Black color
  doc.setLineWidth(0.7); // Border thickness
  doc.rect(5, 5, pageWidth - 10, pageHeight - 10); // Draw rectangle with a 5-unit margin from each edge

  // Center-aligned title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(25);
  const title = "Shankar Nagari Sahakari Bank Ltd";
  doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

  // Center-aligned subtitle
  doc.setFontSize(14);
  const subtitle = "Aadhar Verification Certificate";
  doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, 28);

  // Center-aligned section header
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const header = "TO WHOMSOEVER IT MAY CONCERN";
  doc.text(header, (pageWidth - doc.getTextWidth(header)) / 2, 36);

  // Verification Statement
  const verificationText = `This is to Certify that ${
    aadhaarDetails.full_name || "N/A"
  }, Aadhaar no. ${
    aadhaarDetails.aadhaar_number ? aadhaarDetails.aadhaar_number.toString() : "N/A"
  } are verified from https://uidai.gov.in/ using with OTP.`;
  const verificationSplit = doc.splitTextToSize(verificationText, 180);
  doc.text(verificationSplit, 14, 50);

  // Define positions and dimensions for the outer border
  const outerX = 10;
  const outerY = 65;
  const outerWidth = 190;
  const outerHeight = 80;

  // Draw the outer border
  doc.setDrawColor(0);
  doc.setLineWidth(0.7);
  doc.rect(outerX, outerY, outerWidth, outerHeight);

  // Define positions and dimensions for content box
  const contentX = 14;
  const contentY = 70;
  const contentWidth = 120;
  const contentHeight = 90;

  // Define positions and dimensions for the profile image box
  const imageX = 150;
  const imageY = 70;
  const imageWidth = 40;
  const imageHeight = 40;

  // User Details Content
  doc.setFont("helvetica", "bold");
  doc.text("Name                    :", contentX + 2, contentY + 5);
  doc.setFont("helvetica", "normal");
  doc.text(aadhaarDetails.full_name || "N/A", contentX + 40, contentY + 5);

  doc.setFont("helvetica", "bold");
  doc.text("Aadhaar Number :", contentX + 2, contentY + 15);
  doc.setFont("helvetica", "normal");
  doc.text(aadhaarDetails.aadhaar_number ? aadhaarDetails.aadhaar_number.toString() : "N/A", contentX + 40, contentY + 15);

  doc.setFont("helvetica", "bold");
  doc.text("DOB                      :", contentX + 2, contentY + 25);
  doc.setFont("helvetica", "normal");
  doc.text(aadhaarDetails.dob || "N/A", contentX + 40, contentY + 25);

  doc.setFont("helvetica", "bold");
  doc.text("Gender                  : ", contentX + 2, contentY + 35);
  doc.setFont("helvetica", "normal");
  doc.text(aadhaarDetails.gender || "N/A", contentX + 40, contentY + 35);

  doc.setFont("helvetica", "bold");
  doc.text("Address                : ", contentX + 2, contentY + 45);
  doc.setFont("helvetica", "normal");
  const addressLines = [
    aadhaarDetails.address.house,
    aadhaarDetails.address.street,
    aadhaarDetails.address.landmark,
    aadhaarDetails.address.loc,
    aadhaarDetails.address.po,
    aadhaarDetails.address.subdist,
    aadhaarDetails.address.dist,
    aadhaarDetails.address.state,
    aadhaarDetails.address.country,
    aadhaarDetails.address.zip,
  ]
    .filter(Boolean)
    .join(", ");
  const addressSplit = doc.splitTextToSize(addressLines || "N/A", contentWidth - 50);
  doc.text(addressSplit, contentX + 40, contentY + 45);

  // Draw the rectangle for the profile image
  doc.setLineWidth(0.5);
  doc.rect(imageX, imageY, imageWidth, imageHeight);

  // Add the profile image or fallback text
  if (aadhaarDetails.profile_image) {
    const imageData = `data:image/jpeg;base64,${aadhaarDetails.profile_image}`;
    doc.addImage(imageData, "JPEG", imageX, imageY, imageWidth, imageHeight);
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Profile image not available", imageX + 5, imageY + 20);
  }

  // Footer with signatures
  doc.setFont("helvetica", "bold");
  doc.text("Signature of the Authorised Signatory", 14, 170);
  doc.text("Signature of the Branch Manager", 110, 170);

  doc.setFont("helvetica", "normal");
  doc.text("Name: __________________", 14, 180);
  doc.text("Name: __________________", 110, 180);

  doc.text("Designation: ____________", 14, 190);
  doc.text("Designation: ____________", 110, 190);

  doc.text("Phone no.: ______________", 14, 200);
  doc.text("Date: ___________________", 110, 200);

  // Bank Seal
  doc.setFont("helvetica", "normal");
  doc.text("(Bank Seal)", 14, 220);
  doc.text("Verified By : User", 120, 220);

  // Save PDF
  const fileName = aadhaarDetails.full_name
    ? `${aadhaarDetails.full_name}_verification_certificate.pdf`
    : "verification_certificate.pdf";
  doc.save(fileName);
};


  
  const handleSendOtp = async () => {
    try {
      // Make a POST request to your backend to send OTP
      const response = await axios.post(`https://localhost:44334/api/Aadhar/VerifyAadhar?aadharNumber=${aadhaarNumber}`);
  
      // Check if OTP was sent successfully and handle the 
      console.log(response)
      if (response.data.message === "OTP send to Aadhar register mobile number successfully") {
        // Store the client_id in sessionStorage
        sessionStorage.setItem("clientId", response.data.client_id);
        
        // Update state to reflect OTP sent status
        setIsOtpSent(true);
        setErrorMessage("");  // Clear any previous error messages
        setSuccessMessage("OTP sent to your registered mobile number.");
      } else if (response.data.message === 'Aadhaar is already verified.') {
          // If Aadhaar is already verified, set the verified data
          setVerifiedData(response.data.verifiedData);
          setErrorMessage("");  // Clear any previous error messages
          setSuccessMessage("Aadhaar already verified.");

      }else
       {
        // Handle failure to send OTP
        setErrorMessage("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      // Handle errors from the backend or network issues
      console.error(error);
      setErrorMessage(error.response?.data?.message || "Failed to send OTP. Please try again.");
    }
  };
  

  const handleVerifyOtp = async () => {
    try {
      const clientId = sessionStorage.getItem("clientId");

      if (!clientId) {
        setErrorMessage("Client ID not found. Please resend OTP.");
        return;
      }

      const response = await axios.post(
        `https://localhost:44334/api/Aadhar/VerifyOTP?clientId=${clientId}&OTP=${otp}&aadharNumber=${aadhaarNumber}`
      );

      if (response.data.message === "Aadhaar verification successful.") {
        setIsVerified(true);
        setErrorMessage("");
        setSuccessMessage("Aadhaar verification completed successfully.");
        setAadhaarDetails(response.data.aadhaarData.data);

        const newVerifiedUser = {
          aadhaarNumber,
          name: response.data.aadhaarData.data.full_name,
          gender: response.data.aadhaarData.data.gender,
          dob: response.data.aadhaarData.data.dob,
          address: response.data.aadhaarData.data.address,
          verificationDate: new Date().toISOString(),
          profile_image:response.data.aadhaarData.data.profile_image
        };

        const storedUsers = JSON.parse(localStorage.getItem("verifiedUsers")) || [];
        localStorage.setItem("verifiedUsers", JSON.stringify([...storedUsers, newVerifiedUser]));
        setVerifiedUsers((prevUsers) => [...prevUsers, newVerifiedUser]);
      } else {
        setErrorMessage("OTP verification failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Verification failed.");
    }
  };

  

  return (
    <div style={containerStyle}>
      <h1 style={{color:"green"}}>Aadhaar Verification</h1>
      <div style={styles.statusBar}>
      <div>
            {/* Display specific count for 'credit' */}
            <div>
              <span>No. Of Count : {verificationCounts.aadhar}</span>
            </div>
          </div>{" "}
          <span>Your available Credit: -62</span>
        </div>
      <div>
        <label>Aadhaar Number : &nbsp;</label>
        <input
          type="text"
          value={aadhaarNumber}
          onChange={(e) => setAadhaarNumber(e.target.value)}
          placeholder="Enter your Aadhaar number"
          disabled={isOtpSent || isVerified}
          style={inputStyle}
        />
      </div>

      {isOtpSent && !isVerified && (
          <div className="form-group">
            <label>Enter OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP"
              style={inputStyle}
            />
          </div>
        )}

<       div style={buttonGroupStyle} className="mt-3">
            {!isOtpSent && !isVerified && <button style={styles.button}  onClick={handleSendOtp}>Verify Aadhar</button>}      
            {isOtpSent && !isVerified && <button onClick={handleVerifyOtp}  style={styles.button} >Verify OTP</button>}
            <button type='button' style={styles.button} onClick={handleExcelDownload}>Excel Report</button>
            <button style={styles.button} onClick={() => setAadhaarNumber("")}>Clear</button>
            <button style={styles.button}>Search</button>
          
        </div>

      {isVerified && aadhaarDetails && (
        <div className="container mt-5">
          <div className=" d-flex justify-content-center align-items-center">
             <div  className="text-center">
             <h3 style={{color:'green'}}>Aadhaar Details</h3>
          <img
            src={`data:image/jpeg;base64,${aadhaarDetails.profile_image}`}
            alt="Profile"
            style={{ width: "150px" }}
          />
          <p style={{color:'black'}}><b>Name:</b> {aadhaarDetails.full_name}</p>
          <p style={{color:'black'}}><b>Gender:</b> {aadhaarDetails.gender}</p>
          <p style={{color:'black'}}><b>DOB:</b> {aadhaarDetails.dob}</p>
          <p style={{color:'black'}}>
            <b>Address:</b>{" "}
            {[
              aadhaarDetails.address.house,
              aadhaarDetails.address.street,
              aadhaarDetails.address.landmark,
              aadhaarDetails.address.loc,
              aadhaarDetails.address.po,
              aadhaarDetails.address.subdist,
              aadhaarDetails.address.dist,
              aadhaarDetails.address.state,
              aadhaarDetails.address.country,
              aadhaarDetails.address.zip,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
          <button onClick={() => handleAdharPdf(aadhaarDetails)}>
            Download PDF
          </button>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
             </div>
        </div>
        </div>
      )}
      
      <DateComponent verifiedUsers={verifiedUsers} />

    </div>
  );
};

export default AadhaarVerificationPage;
