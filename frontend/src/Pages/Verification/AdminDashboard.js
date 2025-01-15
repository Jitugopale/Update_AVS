import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [banks, setBanks] = useState([]);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBankCredit, setSelectedBankCredit] = useState(null);
  const [selectedBankPro, setSelectedBankPro] = useState(null);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/auth/getallbank",
          {
            headers: {
              "auth-token": token,
            },
          }
        );

        if (response.data) {
          const filteredBanks = response.data.filter(
            (bank) => bank.role === "user"
          );
          setBanks(filteredBanks);
        } else {
          setError("No banks found.");
        }
      } catch (err) {
        console.error("Error fetching banks:", err);
        setError("An error occurred while fetching banks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  const handleProClick = (bankId) => {
    setSelectedBankPro(bankId);
    setSelectedBankCredit(null);
  };

  const handleCreditClick = (bankId) => {
    setSelectedBankCredit(bankId);
    setSelectedBankPro(null);

    // Filter credits dynamically from the banks list
    const filteredCredits = banks
      .filter((bank) => bank._id === bankId)
      .map((bank) => ({
        bankName: bank.bankName,
        email: bank.email,
        amount: bank.creditAmount, // Example: Assuming `creditAmount` is a field in the bank object
      }));

    setCredits(filteredCredits);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h2>Bank List</h2>
      <div
        style={{
          border: "1px solid black",
          padding: "10px",
          maxWidth: "1000px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {banks.map((bank, index) => (
          <div
            key={bank._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ccc",
            }}
          >
            <div>
              <strong>
                {index + 1}. {bank.bankName}
              </strong>
            </div>
            <div>
              <button
                style={{ marginRight: "10px" }}
                onClick={() => handleProClick(bank._id)}
              >
                Pro
              </button>
              <button onClick={() => handleCreditClick(bank._id)}>Credit</button>
            </div>
          </div>
        ))}
      </div>

      {selectedBankPro && (
  <div style={{ marginTop: "20px" }}>
    <h3>Products (After Clicking on Pro)</h3>
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        border: "1px solid black",
        textAlign: "left",
      }}
    >
      <thead>
        <tr style={{ border: "1px solid black" }}>
          <th style={{ border: "1px solid black", padding: "8px" }}>Sr No</th>
          <th style={{ border: "1px solid black", padding: "8px" }}>Products</th>
          <th style={{ border: "1px solid black", padding: "8px" }}>Rates</th>
        </tr>
      </thead>
      <tbody>
        {[
          { id: 1, name: "Aadhaar", rate: 2 },
          { id: 2, name: "Pancard", rate: 1.25 },
          { id: 3, name: "Pan Detail", rate: 2 },
          { id: 4, name: "GST", rate: 1.2 },
          { id: 5, name: "Voter ID", rate: 1.5 },
          { id: 6, name: "Udhayam Aadhaar", rate: 1.5 },
          { id: 7, name: "Passport", rate: 1.7 },
          { id: 8, name: "Credit", rate: 55 },
        ].map((product) => (
          <tr key={product.id} style={{ border: "1px solid black" }}>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {product.id}
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {product.name}
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {product.rate}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

{selectedBankCredit && (
  <div style={{ marginTop: "20px" }}>
    <h3>Credit (After Clicking on Credit)</h3>
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        border: "1px solid black",
        textAlign: "left",
      }}
    >
      <thead>
        <tr style={{ border: "1px solid black" }}>
          <th style={{ border: "1px solid black", padding: "8px" }}>Bank Name</th>
          <th style={{ border: "1px solid black", padding: "8px" }}>Email</th>
          <th style={{ border: "1px solid black", padding: "8px" }}>Amount</th>
          <th style={{ border: "1px solid black", padding: "8px" }}>Credit</th>
        </tr>
      </thead>
      <tbody>
        {credits.map((credit, index) => (
          <tr key={index} style={{ border: "1px solid black" }}>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {credit.bankName}
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              {credit.email}
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
            <input
                type="number"
                placeholder="Enter credit"
                value={credit.creditAmount || ''}
                onChange={(e) => {
                  // Update credit amount on change
                  const newCredits = [...credits];
                  newCredits[index].creditAmount = e.target.value;
                  setCredits(newCredits);
                }}
                style={{
                  width: "100px",
                  padding: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              <button
                style={{
                  backgroundColor: "yellow",
                  color: "red",
                  border: "1px solid black",
                  padding: "5px 10px",
                }}
              >
                Credit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    </div>
  );
};

export default AdminDashboard;
