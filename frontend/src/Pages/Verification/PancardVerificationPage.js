import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import PancardTable from "./PancardTable";
import * as XLSX from "xlsx"; // Import xlsx library

const PancardVerificationPage = ({
  verificationCount,
  updateVerificationCount,
}) => {
  const [pannumber, setPannumber] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [isVerified, setIsVerified] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [superAdminKey, setSuperAdminKey] = useState("");
  const [bankname, setBankname] = useState("");
  const [userKey, setUserKey] = useState("");
  const [token, setToken] = useState("");
  


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
        const storedUserData = JSON.parse(sessionStorage.getItem("userData"));
        console.log("Stored" ,storedUserData)
        if (storedUserData) {
          setSuperAdminKey(storedUserData.superAdminKey);
          setUserKey(storedUserData.userkey);
          setToken(storedUserData.access_token);
          setBankname(storedUserData.username);
        }
      }, []);

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


     // Fetch the verified users from the backend
  useEffect(() => {
    const fetchVerifiedUsers = async () => {
      try {
        const response = await axios.get(
          "https://192.168.20.150:82/Document_Verify_Back/api/Pan/GetAll"
        );
        setVerifiedUsers(response.data.data); // Set the fetched data into the state
        console.log(response.data.data)
      } catch (error) {
        console.error("Error fetching verified users:", error);
      }
    };
    fetchVerifiedUsers();
  },[]);

   const handleExcelDownload = () => {
      // Mapping the verified users data to the format required for Excel
      const excelData = verifiedUsers.map((user, index) => ({
        'SrNo': index + 1,  // You can adjust this if the `SrNo` is not directly available in the data
      'Pan No': user.PanNumber,
      'Name': user.Name,
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
  
 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setError(null);
  

  
    // Fix: Ensure correct timestamp format
    const currentTimestamp = new Date().toISOString();
  
    const requestData = {
      createdBy: userKey,
      createdOn: currentTimestamp,
      modifiedBy: superAdminKey,
      modifiedOn: currentTimestamp,
      pannumber: pannumber,
      verificationBy: userKey,
      superAdminKey: superAdminKey,
    };
  
    try {
      const response = await axios.post(
        "http://103.228.152.233:8130/api/verification/verify-PAN",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data)
  
      if (response.data.returnSuccess === true && response.data.returnMessage[0]==="Pan Verified") {
        setVerificationResult(response.data);
        console.log("Verification Success:", response.data);
        setSuccessMessage(response.data.returnMessage[0]||"PAN Card verified successfully!");       
        //  setTimeout(() => {
        //   setMessage(" ");
        //   handleClear();
        // }, 1000);
        setIsVerified(true); // ✅ Set verification state
        setTimeout(()=>{
          setSuccessMessage("")
        },2000)

      
      } else if (response.data.returnMessage[0]==="Pan Recived From DB" && response.data.returnSuccess === true) {
        setVerificationResult(response.data);
        console.log("PAN verification successful!");
        setSuccessMessage(response.data.returnMessage[0]||"PAN Card already verified!");
        setTimeout(()=>{
          setSuccessMessage("")
        },2000)
      }
    }catch (error) {
      console.error("Error verifying PAN card", error);
    
      if (error.response?.data?.errors?.pannumber) {
        setError(error.response.data.errors.pannumber[0]); // ✅ Extract and display "Invalid PAN number."
      } else {
        setError(
          error.response?.data?.message ||
            "Something went wrong while verifying the PAN card."
        );
      }
    
      setTimeout(() => {
        setError(""); // 🔥 Clear message after 2 seconds
      }, 2000);
    } finally {
      setLoading(false); // ✅ Stop loading in all cases
    }
  };
  
    


const generatePDF = () => {
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
  const title = bankname ? bankname : "Super Admin";
  doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

  // Center-aligned subtitle
  doc.setFontSize(14);
  const subtitle = "Pan Verification Certificate";
  doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, 28);

  // Center-aligned section header
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const header = "TO WHOMSOEVER IT MAY CONCERN";
  doc.text(header, (pageWidth - doc.getTextWidth(header)) / 2, 36);

  // Verification Statement
  const verificationText = `This is to Certify that ${
    verificationResult.data?.name|| "N/A"
  } are verified from https://www.pan.utiitsl.com/ using and verified Pan No. ${verificationResult.data?.panNumber}.`;
  const verificationSplit = doc.splitTextToSize(verificationText, 180);
  doc.text(verificationSplit, 14, 50);

  // Define positions and dimensions for the outer border
  const outerX = 10;
  const outerY = 65;
  const outerWidth = 190;
  const outerHeight = 45;

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
  doc.text("Name                    :", contentX + 2, contentY + 5);
  doc.setFont("helvetica", "normal");
  doc.text(verificationResult.data?.name|| "N/A", contentX + 40, contentY + 5);

  doc.setFont("helvetica", "bold");
  doc.text("Pan Number :", contentX + 2, contentY + 15);
  doc.setFont("helvetica", "normal");
  doc.text(verificationResult.data?.panNumber ? verificationResult.data?.panNumber.toString() : "N/A", contentX + 40, contentY + 15);

  
  // Footer with signatures
  doc.setFont("helvetica", "bold");
  doc.text("Signature of the Authorised Signatory", 14, 130);
  doc.text("Signature of the Branch Manager", 110, 130);

  doc.setFont("helvetica", "normal");
  doc.text("Name: __________________", 14, 140);
  doc.text("Name: __________________", 110, 140);

  doc.text("Designation: ____________", 14, 150);
  doc.text("Designation: ____________", 110, 150);

  doc.text("Phone no.: ______________", 14, 160);
  doc.text("Date: ___________________", 110, 160);

  // Bank Seal
  doc.setFont("helvetica", "normal");
  doc.text("(Bank Seal)", 14, 180);
  doc.text("Verified By : User", 120, 180);

  // Save PDF
  const fileName =verificationResult.data?.panNumber
    ? `${verificationResult.data?.name}_verification_certificate.pdf`
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
  width: "30%",
  boxSizing: "border-box",
};





  return (
    <>
    <div className="container mt-3">
       <div className="card">
            <div className="card-header">
              <h1 className="card-title" style={{color:'green'}}>PAN Verification</h1>
            </div>
            <div className="card-body">
            <div className="container-fluid">
      <div className="container d-flex align-items-center">
      <div
        className="p-2 mt-2"
        style={{ maxWidth: '1200px', width: '100%' }}
      >
          <div style={styles.statusBar} className='mt-2'>
          <div>
            {/* Display specific count for 'credit' */}
            <div>
              <span>No. Of Count : {verificationCounts.pancard}</span>
            </div>
          </div>{" "}
          <span>Your available Credit: -62</span>
        </div>
        {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Enter ID Number : &nbsp;</label>
        <input
          type="text"
          value={pannumber}
          onChange={(e) => setPannumber(e.target.value)}
          maxLength={10}
          placeholder="Enter PAN Number"
          id="pannumber"
          style={inputStyle}
        />
          </div>
          {/* <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify PAN"}
          </button> */}
          <div className="buttons mt-3">
        {!isVerified &&<button type="submit" style={styles.button} disabled={loading} >{loading ? 'Verifying...' : 'Verify PAN'}</button>}
            <button type="button"  style={styles.button} onClick={handleExcelDownload}>Excel Report</button>
            <button style={styles.button} onClick={() => setPannumber("")}>Clear</button>
            <button style={styles.button}>Search</button>
          </div>
        </form>

        {loading && <p className="text-center mt-3">Loading...</p>}

        {verificationResult && (
          <div className="mt-4">
            <h3 className="text-success text-center">PAN Verification Result</h3>
            <p className="text-center">Name: {verificationResult.data?.name}</p>
            <p className="text-center">PAN Number: {verificationResult.data?.panNumber}</p>

            {/* Button to download PDF */}
            <div className="text-center mt-3">
              <button
                className="btn btn-success"
                onClick={generatePDF}
                disabled={!verificationResult}
              >
                Download PDF
              </button>
            </div>
          </div>
        )}

        {verificationCount >= 5 && (
          <div
            className="alert alert-success mt-3"
            role="alert"
            onClick={updateVerificationCount}
          >
            {successMessage}
          </div>
        )}

        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
    <PancardTable/>
    </div>
            </div>
       </div>
    </div>
  
    </>
    
  );
};

export default PancardVerificationPage;
