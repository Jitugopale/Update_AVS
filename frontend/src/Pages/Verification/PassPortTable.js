import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';

const PassPortTable = () => {
  const [startDate, setStartDate] = React.useState(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // Format date to 'yyyy-mm-dd'
    return formattedToday;
  });  
  const [endDate, setEndDate] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [users, setUsers] = useState([]); // State to store users list

  
  const handleDownload = () => {
    // Filter the users based on the date range
    const filteredUsers = verifiedUsers.filter((user) => {
      // Parse `formattedDate` into a JavaScript Date object
      const [day, month, year] = user.VerifiedDate.split("-").map(Number);
      const userVerificationDate = new Date(year, month - 1, day); // Create Date object
  
      let isInDateRange = true;
  
      // Parse startDate and endDate from the input fields
      const startDateObj = startDate ? new Date(startDate) : null;
      let endDateObj = endDate ? new Date(endDate) : null;
  
      // Adjust endDate to include the full day
      if (endDateObj) {
        endDateObj.setHours(23, 59, 59, 999);
      }
  
      // Include users with a `formattedDate` equal to `startDate`
      if (startDate && userVerificationDate.toDateString() === startDateObj.toDateString()) {
        return true;
      }
  
      // Handle case where startDate equals endDate (specific day filtering)
      if (startDate && endDate && startDate === endDate) {
        isInDateRange =
          userVerificationDate.toDateString() === startDateObj.toDateString();
      } else {
        // General range filtering
        isInDateRange =
          (!startDateObj || userVerificationDate >= startDateObj) &&
          (!endDateObj || userVerificationDate <= endDateObj);
      }
  
      return isInDateRange;
    });
  
    if (filteredUsers.length === 0) {
      alert('No data to download');
      return;
    }
  
    // Map the filtered data to match the desired format for Excel export
    const exportData = filteredUsers.map((user,index) => ({
      'SrNo': index + 1,  // You can adjust this if the `SrNo` is not directly available in the data
      'File Number': user?.file_number || "N/A",  // Passport ID
        'Full Name': user?.full_name || "N/A",  // Full name
        'DOB': user?.dob || "N/A",  // Date of Birth
        'Date of Application': user?.date_of_application || "N/A",  // Date of Application
        'Application Type': user?.application_type || "N/A",  // Application Type
        'Status': user?.status,  // Status
        'Reference ID': user?.reference_id || "N/A",
        'Verification Date': user.VerifiedDate,
    }));
  
    // Prepare data for Excel
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Users');
  
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'filtered-users.xlsx');
  };

  // Fetch the verified users from the backend
  // useEffect(() => {
  //   const fetchVerifiedUsers = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://192.168.20.150:82/Document_Verify_Back/api/Passport/GetAll"
  //       );
  //       setVerifiedUsers(response.data.data); // Set the fetched data into the state
  //       console.log(response.data)
  //     } catch (error) {
  //       console.error("Error fetching verified users:", error);
  //     }
  //   };
  //   fetchVerifiedUsers();
  // },[]);
  useEffect(() => {
    const authenticateAndFetchUsers = async () => {
      try {
        // Step 1: Authenticate and get JWT token
        const authResponse = await axios.post("https://localhost:7057/api/auth/authenticateUser", {
          userId: 0,
          fullName: "string",
          userName: "string",
          phoneNo: "string",
          userEmail: "string",
          role: "string"
        });

        if (authResponse.data.success) {
          const token = authResponse.data.access_token;

          // Step 2: Fetch verified users with JWT token
          const response = await axios.get("https://localhost:7057/api/verification/getallPassport", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });

          setVerifiedUsers(response.data.passportlist);
          console.log("Verified Users Passport:", response.data);
        }
      } catch (error) {
        console.error("Error fetching verified users:", error);
      }
    };

    authenticateAndFetchUsers();
  }, []);

  

//   const handleDelete = async (aadharNumber) => {
//     // Show confirmation dialog
//     const isConfirmed = window.confirm("Are you sure you want to delete this user?");
  
