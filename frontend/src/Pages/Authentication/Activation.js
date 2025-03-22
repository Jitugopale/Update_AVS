import React, { useState } from "react";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

const Activation = () => {
  const [selectedBank, setSelectedBank] = useState(null);
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

  // Ensure selected bank appears at the top
  const sortedBanks = selectedBank
    ? [selectedBank, ...bankData.filter((b) => b.id !== selectedBank.id)]
    : bankData;

  return (
    <>
    <div className="container mt-5">
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
    options={topThreeBanks}
    value={selectedBank ? { value: selectedBank.id, label: selectedBank.label } : null}
    onChange={handleBankSelect}
    placeholder="Search and select a bank..."
    isSearchable
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
