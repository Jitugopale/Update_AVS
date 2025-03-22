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

  const handleDownloadExcel = () => {
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
      'SrNo': index + 1,  // Serial number for the row
        'GST No': user.gstin,
        'PAN No': user.pan_number,
        'Business Name': user.business_name,
        'Legal Name': user.legal_name,
        'Date of Registration': user.date_of_registration,
        'GST Status': user.gstin_status,
        'Status': user.responseData?.status === 'success' ? 'Verified' : 'Not Verified',
        'State Jurisdiction': user.state_jurisdiction,
        'Taxpayer Type': user.taxpayer_type,
        'Filing Status (Latest GSTR1)': user.filing_status?.[0]?.[0]?.status || 'N/A',
        'Last Filed GSTR3B': user.filing_status?.[0]?.[1]?.status || 'N/A',
        'Nature of Core Business': user.nature_of_core_business_activity_description,
        'Constitution of Business': user.constitution_of_business,
        'Center Jurisdiction': user.center_jurisdiction,
        'Address': user.address || 'No Address Available',
        'Field Visit Conducted': user.field_visit_conducted || 'No Field Visit',
        'Nature of Business Activities': user.nature_bus_activities?.join(', ') || 'N/A',
        'Aadhaar Validation': user.aadhaar_validation || 'N/A',
        'Aadhaar Validation Date': user.aadhaar_validation_date || 'N/A',
        'Date of Cancellation': user.date_of_cancellation || 'N/A',
        'Verification Date': user.VerifiedDate,
    }));
  
    // Prepare data for Excel
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Users');
  
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'filtered-users.xlsx');
  };

  // useEffect(() => {
  //   const fetchVerifiedUsers = async () => {
  //     try {
  //       const response = await axios.get("https://192.168.20.150:82/Document_Verify_Back/api/GST/GetAll");
  
  //       // Ensure 'data' is properly parsed
  //       const parsedUsers = response.data.data.map(user => ({
  //         ...user,
  //         data: JSON.parse(user.data) // Convert string to JSON object
  //       }));
  
  //       setVerifiedUsers(parsedUsers); // Store parsed data in state
  //       // console.log(parsedUsers); // Debugging output
  //     } catch (error) {
  //       console.error("Error fetching verified users:", error);
  //     }
  //   };
  
  //   fetchVerifiedUsers();
  // }, []);
  


  

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
// const handleDownloadPdf = (user) => {
//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 10;
//   let yPosition = margin;
//   const data = user.data;

//   const addPageBorder = () => {
//     doc.setDrawColor(0); // Black color
//     doc.setLineWidth(0.7);
//     doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
//   };

//   const addFooterSignatures = () => {
//     // Ensure footer always starts on a new page if needed
//     doc.addPage();
//     addPageBorder(); // Add border to the new page
//     let footerStartY = margin + 20;

//     doc.setFont("helvetica", "bold");
//     doc.text("Signature of the Authorised Signatory", 14, footerStartY);
//     doc.text("Signature of the Branch Manager", 110, footerStartY);

//     doc.setFont("helvetica", "normal");
//     doc.text("Name: __________________", 14, footerStartY + 10);
//     doc.text("Name: __________________", 110, footerStartY + 10);
//     doc.text("Designation: ____________", 14, footerStartY + 20);
//     doc.text("Designation: ____________", 110, footerStartY + 20);
//     doc.text("Phone no.: ______________", 14, footerStartY + 30);
//     doc.text("Date: ___________________", 110, footerStartY + 30);
//     doc.text("(Bank Seal)", 14, footerStartY + 51);
//     doc.text("Verified By: User", 120, footerStartY + 51);
//   };

//   const addText = (text, x, y) => {
//     const lineHeight = 10;
//     const textLines = doc.splitTextToSize(text, pageWidth - 2 * margin);
//     textLines.forEach((line) => {
//       if (yPosition + lineHeight > pageHeight - margin) {
//         doc.addPage();
//         addPageBorder();
//         yPosition = margin + 20; // Reset yPosition for new page
//       }
//       doc.text(line, x, yPosition);
//       yPosition += lineHeight;
//     });
//   };

