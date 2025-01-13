import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import MainPdf from "./MainPdf";
import Loan from "./Loan";
import html2canvas from "html2canvas";
import "./credit.css";
import CreditTable from "./CreditTable";
import * as XLSX from "xlsx"; // Import xlsx library

const CreditVerificationPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
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
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    document_id: "",
    date_of_birth: "",
    address: "",
    pincode: "",
  });
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [idNumber, setIdNumber] = useState("");
  const contentRef = useRef();
  const [error, setError] = useState("");

  const handleExcelDownload = () => {
    // Mapping the verified users data to the format required for Excel
    const excelData = verifiedUsers.map((user, index) => ({
      'SrNo': index + 1,
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
          "http://localhost:5000/api/credit/verified"
        );
        setVerifiedUsers(response.data); // Set the fetched data into the state
      } catch (error) {
        console.error("Error fetching verified users:", error);
      }
    };
    fetchVerifiedUsers();
  }, []);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerify = async () => {
    const { name, mobile, document_id, date_of_birth, address, pincode } =
      formData;

    if (
      !name ||
      !mobile ||
      !document_id ||
      !date_of_birth ||
      !address ||
      !pincode
    ) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");
    setResponseData(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/credit/credit_report_checker",
        formData
      );

      if (res.data.status === "success") {
        setResponseData(res.data); // Store the successful response data
      } else {
        setError(res.data.message || "Verification failed. Please try again.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateEnquiryId = () => {
    // Generate random 8-digit number (from 10000000 to 99999999)
    const middlePart = Math.floor(10000000 + Math.random() * 90000000);

    // Generate random 2-digit number (from 10 to 99)
    const suffix = Math.floor(10 + Math.random() * 90);

    // Combine prefix, middle part, and suffix
    const enquiryId = `MF${middlePart}_${suffix}`;

    return enquiryId;
  };

  const [enquiryId] = useState(generateEnquiryId());
  console.log(enquiryId);

  
  const generatePDF = async () => {
    const contentRefElement = contentRef.current;
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
  
    if (contentRefElement) {
      const components = contentRefElement.children;
  
      for (let i = 0; i < components.length; i++) {
        const component = components[i];
  
        // Add styles to the table and its cells
        if (component.tagName === "TABLE") {
          component.style.border = "1px solid #ddd";
          component.style.borderCollapse = "collapse";
          const cells = component.getElementsByTagName("td");
          const headers = component.getElementsByTagName("th");
  
          for (let cell of cells) {
            cell.style.border = "1px solid #ddd";
            cell.style.padding = "8px";
          }
          for (let header of headers) {
            header.style.border = "1px solid #ddd";
            header.style.padding = "8px";
          }
        }
  
        // Capture the component with higher scale and optimized settings
        const canvas = await html2canvas(component, {
          scale: 2, // Higher scale for better quality
          backgroundColor: '#ffffff', // Set white background
          useCORS: true,
        });
  
        // Convert canvas to JPEG for better compression
        const imgData = canvas.toDataURL("image/jpeg", 0.75); // Adjust quality factor
  
        // Resize image to fit the page width
        const imgHeight = (canvas.height * pageWidth) / canvas.width;
  
        if (i > 0) {
          pdf.addPage();
        }
  
        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, imgHeight);
      }
  
      // Save the optimized PDF
      pdf.save("credit_verification_certificate.pdf");
    }
  };
  


  // const generatePDF = async () => {
  //   const contentRefElement = contentRef.current;
  //   const pdf = new jsPDF("p", "mm", "a4");
  //   const pageHeight = pdf.internal.pageSize.height;

  //   if (contentRefElement) {
  //     const components = contentRefElement.children;

  //     for (let i = 0; i < components.length; i++) {
  //       const component = components[i];

  //       // Adding borders to table and cells
  //       if (component.tagName === "TABLE") {
  //         component.style.border = "1px solid #ddd"; // Add borders to table
  //         component.style.borderCollapse = "collapse"; // Collapse table borders
  //         const cells = component.getElementsByTagName("td");
  //         const headers = component.getElementsByTagName("th");

  //         // Apply borders and padding to each table cell and header
  //         for (let cell of cells) {
  //           cell.style.border = "1px solid #ddd"; // Add border to each cell
  //           cell.style.padding = "8px"; // Add padding to each cell
  //         }
  //         for (let header of headers) {
  //           header.style.border = "1px solid #ddd"; // Add border to each header
  //           header.style.padding = "8px"; // Add padding to each header
  //         }
  //       }

  //       const canvas = await html2canvas(component, {
  //         scale: 1.5, // Reduce scale for smaller images (lower resolution)
  //         backgroundColor: null,
  //         useCORS: true,
  //       });

  //       const imgData = canvas.toDataURL("image/png", 0.5); // Reduce image quality for compression
  //       const imgWidth = pdf.internal.pageSize.getWidth();
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //       if (i > 0) {
  //         pdf.addPage();
  //       }

  //       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  //     }

  //     // Save the generated PDF
  //     pdf.save("credit_verification.pdf");
  //   }
  // };
  

  // Fetch verification counts from the backend on component mount
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

  const styles = {
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
  };
  const inputStyle = {
    marginBottom: "10px",
    padding: "8px",
    width: "30%",
    boxSizing: "border-box",
  };

  return (
    <div className="container">
      <div className=" p-3" style={{ maxWidth: "1200px", width: "100%" }}>
        <h1 className="card-title" style={{ color: "green" }}>
          Credit Verification
        </h1>
        <div style={styles.statusBar} className="mt-2">
          <div>
            {/* Display specific count for 'credit' */}
            <div>
              <span>No. Of Count : {verificationCounts.credit}</span>
            </div>
          </div>{" "}
          <span>Your available Credit: -62</span>
        </div>
      </div>

      <div className="container">
        <form>
          <div className="row">
            <div className="col-12 col-md-6">
              <label for="name" className="form-label">
                Name:
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="col-12 col-md-6">
              <label for="mobile" className="form-label">
                Mobile:
              </label>
              <input
                type="text"
                className="form-control"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-6">
              <label for="document_id" className="form-label">
                Pancard ID:
              </label>
              <input
                type="text"
                className="form-control"
                id="document_id"
                name="document_id"
                value={formData.document_id}
                onChange={handleChange}
                
              />
            </div>
            <div className="col-12 col-md-6">
              <label for="date_of_birth" className="form-label">
                Date of Birth:
              </label>
              <input
                type="date"
                className="form-control"
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6">
              <label for="address" className="form-label">
                Address:
              </label>
              <textarea
                className="form-control"
                id="address"
                name="address"
                rows="2"
                value={formData.address}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="col-12 col-md-6">
              <label for="pincode" className="form-label">
                Pincode:
              </label>
              <input
                type="text"
                className="form-control"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="buttons mt-3">
            {!isVerified && (
              <button
                type="button"
                style={styles.button}
                onClick={handleVerify}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            )}
            <button type="button" style={styles.button} onClick={handleExcelDownload}>Excel Report</button>
            <button style={styles.button} onClick={() => setIdNumber("")}>
              Clear
            </button>
            <button style={styles.button}>Search</button>
          </div>
        </form>
      </div>

      {/* <form>
        <div className="mb-3">
          <label for="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label for="mobile" className="form-label">
            Mobile:
          </label>
          <input
            type="text"
            className="form-control"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label for="document_id" className="form-label">
            Document ID:
          </label>
          <input
            type="text"
            className="form-control"
            id="document_id"
            name="document_id"
            value={formData.document_id}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label for="date_of_birth" className="form-label">
            Date of Birth:
          </label>
          <input
            type="date"
            className="form-control"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label for="address" className="form-label">
            Address:
          </label>
          <textarea
            className="form-control"
            id="address"
            name="address"
            rows="3"
            value={formData.address}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label for="pincode" className="form-label">
            Pincode:
          </label>
          <input
            type="text"
            className="form-control"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
          />
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form> */}


      {responseData && (
        <div className="mt-5">
          <h2 className="mb-3" style={{color:'green',fontSize:'25px'}}>Verification Result</h2>
          <button onClick={generatePDF}>Download PDF</button>

          <div
            style={{
              padding: "10px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              overflowX:'auto',
              height:'500px'
            }}
          >
            <div ref={contentRef}>
           

              <MainPdf data={responseData} enquiryId={enquiryId}/>
              {responseData?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.retailAccountDetails?.map(
                (loan, index) => (
                  <Loan
                    key={index}
                    data={responseData}
                    enquiryId={enquiryId}
                    loanData={loan}
                  />
                )
              )}
            </div>
            
          </div>
        </div>
      )}
      <CreditTable generatePDF={generatePDF}/>
    </div>
  );
};

export default CreditVerificationPage;
