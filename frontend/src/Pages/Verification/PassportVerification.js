import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import PassPortTable from './PassPortTable';
import * as XLSX from "xlsx"; // Import xlsx library

const PassportVerification = () => {
  const [idNumber, setIdNumber] = useState('');
  const [dob, setDob] = useState('');
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

    const handleExcelDownload = () => {
      // Mapping the verified users data to the format required for Excel
        const excelData = verifiedUsers.map((user, index) => ({
        'SrNo': index + 1,  // Serial number
        'Passport ID': user?.verifiedData?.data?.file_number || "N/A",  // Passport ID
        'Name': user?.verifiedData?.data?.full_name || "N/A",  // Full name
        'DOB': user?.verifiedData?.data?.dob || "N/A",  // Date of Birth
        'Date of Application': user?.verifiedData?.data?.date_of_application || "N/A",  // Date of Application
        'Application Type': user?.verifiedData?.data?.application_type || "N/A",  // Application Type
        'Status': user?.verifiedData?.data?.status ? 'Verified' : 'Not Verified',  // Status
        'Reference ID': user?.verifiedData?.data?.reference_id || "N/A",
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
  
      // Fetch the verified users from the backend
  useEffect(() => {
    const fetchVerifiedUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/passport/verified"
        );
        setVerifiedUsers(response.data); // Set the fetched data into the state
      } catch (error) {
        console.error("Error fetching verified users:", error);
      }
    };
    fetchVerifiedUsers();
  },[]);


  const handleVerify = async () => {
    if (!idNumber || !dob) {
      setError('ID Number and Date of Birth are required');
      return;
    }

    setLoading(true);
    setError('');
    setResponseData(null);

    try {
      const res = await axios.post('http://localhost:5000/api/passport/passport_verify', { 
        id_number: idNumber, 
        dob 
      });
      if (res.data.status === 'success') {
        setResponseData(res.data.verifiedData);
      } else {
        setError(res.data.message || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF= () => {
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
    const subtitle = "Voter ID Verification Certificate";
    doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, 28);
  
    // Center-aligned section header
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const header = "TO WHOMSOEVER IT MAY CONCERN";
    doc.text(header, (pageWidth - doc.getTextWidth(header)) / 2, 36);
  
    // Verification Statement
    const verificationText = `This is to Certify that ${
       responseData.data.full_name || "N/A"
    }, Voter ID No. ${responseData.data.file_number} are verified.`;
    const verificationSplit = doc.splitTextToSize(verificationText, 180);
    doc.text(verificationSplit, 14, 50);
  
    // Define positions and dimensions for the outer border
    const outerX = 10;
    const outerY = 65;
    const outerWidth = 190;
    const outerHeight = 100
  
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
    doc.text("Status                           :", contentX + 2, contentY + 5);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.message || "N/A", contentX + 54, contentY + 5);
  
    doc.setFont("helvetica", "bold");
    doc.text("File Number                 :", contentX + 2, contentY + 15);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.data.file_number ? responseData.data.file_number.toString() : "N/A", contentX + 54, contentY + 15);
  
    doc.setFont("helvetica", "bold");
    doc.text("Full Name                     :", contentX + 2, contentY + 25);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.data.full_name ? responseData.data.full_name.toString() : "N/A", contentX + 54, contentY + 25); 
  
    doc.setFont("helvetica", "bold");
    doc.text("Date of Birth                 :", contentX + 2, contentY + 35);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.data.dob ? responseData.data.dob.toString() : "N/A", contentX + 54, contentY + 35);
  
    doc.setFont("helvetica", "bold");
    doc.text("Date of Application      :", contentX + 2, contentY + 45);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.data.date_of_application ? responseData.data.date_of_application.toString() : "N/A", contentX + 54, contentY + 45);
  
    doc.setFont("helvetica", "bold");
    doc.text("Application Type          :", contentX + 2, contentY + 55);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.data.application_type ? responseData.data.application_type.toString() : "N/A", contentX + 54, contentY + 55);
  
    doc.setFont("helvetica", "bold");
    doc.text("Verification Date           :", contentX + 2, contentY + 65);
    doc.setFont("helvetica", "normal");
    doc.text(responseData.data.formattedDate ? responseData.data.toString() : "N/A", contentX + 54, contentY + 65);
    
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
    const fileName =responseData.data.file_number
      ? `${responseData.data.full_name}_verification_certificate.pdf`
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
    width: "50%",
    boxSizing: "border-box",
  };

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center">
        <div className="p-3" style={{ maxWidth: '1200px', width: '100%' }}>
        <h1 className="card-title" style={{color:'green'}}>PassPort Verification</h1>
        <div style={styles.statusBar} className='mt-2'>
        <div>
            {/* Display specific count for 'credit' */}
            <div>
              <span>No. Of Count : {verificationCounts.passport}</span>
            </div>
          </div>{" "}
          <span>Your available Credit: -62</span>
        </div>
        <div>
        <div className='row'>
           <div className='col-md-6'>
           <label>Enter Passport ID : &nbsp;</label>
        <input
          type="text"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          placeholder="Enter PassPort Id"
          style={inputStyle}
        />
           </div>
           <div className='col-md-6'>
           <label>Enter Date of Birth : &nbsp;</label>
        <input
          type="date"
          value={dob}
          id="dob"
          onChange={(e) => setDob(e.target.value)}
          style={inputStyle}
        />
           </div>
        </div>
        <div className="buttons mt-3">
        {!isVerified &&<button style={styles.button} onClick={handleVerify} disabled={loading} >{loading ? 'Verifying...' : 'Verify'}</button>}
            <button type="button" style={styles.button} onClick={handleExcelDownload}>Excel Report</button>
            <button style={styles.button} onClick={() => setIdNumber("")}>Clear</button>
            <button style={styles.button}>Search</button>
          </div>
      </div>
      
          {/* <div className="mb-3">
            <label htmlFor="id_number" className="form-label">Enter Passport ID</label>
            <input
              type="text"
              className="form-control"
              id="id_number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="dob" className="form-label">Enter Date of Birth</label>
            <input
              type="date"
              className="form-control"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div> */}
          {/* <button className="btn btn-primary" onClick={handleVerify} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button> */}

          {/* Show error if any */}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>

      {!isVerified &&responseData && (
     <div className="container mt-5 d-flex justify-content-center">
     <div className="card shadow-lg p-4" style={{ borderRadius: '10px', backgroundColor: '#f8f9fa', maxWidth: '800px' }}>
       <table className="table table-bordered" style={{ fontSize: '16px' }}>
         <thead>
           <tr>
             <th colSpan="2" className="text-center" style={{ fontSize: '28px', fontWeight: 'bold',color:'#686868' }}>
               VERIFICATION DETAILS
             </th>
           </tr>
         </thead>
         <tbody>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Status :</td>
             <td style={{ textAlign: 'left', color: responseData.status ? 'green' : 'red' }}>
             {responseData.status ? 'Verified' : 'Not Verified'}
            </td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>File Number :</td>
             <td style={{ textAlign: 'left' }}>{responseData.data.file_number}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Full Name :</td>
             <td style={{ textAlign: 'left' }}>{responseData.data.full_name}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Reference ID :</td>
             <td style={{ textAlign: 'left' }}>{responseData.reference_id}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Date of Birth :</td>
             <td style={{ textAlign: 'left' }}>{responseData.data.dob}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Date of Application :</td>
             <td style={{ textAlign: 'left' }}>{responseData.data.date_of_application}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Application Type :</td>
             <td style={{ textAlign: 'left' }}>{responseData.data.application_type}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Status :</td>
             <td style={{ textAlign: 'left' }}>{responseData.data.status}</td>
           </tr>
           {/* <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>District:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data.district}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Polling Station:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data.polling_station}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Assembly Constituency:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data.assembly_constituency}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Constituency Number:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data.assembly_constituency_number}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Part Number:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data.part_number}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Part Name:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data.part_name}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Parliamentary Name:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data.parliamentary_name}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Parliamentary Number:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data.parliamentary_number}</td>
           </tr> */}
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

      {/* Show response data below the card */}
      {/* {responseData && (
        <div className="container mt-5">
          <h3>Verification Result</h3>
          <div className="card shadow p-3">
            <p><strong>Status:</strong> {responseData.status ? 'Verified' : 'Not Verified'}</p>
            <p><strong>Reference ID:</strong> {responseData.reference_id}</p>
            <p><strong>File Number:</strong> {responseData.data.file_number}</p>
            <p><strong>Full Name:</strong> {responseData.data.full_name}</p>
            <p><strong>Date of Birth:</strong> {responseData.data.dob}</p>
            <p><strong>Date of Application:</strong> {responseData.data.date_of_application}</p>
            <p><strong>Application Type:</strong> {responseData.data.application_type}</p>
            <p><strong>Status:</strong> {responseData.data.status}</p>
          </div>

          
          <div>
           <button className="btn btn-success mt-3" onClick={generatePDF}>Download PDF</button>
          </div>
        </div>
      )} */}
      <PassPortTable/>
    </div>
  );
};

export default PassportVerification;