//   addPageBorder();

//   // Add title and header
//   yPosition += 15 // Adds 20 units of space from the current position
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(25);
//   const title = "Shankar Nagari Sahakari Bank Ltd";
//   doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, yPosition);
//   yPosition += 10;

//   doc.setFontSize(14);
//   const subtitle = "Voter ID Verification Certificate";
//   doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, yPosition);
//   yPosition += 10;

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(12);
//   const header = "TO WHOMSOEVER IT MAY CONCERN";
//   doc.text(header, (pageWidth - doc.getTextWidth(header)) / 2, yPosition);
//   yPosition += 15;

//   // Verification text
//   // const verificationText = `This is to certify that ${
//   //   user.verifiedData.data.business_name || "N/A"
//   // }, Voter ID No. ${
//   //   data.gstin
//   // }, are verified.`;
  
//   // // Calculate the position to center the text
//   // const textWidth = doc.getTextWidth(verificationText);
//   // const xPosition = (pageWidth - textWidth) / 2; // Centers the text horizontally
  
//   // addText(verificationText, xPosition, yPosition);
//   const verificationText =` This is to certify that ${
//     user.data.business_name
//   }, GST No. ${
//     user.data.gstin
//   }, are verified.`;
//   addText(verificationText, margin +10,yPosition);
//   yPosition += 10 // Adds 20 units of space from the current position

//   // Define positions and dimensions for the outer border
//   const outerX = 15;
//   const outerY = 74;
//   const outerWidth = 180;
//   const outerHeight = 200;

//   // Draw the outer border
//   doc.setDrawColor(0);
//   doc.setLineWidth(0.7);
//   doc.rect(outerX, outerY, outerWidth, outerHeight);

//   // Define positions and dimensions for content box
//   const contentX = 14;
//   const contentY = 70;
//   const contentWidth = 120;
//   const contentHeight = 90;

//   // Define positions and dimensions for the profile image box
//   const imageX = 150;
//   const imageY = 70;
//   const imageWidth = 40;
//   const imageHeight = 40;

  

//   // User details
//   const userDetails = [
//     `GSTIN                            : ${data.gstin}`,
//     `Pan Number                            : ${data.pan_number}`,
//     `Business Name                   : ${data.business_name}`,
//     `Legal Name                   : ${data.legal_name}`,
//     `State Jurisdiction               : ${data.state_jurisdiction}`,
//     `Taxpayer Type                    : ${data.taxpayer_type}`,
//     `GST Status                        : ${data.gstin_status}`,
//     // `Filing Status (Latest GSTR1)     : ${data.filing_status?.[0]?.[0]?.status || "N/A"}`,
//     // `Last Filed GSTR3B                 : ${data.filing_status?.[0]?.[1]?.status || "N/A"}`,
//     `Date of Registration              : ${data.date_of_registration}`,
//     `Nature of Core Business           : ${data.nature_of_core_business_activity_description}`,
//     `Constitution of Business           : ${data.constitution_of_business}`,
//     `Center Jurisdiction                 : ${data.center_jurisdiction}`,
//     `State Jurisdiction                 : ${data.state_jurisdiction}`,
//     `Address                               : ${data.address}`,
//     `Field Visit Conducted            : ${data.field_visit_conducted}`,
//     `Nature of Business Activities: ${data.nature_bus_activities?.join(", ")}`,
//     `Aadhaar Validation               : ${data.aadhaar_validation}`,
//     `Aadhaar Validation Date       : ${data.aadhaar_validation_date}`,
//     `Date of Cancellation     : ${data.date_of_cancellation}`,
//     `Client ID     : ${data.client_id}`,
//     `Constitution of Business     : ${data.constitution_of_business}`,
//     `Nature Bus Activities     : ${data.nature_bus_activities}`,
//     `Nature of Core Business Activity Code     : ${data.nature_of_core_business_activity_code}`,
//     `Nature of Core Business Activity Description     : ${data.nature_of_core_business_activity_description}`,
//     `Verification Date     : ${data.VerifiedDate}`,
//   ];
//   userDetails.forEach((detail) => addText(detail, margin +10,yPosition));

