import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';

const GSTTable = () => {
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
      const [day, month, year] = user.formattedDate.split("/").map(Number);
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
      'SrNo': index + 1,  // Serial number for the row
        'GST No': user.verifiedData.data.gstin,
        'PAN No': user.verifiedData.data.pan_number,
        'Business Name': user.verifiedData.data.business_name,
        'Date of Registration': user.verifiedData.data.date_of_registration,
        'GST Status': user.verifiedData.data.gstin_status,
        'Status': user.responseData?.status === 'success' ? 'Verified' : 'Not Verified',
        'State Jurisdiction': user.verifiedData.data.state_jurisdiction,
        'Taxpayer Type': user.verifiedData.data.taxpayer_type,
        'Filing Status (Latest GSTR1)': user.verifiedData.data.filing_status?.[0]?.[0]?.status || 'N/A',
        'Last Filed GSTR3B': user.verifiedData.data.filing_status?.[0]?.[1]?.status || 'N/A',
        'Nature of Core Business': user.verifiedData.data.nature_of_core_business_activity_description,
        'Constitution of Business': user.verifiedData.data.constitution_of_business,
        'Center Jurisdiction': user.verifiedData.data.center_jurisdiction,
        'Address': user.verifiedData.data.address || 'No Address Available',
        'Field Visit Conducted': user.verifiedData.data.field_visit_conducted || 'No Field Visit',
        'Nature of Business Activities': user.verifiedData.data.nature_bus_activities?.join(', ') || 'N/A',
        'Aadhaar Validation': user.verifiedData.data.aadhaar_validation || 'N/A',
        'Aadhaar Validation Date': user.verifiedData.data.aadhaar_validation_date || 'N/A',
        'Date of Cancellation': user.verifiedData.data.date_of_cancellation || 'N/A',
        'Verification Date': user.formattedDate,
    }));
  
    // Prepare data for Excel
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Users');
  
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'filtered-users.xlsx');
  };

  // Fetch the verified users from the backend
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


// const handleDownloadPdf = (user) => {
//   if (!user || !user.verifiedData || !user.verifiedData.data) {
//     alert('No data to generate PDF');
//     return;
//   }

//   const data = user.verifiedData.data;

//   console.log(data); // Debugging: Ensure this shows the expected data

//   // Initialize jsPDF
//   const doc = new jsPDF();
//   let yPosition = 10; // Y position for text

//   // Title
//   doc.setFontSize(16);
//   doc.setFont('helvetica', 'bold');
//   doc.text('GST Verification Details', 15, yPosition);
//   yPosition += 15;

//   // Add GST Details
//   doc.setFontSize(12);
//   doc.setFont('helvetica', 'normal');
//   doc.text(`GSTIN: ${data.gstin}`, 10, yPosition);
//   yPosition += 10;
//   doc.text(`Business Name: ${data.business_name}`, 10, yPosition);
//   yPosition += 10;
//   doc.text(`State Jurisdiction: ${data.state_jurisdiction}`, 10, yPosition);
//   yPosition += 10;
//   doc.text(`Taxpayer Type: ${data.taxpayer_type}`, 10, yPosition);
//   yPosition += 10;
//   doc.text(`GST Status: ${data.gstin_status}`, 10, yPosition);
//   yPosition += 10;

//   // Filing Status (Latest GSTR1 and GSTR3B)
//   doc.text(`Filing Status (Latest GSTR1): ${data.filing_status?.[0]?.[0]?.status || 'N/A'}`, 10, yPosition);
//   yPosition += 10;
//   doc.text(`Last Filed GSTR3B: ${data.filing_status?.[0]?.[1]?.status || 'N/A'}`, 10, yPosition);
//   yPosition += 10;

//   // Registration and Business Information
//   doc.text(`Date of Registration: ${data.date_of_registration}`, 10, yPosition);
//   yPosition += 10;
//   doc.text(`Nature of Core Business: ${data.nature_of_core_business_activity_description}`, 10, yPosition);
//   yPosition += 10;
//   doc.text(`Constitution of Business: ${data.constitution_of_business}`, 10, yPosition);
//   yPosition += 10;

//   // Jurisdiction Information
//   doc.text(`Center Jurisdiction: ${data.center_jurisdiction}`, 10, yPosition);
//   yPosition += 10;
//   doc.text(`State Jurisdiction: ${data.state_jurisdiction}`, 10, yPosition);
//   yPosition += 10;

//   // Address and Field Visit Information
//   doc.text(`Address: ${data.address}`, 10, yPosition);
//   yPosition += 10;
//   doc.text(`Field Visit Conducted: ${data.field_visit_conducted}`, 10, yPosition);
//   yPosition += 10;

//   // Nature of Business Activities and Aadhaar Validation
//   doc.text(`Nature of Business Activities: ${data.nature_bus_activities?.join(', ')}`, 10, yPosition);
//   yPosition += 10;
//   doc.text(`Aadhaar Validation: ${data.aadhaar_validation}`, 10, yPosition);
//   yPosition += 10;
//   doc.text(`Aadhaar Validation Date: ${data.aadhaar_validation_date}`, 10, yPosition);
//   yPosition += 10;

//   // Cancellation Information
//   doc.text(`Date of Cancellation: ${data.date_of_cancellation || 'N/A'}`, 10, yPosition);
//   yPosition += 10;

