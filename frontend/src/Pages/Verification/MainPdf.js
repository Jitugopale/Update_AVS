import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";


const MainPdf = ({ data, enquiryId }) => {
  // Fetch the verified users from the backend
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
  return (
    <>
      <div className="container border p-5" >
      <div className="row my-3 p-4">
          <div className="col-12">
            <h1 className="text-primary text-center">CIBIL Combo Report</h1>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-4" id="firstheader">
            <table className="table table-borderless">
              <tbody style={{lineHeight:'10px'}}>
                <tr>
                  <th>Consumer Name</th>
                  <td style={{paddingLeft:'4px'}}>
                    {
                      data?.responseData.data?.[0]?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.personalInfo?.name?.firstName
                    }
                  </td>
                </tr>
                <tr>
                  <th>Enquiry ID</th>
                  <td style={{paddingLeft:'4px'}}>{enquiryId}</td>
                </tr>
                <tr>
                  <th>Member Reference No</th>
                  <td style={{paddingLeft:'4px'}}>{data?.verifiedData?.reference_id}</td>
                </tr>
                {/* <tr>
                  <th>Branch ID</th>
                  <td />
                </tr> */}
              </tbody>
            </table>
          </div>
          <div className="col-md-4 offset-md-4">
            <table
              className="table table-borderless"
              style={{ borderWidth: "0.5px" }}
            >
              <tbody style={{lineHeight:'10px'}}>
                
                
                <tr>
                  <th>Date</th>
                  <td style={{ paddingLeft: '4px' }}>{data?.formattedDate}</td>

                </tr>
                <tr>
                  <th>Time</th>
                  <td><td style={{ paddingLeft: '4px' }}>{data?.formattedTime}</td></td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div
              className="alert alert-dark text-white fw-bold"
              style={{ padding: "5px", backgroundColor: "#33a7c9" }}
              role="alert"
            >
              <strong style={{ fontSize: "18px" }}>SEARCH INFORMATION</strong>
            </div>
            {/* Add the table-bordered class for borders */}
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>
                    {
                      data?.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.personalInfo?.name?.firstName
                    }
                  </td>
                  <th>PAN</th>
                  <td>
                    {
                      data?.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.identityInfo?.pANId?.[0]?.idNumber
                    }
                  </td>
                </tr>
                <tr>
                  <th>KEY PERSON NAME</th>
                  <td>
                    {
                      data?.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.personalInfo?.name?.middleName
                    }{" "}
                    {
                      data?.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.personalInfo?.name?.lastName
                    }
                  </td>
                  <th>UID</th>
                  <td>XXXXXXXXXXXX</td>
                </tr>
                <tr>
                  <th>DOB</th>
                  <td>
                    {
                      data?.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.personalInfo?.dateOfBirth
                    }
                  </td>
                  <th>Mobile</th>
                  <td>
                    {
                      data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.phoneInfo?.find(
                        (phone) => phone.typeCode === "M"
                      )?.number
                    }
                  </td>
                </tr>
                <tr>
                  <th>Gender</th>
                  <td>
                    {
                      data?.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.personalInfo?.gender
                    }
                  </td>
                </tr>
                <tr>
                  <th>Current Address</th>
                  <td colSpan={3}>
                    {
                      data?.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.addressInfo?.[0]?.address
                    }
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              className="alert alert-dark text-white fw-bold"
              style={{ padding: "5px", backgroundColor: "#33a7c9" }}
              role="alert"
            >
              <strong style={{ fontSize: "18px" }}>CONSUMER INFORMATION</strong>
            </div>
            {/* Add the table-bordered class for borders */}
            <table className="table table-bordered">
              <tbody>
                <tr className="bg-secondary">
                  <th
                    className="card-header"
                    colSpan={2}
                    style={{ backgroundColor: "#f5f52a" }}
                  >
                    Borrower Details
                  </th>
                  <th
                    className="card-header"
                    colSpan={2}
                    style={{ backgroundColor: "#f5f52a" }}
                  >
                    Identification
                  </th>
                  <th
                    className="card-header"
                    colSpan={2}
                    style={{ backgroundColor: "#f5f52a" }}
                  >
                    Telephone Details
                  </th>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>
                    {
                      data?.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.personalInfo?.name?.fullName
                    }
                  </td>
                  <th>PAN</th>
                  <td>
                    {
                      data?.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.identityInfo?.pANId?.[0]?.idNumber
                    }
                  </td>
                  <th>Home</th>
                  <td>
                    {
                      data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.phoneInfo?.find(
                        (phone) => phone.typeCode === "H"
                      )?.number
                    }
                  </td>
                </tr>
                <tr>
                  <th>DOB</th>
                  <td>
                    {
                      data?.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.personalInfo?.dateOfBirth
                    }
                  </td>
                  <th>UID</th>
                  <td>
                  XXXXXXXXXXXX
                  </td>
                  <th>Mobile</th>
                  <td>
                    {
                      data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo?.phoneInfo?.find(
                        (phone) => phone.typeCode === "M"
                      )?.number
                    }
                  </td>
                </tr>
                <tr>
                  <th>Gender</th>
                  <td>
                    {
                      data?.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.personalInfo?.gender
                    }
                  </td>
                  <th></th>
                  <td></td>
                  <th></th>
                  <td></td>
                </tr>
                <tr>
                  <th />
                  <td />
                  <th></th>
                  <td></td>
                  <th></th>
                  <td>
                    {
                      data?.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.personalInfo?.email
                    }
                  </td>
                </tr>
                <tr>
                  <th>Address</th>
                  <td colSpan={3}>
                    {
                      data?.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.addressInfo?.[0]?.address
                    }
                  </td>
                  <th>Date Reported</th>
                  <td>
                    {
                      data?.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.addressInfo?.[0]?.reportedDate
                    }
                  </td>
                </tr>
                <tr>
                  <th>Category</th>
                  <td colSpan={3}>Current Address</td>
                  <td />
                  <td />
                </tr>
                <tr>
                  <th>Address</th>
                  <td colSpan={3}>
                    {
                      data?.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.addressInfo?.[1]?.address
                    }
                  </td>
                  <th>Date Reported</th>
                  <td>
                    {
                      data?.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData?.iDAndContactInfo
                        ?.addressInfo?.[1]?.reportedDate
                    }
                  </td>
                </tr>
                <tr>
                  <th>Category</th>
                  <td colSpan={3}>Permanent Address</td>
                  <td />
                  <td />
                </tr>
              </tbody>
            </table>
            <div
              className="alert alert-dark text-white fw-bold"
              style={{ padding: "5px", backgroundColor: "#33a7c9" }}
              role="alert"
            >
              <strong style={{ fontSize: "18px" }}>
                CREDIT REPORT SUMMARY
              </strong>
            </div>
            {/* Table with 13 Columns */}
            <table className="table table-bordered" style={{ fontSize: "85%" }}>
              {/* Table Header */}
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#f5f52a" }}>
                    Name of MFI Instruction
                  </th>
                  <th style={{ backgroundColor: "#f5f52a" }}>
                    Recent Date Reported
                  </th>
                  <th style={{ backgroundColor: "#f5f52a" }}>
                    Oldest Date Reported
                  </th>
                  <th style={{ backgroundColor: "#f5f52a" }}>Total Account</th>
                  <th style={{ backgroundColor: "#f5f52a" }}>Live Account</th>
                  <th style={{ backgroundColor: "#f5f52a" }}>Closed Account</th>
                  <th style={{ backgroundColor: "#f5f52a" }}>
                    Overdue Account
                  </th>
                  <th style={{ backgroundColor: "#f5f52a" }}>
                    Written off Account
                  </th>
                  <th style={{ backgroundColor: "#f5f52a" }}>
                    Total Sanctioned Amount
                  </th>
                  <th style={{ backgroundColor: "#f5f52a" }}>
                    Total Current Balance
                  </th>
                  <th style={{ backgroundColor: "#f5f52a" }}>
                    Total Overdue Amount
                  </th>
                  <th style={{ backgroundColor: "#f5f52a" }}>
                    Total Installment Amount
                  </th>
                  <th style={{ backgroundColor: "#f5f52a" }}>
                    Total Written Off Amount
                  </th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.retailAccountDetails.map(
                  (account, index) => (
                    <tr key={index}>
                      <td>{account.institution}</td>
                      <td>{account.dateReported}</td>
                      <td>{account.dateOpened}</td>
                      <td>
                        {/* {
                          data?.verifiedData?.data?.cCRResponse
                            ?.cIRReportDataLst?.[0]?.cIRReportData
                            ?.retailAccountDetails.length
                        } */}
                        {(account.open === "Yes" ? 1 : 0) +
                          (account.open === "No" ? 1 : 0) +
                          (account.pastDueAmount > 0
                            ? Number(account.loanAmount) || 0
                            : 0) +
                          (account.accountStatus === "Written Off"
                            ? Number(account.loanAmount) || 0
                            : 0)}
                      </td>
                      <td>{account.open === "Yes" ? 1 : 0}</td>
                      <td>{account.open === "No" ? 1 : 0}</td>
                      <td>{account.pastDueAmount > 0 ? 1 : 0}</td>
                      <td>{account.accountStatus === "Written Off" ? 1 : 0}</td>
                      <td>
                        {parseInt(account.sanctionAmount || 0).toLocaleString()}
                      </td>
                      <td>{parseInt(account.balance || 0).toLocaleString()}</td>
                      <td>
                        {parseInt(account.pastDueAmount || 0).toLocaleString()}
                      </td>
                      <td>
                        {parseInt(
                          account.installmentAmount || 0
                        ).toLocaleString()}
                      </td>
                      <td />
                    </tr>
                  )
                )}
                {/* Total Row */}
                <tr>
                  <td className="text-end">
                    <strong>Total</strong>
                  </td>
                  <td />
                  <td />
                  <td>
                    {
                      data?.verifiedData?.data?.cCRResponse
                        ?.cIRReportDataLst?.[0]?.cIRReportData
                        ?.retailAccountDetails.length
                    }
                  </td>
                  <td>
                    {
                      data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.retailAccountDetails.filter(
                        (acc) => acc.open === "Yes"
                      ).length
                    }
                  </td>
                  <td>
                    {
                      data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.retailAccountDetails.filter(
                        (acc) => acc.open === "No"
                      ).length
                    }
                  </td>
                  <td>
                    {
                      data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.retailAccountDetails.filter(
                        (acc) => acc.pastDueAmount > 0
                      ).length
                    }
                  </td>
                  <td>
                    {
                      data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.retailAccountDetails.filter(
                        (acc) => acc.accountStatus === "Written Off"
                      ).length
                    }
                  </td>
                  <td>
                    {data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.retailAccountDetails
                      .reduce(
                        (sum, acc) => sum + parseInt(acc.sanctionAmount || 0),
                        0
                      )
                      .toLocaleString()}
                  </td>
                  <td>
                    {data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.retailAccountDetails
                      .reduce((sum, acc) => sum + parseInt(acc.balance || 0), 0)
                      .toLocaleString()}
                  </td>
                  <td>
                    {data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.retailAccountDetails
                      .reduce(
                        (sum, acc) => sum + parseInt(acc.pastDueAmount || 0),
                        0
                      )
                      .toLocaleString()}
                  </td>
                  <td>
                    {data?.verifiedData?.data?.cCRResponse?.cIRReportDataLst?.[0]?.cIRReportData?.retailAccountDetails
                      .reduce(
                        (sum, acc) =>
                          sum + parseInt(acc.installmentAmount || 0),
                        0
                      )
                      .toLocaleString()}
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>

            <small>
              *Ammount , Balance and Written-off status are only for live
              accounts
            </small>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPdf;
