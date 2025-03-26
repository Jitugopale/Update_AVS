import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';

const PanDetailTable = () => {
  const [startDate, setStartDate] = React.useState(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // Format date to 'yyyy-mm-dd'
    return formattedToday;
  });
  const [endDate, setEndDate] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [users, setUsers] = useState([]); // State to store users list

  
    // const handleDownloadExcel = () => {
    //   // Filter the users based on the date range
    //   const filteredUsers = verifiedUsers.filter((user) => {
    //     // Parse `formattedDate` into a JavaScript Date object
    //     const [day, month, year] = user.VerifiedDate.split("-").map(Number);
    //     const userVerificationDate = new Date(year, month - 1, day); // Create Date object
    
    //     let isInDateRange = true;
    
    //     // Parse startDate and endDate from the input fields
    //     const startDateObj = startDate ? new Date(startDate) : null;
    //     let endDateObj = endDate ? new Date(endDate) : null;
    
    //     // Adjust endDate to include the full day
    //     if (endDateObj) {
    //       endDateObj.setHours(23, 59, 59, 999);
    //     }
    
    //     // Include users with a `formattedDate` equal to `startDate`
    //     if (startDate && userVerificationDate.toDateString() === startDateObj.toDateString()) {
    //       return true;
    //     }
    
    //     // Handle case where startDate equals endDate (specific day filtering)
    //     if (startDate && endDate && startDate === endDate) {
    //       isInDateRange =
    //         userVerificationDate.toDateString() === startDateObj.toDateString();
    //     } else {
    //       // General range filtering
    //       isInDateRange =
    //         (!startDateObj || userVerificationDate >= startDateObj) &&
    //         (!endDateObj || userVerificationDate <= endDateObj);
    //     }
    
    //     return isInDateRange;
    //   });
    
    //   if (filteredUsers.length === 0) {
    //     alert('No data to download');
    //     return;
    //   }
    
    //   // Map the filtered data to match the desired format for Excel export
    //   const exportData = filteredUsers.map((user,index) => ({
    //     'SrNo': index + 1,  // You can adjust this if the `SrNo` is not directly available in the data
    //     'Pan No': user.data.pan_number,
    //     'First Name': user.data.pan_number,
    //     'Fathers Name': user.data.pan_number,
    //     'Last Name': user.data.pan_number,
    //     'Full Name': user.data.pan_number,
    //     'PAN Status::': user.data.pan_number,
    //     'Category:': user.data.pan_number,
    //     'Aadhaar Seeding Status:': user.data.aadhaarSeedingStatus === "NULL" ? "Not Identified" : user.verifiedData?.data?.aadhaarSeedingStatus,
    //     'Verification Date': user.VerifiedDate,
    //   }));
    
    //   // Prepare data for Excel
    //   const worksheet = XLSX.utils.json_to_sheet(exportData);
    //   const workbook = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Users');
    
    //   // Generate Excel file and trigger download
    //   XLSX.writeFile(workbook, 'filtered-users.xlsx');
    // };

  // Fetch the verified users from the backend
  // useEffect(() => {
  //   const fetchVerifiedUsers = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://192.168.20.150:82/Document_Verify_Back/api/PanDetail/GetAll"
  //       );
  //       setVerifiedUsers(response.data.data); // Set the fetched data into the state
  //       console.log(response.data)
  //       console.log(response.data.data)
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
          const response = await axios.get("https://localhost:7057/api/verification/getallPanDetail", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });

          setVerifiedUsers(response.data.pandetaillist);
          console.log("Verified Users PanDetails:", response.data);
        }
      } catch (error) {
        console.error("Error fetching verified users:", error);
      }
    };

    authenticateAndFetchUsers();
  }, []);
  const handleDownloadExcel = () => {
    // Filter users based on the date range
    const filteredUsers = verifiedUsers.filter((user) => {
      if (!user.VerifiedDate) return false; // Ensure the date field exists
  
      const [day, month, year] = user.VerifiedDate.split("-").map(Number);
      const userVerificationDate = new Date(year, month - 1, day);
  
      let isInDateRange = true;
      const startDateObj = startDate ? new Date(startDate) : null;
      let endDateObj = endDate ? new Date(endDate) : null;
  
      if (endDateObj) {
        endDateObj.setHours(23, 59, 59, 999);
      }
  
      if (startDate && userVerificationDate.toDateString() === startDateObj.toDateString()) {
        return true;
      }
  
      if (startDate && endDate && startDate === endDate) {
        isInDateRange = userVerificationDate.toDateString() === startDateObj.toDateString();
      } else {
        isInDateRange = (!startDateObj || userVerificationDate >= startDateObj) &&
                        (!endDateObj || userVerificationDate <= endDateObj);
      }
  
      return isInDateRange;
    });
  
    if (filteredUsers.length === 0) {
      alert("No data to download");
      return;
    }
  
    console.log("Filtered Users:", filteredUsers); // Debugging: Log filtered users
  
    // Map data with checks for undefined fields
    const exportData = filteredUsers.map((user, index) => {
      const userData = user || {}; // Ensure user.data exists
      console.log(user.data)
      return {
        "SrNo": index + 1,
        "Pan No": userData.PanNumber || "N/A",
        "First Name": userData.firstName || "N/A",
        "Fathers Name": userData.middleName || "N/A",
        "Last Name": userData.lastName || "N/A",
        "Full Name": userData.fullName || "N/A",
        "PAN Status": userData.panStatus || "N/A",
        "Category": userData.category || "N/A",
        "Reference Id": userData.reference_id || "N/A",
        "Aadhaar Seeding Status": userData.aadhaarSeedingStatus === "NULL" 
          ? "Not Identified" 
          : userData.aadhaarSeedingStatus || "N/A",
        "Verification Date": user.VerifiedDate || "N/A",
      };
    });
  
    // Prepare data for Excel
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Users");
  
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "filtered-users.xlsx");
  };
  
  

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
    const subtitle = "Pan Detail Verification Certificate";
    doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, 28);
  
    // Center-aligned section header
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const header = "TO WHOMSOEVER IT MAY CONCERN";
    doc.text(header, (pageWidth - doc.getTextWidth(header)) / 2, 36);
  
    // Verification Statement
    const verificationText = `This is to Certify that ${
      user.fullName || "N/A"
    }, Pan No. ${user.PanNumber} are verified from https://www.pan.utiitsl.com/.`;
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
    doc.text("Success", contentX + 54, contentY + 5);
  
    doc.setFont("helvetica", "bold");
    doc.text("Id Number                        :", contentX + 2, contentY + 15);
    doc.setFont("helvetica", "normal");
    doc.text(user.PanNumber ? user.PanNumber.toString() : "N/A", contentX + 54, contentY + 15);

    doc.setFont("helvetica", "bold");
    doc.text("First Name                       :", contentX + 2, contentY + 25);
    doc.setFont("helvetica", "normal");
    doc.text(user.firstName ? user.firstName.toString() : "N/A", contentX + 54, contentY + 25);

    doc.setFont("helvetica", "bold");
    doc.text("Middle Name                    :", contentX + 2, contentY + 35);
    doc.setFont("helvetica", "normal");
    doc.text(user.middleName ? user.middleName.toString() : "N/A", contentX + 54, contentY + 35);

    doc.setFont("helvetica", "bold");
    doc.text("Last Name                        :", contentX + 2, contentY + 45);
    doc.setFont("helvetica", "normal");
    doc.text(user.lastName ? user.lastName.toString() : "N/A", contentX + 54, contentY + 45);

    doc.setFont("helvetica", "bold");
    doc.text("Full Name                         :", contentX + 2, contentY + 55);
    doc.setFont("helvetica", "normal");
    doc.text(user.fullName ? user.fullName.toString() : "N/A", contentX + 54, contentY + 55);

    doc.setFont("helvetica", "bold");
    doc.text("PAN Status                       :", contentX + 2, contentY + 65);
    doc.setFont("helvetica", "normal");
    doc.text(user.panStatus ? user.panStatus.toString() : "N/A", contentX + 54, contentY + 65);

    doc.setFont("helvetica", "bold");
    doc.text("Category                           :", contentX + 2, contentY + 75);
    doc.setFont("helvetica", "normal");
    doc.text(user.category ? user.category.toString() : "N/A", contentX + 54, contentY + 75);

    doc.setFont("helvetica", "bold");
    doc.text("Aadhaar Seeding Status :", contentX + 2, contentY + 85);
    doc.setFont("helvetica", "normal");
    doc.text(
      user.aadhaarSeedingStatus === "NULL"
        ? "Not Identified"
        : user.aadhaarSeedingStatus
          ? user.aadhaarSeedingStatus.toString()
          : "N/A",
      contentX + 54,
      contentY + 85
    );

    doc.setFont("helvetica", "bold");
    doc.text("Reference Id                     :", contentX + 2, contentY + 95);
    doc.setFont("helvetica", "normal");
    doc.text(user.reference_id ? user.reference_id.toString() : "N/A", contentX + 54, contentY + 95);

    doc.setFont("helvetica", "bold");
    doc.text("Verification Date              :", contentX + 2, contentY + 105);
    doc.setFont("helvetica", "normal");
    doc.text(user.VerifiedDate ? user.VerifiedDate.toString() : "N/A", contentX + 54, contentY + 105);
      
    
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
    const fileName =user.PanNumber
      ? `${user.fullName}_verification_certificate.pdf`
      : "verification_certificate.pdf";
    doc.save(fileName);
  };

  
  

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
                Pan No
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
                Father's Name
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
  //   console.log(user.VerifiedDate)
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

                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.PanNumber}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.fullName || "Name not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.middleName || "DOB not available"}</td>
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

export default PanDetailTable;
