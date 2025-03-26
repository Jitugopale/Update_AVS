import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf"; // Import jsPDF
import VoterTable from "./VoterTable";
import * as XLSX from "xlsx"; // Import xlsx library

const VoterVerificationPage = () => {
  const [idNumber, setIdNumber] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [error, setError] = useState("");

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
          "https://192.168.20.150:82/Document_Verify_Back/api/Voter/GetAll"
        );
        setVerifiedUsers(response.data.data); // Set the fetched data into the state
      } catch (error) {
        console.error("Error fetching verified users:", error);
      }
    };
    fetchVerifiedUsers();
  }, []);

  const handleExcelDownload = () => {
    // Mapping the verified users data to the format required for Excel
    const excelData = verifiedUsers.map((user, index) => ({
      SrNo: index + 1, // Serial numberverifiedData?.data?.
      "Voter ID": user?.input_voter_id || "N/A",
      Name: user?.name || "N/A",
      Age: user?.age || "N/A",
      Gender: user?.gender || "N/A",
      Area: user?.area || "N/A",
      District: user?.district || "N/A",
      State: user?.state || "N/A",
      "Polling Station": user?.polling_station || "N/A",
      "Relation Name": user?.relation_name || "N/A",
      "Relation Type": user?.relation_type || "N/A",
      "Assembly Constituency": user?.assembly_constituency || "N/A",
      "Constituency Number": user?.assembly_constituency_number || "N/A",
      "Part Number": user?.part_number || "N/A",
      "Part Name": user?.part_name || "N/A",
      "Parliamentary Name": user?.parliamentary_name || "N/A",
      "Parliamentary Number": user?.parliamentary_number || "N/A",
      "SlNo Inpart": user?.slno_inpart || "N/A",
      "Section Number": user?.section_no || "N/A",
      "State Code": user?.st_code || "N/A",
      "Parliamentary Constituency": user?.parliamentary_constituency || "N/A",
      Id: user?.id || "N/A",
      "Verification Date": user?.VerifiedDate || "N/A",
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

  const handleVerify = async () => {
    if (!idNumber) {
      setError("ID Number is required");
      return;
    }

    setLoading(true);
    setError("");
    setResponseData(null);

    try {
      const res = await axios.post(
        `https://192.168.20.150:82/Document_Verify_Back/api/Voter/VerifyVoterId?id_number=${idNumber}`,
        { id_number: idNumber }
      );
      if (res.data.status === "success") {
        setResponseData(res.data);
        console.log(res.data);
      } else {
        setError(res.data.message || "Verification failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate PDF with the response data
  // const generatePDF = () => {
  //   if (!responseData || !responseData.data) {
  //     alert("No data to generate PDF");
  //     return;
  //   }

  //   const data = responseData.data;
  //   const doc = new jsPDF();

  //   let yPosition = 10;

  //   // Add Branch Name Text (assuming it should be the first thing added)
  //   doc.setFontSize(14);
  //   doc.setFont("helvetica", "bold");
  //   doc.text("Branch Name: XYZ Branch", 10, yPosition);
  //   yPosition += 15;

  //   // Title Section
  //   doc.setFontSize(18);
  //   doc.setFont("helvetica", "bold");
  //   doc.text("Voter Verification Report", 15, yPosition);
  //   yPosition += 5;

  //   // Draw a horizontal line after the title for separation
  //   doc.setLineWidth(0.5);
  //   doc.line(10, yPosition, 200, yPosition);
  //   yPosition += 5;

  //   // General Information Section
  //   doc.setFontSize(12);
  //   doc.setFont("helvetica", "normal");
  //   doc.text("Voter Information", 10, yPosition);
  //   yPosition += 10;

  //   // Information rows with bold labels and normal text
  //   const info = [
  //     { label: "Voter ID:", value: data.input_voter_id },
  //     { label: "Name:", value: data.name },
  //     { label: "Gender:", value: data.gender },
  //     { label: "Age:", value: data.age || "N/A" },
  //     { label: "Relation Name:", value: data.relation_name || "N/A" },
  //     { label: "Relation Type:", value: data.relation_type || "N/A" },
  //     { label: "State:", value: data.state },
  //     { label: "District:", value: data.district },
  //     { label: "Polling Station:", value: data.polling_station },
  //     { label: "Constituency:", value: data.assembly_constituency },
  //     { label: "Constituency Number:", value: data.assembly_constituency_number },
  //     { label: "Part Number:", value: data.part_number },
  //     { label: "Part Name:", value: data.part_name },
  //     { label: "Parliamentary Name:", value: data.parliamentary_name },
  //     { label: "Parliamentary Number:", value: data.parliamentary_number },
  //   ];

  //   info.forEach(item => {
  //     doc.setFont("helvetica", "bold");
  //     doc.text(item.label, 10, yPosition);
  //     doc.setFont("helvetica", "normal");
  //     doc.text(item.value, 60, yPosition);
  //     yPosition += 10; // Adjust the spacing between each information row
  //   });

  //   // Address Section with bullet points
  //   doc.setFont("helvetica", "bold");
  //   doc.text("Address:", 10, yPosition);
  //   doc.setFont("helvetica", "normal");
  //   doc.text(data.area, 60, yPosition);
  //   yPosition += 15; // Adding some space after the address section

  //   // Draw a horizontal line before footer
  //   doc.setLineWidth(0.5);
  //   doc.line(10, yPosition, 200, yPosition);
  //   yPosition += 5;

  //   // Final Notes/Disclaimer (optional)
  //   doc.setFontSize(10);
  //   doc.setFont("helvetica", "italic");
  //   doc.text("This is an official report generated by AVS Verify Onboarding Solution", 10, yPosition);
  //   yPosition += 15; // Adding space after the notes

  //   // Save PDF
  //   doc.save("Voter_Verification_Report.pdf");
  // };

  const generatePDF = () => {
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
      responseData?.data?.[0]?.name || "N/A"
    }, Voter Id No. ${idNumber} are verified.`;
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

    const nicData = responseData?.data?.[0] || {};
    const processNicData = (label, value) => {
      if (!value) return `${label}: N/A`;
      return value.length > 5
        ? `${label}: ${value.slice(0, 5)}\n${value.slice(5)}`
        : `${label}: ${value}`;
    };

    const userDetails = [
      { label: "Status", value: "success" || "N/A" },
      { label: "Id Number", value: idNumber ? idNumber.toString() : "N/A" },
      {
        label: "Name",
        value: responseData.data?.[0]?.name
          ? responseData.data?.[0]?.name.toString()
          : "N/A",
      },
      {
        label: "Age",
        value: responseData.data?.[0]?.age
          ? responseData.data?.[0]?.age.toString()
          : "N/A",
      },
      {
        label: "Gender",
        value: responseData.data?.[0]?.gender
          ? responseData.data?.[0]?.gender.toString()
          : "N/A",
      },
      {
        label: "Relation Name",
        value: responseData.data?.[0]?.relation_name
          ? responseData.data?.[0]?.relation_name.toString()
          : "N/A",
      },
      {
        label: "Relation Type",
        value: responseData.data?.[0]?.relation_type
          ? responseData.data?.[0]?.relation_type.toString()
          : "N/A",
      },
      {
        label: "Area",
        value: responseData.data?.[0]?.area
          ? responseData.data?.[0]?.area.toString()
          : "N/A",
      },

      {
        label: "State",
        value: responseData.data?.[0]?.state
          ? responseData.data?.[0]?.state.toString()
          : "N/A",
      },
      {
        label: "District",
        value: responseData.data?.[0]?.district
          ? responseData.data?.[0]?.district.toString()
          : "N/A",
      },
      {
        label: "Polling Station",
        value: responseData.data?.[0]?.polling_station
          ? responseData.data?.[0]?.polling_station.toString()
          : "N/A",
      },
      {
        label: "Assembly Constituency",
        value: responseData.data?.[0]?.assembly_constituency
          ? responseData.data?.[0]?.assembly_constituency.toString()
          : "N/A",
      },
      {
        label: "Constituency Number",
        value: responseData.data?.[0]?.assembly_constituency_number
          ? responseData.data?.[0]?.assembly_constituency_number.toString()
          : "N/A",
      },
      {
        label: "Part Number",
        value: responseData.data?.[0]?.part_number
          ? responseData.data?.[0]?.part_number.toString()
          : "N/A",
      },
      {
        label: "Part Name",
        value: responseData.data?.[0]?.part_name
          ? responseData.data?.[0]?.part_name.toString()
          : "N/A",
      },
      {
        label: "Parliamentary Name",
        value: responseData.data?.[0]?.parliamentary_name
          ? responseData.data?.[0]?.parliamentary_name.toString()
          : "N/A",
      },
      {
        label: "Parliamentary Number",
        value: responseData.data?.[0]?.parliamentary_number
          ? responseData.data?.[0]?.parliamentary_number.toString()
          : "N/A",
      },
      {
        label: "SlNo Inpart",
        value: responseData.data?.[0]?.slno_inpart
          ? responseData.data?.[0]?.slno_inpart.toString()
          : "N/A",
      },
      {
        label: "Section Number",
        value: responseData.data?.[0]?.section_no
          ? responseData.data?.[0]?.section_no.toString()
          : "N/A",
      },
      {
        label: "State Code",
        value: responseData.data?.[0]?.st_code
          ? responseData.data?.[0]?.st_code.toString()
          : "N/A",
      },
      {
        label: "Parliamentary Constituency",
        value: responseData.data?.[0]?.parliamentary_constituency
          ? responseData.data?.[0]?.parliamentary_constituency.toString()
          : "N/A",
      },
      {
        label: "Id",
        value: responseData.data?.[0]?.id
          ? responseData.data?.[0]?.id.toString()
          : "N/A",
      },
    ];

    doc.setFont("helvetica", "bold");
    userDetails.forEach((item) => {
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
    <>
     <div className="container mt-3">
       <div className="card">
            <div className="card-header">
            <h1 className="card-title" style={{ color: "green" }}>
              Voter ID Verification
            </h1>
            </div>
            <div className="card-body">
            <div className="container-fluid">
        <div className="d-flex flex-column align-items-center">
          <div className="p-3" style={{ maxWidth: "1200px", width: "100%" }}>
           
            <div
              className="d-flex justify-content-between mb-3 mt-2"
              style={styles.statusBar}
            >
              <div>
                {/* Display specific count for 'credit' */}
                <div>
                  <span>No. Of Count : {verificationCounts.voter}</span>
                </div>
              </div>{" "}
              <span>Your available Credit: -62</span>
            </div>
            <div>
              <label htmlFor="id_number">Enter Voter ID :&nbsp;</label>
              <input
                type="text"
                id="id_number"
                value={idNumber}
                maxLength={10}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="Enter Voter ID"
                style={inputStyle}
                aria-label="PAN ID Input"
              />
              <div className="buttons mt-3">
                {!isVerified && (
                  <button
                    type="submit"
                    style={styles.button}
                    onClick={handleVerify}
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {loading ? "Verifying..." : "Verify"}
                  </button>
                )}
                <button
                  type="button"
                  style={styles.button}
                  onClick={handleExcelDownload}
                >
                  Excel Report
                </button>
                <button
                  style={styles.button}
                  onClick={() => setIdNumber("")}
                  aria-label="Clear Input"
                >
                  Clear
                </button>
                <button style={styles.button}>Search</button>
              </div>
            </div>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>
        </div>

        {/* Show response data below the card */}
        {!isVerified && responseData && (
          <div className="container mt-5 d-flex justify-content-center">
            <div
              className="card shadow-lg p-4"
              style={{
                borderRadius: "10px",
                backgroundColor: "#f8f9fa",
                maxWidth: "800px",
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
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      Status :
                    </td>
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
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      Entered ID Number :
                    </td>
                    <td style={{ textAlign: "left" }}>{idNumber}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      Name :
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {responseData.data?.[0]?.name}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      Age :
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {responseData.data?.[0]?.age || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      Gender :
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {responseData.data?.[0]?.gender}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      Relation Name :
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {responseData.data?.[0]?.relation_name || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      Relation Type :
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {responseData.data?.[0]?.relation_type || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      Area:
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {responseData.data?.[0]?.area}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      State:
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {responseData.data?.[0]?.state}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      District:
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {responseData.data?.[0]?.district}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      Polling Station:
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {responseData.data?.[0]?.polling_station}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      Assembly Constituency:
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {responseData.data?.[0]?.assembly_constituency}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      Constituency Number:
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {responseData.data?.[0]?.assembly_constituency_number}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      Part Number:
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {responseData.data?.[0]?.part_number}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      Part Name:
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {responseData.data?.[0]?.part_name}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      Parliamentary Name:
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {responseData.data?.[0]?.parliamentary_name}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      Parliamentary Number:
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {responseData.data?.[0]?.parliamentary_number}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      SlNo Inpart:
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {responseData.data?.[0]?.slno_inpart}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      Section Number:
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {responseData.data?.[0]?.section_no}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      State Code:
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {responseData.data?.[0]?.st_code}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      Parliamentary Constituency:
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {responseData.data?.[0]?.parliamentary_constituency
                        ? responseData.data?.[0]?.parliamentary_constituency
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold", textAlign: "left" }}>
                      Id:
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {responseData.data?.[0]?.id}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="text-center mt-4">
                <button
                  className="btn btn-success btn-lg"
                  style={{
                    fontSize: "16px",
                    padding: "12px 20px",
                    borderRadius: "5px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                  onClick={generatePDF}
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
        <VoterTable />
      </div>
            </div>
       </div>
    </div>
   
    </>
  );
};

export default VoterVerificationPage;
