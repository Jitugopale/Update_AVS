import React, { useState } from "react";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

const Activation = () => {
  const [selectedBank, setSelectedBank] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
      const [dropdownSearch, setDropdownSearch] = useState(""); // Track search input
  const [bankData, setBankData] = useState([
    { id: "bank1", label: "Bank 1", active: false },
    { id: "bank2", label: "Bank 2", active: false },
    { id: "bank3", label: "Bank 3", active: false },
    { id: "bank4", label: "Bank 4", active: false },
    { id: "bank5", label: "Bank 5", active: false },
  ]);

  // Handle bank selection
  const handleBankSelect = (option) => {
    const selected = bankData.find((b) => b.id === option.value);
    setSelectedBank(selected);
    setSearchQuery(selected.label); // Set search query to highlight selected bank in table
  };

  // Toggle activation status
  const handleToggle = (id) => {
    setBankData((prevBanks) =>
      prevBanks.map((bank) =>
        bank.id === id ? { ...bank, active: !bank.active } : bank
      )
    );
  };

    // Dropdown should show top 3 banks first, still searchable
    const topThreeBanks = bankData.slice(0, 3).map((bank) => ({
      value: bank.id,
      label: bank.label,
    }));


  
    const dropdownOptions = dropdownSearch
    ? bankData.map((bank) => ({ value: bank.id, label: bank.label })) // Show all when searching
    : bankData.slice(0, 3).map((bank) => ({ value: bank.id, label: bank.label })); // Show only top 3 by default
  
    // Filter and sort banks based on search query
    const filteredBanks = bankData.filter((bank) =>
      bank.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const sortedBanks = filteredBanks.sort((a, b) => {
      if (a.label.toLowerCase() === searchQuery.toLowerCase()) return -1;
      return 0;
    });

   

  return (
    <>
    <div className="container mt-3">
       <div className="card">
          <div className="card-header">
          <h3 className="mb-3">Activate/Deactivate</h3>
          </div>
          <div className="card-body">
          <div className="container mt-4">

{/* Search Bank Dropdown */}
<div className="mb-3">
  <label className="form-label">Search Bank</label>
    <Select
              options={dropdownOptions}
              value={selectedBank ? { value: selectedBank.id, label: selectedBank.label } : null}
              onChange={handleBankSelect}
              placeholder="Search and select a bank..."
              isSearchable
              onInputChange={(input) => setDropdownSearch(input)}
            />
</div>

{/* Bank Activation Table */}
<table className="table table-bordered">
  <thead className="table-dark">
    <tr>
      <th>Sr No</th>
      <th>Bank Name</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {sortedBanks.map((bank, index) => (
      <tr key={bank.id}>
        <td>{index + 1}</td>
        <td>{bank.label}</td>
        <td>
          <button
            className={`btn btn-sm ${bank.active ? "btn-danger" : "btn-success"}`}
            onClick={() => handleToggle(bank.id)}
          >
            {bank.active ? "Deactivate" : "Activate"}
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
</div>
          </div>
       </div>
    </div>
   
    </>
  );
};

export default Activation;
