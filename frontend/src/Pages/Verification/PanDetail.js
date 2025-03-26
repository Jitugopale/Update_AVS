import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from "jspdf";
import PanDetailTable from './PanDetailTable';
import * as XLSX from "xlsx"; // Import xlsx library

const PanDetail = () => {
  const [idNumber, setIdNumber] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [error, setError] = useState('');

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
            "https://192.168.20.150:82/Document_Verify_Back/api/PanDetail/GetAll"
          );
          setVerifiedUsers(response.data.data); // Set the fetched data into the state
        } catch (error) {
          console.error("Error fetching verified users:", error);
        }
      };
      fetchVerifiedUsers();
    },[]);


    const handleExcelDownload = () => {
      // Mapping the verified users data to the format required for Excel
      const excelData = verifiedUsers.map((user, index) => ({
        "SrNo": index + 1,
        "Pan No": user.PanNumber || "N/A",
        "First Name": user.firstName || "N/A",
        "Fathers Name": user.middleName || "N/A",
        "Last Name": user.lastName || "N/A",
        "Full Name": user.fullName || "N/A",
        "PAN Status": user.panStatus || "N/A",
        "Category": user.category || "N/A",
        "Reference Id": user.reference_id || "N/A",
        "Aadhaar Seeding Status": user.aadhaarSeedingStatus === "NULL" 
          ? "Not Identified" 
          : user.aadhaarSeedingStatus || "N/A",
        "Verification Date": user.VerifiedDate || "N/A",
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
  

  const handleVerify = async () => {
    if (!idNumber) {
      setError('ID Number is required');
      return;
    }

    setLoading(true);
    setError('');
    setResponseData(null);

    
    

    try {
      // Sending request to backend API for PAN verification
      // const res = await axios.post(`https://192.168.20.150:82/Document_Verify_Back/api/PanDetail/VerifyPan?id_number=${idNumber}`);

      const res = await axios.post(`https://192.168.20.150:82/Document_Verify_Back/api/PanDetail/VerifyPan?id_number=${idNumber}`);
      
      // Check if response contains status and handle accordingly
      if (res.data.status === 'success') {
        setResponseData(res.data);  // Store the successful response data
        console.log(res.data)
      } else {
        setError(res.data.message || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
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
    const subtitle = "Pan Detail Verification Certificate";
    doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, 28);
  
    // Center-aligned section header
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const header = "TO WHOMSOEVER IT MAY CONCERN";
    doc.text(header, (pageWidth - doc.getTextWidth(header)) / 2, 36);
  
    // Verification Statement
    const verificationText = `This is to Certify that ${
      responseData.data?.[0]?.fullName || "N/A"
    }, Pan No. ${responseData.data?.[0]?.PanNumber} are verified from https://www.pan.utiitsl.com/.`;
    const verificationSplit = doc.splitTextToSize(verificationText, 180);
    doc.text(verificationSplit, 14, 50);
  
    // Define positions and dimensions for the outer border
    const outerX = 10;
    const outerY = 65;
    const outerWidth = 190;
    const outerHeight = 117;
  
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
    doc.text("Status                               :", contentX + 2, contentY + 5);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.status || "N/A", contentX + 54, contentY + 5);
  
    doc.setFont("helvetica", "bold");
    doc.text("Id Number                        :", contentX + 2, contentY + 15);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.data?.[0]?.PanNumber ? responseData.data?.[0]?.PanNumber.toString() : "N/A", contentX + 54, contentY + 15);

    doc.setFont("helvetica", "bold");
    doc.text("First Name                       :", contentX + 2, contentY + 25);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.data?.[0]?.firstName ? responseData.data?.[0]?.firstName.toString() : "N/A", contentX + 54, contentY + 25);

    doc.setFont("helvetica", "bold");
    doc.text("Middle Name                    :", contentX + 2, contentY + 35);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.data?.[0]?.middleName ? responseData.data?.[0]?.middleName.toString() : "N/A", contentX + 54, contentY + 35);

    doc.setFont("helvetica", "bold");
    doc.text("Last Name                        :", contentX + 2, contentY + 45);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.data?.[0]?.lastName ? responseData.data?.[0]?.lastName.toString() : "N/A", contentX + 54, contentY + 45);

    doc.setFont("helvetica", "bold");
    doc.text("Full Name                         :", contentX + 2, contentY + 55);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.data?.[0]?.fullName ? responseData.data?.[0]?.fullName.toString() : "N/A", contentX + 54, contentY + 55);

    doc.setFont("helvetica", "bold");
    doc.text("PAN Status                       :", contentX + 2, contentY + 65);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.data?.[0]?.panStatus ? responseData.data?.[0]?.panStatus.toString() : "N/A", contentX + 54, contentY + 65);

    doc.setFont("helvetica", "bold");
    doc.text("Category                           :", contentX + 2, contentY + 75);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.data?.[0]?.category ? responseData.data?.[0]?.category.toString() : "N/A", contentX + 54, contentY + 75);

    doc.setFont("helvetica", "bold");
    doc.text("Aadhaar Seeding Status :", contentX + 2, contentY + 85);
    doc.setFont("helvetica", "normal");
    doc.text(
      responseData.data?.[0]?.aadhaarSeedingStatus === "NULL"
        ? "Not Identified"
        : responseData.data?.[0]?.aadhaarSeedingStatus
          ? responseData.data?.[0]?.aadhaarSeedingStatus.toString()
          : "N/A",
      contentX + 54,
      contentY + 85
    );

    doc.setFont("helvetica", "bold");
    doc.text("Reference Id                     :", contentX + 2, contentY + 95);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.data?.[0]?.reference_id ? responseData.data?.[0]?.reference_id.toString() : "N/A", contentX + 54, contentY + 95);

    doc.setFont("helvetica", "bold");
    doc.text("Verification Date              :", contentX + 2, contentY + 105);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.data?.[0]?.VerifiedDate ? responseData.data?.[0]?.VerifiedDate.toString() : "N/A", contentX + 54, contentY + 105);
      
    
    // Footer with signatures
    doc.setFont("helvetica", "bold");
    doc.text("Signature of the Authorised Signatory", 14, 205);
    doc.text("Signature of the Branch Manager", 110, 205);
  
    doc.setFont("helvetica", "normal");
    doc.text("Name: __________________", 14, 215);
    doc.text("Name: __________________", 110, 215);
  
    doc.text("Designation: ____________", 14, 225);
    doc.text("Designation: ____________", 110, 225);
  
    doc.text("Phone no.: ______________", 14, 235);
    doc.text("Date: ___________________", 110, 235);
  
    // Bank Seal
    doc.setFont("helvetica", "normal");
    doc.text("(Bank Seal)", 14, 256);
    doc.text("Verified By : User", 120, 256);
  
    // Save PDF
    const fileName =responseData.data?.[0]?.PanNumber
      ? `${responseData.data?.[0]?.fullName}_verification_certificate.pdf`
      : "verification_certificate.pdf";
    doc.save(fileName);
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
  const inputStyle = {
    marginBottom: "10px",
    padding: "8px",
    width: "30%",
    boxSizing: "border-box",
  };
  

  return (
   <>
    <div className="container mt-3">
       <div className="card">
            <div className="card-header">
              <h1 className="card-title" style={{color:'green'}}>PAN Detail Verification</h1>
            </div>
            <div className="card-body">
            <div className="container-fluid">

<div className="d-flex align-items-center">
  <div className=" p-3" style={{maxWidth: '1200px', width: '100%'}}>
    <div style={styles.statusBar} className='mt-2'>
    <div>
      {/* Display specific count for 'credit' */}
      <div>
        <span>No. Of Count : {verificationCounts.pandetail}</span>
      </div>
    </div>{" "}
    <span>Your available Credit: -62</span>
  </div>
    {/* <div className="mb-3">
      <label htmlFor="id_number" className="form-label">Enter PAN ID Number</label>
      <input
        type="text"
        className="form-control"
        id="id_number"
        value={idNumber}
        onChange={(e) => setIdNumber(e.target.value)}
      />
    </div> */}
    <div>
<label>Enter ID Number : &nbsp;</label>
  <input
    type="text"
    value={idNumber}
    onChange={(e) => setIdNumber(e.target.value)}
    placeholder="Enter PAN Number"
    style={inputStyle}
  />
  <div className="buttons mt-3">
  {!isVerified &&<button style={styles.button} onClick={handleVerify} disabled={loading} >{loading ? 'Verifying...' : 'Verify'}</button>}
      <button type='button' style={styles.button} onClick={handleExcelDownload}>Excel Report</button>
      <button style={styles.button} onClick={() => setIdNumber("")}>Clear</button>
      <button style={styles.button}>Search</button>
    </div>
</div>


    {/* <button className="btn btn-primary" onClick={handleVerify} disabled={loading}>
      {loading ? 'Verifying...' : 'Verify'}
    </button> */}

    {/* Show error if any */}
    {error && <div className="alert alert-danger mt-3">{error}</div>}
  </div>
</div>

{/* Show response data below the card */}
{/* {responseData && (
  <div className="container mt-4">
    <h3>Verification Result</h3>
    <div className="card shadow p-3">
      <p><strong>Status:</strong> {responseData.status === 'success' ? 'Verified' : 'Not Verified'}</p>
      <p><strong>Full Name:</strong> {responseData.verifiedData.data.fullName}</p>
      <p><strong>Father's Name:</strong> {responseData.verifiedData.data.fatherName || 'N/A'}</p>
      <p><strong>PAN Status:</strong> {responseData.verifiedData.data.panStatus}</p>
      <p><strong>Category:</strong> {responseData.verifiedData.data.category}</p>
      <p><strong>Aadhaar Seeding Status:</strong> {responseData.verifiedData.data.aadhaarSeedingStatus}</p>
      <p><strong>Masked Aadhaar:</strong> {responseData.verifiedData.data.maskedAadhaar || 'N/A'}</p>
      <p><strong>Verification Date:</strong> {responseData.verifiedData.formattedDate} at {responseData.verifiedData.formattedTime}</p>
    </div>
  </div>
)} */}
 {!isVerified &&responseData && (
<div className="container mt-5 d-flex justify-content-center">
<div
className="card shadow-lg p-4" 
style={{
  borderRadius: "10px",
  backgroundColor: "#f8f9fa",
  width: "800px",
  height:'610px',
  overflowY: "auto", // Enable vertical scrolling

}}
>
<table
  className="table table-bordered"
  style={{ fontSize: "16px" }}
>
  <thead>
    <tr>
      <th
        colSpan="2"
        className="text-center"
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "#686868",
        }}
      >
        VERIFICATION DETAILS
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style={{ fontWeight: "bold", textAlign: "left" }}>Status :</td>
      <td
        style={{
          textAlign: "left",
          color: responseData.status ? "green" : "red",
        }}
      >
        {responseData.status ? "Verified" : "Not Verified"}
      </td>
    </tr>
    <tr>
      <td style={{ fontWeight: "bold", textAlign: "left" }}>Id Number :</td>
      <td style={{ textAlign: "left" }}>
      {responseData.data?.[0]?.PanNumber || "N/A"}
      </td>
    </tr>
    <tr>
      <td style={{ fontWeight: "bold", textAlign: "left" }}>First Name :</td>
      <td style={{ textAlign: "left" }}>
        {responseData.data?.[0]?.firstName}
      </td>
    </tr>
    <tr>
      <td style={{ fontWeight: "bold", textAlign: "left" }}>Middle Name :</td>
      <td style={{ textAlign: "left" }}>
        {responseData.data?.[0]?.middleName}
      </td>
    </tr>
    <tr>
      <td style={{ fontWeight: "bold", textAlign: "left" }}>Last Name :</td>
      <td style={{ textAlign: "left" }}>
        {responseData.data?.[0]?.lastName}
      </td>
    </tr>
    <tr>
      <td style={{ fontWeight: "bold", textAlign: "left" }}>Full Name :</td>
      <td style={{ textAlign: "left" }}>
        {responseData.data?.[0]?.fullName || "N/A"}
      </td>
    </tr>
    <tr>
      <td style={{ fontWeight: "bold", textAlign: "left" }}>Reference Id :</td>
      <td style={{ textAlign: "left" }}>
      {responseData.data?.[0]?.reference_id || "N/A"}
      </td>
    </tr>
    <tr>
      <td style={{ fontWeight: "bold", textAlign: "left" }}>PAN Status :</td>
      <td style={{ textAlign: "left" }}>
        {responseData.data?.[0]?.panStatus || "N/A"}
      </td>
    </tr>
    <tr>
      <td style={{ fontWeight: "bold", textAlign: "left" }}>Category :</td>
      <td style={{ textAlign: "left" }}>
        {responseData.data?.[0]?.category || "N/A"}
      </td>
    </tr>
    <tr>
      <td style={{ fontWeight: "bold", textAlign: "left" }}>
        Aadhaar Seeding Status :
      </td>
      <td style={{ textAlign: "left" }}>
      {responseData.data?.[0]?.aadhaarSeedingStatus === "NULL" ? "Not Identified" : responseData.data?.[0]?.aadhaarSeedingStatus}
      </td>
    </tr>
    {/* <tr>
      <td style={{ fontWeight: "bold", textAlign: "left" }}>Verification Date :</td>
      <td style={{ textAlign: "left" }}>
        {responseData.data?.[0]?.VerifiedDate || "N/A"}
      </td>
    </tr> */}
    {/* <tr>
      <td style={{ fontWeight: "bold", textAlign: "left" }}>
        Verification Date :
      </td>
      <td style={{ textAlign: "left" }}>
        {responseData.formattedDate}
      </td>
    </tr> */}
  </tbody>
</table>

<div className="text-center mt-4">
  <button
  onClick={generatePDF}
    className="btn btn-success btn-lg"
    style={{
      fontSize: "16px",
      padding: "12px 20px",
      borderRadius: "5px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    }}
  >
    Download PDF
  </button>
</div>
</div>

</div>

)}
<PanDetailTable/>

</div>
            </div>
       </div>
    </div>
   
       
      

      
     

    
  </>
  );
};

export default PanDetail;
