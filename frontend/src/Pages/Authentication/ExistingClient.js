import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { Button, Modal, Form, Table, Spinner } from "react-bootstrap";
import "jspdf-autotable";
import * as XLSX from "xlsx"; // Import xlsx library

const ExistingClient = ({ existingType }) => {
    const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [transactions, setTransactions] = useState([]); // Stores API data
  const [totalRecords, setTotalRecords] = useState(0);
  const [allTransactions, setAllTransactions] = useState([]);
  const [fromDate, setFromDate] = useState(""); // Start Date
  const [showTable, setShowTable] = useState(false);
  const [toDate, setToDate] = useState(""); // End Date
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false); // ⬅️ Loading state
  const [showPopup, setShowPopup] = useState(false);
  const [searchClientName, setSearchClientName] = useState("");
  
  const [columns, setColumns] = useState([
    { dataField: "key", text: "Key", hidden: false },
    { dataField: "name", text: "ClientName", hidden: false },
    { dataField: "amount", text: "Amount", hidden: false },
    { dataField: "date", text: "Date", hidden: false },
  ]);

  // **🔹 Fetch Initial Data**
  useEffect(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    fetchTransactionsFromAPI(startIndex, endIndex);
  }, [currentPage, recordsPerPage]);

  const handleRefresh = () => {
    setCurrentPage(1); // Reset to first page
    setRefresh((prev) => !prev); // Trigger re-fetch
  };

  const handleToggleColumn = (field) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.dataField === field ? { ...col, hidden: !col.hidden } : col
      )
    );
  };

  const handleDownload = (e) => {
    const value = e.target.value;
    if (value === "PDF") {
      handleExportPDF();
    } else if (value === "EXCEL") {
      handleExportExcel();
    }
  };
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Transaction Data", 20, 10);
    doc.autoTable({
      head: [["Key", "CLientName", "Amount", "Date"]],
      body: allTransactions.map((t) => [t.key, t.name, t.amount, t.date]),
    });
    doc.save("transactions.pdf");
  };

