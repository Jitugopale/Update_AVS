


import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const CreditVerificationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    document_id: '',
    date_of_birth: '',
    address: '',
    pincode: '',
  });
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerify = async () => {
    const { name, mobile, document_id, date_of_birth, address, pincode } = formData;

    if (!name || !mobile || !document_id || !date_of_birth || !address || !pincode) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');
    setResponseData(null);

    try {
      const res = await axios.post('http://192.168.20.151:4000/api/credit/credit_report_checker', formData);

      if (res.data.status === 'success') {
        setResponseData(res.data); // Store the successful response data
      } else {
        setError(res.data.message || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (!responseData || !responseData.verifiedData) {
      alert('No data to generate PDF');
      return;
    }

    const data = responseData.verifiedData.data.cCRResponse.cIRReportDataLst[0]?.cIRReportData;

    if (!data) {
      alert('Incomplete data received.');
      return;
    }

    // Initialize jsPDF
    const doc = new jsPDF();
    let yPosition = 10;

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Credit Verification Details', 15, yPosition);
    yPosition += 15;

    // Add Personal Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${data.iDAndContactInfo.personalInfo.name.fullName}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Date of Birth: ${data.iDAndContactInfo.personalInfo.dateOfBirth}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Gender: ${data.iDAndContactInfo.personalInfo.gender}`, 10, yPosition);
    yPosition += 10;

    // Add Identity Info
    data.iDAndContactInfo.identityInfo.pANId.forEach((id, index) => {
      doc.text(`PAN ID ${index + 1}: ${id.idNumber} (Reported Date: ${id.reportedDate})`, 10, yPosition);
      yPosition += 10;
    });

    // Add Address Info
    data.iDAndContactInfo.addressInfo.forEach((address, index) => {
      doc.text(
        `Address ${index + 1}: ${address.address}, ${address.state}, ${address.postal} (Reported Date: ${address.reportedDate})`,
        10,
        yPosition
      );
      yPosition += 10;
    });

    // Save the PDF
    doc.save('Credit_Verification_Details.pdf');
  };

  return (
    <div>
      <h1>Credit Verification</h1>
      <div>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          Mobile:
          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} />
        </label>
        <label>
          Document ID:
          <input type="text" name="document_id" value={formData.document_id} onChange={handleChange} />
        </label>
        <label>
          Date of Birth:
          <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
        </label>
        <label>
          Address:
          <textarea name="address" value={formData.address} onChange={handleChange}></textarea>
        </label>
        <label>
          Pincode:
          <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} />
        </label>
        <button onClick={handleVerify} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!isVerified &&responseData && (
  <div className="container mt-5 d-flex justify-content-center">
    <div
      className="card shadow-lg p-4" 
      style={{
        borderRadius: "10px",
        backgroundColor: "#f8f9fa",
        width: "800px",
        height:'610px',
        overflowY: "auto", // Enable vertical scrolling

      }}
    >
      <table
        className="table table-bordered"
        style={{ fontSize: "16px" }}
      >
        <thead>
          <tr>
            <th
              colSpan="2"
              className="text-center"
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#686868",
              }}
            >
              VERIFICATION DETAILS
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>Status :</td>
            <td
              style={{
                textAlign: "left",
                color: responseData.status ? "green" : "red",
              }}
            >
              {responseData.status ? "Verified" : "Not Verified"}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>Id Number :</td>
            <td style={{ textAlign: "left" }}>
              {responseData.verifiedData?.data?.idNumber}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>First Name :</td>
            <td style={{ textAlign: "left" }}>
              {responseData.verifiedData?.data?.firstName}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>Middle Name :</td>
            <td style={{ textAlign: "left" }}>
              {responseData.verifiedData?.data?.middleName}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>Last Name :</td>
            <td style={{ textAlign: "left" }}>
              {responseData.verifiedData?.data?.lastName}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>Full Name :</td>
            <td style={{ textAlign: "left" }}>
              {responseData.verifiedData?.data?.fullName || "N/A"}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>PAN Status :</td>
            <td style={{ textAlign: "left" }}>
              {responseData.verifiedData?.data?.panStatus || "N/A"}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>Category :</td>
            <td style={{ textAlign: "left" }}>
              {responseData.verifiedData?.data?.category || "N/A"}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>
              Aadhaar Seeding Status :
            </td>
            <td style={{ textAlign: "left" }}>
              {responseData.verifiedData?.data?.aadhaarSeedingStatus}
            </td>
          </tr>
          {/* <tr>
            <td style={{ fontWeight: "bold", textAlign: "left" }}>
              Verification Date :
            </td>
            <td style={{ textAlign: "left" }}>
              {responseData.formattedDate}
            </td>
          </tr> */}
        </tbody>
      </table>

      <div className="text-center mt-4">
        <button
        onClick={generatePDF}
          className="btn btn-success btn-lg"
          style={{
            fontSize: "16px",
            padding: "12px 20px",
            borderRadius: "5px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default CreditVerificationPage;
