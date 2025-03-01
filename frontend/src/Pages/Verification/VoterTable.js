import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';

const VoterTable = () => {
  const [startDate, setStartDate] = React.useState(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // Format date to 'yyyy-mm-dd'
    return formattedToday;
  });
  const [endDate, setEndDate] = useState("");
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
    const exportData = filteredUsers.map((user, index) => ({
      'SrNo': index + 1,  // Serial numberverifiedData?.data?.
        'Voter ID': user?.input_voter_id || "N/A",
        'Name': user?.name || "N/A",
        'Age': user?.age || "N/A",
        'Gender': user?.gender || "N/A",
        'Area': user?.area || "N/A",
        'District': user?.district || "N/A",
        'State': user?.state || "N/A",
        'Polling Station': user?.polling_station || "N/A",
        'Relation Name': user?.relation_name || "N/A",
        'Relation Type': user?.relation_type || "N/A",
        'Assembly Constituency': user?.assembly_constituency || "N/A",
        'Constituency Number': user?.assembly_constituency_number || "N/A",
        'Part Number': user?.part_number || "N/A",
        'Part Name': user?.part_name || "N/A",
        'Parliamentary Name': user?.parliamentary_name || "N/A",
        'Parliamentary Number': user?.parliamentary_number || "N/A",
        'SlNo Inpart': user?.slno_inpart || "N/A",
        'Section Number': user?.section_no || "N/A",
        'State Code': user?.st_code || "N/A",
        'Parliamentary Constituency': user?.parliamentary_constituency || "N/A",
        'Id': user?.id || "N/A",
        'Verification Date': user?.VerifiedDate || "N/A",
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
          "http://localhost/DocVerification/api/Voter/GetAll"
        );
        setVerifiedUsers(response.data.data); // Set the fetched data into the state
      } catch (error) {
        console.error("Error fetching verified users:", error);
      }
    };
    fetchVerifiedUsers();
  },[]);


  

  const handleDelete = async (aadharNumber) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
  
    // If user clicks "Yes"
    if (isConfirmed) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/voter/delete/${aadharNumber}`);
        
        if (response.data.message === "User deleted successfully.") {
          // If deletion is successful, update state by filtering out the deleted user
          setUsers((prevUsers) => prevUsers.filter((user) => user.aadharNumber !== aadharNumber));
          alert("User deleted successfully.");
        } else {
          alert("Failed to delete user.");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    } else {
      // If user clicks "No", just return without deleting
      alert("User deletion canceled.");
    }
  };
  

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
  
    // Center-aligned subtitle
      doc.setFontSize(14);
      const subtitle = "Voter Verification Certificate";
      doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, 28);
  
    // Section Header
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const header = "TO WHOMSOEVER IT MAY CONCERN";
    doc.text(header, (pageWidth - doc.getTextWidth(header)) / 2, 36);
  
    // Verification Statement
    const verificationText = `This is to Certify that ${
        user.name || "N/A"
    }, Voter Id No. ${user.input_voter_id} are verified.`;
    const verificationSplit = doc.splitTextToSize(verificationText, 180);
    doc.text(verificationSplit, 14, 50);
  
    // Outer Border
    const outerX = 10;
    const outerY = 55;
    const outerWidth = 190;
    const outerHeight = 180; // Increased height for better spacing
    doc.setDrawColor(0);
    doc.setLineWidth(0.7);
    doc.rect(outerX, outerY, outerWidth, outerHeight);
  
    // User Details
    const contentX = 14;
    let yOffset = 62;
  
    const nicData = user || {};
    const processNicData = (label, value) => {
        if (!value) return `${label}: N/A`;
        return value.length > 5 ? `${label}: ${value.slice(0, 5)}\n${value.slice(5)}` : `${label}: ${value}`;
    };
  
    const userDetails = [
         { label: "Status", value: "success" || "N/A" },
        { label: "Id Number", value: user.input_voter_id ? user.input_voter_id.toString() : "N/A" },
        { label: "Name", value: user.name ? user.name.toString() : "N/A" },
        { label: "Age", value: user.age ? user.age.toString() : "N/A" },
        { label: "Gender", value: user.gender ? user.gender.toString() : "N/A" },
        { label: "Relation Name", value: user.relation_name ? user.relation_name.toString() : "N/A" },
        { label: "Relation Type", value: user.relation_type ? user.relation_type.toString() : "N/A" },
        { label: "Area", value: user.area ? user.area.toString() : "N/A" },

        { label: "State", value: user.state ? user.state.toString() : "N/A" },
        { label: "District", value: user.district ? user.district.toString() : "N/A" },
        { label: "Polling Station", value: user.polling_station ? user.polling_station.toString() : "N/A" },
        { label: "Assembly Constituency", value: user.assembly_constituency ? user.assembly_constituency.toString() : "N/A" },
        { label: "Constituency Number", value: user.assembly_constituency_number ? user.assembly_constituency_number.toString() : "N/A" },
        { label: "Part Number", value: user.part_number ? user.part_number.toString() : "N/A" },
        { label: "Part Name", value: user.part_name ? user.part_name.toString() : "N/A" },
        { label: "Parliamentary Name", value: user.parliamentary_name ? user.parliamentary_name.toString() : "N/A" },
        { label: "Parliamentary Number", value: user.parliamentary_number ? user.parliamentary_number.toString() : "N/A" },
        { label: "SlNo Inpart", value: user.slno_inpart ? user.slno_inpart.toString() : "N/A" },
        { label: "Section Number", value: user.section_no ? user.section_no.toString() : "N/A" },
        { label: "State Code", value: user.st_code ? user.st_code.toString() : "N/A" },
        { label: "Parliamentary Constituency", value: user.parliamentary_constituency ? user.parliamentary_constituency.toString() : "N/A" },
        { label: "Id", value: user.id ? user.id.toString() : "N/A" }
    ];
  
    doc.setFont("helvetica", "bold");
    userDetails.forEach(item => {
        doc.text(`${item.label} :`, contentX + 2, yOffset);
        doc.setFont("helvetica", "normal");
  
        // Handle line breaking for NIC Data
        const splitText = doc.splitTextToSize(item.value, 120);
        doc.text(splitText, contentX + 60, yOffset);
  
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
// const handleDownloadPdf = (user) => {
//     try {
//       const doc = new jsPDF();
//       const pageWidth = doc.internal.pageSize.getWidth(); // Page width
//       const pageHeight = doc.internal.pageSize.getHeight(); // Page height
  
//       // Add a full-page border
//       doc.setDrawColor(0); // Black color
//       doc.setLineWidth(0.7); // Border thickness
//       doc.rect(5, 5, pageWidth - 10, pageHeight - 10); // Draw rectangle with a 5-unit margin from each edge
  
//       // Center-aligned title
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(25);
//       const title = "Shankar Nagari Sahakari Bank Ltd";
//       doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);
  
//       // Center-aligned subtitle
//       doc.setFontSize(14);
//       const subtitle = "Voter Id Verification Certificate";
//       doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, 28);
  
//       // Center-aligned section header
//       doc.setFontSize(12);
//       doc.setFont("helvetica", "normal");
//       const header = "TO WHOMSOEVER IT MAY CONCERN";
//       doc.text(header, (pageWidth - doc.getTextWidth(header)) / 2, 36);
  
//       // Verification Statement
//       const name = user.name || "N/A";
//       const idNumber = user?.id_number || "N/A";
//       const verificationText = `This is to Certify that ${name}, Voter Id No. ${idNumber} are verified from link.`;
//       const verificationSplit = doc.splitTextToSize(verificationText, 180);
//       doc.text(verificationSplit, 14, 50);

//        // Define positions and dimensions for the outer border
//     const outerX = 10;
//     const outerY = 55;
//     const outerWidth = 190;
//     const outerHeight = 165;

//      // Draw the outer border
//      doc.setDrawColor(0);
//      doc.setLineWidth(0.7);
//      doc.rect(outerX, outerY, outerWidth, outerHeight);
   
//      // Define positions and dimensions for content box
//      const contentX = 14;
//      const contentY = 70;
//      const contentWidth = 120;
//      const contentHeight = 90;
   
  
//       // User Details Content
//       const userDetails = [
//         { label: "Status", value: "success" },
//         { label: "Id Number", value: idNumber },
//         { label: "Name", value: name },
//         { label: "Age", value: user.age?.toString() || "N/A" },
//         { label: "Gender", value: user.gender || "N/A" },
//         { label: "Relation Name", value: user.relation_name || "N/A" },
//         { label: "Relation Type", value: user.relation_type || "N/A" },
//         { label: "State", value: user.state || "N/A" },
//         { label: "District", value: user.district || "N/A" },
//         { label: "Polling Station", value: user.polling_station || "N/A" },
//         { label: "Assembly Constituency", value: user.assembly_constituency || "N/A" },
//         { label: "Constituency Number", value: user.assembly_constituency_number || "N/A" },
//         { label: "Part Number", value: user.part_number || "N/A" },
//         { label: "Part Name", value: user.part_name || "N/A" },
//         { label: "Parliamentary Name", value: user.parliamentary_name || "N/A" },
//         { label: "Parliamentary Number", value: user.parliamentary_number || "N/A" },
//       ];
  
//       doc.setFont("helvetica", "bold");
//       let yOffset = 70;
  
//       userDetails.forEach((item) => {
//         doc.text(`${item.label} :`, 14, yOffset -6);
//         doc.setFont("helvetica", "normal");
//         doc.text(item.value, 62, yOffset -6);
//         yOffset += 10;
//       });

//       // Footer with signatures
//     doc.setFont("helvetica", "bold");
//     doc.text("Signature of the Authorised Signatory", 14, 238);
//     doc.text("Signature of the Branch Manager", 110, 238);
  
//     doc.setFont("helvetica", "normal");
//     doc.text("Name: __________________", 14, 248);
//     doc.text("Name: __________________", 110, 248);
  
//     doc.text("Designation: ____________", 14, 258);
//     doc.text("Designation: ____________", 110, 258);
  
//     doc.text("Phone no.: ______________", 14, 268);
//     doc.text("Date: ___________________", 110, 268);
  
//     // Bank Seal
//     doc.setFont("helvetica", "normal");
//     doc.text("(Bank Seal)", 14, 280);
//     doc.text("Verified By : User", 120, 280);
  
  
//       // Save PDF
//       const fileName = `${name}_verification_certificate.pdf`;
//       doc.save(fileName);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//     }
//   };
  
  
  

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
                Voter ID
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
                Age
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                Gender
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                District
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                State
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                Polling Station
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
  })

              .map((user, index) => (
                <tr key={index} style={{ border: "1px solid #ddd" }}>
                   <td style={{ padding: "8px", border: "1px solid #ddd" }}>
          {index + 1}
        </td>
                                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.input_voter_id}</td>

                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.name}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user?.age || "Name not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user?.gender || "Gender not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.district || "DOB not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.state || "DOB not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.polling_station || "DOB not available"}</td>

                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.VerifiedDate || "DOB not available"}</td>

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

export default VoterTable;
