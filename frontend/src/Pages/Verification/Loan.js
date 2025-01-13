import React from "react";
import "./Loan.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Loan = ({ data, key, loanData, enquiryId }) => {
  const [verifiedUsers, setVerifiedUsers] = useState([]);

  useEffect(() => {
    const fetchVerifiedUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/credit/verified"
        );
        setVerifiedUsers(response.data); // Set the fetched data into the state
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching verified users:", error);
      }
    };
    fetchVerifiedUsers();
  }, []);
  // const styles = {

  // };

  return (
    <>
      <div className="container my-4 border">
        <div className="row my-3 p-4">
          <div className="col-12 text-center">
            <h1 className="text-primary">CIBIL Combo Report</h1>
          </div>
        </div>
        <div className="row my-3"  style={{margin:"20px"}}>
          <div className="col-md-4">
            <table className="table table-borderless">
              <tbody style={{lineHeight:'10px'}}>
                <tr>
                  <td>
                    <strong>Consumer Name:</strong>
                  </td>
                  <td style={{paddingLeft:'4px'}}>
                    {
                      data?.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.personalInfo?.name?.firstName
                    }
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Enquiry ID:</strong>
                  </td>
                  <td style={{paddingLeft:'4px'}}>{enquiryId}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Member Reference No:</strong>
                  </td>
                  <td style={{paddingLeft:'4px'}}>{data?.verifiedData?.reference_id}</td>
                </tr>
                {/* <tr>
                  <td>
                    <strong>Branch ID:</strong>
                  </td>
                  <td>1123</td>
                </tr> */}
              </tbody>
            </table>
          </div>
          <div className="col-md-4 offset-md-4">
            <table className="table table-borderless">
              <tbody style={{lineHeight:'10px'}}>
                <tr>
                  <td>
                    <strong>Date:</strong>
                  </td>
                  <td>{verifiedUsers?.[0]?.formattedDate}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Time:</strong>
                  </td>
                  <td>09:46:12</td>
                </tr>
                {/* <tr>
                  <td>
                    <strong>Control Number:</strong>
                  </td>
                  <td>N/A</td>
                </tr>
                <tr>
                  <td>
                    <strong>Kendra / Centre:</strong>
                  </td>
                  <td />
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>
        <div className="p-4">
          {/* <div className="row my-2">
            <div className="col-12">
              <table
                className="table table-bordered data-table"
                style={{ width: "100%", tableLayout: "fixed" }}
              >
                <tbody>
                  <tr>
                    <th colSpan={2} style={{ backgroundColor: "yellow" }}>
                      BORROWER DETAILS
                    </th>
                    <th colSpan={2} style={{ backgroundColor: "yellow" }}>
                      IDENTIFICATION
                    </th>
                    <th colSpan={2} style={{ backgroundColor: "yellow" }}>
                      FAMILY DETAILS
                    </th>
                  </tr>
                  <tr>
                    <th>Name</th>
                    <td>
                      {
                        data?.verifiedData?.data?.cCRResponse
                          ?.cIRReportDataLst?.[0]?.cIRReportData
                          ?.iDAndContactInfo?.personalInfo?.name?.firstName
                      }
                    </td>
                    <th>PAN</th>
                    <td>
                      {
                        data?.verifiedData?.data?.cCRResponse
                          ?.cIRReportDataLst?.[0]?.cIRReportData
                          ?.iDAndContactInfo?.identityInfo?.pANId?.[0]?.idNumber
                      }
                    </td>
                    <th>No. of Dependents</th>
                    <td>2</td>
                  </tr>
                  <tr>
                    <th>DOB</th>
                    <td>
                      {
                        data?.verifiedData?.data?.cCRResponse
                          ?.cIRReportDataLst?.[0]?.cIRReportData
                          ?.iDAndContactInfo?.personalInfo?.dateOfBirth
                      }
                    </td>

                    <th />
                    <td />
                    <th>Husband</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Gender</th>
                    <td>
                      {
                        data?.verifiedData?.data?.cCRResponse
                          ?.cIRReportDataLst?.[0]?.cIRReportData
                          ?.iDAndContactInfo?.personalInfo?.gender
                      }
                    </td>

                    <th />
                    <td />
                    <th />
                    <td />
                  </tr>
                  <tr>
                    <th>Marital Status</th>
                    <td></td>
                    <th />
                    <td />
                    <th />
                    <td />
                  </tr>
                  <tr>
                    <th>Address</th>
                    <td colSpan={3}>
                      {
                        data?.verifiedData?.data?.cCRResponse
                          ?.cIRReportDataLst?.[0]?.cIRReportData
                          ?.iDAndContactInfo?.addressInfo?.[0]?.address
                      }
                    </td>
                    <th>Reported Date</th>
                    <td>
                      {
                        data?.verifiedData?.data?.cCRResponse
                          ?.cIRReportDataLst?.[0]?.cIRReportData
                          ?.iDAndContactInfo?.addressInfo?.[0]?.reportedDate
                      }
                    </td>
                  </tr>
                  <tr>
                    <th>ADDRESS</th>
                    <td colSpan={3}>
                      {
                        data?.verifiedData?.data?.cCRResponse
                          ?.cIRReportDataLst?.[0]?.cIRReportData
                          ?.iDAndContactInfo?.addressInfo?.[1]?.address
                      }
                    </td>
                    <th>Reported Date</th>
                    <td>
                      {
                        data?.verifiedData?.data?.cCRResponse
                          ?.cIRReportDataLst?.[0]?.cIRReportData
                          ?.iDAndContactInfo?.addressInfo?.[1]?.reportedDate
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div> */}

          <div className="sub-title">
            ACCOUNT STATUS:
            {loanData?.accountStatus || "Not Available"}
          </div>
          <div className="row my-3">
            <div className="col-12">
              <table
                className="table table-bordered data-table"
                style={{ width: "100%", tableLayout: "fixed" }}
              >
                <tbody>
                  <tr>
                    <th colSpan={6} style={{ backgroundColor: "yellow" }}>
                      ACCOUNT INFORMATION
                    </th>
                  </tr>
                  <tr>
                    <th>Account Type</th>
                    <td>{loanData?.accountType}</td>
                    <th>Credit Grantor</th>
                    <td>{loanData?.institution}</td>
                    <th>No. of Installments</th>
                    <td>{loanData?.repaymentTenure}</td>
                  </tr>
                  <tr>
                    <th>Account No.</th>
                    <td>{loanData?.accountNumber}</td>
                    <th>Loan Purpose</th>
                    <td>{loanData?.reason}</td>
                    <th>Repayment Frequency</th>
                    <td>{loanData?.termFrequency}</td>
                  </tr>
                  <tr>
                    <th>BRANCH ID</th>
                    <td>1123</td>
                    <th>Kendra ID</th>
                    <td>1123</td>
                    <th />
                    <td />
                  </tr>
                </tbody>
              </table>
              <table
                className="table table-bordered "
                style={{ width: "100%", tableLayout: "fixed" }}
              >
                <tbody>
                  <tr>
                    <th colSpan={6} style={{ backgroundColor: "yellow" }}>
                      DATES
                    </th>
                  </tr>
                  <tr>
                    <th>OPEN / DISURSHED Date</th>
                    <td>{loanData?.dateOpened}</td>
                    <th>WRITTEN-OFF Date</th>
                    <td></td>
                    <th>CLOSED Date</th>
                    <td>{loanData?.dateClosed}</td>
                  </tr>
                  <tr>
                    <th>Sanctioned Date</th>
                    <td>{loanData?.dateOpened}</td>
                    <th>Last Payment Date</th>
                    <td>{loanData?.lastPaymentDate}</td>
                    <th>Reported Date</th>
                    <td>{loanData?.dateReported}</td>
                  </tr>
                </tbody>
              </table>
              <table
                className="table table-bordered "
                style={{ width: "100%", tableLayout: "fixed" }}
              >
                <tbody>
                  <tr>
                    <th colSpan={6} style={{ backgroundColor: "yellow" }}>
                      AMOUNT
                    </th>
                  </tr>
                  <tr>
                    <th>DISBURED AMOUNT </th>
                    <td>{loanData?.sanctionAmount}</td>
                    <th>WRITTEN-OFF AMOUNT</th>
                    <td>{loanData?.writtenOffAmount} </td>
                    <th>CURRENT BALANCE</th>
                    <td>{loanData?.balance} </td>
                  </tr>
                  <tr>
                    <th>SANCTIONED AMMOUNT</th>
                    <td>{loanData?.sanctionAmount}</td>
                    <th>LAST PAYMENT AMMOUNT</th>
                    <td>{loanData?.installmentAmount}</td>
                    <th>OVERDUE</th>
                    <td />
                  </tr>
                  <tr>
                    <th>INSTALLMENT AMMOUNT</th>
                    <td>{loanData?.installmentAmount}</td>
                    <th />
                    <td />
                    <th />
                    <td />
                  </tr>
                </tbody>
              </table>
              <table
                className="table table-bordered "
                style={{ width: "50%", tableLayout: "fixed" }}
              >
                <tbody>
                  <tr>
                    <th colSpan={2} style={{ backgroundColor: "yellow" }}>
                      ACCOUNT STATUS
                    </th>
                  </tr>
                  <tr>
                    <th>ACCOUNT STATUS</th>
                    <td>{loanData?.accountStatus}</td>
                  </tr>
                  <tr>
                    <th>REASON</th>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* <div className="row my-3">
            <div className="col-12">
              <div className="section-title">DAYS PAST DUE</div>
              <table className="table table-bordered text-center">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>DEC</th>
                    <th>NOV</th>
                    <th>OCT</th>
                    <th>SEP</th>
                    <th>AUG</th>
                    <th>JUL</th>
                    <th>JUN</th>
                    <th>MAY</th>
                    <th>APR</th>
                    <th>MAR</th>
                    <th>FEB</th>
                    <th>JAN</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.retailAccountDetails.map(
                    (account) => {
                      // Get the year from the account's opening date or last payment date (you can modify this based on your actual requirements)
                      const yearOpened = new Date(
                        account.dateOpened
                      ).getFullYear();
                      const yearClosed = account.dateClosed
                        ? new Date(account.dateClosed).getFullYear()
                        : null;

                      // Get the history months (we are assuming the history is in descending order with the most recent month at the top)
                      const historyMonths = account.history48Months;

                      return (
                        <tr key={account.seq}>
                          <td>{yearOpened}</td>
                          {[
                            "12",
                            "11",
                            "10",
                            "09",
                            "08",
                            "07",
                            "06",
                            "05",
                            "04",
                            "03",
                            "02",
                            "01",
                          ].map((month) => {
                            const monthHistory = historyMonths.find(
                              (entry) => entry.key.substring(0, 2) === month
                            );
                            const overdueAmount =
                              monthHistory?.paymentStatus === "000"
                                ? "000"
                                : "000"; // Add logic for overdue amounts based on status
                            return <td key={month}>{overdueAmount}</td>;
                          })}
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div> */}
<div className="row my-3">
  <div className="col-12">
    <div className="section-title">DAYS PAST DUE</div>
    <table className="table table-bordered" style={{ width: "100%", tableLayout: "fixed" }}>
      <tbody>
        <tr>
          <th colSpan={13} style={{ backgroundColor: "yellow" }}>
            PAYMENT STATUS (BY MONTH)
          </th>
        </tr>
        <tr>
          <th>Year</th>
          <th>DEC</th>
          <th>NOV</th>
          <th>OCT</th>
          <th>SEP</th>
          <th>AUG</th>
          <th>JUL</th>
          <th>JUN</th>
          <th>MAY</th>
          <th>APR</th>
          <th>MAR</th>
          <th>FEB</th>
          <th>JAN</th>
        </tr>
        {/* Grouping by year */}
        {Object.entries(
          loanData?.history48Months.reduce((acc, curr) => {
            const year = `20${curr.key.split("-")[1]}`; // Extract year from key
            if (!acc[year]) acc[year] = [];
            acc[year].push(curr);
            return acc;
          }, {})
        ).map(([year, months]) => (
          <tr key={year}>
            <td>{year}</td>
            {[ "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01" ].map((month) => {
              const monthHistory = months.find((entry) => entry.key.substring(0, 2) === month);
              const paymentStatus = monthHistory?.paymentStatus || "";

              const isPaidMonth = monthHistory?.paymentStatus === "000";
              const tdStyle = isPaidMonth ? { backgroundColor: "#e0f8e0" } : {};

              return (
                <td key={month} style={tdStyle}>
                  {paymentStatus}
                </td>
              );


              // const isPaidMonth = paymentStatus === "000"; // Check if status is "000"
              // const tdStyle = isPaidMonth ? { backgroundColor: "#e0f8e0" } : {};

              // return (
              //   <td key={month} style={tdStyle}>
              //     {isPaidMonth ? paymentStatus : ""}
              //   </td>
              // );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>



{/* start my content */}

{/* <table
      className="table table-bordered"
      style={{ width: "100%", tableLayout: "fixed" }}
    >
     <tbody>
        <tr>
          <th colSpan={13} style={{ backgroundColor: "yellow" }}>
            PAYMENT STATUS (BY MONTH)
          </th>
        </tr>
        <tr>
          <th>Year</th>
          <th>DEC</th>
          <th>NOV</th>
          <th>OCT</th>
          <th>SEP</th>
          <th>AUG</th>
          <th>JUL</th>
          <th>JUN</th>
          <th>MAY</th>
          <th>APR</th>
          <th>MAR</th>
          <th>FEB</th>
          <th>JAN</th>
        </tr>
        {loanData?.history48Months?.map((monthData) => {
          const year = `20${monthData.key.split("-")[1]}`; // Extract year from "MM-YY"
          return (
            <tr key={monthData.key}>
              <td>{year}</td>
              {[
                "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01",
              ].map((month) => {
                const monthHistory = loanData.history48Months.find(
                  (entry) => entry.key.substring(0, 2) === month
                );
                const isPaidMonth = monthHistory?.paymentStatus === "000";
                const paymentStatus = monthHistory?.paymentStatus || "";

                const tdStyle = isPaidMonth ? { backgroundColor: "#e0f8e0" } : {};

                return (
                  <td key={month} style={tdStyle}>
                    {paymentStatus}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table> */}


{/* working code below */}
{/* <div className="row my-3">
  <div className="col-12">
    <div className="section-title">DAYS PAST DUE</div>
    <table className="table table-bordered text-center">
      <thead>
        <tr>
          <th>Year</th>
          <th>DEC</th>
          <th>NOV</th>
          <th>OCT</th>
          <th>SEP</th>
          <th>AUG</th>
          <th>JUL</th>
          <th>JUN</th>
          <th>MAY</th>
          <th>APR</th>
          <th>MAR</th>
          <th>FEB</th>
          <th>JAN</th>
        </tr>
      </thead>
      <tbody>
        {data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.retailAccountDetails.map((account) => {
          // Extract history months data
          const historyMonths = account.history48Months;

          return (
            <tr key={account.seq}>
              <td>20{historyMonths?.[0]?.key?.substring(3)}</td>

              {[
                "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01",
              ].map((month) => {
                // Find month data based on the "MM" format in "key"
                const monthHistory = historyMonths.find(
                  (entry) => entry.key.substring(0, 2) === month
                );

                // Determine if the payment status is "000" (paid) and apply the background color
                const isPaidMonth = monthHistory?.paymentStatus === "000";
                const paymentStatus = monthHistory?.paymentStatus || "";

                // Conditional background color for paid months
                const tdStyle = isPaidMonth ? { backgroundColor: "#e0f8e0" } : {};

                return (
                  <td key={month} style={tdStyle}>
                    {paymentStatus}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>  */}



          {/* end my content */}
        </div>
      </div>
    </>
  );
};

export default Loan;
