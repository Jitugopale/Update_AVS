import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import GSTTable from './GSTTable';
import * as XLSX from "xlsx"; // Import xlsx library

const GSTVerificationPage = () => {
  const [idNumber, setIdNumber] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [isVerified, setIsVerified] = useState(false);
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
      const fetchVerifiedUsers = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/gst/verified"
          );
          setVerifiedUsers(response.data); // Set the fetched data into the state
        } catch (error) {
          console.error("Error fetching verified users:", error);
        }
      };
      fetchVerifiedUsers();
    },[]);

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

    const handleExcelDownload = () => {
      // Mapping the verified users data to the format required for Excel
      const excelData = verifiedUsers.map((user, index) => ({
        'SrNo': index + 1,  // You can adjust this if the `SrNo` is not directly available in the data
        'GST No': user.verifiedData.data.gstin,
        'PAN No': user.verifiedData.data.pan_number,
        'Business Name': user.verifiedData.data.business_name,
        'Date of Registration': user.verifiedData.data.date_of_registration,
        'GST Status': user.verifiedData.data.gstin_status,
        'Verification Date': user.formattedDate,
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
      const res = await axios.post('http://localhost:5000/api/gst/gst_verify', { id_number: idNumber });

      if (res.data.status === 'success') {
        setResponseData(res.data);  // Store the successful response data
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
    if (!responseData || !responseData.verifiedData || !responseData.verifiedData.data) {
      alert('No data to generate PDF');
      return;
    }

    const data = responseData.verifiedData.data;

    console.log(data); // Debugging: Ensure this shows the expected data

    // Initialize jsPDF
    const doc = new jsPDF();
    let yPosition = 10; // Y position for text

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('GST Verification Details', 15, yPosition);
    yPosition += 15;

    // Add GST Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`GSTIN: ${data.gstin}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Business Name: ${data.business_name}`, 10, yPosition);
    yPosition += 10;
    doc.text(`State Jurisdiction: ${data.state_jurisdiction}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Taxpayer Type: ${data.taxpayer_type}`, 10, yPosition);
    yPosition += 10;
    doc.text(`GST Status: ${data.gstin_status}`, 10, yPosition);
    yPosition += 10;
  
    // Filing Status (Latest GSTR1 and GSTR3B)
    doc.text(`Filing Status (Latest GSTR1): ${data.filing_status?.[0]?.[0]?.status || 'N/A'}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Last Filed GSTR3B: ${data.filing_status?.[0]?.[1]?.status || 'N/A'}`, 10, yPosition);
    yPosition += 10;

    // Registration and Business Information
    doc.text(`Date of Registration: ${data.date_of_registration}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Nature of Core Business: ${data.nature_of_core_business_activity_description}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Constitution of Business: ${data.constitution_of_business}`, 10, yPosition);
    yPosition += 10;

    // Jurisdiction Information
    doc.text(`Center Jurisdiction: ${data.center_jurisdiction}`, 10, yPosition);
    yPosition += 10;
    doc.text(`State Jurisdiction: ${data.state_jurisdiction}`, 10, yPosition);
    yPosition += 10;

    // Address and Field Visit Information
    doc.text(`Address: ${data.address}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Field Visit Conducted: ${data.field_visit_conducted}`, 10, yPosition);
    yPosition += 10;

    // Nature of Business Activities and Aadhaar Validation
    doc.text(`Nature of Business Activities: ${data.nature_bus_activities?.join(', ')}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Aadhaar Validation: ${data.aadhaar_validation}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Aadhaar Validation Date: ${data.aadhaar_validation_date}`, 10, yPosition);
    yPosition += 10;

    // Cancellation Information
    doc.text(`Date of Cancellation: ${data.date_of_cancellation || 'N/A'}`, 10, yPosition);
    yPosition += 10;

    // Save PDF
    doc.save('GST_Details.pdf');
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
    <div className="container-fluid">
    {/* <div className="d-flex justify-content-center align-items-center">
      <div className="card shadow p-3" style={{ width: '500px' }}>
        <h1 className="card-title">GST Verification</h1>
        <div className="mb-3">
          <label htmlFor="id_number" className="form-label">Enter GST Number</label>
          <input
            type="text"
            className="form-control"
            id="id_number"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleVerify} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
   */}
        {/* Show error if any */}
        {/* {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div> */}

<div className="d-flex align-items-center">
        <div className=" p-3" style={{maxWidth: '1200px', width: '100%'}}>
          <h1 className="card-title" style={{color:'green'}}>GST Verification</h1>
          <div style={styles.statusBar} className='mt-2'>
          <div>
            {/* Display specific count for 'credit' */}
            <div>
              <span>No. Of Count : {verificationCounts.gst}</span>
            </div>
          </div>{" "}
          <span>Your available Credit: -62</span>
        </div>
          <div>
        <label>Enter GST Number : &nbsp;</label>
        <input
          type="text"
          value={idNumber}
          id="id_number"
          onChange={(e) => setIdNumber(e.target.value)}
          placeholder="Enter GST Number"
          style={inputStyle}
        />
        <div className="buttons mt-3">
        {!isVerified &&<button style={styles.button} onClick={handleVerify} disabled={loading} >{loading ? 'Verifying...' : 'Verify'}</button>}
            <button type="button" style={styles.button} onClick={handleExcelDownload}>Excel Report</button>
            <button style={styles.button} onClick={() => setIdNumber("")}>Clear</button>
            <button style={styles.button}>Search</button>
          </div>
      </div>
            {error && <div className="alert alert-danger mt-3">{error}</div>} 

 </div>  
 </div>   
  
    {/* Show response data below the card */}
    {responseData && (
      <div className="card shadow p-3 mt-5">
        <p><strong>Status:</strong> {responseData?.status === 'success' ? 'Verified' : 'Not Verified'}</p>
        <p><strong>GSTIN:</strong> {responseData.verifiedData.data.gstin}</p>
        <p><strong>Business Name:</strong> {responseData.verifiedData.data.business_name}</p>
        <p><strong>State Jurisdiction:</strong> {responseData.verifiedData.data.state_jurisdiction}</p>
        <p><strong>Taxpayer Type:</strong> {responseData.verifiedData.data.taxpayer_type}</p>
        <p><strong>GST Status:</strong> {responseData.verifiedData.data.gstin_status}</p>
        <p><strong>Filing Status (Latest GSTR1):</strong> {responseData.verifiedData.data.filing_status?.[0]?.[0]?.status || 'N/A'}</p>
        <p><strong>Last Filed GSTR3B:</strong> {responseData.verifiedData.data.filing_status?.[0]?.[1]?.status || 'N/A'}</p>
        <p><strong>Date of Registration:</strong> {responseData.verifiedData.data.date_of_registration}</p>
        <p><strong>Nature of Core Business:</strong> {responseData.verifiedData.data.nature_of_core_business_activity_description}</p>
        <p><strong>Constitution of Business:</strong> {responseData.verifiedData.data.constitution_of_business}</p>
        <p><strong>Center Jurisdiction:</strong> {responseData.verifiedData.data.center_jurisdiction}</p>
        <p><strong>State Jurisdiction:</strong> {responseData.verifiedData.data.state_jurisdiction}</p>
        <p><strong>Address:</strong> {responseData.verifiedData.data.address}</p>
        <p><strong>Field Visit Conducted:</strong> {responseData.verifiedData.data.field_visit_conducted}</p>
        <p><strong>Nature of Business Activities:</strong> {responseData.verifiedData.data.nature_bus_activities?.join(', ')}</p>
        <p><strong>Aadhaar Validation:</strong> {responseData.verifiedData.data.aadhaar_validation}</p>
        <p><strong>Aadhaar Validation Date:</strong> {responseData.verifiedData.data.aadhaar_validation_date}</p>
        <p><strong>Date of Cancellation:</strong> {responseData.verifiedData.data.date_of_cancellation}</p>
  
        {/* Display Enterprise Units if they exist */}
        {/* <h5 className="mt-3">Enterprise Units</h5>
        {responseData.verifiedData.data.enterprise_units?.length > 0 ? (
          responseData.verifiedData.data.enterprise_units.map((unit, index) => (
            <div key={index}>
              <p><strong>Unit {index + 1} Name:</strong> {unit?.name}</p>
              <p><strong>Unit Address:</strong> {unit?.address?.door_no}, {unit?.address?.building}, {unit?.address?.area}, {unit?.address?.city}, {unit?.address?.state} - {unit?.address?.pincode}</p>
            </div>
          ))
        ) : (
          <p>No Enterprise Units available.</p>
        )} */}
  
        {/* Display HSN info if they exist */}
        {/* <h5 className="mt-3">HSN Info</h5>
        {responseData.verifiedData.data.hsn_info?.length > 0 ? (
          responseData.verifiedData.data.hsn_info.map((hsn, index) => (
            <div key={index}>
              <p><strong>HSN Code:</strong> {hsn?.hsn_code}</p>
              <p><strong>Description:</strong> {hsn?.description}</p>
            </div>
          ))
        ) : (
          <p>No HSN Info available.</p>
        )}
   */}
        {/* Display Filing Frequency if available */}
        {/* <h5 className="mt-3">Filing Frequency</h5>
        {responseData.verifiedData.data.filing_frequency?.length > 0 ? (
          <ul>
            {responseData.verifiedData.data.filing_frequency.map((frequency, index) => (
              <li key={index}>{frequency}</li>
            ))}
          </ul>
        ) : (
          <p>No Filing Frequency available.</p>
        )}
   */}
        <div>
        <button className="btn btn-success mt-3" onClick={generatePDF}>
          Download PDF
        </button>
        </div>
      </div>
    )}
    <GSTTable/>
  </div>

  
  );
};

export default GSTVerificationPage;
