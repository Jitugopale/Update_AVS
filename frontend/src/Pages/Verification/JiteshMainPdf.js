import React from "react";

const MainPdf = () => {
    
  const style = {
    body: {
      fontFamily: "Arial, sans-serif",
      margin: 0,
      padding: 0,
    },
    container: {
      fontSize:"72%", 
      width: "90%",
      margin: "20px auto",
      border: "1px solid #000",
      padding: "20px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "2px solid #000",
      paddingBottom: "10px",
    },
    headerTitle: {
      fontSize: "20px",
      color: "#004A98",
    },
    headerImg: {
      height: "40px",
    },
    section: {
      marginTop: "20px",
    },
    sectionHeader: {
      backgroundColor: "#004A98",
      color: "#fff",
      padding: "10px",
      fontSize: "16px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "10px",
    },
    tableCell: {
      border: "1px solid #000",
      padding: "8px",
      textAlign: "left",
    },
    tableHeader: {
      backgroundColor: "#F1F1F1",
    },
    highlight: {
      backgroundColor: "#FFE600",
    },
  };

  return (
    <>
      <div style={style.container} >
        <div style={style.header}>
          <h1 style={style.headerTitle}>CIBIL COMBO REPORT</h1>
          
          <div className="mt-5">
            <p>Date: 16-12-2024</p>
            <p>Enquiry ID: MR511011-10</p>
            <p>Control Number: 0002507017</p>
          </div>
        </div>

        <div style={style.section}>
          <div style={style.sectionHeader}>SEARCH INFORMATION</div>
          <table style={style.table}>
            <tbody>
              <tr>
                <th style={{ ...style.tableCell, ...style.tableHeader }}>Name</th>
                <td style={style.tableCell}>Ranjana</td>
                <th style={{ ...style.tableCell, ...style.tableHeader }}>PAN</th>
                <td style={style.tableCell}>EPRPM0099P</td>
              </tr>
              <tr>
                <th style={{ ...style.tableCell, ...style.tableHeader }}>
                  Key Person Name
                </th>
                <td style={style.tableCell}>Pandurang Mohite</td>
                <th style={{ ...style.tableCell, ...style.tableHeader }}>UID</th>
                <td style={style.tableCell}>XXXXXXXXXXXX</td>
              </tr>
              <tr>
                <th style={{ ...style.tableCell, ...style.tableHeader }}>DOB</th>
                <td style={style.tableCell}>01-01-1980</td>
                <th style={{ ...style.tableCell, ...style.tableHeader }}>
                  Mobile
                </th>
                <td style={style.tableCell}>9898989898</td>
              </tr>
              <tr>
                <th style={{ ...style.tableCell, ...style.tableHeader }}>Gender</th>
                <td style={style.tableCell}>Female</td>
                <th style={{ ...style.tableCell, ...style.tableHeader }}>
                  Current Address
                </th>
                <td style={style.tableCell}>
                  Room No. 22, Shree Charan Chawl, Mumbai
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={style.section}>
          <div style={style.sectionHeader}>CONSUMER INFORMATION</div>
          <table style={style.table}>
            <tbody>
              <tr>
                <th
                  style={{
                    ...style.tableCell,
                    ...style.highlight,
                    ...style.tableHeader,
                  }}
                >
                  Borrower Details
                </th>
                <th style={style.tableCell}>Details Here...</th>
              </tr>
              <tr>
                <th style={{ ...style.tableCell, ...style.tableHeader }}>Name</th>
                <td style={style.tableCell}>Ranjana Pandurang Mohite</td>
              </tr>
              <tr>
                <th style={{ ...style.tableCell, ...style.tableHeader }}>PAN</th>
                <td style={style.tableCell}>EPRPM0099P</td>
              </tr>
              <tr>
                <th style={{ ...style.tableCell, ...style.tableHeader }}>Mobile</th>
                <td style={style.tableCell}>9898989898</td>
              </tr>
              <tr>
                <th style={{ ...style.tableCell, ...style.tableHeader }}>Email</th>
                <td style={style.tableCell}>example@example.com</td>
              </tr>
              <tr>
                <th style={{ ...style.tableCell, ...style.tableHeader }}>
                  Address
                </th>
                <td style={style.tableCell}>
                  Room No. 22, Shree Charan Chawl, Shanti Nagar, Mumbai
                </td>
              </tr>
              <tr>
                <th style={{ ...style.tableCell, ...style.tableHeader }}>
                  Category
                </th>
                <td style={style.tableCell}>Permanent Address</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={style.section}>
          <div style={style.sectionHeader}>CREDIT REPORT SUMMARY</div>
          <table style={style.table}>
            <tbody>
              <tr>
                <th style={{ ...style.tableCell, ...style.tableHeader }}>
                  Name of Reported Account
                </th>
                <th style={{ ...style.tableCell, ...style.tableHeader }}>
                  Open Date
                </th>
                <th style={{ ...style.tableCell, ...style.tableHeader }}>
                  Close Date
                </th>
                <th style={{ ...style.tableCell, ...style.tableHeader }}>
                  Credit Limit
                </th>
                <th style={{ ...style.tableCell, ...style.tableHeader }}>
                  Total Amount
                </th>
              </tr>
              <tr>
                <td style={style.tableCell}>Account 1</td>
                <td style={style.tableCell}>01-01-2020</td>
                <td style={style.tableCell}>01-01-2024</td>
                <td style={style.tableCell}>60,000</td>
                <td style={style.tableCell}>45,329</td>
              </tr>
              <tr>
                <td style={style.tableCell}>Account 2</td>
                <td style={style.tableCell}>01-06-2021</td>
                <td style={style.tableCell}>Open</td>
                <td style={style.tableCell}>50,000</td>
                <td style={style.tableCell}>30,210</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MainPdf;
