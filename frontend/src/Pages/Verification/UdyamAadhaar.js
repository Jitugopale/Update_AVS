import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import UdyamTable from './UdyamTable';
import * as XLSX from "xlsx"; // Import xlsx library

const UdyamAadhaar = () => {
  const [udyamAadhaar, setUdyamAadhaar] = useState('');
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
            "http://localhost/DocVerification/api/UdyamAadhaar/GetAll"
          );
          setVerifiedUsers(response.data.data); // Set the fetched data into the state
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
        'Udyam No': user.document_id,
        'Reference ID': user.reference_id,
        'Enterprise Name': user.name,
        'Major Activity': user.major_activity,
        'Enterprise Type': user.enterprise_type,
        'Organization Type': user.organization_type ,
        'Enterprise Mobile': user.mobile,
        'Enterprise Email': user.email,
        'Enterprise Address': [
          user?.e_door_no,
          user?.e_building,
          user?.e_area,
          user?.e_block,
          user?.e_street,
          user?.e_city,
          user?.e_district,
          user?.e_state,
          user?.e_pincode,
        ]
          .filter(Boolean) // Exclude undefined or null values
          .join(", ") || "No Address Available", // Concatenated address      'Date of Registration': user.verifiedData.data.enterprise_data.date_of_udyam_registration,
          'Udyam Registration Date': user.date_of_udyam_registration,
          'MSME DI': user.msme_di,
          'DIC': user.dic,
          'Date of Incorporation': user.date_of_incorporation,
          'Date of Commencement': user.date_of_commencement      ,
          'Social Category': user.social_category,
          'Nic Data 2 Digit': user.nic_2_digit,
          'Nic Data 4 Digit': user.nic_4_digit,
          'Nic Data 5 Digit': user.nic_5_digit,
          // 'Enterprise Units': user.verifiedData.data.enterprise_data.enterprise_units.map(unit => unit.name).join(", "),
            
        'Verification Date': user.VerifiedDate,
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
    if (!udyamAadhaar) {
      setError('Udyam Aadhaar number is required');
      return;
    }

    setLoading(true);
    setError('');
    setResponseData(null);

    try {
      // API call to your backend with the correct variable name in the payload
      const res = await axios.post(`http://localhost/DocVerification/api/UdyamAadhaar/VerifyUdyamAdhar?udyam_aadhaar=${udyamAadhaar}`);
      setResponseData(res.data);  // Store the response data in state
      console.log(res.data)
    } catch (err) {
      // Displaying detailed error if available
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

//   const generatePDF = () => {
//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();

//     // Add a full-page border
//     doc.setDrawColor(0); // Black color
//     doc.setLineWidth(0.7); // Border thickness
//     doc.rect(5, 5, pageWidth - 10, pageHeight - 10); // Draw rectangle with a 5-unit margin from each edge

//     // Center-aligned title
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(25);
//     const title = "Shankar Nagari Sahakari Bank Ltd";
//     doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

//     // Center-aligned subtitle
//     doc.setFontSize(14);
//     const subtitle = "Udyam Aadhaar Verification Certificate";
//     doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, 28);

//     // Center-aligned section header
//     doc.setFontSize(12);
//     doc.setFont("helvetica", "normal");
//     const header = "TO WHOMSOEVER IT MAY CONCERN";
//     doc.text(header, (pageWidth - doc.getTextWidth(header)) / 2, 36);

//     // Verification Statement
//     const verificationText = `This is to Certify that ${
//       responseData?.data?.[0]?.name || "N/A"
//     }, Udyam Id No. ${responseData?.data?.[0]?.document_id} is verified from the Udyam portal.`;
//     const verificationSplit = doc.splitTextToSize(verificationText, 180);
//     doc.text(verificationSplit, 14, 50);

//     // Define positions and dimensions for the outer border
//     const outerX = 10;
//     const outerY = 62;
//     const outerWidth = 190;
//     const outerHeight = 170;  // Increased to fit all the new data

//     // Draw the outer border
//     doc.setDrawColor(0);
//     doc.setLineWidth(0.7);
//     doc.rect(outerX, outerY, outerWidth, outerHeight);

//     // Define positions and dimensions for content box
//     const contentX = 14;
//     const contentY = 70;
//     const contentWidth = 120;
//     const contentHeight = 90;

//     // User Details Content inside the rectangle
//     const userDetails = [
//       { label: "Enterprise Name", value: responseData?.data?.[0]?.name },
//       { label: "Document ID", value: responseData?.data?.[0]?.document_id },
//       { label: "Major Activity", value: responseData?.data?.[0]?.major_activity },
//       { label: "Enterprise Type", value: responseData?.data?.[0]?.enterprise_type },
//       { label: "Organization Type", value: responseData?.data?.[0]?.organization_type },
//       { label: "Enterprise Mobile", value: responseData?.data?.[0]?.mobile },
//       { label: "Enterprise Email", value: responseData?.data?.[0]?.email },
//       { label: "Enterprise Address", value: `${responseData?.data?.[0]?.e_street}, ${responseData?.data?.[0]?.e_city}, ${responseData?.data?.[0]?.e_state}` },
//       { label: "Udyam Registration Date", value: responseData?.data?.[0]?.date_of_udyam_registration },
//       { label: "MSME DI", value: responseData?.data?.[0]?.msme_di },
//       { label: "DIC", value: responseData?.data?.[0]?.dic },
//       { label: "Date of Incorporation", value: responseData?.data?.[0]?.date_of_incorporation },
//       { label: "Social Category", value: responseData?.data?.[0]?.social_category },
//       { label: "Nic Data 2 Digit", value: responseData?.data?.[0]?.nic_2_digit },
//       { label: "Nic Data 4 Digit", value: responseData?.data?.[0]?.nic_4_digit },
//       { label: "Nic Data 5 Digit", value: responseData?.data?.[0]?.nic_5_digit },
//       // { label: "Enterprise Units", value: responseData.verifiedData.data.enterprise_units.map(unit => unit.name).join(", ") }
//     ];

//     // NIC Code: Handle long text and wrap it appropriately
//     // const nicCode = `${responseData?.data?.[0]?.nic_2_digit} - ${responseData?.data?.[0]?.nic_4_digit} - ${responseData?.data?.[0]?.nic_5_digit}`;
//     // const nicCodeSplit = doc.splitTextToSize(nicCode, 130);  // Split if necessary to avoid overflow

//     doc.setFont("helvetica", "bold");
//     let yOffset = contentY;

//     userDetails.forEach(item => {
//       doc.text(`${item.label} :`, contentX + 2, yOffset + 3);
//       doc.setFont("helvetica", "normal");
//       doc.text(item.value || "N/A", contentX + 54, yOffset + 3);
//       yOffset += 10; // Adjust the Y offset for the next line
//     });

//     // Add NIC Code below the user details
//     // doc.setFont("helvetica", "bold");
//     // doc.text("NIC Code:", contentX + 2, yOffset + 3);  // NIC label
//     // doc.setFont("helvetica", "normal");
//     // doc.text(nicCodeSplit, contentX + 54, yOffset + 3);  // NIC details

//     // yOffset += nicCodeSplit.length * 5; // Adjust for the multiline NIC text

//     // Footer with signatures
//     doc.setFont("helvetica", "bold");
//     doc.text("Signature of the Authorised Signatory", 14, 241);
//     doc.text("Signature of the Branch Manager", 110, 241);

//     doc.setFont("helvetica", "normal");
//     doc.text("Name: __________________", 14, 250);
//     doc.text("Name: __________________", 110, 250);

//     doc.text("Designation: ____________", 14, 260);
//     doc.text("Designation: ____________", 110, 260);

//     doc.text("Phone no.: ______________", 14, 270);
//     doc.text("Date: ___________________", 110, 270);

//     // Bank Seal
//     doc.setFont("helvetica", "normal");
//     doc.text("(Bank Seal)", 14, 283);
//     doc.text("Verified By : User", 120, 283);

//     // Save PDF
//     const fileName = `${responseData?.data?.[0]?.name}_verification_certificate.pdf`;
//     doc.save(fileName);
// };
const generatePDF = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Add a full-page border
  doc.setDrawColor(0);
  doc.setLineWidth(0.7);
  doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(25);
  const title = "Shankar Nagari Sahakari Bank Ltd";
  doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

  // Subtitle
  doc.setFontSize(14);
  const subtitle = "Udyam Aadhaar Verification Certificate";
  doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, 28);

  // Section Header
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const header = "TO WHOMSOEVER IT MAY CONCERN";
  doc.text(header, (pageWidth - doc.getTextWidth(header)) / 2, 36);

  // Verification Statement
  const verificationText = `This is to Certify that ${
      responseData?.data?.[0]?.name || "N/A"
  }, Udyam Id No. ${responseData?.data?.[0]?.document_id} is verified from the Udyam portal.`;
  const verificationSplit = doc.splitTextToSize(verificationText, 180);
  doc.text(verificationSplit, 14, 50);

  // Outer Border
  const outerX = 10;
  const outerY = 62;
  const outerWidth = 190;
  const outerHeight = 170; // Increased height for better spacing
  doc.setDrawColor(0);
  doc.setLineWidth(0.7);
  doc.rect(outerX, outerY, outerWidth, outerHeight);

  // User Details
  const contentX = 14;
  let yOffset = 70;

  const nicData = responseData?.data?.[0] || {};
  const processNicData = (label, value) => {
      if (!value) return `${label}: N/A`;
      return value.length > 5 ? `${label}: ${value.slice(0, 5)}\n${value.slice(5)}` : `${label}: ${value}`;
  };

  const userDetails = [
      { label: "Enterprise Name", value: nicData.name },
      { label: "Reference ID", value: nicData.reference_id },
      { label: "Document ID", value: nicData.document_id },
      { label: "Major Activity", value: nicData.major_activity },
      { label: "Enterprise Type", value: nicData.enterprise_type },
      { label: "Organization Type", value: nicData.organization_type },
      { label: "Enterprise Mobile", value: nicData.mobile },
      { label: "Enterprise Email", value: nicData.email },
      { label: "Enterprise Address", value: `${nicData.e_door_no},${nicData.e_building},${nicData.e_area},${nicData.e_street},, ${nicData.e_city}, ${nicData.e_state},${nicData.e_pincode}` },
      { label: "Udyam Registration Date", value: nicData.date_of_udyam_registration },
      { label: "MSME DI", value: nicData.msme_di },
      { label: "DIC", value: nicData.dic },
      { label: "Date of Incorporation", value: nicData.date_of_incorporation },
      { label: "Social Category", value: nicData.social_category },
      { label: "Nic Data 2 Digit", value: processNicData("NIC Data 2 Digit", nicData.nic_2_digit) },
      { label: "Nic Data 4 Digit", value: processNicData("NIC Data 4 Digit", nicData.nic_4_digit) },
      { label: "Nic Data 5 Digit", value: processNicData("NIC Data 5 Digit", nicData.nic_5_digit) },
      { label: "Verification Date", value: nicData.VerifiedDate },
  ];

  doc.setFont("helvetica", "bold");
  userDetails.forEach(item => {
      doc.text(`${item.label} :`, contentX + 2, yOffset);
      doc.setFont("helvetica", "normal");

      // Handle line breaking for NIC Data
      const splitText = doc.splitTextToSize(item.value, 120);
      doc.text(splitText, contentX + 54, yOffset);

      yOffset += splitText.length * 7; // Increased line height spacing
  });

  // Footer with Signatures
  doc.setFont("helvetica", "bold");
  doc.text("Signature of the Authorised Signatory", 14, 246);
  doc.text("Signature of the Branch Manager", 110, 246);
  doc.setFont("helvetica", "normal");
  doc.text("Name: __________________", 14, 255);
  doc.text("Name: __________________", 110, 255);
  doc.text("Designation: ____________", 14, 265);
  doc.text("Designation: ____________", 110, 265);
  doc.text("Phone no.: ______________", 14, 275);
  doc.text("Date: ___________________", 110, 275);
  doc.text("(Bank Seal)", 14, 288);
  doc.text("Verified By : User", 120, 288);

  // Save PDF
  const fileName = `${nicData.name || "User"}_verification_certificate.pdf`;
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
    <div className="container-fluid">
      <div className="d-flex align-items-center">
        <div className="p-3" style={{ maxWidth: '1200px', width: '100%' }}>
        <h1 className="card-title" style={{color:'green'}}>Udyam Aadhaar Verification</h1>
          <div style={styles.statusBar} className='mt-3'>
          <div>
            {/* Display specific count for 'credit' */}
            <div>
              <span>No. Of Count : {verificationCounts.udyancard}</span>
            </div>
          </div>{" "}
          <span>Your available Credit: -62</span>
        </div>
        <div>
        <label>Enter Udyam Number : &nbsp;</label>
        <input
          type="text"
          value={udyamAadhaar}
          id="udyam_aadhaar"
          onChange={(e) => setUdyamAadhaar(e.target.value)}
          placeholder="Enter Udyam Aadhaar"
          style={inputStyle}
        />
        <div className="buttons mt-3">
        {!isVerified &&<button style={styles.button} onClick={handleVerify} disabled={loading} >{loading ? 'Verifying...' : 'Verify'}</button>}
            <button type="button" style={styles.button} onClick={handleExcelDownload}>Excel Report</button>
            <button style={styles.button} onClick={() => setUdyamAadhaar("")}>Clear</button>
            <button style={styles.button}>Search</button>
          </div>
      </div>
          {/* <h1 className="card-title">Udyam Aadhaar Verification</h1> */}
          {/* <div className="mb-3">
            <label htmlFor="udyam_aadhaar" className="form-label">Enter Udyam Aadhaar Number</label>
            <input
              type="text"
              className="form-control"
              id="udyam_aadhaar"
              value={udyamAadhaar}
              onChange={(e) => setUdyamAadhaar(e.target.value)}
            />
          </div> */}
          {/* <button className="btn btn-primary" onClick={handleVerify} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button> */}

          {/* Show error if any */}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>

      {/* Show response data below the card */}
      {/* {!isVerified  && responseData && (
        <div className="container mt-5">
          <h3>Verification Result</h3>
          <div className="card shadow p-3">
            <p><strong>Status:</strong> {responseData.status ? 'Verified' : 'Not Verified'}</p>
            <p><strong>Document ID:</strong> {responseData?.data?.[0]?.enterprise_data?.document_id}</p>
            <p><strong>Enterprise Name:</strong> {responseData?.verifiedData?.data?.enterprise_data?.name}</p>
            <p><strong>Business Type:</strong> {responseData?.verifiedData?.data?.enterprise_data?.enterprise_type}</p>
            <p><strong>Major Activity:</strong> {responseData?.verifiedData?.data?.enterprise_data?.major_activity}</p>
            <p><strong>Business Type:</strong> {responseData?.verifiedData?.data?.enterprise_data?.organization_type}</p>
            <p><strong>Mobile:</strong> {responseData?.verifiedData?.data?.enterprise_data?.mobile}</p>
            <p><strong>Email:</strong> {responseData?.verifiedData?.data?.enterprise_data?.email}</p>
            <p><strong>Address:</strong> {responseData?.verifiedData?.data?.enterprise_data?.address?.door_no}, {responseData?.verifiedData?.data?.enterprise_data?.address?.building}, {responseData?.verifiedData?.data?.enterprise_data?.address?.area}, {responseData?.verifiedData?.data?.enterprise_data?.address?.city}, {responseData?.verifiedData?.data?.enterprise_data?.address?.state} - {responseData?.verifiedData?.data?.enterprise_data?.address?.pincode}</p>
            <p><strong>Date of Incorporation:</strong> {responseData?.verifiedData?.data?.enterprise_data?.date_of_incorporation}</p>
            <p><strong>Date of Udyam Registration:</strong> {responseData?.verifiedData?.data?.enterprise_data?.date_of_udyam_registration}</p>
            <p><strong>Dic:</strong> {responseData?.verifiedData?.data?.enterprise_data?.dic}</p>
            <p><strong>Msme_Di:</strong> {responseData?.verifiedData?.data?.enterprise_data?.msme_di}</p>
            <p><strong>Social Category:</strong> {responseData?.verifiedData?.data?.enterprise_data?.social_category}</p> */}

            {/* <h5 className="mt-3">Nic Data</h5>
{responseData?.verifiedData?.data?.enterprise_data?.nic_data ? (
  <div>
    <p><strong>Nic_2_Digit:</strong> {responseData?.data?.[0]?.nic_data.nic_2_digit}</p>
    <p><strong>Nic_4_Digit:</strong> {responseData.verifiedData.data.enterprise_data.nic_data.nic_4_digit}</p>
    <p><strong>Nic_5_Digit:</strong> {responseData.verifiedData.data.enterprise_data.nic_data.nic_5_digit}</p>
  </div>
) : (
  <p>No NIC Data available.</p>
)}

<h5 className="mt-3">Enterprise Units</h5>
{responseData?.verifiedData?.data?.enterprise_data?.enterprise_units?.length > 0 ? (
  responseData.verifiedData.data.enterprise_data.enterprise_units.map((unit, index) => (
    <div key={index}>
      <p><strong>Unit {index + 1} Name:</strong> {unit.name}</p>
      <p><strong>Unit Address:</strong> {unit?.address?.door_no}, {unit?.address?.building}, {unit?.address?.area}, {unit?.address?.city}, {unit?.address?.state} - {unit?.address?.pincode}</p>
    </div>
  ))
) : (
  <p>No Enterprise Units available.</p>
)} */}