//   // Add footer signatures on a new page
//   addFooterSignatures();

//   // Save PDF
//   const fileName = user.data.file_number
//     ? `${user.data.business_name}_verification_certificate.pdf`
//     : "verification_certificate.pdf";
//   doc.save(fileName);
// };

// const handleDownloadPdf = (user) => {
//   if (!user || !user.data) {
//     console.error("User data is missing.");
//     return;
//   }

//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 10;
//   let yPosition = margin + 10;
//   const data = user.data;

//   const addPageBorder = () => {
//     doc.setDrawColor(0);
//     doc.setLineWidth(0.7);
//     doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
//   };

//   // Function to add text dynamically with wrapping & spacing
//   const addText = (label, value, x) => {
//     const lineHeight = 8;
//     const maxWidth = pageWidth - 60; // Limit width to prevent overflow
//     const wrappedValue = doc.splitTextToSize(value || "N/A", maxWidth);

//     // Ensure new page if content reaches bottom margin
//     if (yPosition + wrappedValue.length * lineHeight > pageHeight - margin - 50) {
//       doc.addPage();
//       addPageBorder();
//       yPosition = margin + 20;
//     }

//     doc.setFont("helvetica", "bold");
//     doc.text(`${label}:`, x, yPosition);
//     doc.setFont("helvetica", "normal");
//     doc.text(wrappedValue, x + 60, yPosition); // Proper spacing
//     yPosition += wrappedValue.length * lineHeight; // Adjust for multi-line text
//   };

//   addPageBorder();

//   // Title
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(18);
//   const title = "Shankar Nagari Sahakari Bank Ltd";
//   doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, yPosition);
//   yPosition += 12;

//   // Subtitle
//   doc.setFontSize(14);
//   const subtitle = "GST Verification Certificate";
//   doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, yPosition);
//   yPosition += 10;

//   // Header
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(12);
//   const header = "TO WHOMSOEVER IT MAY CONCERN";
//   doc.text(header, (pageWidth - doc.getTextWidth(header)) / 2, yPosition);
//   yPosition += 12;

//   const businessName = data.business_name ? String(data.business_name) : "N/A";
// const gstNumber = data.gstin ? String(data.gstin) : "N/A";

//   // Verification text
//   const certText = `This is to certify that ${businessName}, GST No. ${gstNumber}, are verified.`;
//   const wrappedText = doc.splitTextToSize(certText, pageWidth - 20);
//   doc.text(wrappedText, margin + 10, yPosition);
  
//   // Draw user details border
//   doc.setDrawColor(0);
//   doc.setLineWidth(0.7);
//   doc.rect(15, yPosition, 180, 190);
//   yPosition += 10;

//   // User details
//   const userDetails = [
//     { label: "GSTIN", value: data.gstin },
//     { label: "Pan Number", value: data.pan_number },
//     { label: "Business Name", value: data.business_name },
//     { label: "Legal Name", value: data.legal_name },
//     { label: "State Jurisdiction", value: data.state_jurisdiction },
//     { label: "Taxpayer Type", value: data.taxpayer_type },
//     { label: "GST Status", value: data.gstin_status },
//     { label: "Date of Registration", value: data.date_of_registration },
//     { label: "Nature of Core Business", value: data.nature_of_core_business_activity_description },
//     { label: "Constitution of Business", value: data.constitution_of_business },
//     { label: "Center Jurisdiction", value: data.center_jurisdiction },
//     { label: "State Jurisdiction", value: data.state_jurisdiction },
//     { label: "Address", value: data.address },
//     { label: "Field Visit Conducted", value: data.field_visit_conducted },
//     { label: "Nature of Business Activities", value: data.nature_bus_activities?.join(", ") },
//     { label: "Aadhaar Validation", value: data.aadhaar_validation },
//     { label: "Aadhaar Validation Date", value: data.aadhaar_validation_date },
//     { label: "Date of Cancellation", value: data.date_of_cancellation },
//     { label: "Client ID", value: data.client_id },
//     { label: "Nature of Core Business Activity Code", value: data.nature_of_core_business_activity_code },
//     { label: "Nature of Core Business Activity Description", value: data.nature_of_core_business_activity_description },
//     { label: "Verification Date", value: data.VerifiedDate },
//   ];
//   userDetails.forEach((detail) => addText(detail.label, detail.value, margin + 15));

