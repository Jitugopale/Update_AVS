import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import MainPdf from "./MainPdf";
import Loan from "./Loan";
import html2canvas from "html2canvas";
import "./credit.css";

const CreditVerificationPage = () => {
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
  const contentRef = useRef();
  const [error, setError] = useState("");

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
    const pageHeight = pdf.internal.pageSize.height;
  
    if (contentRefElement) {
      const components = contentRefElement.children;
  
      for (let i = 0; i < components.length; i++) {
        const component = components[i];
        
        // Adding borders to table and cells
        if (component.tagName === 'TABLE') {
          component.style.border = '1px solid #ddd'; // Add borders to table
          component.style.borderCollapse = 'collapse'; // Collapse table borders
          const cells = component.getElementsByTagName('td');
          const headers = component.getElementsByTagName('th');
          
          // Apply borders and padding to each table cell and header
          for (let cell of cells) {
            cell.style.border = '1px solid #ddd'; // Add border to each cell
            cell.style.padding = '8px'; // Add padding to each cell
          }
          for (let header of headers) {
            header.style.border = '1px solid #ddd'; // Add border to each header
            header.style.padding = '8px'; // Add padding to each header
          }
        }
  
        const canvas = await html2canvas(component, { 
          scale: 1.5, // Reduce scale for smaller images (lower resolution)
          backgroundColor: null,
          useCORS: true, 
        });
  
        const imgData = canvas.toDataURL("image/png", 0.5); // Reduce image quality for compression
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
        if (i > 0) {
          pdf.addPage();
        }
  
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      }
  
      // Save the generated PDF
      pdf.save("credit_verification.pdf");
    }
  };
  

  return (
    <div className="container mt-5">
      <h1 className="text-center">Credit Verification</h1>

      <form>
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
      </form>

      {error && <p className="text-danger mt-3">{error}</p>}

      {responseData && (
        <div>
          <h2>Verification Result</h2>
          <div
            style={{
              padding: "10px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div ref={contentRef}>
              <MainPdf data={responseData} enquiryId={enquiryId}/>
              {responseData?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.retailAccountDetails?.map(
                (loan, index) => (
                  <Loan key={index} data={responseData} enquiryId={enquiryId} loanData={loan} />
                )
              )}
            </div>
            <button onClick={generatePDF}>Download PDF</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditVerificationPage;
