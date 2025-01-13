import React, { useState } from "react";
import BranchTable from "./BranchTable";

const BranchCreate = () => {
  const [bankId, setBankId] = useState("");
  const [bankName, setBankName] = useState("");
  const [srNo, setSrNo] = useState("");
  const [branchName, setBranchName] = useState("");

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
      marginRight: "15px",
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
    width: "50%",
    boxSizing: "border-box",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const branchData = { bankId, bankName, srNo: parseInt(srNo), branchName };

    try {
      const response = await fetch(
        "http://localhost:5000/api/branch/newbranch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(branchData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Branch created successfully");
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert(`Server error: ${error.message}`);
    }
  };

  return (
    <>
      <div className="container">
        <div  className=" p-3" style={{ maxWidth: "1200px", width: "100%" }}>
          <h2 style={{color:'green'}} className="mb-3">Branch Master</h2>
          <form onSubmit={handleSubmit}>
          <div className="row ">
          <div className="col-12 col-md-3">
            <div className="form-group row">
              <label htmlFor="bankId" className="col-form-label text-md-right" style={{width:'75px',marginTop:"6px"}}>
                Bank ID:
              </label>
              <div className="col-md-8">
                <input
                  type="text"
                  value={bankId}
                  onChange={(e) => setBankId(e.target.value)}
                  placeholder="Enter Bank Id"
                  id="bankId"
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group row">
              <label htmlFor="bankName" className=" col-form-label text-md-right"  style={{width:'120px',marginTop:"6px"}}>
                Bank Name:
              </label>
              <div className="col-md-8">
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Enter Bank Name"
                  id="bankName"
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-3">
            <div className="form-group row">
              <label htmlFor="srNo" className=" col-form-label text-md-right"  style={{width:'75px',marginTop:"6px"}}>
                Sr No:
              </label>
              <div className="col-md-8">
                <input
                  type="text"
                  value={srNo}
                  onChange={(e) => setSrNo(e.target.value)}
                  placeholder="Enter Sr No."
                  id="srNo"
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group row">
              <label htmlFor="branchName" className=" col-form-label text-md-right"  style={{width:'120px',marginTop:"6px"}}>
                Branch Name:
              </label>
              <div className="col-md-8">
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="Enter Branch Name"
                  id="branchName"
                  className="form-control"
                />
              </div>
            </div>
          </div>
          </div>
            {/* <div style={{ marginBottom: '10px' }}>
          <label htmlFor="bankId" style={{ display: 'block', marginBottom: '5px' }}>Bank ID:</label>
          <input
            type="text"
            id="bankId"
            value={bankId}
            onChange={(e) => setBankId(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="bankName" style={{ display: 'block', marginBottom: '5px' }}>Bank Name:</label>
          <input
            type="text"
            id="bankName"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div> */}
            {/* <div style={{ marginBottom: '10px' }}>
          <label htmlFor="srNo" style={{ display: 'block', marginBottom: '5px' }}>Sr No:</label>
          <input
            type="text"
            id="srNo"
            value={srNo}
            onChange={(e) => setSrNo(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="branchName" style={{ display: 'block', marginBottom: '5px' }}>Branch Name:</label>
          <input
            type="text"
            id="branchName"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            placeholder="DESCRIPTION"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div> */}
            <div className="mt-2">
              <button
                type="submit"
                style={styles.button}              >
                Submit
              </button>
              <button
                type="reset"
                style={styles.button}
                onClick={() => {
                  setBankId("");
                  setBankName("");
                  setSrNo("");
                  setBranchName("");
                }}
              >
                Clear
              </button>
            </div>
          </form>
          {/* Existing table code remains unchanged */}
          {/* <table
            style={{
              width: "100%",
              marginTop: "20px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  SrNo
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Description
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Modify
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan="4"
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  No Record Found
                </td>
              </tr>
            </tbody>
          </table> */}
          <BranchTable/>
        </div>
      </div>
    </>
  );
};

export default BranchCreate;