//   yPosition += 15; // Ensure spacing before the footer

//   // **Footer Signatures Below Content**
//   const addFooterSignatures = () => {
//     if (yPosition + 40 > pageHeight - margin) {
//       doc.addPage();
//       addPageBorder();
//       yPosition = margin + 20;
//     }

//     doc.setFont("helvetica", "bold");
//     doc.text("Signature of the Authorised Signatory", 14, yPosition);
//     doc.text("Signature of the Branch Manager", 110, yPosition);

//     doc.setFont("helvetica", "normal");
//     doc.text("Name: __________________", 14, yPosition + 10);
//     doc.text("Name: __________________", 110, yPosition + 10);
//     doc.text("Designation: ____________", 14, yPosition + 20);
//     doc.text("Designation: ____________", 110, yPosition + 20);
//     doc.text("Phone no.: ______________", 14, yPosition + 30);
//     doc.text("Date: ___________________", 110, yPosition + 30);
//     doc.text("(Bank Seal)", 14, yPosition + 51);
//     doc.text("Verified By: User", 120, yPosition + 51);
//   };

//   // **Call Footer**
//   addFooterSignatures();

//   // Save PDF
//   const fileName = data.file_number
//     ? `${data.business_name}_verification_certificate.pdf`
//     : "verification_certificate.pdf";
//   doc.save(fileName);
// };


// const handleDownloadPdf = (user) => {
//   if (!user || !user.data) {
//     console.error("User data is missing.");
//     return;
//   }

//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 10;
//   let yPosition = margin + 10;
//   const data = user.data;

//   const addPageBorder = () => {
//     doc.setDrawColor(0);
//     doc.setLineWidth(0.7);
//     doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
//   };

//   // ✅ Updated Function to Handle Multi-Line Labels & Values
//   const addAlignedText = (label, value, xLabel, xValue) => {
//     const lineHeight = 8;
//     const maxLabelWidth = xValue - xLabel - 5; // Limit label width
//     const wrappedLabel = doc.splitTextToSize(label, maxLabelWidth);
//     const wrappedValue = doc.splitTextToSize(value || "N/A", pageWidth - xValue - margin);
  
//     // Ensure new page if needed
//     if (yPosition + lineHeight > pageHeight - margin - 50) {
//       doc.addPage();
//       addPageBorder();
//       yPosition = margin + 20;
//     }
  
//     // Get the highest line count between label and value
//     const maxLines = Math.max(wrappedLabel.length, wrappedValue.length);
  
//     // Loop through maxLines to print label and value side by side
//     for (let i = 0; i < maxLines; i++) {
//       if (wrappedLabel[i]) {
//         doc.setFont("helvetica", "bold");
//         doc.text(wrappedLabel[i], xLabel, yPosition);
//       }
//       if (wrappedValue[i]) {
//         doc.setFont("helvetica", "normal");
//         doc.text(wrappedValue[i], xValue, yPosition);
//       }
//       yPosition += lineHeight;
//     }
  
//     yPosition += 2; // Add extra space after each entry
//   };
  

//   addPageBorder();

//   // Title
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(18);
//   const title = "Shankar Nagari Sahakari Bank Ltd";
//   doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, yPosition);
//   yPosition += 12;

//   // Subtitle
//   doc.setFontSize(14);
//   const subtitle = "GST Verification Certificate";
//   doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, yPosition);
//   yPosition += 10;

//   // Header
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(12);
//   const header = "TO WHOMSOEVER IT MAY CONCERN";
//   doc.text(header, (pageWidth - doc.getTextWidth(header)) / 2, yPosition);
//   yPosition += 12;