//   // Save PDF
//   doc.save('GST_Details.pdf');
// };
const handleDownloadPdf = (user) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  let yPosition = margin;
  const data = user.verifiedData.data;

  const addPageBorder = () => {
    doc.setDrawColor(0); // Black color
    doc.setLineWidth(0.7);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
  };

  const addFooterSignatures = () => {
    // Ensure footer always starts on a new page if needed
    doc.addPage();
    addPageBorder(); // Add border to the new page
    let footerStartY = margin + 20;

    doc.setFont("helvetica", "bold");
    doc.text("Signature of the Authorised Signatory", 14, footerStartY);
    doc.text("Signature of the Branch Manager", 110, footerStartY);

    doc.setFont("helvetica", "normal");
    doc.text("Name: __________________", 14, footerStartY + 10);
    doc.text("Name: __________________", 110, footerStartY + 10);
    doc.text("Designation: ____________", 14, footerStartY + 20);
    doc.text("Designation: ____________", 110, footerStartY + 20);
    doc.text("Phone no.: ______________", 14, footerStartY + 30);
    doc.text("Date: ___________________", 110, footerStartY + 30);
    doc.text("(Bank Seal)", 14, footerStartY + 51);
    doc.text("Verified By: User", 120, footerStartY + 51);
  };

  const addText = (text, x, y) => {
    const lineHeight = 10;
    const textLines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    textLines.forEach((line) => {
      if (yPosition + lineHeight > pageHeight - margin) {
        doc.addPage();
        addPageBorder();
        yPosition = margin + 20; // Reset yPosition for new page
      }
      doc.text(line, x, yPosition);
      yPosition += lineHeight;
    });
  };

  addPageBorder();

  // Add title and header
  yPosition += 15 // Adds 20 units of space from the current position
  doc.setFont("helvetica", "bold");
  doc.setFontSize(25);
  const title = "Shankar Nagari Sahakari Bank Ltd";
  doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, yPosition);
  yPosition += 10;

  doc.setFontSize(14);
  const subtitle = "Voter ID Verification Certificate";
  doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, yPosition);
  yPosition += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const header = "TO WHOMSOEVER IT MAY CONCERN";
  doc.text(header, (pageWidth - doc.getTextWidth(header)) / 2, yPosition);
  yPosition += 15;

  // Verification text
  // const verificationText = `This is to certify that ${
  //   user.verifiedData.data.business_name || "N/A"
  // }, Voter ID No. ${
  //   data.gstin
  // }, are verified.`;
  
  // // Calculate the position to center the text
  // const textWidth = doc.getTextWidth(verificationText);
  // const xPosition = (pageWidth - textWidth) / 2; // Centers the text horizontally
  
  // addText(verificationText, xPosition, yPosition);
  const verificationText =` This is to certify that ${
    user.verifiedData.data.business_name
  }, GST No. ${
    user.verifiedData.data.gstin
  }, are verified.`;
  addText(verificationText, margin +10,yPosition);
  yPosition += 10 // Adds 20 units of space from the current position

  // Define positions and dimensions for the outer border
  const outerX = 15;
  const outerY = 78;
  const outerWidth = 180;
  const outerHeight = 200;

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

  

  // User details
  const userDetails = [
    `GSTIN                            : ${data.gstin}`,
    `Business Name                   : ${data.business_name}`,
    `State Jurisdiction               : ${data.state_jurisdiction}`,
    `Taxpayer Type                    : ${data.taxpayer_type}`,
    `GST Status                        : ${data.gstin_status}`,
    `Filing Status (Latest GSTR1)     : ${data.filing_status?.[0]?.[0]?.status || "N/A"}`,
    `Last Filed GSTR3B                 : ${data.filing_status?.[0]?.[1]?.status || "N/A"}`,
    `Date of Registration              : ${data.date_of_registration}`,
    `Nature of Core Business           : ${data.nature_of_core_business_activity_description}`,
    `Constitution of Business           : ${data.constitution_of_business}`,
    `Center Jurisdiction                 : ${data.center_jurisdiction}`,
    `Address                               : ${data.address}`,
    `Field Visit Conducted            : ${data.field_visit_conducted}`,
    `Nature of Business Activities: ${data.nature_bus_activities?.join(", ")}`,
    `Aadhaar Validation               : ${data.aadhaar_validation}`,
    `Aadhaar Validation Date       : ${data.aadhaar_validation_date}`,
  ];
  userDetails.forEach((detail) => addText(detail, margin +10,yPosition));

  // Add footer signatures on a new page
  addFooterSignatures();

  // Save PDF
  const fileName = user.verifiedData.data.file_number
    ? `${user.verifiedData.data.business_name}_verification_certificate.pdf`
    : "verification_certificate.pdf";
  doc.save(fileName);
};

  

  return (
    <>
      <h3 style={{
                  marginTop:'120px',fontSize:'28px',color:'darkgoldenrod'
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
        <table style={{width:'100%'}}>
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
                GST No
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                PAN No
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                Business Name
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                Date of Registration
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                GST Status
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
  .filter((user) => {
    // Parse `formattedDate` into a JavaScript Date object
    const [day, month, year] = user.formattedDate.split("/").map(Number);
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
  })

              .map((user, index) => (
                <tr key={index} style={{ border: "1px solid #ddd" }}>
                                   <td style={{ padding: "8px", border: "1px solid #ddd" }}>
          {index + 1}
        </td>

                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.verifiedData.data.gstin}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.verifiedData.data.pan_number || "Name not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.verifiedData.data.business_name || "DOB not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.verifiedData.data.date_of_registration || "DOB not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.verifiedData.data.gstin_status || "DOB not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.formattedDate || "DOB not available"}</td>

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

export default GSTTable;
