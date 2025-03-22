import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form, Spinner  } from "react-bootstrap";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx"; // Import xlsx library


const ApiCredits = () => {
  const [transactions, setTransactions] = useState([]); // Stores API data
  const [totalRecords, setTotalRecords] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showTable, setShowTable] = useState(false);
  const [fromDate, setFromDate] = useState("");  // Start Date
  const [toDate, setToDate] = useState("");      // End Date
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchDate, setSearchDate] = useState("");
  const [allTransactions, setAllTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false); // ⬅️ Loading state
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [hideTable, setTable] = useState(false); // Control table visibility


  
  const [columns, setColumns] = useState([
    { dataField: "srNo", text: "SR No.", hidden: false },
    { dataField: "date", text: "Date", hidden: false },
    { dataField: "raisedRate", text: "Raised Rate", hidden: false },
    { dataField: "raiseAmt", text: "Raise Amt", hidden: false },
    { dataField: "balance", text: "Balance", hidden: false },
  ]);
  const handleToggleColumn = (field) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.dataField === field ? { ...col, hidden: !col.hidden } : col
      )
    );
  };
    
  const products = [
    { id: 1, name: "Aadhaar", rate: 2 },
    { id: 2, name: "Pancard", rate: 1.25 },
    { id: 3, name: "Pan Detail", rate: 2 },
    { id: 4, name: "GST", rate: 1.2 },
    { id: 5, name: "Voter ID", rate: 1.5 },
    { id: 6, name: "Udhayam Aadhaar", rate: 1.5 },
    { id: 7, name: "Passport", rate: 1.7 },
    { id: 8, name: "Credit", rate: 55 },
  ];
  // **🔹 Function to Fetch Data from API (Simulated)**
  const fetchTransactionsFromAPI = async (startIndex, endIndex) => {
    setLoading(true); // ⬅️ Show loading bar

    try {
      // Simulating API Call - Replace with actual API request
      const apiData = [
        { id: 1, srNo: 1, date: "2024-03-01", raisedRate: "2.50", raiseAmt: "50.00", balance: "500.00" },
        { id: 2, srNo: 2, date: "2024-03-02", raisedRate: "3.10", raiseAmt: "45.20", balance: "480.00" },
        { id: 3, srNo: 3, date: "2024-03-03", raisedRate: "1.75", raiseAmt: "20.30", balance: "460.00" },
        { id: 4, srNo: 4, date: "2025-03-04", raisedRate: "4.20", raiseAmt: "30.00", balance: "430.00" },
        { id: 5, srNo: 5, date: "2024-03-05", raisedRate: "5.00", raiseAmt: "60.00", balance: "370.00" },
        { id: 6, srNo: 6, date: "2024-03-06", raisedRate: "2.30", raiseAmt: "25.00", balance: "345.00" },
        { id: 7, srNo: 7, date: "2025-03-07", raisedRate: "3.80", raiseAmt: "40.50", balance: "305.00" },
        { id: 8, srNo: 8, date: "2024-03-08", raisedRate: "1.90", raiseAmt: "15.00", balance: "290.00" },
        { id: 9, srNo: 9, date: "2024-03-09", raisedRate: "2.75", raiseAmt: "35.00", balance: "255.00" },
        { id: 10, srNo: 10, date: "2024-03-10", raisedRate: "3.50", raiseAmt: "45.00", balance: "210.00" },
        { id: 11, srNo: 11, date: "2024-03-11", raisedRate: "4.00", raiseAmt: "50.00", balance: "160.00" },
        { id: 12, srNo: 12, date: "2024-03-12", raisedRate: "2.60", raiseAmt: "22.00", balance: "138.00" },
        { id: 13, srNo: 13, date: "2024-03-13", raisedRate: "3.10", raiseAmt: "33.00", balance: "105.00" },
        { id: 14, srNo: 14, date: "2024-03-14", raisedRate: "4.20", raiseAmt: "44.00", balance: "61.00" },
        { id: 15, srNo: 15, date: "2024-03-15", raisedRate: "2.90", raiseAmt: "20.00", balance: "41.00" },
        { id: 16, srNo: 16, date: "2024-03-16", raisedRate: "5.50", raiseAmt: "60.00", balance: "20.00" },
        { id: 17, srNo: 17, date: "2024-03-17", raisedRate: "1.80", raiseAmt: "10.00", balance: "10.00" },
        { id: 18, srNo: 18, date: "2024-03-18", raisedRate: "3.70", raiseAmt: "39.00", balance: "0.00" },
        { id: 19, srNo: 19, date: "2024-03-19", raisedRate: "2.20", raiseAmt: "18.00", balance: "-18.00" },
        { id: 20, srNo: 20, date: "2024-03-20", raisedRate: "4.00", raiseAmt: "42.00", balance: "-60.00" },
        { id: 21, srNo: 21, date: "2024-03-21", raisedRate: "2.50", raiseAmt: "25.00", balance: "-85.00" },
        { id: 22, srNo: 22, date: "2024-03-22", raisedRate: "3.20", raiseAmt: "32.00", balance: "-117.00" },
        { id: 23, srNo: 23, date: "2024-03-23", raisedRate: "4.60", raiseAmt: "46.00", balance: "-163.00" },
        { id: 24, srNo: 24, date: "2024-03-24", raisedRate: "1.75", raiseAmt: "19.00", balance: "-182.00" },
        { id: 25, srNo: 25, date: "2024-03-25", raisedRate: "5.00", raiseAmt: "50.00", balance: "-232.00" }
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
    },1000);
  };
  // Filter transactions based on date range
  const today = new Date().toISOString().split("T")[0]; // Get today's date

  
  // Filter transactions based on selected dates
  const filteredTransactions = transactions.filter((t) => {
    if (!fromDate) return true; // If no start date, show all
    if (!toDate) return t.date >= fromDate; // If only fromDate, show all records after it
    return t.date >= fromDate && t.date <= toDate; // If both, filter between range
  });
  


  // **🔹 Fetch Initial Data**
  useEffect(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    fetchTransactionsFromAPI(startIndex, endIndex);
  }, [currentPage, recordsPerPage]);

  const handleRefresh = () => {
    setCurrentPage(1); // Reset to first page
    setRefresh(prev => !prev); // Trigger re-fetch
  };
  
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Transaction Data", 20, 10);
    doc.autoTable({
      head: [["SR No.", "Date", "Raised Rate", "Raise Amt", "Balance"]],
      body: allTransactions.map((t) => [
        t.srNo,
        t.date,
        t.raisedRate,
        t.raiseAmt,
        t.balance
      ]),
    });
    doc.save("transactions.pdf");
  };
  
  // ✅ **Export as Excel**
  const handleExportExcel = () => {
    const excelData = allTransactions.map((t) => ({
      "SR No.": t.srNo,
      "Date": t.date,
      "Raised Rate": t.raisedRate,
      "Raise Amt": t.raiseAmt,
      "Balance": t.balance,
    }));
  
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "transactions.xlsx");
  };

  const handleDownload = (e) => {
    const value = e.target.value;
    if (value === "PDF") {
      handleExportPDF();
    } else if (value === "EXCEL") {
      handleExportExcel();
    }
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
    boxSizing: "border-box",
    maxWidth:'200px'
  };
  

  return (
    <div className="container mt-4">
      <div class="container mt-5">
  <h2>API Credits</h2>
  <div class="card">
    <div class="card-header">
    <div className="container">
  <div className="row d-flex justify-content-between align-items-center">
    
    {/* Available Balance - Left */}
    <div className="col-6">
      <h6>Available Balance: 1000</h6>
    </div>

    {/* Button - Right-aligned on larger screens */}
    <div className="col-6 text-end">
      <Button variant="primary" onClick={() => setShowPopup(true)}>
        View Costing
      </Button>
    </div>

  </div>

  {/* Modal for Costing */}
  <Modal show={showPopup} onHide={() => setShowPopup(false)}>
    <Modal.Header closeButton>
      <Modal.Title>API & Costing</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Product</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.rate}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowPopup(false)}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