//   // Verification text
//  // Verification text
// const businessName = data.business_name ? String(data.business_name) : "N/A";
// const gstNumber = data.gstin ? String(data.gstin) : "N/A";

// // ✅ Limit the length of business name to prevent long wrapping
// const maxBusinessNameLength = 50; // Adjust as needed
// const trimmedBusinessName =
//   businessName.length > maxBusinessNameLength
//     ? businessName.substring(0, maxBusinessNameLength) + "..."
//     : businessName;

// const certText = `This is to certify that ${trimmedBusinessName}, GST No. ${gstNumber}, are verified.`;

// // ✅ Wrap text within allowed width
// const wrappedText = doc.splitTextToSize(certText, pageWidth - 30); // Adjust width if needed
// doc.text(wrappedText, margin + 10, yPosition);

// // ✅ Adjust yPosition based on number of lines
// yPosition += 10; // Extra spacing after text

//   // Draw user details border
//   doc.setDrawColor(0);
//   doc.setLineWidth(0.7);
//   doc.rect(15, (yPosition += 10), 180, 200);
//   yPosition += 10;

//   // ✅ User Details with Multi-Line Labels
//   const userDetails = [
//     { label: "GSTIN", value: data.gstin },
//     { label: "Pan Number", value: data.pan_number },
//     { label: "Business Name", value: data.business_name },
//     { label: "Legal Name", value: data.legal_name },
//     { label: "State Jurisdiction", value: data.state_jurisdiction },
//     { label: "Taxpayer Type", value: data.taxpayer_type },
//     { label: "GST Status", value: data.gstin_status },
//     { label: "Date of Registration", value: data.date_of_registration },
//     { label: "Nature of Core Business", value: data.nature_of_core_business_activity_description },
//     { label: "Constitution of Business", value: data.constitution_of_business },
//     { label: "Center Jurisdiction", value: data.center_jurisdiction },
//     { label: "State Jurisdiction", value: data.state_jurisdiction },
//     { label: "Address", value: data.address },
//     { label: "Field Visit Conducted", value: data.field_visit_conducted },
//     { label: "Aadhaar Validation", value: data.aadhaar_validation },
//     { label: "Aadhaar Validation Date", value: data.aadhaar_validation_date },
//     { label: "Date of Cancellation", value: data.date_of_cancellation },
//     { label: "Client ID", value: data.client_id },
//     { label: "Nature of Core Business\nActivity Code", value: data.nature_of_core_business_activity_code },
//     { label: "Nature of Core Business\nActivity Description", value: data.nature_of_core_business_activity_description },
//     { label: "Verification Date", value: data.VerifiedDate },
//   ];

//   // Add details with proper alignment
//   userDetails.forEach((detail) => addAlignedText(detail.label, detail.value, margin + 15, margin + 80));


//   // Add Filing Status (GSTR1 and GSTR3B)
// //   yPosition += 10;
// //   doc.setFont("helvetica", "bold");
// //   doc.text("Filing Status:", margin + 15, yPosition);
// //   yPosition += 10;

// //  if (data.filing_status && data.filing_status.length > 0) {
// //     data.filing_status.forEach((filing) => {
// //       const filingText = `${filing.return_type} (${filing.tax_period} ${filing.financial_year}): ${filing.status}`;
// //       addAlignedText(filingText, "", margin + 15, margin + 80);
// //     });
// //   } else {
// //     addAlignedText("No Filing Status Available", "", margin + 15, margin + 80);
// //   }

//   // ✅ Ensure userData is an object
//   let userData = user.data;

//   if (typeof userData === "string") {
//     try {
//       userData = JSON.parse(userData);
//     } catch (error) {
//       console.error("Error parsing user data:", error);
//       return;
//     }
//   }

//   console.log("Final Parsed User Data:", userData);

//   if (!userData.filing_status || !Array.isArray(userData.filing_status)) {
//     console.error("Filing status data is missing or invalid.");
//     return;
//   }

//   console.log("Final Filing Status Data:", userData.filing_status);


//   doc.setFont("helvetica", "bold");
//   doc.text("Filing Status:", margin + 15, yPosition);
//   yPosition += 10;