//     // If user clicks "Yes"
//     if (isConfirmed) {
//       try {
//         const response = await axios.delete(`http://localhost:5000/api/voter/delete/${aadharNumber}`);
        
//         if (response.data.message === "User deleted successfully.") {
//           // If deletion is successful, update state by filtering out the deleted user
//           setUsers((prevUsers) => prevUsers.filter((user) => user.aadharNumber !== aadharNumber));
//           alert("User deleted successfully.");
//         } else {
//           alert("Failed to delete user.");
//         }
//       } catch (error) {
//         console.error("Error deleting user:", error);
//         alert("Failed to delete user. Please try again.");
//       }
//     } else {
//       // If user clicks "No", just return without deleting
//       alert("User deletion canceled.");
//     }
//   };
  

  // Function to generate and download the PDF
//   const handleDownloadPdf = (user) => {
//     const doc = new jsPDF();

//     // Add title
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(16);
//     doc.text("Aadhaar Verification Details", 14, 20);

//     doc.setLineWidth(0.5);
//     doc.line(10, 22, 200, 22);

//     // Add Aadhaar details
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(12);
//     doc.text(`Aadhaar Number: ${user.aadharNumber}`, 14, 75);
//     doc.text(`Name: ${user.verifiedData?.data?.full_name}`, 14, 85);
//     doc.text(`Gender: ${user.verifiedData?.data?.gender}`, 14, 95);
//     doc.text(`DOB: ${user.verifiedData?.data?.dob}`, 14, 105);

//     doc.text("Address:", 14, 115);
//     const addressLines = [
//       user?.verifiedData?.data?.address?.house,
//       user?.verifiedData?.data?.address?.street,
//       user?.verifiedData?.data?.address?.landmark,
//       user?.verifiedData?.data?.address?.loc,
//       user?.verifiedData?.data?.address?.po,
//       user?.verifiedData?.data?.address?.subdist,
//       user?.verifiedData?.data?.address?.dist,
//       user?.verifiedData?.data?.address?.state,
//       user?.verifiedData?.data?.address?.country,
//       user?.verifiedData?.data?.address?.zip,
//     ]
//       .filter(Boolean)
//       .join(", ");
//     const addressSplit = doc.splitTextToSize(addressLines, 180);
//     doc.text(addressSplit, 14, 120);

//     // Add the profile image
//     const imageData = `data:image/jpeg;base64,${user.verifiedData.data.profile_image}`;

//     // Add the image to the PDF (positioned at x=14, y=30 with width=50 and height=50)
//     doc.addImage(imageData, "JPEG", 14, 30, 35, 35);

//     // Footer text
//     doc.setFont("helvetica", "italic");
//     doc.setFontSize(10);
//     doc.text("Generated by Aadhaar Verification System", 14, 290);

//     // Save the PDF
//     doc.save(`${user.verifiedData?.data?.full_name}_aadhaar_verification.pdf`);
//   };

