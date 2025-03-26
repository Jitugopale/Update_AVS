import React, { useState } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx"; // Import xlsx library


const ApiCredits = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [recordsToShow, setRecordsToShow] = useState(20);

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

  const transactions = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    raisedRate: (Math.random() * 10).toFixed(2),
    raiseAmt: (Math.random() * 100).toFixed(2),
    balance: (Math.random() * 500).toFixed(2),
  }));

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Transaction Data", 20, 10);
    doc.autoTable({
      head: [["Raised Rate", "Raise Amt", "Balance"]],
      body: transactions.slice(0, recordsToShow).map((t) => [
        t.raisedRate,
        t.raiseAmt,
        t.balance,
      ]),
    });
    doc.save("transactions.pdf");
  };

  const handleExportExcel = () => {
    const excelData = transactions.slice(0, recordsToShow).map((t) => ({
      "Raised Rate": t.raisedRate,
      "Raise Amt": t.raiseAmt,
      "Balance": t.balance,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "transactions.xlsx");
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
            
          {showTable && (
        <Table striped bordered className="mt-3">
          <thead>
            <tr>
              <th>Raised Rate</th>
              <th>Raise Amt</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, recordsToShow).map((t) => (
              <tr key={t.id}>
                <td>{t.raisedRate}</td>
                <td>{t.raiseAmt}</td>
                <td>{t.balance}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {showTable && (
        <Form.Group className="mt-2">
          <Form.Label>Records to show (min 10, max 50):</Form.Label>
          <Form.Control
            type="number"
            min="10"
            max="50"
            value={recordsToShow}
            onChange={(e) => setRecordsToShow(Math.min(50, Math.max(10, Number(e.target.value))))}
          />
        </Form.Group>
      )}
          </div>
          
        </div>
      </div>


      {/* <div class="container mt-5">
  <h2>Card Heading</h2>
  <div class="card">
    <div class="card-header">
    <div className="d-flex justify-content-between align-items-center mt-3">
        <Button variant="dark" onClick={() => setShowTable(!showTable)}>
          Your Transaction <box-icon name='chevron-down'></box-icon>
        </Button>
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
    </div>
    <div class="card-body">
         

    {showTable && (
        <Table striped bordered className="mt-3">
          <thead>
            <tr>
              <th>Raised Rate</th>
              <th>Raise Amt</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, recordsToShow).map((t) => (
              <tr key={t.id}>
                <td>{t.raisedRate}</td>
                <td>{t.raiseAmt}</td>
                <td>{t.balance}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {showTable && (
        <Form.Group className="mt-2">
          <Form.Label>Records to show (min 10, max 50):</Form.Label>
          <Form.Control
            type="number"
            min="10"
            max="50"
            value={recordsToShow}
            onChange={(e) => setRecordsToShow(Math.min(50, Math.max(10, Number(e.target.value))))}
          />
        </Form.Group>
      )}
    </div>
  </div>
</div> */}


  
    </div>
    
  );
};

export default ApiCredits;