//   userData.filing_status.forEach((filing) => {
//     const filingText = `${filing.return_type} (${filing.tax_period} ${filing.financial_year}): ${filing.status} \n Date of Filling - (${filing.date_of_filing})`;
//     doc.text(filingText, margin + 15, yPosition);
//     yPosition += 15;
//   });


//   yPosition += 15; // Ensure spacing before the footer

//   // ✅ Footer Signatures with Proper Spacing
//   const addFooterSignatures = () => {
//     if (yPosition + 40 > pageHeight - margin) { // Increased buffer space
//       doc.addPage();
//       addPageBorder();
//       yPosition = margin + 20;
//     }

//     doc.setFont("helvetica", "bold");
//     doc.text("Signature of the Authorised Signatory", 20, yPosition);
//     doc.text("Signature of the Branch Manager", 114, yPosition);

//     doc.setFont("helvetica", "normal");
//     doc.text("Name: __________________", 20, yPosition + 10);
//     doc.text("Name: __________________", 114, yPosition + 10);
//     doc.text("Designation: ____________", 20, yPosition + 20);
//     doc.text("Designation: ____________", 114, yPosition + 20);
//     doc.text("Phone no.: ______________", 20, yPosition + 30);
//     doc.text("Date: ___________________", 114, yPosition + 30);
//     doc.text("(Bank Seal)", 20, yPosition + 51);
//     doc.text("Verified By: User", 124, yPosition + 51);
//   };

//   addFooterSignatures();

//   // ✅ File Naming with Special Character Handling
//   const sanitizedFileName = data.business_name
//     ? data.business_name.replace(/[^a-zA-Z0-9-_]/g, "_") // Remove special chars
//     : "verification_certificate";
//   const fileName = `${sanitizedFileName}.pdf`;