</div>

    </div>
    <div class="card-body">
    <form >
          <div className="mb-3">
            <label style={{fontSize:'15px',fontWeight:'600'}}>Amount : &nbsp;</label>
        <input
          type="text"
          placeholder="Enter Amount"
          id="pannumber"
          style={inputStyle}
        />
           <span>
           <button className="btn btn-success" type="submit" style={{marginLeft:'5px'}}>Raise Amount</button>
          </span>
          </div>
       
       
        
        </form>
    </div>
  </div>
</div>
   
      <div className="container">
      <h2>Transactions History</h2>
        <div className="card">
          <div className="card-header">
            <div className="row d-flex align-items-center">
            <div className="col-3">
             Your transaction
           </div>
            {/* <div className="col-2 offset-5">
            <box-icon name='chevron-down'></box-icon>
           </div> */}
            <div className="col-2 offset-7" style={{textAlign:'end'}}>
            <box-icon name='chevron-down' onClick={() => setShowTable(!showTable)}></box-icon>
           </div>

            </div>
         
          </div>
          <div className="card-body">
 
            
     {/* Modal for Costing */}
     {showTable && (
          <div className="card-body">
            {/* Search Bar */}
            <div className="container">
            <div className="row mb-3" style={{marginTop:'14px'}}>
  <div className="col-12 col-md-1" style={{width:'100px', marginTop:'13px'}}>
    <p style={{color:'black'}}>From Date</p>
  </div>
  <div className="col-12 col-md-2">
    <input
      type="date"
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
      placeholder="Start Date"
    />
  </div>

  <div className="col-12 col-md-1 mt-md-0">
    <p  style={{marginTop:'13px',color:'black'}}>To Date</p>
  </div>
  <div className="col-12 col-md-2">
    <input
      type="date"
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
      placeholder="End Date"
    />
  </div>
  <div className="col-12 col-md-2">
  {showTable && (
      
      <div>
        <Form.Select onChange={(e) => {
         if (e.target.value === "PDF") {
           handleExportPDF();
         } else if (e.target.value === "Excel") {
           handleExportExcel();
         }
       }}>
         <option value="">Export</option>
         <option value="PDF">PDF</option>
         <option value="Excel">Excel</option>
       </Form.Select>
      </div>
 )}
  </div>
  <div className="col-12 col-md-3">
  <div id="toolbar">
  <button id="refresh" className="btn btn-secondary"onClick={handleRefresh}>
  <i className="bx bx-refresh"></i>
</button>
        {/* <button id="fullscreen" class="btn btn-secondary">
        <i class="bx bx-toggle-left"></i>  
        </button> */}
      
      <button style={{marginLeft:'5px'}}
  id="toggle-view"
  className="btn btn-secondary"
  onClick={() => setShowColumnMenu(!showColumnMenu)} // Toggle visibility
>
  <i className="bx bx-list-ul"></i>
</button>


{/* Dropdown Menu for Column Selection */}
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



{/* <button
        id="download"
        className="btn btn-secondary"
        onClick={() => setShowTable(!showTable)} // Toggle visibility of the export options
      > */}
        <select onChange={handleDownload} style={{ marginLeft: "5px", cursor: "pointer",backgroundColor:'#6B7177', color:'white',fontWeight:'500', height:'35px'}}>
          <option value="" style={{color:'white', fontWeight:'500'}}>Export</option>
          <option value="PDF" style={{color:'white',fontWeight:'500'}}>PDF</option>
          <option value="EXCEL" style={{color:'white',fontWeight:'500'}}>EXCEL</option>
        </select>

     
    </div>
  </div>
</div>
              {/* <div className="row">
                  <div className="col-6">
                  <Form.Group className="mb-3">
              <Form.Label>From Date:</Form.Label>
              <Form.Control
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Form.Group>
                  </div>
                  <div className="col-6">
                  <Form.Group className="mb-3">
              <Form.Label>To Date:</Form.Label>
              <Form.Control
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </Form.Group>
                  </div>
              </div> */}
            </div>
            

            {!loading ? (
  <> {/* Wrap with Fragment to avoid extra div */}
    {/* Table Section */}
    <Table striped bordered className="mt-3"  
    >
      <thead>
        {/* <tr>
          <th>SR No.</th>
          <th>Date</th>
          <th>Raised Rate</th>
          <th>Raise Amt</th>
          <th>Balance</th>
        </tr> */}
        <tr>
      {columns.map((col) =>
        !col.hidden ? <th key={col.dataField}>{col.text}</th> : null
      )}
    </tr>
      </thead>
      {/* <tbody>
               {filteredTransactions || transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.srNo}</td>
              <td>{t.date}</td>
              <td>{t.raisedRate}</td>
              <td>{t.raiseAmt}</td>
              <td>{t.balance}</td>
            </tr>
          ))}
              </tbody> */}
     <tbody>
  {(filteredTransactions.length > 0 ? filteredTransactions : transactions).map((t) => (
    <tr key={t.id}>
      {columns.map((col) =>
        !col.hidden ? <td key={col.dataField}>{t[col.dataField]}</td> : null
      )}
    </tr>
  ))}
</tbody>

    </Table>
  </>
) : (
  <div className="text-center mt-3">
    <Spinner animation="border" />
    <p>Loading data...</p>
  </div>
)}


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
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>Previous</Button>
        <span>Page {currentPage} of {Math.ceil(totalRecords / recordsPerPage)}</span>
        <Button disabled={currentPage * recordsPerPage >= totalRecords} onClick={() => setCurrentPage((prev) => prev + 1)}>Next</Button>
      </div>
                </div>
              </div>
            </div>

          

            {/* Records Per Page Selector */}
        
          </div>
        )}
          </div>
          
        </div>
      </div>

  
    </div>
    
  );
};

export default ApiCredits;