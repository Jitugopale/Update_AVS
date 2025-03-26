import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx"; // Import xlsx library


const CreditTable = ({ generatePDF }) => {
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
    
      const exportData = filteredUsers.map((user, index) => ({
        'SrNo': index + 1, // Serial number
        'PancardNo': user.verifiedData?.data?.cCRResponse
      ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
      ?.identityInfo?.pANId?.[0]?.idNumber || "Not available",
        'Name': user.verifiedData?.data?.cCRResponse
          ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
          ?.personalInfo?.name?.fullName || "Not available",
        'MobileNo': user.verifiedData?.data?.cCRResponse
          ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.phoneInfo
          ?.find((phone) => phone.typeCode === "M")?.number || "Not available",
        'Address': user.verifiedData?.data?.cCRResponse
          ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
          ?.addressInfo?.[0]?.address || "Not available",
        'DOB': user.verifiedData?.data?.cCRResponse
          ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
          ?.personalInfo?.dateOfBirth || "Not available",
        'VerificationDate': user.formattedDate || "Not available",
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
          "http://localhost:5000/api/credit/verified"
        );
        setVerifiedUsers(response.data); // Set the fetched data into the state
      } catch (error) {
        console.error("Error fetching verified users:", error);
      }
    };
    fetchVerifiedUsers();
  }, []);


// Function to handle Excel download
const handleExcelDownload = () => {
  // Mapping the verified users data to the format required for Excel
  const excelData = verifiedUsers.map((user, index) => ({
    SrNo: index + 1,
    PancardNo: user.verifiedData?.data?.cCRResponse
      ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
      ?.identityInfo?.pANId?.[0]?.idNumber || "Not available",
    Name: user.verifiedData?.data?.cCRResponse
      ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
      ?.personalInfo?.name?.fullName || "Not available",
    MobileNo: user.verifiedData?.data?.cCRResponse
      ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.phoneInfo
      ?.find((phone) => phone.typeCode === "M")?.number || "Not available",
    Address: user.verifiedData?.data?.cCRResponse
      ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
      ?.addressInfo?.[0]?.address || "Not available",
    DOB: user.verifiedData?.data?.cCRResponse
      ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
      ?.personalInfo?.dateOfBirth || "Not available",
    VerificationDate: user.formattedDate || "Not available",
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


  // const handleDelete = async (aadharNumber) => {
  //   // Show confirmation dialog
  //   const isConfirmed = window.confirm("Are you sure you want to delete this user?");
  
  //   // If user clicks "Yes"
  //   if (isConfirmed) {
  //     try {
  //       const response = await axios.delete(`http://localhost:5000/api/adhar/delete/${aadharNumber}`);
        
  //       if (response.data.message === "User deleted successfully.") {
  //         // If deletion is successful, update state by filtering out the deleted user
  //         setUsers((prevUsers) => prevUsers.filter((user) => user.aadharNumber !== aadharNumber));
  //         alert("User deleted successfully.");
  //       } else {
  //         alert("Failed to delete user.");
  //       }
  //     } catch (error) {
  //       console.error("Error deleting user:", error);
  //       alert("Failed to delete user. Please try again.");
  //     }
  //   } else {
  //     // If user clicks "No", just return without deleting
  //     alert("User deletion canceled.");
  //   }
  // };
  
  return (
    <>
      <h3 style={{
                  marginTop:'65px',fontSize:'28px',color:'darkgoldenrod'
                }}>Verified Users</h3>
                 <div className="row mb-3">
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
    {/* <button onClick={handleExcelDownload}>Excel Download</button> */}
    <button onClick={handleDownload}>Excel Download</button>
  </div>
</div>
      {/* <div className="row mb-5">
        <div className="col-md-2 d-flex">
        <span>From Date</span>

          <input
          style={{marginLeft:'10px'}}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
        </div>
        <div className="col-md-2 d-flex offset-md-2">
        <span>From Date</span>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
        </div>
        <div className="col-2">
          <button onClick={handleExcelDownload}>Excel Download</button>
        </div>
      </div> */}

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
                Pancard No
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
                Mobile No
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                Address
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
              {/* <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                }}
              >
                Delete
              </th> */}
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
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {user.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.identityInfo?.pANId?.[0]?.idNumber  || "Not available"}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.personalInfo?.name?.fullName  || "Not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.phoneInfo?.find(
                        (phone) => phone.typeCode === "M"
                      )?.number  || "Not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.addressInfo?.[0]?.address  || "Not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.personalInfo?.dateOfBirth || "Not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {user.formattedDate  || "Not available"}
                </td>
                
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    <button 
                      onClick={() => generatePDF(user)} 
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
     
    </>
  );
};

export default CreditTable;