//   doc.save(fileName);
// };
const handleDownloadPdf = (user) => {
  if (!user || !user.data) {
    console.error("User data is missing.");
    return;
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  let yPosition = margin + 10;
  const data = user.data;

  const addPageBorder = () => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.7);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
  };

  const checkPageBreak = (additionalHeight = 10) => {
    if (yPosition + additionalHeight > pageHeight - margin) {
      doc.addPage();
      addPageBorder();
      yPosition = margin + 20;
    }
  };

  const addAlignedText = (label, value, xLabel, xValue) => {
    const lineHeight = 8;
    const maxLabelWidth = xValue - xLabel - 5;
    const wrappedLabel = doc.splitTextToSize(label, maxLabelWidth);
    const wrappedValue = doc.splitTextToSize(value || "N/A", pageWidth - xValue - margin);

    checkPageBreak(wrappedLabel.length * lineHeight + wrappedValue.length * lineHeight);

    const maxLines = Math.max(wrappedLabel.length, wrappedValue.length);
    for (let i = 0; i < maxLines; i++) {
      if (wrappedLabel[i]) {
        doc.setFont("helvetica", "bold");
        doc.text(wrappedLabel[i], xLabel, yPosition);
      }
      if (wrappedValue[i]) {
        doc.setFont("helvetica", "normal");
        doc.text(wrappedValue[i], xValue, yPosition);
      }
      yPosition += lineHeight;
    }
    yPosition += 2;
  };

  addPageBorder();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  const title = "Shankar Nagari Sahakari Bank Ltd";
  doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, yPosition);
  yPosition += 12;

  doc.setFontSize(14);
  const subtitle = "GST Verification Certificate";
  doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, yPosition);
  yPosition += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const header = "TO WHOMSOEVER IT MAY CONCERN";
  doc.text(header, (pageWidth - doc.getTextWidth(header)) / 2, yPosition);
  yPosition += 12;

  const certText = `This is to certify that ${data.business_name || "N/A"}, GST No. ${data.gstin || "N/A"}, are verified.`;
  const wrappedText = doc.splitTextToSize(certText, pageWidth - 30);
  checkPageBreak(wrappedText.length * 8);
  doc.text(wrappedText, margin + 10, yPosition);
  yPosition += wrappedText.length * 8 + 10;

  checkPageBreak(200);
  doc.setDrawColor(0);
  doc.setLineWidth(0.7);
  doc.rect(15, yPosition, 180, 200);
  yPosition += 10;

  const userDetails = [
    { label: "GSTIN", value: data.gstin },
    { label: "Pan Number", value: data.pan_number },
    { label: "Business Name", value: data.business_name },
    { label: "Legal Name", value: data.legal_name },
    { label: "State Jurisdiction", value: data.state_jurisdiction },
    { label: "Taxpayer Type", value: data.taxpayer_type },
    { label: "GST Status", value: data.gstin_status },
    { label: "Date of Registration", value: data.date_of_registration },
    { label: "Nature of Core Business", value: data.nature_of_core_business_activity_description },
    { label: "Constitution of Business", value: data.constitution_of_business },
    { label: "Center Jurisdiction", value: data.center_jurisdiction },
    { label: "State Jurisdiction", value: data.state_jurisdiction },
    { label: "Address", value: data.address },
    { label: "Field Visit Conducted", value: data.field_visit_conducted },
    { label: "Aadhaar Validation", value: data.aadhaar_validation },
    { label: "Aadhaar Validation Date", value: data.aadhaar_validation_date },
    { label: "Date of Cancellation", value: data.date_of_cancellation },
    { label: "Client ID", value: data.client_id },
    { label: "Nature of Core Business\nActivity Code", value: data.nature_of_core_business_activity_code },
    { label: "Nature of Core Business\nActivity Description", value: data.nature_of_core_business_activity_description },
    { label: "Verification Date", value: data.VerifiedDate },
  ];

  userDetails.forEach((detail) => addAlignedText(detail.label, detail.value, margin + 15, margin + 80));

  checkPageBreak(20);
  yPosition += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Filing Status:", margin + 15, yPosition);
  yPosition += 10;

  data.filing_status.forEach((filing) => {
    const filingText = `${filing.return_type} (${filing.tax_period} ${filing.financial_year}): ${filing.status} \n Date of Filing - (${filing.date_of_filing})`;
    checkPageBreak(15);
    doc.text(filingText, margin + 15, yPosition);
    yPosition += 15;
  });

  yPosition += 15;

  const addFooterSignatures = () => {
    checkPageBreak(40);
    doc.setFont("helvetica", "bold");
    doc.text("Signature of the Authorised Signatory", 20, yPosition);
    doc.text("Signature of the Branch Manager", 114, yPosition);

    doc.setFont("helvetica", "normal");
    doc.text("Name: __________________", 20, yPosition + 10);
    doc.text("Name: __________________", 114, yPosition + 10);
    doc.text("Designation: ____________", 20, yPosition + 20);
    doc.text("Designation: ____________", 114, yPosition + 20);
    doc.text("Phone no.: ______________", 20, yPosition + 30);
    doc.text("Date: ___________________", 114, yPosition + 30);
    doc.text("(Bank Seal)", 20, yPosition + 51);
    doc.text("Verified By: User", 124, yPosition + 51);
  };

  addFooterSignatures();

  const sanitizedFileName = data.business_name
    ? data.business_name.replace(/[^a-zA-Z0-9-_]/g, "_")
    : "verification_certificate";
  const fileName = `${sanitizedFileName}.pdf`;

  doc.save(fileName);
};
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
        const response = await axios.get("https://localhost:7057/api/verification/getallGst", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        setVerifiedUsers(response.data.gstlist);
        console.log("Verified Users PanDetails:", response.data);
      }
    } catch (error) {
      console.error("Error fetching verified users:", error);
    }
  };

  authenticateAndFetchUsers();
}, []);
  

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
  <button onClick={handleDownloadExcel}>Excel Download</button>
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
  // .filter((user) => {
  //   // Parse `formattedDate` into a JavaScript Date object
  //   const [day, month, year] = user.formattedDate.split("/").map(Number);
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

                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.gstin}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.pan_number || "not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.business_name || "not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.date_of_registration || "not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.gstin_status || "not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.verifiedDate || "not available"}</td>

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
