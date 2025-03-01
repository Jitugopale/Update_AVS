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
            "http://localhost/DocVerification/api/GST/GetAll"
          );
          setVerifiedUsers(response.data.data); // Set the fetched data into the state
          console.log(response.data.data)
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
      const excelData = verifiedUsers.map((user, index) => {
        let parsedData = {};
        try {
          parsedData = typeof user.data === "string" ? JSON.parse(user.data) : user.data || {};
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
    
        // Format Filing Status
        let filingStatusText = "N/A";
        if (Array.isArray(parsedData.filing_status) && parsedData.filing_status.length > 0) {
          filingStatusText = parsedData.filing_status
            .map(
              (filing) =>
                `${filing.return_type} (${filing.tax_period} ${filing.financial_year}): ${filing.status} - Date of Filing: ${filing.date_of_filing}`
            )
            .join("\n"); // Join multiple filing statuses with a newline
        }
    
        return {
          "SrNo": index + 1,  // Serial number for the row
          "GST No": parsedData.gstin || "N/A",
          "PAN No": parsedData.pan_number || "N/A",
          "Business Name": parsedData.business_name || "N/A",
          "Legal Name": parsedData.legal_name || "N/A",
          "Date of Registration": parsedData.date_of_registration || "N/A",
          "GST Status": parsedData.gstin_status || "N/A",
          "Status": parsedData.responseData?.status === "success" ? "Verified" : "Not Verified",
          "State Jurisdiction": parsedData.state_jurisdiction || "N/A",
          "Taxpayer Type": parsedData.taxpayer_type || "N/A",
          "Filing Status": filingStatusText, // 🆕 Properly formatted filing status
          "Nature of Core Business": parsedData.nature_of_core_business_activity_description || "N/A",
          "Constitution of Business": parsedData.constitution_of_business || "N/A",
          "Center Jurisdiction": parsedData.center_jurisdiction || "N/A",
          "State Jurisdiction": parsedData.state_jurisdiction || "N/A",
          "Address": parsedData.address || "No Address Available",
          "Field Visit Conducted": parsedData.field_visit_conducted || "No Field Visit",
          "Nature of Business Activities": parsedData.nature_bus_activities?.join(", ") || "N/A",
          "Aadhaar Validation": parsedData.aadhaar_validation || "N/A",
          "Aadhaar Validation Date": parsedData.aadhaar_validation_date || "N/A",
          "Date of Cancellation": parsedData.date_of_cancellation || "N/A",
          "Client ID": parsedData.client_id || "N/A",
          "Constitution of Business": parsedData.constitution_of_business || "N/A",
          "Nature of Core Business Activity Code": parsedData.nature_of_core_business_activity_code || "N/A",
          "Nature of Core Business Activity Description": parsedData.nature_of_core_business_activity_description || "N/A",
          "Verification Date": user.VerifiedDate || "N/A",
        };
      });
    
      // Create a new workbook
      const wb = XLSX.utils.book_new();
      
      // Convert excelData to a worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
    
      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, "Verified Users");
    
      // Trigger the download of the Excel file
      XLSX.writeFile(wb, "Verified_Users.xlsx");
    };
    
    // const handleExcelDownload = () => {
    //   // Mapping the verified users data to the format required for Excel
    //   const excelData = verifiedUsers.map((user, index) => ({
    //     'SrNo': index + 1,  // Serial number for the row
    //     'GST No': user.gstin,
    //     'PAN No': user.pan_number,
    //     'Business Name': user.business_name,
    //     'Legal Name': user.legal_name,
    //     'Date of Registration': user.date_of_registration,
    //     'GST Status': user.gstin_status,
    //     'Status': user.responseData?.status === 'success' ? 'Verified' : 'Not Verified',
    //     'State Jurisdiction': user.state_jurisdiction,
    //     'Taxpayer Type': user.taxpayer_type,
    //     'Filing Status (Latest GSTR1)': user.filing_status?.[0]?.[0]?.status || 'N/A',
    //     'Last Filed GSTR3B': user.filing_status?.[0]?.[1]?.status || 'N/A',
    //     'Nature of Core Business': user.nature_of_core_business_activity_description,
    //     'Constitution of Business': user.constitution_of_business,
    //     'Center Jurisdiction': user.center_jurisdiction,
    //     'Address': user.address || 'No Address Available',
    //     'Field Visit Conducted': user.field_visit_conducted || 'No Field Visit',
    //     'Nature of Business Activities': user.nature_bus_activities?.join(', ') || 'N/A',
    //     'Aadhaar Validation': user.aadhaar_validation || 'N/A',
    //     'Aadhaar Validation Date': user.aadhaar_validation_date || 'N/A',
    //     'Date of Cancellation': user.date_of_cancellation || 'N/A',
    //     'Verification Date': user.VerifiedDate,
    //   }));
      
    
    //   // Create a new workbook
    //   const wb = XLSX.utils.book_new();
      
    //   // Convert excelData to a worksheet
    //   const ws = XLSX.utils.json_to_sheet(excelData);
    
    //   // Append the worksheet to the workbook
    //   XLSX.utils.book_append_sheet(wb, ws, "Verified Users");
    
    //   // Trigger the download of the Excel file
    //   XLSX.writeFile(wb, "Verified_Users.xlsx");
    // };
    // const handleExcelDownload = () => {
    //   // Mapping the verified users data to the format required for Excel
    //   const excelData = verifiedUsers.map((user, index) => {
    //     // Ensure data is properly parsed
    //     let parsedData = {};
    //     try {
    //       parsedData = typeof user.data === "string" ? JSON.parse(user.data) : user.data || {};
    //     } catch (error) {
    //       console.error("Error parsing user data:", error);
    //     }
    
    //     return {
    //       "SrNo": index + 1,  // Serial number for the row
    //       "GST No": parsedData.gstin || "N/A",
    //       "PAN No": parsedData.pan_number || "N/A",
    //       "Business Name": parsedData.business_name || "N/A",
    //       "Legal Name": parsedData.legal_name || "N/A",
    //       "Date of Registration": parsedData.date_of_registration || "N/A",
    //       "GST Status": parsedData.gstin_status || "N/A",
    //       "Status": parsedData.responseData?.status === "success" ? "Verified" : "Not Verified",
    //       "State Jurisdiction": parsedData.state_jurisdiction || "N/A",
    //       "Taxpayer Type": parsedData.taxpayer_type || "N/A",
    //       "Filing Status (Latest GSTR1)": parsedData.filing_status|| "N/A",
    //       "Nature of Core Business": parsedData.nature_of_core_business_activity_description || "N/A",
    //       "Constitution of Business": parsedData.constitution_of_business || "N/A",
    //       "Center Jurisdiction": parsedData.center_jurisdiction || "N/A",
    //       "State Jurisdiction": parsedData.state_jurisdiction || "N/A",
    //       "Address": parsedData.address || "No Address Available",
    //       "Field Visit Conducted": parsedData.field_visit_conducted || "No Field Visit",
    //       "Nature of Business Activities": parsedData.nature_bus_activities?.join(", ") || "N/A",
    //       "Aadhaar Validation": parsedData.aadhaar_validation || "N/A",
    //       "Aadhaar Validation Date": parsedData.aadhaar_validation_date || "N/A",
    //       "Date of Cancellation": parsedData.date_of_cancellation || "N/A",
    //       "Client ID": parsedData.client_id || "N/A",
    //       "Constitution of Business": parsedData.constitution_of_business || "N/A",
    //       "Nature of Core Business Activity Code": parsedData.nature_of_core_business_activity_code || "N/A",
    //       "Nature of Core Business Activity Description": parsedData.nature_of_core_business_activity_description || "N/A",
    //       "Verification Date": user.VerifiedDate || "N/A",
    //     };
    //   });
    
    //   // Create a new workbook
    //   const wb = XLSX.utils.book_new();
      
    //   // Convert excelData to a worksheet
    //   const ws = XLSX.utils.json_to_sheet(excelData);
    
    //   // Append the worksheet to the workbook
    //   XLSX.utils.book_append_sheet(wb, ws, "Verified Users");
    
    //   // Trigger the download of the Excel file
    //   XLSX.writeFile(wb, "Verified_Users.xlsx");
    // };
    

  const handleVerify = async () => {
    if (!idNumber) {
      setError('ID Number is required');
      return;
    }

    setLoading(true);
    setError('');
    setResponseData(null);

    try {
      const res = await axios.post(`http://localhost/DocVerification/api/GST/VerifyGST?id_number=${idNumber}`);

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

//   const generatePDF = () => {
//     if (!responseData.data?.[0]) {
//       alert('No data to generate PDF');
//       return;
//     }

//     const data = responseData.data?.[0];

//     console.log(data); // Debugging: Ensure this shows the expected data

//     // Initialize jsPDF
//     const doc = new jsPDF();
//     let yPosition = 10; // Y position for text

//     // Title
//     doc.setFontSize(16);
//     doc.setFont('helvetica', 'bold');
//     doc.text('GST Verification Details', 15, yPosition);
//     yPosition += 15;

//     // Add GST Details
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'normal');
//     doc.text(`GSTIN: ${data.gstin}`, 10, yPosition);
//     yPosition += 10;
//     doc.text(`Business Name: ${data.business_name}`, 10, yPosition);
//     yPosition += 10;
//     doc.text(`State Jurisdiction: ${data.state_jurisdiction}`, 10, yPosition);
//     yPosition += 10;
//     doc.text(`Taxpayer Type: ${data.taxpayer_type}`, 10, yPosition);
//     yPosition += 10;
//     doc.text(`GST Status: ${data.gstin_status}`, 10, yPosition);
//     yPosition += 10;
  
//     // Filing Status (Latest GSTR1 and GSTR3B)
//     // doc.text(`Filing Status (Latest GSTR1): ${data.filing_status?.[0]?.[0]?.status || 'N/A'}`, 10, yPosition);
//     // yPosition += 10;
//     // doc.text(`Last Filed GSTR3B: ${data.filing_status?.[0]?.[1]?.status || 'N/A'}`, 10, yPosition);
//     // yPosition += 10;

//     // Registration and Business Information
//     doc.text(`Date of Registration: ${data.date_of_registration}`, 10, yPosition);
//     yPosition += 10;
//     doc.text(`Nature of Core Business: ${data.nature_of_core_business_activity_description}`, 10, yPosition);
//     yPosition += 10;
//     doc.text(`Constitution of Business: ${data.constitution_of_business}`, 10, yPosition);
//     yPosition += 10;

//     // Jurisdiction Information
//     doc.text(`Center Jurisdiction: ${data.center_jurisdiction}`, 10, yPosition);
//     yPosition += 10;
//     doc.text(`State Jurisdiction: ${data.state_jurisdiction}`, 10, yPosition);
//     yPosition += 10;

//     // Address and Field Visit Information
//     doc.text(`Address: ${data.address}`, 10, yPosition);
//     yPosition += 10;
//     doc.text(`Field Visit Conducted: ${data.field_visit_conducted}`, 10, yPosition);
//     yPosition += 10;

//     // Nature of Business Activities and Aadhaar Validation
//     doc.text(`Nature of Business Activities: ${data.nature_bus_activities}`, 10, yPosition);
//     yPosition += 10;
//     doc.text(`Aadhaar Validation: ${data.aadhaar_validation}`, 10, yPosition);
//     yPosition += 10;
//     doc.text(`Aadhaar Validation Date: ${data.aadhaar_validation_date}`, 10, yPosition);
//     yPosition += 10;

//     // Cancellation Information
//     doc.text(`Date of Cancellation: ${data.date_of_cancellation || 'N/A'}`, 10, yPosition);
//     yPosition += 10;

//     // Save PDF
//     doc.save('GST_Details.pdf');
// };
// const generatePDF = () => {
//   if (!responseData.data?.[0]) {
//          alert('No data to generate PDF');
//           return;
//         }

//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 10;
//   let yPosition = margin + 10;
//   const data = responseData.data?.[0];

//   const addPageBorder = () => {
//     doc.setDrawColor(0);
//     doc.setLineWidth(0.7);
//     doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
//   };

//   const addAlignedText = (label, value, xLabel, xValue) => {
//     const lineHeight = 8;
//     const maxWidth = pageWidth - xValue - margin; // Max width for value text
//     const wrappedValue = doc.splitTextToSize(value || "N/A", maxWidth);

//     // Check if new page is needed
//     if (yPosition + wrappedValue.length * lineHeight > pageHeight - margin - 50) {
//       doc.addPage();
//       addPageBorder();
//       yPosition = margin + 20;
//     }

//     doc.setFont("helvetica", "bold");
//     doc.text(`${label}:`, xLabel, yPosition);
//     doc.setFont("helvetica", "normal");
//     doc.text(wrappedValue, xValue, yPosition);
//     yPosition += wrappedValue.length * lineHeight; // Adjust yPosition
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

//   const businessName = data.business_name ? String(data.business_name) : "N/A";
// const gstNumber = data.gstin ? String(data.gstin) : "N/A";

//   // Verification text
//   const certText = `This is to certify that ${businessName}, GST No. ${gstNumber}, are verified.`;
//   const wrappedText = doc.splitTextToSize(certText, pageWidth - 20);
//   doc.text(wrappedText, margin + 10, yPosition);
  
//   // Draw user details border
//   doc.setDrawColor(0);
//   doc.setLineWidth(0.7);
//   doc.rect(15, yPosition+=10, 180, 200);
//   yPosition += 10;

//   // User details in **Properly Aligned Format**
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
//     // { label: "Nature of Business Activities", value: data.nature_bus_activities },
//     { label: "Aadhaar Validation", value: data.aadhaar_validation },
//     { label: "Aadhaar Validation Date", value: data.aadhaar_validation_date },
//     { label: "Date of Cancellation", value: data.date_of_cancellation },
//     { label: "Client ID", value: data.client_id },
//     { label: "Nature of Core Business Activity Code", value: data.nature_of_core_business_activity_code },
//     { label: "Nature of Core Business Activity Description", value: data.nature_of_core_business_activity_description },
//     { label: "Verification Date", value: data.VerifiedDate },
//   ];
//   userDetails.forEach((detail) => addAlignedText(detail.label, detail.value, margin + 15, margin + 80));

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

const generatePDF = () => {
  if (!responseData.data?.[0]) {
    alert('No data to generate PDF');
     return;
   }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  let yPosition = margin + 10;
  const data =responseData.data?.[0];

  const addPageBorder = () => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.7);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
  };

  // ✅ Updated Function to Handle Multi-Line Labels & Values
  const addAlignedText = (label, value, xLabel, xValue) => {
    const lineHeight = 8;
    const maxLabelWidth = xValue - xLabel - 5; // Limit label width
    const wrappedLabel = doc.splitTextToSize(label, maxLabelWidth);
    const wrappedValue = doc.splitTextToSize(value || "N/A", pageWidth - xValue - margin);
  
    // Ensure new page if needed
    if (yPosition + lineHeight > pageHeight - margin - 50) {
      doc.addPage();
      addPageBorder();
      yPosition = margin + 20;
    }
  
    // Get the highest line count between label and value
    const maxLines = Math.max(wrappedLabel.length, wrappedValue.length);
  
    // Loop through maxLines to print label and value side by side
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
  
    yPosition += 2; // Add extra space after each entry
  };
  

  addPageBorder();

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  const title = "Shankar Nagari Sahakari Bank Ltd";
  doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, yPosition);
  yPosition += 12;

  // Subtitle
  doc.setFontSize(14);
  const subtitle = "GST Verification Certificate";
  doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, yPosition);
  yPosition += 10;

  // Header
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const header = "TO WHOMSOEVER IT MAY CONCERN";
  doc.text(header, (pageWidth - doc.getTextWidth(header)) / 2, yPosition);
  yPosition += 12;

  // Verification text
 // Verification text