//   const handleCredit = (transaction) => {
//     console.log("Credit requested for:", transaction);
//     alert(`Crediting ${transaction.name} with amount ${transaction.amount}`);
//   };
const handlePopup = () => {
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
  };


  const handleExportExcel = () => {
    const excelData = allTransactions.map((t) => ({
      Key: t.key,
      ClientName: t.name,
      Amount: t.amount,
      Date: t.date,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "transactions.xlsx");
  };

  const fetchTransactionsFromAPI = async (startIndex, endIndex) => {
    setLoading(true); // ⬅️ Show loading bar

    try {
      // Simulating API Call - Replace with actual API request
      const apiData = [
        { key: 1, name: "Client A", amount: 500, date: "2024-03-20" },
        { key: 2, name: "Client B", amount: 700, date: "2025-03-19" },
        { key: 3, name: "Client C", amount: 600, date: "2024-03-18" },
        { key: 4, name: "Client D", amount: 800, date: "2024-03-17" },
        { key: 5, name: "Client E", amount: 550, date: "2024-03-16" },
        { key: 6, name: "Client F", amount: 900, date: "2024-03-15" },
        { key: 7, name: "Client G", amount: 750, date: "2024-03-14" },
        { key: 8, name: "Client H", amount: 620, date: "2024-03-13" },
        { key: 9, name: "Client I", amount: 450, date: "2025-03-12" },
        { key: 10, name: "Client J", amount: 500, date: "2024-03-11" },
        { key: 11, name: "Rahul", amount: 850, date: "2024-03-10" },
        { key: 13, name: "Client M", amount: 730, date: "2024-03-08" },
        { key: 14, name: "Client N", amount: 590, date: "2024-03-07" },
        { key: 15, name: "Client O", amount: 670, date: "2024-03-06" },
        { key: 16, name: "Client P", amount: 700, date: "2024-03-05" },
        { key: 17, name: "Client Q", amount: 920, date: "2024-03-04" },
        { key: 18, name: "Client R", amount: 610, date: "2024-03-03" },
        { key: 19, name: "Client S", amount: 740, date: "2024-03-02" },
        { key: 20, name: "Client T", amount: 530, date: "2024-03-01" },
        { key: 21, name: "Client U", amount: 490, date: "2024-02-29" },
        { key: 22, name: "Client V", amount: 870, date: "2024-02-28" },
        { key: 23, name: "Client W", amount: 920, date: "2024-02-27" },
        { key: 24, name: "Client X", amount: 660, date: "2024-02-26" },
        { key: 25, name: "Client Y", amount: 580, date: "2024-02-25" },
        { key: 26, name: "Client Z", amount: 890, date: "2024-02-24" },
        { key: 27, name: "Client AA", amount: 730, date: "2024-02-23" },
      ];
      setAllTransactions(apiData); // Store full data

      const paginatedData = apiData.slice(startIndex, endIndex);
      setTransactions(paginatedData);
      setTotalRecords(apiData.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setTimeout(() => {
      setLoading(false); // ⬅️ Hide loading after 2 sec
    }, 1000);
  };

  const today = new Date().toISOString().split("T")[0]; // Get today's date

  const filteredTransactions = [...transactions]
  .filter((t) => {
    // Check if transaction falls within the selected date range
    const matchesDate =
      !fromDate || (t.date >= fromDate && (!toDate || t.date <= toDate));

    // Check if client name matches search input
    const matchesClient =
      !searchClientName ||
      t.name.toLowerCase().includes(searchClientName.toLowerCase());

    return matchesDate && matchesClient;
  })
  .sort((a, b) => {
    // Sort results so matching names appear at the top when searching
    const aMatch = a.name.toLowerCase().includes(searchClientName.toLowerCase());
    const bMatch = b.name.toLowerCase().includes(searchClientName.toLowerCase());
    return bMatch - aMatch; // Sort true (1) before false (0)
  });


  return (
    <>
      {existingType === "existing" && (
        <>
          <div className="container">
          <div className="row">
                <h1>Existing Client</h1>
            </div>
            <div className="row mb-3" style={{ marginTop: "14px" }}>
              <div
                className="col-12 col-md-1"
                style={{ width: "100px", marginTop: "13px" }}
              >
                <p style={{ color: "black" }}>From Date</p>
              </div>
              <div className="col-12 col-md-2">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-1 mt-md-0">
                <p style={{ marginTop: "13px", color: "black" }}>To Date</p>
              </div>
              <div className="col-12 col-md-2">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-1 mt-md-0">
              <p style={{ marginTop: "13px", color: "black", width:'94px' }}>ClientName</p>
              </div>
              <div className="col-12 col-md-2">
              <input
                type="text"
                placeholder="Search by Client Name"
                value={searchClientName}
                onChange={(e) => setSearchClientName(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-2">
                <div id="toolbar">
                  <button
                    id="refresh"
                    className="btn btn-secondary"
                    onClick={handleRefresh}
                  >
                    <i className="bx bx-refresh"></i>
                  </button>

                  <button
                    id="toggle-view"
                    className="btn btn-secondary"
                    style={{ marginLeft: "5px" }}
                    onClick={() => setShowColumnMenu(!showColumnMenu)}
                  >
                    <i className="bx bx-list-ul"></i>
                  </button>

                  {showColumnMenu && (
  <div className="dropdown-menu show">
    <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap", padding: "5px" }}>
      <input
        type="checkbox"
        checked={columns.every((col) => !col.hidden)}
        onChange={(e) =>
          setColumns(columns.map((col) => ({ ...col, hidden: !e.target.checked })))
        }
      />
      <span>Toggle All</span>
    </label>
    {columns.map((col) => (
      <label 
        key={col.dataField} 
        style={{ display: "inline-flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap", padding: "5px" }}
      >
        <input
          type="checkbox"
          checked={!col.hidden}
          onChange={() => handleToggleColumn(col.dataField)}
        />
        <span>{col.text}</span>
      </label>
    ))}
  </div>
)}

                  <select
                    onChange={handleDownload}
                    style={{
                      marginLeft: "5px",
                      cursor: "pointer",
                      backgroundColor: "#6B7177",
                      color: "white",
                      fontWeight: "500",
                      height: "35px",
                    }}
                  >
                    <option
                      value=""
                      style={{ color: "white", fontWeight: "500" }}
                    >
                      Export
                    </option>
                    <option
                      value="PDF"
                      style={{ color: "white", fontWeight: "500" }}
                    >
                      PDF
                    </option>
                    <option
                      value="EXCEL"
                      style={{ color: "white", fontWeight: "500" }}
                    >
                      EXCEL
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <Table striped bordered className="mt-3">
            <thead>
            <tr>
      {columns.map((col) =>
        !col.hidden ? <th key={col.dataField}>{col.text}</th> : null
      )}
      <th>Action</th> {/* ✅ Added "Action" column for the Credit button */}
    </tr>
            </thead>

            <tbody>
              {(filteredTransactions.length > 0
                ? filteredTransactions
                : transactions
              ).map((t) => (
                <tr key={t.key}>
                {columns.map((col) =>
                  !col.hidden ? <td key={col.dataField}>{t[col.dataField]}</td> : null
                )}
                <td>
                <Button variant="success" onClick={handlePopup}>Credit</Button>
                </td>
              </tr>
              ))}
            </tbody>

            <Modal show={showPopup} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>About Credit</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group>
                        <Form.Label>Client Name</Form.Label>
                        <Form.Control type="text" disabled value="Client A" />
                      </Form.Group>
                      <Form.Group className="mt-2">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="number" placeholder="Enter Amount" />
                      </Form.Group>
                      <Form.Group className="mt-2">
                        <Form.Label>Pay Mode</Form.Label>
                        <Form.Select>
                          <option>Online</option>
                          <option>Offline</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mt-2">
                        <Form.Label>Pay Type</Form.Label>
                        <Form.Select>
                          <option>RTGS</option>
                          <option>NEFT</option>
                          <option>IMPS</option>
                          <option>GPAY</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mt-2">
                        <Form.Label>Pay Status</Form.Label>
                        <Form.Select>
                          <option>Success</option>
                          <option>Fail</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mt-2">
                        <Form.Label>Transaction No</Form.Label>
                        <Form.Control type="text" placeholder="Enter Transaction Number" />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary">Add Amount</Button>
                  </Modal.Footer>
                </Modal>
          </Table>
          <div className="container">
            <div className="d-flex align-items-center">
              <div className="col-2">
                {/* Records Per Page Selector */}
                <Form.Group className="mt-2">
                  <Form.Label>Records per page:</Form.Label>
                  <Form.Control
                    as="select"
                    value={recordsPerPage}
                    onChange={(e) => {
                      setRecordsPerPage(Number(e.target.value));
                      setCurrentPage(1); // Reset to page 1
                    }}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-4 offset-6">
                {/* Pagination */}
                <div className="d-flex justify-content-between mt-3">
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {currentPage} of{" "}
                    {Math.ceil(totalRecords / recordsPerPage)}
                  </span>
                  <Button
                    disabled={currentPage * recordsPerPage >= totalRecords}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>

          
               
        </>
      )}
    </>
  );
};

export default ExistingClient;
