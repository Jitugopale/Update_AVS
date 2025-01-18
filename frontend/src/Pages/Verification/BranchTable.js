import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';

const BranchTable = () => {
  const [branchData, setBranchData] = useState(null); // Initial state can be null or an empty object
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [users, setUsers] = useState([]); // State to store users list


  // Fetch the verified users from the backend
  useEffect(() => {
    const fetchVerifiedUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/branch/verified"
        );
        setVerifiedUsers(response.data); // Set the fetched data into the state
      } catch (error) {
        console.error("Error fetching verified users:", error);
      }
    };
    fetchVerifiedUsers();
  },[]);


  const handleDelete = async (branchName) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
  
    // If user clicks "Yes"
    if (isConfirmed) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/branch/delete/${branchName}`);
        
        if (response.data.message === "Branch deleted successfully.") {
          // If deletion is successful, update state by filtering out the deleted user
          setUsers((prevUsers) => prevUsers.filter((user) => user.branchName !== branchName));
          alert("Branch deleted successfully.");
        } else {
          alert("Failed to delete Branch.");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete Branch. Please try again.");
      }
    } else {
      // If user clicks "No", just return without deleting
      alert("Branch deletion canceled.");
    }
  };

  
  const handleEdit = async (branchName) => {
    try {
      // Fetch the branch details
      const response = await axios.put(`http://localhost:5000/api/branch/${branchName}`);
      
      if (response.data) {
        // Set the branch data in the state for editing purposes
        setBranchData(response.data); // Assuming you have a state called `branchData` to hold the details
  
        // Proceed with showing the confirmation dialog for editing
        const isConfirmed = window.confirm("Do you want to edit this branch?");
        
        if (isConfirmed) {
          // Example of handling the edit, replace with your update logic
          // E.g., open an edit modal with the branch data
          console.log("Editing branch:", response.data);
          // ...your edit logic here...
  
          // Optionally, update the state or UI after editing
          alert("Branch edited successfully.");
        } else {
          alert("Branch edit canceled.");
        }
      } else {
        alert("Branch not found.");
      }
    } catch (error) {
      console.error("Error fetching branch details:", error);
      alert("Failed to fetch branch details. Please try again.");
    }
  };
  
  return (
    <>
      <h3 style={{
                  marginTop:'120px',fontSize:'28px',color:'darkgoldenrod'
                }}>Branch Created</h3> 

      <div
        style={{
          maxHeight: "400px", // Set the desired maximum height for the table container
          overflowY: "auto", // Enable vertical scrolling
          border: "1px solid #ddd", // Optional: Add a border to the container
        }}
      >
        <table style={{width:"100%"}}>
          <thead>
            <tr>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                Sr No
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                BANK ID
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                BANK NAME
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                BRANCH NAME
              </th>
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                Date Created
              </th>
              {/* <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                Edit
              </th> */}
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  backgroundColor:'hsl(0, 22.60%, 93.90%)'
                }}
              >
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
          {verifiedUsers
              .map((user, index) => (
                <tr key={index} style={{ border: "1px solid #ddd" }}>
                                   {/* <td style={{ padding: "8px", border: "1px solid #ddd" }}>
          {index + 1}
        </td> */}

                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.srNo}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.bankId || "DOB not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.bankName || "Name not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.branchName || "DOB not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.formattedDate || "DOB not available"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    <button
                    onClick={() => handleDelete(user.branchName)}
                    title="Delete"
                    style={{
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                    >
                      <box-icon name="trash" type="solid"></box-icon>

                    </button>
                </td>
                  {/* <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    <button
                    onClick={() => handleEdit(user.branchName)}
                    title="Delete"
                    style={{
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                    >
                      <box-icon name="trash" type="solid"></box-icon>

                    </button>
                </td> */}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* <button
        onClick={() => {
          localStorage.clear(); // Clears all data from localStorage
          alert("All local storage data has been cleared!");
        }}
        style={{
          padding: "10px 20px",
          backgroundColor: "#FF6347", // Color for the button
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Clear All Data
      </button> */}
    </>
  );
};

export default BranchTable;