{/* 
          </div>
          <button className="btn btn-success mt-3" onClick={generatePDF}>Download PDF</button>
        </div>
      )} */}

{!isVerified && responseData && (
  <div className="container mt-5 d-flex justify-content-center">
    <div className="card shadow-lg p-4" style={{ borderRadius: '10px', backgroundColor: '#f8f9fa', maxWidth: '800px' }}>
      <table className="table table-bordered" style={{ fontSize: '16px' }}>
        <thead>
          <tr>
            <th colSpan="2" className="text-center" style={{ fontSize: '28px', fontWeight: 'bold', color: '#686868' }}>
              VERIFICATION DETAILS
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Status:</td>
            <td style={{ textAlign: 'left', color: responseData.status ? 'green' : 'red' }}>
              {responseData.status ? "Verified" : "Not Verified"}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Reference ID:</td>
            <td style={{ textAlign: 'left' }}>{responseData?.data?.[0]?.reference_id}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Document ID:</td>
            <td style={{ textAlign: 'left' }}>{responseData?.data?.[0]?.document_id}</td>
          </tr>
          {/* Existing personal details */}
          <tr>
            <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Enterprise Name:</td>
            <td style={{ textAlign: 'left' }}> {responseData?.data?.[0]?.name}</td>
          </tr>
          {/* Add other personal details here */}
          
          {/* Enterprise Details */}
          <tr>
            <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Enterprise Type:</td>
            <td style={{ textAlign: 'left' }}>{responseData?.data?.[0]?.enterprise_type}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Major Activity:</td>
            <td style={{ textAlign: 'left' }}>{responseData?.data?.[0]?.major_activity}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Organization Type:</td>
            <td style={{ textAlign: 'left' }}>{responseData?.data?.[0]?.organization_type}</td>
          </tr>
          {/* Add other enterprise details here */}
          <tr>
            <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Enterprise Mobile:</td>
            <td style={{ textAlign: 'left' }}>
            {responseData?.data?.[0]?.mobile}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Enterprise Email:</td>
            <td style={{ textAlign: 'left' }}>{responseData?.data?.[0]?.email}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Enterprise Address:</td>
            <td style={{ textAlign: 'left' }}>{responseData?.data?.[0]?.e_door_no}, {responseData?.data?.[0]?.e_building}, {responseData?.data?.[0]?.e_area},{responseData?.data?.[0]?.e_street}, {responseData?.data?.[0]?.e_city}, {responseData?.data?.[0]?.e_state} - {responseData?.data?.[0]?.e_pincode}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Date of Incorporation:</td>
            <td style={{ textAlign: 'left' }}>{responseData?.data?.[0]?.date_of_incorporation}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Date of Commencement:</td>
            <td style={{ textAlign: 'left' }}>{responseData?.data?.[0]?.date_of_commencement}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Date of Udyam Registration:</td>
            <td style={{ textAlign: 'left' }}>{responseData?.data?.[0]?.date_of_udyam_registration}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Dic:</td>
            <td style={{ textAlign: 'left' }}>{responseData?.data?.[0]?.dic}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Msme_Di:</td>
            <td style={{ textAlign: 'left' }}>{responseData?.data?.[0]?.msme_di}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Social Category:</td>
            <td style={{ textAlign: 'left' }}>{responseData?.data?.[0]?.social_category}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Nic Data 2 Digit:</td>
            <td style={{ textAlign: 'left' }}>{responseData?.data?.[0]?.nic_2_digit}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Nic Data 4 Digit:</td>
            <td style={{ textAlign: 'left' }}>{responseData?.data?.[0]?.nic_4_digit}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Nic Data 5 Digit:</td>
            <td style={{ textAlign: 'left' }}>{responseData?.data?.[0]?.nic_5_digit}</td>
          </tr>
        </tbody>
      </table>

      <div className="text-center mt-4">
        <button
          className="btn btn-success btn-lg"
          style={{
            fontSize: '16px',
            padding: '12px 20px',
            borderRadius: '5px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
          onClick={generatePDF}
        >
          Download PDF
        </button>
      </div>
    </div>
  </div>
)}

      <UdyamTable/>
    </div>
  );
};

export default UdyamAadhaar;