const handleDownloadPdf = (user) => {
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
    user.full_name || "N/A"
  }, Voter ID No. ${user.file_number} are verified.`;
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
  doc.text("success", contentX + 54, contentY + 5);

  doc.setFont("helvetica", "bold");
  doc.text("File Number                 :", contentX + 2, contentY + 15);
  doc.setFont("helvetica", "normal");
  doc.text(user.file_number ? user.file_number.toString() : "N/A", contentX + 54, contentY + 15);

  doc.setFont("helvetica", "bold");
  doc.text("Full Name                     :", contentX + 2, contentY + 25);
  doc.setFont("helvetica", "normal");
  doc.text(user.full_name ? user.full_name.toString() : "N/A", contentX + 54, contentY + 25); 

  doc.setFont("helvetica", "bold");
  doc.text("Date of Birth                 :", contentX + 2, contentY + 35);
  doc.setFont("helvetica", "normal");
  doc.text(user.dob ? user.dob.toString() : "N/A", contentX + 54, contentY + 35);

  doc.setFont("helvetica", "bold");
  doc.text("Date of Application      :", contentX + 2, contentY + 45);
  doc.setFont("helvetica", "normal");
  doc.text(user.date_of_application ? user.date_of_application.toString() : "N/A", contentX + 54, contentY + 45);

  doc.setFont("helvetica", "bold");
    doc.text("Application Type          :", contentX + 2, contentY + 55);
    doc.setFont("helvetica", "normal");
    doc.text(user.application_type ? user.application_type.toString() : "N/A", contentX + 54, contentY + 55);
  
    doc.setFont("helvetica", "bold");
    doc.text("Reference ID          :", contentX + 2, contentY + 65);
    doc.setFont("helvetica", "normal");
    doc.text(user.reference_id ? user.reference_id.toString() : "N/A", contentX + 54, contentY + 65);
  

    doc.setFont("helvetica", "bold");
    doc.text("Verification Date           :", contentX + 2, contentY + 75);
    doc.setFont("helvetica", "normal");
    doc.text(user.VerifiedDate ? user.VerifiedDate.toString() : "N/A", contentX + 54, contentY + 75);
  
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
  const fileName =user.file_number
    ? `${user.full_name}_verification_certificate.pdf`
    : "verification_certificate.pdf";
  doc.save(fileName);
};

// const handleDownloadPdf = (user) => {
//     if (!user.verifiedData || !user.verifiedData.data) {
//       alert('No data to generate PDF');
//       return;
//     }

//     const data = user.verifiedData.data;
//     const doc = new jsPDF();

//     let yPosition = 10;
//     const labelXPosition = 10;
//     const valueXPosition = 50;

//     doc.setFontSize(16);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Passport Verification Details', 15, yPosition);
//     yPosition += 15;

//     // Passport Verification Information
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'normal');

//     doc.text('Passport Verification Information:', labelXPosition, yPosition);
//     yPosition += 10;


//     doc.setFont('helvetica', 'bold');
//     doc.text(`Status:`, labelXPosition, yPosition);
//     doc.setFont('helvetica', 'normal');
//     doc.text(`${user.verifiedData.message}`, valueXPosition, yPosition);
//     yPosition += 10;
    
//     doc.setFont('helvetica', 'bold');
//     doc.text(`Reference ID:`, labelXPosition, yPosition);
//     doc.setFont('helvetica', 'normal');
//     doc.text(`${user.verifiedData.reference_id}`, valueXPosition, yPosition);
//     yPosition += 10;

//     doc.setFont('helvetica', 'bold');
//     doc.text(`File Number:`, labelXPosition, yPosition);
//     doc.setFont('helvetica', 'normal');
//     doc.text(`${user.verifiedData.data.file_number}`, valueXPosition, yPosition);
//     yPosition += 10;

//     // Full Name
//     doc.setFont('helvetica', 'bold');
//     doc.text(`Full Name:`, labelXPosition, yPosition);
//     doc.setFont('helvetica', 'normal');
//     doc.text(`${user.verifiedData.data.full_name}`, valueXPosition, yPosition);
//     yPosition += 10;

//     // Date of Birth
//     doc.setFont('helvetica', 'bold');
//     doc.text(`Date of Birth:`, labelXPosition, yPosition);
//     doc.setFont('helvetica', 'normal');
//     doc.text(`${user.verifiedData.data.dob}`, valueXPosition, yPosition);
//     yPosition += 10;

//     // Date of Application
//     doc.setFont('helvetica', 'bold');
//     doc.text(`Date of Application:`, labelXPosition, yPosition);
//     doc.setFont('helvetica', 'normal');
//     doc.text(`${user.verifiedData.data.date_of_application}`, 55, yPosition);
//     yPosition += 10;

//     // Application Type
//     doc.setFont('helvetica', 'bold');
//     doc.text(`Application Type:`, labelXPosition, yPosition);
//     doc.setFont('helvetica', 'normal');
//     doc.text(`${user.verifiedData.data.application_type}`, valueXPosition, yPosition);
//     yPosition += 10;

//     // Save PDF
//     doc.save('Passport_Verification_Details.pdf');
//   };

  
  

  return (
    <>
      <h3 style={{
                  marginTop:'65px',fontSize:'28px',color:'darkgoldenrod'
                }}>Verified Users</h3>
     <div className="row mb-3" style={{marginTop:'14px'}}>
  <div className="col-12 col-md-1" style={{width:'100px', marginTop:'13px'}}>
    <p style={{color:'black'}}>From Date</p>
  </div>
  <div className="col-12 col-md-2">
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      placeholder="Start Date"
    />
  </div>

  <div className="col-12 col-md-1 mt-md-0 offset-md-1">
    <p  style={{marginTop:'13px',color:'black'}}>To Date</p>
  </div>
  <div className="col-12 col-md-2">
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      placeholder="End Date"
    />
  </div>

  <div className="col-12 col-md-2 mt-1 mt-md-0">
  <button onClick={handleDownload}>Excel Download</button>
  </div>
</div>


      <div
        style={{
          maxHeight: "400px", // Set the desired maximum height for the table container
          overflowY: "auto", // Enable vertical scrolling
          border: "1px solid #ddd", // Optional: Add a border to the container
        }}
      >
        <table style={{width:"100%"}}>
          <thead>
            <tr>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                Sr No
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                PassPort ID
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                Name
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                DOB
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                Date of Application
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                Verification Date
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                Download
              </th>
            </tr>
          </thead>
          <tbody>
          {verifiedUsers
  // .filter((user) => {
  //   // Parse `formattedDate` into a JavaScript Date object
  //   const [day, month, year] = user.VerifiedDate.split("-").map(Number);
  //   const userVerificationDate = new Date(year, month - 1, day); // Create Date object

  //   let isInDateRange = true;

  //   // Parse startDate and endDate from the input fields
  //   const startDateObj = startDate ? new Date(startDate) : null;
  //   let endDateObj = endDate ? new Date(endDate) : null;

  //   // Adjust endDate to include the full day
  //   if (endDateObj) {
  //     endDateObj.setHours(23, 59, 59, 999);
  //   }

  //    // Include users with a `formattedDate` equal to `startDate`
  //    if (startDate && userVerificationDate.toDateString() === startDateObj.toDateString()) {
  //     return true;
  //   }

  //   // Handle case where startDate equals endDate (specific day filtering)
  //   if (startDate && endDate && startDate === endDate) {
  //     isInDateRange =
  //       userVerificationDate.toDateString() === startDateObj.toDateString();
  //   } else {
  //     // General range filtering
  //     isInDateRange =
  //       (!startDateObj || userVerificationDate >= startDateObj) &&
  //       (!endDateObj || userVerificationDate <= endDateObj);
  //   }

  //   return isInDateRange;
  // })

              .map((user, index) => (
                <tr key={index} style={{ border: "1px solid #ddd" }}>
                                   <td style={{ padding: "8px", border: "1px solid #ddd" }}>
          {index + 1}
        </td>

                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.file_number}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.full_name || "Name not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.dob || "DOB not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.date_of_application || "DOB not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.verifiedDate || "DOB not available"}</td>

                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    <button
                      onClick={() => handleDownloadPdf(user)}
                      title="Download PDF"
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      <box-icon name='download'></box-icon>
                    </button>
                  </td>
                  {/* <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    <button
                    onClick={() => handleDelete(user.aadharNumber)}
                    title="Delete"
                    style={{
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                    >
                      <box-icon name="trash" type="solid"></box-icon>

                    </button>
                </td> */}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* <button
        onClick={() => {
          localStorage.clear(); // Clears all data from localStorage
          alert("All local storage data has been cleared!");
        }}
        style={{
          padding: "10px 20px",
          backgroundColor: "#FF6347", // Color for the button
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Clear All Data
      </button> */}
    </>
  );
};

export default PassPortTable;