const businessName = data.business_name ? String(data.business_name) : "N/A";
const gstNumber = data.gstin ? String(data.gstin) : "N/A";

// ✅ Limit the length of business name to prevent long wrapping
const maxBusinessNameLength = 50; // Adjust as needed
const trimmedBusinessName =
  businessName.length > maxBusinessNameLength
    ? businessName.substring(0, maxBusinessNameLength) + "..."
    : businessName;

const certText = `This is to certify that ${trimmedBusinessName}, GST No. ${gstNumber}, are verified.`;

// ✅ Wrap text within allowed width
const wrappedText = doc.splitTextToSize(certText, pageWidth - 30); // Adjust width if needed
doc.text(wrappedText, margin + 10, yPosition);

// ✅ Adjust yPosition based on number of lines
yPosition += 10; // Extra spacing after text

  // Draw user details border
  doc.setDrawColor(0);
  doc.setLineWidth(0.7);
  doc.rect(15, (yPosition += 10), 180, 200);
  yPosition += 10;

  // ✅ User Details with Multi-Line Labels
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

  // Add details with proper alignment
  userDetails.forEach((detail) => addAlignedText(detail.label, detail.value, margin + 15, margin + 80));

  yPosition += 15; // Ensure spacing before the footer

  // ✅ Footer Signatures with Proper Spacing
  const addFooterSignatures = () => {
    if (yPosition + 40 > pageHeight - margin) { // Increased buffer space
      doc.addPage();
      addPageBorder();
      yPosition = margin + 20;
    }

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

  // ✅ File Naming with Special Character Handling
  const sanitizedFileName = data.business_name
    ? data.business_name.replace(/[^a-zA-Z0-9-_]/g, "_") // Remove special chars
    : "verification_certificate";
  const fileName = `${sanitizedFileName}.pdf`;

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
    {/* {responseData && (
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
        <p><strong>Date of Cancellation:</strong> {responseData.verifiedData.data.date_of_cancellation}</p> */}
  
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
        {/* <div>
        <button className="btn btn-success mt-3" onClick={generatePDF}>
          Download PDF
        </button>
        </div>
      </div>
    )} */}
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
             {responseData?.status === 'success' ? 'Verified' : 'Not Verified'}
            </td>
           </tr>
           {/* <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Reference ID :</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.reference_id}</td>
           </tr> */}
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>GSTIN :</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.gstin}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Pan Number :</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.pan_number}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Business Name :</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.business_name}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Legal Name :</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.legal_name}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Taxpayer Type: :</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.taxpayer_type}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>GST Status :</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.gstin_status}</td>
           </tr>
           {/* <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Filing Status (Latest GSTR1) :</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.filing_status?.[0]?.[0]?.status || 'N/A'}</td>
           </tr> */}
           {/* <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Last Filed GSTR3B:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.filing_status?.[0]?.[1]?.status || 'N/A'}</td>
           </tr> */}
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Date of Registration:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.date_of_registration}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Nature of Core Business:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.nature_of_core_business_activity_description}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Constitution of Business:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.constitution_of_business}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Center Jurisdiction:</td>
             <td style={{ textAlign: 'left' }}> {responseData.data?.[0]?.center_jurisdiction}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>State Jurisdiction:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.state_jurisdiction}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Address:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.address}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Field Visit Conducted:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.field_visit_conducted}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Nature of Business Activities:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.nature_bus_activities}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Aadhaar Validation:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.aadhaar_validation}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Aadhaar Validation Date:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.aadhaar_validation_date}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Date of Cancellation:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.date_of_cancellation}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Client ID:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.client_id}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Constitution of Business:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.constitution_of_business}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Field Visit Conducted:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.field_visit_conducted}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Nature Bus Activities:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.nature_bus_activities}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Nature of Core Business Activity Code:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.nature_of_core_business_activity_code}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Nature of Core Business Activity Description:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.nature_of_core_business_activity_description}</td>
           </tr>
           <tr>
             <td style={{ fontWeight: 'bold', textAlign: 'left' }}>Verification Date:</td>
             <td style={{ textAlign: 'left' }}>{responseData.data?.[0]?.VerifiedDate}</td>
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
    <GSTTable/>
  </div>

  
  );
};

export default GSTVerificationPage;
